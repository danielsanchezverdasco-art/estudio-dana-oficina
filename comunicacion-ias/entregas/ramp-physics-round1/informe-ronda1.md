# Informe ronda 1 — Ramp Physics: Ragdoll Crash Test

**Game:** Ramp Physics (ES: «Ramp Physics: Ragdoll Crash Test»).
Slug: `ramp-physics`. Round 1 (juego 6 de la cola, Anita).
**Branch:** `anita/ramp-physics-ragdoll` (from main f2084ef).
**PR:** https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/pull/14
(open, 1 commit, 134 files, +7,740/−4, created 15/11 15:26 CET).
**Date:** 2026-11-15. Author: Anita (Dana Games).
**Status:** pack ready for peer review (Niky). NOT published anywhere:
no Playgama upload, no YouTube upload — both need Daniel's APROBADO
and Daniel testing the final version first (order 15/11 11:32).

## 1. Idea chosen and why
From the queue file (`cola-juegos-6-10.md`, game 6): a physics
sandbox / construction game — draw ramps with limited ink, launch a
crash-test dummy, chain collisions, stars for using less ink.
Levels 1–10 pits, 11–20 giant fans, 21+ reactive dynamite + gravity
portals; blueprint grid style (#f1f5f9), yellow/black dummy
(#facc15/#0f172a). Why: the genre is proven (Happy Glass 280M
installs, Line Rider 34M downloads — teardown.md), but both have a
documented weakness we beat (no goals / ad spam); and no other game
combines draw-to-build + a real 10-body ragdoll + 3 ink types with
different physics. Not one of the 6 in progress and the next in the
queue after the 4 deliveries of 15/11 (user order 11:48: "cuando
acabes continua con estos").

## 2. Design
- **Core loop:** draw a ramp (touch drag) → LAUNCH → the ragdoll
  tumbles/bounces/flies to the checkered flag. One-touch, understood
  at first tap (L1 tutorial: ghost ramp + official hand).
- **3 inks:** steel (solid), bouncy blue (restitution 0.9, a
  trampoline), boost orange (accelerates along the downhill).
- **3 arcs:** pits 1–10 (ramps + gaps + a bounce lesson), fans 11–20
  (lift + drift + walls), dynamite + portals 21–30 (blast + gravity
  flip + ceiling runs).
- **Progression:** 30 hand-designed levels, map, stars (ink vs par),
  streak, daily challenge (day-of-year mod 30 + 1), chest every 3rd
  level, shop (6 dummy skins + Extra Ink), coins.
- **Tetris-GDD method (permanent work method):** every level has a
  hand-designed solution that the test harness plays back — no
  unwinnable level ships (route validation); defeat by softlock
  (the dummy stuck, stillness timeout) is a real, fair lose state.
- **Fair ads:** interstitial every 2nd win, never L1, never first
  retry; rewarded only for Extra Ink; audio muted during ads.

## 3. Art (premium first, vs Metro)
- 6 images generated with Metro (`metro.webp`) as the style reference,
  then processed (chroma-key + despill + WebP): blueprint menu/play
  backgrounds, a 10-part dummy sprite sheet, a props sheet (fan,
  dynamite, portal, flag, star, ink pot), keyart.
- The dummy is volumetric and expressive (helmet, visor, vest, boots);
  the blueprint style is coherent across all screens. The honest gap
  vs Metro is background density (see filtro-visual.md) — a round-2
  note, not a blocker.
- Covers: 6 from REAL gameplay screenshots, title in Lilita One,
  badge on Playgama only (mascot ≥60 px, top corner).

## 4. Code
- Phaser 3.90 + TypeScript + Vite; Matter physics (a ragdoll with
  hinges/slopes needs Matter, not Arcade — phaser-arcade-physics).
- 10-body ragdoll (head, torso, 2× upper arm, 2× forearm, 2× thigh,
  2× shin), constraints stiffness 0.9.
- Bridge 2.4.2 (npm, bundled): first script in head, config,
  `initialize()` before the engine, `game_ready` at first playable
  frame, saves via `bridge.storage`, versioned save key
  `ramp_physics_save_v1`.
- EN first, ES second; PEGI 3; 390×844 vertical first (landscape
  layout too); no `window.__*` in production (the test handle is
  tree-shaken from the production build).

## 5. Tests (final run 5)
- **56 checks, 0 failed, 0 console errors, 0 failed requests.**
- **30/30 levels won** by solution playback; 29/30 at 3 stars
  (L8 at 2 stars in run 5 — fixed after the run: par 165→180, the
  solution uses 173 px; probe-verified, formula-checked).
- Touch zones (centre + 4 corners + outside), drag/undo/ink budget,
  save persistence across reload, ES toggle, pause, map, shop — all PASS.
- 5 probe rounds fixed: Matter shutdown crash, spawn "pop", weak
  elastic bounce, fan-zone top edge, fan equilibrium stall, portal
  drape, tall wall, HUD ink-decimal overflow, landscape menu overlap.
  Full detail in filtro-jugabilidad.md.

## 6. Delivery (Paso C)
- Source (full, `ramp-physics/`): package.json, tsconfig, vite.config,
  index.html, src/ (levels, ragdoll, i18n, save, skins, audio, ui,
  layout, testhandle, scenes), public/ (assets, bridge config),
  tools-local/ (test-game, probe-level, film, covers, shots-extra),
  art-raw/ + process-art.py.
- `comunicacion-ias/entregas/ramp-physics-round1/`: teardown.md,
  covers/ (6), screenshots/ (9), ramp-physics-gameplay.gif
  (480×1038, 12 fps, 9.0 s, ends in victory),
  ramp-physics-short.mp4 (1080×1920, 26.0 s, silent),
  listing.txt, filtro-visual.md, filtro-jugabilidad.md,
  skills-usadas.md, informe-ronda1.md, short-guion.md,
  seo-estrategia-marketing.md, ramp-physics-round1.zip (see below).
- Zip: production build only (dist/), ≤5 MB, precheck passed
  (no `window.__`, Bridge first, config present).

## 7. Pending / questions for Daniel (do NOT improvise)
1. **EN title:** Playgama already lists "Ragdoll Crash-Test: Throw
   and Break!" (a different game, but the title is close). Proposed
   main title: **"Ramp Physics"** (no known game by that name).
   Daniel decides.
2. **Short is silent:** the recorded video has no music track (the
   game has synth SFX in play, not a music loop). Add an original
   music track before publishing, or publish silent with captions —
   Daniel decides.
3. **Ads:** placements are wired (interstitial every 2nd win,
   rewarded Extra Ink) but no real ad was served in testing — needs
   the Playgama environment to verify live.
4. **L8 3-star par:** fixed after the final full run (data-only
   change, probe-verified). The peer review can re-run the suite
   if it wants a fresh 30/30 + 30×3-stars stamp.
5. **Background density:** round-2 note — densify the playfield
   blueprint edges to close the gap with Metro (filtro-visual.md).

## 8. Next
After Niky's cross-review + APROBADO and Daniel's test + APROBADO:
upload to Playgama (draft + QA Tool), then the Short. Then game 7
(Grid Defender: Merge Tactics), then 8–10 in order; when the queue
empties, the permanent mission hunts playable game ideas on YouTube.
