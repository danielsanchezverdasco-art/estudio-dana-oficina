# Skills usadas — Seagull Attack round 1

**Rule (order 15/11 11:32, issues #4–6): only the 66 skills in
`comunicacion-ias/kit/skills/` — nothing outside, ever.**

## Audit (15/11, verified against the repo tree, main 534c8314)

- Official list: **66 SKILL.md files** in `comunicacion-ias/kit/skills/`
  (11 arte + 13 threejs nested + 6 competencia + 11 marketing + 25 pro).
- Skills applied in this round: **49 — all 49 are inside the 66.
  Zero outside.**
- Not used (17): the 13 `threejs-*` skills (the game is 2D Phaser, no
  Three.js), `instagram-seo`, `playgama-metrics-snapshot` (metrics need
  Playgama access, not granted yet), `social`, `tiktok-growth`.
- Execution tools are not skills: image generation (for
  `create-game-assets` / `sprite-gen` / `art-bible`), Playwright +
  Chromium (for `smoke-testing-web-games` /
  `probing-web-game-mechanics`), ffmpeg + PIL (for `playgama-game-video`
  filming and cover work), the GitHub API (branches + PRs per
  GUIA-OFICINA.md). No tool was used as a substitute for a skill.
- Cross-references inside the 66 that point OUTSIDE the list were NOT
  followed (e.g. `youtube-publishing-and-metadata` cites `brand-profile`,
  WoopSocial and `scheduling-and-queue`; `viral-reverse-engineering`
  cites `competitor-analysis` and `tiktok-script`). Only the skill's own
  framework was applied.
- The studio docs (GUIA-OFICINA.md, manual/, kit norms and brief) are
  the task's own instructions, not skills.

## Core (read in full, applied directly)

| Skill | What it decided here |
|---|---|
| playgama-bridge | Bridge 2.2.0+ required; `initialize()` before the engine; `platform.language` read once; save ONLY via `bridge.storage`; `game_ready` only when the first frame is playable; hide unsupported features via Bridge flags; interstitial config in `playgama-bridge-config.json`. Integration: @playgama/bridge 2.4.2 Vite plugin, mode 'local'. |
| playgama-publish | Covers from real gameplay screenshots (never generated art); 3 sizes (800×800, 1080×1920, 1920×1080); seal on Playgama covers, never on -youtube; listing fields (description / howToPlayText / story / category by core mechanic); nothing published without Daniel's approval + test. Category is a candidate (Puzzle) until `get_game_categories` can be read — no Playgama access yet. |
| localize | EN source, string tables with context; ES only for es/es-MX; language from `platform.language`, manual EN/ES toggle. |
| save-systems | Save shape (stars, coins, unlocked, streak, daily, shop); bridge.storage only, in-memory fallback if Bridge is absent, never direct localStorage. |
| phaser-core | Phaser 3.90.0 (the manual mandates Phaser 3; the skill targets 4.2 — 3.90 is the newest 3.x). RESIZE scale mode, scene lifecycle, input plugin. |
| input-systems | Hit areas in local coordinates (0,0,w,h) — the container-offset fix came from here; pointerdown/move/up for drawing; `topOnly` behaviour of the pause-panel dim. |
| mobile-games | Mobile-first 390×844; main buttons ≥88 px; touch-first input; portrait + landscape + desktop. |
| game-ui-ux | Palette, Lilita One + Nunito, button volume edge + press squash, HUD layout (timer, crumbs, coins, pause, ink bar). |
| smoke-testing-web-games | The test suite: 0 console errors, centre + 4 corners of every button, a tap outside, EN + ES runs, portrait + landscape, save after reload, zip measured, `window.__` grep. |
| game-quality-gates | The fixed rules from CONTROL-CALIDAD.md as gates (Bridge first script, game_ready, bridge.storage, seal placement, official hand, zip ≤5 MB, no `window.__*`, no external links/analytics, illustrated interactive menu, level-1 tutorial). |
| review-game | Peer-review frame for the round (what the other reviewer checks). |
| thumbnail-design | Cover composition: title in the game's own font, focus point kept, seal ≥60 px, never in the bottom 20%. |
| playgama-game-video | Filming with Playwright + ffmpeg (the repo's film.mjs scripts are not in this repo); GIF 8–10 s, ≥12 fps, ≥360 px, ending in victory. |
| youtube-shorts | Short structure (hook → body → CTA), ~30 s vertical, keyword-rich title, loop-aware ending. |
| youtube-publishing-and-metadata | INDEX framework for the Short metadata (title keyword-first, description above the fold, tags led by the primary keyword, category + privacy, `madeForKids` truthful = **false** — not kids' content per the 15/11 order). |
| hook-writer | The three hooks + the picked hook's wording ("Stop drawing squares. The gulls worked it out."). |
| designing-mini-games | The draw-to-protect concept, 10 s hold, 3-crumbs stakes, one-mechanic depth. |
| difficulty-and-balancing | The level curve (speed +8/level, gulls +1 per 2 levels, ink −20 per 5, wind +~0.1 per 5) and the anti-square ink math. |
| level-design | 30 levels, teach → test → twist every ~5, map with a winding path, chest every 3 levels, daily level. |
| onboarding-and-teaching | Level-1 tutorial with the official hand + two hints; hints fade on first draw. |
| game-design-fundamentals | The core loop (draw → protect → survive → earn → unlock) and the win/lose stakes. |

## Secondary (digested 15/11, rules applied)

- art-bible, create-game-assets, sprite-gen: beach/gull/sandwich/pelican/crab/coin/chest art on pure magenta, chroma-keyed with PIL; covers from real screenshots only (the generated keyart stays an unused spare).
- game-feel, game-feel-and-juice, game-juice, juice-audit: one juice tier per event (small 0.15 / medium 0.4 / large 0.8 trauma, hit-stop 0.05/0.12 s, real-time restore).
- playtest-report, evaluating-gameplay-balance: the balance probes (idle fails, box never closes, bounce protects, win saves) — see filtro-jugabilidad.md.
- performance-optimization, web-game-performance: update-loop cost measured (0.06–1.42 ms/frame); SwiftShader FPS reported as environment, not as a game metric.
- audio-design: WebAudio synth (no audio files): buses, squawk/bounce/coin/win/fail/chest/crumb/click/pop, draw noise, sea ambient; muted by platform/user/ad.
- art-direction-and-readability, auditing-game-screen-readability: the visual filter (filtro-visual.md) — text never overflows or overlaps; the ES title auto-fit and the landscape menu came from this pass.
- camera-systems, directing-game-visuals: the side-by-side comparison with Metro (metro.webp / barista.webp as reference; `referencia-estilo-metro.png` is not in this repo — noted as a gap).
- game-docs, game-engagement-ideas, pacing-and-the-player-journey: the round docs, chest/streak/daily retention loop, teach → test → twist pacing.
- phaser-arcade-physics, physics-tuning: gull velocity reflection on the segment normal (real bounce, not a despawn).
- probing-web-game-mechanics: the `window.__game` debug handle, TEST BUILD ONLY, tree-shaken from production (verified: 0 occurrences in the production bundle); the explicit decision to probe mechanics instead of smoke-testing.
- shader-programming: N/A (no shaders in this game).
- styling-web-game-typography: Lilita One + Nunito, licensed in `public/licenses/` + THIRD_PARTY_LICENSES.md (OFL 1.1 texts included).
- ab-testing: the three-hook test in the Short script (pick the winner by the checklist, not by taste).
- virality: the 8-point hook checklist applied to all three Short hooks.
- viral-reverse-engineering: the teardown method (real observable signals, mechanism not surface, counterfactual, replicability check) — applied to Save The Dog.

## Fixes that came from the skills (not from taste)
- Container hit-area offset (input-systems): buttons missed their corners until the hit area was set to (0,0,w,h) / Circle(r,r,r).
- The `window.__game` handle exists only in the test build (probing-web-game-mechanics): production zip verified free of `window.__`.
- Fonts licensed, not just downloaded (styling-web-game-typography).
- Covers from gameplay, never generated art (playgama-publish) — the generated cover-keyart.jpg is an unused spare.
