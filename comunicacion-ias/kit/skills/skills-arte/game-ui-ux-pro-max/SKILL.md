---
name: game-ui-ux-pro-max
description: "Game UX/UI design intelligence for PC, console, mobile, and web games, grounded in published research: Celia Hodent's Gamer's Brain UX framework (7 usability pillars + engage-ability), Steve Swink's Game Feel, Self-Determination Theory, flow theory, Game Accessibility Guidelines, and Xbox Accessibility Guidelines. Covers HUD design, menus, game feel/juice, diegetic vs non-diegetic UI, input schemes (gamepad, keyboard+mouse, touch), genre patterns (FPS, RPG, strategy, roguelike, casual, racing, horror), onboarding and tutorials, game accessibility (CVD, subtitles, remapping, difficulty), console TRC/safe zones, and engine implementation (Unity UI Toolkit/uGUI, Unreal UMG/CommonUI, Godot Control, Phaser, Roblox, UEFN). Actions: plan, build, create, design, implement, review, fix, improve, and polish game UI/UX. Elements: HUD, health bar, minimap, inventory, dialog box, skill tree, radial menu, pause menu, main menu, settings screen, loading screen, damage numbers, quest log, crosshair, hotbar. Topics: readability at distance, juice, feedback loops, input latency, controller navigation, localization, monetization UX, FTUE, dark patterns to avoid."
---

# Game UI/UX Pro Max - Game Design Intelligence

Comprehensive game UX/UI guide for PC, console, mobile, and web games. Priority-ordered rules, genre-specific patterns, engine implementation notes, and pre-ship checklists. Companion to `ui-ux-pro-max` (web/app UI) — use this one whenever the interface belongs to a game.

## When to Apply

Use this Skill when the task involves **game interfaces, player feedback, game feel, input handling, or player experience quality**.

### Must Use

- Designing or building HUDs (health, ammo, minimap, objectives, hotbars, crosshairs)
- Creating menu systems (main menu, pause, settings, inventory, skill trees, shops)
- Implementing player feedback: hit markers, damage numbers, screen shake, juice
- Choosing UI style for a game (diegetic, non-diegetic, spatial, meta)
- Input & navigation: gamepad focus navigation, touch controls, remapping
- Onboarding, tutorials, FTUE (first-time user experience)
- Game accessibility (colorblind modes, subtitles, motion sickness, difficulty options)
- Reviewing game UI for readability, clarity, or console certification issues

### Recommended

- Game "feels flat" or "unresponsive" but the reason is unclear
- Players get lost, confused, or quit early (retention/UX problems)
- Porting UI between platforms (PC ↔ console ↔ mobile)
- Building a game UI component library or style guide

### Skip

- Pure gameplay logic, physics, netcode, or AI with no player-facing surface
- Backend/live-ops infrastructure
- Non-game apps and websites → use `ui-ux-pro-max` instead
- Pure aesthetics/art direction of game UI (visual identity, theming, style archetypes) → use `game-ui-taste`; this skill still gates its output on readability/input/feedback

**Decision criteria**: If the task changes what the **player sees, hears, feels, or does through the interface**, use this Skill.

---

## Foundations — The Science Behind the Rules

Every rule in this skill traces back to published frameworks. When rules conflict or a situation isn't covered, reason from these foundations.

### Celia Hodent's Game UX Framework (*The Gamer's Brain*)

Game UX = **Usability** (can the player use it?) + **Engage-ability** (does the player want to keep playing?). Evaluate every screen and interaction against both.

**The 7 Usability Pillars:**

| Pillar | Meaning | Applied in this skill |
|--------|---------|----------------------|
| 1. Signs & Feedback | Every game state and action has perceivable cues: informative signs (health bar), inviting signs (glowing door), feedback (hit flash) | §3 Feedback (`acknowledge-everything`), §4 HUD |
| 2. Clarity | All signs perceivable given human vision/attention limits — contrast, size, motion, timing | §1 Readability (all rules) |
| 3. Form Follows Function | The look of an element signals what it does; affordances honest (red barrel explodes; button looks pressable) | §8 Style (`icon-shape-language`, `rarity-language`) |
| 4. Consistency | Signs, controls, interface conventions, and world rules stay uniform — and respect genre/platform conventions players already learned | §2 Input (`confirm-cancel-consistency`), §4 (`hud-regions`) |
| 5. Minimum Workload | Reduce cognitive load (memory, attention) and physical load (clicks, holds); the brain's attention is the bottleneck resource | §5 Menus (`time-to-gameplay`), §7 Onboarding (`one-thing-at-a-time`) |
| 6. Error Prevention & Recovery | Anticipate player mistakes; make errors cheap to recover (undo, confirm on destructive, fast retry) | §5 (`back-predictable`), §7 (`failure-safe-teaching`) |
| 7. Flexibility | Options to accommodate different bodies, minds, and preferences: remapping, HUD scale, subtitles, difficulty | §6 Accessibility (all rules) |

