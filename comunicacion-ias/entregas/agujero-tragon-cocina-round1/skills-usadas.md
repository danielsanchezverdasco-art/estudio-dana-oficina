# Skills usadas — Kitchen Hole round 1

Rule: ONLY Grok's 66 skills in `kit/skills/` + skills-mission skills.
Each SKILL.md applied was read IN FULL. Skills not applied are listed
with reasons — none skipped silently.

## Read in full and APPLIED (31)

| Skill | Where it lands in this game |
|---|---|
| art-bible | Approved visual target = mockup v2 first; palette roles; hole IS the progress |
| art-direction-and-readability | Palette roles (violet = hole, gold = coins, red = danger/timer); contrast |
| directing-game-visuals | Living menu composition; fridge + hole + croissant staging |
| level-design | 6 blocks, one new toy per block; teaching levels (L5 ladder, L6 pet, L11 golden, L16 movers, L21 fridge) |
| difficulty-and-balancing | Growth-ladder math; timer 60→74 s; star thresholds; anti-trivial policies |
| onboarding-and-teaching | L1 hand + ghost path; one-line hints only on first-appearance levels |
| game-feel-and-juice | Juice tiers (small/medium/large), +value pops, flying coins, trauma on big eats |
| create-game-assets | Procedural 4× canvas textures; no upscaled bitmaps |
| phaser-core | Pure-logic rules module (no Phaser import), testable under node |
| input-systems | One verb = drag, continuous held input; pointerup stops the hole |
| game-design-fundamentals | Win = CLEANUP; stars from time + goldens; pet as score threat only |
| evaluating-gameplay-balance | 5-policy harness; exploratory ratio; verdict "NOT YET MEASURED" without human playtest |
| game-engagement-ideas | (partially) — daily challenge, streak, chest, shop; telemetry-gated parts deferred (see not applied) |
| pacing-and-the-player-journey | New toy per block; finale L30 combines everything |
| designing-mini-games | Idle/mashing must lose (0/30); sqrt-style scaling via growth ladder |
| save-systems | Versioned JSON, Bridge storage only, atomic write path |
| smoke-testing-web-games | Browser smoke (smoke.mjs) — menu + 4 levels + screenshots |
| playtest-report | Template for the pending 3-tester human playtest |
| playgama-bridge | Bridge 2.4.2, initialize() first, game_ready from Menu, interstitial every 2nd win never L1, rewarded only in 'rewarded' state |
| game-ui-ux | Anchors, safe area, event-driven HUD, text ≥13 px (smallest: pet name), contrast 4.5:1 targets |
| mobile-games | 390×844 portrait first, buttons ≥88 px (PLAY), 48 px min (icon buttons 48 px diameter) |
| audio-design | Buses Master/Music/SFX, gulp pitch by hole size, SFX pitch variation |
| localize | EN source, string tables with context; ES ~30% longer kept short |
| game-feel | (see game-feel-and-juice — same tier system applied) |
| game-juice | (see game-feel-and-juice) |
| juice-audit | Juice budget: small eats = pop only; ≥25 = small shake; ≥100 = medium; win = large |
| game-polish-audit | Self-review checklist in informe-ronda1.md |
| game-quality-gates | Single cleanup entry (win = CLEANUP), delta time, save versioning, pre-deploy checklist |
| review-game | Self-review scores in informe-ronda1.md |
| thumbnail-design | Covers: one focal point (hole + fridge), 0–4 words, mobile-legible |
| youtube-shorts | Short 9:16 1080×1920, 15–35 s, opens on gameplay first frame, ≤4 huge words in first 2 s |
| hook-writer | 5–10 candidate hooks scored, one recommended (short-script.md) |
| game-docs | GDD one page, numbers match code (rules.ts constants) |
| auditing-game-screen-readability | Moments-based audit (6 checks) — code inspection this round, real captures pending finisher |
| probing-web-game-mechanics | Test-build-only handle (window.__game, tree-shaken from prod); solution replays |
| web-game-performance | ~100 draw calls budget; hole + shadows redrawn per frame on Graphics (cheap); cap 60 fps |
| performance-optimization | JS >10 ms first; unmeasured → stated honestly in informe |
| styling-web-game-typography | Lilita One display + Nunito body (bundled woff2, OFL) |
| playgama-game-video | GIF 8–10 s ≥12 fps ≥360 px ending in victory; Short script + storyboard |

## NOT applicable, with reasons

| Skill | Reason |
|---|---|
| 13 threejs skills | 2D game, no Three.js |
| playgama-publish, playgama-metrics-snapshot | No publishing in this task; no live traffic |
| camera-systems | Fixed top-down camera |
| shader-programming | No custom shaders |
| physics-tuning, phaser-arcade-physics | No physics engine — pure logic |
| sprite-gen | Code-drawn vector art, not generated sprites |
| ab-testing, instagram-seo, social, tiktok-growth, viral-reverse-engineering, youtube-publishing-and-metadata | Marketing; no live traffic / publishing in this task |
| game-engagement-ideas (telemetry parts) | Needs telemetry — no data yet; applies post-launch |

## NOT in the repo's 66 skills (Niky's external Top-5 picks — NOT installed)

GSAP (`gsap-core`), `game-audio`, `prototype-fast`, `platformer`,
`puzzle`, `game-playtest-squad-skill` are NOT in `kit/skills/` (verified
from the full tree listing). Decision: do NOT install external skills.
Applied in-kit equivalents instead — Phaser tweens for growth (no GSAP
dependency in the template), the template's own WebAudio synth
(audio-design) for the gulp, the simulation harness + policies for the
prototype-fast fun check.
