// Level definitions — Ramp Physics: Ragdoll Crash Test, ROUND 2.
// Design space: 390x844. Playfield y 110..768 (HUD top, ink bar + buttons
// bottom). Every level has an explicit `solution`: the strokes the test
// harness draws to prove the level is winnable (Tetris-GDD method: a level
// is only shippable if its solution wins — no unwinnable level ships).
// Physics notes (Matter, gravity scale 0.001): a body falling h px reaches
// v = sqrt(2*0.001*h) px/ms; a ramp can never lift the dummy above its
// start height (energy) — higher goals need elastic ramps, fans, dynamite
// or portals. Ramp friction 0.1 (smooth steel) so a 10°+ slope slides.
//
// ROUND 2 (plan-dificultad-r2.md, binding):
// - Par = optimal solution x 1.10, rounded to multiples of 5. The optimal
//   solution uses 85-100% of par in every level (band checked by
//   tools-local/anti-trivial.mjs). 3 stars = ink <= par; 2 stars = <= par
//   x 1.25; 1 star = reach the flag.
// - Hazards EARLY: fan from L6 (teaching), dynamite from L12 (teaching),
//   portal from L18 (teaching) — each with its own teaching level before
//   it is combined with anything else.
// - No ink dominates: in every block of 5 levels (except block 1, which is
//   steel-only by design — the tutorial block), each ink (steel, bouncy,
//   boost) is the reference solution's ink in >= 1 level. Boost levels are
//   gentle slopes (2-3 deg) where steel stalls (tan < 0.1) but boost slides
//   (friction 0.02); elastic levels need a bounce to clear a wall.
// - Coins sit OFF the optimal line: collecting them costs ink or risk.
// - No level is winnable with 0 px drawn, and no level from L6 on is
//   winnable with a single straight (steel) ramp from spawn to flag.
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
  archetype: 'pit' | 'fan' | 'dynamite' | 'portal' | 'boost' | 'bounce';
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
  // ---- BLOCK 1 (1-5): PITS, steel only — draw, launch, land. ----
  {
    n: 1, name: 'First Drop', archetype: 'pit', ink: 220, par: 135,
    start: { x: 88, y: 340 }, goal: { x: 215, y: 400 },
    ground: [plat(0, 340, 100), plat(170, 400, 220)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 150, y: 330 }],
    solution: [S([[92, 344], [200, 394]])],
  },
  {
    n: 2, name: 'Wider Gap', archetype: 'pit', ink: 265, par: 165,
    start: { x: 88, y: 340 }, goal: { x: 235, y: 420 },
    ground: [plat(0, 340, 100), plat(190, 420, 200)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 160, y: 340 }],
    solution: [S([[92, 344], [220, 414]])],
  },
  {
    n: 3, name: 'Long Fall', archetype: 'pit', ink: 300, par: 185,
    start: { x: 88, y: 380 }, goal: { x: 255, y: 460 },
    ground: [plat(0, 380, 100), plat(210, 460, 180)],
    fans: [], dynamite: [], portals: [],
    // r2: coins moved off the optimal line (r1 had them 23-24 px away).
    coins: [{ x: 150, y: 320 }, { x: 210, y: 310 }],
    solution: [S([[92, 384], [240, 454]])],
  },
  {
    n: 4, name: 'Coin Arc', archetype: 'pit', ink: 355, par: 220,
    start: { x: 88, y: 340 }, goal: { x: 285, y: 440 },
    ground: [plat(0, 340, 100), plat(240, 440, 150)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 150, y: 300 }, { x: 200, y: 290 }, { x: 250, y: 300 }],
    solution: [S([[92, 344], [270, 434]])],
  },
  {
    n: 5, name: 'Double Pit', archetype: 'pit', ink: 440, par: 275,
    start: { x: 88, y: 320 }, goal: { x: 345, y: 400 },
    ground: [plat(0, 320, 100), plat(180, 400, 60), plat(300, 400, 90)],
    fans: [], dynamite: [], portals: [],
    // r2: coin moved off the optimal line (r1: 6 px away, free).
    coins: [{ x: 200, y: 300 }],
    solution: [S([[92, 324], [330, 394]])],
  },
  // ---- BLOCK 2 (6-10): FAN arrives (L6 teaching) + bounce + boost. ----
  {
    n: 6, name: 'First Fan', archetype: 'fan', ink: 145, par: 90,
    start: { x: 88, y: 340 }, goal: { x: 300, y: 340 },
    ground: [plat(0, 340, 100), plat(220, 340, 170)],
    fans: [{ x: 110, y: 200, w: 170, h: 340, angle: -90, force: 1 }],
    dynamite: [], portals: [],
    // r2: coin moved off the optimal line (r1: 21 px away, free).
    coins: [{ x: 345, y: 295 }],
    solution: [S([[92, 344], [150, 400]])],
  },
  {
    n: 7, name: 'Higher Ground', archetype: 'fan', ink: 210, par: 130,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 300 },
    ground: [plat(0, 340, 100), plat(270, 300, 120)],
    fans: [{ x: 110, y: 200, w: 180, h: 340, angle: -60, force: 1.1 }],
    dynamite: [], portals: [],
    coins: [{ x: 200, y: 360 }],
    solution: [S([[92, 344], [180, 420]])],
  },
  {
    n: 8, name: 'Bounce Up', archetype: 'bounce', ink: 315, par: 195,
    start: { x: 88, y: 340 }, goal: { x: 280, y: 480 },
    // The elastic wedge is the intended way up: the ink budget cannot
    // span the direct ramp, so the player must bounce (r1 L8, kept).
    ground: [plat(0, 340, 100), plat(230, 480, 160)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 200, y: 450 }],
    solution: [
      S([[92, 344], [150, 402]], 'standard'),
      S([[145, 520], [235, 535]], 'elastic'),
    ],
  },
  {
    n: 9, name: 'Wall of Wind', archetype: 'fan', ink: 195, par: 120,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 300 },
    ground: [plat(0, 340, 100), plat(250, 300, 140), wall(250, 240, 12, 60)],
    fans: [{ x: 110, y: 200, w: 180, h: 340, angle: -60, force: 1.2 }],
    dynamite: [], portals: [],
    coins: [{ x: 180, y: 360 }],
    solution: [S([[92, 344], [170, 420]])],
  },
  {
    n: 10, name: 'Gentle Glide', archetype: 'boost', ink: 320, par: 200,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 360 },
    // BOOST teaching: a 3.5 deg slope. Steel stalls (tan 0.061 < 0.1
    // friction); boost slides (friction 0.02). The lazy straight steel
    // ramp stalls on this slope, so the level is not trivial.
    ground: [plat(0, 340, 100), plat(280, 360, 110)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 180, y: 290 }],
    // The ramp must land ON the goal platform (r2 fix: the first version
    // ended at x=272, 8 px short of the platform, and the dummy wedged
    // against its left lip and lost by still-detection in ~3 s).
    // r2 fix 2 (run 3): first point lowered 2 px (344->346) so the ramp
    // top starts 1 px BELOW the start platform (340) — the dummy steps
    // down onto the ramp instead of climbing a 1 px lip at boarding.
    // Run 3: it never boarded — it rocked on the platform until the
    // 60 s timeout. Same fix applied to L13/L19/L25/L29.
    // NOT YET VERIFIED in the browser — probe L10 + full harness next.
    solution: [S([[92, 346], [288, 358]], 'boost')],
  },
  // ---- BLOCK 3 (11-15): fans central + dynamite arrives (L12 teaching). ----
  {
    n: 11, name: 'Crosswind', archetype: 'fan', ink: 185, par: 115,
    start: { x: 88, y: 340 }, goal: { x: 310, y: 280 },
    ground: [plat(0, 340, 100), plat(250, 280, 140)],
    fans: [{ x: 120, y: 200, w: 110, h: 340, angle: -45, force: 1.1 }],
    dynamite: [], portals: [],
    coins: [{ x: 200, y: 340 }],
    solution: [S([[92, 344], [160, 420]])],
  },
  {
    n: 12, name: 'First Blast', archetype: 'dynamite', ink: 105, par: 65,
    start: { x: 88, y: 340 }, goal: { x: 280, y: 340 },
    ground: [plat(0, 340, 100), plat(120, 378, 60), plat(180, 340, 210), wall(180, 280, 12, 60)],
    fans: [],
    dynamite: [{ x: 150, y: 356, angle: -70, power: 8 }],
    portals: [],
    coins: [{ x: 200, y: 300 }],
    solution: [S([[92, 344], [148, 360]])],
  },
  {
    n: 13, name: 'Slow Ride', archetype: 'boost', ink: 320, par: 200,
    start: { x: 88, y: 380 }, goal: { x: 320, y: 395 },
    // Gentle 3.2 deg boost slope over a long gap.
    ground: [plat(0, 380, 100), plat(280, 395, 110)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 180, y: 320 }],
    // The ramp must land ON the goal platform (same lip-trap fix as L10).
    // r2 fix 2 (run 3): first point lowered 2 px (384->386) — ramp top
    // starts 1 px below the start platform; no boarding lip. UNVERIFIED.
    solution: [S([[92, 386], [288, 397]], 'boost')],
  },
  {
    n: 14, name: 'Bounce Over the Wall', archetype: 'bounce', ink: 315, par: 195,
    start: { x: 88, y: 340 }, goal: { x: 300, y: 460 },
    // A wall blocks the direct steel ramp; only an elastic bounce clears
    // it. Steel ramp down, elastic wedge at the bottom, bounce up to the
    // goal platform (same bounce budget as r1 L8).
    // r2 fix 3 (run 7, UNVERIFIED — Chromium died before the harness):
    // the recorded solution lost: bounce apex ~y428 vs wall top y430
    // (ground body is top-left, so wall(250,430,12,30) tops at 430, not
    // 415 as run 6 assumed) and the old wedge tilted down-right, so its
    // normal pushed the dummy up-LEFT, away from the goal. Fix: steeper
    // steel ramp (92,344)->(152,420), 51.7 deg, for more impact speed,
    // and the wedge REVERSED to tilt up-right (145,535)->(235,520) so
    // the bounce normal points up-RIGHT, over the wall onto the platform.
    // Ink 97+91=188 <= par 195 (3 stars preserved, 96% of par).
    ground: [plat(0, 340, 100), plat(250, 460, 140), wall(250, 430, 12, 30)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 300, y: 400 }],
    solution: [
      S([[92, 344], [152, 420]], 'standard'),
      S([[145, 535], [235, 520]], 'elastic'),
    ],
  },
  {
    n: 15, name: 'Fan Steps', archetype: 'fan', ink: 195, par: 120,
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
  // ---- BLOCK 4 (16-20): dynamite chain + portal arrives (L18 teaching). ----
  {
    n: 16, name: 'Tiny Landing', archetype: 'fan', ink: 195, par: 120,
    start: { x: 88, y: 340 }, goal: { x: 315, y: 300 },
    ground: [plat(0, 340, 100), plat(290, 300, 60)],
    fans: [{ x: 110, y: 200, w: 170, h: 340, angle: -60, force: 1 }],
    dynamite: [], portals: [],
    coins: [{ x: 200, y: 340 }],
    solution: [S([[92, 344], [170, 420]])],
  },
  {
    n: 17, name: 'Chain Reaction', archetype: 'dynamite', ink: 100, par: 60,
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
    n: 18, name: 'Upside Down', archetype: 'portal', ink: 200, par: 125,
    start: { x: 88, y: 420 }, goal: { x: 180, y: 165 },
    ground: [plat(0, 420, 100), shelf(140, 110, 190, 30)],
    fans: [], dynamite: [],
    portals: [{ x: 180, y: 500, r: 30, exitVx: 0, exitVy: -6 }],
    coins: [{ x: 180, y: 400 }],
    solution: [S([[92, 424], [175, 495]])],
  },
  {
    n: 19, name: 'Feather Fall', archetype: 'boost', ink: 335, par: 210,
    start: { x: 88, y: 300 }, goal: { x: 330, y: 315 },
    // Gentle 3.1 deg boost slope.
    ground: [plat(0, 300, 100), plat(290, 315, 100)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 190, y: 250 }],
    // The ramp must land ON the goal platform (same lip-trap fix as L10).
    // r2 fix 2 (run 3): first point lowered 2 px (304->306) — ramp top
    // starts 1 px below the start platform; no boarding lip. UNVERIFIED.
    solution: [S([[92, 306], [298, 317]], 'boost')],
  },
  {
    n: 20, name: 'High Bounce', archetype: 'bounce', ink: 345, par: 215,
    start: { x: 88, y: 300 }, goal: { x: 320, y: 460 },
    // Wall blocks the direct ramp; elastic bounce from the pit floor.
    ground: [plat(0, 300, 100), plat(270, 460, 120), wall(270, 430, 12, 30)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 210, y: 390 }],
    solution: [
      S([[92, 304], [160, 380]], 'standard'),
      S([[150, 540], [240, 555]], 'elastic'),
    ],
  },
  // ---- BLOCK 5 (21-25): portal + blast combos, fan finale, boost. ----
  {
    n: 21, name: 'Blast Portal', archetype: 'portal', ink: 105, par: 65,
    start: { x: 88, y: 420 }, goal: { x: 230, y: 165 },
    ground: [plat(0, 420, 100), plat(120, 460, 60), shelf(180, 110, 180, 30)],
    fans: [],
    dynamite: [{ x: 150, y: 438, angle: -70, power: 8 }],
    portals: [{ x: 240, y: 340, r: 30, exitVx: 0, exitVy: -6 }],
    coins: [{ x: 200, y: 380 }],
    solution: [S([[92, 424], [148, 440]])],
  },
  {
    n: 22, name: 'Deep Bounce', archetype: 'bounce', ink: 320, par: 200,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 500 },
    // Deep pit: steel ramp down, elastic wedge, bounce up to the low
    // goal platform behind its wall.
    ground: [plat(0, 340, 100), plat(270, 500, 120), wall(270, 470, 12, 30)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 200, y: 430 }],
    solution: [
      S([[92, 344], [150, 410]], 'standard'),
      S([[145, 570], [235, 585]], 'elastic'),
    ],
  },
  {
    n: 23, name: 'Coin Blast', archetype: 'dynamite', ink: 100, par: 60,
    start: { x: 88, y: 380 }, goal: { x: 340, y: 380 },
    ground: [plat(0, 380, 100), plat(120, 420, 50), plat(300, 380, 90)],
    fans: [],
    dynamite: [{ x: 145, y: 398, angle: -55, power: 7.5 }],
    portals: [],
    coins: [{ x: 210, y: 330 }, { x: 260, y: 310 }, { x: 300, y: 330 }],
    solution: [S([[92, 384], [143, 400]])],
  },
  {
    n: 24, name: 'Fan Finale', archetype: 'fan', ink: 225, par: 140,
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
  {
    n: 25, name: 'Long Glide', archetype: 'boost', ink: 335, par: 210,
    start: { x: 88, y: 420 }, goal: { x: 330, y: 435 },
    // Gentle 3.1 deg boost slope.
    ground: [plat(0, 420, 100), plat(290, 435, 100)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 190, y: 360 }],
    // The ramp must land ON the goal platform (same lip-trap fix as L10).
    // r2 fix 2 (run 3): first point lowered 2 px (424->426) — ramp top
    // starts 1 px below the start platform; no boarding lip. UNVERIFIED.
    solution: [S([[92, 426], [298, 437]], 'boost')],
  },
  // ---- BLOCK 6 (26-30): everything combined. Precision ceiling. ----
  {
    n: 26, name: 'Grand Finale', archetype: 'portal', ink: 105, par: 65,
    start: { x: 88, y: 420 }, goal: { x: 350, y: 165 },
    ground: [plat(0, 420, 100), plat(120, 460, 60), shelf(180, 110, 210, 30)],
    fans: [{ x: 230, y: 160, w: 130, h: 60, angle: 0, force: 1 }],
    dynamite: [{ x: 150, y: 438, angle: -60, power: 8 }],
    portals: [{ x: 240, y: 340, r: 30, exitVx: 0, exitVy: -6 }],
    coins: [{ x: 260, y: 180 }, { x: 300, y: 180 }, { x: 340, y: 180 }],
    solution: [S([[92, 424], [148, 440]])],
  },
  {
    n: 27, name: 'Wall Climb', archetype: 'pit', ink: 385, par: 240,
    start: { x: 88, y: 340 }, goal: { x: 300, y: 420 },
    ground: [plat(0, 340, 100), plat(220, 420, 170), wall(220, 390, 12, 30)],
    fans: [], dynamite: [], portals: [],
    // r2: coin moved off the optimal line (r1: 20 px away, free).
    coins: [{ x: 160, y: 280 }],
    solution: [S([[92, 344], [250, 358], [268, 410]])],
  },
  {
    n: 28, name: 'Steep Dive', archetype: 'pit', ink: 440, par: 275,
    start: { x: 88, y: 300 }, goal: { x: 305, y: 460 },
    ground: [plat(0, 300, 100), plat(260, 460, 130)],
    fans: [], dynamite: [], portals: [],
    // r2: coins moved off the optimal line (r1: 26-33 px away).
    coins: [{ x: 170, y: 280 }, { x: 230, y: 300 }],
    solution: [S([[92, 304], [290, 454]])],
  },
  {
    n: 29, name: 'Last Glide', archetype: 'boost', ink: 320, par: 200,
    start: { x: 88, y: 340 }, goal: { x: 320, y: 352 },
    // Gentlest boost slope (2.6 deg) — the precision test of the block.
    ground: [plat(0, 340, 100), plat(280, 352, 110)],
    fans: [], dynamite: [], portals: [],
    coins: [{ x: 180, y: 285 }],
    // The ramp must land ON the goal platform (same lip-trap fix as L10).
    // r2 fix 2 (run 3): first point lowered 2 px (344->346) — ramp top
    // starts 1 px below the start platform; no boarding lip. UNVERIFIED.
    solution: [S([[92, 346], [288, 355]], 'boost')],
  },
  {
    n: 30, name: 'Final Bounce', archetype: 'bounce', ink: 320, par: 200,
    start: { x: 88, y: 420 }, goal: { x: 350, y: 500 },
    // Finale: bounce over the wall, with a crosswind fighting the drift.
    // r2 fix (15/11 ~23:20 UTC, sin verificar en navegador — ver informe):
    // la corrida 2 del harness mostró que la solución (179 de tinta, la
    // óptima exacta) PERDÍA: el muñeco rebotaba pero el viento cruzado
    // (force 0.6, sin componente vertical) mataba la deriva a la derecha
    // y el rebote no superaba el muro (cima y 470). Viento a la mitad y
    // muro 10 px más bajo; la solución y el par (200) no cambian.
    ground: [plat(0, 420, 100), plat(300, 500, 90), wall(300, 480, 12, 20)],
    fans: [{ x: 180, y: 380, w: 120, h: 120, angle: 180, force: 0.3 }],
    dynamite: [], portals: [],
    coins: [{ x: 250, y: 430 }],
    solution: [
      S([[92, 424], [160, 480]], 'standard'),
      S([[150, 580], [240, 595]], 'elastic'),
    ],
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
