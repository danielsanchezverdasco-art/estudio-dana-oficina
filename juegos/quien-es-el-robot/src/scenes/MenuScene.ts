// Menu: the illustrated, interactive menu — a metro platform with a
// murmuring crowd, the robot peeking its antenna between two travellers,
// and the scanner sweeping the background. Tapping a traveller makes them
// turn (wobble + look). The robot's antenna glints when the beam passes it.
// English first; the language toggle switches to Spanish live.
import Phaser from 'phaser';
import { COLORS, FONT_DISPLAY, headingStyle, bodyStyle, makeButton, makeIconButton, juice } from '../ui';
import { Save } from '../save';
import { t, setLang, currentLang } from '../i18n';
import { AudioEngine } from '../audio';
import { LEVEL_COUNT, dailyLevel } from '../levels';
import { citySignText } from '../crowd';

export class MenuScene extends Phaser.Scene {
  private scanX = 0;

  constructor() {
    super('menu');
  }

  create(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const cx = w / 2;

    // Platform background + sign.
    const bg = this.add.image(0, 0, 'bg-ny').setOrigin(0);
    bg.setDisplaySize(w, h);
    this.add
      .text(cx, 92, citySignText('ny'), { fontFamily: FONT_DISPLAY, fontSize: '20px', color: '#ffffff', stroke: '#141414', strokeThickness: 4 })
      .setOrigin(0.5);

    // The murmuring crowd (6 people, idle bob + one robot peeking).
    const crowdY = [330, 350, 470, 500, 620, 650];
    const crowdX = [60, 130, 200, 270, 330, 90];
    const crowdScale = [0.72, 0.72, 0.86, 0.86, 1.0, 1.0];
    const people: Phaser.GameObjects.Image[] = [];
    crowdX.forEach((x, i) => {
      const isRobot = i === 2;
      const img = this.add
        .image((x / 390) * w, (crowdY[i] / 844) * h, isRobot ? 'robot-hoodie' : `person-${(i * 5) % 18}`)
        .setScale(crowdScale[i] * (w / 390))
        .setInteractive({ useHandCursor: true });
      img.on('pointerdown', () => {
        AudioEngine.pop();
        this.tweens.add({ targets: img, angle: 6, duration: 90, yoyo: true });
        juice(this, 'small', img.x, img.y);
      });
      this.tweens.add({ targets: img, y: img.y - 5, duration: 1400 + i * 220, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      people.push(img);
    });
    // The robot's antenna, peeking between two travellers.
    const antenna = this.add.image((200 / 390) * w, (470 / 844) * h - 58 * (w / 390), 'antenna').setScale(w / 390);
    this.tweens.add({ targets: antenna, angle: 8, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Scanner beam sweeping the background.
    const beam = this.add.graphics();
    const drawBeam = (x: number): void => {
      beam.clear();
      beam.fillGradientStyle(0x22d3ee, 0x22d3ee, 0x22d3ee, 0x22d3ee, 0.25, 0.25, 0.05, 0.05);
      beam.fillRect(x - 28, 0, 56, h);
      beam.fillStyle(0x22d3ee, 0.5);
      beam.fillRect(x - 4, 0, 8, h);
    };
    this.scanX = -60;
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        this.scanX += 6;
        if (this.scanX > w + 60) this.scanX = -60;
        drawBeam(this.scanX);
        antenna.setAlpha(Math.abs(this.scanX - antenna.x) < 60 ? 1 : 0.25);
      },
    });

    // Title + tagline.
    this.add.text(cx, 150, t('title'), headingStyle(40)).setOrigin(0.5);
    this.add.text(cx, 196, t('subtitle'), bodyStyle(20, COLORS.scannerCss)).setOrigin(0.5);
    this.add.text(cx, 226, t('tagline'), bodyStyle(16)).setOrigin(0.5);

    // Pills: coins + streak + robots caught.
    const pill = (x: number, label: string): void => {
      this.add.text(x, 268, label, bodyStyle(16)).setOrigin(0.5);
    };
    pill(cx - 100, `★ ${Object.values(Save.data.stars).reduce((a, b) => a + b, 0)}/${LEVEL_COUNT * 3}`);
    pill(cx, `🪙 ${Save.data.coins}`);
    pill(cx + 100, `🤖 ${Save.data.robotsCaught.ny + Save.data.robotsCaught.tokyo + Save.data.robotsCaught.paris}`);

    // Daily challenge pill.
    const dailyDone = Save.dailyDoneToday();
    const dailyBtn = makeButton(this, cx, 310, {
      w: 280,
      h: 52,
      label: dailyDone ? `${t('daily')} ✓` : `${t('daily')} — ${t('level')} ${dailyLevel()}`,
      fontSize: 20,
      color: COLORS.sun,
      onClick: () => this.scene.start('game', { level: dailyLevel(), daily: true }),
    });
    dailyBtn.setAlpha(dailyDone ? 0.65 : 1);

    // Main buttons.
    makeButton(this, cx, 400, {
      w: 300,
      h: 88,
      label: t('play'),
      fontSize: 34,
      color: COLORS.leaf,
      onClick: () => this.scene.start('map'),
    });
    makeButton(this, cx, 500, {
      w: 300,
      h: 64,
      label: t('map'),
      fontSize: 24,
      color: COLORS.scanner,
      onClick: () => this.scene.start('map'),
    });
    makeButton(this, cx, 580, {
      w: 300,
      h: 64,
      label: t('shop'),
      fontSize: 24,
      color: COLORS.sun,
      onClick: () => this.scene.start('shop'),
    });

    // How to play (one line — the game teaches itself in level 1).
    this.add.text(cx, 648, `${t('howTo1')} ${t('howTo2')} ${t('howTo3')}`, bodyStyle(14)).setOrigin(0.5).setWordWrapWidth(w - 60);

    // Toggles: sound + language.
    const soundBtn = makeIconButton(this, w - 40, 40, 28, Save.data.settings.sfx ? '🔊' : '🔇', () => {
      Save.data.settings.sfx = !Save.data.settings.sfx;
      AudioEngine.refreshSettings();
      void Save.write();
      this.scene.restart();
    });
    soundBtn.setAlpha(Save.data.settings.sfx ? 1 : 0.6);
    makeIconButton(this, 40, 40, 28, currentLang() === 'en' ? 'EN' : 'ES', () => {
      setLang(currentLang() === 'en' ? 'es' : 'en');
      Save.data.settings.lang = currentLang();
      void Save.write();
      this.scene.restart();
    });

    // Badge (official Dana Games seal) on the menu corner.
    this.add.image(w - 36, h - 36, 'badge').setDisplaySize(48, 48).setAlpha(0.9);
  }
}
