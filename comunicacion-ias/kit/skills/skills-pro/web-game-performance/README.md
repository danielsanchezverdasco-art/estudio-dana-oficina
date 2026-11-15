# web-game-performance

An agent skill that makes a slow web game fast from numbers instead of guesses: frame time, JS time per frame and
draw calls, measured after the warm-up, then fixed in the order that pays off.

Ask your agent "the game lags on my phone", "why is it slow?" or "make it run at 60 on mobile".

## What the agent does

1. Asks for numbers: which device, how many frames a second, how much JS a frame, how many draw calls.
2. Fixes in order: JS above 10 ms a frame first, then draw calls (merge, instance, one material), then the GPU.
3. Caps the frame rate at 60 on touch devices, so a 120 Hz phone doesn't do twice the work and throttle.
4. Keeps adaptive quality out of the warm-up.
5. **Only when you ask it to check performance**, runs the game and measures it: the slow scene in headless Chrome with
   `scripts/perf.mjs`, after a 10-second warm-up (shader compilation and first meshes are not the game's real speed),
   before and after each change. Otherwise it applies the rules as it writes the code and tells you what is unmeasured.

For a real phone, `scripts/probe.js` in a dev build shows the same numbers in an overlay (`?perf` in the URL).

## What you need

Node 18 or newer and puppeteer (`npm i -D puppeteer`) for `perf.mjs`, on macOS, Linux or Windows. The probe needs
nothing.

## Install

This skill lives in [Playgama/gamedev-skills](https://github.com/Playgama/gamedev-skills), in its own folder under
`skills/`.

- **Claude Code, as a plugin** (all the skills at once):
  ```
  /plugin marketplace add Playgama/gamedev-skills
  /plugin install gamedev-skills@playgama
  ```
- **Any agent that reads skills:** copy the folder into its skills folder and keep the folder's name. The
  [repository's README](https://github.com/Playgama/gamedev-skills#install) has the folder for each agent and the
  commands for macOS, Linux and Windows.

`web-game-assets` and `web-game-performance` go well together: the art choice is the performance choice.

## What's inside

| Path | What it is |
|---|---|
| `SKILL.md` | The instructions the agent follows |
| `scripts/perf.mjs` | Measures a game in headless Chrome after its warm-up; saves and compares runs |
| `scripts/probe.js` | The frame probe for any WebGL or canvas engine: frame time, JS time, draw calls, triangles, long tasks; an overlay on a phone |

## Licence

The code and texts are licensed under the
[Apache License 2.0](https://github.com/Playgama/gamedev-skills/blob/main/LICENSE).
