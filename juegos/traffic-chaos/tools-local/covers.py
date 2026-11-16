#!/usr/bin/env python3
"""Covers for Traffic Chaos round 1, from REAL gameplay screenshots
(playgama-publish). Never generated art. Title in Lilita One (the game's
own font). Seal on Playgama covers only (>=60 px mascot, top corner,
never bottom 20%); youtube covers have NO seal. Title at the top (the
action — the crossing + the crash — sits in the middle/lower area).
The cover image is the CHAIN CRASH (teardown §10 point 1: the cover is
the crash, not the empty city), with the level-1 play shot as the
landscape band source.
Sources (film screenshots, 390x844 DSF2 = 780x1688):
  square 800x800    <- attract-crash.png (centre crop on the crossing)
  portrait 1080x1920 <- attract-crash.png (tall crop, crossing centred)
  landscape 1920x1080 <- level1-play shot band (crossing, no HUD)
Outputs: entregas/traffic-chaos-round1/covers/
"""
from PIL import Image, ImageDraw, ImageFont
import os

BASE = os.path.expanduser('~/workspace/dana-games/traffic-chaos/work')
SHOTS = '/tmp/film-tc/shots'
OUT = os.path.expanduser('~/workspace/dana-games/traffic-chaos/entregas/traffic-chaos-round1/covers')
os.makedirs(OUT, exist_ok=True)

FONT = os.path.join(BASE, 'public/assets/fonts/LilitaOne-400.woff2')
SEAL = os.path.join(BASE, 'public/assets/img/badge.png')


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
        # from a portrait gameplay shot (crossing, no HUD).
        img = img.crop((0, band[0], img.size[0], band[1]))
    elif top_crop:
        # Cut the HUD (score/level/quota) off the top before fitting,
        # so the cover title never sits on top of it.
        img = img.crop((0, top_crop, img.size[0], img.size[1]))
    img = cover_crop(img, tw, th, focus)
    # Title band at the top.
    overlay = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    band_h = int(th * 0.16)
    for y in range(band_h):
        a = int(120 * (1 - y / band_h))
        od.line([(0, y), (tw, y)], fill=(20, 20, 20, a))
    img = Image.alpha_composite(img.convert('RGBA'), overlay)
    d = ImageDraw.Draw(img)
    title_size = int(tw * 0.068)
    sub_size = int(tw * 0.035)
    font = load_font(title_size)
    subfont = load_font(sub_size)
    # Title, centred, white with dark outline.
    for txt, f, y in (('TRAFFIC CHAOS', font, int(th * 0.035)), ('New York Rush', subfont, int(th * 0.035) + title_size + 8)):
        bb = d.textbbox((0, 0), txt, font=f)
        w = bb[2] - bb[0]
        x = (tw - w) // 2
        d.text((x, y), txt, font=f, fill=(255, 255, 255, 255), stroke_width=max(2, title_size // 18), stroke_fill=(20, 20, 20, 255))
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


CRASH = os.path.join(SHOTS, 'attract-crash.png')
PLAY = os.path.join(SHOTS, 'level1-play.png')
# The crash shot is the cover (teardown point 1); fall back to the play
# shot if the crash frame was not captured.
BASE_IMG = CRASH if os.path.exists(CRASH) else PLAY
# Playgama (with seal)
make_cover(BASE_IMG, 800, 800, 'cover-playgama-square.jpg', True, focus=(0.5, 0.5), top_crop=180)
make_cover(BASE_IMG, 1080, 1920, 'cover-playgama-portrait.jpg', True, focus=(0.5, 0.5), top_crop=180)
make_cover(PLAY, 1920, 1080, 'cover-playgama-landscape.jpg', True, focus=(0.5, 0.5), band=(480, 920))
# YouTube (no seal)
make_cover(BASE_IMG, 800, 800, 'cover-youtube-square.jpg', False, focus=(0.5, 0.5), top_crop=180)
make_cover(BASE_IMG, 1080, 1920, 'cover-youtube-portrait.jpg', False, focus=(0.5, 0.5), top_crop=180)
make_cover(PLAY, 1920, 1080, 'cover-youtube-landscape.jpg', False, focus=(0.5, 0.5), band=(480, 920))
print('DONE', OUT)
