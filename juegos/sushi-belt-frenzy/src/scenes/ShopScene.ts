// Shop: cat skins + restaurant themes bought with earned coins only — no
// real-money payments, no paywall. Plus Extra Heart refills (+1 heart on
// the next retry, up to 3 banked).
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { currentLang, t } from '../i18n';
import { Save } from '../save';
import { SKINS, THEMES } from '../skins';
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

    const coinIcon = this.add.image(w / 2 - 40, 92, 'coin').setDisplaySize(30, 34);
    const coinsText = this.add
      .text(w / 2 - 18, 92, `${Save.data.coins}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '26px', color: '#ffffff' })
      .setOrigin(0, 0.5);
    void coinIcon;
    void coinsText;

    // Skins grid: 3 per row, orange cat preview with the skin tint.
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
      const cat = this.add.image(0, -10, 'cat-orange-idle').setDisplaySize(52, 61);
      cat.setTint(skin.tint);
      card.add(cat);
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
        .text(cx, cy + cardH / 2 + 10, inUse ? t('equipped') : owned ? t('owned') : `${skin.price} 🪙`, bodyStyle(14, '#ffffff'))
        .setOrigin(0.5);
      void tag;
      this.add.existing(card);
    });

    // Restaurant themes: one row of 3 swatch cards.
    const themesY = 200 + Math.ceil(SKINS.length / perRow) * (cardH + 34) + 36;
    const themesLabel = this.add.text(24, themesY - 34, t('themes'), headingStyle(24, '#ffffff')).setOrigin(0, 0.5);
    void themesLabel;
    THEMES.forEach((theme, i) => {
      const cx = startX + i * (cardW + gap) + cardW / 2;
      const cy = themesY;
      const owned = Save.data.shop.ownedThemes.includes(theme.id);
      const inUse = Save.data.shop.theme === theme.id;
      const card = this.add.container(cx, cy);
      const g = this.add.graphics();
      g.fillStyle(COLORS.cream, 1);
      g.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);
      g.lineStyle(4, inUse ? COLORS.leaf : 0x141414, 1);
      g.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);
      card.add(g);
      const swatch = this.add.image(0, -10, 'bg-menu').setDisplaySize(72, 48);
      swatch.setTint(theme.tint);
      card.add(swatch);
      const name = this.add
        .text(0, 30, currentLang() === 'es' ? theme.nameEs : theme.nameEn, { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: COLORS.inkCss, fontStyle: '700' })
        .setOrigin(0.5, 0);
      card.add(name);
      card.setSize(cardW, cardH);
      card.setInteractive(new Phaser.Geom.Rectangle(0, 0, cardW, cardH), Phaser.Geom.Rectangle.Contains);
      card.on('pointerup', () => {
        if (inUse) return;
        if (!owned) {
          if (Save.data.coins < theme.price) {
            this.flashNotice(t('notEnough'));
            return;
          }
          Save.data.coins -= theme.price;
          Save.data.shop.ownedThemes.push(theme.id);
          AudioEngine.coin();
        } else {
          AudioEngine.click();
        }
        Save.data.shop.theme = theme.id;
        void Save.write();
        this.buildLayout();
      });
      const tag = this.add
        .text(cx, cy + cardH / 2 + 10, inUse ? t('equipped') : owned ? t('owned') : `${theme.price} 🪙`, bodyStyle(14, '#ffffff'))
        .setOrigin(0.5);
      void tag;
      this.add.existing(card);
    });

    // Extra heart refill.
    const heartY = themesY + cardH + 44;
    const heartLabel = this.add.text(24, heartY, `${t('extraHeartShop')} (${Save.data.shop.extraHearts}/3)`, bodyStyle(20, '#ffffff')).setOrigin(0, 0.5);
    void heartLabel;
    const heartBtn = makeButton(this, w - 96, heartY, {
      w: 150, h: 56, fontSize: 20,
      label: Save.data.shop.extraHearts >= 3 ? t('owned') : `${t('buy')} · 30`,
      color: Save.data.shop.extraHearts >= 3 ? 0x9aa5ad : COLORS.sun,
      textColor: COLORS.inkCss,
      onClick: () => {
        if (Save.data.shop.extraHearts >= 3) return;
        if (Save.data.coins < 30) {
          this.flashNotice(t('notEnough'));
          return;
        }
        Save.data.coins -= 30;
        Save.data.shop.extraHearts += 1;
        void Save.write();
        AudioEngine.coin();
        this.buildLayout();
      },
    });
    void heartBtn;
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
