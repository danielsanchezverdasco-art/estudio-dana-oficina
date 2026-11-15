// Menu: an illustrated, interactive beach scene at Metro Nightmare level —
// not a static title + buttons. Tappable gull (squawks and flees), crab
// (jumps), sun (pulses). The sandwich bobs on its towel. Title, subtitle,
// PLAY / LEVELS / SHOP buttons, daily challenge, language + sound toggles,
// coin balance, and the Dana Games badge (the studio mascot cameo).
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { currentLang, setLang, t } from '../i18n';
import { gullSize, isLandscape, sandwichAnchor, sandwichSize } from '../layout';
import { Save } from '../save';
import { COLORS, FONT_DISPLAY, bodyStyle, headingStyle, makeButton, makeIconButton } from '../ui';

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
  private gull!: Phaser.GameObjects.Image;
  private crab!: Phaser.GameObjects.Image;
  private sun!: Phaser.GameObjects.Container;
  private sandwich!: Phaser.GameObjects.Image;
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
    if (this.gull) this.gull.destroy();
    if (this.crab) this.crab.destroy();
    if (this.sun) this.sun.destroy();
    if (this.sandwich) this.sandwich.destroy();

    const land = isLandscape(w, h);
    this.bg = this.add.image(w / 2, h / 2, land ? 'bg-beach-land' : 'bg-beach');
    const tex = this.textures.get(land ? 'bg-beach-land' : 'bg-beach').getSourceImage() as HTMLImageElement;
    const cover = Math.max(w / tex.width, h / tex.height);
    this.bg.setScale(cover);
    this.bg.setDepth(-10);

    // Dana Games badge (mascot cameo), top-left.
    const badge = this.add.image(52, 52, 'badge').setDisplaySize(84, 84).setDepth(5);
    this.ui.push(badge);

    // Sun, top-right area in portrait (small and high, clear of the
    // toggles); right edge in landscape — tappable, pulses.
    const sunPos = land ? { x: w - 44, y: 190, scale: 0.7 } : { x: w * 0.84, y: 44, scale: 0.55 };
    this.sun = this.add.container(sunPos.x, sunPos.y);
    this.sun.setScale(sunPos.scale);
    const sg = this.add.graphics();
    sg.fillStyle(COLORS.sun, 1);
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i;
      sg.fillTriangle(
        Math.cos(a) * 34, Math.sin(a) * 34,
        Math.cos(a + 0.18) * 34, Math.sin(a + 0.18) * 34,
        Math.cos(a + 0.09) * 56, Math.sin(a + 0.09) * 56,
      );
    }
    sg.fillCircle(0, 0, 32);
    sg.fillStyle(0xfff3c4, 1);
    sg.fillCircle(-8, -8, 18);
    this.sun.add(sg);
    this.sun.setSize(120, 120);
    // Container offset (see ui.ts): circle centre at (60,60) to sit on the sun.
    this.sun.setInteractive(new Phaser.Geom.Circle(60, 60, 56), Phaser.Geom.Circle.Contains);
    this.sun.on('pointerdown', () => {
      AudioEngine.pop();
      this.tweens.add({ targets: this.sun, scaleX: 1.25, scaleY: 1.25, duration: 140, yoyo: true });
    });
    this.ui.push(this.sun);

    // Title + subtitle. Auto-fit: the ES title ("¡QUE NO ME ROBEN EL
    // BOCATA!") wraps to 3 lines at full size and overflows the screen, so
    // shrink the font until the wrapped title fits its band; the subtitle
    // sits below the title's actual bottom, never on top of it. The max
    // width keeps the title clear of the language/sound toggles (right
    // edge, x 320..372 in portrait) — a wide first line used to slide
    // behind the ES button and lose its last letters.
    const titleSize = land ? 40 : Math.min(64, Math.round(w * 0.15));
    const titleX = land ? w * 0.3 : w / 2;
    const titleY = land ? 92 : h * 0.17;
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
      .text(titleX, title.y + title.height / 2 + 12, t('subtitle'), bodyStyle(Math.round(fitSize * 0.42)))
      .setOrigin(0.5);
    this.ui.push(title, sub);

    // Sandwich on its towel, bobbing. In landscape it moves left so the
    // button column on the right never covers it.
    const anchor = land ? { x: w * 0.32, y: h * 0.6 } : sandwichAnchor(w, h);
    const sSize = sandwichSize(w, h);
    this.sandwich = this.add.image(anchor.x, anchor.y, 'sandwich').setDisplaySize(sSize, (sSize * 503) / 520);
    this.tweens.add({ targets: this.sandwich, y: anchor.y - 8, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.ui.push(this.sandwich);

    // Gull flying across the sky — tappable: squawks, flees up, comes back.
    const gSize = gullSize(w, h);
    this.gull = this.add.image(-80, h * 0.3, 'gull').setDisplaySize(gSize, (gSize * 411) / 520);
    this.gull.setInteractive(new Phaser.Geom.Circle(0, 0, gSize * 0.42), Phaser.Geom.Circle.Contains);
    this.gull.on('pointerdown', () => {
      AudioEngine.squawk();
      this.tweens.killTweensOf(this.gull);
      this.tweens.add({
        targets: this.gull, y: -90, angle: -30, duration: 500, ease: 'Quad.easeIn',
        onComplete: () => {
          this.gull.setPosition(-80, h * (0.22 + Math.random() * 0.2)).setAngle(0);
          this.flyGull();
        },
      });
    });
    this.ui.push(this.gull);
    this.flyGull();

    // Crab, bottom-left — tappable: jumps and waves a claw.
    const cSize = Math.max(72, Math.min(110, w * 0.24));
    this.crab = this.add.image(w * 0.14, h - 96, 'crab').setDisplaySize(cSize, (cSize * 370) / 400);
    this.crab.setInteractive(new Phaser.Geom.Circle(0, 0, cSize * 0.45), Phaser.Geom.Circle.Contains);
    this.crab.on('pointerdown', () => {
      AudioEngine.pop();
      this.tweens.add({ targets: this.crab, y: h - 140, duration: 180, yoyo: true, angle: 12 });
    });
    this.ui.push(this.crab);

    // Coins pill, top-centre.
    const coinsBg = this.add.graphics();
    coinsBg.fillStyle(0x000000, 0.3);
    coinsBg.fillRoundedRect(w / 2 - 62, 18, 124, 44, 22);
    const coinIcon = this.add.image(w / 2 - 38, 40, 'coin').setDisplaySize(30, 34);
    const coinsText = this.add
      .text(w / 2 - 16, 40, `${Save.data.coins}`, { fontFamily: FONT_DISPLAY, fontSize: '24px', color: '#ffffff' })
      .setOrigin(0, 0.5);
    this.ui.push(coinsBg, coinIcon, coinsText);

    // Daily challenge pill. In landscape the buttons form a right-hand
    // column (x = w*0.72); in portrait they stay centred and stacked from
    // the bottom. Positions are computed so nothing ever leaves the screen
    // (the old h*0.8+78 put LEVELS/SHOP below the fold in landscape).
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
      w: 140, h: 64, fontSize: 22, label: t('shop'), color: COLORS.coral,
      onClick: () => this.scene.start('Shop'),
    });
    this.ui.push(play, levels, shop);

    // Language + sound toggles, top-right (higher in landscape so they
    // clear the button column).
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

  private flyGull(): void {
    const w = this.scale.width;
    this.tweens.add({
      targets: this.gull,
      x: w + 90,
      duration: 9000 + Math.random() * 4000,
      ease: 'Linear',
      onComplete: () => {
        if (!this.gull.active) return;
        this.gull.setPosition(-80, this.scale.height * (0.22 + Math.random() * 0.2));
        this.flyGull();
      },
    });
  }
}
