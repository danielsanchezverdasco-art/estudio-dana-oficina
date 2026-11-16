// 30 levels — Sushi Belt Frenzy difficulty plan.
// Blocks of 5 with a sawtooth: each block teaches ONE new thing, then
// tests it, then the next block starts a little easier than the last
// block's peak (level-design: teach -> test -> combine -> twist).
//   Block 1 (L1-5)  teach the verb: 1 colour -> 2 -> 3, faster, more.
//   Block 2 (L6-10) wasabi (L6, teaching) + golden (L8, teaching).
//   Block 3 (L11-15) speed + density up, chef warnings from L14.
//   Block 4 (L16-20) wasabi + golden combined, tighter spawns.
//   Block 5 (L21-25) high speed, targets 20-23.
//   Block 6 (L26-30) everything combined, fastest belt, most wasabi.
// Stars: 3 = win with 3 hearts, 2 = 2 hearts, 1 = 1 heart (see logic.ts).
// A level ships only if the harness proves: perfect play wins 3 stars,
// idle loses, random taps never 3-star, serve-everything never 3-star,
// and human-like play (0.5 s reaction, 5% fumbles) wins >= 2 stars.
import type { LevelDef } from './logic';

export const LEVEL_COUNT = 30;

/** Deterministic seed per level (shared by game + harness). */
export function levelSeed(n: number): number {
  return n * 7919 + 13;
}

