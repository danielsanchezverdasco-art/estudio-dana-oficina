// Game: draw ramps with limited ink, launch the crash-test dummy, chain
// the collisions. Matter.js physics, design space 390x844 (camera zooms to
// fit). States: draw -> launched -> won/lost. Fans push, dynamite blasts,
// portals flip gravity. Win = any dummy part enters the flag sensor.
//
// ROUND 2 (option C — COMIC): platforms are grey comic slabs with thick
// black outlines and hatch; ramps are hand-drawn navy with crosshatch
// (drawComicRamp); the HUD is comic bubbles; juice follows the r2 budget
// (plan-dificultad-r2.md §6): one moment of satisfaction per action,
// medium-high band, the biggest effects only for the win.
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { drawComicPlatform, drawComicRamp } from '../comic';
import { t } from '../i18n';
import { getLevel, LEVEL_COUNT, type InkType, type LevelDef } from '../levels';
import { buildRagdoll, ragdollCentre, ragdollStill, releaseRagdoll, type Ragdoll } from '../ragdoll';
import { Save } from '../save';
import { SKINS } from '../skins';
import { COLORS, bodyStyle, headingStyle, juice, makeButton, makeIconButton } from '../ui';

const DESIGN_W = 390;
const DESIGN_H = 844;
const GOAL_R = 40;
const RAMP_THICK = 10;
const LAUNCH_TIMEOUT = 20; // seconds
const STILL_SECONDS = 1.2;
const FAN_ACCEL = 0.003; // px/ms^2 per force unit (3x gravity at force 1)
const MAX_RISE_SPEED = 8; // px/step cap for fan lift
const MAX_FAN_VX = 2.8; // px/step cap for horizontal fan drift

const INK_COLORS: Record<InkType, number> = {
  standard: COLORS.steel,
  elastic: COLORS.elastic,
  boost: COLORS.boost,
};
const INK_FRICTION: Record<InkType, number> = { standard: 0.1, elastic: 0.15, boost: 0.02 };
const INK_RESTITUTION: Record<InkType, number> = { standard: 0.05, elastic: 0.9, boost: 0.05 };

/** Teaching hint per level (onboarding-and-teaching: one line, zero
 * reading beyond the level itself). Only on the level where a mechanic
 * first appears. */
const HINTS: Record<number, string> = {
  6: 'hintFan',
  8: 'hintBounce',
  10: 'hintBoost',
  12: 'hintDynamite',
  18: 'hintPortal',
};

interface Stroke {
  points: { x: number; y: number }[];
  ink: InkType;
  bodies: MatterJS.BodyType[];
  gfx: Phaser.GameObjects.Graphics;
  length: number;
}

interface GameData {
  level: number;
  daily?: boolean;
  extraInk?: boolean;
}

export class GameScene extends Phaser.Scene {
  private level!: LevelDef;
  private levelN = 1;
  private daily = false;
  private state: 'draw' | 'launched' | 'won' | 'lost' | 'paused' = 'draw';
  private prevState: 'draw' | 'launched' = 'draw';
  private ragdoll!: Ragdoll;
  private partImages: Phaser.GameObjects.Image[] = [];
  private strokes: Stroke[] = [];
  private inkBudget = 0;
  private inkLeft = 0;
  private inkUsed = 0;
  private currentInk: InkType = 'standard';
  private drawing = false;
  private drawPoints: { x: number; y: number }[] = [];
  private drawGfx: Phaser.GameObjects.Graphics | null = null;
  private drawTip: Phaser.GameObjects.Arc | null = null;
  private coinsCollected = 0;
  private coinBodies: { body: MatterJS.BodyType; img: Phaser.GameObjects.Image; taken: boolean }[] = [];
  private dynamiteState: { def: { x: number; y: number; angle: number; power: number }; body: MatterJS.BodyType; img: Phaser.GameObjects.Image; used: boolean }[] = [];
  private portalState: { def: { x: number; y: number; r: number; exitVx: number; exitVy: number }; body: MatterJS.BodyType; img: Phaser.GameObjects.Image; used: boolean }[] = [];
  private goalBody: MatterJS.BodyType | null = null;
  private flagImg: Phaser.GameObjects.Image | null = null;
  private launchTime = 0;
  private stillTime = 0;
  private wonAt = 0;
  private lostAt = 0;
  private gravityFlipped = false;
  private hud: Phaser.GameObjects.GameObject[] = [];
  private inkBarGfx: Phaser.GameObjects.Graphics | null = null;
  private inkText: Phaser.GameObjects.Text | null = null;
  private launchBtn: Phaser.GameObjects.Container | null = null;
  private tutorial: Phaser.GameObjects.GameObject[] = [];
  private ghostGfx: Phaser.GameObjects.Graphics | null = null;
  private pausedOverlay: Phaser.GameObjects.GameObject[] = [];
  private whooshAt = 0;
  private fanStreakAt = 0;
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
    this.coinsCollected = 0;
    this.coinBodies = [];
    this.dynamiteState = [];
    this.portalState = [];
    this.gravityFlipped = false;
    this.inkUsed = 0;
    this.stillTime = 0;
    this.whooshAt = 0;
    this.fanStreakAt = 0;
    this.tutorial = [];
    this.pausedOverlay = [];
    this.flagImg = null;
    this.hintText = null;
    this.drawTip = null;