**Engage-ability — 3 pillars (Hodent, GDC "The Gamer's Brain" series):**

- **Motivation** — grounded in Self-Determination Theory (Deci & Ryan): support **competence** (visible progress, mastery curves, meaningful feedback), **autonomy** (meaningful choices, build variety, opt-in systems), **relatedness** (social presence, co-op, community). UI's job: make progress and choice *visible* (XP bars, skill trees, loadouts).
- **Emotion** — game feel, aesthetics, surprise, discovery. UI contributes through juice, ceremony, and art-direction cohesion (§3, §8).
- **Game Flow** (Csikszentmihalyi via Hodent/Chen) — challenge matched to skill over time; clear goals; immediate feedback. UI's job: communicate goals (objectives, markers), difficulty options to keep players in the flow channel, and never interrupt flow with avoidable friction (unskippable popups, menu latency).

### The Brain's Limits (Hodent's cognitive chain: Perception → Attention → Memory)

- **Perception is subjective** — players don't see what's rendered; they see what their brain constructs. Test with real players; use redundant channels (icon + color + sound + haptic).
- **Attention is the bottleneck** — inattentional blindness is the default: players WILL miss the tutorial text shown during combat. Never teach or notify during high-load moments (`motion-vs-reading`).
- **Working memory ≈ 3–4 items** — never require holding more than ~3 new things in mind; chunk information; keep reference info retrievable (`control-reference`), not memorized.
- **Learning needs spacing and doing** — memory consolidates through spaced repetition and action, not reading. This is why `teach-by-doing` + reinforce-twice beats any text dump.

### Steve Swink's *Game Feel* (real-time control + simulated space + polish)

Feel = the moment-to-moment sensation of controlling a virtual object. UI/feedback work amplifies it through **polish**: effects that reinforce physical interactions (hitstop, particles, sound, shake) without changing simulation. Input→response latency is the foundation — no juice fixes a 200ms-late response (`input-latency-100ms`).

