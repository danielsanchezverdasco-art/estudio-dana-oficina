---
name: game-ui-taste
description: "Game UI art direction and visual craft — the aesthetic companion to game-ui-ux-pro-max. Anti-generic taste skill for game interfaces: bans default-engine gray boxes, cyan sci-fi holograms, clipart fantasy gold frames, and AI-slop UI. Provides 12 art direction archetypes with reference games (Persona 5 kinetic brutalism, Destiny cartographic elegance, Hollow Knight hand-drawn ornament, cyberpunk glitch, cozy storybook, retro pixel, Y2K/frutiger aero, horror analog, military stencil, painterly fantasy, clean esport, PS2-era nostalgia), per-element visual craft (frames, panels, health bars, main menus, damage numbers, buttons, dialog boxes, loading screens), game typography direction, motion identity, and UI color scripting. Actions: design, style, art-direct, theme, skin, polish, redesign, and critique the look of game UI. Use when game UI looks generic, bland, default, or engine-stock, or when defining the visual identity of menus and HUD. Pure aesthetics — usability and input rules live in game-ui-ux-pro-max."
---

# Game UI Taste — Art Direction & Visual Craft

The aesthetic half of game interface design. `game-ui-ux-pro-max` governs whether the UI *works* (readability, input, feedback, accessibility); this skill governs whether it has an *identity*. Never sacrifice that skill's CRITICAL rules for style — great game UI is where the two meet.

## When to Apply

### Must Use
- Defining the visual identity of a game's menus, HUD, or full interface
- The UI "works but looks generic / default / like every other game"
- Styling or theming any game UI element: frames, panels, bars, buttons, fonts
- Building a game UI style guide or component visual spec
- Critiquing game UI aesthetics ("does this look good? does it fit my game?")

### Skip
- Layout logic, input navigation, accessibility, feedback timing → `game-ui-ux-pro-max`
- Non-game interfaces → `impeccable` / `design-taste-frontend` / `ui-ux-pro-max`

**Decision criteria**: if the question is *what should it look and move like*, use this skill. If it's *does it work for the player*, use the UX skill. Most real tasks need both.

---

## The Prime Directive

**Game UI is in-fiction graphic design.** Every screen is an artifact that could exist inside (or adjacent to) the game's world. Before drawing anything, answer: *who, inside this fiction, made this interface, and out of what?* A demon-hunting phone app? A starship's cockpit OS? A saint's illuminated manuscript? That answer generates typography, materials, color, and motion for free. UI with no answer produces the default: floating gray rectangles — the game UI equivalent of AI slop.

---

## Banned Defaults (Anti-Slop)

These are reflexes, not decisions. Each is banned **unless deliberately chosen and justified against the game's fiction**:

| Ban | The Reflex | Instead |
|-----|-----------|---------|
| `no-engine-gray` | Default Unity/Unreal gray rounded panels shipped to players | Panels built from the game's material world |
| `no-cyan-hologram` | Sci-fi = glowing cyan hologram + hex grid + scanlines | Pick ONE technical metaphor native to your fiction (cartography, CRT, medical, industrial) |
| `no-clipart-fantasy` | Fantasy = gold filigree frame + parchment texture + Cinzel | Choose a specific material culture (Norse carving, illuminated manuscript, brutalist dwarven stone) |
| `no-orbitron-reflex` | Futuristic = Orbitron/Audiowide; medieval = medieval-looking display font everywhere | Distinctive display face for titles ONLY + neutral workhorse for everything else |
| `no-purple-gradient` | Modern = purple-blue gradient + glassmorphism panels | Palette extracted from the game's art, one accent with a job |
| `no-uniform-glow` | Everything important = outer glow | Reserve glow for one semantic meaning (interactable, magic, danger — pick one) |
| `no-lens-flare-polish` | "Polish" = bloom + flare + particles on every menu | Polish = intentional motion + material fidelity, not additive effects |
| `no-borderless-void` | Menus floating in a black void with no composition | Menus are composed scenes: background, depth, lighting, focal point |
| `no-stock-icons-mix` | Mixing icon packs (Lucide + game-asset + emoji) in one UI | One bespoke-feeling icon language, consistent stroke/fill/corner DNA |
| `no-linear-tween-everything` | Same 200ms ease-out fade on every element | A motion identity: signature easing, choreography, and one memorable transition |
| `no-hud-sticker-look` | HUD elements that look pasted on top of the game (no relationship to the render) | HUD responds to world: lighting, damage, context — or is styled as a deliberate overlay layer |
| `no-caps-lock-walls` | ALL CAPS for every label and body text | Caps for short labels/titles only; mixed case for anything longer than 3 words |

