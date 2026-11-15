// Entry point. Order (Playgama required steps):
//  1. bridge.initialize() and wait — before anything else touches Bridge.
//  2. Load the save through bridge.storage, read platform.language once.
//  3. Start Phaser. game_ready is sent from the Menu once the first
//     playable frame is on screen (never from a loading screen).
import Phaser from 'phaser';
import { AudioEngine } from './audio';
import { currentLang, initLang, setLang } from './i18n';
import { Save } from './save';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { MapScene } from './scenes/MapScene';
import { MenuScene } from './scenes/MenuScene';
import { ResultScene } from './scenes/ResultScene';
import { ShopScene } from './scenes/ShopScene';
import { installTestHandle } from './testhandle';

declare const __TEST_BUILD__: boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BridgeLike = any;

function bridge(): BridgeLike | undefined {
  return (window as unknown as { bridge?: BridgeLike }).bridge;
}

async function boot(): Promise<void> {
  const b = bridge();
  if (b?.initialize) {
    try {
      await b.initialize();
    } catch (e) {
      console.warn('[bridge] initialize failed — running without a platform', e);
    }
  }

  await Save.load();

  // Language: the player's manual setting wins; otherwise the platform
  // language read once; English is the default and the fallback.
  if (Save.data.settings.lang === 'auto') {
    initLang(typeof b?.platform?.language === 'string' ? b.platform.language : 'en');
  } else {
    setLang(Save.data.settings.lang);
  }

  // Audio: start muted if the platform says audio is off.
  AudioEngine.setPlatformMuted(b?.platform?.isAudioEnabled === false);

  // Pause the active game when the platform pauses it (tab switch, ad).
  // Audio must be silent while an ad is open.
  try {
    b?.platform?.on?.('audio_state_changed', () => {
      AudioEngine.setPlatformMuted(b.platform.isAudioEnabled === false);
    });
    b?.platform?.on?.('pause_state_changed', () => {
      if (b.platform.isPaused) pauseActiveGame();
    });
    b?.advertisement?.on?.('interstitial_state_changed', (state: string) => {
      if (state === 'opened') AudioEngine.setPlatformMuted(true);
      else AudioEngine.setPlatformMuted(b?.platform?.isAudioEnabled === false);
    });
  } catch {
    /* the mock platform may not emit these */
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#f1f5f9',
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
    },
    physics: {
      default: 'matter',
      matter: {
        gravity: { x: 0, y: 1 },
        debug: false,
        positionIterations: 8,
        velocityIterations: 6,
      },
    },
    fps: { target: 60 },
    render: { antialias: true },
    audio: { noAudio: true }, // we use our own WebAudio synth
    scene: [BootScene, MenuScene, MapScene, GameScene, ResultScene, ShopScene],
    banner: false,
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseActiveGame();
  });
  // First user gesture unlocks the AudioContext (autoplay policy).
  window.addEventListener('pointerdown', () => AudioEngine.unlock(), { once: true });

  function pauseActiveGame(): void {
    try {
      const gs = game.scene.getScene('Game') as GameScene | null;
      if (gs && gs.scene.isActive()) gs.pauseGame();
    } catch {
      /* ignore */
    }
  }

  // Test build only: a debug handle for the probing skill. In the
  // production build __TEST_BUILD__ is false and this import is tree-shaken
  // away — the production zip contains no window.__* handle at all.
  if (__TEST_BUILD__) {
    installTestHandle(game);
  }

  // Keep the linter honest: currentLang is used by the menu toggle.
  void currentLang;
}

void boot();
