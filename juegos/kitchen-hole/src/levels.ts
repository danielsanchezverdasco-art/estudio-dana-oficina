// Level definitions — Kitchen Hole Muncher, ROUND 1.
// Design space: 390x844. Playfield y 110..768 (HUD top, SIZE bar bottom).
// Every level is a kitchen to CLEAN UP: win = eat EVERYTHING before the
// timer ends; the hole grows as it eats, so the eating order climbs the
// comic scale crumbs -> croissant -> chair -> table -> fridge. A level
// only ships if its planned route wins (Tetris-GDD method: planRoute in
// this file replays the level against the pure rules and must win).
//
// Difficulty plan (binding):
// - Block 1 (L1-5, Grandma's Kitchen): the verb only — crumbs to cups,
//   no pet, no goldens, no movers. L5 teaches furniture (chair + table).
// - Block 2 (L6-10, Food Truck): the DOG arrives L6 (teaching: steal 10,
//   slow patrol). Pet speeds grow sublinearly (~sqrt) after that.
// - Block 3 (L11-15, Bakery): GOLDEN objects arrive L11 (teaching: x3,
//   8 s to catch). 3 stars need every golden + 15 s left.
// - Block 4 (L16-20, Pizzeria): MOVERS arrive L16 (fleeing mouse,
//   rolling apple — teaching: corner it, don't chase it).
// - Block 5 (L21-25, Sushi Bar): the FRIDGE arrives L21 (teaching: eat
//   everything small first, the fridge last — it only fits at SIZE ~48).
// - Block 6 (L26-30, Grand Kitchen): everything combined. L30 finale:
//   the giant fridge + a mouse + two goldens.
// - Stars at win: 3 = >=15 s left AND all goldens; 2 = >=5 s left; 1 = win.
// - Anti-trivial: idle loses (timer), sweeping loses from L6 (pet steals
//   + goldens expire + movers flee); the planned route wins every level.
import {
  createSim, stepSim, KIND_STATS, FIT,
  type LevelRules, type ObjDef, type ObjKind, type PetDef, type Vec,
} from './rules';

export interface KitchenLevel {
  n: number;
  name: string;
  kitchen: string;
  timeLimit: number;
  start: Vec;
  objects: ObjDef[];
  pet: PetDef | null;
  goldenSpawns: { at: number; x: number; y: number; kind: ObjKind }[];
}

export const LEVEL_COUNT = 30;

export const KITCHENS = [
  "Grandma's Kitchen",
  'Food Truck',
  'Bakery',
  'Pizzeria',
  'Sushi Bar',
  'Grand Kitchen',
] as const;

export function kitchenOf(n: number): string {
  return KITCHENS[Math.min(5, Math.floor((n - 1) / 5))];
}

/** Compact object literal: o(id, kind, x, y, mover?). */
const o = (id: number, kind: ObjKind, x: number, y: number, mover?: ObjDef['mover']): ObjDef =>
  mover ? { id, kind, x, y, mover } : { id, kind, x, y };

const pet = (kind: 'cat' | 'dog', x: number, y: number, patrol: Vec[], speed: number, steal: number): PetDef =>
  ({ kind, x, y, patrol, speed, steal, cooldown: 5 });

const timeFor = (n: number): number => 60 + Math.floor((n - 1) / 2);

function L(
  n: number, name: string, start: Vec, objects: ObjDef[],
  petDef: PetDef | null = null,
  goldenSpawns: KitchenLevel['goldenSpawns'] = [],
): KitchenLevel {
  return { n, name, kitchen: kitchenOf(n), timeLimit: timeFor(n), start, objects, pet: petDef, goldenSpawns };
}

