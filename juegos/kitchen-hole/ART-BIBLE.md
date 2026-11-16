# ART BIBLE — Kitchen Hole Muncher / Agujero Tragón en la Cocina

**Approved visual target:** the finished-design mockup
`comunicacion-ias/lista-ideas-2026-11-15/mockups/mockup-agujero-tragon-cocina.webp`
(branch `niky/fabrica-conceptos-1511`, v2 — single «TIMER», verified APTO).
Mockup HUD: `LEVEL 3 CLEANUP · SIZE 12 · 128 COINS · 00:22 · +50`.
**Style:** toy-3D top-down kitchen, comic option C (thick black outlines,
flat premium colour, warm light, soft real shadows) — the same Dana comic
language as Ramp Physics r2, so the studio's games read as one family.
**Never:** flat clip-art, pixelated upscales, stretched sprites, text
inside images (all text is live Phaser text, EN first).

## Palette roles (art-direction-and-readability: colour is never the only signal)
| Role | Colour | Hex | Notes |
|---|---|---|---|
| World floor (per kitchen) | warm wood / tiles | varies | 6 kitchen floors, see below |
| The hole (protagonist) | black + violet rim | `#141414` / `#7c3aed` | violet swirl ring, animated |
| Fridge (final object) | friendly blue | `#2563eb` | face: eyes + smile; laughs when tapped on the menu |
| Food (reward) | warm gold / red / pink | `#facc15` `#e23b2e` `#f9a8d4` | croissant, apple, donut, cake… |
| Coins | gold | `#facc15` | +50 pops, flying coins on swallow |
| Pet (danger) | cat orange / dog brown | `#f97316` `#8a6d3b` | steals coins on touch; «!» + dashed outline, never colour alone |
| Golden object (bonus) | glowing gold | `#fde68a` + sparkle | ×3 coins, expires in 8 s (ring counts down) |
| Goal / go | leaf green | `#22c55e` | win, SIZE bar fill, PLAY lid |
| UI paper | cream | `#fff8e7` / `#f7e8c3` | panels, HUD bubbles |
| Outlines / text | ink black | `#141414` | 2–4 px at display size |

## The hole — the protagonist IS the progress
- Black ellipse (squashed circle, top-down perspective), violet swirl
  ring rotating slowly, soft inner shadow gradient, subtle wobble while
  moving (squash & stretch, game-feel).
- **Growth is visible in the world, not in a number:** the hole itself
  gets bigger as it eats. The SIZE bar in the HUD mirrors it (never the
  only signal). Size number = hole radius, rounded.
- Swallow: object scales down into the hole centre with a spin (120 ms),
  a «+50» pop flies up, gold coins burst, small trauma shake (tier small),
  gulp sound whose pitch rises with hole size (audio-design variation).

## Kitchens — 6 blocks, one story each (level-design: a new toy per block)
1. **Grandma's Kitchen** (L1–5): warm wood floor, red-check tablecloth,
   hanging plant, NO pet yet (the dog teaches stealing at L6).
   Palette: wood `#c98f4e`, cream, tomato red.
2. **Food Truck** (L6–10): black-and-white checker floor, steel counter,
   dog arrives L6 (teaching: steal 10). Palette: steel grey, mustard.
3. **Bakery** (L11–15): mint tiles, pink awning stripes, golden objects
   arrive L11 (teaching: ×3, 8 s). Palette: mint `#a7f3d0`, pink.
4. **Pizzeria** (L16–20): red-check floor, wood oven, moving food arrives
   L16 (rolling apple / fleeing mouse — teaching: corner it).
   Palette: tomato, basil green.
5. **Sushi Bar** (L21–25): teal tiles, bamboo mat, the FRIDGE arrives
   L21 (teaching: eat everything small first, then the fridge).
   Palette: teal `#0ea5e9`, bamboo.
6. **Grand Kitchen** (L26–30): marble + brass, everything combined,
   L30 finale: the giant fridge + all mechanics. Palette: marble white,
   brass gold.

## Objects — procedural canvas textures at 4× (comic.ts pattern, kitchen.ts)
Every object is drawn in code at 4× display size, thick black outline,
one highlight, one soft ellipse shadow underneath (the shadow is drawn
by the scene, not baked in, so swallowed objects leave no ghost).
Sizes are gameplay truth: the drawn radius IS the fit radius (the
readability audit checks drawn extent ≥ hit extent).
- crumbs (tiny brown dots, cluster of 3) · cookie · apple · donut ·
  croissant · cup (with steam curls) · toaster · cake · pizza slice ·
  sushi (maki + salmon) · plant (pot + leaves) · chair · table ·
  stove · fridge (blue, face, handles) · mouse (grey, fleeing) ·
  cat (orange, sitting) · dog (brown, sitting) · golden variants (sparkle).
- Dana mascot cameo: the purple octopus, hidden in every kitchen
  (fridge magnet in L1, poster in the truck, …) — same stamp as every
  Dana game.

## Menu (per the concept, verbatim)
- The kitchen with the hole swallowing a croissant on loop, the fridge
  smiling, **PLAY as a pot lid** (big round steel lid button).
- Touching the fridge makes it laugh (bounce + «¡Ja!» + giggle sound).
- Title «KITCHEN HOLE MUNCHER» / «AGUJERO TRAGÓN», subtitle, LEVELS /
  SHOP buttons, daily pill, coins pill, language + sound toggles,
  Dana badge top-left.

## HUD (auditing-game-screen-readability: every element earns its place)
- Top-left: LEVEL bubble (level number + kitchen name).
- Top-centre: coins pill (coin icon + count — the score the pet steals).
- Top-right: TIMER (mm:ss, tabular numerals, turns coral under 10 s +
  a clock icon — never colour alone) + pause button.
- Bottom: SIZE bar (hole icon + fill + «SIZE 12») — mirrors the hole.
- Score pops («+50») fly from the swallowed object to the coins pill
  (game-feel: connect the cause to the counter).
- No other HUD text. Tutorial: the official hand + a dotted ghost path
  on L1 only; one-line hints where a mechanic first appears (L6 pet,
  L11 golden, L16 mover, L21 fridge).

## Typography (styling-web-game-typography)
- Display: Lilita One (bundled woff2, OFL) — titles, numbers, buttons.
- Body: Nunito Variable (bundled woff2, OFL) — hints, labels.
- Numeric role: Lilita One, tabular by construction (single font, fixed
  sizes); timer/coins/SIZE never use proportional body text.
- Text over the busy kitchen floor always carries a thick outline or a
  cream bubble behind it (contrast ≥ 4.5:1).

## Juice budget (game-feel / game-juice — one tier per event, one call)
- Swallow small (crumb/cookie): tier small — pop + 6 particles + gulp.
- Swallow medium (cup/cake/chair): tier medium — squash + 12 particles +
  ring + deeper gulp.
- Swallow fridge / win: tier large — confetti + slow-mo 0.3 s + fanfare.
- Pet steal: tier medium — coral flash on the coins pill + «−20» + meow.
- Golden expire: small grey puff, no shake (restraint).
- Respect `prefers-reduced-motion` where the platform reports it:
  shake off, flashes become tints (juice-audit pillar check).

## Comparison with Metro Nightmare (the bar)
Side-by-side before presenting: Metro's menu is an illustrated scene,
not a title screen — ours matches that (living kitchen menu). Metro's
first 10 seconds teach without words — ours does too (hand + ghost
path + first crumb 2 s away). Metro's art has volume, light, shadow
and texture in every sprite — ours has the same per object (highlight
+ shadow + texture strokes). If a frame looks flat next to Metro, it
does not ship.
