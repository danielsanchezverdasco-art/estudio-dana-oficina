// Menu: a sunny city morning at Metro Nightmare level — not a static
// title + buttons. Tappable pizza (spins, per the approved mockup),
// bobbing rider, title, subtitle, PLAY / LEVELS / SHOP buttons, daily
// challenge, language + sound toggles, coin balance, Dana Games badge.
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { currentLang, setLang, t } from '../i18n';
import { isLandscape } from '../layout';
import { Save } from '../save';
import { COLORS, bodyStyle, headingStyle, makeButton, makeIconButton } from '../ui';

let gameReadySent = false;

export function sendGameReady(): void {
  if (gameReadySent) return;
  gameReadySent = true;
  try {
    const b = (window as unknown as { bridge?: { platform?: { sendMessage?: (m: string) => Promise<unknown> } } }).bridge;
    void b?.platform?.sendMessage?.('game_ready');
  } catch {
    /* mock platform may not implement it */
  }
}

export class MenuScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Image;
  private riderHead!: Phaser.GameObjects.Image;
  private pizza!: Phaser.GameObjects.Image;
  private ui: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('Menu');
  }

  create(): void {
    this.buildLayout();
    this.scale.on('resize', this.buildLayout, this);
    // game_ready: only when the first playable frame is on screen.
    this.time.delayedCall(200, () => sendGameReady());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.buildLayout, this);
    });
  }

  private buildLayout(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    for (const o of this.ui) o.destroy();
    this.ui = [];
    if (this.bg) this.bg.destroy();
    if (this.riderHead) this.riderHead.destroy();
    if (this.pizza) this.pizza.destroy();

    const land = isLandscape(w, h);
    this.bg = this.add.image(w / 2, h / 2, land ? 'bg-menu-land' : 'bg-menu');
    const tex = this.textures.get(land ? 'bg-menu-land' : 'bg-menu').getSourceImage() as HTMLImageElement;
    const cover = Math.max(w / tex.width, h / tex.height);
    this.bg.setScale(cover);
    this.bg.setDepth(-10);

    // Dana Games badge, top-left.
    const badge = this.add.image(52, 52, 'badge').setDisplaySize(84, 84).setDepth(5);
    this.ui.push(badge);

    // Title + subtitle. Auto-fit so the wrapped title never overflows its
    // band or slides behind the toggles (right edge, x 320..372 portrait).
    const titleSize = land ? 40 : Math.min(58, Math.round(w * 0.14));
    const titleX = land ? w * 0.3 : w / 2;
    const titleY = land ? 92 : h * 0.16;
    const titleMaxW = land ? w * 0.52 : w * 0.64;
    const title = this.add
      .text(titleX, titleY, t('title'), headingStyle(titleSize, COLORS.inkCss))
      .setOrigin(0.5);
    title.setWordWrapWidth(titleMaxW);
    title.setAlign('center');
    let fitSize = titleSize;
    const maxTitleH = titleSize * 2.1;
    while ((title.height > maxTitleH || title.width > titleMaxW) && fitSize > 26) {
      fitSize -= 2;
      title.setFontSize(fitSize);
    }
    const sub = this.add
      .text(titleX, title.y + title.height / 2 + 10, t('subtitle'), bodyStyle(Math.round(fitSize * 0.42)))
      .setOrigin(0.5);
    const tag = this.add
      .text(titleX, sub.y + 26, t('tagline'), bodyStyle(16, COLORS.steelCss))
      .setOrigin(0.5);
    tag.setWordWrapWidth(titleMaxW + 40);
    tag.setAlign('center');
    this.ui.push(title, sub, tag);

    // Rider head, bobbing — the face of the delivery.
    const anchor = land ? { x: w * 0.3, y: h * 0.62 } : { x: w * 0.5, y: h * 0.5 };
    const hSize = land ? 96 : Math.max(88, Math.min(140, w * 0.3));
    this.riderHead = this.add.image(anchor.x, anchor.y, 'rider-head-menu').setDisplaySize(hSize, (hSize * 1024) / 584);
    this.tweens.add({ targets: this.riderHead, y: anchor.y - 8, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.ui.push(this.riderHead);

    // Tappable pizza — spins when touched (the mockup's toy).
    const pizzaAnchor = land ? { x: w * 0.3 + 110, y: h * 0.62 } : { x: w * 0.5 + 96, y: h * 0.5 + 40 };
    this.pizza = this.add.image(pizzaAnchor.x, pizzaAnchor.y, 'pizza').setDisplaySize(64, 64);
    this.pizza.setInteractive(new Phaser.Geom.Circle(0, 0, 36), Phaser.Geom.Circle.Contains);
    this.pizza.on('pointerdown', () => {
      AudioEngine.pop();
      this.tweens.add({ targets: this.pizza, angle: 360, duration: 500, onComplete: () => this.pizza.setAngle(0) });
    });
    this.tweens.add({ targets: this.pizza, y: pizzaAnchor.y - 6, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.ui.push(this.pizza);

    // Coins pill, top-centre.
    const coinsBg = this.add.graphics();
    coinsBg.fillStyle(0x000000, 0.3);
    coinsBg.fillRoundedRect(w / 2 - 62, 18, 124, 44, 22);
    const coinIcon = this.add.image(w / 2 - 38, 40, 'coin').setDisplaySize(30, 34);
    const coinsText = this.add
      .text(w / 2 - 16, 40, `${Save.data.coins}`, { fontFamily: 'Lilita One, "Arial Black", sans-serif', fontSize: '24px', color: '#ffffff' })
      .setOrigin(0, 0.5);
    this.ui.push(coinsBg, coinIcon, coinsText);

    // Daily challenge pill.
    const dailyN = Save.dailyLevelToday();
    const dailyDone = Save.dailyDoneToday();
    const btnX = land ? w * 0.72 : w / 2;
    const dailyY = land ? 110 : h * 0.68;
    const dailyBtn = makeButton(this, btnX, dailyY, {
      w: Math.min(300, w * 0.72), h: 56, fontSize: 22,
      label: `★ ${t('daily')}: ${t('level')} ${dailyN}${dailyDone ? ' ✓' : ''}`,
      color: dailyDone ? COLORS.leaf : COLORS.sun,
      textColor: dailyDone ? '#ffffff' : COLORS.inkCss,
      onClick: () => this.scene.start('Game', { level: dailyN, daily: true }),
    });
    this.ui.push(dailyBtn);
    if (Save.data.streak > 1) {
      const streak = this.add
        .text(btnX, land ? 60 : h * 0.68 + 44, `🔥 ${Save.data.streak} ${t('streak')}`, bodyStyle(18, '#ffffff'))
        .setOrigin(0.5);
      this.ui.push(streak);
    }

    // Main buttons.
    const playY = land ? 195 : h * 0.8;
    const subY = land ? 285 : h * 0.8 + 78;
    const play = makeButton(this, btnX, playY, {
      w: Math.min(280, w * 0.72), h: 88, fontSize: 34,
      label: t('play'), color: COLORS.leaf,
      onClick: () => this.scene.start('Game', { level: Math.min(Save.data.unlocked, 30) }),
    });
    const levels = makeButton(this, btnX - 76, subY, {
      w: 140, h: 64, fontSize: 22, label: t('map'), color: COLORS.sea,
      onClick: () => this.scene.start('Map'),
    });
    const shop = makeButton(this, btnX + 76, subY, {
      w: 140, h: 64, fontSize: 22, label: t('shop'), color: COLORS.sun,
      textColor: COLORS.inkCss,
      onClick: () => this.scene.start('Shop'),
    });
    this.ui.push(play, levels, shop);

    // Language + sound toggles, top-right.
    const langBtn = makeIconButton(this, w - 44, land ? 40 : 108, 26, currentLang() === 'es' ? 'ES' : 'EN', () => {
      const next = currentLang() === 'es' ? 'en' : 'es';
      setLang(next);
      Save.data.settings.lang = next;
      void Save.write();
      this.buildLayout();
    });
    const sndBtn = makeIconButton(this, w - 44, land ? 100 : 168, 26, Save.data.settings.sfx ? '♪' : '✕', () => {
      Save.data.settings.sfx = !Save.data.settings.sfx;
      Save.data.settings.music = Save.data.settings.sfx;
      AudioEngine.refreshSettings();
      void Save.write();
      this.buildLayout();
    });
    this.ui.push(langBtn, sndBtn);
  }
}