export const LEVELS: KitchenLevel[] = [
  // ---- BLOCK 1 (1-5): GRANDMA'S KITCHEN — the verb only. ----
  L(1, 'First Crumbs', { x: 195, y: 700 }, [
    o(1, 'crumb', 150, 640), o(2, 'crumb', 200, 610), o(3, 'crumb', 250, 640),
    o(4, 'crumb', 280, 560), o(5, 'crumb', 150, 520),
    o(6, 'cookie', 200, 470), o(7, 'croissant', 195, 400), o(8, 'cookie', 250, 430),
  ]),
  L(2, 'Croissant Run', { x: 195, y: 700 }, [
    o(1, 'crumb', 120, 650), o(2, 'crumb', 180, 620), o(3, 'crumb', 250, 650), o(4, 'crumb', 300, 580),
    o(5, 'cookie', 160, 540), o(6, 'cookie', 240, 520),
    o(7, 'croissant', 195, 450), o(8, 'croissant', 280, 440),
    o(9, 'apple', 130, 420), o(10, 'donut', 260, 360),
  ]),
  L(3, 'Cookie Jar', { x: 195, y: 700 }, [
    o(1, 'crumb', 110, 660), o(2, 'crumb', 170, 630), o(3, 'crumb', 240, 660), o(4, 'crumb', 300, 600),
    o(5, 'cookie', 150, 560), o(6, 'cookie', 220, 540), o(7, 'cookie', 290, 500),
    o(8, 'apple', 140, 480), o(9, 'apple', 250, 450),
    o(10, 'croissant', 195, 390), o(11, 'cup', 280, 380), o(12, 'donut', 130, 340),
  ]),
  L(4, 'Apple Pie', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 240, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560), o(7, 'apple', 300, 520),
    o(8, 'apple', 120, 500), o(9, 'croissant', 200, 460), o(10, 'croissant', 280, 430),
    o(11, 'donut', 150, 400), o(12, 'cup', 250, 370), o(13, 'cup', 190, 320),
  ]),
  L(5, "Grandma's Table", { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 600),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 240, 550),
    o(7, 'apple', 120, 500), o(8, 'donut', 200, 480), o(9, 'croissant', 280, 460),
    o(10, 'cup', 150, 420), o(11, 'cup', 250, 400),
    // Size ladder before the furniture: toaster -> cake -> plant, then
    // the chairs fit, then the table fits (growth is the level's lesson).
    o(12, 'toaster', 195, 360), o(13, 'cake', 120, 360), o(14, 'plant', 280, 360),
    o(15, 'chair', 120, 300), o(16, 'chair', 270, 300),
    o(17, 'table', 195, 230),
  ]),
  // ---- BLOCK 2 (6-10): FOOD TRUCK — the dog arrives (L6 teaching). ----
  L(6, 'First Dog', { x: 195, y: 700 }, [
    o(1, 'crumb', 110, 650), o(2, 'crumb', 180, 630), o(3, 'crumb', 250, 650), o(4, 'crumb', 300, 590),
    o(5, 'cookie', 150, 560), o(6, 'cookie', 240, 540),
    o(7, 'apple', 130, 490), o(8, 'croissant', 200, 460), o(9, 'donut', 270, 440),
    o(10, 'cup', 160, 400), o(11, 'cup', 250, 380),
  ], pet('dog', 195, 300, [{ x: 80, y: 300 }, { x: 310, y: 300 }, { x: 195, y: 220 }], 55, 10)),
  L(7, 'Truck Stop', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560), o(7, 'apple', 300, 520),
    o(8, 'apple', 120, 500), o(9, 'croissant', 200, 460), o(10, 'croissant', 280, 430),
    o(11, 'donut', 150, 400), o(12, 'cup', 250, 370), o(13, 'cup', 190, 320),
    o(14, 'cake', 120, 320), o(15, 'chair', 280, 280),
  ], pet('dog', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 195, y: 200 }], 60, 10)),
  L(8, 'Fries & Donuts', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340), o(14, 'toaster', 195, 290),
    o(15, 'chair', 110, 300),
  ], pet('dog', 195, 250, [{ x: 90, y: 260 }, { x: 300, y: 260 }, { x: 195, y: 180 }], 62, 15)),
  L(9, 'Rush Hour', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290),
    o(16, 'chair', 195, 230),
  ], pet('dog', 195, 220, [{ x: 80, y: 240 }, { x: 310, y: 240 }, { x: 195, y: 160 }], 65, 15)),
  L(10, 'Food Truck Feast', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290),
    o(16, 'chair', 110, 250), o(17, 'chair', 280, 250),
    o(18, 'table', 195, 190),
  ], pet('dog', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 310, y: 180 }, { x: 80, y: 180 }], 68, 15)),
  // ---- BLOCK 3 (11-15): BAKERY — golden objects arrive (L11 teaching). ----
  L(11, 'Golden Croissant', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'cake', 195, 290),
  ], pet('cat', 195, 250, [{ x: 90, y: 260 }, { x: 300, y: 260 }, { x: 195, y: 180 }], 70, 20),
  [{ at: 20, x: 195, y: 480, kind: 'croissant' }]),
  L(12, 'Donut Box', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410), o(12, 'donut', 195, 380),
    o(13, 'cup', 180, 340), o(14, 'cup', 260, 330),
    o(15, 'cake', 130, 290), o(16, 'chair', 270, 280),
  ], pet('cat', 195, 240, [{ x: 90, y: 250 }, { x: 300, y: 250 }, { x: 195, y: 170 }], 72, 20),
  [{ at: 20, x: 195, y: 500, kind: 'donut' }]),
  L(13, 'Cake Time', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290), o(16, 'cake', 195, 240),
    o(17, 'chair', 110, 240),
  ], pet('cat', 195, 220, [{ x: 80, y: 240 }, { x: 310, y: 240 }, { x: 195, y: 160 }], 75, 20),
  [{ at: 18, x: 195, y: 500, kind: 'cake' }]),
  L(14, 'Bakery Rush', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410), o(12, 'donut', 195, 390),
    o(13, 'cup', 180, 350), o(14, 'cup', 260, 340),
    o(15, 'cake', 130, 300), o(16, 'cake', 260, 290),
    o(17, 'chair', 110, 250), o(18, 'chair', 280, 250),
  ], pet('cat', 195, 230, [{ x: 80, y: 250 }, { x: 310, y: 250 }, { x: 310, y: 170 }, { x: 80, y: 170 }], 78, 25),
  [{ at: 18, x: 195, y: 510, kind: 'croissant' }]),
  L(15, 'The Big Cake', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290),
    o(16, 'chair', 110, 250), o(17, 'chair', 280, 250),
    o(18, 'table', 195, 200), o(19, 'cake', 195, 150),
  ], pet('cat', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 195, y: 200 }], 80, 25),
  [{ at: 15, x: 195, y: 520, kind: 'cake' }]),
  // ---- BLOCK 4 (16-20): PIZZERIA — movers arrive (L16 teaching: the mouse flees). ----
  L(16, 'Runaway Mouse', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'pizza', 195, 300),
    o(15, 'mouse', 195, 220, { path: [{ x: 80, y: 220 }, { x: 310, y: 220 }, { x: 310, y: 150 }, { x: 80, y: 150 }], speed: 70, flee: true }),
  ], pet('cat', 195, 260, [{ x: 90, y: 280 }, { x: 300, y: 280 }, { x: 195, y: 190 }], 80, 25),
  [{ at: 18, x: 195, y: 500, kind: 'donut' }]),
  L(17, 'Pizza Night', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'pizza', 130, 300), o(15, 'pizza', 260, 290),
    o(16, 'chair', 195, 240),
    o(17, 'mouse', 195, 180, { path: [{ x: 80, y: 180 }, { x: 310, y: 180 }], speed: 80, flee: true }),
  ], pet('cat', 195, 250, [{ x: 90, y: 260 }, { x: 300, y: 260 }, { x: 195, y: 180 }], 82, 25),
  [{ at: 18, x: 195, y: 510, kind: 'pizza' }]),
  L(18, 'Cheese Chase', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'pizza', 130, 300), o(15, 'pizza', 260, 290), o(16, 'pizza', 195, 250),
    o(17, 'apple', 195, 200, { path: [{ x: 90, y: 200 }, { x: 300, y: 200 }, { x: 195, y: 150 }], speed: 55 }),
  ], pet('dog', 195, 280, [{ x: 80, y: 300 }, { x: 310, y: 300 }, { x: 195, y: 210 }], 75, 25),
  [{ at: 15, x: 195, y: 520, kind: 'pizza' }]),
  L(19, 'Oven Fresh', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'pizza', 130, 300), o(15, 'pizza', 260, 290),
    o(16, 'stove', 195, 230), o(17, 'chair', 110, 200), o(18, 'chair', 280, 200),
    o(19, 'mouse', 195, 160, { path: [{ x: 80, y: 160 }, { x: 310, y: 160 }, { x: 310, y: 230 }, { x: 80, y: 230 }], speed: 85, flee: true }),
  ], pet('cat', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 195, y: 210 }], 85, 25),
  [{ at: 15, x: 195, y: 520, kind: 'donut' }]),
  L(20, 'Pizza Party', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'apple', 120, 500), o(8, 'apple', 290, 500),
    o(9, 'croissant', 200, 460), o(10, 'donut', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'pizza', 130, 300), o(15, 'pizza', 260, 290), o(16, 'pizza', 195, 250),
    o(17, 'stove', 110, 220), o(18, 'chair', 280, 220),
    o(19, 'table', 195, 170),
    o(20, 'apple', 195, 130, { path: [{ x: 90, y: 130 }, { x: 300, y: 130 }], speed: 60 }),
  ], pet('cat', 195, 320, [{ x: 80, y: 340 }, { x: 310, y: 340 }, { x: 310, y: 200 }, { x: 80, y: 200 }], 88, 30),
  [{ at: 15, x: 195, y: 520, kind: 'pizza' }]),
  // ---- BLOCK 5 (21-25): SUSHI BAR — the fridge arrives (L21 teaching). ----
  L(21, 'First Fridge', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660),
    o(4, 'cookie', 140, 570), o(5, 'cookie', 230, 560),
    o(6, 'sushi', 120, 500), o(7, 'sushi', 290, 500),
    o(8, 'apple', 200, 460), o(9, 'croissant', 150, 420), o(10, 'donut', 260, 410),
    o(11, 'cup', 180, 360), o(12, 'sushi', 260, 340),
    o(13, 'toaster', 130, 300), o(14, 'cake', 260, 290),
    o(15, 'plant', 110, 240), o(16, 'chair', 280, 240),
    o(17, 'stove', 130, 190), o(18, 'table', 260, 190),
    o(19, 'fridge', 330, 165),
    o(20, 'cookie', 200, 310), o(21, 'sushi', 235, 265),
  ], pet('dog', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 195, y: 210 }], 75, 25),
  [{ at: 15, x: 195, y: 520, kind: 'sushi' }, { at: 35, x: 195, y: 430, kind: 'sushi' }]),
  L(22, 'Sushi Roll', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500), o(9, 'sushi', 195, 470),
    o(10, 'apple', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'cake', 130, 300), o(15, 'pizza', 260, 290),
    o(16, 'chair', 110, 250), o(17, 'chair', 280, 250),
    o(18, 'table', 195, 200),
  ], pet('cat', 195, 280, [{ x: 80, y: 300 }, { x: 310, y: 300 }, { x: 195, y: 200 }], 85, 25),
  [{ at: 15, x: 195, y: 520, kind: 'sushi' }, { at: 32, x: 195, y: 450, kind: 'donut' }]),
  L(23, 'Wasabi Run', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500),
    o(9, 'apple', 200, 460), o(10, 'croissant', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290),
    o(16, 'plant', 110, 240), o(17, 'chair', 280, 240),
    o(18, 'stove', 195, 190),
    o(19, 'mouse', 195, 150, { path: [{ x: 80, y: 150 }, { x: 310, y: 150 }, { x: 310, y: 210 }, { x: 80, y: 210 }], speed: 85, flee: true }),
  ], pet('cat', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 195, y: 210 }], 88, 30),
  [{ at: 15, x: 195, y: 520, kind: 'sushi' }, { at: 32, x: 195, y: 450, kind: 'cake' }]),
  L(24, 'Sushi Feast', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500), o(9, 'sushi', 195, 470),
    o(10, 'apple', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'cake', 130, 300), o(15, 'pizza', 260, 290),
    o(16, 'chair', 110, 250), o(17, 'chair', 280, 250),
    o(18, 'table', 195, 200), o(19, 'stove', 110, 160), o(20, 'plant', 280, 160),
  ], pet('dog', 195, 310, [{ x: 80, y: 330 }, { x: 310, y: 330 }, { x: 310, y: 190 }, { x: 80, y: 190 }], 78, 25),
  [{ at: 12, x: 195, y: 520, kind: 'sushi' }, { at: 30, x: 195, y: 450, kind: 'sushi' }]),
  L(25, 'The Big Fridge', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500),
    o(9, 'apple', 200, 460), o(10, 'croissant', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'sushi', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290),
    o(16, 'plant', 110, 240), o(17, 'chair', 280, 240),
    o(18, 'stove', 130, 190), o(19, 'table', 260, 190),
    o(20, 'fridge', 330, 165),
    o(21, 'mouse', 120, 150, { path: [{ x: 80, y: 150 }, { x: 310, y: 150 }], speed: 90, flee: true }),
  ], pet('cat', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 195, y: 210 }], 90, 30),
  [{ at: 12, x: 195, y: 520, kind: 'sushi' }, { at: 30, x: 195, y: 450, kind: 'cake' }]),
  // ---- BLOCK 6 (26-30): GRAND KITCHEN — everything combined. ----
  L(26, 'Grand Opening', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500),
    o(9, 'apple', 200, 460), o(10, 'croissant', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290), o(16, 'pizza', 195, 250),
    o(17, 'chair', 110, 220), o(18, 'chair', 280, 220),
    o(19, 'stove', 110, 170), o(20, 'table', 260, 170),
    o(21, 'fridge', 330, 160),
  ], pet('cat', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 310, y: 190 }, { x: 80, y: 190 }], 90, 30),
  [{ at: 12, x: 195, y: 520, kind: 'sushi' }, { at: 30, x: 195, y: 450, kind: 'pizza' }]),
  L(27, "Chef's Table", { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500),
    o(9, 'apple', 200, 460), o(10, 'croissant', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'cake', 130, 300), o(15, 'pizza', 260, 290),
    o(16, 'chair', 110, 250), o(17, 'chair', 280, 250),
    o(18, 'table', 195, 200), o(19, 'plant', 110, 160), o(20, 'stove', 280, 160),
    o(21, 'apple', 195, 130, { path: [{ x: 90, y: 130 }, { x: 300, y: 130 }, { x: 300, y: 180 }, { x: 90, y: 180 }], speed: 65 }),
  ], pet('dog', 195, 310, [{ x: 80, y: 330 }, { x: 310, y: 330 }, { x: 195, y: 200 }], 80, 30),
  [{ at: 12, x: 195, y: 520, kind: 'sushi' }, { at: 30, x: 195, y: 450, kind: 'cake' }]),
  L(28, 'Midnight Snack', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500),
    o(9, 'apple', 200, 460), o(10, 'croissant', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290),
    o(16, 'plant', 110, 240), o(17, 'chair', 280, 240),
    o(18, 'stove', 130, 190), o(19, 'table', 260, 190),
    o(20, 'fridge', 330, 165),
    o(21, 'mouse', 120, 150, { path: [{ x: 80, y: 150 }, { x: 310, y: 150 }, { x: 310, y: 220 }, { x: 80, y: 220 }], speed: 90, flee: true }),
  ], pet('cat', 195, 300, [{ x: 80, y: 320 }, { x: 310, y: 320 }, { x: 310, y: 190 }, { x: 80, y: 190 }], 92, 30),
  [{ at: 12, x: 195, y: 520, kind: 'donut' }, { at: 30, x: 195, y: 450, kind: 'pizza' }]),
  L(29, 'Almost There', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500), o(9, 'sushi', 195, 470),
    o(10, 'apple', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'cake', 130, 300), o(15, 'pizza', 260, 290), o(16, 'pizza', 195, 250),
    o(17, 'chair', 110, 220), o(18, 'chair', 280, 220),
    o(19, 'stove', 110, 170), o(20, 'table', 260, 170),
    o(21, 'apple', 195, 130, { path: [{ x: 90, y: 130 }, { x: 300, y: 130 }], speed: 70 }),
  ], pet('cat', 195, 310, [{ x: 80, y: 330 }, { x: 310, y: 330 }, { x: 310, y: 200 }, { x: 80, y: 200 }], 92, 30),
  [{ at: 12, x: 195, y: 520, kind: 'sushi' }, { at: 30, x: 195, y: 450, kind: 'cake' }]),
  L(30, 'Eat the Fridge', { x: 195, y: 700 }, [
    o(1, 'crumb', 100, 660), o(2, 'crumb', 170, 640), o(3, 'crumb', 250, 660), o(4, 'crumb', 310, 610),
    o(5, 'cookie', 140, 570), o(6, 'cookie', 230, 560),
    o(7, 'sushi', 120, 500), o(8, 'sushi', 290, 500), o(9, 'sushi', 195, 470),
    o(10, 'apple', 150, 420), o(11, 'donut', 260, 410),
    o(12, 'cup', 180, 360), o(13, 'cup', 260, 340),
    o(14, 'toaster', 130, 300), o(15, 'cake', 260, 290), o(16, 'pizza', 195, 250),
    o(17, 'chair', 110, 220), o(18, 'chair', 280, 220),
    o(19, 'plant', 110, 170), o(20, 'stove', 260, 170),
    o(21, 'table', 195, 160),
    o(22, 'fridge', 330, 160),
    o(23, 'mouse', 120, 130, { path: [{ x: 80, y: 130 }, { x: 310, y: 130 }, { x: 310, y: 200 }, { x: 80, y: 200 }], speed: 95, flee: true }),
  ], pet('cat', 195, 310, [{ x: 80, y: 330 }, { x: 310, y: 330 }, { x: 310, y: 190 }, { x: 80, y: 190 }], 95, 30),
  [{ at: 12, x: 195, y: 520, kind: 'donut' }, { at: 30, x: 195, y: 450, kind: 'pizza' }]),
];

