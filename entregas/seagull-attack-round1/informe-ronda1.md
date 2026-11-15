# Informe ronda 1 — Seagull Attack: Save the Sandwich

**Game:** Seagull Attack (ES: «¡Que no me roben el bocata!»). Slug:
`seagull-attack`. Round 1 (handover test, Anita).
**Branch:** `anita/prueba-traspaso-seagull-attack` (from main 534c8314).
**PR:** [URL added after opening — see the commit after this report]
**Date:** 2026-11-15. Author: Anita (Dana Games).
**Status:** pack ready for peer review (Niky). NOT published anywhere:
no Playgama upload, no YouTube upload — both need Daniel's APROBADO
and Daniel testing the final version first (order 15/11 11:32).

## 1. Idea chosen and why
From `ideas-acumuladas.json` (22 aptas): «¡Que no me roben el bocata!»
(viral 5, the highest in the list). Genre: draw-to-protect — draw a line
to shield a sandwich on a beach towel from diving gulls, survive 10 s.
Why: the genre is proven at tens of millions of plays (DOP 4 41M, Save
The Pets 40M, Thief Puzzle 95M — playables.games/best/, updated
2026-11-14); the theme (beach + gulls + sandwich) is a joke everyone
gets in 3 seconds; and the genre's best (Save The Dog) has a documented
weakness we beat — see teardown.md. Not one of the 6 in progress
(Mudanza Extrema, Metro Nightmare, Estampida, Barista, fútbol de papel,
Cofre del Doblón) and not one of the three extra games from the 10:45
plan change. Different genre from all of them.
EN title verified free (15/11): no known game called «Seagull Attack»
(only a TES phonics card game + Blood Bowl tabletop rules); nothing
called that on Playgama; «Save the Sandwich» only a tiny itch.io jam
game + a Wii party minigame.

## 2. What was built
Phaser 3.90.0 + TypeScript + Vite. EN first, ES second (toggle in the
menu, language from Bridge `platform.language`). Mobile-first 390×844,
works in landscape (844×390) and desktop (1280×720). 30 levels (teach →
test → twist every ~5: wind L6+, sides L11+, umbrella L16+, pelican
boss L10/20/30), map with stars, coins, chest every 3 levels, daily
challenge (2× coins), streak, cosmetics shop (coins only, no real
money). Bridge 2.4.2 (Vite plugin, mode 'local'): first script in
`<head>`, `playgama-bridge-config.json`, `game_ready` after the first
playable frame, save ONLY via `bridge.storage`, interstitial every 2nd
completion (never L1, never first retry), rewarded «Extra ink» on the
fail screen if supported, audio silent during ads.
**Zip:** `seagull-attack-round1.zip`, **1,646,669 bytes (1.57 MB)** — well
under the 5 MB limit. Verified by unzipping: `index.html` at the root,
`assets/`, `playgama-bridge.js` (383 KB, unmodified), `playgama-bridge-config.json`,
`licenses/` (OFL/LGPL/GPL/MIT texts). `window.__` grep on the game
bundle + index.html = **0**; `__game` = 0. (Note: `playgama-bridge.js`
itself contains `window.__playgama_devvit` ×4 — the official SDK's own
Devvit platform detection, not a test handle; the SDK ships unmodified.)

## 3. Tests (test-game.mjs, 390×844, real touch via CDP)
**Run 10 (15/11 ~11:20): 35/35 PASS, 0 console errors, 0 failed
requests, EXIT=0.** Full log: `/tmp/test-run10.log` (local).
- Menu loads; PLAY centre + 4 corners start the game; a tap outside
  does nothing; sandwich anchor (195,464); drag reaches the game (26
  events), draws 24 segments, spends ink 420 → 178.
- Gull bounces off the line (state 'fleeing', crumbs 3); a drawn box
  never closes (800 px requested, 420 px ink, inkLeft 0); idle loses a
  crumb (3 → 2 → 0, level lost); level 1 wins (3 stars, +25 coins,
  unlocked 2); save persists after reload.
- ES run: toggle to ES, game starts, pause opens, quit to menu, back
  to EN. Map opens, node starts level 1, pause opens from the map
  game, quit to menu, shop opens. Landscape menu + game, desktop menu.
- Performance: update-loop cost 0.12 ms/frame (5 gulls, 199 segments)
  — far inside the 16.7 ms budget. Visible FPS in headless Chromium is
  3.6–7.1 fps (SwiftShader software rasterization on 1.5 shared CPUs;
  blank-page baseline 60 fps) — report only, not a game metric.
- 10 test runs (runs 1–10): 8 bugs found and fixed, see §5.

## 4. Deliverables in entregas/seagull-attack-round1/
- `seagull-attack-round1.zip` (1.57 MB, verified above).
- `covers/`: 6 covers from REAL gameplay screenshots (PIL, title in
  Lilita One): 3 Playgama (800×800, 1080×1920, 1920×1080, WITH seal
  ≥60 px mascot, top corner, never bottom 20%) + 3 `-youtube` (same
  sizes, NO seal). The generated cover-keyart.jpg is an unused spare.
- `screenshots/`: 11 captures at 390×844 (9 portrait + 2 landscape
  844×390): menu EN, tutorial ES, line, bounce, pelican L10, victory,
  fail, map, shop, landscape menu, landscape gameplay.
- `seagull-attack-gameplay.gif`: 9.0 s, 12 fps, 360×779, 2.41 MB,
  ends in victory (last 9 s of the filmed level-1 win).
