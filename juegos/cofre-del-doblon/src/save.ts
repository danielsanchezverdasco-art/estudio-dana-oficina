// Doubloon Rush — versioned save (Bridge storage in Playgama,
// localStorage fallback outside it — see src/bridge/bridge.ts).

import { storageGet, storageSet } from './bridge/bridge';

export const SAVE_KEY = 'doubloon-rush-save-v1';
export const SAVE_VERSION = 1;
export const TOTAL_LEVELS = 30;

export interface SaveData {
  version: number;
  /** Highest unlocked level (1-based). */
  unlockedLevel: number;
  /** Best score per level: { [level]: score }. */
  bestScores: Record<string, number>;
  /** Stars per level: { [level]: 0-3 }. */
  stars: Record<string, number>;
  /** Total coins earned across all play (meta currency for skins). */
  totalCoins: number;
  /** Consecutive days played (daily challenge streak). */
  streakDays: number;
  /** ISO date (YYYY-MM-DD) of the last daily challenge played. */
  lastDailyDate: string | null;
  /** Doubloons found in total. */
  doubloonsFound: number;
  /** Tutorial seen. */
  tutorialSeen: boolean;
}

export function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    unlockedLevel: 1,
    bestScores: {},
    stars: {},
    totalCoins: 0,
    streakDays: 0,
    lastDailyDate: null,
    doubloonsFound: 0,
    tutorialSeen: false,
  };
}

export function totalStars(save: SaveData): number {
  return Object.values(save.stars).reduce((a, b) => a + b, 0);
}

export function isLevelUnlocked(save: SaveData, level: number): boolean {
  return level >= 1 && level <= TOTAL_LEVELS && level <= save.unlockedLevel;
}

export async function loadSave(): Promise<SaveData> {
  try {
    const raw = await storageGet(SAVE_KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    if (parsed.version !== SAVE_VERSION) return defaultSave();
    return { ...defaultSave(), ...parsed };
  } catch {
    return defaultSave();
  }
}

export async function writeSave(save: SaveData): Promise<void> {
  try {
    await storageSet(SAVE_KEY, JSON.stringify(save));
  } catch {
    /* save is best-effort; the game keeps running */
  }
}

/** Today's date in local YYYY-MM-DD form (for the daily challenge + streak). */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function yesterdayKey(d = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return todayKey(y);
}
