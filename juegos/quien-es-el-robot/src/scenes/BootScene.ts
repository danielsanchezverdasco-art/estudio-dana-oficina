// Boot: loads the two bundled images (badge, tutorial hand), the two fonts
// and generates all procedural textures (crowd, backgrounds, particles).
// Everything is local — no CDN, no fetch, nothing that can fail offline.
// Then the menu starts and, 200 ms after the first frame is playable,
// `game_ready` goes to Playgama (a paused load screen is not "ready").
import Phaser from 'phaser';
import { generateCrowdTextures, generateBackgrounds } from '../crowd';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload(): void {
    this.load.image('badge', './assets/img/badge.png');
    this.load.image('hand', './assets/img/hand.png');
  }

  create(): void {
    // Fonts (bundled woff2). If they fail, the game still renders with the
    // system fallbacks declared in the font stacks.
    const loadFont = (name: string, file: string): void => {
      try {
        const face = new FontFace(name, `url(./assets/fonts/${file}) format('woff2')`, { weight: '400' });
        void face
          .load()
          .then((loaded) => {
            document.fonts.add(loaded);
          })
          .catch(() => undefined);
      } catch {
        /* fonts are best-effort */
      }
    };
    loadFont('Lilita One', 'LilitaOne-400.woff2');
    loadFont('Nunito', 'Nunito-Variable.woff2');

    generateCrowdTextures(this);
    generateBackgrounds(this);

    this.scene.start('menu');

    // game_ready: 200 ms after the first frame is playable.
    this.time.delayedCall(200, () => {
      try {
        window.bridge?.platform?.sendMessage?.('game_ready');
      } catch {
        /* ignore */
      }
    });
  }
}
