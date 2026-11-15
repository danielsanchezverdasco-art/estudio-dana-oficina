# Teardown — Seagull Attack: Save the Sandwich

**Game:** Seagull Attack (ES: «¡Que no me roben el bocata!»). Draw-to-protect: draw a line to shield a sandwich on a beach towel from diving gulls. Survive 10 seconds per level. 30 levels, map, stars, coins, chest every 3 levels, daily challenge, streak.
**Genre best (reference):** Save The Dog (Fun Space, Google Play) — the draw-to-protect reference: draw a line to protect the dog from bees, hold 10 seconds.
**Date:** 2026-11-15. Author: Anita (Dana Games handover test). Sources checked live 2026-11-15.

## Sources

- Genre popularity (live, 2026-11-15): https://playables.games/best/ — updated Nov 14, 2026. Draw-to-protect / draw games in the top 50: DOP 4: Draw One Part 41M plays (#24), Save The Pets 40M (#25), DOP 2: Delete One Part 36M (#28), Draw Climber 29M (#35), Draw Bridge — Brain Game 27M (#43), Drawing Carnival 28M (#41), Thief Puzzle 95M (#7). The genre is proven at tens of millions of plays; the draw mechanic is instantly understood.
- Save The Dog mechanics (live, 2026-11-15): Google Play listing + user reviews (Fun Space). Core: draw a line to protect the dog from bees, survive 10 seconds.
- Save The Dog weaknesses (from its own reviews, live 2026-11-15):
  1. «TOO easy — just draw a square» (difficulty collapses: one trivial shape beats every level).
  2. «Ads every 2 rounds + on every loss + permanent banner» (ad punishment drives uninstalls).
  3. «Can't draw too close to objects or the game refuses to draw» (drawing freedom restricted near the protected object).
- No known video/mobile game called «Seagull Attack» (searched 2026-11-15: only a TES phonics card game and Blood Bowl tabletop rules). «Save the Sandwich» only a tiny itch.io jam game («Save the Cheese Sandwich», Mini Jame Gam #39, 17 ratings) and a Wii party minigame. No «Seagull Attack» on Playgama (seagulls only as minor elements in Lucky Nori and Gulf Streets).
- Metro Nightmare (Dana Games, Sandbox https://playgama.ai/play/vw3o2dpywoejvy) is the studio quality bar: detailed realistic art, illustrated interactive menu, 390×844 mobile-first, official hand tutorial, seal on covers.

## Where we beat the genre best (≥3 points)

### 1. Real challenge — no «draw a square and win»
Save The Dog's #1 complaint is that one square beats every level. Seagull Attack makes the trivial shape fail on purpose:
- **Limited ink per level** (a full box around the sandwich needs ~700 px of line; the ink budget is 420 px at level 1 and falls to 260 px by level 26 — the box can never be drawn, at any level, so the trivial shape fails from level 1, not just later).
- **Wind** (from level 6): horizontal force pushes gulls sideways, so a static wall gets outflanked.
- **Multi-direction waves** (from level 11): gulls dive from left, right and top in the same level; one wall cannot cover every angle.
- **Obstacles** (from level 16): the beach umbrella is a no-draw zone; the line must bend around it.
- **Pelican boss** (levels 10, 20, 30): big, slow, takes 3 line-bounces to scare off (1 crumb stolen if it reaches the sandwich, like any gull — its threat is its size and speed, not a double steal).
- Result: the player must read each wave and draw for it, not repeat one shape. Verified by balance probes (see filtro-jugabilidad.md): the idle policy (draw nothing) never survives; the box policy cannot even be drawn (700 px needed, 420 px max).

### 2. No ad punishment — ads only at natural pauses, never on loss
Save The Dog shows an ad every 2 rounds, on every loss, and keeps a permanent banner. Seagull Attack follows the Playgama rules and the studio norm:
- Interstitial only at a natural pause (level complete) and only every 2nd completion, never on level 1, never on the first retry, never on a loss.
- No banner ad at all. No ad gate on retry: the fail screen offers a rewarded ad as an *option* («Extra ink») and only if the platform supports rewarded ads; retry is always free.
- Audio is silent while an ad plays (Bridge ad state events mute the game).

### 3. Drawing freedom — draw anywhere, generous and forgiving
Save The Dog refuses to draw too close to the protected object. Seagull Attack:
- The line can start anywhere on the playfield, including right next to the sandwich.
- Generous ink: the budget covers a full protective arc with margin in every level; the limit only blocks the degenerate full-box.
- Forgiving collision: the line is a thick shield (14 px visual, generous collision radius) and gulls bounce off it with a visible squash + sound, instead of the game refusing the input.
- No «invalid shape» rejections: any stroke is accepted; bad strokes just cost ink.

### 4. A living world + meta progression (Save The Dog is one bare loop)
- Illustrated interactive menu (tappable gull, crab, sun) at Metro Nightmare level; the beach is a place, not a blank canvas.
- 30 hand-authored levels with a map, stars per level, coins, a chest every 3 levels, a daily challenge (2× coins) and a play streak.
- Cosmetic shop (picnic-plate rim colours, sandwich toppers: olive / cherry / gold star) bought with earned coins — no real-money purchase, no paywall.
- Coins floating in levels, tappable to collect; a pelican boss; wind and umbrella twists every ~5 levels (teach → test → twist pacing).

## Risks / honest gaps

- Draw-to-protect is a crowded genre (7 titles in the playables.games top 50). The differentiator is the theme (beach + gulls + sandwich, a joke everyone gets in 3 seconds) and the anti-square difficulty — both must survive playtesting, not just design.
- «Seagull Attack» as a phrase is free, but the title must still be checked again at listing time (new releases appear weekly).
- The 10-second hold is borrowed from Save The Dog; if playtests show it feels short, levels 21–30 already stretch it with faster waves rather than a longer timer (timer stays 10 s everywhere for readability).
