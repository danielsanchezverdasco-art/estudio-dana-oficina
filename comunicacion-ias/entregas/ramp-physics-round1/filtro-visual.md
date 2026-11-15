# Filtro visual — Ramp Physics: Ragdoll Crash Test (round 1)

Side-by-side comparison against the studio bar, **Metro Nightmare**
(reference: `metro.webp` in the kit — a dense, detailed, volumetric
metro car: ~20 expressive passengers, luggage, a scooter, glowing floor
tiles, warm lighting, detail in every corner). Method: screenshots at
390×844 (real touch, headless Chromium) reviewed frame by frame, EN
and ES, portrait and landscape, plus the 6 covers.

## Verdict: PASS (with one honest note for round 2)

The game meets the bar where it counts most — the character is premium
and the style is coherent and readable — and it is below Metro on
background density. That gap is a deliberate art-direction choice
(blueprint = a technical drawing, clean by design), not a defect, but
round 2 should densify the playfield edges.

## Checks

### Art style — PASS (with a note)
- The crash-test dummy is detailed volumetric game art at Metro's level
  (not a flat drawing or clip-art): helmet with visor, vest, jointed
  limbs, boots, shading and highlights; it reads as a real 3D character.
  Uniform scale; nothing stretched (the 10 ragdoll parts keep their
  aspect ratios from the processed sprite sheet).
- The blueprint style is coherent across every screen (menu, map, shop,
  gameplay, result): paper #f1f5f9 grid, ink #0f172a, steel ramps,
  yellow/black dummy, green goal ring. Colours are limited and
  deliberate; the goal flag and the coin always read first.
- **Note (round 2, not a blocker):** Metro fills every corner with
  detail; Ramp's playfield is mostly empty grid with a few sketched
  gears at the edges, and the platforms are flat grey slabs. The style
  is clean and readable, but a denser blueprint (more sketched
  machinery, annotations, dimension lines at the playfield edges) would
  close the gap with Metro. The character already matches Metro; the
  backgrounds do not yet.

### Menu — PASS after a fix (was FAIL in landscape)
- Illustrated interactive menu: blueprint workshop, bobbing dummy head
  (tappable: spins + boings), Dana Games badge top-left, daily pill,
  streak, coins, EN/ES + sound toggles. Not a static title + buttons.
- **Defect found (film run, fixed):** in landscape the dummy head
  (150 px wide = 263 px tall on a 390 px tall screen) covered the
  subtitle ("Ragdoll Crash Test") and the tagline, striking the text
  through. Fix: landscape head 100 px wide, anchored low (h*0.66), so
  it sits below the text. Verified in a fresh landscape screenshot:
  title, subtitle and tagline are all fully readable.
- Portrait menu: title, subtitle and tagline clear; the head bobs below
  the text without touching it.

### Gameplay — PASS
- The drawn ramps read instantly (steel grey, bouncy blue, boost
  orange); the ink bar + numeric remainder are legible; the LAUNCH
  button is the biggest touch target on screen (180×72); the goal flag
  has a green sensor ring that reads as "go here".
- **Defect found (test run 5, fixed):** the ink remainder showed a raw
  float (`192.6687`) that overflowed the right edge. Fix: rounded to an
  integer (`181`). Verified in the film screenshots.
- No cut or overlapping texts in EN or ES (menu, HUD, map, shop,
  result, pause). Buttons ≥48 px; main buttons ≥88 px tall (PLAY 88,
  LAUNCH 72 — LAUNCH is 180 px wide, the biggest on screen).

### Map / Shop / Result — PASS
- Map: 30 nodes on a blueprint path, locks, stars, a chest every 3rd
  level, a daily sun badge; drag-scroll works.
- Shop: 6 dummy skins with prices in coins, Extra Ink, owned state.
- Result: "CRASH COMPLETE!", 3 stars, +coins, NEXT / REPLAY / MENU.
  All legible in EN and ES.

### Covers — PASS
- 6 covers from REAL gameplay screenshots (level 1 drawn ramp), never
  generated art. Title "RAMP PHYSICS" + subtitle "Ragdoll Crash Test"
  in Lilita One (the game's own font), white with dark outline, clear
  of the action. Badge on Playgama covers only, top-right corner, mascot
  ≥60 px (badge 140–194 px wide), never in the bottom 20%. YouTube
  covers have NO badge.
- **Defect found (cover run 1, fixed):** the square cover's title
  overlapped the dummy. Fix: focus moved to 0.35 so the dummy sits
  below the title band. Verified visually.

### Screens below Metro? — No
- The dummy, the props (fan, dynamite, portal, flag, star, coin) and
  the menu are at Metro's quality level. The backgrounds are simpler
  by design (see the note above). Nothing in the game looks unfinished
  or placeholder.
