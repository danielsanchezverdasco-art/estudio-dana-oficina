# Filtro jugabilidad — Ramp Physics: Ragdoll Crash Test (round 1)

Method: 30/30 level solutions played back end-to-end in 390×844 touch
(headless Chromium, Playwright), EN and ES, plus touch-zone checks
(centre + 4 corners + outside per button), save persistence, and a
probe that traces the dummy's centre + speed every 500 ms.

## Verdict: PASS — 30/30 levels winnable, 56/56 checks green

Test run 5 (final, after all fixes): **56 checks, 0 failed,
0 console errors, 0 failed requests. 30/30 levels won, 29/30 at
3 stars** (L8 at 2 stars in run 5 — fixed after the run by raising its
par 165→180; the solution uses 173 px of ink, so it is 3 stars by the
star formula; verified by probe, not by a full re-run).

## Core loop
- Draw a ramp (touch drag) → LAUNCH → the ragdoll tumbles, bounces or
  flies to the flag. One-touch mechanic, understood at first tap:
  L1's tutorial shows the ghost ramp + the official hand + "Drag to
  draw a ramp".
- Ink is the puzzle: 3 types (steel / bouncy / boost), a budget per
  level, UNDO refunds, CLEAR resets. The budget blocks the lazy
  solution (L8: the direct ramp needs ~205 px, the budget is 190 —
  the player MUST bounce).
- 3 arcs: pits 1–10 (ramps + gaps), fans 11–20 (lift + drift),
  dynamite + portals 21–30 (blast + gravity flip). Each level has a
  hand-designed solution that the test harness plays back — no
  unwinnable level ships (Tetris-GDD rule: route validation).

## What the probe found and fixed (5 rounds of tuning)
1. **Matter shutdown crash** (run 1): the Matter plugin nulls its world
   before the scene SHUTDOWN event; the handler called `.off` on null.
   Fix: optional-chaining guards.
2. **Dummy never left the spawn** (run 2): shins penetrated the platform
   8 px (Matter "pop") + a released ragdoll has no reason to move.
   Fix: feet exactly at the platform line, starts moved to x=88,
   launch nudge vx=1.2, stillness threshold 0.15→0.4.
3. **Elastic bounce too weak** (L8): a glancing slide gives ~16 px of
   bounce. Fix: free-fall almost vertically onto the wedge (steep 45°
   ramp, long drop) + ink budget blocks the direct ramp.
4. **Fan zone too low** (L11–L20): only the legs entered the zone and
   the dummy bobbed on its top edge. Fix: zone tops raised to y=200
   so the whole dummy accelerates inside the zone to the rise cap.
5. **Fan equilibrium stall** (L13/L17): the dummy hovered with its legs
   in the zone, lift ≈ gravity. Fix: angled fans (-60°) + a horizontal
   speed cap (2.8 px/step) so the drift is bounded and the dummy lands
   on the platform instead of rocketing past it (uncapped vx hit 11).
6. **Portal drape** (L27): the dummy draped over the ceiling platform's
   left edge. Fix: platform widened left (120..390) + exit drift 2→2.5.
7. **Tall wall** (L17): the dummy's legs clipped the wall top. Fix:
   wall lowered 160→200 (still 60 px tall, a real obstacle).
8. **HUD overflow** (run 5): ink showed `192.6687`. Fix: integer.

## Touch zones — PASS
- PLAY: centre + 4 corners open the game; a tap outside does nothing.
- LAUNCH / UNDO / CLEAR / ink-type buttons: tapped and verified.
- Pause (top-right) opens the pause overlay; RESUME / RESTART / MENU
  all work. Map nodes and shop items are tappable.
- All zones in local coordinates `Rectangle(0, 0, w, h)`.

## Save / progression — PASS
- Stars, coins, unlocked levels and the daily streak persist across a
  reload (Bridge storage). Chest every 3rd level. Daily challenge =
  day-of-year mod 30 + 1. Shop purchases persist (owned skins).

## Language — PASS
- EN default; ES toggle re-renders every screen (menu, HUD, map,
  shop, result, pause, tutorial). No untranslated strings found in
  the ES run. No Spanish in the EN listing block.

## Ads — fair by design
- Interstitial every 2nd win, never on level 1, never on the first
  retry. Rewarded ad only for a useful boost (Extra Ink). Audio muted
  during ads. (Ads are best-effort in the Bridge; no real ad was served
  in testing — the placements are wired, not verified live.)

## Known limits (not blockers)
- L8's 3-star par was fixed after the final full run (probe-verified,
  formula-checked, not re-run end-to-end — the change is data-only:
  ink 175→190, par 165→180).
- The Short is silent (no music track yet — the recorded video has no
  audio; the game has synth SFX in play, not a music loop). Music is
  a round-2 addition if Daniel wants it.
- Ads placements are wired but no real ad was served in testing
  (needs the Playgama environment).
