// Menu: the Times Square diorama, alive — taxis circulate on the roads, the
// logo bounces, PLAY pulses on the asphalt. Tapping a taxi honks it (the
// mockup's menu beat). game_ready is sent here, once, when the first
// playable frame is on screen.
import { GAME_H, GAME_W, PLAY_BOTTOM, PLAY_TOP } from '../config';
import { AudioEngine } from '../audio';
import { t } from '../i18n';
import { Save } from '../save';
import { COLORS, FONT_BODY, FONT_DISPLAY, makeButton, makeIconButton } from '../ui';

let gameReadySent = false;

function sendGameReady(): void {
  if (gameReadySent) return;
  gameReadySent = true;
  try {
    const b = (window as unknown as { bridge?: { platform?: { sendMessage?: (m: string) => Promise<unknown> } } }).bridge;
    void b?.platform?.sendMessage?.('game_ready');
  } catch {
    /* no platform — the game still runs */
  }
}

interface MenuCar {
  sprite: Phaser.GameObjects.Image;
  dir: 'N' | 'S' | 'E' | 'W';
  speed: number;
}

export class MenuScene extends Phaser.Scene {
  private menuCars: MenuCar[] = [];

  constructor() {
    super('Menu');
  }

  create(): void {
    this.add.image(0, 0, 'bg-night').setOrigin(0).setDepth(0);

    // Circulating taxis (cosmetic loop on the same lanes as the sim).
    const mk = (dir: 'N' | 'S' | 'E' | 'W', x: number, y: number, angle: number, speed: number, key = 'taxi') => {
      const sprite = this.add.image(x, y, key).setAngle(angle).setDepth(5);
      sprite.setInteractive(new Phaser.Geom.Rectangle(-30, -20, 60, 40), Phaser.Geom.Rectangle.Contains);
      sprite.on('pointerdown', () => {
        AudioEngine.honk();
        this.tweens.add({ targets: sprite, scaleX: 1.15, scaleY: 1.15, duration: 90, yoyo: true });
      });
      this.menuCars.push({ sprite, dir, speed });
    };
    mk('N', 222, 200, 90, 55);
    mk('S', 168, 620, 270, 70);
    mk('W', 80, 458, 0, 60, 'car');
    mk('E', 310, 402, 180, 65, 'car');
    mk('N', 222, 700, 90, 48, 'bus');

    // Logo.
    const title = this.add
      .text(GAME_W / 2, 150, t('title'), {
        fontFamily: FONT_DISPLAY,
        fontSize: '52px',
        color: '#ffffff',
        stroke: '#141414',
        strokeThickness: 10,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(10);
    title.setWordWrapWidth(GAME_W - 40);
    this.tweens.add({ targets: title, scaleX: 1.04, scaleY: 1.04, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.add
      .text(GAME_W / 2, 196, t('subtitle'), {
        fontFamily: FONT_DISPLAY,
        fontSize: '30px',
        color: COLORS.sunCss,
        stroke: '#141414',
        strokeThickness: 7,
      })
      .setOrigin(0.5)
      .setDepth(10);
    this.add
      .text(GAME_W / 2, 232, t('tagline'), {
        fontFamily: FONT_BODY,
        fontSize: '15px',
        color: '#e2e8f0',
        fontStyle: '700',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(10)
      .setWordWrapWidth(GAME_W - 60);

    // Coins + streak.
    const coin = this.add.image(20, 20, 'coin').setDisplaySize(30, 30).setOrigin(0, 0.5).setDepth(10);
    void coin;
    this.add
      .text(40, 20, `${Save.data.coins}`, { fontFamily: FONT_DISPLAY, fontSize: '20px', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setDepth(10);
    if (Save.data.streak > 1) {
      this.add
        .text(GAME_W - 16, 20, `🔥 ${Save.data.streak} ${t('streak')}`, {
          fontFamily: FONT_BODY,
          fontSize: '14px',
          color: '#fde68a',
          fontStyle: '700',
        })
        .setOrigin(1, 0.5)
        .setDepth(10);
    }

    // Daily chip.
    const dailyLabel = Save.dailyDoneToday() ? `${t('daily')} ✓` : t('daily');
    makeButton(this, GAME_W / 2, 300, {
      w: 240,
      h: 56,
      label: `📅 ${dailyLabel}`,
      fontSize: 20,
      color: COLORS.boost,
      onClick: () => this.scene.start('Game', { level: Save.dailyLevelToday(), daily: true }),
    });

    // PLAY (main button, 88 px tall).
    const play = makeButton(this, GAME_W / 2, 560, {
      w: 260,
      h: 88,
      label: `▶ ${t('play')}`,
      fontSize: 34,
      color: COLORS.leaf,
      onClick: () => this.scene.start('Game', { level: Save.data.unlocked, daily: false }),
    });
    this.tweens.add({ targets: play, scaleX: 1.05, scaleY: 1.05, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // LEVELS + SHOP.
    makeButton(this, GAME_W / 2 - 130, 660, {
      w: 120,
      h: 64,
      label: t('map'),
      fontSize: 20,
      color: COLORS.boost,
      onClick: () => this.scene.start('Map'),
    });
    makeButton(this, GAME_W / 2 + 130, 660, {
      w: 120,
      h: 64,
      label: t('shop'),
      fontSize: 20,
      color: COLORS.sun,
      textColor: COLORS.inkCss,
      onClick: () => this.scene.start('Shop'),
    });

    // Settings row: sound, music, language.
    makeIconButton(this, GAME_W / 2 - 60, GAME_H - 48, 22, Save.data.settings.sfx ? '🔊' : '🔇', () => {
      Save.data.settings.sfx = !Save.data.settings.sfx;
      AudioEngine.refreshSettings();
      void Save.write();
      this.scene.restart();
    });
    makeIconButton(this, GAME_W / 2, GAME_H - 48, 22, Save.data.settings.music ? '🎵' : '🚫', () => {
      Save.data.settings.music = !Save.data.settings.music;
      AudioEngine.refreshSettings();
      void Save.write();
      this.scene.restart();
    });
    makeIconButton(this, GAME_W / 2 + 60, GAME_H - 48, 22, '🌐', () => {
      Save.data.settings.lang = Save.data.settings.lang === 'en' ? 'es' : 'en';
      void Save.write();
      this.scene.restart();
    });

    // First playable frame is on screen — send game_ready once.
    this.time.delayedCall(100, () => sendGameReady());
  }

  update(_time: number, delta: number): void {
    const dt = Math.min(delta / 1000, 0.05);
    for (const car of this.menuCars) {
      const s = car.sprite;
      if (car.dir === 'N') {
        s.y += car.speed * dt;
        if (s.y > PLAY_BOTTOM + 40) s.y = PLAY_TOP - 40;
      } else if (car.dir === 'S') {
        s.y -= car.speed * dt;
        if (s.y < PLAY_TOP - 40) s.y = PLAY_BOTTOM + 40;
      } else if (car.dir === 'W') {
        s.x += car.speed * dt;
        if (s.x > GAME_W + 40) s.x = -40;
      } else {
        s.x -= car.speed * dt;
        if (s.x < -40) s.x = GAME_W + 40;
      }
    }
  }
}
