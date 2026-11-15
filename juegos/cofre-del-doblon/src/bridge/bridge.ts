// Doubloon Rush — Playgama Bridge wrapper (Bridge 2.4.x).
// The global `bridge` is created by public/playgama-bridge.js, loaded as the
// FIRST script in <head> (no async), before the game engine starts.
// Outside Playgama (local dev / tests) the wrapper degrades gracefully:
// storage falls back to localStorage, ads report unsupported, language
// falls back to the browser locale. Production build exposes NO window.*
// globals of its own.

export type BridgeLike = {
  initialize: (opts?: { configFilePath?: string }) => Promise<void>;
  isInitialized: boolean;
  platform: {
    language: string;
    isAudioEnabled: boolean;
    isPaused: boolean;
    sendMessage: (message: string, options?: unknown) => Promise<unknown>;
  };
  storage: {
    get: (key: string | string[], tryParseJson?: boolean) => Promise<unknown>;
    set: (key: string | string[], value: unknown | unknown[]) => Promise<void>;
    delete: (key: string | string[]) => Promise<void>;
  };
  advertisement: {
    isInterstitialSupported: boolean;
    isRewardedSupported: boolean;
    showInterstitial: (placement?: string | null) => void;
    showRewarded: (placement?: string | null) => void;
    on: (event: string, cb: (state: string) => void) => void;
  };
  PLATFORM_MESSAGE: { GAME_READY: string };
  EVENT_NAME: {
    INTERSTITIAL_STATE_CHANGED: string;
    REWARDED_STATE_CHANGED: string;
    AUDIO_STATE_CHANGED: string;
    PAUSE_STATE_CHANGED: string;
    VISIBILITY_STATE_CHANGED: string;
  };
  INTERSTITIAL_STATE: { OPENED: string; CLOSED: string; FAILED: string; LOADING: string };
  REWARDED_STATE: {
    OPENED: string;
    CLOSED: string;
    FAILED: string;
    LOADING: string;
    REWARDED: string;
  };
};

declare global {
  interface Window {
    bridge?: BridgeLike;
    playgamaBridge?: BridgeLike;
  }
}

let bridge: BridgeLike | null = null;
let initPromise: Promise<boolean> | null = null;

/** Initialise the Bridge once, before the engine starts. Returns true when live.
 * Never blocks the game: if the platform takes >3 s, we start without it
 * (storage falls back to localStorage, ads report unsupported). */
export function initBridge(): Promise<boolean> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const b = window.bridge ?? window.playgamaBridge ?? null;
      if (!b) return false;
      bridge = b;
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('bridge init timeout')), 3000),
      );
      await Promise.race([b.initialize({ configFilePath: 'playgama-bridge-config.json' }), timeout]);
      return true;
    } catch {
      bridge = null;
      return false;
    }
  })();
  return initPromise;
}

export function isBridgeLive(): boolean {
  return bridge !== null && bridge.isInitialized;
}

/** Platform language, read ONCE after init (e.g. "en", "es", "es-MX"). */
export function bridgeLanguage(): string {
  try {
    return bridge?.platform.language || navigator.language || 'en';
  } catch {
    return 'en';
  }
}

/** Tell the platform the first frame is playable. Call once, from BootScene. */
export function sendGameReady(): void {
  try {
    void bridge?.platform.sendMessage(bridge.PLATFORM_MESSAGE.GAME_READY);
  } catch {
    /* not on a platform — ignore */
  }
}

export function isAudioEnabledByPlatform(): boolean {
  try {
    return bridge?.platform.isAudioEnabled ?? true;
  } catch {
    return true;
  }
}

export function onBridgeEvent(
  event: 'pause' | 'audio' | 'visibility',
  cb: (state: string) => void,
): void {
  try {
    if (!bridge) return;
    const name =
      event === 'pause'
        ? bridge.EVENT_NAME.PAUSE_STATE_CHANGED
        : event === 'audio'
          ? bridge.EVENT_NAME.AUDIO_STATE_CHANGED
          : bridge.EVENT_NAME.VISIBILITY_STATE_CHANGED;
    (bridge as unknown as { on?: (e: string, c: (s: string) => void) => void }).on?.(name, cb);
  } catch {
    /* ignore */
  }
}

// ---- storage (Bridge storage in Playgama, localStorage fallback outside) ----

const LS_PREFIX = 'doubloon-rush:';

export async function storageGet(key: string): Promise<string | null> {
  try {
    if (bridge) {
      const v = await bridge.storage.get(key);
      return typeof v === 'string' ? v : v == null ? null : JSON.stringify(v);
    }
  } catch {
    /* fall through to localStorage */
  }
  try {
    return localStorage.getItem(LS_PREFIX + key);
  } catch {
    return null;
  }
}

export async function storageSet(key: string, value: string): Promise<void> {
  try {
    if (bridge) {
      await bridge.storage.set(key, value);
      return;
    }
  } catch {
    /* fall through */
  }
  try {
    localStorage.setItem(LS_PREFIX + key, value);
  } catch {
    /* storage unavailable — progress lives only in memory this session */
  }
}

// ---- ads ----

export function isInterstitialSupported(): boolean {
  try {
    return bridge?.advertisement.isInterstitialSupported ?? false;
  } catch {
    return false;
  }
}

export function isRewardedSupported(): boolean {
  try {
    return bridge?.advertisement.isRewardedSupported ?? false;
  } catch {
    return false;
  }
}

/** Show an interstitial. Resolves when it closes (or immediately if unsupported). */
export function showInterstitial(): Promise<'closed' | 'failed' | 'unsupported'> {
  return new Promise((resolve) => {
    try {
      if (!bridge || !bridge.advertisement.isInterstitialSupported) {
        resolve('unsupported');
        return;
      }
      const done = (state: string) => {
        if (state === bridge?.INTERSTITIAL_STATE.CLOSED) resolve('closed');
        else if (state === bridge?.INTERSTITIAL_STATE.FAILED) resolve('failed');
      };
      bridge.advertisement.on(bridge.EVENT_NAME.INTERSTITIAL_STATE_CHANGED, done);
      bridge.advertisement.showInterstitial();
      // Safety net: never hang the game on an ad.
      setTimeout(() => resolve('closed'), 30000);
    } catch {
      resolve('failed');
    }
  });
}

/**
 * Show a rewarded ad. The reward is granted ONLY when the platform reports
 * the 'rewarded' state — never on close alone. Resolves true only then.
 */
export function showRewarded(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!bridge || !bridge.advertisement.isRewardedSupported) {
        resolve(false);
        return;
      }
      let rewarded = false;
      const onState = (state: string) => {
        if (state === bridge?.REWARDED_STATE.REWARDED) rewarded = true;
        if (
          state === bridge?.REWARDED_STATE.CLOSED ||
          state === bridge?.REWARDED_STATE.FAILED
        ) {
          resolve(rewarded);
        }
      };
      bridge.advertisement.on(bridge.EVENT_NAME.REWARDED_STATE_CHANGED, onState);
      bridge.advertisement.showRewarded();
      setTimeout(() => resolve(rewarded), 60000);
    } catch {
      resolve(false);
    }
  });
}
