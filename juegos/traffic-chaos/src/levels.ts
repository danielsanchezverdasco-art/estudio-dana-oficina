// Level table: 30 levels across 3 neighborhoods, hours of day as the theme.
// Difficulty ramps in small steps (difficulty-and-balancing: sawtooth pacing —
// a new neighborhood opens with a slightly easier first level, then climbs).
// The sim's Difficulty is per level; stars come from clears vs quota, so the
// balance harness (policies) can measure every level headlessly.
//
// Star rule (from clears at level end):
//   1★  clears >= quota            (the win itself)
//   2★  clears >= quota + ceil(quota * 0.25)
//   3★  clears >= quota + ceil(quota * 0.5)
// Reference bands (prototype BALANCE.md, normal difficulty, quota 20):
// greedy-human clears 26–48 (2–3★), precise 48–54 (3★) — the thresholds sit
// inside the skilled band, not above it. The harness verifies all 30 levels.
import { EASY_DIFFICULTY, NORMAL_DIFFICULTY, type Difficulty } from './config';
import { seedFromDate } from './rules/traffic';

export type Neighborhood = 'times-square' | 'brooklyn-bridge' | 'central-park';

export interface LevelDef {
  n: number; // 1-based
  neighborhood: Neighborhood;
  hour: string; // "06:00" style label
  hourKey: string; // i18n key for the hour name
  difficulty: Difficulty;
}

const HOURS: Array<{ hour: string; hourKey: string }> = [
  { hour: '06:00', hourKey: 'morningRush' },
  { hour: '07:30', hourKey: 'morningRush' },
  { hour: '09:00', hourKey: 'morningRush' },
  { hour: '12:00', hourKey: 'lunchRush' },
  { hour: '13:30', hourKey: 'lunchRush' },
  { hour: '17:00', hourKey: 'rushHour' },
  { hour: '18:00', hourKey: 'rushHour' },
  { hour: '19:30', hourKey: 'eveningRush' },
  { hour: '21:00', hourKey: 'eveningRush' },
  { hour: '23:00', hourKey: 'nightShift' },
];

const NEIGHBORHOODS: Neighborhood[] = ['times-square', 'brooklyn-bridge', 'central-park'];

/** Difficulty ramp: patience 12 → 7, spawn faster, quota 15 → 30. */
function difficultyFor(n: number): Difficulty {
  if (n === 1) return { ...EASY_DIFFICULTY };
  if (n <= 5) return { patienceMax: 10, spawnT0: 1.8, spawnT1: 1.0, quota: 15 + n, duration: 60, openingPatience: 3.0 };
  if (n <= 10) return { patienceMax: 9, spawnT0: 1.6, spawnT1: 0.85, quota: 19 + (n - 6), duration: 60, openingPatience: 2.5 };
  if (n <= 15) return { ...NORMAL_DIFFICULTY, quota: 20 + (n - 11), openingPatience: 2.0 };
  if (n <= 20) return { patienceMax: 8, spawnT0: 1.3, spawnT1: 0.7, quota: 22 + (n - 16), duration: 60, openingPatience: 2.0 };
  if (n <= 25) return { patienceMax: 7.5, spawnT0: 1.2, spawnT1: 0.65, quota: 24 + (n - 21), duration: 60, openingPatience: 2.0 };
  return { patienceMax: 7, spawnT0: 1.1, spawnT1: 0.55, quota: 26 + (n - 26), duration: 60, openingPatience: 2.0 };
}

export const LEVELS: LevelDef[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  const block = Math.floor(i / 10);
  const slot = i % 10;
  return {
    n,
    neighborhood: NEIGHBORHOODS[block],
    hour: HOURS[slot].hour,
    hourKey: HOURS[slot].hourKey,
    difficulty: difficultyFor(n),
  };
});

export function levelDef(n: number): LevelDef {
  return LEVELS[Math.min(30, Math.max(1, n)) - 1];
}

export function neighborhoodNameKey(nb: Neighborhood): string {
  return nb === 'times-square' ? 'timesSquare' : nb === 'brooklyn-bridge' ? 'brooklynBridge' : 'centralPark';
}

/** Stars from clears at level end (see the header rule). */
export function starsFor(level: number, clears: number): number {
  const quota = levelDef(level).difficulty.quota;
  if (clears < quota) return 0;
  if (clears >= quota + Math.ceil(quota * 0.5)) return 3;
  if (clears >= quota + Math.ceil(quota * 0.25)) return 2;
  return 1;
}

/** Coins for a win: 20 base + 5 per star; daily win pays 50 flat. */
export function coinsForWin(stars: number, daily: boolean): number {
  return daily ? 50 : 20 + 5 * stars;
}

/** Daily challenge: the level number for today (1..30), stable per date. */
export function dailyLevel(date = new Date()): number {
  return (seedFromDate(date) % 30) + 1;
}
