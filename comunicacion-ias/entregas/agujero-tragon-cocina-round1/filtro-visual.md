# Filtro visual — Kitchen Hole round 1

Art bible: `ART-BIBLE.md` (approved target = mockup v2, option C comic).
All art procedural at 4× (`src/kitchen.ts`); no bitmap art is upscaled.

## Screen-readability self-audit (auditing-game-screen-readability)

Browser capture was IMPOSSIBLE this round (Chromium dead, exit 133
SIGTRAP — see informe-ronda1.md). This audit is a draw-code inspection
of the 6 moments, not a screenshot audit. It must be re-run with real
captures in the finisher window.

| Moment | Check | Result (code inspection) |
|---|---|---|
| Menu | Title vs toggles | Title max width `w*0.64` portrait, auto-fit down to 26 px (template fix kept); toggles top-right at x w−44 — no overlap by construction |
| Menu | Fridge vs hole vs buttons | Portrait: fridge y h*0.52−150, hole y h*0.52, daily y h*0.68, PLAY y h*0.8 — stacked, no overlap. Landscape: fridge bottom-left (64, h−64), hole (w*0.3, h*0.62), buttons right — no overlap |
| HUD | LEVEL / TIMER / coins / pause | LEVEL bubble r26 at (38,34); TIMER centred (195,34); coins pill (268,34) w104; pause (356,34) r24 — 356+24=380 < 390, pill ends 320, gap 12 px. No overlap |
| HUD | SIZE bar vs objects-left | SIZE bar x58–228, number at 238; left pill right-aligned at 378 — gap ≥ 60 px |
| Game | Objects vs HUD | Playfield y 110–768; HUD ends y ~88; floor covers full screen but objects spawn y ≥ 130 — nothing under the HUD |
| Game | Pet label vs pet | Name text 34 px above pet centre, depth 3 — follows the pet, never under the hole (hole depth 4 covers it when overlapping — intended: the pet is never eaten) |
| Game | +value pops vs timer | Pops spawn at hole position (playfield), rise 44 px, fade in 650 ms — they can cross the SIZE bar row only if the hole is at the very top (y 110) — brief, 650 ms, small text |
| Result | Card fits | Card height from content (520 win / 560 fail+ad / 450 fail), width min(340, w−40) — buttons stacked from a cursor, never below the card (template round-1 fix kept) |
| Map | Node names | Names 13 px under the stars; node gap 118 px — single-line names, no wrap, no overlap with the next node |
| Shop | Skin cards | 3 per row, 104×96 + 34 px tag row; 5 skins = 2 rows; extra-time row below — fits 844 px height (200 + 2×130 + 30 + 56 = 546 + notice) |

**Open (finisher window):** capture the 6 moments in Chromium at
390×844 and re-run the 6 checks (overlap / occluded / offscreen /
small / faint / brief) on real pixels. Small-text risk: the pet name
(13 px) and the "QUEDAN n" pill (15 px) are the smallest texts — verify
legibility on a real phone screenshot.

## Metro Nightmare side-by-side bar

| Point | Metro Nightmare (minimum) | Kitchen Hole round 1 |
|---|---|---|
| First frame | Illustrated, alive | Living menu: hole + croissant loop, laughing fridge — MEETS |
| Art quality | Volumetric, textured | Toy-3D procedural 4×, thick outlines, shadows, textures (wood/metal/tiles) — MEETS (verify on pixels in finisher) |
| One verb in 10 s | One touch, understood | Drag the hole; first swallow + visible growth in <10 s — MEETS (harness: first eat at t≈0.13 s on the planned route) |
| No flat/clip-art | Real game art | All 16 kinds + pets + fridge drawn with volume, shading, faces — MEETS |
| Menu | Illustrated + interactive | Fridge laughs on tap, hole swallows on loop — MEETS |
| Juice | One satisfaction per action | +value pop + flying coins + gulp pitch + shake tiers — MEETS |

## Known deviations from the concept/mockup

- **PLAY as a pot lid:** the menu PLAY button is the standard template
  button (rounded rect), not a pot-lid circle. Deferred: a circular
  lid button needs a new button variant in ui.ts.
- **Menu background:** the bg-menu illustration shows the kitchen +
  hole + croissant; the fridge in the illustration is the LIVE fridge
  image (tappable), not part of the static background — the composition
  matches the mockup's fiction (fridge smiling, hole swallowing).
- **Fridge face:** the fridge texture has a happy face (mockup: fridge
  with a face) — MEETS.
- **Octopus cameo:** hidden in each level (bottom-right, tappable,
  wiggles) per the Dana Games stamp rule — MEETS.
