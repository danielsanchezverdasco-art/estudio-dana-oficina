# Kitchen Hole: Hungry Hole in the Kitchen

Eat-and-grow hole game (hole.io-like) in a top-down kitchen. Drag a black
hole with one finger, swallow everything that fits — crumbs to croissants
to chairs — grow, and finally eat the fridge. 30 kitchens, 6 blocks with a
story each (Grandma's, Food Truck, Bakery, Pizzeria, Sushi Bar, Grand
Kitchen). The pet steals your coins if it touches the hole; golden food
pays ×3 but vanishes in 8 seconds.

- **Stack:** Phaser 3 + TypeScript + Vite (template: Ramp Physics r2).
- **Language:** English first, Spanish second. PEGI 3.
- **Win:** eat EVERYTHING in the kitchen before the timer ends (CLEANUP).
- **Stars:** 3 = 15+ s left AND all goldens eaten · 2 = 5+ s · 1 = win.
- **Mechanics:** fit rule (object fits when `obj.r <= hole.r * 1.1`),
  growth ladder (each object grows the hole), pet steal (coins only),
  golden spawns (×3, 8 s TTL), movers (fleeing mouse, rolling apple).
- **Progression:** 30 levels, map, stars, save (Bridge storage only),
  daily challenge, shop (hole skins + extra time), chest every 3 levels.
- **Art:** 100% procedural at 4× (kitchen.ts) — toy-3D comic style from
  the approved mockup (option C). No bitmap art is upscaled.
- **Bridge:** first script in `<head>` (plugin, mode local),
  `initialize()` before the engine, `game_ready` from the Menu once the
  first playable frame is on screen. No `window.__*` in production.
- **Tests:** pure rules in `src/rules.ts` (no Phaser import) — 17 unit
  tests (`tests/rules.test.ts`) + 5-policy simulation harness
  (`tools-local/sim.ts`): solution 30/30 wins, solution3 30/30 at 3★,
  idle 0/30, sweeper 0/30. Difficulty verdict: NOT YET MEASURED —
  needs the human 3-tester playtest (see `entregas/.../informe-ronda1.md`).

## Build

```sh
npm run build        # tsc + vite build (prod, dist/)
npm run build:test   # test build with window.__game (dist-test/)
node tools-local/build-retry.mjs dist prod   # EPERM-tolerant build
node tools-local/copy-public-retry.mjs <public-src> dist  # copy public/
```

During the sandbox EPERM wave use `build-retry.mjs` (vite in-memory
bundle + writeSync retry loop) — plain `vite build` truncates outputs
to 0 bytes and fails.

## Verify (no browser)

```sh
node tools-local/run-sim.mjs tests/rules.test.ts runTests  # 17 unit tests
node tools-local/run-sim.mjs tools-local/sim.ts main        # 30-level harness
```

Browser smoke + solution playbacks need Chromium (currently dead, exit
133) — run by the finisher window via the probe scripts (to be added
with the harness scripts).

## Deliverables

`entregas/agujero-tragon-cocina-round1/` — zip (≤5 MB), covers, GIF +
Short (pending the finisher window — Chromium dead), listing.txt (EN
first), teardown.md, filtro-visual.md, filtro-jugabilidad.md,
skills-usadas.md, informe-ronda1.md, GDD.md, short-script.md.
