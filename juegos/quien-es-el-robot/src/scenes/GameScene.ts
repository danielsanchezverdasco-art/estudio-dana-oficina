// Game scene — the core loop. One finger, one verb:
//   DRAG to move the scanner beam across the crowd.
//   The robot flashes (antenna + glowing eye + ring) when the beam touches it.
//   TAP the robot before the timer runs out.
// Rules (anti-trivial, from levels.ts): tapping the robot BEFORE it is
// revealed dodges (no win, no heart lost — it teaches the verb); tapping a
// person costs 1 heart; 3 hearts gone or timer 0 = fail. Stars = hearts left.
// Design coords 390x844 inside a letterboxed container (uniform scale, so
// nobody is ever stretched); the HUD lives outside the container.
import Phaser from 'phaser';
import { COLORS, headingStyle, bodyStyle, makeButton, makeIconButton, juice } from '../ui';
import { Save } from '../save';
import { t } from '../i18n';
import { AudioEngine } from '../audio';
import { levelDef, placeCrowd, type RobotLevel, type PersonSpot, MAX_HEARTS } from '../levels';
import { personTextureFor, robotTextureFor, citySignText } from '../crowd';
import { BEAMS } from '../scanners';

const DESIGN_W = 390;
const DESIGN_H = 844;

interface PersonView {
  spot: PersonSpot;
  img: Phaser.GameObjects.Image;
  antenna?: Phaser.GameObjects.Image;
  eye?: Phaser.GameObjects.Image;
  glint?: Phaser.GameObjects.Image;
  baseX: number;
  baseY: number;
}

export class GameScene extends Phaser.Scene {
  private def!: RobotLevel;
  private daily = false;
  private scaleF = 1;
  private offsetX = 0;
  private offsetY = 0;
  private container!: Phaser.GameObjects.Container;
  private people: PersonView[] = [];
  private robotView!: PersonView;
  private beam!: Phaser.GameObjects.Graphics;
  private beamX = DESIGN_W / 2;
  private beamTint = COLORS.scanner;
  private revealed = false;
  private revealProgress = 0;
  private hearts = MAX_HEARTS;
  private timeLeft = 45;
  private hintsLeft = 1;
  private over = false;
  private paused = false;
  private elapsed = 0;
  private timerText!: Phaser.GameObjects.Text;
  private heartTexts: Phaser.GameObjects.Text[] = [];
  private toastText!: Phaser.GameObjects.Text;
  private tutorialText?: Phaser.GameObjects.Text;
  private handImg?: Phaser.GameObjects.Image;
  private shuffleTimer = 0;
  private revealRing?: Phaser.GameObjects.Graphics;

  constructor() {
    super('game');
  }

