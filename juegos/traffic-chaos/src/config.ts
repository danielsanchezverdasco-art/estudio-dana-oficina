// Traffic Chaos: New York Rush — tuning constants + geometry + palette roles.
// Ported verbatim from Niky's prototype (dana-games-juegos, branch
// niky/traffic-chaos-prototipo, src/config.ts) — framework-free, one place to retune.
// Palette roles (directing-game-visuals): every color has a gameplay role.

export const GAME_W = 390;
export const GAME_H = 844;

// --- Layout (logical px, 390x844 portrait) ---
export const HUD_H = 92; // top HUD strip
export const BOTTOM_H = 84; // bottom bar (BOOST + pause)
export const PLAY_TOP = HUD_H;
export const PLAY_BOTTOM = GAME_H - BOTTOM_H;

// Intersection: vertical road (Broadway) x [140,250], horizontal road (42nd St) y [375,485]
export const ROAD_V = { x0: 140, x1: 250 };
export const ROAD_H = { y0: 375, y1: 485 };
export const CX = 195; // intersection center x
export const CY = 430; // intersection center y
// Conflict box: overlap inside here = crash
export const CONFLICT = { x0: 132, y0: 367, x1: 258, y1: 493 };

// Lane centers (right-hand traffic). Approaches: N = cars from the north driving
// south, S = from the south driving north, W = from the west driving east,
// E = from the east driving west.
export const LANES = {
  N: { x: 222, y: 402 }, // southbound lane center x; westbound lane center y = 402
  S: { x: 168, y: 458 }, // northbound lane center x; eastbound lane center y = 458
} as const;

// Stop lines (front-bumper coordinate). N approach stops before y=363 heading south,
// S before y=497 heading north, W before x=128 heading east, E before x=262 west.
export const STOP = { N: 363, S: 497, W: 128, E: 262 } as const;
// Spawn / exit edges (front coordinate where cars appear / disappear)
export const SPAWN = { N: PLAY_TOP - 50, S: PLAY_BOTTOM + 50, W: -50, E: GAME_W + 50 } as const;
export const EXIT = { N: PLAY_BOTTOM + 50, S: PLAY_TOP - 50, W: GAME_W + 50, E: -50 } as const;

// Traffic-light posts (one per approach, next to its stop line)
export const LIGHT_POS = {
  N: { x: 262, y: 348 },
  S: { x: 128, y: 512 },
  W: { x: 113, y: 348 },
  E: { x: 277, y: 512 },
} as const;
export const LIGHT_HIT_R = 42; // tap radius (>=44px target per accessibility skill)

// Traffic-light housing (art direction §3: dark post, three vertical lenses,
// only ONE lit at a time). The housing IS the button: tap it directly.
// Arrow on each housing points the way its lane drives (N drives south: ▼).
export const LIGHT_HOUSING = { w: 34, h: 84, lensR: 11, lensDy: 24 } as const;
export const LIGHT_HIT = { w: 76, h: 104 } as const; // interactive zone (>=44px, corner-testable)
export const LIGHT_ARROW = { N: '▼', S: '▲', W: '▶', E: '◀' } as const;
// Light pool on the road by each stop line: the lane a light controls, lit by
// its state (green = open, red = closed, amber = clearance). The state is read
// on the road itself, where the player is looking — never only on the post.
export const LIGHT_POOLS = {
  N: { x: 196, y: 318, w: 52, h: 45 },
  S: { x: 142, y: 497, w: 52, h: 45 },
  W: { x: 83, y: 432, w: 45, h: 52 },
  E: { x: 262, y: 376, w: 45, h: 52 },
} as const;

// --- Timing / difficulty (seconds, px/s) ---
export const LEVEL_DURATION = 60;
export const QUOTA = 20; // clears needed to win
export const PATIENCE_MAX = 8; // seconds stopped at red before the driver runs it
export const PATIENCE_WARN = 3; // below this: honk + shake + "!" (attack-tell)
export const TOGGLE_COOLDOWN = 0.5; // anti-mash guard (INV-3)
export const CLEARANCE = 0.6; // s all-red after a flip (amber): the box empties before the new green; mashing pays this on every flip
export const INPUT_BUFFER = 0.15; // buffered presses (input-systems)
export const GRIDLOCK_QUEUE = 5; // stopped cars on one approach = gridlock fail
export const CHAIN_RADIUS = 100; // px around a crash point: nearby cars join the chain
export const BOOST_CAR = 2; // swipe boost multiplier, per car
export const BOOST_CAR_DURATION = 3;
export const BOOST_CAR_COOLDOWN = 5;
export const BOOST_ALL = 2; // BOOST button multiplier, all cars
export const BOOST_ALL_DURATION = 4;
export const BOOST_ALL_COOLDOWN = 12;
export const RECKLESS_SPEED = 1.2; // patience-expired driver runs the red at 1.2x
export const CAR_GAP = 12; // px between queued cars (bumper to bumper)

