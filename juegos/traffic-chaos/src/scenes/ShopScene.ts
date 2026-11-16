// Garage (shop): vehicle skins for the generic cars. Skins only recolour the
// cars — taxis, buses and ambulances keep their identity colours (the colour
// IS the mechanic). Prices in coins earned by winning levels.
import { GAME_W } from '../config';
import { t } from '../i18n';
import { Save } from '../save';
import { COLORS, FONT_BODY, FONT_DISPLAY, makeButton } from '../ui';

export interface SkinDef {
  id: string;
  name: string;
  price: number;
  colors: number[];
}

export const SKINS: SkinDef[] = [
  { id: 'classic', name: 'Classic', price: 0, colors: [0xf87171, 0x60a5fa, 0xa78bfa, 0x34d399, 0xfb923c] },
  { id: 'neon', name: 'Neon Nights', price: 200, colors: [0x22d3ee, 0xf472b6, 0xa78bfa, 0x34d399, 0xfacc15] },
  { id: 'gold', name: 'Gold Rush', price: 400, colors: [0xfacc15, 0xf59e0b, 0xfde68a, 0xd97706, 0xfff7cc] },
];

/** The palette the GameScene tints generic cars with (from the equipped skin). */
export function skinColors(): number[] {
  return SKINS.find((s) => s.id === Save.data.shop.vehicle)?.colors ?? SKINS[0].colors;
}

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create(): void {
    this.add.image(0, 0, 'bg-night').setOrigin(0).setDepth(0);
    const dim = this.add.rectangle(0, 0, GAME_W, 844, 0x0f172a, 0.5).setOrigin(0).setDepth(1);
    void dim;

    this.add
      .text(GAME_W / 2, 28, t('shopTitle'), {
        fontFamily: FONT_DISPLAY,
        fontSize: '34px',
        color: '#ffffff',
        stroke: '#141414',
        strokeThickness: 7,
      })
      .setOrigin(0.5, 0)
      .setDepth(10);
    this.add
      .text(GAME_W / 2, 76, `🪙 ${Save.data.coins} ${t('coins')}`, {
        fontFamily: FONT_DISPLAY,
        fontSize: '22px',
        color: COLORS.sunCss,
        stroke: '#141414',
        strokeThickness: 5,
      })
      .setOrigin(0.5, 0)
      .setDepth(10);
    this.add
      .text(GAME_W / 2, 112, t('vehicles'), {
        fontFamily: FONT_BODY,
        fontSize: '16px',
        color: '#e2e8f0',
        fontStyle: '700',
      })
      .setOrigin(0.5, 0)
      .setDepth(10);

    let y = 160;
    for (const skin of SKINS) {
      const owned = Save.data.shop.owned.includes(skin.id);
      const equipped = Save.data.shop.vehicle === skin.id;
      // Row card.
      const card = this.add.graphics().setDepth(10);
      card.fillStyle(0xfff8e7, 1);
      card.fillRoundedRect(20, y, GAME_W - 40, 96, 16);
      card.lineStyle(3, 0x141414, 1);
      card.strokeRoundedRect(20, y, GAME_W - 40, 96, 16);
      // 3 preview cars in the skin's colours.
      for (let i = 0; i < 3; i++) {
        const car = this.add.image(56 + i * 52, y + 48, 'car').setDepth(11).setTint(skin.colors[i]);
        void car;
      }
      this.add
        .text(210, y + 26, skin.name, { fontFamily: FONT_DISPLAY, fontSize: '20px', color: COLORS.inkCss })
        .setOrigin(0, 0.5)
        .setDepth(11);
      this.add
        .text(210, y + 58, equipped ? t('equipped') : owned ? t('owned') : `🪙 ${skin.price}`, {
          fontFamily: FONT_BODY,
          fontSize: '15px',
          color: equipped ? COLORS.leafCss : '#475569',
          fontStyle: '700',
        })
        .setOrigin(0, 0.5)
        .setDepth(11);
      if (!equipped) {
        makeButton(this, GAME_W - 76, y + 48, {
          w: 96,
          h: 48,
          label: owned ? t('equipped').toUpperCase().slice(0, 6) : t('buy'),
          fontSize: 16,
          color: owned ? COLORS.leaf : COLORS.sun,
          textColor: owned ? '#ffffff' : COLORS.inkCss,
          onClick: () => {
            if (owned) {
              Save.data.shop.vehicle = skin.id;
            } else if (Save.data.coins >= skin.price) {
              Save.data.coins -= skin.price;
              Save.data.shop.owned.push(skin.id);
              Save.data.shop.vehicle = skin.id;
            } else {
              // Not enough coins: shake the button, no purchase.
              this.tweens.add({ targets: this.children.list, x: '+=4', duration: 40, yoyo: true, repeat: 3 });
              return;
            }
            void Save.write();
            this.scene.restart();
          },
        });
      }
      y += 112;
    }

    makeButton(this, GAME_W / 2, 800, {
      w: 200,
      h: 56,
      label: t('back'),
      fontSize: 20,
      color: COLORS.boost,
      onClick: () => this.scene.start('Menu'),
    });
  }
}
