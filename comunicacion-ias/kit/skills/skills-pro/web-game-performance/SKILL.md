---
name: web-game-performance
description: Find and fix why a web game runs slowly, from numbers instead of adjectives - measure frame time, JS time per frame, draw calls and triangles after the warm-up, then fix in the right order (JS first, then draw calls, then the GPU), cap the frame rate at 60 on touch devices, and keep automatic quality downgrade out of the first seconds. Use it whenever a web game (three.js, Babylon, PlayCanvas, Phaser, plain WebGL or canvas) lags, stutters, drops frames, heats a phone or drains its battery, when the developer says it is slow or laggy on mobile, before adding adaptive quality or graphics settings, and when the developer asks to measure, profile or check performance. It runs the game to measure it (headless Chrome, a probe on a phone) only when the developer asks for that check. Asset size and load time are web-game-assets.
license: Apache-2.0
---

# Performance of a web game

**Ask for numbers, not adjectives.** "It lags on my phone" starts with questions, not a change: which device, how many
frames a second, how many milliseconds of JS in a frame, how many draw calls.

**Running the game is on request.** Measuring with `perf.mjs`, the probe on a phone, screenshots and playthroughs take
time and a running game: do them only when the developer asks to check, measure or profile performance. Otherwise,
apply sections 2 to 4 as you write and review the code (the order of fixes, the draw-call habits, the 60 fps cap, the
warm-up rule), and say what stays unmeasured. When the developer has asked for a measurement, measure before and after
every change on the same setup, and revert a change that doesn't move the numbers.

## 1. Measure, after the warm-up (when asked)

The first 5–10 seconds are not the game's real speed: shaders compile and the first meshes are built and uploaded. The
same phones reach a normal frame rate afterwards. Never judge performance inside that window.

**On this machine:** `scripts/perf.mjs` opens the game in headless Chrome, waits out the warm-up, and measures.
```bash
node scripts/perf.mjs --url http://localhost:5173 --ready "window.game && window.game.ready" --phone --json before.json
# change one thing, then
node scripts/perf.mjs --url http://localhost:5173 --ready "..." --phone --compare before.json
```
- `--phone` is a 390x844 touch screen at pixel ratio 3 with a 4x slower CPU. It is an approximation; compare runs with
  each other, not with a real phone.
- `--setup scene.js` runs JS once the game is ready (start a level, skip the menu, spawn the busiest scene): measure
  the moment that is slow, not the title screen.
- It needs puppeteer in the folder it runs from (`npm i -D puppeteer`). Without a GPU, WebGL needs
  `CHROME_ARGS="--enable-unsafe-swiftshader"`, and the GPU's numbers then mean nothing.

**On a real phone:** copy `scripts/probe.js` into the dev build, load it first in `<head>`, and open the game with
`?perf` in the URL. A small overlay shows the frame rate, frame time, JS time and draw calls after the warm-up. Remove
it from release builds.

**From players:** if the game sends Playgama's `performance_sample` telemetry, `playgama-metrics-snapshot` reads it.
Its distributions describe samples, not players, and under 30 sessions it says nothing reliable.

What `perf.mjs` and the probe report:

| Number | What it says |
|---|---|
| Frame time p50 / p95 / p99 | How long frames take; p95 and p99 are the hitches players feel |
| JS per frame p50 / p95 | Main-thread time inside the game's frame callbacks: update, physics, AI and the engine's draw submission |
| Draw calls | WebGL draw calls a frame, counted for any engine |
| Triangles | What those calls drew |
| Long tasks | Main-thread blocks over 50 ms, inside or outside frames |

## 2. Fix in this order

**1. JS above 10 ms a frame: fix JS first.** While a frame spends more than 10 ms in JS, touching graphics settings is
pointless: lowering resolution or shadows won't make the update loop faster. Profile it (Chrome's Performance panel,
on the slow scene, after the warm-up) and fix the hottest functions. Usual causes: allocating objects and arrays every
frame (garbage collection hitches), physics on too many bodies, pathfinding or searches every frame instead of on
change, DOM or text updates every frame, `console.log` in the loop.

