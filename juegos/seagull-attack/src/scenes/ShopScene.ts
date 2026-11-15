// Shop: cosmetics bought with earned coins only — no real-money payments,
// no paywall. Towels (the towel under the sandwich), sandwich toppers
// (cherry / star, drawn over the sprite's olive), and Extra Ink refills.
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { t, type StringKey } from '../i18n';
import { Save } from '../save';
import { COLORS, bodyStyle, drawStar, headingStyle, makeButton, makeIconButton } from '../ui';

interface ShopItem {
  id: string;
  kind: 'towel' | 'topper' | 'ink';
  nameKey: StringKey;
  price: number;
  color: number;
}

const TOWELS: ShopItem[] = [
  { id: 'red', kind: 'towel', nameKey: 'rimRed', price: 0, color: 0xe63946 },
  { id: 'blue', kind: 'towel', nameKey: 'rimBlue', price: 50, color: 0x2a6fdb },
  { id: 'yellow', kind: 'towel', nameKey: 'rimYellow', price: 50, color: 0xffc93c },
];

const TOPPERS: ShopItem[] = [
  { id: 'olive', kind: 'topper', nameKey: 'topperOlive', price: 0, color: 0x6a994e },
  { id: 'cherry', kind: 'topper', nameKey: 'topperCherry', price: 40, color: 0xd90429 },
  { id: 'star', kind: 'topper', nameKey: 'topperStar', price: 60, color: 0xffc93c },
];

export class ShopScene extends Phaser.Scene {
  private notice: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('Shop');
  }

  create(): void {
    this.buildLayout();
    this.scale.on('resize', this.buildLayout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.buildLayout, this);
    });
  }

  private owned(item: ShopItem): boolean {
    if (item.kind === 'towel') return Save.data.shop.towel === item.id || item.price === 0;
    if (item.kind === 'topper') return Save.data.shop.topper === item.id || item.price === 0;
    return false;
  }

  private inUse(item: ShopItem): boolean {
    if (item.kind === 'towel') return Save.data.shop.towel === item.id;
    if (item.kind === 'topper') return Save.data.shop.topper === item.id;
    return false;
  }

  private buildLayout(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    this.children.removeAll();
    this.notice = null;

    const bg = this.add.image(w / 2, h / 2, w > h ? 'bg-beach-land' : 'bg-beach');
    const tex = this.textures.get(w > h ? 'bg-beach-land' : 'bg-beach').getSourceImage() as HTMLImageElement;
    bg.setScale(Math.max(w / tex.width, h / tex.height));
    const dim = this.add.rectangle(0, 0, w, h, 0x0a2a33, 0.35).setOrigin(0);
    void dim;

    const title = this.add.text(w / 2, 44, t('shop'), headingStyle(40)).setOrigin(0.5);
    const back = makeIconButton(this, 44, 44, 26, '‹', () => this.scene.start('Menu'));
    void title;
    void back;

    const coinIcon = this.add.image(w / 2 - 40, 92, 'coin').setDisplaySize(30, 34);
    const coinsText = this.add
      .text(w / 2 - 18, 92, `${Save.data.coins}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '26px', color: '#ffffff' })
      .setOrigin(0, 0.5);
    void coinIcon;
    void coinsText;

    let y = 150;
    y = this.section(w, y, t('plate'), TOWELS);
    y = this.section(w, y, t('topper'), TOPPERS);
    // Extra ink refill.
    const inkY = y + 10;
    const inkLabel = this.add.text(24, inkY, `${t('extraInk')} (${Save.data.shop.extraInk}/3)`, bodyStyle(20, '#ffffff')).setOrigin(0, 0.5);
    void inkLabel;
    const inkBtn = makeButton(this, w - 96, inkY, {
      w: 150, h: 56, fontSize: 20,
      label: Save.data.shop.extraInk >= 3 ? t('owned') : `${t('buy')} · 30`,
      color: Save.data.shop.extraInk >= 3 ? 0x9aa5ad : COLORS.sun,
      textColor: COLORS.inkCss,
      onClick: () => {
        if (Save.data.shop.extraInk >= 3) return;
        if (Save.data.coins < 30) {
          this.flashNotice(t('notEnough'));
          return;
        }
        Save.data.coins -= 30;
        Save.data.shop.extraInk += 1;
        void Save.write();
        AudioEngine.coin();
        this.buildLayout();
      },
    });
    void inkBtn;
    this.notice = this.add.text(w / 2, h - 40, '', bodyStyle(18, '#ffffff')).setOrigin(0.5);
  }

  private section(w: number, y: number, title: string, items: ShopItem[]): number {
    const label = this.add.text(24, y, title, headingStyle(24, '#ffffff')).setOrigin(0, 0.5);
    void label;
    let x = 24;
    const rowY = y + 46;
    for (const item of items) {
      const card = this.add.container(x + 52, rowY);
      const g = this.add.graphics();
      g.fillStyle(COLORS.cream, 1);
      g.fillRoundedRect(-52, -40, 104, 80, 14);
      g.lineStyle(3, this.inUse(item) ? COLORS.leaf : 0xffffff, 0.9);
      g.strokeRoundedRect(-52, -40, 104, 80, 14);
      card.add(g);
      if (item.kind === 'towel') {
        // Plate preview: coloured rim + white centre, as in the game.
        const tg = this.add.graphics();
        tg.fillStyle(item.color, 1);
        tg.fillEllipse(0, 0, 76, 40);
        tg.fillStyle(0xffffff, 1);
        tg.fillEllipse(0, 0, 60, 30);
        card.add(tg);
      } else {
        const tg = this.add.graphics();
        if (item.id === 'star') drawStar(tg, 0, 0, 20, item.color);
        else {
          tg.fillStyle(item.color, 1);
          tg.fillCircle(0, 0, 18);
          tg.fillStyle(0xffffff, 0.7);
          tg.fillCircle(-6, -6, 5);
        }
        card.add(tg);
      }
      const name = this.add.text(0, 30, t(item.nameKey), { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: COLORS.inkCss, fontStyle: '700' }).setOrigin(0.5, 0);
      card.add(name);
      card.setSize(104, 80);
      // Container offset (see ui.ts): rectangle starts at (0,0).
      card.setInteractive(new Phaser.Geom.Rectangle(0, 0, 104, 80), Phaser.Geom.Rectangle.Contains);
      card.on('pointerup', () => {
        if (this.inUse(item)) return;
        if (!this.owned(item)) {
          if (Save.data.coins < item.price) {
            this.flashNotice(t('notEnough'));
            return;
          }
          Save.data.coins -= item.price;
          AudioEngine.coin();
        } else {
          AudioEngine.click();
        }
        if (item.kind === 'towel') Save.data.shop.towel = item.id;
        else Save.data.shop.topper = item.id;
        void Save.write();
        this.buildLayout();
      });
      // Price / state tag: BELOW the card, under the name — never above
      // it, where it collided with the section label.
      const tag = this.add
        .text(0, 52, this.inUse(item) ? t('inUse') : this.owned(item) ? t('use') : `${item.price} 🪙`, bodyStyle(14, '#ffffff'))
        .setOrigin(0.5);
      card.add(tag);
      this.add.existing(card);
      x += 116;
    }
    return rowY + 80;
  }

  private flashNotice(text: string): void {
    AudioEngine.fail();
    if (this.notice) {
      this.notice.setText(text);
      this.tweens.add({ targets: this.notice, alpha: 0, duration: 500, delay: 1400, onComplete: () => this.notice?.setText('') });
      this.notice.setAlpha(1);
    }
  }
}
