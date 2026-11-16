# Skills used — Traffic Chaos: New York Rush, round 1

Rule (Daniel, 15/11): only the 66 skills from Grok's list in `kit/skills/` + the new
skills from the skills mission. Every SKILL.md applied was read IN FULL. Skills not
applied are justified below — nothing is silently skipped.

## Read in full and APPLIED (16)

| Skill | What it changed in this game |
|---|---|
| `art-direction-and-readability` (skills-pro) | Readability first, personality second, fidelity never. One protagonist (the light) + one danger (the empty ring) + one reward (the cleared car). Every palette colour is a gameplay role (see `art-bible.md` §4). |
| `directing-game-visuals` (skills-pro) | The mockup is the reference; the attract crash is the first frame; the city is the character, not the background. |
| `phaser-core` (skills-arte) | Rules in plain modules (no Phaser import) so they run under `node --test`; one Game, one Scene per screen; run state reset in `init()`. |
| `playgama-bridge` (skills-pro) | CDN script first in `<head>`, `initialize()` before the engine, Storage only for saves (never localStorage), `platform.language` → EN default, mute if audio disabled, `game_ready` only when playable, interstitial at natural pauses, rewarded only in `rewarded` state. |
| `game-feel-and-juice` (skills-competencia) | Fix feel before juice; juice ceiling Medium–High (Kao 2020, N=3,018 — Extreme hurts); one feedback moment per action, bounded. |
| `difficulty-and-balancing` (skills-pro) | No dominant option (Meier: a choice with an obvious correct answer is not a decision); the balance harness simulates to enforce it (idle/mash/hold-only weak, greedy in band, precise at the ceiling). |
| `level-design` (skills-pro) | Teach first where failure is cheap (level 1: patience 12 s, spawn 2.0 s, quota 15); sawtooth pacing across 30 levels; rest before spikes; no soft-locks (the tutorial's first light is always tappable). |
| `onboarding-and-teaching` (skills-pro) | The best tutorial is a level: one thing at a time, working memory ~3 items; 4 steps, official hand, zero text, skippable, never repeated, active 5,6–8,6 s (<10 s). |
| `playtest-report` (skills-arte) | The balance harness IS the playtest report's data source (30 levels × 5 policies × 3 seeds); the browser harness adds the human-eye checks (touch corners, attract, pause, map, shop). |
| `save-systems` (skills-pro) | Versioned JSON (`traffic_chaos_save_v1`), atomic temp + `.bak` + rename, defensive load with migration; Bridge Storage only. |
| `localize` (skills-pro) | EN source, string tables with context + char limits, no hardcoded strings, no text in images. |
| `input-systems` (skills-pro) | Named actions by intent (toggle / boost / swipe / pause), edge vs held, buffered discrete presses, radial deadzone on the swipe. |
| `art-bible` (skills-arte) | The 9-section bible in `art-bible.md` (identity, mood, shape, colour, character, environment, UI/HUD, asset standards, references). |
| `game-ui-ux` (skills-arte) | Anchors/containers, one scaling policy (FIT 390×844), safe-area inset, focus on open, event-driven HUD (never polled), ≥88 px main buttons / 48 px minimum, 4.5:1 text contrast. |
| `smoke-testing-web-games` (skills-pro) | Load → idle → input phases; fail on console errors; the browser harness (`tools-local/test-game.mjs`) follows it. |
| `web-game-performance` (skills-pro) | JS first (>10 ms/frame), then draw calls (~100 budget on mid phones), then GPU; cap 60 fps on touch (`fps: { target: 60, limit: 60 }`); no adaptive quality in the first 5–10 s warm-up. |

## Consulted at index level (applied where relevant, justified in the round report)

`game-design-fundamentals`, `evaluating-gameplay-balance`, `game-quality-gates`,
`game-polish-audit`, `juice-audit`, `review-game`, `thumbnail-design` (covers),
`playgama-game-video` + `youtube-shorts` (Short), `hook-writer` (listing),
`game-docs`, `audio-design`, `create-game-assets`, `sprite-gen`, `mobile-games`,
`performance-optimization`, `designing-mini-games`, `pacing-and-the-player-journey`,
`game-engagement-ideas`, `auditing-game-screen-readability`,
`probing-web-game-mechanics`, `playgama-publish`, `playgama-metrics-snapshot`,
`ab-testing`, `social`, `styling-web-game-typography`, `viral-reverse-engineering`,
`virality`, `youtube-publishing-and-metadata`, `instagram-seo`, `tiktok-growth`.

## NOT applied, with reason (honest)

| Skill | Reason |
|---|---|
| `threejs-skills` | The game is 2.5D vector art in Phaser; no 3D scene exists. |
| `shader-programming` | No shaders: the neon/glow is drawn with Phaser blend modes + alpha gradients. |
| `camera-systems` | Fixed camera: the whole intersection is always on screen (390×844 is the design space). |
| `phaser-arcade-physics` | No physics engine: cars move kinematically along lanes (the rules module is framework-free by design). |
| `physics-tuning` | Same reason — there is no physics body to tune; the movement model is the sim's own (speeds, braking distances, patience). |

## Skills-mission note

Niky's final skills report (mission of 15/11, branch `niky/skills-movil-1511`) had not
landed when round 1 was built. When it lands, Anita installs each new skill herself
following its instructions exactly, and the applicable ones will be applied in round 2.
No skill outside Grok's 66 + the mission was used in round 1.
