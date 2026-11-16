# Draw Bridge Delivery — round 1

Draw bridges with limited ink so the delivery scooter can cross the river
and deliver the pizza. 30 hand-made levels, a level map, a daily challenge,
a streak, a treasure chest every 3rd level, and scooter skins to unlock.

Built faithful to the **approved mockup** (issue #24, chosen by Daniel
16/11 ~06:36): a sunny city by a river, rocky cliffs with grass, colourful
houses, a hand-drawn wooden bridge with an orange glow while tracing, a
scooter with a pizza box. All art is procedural (Phaser Graphics + canvas
textures generated at real resolution) — nothing pixelated, no upscaled
bitmaps.

Difficulty follows `plan-dificultad.md` (in the round-1 delivery pack): par =
optimal solution × 1.10, wind from level 6, trampoline from 8, turbo from 10,
moving bridge from 12, dual delivery from 18, bouncy ink from 23,
anti-trivial tests (straight bridge, 0 px, par band, ink dominance).

## Run

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production -> dist/
npm run build:test # test build (window.__game handle) -> dist-test/
```

## Test

```sh
node tools-local/validate-levels.mjs  # 30 levels: par, slopes, coins, anti-trivial (no browser)
# serve the test build on :8931, then:
node tools-local/test-game.mjs        # smoke + all 30 solution playbacks (needs Chromium)
```

## Stack

Phaser 3.90 + TypeScript + Vite, Matter physics, Playgama Bridge 2.4.2.
EN first, ES second. PEGI 3.
