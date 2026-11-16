import Phaser from 'phaser';
import { Save } from './save';
import { initLang } from './i18n';
import { AudioEngine } from './audio';
import { installTestHandle } from './testhandle';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { MapScene } from './scenes/MapScene';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { ShopScene } from './scenes/ShopScene';

declare global {
  // eslint-disable-next-line no-var
  var __TEST_BUILD__: boolean | undefined;
  interface Window {
    bridge?: {
      initialize(): Promise<unknown>;
      platform?: { language?: string; sendMessage?: (type: string, payload?: unknown) => void };
      advertisement?: { showInterstitial?: (opts?: unknown) => Promise<unknown>; showRewarded?: () => Promise<unknown> };
      storage?: { get?: (key: string, useDefault?: boolean) => Promise<unknown>; set?: (key: string, value: unknown) => Promise<unknown> };
      player?: { isAuthorizationSupported?: boolean; isAuthorized?: boolean; authorize?: (opts: unknown) => Promise<unknown> };
      game?: { visibilityState?: string };
    };
  }
}

/**
 * Boot sequence — Bridge FIRST, then save, then language, then the game.
 * No physics engine: this is a hidden-object game (drag the scanner, tap the
 * robot). The design size is 390x844 (mobile portrait); Phaser.Scale.RESIZE
 * keeps the canvas at the real window size and every scene reads
 * this.scale.width/height.
 */
async function boot(): Promise<void> {
  const b = window.bridge;
  if (b) {
    try {
      await b.initialize();
    } catch (e) {
      console.warn('[boot] Bridge initialize failed (continuing without it)', e);
    }
  } else {
    console.warn('[boot] No Bridge found — running standalone (dev only)');
  }

  await Save.load();
  initLang(b?.platform?.language ?? null);

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#f7e8c3',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    render: { antialias: true, pixelArt: false, roundPixels: false },
    scene: [BootScene, MenuScene, MapScene, GameScene, ResultScene, ShopScene],
  });

  installTestHandle(game);

  // First user gesture unlocks audio (autoplay policy).
  const unlock = (): void => {
    AudioEngine.unlock();
    window.removeEventListener('pointerdown', unlock);
  };
  window.addEventListener('pointerdown', unlock);

  // Pause audio when the tab hides; the game itself pauses in GameScene.
  document.addEventListener('visibilitychange', () => {
    AudioEngine.setPlatformMuted(document.hidden);
  });

  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });
}

void boot();
