# Art Bible — Traffic Chaos: New York Rush (Round 1)

Approved mockup: `mockup-traffic-chaos-ny.webp` (branch `niky/fabrica-conceptos-1511`,
`comunicacion-ias/lista-ideas-2026-11-15/mockups/`). Daniel approved the concept +
finished-design mockup 16/11 06:36 («Quiero todos para hoy», «Perfectamente diseñados»).
This bible is the faithful reading of that mockup — the game is built to it, not to the
prototype's greybox. The prototype (Niky, branch `niky/traffic-chaos-prototipo`) supplied
the rules; the art is new, from this bible.

## 1. Visual identity

**Toy-3D polished diorama, top-down 2.5D.** Times Square at night as a toy city you hold
in your hand: chunky vehicles with volume, thick outlines, saturated colour, warm light,
real soft shadows. The city is the character — the art IS the mechanic (the patience
ring is the game state, the light is the verb, the crash is the spectacle). No flat
drawing, no clip-art, no stretched sprites, no pixelation.

**Reference bar:** Metro Nightmare (side-by-side comparison in every delivery). The
mockup's diorama must read at the same polish level: production, volume, light, shadow,
texture, animation, game feel — never basic / flat / cutre (issue #10, Daniel 15/11 11:55).

## 2. Mood

Night rush hour, warm and electric. Dark navy sky, neon billboards (pink star, cyan
lightning, amber circle), wet asphalt with a sheen, lit windows in five colours. The
mood is *controlled chaos*: the city hums, the lights command, the rings count down.
The crash is spectacular, not grey — slow motion, debris, confetti of light.

## 3. Shape language

- Vehicles: rounded rectangles with thick dark outlines, a visible roof, four wheels,
  head/taillights, a contact shadow. Pointing right in the texture; rotated per direction.
- Taxi: yellow body, black-and-white checker band, roof sign. Bus: long, red, lit windows.
  Ambulance: white, red cross, red/blue light bar. Generic cars: white base tinted per car.
- Traffic lights: tall dark housings (68×168), three lenses, the lit lens glowing with a
  white core. The light is the biggest interactive object on the field.
- Buildings: dark slabs with seeded lit windows (yellow / cyan / pink / white / warm
  orange), neon billboards on the rooftops, one purple-octopus cameo in a window
  (Dana mascot, hidden in every game).
- Roads: dark asphalt `#1e293b`, yellow centre dashes, white crosswalks, stop lines,
  lane-direction triangles, a faint red conflict-box outline at the crossing.

## 4. Colour — every colour is a gameplay role

| Role | Colour | Where |
|---|---|---|
| Night sky / deep ground | `#0d1b2e` / `#101d33` | background, building slabs |
| Asphalt | `#1e293b` | roads |
| Sidewalk | `#334155` / `#475569` | blocks, kerbs |
| Taxi yellow | `#fbbf24` / `#facc15` | taxis, centre dashes |
| MTA red | `#ef4444` | bus, red light, danger |
| FDNY white | `#f8fafc` | ambulance |
| GO green | `#22c55e` | green lens, ring full, positive |
| STOP red | `#ef4444` | red lens, ring empty, danger |
| Amber / warning | `#f59e0b` | amber lens, ring 30–60 %, «!» mark |
| Neon pink | `#ec4899` | billboard, confetti, accent |
| Neon cyan | `#22d3ee` | billboard, BOOST, accent |
| Octopus purple | `#a855f7` | Dana cameo, shop accents |
| Ink / text | `#0f172a` on light, `#f8fafc` on dark | HUD, buttons |

Patience ring: green → amber → red as it empties; at ≤2.5 s the car trembles and shows
a «!» mark. The ring is readable at arm's length without reading any text.

## 5. Characters (vehicles as characters)

- **Taxi** — fast, impatient, worth extra points when it clears without stopping.
- **Bus (MTA)** — slow, long (2.5× the footprint), long braking distance; clearing a bus
  feels like a small victory.
- **Ambulance (FDNY)** — absolute priority, never stops at red, 2 s warning before it
  arrives, worth double. The hero of the Short.
- **Generic car** — the bulk of the traffic; tints cycle (red, blue, green, orange, teal,
  pink, purple, cyan) so no two neighbours look alike.
- **Pedestrians** — tiny figures on the sidewalks; flavour, never a mechanic.

## 6. Environment

One intersection, 390×844, always the same geometry (the sim IS the design space):
the crossing sits at (195, 422), lanes N/S/E/W, 4 lights at the corners, 4 sidewalk
blocks with buildings, 3 neon billboards, 4 street lamps with glow pools. The three
neighbourhoods re-skin the same intersection: **Times Square** (neon, TKTS, Broadway),
**Brooklyn Bridge** (steel blue, bridge cables in the background blocks, cooler light),
**Central Park** (green canopies on the blocks, warmer dusk light). The layout never
changes — the player learns one space and masters it.

## 7. UI / HUD

- Top: SCORE (big, tabular), LEVEL + hour («RUSH HOUR 3» / «06:00»), quota chip
  (cleared / quota), timer. Mission chip always visible («Clear 20 cars!»).
- Bottom: BOOST 2x (left, 90×52), PAUSE (right, 52×52). Main buttons ≥88 px tall
  (PLAY 260×88); minimum touch target 48 px; local-coords hit areas.
- Typography: Lilita One for titles / numbers (display), Nunito for body. EN first,
  ES second. No text inside images (covers carry their own text layer, not baked in).
- Tutorial: the official hand (`kit/mano-tutorial.png`, index pointing), a pulsing ring
  on the target, one step at a time, zero reading, skippable, never repeated.
- Juice (bounded, Medium–High ceiling): pop on tap, flash + shake + zoom punch on
  crash, hit-stop 120 ms, slow-mo 0.35× for 1.4 s, debris burst, confetti on win,
  floating «+10» / «CHAIN x3» text. One satisfaction moment per action.

## 8. Asset standards

- All art is vector-generated at runtime (Phaser `Graphics.generateTexture`) — no
  raster art shipped, so nothing can be stretched or pixelated. Covers and the GIF are
  rendered from the real game (film script), never drawn separately.
- Fonts: Lilita One 400 + Nunito Variable, shipped as woff2 in `public/assets/fonts/`.
- Hand: the official `mano-tutorial.png` (41.923 B). Badge: `kit/dana-games_badge_360w@2x.png`
  on Playgama covers only, top corner, never the bottom 20 %, mascot ≥60 px on 800×800.
- Zip ≤5 MB. No `window.__`, no test params in production. Bridge first in `<head>`.

## 9. References

- Mockup approved: `mockup-traffic-chaos-ny.webp` (same screen as the game: level 12
  of the rebuild is the mockup's «LEVEL RUSH HOUR 3»).
- Metro Nightmare (quality bar, side-by-side in every delivery).
- Teardown: `teardown.md` in this folder (Niky's teardown, branch
  `niky/teardown-traffic-chaos`, condensed + the r1 answers to its 3 defeats).
- Prototype art: Niky's prototype (`danielsanchezverdasco-art/dana-games-juegos`,
  branch `niky/traffic-chaos-prototipo`, `traffic-chaos/prototipo/`) — light frames and
  the hand image were reviewed; the rules were ported verbatim, the art was rebuilt
  from this bible.
