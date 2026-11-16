# Informe ronda 1 — Kitchen Hole: Hungry Hole in the Kitchen

**Game:** Agujero Tragón en la Cocina (Kitchen Hole Muncher) — eat-and-grow
hole game. **Concept + mockup approved by Daniel 16/11 ~06:36** ("Quiero
todos para hoy", "Perfectamente diseñados"). **Branch:**
`anita/agujero-tragon-cocina` (from main `d4a49c8d`). **PR:** (number below).

## What was built

- Phaser 3 + TypeScript + Vite, from the Ramp Physics r2 template
  (adapted, not rewritten). English first, Spanish second. PEGI 3.
- 30 levels, 6 kitchens (Grandma's L1–5, Food Truck L6–10, Bakery
  L11–15, Pizzeria L16–20, Sushi Bar L21–25, Grand Kitchen L26–30).
- Mechanics: fit rule (r ≤ hole.r × 1.1), growth ladder, pet steal
  (coins only), golden food (×3, 8 s TTL), movers (fleeing mouse,
  rolling apple). Win = CLEANUP (eat everything). Stars: 3 = 15+ s +
  all goldens · 2 = 5+ s · 1 = win.
- Menu: living kitchen (hole swallows a croissant on loop, fridge
  smiles, tap it and it laughs). Map with kitchen names, stars, chest
  every 3rd level, daily challenge + streak. Shop: 5 hole skins (rim
  colours) + extra time (+15 s, max 3, also via rewarded ad on fail).
- Art: 100% procedural at 4× (kitchen.ts) from the approved mockup v2.
  Octopus mascot cameo hidden in every level (tappable, wiggles).
- Bridge: initialize() before engine, game_ready from the Menu, no
  `window.__*` in production (test handle tree-shaken).

## Verification (honest numbers)

| Check | Result |
|---|---|
| `tsc --noEmit` | **0 errors** |
| Unit tests (`tests/rules.test.ts`, 17) | **17/17 PASS** (swallow, fit, growth unlock, timer lose, stars, pet steal + cooldown, golden spawn/expire/×3, mover patrol, clamps, planRoute L1/L6/L21/L30, level shape) |
| Sim harness (`tools-local/sim.ts`, 5 policies × 30 levels) | **SIM OK: solution 30/30 wins · solution3 30/30 wins, 30 at 3★ · idle 0/30 · sweeper 0/30 · greedy 30/30** |
| Prod build (build-retry.mjs) | OK — `dist/assets/index-*.js` 1,270,642 B (pre-fix build; the fixed build is inside the zip) |
| Test build | OK — `dist-test/` + public/ copied |
| Browser smoke (Chromium, 390×844) | Menu loads, handle alive, 0 console errors, 0 failed requests. 4 levels played (L1/L6/L11/L21) — see § smoke |
| Zip | **641,611 bytes** (0.64 MB, limit 5 MB), git blob `700f7afb`, commit `4a6acd07` — built in-memory from the FIXED source, no disk writes |
| Zip smoke (prod zip loads menu, no `__game`) | PENDING (needs Chromium — dead at report time) |

### Browser smoke — what happened

Chromium was alive only ~7 min after the 06:55 UTC VM boot. The smoke
ran 06:58–07:03 UTC and played L1/L6/L11/L21 in the test build:

- Menu renders, `window.__game` alive, scenes `[Menu]`, lang `en`,
  **0 console errors, 0 failed requests**.
- First run: 0/4 levels won — a **replay-timing artifact, not a game
  bug**: the waypoints were fed on wall-clock time while the sim ran at
  timeScale 4, so the hole chased stale targets (L1 ate 2/8 with 43.4 s
  left — the sim was fine, the driver was behind). The same routes win
  30/30 in the in-memory harness. Fixed in `smoke.mjs`: waypoints are
  now indexed by SIM time (`floor(elapsed / 0.25)`).
- **Visual bugs found on the screenshots and FIXED in this round:**
  1. Floor drew the wrong kitchen (display name "Grandma's Kitchen"
     vs floor key 'grandma' — the `as KitchenName` cast hid it; the
     fallback marble + veins + brass border rendered). Fixed with
     `floorKey()` mapping.
  2. Timer text was an ink-on-ink blob (headingStyle's black stroke on
     an ink fill) overlapping the coins pill. Fixed: white fill, 22 px,
     centred at x 182; pill narrowed to 96 px.
  3. Menu showed TWO holes (the bg-menu illustration drew its own hole
     + the live hole). Fixed: the static background no longer draws a
     hole.
  4. Menu title was a black blob (same stroke-on-ink cause). Fixed:
     white fill.
  5. Octopus cameo rendered ~90 px (setScale on a 192 px canvas
     texture). Fixed: setDisplaySize(36, 36).
  6. Tagline wrapped to 2 lines behind the fridge. Fixed: one-line
     tagline, living-kitchen block moved down.
- **Re-verification of the fixes in-browser is PENDING** — Chromium
  died at ~07:03 UTC (exit 133) before the fixed build could be
  re-smoked. The finisher window (or the next live window) must run
  `tools-local/smoke.mjs` + `tools-local/probe-all.mjs` on the fixed
  build and attach the new screenshots. The fixes are small, mechanical
  and type-checked (tsc 0 errors), but they are NOT browser-verified
  yet — do not present them as verified.

### Fixes found by the harness (design bugs, not test bugs)

- **L21 short by 0.5 radius** for the fridge (hole 46.8, needed 47.3):
  added a cookie + sushi. **L5** (chairs + table unreachable): added a
  toaster → cake → plant size ladder. **L7** (chair short by 1.7):
  added a cake. **Golden/3★ design:** goldens never block the win, but
  a fast clear finished before they spawned — the golden-aware route
  now holds the last base object until all goldens have spawned.
  After the fixes: solution 30/30, solution3 30/30 at 3★.

## Self-review (review-game + polish audit)

| Area | Score / note |
|---|---|
| Hook in 10 s | First swallow at t≈0.13 s on the planned route; hole visibly grows — STRONG |
| One verb | Drag only; no reading to start — STRONG |
| Art vs Metro bar | Toy-3D procedural 4×, living menu — MEETS on code inspection; pixel audit pending real screenshots |
| Juice | +value pops, flying coins, gulp pitch, shake tiers — MEETS |
| Difficulty | Winnable 30/30, idle/sweeper 0/30 — construction sound; **verdict NOT YET MEASURED (needs 3-tester human playtest)** |
| Performance | ~100 draw-call budget; hole + shadows redrawn per frame on one Graphics each — UNMEASURED on device, stated honestly |
| Readability | Code-inspection audit in filtro-visual.md (6 moments, no overlaps by construction); **pixel audit pending** |
| Known deviations | PLAY button is the standard template button, not a pot-lid circle (deferred); GIF + Short video pending Chromium capture; difficulty verdict pending human playtest |

## Quality gates checklist (game-quality-gates)

- [x] Single cleanup entry (win = CLEANUP, one place)
- [x] Delta time (sim steps on clamped dt; test timeScale only in test build)
- [x] Save versioning (v1, Bridge storage only, key `kitchen_hole_save_v1`)
- [x] No `window.__*` in production (tree-shaken; zip-smoke asserts it)
- [x] Interstitial only every 2nd win, never L1; rewarded only in 'rewarded' state
- [x] 30 levels winnable by construction (harness)
- [ ] Browser smoke on the FIXED build (pending — Chromium dead)
- [ ] Full 30-level browser playback (probe-all.mjs — pending)
- [ ] Human 3-tester playtest (pending)
- [ ] GIF + Short filmed from real gameplay (pending)
- [ ] Pixel readability audit on real screenshots (pending)

## Delivery pack

`comunicacion-ias/entregas/agujero-tragon-cocina-round1/`:

- `kitchen-hole-round1.zip` — **641,611 bytes**, git blob `700f7afb`
  (commit `4a6acd07`), playable link below
- covers: 800×800, 1080×1920, 1920×1080 (PIL, game palette + fonts)
  — **PENDING** (covers.py exhausted 60 retries per file on the EPERM
  wave; re-run when the wave lifts)
- `teardown.md`, `filtro-visual.md`, `filtro-jugabilidad.md`,
  `skills-usadas.md`, `plan-dificultad.md`, `GDD.md`, `listing.txt`
  (EN first), `short-script.md` (Short script + hooks + storyboard)
- `shots/` — menu + L1 + L21 + result screenshots from the smoke run
  (pre-fix build — the fixed build's shots are pending)
- GIF + Short video: **PENDING** (Chromium dead; script + storyboard
  delivered, capture in the finisher window)

## Playable link

https://raw.githubusercontent.com/danielsanchezverdasco-art/estudio-dana-oficina/anita/agujero-tragon-cocina/comunicacion-ias/entregas/agujero-tragon-cocina-round1/kitchen-hole-round1.zip

## Numbers — final

- Prod bundle: `dist/assets/index-*.js` 1,270,642 B (pre-fix build;
  the zip's bundle is built from the FIXED source)
- Zip: **641,611 bytes**, git blob `700f7afb`, commit `4a6acd07`
- Re-smoke (fixed build): PENDING — Chromium dead; run
  `tools-local/smoke.mjs` at the next live window
- Probe-all (30 levels): PENDING — run `tools-local/probe-all.mjs`
  at the next live window