---

## Art Direction Archetypes

Twelve proven directions. Each row is a coherent bundle — typography, materials, color, and motion that belong together. Use as starting DNA, then mutate toward the specific game. **Reference games are for studying, never copying.**

| Archetype | Typography | Materials & Shapes | Color Logic | Motion Identity | Study |
|-----------|-----------|--------------------|-------------|------------------|-------|
| **Kinetic Brutalism** | Chaotic mixed-case display cuts, jagged custom lettering, text as art | Hard-edged black/white shards, halftone, torn paper, 3D character poses in menus | 1 violent accent (red) on B&W; no neutrals between | Everything animates with attitude: slashes, snap-zooms, poses; menus are choreography | Persona 5, Hi-Fi Rush |
| **Cartographic Elegance** | Clean Swiss grotesque, generous tracking, thin weights over dark | Star charts, fine hairline rules, engraved lines, vast negative space | Deep space neutrals + gold/white; restrained iridescence for rarity | Slow drifts, precise cursor physics, weighty card flips; "clarity and mystery" | Destiny 1/2 |
| **Hand-Drawn Ornament** | Calligraphic or engraved display; humanist body | Ink linework, etched borders, textured paper/stone, asymmetric ornament | Muted, desaturated world palette; UI slightly darker than art | Gentle, organic: ink-bleed reveals, soft parallax; nothing snaps | Hollow Knight, Cuphead, Darkest Dungeon |
| **Diegetic Glitch** | Condensed technical sans, data-noise, mixed byte-glyphs | Chromatic aberration, signal decay, in-world screens, layered readouts | Acid accent (yellow/red) over grungy neutrals; broken color as damage state | Glitches, jitter, scan reveals — tied to fiction events (hacks, damage) | Cyberpunk 2077, NieR: Automata |
| **Cozy Storybook** | Rounded friendly display, warm humanist body | Soft rounded cards, stitched/paper/wood textures, sticker-like icons | Warm pastels, cream backgrounds, low contrast between panels | Bouncy springs, squash-stretch, playful wobbles; everything feels touchable | Animal Crossing, Spiritfarer, Unpacking |
| **Retro Pixel Honest** | Bitmap font at integer scale, strict grid | Chunky borders, dithering, 9-slice panels honest to the pixel grid | Limited palette (match console constraint fiction) | Frame-stepped (not tweened) animation, instant snaps, CRT optional | Celeste, Shovel Knight, Undertale |
| **Y2K / Frutiger Aero** | Glossy rounded sans, chrome or aqua text effects | Bubbles, gloss highlights, lens curvature, translucent plastic | Sky blues, glass greens, white gradients, optimism | Swooshy arcs, elastic overshoots, sparkle accents | Jet Set Radio, early-2000s revival indies |
| **Analog Horror** | Typewriter/photocopy serifs, degraded stamps | VHS grain, photocopied paper, redaction bars, handwriting | Near-monochrome + one wound color; darkness as material | Flicker, hard cuts, wrong-frame holds; motion that unsettles | Resident Evil 7, Signalis, FAITH |
| **Military Stencil** | Stencil/DIN condensed, coordinates and codes as texture | Riveted plates, webbing, map overlays, worn paint chips | Olive/coyote/gunmetal + warning orange/red chevrons | Mechanical: slides with clunks, radar sweeps, typewriter text | Battlefield, Tarkov, Metal Gear |
| **Painterly Fantasy** | Refined serif or uncial-flavored display used sparingly; readable body | Brushwork panels, soft vignettes, illustrated frames as concept art | Rich saturated world hues; UI borrows the painting's light | Soft cross-dissolves, candle-flicker life, cloth-like sweeps | Ori, Gris, Bastion |
| **Clean Esport** | Aggressive italic condensed display + neutral UI sans | Angled cuts, diagonal energy, carbon/metal panels, team-color slots | Dark base + high-chroma team/rank accents | Fast (120–180ms), sharp, confident; winner-moment ceremony only | Valorant, Rocket League, Apex |
| **PS2-Era Memory** | Compressed low-res sans, deliberate anti-aliasing artifacts | Simple geometric planes, fog, low-poly icons, memory-card fiction | Dusty saturated primaries, gamma-crushed darks | Naive hard tweens, menu "rooms" you travel through | Nostalgia indies (Paratopic-adjacent), demake aesthetics |

