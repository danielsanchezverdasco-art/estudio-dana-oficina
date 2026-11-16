// Boot: loads the two fonts + the two kept photos (hand, badge), then
// generates EVERY game texture procedurally (comic.ts, option C) — no
// bitmap art is shipped or upscaled, so nothing can look pixelated.
// Then hands over to the menu. Nothing playable happens here, so
// game_ready is NOT sent from this scene.
import Phaser from 'phaser';
import { generateComicTextures } from '../comic';

const IMAGES: [string, string][] = [
  ['badge', 'assets/img/badge.png'],
  ['hand', 'assets/img/hand.png'],
];

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    for (const [key, path] of IMAGES) this.load.image(key, path);
  }

  async create(): Promise<void> {
    // Fonts (bundled woff2, never from a CDN — Playgama requirement 1.2.5).
    try {
      const lilita = new FontFace('Lilita One', 'url(assets/fonts/LilitaOne-400.woff2)', { weight: '400' });
      const nunito = new FontFace('Nunito', 'url(assets/fonts/Nunito-Variable.woff2)', { weight: '400 800' });
      await Promise.all([lilita.load(), nunito.load()]);
      document.fonts.add(lilita);
      document.fonts.add(nunito);
      await document.fonts.ready;
    } catch (e) {
      console.warn('[boot] font load failed, using fallbacks', e);
    }

    // All art, procedural, at real resolution (see comic.ts).
    generateComicTextures(this);

    this.scene.start('Menu');
  }
}
