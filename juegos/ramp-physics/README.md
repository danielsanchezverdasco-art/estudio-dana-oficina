# Ramp Physics: Ragdoll Crash Test — round 2 (COMIC, option C)

Draw ramps with limited ink, launch a crash-test dummy, chain the
collisions. 30 hand-made levels, a level map, a daily challenge, a streak,
a treasure chest every 3rd level, and dummy skins to unlock.

Round 2 rebuilds round 1 faithful to **option C — CÓMIC**, chosen by Daniel
15/11 ~20:01: thick black outlines, flat premium colour, halftone dots,
speed lines, cream paper with radial rays, a big expressive yellow ragdoll,
hand-drawn crosshatch navy ramps. All art is procedural (Phaser Graphics +
canvas textures generated at real resolution) — nothing pixelated, no
upscaled bitmaps.

Difficulty follows `plan-dificultad-r2.md` (in the r2 delivery pack): par =
optimal solution × 1.10, fans from level 6, dynamite from 12, portals from
18, anti-trivial tests (lazy ramp, 0 px, par band, ink dominance).

## Run

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production -> dist/
npm run build:test # test build (window.__game handle) -> dist-test/
```

## Test

```sh
# serve the test build on :8931, then:
node tools-local/test-game.mjs        # smoke + all 30 solution playbacks
node tools-local/anti-trivial.mjs     # lazy ramp / 0 px / par band / dominance
node tools-local/probe-level.mjs 6 12 18  # trace one level
```

## Stack

Phaser 3.90 + TypeScript + Vite, Matter physics, Playgama Bridge 2.4.2.
EN first, ES second. PEGI 3.
