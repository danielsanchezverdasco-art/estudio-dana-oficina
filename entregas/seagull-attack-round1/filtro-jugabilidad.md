# Filtro de jugabilidad — Seagull Attack: Save the Sandwich (round 1)

Balance probes run against the test build (Phaser 3.90, 390×844, real
touch via CDP). Numbers come from `src/levels.ts`, the single source of
truth — nothing here is tuned by hand after the fact.

## The rules (from levels.ts)

- 30 levels. Every level: survive **10 s**, **3 crumbs**, stars = crumbs
  left (3/2/1). Timer is 10 s everywhere (readability over variety).
- Gull speed: `130 + n*8`, capped at 370 px/s (L1 138 → L30 370).
- Gull count: `3 + floor(n/2)`, capped at 12 (L1 3 → L18+ 12).
- Spawn interval: `max(0.7, (10 / gulls) * 0.9)` s.
- Ink (total line length): L1 420, L2–5 380, L6–10 340, L11–15 320,
  L16–20 300, L21–25 280, L26–30 260 px.
- Wind: 0 (L1–5), 0.35 (L6–10), 0.5, 0.6, 0.7, 0.8 (L26–30); sign
  alternates by level parity. Wind pushes gulls sideways.
- Sides (gulls spawn from the left/right edges too): from L11.
- Umbrella (no-draw circle, r 64 px at 0.5w/0.3h): from L16.
- Pelican boss (3 HP, 1 crumb if it reaches the sandwich): L10, L20, L30.
- Pacing: teach → test → twist every ~5 levels (L1–5 learn, L6–10 wind,
  L11–15 sides, L16–20 umbrella, L21–25 all together, L26–30 bosses +
  fastest waves).

## Probes (all run in the automated test, test-game.mjs)

### 1. Idle policy — draw nothing
**Must:** never survive. A gull reaches the sandwich in ~4 s (L1 speed
138 px/s from y=-60) and steals a crumb; three gulls end the level.
**Result (run 6/8):** PASS — crumbs 3 → 2 → 0 with no line drawn, level
lost. The game cannot be won by waiting.

### 2. Box policy — draw a square around the sandwich
**Must:** never close. A box around the sandwich needs ~700–800 px of
line; the ink budget is 420 px at L1 and falls to 260 px. The line
simply runs out halfway round the box.
**Result (run 9):** PASS — drawing an 800 px box stops at ink 0 with
420 px drawn and the box left open. The trivial shape from Save The
Dog's reviews ("TOO easy — just draw a square") cannot win here, at
any level. (The teardown's first draft said "from level 6 on" — wrong:
the box fails from level 1. Corrected 15/11.)

### 3. Bounce — a line in the dive path protects
**Must:** a gull that hits the line flees (state 'fleeing') and no crumb
is lost.
**Result (runs 4–8):** PASS — a horizontal line at y=200 (every dive
crosses it) makes the spawned gull flee with crumbs still 3. The
collision is a real reflection (velocity mirrored on the segment
normal), not a despawn: the gull visibly bounces away.

### 4. Win — the level can be won
**Must:** surviving 10 s reaches the Result scene, stars are awarded
(3 crumbs = 3 stars), the save unlocks the next level.
**Result (runs 2–8):** PASS — level 1 won with 3 stars, +25 coins
(10 + 3×5), unlocked=2, save persists after reload.

### 5. Save — progress survives a reload
**Must:** stars, unlocked level and coins are stored via bridge.storage
only (never localStorage directly) and survive a page reload.
**Result (runs 2–8):** PASS — stars {1:3} and unlocked=2 read back
after `page.reload()`.

### 6. Difficulty curve — the numbers say it, playtesting must confirm it
The curve is arithmetic (speed +8/level, gulls +1 every 2 levels, ink
−20 every 5 levels, wind +~0.1 every 5 levels) — it has not been
playtested by a human beyond level 1 yet. Known open questions for the
peer review (Niky) and for Daniel's playtest:
- L10 pelican: is 3 HP with a 0.55× speed dive fair on a first meeting?
- L16 umbrella: does the no-draw circle read clearly, or do players
  think the game is ignoring their input?
- L26–30: 12 gulls at 370 px/s with 0.8 wind and 260 px ink — is it
  hard or impossible? (Ink covers one ~250 px arc; 12 gulls need
  repositioning, not one wall.)
- The 10 s timer never changes: if L21+ feels rushed, the fix is
  fewer gulls per wave, not a longer timer (readability rule).

## Juice / feel (verified in the test, not just by eye)
- Bounce: squash + sound + small shake (trauma 0.15 tier).
- Crumb lost: medium shake (0.4) + hit-stop 0.05 s + sandwich wobble.
- Win: large (0.8) + confetti + stars popping staggered.
- Hit-stop restores in real time (setTimeout), never by game time —
  the game cannot freeze if the tab stutters.
- Update-loop cost on a busy level (5 gulls, 199 segments): 0.06–1.42
  ms/frame across runs — the logic is far inside the 16.7 ms budget.
  (Visible FPS in headless Chromium is 2–10 fps because SwiftShader
  rasterizes in software on 1.5 shared CPUs; the blank-page baseline
  is 60 fps, so the bottleneck is the rasterizer, not the game.)

## Known bugs found by the probes (all fixed in round 1)
- Pause button dead after quit-from-pause (pausePanel field not reset
  on scene restart) — fixed in GameScene.create().
- Tutorial hints overlapped in portrait (two texts, one band) — merged
  into one text with line spacing; hints now also fade on first draw
  (before, they stayed if the player drew before 5.2 s).
- Menu title overflowed in ES and the landscape menu put LEVELS/SHOP
  below the fold — title auto-fit + a real landscape layout.
- Map title overlapped the top node — header band added.
- Shop prices overlapped the section labels — price tags moved below
  the cards.