**Hybrid rule**: pick ONE dominant archetype, borrow at most one trait from a second. Two full archetypes mixed evenly reads as incoherent.

---

## Per-Element Craft

### Frames & Panels
The panel IS the brand. Derive its edge treatment from the fiction's materials: torn (punk), engraved (fantasy), beveled metal (military), hairline (elegant sci-fi). Vary panel importance through material weight, not just size — a legendary item's frame should feel *heavier*, not just oranger. Corners are identity: sharp, chamfered, rounded, or irregular — pick one language.

### Health & Resource Bars
The most-seen pixels in the game deserve bespoke design: shaped containers (arcs, vials, runes, segmented mags) beat naked rectangles when genre allows. The fill material matters — liquid, energy, blood, light — and its damage/drain animation is a signature moment (see UX skill `resource-bars` for the ghost-drain mechanic; style it here).

### Main Menu
The game's cover in interactive form: a composed scene (background, lighting, depth, music) with typography doing the branding work. The logo placement, the idle motion, and the "press start" moment set tone in 2 seconds. Menu evolves with story progress = elite-tier detail.

### Buttons & Focus States
Gamepad focus is your hover — design it as a first-class visual: material change (ink spread, energy charge, metal shine), not just a color swap. The focused element should feel *selected by the world's rules*.

### Damage Numbers & Combat Text
Custom-drawn numerals or heavily-styled type; crits get a different *cut* (weight, slant, burst), not just bigger. Physics of the numbers (arc, gravity, fade) is part of the game's feel signature.

### Dialog & Subtitle Boxes
Speaker identity through the box itself: portrait treatment, name-plate material, per-character accent or type flavor (within legibility law). The text-reveal rhythm and blip-sound are personality.

