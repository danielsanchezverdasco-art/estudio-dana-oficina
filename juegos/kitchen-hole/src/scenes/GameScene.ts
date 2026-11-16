// Game: drag a black hole around a top-down kitchen and swallow everything
// that fits — crumbs to fridge. One finger, one verb, understood in under
// 10 seconds. Pure logic (src/rules.ts) stepped with delta time; the scene
// only renders the sim and turns its events into juice. Design 390x844
// (camera zooms to fit). States: playing -> won/lost/paused.
// Win = eat EVERYTHING in the kitchen before the timer ends (CLEANUP).
// Stars: 3 = 15+ s left AND all goldens eaten; 2 = 5+ s; 1 = win.
// The pet steals coins (score threat, never a win threat); goldens are a
// side objective for 3 stars (they never block the win).
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { t } from '../i18n';
import { drawFloor, drawHole, drawShadow, floorKey, textureFor, type KitchenName } from '../kitchen';
import { getLevel, LEVEL_COUNT, planRoute, type KitchenLevel } from '../levels';
import { createSim, KIND_STATS, sizeOf, stepSim, type HoleSim, type RuleEvent } from '../rules';
import { Save } from '../save';
import { SKINS } from '../skins';
import { COLORS, bodyStyle, headingStyle, juice, makeButton, makeIconButton } from '../ui';

const DESIGN_W = 390;
const DESIGN_H = 844;

/** Teaching hint per level (onboarding-and-teaching: one line, zero
 * reading beyond the level itself). Only on the level where a mechanic
 * first appears. */
const HINTS: Record<number, string> = {
  6: 'hintPet',
  11: 'hintGolden',
  16: 'hintMover',
  21: 'hintFridge',
};

interface GameData {
  level: number;
  daily?: boolean;
  extraTime?: boolean;
}

interface ObjView {
  img: Phaser.GameObjects.Image;
  sparkle: Phaser.GameObjects.Image | null;
  wobbleAt: number;
}

export class GameScene extends Phaser.Scene {
  private level!: KitchenLevel;
  private levelN = 1;
  private daily = false;
  private state: 'playing' | 'won' | 'lost' | 'paused' = 'playing';
  private prevState: 'playing' = 'playing';
  private sim!: HoleSim;
  private timeScale = 1;
  private target: { x: number; y: number } | null = null;
  private dragging = false;
  private holeGfx!: Phaser.GameObjects.Graphics;
  private shadowGfx!: Phaser.GameObjects.Graphics;
  private views: ObjView[] = [];
  private petImg: Phaser.GameObjects.Image | null = null;
  private petName: Phaser.GameObjects.Text | null = null;
  private hud: Phaser.GameObjects.GameObject[] = [];
  private coinsText!: Phaser.GameObjects.Text;
  private coinsPill!: Phaser.GameObjects.Container;
  private timerText!: Phaser.GameObjects.Text;
  private sizeBarGfx!: Phaser.GameObjects.Graphics;
  private sizeText!: Phaser.GameObjects.Text;
  private leftText!: Phaser.GameObjects.Text;
  private tutorial: Phaser.GameObjects.GameObject[] = [];
  private ghostGfx: Phaser.GameObjects.Graphics | null = null;
  private handImg: Phaser.GameObjects.Image | null = null;
  private tutorialDone = false;
  private hintText: Phaser.GameObjects.Text | null = null;
  private pausedOverlay: Phaser.GameObjects.GameObject[] = [];
  private wonAt = 0;
  private skinRim = 0x7c3aed;
  private skinRimLight = 0xa78bfa;

  constructor() {
    super('Game');
  }

