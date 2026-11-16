// Game: draw bridges with limited ink, press PLAY, the delivery scooter
// drives over them. Matter.js physics, design space 390x844 (camera zooms
// to fit). States: draw -> drive -> won/lost. Wind pushes, trampolines
// bounce, moving platforms ferry, dual levels deliver two pizzas at once.
// Win = every scooter reaches its delivery flag.
//
// The Tetris-GDD rule applies: a level ships only if its solution wins —
// the Node validator proves the geometry (levels.ts solutions + pars);
// the browser harness proves the dynamics (drive, bounce, moving timing).
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { t } from '../i18n';
import {
  getLevel,
  goalSensor,
  inkOf,
  parOf,
  spawnOn,
  starsFor,
  type InkType,
  type LevelDef,
  type MovingDef,
  type Pt,
  type WindZone,
} from '../levels';
import { Save } from '../save';
import { SKINS } from '../skins';
import { COLORS, bodyStyle, headingStyle, juice, makeButton, makeIconButton } from '../ui';
import { buildScooterView, createScooterBody, SCOOTER, syncScooterView, type Scooter } from '../vehicle';

// The Matter.js library rides inside Phaser (no separate matter-js dep):
// Phaser.Physics.Matter.Matter exposes Body / Bodies / Composite.
// (Runtime value; the .d.ts does not declare it, hence the cast.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MatterBody = (Phaser.Physics.Matter as any).Matter.Body as typeof MatterJS.Body;

const DESIGN_W = 390;
const DESIGN_H = 844;
const BRIDGE_THICK = 10;
const DRIVE_TIMEOUT_S = 60; // generous on purpose: Matter defers fixed
// 16.66 ms steps when frames are slow (SwiftShader / loaded device), so
// physics can run several times slower than wall time (Ramp r2 lesson).
const STUCK_MS = 2500;
const MAX_STROKES = 40;
const DRAW_TOP = 110;
const DRAW_BOTTOM = 760;

const BRIDGE_STYLE: Record<InkType, { fill: number; edge: number; friction: number; restitution: number }> = {
  wood: { fill: 0xc68b4e, edge: 0x7a4f24, friction: 0.6, restitution: 0 },
  turbo: { fill: 0xff9f1c, edge: 0xe07b00, friction: 0.05, restitution: 0 },
  bouncy: { fill: 0xff6b9d, edge: 0xc24b78, friction: 0.6, restitution: 0.9 },
};

interface Stroke {
  points: Pt[];
  bodies: MatterJS.BodyType[];
  gfx: Phaser.GameObjects.Graphics;
  length: number;
}

interface GameData {
  level: number;
  daily?: boolean;
  extraInk?: boolean;
}

interface CoinView {
  x: number;
  y: number;
  img: Phaser.GameObjects.Image;
  taken: boolean;
}

interface MovingView {
  def: MovingDef;
  body: MatterJS.BodyType;
  img: Phaser.GameObjects.Image;
}

