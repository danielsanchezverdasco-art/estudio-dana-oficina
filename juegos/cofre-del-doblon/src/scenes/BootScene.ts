// Doubloon Rush — BootScene: loads all assets, waits for the font,
// then hands over to the menu. The Bridge is initialised in main.ts
// BEFORE the engine starts; game_ready is sent here, on the first frame
// (before the font wait), so Playgama's QA window never closes first.
// (r1 sent it ~2.5-5.5 s after load, after the font race + bridge init
// inside this scene — the QA tool had already failed the check by then.)

import Phaser from 'phaser';
import { bridgeLanguage, sendGameReady, onBridgeEvent } from '../bridge/bridge';
import { setLang } from '../i18n';
import { setPlatformMuted } from '../audio';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    // Atlases (Phaser JSON Hash, frames from scripts/process-art.py)
    this.load.atlas('chests', 'assets/atlas-chests.webp', 'assets/atlas-chests.json');
    this.load.atlas('items', 'assets/atlas-items.webp', 'assets/atlas-items.json');
    this.load.atlas('octopus', 'assets/atlas-octopus.webp', 'assets/atlas-octopus.json');
    // Backgrounds
    this.load.image('bg-beach', 'assets/bg-beach.webp');
    this.load.image('bg-beach-landscape', 'assets/bg-beach-landscape.webp');
    this.load.image('bg-menu', 'assets/bg-menu.webp');
    this.load.image('bg-map', 'assets/bg-map.webp');
    this.load.image('cover-keyart', 'assets/cover-keyart.webp');
    // Official tutorial hand (studio kit)
    this.load.image('hand', 'assets/hand-tutorial.png');
    // Font is loaded via @font-face in index.html; wait for it below.
  }

  create(): void {
    // First frame is playable as soon as this scene renders: tell the
    // platform NOW, before the font wait below. The Bridge is already
    // initialised (main.ts awaited it before creating the game).
    sendGameReady();

    const finish = () => {
      setLang(bridgeLanguage());
      // Platform pause / audio / visibility events.
      onBridgeEvent('pause', (state) => {
        const game = this.scene.get('Game') as unknown as {
          autoPause?: () => void;
          autoResume?: () => void;
        };
        const paused = state === 'true' || state === 'paused' || state === 'hidden';
        if (paused) game.autoPause?.();
        else game.autoResume?.();
      });
      onBridgeEvent('visibility', (state) => {
        if (state === 'hidden' || state === 'false') {
          const game = this.scene.get('Game') as unknown as { autoPause?: () => void };
          game.autoPause?.();
        }
      });
      onBridgeEvent('audio', (state) => {
        setPlatformMuted(state === 'false' || state === 'muted' || state === 'off');
      });
      this.scene.start('Menu');
    };

    // Wait for the display font so the first frame never shows fallback text.
    try {
      void Promise.race([
        document.fonts.load('32px "Lilita One"'),
        new Promise((r) => setTimeout(r, 2500)),
      ]).then(finish);
    } catch {
      finish();
    }
  }
}