**Juice discipline** (Jonasson & Purho "Juice It or Lose It", counterweighted by GDC's "Don't Juice It or Lose It"): juice amplifies meaning already present; it cannot create meaning. Apply proportionally to gameplay significance (`juice-hierarchy`) — uniform maximal juice reads as noise and fatigues players.

### Accessibility Standards (industry baseline, AAA-proven)

- **Game Accessibility Guidelines** (gameaccessibilityguidelines.com) — tiered Basic/Intermediate/Advanced across motor, cognitive, vision, hearing, speech. Treat **all Basic items as mandatory**; Intermediate as default targets.
- **Xbox Accessibility Guidelines (XAGs)** — Microsoft's testable per-feature criteria (text size ≥26px @1080p baseline, contrast ratios, screen narration); the de facto console certification-adjacent bar.
- **AbleGamers APX** — patterns for player-first accessible design.
- **AAA reference implementations**: The Last of Us Part II (~60 options, per-element presets), God of War Ragnarök (per-element color, navigation assist), Forza (menu narration) — cite these when arguing for scope.

### Mobile F2P Best Practices (GameAnalytics / industry FTUE research)

- **Session 1 decides retention**: reach the core loop in <60s; first win inside the first session; D1 retention is made or lost in the FTUE.
- **Open loops retain ethically**: visible in-progress goals (quest with progress bar) leverage the Zeigarnik effect — finish-what-you-started psychology — without dark patterns.
- **Interruptibility is mobile UX**: every state survives a phone call; sessions have natural 2–5 min stopping points; progress is never lost silently.

---

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|----------|----------|--------|------------------------|------------------------|
| 1 | Readability & Clarity | CRITICAL | Legible at 3m/10ft on TV, contrast vs any gameplay backdrop, safe zones | Thin fonts over gameplay, info only in corners, tiny text on TV |
| 2 | Input & Navigation | CRITICAL | Full gamepad focus nav, <100ms input feedback, remapping | Mouse-only menus on console, focus traps, unskippable input modes |
| 3 | Feedback & Game Feel | CRITICAL | Every action acknowledged (visual+audio+haptic), juice budget on key actions | Silent failures, feedback spam that hides gameplay |
| 4 | HUD Design | HIGH | Info hierarchy by urgency, contextual hiding, HUD scale option | Permanent screen clutter, duplicated info, HUD blocking action |
| 5 | Menus & Flow | HIGH | ≤3 clicks to play, resume in ≤2 inputs, consistent back behavior | Deep nesting, unskippable splash chains, lost state on back |
| 6 | Accessibility | HIGH | CVD-safe palette+shapes, subtitle standards, hold/toggle options | Color-only info, fixed tiny subtitles, mandatory QTE mashing |
| 7 | Onboarding & Tutorials | HIGH | Teach by doing, one mechanic at a time, skippable for veterans | Wall-of-text tutorials, front-loaded control dumps |
| 8 | Style & Immersion | MEDIUM | UI matches game fiction, diegetic where it helps, consistent icon language | Style clashing with art direction, mixed icon families |
| 9 | Platform & Certification | MEDIUM | Title-safe area, platform glyphs, suspend/resume handling | Hardcoded button names, UI in overscan area |
| 10 | Monetization & Meta UX | LOW | Honest pricing, clear odds, ethical retention | Dark patterns, fake urgency, pay-wall disguised as tutorial |

---

## Quick Reference

### 1. Readability & Clarity (CRITICAL)

- `tv-distance-legibility` - Body UI text ≥ 26px at 1080p (≈1.2° visual angle) for couch/TV play; never below 18px equivalent
- `dynamic-backdrop-contrast` - UI must stay readable over ANY gameplay frame: add scrims, outlines, drop shadows, or darkened panels behind text
- `text-outline-or-plate` - HUD text over 3D worlds needs outline/shadow/plate; raw text over gameplay always fails somewhere
- `safe-zone` - Keep critical UI inside 90% title-safe area (5% margin each edge) for TV overscan and streaming crops
- `information-hierarchy` - Rank by urgency: survival info (health) > action info (ammo/cooldowns) > goal info (objectives) > ambient info (score)
- `glanceability` - Player reads HUD in <0.5s peripheral glances; use position, color, and shape — not text — for state
- `icon-shape-language` - Icons distinguishable by silhouette alone (grayscale test); never rely on color or inner detail only
- `numbers-tabular` - Tabular figures for score, timer, ammo, damage numbers — prevents jitter as digits change
- `font-game-safe` - Pick fonts with clear 0/O, 1/l/I distinction; test at smallest HUD size; avoid ultra-thin weights
- `localization-expansion` - Reserve 30–40% width headroom for German/Russian; test CJK line-height; never bake text into textures
- `ui-scale-option` - Provide HUD scale slider (80–130%); mandatory for PC, strongly expected on console
- `motion-vs-reading` - Never require reading during intense action; pause or slow time for mandatory reading (loot comparison, dialogs)

### 2. Input & Navigation (CRITICAL)

- `gamepad-first-menus` - Every menu fully navigable with d-pad/stick + confirm/cancel; design focus order before layouts
- `visible-focus` - Focused element unmistakable from 3m: scale up, glow, color plate — not just a thin outline
- `focus-never-lost` - Focus always lands somewhere valid after any screen change, item removal, or tab switch; no dead ends
- `input-latency-100ms` - Visual response within 100ms of any input; button press → same-frame acknowledgment where possible
- `confirm-cancel-consistency` - Confirm/cancel buttons consistent across ALL screens and match platform convention (e.g., Japan swap on Switch/PS)
- `shoulder-tabs` - Use LB/RB (L1/R1) for tab switching in multi-tab screens; show glyph hints on the tabs
- `remappable-controls` - Full input remapping for KBM and gamepad; show current bindings in tutorials and prompts dynamically
- `dynamic-input-glyphs` - Detect active device and swap prompts (Xbox/PS/Switch/KBM/touch) instantly, mid-session
- `dead-zone-tuning` - Stick navigation needs repeat-delay then repeat-rate (like key repeat); avoid single-step-only or uncontrollable scrolling
- `radial-menus` - For gamepad item/weapon selection: radial menu + slow-time beats grid; support flick-select
- `touch-target-games` - Mobile: ≥ 9mm (~48dp) touch targets; thumb-zone placement for core actions; no critical controls at top center
- `virtual-stick-options` - Mobile: offer fixed/floating stick choice, opacity slider, and left/right layout swap
- `hold-vs-toggle` - Every hold-to-X (aim, sprint, crouch) needs a toggle alternative in settings
- `buffered-input` - Accept slightly-early inputs (jump buffering, coyote time analogs in UI: queue menu inputs during transitions)
- `mouse-and-gamepad-parity` - PC: every screen works with both simultaneously; hovering with mouse moves focus, no mixed-state bugs

### 3. Feedback & Game Feel (CRITICAL)

- `acknowledge-everything` - Every player action gets feedback: press → visual + audio (+ haptic); silence reads as broken
- `juice-hierarchy` - Spend juice on meaning: kills/level-ups/crits get the fireworks; footsteps don't. Uniform juice = noise
- `hit-feedback-stack` - Hits combine layers: hit-flash on target + hitmarker/sound + damage number + slight hitstop for heavy hits
- `damage-numbers` - If used: pooled, staggered spawn positions, crits differentiated by size/color, cap density, offer off-switch
- `screen-shake-restraint` - Shake is trauma-based (decaying), rotational > translational, always with intensity slider and off-switch
- `hitstop` - 2–6 frames freeze on heavy impacts sells weight; scale with impact importance; never on rapid-fire
- `low-health-communication` - Multi-channel: vignette + heartbeat audio + HUD pulse; never color-shift alone (CVD)
- `cooldown-clarity` - Cooldowns: radial wipe + ready flash + ready sound; ready-state must pop, not just fill quietly
- `progress-celebration` - Level-ups, quest completes, unlocks deserve ceremony (300–800ms), interruptible/skippable on repeat
- `reward-anticipation` - Telegraph before payoff: chest opening beat, roulette deceleration, pack-opening reveal pacing
- `error-feedback-soft` - Invalid actions: soft "denied" sound + shake/flash of the blocked element + reason ("Not enough mana") — never silent
- `haptics-semantic` - Distinct haptic patterns for distinct meanings; use adaptive triggers/HD rumble where available; always an intensity option
- `audio-ui-language` - Consistent UI sound family: navigate/confirm/cancel/error/reward each get a distinct, related sound
- `interruptible-animation` - All UI animations skippable by input; repeated ceremonies get fast-forward; never lock input for polish
- `tween-standards` - UI transitions 120–250ms, ease-out in / ease-in out; menus feel snappy, not floaty; respect reduced-motion

### 4. HUD Design (HIGH)

- `contextual-hud` - Show elements when relevant: ammo on weapon-draw/fire, health on damage/low, fade after N seconds idle
- `hud-regions` - Conventional anchors: health bottom-left or top-left, ammo bottom-right, minimap corner, objectives top — deviate deliberately
- `center-is-sacred` - Screen center = gameplay + crosshair + critical alerts only; nothing persistent in the middle third
- `diegetic-when-immersive` - In-world UI (Dead Space health spine, Metro watch) for immersion-first games; costs glanceability, gate on genre
- `minimap-vs-compass` - Compass for guided/linear or immersive games; minimap for spatial/tactical; never both prominent at once
- `objective-markers` - Off-screen indicators clamp to edges with distance; on-screen markers shrink/fade when close; offer marker-free mode
- `boss-bars` - Boss health top-center, segmented for phases; distinct from ambient enemy bars
- `enemy-health-bars` - World-space bars: fade when full, damage-delta ghost bar (white chunk that drains), scale capped by distance
- `resource-bars` - Health/mana/stamina: instant loss + delayed drain ghost; gains animate; flash at thresholds (25%)
- `hotbar-clarity` - Slots show: binding glyph, cooldown state, resource-gate (grayed if unaffordable), stack count — at a glance
- `crosshair-communication` - Crosshair carries state: spread (accuracy), hit confirm, enemy-over tint, interaction swap; offer customization
- `hud-toggle-photo` - Full HUD-off toggle and photo mode expected in narrative/open-world titles
- `notification-discipline` - Toasts/feed in ONE region, queued, max 2–3 visible, auto-collapse; never cover reticle or objectives
- `damage-direction` - Directional damage indicators (arc around reticle/center) mandatory in any game with off-screen threats

### 5. Menus & Flow (HIGH)

- `time-to-gameplay` - Cold boot → gameplay in minimum steps; "Continue" is the first, default-focused option on main menu
- `pause-instant` - Pause opens instantly (<100ms), gameplay-blurred behind; Resume is default focus; unpause equally instant
- `settings-live-preview` - Settings apply live or preview instantly (brightness, HUD scale, subtitles show sample line); confirm-revert timer for display changes
- `settings-search-structure` - Group: Gameplay / Controls / Video / Audio / Accessibility / UI; per-item description text; show current vs default
- `back-predictable` - Cancel/back walks up exactly one level; hold-to-quit or confirm for destructive exits; state (tab, scroll, selection) preserved on return
- `save-communication` - Autosave icon + "don't turn off" convention; manual save shows slot metadata (time, location, playtime, screenshot)
- `loading-screens` - Show progress truthfully; tips/lore rotate; interactive loading if >8s typical; never fake-freeze at 99%
- `inventory-grid-ux` - Sort + filter + search for >20 items; compare overlay vs equipped; "new item" badges clear on view, not on open
- `skill-tree-ux` - Zoom+pan, path preview, respec affordance clarity, planned-build ghost states; readable both zoomed in and out
- `shop-clarity` - Price, currency icon, affordability state, and "what do I get" preview always co-located; confirm on spend
- `dialog-choice-ux` - Choices: paraphrase honestly, mark tone/consequence icons if stylized, timer only if diegetic; log of past dialog
- `splash-skippable` - All logos/splash/intro cinematics skippable after first view; single input, not hold-to-skip chains

### 6. Accessibility (HIGH)

- `cvd-safe-design` - Never color-only: enemy/ally = shape+outline, rarity = icon+frame, wires/keys = symbols; offer deuteranopia/protanopia/tritanopia filters or better, per-element color pickers
- `subtitle-standards` - On by default; ≥46px @4K equivalent options, speaker names, background plate option, size options, directional indicators for off-screen speakers
- `remap-everything` - Full remap incl. sticks-swap, hold/toggle per action, and one-handed presets where feasible
- `difficulty-granular` - Beyond presets: separate sliders (damage taken/dealt, timing windows, aim assist strength); no achievement-shaming
- `qte-alternatives` - Mashing → hold alternative; timed QTE → extended/auto option; never gate story on reflex-only
- `motion-comfort` - FOV slider (PC/console shooters), camera shake off, head-bob off, motion blur off — all independent toggles
- `photosensitivity` - No full-screen flashes >3Hz; test strobe sequences; provide flash-reduction mode (industry post-CES expectations)
- `screen-reader-menus` - Menu narration (UI screen reader) is now expected on major platforms; at minimum ensure text-to-speech on all menu text
- `aim-assist-spectrum` - Aim assist as opt-in gradient (magnetism, snap, stickiness) benefits motor accessibility; expose as slider not binary
- `text-chat-tts-stt` - Multiplayer: text-to-speech and speech-to-text for chat (platform requirement in many cases)
- `pause-anywhere` - Single-player: pausable always, including cutscenes; unavoidable non-pause moments minimized and communicated
- `accessibility-menu-first-boot` - Surface accessibility options on first boot before any gameplay/reading is required

### 7. Onboarding & Tutorials (HIGH)

- `teach-by-doing` - Introduce mechanic → safe space to try → real test; never text-dump controls
- `one-thing-at-a-time` - One new mechanic per beat; reinforce twice before layering the next
- `contextual-hints` - Just-in-time prompts on first encounter, not front-loaded; re-show only on repeated failure
- `skippable-veteran` - "Have you played before?" or skippable tutorial; never lock experienced players in a 20-min intro
- `tutorial-diegetic` - Best tutorials are level design (Mario 1-1 pattern): the environment teaches, UI only confirms
- `failure-safe-teaching` - No harsh punishment during teaching; failure in tutorial restarts instantly at the lesson
- `control-reference` - Always-available controls/glossary screen from pause; searchable in complex games
- `ftue-metrics` - FTUE = first session make-or-break: time-to-first-fun < 5 min (mobile: < 60s to core loop)
- `progressive-complexity` - Gate advanced systems (crafting, skill trees) behind early progression; introduce when relevant, not at once
- `remind-after-absence` - Returning after days? Recap objective + controls refresher offer ("Previously on...")

### 8. Style & Immersion (MEDIUM)

- `ui-fiction-match` - UI is part of the art direction: sci-fi = holographic/technical, fantasy = materials (parchment, stone, metal), horror = minimal/diegetic
- `four-ui-types` - Know the split: diegetic (in-world, in-fiction), non-diegetic (overlay HUD), spatial (in-world, not in-fiction — e.g. outline highlights), meta (screen effects — blood vignette). Mix intentionally
- `consistent-icon-family` - One icon style (stroke, fill, corner language) across HUD, menus, and map; no emoji as game icons
- `rarity-language` - Rarity colors follow genre convention (gray→green→blue→purple→orange) unless deliberately subverted with support cues
- `frame-materials` - Panel/frame styling from the game's material world; avoid default-engine gray boxes shipping to players
- `animation-personality` - Menu transitions carry the game's personality (Persona 5 principle) — but never at the cost of speed on repeat visits
- `world-map-style` - Maps styled as in-fiction artifacts where possible; fog-of-war reveal consistent with fiction
- `victory-defeat-screens` - Win/lose screens set tone: defeat informative + fast retry (roguelike: run stats), victory celebratory + skippable
- `main-menu-mood` - Main menu establishes tone in 2s: scene, music, logo; menu evolves with story progress as a delight detail

### 9. Platform & Certification (MEDIUM)

- `platform-glyphs-correct` - Exact, current button glyphs per platform; never say "Press X" as text — use glyph assets; beware Nintendo A/B position
- `no-hardcoded-store-names` - Platform-neutral strings for achievements/friends/store unless platform-specific build
- `suspend-resume` - UI survives console suspend/resume and PC alt-tab: no stuck focus, timers, or disconnect dead-ends without a path back
- `connection-loss-ux` - Network loss: clear non-blaming message, auto-reconnect attempt, safe return path; never a frozen screen
- `multiple-aspect-ratios` - Anchor-based layout for 16:9 / 16:10 / 21:9 / Steam Deck / phone notches; test the extremes
- `performance-budget-ui` - UI within frame budget: batched draws, pooled elements (damage numbers!), no per-frame layout thrash, no GC spikes from UI
- `steam-deck-verified` - PC games: legible at 1280×800 7", full gamepad support, on-screen keyboard invocation = Deck Verified basics
- `mobile-interruptions` - Calls/notifications/backgrounding auto-pause gameplay and never lose progress
- `streamer-mode` - Optional: hide personal info, licensed-music toggle — increasingly expected in online titles

### 10. Monetization & Meta UX (LOW — but reputation-critical)

- `honest-pricing` - Real currency equivalence visible; avoid opaque multi-hop premium currencies; show total cost before confirm
- `disclose-odds` - Loot box / gacha odds visible pre-purchase (legal requirement in several regions)
- `no-dark-patterns` - Banned: fake countdown scarcity, pre-selected upsells, confirm-shaming, deliberately confusing bundle math, pay-to-skip-pain-you-designed
- `spend-confirmation` - Real-money purchases: full confirm step with item recap; refund path discoverable
- `battle-pass-clarity` - Show free vs paid track clearly, time remaining honestly, and realistic completion expectations
- `daily-systems-respect` - Daily rewards/streaks must not punish life (streak protection); session-end natural stopping points are ethical retention
- `ad-ux-mobile` - Rewarded ads: clear value exchange, never accidental-tap bait placement, always a close affordance on schedule

---

## Genre Patterns

| Genre | HUD Priorities | Menu Notes | Key Risks |
|-------|----------------|------------|-----------|
| **FPS/TPS** | Crosshair state, ammo, health, damage direction, hit confirm | Fast loadout swap, per-weapon stats | Center clutter, low-contrast reticles |
| **Action RPG** | Health/mana/stamina, hotbar, XP, quest tracker | Inventory compare, skill tree, map | Menu time > play time; stat overload |
| **Strategy/RTS/4X** | Resources top bar, minimap+alerts, selection panel, command card | Tech tree readability, tooltips-on-everything | Info density vs glanceability; late-game UI fatigue |
| **Roguelike/lite** | Build summary always visible, synergy clarity, run timer | Death screen = run stats + instant retry, meta progression clarity | Item effect opacity ("what does this DO?") |
| **Mobile casual** | Single-hand thumb zone, one-tap core loop, session goals | <60s to fun, resume state perfectly | Ad placement traps, top-corner critical buttons |
| **Racing** | Speed/position/lap peripheral, minimal center, track map optional | Quick restart is sacred (<2 inputs) | HUD blocking road, small lap timers |
| **Horror** | Minimal/diegetic, hide HUD when calm | Menus maintain tension (dark, sparse) | Immersion break; but never sacrifice legibility of survival info |
| **Fighting** | Health/meter symmetric top, combo counter, input display (training) | Frame data in training, quick rematch | Cluttered supers area; slow rematch flow |
| **MMO/Live** | Modular/movable HUD, castbars, group frames | Layout editor expected; addon-friendly | Default UI overwhelm for new players |
| **Puzzle** | Almost none — the board is the UI | Undo, hint economy, level select | Overexplaining; hint systems that spoil |

---

## Engine Implementation Notes

| Engine | UI System | Key Practices |
|--------|-----------|---------------|
| **Unity** | UI Toolkit (new) / uGUI | UI Toolkit for menus (USS styling, data binding); uGUI for world-space; pool everything spawned per-hit; one Canvas per update-frequency group (uGUI dirties whole canvas); TextMeshPro always |
| **Unreal** | UMG + CommonUI | CommonUI for cross-platform input routing, glyphs, and focus management; Widget pooling for lists (ListView); avoid Tick-driven bindings — use events/delegates |
| **Godot** | Control nodes | Anchors+containers over fixed positions; `ui_*` input actions for focus nav; themes for consistent styling; CanvasLayer for HUD vs world |
| **Phaser/Web** | DOM overlay or in-canvas | In-canvas for HUD (atlas-packed, bitmap fonts for numbers); DOM for text-heavy menus (a11y, i18n free); handle both mouse and touch |
| **Roblox** | ScreenGui/SurfaceGui | UIScale for device range, gamepad `GuiService.SelectedObject` navigation, mobile TouchGui conventions |
| **UEFN/Fortnite** | HUD devices + widgets | Work within HUD element toggles; custom UI via UI widgets; test on all device classes Fortnite supports |

---

## Workflow

### Step 1: Frame the Context

Identify before designing:
- **Genre + camera** (FPS? top-down? side-scroller?) → dictates HUD anchors and density
- **Platforms + inputs** (gamepad? touch? KBM? all?) → dictates navigation model and sizes
- **Fiction/art direction** → dictates UI style (diegetic level, materials, motion personality)
- **Session shape** (5-min mobile runs? 4-hour RPG sits?) → dictates menu depth tolerance and resume design

### Step 2: Design the Information Hierarchy

1. List everything the player could see; rank by urgency (survival > action > goal > ambient)
2. Assign channels: persistent HUD / contextual HUD / on-demand menu / feedback event
3. Kill or demote anything unranked — default is *not* shown

### Step 3: Build with the Priority Rules

Work through categories 1→3 (CRITICAL) as hard requirements, 4→7 (HIGH) as design drivers, 8→10 as polish/ship gates. Use the Genre Patterns table to pre-load conventions, and Engine Notes for implementation.

### Step 4: Run the Hodent UX Audit

Before implementation is "done", pass every screen/interaction through both framework lenses:

**Usability pass (7 pillars):**
1. Signs & Feedback — is every state and action perceivable?
2. Clarity — perceivable under real conditions (motion, distance, chaos)?
3. Form Follows Function — does everything look like what it does?
4. Consistency — internally, and with genre/platform conventions?
5. Minimum Workload — what can the player stop remembering or clicking?
6. Error Prevention & Recovery — what mistake will they make here, and how cheap is it?
7. Flexibility — who is excluded by the current defaults?

**Engage-ability pass (3 pillars):**
- Motivation — is progress visible? Are choices meaningful and legible? (competence / autonomy / relatedness)
- Emotion — does this moment carry the right feel and ceremony for its importance?
- Game Flow — does anything here interrupt flow avoidably (latency, popups, forced reading)?

### Step 5: Playtest the UI Specifically

- **Squint test**: blur the screen — is hierarchy still readable?
- **Grayscale test**: remove color — is every state still distinguishable?
- **Couch test**: 3m from screen — legible?
- **Gamepad-only run**: unplug the mouse — everything reachable, focus never lost?
- **Chaos frame test**: screenshot the busiest combat moment — is the HUD readable over it?
- **New-player watch**: silent observation of a first session — where do they stall?

---

## Pre-Ship Checklist

### Readability
- [ ] All HUD text legible at 3m on a TV and on a 7" handheld screen
- [ ] Text over gameplay has outline/shadow/plate; tested over brightest and darkest scenes
- [ ] Critical UI inside title-safe area; tested at 16:9, 21:9, and target mobile notches
- [ ] HUD scale option present; localization tested with German + one CJK language

### Input
- [ ] Every screen completes with gamepad only; focus never lost or trapped
- [ ] Input prompts swap instantly with active device; no hardcoded button names in strings
- [ ] Full remapping; hold/toggle options for sustained actions
- [ ] All UI feedback within 100ms; menu transitions ≤250ms and skippable

### Feel
- [ ] Every player action has visual + audio feedback; failures explain themselves
- [ ] Juice concentrated on meaningful events; screen shake and flashes have sliders/toggles
- [ ] Repeated ceremonies (level-up, loot) are fast-forwardable

### Accessibility
- [ ] Grayscale pass: no state conveyed by color alone
- [ ] Subtitles: default on, sized, speaker-named, background option
- [ ] Motion comfort set: FOV / shake / bob / blur independently toggleable
- [ ] No >3Hz full-screen flashing; QTEs have alternatives

### Platform
- [ ] Suspend/resume, alt-tab, disconnect, and phone-call interruption all recover cleanly
- [ ] UI perf: no GC/alloc spikes from spawned elements (numbers, toasts pooled)
- [ ] Splash chain skippable; cold-boot-to-gameplay path minimized; Continue is default focus

### Ethics
- [ ] No dark patterns: no fake scarcity, confirm-shaming, or hidden bundle math
- [ ] Real-money flows: total cost visible, confirm step, odds disclosed where applicable

---

## Bibliography & Sources

Core references these rules are derived from — cite them when justifying design decisions to a team:

### Books
- **Celia Hodent — *The Gamer's Brain: How Neuroscience and UX Can Impact Video Game Design*** (CRC Press, 2017) — the backbone of this skill: cognitive limits (perception/attention/memory), 7 usability pillars, engage-ability (motivation/emotion/game flow). Companion: *The Psychology of Video Games* (2020).
- **Steve Swink — *Game Feel: A Game Designer's Guide to Virtual Sensation*** (Morgan Kaufmann, 2009) — real-time control + simulated space + polish; input latency and response curves.
- **Don Norman — *The Design of Everyday Things*** — affordances, signifiers, feedback, mapping; the root of Form Follows Function.
- **Steve Krug — *Don't Make Me Think*** — self-evident interfaces; the Minimum Workload pillar in web-native form.
- **Jesse Schell — *The Art of Game Design: A Book of Lenses*** — lens-based interrogation of interface and feel (Lens of Juiciness, Lens of Transparency).
- **Mihaly Csikszentmihalyi — *Flow*** — the flow channel model behind difficulty/pacing UX; applied to games via Jenova Chen's *Flow in Games* thesis.
- **Deci & Ryan — Self-Determination Theory** — competence/autonomy/relatedness; the motivation science behind progression UI and meaningful choice.

### Industry Guidelines
- **Game Accessibility Guidelines** — gameaccessibilityguidelines.com — Basic/Intermediate/Advanced tiers across motor, cognitive, vision, hearing, speech.
- **Xbox Accessibility Guidelines (XAGs)** — learn.microsoft.com/gaming/accessibility — testable criteria: text sizing, contrast, narration, input.
- **AbleGamers APX (Accessible Player Experiences)** — accessible.games — design-pattern approach to accessibility.
- **PlayStation, Nintendo, Xbox certification requirements** — safe areas, glyph usage, suspend/resume, comms TRCs (platform NDAs; verify per platform).
- **W3C WCAG 2.x** — contrast and interaction baselines where game UI overlaps conventional UI (menus, text chat, web overlays).

### Talks & Papers (GDC and beyond)
- **Celia Hodent — "The Gamer's Brain" GDC series (parts 1–3)** — UX of onboarding, engagement, immersion/retention.
- **Martin Jonasson & Petri Purho — "Juice It or Lose It"** — the canonical juice demonstration.
- **"Don't Juice It or Lose It" (GDC)** — the restraint counterpoint: juice amplifies meaning, it doesn't create it.
- **Mark Brown — Game Maker's Toolkit** — episodes on accessibility (annual "How Accessible Were This Year's Games?"), HUD design, and onboarding as level design.
- **GameAnalytics / industry FTUE research** — 10 Tips for a Great FTUE in F2P; session-1 retention economics.
- **Naughty Dog & Sony Santa Monica accessibility postmortems** (TLOU2, God of War Ragnarök GDC/blog write-ups) — reference implementations for AAA accessibility scope.
