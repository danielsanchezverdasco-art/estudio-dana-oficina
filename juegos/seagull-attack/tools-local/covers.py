#!/usr/bin/env python3
"""Covers for Seagull Attack, from REAL gameplay screenshots (playgama-publish).
Never generated art. Title in Lilita One (the game's own font). Seal on
Playgama covers only (>=60 px, top corner, never bottom 20%); -youtube
covers have NO seal. Title at the top (the action — sandwich + line —
sits in the middle/lower area).
Sources (test screenshots, 390x844 DSF2 = 780x1688, landscape 1688x780):
  square 800x800    <- 02-gameplay-line.png (centre crop on the sandwich)
  portrait 1080x1920 <- 02-gameplay-line.png (tall crop, sandwich centred)
  landscape 1920x1080 <- 11-gameplay-landscape.png
Outputs: entregas/seagull-attack-round1/covers/
"""
from PIL import Image, ImageDraw, ImageFont
import os

BASE = os.path.expanduser('~/workspace/dana-games-traspaso/seagull-attack')
SHOTS = '/tmp/shots'
OUT = os.path.join(BASE, 'entregas/seagull-attack-round1/covers')
os.makedirs(OUT, exist_ok=True)

FONT = os.path.join(BASE, 'public/assets/fonts/LilitaOne-400.woff2')
# PIL needs a TTF/OTF; woff2 is not supported by PIL directly. Use the
# system DejaVu as a fallback ONLY if the font cannot be loaded — the
# build uses Lilita One; for the covers we convert the woff2 to TTF first
# (fonttools is available in the venv). See below.
SEAL = os.path.join(BASE, 'assets/img/badge.png')


def load_font(size):
    ttf = '/tmp/LilitaOne-Regular.ttf'
    if not os.path.exists(ttf):
        try:
            from fontTools.ttLib import TTFont
            f = TTFont(FONT)
            f.flavor = None
            f.save(ttf)
            print('converted woff2 ->', ttf)
        except Exception as e:
            print('font convert failed, fallback:', e)
            return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', size)
    return ImageFont.truetype(ttf, size)


def cover_crop(img, tw, th, focus=(0.5, 0.55)):
    """Fill tw x th from img, keeping the focus point (cover-fit)."""
    iw, ih = img.size
    scale = max(tw / iw, th / ih)
    nw, nh = int(iw * scale + 0.5), int(ih * scale + 0.5)
    img = img.resize((nw, nh), Image.LANCZOS)
    fx, fy = focus
    cx = int(fx * nw - tw / 2)
    cy = int(fy * nh - th / 2)
    cx = max(0, min(nw - tw, cx))
    cy = max(0, min(nh - th, cy))
    return img.crop((cx, cy, cx + tw, cy + th))


def make_cover(src, tw, th, out_name, with_seal, focus=(0.5, 0.55), top_crop=0, band=None):
    img = Image.open(src).convert('RGB')
    if band is not None:
        # Take a horizontal band (y0, y1) of the source — for a wide cover
        # from a portrait gameplay shot (arc + sandwich, no HUD, no ink bar).
        img = img.crop((0, band[0], img.size[0], band[1]))
    elif top_crop:
        # Cut the HUD (Level/timer/crumbs/hints) off the top before fitting,
        # so the cover title never sits on top of it.
        img = img.crop((0, top_crop, img.size[0], img.size[1]))
    img = cover_crop(img, tw, th, focus)
    # Title band at the top.
    overlay = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    band_h = int(th * 0.16)
    for y in range(band_h):
        a = int(120 * (1 - y / band_h))
        od.line([(0, y), (tw, y)], fill=(10, 42, 51, a))
    img = Image.alpha_composite(img.convert('RGBA'), overlay)
    d = ImageDraw.Draw(img)
    title_size = int(tw * 0.068)
    sub_size = int(tw * 0.035)
    font = load_font(title_size)
    subfont = load_font(sub_size)
    # Title, centred, white with dark outline.
    for txt, f, y in (('SEAGULL ATTACK', font, int(th * 0.035)), ('Save the Sandwich', subfont, int(th * 0.035) + title_size + 8)):
        bb = d.textbbox((0, 0), txt, font=f)
        w = bb[2] - bb[0]
        x = (tw - w) // 2
        d.text((x, y), txt, font=f, fill=(255, 255, 255, 255), stroke_width=max(2, title_size // 18), stroke_fill=(36, 49, 61, 255))
    if with_seal:
        seal = Image.open(SEAL).convert('RGBA')
        # Keep the aspect ratio (the badge is 360x186, wide): the mascot
        # is ~42% of its width, so the badge must be >=140 px wide on an
        # 800 px cover for the mascot to be >=60 px.
        seal_w = max(140, int(tw * 0.18))
        seal_h = int(seal_w * seal.size[1] / seal.size[0])
        seal = seal.resize((seal_w, seal_h), Image.LANCZOS)
        # Top-right corner, clear of the centred title.
        img.alpha_composite(seal, (tw - seal_w - 16, 16))
    img.convert('RGB').save(os.path.join(OUT, out_name), quality=92, optimize=True) if out_name.endswith('.jpg') else img.convert('RGB').save(os.path.join(OUT, out_name))
    print(out_name, img.size, 'seal' if with_seal else 'no-seal')


PLAY = os.path.join(SHOTS, '02-gameplay-line.png')
LAND = os.path.join(SHOTS, '11-gameplay-landscape.png')
# Playgama (with seal)
make_cover(PLAY, 800, 800, 'cover-playgama-square.jpg', True, focus=(0.5, 0.55))
make_cover(PLAY, 1080, 1920, 'cover-playgama-portrait.jpg', True, focus=(0.5, 0.62))
make_cover(PLAY, 1920, 1080, 'cover-playgama-landscape.jpg', True, focus=(0.5, 0.5), band=(640, 1078))
# YouTube (no seal)
make_cover(PLAY, 800, 800, 'cover-youtube-square.jpg', False, focus=(0.5, 0.55))
make_cover(PLAY, 1080, 1920, 'cover-youtube-portrait.jpg', False, focus=(0.5, 0.62))
make_cover(PLAY, 1920, 1080, 'cover-youtube-landscape.jpg', False, focus=(0.5, 0.5), band=(640, 1078))
print('DONE', OUT)
