// Shop: hole skins bought with earned coins only — no real-money
// payments, no paywall. Plus Extra Time refills (+15 s per level).
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { currentLang, t } from '../i18n';
import { Save } from '../save';
import { SKINS } from '../skins';
import { COLORS, bodyStyle, headingStyle, makeButton, makeIconButton } from '../ui';

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

  private buildLayout(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    this.children.removeAll();
    this.notice = null;

    const bg = this.add.image(w / 2, h / 2, w > h ? 'bg-play-land' : 'bg-play');
    const tex = this.textures.get(w > h ? 'bg-play-land' : 'bg-play').getSourceImage() as HTMLImageElement;
    bg.setScale(Math.max(w / tex.width, h / tex.height));
    const dim = this.add.rectangle(0, 0, w, h, 0x141414, 0.35).setOrigin(0);
    void dim;

    const title = this.add.text(w / 2, 44, t('shop'), headingStyle(40)).setOrigin(0.5);
    const back = makeIconButton(this, 44, 44, 26, '‹', () => this.scene.start('Menu'));
    void title;
    void back;

    const coinIcon = this.add.image(w / 2 - 40, 92, 'kh-coin').setDisplaySize(30, 30);
    const coinsText = this.add
      .text(w / 2 - 18, 92, `${Save.data.coins}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '26px', color: '#ffffff' })
      .setOrigin(0, 0.5);
    void coinIcon;
    void coinsText;

    // Skins grid: 3 per row, mini hole preview with the skin's rim colour.
    const label = this.add.text(24, 140, t('skins'), headingStyle(24, '#ffffff')).setOrigin(0, 0.5);
    void label;
    const cardW = 104;
    const cardH = 96;
    const gap = 12;
    const perRow = 3;
    const totalW = perRow * cardW + (perRow - 1) * gap;
    const startX = (w - totalW) / 2;
    SKINS.forEach((skin, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      const cx = startX + col * (cardW + gap) + cardW / 2;
      const cy = 200 + row * (cardH + 34);
      const owned = Save.data.shop.owned.includes(skin.id);
      const inUse = Save.data.shop.skin === skin.id;
      const card = this.add.container(cx, cy);
      const g = this.add.graphics();
      g.fillStyle(COLORS.cream, 1);
      g.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);
      g.lineStyle(4, inUse ? COLORS.leaf : 0x141414, 1);
      g.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);
      card.add(g);
      const hole = this.add.graphics();
      hole.fillStyle(skin.rim, 0.25);
      hole.fillEllipse(0, -12, 84, 66);
      hole.fillStyle(0x141414, 1);
      hole.fillEllipse(0, -12, 68, 52);
      hole.lineStyle(3, skin.rim, 1);
      hole.strokeEllipse(0, -12, 68, 52);
      card.add(hole);
      const name = this.add
        .text(0, 30, currentLang() === 'es' ? skin.nameEs : skin.nameEn, { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: COLORS.inkCss, fontStyle: '700' })
        .setOrigin(0.5, 0);
      card.add(name);
      card.setSize(cardW, cardH);
      card.setInteractive(new Phaser.Geom.Rectangle(0, 0, cardW, cardH), Phaser.Geom.Rectangle.Contains);
      card.on('pointerup', () => {
        if (inUse) return;
        if (!owned) {
          if (Save.data.coins < skin.price) {
            this.flashNotice(t('notEnough'));
            return;
          }
          Save.data.coins -= skin.price;
          Save.data.shop.owned.push(skin.id);
          AudioEngine.coin();
        } else {
          AudioEngine.click();
        }
        Save.data.shop.skin = skin.id;
        void Save.write();
        this.buildLayout();
      });
      // Price / state tag below the card.
      const tag = this.add
        .text(cx, cy + cardH / 2 + 10, inUse ? t('equipped') : owned ? t('owned') : `${skin.price} ${t('coins')}`, bodyStyle(14, '#ffffff'))
        .setOrigin(0.5);
      void tag;
      this.add.existing(card);
    });

    // Extra time refill.
    const timeY = 200 + Math.ceil(SKINS.length / perRow) * (cardH + 34) + 30;
    const timeLabel = this.add.text(24, timeY, `${t('extraTimeShop')} (${Save.data.shop.extraTime}/3)`, bodyStyle(20, '#ffffff')).setOrigin(0, 0.5);
    void timeLabel;
    const timeBtn = makeButton(this, w - 96, timeY, {
      w: 150, h: 56, fontSize: 20,
      label: Save.data.shop.extraTime >= 3 ? t('owned') : `${t('buy')} · 30`,
      color: Save.data.shop.extraTime >= 3 ? 0x9aa5ad : COLORS.sun,
      textColor: COLORS.inkCss,
      onClick: () => {
        if (Save.data.shop.extraTime >= 3) return;
        if (Save.data.coins < 30) {
          this.flashNotice(t('notEnough'));
          return;
        }
        Save.data.coins -= 30;
        Save.data.shop.extraTime += 1;
        void Save.write();
        AudioEngine.coin();
        this.buildLayout();
      },
    });
    void timeBtn;
    this.notice = this.add.text(w / 2, h - 40, '', bodyStyle(18, '#ffffff')).setOrigin(0.5);
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
