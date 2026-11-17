// Doubloon Rush — MapScene: 30 levels on the parchment treasure map.
// Serpentine path, stars per level, locked nodes greyed, daily challenge
// (better doubloon odds, keeps the streak alive).

import Phaser from 'phaser';
import { t } from '../i18n';
import {
  loadSave,
  writeSave,
  isLevelUnlocked,
  totalStars,
  todayKey,
  yesterdayKey,
  TOTAL_LEVELS,
  type SaveData,
} from '../save';
import { coverFit, makeButton, makeIconButton, shadowed } from './ui';

export default class MapScene extends Phaser.Scene {
  private save: SaveData | null = null;

  constructor() {
    super('Map');
  }

  create(): void {
    const W = this.scale.width;
    const H = this.scale.height;

    const bg = this.add.image(0, 0, 'bg-map').setOrigin(0.5);
    coverFit(bg, W, H);

    shadowed(this, W / 2, 46, t('map'), 40, '#ffd23e');
    makeIconButton(this, 40, 44, '‹', () => {
      this.scene.start('Menu');
    });

    void loadSave().then((save) => {
      this.save = save;
      this.buildNodes(save);
      shadowed(this, W / 2, 86, `★ ${totalStars(save)}/90`, 22);
    });

    // Daily challenge button (bottom).
    makeButton(this, W / 2, H - 56, `${t('daily')} ★`, () => {
      this.scene.start('Game', { level: -1 }); // -1 = daily challenge
    }, { w: 280, h: 72, fontSize: 24, bg: 0x6a1b9a, border: 0x4a148c });

    this.scale.on('resize', this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.onResize, this);
    });
  }

  private buildNodes(save: SaveData): void {
    const W = this.scale.width;
    const H = this.scale.height;
    const top = 130;
    const bottom = H - 130;
    const cols = 3;
    const rows = Math.ceil(TOTAL_LEVELS / cols); // 10 rows
    const rowH = (bottom - top) / (rows - 1);
    const colX = [W * 0.22, W * 0.5, W * 0.78];

    for (let level = 1; level <= TOTAL_LEVELS; level++) {
      const row = Math.floor((level - 1) / cols);
      const colInRow = (level - 1) % cols;
      // Serpentine: even rows go left->right, odd rows right->left.
      const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
      const x = colX[col] + (row % 2 === 0 ? 0 : 0);
      const y = top + row * rowH;
      const unlocked = isLevelUnlocked(save, level);
      const stars = save.stars[String(level)] ?? 0;

      const node = this.add.container(x, y);
      const g = this.add.graphics();
      const r = 26;
      g.fillStyle(unlocked ? 0x2e7d32 : 0x9e9e9e, 1);
      g.fillCircle(0, 0, r);
      g.lineStyle(3, unlocked ? 0xfff6d8 : 0x616161, 1);
      g.strokeCircle(0, 0, r);
      const label = this.add
        .text(0, 0, unlocked ? String(level) : '🔒', {
          fontFamily: '"Lilita One", sans-serif',
          fontSize: unlocked ? '22px' : '18px',
          color: '#fff6d8',
        })
        .setOrigin(0.5);
      node.add([g, label]);

      if (stars > 0) {
        const starTxt = this.add
          .text(0, r + 12, '★'.repeat(stars), {
            fontFamily: '"Lilita One", sans-serif',
            fontSize: '14px',
            color: '#ffd23e',
            stroke: '#3a2410',
            strokeThickness: 3,
          })
          .setOrigin(0.5, 0);
        node.add(starTxt);
      }

      if (unlocked) {
        node.setInteractive(
          new Phaser.Geom.Rectangle(-r, -r, r * 2, r * 2),
          Phaser.Geom.Rectangle.Contains,
        );
        node.on('pointerup', () => {
          this.scene.start('Game', { level });
        });
      } else {
        node.setAlpha(0.75);
      }
    }
  }

  /** Mark the daily challenge as played today (streak logic). */
  static async markDailyPlayed(save: SaveData): Promise<SaveData> {
    const today = todayKey();
    if (save.lastDailyDate === today) return save;
    save.streakDays = save.lastDailyDate === yesterdayKey() ? save.streakDays + 1 : 1;
    save.lastDailyDate = today;
    await writeSave(save);
    return save;
  }

  private onResize(): void {
    this.scene.restart();
  }
}
