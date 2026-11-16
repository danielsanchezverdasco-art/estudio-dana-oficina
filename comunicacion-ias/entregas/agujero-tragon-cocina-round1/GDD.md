# GDD — Kitchen Hole: Hungry Hole in the Kitchen (one page)

**Fantasy:** You ARE a hungry black hole in a kitchen. Everything that
fits gets swallowed. **Verb:** drag (one finger). **Goal:** clean the
kitchen — eat EVERYTHING before the timer ends. **Hook (10 s):** the
first swallow + the hole visibly growing.

## Numbers (match src/rules.ts exactly)

- Hole: start radius 13, speed 420 px/s, max radius 95.
- Fit: object fits when `obj.r <= hole.r * 1.1`; swallow when centre
  distance < `hole.r * 0.85`.
- Growth: crumb +0.4 · cookie +0.7 · apple +1.0 · sushi +1.0 · donut
  +1.2 · croissant +1.4 · cup +1.8 · toaster +2.2 · cake +2.6 · pizza
  +3.0 · plant +3.0 · chair +4.0 · stove +5.0 · table +6.0 · fridge
  +8.0 · mouse +1.5. Fridge (r52) needs hole r ≥ 47.3.
- Coins: crumb 5 · cookie 10 · apple 15 · sushi 20 · donut 20 ·
  croissant 25 · cup 30 · toaster 40 · cake 50 · pizza 60 · plant 50 ·
  chair 80 · stove 100 · table 120 · fridge 300 · mouse 40. Golden ×3.
- Timer: 60 + floor((n−1)/2) s (L1 60 → L30 74). Stars: 3 = 15+ s left
  AND all goldens · 2 = 5+ s · 1 = win.
- Pet: radius 26, steal 10–30 coins, 5 s cooldown, dashes away 2 s.
- Golden: spawns mid-level, ×3, 8 s TTL, then expires (never blocks win).
- Playfield: 390×844, y 110–768. 30 levels, 6 kitchens.

## Structure

- L1–5 Grandma's (verb, then furniture ladder) · L6–10 Food Truck
  (dog) · L11–15 Bakery (golden) · L16–20 Pizzeria (movers) ·
  L21–25 Sushi Bar (fridge) · L26–30 Grand Kitchen (everything).
- Menu: living kitchen (hole + croissant loop, laughing fridge).
- Map: 30 nodes, stars, chest every 3rd level, daily sun badge.
- Shop: 5 hole skins (rim colours), extra time +15 s (max 3).
- Save: Bridge storage only, key `kitchen_hole_save_v1`.

## Art

Toy-3D comic (option C), procedural 4×, thick outlines, warm light,
soft shadows. Palette: hole black + violet rim; fridge blue with face;
food gold/red/pink; coins gold; pet orange/brown. Octopus mascot cameo
hidden in every level. English first, Spanish second. PEGI 3.

## Verification status (round 1)

- Unit tests 17/17 pass; sim harness: solution 30/30, solution3 30/30
  at 3★, idle 0/30, sweeper 0/30.
- Browser: menu + L1/L6/L11/L21 played in Chromium (see
  informe-ronda1.md for the run numbers).
- NOT YET: human 3-tester playtest (difficulty verdict), GIF/Short
  filming (capture pending), visual pixel audit on real screenshots.
