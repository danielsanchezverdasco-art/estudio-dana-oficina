#!/usr/bin/env python3
"""Ramp Physics art pipeline: slice sprite sheets (3x2, magenta bg),
chroma-key to alpha + despill, trim, save WebP q82; resize backgrounds.
Mirrors the Metro pipeline (magenta chroma key + despill + alpha check)."""
import os
from PIL import Image, ImageFilter

SRC = os.path.expanduser('~/workspace/dana-games/ramp-physics/art-raw')
OUT = os.path.expanduser('~/workspace/dana-games/ramp-physics/ramp-physics/assets/img')
os.makedirs(OUT, exist_ok=True)

MAGENTA = (255, 0, 255)


def chroma_key(im: Image.Image) -> Image.Image:
    """Magenta -> transparent alpha with soft edge + despill."""
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            # distance from pure magenta
            d = max(abs(r - 255), abs(g - 0), abs(b - 255))
            if d < 48:
                alpha = 0
            elif d > 130:
                alpha = 255
            else:
                alpha = int(255 * (d - 48) / (130 - 48))
            if alpha < 255:
                # despill: pull red/blue toward green so edges don't glow pink
                m = max(g, 12)
                r = min(r, m + 30)
                b = min(b, m + 30)
            px[x, y] = (r, g, b, alpha)
    return im


def trim(im: Image.Image, pad: int = 6) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad); y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad); y1 = min(im.height, y1 + pad)
    return im.crop((x0, y0, x1, y1))


def sheet_cells(path: str):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    cw, ch = w // 3, h // 2
    cells = {}
    for row in range(2):
        for col in range(3):
            cells[(col, row)] = im.crop((col * cw, row * ch, (col + 1) * cw, (row + 1) * ch))
    return cells


def save_sprite(im: Image.Image, name: str, max_dim: int = 512):
    im = trim(im)
    if max(im.size) > max_dim:
        im.thumbnail((max_dim, max_dim), Image.LANCZOS)
    out = os.path.join(OUT, name)
    im.save(out, 'WEBP', quality=82)
    print(f'{name}: {im.size} {os.path.getsize(out)} B')
    return out


def main():
    # --- dummy parts sheet (1920x1280, cells 640x640) ---
    dummy = sheet_cells(os.path.join(SRC, 'media-generation-dummy-parts-sheet-0-1b467876-9a4e-4dfe-b5ce-46e6196ca2ad.webp'))
    save_sprite(chroma_key(dummy[(0, 0)]), 'dummy-head.webp')
    save_sprite(chroma_key(dummy[(1, 0)]), 'dummy-torso.webp')
    # upper arm: vertical cylinder of the bent arm (top-left of cell (2,0))
    bent = dummy[(2, 0)]
    upper = bent.crop((30, 30, 300, 360))
    save_sprite(chroma_key(upper), 'dummy-upperarm.webp')
    save_sprite(chroma_key(dummy[(0, 1)]), 'dummy-forearm.webp')
    save_sprite(chroma_key(dummy[(1, 1)]), 'dummy-thigh.webp')
    save_sprite(chroma_key(dummy[(2, 1)]), 'dummy-shin.webp')

    # --- props sheet ---
    props = sheet_cells(os.path.join(SRC, 'media-generation-props-sheet-0-ab617964-ed8c-4d5b-ac83-849b2f734496.webp'))
    save_sprite(chroma_key(props[(0, 0)]), 'prop-fan.webp')
    save_sprite(chroma_key(props[(1, 0)]), 'prop-dynamite.webp')
    save_sprite(chroma_key(props[(2, 0)]), 'prop-portal.webp')
    save_sprite(chroma_key(props[(0, 1)]), 'prop-flag.webp')
    save_sprite(chroma_key(props[(1, 1)]), 'prop-star.webp')
    save_sprite(chroma_key(props[(2, 1)]), 'prop-inkpot.webp')

    # --- backgrounds (Lanczos + unsharp) ---
    def bg(src_name, out_name, size):
        im = Image.open(os.path.join(SRC, src_name)).convert('RGB')
        im = im.resize(size, Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=3))
        out = os.path.join(OUT, out_name)
        im.save(out, 'WEBP', quality=82)
        print(f'{out_name}: {im.size} {os.path.getsize(out)} B')

    bg('media-generation-bg-menu-blueprint-0-6a00c9e4-bb0d-4e61-95db-7d9a15fc41f5.webp', 'bg-menu.webp', (780, 1688))
    bg('media-generation-bg-play-blueprint-0-b5ebc719-e371-4e1d-816a-6759e24918c0.webp', 'bg-play.webp', (780, 1688))
    bg('media-generation-bg-play-land-0-505e6d06-34ce-47b9-9f72-cc1eddef6d03.webp', 'bg-play-land.webp', (1688, 780))
    bg('media-generation-keyart-crash-0-305813d5-54c3-41e2-867f-59a1b8b54813.webp', 'keyart.webp', (1080, 1920))


if __name__ == '__main__':
    main()
