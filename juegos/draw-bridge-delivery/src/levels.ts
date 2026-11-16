// levels.ts — 30 levels for Draw Bridge Delivery.
//
// Design (level-design + difficulty-and-balancing skills):
//   - Teach first, test later: each mechanic appears first where failure is
//     cheap (L6 wind, L8 trampoline, L10 turbo, L12 moving platform, L18
//     dual delivery, L23 bouncy ink), then under pressure in later levels.
//   - Pacing is a sawtooth: a hard level is always followed by a breather.
//   - par = round5(optimal solution length x 1.10); 3 stars = ink used <=
//     par, 2 stars <= par x 1.25. ink = round5(par x inkFactor); the factor
//     tightens from 2.0 (teaching) to 1.15 (L28 precision).
//   - Uphill slope bound: WOOD <= 25 deg, TURBO <= 40 deg (vehicle.ts);
//     the Node validator enforces these on every solution segment.
//   - The solution is the OPTIMAL polyline (bridge centreline). Its
//     endpoints sit on the platform tops; the GameScene builds bridge bodies
//     10 px thick around the player's drawn line, so the bridge top rides
//     5 px below the drawn line — the scooter rolls DOWN onto the bridge
//     at the start (no lip, cf. the Ramp r2 L10 fix) and meets a 5 px step
//     at the goal (chamfered body mounts it; harness measures this).
//   - Anti-trivial: from L6 on, the straight line start->goal must NOT win
//     (wall in the way, slope over the bound, or longer than the ink
//     budget). The validator checks this per level.
//
// Coordinates: 390x844 design space. River surface ~y 700. Platforms are
// full-height cliff rects (top y .. 844) so the scooter can only fall in
// the gap between them. Goal sensor = the 50 px band above the goal plat.
export interface Pt {
  x: number;
  y: number;
}
export type InkType = 'wood' | 'turbo' | 'bouncy';
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface WindZone extends Rect {
  /** Matter force per step, + pushes right, - pushes left. */
  force: number;
}
export interface TrampolineDef {
  x: number;
  y: number;
  w: number;
}
export interface MovingDef {
  /** centre x of the platform at rest. */
  cx: number;
  y: number;
  w: number;
  /** px it slides each way. */
  range: number;
  /** ms for a full back-and-forth. */
  periodMs: number;
}
export interface LevelDef {
  n: number;
  name: string;
  nameEs: string;
  inkType: InkType;
  /** ink = round5(par * inkFactor). */
  inkFactor: number;
  startPlat: Rect;
  goalPlat: Rect;
  /** Second start tier (dual levels): the lower ledge. */
  start2Plat?: Rect;
  goal2Plat?: Rect;
  walls: Rect[];
  coins: Pt[];
  /** One polyline per drawn bridge (moving levels have two). */
  solution: Pt[][];
  /** The solution ends on a trampoline, not on the goal (bounce levels). */
  solutionEndsAt?: 'goal' | 'trampoline';
  wind: WindZone[];
  trampolines: TrampolineDef[];
  moving: MovingDef[];
  /** i18n key for the level hint. */
  hint: string;
}

export const LEVEL_COUNT = 30;

function plat(x: number, topY: number, w = 90): Rect {
  return { x, y: topY, w, h: 844 - topY };
}

const WIND_TAIL: WindZone = { x: 90, y: 470, w: 160, h: 190, force: 0.0006 };
const WIND_HEAD: WindZone = { x: 90, y: 470, w: 160, h: 190, force: -0.0005 };