export const LEVELS: LevelDef[] = [
  // Block 1 — teach the verb (orange only, then +grey, then +black-white).
  { n: 1, name: 'First Orders', beltSpeed: 45, spawnInterval: 2.2, target: 6, colors: 1, wasabiProb: 0, goldenProb: 0, maxOnBelt: 2 },
  { n: 2, name: 'Two Cats', beltSpeed: 50, spawnInterval: 2.1, target: 7, colors: 2, wasabiProb: 0, goldenProb: 0, maxOnBelt: 2 },
  { n: 3, name: 'Full Table', beltSpeed: 55, spawnInterval: 2.0, target: 8, colors: 3, wasabiProb: 0, goldenProb: 0, maxOnBelt: 3 },
  { n: 4, name: 'Lunch Rush', beltSpeed: 62, spawnInterval: 1.9, target: 8, colors: 3, wasabiProb: 0, goldenProb: 0, maxOnBelt: 3 },
  { n: 5, name: 'Double Orders', beltSpeed: 68, spawnInterval: 1.8, target: 10, colors: 3, wasabiProb: 0, goldenProb: 0, maxOnBelt: 3 },
  // Block 2 — wasabi (L6) + golden (L8).
  { n: 6, name: 'Wasabi Alert', beltSpeed: 75, spawnInterval: 1.8, target: 10, colors: 3, wasabiProb: 0.12, goldenProb: 0, maxOnBelt: 3 },
  { n: 7, name: 'Spicy Belt', beltSpeed: 82, spawnInterval: 1.7, target: 11, colors: 3, wasabiProb: 0.14, goldenProb: 0, maxOnBelt: 3 },
  { n: 8, name: 'Golden Plate', beltSpeed: 88, spawnInterval: 1.7, target: 12, colors: 3, wasabiProb: 0.14, goldenProb: 0.08, maxOnBelt: 3 },
  { n: 9, name: 'Golden Hour', beltSpeed: 95, spawnInterval: 1.6, target: 12, colors: 3, wasabiProb: 0.16, goldenProb: 0.08, maxOnBelt: 3 },
  { n: 10, name: 'Dinner Service', beltSpeed: 100, spawnInterval: 1.6, target: 14, colors: 3, wasabiProb: 0.16, goldenProb: 0.08, maxOnBelt: 4 },
  // Block 3 — speed + density up.
  { n: 11, name: 'Fast Lane', beltSpeed: 108, spawnInterval: 1.5, target: 14, colors: 3, wasabiProb: 0.16, goldenProb: 0.08, maxOnBelt: 4 },
  { n: 12, name: 'Wasabi Rain', beltSpeed: 115, spawnInterval: 1.5, target: 15, colors: 3, wasabiProb: 0.18, goldenProb: 0.08, maxOnBelt: 4 },
  { n: 13, name: 'Gold Rush', beltSpeed: 122, spawnInterval: 1.45, target: 15, colors: 3, wasabiProb: 0.18, goldenProb: 0.1, maxOnBelt: 4 },
  { n: 14, name: 'Chef Watches', beltSpeed: 128, spawnInterval: 1.4, target: 16, colors: 3, wasabiProb: 0.18, goldenProb: 0.1, maxOnBelt: 4 },
  { n: 15, name: 'Rush Hour', beltSpeed: 135, spawnInterval: 1.4, target: 16, colors: 3, wasabiProb: 0.2, goldenProb: 0.1, maxOnBelt: 4 },
  // Block 4 — wasabi + golden combined.
  { n: 16, name: 'Sushi Storm', beltSpeed: 142, spawnInterval: 1.35, target: 17, colors: 3, wasabiProb: 0.2, goldenProb: 0.1, maxOnBelt: 4 },
  { n: 17, name: 'Spicy Storm', beltSpeed: 148, spawnInterval: 1.3, target: 18, colors: 3, wasabiProb: 0.2, goldenProb: 0.1, maxOnBelt: 4 },
  { n: 18, name: 'Golden Storm', beltSpeed: 155, spawnInterval: 1.3, target: 18, colors: 3, wasabiProb: 0.2, goldenProb: 0.12, maxOnBelt: 4 },
  { n: 19, name: 'Hot & Gold', beltSpeed: 162, spawnInterval: 1.25, target: 19, colors: 3, wasabiProb: 0.22, goldenProb: 0.12, maxOnBelt: 4 },
  { n: 20, name: 'Grand Dinner', beltSpeed: 168, spawnInterval: 1.25, target: 20, colors: 3, wasabiProb: 0.22, goldenProb: 0.12, maxOnBelt: 4 },
  // Block 5 — high speed.
  { n: 21, name: 'Turbo Belt', beltSpeed: 175, spawnInterval: 1.2, target: 20, colors: 3, wasabiProb: 0.22, goldenProb: 0.12, maxOnBelt: 4 },
  { n: 22, name: 'Wasabi Turbo', beltSpeed: 180, spawnInterval: 1.15, target: 21, colors: 3, wasabiProb: 0.24, goldenProb: 0.12, maxOnBelt: 4 },
  { n: 23, name: 'Gold Turbo', beltSpeed: 185, spawnInterval: 1.15, target: 22, colors: 3, wasabiProb: 0.24, goldenProb: 0.14, maxOnBelt: 4 },
  { n: 24, name: 'Festival Night', beltSpeed: 190, spawnInterval: 1.1, target: 22, colors: 3, wasabiProb: 0.24, goldenProb: 0.14, maxOnBelt: 5 },
  { n: 25, name: 'Sushi Festival', beltSpeed: 195, spawnInterval: 1.1, target: 23, colors: 3, wasabiProb: 0.26, goldenProb: 0.14, maxOnBelt: 5 },
  // Block 6 — everything combined, fastest.
  { n: 26, name: 'Master Chef', beltSpeed: 200, spawnInterval: 1.05, target: 24, colors: 3, wasabiProb: 0.26, goldenProb: 0.14, maxOnBelt: 5 },
  { n: 27, name: 'Wasabi Master', beltSpeed: 205, spawnInterval: 1.0, target: 24, colors: 3, wasabiProb: 0.26, goldenProb: 0.14, maxOnBelt: 5 },
  { n: 28, name: 'Golden Master', beltSpeed: 210, spawnInterval: 1.0, target: 25, colors: 3, wasabiProb: 0.26, goldenProb: 0.16, maxOnBelt: 5 },
  { n: 29, name: 'Legendary Belt', beltSpeed: 215, spawnInterval: 0.95, target: 25, colors: 3, wasabiProb: 0.28, goldenProb: 0.16, maxOnBelt: 5 },
  { n: 30, name: 'Sushi Legend', beltSpeed: 220, spawnInterval: 0.95, target: 26, colors: 3, wasabiProb: 0.28, goldenProb: 0.16, maxOnBelt: 5 },
];

export function getLevel(n: number): LevelDef {
  return LEVELS[Math.max(0, Math.min(LEVEL_COUNT - 1, n - 1))];
}

/** Daily challenge: the level of the day (day-of-year mod 30 + 1). */
export function dailyLevel(now = new Date()): number {
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return (day % LEVEL_COUNT) + 1;
}
