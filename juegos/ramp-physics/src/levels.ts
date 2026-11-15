// Level definitions — Ramp Physics: Ragdoll Crash Test.
// Design space: 390x844. Playfield y 110..768 (HUD top, ink bar + buttons
// bottom). Every level has an explicit `solution`: the strokes the test
// harness draws to prove the level is winnable (Tetris-GDD method: a level
// is only shippable if its solution wins — no unwinnable level ships).
// Physics notes (Matter, gravity scale 0.001): a body falling h px reaches
// v = sqrt(2*0.001*h) px/ms; a ramp can never lift the dummy above its
// start height (energy) — higher goals need elastic ramps, fans, dynamite
// or portals. Ramp friction 0.1 (smooth steel) so a 10°+ slope slides.
export interface Vec {
  x: number;
  y: number;
}

export interface GroundRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FanDef {
  x: number;
  y: number;
  w: number;
  h: number;
  /** degrees, screen coords (y down): -90 = straight up, -45 = up-right, 0 = right */
  angle: number;
  /** 1 = lift accel 3x gravity */
  force: number;
}

export interface DynamiteDef {
  x: number;
  y: number;
  /** blast direction, degrees, screen coords: -90 = straight up */
  angle: number;
  /** launch speed in px/step */
  power: number;
}

export interface PortalDef {
  x: number;
  y: number;
  r: number;
  /** velocity set on entry (px/step); gravity flips on entry */
  exitVx: number;
  exitVy: number;
}

export type InkType = 'standard' | 'elastic' | 'boost';

export interface SolutionStroke {
  pts: [number, number][];
  ink: InkType;
}

export interface LevelDef {
  n: number;
  name: string;
  archetype: 'pit' | 'fan' | 'dynamite' | 'portal';
  /** total ink budget in px */
  ink: number;
  /** par ink for 3 stars */
  par: number;
  /** dummy spawn: feet point */
  start: Vec;
  /** flag: sensor centre is (x, y - 20), radius 40 */
  goal: Vec;
  ground: GroundRect[];
  fans: FanDef[];
  dynamite: DynamiteDef[];
  portals: PortalDef[];
  coins: Vec[];
  solution: SolutionStroke[];
}

export const LEVEL_COUNT = 30;

/** Floor platform: top-left (x, y), width w, extends down to y=780. */
const plat = (x: number, y: number, w: number): GroundRect => ({ x, y, w, h: 780 - y });
/** Ceiling shelf: explicit rect (hangs from the top). */
const shelf = (x: number, y: number, w: number, h = 30): GroundRect => ({ x, y, w, h });
/** Wall on a platform: rect from (x, y) with height h. */
const wall = (x: number, y: number, w: number, h: number): GroundRect => ({ x, y, w, h });

const S = (pts: [number, number][], ink: InkType = 'standard'): SolutionStroke => ({ pts, ink });

