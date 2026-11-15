# Filtro visual — Seagull Attack: Save the Sandwich (round 1)

Side-by-side comparison against the studio bar, **Metro Nightmare**
(reference: `art/covers/metro.webp` and `barista.webp` in the repo —
detailed realistic game art, expressive characters, rich textures,
illustrated interactive menu). Method: screenshots at 390×844 (real
touch, headless Chromium) reviewed frame by frame, EN and ES, portrait
and landscape.

## Gap noted
`referencia-estilo-metro.png` (named in the kit docs) is NOT in this
repo — only referenced. The comparison below uses the repo's
`art/covers/metro.webp` / `barista.webp` as the visual bar and the
CONTROL-CALIDAD.md text rules. If the kit's reference PNG exists
elsewhere, the peer review (Niky) should re-run this filter against it.

## Checks

### Art style — PASS (with one note)
- Beach backgrounds, gull, sandwich, pelican, crab, coin and chest are
  detailed realistic game art at Metro's level (not flat drawings or
  clip-art): the sandwich has real texture (toasted bread, lettuce,
  tomato, melted cheese, olive toothpick); the gull is expressive
  (angry diving pose); the beach has wet sand, foam, shells, a bucket.
- Uniform character scale; nothing stretched. The sandwich, gull and
  crab keep their aspect ratios (520×503, 520×411, 400×370 sources).
- Note: the art was generated for this game (create-game-assets /
  sprite-gen), not photographed. It reads as game art, not as a photo —
  which is what the genre (and Metro) does.

### Menu — PASS after fixes (was FAIL)
- Illustrated interactive menu: beach scene, bobbing sandwich on its
  towel, tappable gull (flies off and returns), tappable crab (jumps),
  tappable sun (pulses), Dana Games badge top-left. Not a static title
  + buttons.
- **Defect found (run 5, fixed):** the ES title ("¡QUE NO ME ROBEN EL
  BOCATA!") overflowed both edges and overlapped the subtitle and the
  coins pill. Fix: title auto-fit (font shrinks until the wrapped title
  fits its band) + subtitle positioned below the title's actual bottom.
- **Defect found (run 9, fixed in run 10):** the auto-fit still let the
  ES title's first line slide behind the ES toggle ("¡QUE NO ME ROBL")
  and, in landscape, the centred title slid behind the daily pill
  ("SEAGULL A…"). Fix: the title's max width now keeps it clear of the
  toggles (portrait w*0.64) and the landscape title is left-aligned
  (x=w*0.30) with the sun moved to the right edge; both verified by
  screenshot in run 10.
- **Defect found (run 5, fixed):** in landscape the buttons were placed
  by fractions of h (LEVELS/SHOP at h*0.8+78 = y 390, below the fold)
  and the sandwich hid behind PLAY. Fix: a real landscape layout —
  title/coins top, sandwich left, buttons in a right-hand column,
  toggles top-right.
- Main buttons ≥88 px (PLAY is 88 px tall). Daily pill, LEVELS, SHOP
  all fully on screen in both orientations (verified by screenshot +
  by the corner-tap tests).

### Gameplay — PASS after fixes (was FAIL)
- HUD: Level, timer (52 px), 3 crumb sandwiches, coins pill, pause
  (26 px radius, 52 px target — above the 48 px absolute minimum),
  INK bar. All readable, nothing cut.
- The drawn line reads as a shield: white arc with a dark outline
  above the sandwich (verified in the gameplay screenshot).
- **Defect found (run 5, fixed):** the two tutorial hints wrapped and
  overlapped each other in portrait. Fix: one text with both lines and
  real line spacing; hints now also fade on first draw (before, they
  stayed on screen if the player drew before 5.2 s).
- The tutorial hand is the official kit hand (pointing index finger,
  verified — not a fist, not an ambiguous gesture) and it follows the
  draw arc.
- Coins float in the play area and are tappable (+10). The pelican boss
  (level 10) is visibly bigger (170 px vs ~90 px gulls).

### Result card — PASS
- "SANDWICH SAVED!", 3 gold stars, +25 coins, NEXT / REPLAY / MENU all
  inside the card (the earlier overflow — MENU hanging below the card —
  was fixed in round 1 and re-verified).

### Map — PASS after fixes (was FAIL)
- 30 nodes on a winding path, current level pulsing green, locked levels
  with a drawn padlock, stars under each node, chest every 3rd level,
  daily sun badge.
- **Defect found (run 5, fixed):** the top node scrolled under the
  "LEVELS" title and overlapped it. Fix: a solid header band (depth 9)
  that nodes disappear behind.

### Shop — PASS after fixes (was FAIL)
- Picnic-plate rim colours (red/ocean/sunny), toppers (olive/cherry/
  gold star), Extra Ink (0/3, Buy · 30). Coins-only, no real money.
- **Defect found (run 5, fixed):** the price tags sat at y-52, on top
  of the section labels. Fix: tags moved below the cards.

### Pause panel — PASS
- PAUSA / SEGUIR / REINICIAR / SALIR AL MENÚ, all inside the card,
  ES verified by screenshot.

### Covers — from real gameplay (see covers/ in this folder)
- 3 Playgama covers (800×800, 1080×1920, 1920×1080) made from REAL
  gameplay screenshots with PIL: title in Lilita One (the game's own
  font), official seal ≥60 px in the top corner, never in the bottom
  20%. 3 -youtube covers (same sizes, NO seal, with title).
- The generated cover-keyart.jpg is an UNUSED SPARE (playgama-publish
  forbids generated art on covers) — kept in assets/raw/ only.

### Seal and hand — PASS
- Seal: `kit/dana-games_badge_360w@2x.png` (81,850 B) on all 3 Playgama
  covers, top corner, mascot ≥60 px on 800×800, never on -youtube.
- Hand: `kit/mano-tutorial.png` (41,923 B), pointing index finger,
  used in the level-1 tutorial only.

## Remaining visual risks (for the peer review)
- The menu gull flies across the top and can pass over the Dana badge
  for a second — transient, by design (it is the interactive gull).
  If it reads as a defect in the review, pin the gull's flight path
  below y=120.
- Coins can spawn behind the tutorial hints in level 1 (they fade after
  ~5 s; the text stays readable — white with shadow — but a coin can
  sit under a word for a moment).
- Landscape gameplay: the umbrella (L16+) sits at 0.5w/0.3h — verify in
  the peer review that it never covers the sandwich anchor in landscape.