### Icons
One bespoke language: consistent stroke weight, corner DNA, fill discipline, and silhouette-first design (UX skill's grayscale test still applies). Rarity/element/type communicated by frame + glyph, never color alone.

### Loading & Transition Screens
Never a naked spinner: lore artifacts, character vignettes, world tips styled as in-fiction documents. The transition INTO loading (wipe, iris, dissolve) belongs to the motion identity.

---

## Typography Direction

- `two-font-law` — One distinctive display face (titles, headers — carries the fiction) + one neutral workhorse (body, numbers, labels — carries the information). The display face is where the personality budget goes; the workhorse obeys the UX skill's legibility rules.
- `display-earns-its-place` — Display type appears at large sizes in few places (title screen, chapter cards, victory). Sprinkling it everywhere cheapens it and kills readability.
- `custom-lettering-moments` — The 2–3 highest moments (logo, "YOU DIED", rank-up) deserve hand-crafted lettering, not a font.
- `numbers-are-a-font-choice` — Damage numbers, timers, and scores need a numeral set chosen for the game's feel: chunky slab (impact), thin mono (technical), hand-drawn (organic). Tabular always.
- `localization-reality` — The display font must have a fallback strategy for CJK/Cyrillic before you fall in love with it. Test the German string.

## Color Scripting

- `palette-from-the-art` — Extract the UI palette from the game's key art/environments; UI hues should look *lit by the same world*. Never introduce a foreign hue for UI convenience.
- `one-accent-one-job` — A single accent color with one semantic job (interactable / focus / danger). Persona 5's red works because nothing else is red.
- `rarity-scale-styled` — If using rarity colors, restyle the standard scale through your fiction (engraving metals, ink saturation, corruption level) instead of raw hue swaps.
- `darkness-is-material` — Dark UI ≠ #000 panels. Dark comes from the world: smoke, void, night sky, unlit metal — with texture and depth.
- `ui-lighting` — Elite detail: UI reacts to game lighting/state (menus tinted by region, blood on the pause screen, HUD dimming at night).

## Motion Identity

- `signature-transition` — Design ONE memorable transition (Persona's slash, Destiny's card-flip) and reuse it as the brand. Everything else stays quiet.
- `easing-as-personality` — Pick the curve family that matches fiction: springs (playful), sharp exponentials (aggressive), long soft eases (elegant), stepped (retro). Codify it as tokens; never mix families.
- `choreography-over-simultaneity` — Elements enter in a composed sequence (30–60ms stagger, hierarchy order), like a title sequence — not all at once.
- `idle-life` — Menus breathe: subtle background motion, focus pulse, particle whispers — at an intensity that survives 100 hours without annoying.
- `speed-law-still-applies` — All of this within the UX skill's timing budget (≤250ms interactive transitions, skippable ceremony). Personality expressed through *shape* of motion, not duration.

---

## Workflow

### Step 1: Interrogate the Fiction
Answer in one line each: Who made this UI in-fiction? Out of what material? In what era/culture? For whom? What's the emotional temperature (violent, serene, absurd, oppressive)? If the game has no diegetic justification (abstract puzzle), the answer is the game's *graphic* identity instead.

### Step 2: Choose the Archetype DNA
Pick 1 dominant archetype (+ max 1 borrowed trait). Write the direction as a sentence: *"Swiss cartography meets Norse engraving: hairline rules and etched metal, bone-white on deep pine, mechanical sliding motion."* If the sentence could describe two unrelated games, sharpen it.

### Step 3: Build the Identity Kit
Define before building screens: 2 fonts + numeral style; palette (base, surfaces, text, 1 accent + its job); panel/frame language (corners, edges, materials); icon DNA; motion tokens (easing family, durations, signature transition); sound-of-the-UI direction.

### Step 4: Craft the Hero Screens
Design the 3 highest-impact surfaces first — main menu, pause/HUD, and the game's most-lived-in screen (inventory/loadout/map). Nail identity there; propagate to the rest.

### Step 5: Taste Check
- **Screenshot test**: would a player recognize the game from a cropped UI screenshot with no logo?
- **Slop scan**: run the Banned Defaults table — anything present by reflex?
- **Coherence test**: do all screens look like artifacts from the same world?
- **UX gate**: run `game-ui-ux-pro-max` §1–§3 (readability, input, feedback) — style ships only if it passes.

---

## Reference Resources

- **Game UI Database** — gameuidatabase.com — 1,300+ games, 55,000+ screenshots, filterable by genre/element; the first stop for any element reference
- **Interface In Game** — interfaceingame.com — curated screenshots and videos of game interfaces
- **HUDS+GUIS** — hudsandguis.com — game and film UI/FUI inspiration
- **David Candland (Bungie) — "Tenacious Design and the Interface of Destiny"** (GDC 2016) — the canonical AAA UI art direction talk: Swiss typography + cartography, "clarity and mystery"
- **Atlus Persona 5 UI dev panels** — layered B&W + single red, 3D poses in menus, motion as attention direction on chaotic screens
- **Game Maker's Toolkit / design essays on P5, Destiny, Hollow Knight UI** — analysis of why these identities work
- Companion skill: **`game-ui-ux-pro-max`** — usability, input, feedback, accessibility; its bibliography (Hodent, Swink) is the science under this craft
