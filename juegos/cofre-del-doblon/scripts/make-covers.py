#!/usr/bin/env python3
"""Doubloon Rush — compose the 6 Playgama/YouTube covers (PIL).

From public/assets/cover-keyart.webp (1600x1600) + Lilita One title.
- Playgama (3): 800x800, 1080x1920, 1920x1080, WITH the Dana Games badge
  (top corner, never the bottom 20%, mascot >= 60 px at 800x800).
- YouTube (3): same sizes, WITHOUT the badge (no branding in thumbnails).
Title: DOUBLOON / RUSH (two lines; one line for landscape), gold with a
dark outline, below the badge zone.
Outputs: comunicacion-ias/entregas/cofre-del-doblon-round1/covers/
Usage: python3 scripts/make-covers.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # juegos/cofre-del-doblon
REPO = os.path.dirname(os.path.dirname(ROOT))  # dana-cofre-repo
ASSETS = os.path.join(ROOT, "public", "assets")
OUT = os.path.join(REPO, "comunicacion-ias", "entregas", "cofre-del-doblon-round1", "covers")
KEYART = os.path.join(ASSETS, "cover-keyart.webp")
BADGE = os.path.join(REPO, "comunicacion-ias", "kit", "dana-games_badge_360w@2x.png")
FONT_PATH = os.path.join(ASSETS, "LilitaOne-Regular.ttf")

GOLD = (255, 210, 62)
INK = (58, 36, 16)
SIZES = [(800, 800), (1080, 1920), (1920, 1080)]


def cover_fit(img: Image.Image, w: int, h: int) -> Image.Image:
    """Crop-resize to fill w x h (centre crop)."""
    sw, sh = img.size
    scale = max(w / sw, h / sh)
    nw, nh = int(sw * scale + 0.5), int(sh * scale + 0.5)
    img = img.resize((nw, nh), Image.LANCZOS)
    x = (nw - w) // 2
    y = (nh - h) // 2
    return img.crop((x, y, x + w, y + h))


def draw_title(draw: ImageDraw.ImageDraw, cx: int, y: int, size: int, two_lines: bool):
    font = ImageFont.truetype(FONT_PATH, size)
    stroke = max(4, size // 9)
    lines = ["DOUBLOON", "RUSH"] if two_lines else ["DOUBLOON RUSH"]
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font, stroke_width=stroke)
        tw = bbox[2] - bbox[0]
        draw.text((cx - tw // 2, y + i * int(size * 1.08)), line, font=font,
                  fill=GOLD, stroke_width=stroke, stroke_fill=INK)


def make_cover(w: int, h: int, with_badge: bool) -> Image.Image:
    base = Image.open(KEYART).convert("RGB")
    img = cover_fit(base, w, h)
    draw = ImageDraw.Draw(img, "RGBA")
    badge_h = 0
    if with_badge:
        badge = Image.open(BADGE).convert("RGBA")
        bw = int(w * 0.19)  # ~150 px at 800 wide; mascot part well above 60 px
        bh = int(badge.height * bw / badge.width)
        badge = badge.resize((bw, bh), Image.LANCZOS)
        img.paste(badge, (w - bw - 16, 16), badge)
        badge_h = bh + 32
    if w >= h:  # landscape: one line
        size = int(w * 0.062)
        draw_title(draw, w // 2, max(24, badge_h), size, two_lines=False)
    else:
        size = int(w * 0.1)
        draw_title(draw, w // 2, max(24, badge_h), size, two_lines=True)
    return img


def main():
    os.makedirs(OUT, exist_ok=True)
    for w, h in SIZES:
        for with_badge, suffix in ((True, ""), (False, "-youtube")):
            img = make_cover(w, h, with_badge)
            name = f"cover-{w}x{h}{suffix}.jpg"
            path = os.path.join(OUT, name)
            img.save(path, "JPEG", quality=88)
            print(f"{name}: {w}x{h}, badge={'yes' if with_badge else 'no'}, "
                  f"{os.path.getsize(path)//1024} KB")


if __name__ == "__main__":
    main()
