# Skills usadas — Ramp Physics round 1

**Rule (order 15/11 11:32, issues #4–6): only the 66 skills in
`comunicacion-ias/kit/skills/` — nothing outside, ever.**

## Audit (15/11, verified against the repo tree, main f2084ef)

- Official list: **66 SKILL.md files** in `comunicacion-ias/kit/skills/`
  (11 arte + 13 threejs nested + 6 competencia + 11 marketing + 25 pro).
- Skills applied in this round: **47 — all 47 are inside the 66.
  Zero outside.**
- Not used (19): the 13 `threejs-*` skills (the game is 2D Phaser, no
  Three.js), `ab-testing` (no formal A/B run), `instagram-seo`, `social`,
  `tiktok-growth` (no social posting yet), `playgama-metrics-snapshot`
  (metrics need Playgama access, not granted yet),
  `shader-programming` (no custom shaders).
- Execution tools are not skills: image generation (for
  `create-game-assets` / `sprite-gen` / `art-bible`), Playwright +
  Chromium (for `smoke-testing-web-games` /
  `probing-web-game-mechanics`), ffmpeg + PIL (for `playgama-game-video`
  filming and cover work), the GitHub API (branches + PRs per
  GUIA-OFICINA.md). No tool was used as a substitute for a skill.
- Cross-references inside the 66 that point OUTSIDE the list were NOT
  followed. Only each skill's own framework was applied.
- The studio docs (GUIA-OFICINA.md, manual/, kit norms and brief) are
  the task's own instructions, not skills.

## Core (read in full, applied directly)

- `skills-pro/phaser-arcade-physics` — established that a ragdoll with
  hinges, slopes and rotated polygons needs **Matter**, not Arcade.
- `skills-pro/physics-tuning` — fan forces (0.003 × force), restitution
  per ink, rise-speed cap, horizontal drift cap, stillness threshold.
- `skills-pro/playgama-bridge` — Bridge first script in head, config,
  `initialize()` before the engine, `game_ready` at first playable
  frame, saves only via `bridge.storage`, interstitials at natural
  pauses, audio muted during ads.
- `skills-arte/art-bible` — blueprint style, palette, volumetric dummy,
  premium-art-first bar (Metro comparison).

## Applied

- Arte: `create-game-assets`, `sprite-gen`, `audio-design` (synth SFX:
  boing, crash, explosion, portal, whoosh), `game-feel`, `game-ui-ux`,
  `mobile-games` (390×844, touch), `performance-optimization` (zip size),
  `phaser-core`, `playtest-report`, `evaluating-gameplay-balance`
  (ink budgets, pars, star thresholds).
- Calidad: `art-direction-and-readability`,
  `auditing-game-screen-readability` (found + fixed the ink-decimal
  overflow and the landscape menu head/subtitle overlap),
  `game-feel-and-juice`, `game-juice`, `juice-audit`,
  `game-polish-audit`, `game-quality-gates`, `review-game`.
- Diseño: `camera-systems` (camera zoom to fit), `designing-mini-games`,
  `difficulty-and-balancing` (3 arcs: pits 1–10, fans 11–20, dynamite +
  portals 21–30), `directing-game-visuals`, `game-design-fundamentals`,
  `game-docs`, `game-engagement-ideas` (streak, daily, chest, shop),
  `input-systems` (touch drag, local hitAreas), `level-design`
  (30 hand-designed levels, each with a verified solution),
  `localize` (EN first, ES second), `onboarding-and-teaching`
  (L1 tutorial with the official hand), `pacing-and-the-player-journey`.
- Técnica: `playgama-publish` (covers, listing, zip ≤5 MB),
  `probing-web-game-mechanics` (probe-level.mjs, solution playback),
  `save-systems` (Bridge storage), `smoke-testing-web-games`
  (test-game.mjs, 56 checks), `styling-web-game-typography`
  (Lilita One, title auto-fit), `web-game-performance`.
- Marketing: `playgama-game-video` (film, GIF, Short),
  `hook-writer`, `virality`, `youtube-shorts`,
  `youtube-publishing-and-metadata`, `thumbnail-design` (covers),
  `viral-reverse-engineering` (teardown with real sourced data).
