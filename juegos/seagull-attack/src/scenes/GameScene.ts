// Game: draw a line to shield the sandwich from diving gulls for 10 s.
// - Line = player-drawn segments, ink budget per level (anti-square math:
//   a box around the sandwich needs ~700 px; budget is 260-420 px).
// - Gulls dive at the sandwich; a line segment bounces them (reflect the
//   velocity about the segment normal). Anti-tunnel: max gull speed 370 px/s
//   = 6.2 px/frame, far below the collision radius (30 + 7 px).
// - 3 crumbs (hits); pelican boss every 10th level (3 HP, steals 2 crumbs).
// - Umbrella (L16+) is a no-draw zone; wind (L6+) pushes gulls sideways.
// - Coins float in the level, tappable for +10 each.
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { currentLang, t } from '../i18n';
import { gullSize, isLandscape, playBottom, playTop, sandwichAnchor, sandwichSize } from '../layout';
import { GULL_RADIUS, LEVEL_TIME, LINE_WIDTH, levelDef, type LevelDef } from '../levels';
import { Save } from '../save';
import { COLORS, bodyStyle, drawStar, headingStyle, juice, makeButton, makeIconButton } from '../ui';

interface Gull {
  img: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
  state: 'diving' | 'fleeing' | 'stunned' | 'gone';
  phase: number;
  hp: number;
  isPelican: boolean;
  stunT: number;
}

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface LevelCoin {
  img: Phaser.GameObjects.Image;
  taken: boolean;
}

function distToSegment(px: number, py: number, s: Seg): { d: number; cx: number; cy: number } {
  const dx = s.x2 - s.x1;
  const dy = s.y2 - s.y1;
  const len2 = dx * dx + dy * dy;
  let tt = len2 === 0 ? 0 : ((px - s.x1) * dx + (py - s.y1) * dy) / len2;
  tt = Math.max(0, Math.min(1, tt));
  const cx = s.x1 + tt * dx;
  const cy = s.y1 + tt * dy;
  return { d: Math.hypot(px - cx, py - cy), cx, cy };
}

function segHitsCircle(s: Seg, cx: number, cy: number, r: number): boolean {
  return distToSegment(cx, cy, s).d < r;
}

const TOWELS: Record<string, number> = { red: 0xe63946, blue: 0x2a6fdb, yellow: 0xffc93c };

export class GameScene extends Phaser.Scene {
  private level = 1;
  private isDaily = false;
  private def!: LevelDef;
  private state: 'playing' | 'paused' | 'won' | 'lost' = 'playing';
  private crumbs = 3;
  private inkLeft = 0;
  private inkMax = 1;
  private timeLeft = LEVEL_TIME;
  private lastTimerShown = -1;
  private segments: Seg[] = [];
  private drawing = false;
  private lastPt: { x: number; y: number } | null = null;
  private gulls: Gull[] = [];
  private spawnCount = 0;
  private spawnEvent: Phaser.Time.TimerEvent | null = null;
  private coins: LevelCoin[] = [];
  private coinsCollected = 0;
  private resultSent = false;

  private bg!: Phaser.GameObjects.Image;
  private towelG!: Phaser.GameObjects.Graphics;
  private sandwich!: Phaser.GameObjects.Image;
  private topperG!: Phaser.GameObjects.Graphics;
  private umbrellaG!: Phaser.GameObjects.Graphics | null;
  private umbrella: { x: number; y: number; r: number } | null = null;
  private lineG!: Phaser.GameObjects.Graphics;
  private timerText!: Phaser.GameObjects.Text;
  private crumbImgs: Phaser.GameObjects.Image[] = [];
  private inkBarG!: Phaser.GameObjects.Graphics;
  private inkBarW = 200;
  private coinsText!: Phaser.GameObjects.Text;
  private hand: Phaser.GameObjects.Image | null = null;
  private hintText: Phaser.GameObjects.Text | null = null;
  private handBaseY = 0;
  private tutorialDone = false;
  private pausePanel: Phaser.GameObjects.Container | null = null;
  private windFx: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private sandwichPos = { x: 0, y: 0 };

  constructor() {
    super('Game');
  }

