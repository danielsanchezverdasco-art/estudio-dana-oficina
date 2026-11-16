// Shop: scanner beam skins (cosmetic, earned coins only) + extra hints.
// No real-money payments, no paywall.
import Phaser from 'phaser';
import { COLORS, headingStyle, bodyStyle, makeButton } from '../ui';
import { Save } from '../save';
import { t } from '../i18n';
import { BEAMS } from '../scanners';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('shop');
  }

  create(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const cx = w / 2;

    const bg = this.add.image(0, 0, 'bg-ny').setOrigin(0);
    bg.setDisplaySize(w, h);

    this.add.text(cx, 60, t('shopTitle'), headingStyle(34)).setOrigin(0.5);
    this.add.text(cx, 100, `🪙 ${Save.data.coins}`, bodyStyle(20)).setOrigin(0.5);
    this.add.text(cx, 140, t('scanners'), bodyStyle(18)).setOrigin(0.5);

    // Beam skins grid (3 per row).
    BEAMS.forEach((beam, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = cx + (col - 1) * 116;
      const y = 210 + row * 130;
      const owned = Save.data.shop.owned.includes(beam.id);
      const equipped = Save.data.shop.beam === beam.id;

      const card = this.add.container(x, y);
      const g = this.add.graphics();
      g.fillStyle(0x000000, 0.2);
      g.fillRoundedRect(-50, -52, 100, 104, 12);
      g.fillStyle(COLORS.cream, 1);
      g.fillRoundedRect(-52, -54, 100, 104, 12);
      g.lineStyle(3, equipped ? COLORS.leaf : 0x141414, 1);
      g.strokeRoundedRect(-52, -54, 100, 104, 12);
      card.add(g);
      // Beam swatch.
      const sw = this.add.graphics();
      sw.fillGradientStyle(beam.tint, beam.tint, beam.tint, beam.tint, 0.5, 0.5, 0.15, 0.15);
      sw.fillRect(-14, -40, 28, 44);
      sw.fillStyle(beam.tint, 0.8);
      sw.fillRect(-2, -40, 4, 44);
      card.add(sw);
      const name = this.add
        .text(0, 18, beam.id === 'cyan' ? 'CYAN' : beam.nameEn.toUpperCase(), bodyStyle(13))
        .setOrigin(0.5);
      card.add(name);
      const priceLabel = equipped ? t('equipped') : owned ? t('owned') : `${beam.price} 🪙`;
      const price = this.add.text(0, 40, priceLabel, bodyStyle(13, equipped ? COLORS.leafCss : COLORS.inkCss)).setOrigin(0.5);
      card.add(price);

      card.setSize(100, 104);
      card.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 100, 104),
        Phaser.Geom.Rectangle.Contains,
      );
      card.on('pointerdown', () => {
        if (equipped) return;
        if (owned) {
          Save.data.shop.beam = beam.id;
          void Save.write();
          this.scene.restart();
          return;
        }
        if (Save.data.coins >= beam.price) {
          Save.data.coins -= beam.price;
          Save.data.shop.owned.push(beam.id);
          Save.data.shop.beam = beam.id;
          void Save.write();
          this.scene.restart();
        } else {
          this.add.text(cx, 470, t('notEnough'), bodyStyle(18, COLORS.coralCss)).setOrigin(0.5);
        }
      });
    });

    // Extra hint pack (+1 hint, 30 coins, max 3 stored).
    const hintY = 210 + Math.ceil(BEAMS.length / 3) * 130 + 20;
    makeButton(this, cx, hintY, {
      w: 300,
      h: 60,
      label: `${t('extraHintShop')} — 30 🪙 (${Save.data.shop.extraHints}/3)`,
      fontSize: 18,
      color: COLORS.scanner,
      onClick: () => {
        if (Save.data.shop.extraHints >= 3) return;
        if (Save.data.coins >= 30) {
          Save.data.coins -= 30;
          Save.data.shop.extraHints += 1;
          void Save.write();
          this.scene.restart();
        }
      },
    });

    makeButton(this, cx, h - 48, {
      w: 200,
      h: 56,
      label: t('back'),
      fontSize: 22,
      color: COLORS.scanner,
      onClick: () => this.scene.start('menu'),
    });
  }
}
