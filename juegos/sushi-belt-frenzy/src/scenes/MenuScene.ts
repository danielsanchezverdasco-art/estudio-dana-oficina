// Menu: an illustrated, interactive Japanese restaurant at Metro Nightmare
// level — not a static title + buttons. The chef cat greets behind the bar,
// the belt turns with sushi, the three cats ask with open mouths; touching
// a cat makes it purr. PLAY / LEVELS / SHOP, daily challenge, language +
// sound toggles, coin balance, and the Dana Games badge.
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { currentLang, setLang, t } from '../i18n';
import { isLandscape } from '../layout';
import { Save } from '../save';
import { SKINS, THEMES } from '../skins';
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

const CAT_IDS = ['orange', 'grey', 'bw'] as const;

export class MenuScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Image;
  private ui: Phaser.GameObjects.GameObject[] = [];
  private beltPlates: Phaser.GameObjects.Image[] = [];

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
    for (const p of this.beltPlates) p.destroy();
    this.beltPlates = [];
    if (this.bg) this.bg.destroy();

    const land = isLandscape(w, h);
    const theme = THEMES.find((t) => t.id === Save.data.shop.theme) ?? THEMES[0];
    this.bg = this.add.image(w / 2, h / 2, land ? 'bg-play-land' : 'bg-menu');
    const tex = this.textures.get(land ? 'bg-play-land' : 'bg-menu').getSourceImage() as HTMLImageElement;
    const cover = Math.max(w / tex.width, h / tex.height);
    this.bg.setScale(cover);
    this.bg.setTint(theme.tint);
    this.bg.setDepth(-10);

    // Dana Games badge (mascot cameo), top-left.
    const badge = this.add.image(52, 52, 'badge').setDisplaySize(84, 84).setDepth(5);
    this.ui.push(badge);

    // Title + subtitle (the mockup has no third line — the L1 tutorial
    // teaches the verb, so the tagline is NOT shown here: it used to sit
    // on the chef's head). The title is forced to ONE line: a two-line
    // title pushed the subtitle/tagline down onto the chef and hid its
    // first line behind the coins pill (menu screenshot 16/11).
    const titleSize = land ? 38 : Math.min(52, Math.round(w * 0.13));
    const titleX = land ? w * 0.26 : w / 2;
    const titleY = land ? 80 : h * 0.15;
    const titleMaxW = land ? w * 0.44 : w * 0.86;
    const title = this.add
      .text(titleX, titleY, t('title'), headingStyle(titleSize, COLORS.sunCss))
      .setOrigin(0.5);
    title.setWordWrapWidth(titleMaxW);
    title.setAlign('center');
    let fitSize = titleSize;
    while ((title.width > titleMaxW || title.height > fitSize * 1.3) && fitSize > 22) {
      fitSize -= 2;
      title.setFontSize(fitSize);
      // The stroke is set once at creation — shrinking the font without
      // shrinking it fills the glyphs: at 22 px with an 8 px stroke the
      // title rendered as a solid black bar (menu screenshot 16/11).
      title.setStroke('#141414', Math.max(4, Math.round(fitSize / 6)));
    }
    const sub = this.add
      .text(titleX, title.y + title.height / 2 + 8, t('subtitle'), bodyStyle(Math.round(fitSize * 0.42)))
      .setOrigin(0.5);
    this.ui.push(title, sub);

    // Chef cat, greeting behind the bar — tappable: waves + meows.
    const skin = SKINS.find((s) => s.id === Save.data.shop.skin) ?? SKINS[0];
    const chefX = land ? w * 0.26 : w / 2;
    const chefY = land ? h * 0.42 : h * 0.27;
    const chef = this.add.image(chefX, chefY, 'chef-cat').setDisplaySize(150, 130);
    chef.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);
    chef.on('pointerdown', () => {
      AudioEngine.meow();
      this.tweens.add({ targets: chef, angle: -12, duration: 160, yoyo: true, repeat: 1, onComplete: () => chef.setAngle(0) });
    });
    this.tweens.add({ targets: chef, y: chefY - 6, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.ui.push(chef);

    // Belt strip with sushi looping (the restaurant is alive).
    const beltX = land ? w * 0.72 : w / 2;
    const beltY = land ? h * 0.62 : h * 0.42;
    const beltW = land ? w * 0.48 : Math.min(390, w);
    const belt = this.add.image(beltX, beltY, 'belt-strip').setDisplaySize(beltW, 110);
    this.ui.push(belt);
    const plateKeys = ['plate-salmon-orange', 'plate-tuna-grey', 'plate-shrimp-bw'];
    plateKeys.forEach((key, i) => {
      const px = this.add.image(beltX - beltW / 2 + (i + 0.5) * (beltW / 3), beltY, key).setDisplaySize(52, 52);
      this.beltPlates.push(px);
      this.tweens.add({
        targets: px, x: beltX + beltW / 2 - 10, duration: 5200 + i * 700,
        repeat: -1, delay: i * 1500,
        onRepeat: () => px.setX(beltX - beltW / 2 + 10),
      });
    });

    // Three cats on their mats, mouths open asking — tap one: it purrs.
    const catsY = land ? h * 0.84 : h * 0.62;
    const catsX = land
      ? [w * 0.6, w * 0.76, w * 0.9]
      : [w * 0.18, w * 0.5, w * 0.82];
    CAT_IDS.forEach((id, i) => {
      const mat = this.add.image(catsX[i], catsY + 62, `mat-${id}`).setDisplaySize(120, 40);
      const cat = this.add.image(catsX[i], catsY, `cat-${id}-idle`).setDisplaySize(110, 130);
      cat.setInteractive(new Phaser.Geom.Circle(0, 0, 55), Phaser.Geom.Circle.Contains);
      cat.on('pointerdown', () => {
        AudioEngine.purr();
        cat.setTexture(`cat-${id}-happy`);
        this.tweens.add({ targets: cat, scaleY: 0.92, duration: 140, yoyo: true });
        const heart = this.add.text(catsX[i], catsY - 80, '♥', { fontFamily: 'Lilita One, sans-serif', fontSize: '26px', color: '#e23b2e' }).setOrigin(0.5);
        this.tweens.add({ targets: heart, y: catsY - 120, alpha: 0, duration: 800, onComplete: () => heart.destroy() });
        this.time.delayedCall(900, () => {
          if (cat.active) cat.setTexture(`cat-${id}-idle`);
        });
      });
      this.tweens.add({ targets: cat, y: catsY - 5, duration: 1200 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      cat.setTint(skin.tint);
      this.ui.push(mat, cat);
    });

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
    const btnX = land ? w * 0.26 : w / 2;
    const dailyY = land ? h * 0.62 : h * 0.76;
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
        .text(btnX, dailyY + 44, `🔥 ${Save.data.streak} ${t('streak')}`, bodyStyle(18, '#ffffff'))
        .setOrigin(0.5);
      this.ui.push(streak);
    }

    // Main buttons.
    const playY = land ? h * 0.78 : h * 0.85;
    const subY = land ? h * 0.92 : h * 0.85 + 78;
    const play = makeButton(this, btnX, playY, {
      w: Math.min(280, w * 0.72), h: 88, fontSize: 34,
      label: t('play'), color: COLORS.leaf,
      onClick: () => this.scene.start('Game', { level: Math.min(Save.data.unlocked, 30) }),
    });
    const levels = makeButton(this, btnX - 76, subY, {
      w: 140, h: 64, fontSize: 22, label: t('map'), color: COLORS.elastic,
      onClick: () => this.scene.start('Map'),
    });
    const shop = makeButton(this, btnX + 76, subY, {
      w: 140, h: 64, fontSize: 22, label: t('shop'), color: COLORS.boost,
      onClick: () => this.scene.start('Shop'),
    });
    this.ui.push(play, levels, shop);

    // Language + sound toggles. Portrait: a pair at the top-right corner
    // (y=40, clear of the one-line title below the coins pill) — they used
    // to sit at y=108/168, on top of the title's right end.
    const langBtn = makeIconButton(this, land ? w - 44 : w - 90, 40, 26, currentLang() === 'es' ? 'ES' : 'EN', () => {
      const next = currentLang() === 'es' ? 'en' : 'es';
      setLang(next);
      Save.data.settings.lang = next;
      void Save.write();
      this.buildLayout();
    });
    const sndBtn = makeIconButton(this, w - 44, land ? 100 : 40, 26, Save.data.settings.sfx ? '♪' : '✕', () => {
      Save.data.settings.sfx = !Save.data.settings.sfx;
      Save.data.settings.music = Save.data.settings.sfx;
      AudioEngine.refreshSettings();
      void Save.write();
      this.buildLayout();
    });
    this.ui.push(langBtn, sndBtn);
  }
}
