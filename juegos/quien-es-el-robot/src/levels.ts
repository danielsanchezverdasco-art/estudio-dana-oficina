// Level definitions — Who Is the Robot? / ¿Quién es el Robot?
// Design space: 390x844. Playfield x 0..390, y ~150..760 (HUD top, buttons
// bottom). Every level has a deterministic placement (seeded RNG): the same
// level always puts the robot and the crowd in the same slots, so the test
// harness can replay the solution (Tetris-GDD method: a level is only
// shippable if its solution wins — no unwinnable level ships).
//
// Difficulty plan (binding, from the skills: difficulty-and-balancing +
// level-design + onboarding-and-teaching):
// - Blocks of 5, sawtooth: teach (cheap failure) -> test -> combine -> twist.
//   L1 teaches SCAN (hand + "Drag to scan", 6 people, 45 s). L2 teaches TAP.
//   L3 teaches DECOYS (first glints: shiny is not the robot — antenna!)
//   L11 teaches SHUFFLE (Tokyo: people swap places). L21 teaches DRIFT
//   (Paris: the robot slowly moves through the crowd).
// - Crowd 6 -> 24, timer 45 s -> 25 s. Hearts always 3. Stars = hearts left
//   (3 -> 3 stars, 2 -> 2, 1 -> 1). Coins = 20 + seconds remaining (max 45).
// - No dominant strategy (designing-mini-games): idle loses (timer),
//   spray-tapping loses (3 hearts), slow exhaustive scanning loses (timer
//   allows ~8 full sweeps at most in late levels, and the crowd moves).
// - Anti-trivial invariants (checked by tools-local/anti-trivial.mjs):
//   (1) no-scan win is impossible — tapping the unscanned robot dodges;
//   (2) 3 wrong taps fail the level; (3) every level's robot is inside the
//   playfield and reachable by the beam; (4) decoys < crowd always.

export type City = 'ny' | 'tokyo' | 'paris';
export type Outfit = 'hoodie' | 'cap' | 'jacket' | 'scarf';

export interface RobotLevel {
  level: number;
  city: City;
  crowd: number; // people count INCLUDING the robot
  time: number; // seconds on the clock
  outfit: Outfit;
  decoys: number; // glint decoys (shiny people who are not the robot)
  shuffle: boolean; // people slowly swap places
  drift: boolean; // the robot slowly moves through the crowd
  seed: number;
}

export const LEVEL_COUNT = 30;
export const MAX_HEARTS = 3;

function L(
  level: number,
  city: City,
  crowd: number,
  time: number,
  outfit: Outfit,
  decoys: number,
  shuffle: boolean,
  drift: boolean,
): RobotLevel {
  return { level, city, crowd, time, outfit, decoys, shuffle, drift, seed: 1000 + level * 7919 };
}

export const LEVELS: RobotLevel[] = [
  // --- New York (L1-10): teach scan, tap, decoys; then ramp. ---
  L(1, 'ny', 6, 45, 'hoodie', 0, false, false), // TEACH scan (hand tutorial)
  L(2, 'ny', 8, 45, 'hoodie', 0, false, false), // TEACH tap
  L(3, 'ny', 8, 40, 'hoodie', 2, false, false), // TEACH decoys
  L(4, 'ny', 10, 40, 'cap', 2, false, false),
  L(5, 'ny', 12, 35, 'jacket', 3, false, false),
  L(6, 'ny', 12, 35, 'hoodie', 3, false, false),
  L(7, 'ny', 14, 32, 'cap', 3, false, false),
  L(8, 'ny', 14, 32, 'scarf', 4, false, false),
  L(9, 'ny', 16, 30, 'jacket', 4, false, false),
  L(10, 'ny', 16, 30, 'scarf', 4, false, false),
  // --- Tokyo (L11-20): TEACH shuffle — people swap places. ---
  L(11, 'tokyo', 14, 35, 'hoodie', 3, true, false),
  L(12, 'tokyo', 16, 32, 'cap', 4, true, false),
  L(13, 'tokyo', 16, 32, 'jacket', 4, true, false),
  L(14, 'tokyo', 18, 30, 'scarf', 4, true, false),
  L(15, 'tokyo', 18, 30, 'hoodie', 5, true, false),
  L(16, 'tokyo', 18, 30, 'cap', 5, true, false),
  L(17, 'tokyo', 20, 28, 'jacket', 5, true, false),
  L(18, 'tokyo', 20, 28, 'scarf', 5, true, false),
  L(19, 'tokyo', 20, 28, 'hoodie', 5, true, false),
  L(20, 'tokyo', 20, 28, 'cap', 5, true, false),
  // --- Paris (L21-30): TEACH drift — the robot moves. Twist: drift + shuffle. ---
  L(21, 'paris', 18, 32, 'hoodie', 4, false, true),
  L(22, 'paris', 20, 30, 'cap', 5, false, true),
  L(23, 'paris', 20, 30, 'jacket', 5, false, true),
  L(24, 'paris', 22, 28, 'scarf', 5, true, true),
  L(25, 'paris', 22, 28, 'hoodie', 5, true, true),
  L(26, 'paris', 22, 28, 'cap', 6, true, true),
  L(27, 'paris', 24, 25, 'jacket', 6, true, true),
  L(28, 'paris', 24, 25, 'scarf', 6, true, true),
  L(29, 'paris', 24, 25, 'hoodie', 6, true, true),
  L(30, 'paris', 24, 25, 'cap', 6, true, true),
];

