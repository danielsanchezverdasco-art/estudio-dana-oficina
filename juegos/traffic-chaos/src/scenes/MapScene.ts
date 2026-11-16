// Map: 30 levels across 3 neighborhoods (Times Square 1–10, Brooklyn Bridge
// 11–20, Central Park 21–30), plus the Daily Rush chip. Nodes show stars;
// locked nodes are grey with a lock. Tapping a node starts that level.
import { GAME_W } from '../config';
import { t } from '../i18n';
import { LEVELS, dailyLevel, neighborhoodNameKey, type Neighborhood } from '../levels';
import { Save } from '../save';
import { COLORS, FONT_BODY, FONT_DISPLAY, drawStar, makeButton } from '../ui';

const SECTIONS: Array<{ nb: Neighborhood; from: number }> = [
  { nb: 'times-square', from: 1 },
  { nb: 'brooklyn-bridge', from: 11 },
  { nb: 'central-park', from: 21 },
];

export class MapScene extends Phaser.Scene {
  constructor() {
    super('Map');
  }

  create(): void {
    this.add.image(0, 0, 'bg-night').setOrigin(0).setDepth(0);
    const dim = this.add.rectangle(0, 0, GAME_W, 844, 0x0f172a, 0.45).setOrigin(0).setDepth(1);
    void dim;

    this.add
      .text(GAME_W / 2, 28, t('map'), {
        fontFamily: FONT_DISPLAY,
        fontSize: '34px',
        color: '#ffffff',
        stroke: '#141414',
        strokeThickness: 7,
      })
      .setOrigin(0.5, 0)
      .setDepth(10);

    // Daily Rush chip.
    const daily = dailyLevel();
    const dailyDone = Save.dailyDoneToday();
    makeButton(this, GAME_W / 2, 96, {
      w: 300,
      h: 52,
      label: `📅 ${t('daily')} — ${t('level')} ${daily}${dailyDone ? ' ✓' : ''}`,
      fontSize: 18,
      color: dailyDone ? COLORS.leaf : COLORS.sun,
      textColor: dailyDone ? '#ffffff' : COLORS.inkCss,
      onClick: () => this.scene.start('Game', { level: daily, daily: true }),
    });

    let y = 150;
    for (const section of SECTIONS) {
      const unlockedSection = section.from <= Save.data.unlocked;
      this.add
        .text(20, y, t(neighborhoodNameKey(section.nb)).toUpperCase(), {
          fontFamily: FONT_DISPLAY,
          fontSize: '18px',
          color: unlockedSection ? COLORS.sunCss : '#64748b',
          stroke: '#141414',
          strokeThickness: 4,
        })
        .setOrigin(0, 0)
        .setDepth(10);
      y += 30;
      // 5 columns x 2 rows of nodes.
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 5; col++) {
          const n = section.from + row * 5 + col;
          const def = LEVELS[n - 1];
          void def;
          const cx = 48 + col * 74;
          const cy = y + row * 78 + 28;
          const locked = n > Save.data.unlocked;
          const isDaily = n === daily && !dailyDone;
          const stars = Save.data.stars[n] ?? 0;
          const g = this.add.graphics().setDepth(10);
          g.fillStyle(0x000000, 0.3);
          g.fillCircle(cx + 1, cy + 3, 26);
          g.fillStyle(locked ? 0x475569 : 0xfff8e7, 1);
          g.fillCircle(cx, cy, 26);
          g.lineStyle(isDaily ? 4 : 3, isDaily ? COLORS.sun : 0x141414, 1);
          g.strokeCircle(cx, cy, 25);
          const label = this.add
            .text(cx, cy, locked ? '🔒' : String(n), {
              fontFamily: FONT_DISPLAY,
              fontSize: locked ? '18px' : '22px',
              color: locked ? '#cbd5e1' : COLORS.inkCss,
            })
            .setOrigin(0.5)
            .setDepth(11);
          void label;
          // Stars under the node.
          if (!locked && stars > 0) {
            const sg = this.add.graphics().setDepth(11);
            for (let i = 0; i < 3; i++) {
              drawStar(sg, cx + (i - 1) * 14, cy + 34, 6, i < stars ? COLORS.sun : 0x64748b);
            }
          }
          if (!locked) {
            const zone = this.add.zone(cx, cy, 56, 56).setDepth(12).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => this.scene.start('Game', { level: n, daily: false }));
          }
        }
      }
      y += 170;
    }

    makeButton(this, GAME_W / 2, 800, {
      w: 200,
      h: 56,
      label: t('back'),
      fontSize: 20,
      color: COLORS.boost,
      onClick: () => this.scene.start('Menu'),
    });
  }
}
