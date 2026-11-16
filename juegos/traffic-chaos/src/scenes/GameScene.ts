// Game scene: the Times Square intersection.
// Renders the engine-free sim (src/rules/traffic.ts) and sends named actions
// back — the sim never imports Phaser, so the balance harness re-runs the
// same rules headless. Ported from Niky's Phaser 4 prototype scene
// (dana-games-juegos, niky/traffic-chaos-prototipo, src/scenes/PlayScene.ts)
// to Phaser 3 + the Dana template: no GSAP (Phaser tweens), no DOM overlay
// (Phaser containers), no window.__ handle in production (test handle only
// in the test build), saves through Bridge storage.
//
// Feel (game-feel / maximizing-game-feel / juice-vfx, applied WITHOUT
// touching the sim): hit-stop 120 ms + slow-mo 0.35x on crash, camera shake
// + flash, debris burst, floating +points, pulsing light + bouncing hand
// (visual-only onboarding), haptics, SFX on one bus with pitch jitter.
import {
  BOOST_ALL_COOLDOWN,
  BOOST_ALL_DURATION,
  BOTTOM_H,
  CONFLICT,
  CX,
  CY,
  GAME_H,
  GAME_W,
  HUD,
  HUD_H,
  LIGHT_ARROW,
  LIGHT_HIT,
  LIGHT_HOUSING,
  LIGHT_POOLS,
  LIGHT_POS,
  PALETTE,
  PALETTE_CSS,
  PATIENCE_WARN,
  PLAY_BOTTOM,
  PLAY_TOP,
  ROAD_H,
  ROAD_V,
  STOP,
  visualContract,
} from '../config';
import { AudioEngine } from '../audio';
import { t } from '../i18n';
import { coinsForWin, levelDef, neighborhoodNameKey, starsFor } from '../levels';
import { Tutorial, type TutorialStep } from '../rules/tutorial';
import {
  boostAll,
  boostCar,
  createRun,
  debugState,
  phaseGreenFor,
  queueCount,
  seedFromDate,
  stepRun,
  timeLeft,
  toggleLights,
  type Car,
  type Dir,
  type Run,
  type RunEvent,
} from '../rules/traffic';
import { Save } from '../save';
import { COLORS, FONT_BODY, FONT_DISPLAY, makeButton } from '../ui';
import { skinColors } from './ShopScene';

const DT = 1 / 60;
const SLOWMO_SCALE = 0.35;
const HITSTOP_MS = 120;
const SLOWMO_MS = 1400;

type Mode = 'attract' | 'level';

export interface GameData {
  level: number;
  daily?: boolean;
  extraPatience?: number; // rewarded retry: +2 s patience for this attempt
}

export class GameScene extends Phaser.Scene {
  private run!: Run;
  private mode: Mode = 'attract';
  private level = 1;
  private daily = false;
  private extraPatience = 0;
  private carSprites = new Map<number, Phaser.GameObjects.Image>();
  private ringGfx!: Phaser.GameObjects.Graphics;
  // Lights: generated housing textures (one per state) + a big hit zone (the
  // housing IS the button) + a direction arrow ON the lane it controls + a
  // light pool on the road by the stop line, lit by the approach's state.
  private lightSprites: Record<Dir, Phaser.GameObjects.Image> = {} as Record<Dir, Phaser.GameObjects.Image>;
  private poolRects: Record<Dir, Phaser.GameObjects.Rectangle> = {} as Record<Dir, Phaser.GameObjects.Rectangle>;
  private lastFlipAt = -10;
  // Tutorial (forced play-gate with the official hand).
  private tutorial = new Tutorial({
    get: () => Save.data.tutorialDone,
    set: (done: boolean) => {
      Save.data.tutorialDone = done;
      void Save.write();
    },
  });
  private tutorialStep: TutorialStep = 'done';
  private tutorialHand?: Phaser.GameObjects.Image;
  private tutorialRing?: Phaser.GameObjects.Arc;
  private tutorialDots?: Phaser.GameObjects.Text;
  private tutorialArrow?: Phaser.GameObjects.Text;
  private tutorialCallout?: Phaser.GameObjects.Text;
  private tutorialPulse?: Phaser.Tweens.Tween;
  private skipButton?: Phaser.GameObjects.Container;
  private warnMarks = new Map<number, Phaser.GameObjects.Text>();
  private missionText!: Phaser.GameObjects.Text;
  private playButton?: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private quotaText!: Phaser.GameObjects.Text;
  private metaText!: Phaser.GameObjects.Text;
  private metaBar!: Phaser.GameObjects.Rectangle;
  private gridlockChip?: Phaser.GameObjects.Text;
  private boostRect!: Phaser.GameObjects.Rectangle;
  private boostText!: Phaser.GameObjects.Text;
  private pauseOverlay?: Phaser.GameObjects.Container;
  private paused = false;
  private acc = 0;
  private lastTime = 0;
  private updateCount = 0;
  private hitStopUntil = 0;
  private slowmoUntil = 0;
  private deniedFlashUntil = 0;
  private reducedMotion = false;
  private resultSent = false;
  private pointerDownAt: { x: number; y: number; t: number; carId: number | null } | null = null;

  constructor() {
    super('Game');
  }