// Spawn: interval shrinks with sqrt(difficulty) (designing-mini-games default).
// difficulty goes 0 -> 1 across the level; interval = lerp(1.4, 0.75, sqrt(d)).
export const SPAWN_T0 = 1.4;
export const SPAWN_T1 = 0.75;
export const AMBULANCE_MIN_GAP = 8; // seconds between ambulances
export const AMBULANCE_WARN = 2; // warning icon seconds before entry (attack-tell)

// --- Difficulty ---
// Normal values stay the defaults (all existing tests + balance bands).
// Level 1 is slower and more forgiving (Daniel 15/11 20:37): longer patience,
// fewer cars at once, one decision at a time; difficulty ramps in later levels.
export interface Difficulty {
  patienceMax: number; // seconds stopped at red before the driver runs it
  spawnT0: number; // spawn interval at t=0
  spawnT1: number; // spawn interval at t=duration
  quota: number; // clears needed to win
  duration: number; // level length in seconds
  openingPatience: number; // patience of the opening taxi in a 'level' opening
}
export const NORMAL_DIFFICULTY: Difficulty = {
  patienceMax: PATIENCE_MAX,
  spawnT0: SPAWN_T0,
  spawnT1: SPAWN_T1,
  quota: QUOTA,
  duration: LEVEL_DURATION,
  openingPatience: 2.0,
};
export const EASY_DIFFICULTY: Difficulty = {
  patienceMax: 12,
  spawnT0: 2.0,
  spawnT1: 1.1,
  quota: 15,
  duration: 60,
  openingPatience: 6.0,
};

// --- Scoring (causal events only, never per input — INV-4) ---
export const POINTS = { car: 10, taxi: 10, bus: 15, ambulance: 20 } as const;
export const TAXI_NOSTOP_BONUS = 5;
export const CLOSE_CALL_BONUS = 5; // cleared with patience <= 2 when it left

// --- Speeds (px/s). physics-tuning: max speed/tick at 60 Hz must stay far below the
// thinnest wall (car width 26 px). Fastest case: ambulance 135 * BOOST_ALL 2 * 1.2
// reckless = 324 px/s -> 5.4 px/tick. No tunnelling, no CCD needed. ---
export const SPEEDS = { car: 75, taxi: 100, bus: 55, ambulance: 135 } as const;
export const SIZES = {
  car: { len: 44, wid: 26 },
  taxi: { len: 44, wid: 26 },
  bus: { len: 64, wid: 26 },
  ambulance: { len: 52, wid: 26 },
} as const;

// --- Palette roles (directing-game-visuals step 6: runtime-readable) ---
export const PALETTE = {
  go: 0x22c55e, // green = go / safe / reward
  stop: 0xef4444, // red = stop / danger / crash
  warn: 0xf59e0b, // amber = patience draining / warning
  boost: 0x3b82f6, // blue = boost
  road: 0x334155, // asphalt (GDD)
  sidewalk: 0x94a3b8,
  taxi: 0xfacc15,
  bus: 0xdc2626,
  ambulance: 0xf8fafc,
  carColors: [0xf87171, 0x60a5fa, 0xa78bfa, 0x34d399, 0xfb923c],
} as const;

export const PALETTE_CSS = {
  go: '#22c55e',
  stop: '#ef4444',
  warn: '#f59e0b',
  boost: '#3b82f6',
  road: '#334155',
  sidewalk: '#94a3b8',
  taxi: '#facc15',
  bus: '#dc2626',
  ambulance: '#f8fafc',
} as const;

// HUD anchors (probing-web-game-mechanics visual contract)
export const HUD = {
  score: { x: 14, y: 14 },
  timer: { x: GAME_W / 2, y: 14 },
  quota: { x: GAME_W - 14, y: 14 },
  metaStrip: { x: 14, y: 58, w: GAME_W - 28, h: 22 },
  boostButton: { x: 20, y: GAME_H - 64, w: 150, h: 52 },
  pauseButton: { x: GAME_W - 70, y: GAME_H - 64, w: 50, h: 52 },
} as const;

/** Machine-readable visual contract: palette roles + HUD anchors, shared by the
 *  renderer and the probes so drawing and assertions cannot disagree. */
export function visualContract() {
  return {
    palette: { ...PALETTE_CSS },
    hud: {
      score: HUD.score,
      timer: HUD.timer,
      quota: HUD.quota,
      metaStrip: HUD.metaStrip,
      boostButton: HUD.boostButton,
      pauseButton: HUD.pauseButton,
    },
    lights: LIGHT_POS,
    conflictBox: CONFLICT,
  };
}
