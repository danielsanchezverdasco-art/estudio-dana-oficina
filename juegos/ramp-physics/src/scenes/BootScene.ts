// Boot: loads every image + the two fonts, generates the particle/star
// textures, then hands over to the menu. Nothing playable happens here, so
// game_ready is NOT sent from this scene.
import Phaser from 'phaser';
import { COLORS, drawStar } from '../ui';

const IMAGES: [string, string][] = [
  ['bg-menu', 'assets/img/bg-menu.webp'],
  ['bg-play', 'assets/img/bg-play.webp'],
  ['bg-play-land', 'assets/img/bg-play-land.webp'],
  ['keyart', 'assets/img/keyart.webp'],
  ['dummy-head', 'assets/img/dummy-head.webp'],
  ['dummy-torso', 'assets/img/dummy-torso.webp'],
  ['dummy-upperarm', 'assets/img/dummy-upperarm.webp'],
  ['dummy-forearm', 'assets/img/dummy-forearm.webp'],
  ['dummy-thigh', 'assets/img/dummy-thigh.webp'],
  ['dummy-shin', 'assets/img/dummy-shin.webp'],
  ['prop-fan', 'assets/img/prop-fan.webp'],
  ['prop-dynamite', 'assets/img/prop-dynamite.webp'],
  ['prop-portal', 'assets/img/prop-portal.webp'],
  ['prop-flag', 'assets/img/prop-flag.webp'],
  ['prop-star', 'assets/img/prop-star.webp'],
  ['prop-inkpot', 'assets/img/prop-inkpot.webp'],
  ['coin', 'assets/img/coin.webp'],
  ['chest', 'assets/img/chest.webp'],
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

    // Particle dot (white circle) + gold star, generated once.
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 16, 14);
    g.generateTexture('dot', 32, 32);
    g.clear();
    drawStar(g, 32, 32, 28, COLORS.sun);
    g.generateTexture('star', 64, 64);
    g.destroy();

    this.scene.start('Menu');
  }
}