  create(data: { level: number; daily?: boolean; extraInk?: boolean }): void {
    this.level = data.level;
    this.isDaily = !!data.daily;
    this.def = levelDef(this.level);
    this.state = 'playing';
    this.crumbs = 3;
    this.inkMax = this.def.ink + (data.extraInk ? 150 : 0);
    if (data.extraInk && Save.data.shop.extraInk > 0) {
      Save.data.shop.extraInk -= 1;
      void Save.write();
    }
    this.inkLeft = this.inkMax;
    this.timeLeft = LEVEL_TIME;
    this.lastTimerShown = -1;
    this.segments = [];
    this.drawing = false;
    this.lastPt = null;
    this.gulls = [];
    this.spawnCount = 0;
    this.coins = [];
    this.coinsCollected = 0;
    this.resultSent = false;
    this.tutorialDone = this.level !== 1;
    this.crumbImgs = [];
    // Scene instances are reused across restarts: these must be reset here,
    // or a panel/hand/event from the previous run survives as a dangling
    // reference. (Found by the test: quitting from pause left pausePanel
    // non-null, so pauseGame() returned early on every later run and the
    // pause button was dead.)
    this.pausePanel = null;
    this.hand = null;
    this.hintText = null;
    this.spawnEvent = null;
    this.windFx = null;

    const w = this.scale.width;
    const h = this.scale.height;
    const land = isLandscape(w, h);
    this.bg = this.add.image(w / 2, h / 2, land ? 'bg-beach-land' : 'bg-beach');
    this.coverBg();

    this.towelG = this.add.graphics();
    this.sandwichPos = sandwichAnchor(w, h);
    this.drawTowel();
    const sSize = sandwichSize(w, h);
    this.sandwich = this.add.image(this.sandwichPos.x, this.sandwichPos.y, 'sandwich')
      .setDisplaySize(sSize, (sSize * 503) / 520);
    this.topperG = this.add.graphics();
    this.drawTopper();

    this.umbrellaG = null;
    this.umbrella = null;
    if (this.def.umbrella) this.drawUmbrella();

    this.lineG = this.add.graphics().setDepth(3);

    this.buildHud();
    this.spawnLevelCoins();
    this.startWind();
    this.startSpawning();
    if (this.def.pelican) {
      this.time.delayedCall(2000, () => {
        if (this.state === 'playing') this.spawnPelican();
      });
    }
    if (this.level === 1) this.startTutorial();

    this.input.addPointer(2);
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
    this.scale.on('resize', this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.onResize, this);
      this.input.off('pointerdown', this.onPointerDown, this);
      this.input.off('pointermove', this.onPointerMove, this);
      this.input.off('pointerup', this.onPointerUp, this);
      AudioEngine.drawStop();
    });
  }

  // ---------- layout ----------

  private coverBg(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const land = isLandscape(w, h);
    const key = land ? 'bg-beach-land' : 'bg-beach';
    this.bg.setTexture(key);
    const tex = this.textures.get(key).getSourceImage() as HTMLImageElement;
    const cover = Math.max(w / tex.width, h / tex.height);
    this.bg.setScale(cover).setPosition(w / 2, h / 2);
  }

  private drawTowel(): void {
    // Picnic plate under the sandwich (the shop sells its rim colour). A
    // soft ellipse, not a flat box: the beach towel is already in the
    // background art and a drawn rectangle over it looked like a UI panel.
    const g = this.towelG;
    g.clear();
    const sSize = sandwichSize(this.scale.width, this.scale.height);
    const rx = sSize * 0.62;
    const ry = sSize * 0.3;
    const cx = this.sandwichPos.x;
    const cy = this.sandwichPos.y + sSize * 0.3;
    const rim = TOWELS[Save.data.shop.towel] ?? TOWELS.red;
    g.fillStyle(0x000000, 0.22);
    g.fillEllipse(cx, cy + 6, rx, ry);
    g.fillStyle(rim, 1);
    g.fillEllipse(cx, cy, rx, ry);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(cx, cy, rx * 0.8, ry * 0.74);
    g.lineStyle(2, 0xffffff, 0.7);
    g.strokeEllipse(cx, cy, rx, ry);
  }

  private drawTopper(): void {
    const g = this.topperG;
    g.clear();
    const sSize = sandwichSize(this.scale.width, this.scale.height);
    const tx = this.sandwichPos.x;
    const ty = this.sandwichPos.y - sSize * 0.52;
    const topper = Save.data.shop.topper;
    if (topper === 'cherry') {
      g.fillStyle(0xd90429, 1);
      g.fillCircle(tx, ty, 12);
      g.fillStyle(0xff8fa3, 1);
      g.fillCircle(tx - 4, ty - 4, 4);
    } else if (topper === 'star') {
      drawStar(g, tx, ty, 14, COLORS.sun);
      g.lineStyle(2, 0xffffff, 0.9);
    }
  }

  private drawUmbrella(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const u = this.def.umbrella!;
    const cx = u.rx * w;
    const cy = u.ry * h;
    const r = u.r;
    this.umbrella = { x: cx, y: cy, r };
    const g = this.add.graphics().setDepth(2);
    this.umbrellaG = g;
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(cx, cy + r * 0.85, r * 1.7, r * 0.4);
    // Pole.
    g.lineStyle(6, 0x8b5e3c, 1);
    g.lineBetween(cx, cy, cx, cy + r * 0.9);
    // Canopy: alternating wedges.
    for (let i = 0; i < 6; i++) {
      const a0 = Math.PI + (Math.PI / 6) * i;
      const a1 = Math.PI + (Math.PI / 6) * (i + 1);
      g.fillStyle(i % 2 === 0 ? COLORS.coral : 0xffffff, 1);
      g.slice(cx, cy, r, a0, a1, false);
      g.fillPath();
    }
    g.fillStyle(COLORS.sun, 1);
    g.fillCircle(cx, cy - r * 0.06, 8);
    g.lineStyle(2, 0xffffff, 0.8);
    g.strokeCircle(cx, cy, r);
  }

  private buildHud(): void {
    const w = this.scale.width;
    const levelLabel = this.add
      .text(16, 26, `${t('level')} ${this.level}`, bodyStyle(22, '#ffffff'))
      .setOrigin(0, 0.5);
    levelLabel.setDepth(10);

    const coinsBg = this.add.graphics().setDepth(10);
    coinsBg.fillStyle(0x000000, 0.3);
    coinsBg.fillRoundedRect(w / 2 - 58, 8, 116, 40, 20);
    const coinIcon = this.add.image(w / 2 - 34, 28, 'coin').setDisplaySize(26, 30).setDepth(11);
    this.coinsText = this.add
      .text(w / 2 - 14, 28, `${Save.data.coins}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '22px', color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setDepth(11);

    const pause = makeIconButton(this, w - 40, 30, 26, 'II', () => this.pauseGame());
    pause.setDepth(10);

    this.timerText = this.add
      .text(w / 2, 86, `${LEVEL_TIME}`, headingStyle(52, '#ffffff'))
      .setOrigin(0.5)
      .setDepth(10);

    // Crumbs: 3 mini sandwiches under the timer.
    for (let i = 0; i < 3; i++) {
      const img = this.add
        .image(w / 2 + (i - 1) * 40, 132, 'sandwich')
        .setDisplaySize(34, 33)
        .setDepth(10);
      this.crumbImgs.push(img);
    }

    // Ink bar, bottom.
    this.inkBarW = Math.min(w * 0.72, 320);
    this.inkBarG = this.add.graphics().setDepth(10);
    const inkLabel = this.add.text(16, this.scale.height - 52, t('ink').toUpperCase(), bodyStyle(18, '#ffffff')).setDepth(10);
    inkLabel.setOrigin(0, 0.5);
    this.drawInkBar();

    // Wind / pelican / umbrella callouts (first seconds only).
    if (this.def.wind !== 0 && this.level === 6) {
      this.flashCallout(t('wind'));
    }
    if (this.def.pelican) this.flashCallout(t('pelican'));
    if (this.def.umbrella && this.level === 16) this.flashCallout(t('umbrella'));
  }

  private flashCallout(text: string): void {
    const callout = this.add
      .text(this.scale.width / 2, this.scale.height * 0.42, text, headingStyle(30, COLORS.coralCss))
      .setOrigin(0.5)
      .setDepth(20);
    this.tweens.add({ targets: callout, alpha: 0, duration: 400, delay: 1600, onComplete: () => callout.destroy() });
  }

  private drawInkBar(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const bw = this.inkBarW;
    const bx = (w - bw) / 2;
    const by = h - 44;
    const g = this.inkBarG;
    g.clear();
    g.fillStyle(0x000000, 0.35);
    g.fillRoundedRect(bx, by, bw, 18, 9);
    const frac = Math.max(0, this.inkLeft / this.inkMax);
    const col = frac > 0.5 ? COLORS.leaf : frac > 0.25 ? COLORS.sun : COLORS.coral;
    if (frac > 0) {
      g.fillStyle(col, 1);
      g.fillRoundedRect(bx + 2, by + 2, Math.max(8, (bw - 4) * frac), 14, 7);
    }
  }

  // ---------- coins, wind, spawns ----------

  private spawnLevelCoins(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    for (let i = 0; i < 3; i++) {
      let x = 0;
      let y = 0;
      for (let tries = 0; tries < 20; tries++) {
        x = 50 + Math.random() * (w - 100);
        y = playTop(h) + 60 + Math.random() * (playBottom(h) - playTop(h) - 120);
        const dSand = Math.hypot(x - this.sandwichPos.x, y - this.sandwichPos.y);
        const dUmb = this.umbrella ? Math.hypot(x - this.umbrella.x, y - this.umbrella.y) : 999;
        if (dSand > 140 && dUmb > 110) break;
      }
      const img = this.add.image(x, y, 'coin').setDisplaySize(52, 59).setDepth(4);
      img.setInteractive(new Phaser.Geom.Circle(0, 0, 32), Phaser.Geom.Circle.Contains);
      const entry: LevelCoin = { img, taken: false };
      img.on('pointerdown', () => this.collectCoin(entry));
      this.coins.push(entry);
      this.tweens.add({ targets: img, y: y - 10, duration: 900 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
  }

  private collectCoin(entry: LevelCoin): void {
    if (entry.taken || this.state !== 'playing') return;
    entry.taken = true;
    this.coinsCollected += 1;
    Save.data.coins += 10;
    void Save.write();
    this.coinsText.setText(`${Save.data.coins}`);
    AudioEngine.coin();
    juice(this, 'small', entry.img.x, entry.img.y);
    this.tweens.add({ targets: entry.img, scaleX: 1.5, scaleY: 1.5, alpha: 0, duration: 260, onComplete: () => entry.img.destroy() });
  }

  private startWind(): void {
    if (this.def.wind === 0) return;
    const w = this.scale.width;
    const h = this.scale.height;
    this.windFx = this.add.particles(0, 0, 'dot', {
      x: { min: -20, max: w },
      y: { min: 120, max: h - 120 },
      speedX: { min: this.def.wind * 60, max: this.def.wind * 170 },
      speedY: { min: -8, max: 8 },
      lifespan: 2600,
      frequency: 240,
      scale: { min: 0.15, max: 0.4 },
      alpha: 0.3,
      tint: 0xffffff,
    });
    this.windFx.setDepth(1);
  }

  private startSpawning(): void {
    this.spawnEvent = this.time.addEvent({
      delay: this.def.spawnInterval * 1000,
      callback: () => {
        if (this.spawnCount >= this.def.gulls) {
          this.spawnEvent?.destroy();
          this.spawnEvent = null;
          return;
        }
        this.spawnCount += 1;
        this.spawnGull(false);
      },
      loop: true,
    });
  }

  private spawnGull(_fromTest: boolean): void {
    this.spawnGullInternal(false);
  }

  private spawnGullInternal(isPelican: boolean): void {
    const w = this.scale.width;
    const h = this.scale.height;
    let x: number;
    let y: number;
    if (isPelican) {
      x = w / 2;
      y = -90;
    } else if (this.def.sides && Math.random() < 0.4) {
      const left = Math.random() < 0.5;
      x = left ? -60 : w + 60;
      y = h * (0.15 + Math.random() * 0.3);
    } else {
      x = w * (0.1 + Math.random() * 0.8);
      y = -60;
    }
    const size = isPelican ? 170 : gullSize(w, h);
    const key = isPelican ? 'pelican' : 'gull';
    const img = this.add.image(x, y, key).setDepth(5);
    img.setDisplaySize(size, size * (isPelican ? 547 / 640 : 411 / 520));
    const tx = this.sandwichPos.x + (Math.random() - 0.5) * 40;
    const ty = this.sandwichPos.y + (Math.random() - 0.5) * 30;
    const dx = tx - x;
    const dy = ty - y;
    const len = Math.hypot(dx, dy) || 1;
    const speed = this.def.speed * (isPelican ? 0.55 : 0.9 + Math.random() * 0.2);
    const gull: Gull = {
      img,
      vx: (dx / len) * speed,
      vy: (dy / len) * speed,
      state: 'diving',
      phase: Math.random() * Math.PI * 2,
      hp: isPelican ? 3 : 1,
      isPelican,
      stunT: 0,
    };
    // Wing flap: subtle scaleY pulse.
    this.tweens.add({ targets: img, scaleY: img.scaleY * 0.9, duration: 170, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.gulls.push(gull);
    if (!isPelican) AudioEngine.squawk();
  }

  private spawnPelican(): void {
    this.spawnGullInternal(true);
  }

  // ---------- tutorial ----------

  private startTutorial(): void {
    const w = this.scale.width;
    const anchor = this.sandwichPos;
    // ONE text with both lines and real line spacing: two separate texts
    // wrapped and overlapped each other in portrait. It sits in the free
    // band between the crumbs row (y 132) and the hand arc (~y 300).
    this.hintText = this.add
      .text(w / 2, 184, `${t('drawHint')}\n${t('drawHint2')}`, bodyStyle(20, '#ffffff'))
      .setOrigin(0.5)
      .setDepth(20);
    this.hintText.setWordWrapWidth(w * 0.86);
    this.hintText.setAlign('center');
    this.hintText.setLineSpacing(8);
    this.handBaseY = anchor.y - 130;
    this.hand = this.add.image(anchor.x - 90, this.handBaseY, 'hand').setDisplaySize(64, 64).setDepth(21);
    this.hand.setAngle(-18);
    this.tweens.add({
      targets: this.hand, x: anchor.x + 90, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut',
    });
    this.time.delayedCall(5200, () => this.fadeTutorial());
  }

  private fadeTutorial(): void {
    const targets: Phaser.GameObjects.GameObject[] = [];
    if (this.hand) targets.push(this.hand);
    if (this.hintText) targets.push(this.hintText);
    if (targets.length === 0) return;
    this.tweens.add({ targets, alpha: 0, duration: 400, onComplete: () => {
      this.hand?.destroy();
      this.hintText?.destroy();
      this.hand = null;
      this.hintText = null;
    }});
  }

  private endTutorial(): void {
    if (this.tutorialDone) return;
    this.tutorialDone = true;
    if (this.hand) this.tweens.killTweensOf(this.hand);
    this.fadeTutorial();
  }

  // ---------- input: drawing ----------

  private onPointerDown(p: Phaser.Input.Pointer): void {
    if (this.state !== 'playing') return;
    if (p.y < 150 || p.y > this.scale.height - 64) return;
    const hits = this.input.hitTestPointer(p);
    if (hits.length > 0) return; // over a button, a coin, the pause control…
    this.drawing = true;
    this.lastPt = { x: p.x, y: p.y };
    this.endTutorial();
    AudioEngine.drawStart();
  }

  private onPointerMove(p: Phaser.Input.Pointer): void {
    if (!this.drawing || !this.lastPt || this.state !== 'playing') return;
    if (this.inkLeft <= 0) {
      this.onPointerUp();
      return;
    }
    const nx = p.x;
    const ny = p.y;
    const dx = nx - this.lastPt.x;
    const dy = ny - this.lastPt.y;
    const len = Math.hypot(dx, dy);
    if (len < 6) return;
    const seg: Seg = { x1: this.lastPt.x, y1: this.lastPt.y, x2: nx, y2: ny };
    if (this.umbrella && segHitsCircle(seg, this.umbrella.x, this.umbrella.y, this.umbrella.r)) {
      // Blocked by the umbrella: no ink spent, small puff, no segment.
      const puff = this.add.particles(nx, ny, 'dot', {
        speed: 40, lifespan: 300, scale: { start: 0.6, end: 0 }, quantity: 4, tint: COLORS.coral, emitting: false,
      });
      puff.explode(4);
      this.time.delayedCall(400, () => puff.destroy());
      this.lastPt = { x: nx, y: ny };
      return;
    }
    this.addSegment(seg);
    this.lastPt = { x: nx, y: ny };
  }

  private onPointerUp(): void {
    if (!this.drawing) return;
    this.drawing = false;
    this.lastPt = null;
    AudioEngine.drawStop();
  }

  /** Shared by pointer drawing and the test handle. */
  private addSegment(seg: Seg): void {
    const len = Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1);
    this.inkLeft = Math.max(0, this.inkLeft - len);
    this.segments.push(seg);
    // Rope look: dark under-stroke, then cream core, round joints.
    this.lineG.lineStyle(LINE_WIDTH + 5, COLORS.ink, 0.85);
    this.lineG.lineBetween(seg.x1, seg.y1, seg.x2, seg.y2);
    this.lineG.fillStyle(COLORS.ink, 0.85);
    this.lineG.fillCircle(seg.x2, seg.y2, (LINE_WIDTH + 5) / 2);
    this.lineG.lineStyle(LINE_WIDTH, 0xfff6e5, 1);
    this.lineG.lineBetween(seg.x1, seg.y1, seg.x2, seg.y2);
    this.lineG.fillStyle(0xfff6e5, 1);
    this.lineG.fillCircle(seg.x2, seg.y2, LINE_WIDTH / 2);
    this.drawInkBar();
  }

  // ---------- pause ----------

  pauseGame(): void {
    if (this.state !== 'playing' || this.pausePanel) return;
    this.state = 'paused';
    if (this.spawnEvent) this.spawnEvent.paused = true;
    AudioEngine.drawStop();
    const w = this.scale.width;
    const h = this.scale.height;
    const panel = this.add.container(0, 0).setDepth(50);
    const dim = this.add.rectangle(0, 0, w, h, 0x000000, 0.55).setOrigin(0);
    dim.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);
    panel.add(dim);
    const card = this.add.graphics();
    const cw = Math.min(320, w - 48);
    const chh = 380;
    card.fillStyle(COLORS.cream, 1);
    card.fillRoundedRect(w / 2 - cw / 2, h / 2 - chh / 2, cw, chh, 24);
    card.lineStyle(4, 0xffffff, 0.9);
    card.strokeRoundedRect(w / 2 - cw / 2, h / 2 - chh / 2, cw, chh, 24);
    panel.add(card);
    const title = this.add.text(w / 2, h / 2 - chh / 2 + 52, t('paused'), headingStyle(36)).setOrigin(0.5);
    panel.add(title);
    const resume = makeButton(this, w / 2, h / 2 - 40, {
      w: 220, h: 72, fontSize: 26, label: t('resume'), color: COLORS.leaf, onClick: () => this.resumeGame(),
    });
    const restart = makeButton(this, w / 2, h / 2 + 48, {
      w: 220, h: 64, fontSize: 24, label: t('restart'), color: COLORS.sea, onClick: () => this.scene.restart({ level: this.level, daily: this.isDaily }),
    });
    const quit = makeButton(this, w / 2, h / 2 + 128, {
      w: 220, h: 64, fontSize: 24, label: t('quit'), color: COLORS.coral, onClick: () => this.scene.start('Menu'),
    });
    panel.add([resume, restart, quit]);
    this.pausePanel = panel;
  }

  resumeGame(): void {
    if (this.state !== 'paused') return;
    this.pausePanel?.destroy();
    this.pausePanel = null;
    this.state = 'playing';
    if (this.spawnEvent) this.spawnEvent.paused = false;
  }

  // ---------- update ----------

  update(_time: number, delta: number): void {
    if (this.state !== 'playing') return;
    const dt = Math.min(delta / 1000, 0.05);
    const w = this.scale.width;
    const h = this.scale.height;

    // Timer.
    this.timeLeft -= dt;
    const shown = Math.max(0, Math.ceil(this.timeLeft));
    if (shown !== this.lastTimerShown) {
      this.lastTimerShown = shown;
      this.timerText.setText(`${shown}`);
      if (shown <= 3 && shown > 0) {
        this.timerText.setColor(COLORS.coralCss);
        this.tweens.add({ targets: this.timerText, scaleX: 1.18, scaleY: 1.18, duration: 130, yoyo: true });
      }
    }
    if (this.timeLeft <= 0) {
      this.winLevel();
      return;
    }

    // Tutorial hand bob.
    if (this.hand) {
      this.hand.y = this.handBaseY - Math.abs(Math.sin(this.time.now / 450)) * 34;
    }

    const wind = this.def.wind;
    const hitR = GULL_RADIUS + LINE_WIDTH / 2 + 4;
    for (const g of this.gulls) {
      if (g.state === 'gone') continue;
      const img = g.img;
      if (g.state === 'stunned') {
        g.stunT -= dt;
        img.y += Math.sin(this.time.now / 200) * 0.4;
        if (g.stunT <= 0) {
          g.state = 'diving';
          const dx = this.sandwichPos.x - img.x;
          const dy = this.sandwichPos.y - img.y;
          const len = Math.hypot(dx, dy) || 1;
          const sp = this.def.speed * 0.55;
          g.vx = (dx / len) * sp;
          g.vy = (dy / len) * sp;
        }
        continue;
      }
      if (g.state === 'diving') {
        // Wind + wobble (perpendicular sine).
        g.vx += wind * 42 * dt;
        const px = -g.vy;
        const py = g.vx;
        const plen = Math.hypot(px, py) || 1;
        const wob = Math.sin(this.time.now / 320 + g.phase) * 26;
        img.x += (g.vx + (px / plen) * wob) * dt;
        img.y += (g.vy + (py / plen) * wob) * dt;
        img.setRotation(Math.atan2(g.vy, g.vx) - Math.PI / 2);

        // Umbrella deflects gulls.
        if (this.umbrella) {
          const du = Math.hypot(img.x - this.umbrella.x, img.y - this.umbrella.y);
          const minD = this.umbrella.r + GULL_RADIUS;
          if (du < minD && du > 0.01) {
            const nx = (img.x - this.umbrella.x) / du;
            const ny = (img.y - this.umbrella.y) / du;
            img.x = this.umbrella.x + nx * minD;
            img.y = this.umbrella.y + ny * minD;
            const dot = g.vx * nx + g.vy * ny;
            if (dot < 0) {
              g.vx -= 2 * dot * nx;
              g.vy -= 2 * dot * ny;
            }
          }
        }

        // Line collision: reflect about the segment normal.
        for (const s of this.segments) {
          const res = distToSegment(img.x, img.y, s);
          if (res.d < hitR) {
            this.bounceGull(g, s, res.cx, res.cy);
            break;
          }
        }
        if (g.state !== 'diving') continue;

        // Sandwich reached: lose a crumb.
        const dSand = Math.hypot(img.x - this.sandwichPos.x, img.y - this.sandwichPos.y);
        if (dSand < 66) {
          this.loseCrumb(g);
          if (this.state !== 'playing') return;
        }
      } else if (g.state === 'fleeing') {
        img.x += g.vx * dt;
        img.y += g.vy * dt;
        img.setRotation(Math.atan2(g.vy, g.vx) - Math.PI / 2);
        if (img.y < -100 || img.x < -100 || img.x > w + 100 || img.y > h + 100) {
          g.state = 'gone';
          img.destroy();
        }
      }
    }
  }

  private bounceGull(g: Gull, s: Seg, cx: number, cy: number): void {
    let dx = s.x2 - s.x1;
    let dy = s.y2 - s.y1;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    let nx = -dy;
    let ny = dx;
    const dot = g.vx * nx + g.vy * ny;
    if (dot > 0) {
      nx = -nx;
      ny = -ny;
    }
    const d2 = g.vx * nx + g.vy * ny;
    g.vx -= 2 * d2 * nx;
    g.vy -= 2 * d2 * ny;
    AudioEngine.bounce();
    juice(this, 'small', cx, cy);
    if (g.isPelican) {
      g.hp -= 1;
      if (g.hp <= 0) {
        g.state = 'fleeing';
        g.vx *= 0.6;
        g.vy = -Math.abs(g.vy) * 1.1 - 120;
        Save.data.coins += 20;
        void Save.write();
        this.coinsText.setText(`${Save.data.coins}`);
        AudioEngine.coin();
        juice(this, 'medium', cx, cy);
      } else {
        g.state = 'stunned';
        g.stunT = 0.6;
        g.vx *= -0.4;
        g.vy = -Math.abs(g.vy) * 0.5;
      }
    } else {
      g.state = 'fleeing';
      g.vy = -Math.abs(g.vy) * 1.1 - 60;
      g.vx *= 0.8;
    }
  }

  private loseCrumb(g: Gull): void {
    this.crumbs -= 1;
    const idx = this.crumbs; // crumb that just got lost (0-based)
    const img = this.crumbImgs[idx];
    if (img) {
      img.setTint(0x8a8f94);
      img.setAngle(18);
      this.tweens.add({ targets: img, scaleX: 0.8, scaleY: 0.8, duration: 200 });
    }
    AudioEngine.crumb();
    AudioEngine.squawk();
    juice(this, 'medium', this.sandwichPos.x, this.sandwichPos.y);
    this.tweens.add({ targets: this.sandwich, angle: 8, duration: 90, yoyo: true, onComplete: () => this.sandwich.setAngle(0) });
    g.state = 'fleeing';
    g.vy = -Math.abs(g.vy) * 1.2 - 80;
    g.vx *= 0.7;
    if (this.crumbs <= 0) this.loseLevel();
  }

  // ---------- win / lose ----------

  private winLevel(): void {
    if (this.resultSent) return;
    this.resultSent = true;
    this.state = 'won';
    this.spawnEvent?.destroy();
    this.spawnEvent = null;
    for (const g of this.gulls) {
      if (g.state === 'diving') {
        g.state = 'fleeing';
        g.vy = -Math.abs(g.vy) - 100;
      }
    }
    AudioEngine.win();
    const stars = this.crumbs >= 3 ? 3 : this.crumbs === 2 ? 2 : 1;
    const winBonus = 10 + stars * 5;
    let coinsEarned = this.coinsCollected * 10 + winBonus;
    const isDailyLevel = this.isDaily && this.level === Save.dailyLevelToday() && !Save.dailyDoneToday();
    if (isDailyLevel) {
      coinsEarned *= 2;
      Save.markDailyDone();
    }
    Save.data.coins += winBonus + (isDailyLevel ? winBonus : 0);
    Save.data.stars[this.level] = Math.max(Save.data.stars[this.level] ?? 0, stars);
    Save.data.unlocked = Math.max(Save.data.unlocked, Math.min(this.level + 1, 30));
    Save.data.wins += 1;
    void Save.write();
    // Confetti over the sandwich.
    const confetti = this.add.particles(this.sandwichPos.x, this.sandwichPos.y - 40, 'dot', {
      speed: { min: 120, max: 320 },
      angle: { min: 250, max: 290 },
      gravityY: 500,
      lifespan: 1200,
      scale: { start: 1, end: 0 },
      quantity: 30,
      tint: [COLORS.sun, COLORS.coral, COLORS.leaf, COLORS.sea],
      emitting: false,
    });
    confetti.explode(40);
    this.time.delayedCall(1400, () => confetti.destroy());
    // Interstitial at the natural pause, every 2nd win, never level 1.
    // Bridge enforces its own 60 s minimum delay from the config.
    if (this.level !== 1 && Save.data.wins % 2 === 0) {
      try {
        const b = (window as unknown as { bridge?: { advertisement?: { interstitial?: { show?: (p: string) => void } } } }).bridge;
        b?.advertisement?.interstitial?.show?.('level_completed');
      } catch {
        /* ads are best-effort */
      }
    }
    this.time.delayedCall(1100, () => {
      this.scene.start('Result', {
        level: this.level, win: true, stars,
        coinsEarned, coinsCollected: this.coinsCollected, daily: this.isDaily,
      });
    });
  }

  private loseLevel(): void {
    if (this.resultSent) return;
    this.resultSent = true;
    this.state = 'lost';
    this.spawnEvent?.destroy();
    this.spawnEvent = null;
    AudioEngine.fail();
    this.tweens.add({ targets: this.sandwich, y: -120, alpha: 0, duration: 700, ease: 'Quad.easeIn' });
    this.time.delayedCall(900, () => {
      this.scene.start('Result', {
        level: this.level, win: false, stars: 0,
        coinsEarned: this.coinsCollected * 10, coinsCollected: this.coinsCollected, daily: this.isDaily,
      });
    });
  }

  // ---------- resize ----------

  private onResize(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    this.coverBg();
    this.sandwichPos = sandwichAnchor(w, h);
    this.drawTowel();
    const sSize = sandwichSize(w, h);
    this.sandwich.setPosition(this.sandwichPos.x, this.sandwichPos.y).setDisplaySize(sSize, (sSize * 503) / 520);
    this.drawTopper();
    if (this.def.umbrella && this.umbrellaG) {
      this.umbrellaG.destroy();
      this.drawUmbrella();
    }
    this.drawInkBar();
    for (const g of this.gulls) {
      if (g.state === 'gone') continue;
      g.img.x = Phaser.Math.Clamp(g.img.x, -80, w + 80);
      g.img.y = Phaser.Math.Clamp(g.img.y, -100, h + 100);
    }
    for (const c of this.coins) {
      if (!c.taken) {
        c.img.x = Phaser.Math.Clamp(c.img.x, 40, w - 40);
        c.img.y = Phaser.Math.Clamp(c.img.y, playTop(h) + 40, playBottom(h) - 40);
      }
    }
  }

  // ---------- test handle (test build only; see testhandle.ts) ----------

  testGetState(): Record<string, unknown> {
    return {
      scene: 'Game',
      state: this.state,
      level: this.level,
      crumbs: this.crumbs,
      timeLeft: Math.ceil(Math.max(0, this.timeLeft)),
      inkLeft: Math.round(this.inkLeft),
      inkMax: this.inkMax,
      segments: this.segments.length,
      gullsActive: this.gulls.filter((g) => g.state === 'diving' || g.state === 'stunned').length,
      gullsTotal: this.gulls.length,
      gulls: this.gulls.map((g) => g.state),
      coinsCollected: this.coinsCollected,
      sandwich: { x: Math.round(this.sandwichPos.x), y: Math.round(this.sandwichPos.y) },
      screen: { w: this.scale.width, h: this.scale.height },
    };
  }

  testDrawLine(points: { x: number; y: number }[]): void {
    if (this.state !== 'playing') return;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (this.inkLeft <= 0) break;
      if (this.umbrella && segHitsCircle({ x1: a.x, y1: a.y, x2: b.x, y2: b.y }, this.umbrella.x, this.umbrella.y, this.umbrella.r)) continue;
      this.addSegment({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }

  testSetTimer(t: number): void {
    this.timeLeft = t;
  }

  testSpawnGull(): void {
    this.spawnGullInternal(false);
  }

  testSegments(): Seg[] {
    return this.segments.map((s) => ({ ...s }));
  }
}
