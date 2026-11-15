// Doubloon Rush — pure game rules (no Phaser dependency; fully unit-tested).
// The visible doubloon probability counter shows the REAL implemented odds.

export type ChestKind = 'wood' | 'silver' | 'gold';
export type SpawnKind = ChestKind | 'bomb' | 'crab' | 'doubloon';

export const CHEST_POINTS: Record<ChestKind, number> = {
  wood: 10,
  silver: 25,
  gold: 50,
};

export const CRAB_SCARE_POINTS = 5;
export const DOUBLOON_POINTS = 500;
export const MAX_LIVES = 3;
export const GRID_COLS = 3;
export const GRID_ROWS = 4;

export interface LevelConfig {
  level: number;
  /** Round length in seconds (45-60). */
  durationSec: number;
  /** ms between spawn attempts. */
  spawnIntervalMs: number;
  /** ms a chest stays up (gold is faster). */
  upTimeMs: number;
  /** ms a gold chest stays up. */
  goldUpTimeMs: number;
  /** Chance a spawn is a bomb (0..1). */
  bombChance: number;
  /** Chance a spawn is a crab (0..1). */
  crabChance: number;
  /** 1 in N spawns is a doubloon (real odds, shown to the player). */
  doubloonOneIn: number;
  /** Score needed for 1/2/3 stars. */
  starThresholds: [number, number, number];
  /** Max simultaneous pop-ups. */
  maxConcurrent: number;
}

/** Difficulty ramps with sqrt(level) so early levels stay friendly. */
export function levelConfig(level: number): LevelConfig {
  const l = Math.max(1, Math.floor(level));
  const ramp = Math.sqrt(l - 1);
  const durationSec = Math.min(60, 45 + Math.floor((l - 1) / 5) * 5);
  return {
    level: l,
    durationSec,
    spawnIntervalMs: Math.max(340, Math.round(950 - 55 * ramp - 8 * (l - 1))),
    upTimeMs: Math.max(750, Math.round(1500 - 90 * ramp)),
    goldUpTimeMs: Math.max(550, Math.round(1050 - 70 * ramp)),
    bombChance: Math.min(0.22, 0.08 + 0.012 * (l - 1)),
    crabChance: Math.min(0.18, 0.05 + 0.01 * (l - 1)),
    doubloonOneIn: Math.max(120, Math.round(500 - 12 * (l - 1))),
    starThresholds: starThresholds(l, durationSec),
    maxConcurrent: Math.min(5, 2 + Math.floor((l - 1) / 4)),
  };
}

function starThresholds(level: number, durationSec: number): [number, number, number] {
  // Rough expectation: ~1 scoring tap per second at ~25 coins average.
  const expected = durationSec * 22 + level * 30;
  return [
    Math.round(expected * 0.45),
    Math.round(expected * 0.75),
    Math.round(expected * 1.1),
  ];
}

/** Combo multiplier: +10% per consecutive hit, capped at 3x (combo 20). */
export function comboMultiplier(combo: number): number {
  return 1 + Math.min(Math.max(combo, 0), 20) * 0.1;
}

export function pointsFor(kind: SpawnKind, combo: number, luck: number): number {
  const mult = comboMultiplier(combo) * luck;
  switch (kind) {
    case 'wood':
    case 'silver':
    case 'gold':
      return Math.round(CHEST_POINTS[kind] * mult);
    case 'crab':
      return Math.round(CRAB_SCARE_POINTS * mult);
    case 'doubloon':
      return Math.round(DOUBLOON_POINTS * mult);
    case 'bomb':
      return 0;
  }
}

/** Stars earned for a score (0-3). */
export function starsFor(score: number, thresholds: [number, number, number]): number {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  if (score >= thresholds[0]) return 1;
  return 0;
}

export interface SpawnWeights {
  wood: number;
  silver: number;
  gold: number;
  bomb: number;
  crab: number;
  doubloon: number;
}

/** Weighted spawn table for a level (sums to 1). */
export function spawnWeights(cfg: LevelConfig): SpawnWeights {
  const doubloon = 1 / cfg.doubloonOneIn;
  const bomb = cfg.bombChance;
  const crab = cfg.crabChance;
  const chestTotal = Math.max(0.1, 1 - bomb - crab - doubloon);
  return {
    wood: chestTotal * 0.55,
    silver: chestTotal * 0.3,
    gold: chestTotal * 0.15,
    bomb,
    crab,
    doubloon,
  };
}

/** Pick a spawn kind from weights using a caller-supplied rng in [0,1). */
export function pickSpawn(rng: number, w: SpawnWeights): SpawnKind {
  let acc = 0;
  const entries: [SpawnKind, number][] = [
    ['wood', w.wood],
    ['silver', w.silver],
    ['gold', w.gold],
    ['bomb', w.bomb],
    ['crab', w.crab],
    ['doubloon', w.doubloon],
  ];
  for (const [kind, weight] of entries) {
    acc += weight;
    if (rng < acc) return kind;
  }
  return 'wood';
}

/** Human-readable "1 in N" text for the visible probability counter. */
export function doubloonOddsText(oneIn: number): string {
  return `1 in ${oneIn}`;
}

/** Lives lost when a bomb is tapped (always 1) and combo resets. */
export function bombPenalty(): { livesLost: number; comboReset: boolean } {
  return { livesLost: 1, comboReset: true };
}