    // Extra ink from a rewarded ad: +150 on this level, consumes one grant.
    let extra = 0;
    if (data.extraInk && Save.data.shop.extraInk > 0) {
      Save.data.shop.extraInk -= 1;
      extra = 150;
      void Save.write();
    }
    this.inkBudget = this.level.ink + extra;
    this.inkLeft = this.inkBudget;

    // Camera: design space 390x844, zoomed to fit any screen.
    const w = this.scale.width;
    const h = this.scale.height;
    const zoom = Math.min(w / DESIGN_W, h / DESIGN_H);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(DESIGN_W / 2, DESIGN_H / 2);
    this.cameras.main.setBackgroundColor(COLORS.paper);

    // Physics: fresh gravity, world bounds as safety net.
    this.matter.world.setGravity(0, 1);
    const wallOpts: MatterJS.IBodyDefinition = { isStatic: true, label: 'bounds', friction: 0 };
    this.matter.world.add(this.matter.bodies.rectangle(DESIGN_W / 2, 792, DESIGN_W + 80, 24, wallOpts));
    this.matter.world.add(this.matter.bodies.rectangle(DESIGN_W / 2, 96, DESIGN_W + 80, 24, wallOpts));
    this.matter.world.add(this.matter.bodies.rectangle(-22, DESIGN_H / 2, 24, DESIGN_H + 80, wallOpts));
    this.matter.world.add(this.matter.bodies.rectangle(DESIGN_W + 22, DESIGN_H / 2, 24, DESIGN_H + 80, wallOpts));

    this.buildBackground();
    this.buildLevel();
    this.buildDummy();
    this.buildHud();
    if (this.levelN === 1) this.buildTutorial();
    this.buildHint();

