# Filtro visual — Traffic Chaos: New York Rush, round 1

Checked against the approved mockup (`mockup-traffic-chaos-ny.webp`), the art bible
(`art-bible.md`) and Metro Nightmare (the quality bar). Status: **code-level checks
done; render checks PENDING browser verification** — Chromium is dead (exit 133
SIGTRAP, 16/11 morning), so no screenshot was taken in round 1. Nothing below is
claimed as seen on screen unless it says so. The finisher window re-runs this filter
with real screenshots.

## Checks done in code (verifiable without a browser)

| # | Check | Result |
|---|---|---|
| V1 | Art bible followed: toy-3D diorama, thick outlines, saturated colours, warm light, soft shadows, textures | PASS — all textures are vector-generated from the bible's palette; no raster art shipped |
| V2 | Patience ring readable at arm's length (28 px radius, green→amber→red, «!» + tremble at ≤2.5 s) | PASS — ring radius 28, stroke 5, colour bands in code; tremble + «!» wired in `GameScene` |
| V3 | Vehicles recognisable by colour/shape without reading (taxi yellow + checker, bus red + long, ambulance white + cross) | PASS — distinct textures per type (`art.ts`) |
| V4 | No text inside images | PASS — no raster images carry text; all labels are Phaser text objects from the i18n tables |
| V5 | Buttons ≥88 px main / 48 px absolute minimum; hit areas in LOCAL coords | PASS — PLAY 260×88, menu buttons 220×64, BOOST 90×52, PAUSE 52×52; all hit areas `Rectangle(0, 0, w, h)` |
| V6 | No stretched sprites | PASS — every texture is generated at its drawn size; `setDisplaySize` is never used on game art |
| V7 | Safe area / no element out of frame at 390×844 | PASS by construction — all layout coordinates are inside the 390×844 design space (FIT scale); the HUD, buttons and light pools are placed with margins |
| V8 | Official hand is the index-pointing one (`kit/mano-tutorial.png`) | PASS — `public/assets/img/hand.png` is the official file (41.923 B), same as r2's |
| V9 | Badge only on Playgama covers, top corner, never bottom 20 %, mascot ≥60 px on 800×800 | PENDING — covers are made by the finisher from real screenshots; the badge file is in `public/assets/img/badge.png` (81.850 B) |
| V10 | EN first, ES second; no Spanish in the EN block | PASS — `i18n.ts` tables; the game defaults to EN for any language except es/es-MX |
| V11 | No test leftovers in production (no `window.__`, no test params) | PASS in code — the handle is defined only when `__TEST_BUILD__` is true; verified by `zip-smoke.mjs` on the production zip |
| V12 | Zip ≤5 MB | PENDING — measured by `build-zip-memory.mjs` + `zip-smoke.mjs` when the zip is built |

## Checks that NEED the browser (finisher)

| # | Check | How the finisher checks it |
|---|---|---|
| V13 | First frame = the attract crash, not the empty city (teardown §10 point 1) | Screenshot `02-attract-crash.png` from the harness: the crash must be visible with debris + slow-mo |
| V14 | No cut or overlapping texts at 390×844 (score, level, quota, mission chip) | Screenshots at menu / level / result in EN and ES; measure text bounds |
| V15 | The mockup's screen reads like the mockup (same intersection, same vehicles, same HUD) | Side-by-side: harness screenshot vs `mockup-traffic-chaos-ny.webp` |
| V16 | Side-by-side vs Metro Nightmare | The finisher's comparative (same method as the r2 mockups) |
| V17 | The tutorial hand points at the light, not a fist | Screenshot `03-tutorial-light.png` |
| V18 | Colours match the bible on screen (night navy, neon billboards, wet asphalt sheen) | Screenshots `01-menu-en.png`, `04-tutorial-done.png` |
| V19 | 60 FPS on the target (no jank during the crash slow-mo) | Playwright frame timing during the attract crash |

## Known visual risks (honest)

- The mockup image itself was never viewable locally (all downloads 0 bytes, EPERM);
  the art was built from the teardown's detailed textual description of the mockup
  (§1.2) + the art bible. The side-by-side (V15/V16) may surface differences the
  finisher must fix in round 2.
- The diorama is vector-generated, not hand-drawn art: it cannot match a painted
  mockup pixel for pixel. The bar is Metro Nightmare's polish, not the mockup's pixels.
- The attract crash is the first frame — if it reads as «cars that stop» instead of
  «spectacular crash», the game loses the teardown's point 1 and round 2 must rework
  the crash juice (bigger debris, longer slow-mo, CHAIN xN counter).
