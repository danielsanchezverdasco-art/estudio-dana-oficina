// Doubloon Rush — GameScene: the whack-a-chest round.
// 3x4 sand mounds; chests pop up (wood 10 / silver 25 / gold 50), bombs cost
// a life, crabs steal up-chests, the golden doubloon is rare with REAL shown
// odds. 45-60 s rounds, combo multiplier, stars, tutorial on level 1.

import Phaser from 'phaser';
import { t } from '../i18n';
import {
  levelConfig,
  pickSpawn,
  spawnWeights,
  pointsFor,
  starsFor,
  comboMultiplier,
  bombPenalty,
  doubloonOddsText,
  GRID_COLS,
  GRID_ROWS,
  MAX_LIVES,
  type LevelConfig,
  type SpawnKind,
} from '../rules/rules';
import { loadSave, writeSave, isLevelUnlocked, TOTAL_LEVELS, type SaveData } from '../save';
import { playSfx, vibrate, setMuted } from '../audio';
import { showRewarded, isRewardedSupported } from '../bridge/bridge';
import { makeButton, makeIconButton, makePanel, shadowed, coverFit, textStyle, CREAM } from './ui';
import MapScene from './MapScene';

type PopupState = 'up' | 'hit' | 'sinking';

interface Popup {
  cell: number;
  kind: SpawnKind;
  state: PopupState;
  container: Phaser.GameObjects.Container;
  sprite: Phaser.GameObjects.Image;
  extra?: Phaser.GameObjects.Image; // doubloon coin above the chest
  sinkTimer?: Phaser.Time.TimerEvent;
  walkTween?: Phaser.Tweens.Tween;
}

interface CellPos {
  x: number;
  y: number;
}

export default class GameScene extends Phaser.Scene {
  private level = 1;
  private daily = false;
  private cfg!: LevelConfig;
  private save: SaveData | null = null;

  private score = 0;
  private combo = 0;
  private lives = MAX_LIVES;
  private timeLeft = 45;
  private doubloonsFound = 0;
  private luckUntil = 0;
  private started = false;
  private over = false;
  private pausedFlag = false;
  private continueOffered = false;

  private cells: CellPos[] = [];
  private mounds: Phaser.GameObjects.Image[] = [];
  private popups = new Map<number, Popup>();
  private spawnEvent: Phaser.Time.TimerEvent | null = null;
  private timerEvent: Phaser.Time.TimerEvent | null = null;

  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private oddsText!: Phaser.GameObjects.Text;
  private luckText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private pauseBtn: Phaser.GameObjects.Container | null = null;
  private muteBtn: Phaser.GameObjects.Container | null = null;
  private startOverlay: Phaser.GameObjects.Container | null = null;
  private pauseOverlay: Phaser.GameObjects.Container | null = null;