  create(data: GameData): void {
    this.levelN = data.level || 1;
    this.level = getLevel(this.levelN);
    this.daily = !!data.daily;
    this.state = 'playing';
    this.target = null;
    this.dragging = false;
    this.timeScale = 1;
    this.tutorialDone = false;
    this.views = [];
    this.petImg = null;
    const skin = SKINS.find((s) => s.id === Save.data.shop.skin) ?? SKINS[0];
    this.skinRim = skin.rim;
    this.skinRimLight = skin.rimLight;

    const rules = {
      timeLimit: this.level.timeLimit + (data.extraTime ? 15 : 0),
      startRadius: 13,
      objects: this.level.objects,
      pet: this.level.pet,
      goldenSpawns: this.level.goldenSpawns,
    };
    if (data.extraTime && Save.data.shop.extraTime > 0) {
      Save.data.shop.extraTime -= 1;
      void Save.write();
    }
    this.sim = createSim(rules, this.level.start);

    this.buildWorld();
    this.buildHUD();
    this.buildTutorial();

    // Input: one verb — drag. The hole chases the finger; on release it stops.
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.state !== 'playing') return;
      this.dragging = true;
      this.target = { x: p.x, y: p.y };
      AudioEngine.unlock();
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.state !== 'playing' || !this.dragging) return;
      this.target = { x: p.x, y: p.y };
    });
    this.input.on('pointerup', () => {
      this.dragging = false;
      this.target = null;
    });
    this.input.on('pointerupoutside', () => {
      this.dragging = false;
      this.target = null;
    });
  }

  // ---------- world ----------

  private buildWorld(): void {
    const floor = this.add.graphics().setDepth(0);
    drawFloor(floor, floorKey(this.level.kitchen), DESIGN_W, DESIGN_H);

    // Dana Games stamp: the purple octopus mascot hides in every game.
    // Tapping it makes it wiggle (a cameo, never a mechanic).
    const octo = this.add.image(332, 806, 'kh-octopus').setDepth(1).setDisplaySize(36, 36).setAlpha(0.9);
    octo.setInteractive({ useHandCursor: true });
    octo.on('pointerdown', () => {
      this.tweens.add({ targets: octo, angle: 12, duration: 90, yoyo: true, repeat: 3 });
      AudioEngine.pop();
    });

    this.shadowGfx = this.add.graphics().setDepth(1);
    for (const o of this.sim.objects) {
      const stats = KIND_STATS[o.def.kind];
      const img = this.add.image(o.x, o.y, textureFor(o.def.kind)).setDepth(2);
      img.setDisplaySize(stats.r * 2, stats.r * 2);
      const sparkle = o.def.golden
        ? this.add.image(o.x, o.y - stats.r, 'kh-sparkle').setDepth(3).setDisplaySize(20, 20)
        : null;
      this.views.push({ img, sparkle, wobbleAt: 0 });
    }
    if (this.sim.pet) {
      const key = this.sim.pet.def.kind === 'cat' ? 'kh-cat' : 'kh-dog';
      this.petImg = this.add.image(this.sim.pet.x, this.sim.pet.y, key).setDepth(3);
      this.petImg.setDisplaySize(52, 52);
      this.petName = this.add
        .text(this.sim.pet.x, this.sim.pet.y - 34, this.sim.pet.def.kind === 'cat' ? t('cat') : t('dog'), bodyStyle(13, '#ffffff'))
        .setOrigin(0.5)
        .setDepth(3);
    }
    this.holeGfx = this.add.graphics().setDepth(4);
  }

  // ---------- HUD ----------

  private buildHUD(): void {
    // Top row: LEVEL bubble (left), TIMER (centre), coins pill + pause (right).
    const bubble = this.add.circle(38, 34, 26, 0x141414, 0.85).setDepth(10);
    const levelLabel = this.add
      .text(38, 34, `${this.levelN}`, headingStyle(22, '#ffffff'))
      .setOrigin(0.5)
      .setDepth(11);
    this.timerText = this.add
      .text(182, 34, this.fmtTime(this.sim.timeLeft), headingStyle(22, '#ffffff'))
      .setOrigin(0.5)
      .setDepth(11);
    const pill = this.add.container(268, 34).setDepth(10);
    const pillBg = this.add.graphics();
    pillBg.fillStyle(0x141414, 0.85);
    pillBg.fillRoundedRect(-48, -20, 96, 40, 20);
    const coinIcon = this.add.image(-30, 0, 'kh-coin').setDisplaySize(24, 24);
    this.coinsText = this.add.text(-12, 0, '0', headingStyle(20, '#ffffff')).setOrigin(0, 0.5);
    pill.add([pillBg, coinIcon, this.coinsText]);
    const pauseBtn = makeIconButton(this, DESIGN_W - 34, 34, 24, 'II', () => this.pauseGame());
    pauseBtn.setDepth(11);
    this.coinsPill = pill;
    this.hud.push(bubble, levelLabel, this.timerText, pill, pauseBtn);

    // SIZE bar row (y ~78): label + bar + number, objects-left on the right.
    const sizeLabel = this.add.text(12, 78, t('size'), bodyStyle(15)).setOrigin(0, 0.5).setDepth(10);
    this.sizeBarGfx = this.add.graphics().setDepth(10);
    this.sizeText = this.add.text(238, 78, '13', bodyStyle(16)).setOrigin(0, 0.5).setDepth(10);
    this.leftText = this.add.text(378, 78, '', bodyStyle(15)).setOrigin(1, 0.5).setDepth(10);
    this.hud.push(sizeLabel, this.sizeBarGfx, this.sizeText, this.leftText);
    this.refreshHUD();

    // Teaching hint (one line, only where a mechanic first appears).
    const hintKey = HINTS[this.levelN];
    if (hintKey) {
      this.hintText = this.add
        .text(DESIGN_W / 2, 130, t(hintKey), bodyStyle(17, '#ffffff'))
        .setOrigin(0.5)
        .setDepth(11)
        .setBackgroundColor('rgba(20,20,20,0.8)')
        .setPadding(12, 8, 12, 8);
      this.time.delayedCall(4500, () => {
        this.hintText?.destroy();
        this.hintText = null;
      });
    }
  }

  private fmtTime(seconds: number): string {
    const s = Math.max(0, Math.ceil(seconds));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  private refreshHUD(): void {
    const timeLeft = this.sim.timeLeft;
    this.timerText.setText(this.fmtTime(timeLeft));
    this.timerText.setColor(timeLeft <= 10 ? '#e23b2e' : '#ffffff');
    this.coinsText.setText(`${this.sim.coins}`);
    const size = sizeOf(this.sim.hole.r);
    this.sizeText.setText(`${size}`);
    const g = this.sizeBarGfx;
    g.clear();
    g.fillStyle(0x141414, 0.85);
    g.fillRoundedRect(58, 68, 170, 20, 10);
    g.fillStyle(0x7c3aed, 1);
    g.fillRoundedRect(60, 70, Math.max(4, 166 * Math.min(1, size / 95)), 16, 8);
    const left = this.sim.objects.filter((o) => !o.eaten && !o.def.golden).length;
    this.leftText.setText(t('leftObjects').replace('{n}', `${left}`));
  }

  // ---------- tutorial (L1 only) ----------

  private buildTutorial(): void {
    if (this.levelN !== 1) return;
    // Ghost path: the planned route's first waypoints, dotted.
    const plan = planRoute(this.level);
    this.ghostGfx = this.add.graphics().setDepth(5);
    const pts = plan.waypoints.slice(0, 14);
    this.ghostGfx.fillStyle(0xffffff, 0.7);
    for (const p of pts) this.ghostGfx.fillCircle(p.x, p.y, 4);
    // The official hand follows the path on a loop until the first swallow.
    this.handImg = this.add.image(pts[0]?.x ?? 195, pts[0]?.y ?? 700, 'hand').setDepth(6);
    this.handImg.setDisplaySize(64, 64);
    const chain = this.tweens.chain({
      targets: this.handImg,
      tweens: pts.slice(1).map((p) => ({ x: p.x, y: p.y, duration: 260 })),
      loop: -1,
    });
    this.tutorial = [this.ghostGfx, this.handImg];
    void chain;
  }

  private dismissTutorial(): void {
    if (this.tutorialDone) return;
    this.tutorialDone = true;
    for (const o of this.tutorial) o.destroy();
    this.tutorial = [];
    this.ghostGfx = null;
    this.handImg = null;
  }

  // ---------- loop ----------

  update(time: number, delta: number): void {
    if (this.state !== 'playing') return;
    const dt = Math.min(delta / 1000, 0.05) * this.timeScale;
    const events = stepSim(this.sim, this.target, dt);
    for (const e of events) this.handleEvent(e, time);
    this.syncWorld(time);
    this.refreshHUD();
    if (this.sim.over) {
      if (this.sim.won) this.finishWin();
      else this.finishLose();
    }
  }

  private syncWorld(time: number): void {
    // Shadows under every live object (cheap, drawn fresh each frame).
    const g = this.shadowGfx;
    g.clear();
    for (let i = 0; i < this.sim.objects.length; i++) {
      const o = this.sim.objects[i];
      if (o.eaten) continue;
      drawShadow(g, o.x, o.y, KIND_STATS[o.def.kind].r);
    }
    // Movers + pet follow the sim; the hole redraws (it grows + swirls).
    for (let i = 0; i < this.sim.objects.length; i++) {
      const o = this.sim.objects[i];
      const v = this.views[i];
      if (o.eaten || !v) continue;
      v.img.setPosition(o.x, o.y);
      if (v.sparkle) {
        v.sparkle.setPosition(o.x, o.y - KIND_STATS[o.def.kind].r - 6);
        v.sparkle.setScale(1 + Math.sin(time / 180) * 0.12);
      }
    }
    if (this.sim.pet && this.petImg) {
      this.petImg.setPosition(this.sim.pet.x, this.sim.pet.y);
      this.petImg.setFlipX(this.sim.pet.fleeingUntil > this.sim.elapsed);
      this.petName?.setPosition(this.sim.pet.x, this.sim.pet.y - 34);
    }
    const h = this.sim.hole;
    this.holeGfx.clear();
    drawHole(this.holeGfx, h.x, h.y, h.r, time / 1000, this.skinRim, this.skinRimLight);
  }

  private handleEvent(e: RuleEvent, time: number): void {
    if (e.type === 'eat') {
      this.dismissTutorial();
      const idx = this.sim.objects.findIndex((o) => o.def.id === e.id);
      const v = this.views[idx];
      const obj = this.sim.objects[idx];
      if (v && obj) {
        // Sink INTO the pit: under the hole, shrink + spin + fade.
        v.img.setDepth(1);
        if (v.sparkle) v.sparkle.destroy();
        this.tweens.add({
          targets: v.img,
          scaleX: 0.05,
          scaleY: 0.05,
          angle: 180,
          alpha: 0.4,
          duration: 130,
          onComplete: () => v.img.setVisible(false),
        });
      }
      // «+value» pop flies up from the swallow point.
      const pop = this.add
        .text(this.sim.hole.x, this.sim.hole.y - this.sim.hole.r, `+${e.coins}`, headingStyle(e.golden ? 26 : 20, e.golden ? '#facc15' : '#ffffff'))
        .setOrigin(0.5)
        .setDepth(12);
      this.tweens.add({
        targets: pop,
        y: pop.y - 44,
        alpha: 0,
        duration: 650,
        onComplete: () => pop.destroy(),
      });
      // Flying coins to the coins pill (game-juice: the reward travels).
      for (let i = 0; i < Math.min(3, 1 + Math.floor(e.coins / 25)); i++) {
        const c = this.add.image(this.sim.hole.x, this.sim.hole.y, 'kh-coin').setDepth(12).setDisplaySize(16, 16);
        this.tweens.add({
          targets: c,
          x: 234,
          y: 34,
          duration: 420 + i * 90,
          ease: 'Cubic.easeIn',
          onComplete: () => c.destroy(),
        });
      }
      // Gulp: pitch rises with hole size (audio-design variation).
      AudioEngine.gulp(this.sim.hole.r);
      if (e.coins >= 100) juice(this, 'medium', this.sim.hole.x, this.sim.hole.y);
      else if (e.coins >= 25) juice(this, 'small', this.sim.hole.x, this.sim.hole.y);
    } else if (e.type === 'tooBig') {
      const idx = this.sim.objects.findIndex((o) => o.def.id === e.id);
      const v = this.views[idx];
      if (v && time - v.wobbleAt > 300) {
        v.wobbleAt = time;
        this.tweens.add({ targets: v.img, x: '+=5', duration: 60, yoyo: true, repeat: 2 });
        AudioEngine.pop();
      }
    } else if (e.type === 'steal') {
      // The pet dashed off with coins: flash the pill red + show the loss.
      AudioEngine.squawk();
      const loss = this.add
        .text(268, 62, `-${e.amount}`, headingStyle(20, '#e23b2e'))
        .setOrigin(0.5)
        .setDepth(12);
      this.tweens.add({ targets: loss, y: 84, alpha: 0, duration: 800, onComplete: () => loss.destroy() });
      this.tweens.add({ targets: this.coinsPill, scaleX: 1.15, scaleY: 1.15, duration: 90, yoyo: true });
    } else if (e.type === 'goldenSpawn') {
      // Golden events carry no id — the golden sits at its spawn point.
      const idx = this.sim.objects.findIndex((o) => o.def.golden && !o.eaten && o.x === e.x && o.y === e.y);
      const obj = this.sim.objects[idx];
      const v = this.views[idx];
      if (obj && v) {
        v.sparkle = this.add.image(obj.x, obj.y - KIND_STATS[obj.def.kind].r - 6, 'kh-sparkle').setDepth(3).setDisplaySize(20, 20);
        this.tweens.add({ targets: v.sparkle, scaleX: 1.4, scaleY: 1.4, duration: 220, yoyo: true });
        AudioEngine.chest();
      }
    } else if (e.type === 'goldenExpire') {
      const idx = this.sim.objects.findIndex((o) => o.def.golden && o.eaten && o.x === e.x && o.y === e.y);
      const v = this.views[idx];
      if (v) {
        if (v.sparkle) v.sparkle.destroy();
        v.img.setVisible(false);
      }
    } else if (e.type === 'grow') {
      AudioEngine.pop();
    }
  }

  // ---------- win / lose ----------

  private finishWin(): void {
    if (this.state !== 'playing') return;
    this.state = 'won';
    this.wonAt = this.time.now;
    const stars = this.sim.stars;
    const coinsEarned = this.sim.coins + (stars === 3 ? 25 : 0);
    const prevStars = Save.data.stars[this.levelN] ?? 0;
    Save.data.stars[this.levelN] = Math.max(prevStars, stars);
    Save.data.coins += coinsEarned;
    Save.data.wins += 1;
    if (this.levelN < LEVEL_COUNT) {
      Save.data.unlocked = Math.max(Save.data.unlocked, this.levelN + 1);
    }
    if (this.daily) Save.markDailyDone();
    void Save.write();
    AudioEngine.win();
    juice(this, 'large', DESIGN_W / 2, DESIGN_H / 2);
    // Interstitial at a natural pause: every 2nd win, never level 1.
    if (Save.data.wins >= 2 && Save.data.wins % 2 === 0 && this.levelN > 1) {
      this.tryInterstitial();
    }
    this.time.delayedCall(650, () => {
      this.scene.start('Result', {
        level: this.levelN, win: true, stars, coinsEarned,
        coinsCollected: this.sim.coins, daily: this.daily,
      });
    });
  }

  private finishLose(): void {
    if (this.state !== 'playing') return;
    this.state = 'lost';
    AudioEngine.fail();
    this.scene.start('Result', {
      level: this.levelN, win: false, stars: 0, coinsEarned: 0,
      coinsCollected: this.sim.coins, daily: this.daily,
    });
  }

  private tryInterstitial(): void {
    try {
      const b = (window as unknown as { bridge?: { advertisement?: { interstitial?: { show?: (p: string) => void; isSupported?: boolean } } } }).bridge;
      if (b?.advertisement?.interstitial?.isSupported) {
        b.advertisement.interstitial.show?.('level_complete');
      }
    } catch {
      /* ads are best-effort */
    }
  }

  // ---------- pause ----------

  pauseGame(): void {
    if (this.state !== 'playing') return;
    this.prevState = 'playing';
    this.state = 'paused';
    const dim = this.add.rectangle(0, 0, DESIGN_W, DESIGN_H, 0x141414, 0.55).setOrigin(0).setDepth(20);
    const title = this.add.text(DESIGN_W / 2, 300, t('pause'), headingStyle(40)).setOrigin(0.5).setDepth(21);
    const resume = makeButton(this, DESIGN_W / 2, 400, {
      w: 240, h: 76, fontSize: 26, label: t('resume'), color: COLORS.leaf,
      onClick: () => this.resumeGame(),
    });
    resume.setDepth(21);
    const restart = makeButton(this, DESIGN_W / 2, 492, {
      w: 240, h: 64, fontSize: 22, label: t('restart'), color: COLORS.elastic,
      onClick: () => this.scene.restart({ level: this.levelN, daily: this.daily }),
    });
    restart.setDepth(21);
    const quit = makeButton(this, DESIGN_W / 2, 572, {
      w: 240, h: 64, fontSize: 22, label: t('quit'), color: COLORS.coral,
      onClick: () => this.scene.start('Menu'),
    });
    quit.setDepth(21);
    this.pausedOverlay = [dim, title, resume, restart, quit];
  }

  private resumeGame(): void {
    for (const o of this.pausedOverlay) o.destroy();
    this.pausedOverlay = [];
    this.state = this.prevState;
  }

  // ---------- test handle (test build only) ----------

  testGetState(): Record<string, unknown> {
    return {
      scene: 'Game',
      level: this.levelN,
      state: this.state,
      hole: { x: Math.round(this.sim.hole.x), y: Math.round(this.sim.hole.y), r: +this.sim.hole.r.toFixed(1) },
      coins: this.sim.coins,
      eaten: this.sim.eaten,
      total: this.sim.total,
      timeLeft: +this.sim.timeLeft.toFixed(1),
      stars: this.sim.stars,
      goldensEaten: this.sim.goldensEaten,
      goldensTotal: this.sim.goldensTotal,
      pet: this.sim.pet ? { kind: this.sim.pet.def.kind, x: Math.round(this.sim.pet.x), y: Math.round(this.sim.pet.y) } : null,
    };
  }

  testDragTo(x: number, y: number): void {
    if (this.state !== 'playing') return;
    this.dragging = true;
    this.target = { x, y };
  }

  testSolution(): { x: number; y: number }[] {
    return planRoute(this.level).waypoints;
  }

  testSolution3(): { x: number; y: number }[] {
    return planRoute(this.level, true).waypoints;
  }

  /** Test only: run the sim faster (SwiftShader headless is slow).
   * Never called from production code; the test handle is tree-shaken
   * out of the production build. */
  testSetTimeScale(scale: number): void {
    this.timeScale = scale;
  }
}
