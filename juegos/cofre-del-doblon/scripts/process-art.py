#!/usr/bin/env python3
"""Cofre del Doblón — procesado de arte (chroma key magenta + recorte + WebP).

Lee las hojas generadas en art-raw/, elimina el fondo magenta (#FF00FF) con
despill, recorta cada sprite por componentes conectados (los brillos cercanos
se fusionan con su objeto), y exporta WebP q82 + atlas JSON (Phaser 3 JSON
Hash) con ancla inferior-centro. Los fondos se reescalan a 780x1688.
Uso: python3 scripts/process-art.py
"""
import glob
import json
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "art-raw")
OUT = os.path.join(ROOT, "public", "assets")


def chroma_key(img: Image.Image) -> Image.Image:
    """Fondo (color de las esquinas) -> alpha, con feather y despill."""
    a = np.asarray(img.convert("RGB")).astype(np.int16)
    # color de fondo: mediana de las 4 esquinas (20x20 px)
    h, w, _ = a.shape
    corners = np.concatenate([
        a[:20, :20].reshape(-1, 3), a[:20, -20:].reshape(-1, 3),
        a[-20:, :20].reshape(-1, 3), a[-20:, -20:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    br, bg_, bb = float(bg[0]), float(bg[1]), float(bg[2])
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    d = np.maximum(np.maximum(np.abs(r - br), np.abs(g - bg_)), np.abs(b - bb))
    alpha = np.clip((d - 20) * 255 // 40, 0, 255).astype(np.uint8)
    # despill: en los bordes semitransparentes quita el tinte de fondo
    edge = (alpha > 0) & (alpha < 255)
    # el tinte de fondo es magenta: reduce el canal dominante del fondo (B) si supera a R y G
    excess = np.maximum(b - np.maximum(r, g), 0)
    b2 = np.where(edge, np.maximum(b - excess, np.maximum(r, g)), b)
    out = np.dstack([r.astype(np.uint8), g.astype(np.uint8), b2.astype(np.uint8), alpha])
    return Image.fromarray(out, "RGBA")


def _label(mask: np.ndarray):
    """Componentes conectados 4-vecinos (BFS por filas con union-find simple)."""
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    cur = 0
    for y in range(h):
        row = mask[y]
        prev = labels[y - 1] if y else None
        cur_row = labels[y]
        x = 0
        while x < w:
            if row[x] and cur_row[x] == 0:
                cur += 1
                stack = [(x, y)]
                cur_row[x] = cur
                while stack:
                    cx, cy = stack.pop()
                    for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                        if 0 <= nx < w and 0 <= ny < h and mask[ny, nx] and labels[ny, nx] == 0:
                            labels[ny, nx] = cur
                            stack.append((nx, ny))
            x += 1
    return labels, cur


def components(alpha_img: Image.Image, merge_gap: int = 0, min_px: int = 400):
    """Bounding boxes fusionando componentes cercanos (brillos/sombras)."""
    a = np.asarray(alpha_img)
    mask = a > 90
    labels, n = _label(mask)
    boxes = []
    for i in range(1, n + 1):
        ys, xs = np.where(labels == i)
        if len(xs) < min_px:
            continue
        boxes.append([int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1, len(xs)])
    # Sin fusión por proximidad: el etiquetado ya separa por conectividad real.
    # Dos sprites vecinos pueden tener cajas que se solapan (p. ej. la mecha de
    # la bomba sobre la garra del cangrejo); fusionar por caja los uniría mal.
    boxes.sort(key=lambda b: (b[1] // 250, b[0]))
    return [(b[0], b[1], b[2], b[3]) for b in boxes]


def slice_sheet(src: str, names_in_order, atlas_name: str, pad: int = 6):
    img = Image.open(src)
    keyed = chroma_key(img)
    alpha = keyed.split()[3]
    boxes = components(alpha)
    if len(boxes) != len(names_in_order):
        print(f"WARN {src}: {len(boxes)} componentes, se esperaban {len(names_in_order)}: {boxes}")
    sprites = []
    for name, (x0, y0, x1, y1) in zip(names_in_order, boxes):
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(img.width, x1 + pad)
        y1 = min(img.height, y1 + pad)
        sprites.append((name, keyed.crop((x0, y0, x1, y1))))

    def pack(width):
        """Devuelve (posiciones, alto total) para un ancho de atlas dado."""
        pos = []
        cx = cy = 0
        row_h = 0
        for name, spr in sprites:
            sw, sh = spr.size
            if cx + sw > width:
                cx = 0
                cy += row_h + 4
                row_h = 0
            pos.append((name, cx, cy, sw, sh))
            cx += sw + 4
            row_h = max(row_h, sh)
        return pos, cy + row_h

    # El atlas debe caber en 2048 px (límite de textura en móviles modestos).
    # Prueba 1024 y, si es demasiado alto, 2048.
    width = 1024
    pos, total_h = pack(width)
    if total_h > 2048:
        width = 2048
        pos, total_h = pack(width)
    atlas = Image.new("RGBA", (width, total_h), (0, 0, 0, 0))
    frames = {}
    for (name, cx, cy, sw, sh), (_, spr) in zip(pos, sprites):
        atlas.paste(spr, (cx, cy))
        frames[name] = {
            "frame": {"x": cx, "y": cy, "w": sw, "h": sh},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": sw, "h": sh},
            "sourceSize": {"w": sw, "h": sh},
            "pivot": {"x": 0.5, "y": 1.0},
        }
    atlas_path = os.path.join(OUT, atlas_name + ".webp")
    atlas.save(atlas_path, "WEBP", quality=82, method=6)
    # Verificación: ningún frame puede quedar vacío (el empaquetado anterior
    # recortaba el atlas a 1024 px de alto y borraba los frames de abajo).
    check = Image.open(atlas_path).convert("RGBA")
    for name, fr in frames.items():
        f = fr["frame"]
        crop = np.asarray(check.crop((f["x"], f["y"], f["x"] + f["w"], f["y"] + f["h"])))
        opaque = int((crop[:, :, 3] > 200).sum())
        if opaque == 0:
            raise SystemExit(f"ERROR: frame vacío en {atlas_name}: {name} ({f})")
    json_path = os.path.join(OUT, atlas_name + ".json")
    with open(json_path, "w") as f:
        json.dump({"frames": frames, "meta": {"app": "cofre-del-doblon process-art.py",
                  "version": "1.0", "image": atlas_name + ".webp",
                  "format": "RGBA8888", "size": {"w": atlas.width, "h": atlas.height},
                  "scale": "1"}}, f, indent=1)
    print(f"{atlas_name}: {len(frames)} sprites -> {atlas_path} ({atlas.width}x{atlas.height}, "
          f"{os.path.getsize(atlas_path)//1024} KB)")
    for n, fr in frames.items():
        print(f"   {n}: {fr['frame']['w']}x{fr['frame']['h']}")


def background(src: str, name: str, size=(780, 1688)):
    img = Image.open(src).convert("RGB")
    tw, th = size
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale + 0.5), int(sh * scale + 0.5)
    img = img.resize((nw, nh), Image.LANCZOS)
    x = (nw - tw) // 2
    y = (nh - th) // 2
    img = img.crop((x, y, x + tw, y + th))
    out = os.path.join(OUT, name)
    img.save(out, "WEBP", quality=82, method=6)
    print(f"{name}: {tw}x{th}, {os.path.getsize(out)//1024} KB")


def main():
    os.makedirs(OUT, exist_ok=True)
    chests = glob.glob(os.path.join(RAW, "*sheet-chests*.webp"))
    items = glob.glob(os.path.join(RAW, "*sheet-items*.webp"))
    bg = glob.glob(os.path.join(RAW, "*bg-beach*.webp"))
    menu = glob.glob(os.path.join(RAW, "*menu-scene*.webp"))
    if chests:
        slice_sheet(chests[0],
                    ["chest_wood_closed", "chest_silver_closed", "chest_gold_closed",
                     "chest_wood_open", "chest_silver_open", "chest_gold_open", "mound"],
                    "atlas-chests")
    if items:
        slice_sheet(items[0],
                    ["bomb", "crab", "doubloon", "coins", "sparkle"],
                    "atlas-items")
    if bg:
        background(bg[0], "bg-beach.webp")
    if menu:
        background(menu[0], "bg-menu.webp")
    # Ronda B
    cover = glob.glob(os.path.join(RAW, "*cover-keyart*.webp"))
    if cover:
        img = Image.open(cover[0]).convert("RGB")
        out = os.path.join(OUT, "cover-keyart.webp")
        img.save(out, "WEBP", quality=85, method=6)
        print(f"cover-keyart.webp: {img.size}, {os.path.getsize(out)//1024} KB")
    land = glob.glob(os.path.join(RAW, "*bg-beach-landscape*.webp"))
    if land:
        background(land[0], "bg-beach-landscape.webp", size=(1688, 780))
    octo = glob.glob(os.path.join(RAW, "*octopus*.webp"))
    if octo:
        slice_sheet(octo[0], ["octopus"], "atlas-octopus")
    mapa = glob.glob(os.path.join(RAW, "*map-parchment*.webp"))
    if mapa:
        background(mapa[0], "bg-map.webp")
    print("OK")


if __name__ == "__main__":
    main()