export const LEVELS: LevelDef[] = [
  {
    n: 1, name: 'First Bridge', nameEs: 'Primer puente', inkType: 'wood', inkFactor: 2.0,
    startPlat: plat(0, 600), goalPlat: plat(160, 600),
    walls: [], coins: [{ x: 125, y: 560 }],
    solution: [[{ x: 88, y: 600 }, { x: 162, y: 600 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 2, name: 'Downhill', nameEs: 'Cuesta abajo', inkType: 'wood', inkFactor: 2.0,
    startPlat: plat(0, 580), goalPlat: plat(180, 620),
    walls: [], coins: [{ x: 135, y: 565 }],
    solution: [[{ x: 88, y: 580 }, { x: 182, y: 620 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 3, name: 'Uphill Climb', nameEs: 'Cuesta arriba', inkType: 'wood', inkFactor: 2.0,
    startPlat: plat(0, 620), goalPlat: plat(180, 590),
    walls: [], coins: [{ x: 135, y: 575 }],
    solution: [[{ x: 88, y: 620 }, { x: 182, y: 590 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 4, name: 'Wide Gap', nameEs: 'Hueco ancho', inkType: 'wood', inkFactor: 1.8,
    startPlat: plat(0, 600), goalPlat: plat(210, 600),
    walls: [], coins: [{ x: 130, y: 560 }, { x: 170, y: 560 }],
    solution: [[{ x: 88, y: 600 }, { x: 212, y: 600 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 5, name: 'The Dip', nameEs: 'El hoyo', inkType: 'wood', inkFactor: 1.8,
    startPlat: plat(0, 600), goalPlat: plat(210, 600),
    walls: [{ x: 140, y: 556, w: 20, h: 44 }], // hangs over the straight line — dip under it
    coins: [{ x: 150, y: 612 }],
    solution: [[{ x: 88, y: 600 }, { x: 150, y: 628 }, { x: 212, y: 600 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 6, name: 'Tailwind', nameEs: 'Viento a favor', inkType: 'wood', inkFactor: 1.8,
    startPlat: plat(0, 600), goalPlat: plat(240, 600),
    walls: [], coins: [{ x: 165, y: 560 }],
    solution: [[{ x: 88, y: 600 }, { x: 242, y: 600 }]],
    wind: [{ ...WIND_TAIL, w: 150 }], trampolines: [], moving: [], hint: 'hintWind',
  },
  {
    n: 7, name: 'Headwind', nameEs: 'Viento en contra', inkType: 'wood', inkFactor: 1.8,
    startPlat: plat(0, 600), goalPlat: plat(210, 600),
    walls: [], coins: [{ x: 150, y: 560 }],
    solution: [[{ x: 88, y: 600 }, { x: 212, y: 600 }]],
    wind: [{ ...WIND_HEAD, w: 120 }], trampolines: [], moving: [], hint: 'hintWind',
  },
  {
    n: 8, name: 'Bounce Over', nameEs: 'Salta el muro', inkType: 'wood', inkFactor: 1.8,
    startPlat: plat(0, 600), goalPlat: plat(280, 600),
    walls: [
      { x: 120, y: 640, w: 60, h: 60 }, // trampoline ledge
      { x: 170, y: 520, w: 24, h: 120 }, // wall to bounce over
    ],
    coins: [{ x: 200, y: 520 }, { x: 250, y: 540 }],
    solution: [[{ x: 88, y: 600 }, { x: 140, y: 628 }]],
    solutionEndsAt: 'trampoline',
    wind: [], trampolines: [{ x: 120, y: 632, w: 60 }], moving: [], hint: 'hintTramp',
  },
  {
    n: 9, name: 'Bounce Across', nameEs: 'Salto largo', inkType: 'wood', inkFactor: 1.8,
    startPlat: plat(0, 600), goalPlat: plat(300, 600),
    walls: [
      { x: 120, y: 640, w: 60, h: 60 },
      { x: 210, y: 540, w: 24, h: 100 },
    ],
    coins: [{ x: 230, y: 530 }],
    solution: [[{ x: 88, y: 600 }, { x: 150, y: 628 }]],
    solutionEndsAt: 'trampoline',
    wind: [], trampolines: [{ x: 120, y: 632, w: 60 }], moving: [], hint: 'hintTramp',
  },
  {
    n: 10, name: 'Turbo Climb', nameEs: 'Subida turbo', inkType: 'turbo', inkFactor: 1.8,
    startPlat: plat(0, 640), goalPlat: plat(200, 560),
    walls: [], coins: [{ x: 145, y: 575 }],
    solution: [[{ x: 88, y: 640 }, { x: 202, y: 560 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintTurbo',
  },
  {
    n: 11, name: 'Turbo Rush', nameEs: 'Turbo con viento', inkType: 'turbo', inkFactor: 1.7,
    startPlat: plat(0, 640), goalPlat: plat(220, 570),
    walls: [], coins: [{ x: 155, y: 580 }],
    solution: [[{ x: 88, y: 640 }, { x: 222, y: 570 }]],
    wind: [{ ...WIND_TAIL, w: 130 }], trampolines: [], moving: [], hint: 'hintTurbo',
  },
  {
    n: 12, name: 'Moving Bridge', nameEs: 'Puente móvil', inkType: 'wood', inkFactor: 1.8,
    startPlat: plat(0, 600), goalPlat: plat(280, 600),
    walls: [], coins: [{ x: 185, y: 575 }],
    solution: [
      [{ x: 88, y: 600 }, { x: 150, y: 600 }],
      [{ x: 220, y: 600 }, { x: 282, y: 600 }],
    ],
    wind: [], trampolines: [], moving: [{ cx: 185, y: 600, w: 70, range: 40, periodMs: 3600 }], hint: 'hintMoving',
  },
  {
    n: 13, name: 'Moving Wide', nameEs: 'Móvil ancho', inkType: 'wood', inkFactor: 1.7,
    startPlat: plat(0, 600), goalPlat: plat(300, 600),
    walls: [], coins: [{ x: 195, y: 575 }],
    solution: [
      [{ x: 88, y: 600 }, { x: 160, y: 600 }],
      [{ x: 230, y: 600 }, { x: 302, y: 600 }],
    ],
    wind: [], trampolines: [], moving: [{ cx: 195, y: 600, w: 70, range: 45, periodMs: 3200 }], hint: 'hintMoving',
  },
  {
    n: 14, name: 'The Hill', nameEs: 'La colina', inkType: 'wood', inkFactor: 1.7,
    startPlat: plat(0, 610), goalPlat: plat(230, 595),
    walls: [
      { x: 140, y: 640, w: 40, h: 60 }, // rock pillar rising from the river
      { x: 150, y: 600, w: 20, h: 40 }, // wall on top of the pillar
    ],
    coins: [{ x: 170, y: 545 }],
    solution: [[{ x: 88, y: 610 }, { x: 170, y: 578 }, { x: 232, y: 595 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 15, name: 'High Road', nameEs: 'Por encima', inkType: 'wood', inkFactor: 1.7,
    startPlat: plat(0, 560), goalPlat: plat(260, 560),
    walls: [{ x: 170, y: 540, w: 20, h: 80 }],
    coins: [{ x: 170, y: 500 }],
    solution: [[{ x: 88, y: 560 }, { x: 170, y: 530 }, { x: 262, y: 560 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 16, name: 'Low Road', nameEs: 'Por debajo', inkType: 'wood', inkFactor: 1.7,
    startPlat: plat(0, 640), goalPlat: plat(250, 640),
    walls: [{ x: 170, y: 480, w: 16, h: 165 }],
    coins: [{ x: 150, y: 640 }],
    solution: [[{ x: 88, y: 640 }, { x: 178, y: 670 }, { x: 252, y: 640 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 17, name: 'Double Dip', nameEs: 'Doble hoyo', inkType: 'wood', inkFactor: 1.6,
    startPlat: plat(0, 600), goalPlat: plat(270, 600),
    walls: [
      { x: 130, y: 552, w: 20, h: 44 },
      { x: 220, y: 552, w: 20, h: 44 },
    ],
    coins: [{ x: 140, y: 600 }, { x: 210, y: 600 }],
    solution: [[{ x: 88, y: 600 }, { x: 180, y: 642 }, { x: 272, y: 600 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 18, name: 'Two Pizzas', nameEs: 'Dos pizzas', inkType: 'wood', inkFactor: 2.0,
    startPlat: plat(0, 560), goalPlat: plat(240, 560),
    start2Plat: plat(0, 660), goal2Plat: plat(240, 660),
    walls: [], coins: [{ x: 165, y: 520 }, { x: 165, y: 620 }],
    solution: [
      [{ x: 88, y: 560 }, { x: 242, y: 560 }],
      [{ x: 88, y: 660 }, { x: 242, y: 660 }],
    ],
    wind: [], trampolines: [], moving: [], hint: 'hintDual',
  },
  {
    n: 19, name: 'Two Pizzas in the Wind', nameEs: 'Dos pizzas con viento', inkType: 'wood', inkFactor: 1.9,
    startPlat: plat(0, 560), goalPlat: plat(260, 560),
    start2Plat: plat(0, 660), goal2Plat: plat(260, 660),
    walls: [], coins: [{ x: 175, y: 520 }, { x: 175, y: 620 }],
    solution: [
      [{ x: 88, y: 560 }, { x: 262, y: 560 }],
      [{ x: 88, y: 660 }, { x: 262, y: 660 }],
    ],
    wind: [{ ...WIND_TAIL, w: 170, y: 450, h: 260 }], trampolines: [], moving: [], hint: 'hintDual',
  },
  {
    n: 20, name: 'Bounce Duo', nameEs: 'Dúo con salto', inkType: 'wood', inkFactor: 1.8,
    startPlat: plat(0, 560), goalPlat: plat(260, 560),
    start2Plat: plat(0, 660), goal2Plat: plat(260, 660),
    walls: [
      { x: 120, y: 650, w: 60, h: 50 }, // lower trampoline ledge
      { x: 170, y: 600, w: 24, h: 80 }, // lower wall to bounce over
    ],
    coins: [{ x: 175, y: 520 }, { x: 220, y: 570 }],
    solution: [
      [{ x: 88, y: 560 }, { x: 262, y: 560 }],
      [{ x: 88, y: 660 }, { x: 140, y: 652 }],
    ],
    solutionEndsAt: 'trampoline',
    wind: [], trampolines: [{ x: 120, y: 642, w: 60 }], moving: [], hint: 'hintDual',
  },
  {
    n: 21, name: 'Windy Bridge', nameEs: 'Puente con viento', inkType: 'wood', inkFactor: 1.6,
    startPlat: plat(0, 600), goalPlat: plat(300, 600),
    walls: [], coins: [{ x: 195, y: 575 }],
    solution: [
      [{ x: 88, y: 600 }, { x: 160, y: 600 }],
      [{ x: 230, y: 600 }, { x: 302, y: 600 }],
    ],
    wind: [{ ...WIND_TAIL, w: 210 }], trampolines: [], moving: [{ cx: 195, y: 600, w: 70, range: 45, periodMs: 3000 }], hint: 'hintMoving',
  },
  {
    n: 22, name: 'Turbo Ridge', nameEs: 'Cresta turbo', inkType: 'turbo', inkFactor: 1.6,
    startPlat: plat(0, 650), goalPlat: plat(240, 560),
    walls: [], coins: [{ x: 165, y: 575 }],
    solution: [[{ x: 88, y: 650 }, { x: 242, y: 560 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintTurbo',
  },
  {
    n: 23, name: 'Bouncy Road', nameEs: 'Camino saltarín', inkType: 'bouncy', inkFactor: 1.7,
    startPlat: plat(0, 600), goalPlat: plat(230, 600),
    walls: [{ x: 160, y: 576, w: 20, h: 24 }],
    coins: [{ x: 170, y: 550 }],
    solution: [[{ x: 88, y: 600 }, { x: 232, y: 600 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintBouncy',
  },
  {
    n: 24, name: 'The Long Haul', nameEs: 'El gran trayecto', inkType: 'wood', inkFactor: 1.5,
    startPlat: plat(0, 600), goalPlat: plat(300, 600),
    walls: [], coins: [{ x: 150, y: 560 }, { x: 220, y: 560 }],
    solution: [[{ x: 88, y: 600 }, { x: 302, y: 600 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintDraw',
  },
  {
    n: 25, name: 'Turbo Bounce', nameEs: 'Turbo con salto', inkType: 'turbo', inkFactor: 1.6,
    startPlat: plat(0, 620), goalPlat: plat(300, 620),
    walls: [
      { x: 120, y: 650, w: 60, h: 50 },
      { x: 210, y: 540, w: 24, h: 100 },
    ],
    coins: [{ x: 230, y: 530 }],
    solution: [[{ x: 88, y: 620 }, { x: 150, y: 648 }]],
    solutionEndsAt: 'trampoline',
    wind: [], trampolines: [{ x: 120, y: 642, w: 60 }], moving: [], hint: 'hintTurbo',
  },
  {
    n: 26, name: 'Duo on the Move', nameEs: 'Dúo en movimiento', inkType: 'wood', inkFactor: 1.7,
    startPlat: plat(0, 560), goalPlat: plat(260, 560),
    start2Plat: plat(0, 660), goal2Plat: plat(260, 660),
    walls: [], coins: [{ x: 165, y: 575 }, { x: 175, y: 620 }],
    solution: [
      [{ x: 88, y: 560 }, { x: 130, y: 560 }],
      [{ x: 200, y: 560 }, { x: 262, y: 560 }],
      [{ x: 88, y: 660 }, { x: 262, y: 660 }],
    ],
    wind: [], trampolines: [], moving: [{ cx: 165, y: 560, w: 70, range: 35, periodMs: 3200 }], hint: 'hintDual',
  },
  {
    n: 27, name: 'Moving Uphill', nameEs: 'Móvil cuesta arriba', inkType: 'wood', inkFactor: 1.6,
    startPlat: plat(0, 630), goalPlat: plat(290, 570),
    walls: [], coins: [{ x: 190, y: 575 }],
    solution: [
      [{ x: 88, y: 630 }, { x: 155, y: 600 }],
      [{ x: 225, y: 600 }, { x: 292, y: 570 }],
    ],
    wind: [], trampolines: [], moving: [{ cx: 190, y: 600, w: 70, range: 40, periodMs: 3000 }], hint: 'hintMoving',
  },
  {
    n: 28, name: 'Ink Saver', nameEs: 'Ahorra tinta', inkType: 'wood', inkFactor: 1.15,
    startPlat: plat(0, 600), goalPlat: plat(240, 600),
    walls: [], coins: [{ x: 165, y: 565 }],
    solution: [[{ x: 88, y: 600 }, { x: 242, y: 600 }]],
    wind: [], trampolines: [], moving: [], hint: 'hintInk',
  },
  {
    n: 29, name: 'The Gauntlet', nameEs: 'La prueba', inkType: 'wood', inkFactor: 1.5,
    startPlat: plat(0, 600), goalPlat: plat(300, 600),
    walls: [], coins: [{ x: 185, y: 570 }],
    solution: [
      [{ x: 88, y: 600 }, { x: 150, y: 600 }],
      [{ x: 220, y: 600 }, { x: 302, y: 600 }],
    ],
    wind: [{ ...WIND_HEAD, w: 210 }], trampolines: [], moving: [{ cx: 185, y: 600, w: 70, range: 40, periodMs: 2800 }], hint: 'hintMoving',
  },
  {
    n: 30, name: 'Grand Delivery', nameEs: 'Gran entrega', inkType: 'wood', inkFactor: 1.6,
    startPlat: plat(0, 560), goalPlat: plat(280, 560),
    start2Plat: plat(0, 660), goal2Plat: plat(280, 660),
    walls: [], coins: [{ x: 170, y: 575 }, { x: 170, y: 620 }, { x: 230, y: 600 }],
    solution: [
      [{ x: 88, y: 560 }, { x: 135, y: 560 }],
      [{ x: 205, y: 560 }, { x: 282, y: 560 }],
      [{ x: 88, y: 660 }, { x: 282, y: 660 }],
    ],
    wind: [{ ...WIND_TAIL, w: 190, y: 450, h: 260 }], trampolines: [], moving: [{ cx: 170, y: 560, w: 70, range: 40, periodMs: 3000 }], hint: 'hintDual',
  },
];

export function getLevel(n: number): LevelDef {
  const l = LEVELS[n - 1];
  if (!l || l.n !== n) throw new Error(`no level ${n}`);
  return l;
}

/** Daily-challenge level: rotates 1..30 by day. */
export function dailyLevel(date = new Date()): number {
  const day = Math.floor(date.getTime() / 86400000);
  return ((day % LEVEL_COUNT) + LEVEL_COUNT) % LEVEL_COUNT + 1;
}

export function polyLen(pts: Pt[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return len;
}

export function solutionLen(l: LevelDef): number {
  return l.solution.reduce((sum, p) => sum + polyLen(p), 0);
}

export function round5(v: number): number {
  return Math.max(5, Math.round(v / 5) * 5);
}

/** 3-star bar: optimal length x 1.10, rounded to 5. */
export function parOf(l: LevelDef): number {
  return round5(solutionLen(l) * 1.1);
}

/** Ink budget for the level. */
export function inkOf(l: LevelDef): number {
  return round5(parOf(l) * l.inkFactor);
}

/** Stars from ink used: <= par -> 3, <= par x 1.25 -> 2, else 1. */
export function starsFor(l: LevelDef, inkUsed: number): number {
  const par = parOf(l);
  if (inkUsed <= par) return 3;
  if (inkUsed <= par * 1.25) return 2;
  return 1;
}

/** The goal sensor: the 50 px band above a goal platform. */
export function goalSensor(platRect: Rect): Rect {
  return { x: platRect.x, y: platRect.y - 50, w: platRect.w, h: 50 };
}

/** Scooter spawn centre on a platform top. */
export function spawnOn(platRect: Rect, xOffset = 40): Pt {
  return { x: platRect.x + xOffset, y: platRect.y - 10 };
}
