#!/usr/bin/env python3
"""Covers for Kitchen Hole (thumbnail-design): one focal point (the hole
swallowing the fridge), 0-4 words, mobile-legible. Drawn with PIL from
the game palette + bundled fonts — no game screenshots needed.
Sizes: 800x800 (Playgama square), 1080x1920 (portrait), 1920x1080
(landscape). Retries writes (EPERM wave); verifies sizes at the end.
"""
import os
import sys
import time

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.dirname(HERE)
FONTS = '/home/hatch/workspace/dana-games/ramp-physics-r2/work/public/assets/fonts'
OUT = os.path.join(WORK, 'entregas', 'agujero-tragon-cocina-round1', 'covers')

INK = (20, 20, 20)
VIOLET = (124, 58, 237)
VIOLET_L = (167, 139, 250)
GOLD = (250, 204, 21)
CREAM = (253, 243, 216)
WOOD = (176, 122, 69)
WOOD_D = (138, 90, 43)
FRIDGE = (37, 99, 235)
FRIDGE_L = (96, 165, 250)
WHITE = (255, 255, 255)


def font(name, size):
    try:
        return ImageFont.truetype(os.path.join(FONTS, name), size)
    except OSError:
        return ImageFont.load_default()


def draw_hole(d, cx, cy, rx, ry):
    # Glow, pit, rim, swirl.
    d.ellipse([cx - rx * 1.25, cy - ry * 1.25, cx + rx * 1.25, cy + ry * 1.25], fill=VIOLET + (90,))
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=INK)
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], outline=VIOLET, width=8)
    d.arc([cx - rx * 0.6, cy - ry * 0.6, cx + rx * 0.6, cy + ry * 0.6], 20, 200, fill=VIOLET_L, width=6)
    d.arc([cx - rx * 0.35, cy - ry * 0.35, cx + rx * 0.35, cy + ry * 0.35], 200, 340, fill=VIOLET_L, width=5)


def draw_fridge(d, x, y, w, h):
    d.rounded_rectangle([x, y, x + w, y + h], radius=28, fill=FRIDGE, outline=INK, width=6)
    d.rounded_rectangle([x, y, x + w, y + h * 0.38], radius=28, fill=FRIDGE_L)
    d.rounded_rectangle([x, y + h * 0.2, x + w, y + h * 0.38], radius=10, fill=FRIDGE_L)
    # Face: two eyes + smile.
    d.ellipse([x + w * 0.3, y + h * 0.55, x + w * 0.42, y + h * 0.62], fill=INK)
    d.ellipse([x + w * 0.58, y + h * 0.55, x + w * 0.7, y + h * 0.62], fill=INK)
    d.arc([x + w * 0.35, y + h * 0.62, x + w * 0.65, y + h * 0.78], 15, 165, fill=INK, width=5)
    # Handle.
    d.rectangle([x + w * 0.82, y + h * 0.42, x + w * 0.88, y + h * 0.7], fill=INK)


def draw_coin(d, cx, cy, r):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=GOLD, outline=INK, width=4)
    d.ellipse([cx - r * 0.65, cy - r * 0.65, cx + r * 0.65, cy + r * 0.65], outline=(217, 119, 6), width=3)
    d.text((cx, cy), '$', font=font('LilitaOne-400.woff2', int(r * 1.1)), fill=(217, 119, 6), anchor='mm')


def draw_croissant(d, cx, cy, s):
    # Three overlapping golden circles.
    for dx, dy, r in [(-0.45, 0.15, 0.55), (0, -0.1, 0.62), (0.45, 0.15, 0.55)]:
        d.ellipse([cx + dx * s - r * s, cy + dy * s - r * s, cx + dx * s + r * s, cy + dy * s + r * s],
                  fill=(232, 169, 78), outline=INK, width=4)


def cover(w, h, name):
    img = Image.new('RGB', (w, h), CREAM)
    d = ImageDraw.Draw(img, 'RGBA')
    # Wood floor (bottom 40%).
    d.rectangle([0, h * 0.6, w, h], fill=WOOD)
    for i in range(int(h * 0.6), h, 46):
        d.rectangle([0, i, w, i + 3], fill=WOOD_D)
    # Title (top).
    title = 'KITCHEN HOLE'
    tf = font('LilitaOne-400.woff2', int(w * 0.09))
    d.text((w / 2, h * 0.10), title, font=tf, fill=INK, anchor='mm', stroke_width=3, stroke_fill=WHITE)
    sub = 'EAT THE FRIDGE!'
    sf = font('LilitaOne-400.woff2', int(w * 0.045))
    d.text((w / 2, h * 0.10 + int(w * 0.075)), sub, font=sf, fill=VIOLET, anchor='mm')
    # Fridge (right) + hole (centre) + croissant + coins.
    fw, fh = int(w * 0.30), int(w * 0.45)
    draw_fridge(d, int(w * 0.62), int(h * 0.42), fw, fh)
    hx, hy = int(w * 0.38), int(h * 0.68)
    draw_hole(d, hx, hy, int(w * 0.20), int(w * 0.15))
    draw_croissant(d, hx, hy - int(w * 0.06), int(w * 0.07))
    draw_coin(d, int(w * 0.12), int(h * 0.48), int(w * 0.05))
    draw_coin(d, int(w * 0.85), int(h * 0.30), int(w * 0.04))
    draw_coin(d, int(w * 0.18), int(h * 0.82), int(w * 0.045))
    return img


def write_retry(path, img):
    for attempt in range(60):
        try:
            img.save(path, 'PNG')
            if os.path.getsize(path) > 1000:
                print('wrote', path, os.path.getsize(path), 'bytes')
                return True
        except OSError as e:
            print(f'  EPERM {path} attempt {attempt}: {e}')
            time.sleep(5)
    print('FAILED', path)
    return False


def main():
    os.makedirs(OUT, exist_ok=True)
    ok = True
    ok &= write_retry(os.path.join(OUT, 'cover-800x800.png'), cover(800, 800, 'sq'))
    ok &= write_retry(os.path.join(OUT, 'cover-1080x1920.png'), cover(1080, 1920, 'port'))
    ok &= write_retry(os.path.join(OUT, 'cover-1920x1080.png'), cover(1920, 1080, 'land'))
    print('COVERS_OK' if ok else 'COVERS_FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