    // Input: draw on the playfield (world coords — the camera zoom is
    // already applied to pointer.worldX/worldY by Phaser).
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onPointerDown(p));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.onPointerMove(p));
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => this.onPointerUp(p));
    this.matter.world.on('collisionstart', (e: Phaser.Physics.Matter.Events.CollisionStartEvent) => this.onCollision(e));

    // NOTE: the Matter plugin shuts down BEFORE this event fires (it sets
    // world = null in its own SHUTDOWN handler), so guard every .off —
    // an unguarded this.matter.world.off() crashes the scene restart.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input?.off('pointerdown');
      this.input?.off('pointermove');
      this.input?.off('pointerup');
      this.matter.world?.off('collisionstart');
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
  }

  private buildLevel(): void {
    const L = this.level;
    // Ground + walls + shelves: comic slabs (one Graphics for all).
    const pg = this.add.graphics().setDepth(-5);
    for (const g of L.ground) {
      const body = this.matter.bodies.rectangle(g.x + g.w / 2, g.y + g.h / 2, g.w, g.h, {
        isStatic: true, label: 'ground', friction: 0.4, restitution: 0,
      });
      this.matter.world.add(body);
      drawComicPlatform(pg, g.x, g.y, g.w, Math.min(g.h, 200));
    }
    // Fans: translucent zone + prop image + drifting arrows.
    for (const f of L.fans) {
      const zone = this.add.rectangle(f.x + f.w / 2, f.y + f.h / 2, f.w, f.h, COLORS.elastic, 0.12);
      zone.setDepth(-6);
      const rad = (f.angle * Math.PI) / 180;
      const sx = f.x + f.w / 2 - Math.cos(rad) * (f.h / 2 - 10);
      const sy = f.y + f.h / 2 - Math.sin(rad) * (f.h / 2 - 10);
      const fanImg = this.add.image(sx, sy, 'prop-fan').setDisplaySize(56, 56);
      fanImg.setDepth(-3);
      fanImg.setAngle(f.angle + 90);
      this.tweens.add({ targets: fanImg, angle: fanImg.angle + 360, duration: 2400, repeat: -1 });
      // Drifting arrows in the blow direction.
      for (let i = 0; i < 3; i++) {
        const ax = f.x + f.w / 2 + Math.cos(rad) * (i - 1) * 26;
        const ay = f.y + f.h / 2 + Math.sin(rad) * (i - 1) * 26;
        const arrow = this.add.text(ax, ay, '➤', { fontSize: '22px', color: COLORS.elasticCss }).setOrigin(0.5);
        arrow.setAngle(f.angle);
        arrow.setDepth(-3);
        arrow.setAlpha(0.7);
        this.tweens.add({
          targets: arrow,
          x: ax + Math.cos(rad) * 14, y: ay + Math.sin(rad) * 14,
          duration: 700, yoyo: true, repeat: -1, delay: i * 180, ease: 'Sine.inOut',
        });
      }
    }
    // Dynamite: barrel + blast-direction arrow.
    for (const d of L.dynamite) {
      const body = this.matter.bodies.circle(d.x, d.y, 24, { isStatic: true, isSensor: true, label: 'dynamite' });
      this.matter.world.add(body);
      const img = this.add.image(d.x, d.y, 'prop-dynamite').setDisplaySize(48, 48);
      img.setDepth(-2);
      const rad = (d.angle * Math.PI) / 180;
      const arrow = this.add.graphics();
      arrow.lineStyle(3, COLORS.coral, 0.9);
      arrow.lineBetween(d.x, d.y - 30, d.x + Math.cos(rad) * 46, d.y - 30 + Math.sin(rad) * 46);
      const ah = this.add.text(d.x + Math.cos(rad) * 52, d.y - 30 + Math.sin(rad) * 52, '➤', { fontSize: '18px', color: COLORS.coralCss }).setOrigin(0.5);
      ah.setAngle(d.angle);
      this.dynamiteState.push({ def: d, body, img, used: false });
    }
    // Portals: rotating ring.
    for (const p of L.portals) {
      const body = this.matter.bodies.circle(p.x, p.y, p.r, { isStatic: true, isSensor: true, label: 'portal' });
      this.matter.world.add(body);
      const img = this.add.image(p.x, p.y, 'prop-portal').setDisplaySize(p.r * 2, p.r * 2);
      img.setDepth(-2);
      this.tweens.add({ targets: img, angle: 360, duration: 6000, repeat: -1 });
      this.portalState.push({ def: p, body, img, used: false });
    }
    // Coins: bobbing.
    for (const c of L.coins) {
      const body = this.matter.bodies.circle(c.x, c.y, 16, { isStatic: true, isSensor: true, label: 'coin' });
      this.matter.world.add(body);
      const img = this.add.image(c.x, c.y, 'coin').setDisplaySize(28, 32);
      img.setDepth(-2);
      this.tweens.add({ targets: img, y: c.y - 5, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.coinBodies.push({ body, img, taken: false });
    }
    // Goal: checkered flag + pulsing sensor ring.
    const gx = L.goal.x;
    const gy = L.goal.y;
    const goalBody = this.matter.bodies.circle(gx, gy - 20, GOAL_R, { isStatic: true, isSensor: true, label: 'goal' });
    this.matter.world.add(goalBody);
    this.goalBody = goalBody;
    const flag = this.add.image(gx, gy, 'prop-flag').setDisplaySize(44, 62).setOrigin(0.5, 1);
    flag.setDepth(-2);
    this.flagImg = flag;
    const ring = this.add.circle(gx, gy - 20, GOAL_R, 0x000000, 0);
    ring.setStrokeStyle(3, COLORS.leaf, 0.8);
    ring.setDepth(-2);
    this.tweens.add({ targets: ring, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });
    // Start marker: dashed circle under the dummy.
    const startRing = this.add.circle(L.start.x, L.start.y + 2, 34, 0x000000, 0);
    startRing.setStrokeStyle(2, COLORS.ink, 0.4);
    startRing.setDepth(-6);
  }

  private buildDummy(): void {
    const L = this.level;
    this.ragdoll = buildRagdoll(this.matter, L.start.x, L.start.y);
    const skin = SKINS.find((s) => s.id === Save.data.shop.skin) ?? SKINS[0];
    this.partImages = [];
    for (const part of this.ragdoll.parts) {
      const img = this.add.image(part.body.position.x, part.body.position.y, part.tex);
      img.setDisplaySize(part.dw, part.dh);
      img.setDepth(2);
      if (part.name.endsWith('L')) img.setFlipX(true);
      if (part.name === 'head' || part.name === 'torso') img.setTint(skin.tint);
      this.partImages.push(img);
    }
    for (const c of this.ragdoll.constraints) this.matter.world.add(c);
    for (const b of this.ragdoll.bodies) this.matter.world.add(b);
  }

  private buildHud(): void {
    const cx = DESIGN_W / 2;
    // Top bar: comic LEVEL bubble, coins pill, pause.
    const bubble = this.add.graphics();
    bubble.fillStyle(COLORS.sun, 1);
    bubble.fillRoundedRect(12, 8, 116, 38, 19);
    bubble.lineStyle(4, 0x141414, 1);
    bubble.strokeRoundedRect(12, 8, 116, 38, 19);
    const levelLabel = this.add
      .text(70, 27, `${t('level')} ${this.levelN}`, headingStyle(20, COLORS.inkCss))
      .setOrigin(0.5);
    const pill = this.add.graphics();
    pill.fillStyle(COLORS.cream, 1);
    pill.fillRoundedRect(cx - 62, 8, 124, 38, 19);
    pill.lineStyle(4, 0x141414, 1);
    pill.strokeRoundedRect(cx - 62, 8, 124, 38, 19);
    const coinIcon = this.add.image(cx - 38, 27, 'coin').setDisplaySize(26, 30);
    const coinsText = this.add
      .text(cx - 20, 27, `${Save.data.coins}`, { fontFamily: 'Lilita One, "Arial Black", sans-serif', fontSize: '22px', color: COLORS.inkCss })
      .setOrigin(0, 0.5);
    const pauseBtn = makeIconButton(this, DESIGN_W - 34, 26, 24, 'II', () => this.pauseGame());
    this.hud.push(bubble, levelLabel, pill, coinIcon, coinsText, pauseBtn);

    // Ink bar (y 684): label + striped fill bar + remaining number.
    const inkLabel = this.add.text(20, 684, t('ink'), bodyStyle(16)).setOrigin(0, 0.5);
    this.inkBarGfx = this.add.graphics();
    this.inkText = this.add.text(320, 684, `${Math.round(this.inkLeft)}`, bodyStyle(16)).setOrigin(0, 0.5);
    this.hud.push(inkLabel, this.inkBarGfx, this.inkText);

    const types: { id: InkType; label: string; color: number }[] = [
      { id: 'standard', label: 'STEEL', color: COLORS.steel },
      { id: 'elastic', label: 'BOUNCY', color: COLORS.elastic },
      { id: 'boost', label: 'BOOST', color: COLORS.boost },
    ];
    types.forEach((ty, i) => {
      const bx = cx + (i - 1) * 112;
      const btn = makeButton(this, bx, 724, {
        w: 104, h: 40, fontSize: 16,
        label: ty.label,
        color: this.currentInk === ty.id ? ty.color : 0x94a3b8,
        onClick: () => {
          this.currentInk = ty.id;
          this.buildHudTypes();
        },
      });
      btn.setData('inkType', ty.id);
      this.hud.push(btn);
    });

    // Buttons row: UNDO / LAUNCH / CLEAR.
    const undoBtn = makeButton(this, 52, 796, {
      w: 84, h: 56, fontSize: 17, label: t('undo'), color: COLORS.steel,
      onClick: () => this.undoStroke(),
    });
    const clearBtn = makeButton(this, DESIGN_W - 52, 796, {
      w: 84, h: 56, fontSize: 17, label: t('clear'), color: COLORS.coral,
      onClick: () => this.clearStrokes(),
    });
    this.launchBtn = makeButton(this, cx, 796, {
      w: 180, h: 72, fontSize: 28, label: t('launch'), color: COLORS.leaf,
      onClick: () => this.launch(),
    });
    this.hud.push(undoBtn, clearBtn, this.launchBtn);
    this.updateInkBar();
  }

  /** Re-colour the ink-type buttons after a selection change. */
  private buildHudTypes(): void {
    for (const o of this.hud) {
      const c = o as Phaser.GameObjects.Container;
      const ty = c.getData?.('inkType') as InkType | undefined;
      if (!ty) continue;
      const g = c.getAt(0) as Phaser.GameObjects.Graphics;
      const color = this.currentInk === ty ? INK_COLORS[ty] : 0x94a3b8;
      g.clear();
      const w = 104;
      const h = 40;
      const r = Math.min(22, h / 2 - 2);
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(-w / 2 + 2, -h / 2 + 5, w, h, r);
      g.fillStyle(color, 1);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
      g.fillStyle(0xffffff, 0.22);
      g.fillRoundedRect(-w / 2, -h / 2, w, Math.max(10, h * 0.28), { tl: r, tr: r, bl: 0, br: 0 });
      g.lineStyle(4, 0x141414, 1);
      g.strokeRoundedRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4, r);
    }
  }

  private buildTutorial(): void {
    const sol = this.level.solution[0].pts;
    // Ghost ramp: dotted line along the solution.
    const ghost = this.add.graphics();
    ghost.setDepth(1);
    ghost.lineStyle(4, COLORS.leaf, 0.7);
    for (let i = 0; i < sol.length - 1; i++) {
      const [x1, y1] = sol[i];
      const [x2, y2] = sol[i + 1];
      const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 12);
      for (let s = 0; s < steps; s++) {
        const px = x1 + ((x2 - x1) * s) / steps;
        const py = y1 + ((y2 - y1) * s) / steps;
        ghost.fillStyle(COLORS.leaf, 0.7);
        ghost.fillCircle(px, py, 3);
      }
    }
    this.ghostGfx = ghost;
    const [hx, hy] = sol[0];
    const hand = this.add.image(hx + 30, hy - 40, 'hand').setDisplaySize(64, 64);
    hand.setDepth(3);
    this.tweens.add({ targets: hand, x: hx + 44, y: hy - 28, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const text = this.add
      .text(DESIGN_W / 2, 150, t('tutorialDraw'), headingStyle(22, COLORS.inkCss))
      .setOrigin(0.5);
    text.setDepth(3);
    this.tutorial.push(ghost, hand, text);
  }

  private hideTutorial(): void {
    for (const o of this.tutorial) o.destroy();
    this.tutorial = [];
    this.ghostGfx = null;
  }

  /** One-line teaching hint on the levels where a mechanic first appears. */
  private buildHint(): void {
    const key = HINTS[this.levelN];
    if (!key) return;
    const text = this.add
      .text(DESIGN_W / 2, 120, t(key), headingStyle(17, COLORS.inkCss))
      .setOrigin(0.5);
    text.setWordWrapWidth(340);
    text.setAlign('center');
    text.setDepth(3);
    this.hintText = text;
  }

  private hideHint(): void {
    this.hintText?.destroy();
    this.hintText = null;
  }

  // ---------- drawing ----------

  private inPlayfield(p: Phaser.Input.Pointer): boolean {
    const x = p.worldX;
    const y = p.worldY;
    // Drawing zone ends at y=660 so taps on the ink-type buttons (y 724)
    // and the bottom row (y 796) never start a stroke.
    return x >= 0 && x <= DESIGN_W && y >= 110 && y <= 660;
  }

  private onPointerDown(p: Phaser.Input.Pointer): void {
    if (this.state !== 'draw') return;
    if (!this.inPlayfield(p)) return;
    if (this.inkLeft <= 0) {
      AudioEngine.fail();
      return;
    }
    this.drawing = true;
    this.drawPoints = [{ x: p.worldX, y: p.worldY }];
    this.drawGfx = this.add.graphics().setDepth(1);
    // Glowing tip: a bright dot that follows the finger while drawing.
    this.drawTip = this.add.circle(p.worldX, p.worldY, 7, 0xffffff, 0.9).setDepth(2);
    AudioEngine.drawStart();
    this.hideTutorial();
  }

  private onPointerMove(p: Phaser.Input.Pointer): void {
    if (!this.drawing || !this.drawGfx) return;
    const last = this.drawPoints[this.drawPoints.length - 1];
    const dx = p.worldX - last.x;
    const dy = p.worldY - last.y;
    if (Math.hypot(dx, dy) < 8) return;
    // Clamp the stroke to the remaining ink.
    const segLen = Math.hypot(dx, dy);
    if (segLen > this.inkLeft) {
      const f = this.inkLeft / segLen;
      this.drawPoints.push({ x: last.x + dx * f, y: last.y + dy * f });
      this.drawStrokePreview();
      this.finishStroke();
      return;
    }
    this.drawPoints.push({ x: p.worldX, y: p.worldY });
    this.drawTip?.setPosition(p.worldX, p.worldY);
    this.drawStrokePreview();
  }

  private drawStrokePreview(): void {
    const g = this.drawGfx;
    if (!g) return;
    g.clear();
    drawComicRamp(g, this.drawPoints, this.currentInk);
  }

  private onPointerUp(_p: Phaser.Input.Pointer): void {
    if (!this.drawing) return;
    this.finishStroke();
  }

  private finishStroke(): void {
    this.drawing = false;
    AudioEngine.drawStop();
    this.drawTip?.destroy();
    this.drawTip = null;
    const pts = this.drawPoints;
    this.drawPoints = [];
    const gfx = this.drawGfx;
    this.drawGfx = null;
    if (pts.length < 2 || !gfx) {
      gfx?.destroy();
      return;
    }
    let length = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      length += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    }
    length = Math.min(length, this.inkLeft);
    this.addStroke(pts, this.currentInk, gfx, length);
  }

  /** Build the Matter bodies for a stroke and register it (shared by the
   * pointer path and the test handle). */
  private addStroke(
    pts: { x: number; y: number }[],
    ink: InkType,
    gfx: Phaser.GameObjects.Graphics,
    length: number,
  ): void {
    const bodies: MatterJS.BodyType[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      if (len < 2) continue;
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const body = this.matter.bodies.rectangle(
        (a.x + b.x) / 2, (a.y + b.y) / 2, len + 4, RAMP_THICK,
        {
          isStatic: true, angle,
          label: 'ramp',
          friction: INK_FRICTION[ink],
          restitution: INK_RESTITUTION[ink],
        },
      );
      // Boost ramps push along their downhill direction.
      const downhill = b.y >= a.y ? { x: b.x - a.x, y: b.y - a.y } : { x: a.x - b.x, y: a.y - b.y };
      const dl = Math.hypot(downhill.x, downhill.y) || 1;
      body.plugin = { inkType: ink, dirX: downhill.x / dl, dirY: downhill.y / dl };
      this.matter.world.add(body);
      bodies.push(body);
    }
    this.strokes.push({ points: pts, ink, bodies, gfx, length });
    this.inkUsed += length;
    this.inkLeft = Math.max(0, this.inkBudget - this.inkUsed);
    this.updateInkBar();
    if (this.inkLeft <= 0) {
      this.inkText?.setText(t('outOfInk'));
    }
  }

  private undoStroke(): void {
    if (this.state !== 'draw') return;
    const s = this.strokes.pop();
    if (!s) return;
    for (const b of s.bodies) this.matter.world.remove(b);
    s.gfx.destroy();
    this.inkUsed -= s.length;
    this.inkLeft = this.inkBudget - this.inkUsed;
    this.updateInkBar();
    AudioEngine.click();
  }

  private clearStrokes(): void {
    if (this.state !== 'draw') return;
    while (this.strokes.length > 0) this.undoStroke();
  }

  private updateInkBar(): void {
    const g = this.inkBarGfx;
    if (!g) return;
    const frac = this.inkBudget > 0 ? this.inkLeft / this.inkBudget : 0;
    const fillW = 240 * frac;
    g.clear();
    // Bar frame (comic: thick black outline) + dark track.
    g.fillStyle(0x141414, 1);
    g.fillRoundedRect(68, 676, 244, 16, 8);
    g.fillStyle(0x3a3a3a, 1);
    g.fillRoundedRect(70, 678, 240, 12, 6);
    if (fillW > 2) {
      g.fillStyle(frac < 0.25 ? COLORS.coral : COLORS.steel, 1);
      g.fillRoundedRect(70, 678, fillW, 12, 6);
      // Diagonal stripes on the filled part (the mockup's INK bar).
      g.lineStyle(2, 0xffffff, 0.4);
      for (let x = 74; x < 70 + fillW - 4; x += 12) {
        g.lineBetween(x, 690, x + 6, 678);
      }
    }
    this.inkText?.setText(`${Math.round(this.inkLeft)}`);
  }

  // ---------- launch / run ----------

  private launch(): void {
    if (this.state !== 'draw') return;
    if (this.strokes.length === 0) {
      AudioEngine.fail();
      return;
    }
    this.state = 'launched';
    this.launchTime = this.time.now;
    this.stillTime = 0;
    releaseRagdoll(this.matter, this.ragdoll);
    // Gentle forward nudge: the dummy spawns at the platform edge (x=88)
    // and must tip onto the ramp that starts there — without it, a
    // released ragdoll just stands on the flat platform forever.
    for (const part of this.ragdoll.bodies) {
      this.matter.body.setVelocity(part, { x: 1.2, y: 0 });
    }
    AudioEngine.unlock();
    this.launchBtn?.setAlpha(0.4);
    this.hideTutorial();
    this.hideHint();
    // Juice: whoosh + dust at the spawn + a short camera shake (80 ms).
    const s = this.level.start;
    const dust = this.add.particles(s.x, s.y, 'dot', {
      speed: { min: 30, max: 120 },
      angle: { min: 200, max: 340 },
      lifespan: 500,
      scale: { start: 1, end: 0 },
      quantity: 10,
      tint: [0xd8c49a, 0xffffff],
      emitting: false,
    });
    dust.explode(10);
    this.time.delayedCall(600, () => dust.destroy());
    if (Save.data.settings.shake) this.cameras.main.shake(80, 0.006);
    AudioEngine.whoosh();
  }

  private onCollision(e: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
    for (const pair of e.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      const isDummy = (l: string): boolean => l.startsWith('dummy-');
      const other = isDummy(a.label) ? b : isDummy(b.label) ? a : null;
      if (!other) continue;
      if (other.label === 'goal' && this.state === 'launched') {
        this.winLevel();
      } else if (other.label === 'coin') {
        const coin = this.coinBodies.find((c) => c.body === other && !c.taken);
        if (coin) {
          coin.taken = true;
          this.coinsCollected += 1;
          this.matter.world.remove(coin.body);
          coin.img.destroy();
          AudioEngine.coin();
          juice(this, 'small', coin.body.position.x, coin.body.position.y);
        }
      } else if (other.label === 'dynamite') {
        const dyn = this.dynamiteState.find((d) => d.body === other && !d.used);
        if (dyn) this.explode(dyn);
      } else if (other.label === 'portal') {
        const por = this.portalState.find((p) => p.body === other && !p.used);
        if (por) this.enterPortal(por);
      } else if (other.label === 'ramp') {
        const plugin = (other as MatterJS.BodyType).plugin as { inkType?: InkType; dirX?: number; dirY?: number } | undefined;
        if (plugin?.inkType === 'boost' && this.state === 'launched') {
          const part = isDummy(a.label) ? a : b;
          const vx = part.velocity.x + (plugin.dirX ?? 0) * 2.5;
          const vy = part.velocity.y + (plugin.dirY ?? 0) * 2.5;
          const speed = Math.hypot(vx, vy);
          const cap = 14;
          const f = speed > cap ? cap / speed : 1;
          this.matter.body.setVelocity(part, { x: vx * f, y: vy * f });
        } else if (plugin?.inkType === 'elastic' && this.state === 'launched') {
          AudioEngine.boing();
          // Juice: squash the dummy + an expanding ring at the bounce.
          for (const img of this.partImages) {
            this.tweens.add({ targets: img, scaleY: 0.7, duration: 90, yoyo: true, ease: 'Quad.easeOut' });
          }
          const ring = this.add.circle(other.position.x, other.position.y, 10, 0x000000, 0);
          ring.setStrokeStyle(4, COLORS.elastic, 1);
          ring.setDepth(3);
          this.tweens.add({
            targets: ring, scaleX: 2.4, scaleY: 2.4, alpha: 0,
            duration: 320, onComplete: () => ring.destroy(),
          });
        }
      }
    }
  }

  private explode(dyn: { def: { x: number; y: number; angle: number; power: number }; body: MatterJS.BodyType; img: Phaser.GameObjects.Image; used: boolean }): void {
    dyn.used = true;
    this.matter.world.remove(dyn.body);
    dyn.img.destroy();
    const rad = (dyn.def.angle * Math.PI) / 180;
    const vx = Math.cos(rad) * dyn.def.power;
    const vy = Math.sin(rad) * dyn.def.power;
    for (const part of this.ragdoll.bodies) {
      this.matter.body.setVelocity(part, { x: vx, y: vy });
    }
    AudioEngine.explosion();
    juice(this, 'large', dyn.def.x, dyn.def.y);
    // Comic "BOOM!" starburst.
    const boom = this.add
      .text(dyn.def.x, dyn.def.y - 30, t('boom'), {
        fontFamily: 'Lilita One, "Arial Black", sans-serif',
        fontSize: '44px',
        color: '#e23b2e',
        stroke: '#141414',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(5);
    boom.setScale(0.4);
    this.tweens.add({ targets: boom, scaleX: 1.25, scaleY: 1.25, duration: 160, ease: 'Back.easeOut' });
    this.tweens.add({ targets: boom, alpha: 0, y: dyn.def.y - 70, duration: 500, delay: 200, onComplete: () => boom.destroy() });
  }

  private enterPortal(por: { def: { x: number; y: number; r: number; exitVx: number; exitVy: number }; body: MatterJS.BodyType; img: Phaser.GameObjects.Image; used: boolean }): void {
    por.used = true;
    this.matter.world.remove(por.body);
    por.img.setAlpha(0.35);
    this.gravityFlipped = !this.gravityFlipped;
    this.matter.world.setGravity(0, this.gravityFlipped ? -1 : 1);
    for (const part of this.ragdoll.bodies) {
      this.matter.body.setVelocity(part, { x: por.def.exitVx, y: por.def.exitVy });
    }
    AudioEngine.portal();
    juice(this, 'medium', por.def.x, por.def.y);
    this.cameras.main.flash(120, 37, 99, 235);
    // Stretch the dummy as it crosses (no motion sickness: 150 ms).
    for (const img of this.partImages) {
      this.tweens.add({ targets: img, scaleY: 1.3, scaleX: 0.85, duration: 150, yoyo: true, ease: 'Quad.easeOut' });
    }
  }

  private winLevel(): void {
    if (this.state !== 'launched') return;
    this.state = 'won';
    this.wonAt = this.time.now;
    AudioEngine.win();
    const c = ragdollCentre(this.ragdoll);
    // Win juice (the biggest bundle, reserved for the win): confetti,
    // slow-mo 0.3 s, waving flag. No hit-stop here — slow-mo instead.
    const confetti = this.add.particles(c.x, c.y - 40, 'dot', {
      speed: { min: 100, max: 320 },
      angle: { min: 230, max: 310 },
      lifespan: 900,
      gravityY: 320,
      scale: { start: 1.1, end: 0 },
      quantity: 40,
      tint: [COLORS.sun, COLORS.coral, COLORS.leaf, COLORS.elastic, COLORS.white],
      emitting: false,
    });
    confetti.explode(40);
    this.time.delayedCall(1000, () => confetti.destroy());
    this.time.timeScale = 0.35;
    window.setTimeout(() => {
      if (this.scene.isActive()) this.time.timeScale = 1;
    }, 300);
    if (this.flagImg) {
      this.tweens.add({ targets: this.flagImg, angle: -8, duration: 220, yoyo: true, repeat: 3, ease: 'Sine.inOut' });
    }
    if (Save.data.settings.shake) this.cameras.main.shake(260, 0.012);
  }

  private loseLevel(): void {
    if (this.state !== 'launched') return;
    this.state = 'lost';
    this.lostAt = this.time.now;
    AudioEngine.fail();
    // Defeat: fade to grey; the Result scene (retry) arrives in < 2 s.
    const grey = this.add.rectangle(0, 0, DESIGN_W, DESIGN_H, 0x141414, 0.3).setOrigin(0).setDepth(10);
    void grey;
  }

  update(_time: number, delta: number): void {
    // Sync dummy visuals to physics bodies.
    for (let i = 0; i < this.ragdoll.parts.length; i++) {
      const part = this.ragdoll.parts[i];
      const img = this.partImages[i];
      if (img) img.setPosition(part.body.position.x, part.body.position.y).setRotation(part.body.angle);
    }
    if (this.state !== 'launched') {
      if (this.state === 'won' && this.time.now - this.wonAt > 900) this.finishWin();
      else if (this.state === 'lost' && this.time.now - this.lostAt > 900) this.finishLose();
      return;
    }
    // Fans: push parts inside the zone, cap the rise speed.
    // The horizontal speed is also capped (MAX_FAN_VX) so an angled fan
    // lifts and drifts the dummy onto the goal instead of rocketing it
    // off the board (L13 lesson: uncapped vx reached 11 and flew past
    // the platform; a vertical fan alone leaves it short of the goal).
    let inFan = false;
    for (const f of this.level.fans) {
      const rad = (f.angle * Math.PI) / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);
      for (const part of this.ragdoll.bodies) {
        const p = part.position;
        if (p.x >= f.x && p.x <= f.x + f.w && p.y >= f.y && p.y <= f.y + f.h) {
          inFan = true;
          this.matter.body.applyForce(part, p, {
            x: dx * part.mass * FAN_ACCEL * f.force,
            y: dy * part.mass * FAN_ACCEL * f.force,
          });
          if (dy < 0 && part.velocity.y < -MAX_RISE_SPEED) {
            this.matter.body.setVelocity(part, { x: part.velocity.x, y: -MAX_RISE_SPEED });
          }
          if (Math.abs(part.velocity.x) > MAX_FAN_VX) {
            this.matter.body.setVelocity(part, {
              x: Math.sign(part.velocity.x) * MAX_FAN_VX,
              y: part.velocity.y,
            });
          }
          if (this.time.now - this.whooshAt > 1200) {
            this.whooshAt = this.time.now;
            AudioEngine.whoosh();
          }
        }
      }
    }
    // Fan juice: air streaks while the dummy rides the wind.
    if (inFan && this.time.now - this.fanStreakAt > 450) {
      this.fanStreakAt = this.time.now;
      const c = ragdollCentre(this.ragdoll);
      const streaks = this.add.particles(c.x, c.y, 'dot', {
        speed: { min: 60, max: 140 },
        angle: { min: 250, max: 290 },
        lifespan: 350,
        scale: { start: 0.7, end: 0 },
        quantity: 4,
        tint: 0xffffff,
        alpha: 0.7,
        emitting: false,
      });
      streaks.explode(4);
      this.time.delayedCall(450, () => streaks.destroy());
    }
    // Lose checks.
    const elapsed = (this.time.now - this.launchTime) / 1000;
    const centre = ragdollCentre(this.ragdoll);
    if (centre.y > 860 || centre.y < 60 || centre.x < -40 || centre.x > DESIGN_W + 40) {
      this.loseLevel();
      return;
    }
    if (elapsed > LAUNCH_TIMEOUT) {
      this.loseLevel();
      return;
    }
    if (elapsed > 1 && ragdollStill(this.ragdoll)) {
      this.stillTime += delta;
      if (this.stillTime > STILL_SECONDS * 1000) this.loseLevel();
    } else {
      this.stillTime = 0;
    }
  }

  private finishWin(): void {
    // r2: 2 stars = ink <= par x 1.25 (plan §2 rule 2; r1 used 1.4).
    const stars = this.inkUsed <= this.level.par ? 3 : this.inkUsed <= this.level.par * 1.25 ? 2 : 1;
    const coinsEarned = 25 + (stars === 3 ? 25 : 0) + this.coinsCollected * 25;
    const prevStars = Save.data.stars[this.levelN] ?? 0;
    Save.data.stars[this.levelN] = Math.max(prevStars, stars);
    Save.data.coins += coinsEarned;
    Save.data.wins += 1;
    if (this.levelN < LEVEL_COUNT) {
      Save.data.unlocked = Math.max(Save.data.unlocked, this.levelN + 1);
    }
    if (this.daily) Save.markDailyDone();
    void Save.write();
    // Interstitial at a natural pause: every 2nd win, never level 1.
    if (Save.data.wins >= 2 && Save.data.wins % 2 === 0 && this.levelN > 1) {
      this.tryInterstitial();
    }
    this.scene.start('Result', {
      level: this.levelN, win: true, stars, coinsEarned,
      coinsCollected: this.coinsCollected, daily: this.daily,
    });
  }

  private finishLose(): void {
    this.scene.start('Result', {
      level: this.levelN, win: false, stars: 0, coinsEarned: 0,
      coinsCollected: this.coinsCollected, daily: this.daily,
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
    if (this.state === 'paused') return;
    if (this.state !== 'draw' && this.state !== 'launched') return;
    this.prevState = this.state;
    this.state = 'paused';
    this.matter.world.pause();
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
    this.matter.world.resume();
    this.state = this.prevState;
  }

  // ---------- test handle (test build only) ----------

  testGetState(): Record<string, unknown> {
    return {
      scene: 'Game',
      level: this.levelN,
      state: this.state,
      inkBudget: this.inkBudget,
      inkLeft: Math.round(this.inkLeft),
      inkUsed: Math.round(this.inkUsed),
      par: this.level.par,
      strokes: this.strokes.length,
      dummy: this.ragdoll.bodies.map((b) => ({ x: Math.round(b.position.x), y: Math.round(b.position.y), v: +b.speed.toFixed(2) })),
      coinsCollected: this.coinsCollected,
      gravityFlipped: this.gravityFlipped,
      dynamiteUsed: this.dynamiteState.filter((d) => d.used).length,
      portalsUsed: this.portalState.filter((p) => p.used).length,
      goal: this.goalBody ? { x: Math.round(this.goalBody.position.x), y: Math.round(this.goalBody.position.y) } : null,
    };
  }

  testDrawLine(points: { x: number; y: number }[], ink: InkType = 'standard'): void {
    if (this.state !== 'draw') return;
    if (points.length < 2) return;
    const gfx = this.add.graphics().setDepth(1);
    drawComicRamp(gfx, points, ink);
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
      length += Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
    }
    this.addStroke(points, ink, gfx, Math.min(length, this.inkLeft));
  }

  testLaunch(): void {
    this.launch();
  }

  testSolution(): { pts: [number, number][]; ink: InkType }[] {
    return this.level.solution;
  }

  /** Test only: run the physics faster (SwiftShader headless is slow).
   * Never called from production code; the test handle is tree-shaken
   * out of the production build. */
  testSetTimeScale(scale: number): void {
    const engine = this.matter.world.engine as unknown as { timing?: { timeScale?: number } };
    if (engine.timing) engine.timing.timeScale = scale;
  }
}