  create(data: GameData): void {
    this.level = data.level ?? 1;
    this.daily = data.daily ?? false;
    this.extraPatience = data.extraPatience ?? 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resultSent = false;
    this.paused = false;
    this.acc = 0;
    this.lastTime = 0;
    this.add.image(0, 0, 'bg-night').setOrigin(0).setDepth(0);
    this.ringGfx = this.add.graphics().setDepth(30);
    this.buildPools();
    this.buildLights();
    this.buildHUD();
    this.buildInput();
    this.startAttract();
    document.addEventListener('visibilitychange', this.onVisibility);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      document.removeEventListener('visibilitychange', this.onVisibility);
    });
  }

  // --- Setup ---

  private buildPools(): void {
    // Light pools on the road by each stop line: the lane a light controls,
    // lit by its state (green = open, red = closed, amber = clearance).
    // The state is read on the road itself, where the player is looking.
    for (const dir of ['N', 'S', 'E', 'W'] as Dir[]) {
      const p = LIGHT_POOLS[dir];
      this.poolRects[dir] = this.add
        .rectangle(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, PALETTE.stop, 0.22)
        .setDepth(1);
    }
  }

  private buildLights(): void {
    for (const dir of ['N', 'S', 'E', 'W'] as Dir[]) {
      const pos = LIGHT_POS[dir];
      // The sprite IS the button's face — and the sprite itself is the
      // interactive object. CAREFUL: an Image's custom hit area lives in
      // FRAME space (top-left origin, the texture's real 68x168 px), NOT
      // centered local space. The rect is computed from the real frame size
      // and the display scale: it must land on exactly the 76x104 world rect
      // centered on the housing.
      const sprite = this.add
        .image(pos.x, pos.y, 'light-red')
        .setDepth(20)
        .setDisplaySize(LIGHT_HOUSING.w, LIGHT_HOUSING.h);
      const frameW = sprite.frame.width;
      const frameH = sprite.frame.height;
      const hitW = LIGHT_HIT.w / sprite.scaleX;
      const hitH = LIGHT_HIT.h / sprite.scaleY;
      sprite.setInteractive(
        new Phaser.Geom.Rectangle((frameW - hitW) / 2, (frameH - hitH) / 2, hitW, hitH),
        Phaser.Geom.Rectangle.Contains,
      );
      if (sprite.input) sprite.input.cursor = 'pointer';
      sprite.on('pointerdown', () => this.onLightTap(dir));
      this.lightSprites[dir] = sprite;
      // Direction arrow ON the lane the light controls, pointing the way
      // its cars drive: the light and its lane are visibly one thing.
      const arrowPos: Record<Dir, { x: number; y: number }> = {
        N: { x: 222, y: 348 },
        S: { x: 168, y: 512 },
        W: { x: 113, y: 458 },
        E: { x: 277, y: 402 },
      };
      this.add
        .text(arrowPos[dir].x, arrowPos[dir].y, LIGHT_ARROW[dir], {
          fontFamily: FONT_BODY,
          fontSize: '16px',
          color: '#f8fafc',
        })
        .setOrigin(0.5)
        .setAlpha(0.85)
        .setDepth(20);
    }
  }

  private buildHUD(): void {
    const style = { fontFamily: FONT_DISPLAY, fontSize: '20px', color: '#f8fafc' } as const;
    this.scoreText = this.add.text(HUD.score.x, HUD.score.y, '0', style).setDepth(40);
    this.timerText = this.add
      .text(HUD.timer.x, HUD.timer.y, '60', { ...style, fontSize: '22px' })
      .setOrigin(0.5, 0)
      .setDepth(40);
    this.quotaText = this.add
      .text(HUD.quota.x, HUD.quota.y, '0/20', style)
      .setOrigin(1, 0)
      .setDepth(40);
    // Mission chip (always visible, icons + numbers only): clear N cars in
    // 60 s. The HUD quota/timer are the scoreboard; this is the mission.
    this.missionText = this.add
      .text(GAME_W / 2, 40, '', {
        fontFamily: FONT_BODY,
        fontSize: '13px',
        color: '#f8fafc',
        fontStyle: '700',
      })
      .setOrigin(0.5, 0)
      .setDepth(40);
    // Meta strip: visible goal from day 1 (demand report §6) — the city is
    // the progression: the current neighborhood is filled.
    const nb = levelDef(this.level).neighborhood;
    const meta =
      nb === 'times-square'
        ? '● TIMES SQUARE  →  ○ BROOKLYN BRIDGE  →  ○ CENTRAL PARK'
        : nb === 'brooklyn-bridge'
          ? '○ TIMES SQUARE  →  ● BROOKLYN BRIDGE  →  ○ CENTRAL PARK'
          : '○ TIMES SQUARE  →  ○ BROOKLYN BRIDGE  →  ● CENTRAL PARK';
    this.metaText = this.add
      .text(HUD.metaStrip.x, HUD.metaStrip.y, meta, {
        fontFamily: FONT_BODY,
        fontSize: '10px',
        color: '#cbd5e1',
        fontStyle: '700',
      })
      .setDepth(40);
    this.metaBar = this.add
      .rectangle(HUD.metaStrip.x, HUD.metaStrip.y + 16, 2, 3, 0x22c55e)
      .setOrigin(0, 0.5)
      .setDepth(40);
    // Gridlock warning chip (INV-2 readout): shows at 3 queued on any
    // approach, before the fail.
    this.gridlockChip = this.add
      .text(GAME_W / 2, 66, '⚠ GRIDLOCK RISK', {
        fontFamily: FONT_BODY,
        fontSize: '12px',
        color: PALETTE_CSS.warn,
        fontStyle: '700',
      })
      .setOrigin(0.5, 0)
      .setDepth(41)
      .setVisible(false);
    // Bottom bar: BOOST + pause.
    this.boostRect = this.add
      .rectangle(HUD.boostButton.x, HUD.boostButton.y, HUD.boostButton.w, HUD.boostButton.h, PALETTE.boost)
      .setOrigin(0, 0)
      .setDepth(40)
      .setInteractive({ useHandCursor: true });
    this.boostRect.on('pointerdown', () => this.onBoostButton());
    this.boostText = this.add
      .text(
        HUD.boostButton.x + HUD.boostButton.w / 2,
        HUD.boostButton.y + HUD.boostButton.h / 2,
        'BOOST 2×',
        { fontFamily: FONT_DISPLAY, fontSize: '18px', color: '#ffffff' },
      )
      .setOrigin(0.5)
      .setDepth(41);
    const pauseRect = this.add
      .rectangle(HUD.pauseButton.x, HUD.pauseButton.y, HUD.pauseButton.w, HUD.pauseButton.h, 0x334155)
      .setOrigin(0, 0)
      .setDepth(40)
      .setInteractive({ useHandCursor: true });
    pauseRect.on('pointerdown', () => this.togglePause());
    this.add
      .text(HUD.pauseButton.x + HUD.pauseButton.w / 2, HUD.pauseButton.y + HUD.pauseButton.h / 2, 'II', {
        fontFamily: FONT_DISPLAY,
        fontSize: '16px',
        color: '#f8fafc',
      })
      .setOrigin(0.5)
      .setDepth(41);
  }

  private buildInput(): void {
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      // Attract: any tap starts the level (the play button is the visual).
      if (this.mode === 'attract' && this.playButton) {
        this.startLevel();
        return;
      }
      const carId = this.carAt(p.worldX, p.worldY);
      this.pointerDownAt = { x: p.worldX, y: p.worldY, t: p.time, carId };
    });
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      const d = this.pointerDownAt;
      this.pointerDownAt = null;
      if (!d || d.carId === null || this.mode !== 'level') return;
      const dy = p.worldY - d.y;
      const dist = Math.hypot(p.worldX - d.x, dy);
      const quick = p.time - d.t < 250;
      if (dy < -40 || (quick && dist < 10)) {
        const ev = boostCar(this.run, d.carId);
        if (ev) {
          AudioEngine.click();
          this.tutorialStep = this.tutorial.onCarBoosted();
          this.refreshTutorialUI();
        }
      }
    });
    const kb = this.input.keyboard;
    if (kb) {
      kb.addCapture(['SPACE']);
      kb.on('keydown-SPACE', () => this.onLightTap());
      kb.on('keydown-B', () => this.onBoostButton());
      kb.on('keydown-P', () => this.togglePause());
      kb.on('keydown-R', () => {
        if (this.run.status !== 'playing') this.startLevel();
      });
    }
  }

  private onVisibility = (): void => {
    if (document.hidden && this.mode === 'level' && this.run.status === 'playing') {
      this.paused = true;
      this.showPauseOverlay();
    }
  };

  // --- Modes ---

  startAttract(): void {
    this.mode = 'attract';
    this.run = createRun({ seed: 1, opening: 'attract' });
    this.paused = false;
    this.clearSprites();
    this.hideTutorialUI();
    this.hidePauseOverlay();
    this.hidePlayButton();
  }

  startLevel(seed?: number): void {
    this.mode = 'level';
    const def = levelDef(this.level);
    const difficulty = { ...def.difficulty };
    if (this.extraPatience > 0) difficulty.patienceMax += this.extraPatience;
    const levelSeed = seed ?? (this.daily ? seedFromDate() : this.level * 7919 + 101);
    this.run = createRun({ seed: levelSeed, opening: 'level', difficulty });
    this.paused = false;
    this.acc = 0;
    this.clearSprites();
    this.hidePauseOverlay();
    this.hidePlayButton();
    this.tutorialStep = this.tutorial.start(this.time.now);
    this.refreshTutorialUI();
  }

  // --- Tutorial (teaches by doing, one step at a time, zero text) ---

  /** Where the hand should point right now (also exposed to the smoke probes). */
  private tutorialTargetPos(): { x: number; y: number; kind: string } | null {
    switch (this.tutorialStep) {
      case 'mission':
        return { x: GAME_W / 2, y: 40, kind: 'mission' };
      case 'light':
        return { x: LIGHT_POS.N.x, y: LIGHT_POS.N.y, kind: 'light' };
      case 'swipe': {
        const car = this.tutorialSwipeCar();
        return car ? { x: car.x, y: car.y, kind: 'swipe' } : { x: CX, y: CY, kind: 'swipe-wait' };
      }
      case 'boost':
        return { x: HUD.boostButton.x + HUD.boostButton.w / 2, y: HUD.boostButton.y + HUD.boostButton.h / 2, kind: 'boost' };
      default:
        return null;
    }
  }

  /** The car the swipe step wants: the most impatient stopped car, else any car. */
  private tutorialSwipeCar(): Car | null {
    const stopped = this.run.cars
      .filter((c) => c.state === 'stopped')
      .sort((a, b) => a.patience - b.patience)[0];
    if (stopped) return stopped;
    return this.run.cars.find((c) => c.state === 'driving') ?? this.run.cars[0] ?? null;
  }

  private refreshTutorialUI(): void {
    this.hideTutorialUI();
    if (this.tutorialStep === 'done' || this.mode !== 'level') return;
    // Step dots (bottom center): which of the 3 actions is this.
    const dots = { mission: '● ○ ○', light: '● ○ ○', swipe: '● ● ○', boost: '● ● ●' } as const;
    this.tutorialDots = this.add
      .text(GAME_W / 2, PLAY_BOTTOM + 8, dots[this.tutorialStep], {
        fontFamily: FONT_BODY,
        fontSize: '11px',
        color: '#cbd5e1',
      })
      .setOrigin(0.5, 0)
      .setAlpha(0.8)
      .setDepth(46);
    // SKIP (top right, always during the tutorial).
    const skipRect = this.add.rectangle(0, 0, 64, 26, 0x1e293b, 0.9);
    const skipText = this.add
      .text(0, 0, 'SKIP »', { fontFamily: FONT_BODY, fontSize: '12px', color: '#f8fafc', fontStyle: '700' })
      .setOrigin(0.5);
    this.skipButton = this.add
      .container(GAME_W - 110, 27, [skipRect, skipText])
      .setDepth(46)
      .setInteractive(
        // Container-local space: the rect child spans -32..32 x, -13..13 y.
        new Phaser.Geom.Rectangle(-32, -13, 64, 26),
        Phaser.Geom.Rectangle.Contains,
      );
    this.skipButton.on('pointerdown', () => {
      this.tutorialStep = this.tutorial.onSkip();
      this.hideTutorialUI();
    });
    // The official hand + a pulsing ring on the target.
    const target = this.tutorialTargetPos();
    if (!target) return;
    const handPos =
      this.tutorialStep === 'mission'
        ? { x: target.x, y: target.y + 42 }
        : this.tutorialStep === 'boost'
          ? { x: target.x, y: target.y - 52 }
          : { x: target.x, y: target.y - 56 };
    this.tutorialHand = this.add
      .image(handPos.x, handPos.y, 'hand')
      .setDisplaySize(56, 56)
      .setDepth(46);
    this.tweens.add({
      targets: this.tutorialHand,
      y: handPos.y - 10,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inout',
    });
    if (this.tutorialStep !== 'mission') {
      this.tutorialRing = this.add
        .circle(target.x, target.y, 30, 0xffffff, 0)
        .setStrokeStyle(3, 0xfacc15, 0.95)
        .setDepth(45);
      this.tweens.add({
        targets: this.tutorialRing,
        scale: 1.25,
        alpha: 0.45,
        duration: 450,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inout',
      });
    }
    if (this.tutorialStep === 'mission') {
      // The mission chip itself pulses while the hand points at it.
      this.tweens.add({
        targets: this.missionText,
        scale: 1.12,
        duration: 450,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inout',
      });
    }
    if (this.tutorialStep === 'light') {
      // The N light itself pulses (the housing is the button). The sprite's
      // base scale is 0.5 (68x168 texture -> 34x84 display); pulse from there.
      // Mockup callout above the light: "TAP THE LIGHT!"
      this.tutorialCallout = this.add
        .text(LIGHT_POS.N.x, LIGHT_POS.N.y - 66, t('tapTheLight'), {
          fontFamily: FONT_DISPLAY,
          fontSize: '16px',
          color: '#ffffff',
          stroke: '#141414',
          strokeThickness: 5,
        })
        .setOrigin(0.5)
        .setDepth(46);
      this.tutorialPulse = this.tweens.add({
        targets: this.lightSprites.N,
        scaleX: 0.56,
        scaleY: 0.56,
        duration: 450,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inout',
      });
    }
    if (this.tutorialStep === 'swipe') {
      this.tutorialArrow = this.add
        .text(target.x, target.y - 70, '↑', {
          fontFamily: FONT_BODY,
          fontSize: '26px',
          color: '#22c55e',
          fontStyle: '700',
        })
        .setOrigin(0.5)
        .setDepth(46);
      this.tweens.add({
        targets: this.tutorialArrow,
        y: target.y - 82,
        duration: 450,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inout',
      });
    }
  }

  private hideTutorialUI(): void {
    this.tutorialPulse?.stop();
    this.tutorialPulse = undefined;
    this.tweens.killTweensOf(this.missionText);
    this.missionText.setScale(1);
    this.tutorialHand?.destroy();
    this.tutorialHand = undefined;
    this.tutorialRing?.destroy();
    this.tutorialRing = undefined;
    this.tutorialDots?.destroy();
    this.tutorialDots = undefined;
    this.tutorialArrow?.destroy();
    this.tutorialArrow = undefined;
    this.tutorialCallout?.destroy();
    this.tutorialCallout = undefined;
    this.skipButton?.destroy();
    this.skipButton = undefined;
  }

  /** During the swipe step the hand + arrow follow the target car. */
  private updateTutorialHand(): void {
    if (this.tutorialStep !== 'swipe' || !this.tutorialHand) return;
    const car = this.tutorialSwipeCar();
    const target = this.tutorialTargetPos();
    if (!target) return;
    this.tutorialHand.setPosition(target.x, target.y - 56);
    if (this.tutorialArrow && car) this.tutorialArrow.setPosition(car.x, car.y - 70);
    if (this.tutorialRing) this.tutorialRing.setPosition(target.x, target.y);
  }

  private showPlayButton(): void {
    this.hidePlayButton();
    this.playButton = this.add
      .text(GAME_W / 2, GAME_H / 2, '▶', { fontSize: '64px', color: '#22c55e' })
      .setOrigin(0.5)
      .setDepth(50);
    this.tweens.add({
      targets: this.playButton,
      scale: 1.15,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inout',
    });
    // No Zone: the tap is handled by the scene-level pointerdown (a Zone's
    // setInteractive() did not receive the event reliably in this build).
  }

  private hidePlayButton(): void {
    this.playButton?.destroy();
    this.playButton = undefined;
  }

  // --- Actions ---

  private onLightTap(dir?: Dir): void {
    if (this.mode !== 'level' || this.paused) return;
    if (this.run.status !== 'playing') return;
    const ev = toggleLights(this.run);
    if (ev?.type === 'toggle') {
      // The pair swaps: the closed one opens, the open one closes — one tap,
      // one change, always one green and one red (Daniel 15/11 20:39).
      AudioEngine.click();
      this.vibrate(10);
      this.lastFlipAt = this.time.now;
      // The tapped housing sinks 2 px and bounces back (the button IS the light).
      const sprite = dir ? this.lightSprites[dir] : undefined;
      if (sprite) {
        this.tweens.add({ targets: sprite, y: sprite.y + 2, duration: 70, yoyo: true, ease: 'quad.out' });
      }
      this.tutorialStep = this.tutorial.onLightTapped();
      this.refreshTutorialUI();
    } else if (ev?.type === 'toggle-denied') {
      // Mashing guard readout (INV-3): the lights flash grey on a denied tap.
      this.deniedFlashUntil = this.time.now + 150;
    }
  }

  private onBoostButton(): void {
    if (this.mode !== 'level' || this.paused) return;
    if (this.run.status !== 'playing') return;
    const ev = boostAll(this.run);
    if (ev) {
      AudioEngine.whoosh();
      this.vibrate(15);
      this.tweens.add({ targets: this.boostText, scale: 1.18, duration: 120, yoyo: true, ease: 'quad.out' });
      this.tutorialStep = this.tutorial.onBoostAll();
      this.refreshTutorialUI();
    }
  }

  private togglePause(): void {
    if (this.mode !== 'level') return;
    this.paused = !this.paused;
    if (this.paused) this.showPauseOverlay();
    else this.hidePauseOverlay();
  }

  /** Called by main.ts when the platform pauses the game (tab switch, ad). */
  pauseGame(): void {
    if (this.mode !== 'level' || this.run.status !== 'playing') return;
    if (!this.paused) {
      this.paused = true;
      this.showPauseOverlay();
    }
  }

  private showPauseOverlay(): void {
    this.hidePauseOverlay();
    const dim = this.add.rectangle(0, 0, GAME_W, GAME_H, 0x0f172a, 0.6).setOrigin(0);
    const card = this.add.graphics();
    card.fillStyle(COLORS.cream, 1);
    card.fillRoundedRect(GAME_W / 2 - 140, 300, 280, 260, 24);
    card.lineStyle(4, 0x141414, 1);
    card.strokeRoundedRect(GAME_W / 2 - 140, 300, 280, 260, 24);
    const title = this.add
      .text(GAME_W / 2, 340, t('pause'), { fontFamily: FONT_DISPLAY, fontSize: '30px', color: COLORS.inkCss })
      .setOrigin(0.5);
    const resume = makeButton(this, GAME_W / 2, 420, {
      w: 220, h: 56, label: t('resume'), fontSize: 22, color: COLORS.leaf, onClick: () => this.togglePause(),
    });
    const restart = makeButton(this, GAME_W / 2, 486, {
      w: 220, h: 52, label: t('restart'), fontSize: 20, color: COLORS.boost, onClick: () => this.startLevel(),
    });
    const quit = makeButton(this, GAME_W / 2, 542, {
      w: 220, h: 52, label: t('quit'), fontSize: 20, color: COLORS.coral, onClick: () => this.scene.start('Menu'),
    });
    this.pauseOverlay = this.add.container(0, 0, [dim, card, title, resume, restart, quit]).setDepth(60);
  }

  private hidePauseOverlay(): void {
    this.pauseOverlay?.destroy();
    this.pauseOverlay = undefined;
  }

  // --- Loop (fixed timestep 1/60, physics-tuning) ---

  update(time: number, delta: number): void {
    this.updateCount++;
    if (this.paused) {
      this.lastTime = time;
      return;
    }
    if (time < this.hitStopUntil) {
      this.lastTime = time;
      return; // hit-stop: freeze everything briefly
    }
    // Practice sandbox: while the tutorial is active the level cannot end
    // and patience does not drain (Daniel 15/11 20:37: level 1 forgiving,
    // learn in seconds, one decision at a time). Synced here, before the
    // sim steps, so it takes effect on this very frame.
    if (this.mode === 'level' && this.run) this.run.practice = this.tutorialStep !== 'done';
    // Wall-clock dt, NOT the smoothed `delta` param: when rAF is throttled
    // (headless / software rendering) the smoothed delta stays near 16.7 ms
    // while frames are actually ~80 ms apart, which would slow the sim to
    // ~0.2x real time. The `time` param is real elapsed ms, so the sim keeps
    // real time and the fixed-step accumulator just catches up.
    const rawDt = this.lastTime === 0 ? 0 : (time - this.lastTime) / 1000;
    this.lastTime = time;
    const scale = time < this.slowmoUntil ? SLOWMO_SCALE : 1;
    this.acc += Math.min(rawDt, 0.25) * scale;
    let guard = 0;
    while (this.acc >= DT && guard++ < 20) {
      this.acc -= DT;
      this.stepSim();
    }
    if (guard >= 20) this.acc = 0; // drop backlog rather than spiral
    // Tutorial beat: the mission step auto-advances after 2.5 s.
    if (this.mode === 'level') {
      const prev = this.tutorialStep;
      this.tutorialStep = this.tutorial.tick(this.time.now);
      if (this.tutorialStep !== prev) this.refreshTutorialUI();
      this.updateTutorialHand();
    }
    this.syncSprites();
    this.updateLights();
    this.updateRings();
    this.updateHUD();
    void delta;
  }

  private stepSim(): void {
    const events = stepRun(this.run, DT);
    for (const e of events) this.handleEvent(e);
  }

  private handleEvent(e: RunEvent): void {
    switch (e.type) {
      case 'cleared': {
        AudioEngine.clear();
        this.floatText(`+${e.points}`, e.car.x, e.car.y - 20, PALETTE_CSS.go);
        // Satisfaction on every clear: the score pops + a green ring at the exit.
        this.tweens.add({
          targets: this.scoreText,
          scale: this.run.clears % 5 === 0 ? 1.4 : 1.25,
          duration: 150,
          yoyo: true,
          ease: 'quad.out',
        });
        this.pulseRing(e.car.x, e.car.y, PALETTE.go, 50);
        break;
      }
      case 'close-call': {
        AudioEngine.ding();
        this.floatText(`+${e.points} ${t('closeCall')}`, e.car.x, e.car.y - 34, PALETTE_CSS.warn);
        // Tension on a near-miss: 60 ms hit-stop + a small zoom punch.
        this.hitStopUntil = Math.max(this.hitStopUntil, this.time.now + 60);
        if (!this.reducedMotion) {
          this.cameras.main.zoomTo(1.03, 80);
          this.time.delayedCall(160, () => this.cameras.main.zoomTo(1, 200));
        }
        break;
      }
      case 'honk':
        AudioEngine.honk();
        break;
      case 'ambulance-warning': {
        AudioEngine.siren();
        const pos =
          e.dir === 'N'
            ? { x: GAME_W / 2, y: PLAY_TOP + 18 }
            : e.dir === 'S'
              ? { x: GAME_W / 2, y: PLAY_BOTTOM - 18 }
              : e.dir === 'W'
                ? { x: 22, y: CY }
                : { x: GAME_W - 22, y: CY };
        const icon = this.add.text(pos.x, pos.y, '🚑', { fontSize: '26px' }).setOrigin(0.5).setDepth(44);
        this.tweens.add({ targets: icon, alpha: 0.2, duration: 200, yoyo: true, repeat: 9 });
        this.time.delayedCall(2000, () => icon.destroy());
        break;
      }
      case 'crash': {
        AudioEngine.crash();
        this.vibrate([40, 60, 40]);
        this.hitStopUntil = this.time.now + HITSTOP_MS;
        this.slowmoUntil = this.time.now + HITSTOP_MS + SLOWMO_MS;
        if (!this.reducedMotion) this.cameras.main.shake(350, 0.012);
        this.cameras.main.flash(160, 255, 255, 255);
        // Impact: zoom punch + an expanding ring at the crash point.
        if (!this.reducedMotion) {
          this.cameras.main.zoomTo(1.06, 120);
          this.time.delayedCall(260, () => this.cameras.main.zoomTo(1, 300));
        }
        this.pulseRing(e.x, e.y, PALETTE.stop, 90);
        this.debrisBurst(e.x, e.y);
        this.time.delayedCall(HITSTOP_MS + SLOWMO_MS + 300, () => {
          if (this.mode === 'attract') this.showPlayButton();
          else this.goToResult('crash');
        });
        break;
      }
      case 'gridlock': {
        AudioEngine.fail();
        this.time.delayedCall(400, () => this.goToResult('gridlock'));
        break;
      }
      case 'level-end': {
        if (e.won) {
          AudioEngine.win();
          this.confetti();
          this.time.delayedCall(900, () => this.goToResult('win'));
        } else {
          AudioEngine.fail();
          this.time.delayedCall(400, () => this.goToResult('time'));
        }
        break;
      }
      default:
        break;
    }
  }

  /** Persist the result and hand over to the Result scene (once only). */
  private goToResult(kind: 'crash' | 'gridlock' | 'win' | 'time'): void {
    if (this.resultSent) return;
    this.resultSent = true;
    this.hideTutorialUI();
    const win = kind === 'win';
    const stars = win ? starsFor(this.level, this.run.clears) : 0;
    const coinsEarned = win ? coinsForWin(stars, this.daily) : 0;
    if (win) {
      Save.data.wins += 1;
      Save.data.coins += coinsEarned;
      Save.data.stars[this.level] = Math.max(Save.data.stars[this.level] ?? 0, stars);
      Save.data.bestScore[this.level] = Math.max(Save.data.bestScore[this.level] ?? 0, this.run.score);
      if (!this.daily && this.level === Save.data.unlocked && this.level < 30) {
        Save.data.unlocked = this.level + 1;
      }
      if (this.daily) Save.markDailyDone();
      void Save.write();
    }
    this.scene.start('Result', {
      level: this.level,
      win,
      kind,
      stars,
      coinsEarned,
      clears: this.run.clears,
      quota: this.run.difficulty.quota,
      score: this.run.score,
      daily: this.daily,
    });
  }

  // --- Rendering ---

  private carAt(x: number, y: number): number | null {
    for (const car of this.run.cars) {
      if (car.state === 'crashed' || car.state === 'done') continue;
      if (Math.abs(x - car.x) <= car.w / 2 + 6 && Math.abs(y - car.y) <= car.h / 2 + 6) {
        return car.id;
      }
    }
    return null;
  }

  private syncSprites(): void {
    const seen = new Set<number>();
    const palette = skinColors();
    for (const car of this.run.cars) {
      if (car.state === 'done') continue;
      seen.add(car.id);
      let sprite = this.carSprites.get(car.id);
      if (!sprite) {
        sprite = this.add.image(car.x, car.y, car.type).setDepth(10);
        this.carSprites.set(car.id, sprite);
      }
      sprite.setPosition(car.x, car.y).setAngle(car.angle);
      // Skin: generic cars take the equipped garage palette (id-based, so a
      // car keeps its colour for its whole run); taxis/buses/ambulances keep
      // their identity colours. Boosted cars glow blue; reckless cars shake.
      const boosted = this.run.time < car.boostedUntil || this.run.time < this.run.globalBoostUntil;
      if (boosted) {
        sprite.setTint(0x60a5fa);
      } else if (car.type === 'car') {
        sprite.setTint(palette[car.id % palette.length]);
      } else {
        sprite.clearTint();
      }
      if (car.state === 'reckless') {
        sprite.setPosition(car.x + Phaser.Math.Between(-1, 1), car.y + Phaser.Math.Between(-1, 1));
      }
      // Impatient stopped cars tremble (patience <= 3): the car itself warns
      // you, before the ring and the "!" do.
      if (car.state === 'stopped' && car.patience <= PATIENCE_WARN) {
        sprite.setPosition(car.x + Phaser.Math.Between(-1, 1), car.y + Phaser.Math.Between(-1, 1));
      }
      if (car.state === 'crashed') sprite.setAlpha(0.85);
    }
    for (const [id, sprite] of this.carSprites) {
      if (!seen.has(id)) {
        sprite.destroy();
        this.carSprites.delete(id);
      }
    }
  }

  private clearSprites(): void {
    for (const sprite of this.carSprites.values()) sprite.destroy();
    this.carSprites.clear();
    for (const mark of this.warnMarks.values()) mark.destroy();
    this.warnMarks.clear();
  }

  private updateLights(): void {
    const inClearance = this.run.time < this.run.clearanceUntil;
    const denied = this.time.now < this.deniedFlashUntil;
    const now = this.time.now;
    for (const dir of ['N', 'S', 'E', 'W'] as Dir[]) {
      const sprite = this.lightSprites[dir];
      if (denied) {
        sprite.setTint(0x64748b);
      } else {
        sprite.clearTint();
        // One lit lens at a time (the sprite IS the state — no code-drawn lens).
        sprite.setTexture(inClearance ? 'light-amber' : phaseGreenFor(this.run, dir) ? 'light-green' : 'light-red');
      }
      // Light pool on the road: the lane's state, read where the player looks.
      // Green = this lane is open, red = closed, amber = clearance.
      const pool = this.poolRects[dir];
      const green = phaseGreenFor(this.run, dir);
      pool.setFillStyle(inClearance ? PALETTE.warn : green ? PALETTE.go : PALETTE.stop);
      let alpha = 0.22;
      // The lane that just opened flashes brighter for 0.6 s after a flip.
      if (green && now - this.lastFlipAt < 600) alpha = 0.45;
      // During the light step the N lane pulses so the player sees the link.
      if (this.tutorialStep === 'light' && dir === 'N') {
        alpha = 0.3 + 0.2 * Math.sin(now / 200);
      }
      pool.setAlpha(alpha);
    }
  }

  private updateRings(): void {
    const g = this.ringGfx;
    g.clear();
    if (this.mode !== 'level') return;
    const patienceMax = this.run.difficulty.patienceMax;
    const seen = new Set<number>();
    for (const car of this.run.cars) {
      if (car.state !== 'stopped' || car.patience >= patienceMax) continue;
      seen.add(car.id);
      const k = car.patience / patienceMax;
      const color = k > 0.375 ? PALETTE.go : k > 0.125 ? PALETTE.warn : PALETTE.stop;
      const r = Math.max(car.w, car.h) / 2 + 9;
      g.lineStyle(3, color, 0.95);
      g.beginPath();
      g.arc(car.x, car.y, r, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-90 + 360 * k));
      g.strokePath();
      // Pulse red when the driver is about to snap.
      if (k <= 0.125) {
        g.lineStyle(2, PALETTE.stop, 0.5 + 0.5 * Math.sin(this.time.now / 90));
        g.strokeCircle(car.x, car.y, r + 4);
      }
      // "!" above an impatient car (attack-tell): the warning is a gesture,
      // not just a color — a player who cannot read the ring still sees it.
      if (car.patience <= PATIENCE_WARN) {
        let mark = this.warnMarks.get(car.id);
        if (!mark) {
          mark = this.add
            .text(car.x, car.y - r - 16, '!', {
              fontFamily: FONT_BODY,
              fontSize: '20px',
              fontStyle: 'bold',
              color: '#ef4444',
            })
            .setOrigin(0.5)
            .setDepth(31);
          this.warnMarks.set(car.id, mark);
        }
        mark.setPosition(car.x, car.y - r - 16 + Math.sin(this.time.now / 120) * 2).setVisible(true);
      }
    }
    for (const [id, mark] of this.warnMarks) {
      if (!seen.has(id)) {
        mark.destroy();
        this.warnMarks.delete(id);
      }
    }
  }

  private updateHUD(): void {
    if (this.mode === 'attract') {
      this.scoreText.setText('');
      this.timerText.setText('');
      this.quotaText.setText('');
      this.missionText.setText('');
      this.metaBar.width = 2;
      this.gridlockChip?.setVisible(false);
      return;
    }
    const quota = this.run.difficulty.quota;
    this.scoreText.setText(String(this.run.score));
    this.timerText.setText(String(Math.ceil(timeLeft(this.run))));
    this.timerText.setColor(timeLeft(this.run) <= 10 ? PALETTE_CSS.stop : '#f8fafc');
    this.quotaText.setText(`${Math.min(this.run.clears, quota)}/${quota}`);
    // Mission chip: the goal, always visible, icons + numbers only.
    this.missionText.setText(`🎯 ${Math.min(this.run.clears, quota)}/${quota} 🚗 · ⏱ ${Math.ceil(timeLeft(this.run))}s`);
    const w = Math.min(1, this.run.clears / quota) * (HUD.metaStrip.w - 40);
    this.metaBar.width = Math.max(2, w);
    // Gridlock warning at 3 queued on any approach (INV-2 readout).
    const maxQueue = Math.max(
      queueCount(this.run, 'N'),
      queueCount(this.run, 'S'),
      queueCount(this.run, 'E'),
      queueCount(this.run, 'W'),
    );
    this.gridlockChip?.setVisible(this.run.status === 'playing' && maxQueue >= 3);
    // BOOST button state.
    const cooling = this.run.time < this.run.globalBoostCooldownUntil;
    const active = this.run.time < this.run.globalBoostUntil;
    this.boostRect.setFillStyle(active ? 0x2563eb : cooling ? 0x475569 : PALETTE.boost);
    if (cooling && !active) {
      this.boostText.setText(`BOOST ${Math.ceil(this.run.globalBoostCooldownUntil - this.run.time)}s`);
    } else {
      this.boostText.setText('BOOST 2×');
    }
  }

  private floatText(text: string, x: number, y: number, color: string): void {
    const t = this.add
      .text(x, y, text, { fontFamily: FONT_BODY, fontSize: '16px', color, fontStyle: '700' })
      .setOrigin(0.5)
      .setDepth(42);
    this.tweens.add({
      targets: t,
      y: y - 24,
      alpha: 0,
      duration: 800,
      ease: 'quad.out',
      onComplete: () => t.destroy(),
    });
  }

  /** Expanding ring at an event point (clear = green, crash = red). */
  private pulseRing(x: number, y: number, color: number, maxR: number): void {
    if (this.reducedMotion) return;
    const ring = this.add.circle(x, y, 8, 0xffffff, 0).setStrokeStyle(3, color, 0.95).setDepth(35);
    this.tweens.add({
      targets: ring,
      scale: maxR / 8,
      alpha: 0,
      duration: 400,
      ease: 'quad.out',
      onComplete: () => ring.destroy(),
    });
  }

  private debrisBurst(x: number, y: number): void {
    const colors = [0xef4444, 0xf59e0b, 0x94a3b8, 0x1e293b, 0xfacc15];
    for (let i = 0; i < 24; i++) {
      const d = this.add
        .rectangle(x, y, Phaser.Math.Between(4, 10), Phaser.Math.Between(4, 10), colors[i % colors.length])
        .setDepth(35);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(30, 90);
      this.tweens.add({
        targets: d,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        angle: Phaser.Math.Between(-260, 260),
        alpha: 0,
        duration: Phaser.Math.Between(500, 1000),
        ease: 'quad.out',
        onComplete: () => d.destroy(),
      });
    }
  }

  private confetti(): void {
    const colors = [0x22c55e, 0x3b82f6, 0xfacc15, 0xf472b6, 0x34d399];
    for (let i = 0; i < 40; i++) {
      const c = this.add
        .rectangle(Phaser.Math.Between(10, GAME_W - 10), -10, 8, 8, colors[i % colors.length])
        .setDepth(35);
      this.tweens.add({
        targets: c,
        y: GAME_H + 20,
        x: c.x + Phaser.Math.Between(-60, 60),
        angle: Phaser.Math.Between(-360, 360),
        duration: Phaser.Math.Between(900, 1600),
        ease: 'quad.in',
        onComplete: () => c.destroy(),
      });
    }
  }

  // --- Helpers ---

  private vibrate(pattern: number | number[]): void {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Haptics are optional.
    }
  }

  // --- Test handle (test build only; see testhandle.ts) ---

  /** State snapshot for the probing harness. */
  testGetState(): Record<string, unknown> {
    return {
      mode: this.mode,
      level: this.level,
      daily: this.daily,
      run: debugState(this.run),
      // The auto-player needs the live cars + phase to decide flips.
      cars: this.run.cars.map((c) => ({
        id: c.id,
        dir: c.dir,
        type: c.type,
        state: c.state,
        patience: +c.patience.toFixed(2),
        travel: Math.round(c.travel),
        x: Math.round(c.x),
        y: Math.round(c.y),
      })),
      phase: this.run.phase,
      time: +this.run.time.toFixed(2),
      clearanceUntil: this.run.clearanceUntil,
      globalBoostCooldownUntil: this.run.globalBoostCooldownUntil,
      tutorialStep: this.tutorialStep,
      paused: this.paused,
      lights: (['N', 'S', 'E', 'W'] as Dir[]).map((dir) => ({
        dir,
        x: LIGHT_POS[dir].x,
        y: LIGHT_POS[dir].y,
        w: LIGHT_HIT.w,
        h: LIGHT_HIT.h,
        texture: this.lightSprites[dir]?.texture.key ?? null,
        green: phaseGreenFor(this.run, dir),
      })),
      visualContract: visualContract(),
    };
  }

  testStartLevel(level: number): void {
    this.level = level;
    this.daily = false;
    this.startLevel();
  }

  testToggle(): void {
    this.onLightTap();
  }

  testBoostAll(): void {
    this.onBoostButton();
  }

  testBoostCar(id: number): void {
    boostCar(this.run, id);
  }

  testSetTimeScale(scale: number): void {
    this.time.timeScale = scale;
  }
}