export class GameScene extends Phaser.Scene {
  private level!: LevelDef;
  private levelN = 1;
  private daily = false;
  private state: 'draw' | 'drive' | 'done' | 'paused' = 'draw';
  private prevState: 'draw' | 'drive' = 'draw';
  private strokes: Stroke[] = [];
  private inkBudget = 0;
  private inkLeft = 0;
  private inkUsed = 0;
  private drawing = false;
  private drawPoints: Pt[] = [];
  private drawGfx: Phaser.GameObjects.Graphics | null = null;
  private eraserMode = false;
  private scooters: Scooter[] = [];
  private scooterGoals: { x: number; y: number; w: number; h: number }[] = [];
  private scooterWon: boolean[] = [];
  private coinsCollected = 0;
  private coinViews: CoinView[] = [];
  private movingViews: MovingView[] = [];
  private windZones: WindZone[] = [];
  private windTiles: Phaser.GameObjects.TileSprite[] = [];
  private fanImgs: Phaser.GameObjects.Image[] = [];
  private driveStartMs = 0;
  private lastProgressMs = 0;
  private previewViews: Phaser.GameObjects.Container[] = [];
  private hud: Phaser.GameObjects.GameObject[] = [];
  private inkBarGfx: Phaser.GameObjects.Graphics | null = null;
  private inkText: Phaser.GameObjects.Text | null = null;
  private playBtn: Phaser.GameObjects.Container | null = null;
  private eraseBtn: Phaser.GameObjects.Container | null = null;
  private undoBtn: Phaser.GameObjects.Container | null = null;
  private bottomBar: Phaser.GameObjects.GameObject[] = [];
  private pausedOverlay: Phaser.GameObjects.GameObject[] = [];
  private hintText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('Game');
  }

  create(data: GameData): void {
    this.levelN = data.level || 1;
    this.level = getLevel(this.levelN);
    this.daily = !!data.daily;
    this.state = 'draw';
    this.strokes = [];
    this.scooters = [];
    this.scooterGoals = [];
    this.scooterWon = [];
    this.coinsCollected = 0;
    this.coinViews = [];
    this.movingViews = [];
    this.windZones = this.level.wind;
    this.windTiles = [];
    this.fanImgs = [];
    this.previewViews = [];
    this.hud = [];
    this.bottomBar = [];
    this.pausedOverlay = [];
    this.eraserMode = false;
    this.inkUsed = 0;

    // Extra ink from a rewarded ad: +150 on this level, consumes one grant.
    let extra = 0;
    if (data.extraInk && Save.data.shop.extraInk > 0) {
      Save.data.shop.extraInk -= 1;
      extra = 150;
      void Save.write();
    }
    this.inkBudget = inkOf(this.level) + extra;
    this.inkLeft = this.inkBudget;

    // Camera: design space 390x844, zoomed to fit any screen.
    const w = this.scale.width;
    const h = this.scale.height;
    const zoom = Math.min(w / DESIGN_W, h / DESIGN_H);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(DESIGN_W / 2, DESIGN_H / 2);
    this.cameras.main.setBackgroundColor(0x7ec8f7);

    // Physics: fresh gravity, world bounds as a safety net on the sides
    // and top only — the bottom stays OPEN so a scooter that misses the
    // bridge falls into the river (y > 820 = fail).
    this.matter.world.setGravity(0, 1);
    const wallOpts: MatterJS.IBodyDefinition = { isStatic: true, label: 'bounds', friction: 0 };
    this.matter.world.add(this.matter.bodies.rectangle(DESIGN_W / 2, 96, DESIGN_W + 80, 24, wallOpts));
    this.matter.world.add(this.matter.bodies.rectangle(-22, DESIGN_H / 2, 24, DESIGN_H + 80, wallOpts));
    this.matter.world.add(this.matter.bodies.rectangle(DESIGN_W + 22, DESIGN_H / 2, 24, DESIGN_H + 80, wallOpts));

    this.buildBackground();
    this.buildLevel();
    this.buildHud();
    this.buildHint();

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onPointerDown(p));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.onPointerMove(p));
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => this.onPointerUp(p));
    this.matter.world.on('collisionstart', (e: Phaser.Physics.Matter.Events.CollisionStartEvent) => this.onCollision(e));
    this.matter.world.on('collisionactive', (e: Phaser.Physics.Matter.Events.CollisionActiveEvent) => this.onCollision(e));

    // NOTE: the Matter plugin shuts down BEFORE this event fires (it sets
    // world = null in its own SHUTDOWN handler), so guard every .off.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input?.off('pointerdown');
      this.input?.off('pointermove');
      this.input?.off('pointerup');
      this.matter.world?.off('collisionstart');
      this.matter.world?.off('collisionactive');
    });
  }

  // ---------- construction ----------

  private buildBackground(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const zoom = this.cameras.main.zoom;
    const vw = w / zoom;
    const vh = h / zoom;
    const bg = this.add.image(DESIGN_W / 2, DESIGN_H / 2, w > h ? 'bg-play-land' : 'bg-play');
    const tex = this.textures.get(w > h ? 'bg-play-land' : 'bg-play').getSourceImage() as HTMLImageElement;
    const cover = Math.max(vw / tex.width, vh / tex.height);
    bg.setScale(cover);
    bg.setDepth(-10);
    // River under the gap (the bg only paints a band at the very bottom).
    const river = this.add.image(DESIGN_W / 2, 772, 'river').setDisplaySize(DESIGN_W + 4, 144);
    river.setDepth(-9);
  }

  /** Draw a comic cliff (rock + strata + grassy top) for a platform rect. */
  private drawCliff(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
    g.fillStyle(0xb07a4a, 1);
    g.fillRect(x, y, w, h);
    g.lineStyle(3, 0x141414, 1);
    g.strokeRect(x, y, w, h);
    // Strata.
    g.lineStyle(3, 0x8a5a33, 1);
    for (let i = 1; i <= 3; i++) {
      const yy = y + (Math.min(h, 200) / 4) * i;
      g.lineBetween(x + 6, yy, x + w - 6, yy + 4);
    }
    // Grassy top.
    g.fillStyle(0x58b368, 1);
    g.fillRoundedRect(x - 3, y - 8, w + 6, 20, 9);
    g.lineStyle(3, 0x141414, 1);
    g.strokeRoundedRect(x - 3, y - 8, w + 6, 20, 9);
  }

  private buildLevel(): void {
    const L = this.level;
    const pg = this.add.graphics().setDepth(-5);

    // Platforms (physics + cliff visuals).
    const addPlat = (r: { x: number; y: number; w: number; h: number }): void => {
      const body = this.matter.bodies.rectangle(r.x + r.w / 2, r.y + r.h / 2, r.w, r.h, {
        isStatic: true, label: 'platform', friction: 0.6, restitution: 0,
      });
      this.matter.world.add(body);
      this.drawCliff(pg, r.x, r.y, r.w, Math.min(r.h, 220));
    };
    addPlat(L.startPlat);
    addPlat(L.goalPlat);
    if (L.start2Plat) addPlat(L.start2Plat);
    if (L.goal2Plat) addPlat(L.goal2Plat);

    // Walls (rock blocks).
    for (const wl of L.walls) {
      const body = this.matter.bodies.rectangle(wl.x + wl.w / 2, wl.y + wl.h / 2, wl.w, wl.h, {
        isStatic: true, label: 'wall', friction: 0.4, restitution: 0,
      });
      this.matter.world.add(body);
      pg.fillStyle(0xb07a4a, 1);
      pg.fillRect(wl.x, wl.y, wl.w, wl.h);
      pg.lineStyle(3, 0x141414, 1);
      pg.strokeRect(wl.x, wl.y, wl.w, wl.h);
      pg.lineStyle(3, 0x8a5a33, 1);
      pg.lineBetween(wl.x + 4, wl.y + wl.h / 2, wl.x + wl.w - 4, wl.y + wl.h / 2 + 3);
    }

    // Houses on the platforms (the delivery addresses).
    const houseKeys = ['house-a', 'house-b', 'house-c'];
    const houseFor = (n: number): string => houseKeys[n % 3];
    const putHouse = (platX: number, platY: number, key: string, s = 1): void => {
      this.add.image(platX + 45, platY - 44 * s, key).setDisplaySize(64 * s, 92 * s).setDepth(-4);
    };
    putHouse(L.startPlat.x, L.startPlat.y, houseFor(L.n + 1), 0.85);
    putHouse(L.goalPlat.x, L.goalPlat.y, houseFor(L.n));
    if (L.start2Plat) putHouse(L.start2Plat.x, L.start2Plat.y, houseFor(L.n + 2), 0.85);
    if (L.goal2Plat) putHouse(L.goal2Plat.x, L.goal2Plat.y, houseFor(L.n + 1));

    // Delivery flag on the goal(s).
    const putFlag = (platX: number, platY: number): void => {
      this.add.image(platX + 14, platY - 24, 'flag').setDisplaySize(30, 45).setDepth(-3);
    };
    putFlag(L.goalPlat.x, L.goalPlat.y);
    if (L.goal2Plat) putFlag(L.goal2Plat.x, L.goal2Plat.y);

    // Trampolines.
    for (const tp of L.trampolines) {
      const body = this.matter.bodies.rectangle(tp.x + tp.w / 2, tp.y + 4, tp.w, 8, {
        isStatic: true, label: 'trampoline', friction: 0.4, restitution: 1.3,
      });
      this.matter.world.add(body);
      this.add.image(tp.x + tp.w / 2, tp.y + 10, 'trampoline').setDisplaySize(tp.w, 20).setDepth(-3);
    }

    // Moving platforms (kinematic: repositioned every frame).
    for (const m of L.moving) {
      const body = this.matter.bodies.rectangle(m.cx, m.y, m.w, 12, {
        isStatic: true, label: 'moving', friction: 0.6, restitution: 0,
      });
      this.matter.world.add(body);
      const img = this.add.image(m.cx, m.y, 'wood').setDisplaySize(m.w, 12).setDepth(-3);
      this.movingViews.push({ def: m, body, img });
    }

    // Wind zones: translucent band + flowing streaks + a fan at the source.
    for (const zn of this.windZones) {
      const band = this.add.rectangle(zn.x + zn.w / 2, zn.y + zn.h / 2, zn.w, zn.h, 0xffffff, 0.08);
      band.setDepth(-6);
      const tile = this.add.tileSprite(zn.x + zn.w / 2, zn.y + zn.h / 2, zn.w, zn.h, 'wind').setDepth(-6);
      tile.setAlpha(0.85);
      this.windTiles.push(tile);
      const fan = this.add.image(zn.x - 8, zn.y + zn.h / 2, 'fan').setDisplaySize(44, 44).setDepth(-3);
      this.fanImgs.push(fan);
    }

    // Coins.
    for (const c of L.coins) {
      const img = this.add.image(c.x, c.y, 'coin').setDisplaySize(26, 30).setDepth(-2);
      this.tweens.add({ targets: img, y: c.y - 6, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.coinViews.push({ x: c.x, y: c.y, img, taken: false });
    }

    // Scooter preview(s) standing on the start platform(s) while drawing.
    const skin = SKINS.find((s) => s.id === Save.data.shop.skin) ?? SKINS[0];
    const tint = skin.tint === 0xffffff ? 0xff6b5e : skin.tint;
    const spawn1 = spawnOn(L.startPlat);
    const v1 = buildScooterView(this, tint, 0xff6b5e);
    v1.view.setPosition(spawn1.x, spawn1.y);
    this.tweens.add({ targets: v1.view, y: spawn1.y - 3, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.previewViews.push(v1.view);
    if (L.start2Plat) {
      const spawn2 = spawnOn(L.start2Plat);
      const v2 = buildScooterView(this, 0x2ec4b6, 0x2ec4b6);
      v2.view.setPosition(spawn2.x, spawn2.y);
      this.tweens.add({ targets: v2.view, y: spawn2.y - 3, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: 200 });
      this.previewViews.push(v2.view);
    }

    // Goal sensors (plain rects — checked per frame, no collision events).
    this.scooterGoals = [goalSensor(L.goalPlat)];
    if (L.goal2Plat) this.scooterGoals.push(goalSensor(L.goal2Plat));
    this.scooterWon = this.scooterGoals.map(() => false);
  }

  private buildHud(): void {
    const w = DESIGN_W;
    const name = this.level.name;
    const title = this.add
      .text(12, 14, `LEVEL ${this.levelN} · ${name.toUpperCase()}`, headingStyle(17, '#ffffff'))
      .setDepth(10);
    title.setShadow(2, 2, '#141414', 4);
    this.hud.push(title);

    const coinsBg = this.add.graphics();
    coinsBg.fillStyle(0x000000, 0.3);
    coinsBg.fillRoundedRect(w / 2 - 52, 10, 104, 36, 18);
    const coinIcon = this.add.image(w / 2 - 30, 28, 'coin').setDisplaySize(24, 27);
    const coinsText = this.add
      .text(w / 2 - 12, 28, `${Save.data.coins}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '20px', color: '#ffffff' })
      .setOrigin(0, 0.5);
    this.hud.push(coinsBg, coinIcon, coinsText);

    const pause = makeIconButton(this, w - 30, 28, 22, 'II', () => this.pauseGame());
    pause.setDepth(10);
    this.hud.push(pause);

    // Ink bar.
    this.inkBarGfx = this.add.graphics().setDepth(10);
    this.inkText = this.add
      .text(12, 58, `${t('ink')} ${this.inkLeft}/${this.inkBudget}`, bodyStyle(16, '#ffffff'))
      .setDepth(10);
    this.inkText.setShadow(2, 2, '#141414', 4);
    const typeLabel = this.add
      .text(w - 12, 58, this.level.inkType.toUpperCase(), bodyStyle(16, '#ffffff'))
      .setOrigin(1, 0)
      .setDepth(10);
    typeLabel.setShadow(2, 2, '#141414', 4);
    this.hud.push(this.inkText, typeLabel);
    this.drawInkBar();

    // Bottom bar (draw mode): UNDO | PLAY | ERASE.
    this.undoBtn = makeButton(this, 62, 800, {
      w: 96, h: 60, fontSize: 20, label: t('undo'), color: COLORS.sea,
      onClick: () => this.undoStroke(),
    });
    this.playBtn = makeButton(this, w / 2, 800, {
      w: 150, h: 76, fontSize: 30, label: t('play'), color: COLORS.leaf,
      onClick: () => this.play(),
    });
    this.eraseBtn = makeButton(this, w - 62, 800, {
      w: 96, h: 60, fontSize: 20, label: t('erase'), color: COLORS.coral,
      onClick: () => this.toggleEraser(),
    });
    this.bottomBar = [this.undoBtn, this.playBtn, this.eraseBtn];
    this.tweens.add({ targets: this.playBtn, scaleX: 1.05, scaleY: 1.05, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.refreshPlayBtn();
  }

  private buildHint(): void {
    // One line, zero reading beyond the level itself (onboarding skill).
    this.hintText = this.add
      .text(DESIGN_W / 2, 96, t(this.level.hint), bodyStyle(17, '#ffffff'))
      .setOrigin(0.5)
      .setDepth(10);
    this.hintText.setShadow(2, 2, '#141414', 4);
    this.hintText.setWordWrapWidth(DESIGN_W - 48);
    this.hintText.setAlign('center');
    this.time.delayedCall(5000, () => {
      if (this.hintText) this.tweens.add({ targets: this.hintText, alpha: 0, duration: 600 });
    });
  }

  private drawInkBar(): void {
    const g = this.inkBarGfx;
    if (!g) return;
    g.clear();
    const x = 12;
    const y = 80;
    const w = DESIGN_W - 24;
    const h = 12;
    g.fillStyle(0x000000, 0.45);
    g.fillRoundedRect(x, y, w, h, 6);
    const frac = this.inkBudget > 0 ? this.inkLeft / this.inkBudget : 0;
    const col = frac > 0.5 ? 0x58b368 : frac > 0.25 ? 0xffc53d : 0xff6b5e;
    if (frac > 0) {
      g.fillStyle(col, 1);
      g.fillRoundedRect(x + 2, y + 2, Math.max(8, (w - 4) * frac), h - 4, 4);
    }
    // Par marker (the 3-star line).
    const parFrac = parOf(this.level) / this.inkBudget;
    if (parFrac < 1) {
      g.lineStyle(2, 0xffffff, 1);
      g.lineBetween(x + w * parFrac, y - 2, x + w * parFrac, y + h + 2);
    }
    if (this.inkText) this.inkText.setText(`${t('ink')} ${this.inkLeft}/${this.inkBudget}`);
  }

  private refreshPlayBtn(): void {
    if (!this.playBtn) return;
    const enabled = this.strokes.length > 0;
    this.playBtn.setAlpha(enabled ? 1 : 0.45);
  }

  // ---------- input ----------

  private inDrawZone(p: Phaser.Input.Pointer): boolean {
    return p.worldY >= DRAW_TOP && p.worldY <= DRAW_BOTTOM && p.worldX >= 0 && p.worldX <= DESIGN_W;
  }

  private onPointerDown(p: Phaser.Input.Pointer): void {
    if (this.state !== 'draw' || !this.inDrawZone(p)) return;
    if (this.eraserMode) {
      this.eraseAt({ x: p.worldX, y: p.worldY });
      return;
    }
    if (this.strokes.length >= MAX_STROKES) return;
    if (this.inkLeft < 12) {
      AudioEngine.fail();
      return;
    }
    this.drawing = true;
    this.drawPoints = [{ x: p.worldX, y: p.worldY }];
    this.drawGfx = this.add.graphics().setDepth(1);
    AudioEngine.drawStart();
  }

  private onPointerMove(p: Phaser.Input.Pointer): void {
    if (!this.drawing || !this.drawGfx || this.state !== 'draw') return;
    const last = this.drawPoints[this.drawPoints.length - 1];
    const dx = p.worldX - last.x;
    const dy = p.worldY - last.y;
    if (Math.hypot(dx, dy) < 8) return;
    // Ink cap: stop the stroke when the ink runs out mid-draw.
    const newLen = this.strokeLen(this.drawPoints) + Math.hypot(dx, dy);
    if (newLen > this.inkLeft) {
      this.finishStroke();
      return;
    }
    this.drawPoints.push({ x: p.worldX, y: p.worldY });
    this.redrawLiveStroke();
  }

  private onPointerUp(_p: Phaser.Input.Pointer): void {
    if (!this.drawing) return;
    this.finishStroke();
  }

  private strokeLen(pts: Pt[]): number {
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    return len;
  }

  private redrawLiveStroke(): void {
    const g = this.drawGfx;
    if (!g) return;
    g.clear();
    const style = BRIDGE_STYLE[this.level.inkType];
    // Orange glow while tracing (the mockup's glowing pencil line).
    g.lineStyle(BRIDGE_THICK + 4, 0xff9f1c, 0.85);
    this.strokePath(g, this.drawPoints);
    g.lineStyle(BRIDGE_THICK, style.fill, 1);
    this.strokePath(g, this.drawPoints);
  }

  private strokePath(g: Phaser.GameObjects.Graphics, pts: Pt[]): void {
    if (pts.length < 2) {
      if (pts.length === 1) g.fillCircle(pts[0].x, pts[0].y, BRIDGE_THICK / 2);
      return;
    }
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.strokePath();
  }

  private finishStroke(): void {
    this.drawing = false;
    AudioEngine.drawStop();
    const pts = this.drawPoints;
    const g = this.drawGfx;
    this.drawGfx = null;
    this.drawPoints = [];
    const len = this.strokeLen(pts);
    if (!g || pts.length < 2 || len < 12) {
      g?.destroy();
      return;
    }
    // Bodies: one static rectangle per segment, 10 px thick.
    const style = BRIDGE_STYLE[this.level.inkType];
    const bodies: MatterJS.BodyType[] = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const segLen = Math.hypot(b.x - a.x, b.y - a.y);
      if (segLen < 2) continue;
      const body = this.matter.bodies.rectangle(
        (a.x + b.x) / 2, (a.y + b.y) / 2, segLen + 2, BRIDGE_THICK,
        {
          isStatic: true, angle: Math.atan2(b.y - a.y, b.x - a.x),
          label: `bridge-${this.level.inkType}`,
          friction: style.friction, restitution: style.restitution,
        },
      );
      this.matter.world.add(body);
      bodies.push(body);
    }
    // Final visual: dark edge + wood fill.
    g.clear();
    g.lineStyle(BRIDGE_THICK + 4, style.edge, 1);
    this.strokePath(g, pts);
    g.lineStyle(BRIDGE_THICK, style.fill, 1);
    this.strokePath(g, pts);
    const cost = Math.round(len);
    this.strokes.push({ points: pts, bodies, gfx: g, length: cost });
    this.inkUsed += cost;
    this.inkLeft -= cost;
    this.drawInkBar();
    this.refreshPlayBtn();
    AudioEngine.pop();
  }

  private eraseAt(p: Pt): void {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      const s = this.strokes[i];
      if (this.distToStroke(p, s.points) < 16) {
        for (const b of s.bodies) this.matter.world.remove(b);
        s.gfx.destroy();
        this.strokes.splice(i, 1);
        this.inkUsed -= s.length;
        this.inkLeft += s.length;
        this.drawInkBar();
        this.refreshPlayBtn();
        AudioEngine.click();
        return;
      }
    }
  }

  private distToStroke(p: Pt, pts: Pt[]): number {
    let best = Infinity;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const l2 = dx * dx + dy * dy;
      const tt = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
      const cx = a.x + tt * dx;
      const cy = a.y + tt * dy;
      best = Math.min(best, Math.hypot(p.x - cx, p.y - cy));
    }
    return best;
  }

  private undoStroke(): void {
    if (this.state !== 'draw') return;
    const s = this.strokes.pop();
    if (!s) return;
    for (const b of s.bodies) this.matter.world.remove(b);
    s.gfx.destroy();
    this.inkUsed -= s.length;
    this.inkLeft += s.length;
    this.drawInkBar();
    this.refreshPlayBtn();
    AudioEngine.click();
  }

  private toggleEraser(): void {
    if (this.state !== 'draw') return;
    this.eraserMode = !this.eraserMode;
    if (this.eraseBtn) this.eraseBtn.setAlpha(this.eraserMode ? 0.6 : 1);
    AudioEngine.click();
  }

  // ---------- drive ----------

  private play(): void {
    if (this.state !== 'draw') return;
    if (this.strokes.length === 0) {
      AudioEngine.fail();
      if (this.hintText) {
        this.hintText.setText(t('drawFirst'));
        this.hintText.setAlpha(1);
        this.time.delayedCall(2000, () => {
          this.hintText?.setText(t(this.level.hint));
        });
      }
      return;
    }
    this.state = 'drive';
    this.eraserMode = false;
    for (const o of this.bottomBar) o.destroy();
    this.bottomBar = [];
    if (this.hintText) this.hintText.destroy();
    this.hintText = null;
    for (const v of this.previewViews) v.destroy();
    this.previewViews = [];
    this.spawnScooters();
    this.driveStartMs = this.time.now;
    this.lastProgressMs = this.time.now;
    AudioEngine.whoosh();
    if (this.scooters[0]) juice(this, 'medium', this.scooters[0].body.position.x, this.scooters[0].body.position.y);
  }

  private spawnScooters(): void {
    const L = this.level;
    const skin = SKINS.find((s) => s.id === Save.data.shop.skin) ?? SKINS[0];
    const tint = skin.tint === 0xffffff ? 0xff6b5e : skin.tint;
    const mk = (spawn: Pt, bodyTint: number, riderTint: number, label: string, delayMs: number): void => {
      const body = createScooterBody(this.matter, spawn.x, spawn.y, label);
      this.matter.world.add(body);
      const { view, wheelL, wheelR } = buildScooterView(this, bodyTint, riderTint);
      view.setPosition(spawn.x, spawn.y);
      const s: Scooter = {
        body, view, wheelL, wheelR,
        lastX: spawn.x, lastGroundedMs: 0, onTurbo: false,
        driveDelayMs: delayMs, startedAtMs: this.time.now,
        maxX: spawn.x,
      };
      // lastGroundedLabel lives on the body via a side table (Matter bodies
      // are plain objects; keep the label in a WeakMap-free field).
      (body as unknown as { __lastGround?: string }).__lastGround = '';
      this.scooters.push(s);
    };
    mk(spawnOn(L.startPlat), tint, 0xff6b5e, 'scooter', 0);
    if (L.start2Plat) mk(spawnOn(L.start2Plat), 0x2ec4b6, 0x2ec4b6, 'scooter2', 700);
  }

  private onCollision(e: Phaser.Physics.Matter.Events.CollisionStartEvent | Phaser.Physics.Matter.Events.CollisionActiveEvent): void {
    const now = this.time.now;
    for (const pair of e.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      for (const s of this.scooters) {
        const other = a === s.body ? b : b === s.body ? a : null;
        if (!other) continue;
        const label = other.label ?? '';
        if (label === 'platform' || label === 'moving' || label === 'trampoline' || label === 'wall' || label.startsWith('bridge-')) {
          s.lastGroundedMs = now;
          (s.body as unknown as { __lastGround?: string }).__lastGround = label;
          if (label === 'bridge-turbo') s.onTurbo = true;
        }
      }
    }
  }

  update(time: number, _delta: number): void {
    // Moving platforms slide in both modes (the player times PLAY to them).
    for (const mv of this.movingViews) {
      const x = mv.def.cx + mv.def.range * Math.sin((2 * Math.PI * time) / mv.def.periodMs);
      MatterBody.setPosition(mv.body, { x, y: mv.def.y });
      mv.img.setPosition(x, mv.def.y);
    }
    for (let i = 0; i < this.windTiles.length; i++) {
      const zn = this.windZones[i];
      this.windTiles[i].tilePositionX += (zn.force > 0 ? 1 : -1) * 0.6;
    }
    for (const f of this.fanImgs) f.angle += 4;

    if (this.state !== 'drive' || this.scooters.length === 0) return;

    let allWon = true;
    for (let i = 0; i < this.scooters.length; i++) {
      const s = this.scooters[i];
      if (this.scooterWon[i]) continue;
      allWon = false;
      const body = s.body;
      if (time < s.startedAtMs + s.driveDelayMs) continue;

      const grounded = time - s.lastGroundedMs < 120;
      const drive = s.onTurbo ? SCOOTER.driveTurbo : SCOOTER.driveWood;
      const maxSpeed = s.onTurbo ? SCOOTER.maxSpeedTurbo : SCOOTER.maxSpeedWood;
      if (grounded) {
        MatterBody.applyForce(body, body.position, { x: drive * body.mass, y: 0 });
        const v = body.velocity;
        if (v.x > maxSpeed) {
          MatterBody.setVelocity(body, { x: maxSpeed, y: v.y });
        }
      }
      // Wind pushes the scooter while it is inside a zone.
      for (const zn of this.windZones) {
        if (body.position.x > zn.x && body.position.x < zn.x + zn.w && body.position.y > zn.y && body.position.y < zn.y + zn.h) {
          MatterBody.applyForce(body, body.position, { x: zn.force * body.mass, y: 0 });
        }
      }
      syncScooterView(s);
      if (body.position.x > s.maxX) {
        s.maxX = body.position.x;
        this.lastProgressMs = time;
      }

      // Coins.
      for (const c of this.coinViews) {
        if (c.taken) continue;
        if (Math.hypot(body.position.x - c.x, body.position.y - c.y) < 32) {
          c.taken = true;
          this.coinsCollected += 1;
          c.img.destroy();
          AudioEngine.coin();
          juice(this, 'small', c.x, c.y);
        }
      }

      // Win: scooter centre inside its goal sensor band.
      const goal = this.scooterGoals[i];
      if (goal && body.position.x > goal.x && body.position.x < goal.x + goal.w && body.position.y > goal.y && body.position.y < goal.y + goal.h) {
        this.scooterWon[i] = true;
        AudioEngine.pop();
        juice(this, 'medium', body.position.x, body.position.y);
      }

      // Fail: into the river / out of time / stuck (but never while
      // riding a moving platform — the scooter is waiting for its ferry).
      const lastGround = (body as unknown as { __lastGround?: string }).__lastGround ?? '';
      if (body.position.y > 820) {
        this.fail();
        return;
      }
      if (time - this.driveStartMs > DRIVE_TIMEOUT_S * 1000) {
        this.fail();
        return;
      }
      if (grounded && lastGround !== 'moving' && time - this.lastProgressMs > STUCK_MS) {
        this.fail();
        return;
      }
      // Turbo flag is set by the collision handlers each step; clear it
      // after reading so a scooter that leaves the turbo bridge slows down.
      s.onTurbo = false;
    }
    if (allWon && this.scooters.length > 0) this.win();
  }

  private win(): void {
    if (this.state !== 'drive') return;
    this.state = 'done';
    const stars = starsFor(this.level, this.inkUsed);
    const coinsEarned = this.coinsCollected * 10 + stars * 5;
    const prev = Save.data.stars[this.levelN] ?? 0;
    Save.data.stars[this.levelN] = Math.max(prev, stars);
    Save.data.coins += coinsEarned;
    Save.data.unlocked = Math.max(Save.data.unlocked, Math.min(this.levelN + 1, 30));
    Save.data.wins += 1;
    if (this.daily) Save.markDailyDone();
    void Save.write();
    AudioEngine.win();
    juice(this, 'large', DESIGN_W / 2, 400);
    this.time.delayedCall(700, () => {
      this.scene.start('Result', {
        level: this.levelN, win: true, stars,
        coinsEarned, coinsCollected: this.coinsCollected, daily: this.daily,
      });
    });
  }

  private fail(): void {
    if (this.state !== 'drive') return;
    this.state = 'done';
    AudioEngine.fail();
    this.time.delayedCall(450, () => {
      this.scene.start('Result', {
        level: this.levelN, win: false, stars: 0,
        coinsEarned: 0, coinsCollected: this.coinsCollected, daily: this.daily,
      });
    });
  }

  // ---------- test handle (test build only; tree-shaken from prod) ----------

  testGetState(): Record<string, unknown> {
    return {
      level: this.levelN,
      state: this.state,
      inkLeft: this.inkLeft,
      inkBudget: this.inkBudget,
      inkUsed: this.inkUsed,
      strokes: this.strokes.length,
      coinsCollected: this.coinsCollected,
      scooters: this.scooters.map((s) => ({
        x: Math.round(s.body.position.x),
        y: Math.round(s.body.position.y),
        vx: +s.body.velocity.x.toFixed(2),
        vy: +s.body.velocity.y.toFixed(2),
        angle: +s.body.angle.toFixed(3),
      })),
      won: [...this.scooterWon],
    };
  }

  /** Programmatic stroke: same path as a finger draw (ink type is per level). */
  testDrawLine(points: Pt[], _ink: InkType = 'wood'): void {
    if (this.state !== 'draw') return;
    this.drawPoints = points.map((p) => ({ ...p }));
    this.drawGfx = this.add.graphics().setDepth(1);
    this.drawing = true;
    this.finishStroke();
  }

  testLaunch(): void {
    this.play();
  }

  /** The level's solution strokes (points + the level's ink type). */
  testSolution(): unknown {
    return this.level.solution.map((pts) => ({ points: pts, ink: this.level.inkType }));
  }

  /** Test only: physics time scale (speed up headless playback). */
  testSetTimeScale(scale: number): void {
    this.matter.world.engine.timing.timeScale = scale;
  }

  // ---------- pause ----------

  pauseGame(): void {
    if (this.state !== 'draw' && this.state !== 'drive') return;
    this.prevState = this.state;
    this.state = 'paused';
    this.matter.world.pause();
    const dim = this.add.rectangle(0, 0, DESIGN_W, DESIGN_H, 0x141414, 0.55).setOrigin(0).setDepth(20);
    const card = this.add.graphics().setDepth(21);
    card.fillStyle(COLORS.cream, 1);
    card.fillRoundedRect(DESIGN_W / 2 - 150, 300, 300, 300, 24);
    card.lineStyle(4, 0x141414, 1);
    card.strokeRoundedRect(DESIGN_W / 2 - 150, 300, 300, 300, 24);
    const title = this.add.text(DESIGN_W / 2, 350, t('pause'), headingStyle(32)).setOrigin(0.5).setDepth(22);
    const resume = makeButton(this, DESIGN_W / 2, 420, {
      w: 220, h: 60, fontSize: 24, label: t('resume'), color: COLORS.leaf,
      onClick: () => this.resumeGame(),
    });
    const restart = makeButton(this, DESIGN_W / 2, 496, {
      w: 220, h: 60, fontSize: 24, label: t('restart'), color: COLORS.sea,
      onClick: () => this.scene.restart({ level: this.levelN, daily: this.daily }),
    });
    const quit = makeButton(this, DESIGN_W / 2, 572, {
      w: 220, h: 60, fontSize: 24, label: t('menu'), color: COLORS.coral,
      onClick: () => this.scene.start('Menu'),
    });
    this.pausedOverlay = [dim, card, title, resume, restart, quit];
  }

  private resumeGame(): void {
    for (const o of this.pausedOverlay) o.destroy();
    this.pausedOverlay = [];
    this.matter.world.resume();
    this.state = this.prevState;
  }
}
