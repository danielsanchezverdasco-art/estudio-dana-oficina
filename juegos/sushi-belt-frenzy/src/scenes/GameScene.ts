// Game: Sushi Belt Frenzy. The belt (a deterministic BeltSim from logic.ts)
// carries plates left -> right; below wait three cats on coloured mats.
// TAP a plate: it arcs to its matching cat. DRAG a plate to a cat: match =
// eat, wrong = heart lost. Wasabi has no cat: tap does nothing, dragging it
// to a cat makes the cat cough and stuns it 1.5 s. Golden = x3 points.
// A normal plate that exits unserved costs a heart. 3 hearts (4 with the
// rewarded extra heart). Win = reach the target of serves.
// The scene only RENDERS the sim — every rule lives in logic.ts, so the
// harness and the game can never disagree.
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { t } from '../i18n';
import { BELT_Y, CAT_H, CAT_W, CAT_X, CAT_Y, CHEF_X, CHEF_Y, PLATE_SIZE } from '../layout';
import { BeltSim, COMBO_BONUS_EVERY, MAX_HEARTS, type CatColor, type PlateDef, type ServeResult } from '../logic';
import { LEVEL_COUNT, getLevel, levelSeed, type LevelDef } from '../levels';
import { Save } from '../save';
import { SKINS, THEMES } from '../skins';
import { COLORS, bodyStyle, headingStyle, juice, makeButton, makeIconButton } from '../ui';

const DESIGN_W = 390;
const DESIGN_H = 844;

type State = 'playing' | 'paused' | 'won' | 'lost';
type CatMood = 'idle' | 'happy' | 'angry' | 'cough';

const CAT_NAMES = ['orange', 'grey', 'bw'] as const;
const HINTS: Record<number, string> = {
  2: 'tutorialDrag',
  6: 'hintWasabi',
  8: 'hintGolden',
  14: 'hintChef',
};

interface PlateView {
  def: PlateDef;
  img: Phaser.GameObjects.Image;
  animating: boolean;
}

interface CatView {
  img: Phaser.GameObjects.Image;
  mood: CatMood;
  moodUntil: number;
}

interface GameData {
  level: number;
  daily?: boolean;
  extraHearts?: boolean;
}

export class GameScene extends Phaser.Scene {
  private levelN = 1;
  private level!: LevelDef;
  private daily = false;
  private state: State = 'playing';
  private prevState: State = 'playing';
  private sim!: BeltSim;
  private plateViews = new Map<number, PlateView>();
  private cats: CatView[] = [];
  private chefImg!: Phaser.GameObjects.Image;
  private chefWarn: Phaser.GameObjects.Text | null = null;
  private lastWarning = '';
  private scoreText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private heartsText!: Phaser.GameObjects.Text;
  private servesText!: Phaser.GameObjects.Text;
  private servesBar!: Phaser.GameObjects.Graphics;
  private boostBtn: Phaser.GameObjects.Container | null = null;
  private hud: Phaser.GameObjects.GameObject[] = [];
  private tutorial: Phaser.GameObjects.GameObject[] = [];
  private hintText: Phaser.GameObjects.Text | null = null;
  private pausedOverlay: Phaser.GameObjects.GameObject[] = [];
  private wonAt = 0;
  private lostAt = 0;
  private lastScore = -1;
  private lastCombo = -1;
  private lastHearts = -1;
  private lastServed = -1;
  private lastMissed = 0;
  private lastBoostLeft = -1;
  private dragPlate: number | null = null;
  private dragStart = { x: 0, y: 0 };
  private dragMoved = false;
  private tutorialHidden = false;

  constructor() {
    super('Game');
  }