export function levelDef(level: number): RobotLevel {
  return LEVELS[Math.max(0, Math.min(LEVEL_COUNT - 1, level - 1))];
}

export function cityOf(level: number): City {
  return levelDef(level).city;
}

/** Deterministic daily level: day-of-year cycles 1..30. */
export function dailyLevel(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return ((day - 1) % LEVEL_COUNT) + 1;
}

/** Seeded RNG (mulberry32) — deterministic per level. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Local clamp — levels.ts is Phaser-free so Node can import it directly. */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export interface PersonSpot {
  x: number;
  y: number;
  scale: number;
  variant: number; // 0..17 person texture variant
  accessory: 'none' | 'glasses' | 'phone' | 'earring' | 'bag';
  isRobot: boolean;
  isDecoy: boolean;
}

export interface CrowdPlacement {
  robot: PersonSpot;
  people: PersonSpot[]; // includes the robot (isRobot flag); length = crowd
}

// Playfield rows (design coords 390x844): back / mid / front with depth scale.
const ROWS = [
  { yMin: 250, yMax: 360, scale: 0.72, step: 44, x0: 26 },
  { yMin: 400, yMax: 520, scale: 0.86, step: 48, x0: 24 },
  { yMin: 560, yMax: 700, scale: 1.0, step: 48, x0: 20 },
];

/**
 * Deterministic crowd placement for a level. Slots are unique (no two people
 * share a slot); the robot takes one seeded slot; decoys are a seeded subset
 * of the other people. The harness replays from the same seed, so the robot
 * is always exactly where this function says it is.
 */
export function placeCrowd(def: RobotLevel): CrowdPlacement {
  const rng = mulberry32(def.seed);
  // Build the slot list (row, x) in seeded order.
  const slots: { row: number; x: number; y: number; scale: number }[] = [];
  for (let r = 0; r < ROWS.length; r++) {
    const row = ROWS[r];
    for (let x = row.x0; x <= 390 - row.x0; x += row.step) {
      slots.push({
        row: r,
        // Jitter is clamped: the robot must always stay inside the
        // playfield (x 24..366) so the beam can always reach it.
        x: clamp(x + (rng() - 0.5) * 14, 24, 366),
        y: row.yMin + rng() * (row.yMax - row.yMin),
        scale: row.scale,
      });
    }
  }
  // Seeded shuffle (Fisher-Yates).
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = slots[i];
    slots[i] = slots[j];
    slots[j] = tmp;
  }
  const chosen = slots.slice(0, def.crowd);
  const robotIdx = Math.floor(rng() * chosen.length);
  // Decoys: seeded subset of non-robot people.
  const decoyIdx = new Set<number>();
  const candidates = chosen.map((_, i) => i).filter((i) => i !== robotIdx);
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = tmp;
  }
  for (let k = 0; k < Math.min(def.decoys, candidates.length); k++) decoyIdx.add(candidates[k]);

  const accessories: PersonSpot['accessory'][] = ['none', 'none', 'none', 'glasses', 'phone', 'earring', 'bag'];
  const people: PersonSpot[] = chosen.map((s, i) => ({
    x: s.x,
    y: s.y,
    scale: s.scale,
    variant: Math.floor(rng() * 18),
    accessory: accessories[Math.floor(rng() * accessories.length)],
    isRobot: i === robotIdx,
    isDecoy: decoyIdx.has(i),
  }));
  return { robot: people[robotIdx], people };
}