  create(data: { level?: number; daily?: boolean }): void {
    const level = data.level ?? 1;
    this.daily = data.daily ?? false;
    this.def = levelDef(level);
    this.revealed = false;
    this.revealProgress = 0;
    this.hearts = MAX_HEARTS;
    this.timeLeft = this.def.time;
    this.hintsLeft = 1 + Save.data.shop.extraHints;
    this.over = false;
    this.paused = false;
    this.elapsed = 0;
    this.people = [];
    this.heartTexts = [];

    const w = this.scale.width;
    const h = this.scale.height;
    this.scaleF = Math.min(w / DESIGN_W, h / DESIGN_H);
    this.offsetX = (w - DESIGN_W * this.scaleF) / 2;
    this.offsetY = (h - DESIGN_H * this.scaleF) / 2;

    // Background (full screen, city theme) + sign.
    const bg = this.add.image(0, 0, `bg-${this.def.city}`).setOrigin(0);
    bg.setDisplaySize(w, h);
    this.add
      .text(w / 2, 58, citySignText(this.def.city), {
        fontFamily: 'Lilita One, "Arial Black", sans-serif',
        fontSize: '18px',
        color: '#ffffff',
        stroke: '#141414',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Playfield container (design coords, uniform scale).
    this.container = this.add.container(this.offsetX, this.offsetY).setScale(this.scaleF);

    // Crowd (deterministic placement from the level seed).
    const placement = placeCrowd(this.def);
    for (const spot of placement.people) {
      const key = spot.isRobot ? robotTextureFor(this.def.outfit) : personTextureFor(spot.variant);
      const img = this.add.image(spot.x, spot.y, key).setScale(spot.scale);
      // Interactive hit area: the person's own rectangle (local coords).
      img.setInteractive(
        new Phaser.Geom.Rectangle(-32, -70, 64, 140),
        Phaser.Geom.Rectangle.Contains,
      );
      const view: PersonView = { spot, img, baseX: spot.x, baseY: spot.y };
      if (spot.isRobot) {
        // Antenna + glowing eye: hidden until the beam reveals the robot.
        view.antenna = this.add.image(spot.x, spot.y - 62 * spot.scale, 'antenna').setScale(spot.scale).setAlpha(0);
        view.eye = this.add.image(spot.x + 6 * spot.scale, spot.y - 42 * spot.scale, 'eye-glow').setScale(spot.scale).setAlpha(0);
        this.robotView = view;
      }
      if (spot.isDecoy) {
        // Glint: flashes only while the beam covers this person.
        view.glint = this.add.image(spot.x + 10, spot.y - 20, 'glint').setScale(spot.scale).setAlpha(0);
      }
      img.on('pointerdown', () => this.handleTap(view));
      this.container.add(img);
      if (view.antenna) this.container.add(view.antenna);
      if (view.eye) this.container.add(view.eye);
      if (view.glint) this.container.add(view.glint);
      this.people.push(view);
    }

    // Scanner beam (drawn each frame in design coords).
    this.beam = this.add.graphics();
    this.beamX = DESIGN_W / 2;
    const beamSkin = BEAMS.find((b) => b.id === Save.data.shop.beam) ?? BEAMS[0];
    this.beamTint = beamSkin.tint;
    this.container.add(this.beam);

    // Beam drag: pointer anywhere moves the beam (pointermove + pointerdown).
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.over || this.paused) return;
      if (!p.isDown) return;
      this.moveBeamTo(p.x);
    });
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.over || this.paused) return;
      this.moveBeamTo(p.x);
    });

    // HUD: timer + hearts + hint + pause.
    this.timerText = this.add.text(w / 2, 20, `${Math.ceil(this.timeLeft)}`, headingStyle(34)).setOrigin(0.5, 0);
    this.updateTimerColor();
    for (let i = 0; i < MAX_HEARTS; i++) {
      const ht = this.add.text(16 + i * 34, 24, '❤️', { fontSize: '26px' });
      this.heartTexts.push(ht);
    }
    makeIconButton(this, w - 40, 34, 26, '💡', () => this.useHint());
    makeIconButton(this, w - 40, 92, 26, '⏸', () => this.showPause());

    // Goal line.
    this.add.text(w / 2, 96, t('goal'), bodyStyle(18)).setOrigin(0.5);

    // Toast (center, fades).
    this.toastText = this.add.text(w / 2, 140, '', bodyStyle(18)).setOrigin(0.5).setAlpha(0);

    // Tutorials (L1 scan, L2 tap, L3 decoys) — the game teaches itself.
    if (this.def.level === 1) {
      this.tutorialText = this.add.text(w / 2, 200, t('tutorialScan'), bodyStyle(20)).setOrigin(0.5);
      this.handImg = this.add.image(w / 2, 300, 'hand').setDisplaySize(72, 72);
      this.tweens.add({ targets: this.handImg, x: w / 2 + 60, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else if (this.def.level === 3) {
      this.tutorialText = this.add.text(w / 2, 200, t('tutorialHearts'), bodyStyle(20)).setOrigin(0.5);
      this.time.delayedCall(3000, () => this.tutorialText?.destroy());
    }

    // Test hooks (test builds only — the module no-ops in production).
    const self = this as unknown as Record<string, unknown>;
    self.__testState = () => ({
      level: this.def.level,
      hearts: this.hearts,
      timeLeft: Math.ceil(this.timeLeft),
      revealed: this.revealed,
      over: this.over,
      beamX: this.beamX,
      robot: this.robotPos(),
    });
    self.__testScan = (x: number, y: number) => {
      this.beamX = Phaser.Math.Clamp(x, 0, DESIGN_W);
      this.updateReveal(0.4);
      void y;
    };
    self.__testTap = (x: number, y: number) => {
      // Find the person whose hit box contains the point.
      for (const v of this.people) {
        const px = v.img.x;
        const py = v.img.y;
        if (Math.abs(x - px) < 34 && Math.abs(y - py) < 74) {
          this.handleTap(v);
          return;
        }
      }
    };
    self.__testRobotPos = () => this.robotPos();
    self.__testRevealed = () => this.revealed;
    self.__testHint = () => this.useHint();
  }

  private robotPos(): { x: number; y: number } {
    if (!this.robotView) return { x: -1, y: -1 };
    return { x: this.robotView.img.x, y: this.robotView.img.y };
  }

  private designX(pointerX: number): number {
    return Phaser.Math.Clamp((pointerX - this.offsetX) / this.scaleF, 0, DESIGN_W);
  }

  private moveBeamTo(pointerX: number): void {
    const x = this.designX(pointerX);
    if (Math.abs(x - this.beamX) > 2) AudioEngine.scanTick();
    this.beamX = x;
    if (this.tutorialText && this.def.level === 1) {
      this.tutorialText.destroy();
      this.tutorialText = undefined;
      this.handImg?.destroy();
      this.handImg = undefined;
    }
  }

  /** Reveal progress: the beam must cover the robot for 0.35 s. */
  private updateReveal(dt: number): void {
    if (this.revealed || this.over) return;
    const r = this.robotPos();
    if (Math.abs(this.beamX - r.x) < 55) {
      this.revealProgress += dt;
      if (this.revealProgress >= 0.35) this.revealRobot();
    } else {
      this.revealProgress = Math.max(0, this.revealProgress - dt * 2);
    }
    // Decoys glint while the beam covers them (never antenna/eye).
    for (const v of this.people) {
      if (v.glint) {
        const covered = Math.abs(this.beamX - v.img.x) < 55;
        v.glint.setAlpha(covered ? 0.9 : 0);
        if (covered) v.glint.setAngle(v.glint.angle + 12);
      }
    }
  }

  private revealRobot(): void {
    this.revealed = true;
    const v = this.robotView;
    this.tweens.add({ targets: [v.antenna, v.eye], alpha: 1, duration: 200 });
    AudioEngine.reveal();
    juice(this, 'medium', v.img.x, v.img.y);
    this.showToast(t('revealed'));
    // Pulsing gold ring around the robot.
    this.revealRing = this.add.graphics();
    this.container.add(this.revealRing);
    this.tweens.add({
      targets: this.revealRing,
      alpha: 0.4,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    if (this.def.level === 2) {
      this.tutorialText = this.add.text(this.scale.width / 2, 200, t('tutorialTap'), bodyStyle(20)).setOrigin(0.5);
      this.time.delayedCall(3000, () => this.tutorialText?.destroy());
    }
  }

  private handleTap(view: PersonView): void {
    if (this.over || this.paused) return;
    if (view.spot.isRobot) {
      if (!this.revealed) {
        // No-scan tap: the robot dodges — it teaches the verb, costs nothing.
        AudioEngine.dodge();
        this.showToast(t('scanFirst'));
        this.tweens.add({ targets: view.img, x: view.img.x + 14, duration: 120, yoyo: true });
        return;
      }
      this.win();
      return;
    }
    // Wrong person: -1 heart.
    this.hearts -= 1;
    AudioEngine.fail();
    juice(this, 'small', view.img.x, view.img.y);
    this.updateHearts();
    this.tweens.add({ targets: view.img, angle: 8, duration: 100, yoyo: true });
    if (view.spot.isDecoy) this.showToast(t('shinyNotRobot'));
    if (this.hearts <= 0) this.fail('hearts');
  }

  private updateHearts(): void {
    this.heartTexts.forEach((ht, i) => ht.setAlpha(i < this.hearts ? 1 : 0.25));
  }

  private updateTimerColor(): void {
    const color = this.timeLeft <= 10 ? COLORS.coralCss : COLORS.inkCss;
    this.timerText.setColor(color);
  }

  private showToast(msg: string): void {
    this.toastText.setText(msg).setAlpha(1);
    this.tweens.killTweensOf(this.toastText);
    this.tweens.add({ targets: this.toastText, alpha: 0, delay: 1400, duration: 400 });
  }

  private useHint(): void {
    if (this.over || this.paused) return;
    if (this.hintsLeft <= 0) {
      this.showToast(t('hintUsed'));
      return;
    }
    this.hintsLeft -= 1;
    if (Save.data.shop.extraHints > 0) Save.data.shop.extraHints -= 1;
    AudioEngine.pop();
    // Pulse a ring around the robot for 1.5 s — it shows WHERE, but the
    // player still has to scan the beam there and tap to win.
    const r = this.robotPos();
    const ring = this.add.graphics();
    this.container.add(ring);
    ring.lineStyle(5, COLORS.sun, 1);
    ring.strokeCircle(r.x, r.y - 20, 52);
    this.tweens.add({
      targets: ring,
      alpha: 0.2,
      duration: 400,
      yoyo: true,
      repeat: 3,
      onComplete: () => ring.destroy(),
    });
  }

  private showPause(): void {
    if (this.over) return;
    this.paused = true;
    const w = this.scale.width;
    const h = this.scale.height;
    const dim = this.add.rectangle(0, 0, w, h, 0x000000, 0.55).setOrigin(0).setInteractive();
    const panel = this.add.container(w / 2, h / 2);
    const pg = this.add.graphics();
    pg.fillStyle(COLORS.cream, 1);
    pg.fillRoundedRect(-150, -190, 300, 380, 20);
    pg.lineStyle(4, 0x141414, 1);
    pg.strokeRoundedRect(-150, -190, 300, 380, 20);
    panel.add(pg);
    panel.add(this.add.text(0, -160, t('pause'), headingStyle(32)).setOrigin(0.5));
    const close = (): void => {
      dim.destroy();
      panel.destroy();
      this.paused = false;
    };
    const resumeBtn = makeButton(this, 0, -90, { w: 240, h: 60, label: t('resume'), fontSize: 22, color: COLORS.leaf, onClick: close });
    const restartBtn = makeButton(this, 0, -10, {
      w: 240,
      h: 60,
      label: t('restart'),
      fontSize: 22,
      color: COLORS.scanner,
      onClick: () => this.scene.restart({ level: this.def.level, daily: this.daily }),
    });
    const quitBtn = makeButton(this, 0, 70, {
      w: 240,
      h: 60,
      label: t('quit'),
      fontSize: 22,
      color: COLORS.coral,
      onClick: () => this.scene.start('menu'),
    });
    panel.add([resumeBtn, restartBtn, quitBtn]);
    // Sound / music / shake toggles.
    const toggleRow = (y: number, label: string, on: boolean, flip: () => void): void => {
      const row = this.add.text(0, y, `${label}: ${on ? 'ON' : 'OFF'}`, bodyStyle(18)).setOrigin(0.5);
      row.setInteractive({ useHandCursor: true });
      row.on('pointerdown', () => {
        flip();
        AudioEngine.refreshSettings();
        void Save.write();
        close();
        this.showPause();
      });
      panel.add(row);
    };
    toggleRow(130, t('sound'), Save.data.settings.sfx, () => {
      Save.data.settings.sfx = !Save.data.settings.sfx;
    });
    toggleRow(160, t('music'), Save.data.settings.music, () => {
      Save.data.settings.music = !Save.data.settings.music;
    });
  }

  private win(): void {
    if (this.over) return;
    this.over = true;
    const stars = this.hearts; // 3/2/1 by hearts left
    const coins = Math.min(45, 20 + Math.ceil(this.timeLeft));
    AudioEngine.caught();
    juice(this, 'large', this.robotView.img.x, this.robotView.img.y);
    Save.data.stars[this.def.level] = Math.max(Save.data.stars[this.def.level] ?? 0, stars);
    Save.data.coins += coins;
    Save.data.wins += 1;
    if (this.def.level >= Save.data.unlocked && this.def.level < 30) Save.data.unlocked = this.def.level + 1;
    Save.data.robotsCaught[this.def.city] += 1;
    if (this.daily) Save.markDailyDone();
    void Save.write();
    this.time.delayedCall(500, () => {
      this.scene.start('result', {
        win: true,
        level: this.def.level,
        stars,
        coins,
        daily: this.daily,
      });
    });
  }

  private fail(reason: 'time' | 'hearts'): void {
    if (this.over) return;
    this.over = true;
    AudioEngine.fail();
    this.time.delayedCall(400, () => {
      this.scene.start('result', {
        win: false,
        level: this.def.level,
        stars: 0,
        coins: 0,
        daily: this.daily,
        reason,
      });
    });
  }

  update(_time: number, delta: number): void {
    if (this.over || this.paused) return;
    const dt = delta / 1000;
    this.elapsed += dt;

    // Timer.
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.timerText.setText('0');
      this.fail('time');
      return;
    }
    this.timerText.setText(`${Math.ceil(this.timeLeft)}`);
    this.updateTimerColor();

    // Beam reveal + drawing.
    this.updateReveal(dt);
    this.beam.clear();
    const bx = this.beamX;
    this.beam.fillGradientStyle(this.beamTint, this.beamTint, this.beamTint, this.beamTint, 0.3, 0.3, 0.06, 0.06);
    this.beam.fillRect(bx - 30, 0, 60, DESIGN_H);
    this.beam.fillStyle(this.beamTint, 0.55);
    this.beam.fillRect(bx - 4, 0, 8, DESIGN_H);
    // Reveal ring follows the robot.
    if (this.revealRing && this.revealed) {
      this.revealRing.clear();
      this.revealRing.lineStyle(4, COLORS.sun, 0.9);
      const r = this.robotPos();
      this.revealRing.strokeCircle(r.x, r.y - 20, 50);
    }

    // Paris drift: the robot slowly moves through the crowd.
    if (this.def.drift) {
      const base = this.robotView.baseX;
      const nx = Phaser.Math.Clamp(base + Math.sin(this.elapsed * 0.35) * 30, 30, DESIGN_W - 30);
      this.robotView.img.x = nx;
      if (this.robotView.antenna) this.robotView.antenna.x = nx;
      if (this.robotView.eye) this.robotView.eye.x = nx + 6 * this.robotView.spot.scale;
    }

    // Tokyo shuffle: two random people swap places every ~4 s.
    if (this.def.shuffle) {
      this.shuffleTimer += dt;
      if (this.shuffleTimer >= 4) {
        this.shuffleTimer = 0;
        const others = this.people.filter((v) => !v.spot.isRobot);
        if (others.length >= 2) {
          const a = others[Math.floor(Math.random() * others.length)];
          let b = others[Math.floor(Math.random() * others.length)];
          while (b === a) b = others[Math.floor(Math.random() * others.length)];
          const ax = a.img.x;
          const ay = a.img.y;
          this.tweens.add({ targets: a.img, x: b.img.x, y: b.img.y, duration: 600, ease: 'Sine.easeInOut' });
          this.tweens.add({ targets: b.img, x: ax, y: ay, duration: 600, ease: 'Sine.easeInOut' });
        }
      }
    }

    // Idle bob: the crowd murmurs (small, peripheral — the centre stays legible).
    for (const v of this.people) {
      if (v.spot.isRobot && this.def.drift) continue;
      v.img.y = v.baseY + Math.sin(this.elapsed * 1.4 + v.baseX) * 2;
    }
  }
}