  create(data: GameData): void {
    this.levelN = Phaser.Math.Clamp(data.level ?? 1, 1, LEVEL_COUNT);
    this.level = getLevel(this.levelN);
    this.daily = !!data.daily;
    this.state = 'playing';
    this.plateViews.clear();
    this.cats = [];
    this.tutorial = [];
    this.hud = [];
    this.pausedOverlay = [];
    this.lastScore = -1;
    this.lastCombo = -1;
    this.lastHearts = -1;
    this.lastServed = -1;
    this.lastMissed = 0;
    this.lastBoostLeft = -1;
    this.lastWarning = '';
    this.dragPlate = null;
    this.tutorialHidden = false;

    this.sim = new BeltSim(this.level, levelSeed(this.levelN));
    if (data.extraHearts) this.sim.hearts = MAX_HEARTS + 1;

    const skin = SKINS.find((s) => s.id === Save.data.shop.skin) ?? SKINS[0];
    const theme = THEMES.find((t) => t.id === Save.data.shop.theme) ?? THEMES[0];

    // Background (theme tint) + belt strip.
    const bg = this.add.image(DESIGN_W / 2, DESIGN_H / 2, 'bg-play');
    const tex = this.textures.get('bg-play').getSourceImage() as HTMLImageElement;
    bg.setScale(Math.max(DESIGN_W / tex.width, DESIGN_H / tex.height));
    bg.setTint(theme.tint);
    bg.setDepth(-10);
    const belt = this.add.image(DESIGN_W / 2, BELT_Y, 'belt-strip').setDisplaySize(DESIGN_W, 110);
    belt.setDepth(0);

    // Chef cat (warns what is coming) + warning text.
    this.chefImg = this.add.image(CHEF_X, CHEF_Y, 'chef-cat').setDisplaySize(150, 130).setDepth(2);
    this.tweens.add({ targets: this.chefImg, y: CHEF_Y - 5, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.chefWarn = this.add
      .text(CHEF_X, CHEF_Y - 84, '', headingStyle(20, COLORS.coralCss))
      .setOrigin(0.5)
      .setDepth(4);

    // Three cats on their coloured mats.
    CAT_NAMES.forEach((name, i) => {
      const mat = this.add.image(CAT_X[i], 668, `mat-${name}`).setDisplaySize(120, 40).setDepth(1);
      void mat;
      const img = this.add.image(CAT_X[i], CAT_Y, `cat-${name}-idle`).setDisplaySize(CAT_W, CAT_H).setDepth(3);
      img.setTint(skin.tint);
      this.cats.push({ img, mood: 'idle', moodUntil: 0 });
      this.tweens.add({ targets: img, y: CAT_Y - 4, duration: 1200 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    });

    this.buildHud();
    this.buildTutorial();
    this.buildHint();

    // Scene-level pointer handling (tap vs drag, one code path).
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onPointerDown(p));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.onPointerMove(p));
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => this.onPointerUp(p));

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointerdown');
      this.input.off('pointermove');
      this.input.off('pointerup');
    });
  }

  // ---------- HUD ----------

  private buildHud(): void {
    // Top band: LEVEL bubble (left), SCORE pill (centre), hearts (right).
    const levelBg = this.add.graphics();
    levelBg.fillStyle(0x000000, 0.3);
    levelBg.fillRoundedRect(10, 14, 92, 44, 22);
    const levelText = this.add
      .text(56, 36, `${t('level')} ${this.levelN}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '20px', color: '#ffffff' })
      .setOrigin(0.5);
    const scoreBg = this.add.graphics();
    scoreBg.fillStyle(0x000000, 0.3);
    scoreBg.fillRoundedRect(DESIGN_W / 2 - 70, 14, 140, 44, 22);
    this.scoreText = this.add
      .text(DESIGN_W / 2, 36, '0', { fontFamily: 'Lilita One, sans-serif', fontSize: '24px', color: '#ffffff' })
      .setOrigin(0.5);
    this.heartsText = this.add
      .text(DESIGN_W - 12, 36, '', { fontFamily: 'Lilita One, sans-serif', fontSize: '26px', color: '#e23b2e', stroke: '#141414', strokeThickness: 4 })
      .setOrigin(1, 0.5);
    // Serves progress under the LEVEL bubble (left) + combo under the
    // hearts (right). They used to sit CENTRE at y=74/100, directly over
    // the chef's hat — the "0/6" was half-hidden behind it (screenshot
    // 16/11). The centre column belongs to the chef.
    this.servesText = this.add
      .text(56, 74, '', bodyStyle(16, '#ffffff'))
      .setOrigin(0.5);
    this.servesBar = this.add.graphics().setDepth(5);
    this.comboText = this.add
      .text(DESIGN_W - 12, 74, '', headingStyle(22, COLORS.sunCss))
      .setOrigin(1, 0.5)
      .setDepth(5);
    // Pause button (right side, below the hearts — clear of the combo).
    const pauseBtn = makeIconButton(this, DESIGN_W - 30, 132, 22, '❚❚', () => this.pauseGame());
    pauseBtn.setDepth(6);
    // BOOST button (bottom-right, above the cats' row is the belt — put it
    // bottom-left of the cats area, clear of any cat).
    this.boostBtn = makeButton(this, DESIGN_W - 62, 770, {
      w: 104, h: 56, fontSize: 18, label: `${t('boost')} (2)`, color: COLORS.boost,
      onClick: () => this.useBoost(),
    });
    this.boostBtn.setDepth(6);
    this.hud.push(levelBg, levelText, scoreBg, this.scoreText, this.heartsText, this.servesText, this.servesBar, this.comboText, pauseBtn, this.boostBtn);
    this.updateHud(true);
  }

  private updateHud(force = false): void {
    if (this.sim.score !== this.lastScore || force) {
      this.lastScore = this.sim.score;
      this.scoreText.setText(`${this.sim.score}`);
    }
    if (this.sim.combo !== this.lastCombo || force) {
      const prev = this.lastCombo;
      this.lastCombo = this.sim.combo;
      if (this.sim.combo >= 2) {
        this.comboText.setText(`${t('combo')} x${this.sim.combo}`);
        this.comboText.setColor(this.sim.combo >= COMBO_BONUS_EVERY ? COLORS.sunCss : '#ffffff');
        if (this.sim.combo > prev) {
          this.tweens.add({ targets: this.comboText, scaleX: 1.25, scaleY: 1.25, duration: 120, yoyo: true });
        }
      } else {
        this.comboText.setText('');
      }
    }
    if (this.sim.hearts !== this.lastHearts || force) {
      this.lastHearts = this.sim.hearts;
      const full = '♥'.repeat(Math.max(0, this.sim.hearts));
      const empty = '♡'.repeat(Math.max(0, MAX_HEARTS - this.sim.hearts));
      this.heartsText.setText(full + empty);
    }
    if (this.sim.served !== this.lastServed || force) {
      this.lastServed = this.sim.served;
      this.servesText.setText(`${t('serves')}: ${this.sim.served}/${this.level.target}`);
      const g = this.servesBar;
      g.clear();
      const frac = this.level.target > 0 ? this.sim.served / this.level.target : 0;
      g.fillStyle(0x141414, 1);
      g.fillRoundedRect(10, 88, 124, 10, 5);
      g.fillStyle(COLORS.leaf, 1);
      if (frac > 0) g.fillRoundedRect(12, 90, 120 * frac, 6, 3);
    }
    if (this.sim.boostLeft !== this.lastBoostLeft || force) {
      this.lastBoostLeft = this.sim.boostLeft;
      const btn = this.boostBtn;
      if (btn) {
        const label = btn.getAt(1) as Phaser.GameObjects.Text;
        label.setText(`${t('boost')} (${this.sim.boostLeft})`);
        btn.setAlpha(this.sim.boostLeft > 0 ? 1 : 0.45);
      }
    }
  }

  /** Cream bubble behind a centred text (contrast on any background). */
  private bubbleBehind(text: Phaser.GameObjects.Text): Phaser.GameObjects.Graphics {
    const g = this.add.graphics().setDepth(4);
    const w = Math.min(360, text.width + 28);
    const h = text.height + 16;
    g.fillStyle(0xfff8e7, 0.95);
    g.fillRoundedRect(text.x - w / 2, text.y - h / 2, w, h, 14);
    g.lineStyle(3, 0x141414, 1);
    g.strokeRoundedRect(text.x - w / 2, text.y - h / 2, w, h, 14);
    return g;
  }

  private buildTutorial(): void {
    if (this.levelN === 1) {
      const hand = this.add.image(120, BELT_Y - 40, 'hand').setDisplaySize(64, 64).setDepth(5);
      this.tweens.add({ targets: hand, x: 150, y: BELT_Y - 28, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      // Below the belt, above the cats — it used to sit at y=150, on the
      // chef's face (screenshot 16/11).
      const text = this.add
        .text(DESIGN_W / 2, 430, t('tutorialTap'), headingStyle(22, COLORS.inkCss))
        .setOrigin(0.5)
        .setDepth(5);
      const bubble = this.bubbleBehind(text);
      this.tutorial.push(hand, text, bubble);
    }
  }

  private hideTutorial(): void {
    if (this.tutorialHidden) return;
    this.tutorialHidden = true;
    for (const o of this.tutorial) o.destroy();
    this.tutorial = [];
  }

  private buildHint(): void {
    const key = HINTS[this.levelN];
    if (!key) return;
    // Below the belt, above the cats — it used to sit at y=128, on the
    // chef's head (same defect as the tutorial text).
    this.hintText = this.add
      .text(DESIGN_W / 2, 430, t(key), headingStyle(17, COLORS.inkCss))
      .setOrigin(0.5)
      .setDepth(5);
    this.hintText.setWordWrapWidth(340);
    this.hintText.setAlign('center');
    const bubble = this.bubbleBehind(this.hintText);
    this.time.delayedCall(4000, () => {
      this.hintText?.destroy();
      this.hintText = null;
      bubble.destroy();
    });
  }

  // ---------- input: tap vs drag ----------

  private plateAt(x: number, y: number): PlateView | null {
    let best: PlateView | null = null;
    let bestD = 44;
    for (const v of this.plateViews.values()) {
      if (v.animating) continue;
      const d = Math.hypot(v.img.x - x, v.img.y - y);
      if (d < bestD) {
        bestD = d;
        best = v;
      }
    }
    return best;
  }

  private catAt(x: number, y: number): CatColor | null {
    for (let i = 0; i < 3; i++) {
      if (Math.hypot(CAT_X[i] - x, CAT_Y - y) < 85) return i as CatColor;
    }
    return null;
  }

  private onPointerDown(p: Phaser.Input.Pointer): void {
    if (this.state !== 'playing') return;
    const v = this.plateAt(p.worldX, p.worldY);
    if (!v) return;
    this.dragPlate = v.def.id;
    this.dragStart = { x: p.worldX, y: p.worldY };
    this.dragMoved = false;
  }

  private onPointerMove(p: Phaser.Input.Pointer): void {
    if (this.state !== 'playing' || this.dragPlate === null) return;
    const v = this.plateViews.get(this.dragPlate);
    if (!v) return;
    if (Math.hypot(p.worldX - this.dragStart.x, p.worldY - this.dragStart.y) > 14) {
      this.dragMoved = true;
    }
    if (this.dragMoved) {
      v.img.setPosition(p.worldX, p.worldY);
      v.img.setDepth(8);
    }
  }

  private onPointerUp(p: Phaser.Input.Pointer): void {
    if (this.state !== 'playing' || this.dragPlate === null) return;
    const id = this.dragPlate;
    this.dragPlate = null;
    const v = this.plateViews.get(id);
    if (!v) return;
    if (!this.dragMoved) {
      // TAP: auto-serve to the matching cat (wasabi: nothing happens).
      const def = v.def;
      if (def.kind === 'wasabi') {
        this.tweens.add({ targets: v.img, x: v.img.x - 6, duration: 70, yoyo: true, repeat: 1 });
        return;
      }
      this.handleServe(this.sim.tap(id), def, v);
    } else {
      // DRAG: dropped on a cat = serve to that cat; elsewhere = snap back.
      const cat = this.catAt(p.worldX, p.worldY);
      if (cat === null) return; // sync loop snaps the plate back
      this.handleServe(this.sim.serve(id, cat), v.def, v, cat);
    }
  }

  /** Shared serve-result handling for tap and drag. */
  private handleServe(result: ServeResult, def: PlateDef, view: PlateView, cat?: CatColor): void {
    if (result === 'not-found' || result === 'already-served') return;
    if (result === 'stunned') {
      this.tweens.add({ targets: view.img, x: view.img.x - 5, duration: 60, yoyo: true, repeat: 1 });
      return;
    }
    // The plate leaves the belt: arc it to the cat, then eat it.
    const targetCat = result === 'wasabi-cough' ? (cat as CatColor) : (def.color as CatColor);
    const cx = CAT_X[targetCat];
    const cy = CAT_Y - 40;
    view.animating = true;
    this.plateViews.delete(def.id);
    this.tweens.add({
      targets: view.img, x: cx, y: cy, scaleX: 0.5, scaleY: 0.5, duration: 320, ease: 'Quad.easeIn',
      onComplete: () => view.img.destroy(),
    });
    this.hideTutorial();
    if (result === 'eaten') {
      const points = def.golden ? 90 : 30;
      this.setCatMood(targetCat, 'happy', 700);
      this.floatText(cx, cy - 60, `+${points}`, COLORS.sunCss, 30);
      AudioEngine.meow();
      AudioEngine.munch();
      if (def.golden) AudioEngine.golden();
      if (this.sim.combo > 0 && this.sim.combo % COMBO_BONUS_EVERY === 0) {
        AudioEngine.combo();
        this.floatText(DESIGN_W / 2, 140, `${t('combo')} x${this.sim.combo}!`, COLORS.sunCss, 26);
      }
      juice(this, this.sim.combo >= COMBO_BONUS_EVERY ? 'medium' : 'small', cx, cy);
    } else if (result === 'wrong-cat') {
      this.setCatMood(targetCat, 'angry', 900);
      this.floatText(cx, cy - 60, t('wrongCat'), COLORS.coralCss, 22);
      AudioEngine.fail();
      juice(this, 'medium', cx, cy);
    } else if (result === 'wasabi-cough') {
      this.setCatMood(targetCat, 'cough', 1500);
      this.floatText(cx, cy - 60, t('cough'), COLORS.leafCss, 22);
      AudioEngine.cough();
      juice(this, 'small', cx, cy);
    }
    this.updateHud();
  }

  private setCatMood(cat: CatColor, mood: CatMood, ms: number): void {
    const view = this.cats[cat];
    if (!view) return;
    view.mood = mood;
    view.moodUntil = this.time.now + ms;
    view.img.setTexture(`cat-${CAT_NAMES[cat]}-${mood}`);
  }

  private floatText(x: number, y: number, text: string, color: string, size: number): void {
    const t = this.add
      .text(x, y, text, {
        fontFamily: 'Lilita One, "Arial Black", sans-serif',
        fontSize: `${size}px`,
        color,
        stroke: '#141414',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(9);
    t.setScale(0.6);
    this.tweens.add({ targets: t, scaleX: 1.15, scaleY: 1.15, duration: 140, ease: 'Back.easeOut' });
    this.tweens.add({ targets: t, y: y - 44, alpha: 0, duration: 700, delay: 200, onComplete: () => t.destroy() });
  }

  private useBoost(): void {
    if (this.state !== 'playing') return;
    if (!this.sim.boost()) return;
    AudioEngine.pop();
    this.floatText(DESIGN_W / 2, BELT_Y - 80, 'SLOW-MO!', COLORS.boostCss, 26);
    this.updateHud();
  }

  // ---------- update: render the sim ----------

  update(_time: number, delta: number): void {
    if (this.state === 'paused') return;
    if (this.state === 'won') {
      if (this.time.now - this.wonAt > 900) this.finishWin();
      return;
    }
    if (this.state === 'lost') {
      if (this.time.now - this.lostAt > 900) this.finishLose();
      return;
    }
    // Playing: advance the sim (cap dt so a background tab never jumps).
    const dt = Math.min(delta, 50) / 1000;
    this.sim.step(dt);
    this.syncPlates();
    this.syncCats();
    this.syncChef();
    this.updateHud();
    // Miss feedback: a normal plate just exited unserved.
    if (this.sim.missed > this.lastMissed) {
      this.lastMissed = this.sim.missed;
      juice(this, 'small', DESIGN_W - 20, BELT_Y);
      if (Save.data.settings.shake) this.cameras.main.shake(90, 0.006);
    }
    if (this.sim.outcome === 'won') {
      this.state = 'won';
      this.wonAt = this.time.now;
      AudioEngine.win();
      const confetti = this.add.particles(DESIGN_W / 2, 300, 'dot', {
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
      for (let i = 0; i < 3; i++) this.setCatMood(i as CatColor, 'happy', 1200);
    } else if (this.sim.outcome === 'lost') {
      this.state = 'lost';
      this.lostAt = this.time.now;
      AudioEngine.fail();
      const grey = this.add.rectangle(0, 0, DESIGN_W, DESIGN_H, 0x141414, 0.3).setOrigin(0).setDepth(10);
      void grey;
    }
  }

  /** Create/move/destroy plate sprites to match the sim. */
  private syncPlates(): void {
    for (const p of this.sim.plates) {
      const view = this.plateViews.get(p.def.id);
      if (!p.spawned || p.done) {
        if (view && !view.animating) {
          view.img.destroy();
          this.plateViews.delete(p.def.id);
        }
        continue;
      }
      if (!view) {
        const key = this.plateKey(p.def);
        const img = this.add.image(p.x, BELT_Y, key).setDisplaySize(PLATE_SIZE, PLATE_SIZE).setDepth(2);
        // Pop-in: grow from 60% back to the DISPLAY size. setScale is
        // ABSOLUTE — tweening scaleX/scaleY to 1 would restore the
        // texture's NATURAL size (4x, 224 px) and the plates rendered
        // ~2.5x too big, overlapping the belt and the chef (screenshot
        // 16/11: three giant plates on L6).
        const baseSX = img.scaleX;
        const baseSY = img.scaleY;
        img.setScale(baseSX * 0.6, baseSY * 0.6);
        this.tweens.add({ targets: img, scaleX: baseSX, scaleY: baseSY, duration: 160 });
        this.plateViews.set(p.def.id, { def: p.def, img, animating: false });
      } else if (!view.animating && this.dragPlate !== p.def.id) {
        view.img.setPosition(p.x, BELT_Y);
        view.img.setDepth(2);
      }
    }
  }

  private plateKey(def: PlateDef): string {
    if (def.kind === 'wasabi') return 'plate-wasabi';
    const colorName = CAT_NAMES[def.color as CatColor];
    if (def.golden) return `plate-golden-${colorName}`;
    return `plate-${def.sushi}-${colorName}`;
  }

  /** Cat moods follow the sim: stunned = cough, timed moods expire. */
  private syncCats(): void {
    for (let i = 0; i < 3; i++) {
      const view = this.cats[i];
      if (!view) continue;
      const stunned = this.sim.time < this.sim.stunnedUntil[i];
      if (stunned) {
        if (view.mood !== 'cough') {
          view.mood = 'cough';
          view.img.setTexture(`cat-${CAT_NAMES[i]}-cough`);
        }
        continue;
      }
      if (view.mood !== 'idle' && this.time.now >= view.moodUntil) {
        view.mood = 'idle';
        view.img.setTexture(`cat-${CAT_NAMES[i]}-idle`);
      }
    }
  }

  /** The chef warns (points + text) when a wasabi or golden plate is
   * about to enter, ~1.6 s ahead. */
  private syncChef(): void {
    let warning = '';
    for (const p of this.sim.schedule) {
      if (p.spawnAt <= this.sim.time) continue;
      if (p.spawnAt - this.sim.time > 1.6) break;
      if (p.kind === 'wasabi') {
        warning = 'WASABI!';
        break;
      }
      if (p.golden) {
        warning = '★ GOLDEN!';
        break;
      }
    }
    if (warning !== this.lastWarning) {
      this.lastWarning = warning;
      this.chefImg.setTexture(warning ? 'chef-cat-point' : 'chef-cat');
      this.chefWarn?.setText(warning);
    }
  }

  // ---------- win / lose ----------

  private finishWin(): void {
    const stars = this.sim.stars();
    const coinsEarned = 25 + (stars === 3 ? 25 : 0) + Math.floor(this.sim.score / 50);
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
      coinsCollected: this.sim.served, daily: this.daily,
    });
  }

  private finishLose(): void {
    this.scene.start('Result', {
      level: this.levelN, win: false, stars: 0, coinsEarned: 0,
      coinsCollected: this.sim.served, daily: this.daily,
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
    if (this.state !== 'playing') return;
    this.prevState = this.state;
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
      score: this.sim.score,
      combo: this.sim.combo,
      bestCombo: this.sim.bestCombo,
      hearts: this.sim.hearts,
      served: this.sim.served,
      missed: this.sim.missed,
      target: this.level.target,
      outcome: this.sim.outcome,
      stars: this.sim.stars(),
      boostLeft: this.sim.boostLeft,
      platesOnBelt: this.sim.snapshot().platesOnBelt,
      viewsOnBelt: this.plateViews.size,
      stunned: this.sim.stunnedUntil.map((u) => +(Math.max(0, u - this.sim.time).toFixed(2))),
    };
  }

  /**
   * Advance the sim by dt seconds WITHOUT waiting on rAF. Headless
   * Chromium throttles rAF on a backgrounded page AND the update loop
   * caps dt at 50 ms, so the game clock crawls (~1/6 speed) and wall-time
   * probes time out — L6 could not be verified that way (smoke run 2,
   * 16/11). testStep mirrors update(): sim + sync + HUD + win/lose.
   */
  testStep(dt: number): void {
    if (this.state !== 'playing') return;
    this.sim.step(dt);
    this.syncPlates();
    this.syncCats();
    this.syncChef();
    this.updateHud();
    if (this.sim.missed > this.lastMissed) this.lastMissed = this.sim.missed;
    if (this.sim.outcome === 'won' || this.sim.outcome === 'lost') {
      this.state = this.sim.outcome;
      if (this.sim.outcome === 'won') {
        this.wonAt = this.time.now;
        AudioEngine.win();
        for (let i = 0; i < 3; i++) this.setCatMood(i as CatColor, 'happy', 1200);
      } else {
        this.lostAt = this.time.now;
        AudioEngine.fail();
      }
    }
  }

  testTapPlate(plateId: number): void {
    const v = this.plateViews.get(plateId);
    if (!v) return;
    this.handleServe(this.sim.tap(plateId), v.def, v);
  }

  testServePlate(plateId: number, cat: number): void {
    const v = this.plateViews.get(plateId);
    if (!v) return;
    this.handleServe(this.sim.serve(plateId, cat as CatColor), v.def, v, cat as CatColor);
  }

  testBoost(): void {
    this.useBoost();
  }

  testSchedule(): PlateDef[] {
    return this.sim.schedule;
  }
}