**2. Draw calls, not polygons.** The bottleneck is usually the number of meshes, not the geometry: a scene of tens of
thousands of triangles in hundreds of meshes can run worse than one twice as heavy merged into a few. As a starting
budget, about 100 draw calls a frame on mid-range phones; measure the game's own.
- **Merge** static scenery that shares a material into one mesh (three.js: `BufferGeometryUtils.mergeGeometries`).
- **Instance** repeated objects (trees, coins, enemies): three.js `InstancedMesh` or `BatchedMesh`, Babylon thin
  instances, PlayCanvas batching.
- **Share one material.** `material.clone()` per object to change a colour costs a draw call each; use vertex colours,
  instance colours or one palette texture (`web-game-assets`).
- **Shadows and lights:** every shadow-casting light draws its casters again. Fewer casters, one shadow light, baked
  shadows for static scenery.
- **Culling:** objects off screen or far away shouldn't draw at all.

**3. Then the GPU.** Slow frames with little JS and few draw calls are the GPU: cap the pixel ratio
(`renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, 1.5 on weak phones), cut post-processing, overdraw from
stacked transparent layers, and shadow-map size. Triangle counts come last.

## 3. Cap the frame rate at 60 on touch devices

A 120 Hz phone runs the game loop twice as often as a 60 Hz one: twice the work for no gameplay benefit, then heat
and throttling. Cap at 60 on touch devices, inside the loop, before update and render:

```js
const coarse = matchMedia('(pointer: coarse)').matches; // phones and tablets
const minFrame = coarse ? 1000 / 60 : 0;
let next = 0;
function loop(now) {
  requestAnimationFrame(loop);
  if (now < next - 1) return;               // too early for the next 60 Hz frame: 120 Hz skips every other one
  next = Math.max(next + minFrame, now);    // stays on a 60 Hz grid, so 90 and 144 Hz get 60 too; restarts after a stall
  update(); render();
}
requestAnimationFrame(loop);
```
Engines with their own loop: Phaser's game config `fps: { limit: 60 }`; three.js and Babylon, the same check at the top
of the `setAnimationLoop` or `runRenderLoop` callback. Game logic should use the real elapsed time, not a fixed step
per frame, or the cap changes the game's speed.

## 4. Adaptive quality, never in the warm-up

Automatic quality downgrade must not run in the first 5–10 seconds: it would mistake shader compilation for a slow
phone and drop quality for good on a device that runs the game fine.
- Start judging after the warm-up, on a sustained window (5 seconds or more), never on one slow frame.
- Step down one level at a time, wait a window, look again. Step back up the same way, with a margin, so it doesn't
  flip back and forth.
- Only step down graphics when the GPU is the bottleneck. When JS is above 10 ms, lower quality won't help.
- Remember the level per device, so the next session starts there instead of measuring again.

```js
const WARMUP = 10000, WINDOW = 5000;
let start = null, frames = [], waitUntil = 0;
function judge(now, frameMs, jsMs) {
  start ??= now;
  if (now - start < WARMUP || now < waitUntil) return; // shaders compiling, or just changed a level
  frames.push([frameMs, jsMs]);
  if (frames.length < 120) return;
  const mid = (i) => frames.map((f) => f[i]).sort((a, b) => a - b)[frames.length >> 1];
  const frame = mid(0), js = mid(1);
  frames = [];
  if (frame > 22 && js < 10) { lowerQuality(); waitUntil = now + WINDOW; }      // under ~45 fps, GPU-bound
  else if (frame < 14 && canRaiseQuality()) { raiseQuality(); waitUntil = now + WINDOW; }
}
```

## Hand-off

When you measured: the numbers before and after, on which setup (machine and flags, or the phone), and what changed.
A change that didn't move the numbers is reverted, not kept "just in case". When you didn't: what you changed and why,
that it is unmeasured, and that `perf.mjs` or the probe can check it if the developer wants. If the real-phone numbers
are unknown, say so.