export function getLevel(n: number): KitchenLevel {
  const idx = ((n - 1) % LEVEL_COUNT + LEVEL_COUNT) % LEVEL_COUNT;
  return LEVELS[idx];
}

/** Daily challenge level: day-of-year mod 30 + 1. */
export function dailyLevel(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0).getTime();
  const day = Math.floor((date.getTime() - start) / 86400000);
  return (day % LEVEL_COUNT) + 1;
}

export function toRules(level: KitchenLevel): LevelRules {
  return {
    timeLimit: level.timeLimit,
    startRadius: 13,
    objects: level.objects,
    pet: level.pet,
    goldenSpawns: level.goldenSpawns,
  };
}

export interface PlannedRoute {
  waypoints: Vec[];
  stars: number;
  timeUsed: number;
  coins: number;
  won: boolean;
}

/**
 * The solution: a live policy run against the pure rules — it picks the
 * nearest eatable object (smallest first on ties), chases goldens while
 * they live when `preferGoldens`, and records the hole's path every
 * 0.25 s as waypoints. A level only ships if this wins (harness asserts
 * it on all 30). Waypoints are what the test handle replays in the
 * browser and what the finisher probes.
 */
export function planRoute(level: KitchenLevel, preferGoldens = false): PlannedRoute {
  const rules = toRules(level);
  const sim = createSim(rules, level.start);
  const waypoints: Vec[] = [{ ...level.start }];
  const dt = 1 / 60;
  let lastRecord = 0;
  let guard = 0;
  while (!sim.over && guard < 60 * 120) {
    guard += 1;
    // Pick the live target: a golden first (if preferred and alive), else
    // the nearest eatable object; movers are chased at their live position.
    // With preferGoldens the last base object is held until every golden
    // has spawned, so a 3-star route does not finish before the goldens
    // appear (goldens never block the win, but 3 stars need them all).
    let target: { x: number; y: number } | null = null;
    const live = sim.objects.filter((o) => !o.eaten);
    const pendingGoldens = level.goldenSpawns.length - sim.spawnedGoldens;
    const baseLeft = live.filter((o) => !o.def.golden);
    if (preferGoldens) {
      const g = live.find((o) => o.def.golden);
      if (g) {
        target = { x: g.x, y: g.y };
      } else if (pendingGoldens > 0 && baseLeft.length <= 1) {
        const next = level.goldenSpawns[sim.spawnedGoldens];
        if (next) target = { x: next.x, y: next.y }; // wait at the spawn point
      }
    }
    if (!target) {
      let best: { x: number; y: number; score: number } | null = null;
      for (const o of live) {
        const stats = KIND_STATS[o.def.kind];
        if (stats.r > sim.hole.r * FIT) continue; // does not fit yet
        if (preferGoldens && o.def.golden) continue; // handled above
        const d = Math.hypot(o.x - sim.hole.x, o.y - sim.hole.y);
        const score = d + stats.r * 2; // prefer small + near
        if (!best || score < best.score) best = { x: o.x, y: o.y, score };
      }
      if (best) target = { x: best.x, y: best.y };
    }
    if (!target) break; // nothing eatable: stuck (harness will flag it)
    stepSim(sim, target, dt);
    if (sim.elapsed - lastRecord >= 0.25) {
      lastRecord = sim.elapsed;
      waypoints.push({ x: Math.round(sim.hole.x), y: Math.round(sim.hole.y) });
    }
  }
  return {
    waypoints,
    stars: sim.stars,
    timeUsed: sim.elapsed,
    coins: sim.coins,
    won: sim.won,
  };
}

