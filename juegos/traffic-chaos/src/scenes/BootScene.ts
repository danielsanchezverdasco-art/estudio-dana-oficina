// Boot: loads the official hand image, generates every texture, waits for
// the display fonts, then hands over to the Menu. game_ready is NOT sent
// from this scene (only from the Menu, on the first playable frame).
import { buildArtTextures } from '../art';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.image('hand', 'assets/img/hand.png');
  }

  create(): void {
    buildArtTextures(this);
    // Wait for the display fonts before any text is drawn (else the first
    // frame renders in a fallback font and the menu pops).
    const fonts = (document as Document & { fonts?: { load: (f: string) => Promise<unknown> } }).fonts;
    const loads: Array<Promise<unknown>> = [];
    if (fonts?.load) {
      loads.push(fonts.load('16px "Lilita One"').catch(() => undefined));
      loads.push(fonts.load('700 16px "Nunito"').catch(() => undefined));
    }
    Promise.all(loads).then(() => this.scene.start('Menu'));
  }
}