- `listing.txt` (Playgama form EN + ES translation + YouTube metadata:
  title 51 chars, tags led by «seagull attack», category Gaming,
  madeForKids=false — NOT kids' content, PEGI 3).
- `teardown.md` (≥3 points beating Save The Dog, with live sources).
- `filtro-visual.md` (Metro side-by-side; `referencia-estilo-metro.png`
  is NOT in this repo — comparison used `art/covers/metro.webp` /
  `barista.webp`).
- `filtro-jugabilidad.md` (balance probes + open questions for the
  peer review: L10 pelican fairness, L16 umbrella readability, L26–30
  difficulty).
- `skills-usadas.md` (49 skills, all inside the 66 — audit included).
- `short-guion.md` (Short script, 3 hooks + 8-point checklist; the
  video is NOT recorded yet — the footage is preserved at
  `~/workspace/dana-games-traspaso/film-raw/`; the Short must not be
  published without Daniel's approval + test).
- `informe-ronda1.md` (this file).

## 5. Bugs found by the tests (all fixed in round 1)
1. Container hit-area offset (Phaser offsets by -displayOrigin): every
   container button missed its corners. Fix: hit Rectangle(0,0,w,h) /
   Circle(r,r,r).
2. Pause button dead after quit-from-pause: `pausePanel` (and `hand`,
   `hintText`, `spawnEvent`, `windFx`) not reset on scene restart
   (Phaser reuses the scene instance). Fix: reset in `create()`.
3. Tutorial hints overlapped in portrait + stayed forever if the player
   drew before 5.2 s. Fix: one text with line spacing; fade on first draw.
4. ES title overflowed + landscape menu put LEVELS/SHOP below the fold.
   Fix: title auto-fit + a real landscape layout.
5. ES title's first line slid behind the ES toggle; landscape title
   slid behind the daily pill (run 9). Fix: title max width (portrait
   w*0.64), landscape title left-aligned, sun moved (run 10).
6. Map title overlapped the top node. Fix: header band.
7. Shop prices overlapped the section labels. Fix: tags below the cards.
8. Teardown errors: the box "fails from level 6" (wrong — it fails from
   level 1, 700 px needed vs 420 max) and the pelican "steals 2 crumbs"
   (wrong — the code steals 1; the levels.ts comment was corrected too).
9. Test-harness issues (not game bugs): the drag race (slow-loop settle
   + input verification), the bounce check timing (poll on game time),
   the idle check (poll on game time), the quit-retry landing on the
   menu's daily button, the favicon aborted by reloads (probe12 proved
   the file serves 200).

## 6. Skills audit (order 15/11 11:32)
Only the 66 skills in `comunicacion-ias/kit/skills/` were used: 49
applied, all inside the 66, zero outside (verified against the repo
tree, main 534c8314; the 13 `threejs-*` + instagram-seo +
playgama-metrics-snapshot + social + tiktok-growth were not used).
Cross-references inside the 66 that point outside the list were NOT
followed. Full list + per-skill decisions: skills-usadas.md.
Tools (image generation, Playwright, ffmpeg, PIL, GitHub API) are
execution tools implementing listed skills, not skills.

## 7. Plan change 15/11 10:45 (noted as ordered)
The handover test stayed in force. Noted for the record: Anita + Niky
now also carry Cofre del Doblón, Estampida en las Rebajas and El
Barista del Caos; Metro Nightmare r10 was rejected only for the English
rule, r11 is in progress; Moving Mayhem is being published on Playgama,
behind it Metro Nightmare (r11) and Scribble Striker; new rule: premium
art FIRST, before programming, and nothing is shown without comparing
it side by side with Metro; until Friday 20/11 the internal team is
barely used and the priority is making money. None of those three games
nor any in-progress game was chosen as the test idea.

## 8. Orders 15/11 11:32 (noted as ordered)
SOLO the 66 skills (audited above). Nothing to Playgama/YouTube
without Daniel's APROBADO and without Daniel testing the final version
first (nothing uploaded). YouTube is NOT kids' content
(madeForKids=false in the listing). PEGI 3 (in the listing). English
first, Spanish second (the game, the listing, the Short script).

## 9. What's missing / what Daniel must decide
- **Accesses (not granted yet):** Playgama (invite to the team +
  `get_game_categories` to confirm the Puzzle category + upload the
  zip + covers); YouTube Studio (Editor role on the Dana Games channel
  for the Short). GitHub: Anita/Niky as collaborators of
  estudio-dana-oficina (the PR is opened from a branch; merge needs a
  collaborator). Ask Daniel by private channel, never in the repo.
- **Decisions for Daniel:** (1) APROBADO of this round after Niky's
  peer review, then test the final version himself before any publish;
  (2) the Short video: cut it from the preserved footage, or keep the
  script only for now; (3) the L26–30 difficulty question (see
  filtro-jugabilidad.md §6) — hard or impossible, needs his playtest;
  (4) the Tetris-creator GDD (permanent working method, 15/11) — read
  and applied from the next round on; (5) the games 6–10 queue (order
  15/11 11:48: continue with them after the 4 in progress) and the
  24/7 permanent mission — the next build after this test.
- **Kit gaps:** `referencia-estilo-metro.png` is not in this repo
  (filtro-visual.md used metro.webp/barista.webp instead).
- **Source home:** the game source is pushed at `juegos/seagull-attack/`
  (new top-level folder; the repo had no game sources yet). If the team
  prefers another home, say so in the review and it moves.

## 10. Files (branch anita/prueba-traspaso-seagull-attack)
- `juegos/seagull-attack/` — full source (src/, public/, index.html,
  package.json, tsconfig.json, vite.config.ts, THIRD_PARTY_LICENSES.md,
  README.md, tools-local/test-game.mjs + covers.py + film.mjs).
  NOT pushed: node_modules/, dist/, dist-test/, dist-types/, probes.
- `entregas/seagull-attack-round1/` — the round pack (§4).