  // Tutorial (level 1, first time only).
  private tutorialStep = 0; // 0 off, 1 tap chest, 2 avoid bomb, 3 scare crab
  private hand: Phaser.GameObjects.Image | null = null;
  private tutorialText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('Game');
  }

  init(data: { level?: number }): void {
    this.level = data.level ?? 1;
    this.daily = this.level === -1;
  }

  create(): void {
    const W = this.scale.width;
    const H = this.scale.height;

    const bg = this.add.image(0, 0, W > H ? 'bg-beach-landscape' : 'bg-beach').setOrigin(0.5);
    coverFit(bg, W, H);

    void loadSave().then((save) => {
      this.save = save;
      setMuted(!save.soundOn);
      const lvl = this.daily ? Math.max(1, save.unlockedLevel) : this.level;
      this.cfg = levelConfig(lvl);
      if (this.daily) {
        // Daily challenge: doubloon twice as likely, same difficulty.
        this.cfg = { ...this.cfg, doubloonOneIn: Math.max(60, Math.floor(this.cfg.doubloonOneIn / 2)) };
      }
      this.timeLeft = this.cfg.durationSec;
      this.luckUntil = (this.registry.get('luckUntil') as number) || 0;
      this.buildHud();
      this.buildGrid();
      this.showStartOverlay();
      this.updateHud();
    });

    this.scale.on('resize', this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.onResize, this);
      this.spawnEvent?.destroy();
      this.timerEvent?.destroy();
    });
  }

  // ---------- layout ----------

  private gridMetrics(): { cell: number; top: number; left: number } {
    const W = this.scale.width;
    const H = this.scale.height;
    const hudH = 150;
    const bottomH = 70;
    const availW = W - 24;
    const availH = H - hudH - bottomH;
    const cell = Math.max(64, Math.min(availW / GRID_COLS, availH / GRID_ROWS));
    const gridW = cell * GRID_COLS;
    const gridH = cell * GRID_ROWS;
    return { cell, top: hudH + (availH - gridH) / 2, left: (W - gridW) / 2 };
  }

  private cellPos(i: number): CellPos {
    const { cell, top, left } = this.gridMetrics();
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    return { x: left + col * cell + cell / 2, y: top + row * cell + cell / 2 };
  }

  private buildGrid(): void {
    this.cells = [];
    this.mounds = [];
    for (let i = 0; i < GRID_COLS * GRID_ROWS; i++) {
      const p = this.cellPos(i);
      this.cells.push(p);
      const mound = this.add
        .image(p.x, p.y + this.gridMetrics().cell * 0.28, 'chests', 'mound')
        .setDepth(2);
      const { cell } = this.gridMetrics();
      mound.setDisplaySize(cell * 1.05, (cell * 1.05 * 181) / 364);
      this.mounds.push(mound);
    }
  }

  private layoutAll(): void {
    const W = this.scale.width;
    const H = this.scale.height;
    const bg = this.children.getAt(0) as Phaser.GameObjects.Image;
    bg.setTexture(W > H ? 'bg-beach-landscape' : 'bg-beach');
    coverFit(bg, W, H);
    for (let i = 0; i < this.cells.length; i++) {
      const p = this.cellPos(i);
      this.cells[i] = p;
      const { cell } = this.gridMetrics();
      this.mounds[i].setPosition(p.x, p.y + cell * 0.28);
      const popup = this.popups.get(i);
      if (popup) popup.container.setPosition(p.x, p.y + cell * 0.28);
    }
    this.buildHudPositions();
  }

  // ---------- HUD ----------

  private buildHud(): void {
    const W = this.scale.width;
    this.scoreText = shadowed(this, 16, 24, '', 26).setOrigin(0, 0.5);
    this.timeText = shadowed(this, W / 2, 24, '', 30, '#ffd23e').setOrigin(0.5);
    this.livesText = shadowed(this, W - 16, 24, '', 26, '#ff6b6b').setOrigin(1, 0.5);
    this.comboText = shadowed(this, 16, 58, '', 20, '#ffd23e').setOrigin(0, 0.5);
    this.oddsText = shadowed(this, W - 16, 58, '', 16).setOrigin(1, 0.5);
    this.luckText = shadowed(this, W / 2, 58, '', 18, '#7CFC00').setOrigin(0.5);

    this.pauseBtn = makeIconButton(this, W - 40, 108, 'II', () => this.togglePause(), 52);
    this.muteBtn = makeIconButton(this, W - 100, 108, '♪', () => {
      if (!this.save) return;
      this.save.soundOn = !this.save.soundOn;
      setMuted(!this.save.soundOn);
      void writeSave(this.save);
    }, 52);
    this.levelText = shadowed(this, 16, 108, this.daily ? t('daily') : `${t('level')} ${this.level}`, 22).setOrigin(0, 0.5);
  }

  private buildHudPositions(): void {
    // Re-position HUD after a resize (texts keep their content).
    const W = this.scale.width;
    this.timeText?.setX(W / 2);
    this.livesText?.setX(W - 16);
    this.oddsText?.setX(W - 16);
    this.luckText?.setX(W / 2);
    this.pauseBtn?.setPosition(W - 40, 108);
    this.muteBtn?.setPosition(W - 100, 108);
  }

  private luckMultiplier(): number {
    return Date.now() < this.luckUntil ? 2 : 1;
  }

  private updateHud(): void {
    if (!this.scoreText) return;
    this.scoreText.setText(`${t('score')}: ${this.score}`);
    this.timeText.setText(`${this.timeLeft}s`);
    this.livesText.setText('♥'.repeat(Math.max(0, this.lives)));
    const mult = comboMultiplier(this.combo) * this.luckMultiplier();
    this.comboText.setText(this.combo >= 2 ? `${t('combo')} x${mult.toFixed(1)}` : '');
    this.oddsText.setText(`⬤ ${t('doubloonOdds')}: ${doubloonOddsText(this.cfg.doubloonOneIn)}`);
    this.luckText.setText(
      this.luckMultiplier() > 1
        ? `${t('luck')} ${Math.ceil((this.luckUntil - Date.now()) / 1000)}s`
        : '',
    );
  }

  // ---------- start / pause ----------

  private showStartOverlay(): void {
    const W = this.scale.width;
    const H = this.scale.height;
    const overlay = this.add.container(W / 2, H / 2).setDepth(40);
    const dim = this.add.rectangle(0, 0, W + 40, H + 40, 0x000000, 0.45).setOrigin(0.5);
    const title = shadowed(this, 0, -60, this.daily ? t('daily') : `${t('level')} ${this.level}`, 44, '#ffd23e');
    const tap = shadowed(this, 0, 0, t('tapToStart'), 28);
    overlay.add([dim, title, tap]);
    this.tweens.add({ targets: tap, scale: 1.12, duration: 500, yoyo: true, repeat: -1 });
    dim.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, W + 40, H + 40),
      Phaser.Geom.Rectangle.Contains,
    );
    dim.on('pointerdown', () => {
      playSfx('click');
      overlay.destroy();
      this.startOverlay = null;
      this.startRound();
    });
    this.startOverlay = overlay;

    // Tutorial on level 1, first time.
    if (this.level === 1 && this.save && !this.save.tutorialSeen) {
      this.tutorialStep = 1;
    }
  }

  private startRound(): void {
    this.started = true;
    this.spawnEvent = this.time.addEvent({
      delay: this.cfg.spawnIntervalMs,
      loop: true,
      callback: () => this.trySpawn(),
    });
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.over || this.pausedFlag) return;
        this.timeLeft -= 1;
        this.updateHud();
        if (this.timeLeft <= 0) void this.endRound(true);
      },
    });
    // First spawn comes fast so the player is never staring at sand.
    this.time.delayedCall(350, () => this.trySpawn());
  }

  private togglePause(): void {
    this.setPaused(!this.pausedFlag);
  }

  /** Called by the platform (Bridge pause / visibility events). */
  autoPause(): void {
    if (this.started && !this.over) this.setPaused(true);
  }

  autoResume(): void {
    if (this.started && !this.over) this.setPaused(false);
  }

  private setPaused(paused: boolean): void {
    if (!this.started || this.over) return;
    if (paused === this.pausedFlag) return;
    if (paused) {
      this.pausedFlag = true;
      this.time.paused = true;
      this.tweens.paused = true;
      const W = this.scale.width;
      const { container } = makePanel(this, Math.min(320, W - 40), 360);
      container.setDepth(60);
      const title = shadowed(this, 0, -140, t('pause'), 36, '#ffd23e');
      const resume = makeButton(this, 0, -40, t('resume'), () => this.togglePause(), { w: 220, h: 72, fontSize: 26 });
      const restart = makeButton(this, 0, 50, t('restart'), () => {
        playSfx('click');
        this.scene.restart({ level: this.daily ? -1 : this.level });
      }, { w: 220, h: 72, fontSize: 26, bg: 0x8a5a2b, border: 0x5d3a17 });
      const menu = makeButton(this, 0, 140, t('menu'), () => {
        playSfx('click');
        this.scene.start('Map');
      }, { w: 220, h: 72, fontSize: 26, bg: 0x616161, border: 0x424242 });
      container.add([title, resume, restart, menu]);
      this.pauseOverlay = container;
      playSfx('click');
    } else {
      this.pausedFlag = false;
      this.time.paused = false;
      this.tweens.paused = false;
      this.pauseOverlay?.destroy();
      this.pauseOverlay = null;
      playSfx('click');
    }
  }

  // ---------- spawning ----------

  private freeCells(): number[] {
    const free: number[] = [];
    for (let i = 0; i < GRID_COLS * GRID_ROWS; i++) {
      if (!this.popups.has(i)) free.push(i);
    }
    return free;
  }

  private trySpawn(): void {
    if (!this.started || this.over || this.pausedFlag) return;
    const active = this.popups.size;
    if (active >= this.cfg.maxConcurrent) return;
    const free = this.freeCells();
    if (free.length === 0) return;
    const cell = free[Math.floor(Math.random() * free.length)];
    const kind = pickSpawn(Math.random(), spawnWeights(this.cfg));
    this.spawnPopup(cell, kind);
  }

  private spawnPopup(cell: number, kind: SpawnKind): void {
    const p = this.cells[cell];
    const { cell: cellSize } = this.gridMetrics();
    const container = this.add.container(p.x, p.y + cellSize * 0.28).setDepth(1);

    let frame: string;
    let atlas = 'chests';
    if (kind === 'bomb') {
      frame = 'bomb';
      atlas = 'items';
    } else if (kind === 'crab') {
      frame = 'crab';
      atlas = 'items';
    } else if (kind === 'doubloon') {
      frame = 'chest_gold_open';
    } else {
      frame = `chest_${kind}_closed`;
    }
    const sprite = this.add.image(0, 0, atlas, frame).setOrigin(0.5, 1);
    const w = cellSize * (kind === 'crab' ? 0.8 : 0.88);
    sprite.setDisplaySize(w, (w * sprite.height) / sprite.width);
    container.add(sprite);
    container.setScale(1, 0);
    this.tweens.add({ targets: container, scaleY: 1, duration: 160, ease: 'Back.easeOut' });

    const popup: Popup = { cell, kind, state: 'up', container, sprite };
    this.popups.set(cell, popup);

    // Doubloon: spinning coin above the chest.
    if (kind === 'doubloon') {
      const coin = this.add.image(0, -sprite.displayHeight - 6, 'items', 'doubloon').setOrigin(0.5, 1);
      coin.setDisplaySize(cellSize * 0.42, cellSize * 0.42);
      container.add(coin);
      this.tweens.add({ targets: coin, angle: 360, duration: 900, repeat: -1 });
      popup.extra = coin;
    }

    // Interactive hit area in LOCAL coords, top-left relative: Phaser adds
    // displayOrigin (in FRAME pixels: origin 0.5,1 -> w/2, h) to the tested
    // point, and the local point is also in frame space — so the rect must
    // use sprite.width/height (the frame), NOT displayWidth/displayHeight.
    const hitW = sprite.width * 1.15;
    const hitH = sprite.height * 1.3;
    sprite.setInteractive(
      new Phaser.Geom.Rectangle(
        (sprite.width - hitW) / 2,
        (sprite.height - hitH) / 2,
        hitW,
        hitH,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    sprite.on('pointerdown', () => this.onTapPopup(popup));

    const upTime = kind === 'gold' || kind === 'doubloon' ? this.cfg.goldUpTimeMs : this.cfg.upTimeMs;
    popup.sinkTimer = this.time.delayedCall(upTime, () => this.sinkPopup(popup, false));

    if (kind === 'crab') this.startCrabWalk(popup);
    if (kind === 'bomb' && this.tutorialStep === 2) this.showTutorialHand(cell, t('tutorialBomb'));
    if (kind === 'crab' && this.tutorialStep === 3) this.showTutorialHand(cell, t('tutorialCrab'));
    if (
      (kind === 'wood' || kind === 'silver' || kind === 'gold') &&
      this.tutorialStep === 1
    ) {
      this.showTutorialHand(cell, t('tutorialTap'));
    }
    playSfx('pop');
  }

  private startCrabWalk(popup: Popup): void {
    // The crab walks toward the nearest up-chest; if it gets there, the chest is stolen.
    const target = this.nearestChestCell(popup.cell);
    if (target === null) {
      // No chest up: the crab just wanders off after a moment.
      popup.sinkTimer?.destroy();
      popup.sinkTimer = this.time.delayedCall(1800, () => this.sinkPopup(popup, false));
      return;
    }
    const from = this.cells[popup.cell];
    const to = this.cells[target];
    popup.walkTween = this.tweens.add({
      targets: popup.container,
      x: to.x,
      duration: 2400,
      onComplete: () => {
        const victim = this.popups.get(target);
        if (victim && victim.state === 'up' && (victim.kind === 'wood' || victim.kind === 'silver' || victim.kind === 'gold')) {
          this.floatText(to.x, to.y - 30, t('crabStole'), '#ff6b6b');
          playSfx('crab');
          this.sinkPopup(victim, true);
        }
        this.sinkPopup(popup, false);
      },
    });
  }

  private nearestChestCell(fromCell: number): number | null {
    let best: number | null = null;
    let bestD = Infinity;
    for (const [cell, p] of this.popups) {
      if (cell === fromCell || p.state !== 'up') continue;
      if (p.kind !== 'wood' && p.kind !== 'silver' && p.kind !== 'gold') continue;
      const d = Math.abs(this.cells[cell].x - this.cells[fromCell].x) +
        Math.abs(this.cells[cell].y - this.cells[fromCell].y);
      if (d < bestD) {
        bestD = d;
        best = cell;
      }
    }
    return best;
  }

  private sinkPopup(popup: Popup, stolen: boolean): void {
    if (popup.state === 'sinking') return;
    if (!popup.container.active) return;
    popup.state = 'sinking';
    popup.sinkTimer?.destroy();
    popup.walkTween?.stop();
    // Only a scoring chest that sinks untapped breaks the combo.
    if (!stolen && (popup.kind === 'wood' || popup.kind === 'silver' || popup.kind === 'gold')) {
      this.combo = 0;
    }
    this.updateHud();
    this.tweens.add({
      targets: popup.container,
      scaleY: 0,
      duration: 130,
      onComplete: () => {
        popup.container.destroy();
        if (this.popups.get(popup.cell) === popup) this.popups.delete(popup.cell);
      },
    });
  }

  // ---------- tapping ----------

  private onTapPopup(popup: Popup): void {
    if (!this.started || this.over || this.pausedFlag || popup.state !== 'up') return;
    popup.sinkTimer?.destroy();
    popup.walkTween?.stop();

    switch (popup.kind) {
      case 'wood':
      case 'silver':
      case 'gold':
        this.hitChest(popup);
        break;
      case 'doubloon':
        this.hitDoubloon(popup);
        break;
      case 'bomb':
        this.hitBomb(popup);
        break;
      case 'crab':
        this.hitCrab(popup);
        break;
    }
  }

  private hitChest(popup: Popup): void {
    popup.state = 'hit';
    const kind = popup.kind as 'wood' | 'silver' | 'gold';
    popup.sprite.setTexture('chests', `chest_${kind}_open`);
    this.combo += 1;
    const pts = pointsFor(kind, this.combo, this.luckMultiplier());
    this.score += pts;
    playSfx(kind === 'gold' ? 'gold' : 'coin');
    vibrate(12);
    this.coinBurst(popup.container.x, popup.container.y - 20, 5);
    this.floatText(popup.container.x, popup.container.y - 60, `+${pts}`, '#ffd23e');
    this.updateHud();
    if (this.tutorialStep === 1) {
      this.tutorialStep = 2;
      this.hideTutorialHand();
      // The next bomb teaches the rule; if none comes soon, move on.
      this.time.delayedCall(9000, () => {
        if (this.tutorialStep === 2) {
          this.tutorialStep = 3;
          this.hideTutorialHand();
        }
      });
    }
    this.time.delayedCall(280, () => this.sinkPopup(popup, true));
  }

  private hitDoubloon(popup: Popup): void {
    popup.state = 'hit';
    this.combo += 1;
    this.doubloonsFound += 1;
    const pts = pointsFor('doubloon', this.combo, this.luckMultiplier());
    this.score += pts;
    playSfx('doubloon');
    vibrate(80);
    this.coinBurst(popup.container.x, popup.container.y - 40, 16);
    this.floatText(popup.container.x, popup.container.y - 90, t('doubloonFound'), '#ffd23e', 30);
    this.floatText(
      popup.container.x,
      popup.container.y - 55,
      t('doubloonFoundSub', { n: this.cfg.doubloonOneIn }),
      '#fff6d8',
      18,
    );
    this.updateHud();
    this.time.delayedCall(350, () => this.sinkPopup(popup, true));
  }

  private hitCrab(popup: Popup): void {
    popup.state = 'hit';
    this.combo += 1;
    const pts = pointsFor('crab', this.combo, this.luckMultiplier());
    this.score += pts;
    playSfx('crab');
    vibrate(12);
    this.floatText(popup.container.x, popup.container.y - 60, `+${pts}`, '#7CFC00');
    this.updateHud();
    if (this.tutorialStep === 3) {
      this.tutorialStep = 0;
      this.hideTutorialHand();
      if (this.save) {
        this.save.tutorialSeen = true;
        void writeSave(this.save);
      }
    }
    this.tweens.add({
      targets: popup.container,
      y: popup.container.y - 90,
      alpha: 0,
      duration: 350,
      onComplete: () => {
        popup.container.destroy();
        if (this.popups.get(popup.cell) === popup) this.popups.delete(popup.cell);
      },
    });
  }

  private hitBomb(popup: Popup): void {
    popup.state = 'hit';
    const { livesLost } = bombPenalty();
    this.lives -= livesLost;
    this.combo = 0;
    playSfx('bomb');
    vibrate([60, 40, 60]);
    this.floatText(popup.container.x, popup.container.y - 60, t('bombHit'), '#ff6b6b', 24);
    this.cameras.main.shake(180, 0.008);
    this.updateHud();
    if (this.tutorialStep === 2) {
      this.tutorialStep = 3;
      this.hideTutorialHand();
    }
    this.time.delayedCall(300, () => {
      popup.container.destroy();
      if (this.popups.get(popup.cell) === popup) this.popups.delete(popup.cell);
    });
    if (this.lives <= 0) {
      this.offerContinueOrEnd();
    }
  }

  private offerContinueOrEnd(): void {
    if (this.continueOffered) {
      void this.endRound(false);
      return;
    }
    this.continueOffered = true;
    if (!isRewardedSupported()) {
      void this.endRound(false);
      return;
    }
    // Pause the round while the offer is on screen.
    this.pausedFlag = true;
    this.time.paused = true;
    const W = this.scale.width;
    const { container } = makePanel(this, Math.min(330, W - 32), 340);
    container.setDepth(60);
    const title = shadowed(this, 0, -130, t('levelFailed'), 32, '#ff6b6b');
    const desc = shadowed(this, 0, -70, t('continueDesc'), 20);
    const watch = makeButton(this, 0, 0, `${t('watchAd')} ▶`, () => {
      playSfx('click');
      container.destroy();
      void showRewarded().then((rewarded) => {
        if (rewarded) {
          this.lives = 1;
          this.pausedFlag = false;
          this.time.paused = false;
          this.tweens.paused = false;
          this.updateHud();
        } else {
          void this.endRound(false);
        }
      });
    }, { w: 260, h: 72, fontSize: 24 });
    const no = makeButton(this, 0, 90, t('noThanks'), () => {
      playSfx('click');
      container.destroy();
      void this.endRound(false);
    }, { w: 260, h: 72, fontSize: 24, bg: 0x616161, border: 0x424242 });
    container.add([title, desc, watch, no]);
  }

  // ---------- effects ----------

  private coinBurst(x: number, y: number, n: number): void {
    for (let i = 0; i < n; i++) {
      const coin = this.add
        .image(x, y, 'items', i % 3 === 0 ? 'sparkle' : 'coins')
        .setScale(0.14)
        .setDepth(20);
      this.tweens.add({
        targets: coin,
        x: x + Phaser.Math.Between(-70, 70),
        y: y - Phaser.Math.Between(40, 130),
        angle: Phaser.Math.Between(-160, 160),
        alpha: 0,
        duration: 650,
        onComplete: () => coin.destroy(),
      });
    }
  }

  private floatText(x: number, y: number, str: string, color: string, size = 22): void {
    const txt = this.add
      .text(x, y, str, textStyle(size, color))
      .setOrigin(0.5)
      .setDepth(30);
    txt.setShadow(0, 2, 'rgba(0,0,0,0.5)', 0, true, true);
    this.tweens.add({
      targets: txt,
      y: y - 44,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy(),
    });
  }

  // ---------- tutorial ----------

  private showTutorialHand(cell: number, message: string): void {
    this.hideTutorialHand();
    const p = this.cells[cell];
    this.hand = this.add.image(p.x + 30, p.y - 70, 'hand').setDepth(35).setScale(0.35);
    this.tweens.add({ targets: this.hand, y: p.y - 50, duration: 450, yoyo: true, repeat: -1 });
    this.tutorialText = shadowed(this, p.x, p.y - 130, message, 22, '#ffd23e').setDepth(35);
  }

  private hideTutorialHand(): void {
    this.hand?.destroy();
    this.hand = null;
    this.tutorialText?.destroy();
    this.tutorialText = null;
  }

  // ---------- round end ----------

  private async endRound(completed: boolean): Promise<void> {
    if (this.over) return;
    this.over = true;
    this.spawnEvent?.destroy();
    this.timerEvent?.destroy();
    for (const popup of [...this.popups.values()]) {
      popup.sinkTimer?.destroy();
      popup.walkTween?.stop();
      popup.container.destroy();
    }
    this.popups.clear();
    this.hideTutorialHand();

    const save = (await loadSave()) as SaveData;
    const thresholds = this.cfg.starThresholds;
    const stars = completed ? starsFor(this.score, thresholds) : 0;
    const prevBest = save.bestScores[String(this.level)] ?? 0;
    const isNewBest = this.score > prevBest;
    if (completed) {
      if (this.score > prevBest) save.bestScores[String(this.level)] = this.score;
      const prevStars = save.stars[String(this.level)] ?? 0;
      if (stars > prevStars) save.stars[String(this.level)] = stars;
      if (this.level < TOTAL_LEVELS && this.level >= save.unlockedLevel) {
        save.unlockedLevel = Math.min(TOTAL_LEVELS, this.level + 1);
      }
      save.totalCoins += this.score;
      save.doubloonsFound += this.doubloonsFound;
      if (this.daily) await MapScene.markDailyPlayed(save);
      await writeSave(save);
    }
    playSfx(completed && stars > 0 ? 'win' : 'lose');
    this.scene.start('Results', {
      level: this.level,
      daily: this.daily,
      score: this.score,
      stars,
      best: Math.max(prevBest, this.score),
      isNewBest,
      completed,
      doubloons: this.doubloonsFound,
    });
  }

  private onResize(): void {
    if (!this.save) return;
    this.layoutAll();
  }
}
