// Save data. ONLY through Playgama Bridge storage (bridge.storage) — never
// localStorage / IndexedDB / cookies (Playgama requirement 3.2.1). If Bridge
// is absent (should not happen: the SDK ships inside the zip), progress lives
// in memory only and is lost on reload — never silently written elsewhere.
import { dailyLevel } from './levels';

export const SAVE_KEY = 'draw_bridge_delivery_save_v1';

export interface SaveData {
  v: number;
  stars: Record<number, number>; // level -> 0..3
  coins: number;
  unlocked: number; // highest playable level (1-based)
  wins: number; // total level wins (drives the interstitial cadence)
  streak: number; // consecutive days played
  lastPlay: string; // YYYY-MM-DD
  dailyDone: string; // YYYY-MM-DD of the last completed daily challenge
  settings: { sfx: boolean; music: boolean; shake: boolean; lang: 'auto' | 'en' | 'es' };
  shop: { skin: string; extraInk: number; owned: string[] };
  chest: Record<number, boolean>; // chest claimed, keyed by level (3, 6, 9...)
}

export function defaultSave(): SaveData {
  return {
    v: 1,
    stars: {},
    coins: 0,
    unlocked: 1,
    wins: 0,
    streak: 0,
    lastPlay: '',
    dailyDone: '',
    settings: { sfx: true, music: true, shake: true, lang: 'auto' },
    shop: { skin: 'classic', extraInk: 0, owned: ['classic'] },
    chest: {},
  };
}

function todayStr(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function yesterdayStr(date = new Date()): string {
  return new Date(date.getTime() - 86400000).toISOString().slice(0, 10);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BridgeLike = any;

function bridge(): BridgeLike | undefined {
  return (window as unknown as { bridge?: BridgeLike }).bridge;
}

/** In-memory fallback used ONLY when Bridge is absent. */
let memoryFallback: SaveData | null = null;

export const Save = {
  data: defaultSave(),

  async load(): Promise<void> {
    const b = bridge();
    if (!b?.storage?.get) {
      memoryFallback = defaultSave();
      this.data = memoryFallback;
      console.warn('[save] Bridge storage unavailable — progress in memory only');
      return;
    }
    try {
      const raw = await b.storage.get(SAVE_KEY, true);
      if (raw && typeof raw === 'object') {
        this.data = { ...defaultSave(), ...(raw as SaveData) };
      }
    } catch (e) {
      console.warn('[save] load failed, starting fresh', e);
      this.data = defaultSave();
    }
    this.touchDay();
  },

  /** Record today's play for the streak. Called once per load. */
  touchDay(): void {
    const d = this.data;
    const today = todayStr();
    if (d.lastPlay === today) return;
    d.streak = d.lastPlay === yesterdayStr() ? d.streak + 1 : 1;
    d.lastPlay = today;
    void this.write();
  },

  async write(): Promise<void> {
    const b = bridge();
    if (!b?.storage?.set) {
      memoryFallback = this.data;
      return;
    }
    try {
      await b.storage.set(SAVE_KEY, this.data);
    } catch (e) {
      console.warn('[save] write failed', e);
    }
  },

  /** True when the player already completed today's daily challenge. */
  dailyDoneToday(): boolean {
    return this.data.dailyDone === todayStr();
  },

  dailyLevelToday(): number {
    return dailyLevel(new Date());
  },

  markDailyDone(): void {
    this.data.dailyDone = todayStr();
    void this.write();
  },
};