export const LEVELS: LevelDef[] = [
  // ---- ARC 1: PITS (1-10) — draw a ramp, bridge the gap ----
  {
    n: 1, name: 'First Drop', archetype: 'pit', ink: 300, par: 180,
    start: { x: 88, y: 340 }, goal: { x: 215, y: 400 },
    ground: [plat(0, 340, 100), plat(170, 400, 220)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 150, y: 330 }],
    solution: [S([[92, 344], [200, 394]])],
  },
  {
    n: 2, name: 'Wider Gap', archetype: 'pit', ink: 340, par: 200,
    start: { x: 88, y: 340 }, goal: { x: 235, y: 420 },
    ground: [plat(0, 340, 100), plat(190, 420, 200)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 160, y: 340 }],
    solution: [S([[92, 344], [220, 414]])],
  },
  {
    n: 3, name: 'Long Fall', archetype: 'pit', ink: 380, par: 220,
    start: { x: 88, y: 380 }, goal: { x: 255, y: 460 },
    ground: [plat(0, 380, 100), plat(210, 460, 180)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 160, y: 390 }, { x: 200, y: 410 }],
    solution: [S([[92, 384], [240, 454]])],
  },
  {
    n: 4, name: 'Coin Arc', archetype: 'pit', ink: 440, par: 260,
    start: { x: 88, y: 340 }, goal: { x: 285, y: 440 },
    ground: [plat(0, 340, 100), plat(240, 440, 150)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 150, y: 300 }, { x: 200, y: 290 }, { x: 250, y: 300 }],
    solution: [S([[92, 344], [270, 434]])],
  },
  {
    n: 5, name: 'Double Pit', archetype: 'pit', ink: 520, par: 320,
    start: { x: 88, y: 320 }, goal: { x: 345, y: 400 },
    ground: [plat(0, 320, 100), plat(180, 400, 60), plat(300, 400, 90)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 200, y: 350 }],
    solution: [S([[92, 324], [330, 394]])],
  },
  {
    n: 6, name: 'Over the Wall', archetype: 'pit', ink: 460, par: 280,
    start: { x: 88, y: 340 }, goal: { x: 300, y: 420 },
    ground: [plat(0, 340, 100), plat(220, 420, 170), wall(220, 390, 12, 30)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 160, y: 330 }],
    solution: [S([[92, 344], [250, 358], [268, 410]])],
  },
  {
    n: 7, name: 'Steep Dive', archetype: 'pit', ink: 520, par: 320,
    start: { x: 88, y: 300 }, goal: { x: 305, y: 460 },
    ground: [plat(0, 300, 100), plat(260, 460, 130)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 170, y: 330 }, { x: 220, y: 360 }],
    solution: [S([[92, 304], [290, 454]])],
  },
  {
    n: 8, name: 'Bounce Up', archetype: 'pit', ink: 190, par: 180,
    start: { x: 88, y: 340 }, goal: { x: 280, y: 480 },
    // The elastic wedge is the intended way up: the ink budget (175 px)
    // cannot span the direct ramp (~195 px), so the player must bounce.
    // The first ramp is 45° and long enough for the 90 px dummy to slide.
    ground: [plat(0, 340, 100), plat(230, 480, 160)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 200, y: 450 }],
    solution: [
      S([[92, 344], [150, 402]], 'standard'),
      S([[145, 520], [235, 535]], 'elastic'),
    ],
  },
  {
    n: 9, name: 'Coin Run', archetype: 'pit', ink: 520, par: 320,
    start: { x: 88, y: 360 }, goal: { x: 325, y: 480 },
    ground: [plat(0, 360, 100), plat(280, 480, 110)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 170, y: 380 }, { x: 220, y: 400 }, { x: 260, y: 420 }],
    solution: [S([[92, 364], [310, 474]])],
  },
  {
    n: 10, name: 'Twin Pits Wall', archetype: 'pit', ink: 560, par: 350,
    start: { x: 88, y: 320 }, goal: { x: 350, y: 440 },
    ground: [plat(0, 320, 100), plat(180, 420, 50), plat(290, 440, 100), wall(290, 410, 12, 30)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 200, y: 360 }],
    solution: [S([[92, 324], [270, 358], [320, 432]])],
  },
  // ---- ARC 2: FANS (11-20) — the wind lifts the dummy ----
  {
    n: 11, name: 'Fan Lift', archetype: 'fan', ink: 260, par: 140,
    start: { x: 88, y: 340 }, goal: { x: 300, y: 340 },
    ground: [plat(0, 340, 100), plat(220, 340, 170)],
    fans: [{ x: 110, y: 200, w: 170, h: 340, angle: -90, force: 1 }],
    dynamite: [], portals: [],
    coins: [{ x: 160, y: 380 }],
    solution: [S([[92, 344], [150, 400]])],
  },
  {
    n: 12, name: 'Higher Ground', archetype: 'fan', ink: 300, par: 180,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 300 },
    ground: [plat(0, 340, 100), plat(270, 300, 120)],
    fans: [{ x: 110, y: 200, w: 180, h: 340, angle: -60, force: 1.1 }],
    dynamite: [], portals: [],
    coins: [{ x: 200, y: 360 }],
    solution: [S([[92, 344], [180, 420]])],
  },
  {
    n: 13, name: 'Wall of Wind', archetype: 'fan', ink: 300, par: 180,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 300 },
    ground: [plat(0, 340, 100), plat(250, 300, 140), wall(250, 240, 12, 60)],
    fans: [{ x: 110, y: 200, w: 180, h: 340, angle: -60, force: 1.2 }],
    dynamite: [], portals: [],
    coins: [{ x: 180, y: 360 }],
    solution: [S([[92, 344], [170, 420]])],
  },
  {
    n: 14, name: 'Twin Fans', archetype: 'fan', ink: 280, par: 160,
    start: { x: 88, y: 340 }, goal: { x: 330, y: 340 },
    ground: [plat(0, 340, 100), plat(290, 340, 100)],
    fans: [
      { x: 110, y: 200, w: 90, h: 340, angle: -60, force: 1 },
      { x: 200, y: 200, w: 90, h: 340, angle: -60, force: 1 },
    ],
    dynamite: [], portals: [],
    coins: [{ x: 150, y: 380 }, { x: 250, y: 380 }],
    solution: [S([[92, 344], [160, 410]])],
  },
  {
    n: 15, name: 'Crosswind', archetype: 'fan', ink: 300, par: 170,
    start: { x: 88, y: 340 }, goal: { x: 310, y: 280 },
    ground: [plat(0, 340, 100), plat(250, 280, 140)],
    fans: [{ x: 120, y: 200, w: 110, h: 340, angle: -45, force: 1.1 }],
    dynamite: [], portals: [],
    coins: [{ x: 200, y: 340 }],
    solution: [S([[92, 344], [160, 420]])],
  },
  {
    n: 16, name: 'Fan Coins', archetype: 'fan', ink: 260, par: 140,
    start: { x: 88, y: 340 }, goal: { x: 300, y: 340 },
    ground: [plat(0, 340, 100), plat(220, 340, 170)],
    fans: [{ x: 110, y: 200, w: 170, h: 340, angle: -60, force: 1 }],
    dynamite: [], portals: [],
    coins: [{ x: 150, y: 300 }, { x: 200, y: 280 }, { x: 250, y: 300 }],
    solution: [S([[92, 344], [150, 400]])],
  },
  {
    n: 17, name: 'Tall Wall Wind', archetype: 'fan', ink: 300, par: 180,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 260 },
    ground: [plat(0, 340, 100), plat(250, 260, 140), wall(250, 200, 12, 60)],
    fans: [{ x: 110, y: 200, w: 180, h: 340, angle: -60, force: 1.5 }],
    dynamite: [], portals: [],
    coins: [{ x: 180, y: 340 }],
    solution: [S([[92, 344], [170, 420]])],
  },
  {
    n: 18, name: 'Fan Steps', archetype: 'fan', ink: 300, par: 180,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 280 },
    ground: [plat(0, 340, 100), plat(280, 280, 110)],
    fans: [
      { x: 110, y: 200, w: 90, h: 340, angle: -60, force: 1 },
      { x: 200, y: 200, w: 90, h: 340, angle: -90, force: 1.2 },
    ],
    dynamite: [], portals: [],
    coins: [{ x: 200, y: 320 }],
    solution: [S([[92, 344], [170, 420]])],
  },
  {
    n: 19, name: 'Tiny Landing', archetype: 'fan', ink: 300, par: 180,
    start: { x: 88, y: 340 }, goal: { x: 315, y: 300 },
    ground: [plat(0, 340, 100), plat(290, 300, 60)],
    fans: [{ x: 110, y: 200, w: 170, h: 340, angle: -60, force: 1 }],
    dynamite: [], portals: [],
    coins: [{ x: 200, y: 340 }],
    solution: [S([[92, 344], [170, 420]])],
  },
  {
    n: 20, name: 'Fan Finale', archetype: 'fan', ink: 320, par: 190,
    start: { x: 88, y: 300 }, goal: { x: 335, y: 260 },
    ground: [plat(0, 300, 100), plat(300, 260, 90)],
    fans: [
      { x: 110, y: 200, w: 100, h: 340, angle: -90, force: 1 },
      { x: 210, y: 200, w: 100, h: 340, angle: -45, force: 1.1 },
    ],
    dynamite: [], portals: [],
    coins: [{ x: 150, y: 320 }, { x: 220, y: 300 }, { x: 280, y: 280 }],
    solution: [S([[92, 304], [170, 400]])],
  },
  // ---- ARC 3: DYNAMITE (21-25) — blast the dummy to the flag ----
  {
    n: 21, name: 'First Blast', archetype: 'dynamite', ink: 200, par: 120,
    start: { x: 88, y: 340 }, goal: { x: 280, y: 340 },
    ground: [plat(0, 340, 100), plat(120, 378, 60), plat(180, 340, 210), wall(180, 280, 12, 60)],
    fans: [],
    dynamite: [{ x: 150, y: 356, angle: -70, power: 8 }],
    portals: [],
    coins: [{ x: 200, y: 300 }],
    solution: [S([[92, 344], [148, 360]])],
  },
  {
    n: 22, name: 'Blast Across', archetype: 'dynamite', ink: 200, par: 120,
    start: { x: 88, y: 380 }, goal: { x: 350, y: 380 },
    ground: [plat(0, 380, 100), plat(120, 420, 50), plat(320, 380, 70)],
    fans: [],
    dynamite: [{ x: 145, y: 398, angle: -60, power: 8.5 }],
    portals: [],
    coins: [{ x: 240, y: 340 }],
    solution: [S([[92, 384], [143, 400]])],
  },
  {
    n: 23, name: 'Chain Reaction', archetype: 'dynamite', ink: 200, par: 120,
    start: { x: 88, y: 420 }, goal: { x: 350, y: 340 },
    ground: [plat(0, 420, 100), plat(120, 460, 50), plat(240, 380, 50), plat(320, 340, 70)],
    fans: [],
    dynamite: [
      { x: 145, y: 438, angle: -60, power: 7 },
      { x: 265, y: 358, angle: -60, power: 8 },
    ],
    portals: [],
    coins: [{ x: 200, y: 400 }],
    solution: [S([[92, 424], [143, 440]])],
  },
  {
    n: 24, name: 'Sky High', archetype: 'dynamite', ink: 200, par: 120,
    start: { x: 88, y: 420 }, goal: { x: 150, y: 335 },
    ground: [plat(0, 420, 100), plat(120, 460, 60), shelf(110, 300, 280, 30)],
    fans: [],
    dynamite: [{ x: 150, y: 438, angle: -90, power: 10 }],
    portals: [],
    coins: [{ x: 150, y: 360 }],
    solution: [S([[92, 424], [148, 440]])],
  },
  {
    n: 25, name: 'Coin Blast', archetype: 'dynamite', ink: 200, par: 120,
    start: { x: 88, y: 380 }, goal: { x: 340, y: 380 },
    ground: [plat(0, 380, 100), plat(120, 420, 50), plat(300, 380, 90)],
    fans: [],
    dynamite: [{ x: 145, y: 398, angle: -55, power: 7.5 }],
    portals: [],
    coins: [{ x: 210, y: 330 }, { x: 260, y: 310 }, { x: 300, y: 330 }],
    solution: [S([[92, 384], [143, 400]])],
  },
  // ---- ARC 4: PORTALS (26-30) — flip gravity, fall up ----
  {
    n: 26, name: 'Upside Down', archetype: 'portal', ink: 260, par: 160,
    start: { x: 88, y: 420 }, goal: { x: 180, y: 165 },
    ground: [plat(0, 420, 100), shelf(140, 110, 190, 30)],
    fans: [], dynamite: [],
    portals: [{ x: 180, y: 500, r: 30, exitVx: 0, exitVy: -6 }],
    coins: [{ x: 180, y: 400 }],
    solution: [S([[92, 424], [175, 495]])],
  },
  {
    n: 27, name: 'Drift Up', archetype: 'portal', ink: 260, par: 160,
    start: { x: 88, y: 420 }, goal: { x: 300, y: 165 },
    // Ceiling platform widened left (120..390) so the whole dummy lands
    // under it instead of draping over its left edge; exit drift 2.5
    // carries it to the flag.
    ground: [plat(0, 420, 100), shelf(120, 110, 270, 30)],
    fans: [], dynamite: [],
    portals: [{ x: 150, y: 520, r: 30, exitVx: 2.5, exitVy: -6 }],
    coins: [{ x: 220, y: 300 }],
    solution: [S([[92, 424], [145, 515]])],
  },
  {
    n: 28, name: 'There and Back', archetype: 'portal', ink: 260, par: 160,
    start: { x: 88, y: 420 }, goal: { x: 250, y: 600 },
    ground: [plat(0, 420, 100), shelf(120, 110, 150, 30), plat(150, 600, 240)],
    fans: [], dynamite: [],
    portals: [
      { x: 150, y: 500, r: 30, exitVx: 0, exitVy: -6 },
      { x: 175, y: 160, r: 45, exitVx: 2, exitVy: 2 },
    ],
    coins: [{ x: 150, y: 400 }],
    solution: [S([[92, 424], [145, 495]])],
  },
  {
    n: 29, name: 'Blast Portal', archetype: 'portal', ink: 200, par: 120,
    start: { x: 88, y: 420 }, goal: { x: 230, y: 165 },
    ground: [plat(0, 420, 100), plat(120, 460, 60), shelf(180, 110, 180, 30)],
    fans: [],
    dynamite: [{ x: 150, y: 438, angle: -70, power: 8 }],
    portals: [{ x: 240, y: 340, r: 30, exitVx: 0, exitVy: -6 }],
    coins: [{ x: 200, y: 380 }],
    solution: [S([[92, 424], [148, 440]])],
  },
  {
    n: 30, name: 'Grand Finale', archetype: 'portal', ink: 200, par: 120,
    start: { x: 88, y: 420 }, goal: { x: 350, y: 165 },
    ground: [plat(0, 420, 100), plat(120, 460, 60), shelf(180, 110, 210, 30)],
    fans: [{ x: 230, y: 160, w: 130, h: 60, angle: 0, force: 1 }],
    dynamite: [{ x: 150, y: 438, angle: -60, power: 8 }],
    portals: [{ x: 240, y: 340, r: 30, exitVx: 0, exitVy: -6 }],
    coins: [{ x: 260, y: 180 }, { x: 300, y: 180 }, { x: 340, y: 180 }],
    solution: [S([[92, 424], [148, 440]])],
  },
];

export function getLevel(n: number): LevelDef {
  const idx = ((n - 1) % LEVEL_COUNT + LEVEL_COUNT) % LEVEL_COUNT;
  return LEVELS[idx];
}

/** Daily challenge level: day-of-year mod 30 + 1. */
export function dailyLevel(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0).getTime();
  const day = Math.floor((date.getTime() - start) / 86400000);
  return (day % LEVEL_COUNT) + 1;
}
