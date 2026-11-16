// Result: win (stars pop one by one + coins) or fail (retry). Rewarded ad
// grants +1 hint for the retry. Interstitial at a natural pause — every 3rd
// win, never level 1, never mid-round.
import Phaser from 'phaser';
import { COLORS, headingStyle, bodyStyle, makeButton, drawStar } from '../ui';
import { Save } from '../save';
import { t } from '../i18n';
import { AudioEngine } from '../audio';
import { LEVEL_COUNT } from '../levels';

interface ResultData {
  win: boolean;
  level: number;
  stars: number;
  coins: number;
  daily?: boolean;
  reason?: 'time' | 'hearts';
}

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('result');
  }

  create(data: ResultData): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const cx = w / 2;
    const isDaily = data.daily ?? false;

    const bg = this.add.image(0, 0, 'bg-ny').setOrigin(0);
    bg.setDisplaySize(w, h);

    const title = data.win
      ? t('winTitle')
      : data.reason === 'hearts'
        ? t('failHearts')
        : t('failTitle');
    this.add.text(cx, 150, title, headingStyle(38)).setOrigin(0.5);
    if (!data.win) {
      this.add.text(cx, 200, t('failSub'), bodyStyle(18)).setOrigin(0.5);
    }

    if (data.win) {
      // Stars pop one by one.
      const starG = this.add.graphics();
      const starXs = [cx - 90, cx, cx + 90];
      for (let i = 0; i < data.stars; i++) {
        this.time.delayedCall(250 + i * 350, () => {
          drawStar(starG, starXs[i], 280, 34, COLORS.sun, 1);
          AudioEngine.coin();
        });
      }
      // Empty stars (grey) for the ones not earned.
      for (let i = data.stars; i < 3; i++) {
        drawStar(starG, starXs[i], 280, 34, 0xd1d5db, 1);
      }
      this.add.text(cx, 360, `+${data.coins} 🪙`, bodyStyle(24)).setOrigin(0.5);
      if (isDaily) {
        this.add.text(cx, 400, t('dailyDone'), bodyStyle(20, COLORS.leafCss)).setOrigin(0.5);
      }
      // Interstitial at a natural pause: every 3rd win, never level 1.
      if (Save.data.wins % 3 === 0 && data.level > 1) {
        this.time.delayedCall(600, () => {
          try {
            void window.bridge?.advertisement?.showInterstitial?.({ ignoreDelay: false });
          } catch {
            /* ads are best-effort */
          }
        });
      }
    }

    // Buttons.
    const nextLevel = data.level + 1;
    if (data.win && nextLevel <= LEVEL_COUNT && !isDaily) {
      makeButton(this, cx, 500, {
        w: 300,
        h: 80,
        label: t('next'),
        fontSize: 30,
        color: COLORS.leaf,
        onClick: () => this.scene.start('game', { level: nextLevel }),
      });
    }
    makeButton(this, cx, data.win && nextLevel <= LEVEL_COUNT && !isDaily ? 600 : 520, {
      w: 300,
      h: 64,
      label: t('replay'),
      fontSize: 24,
      color: COLORS.scanner,
      onClick: () => this.scene.start('game', { level: data.level, daily: isDaily }),
    });
    makeButton(this, cx, data.win && nextLevel <= LEVEL_COUNT && !isDaily ? 680 : 600, {
      w: 300,
      h: 64,
      label: t('menu'),
      fontSize: 24,
      color: COLORS.sun,
      onClick: () => this.scene.start('menu'),
    });

    // Rewarded ad: +1 hint for the retry (fail only).
    if (!data.win) {
      this.add.text(cx, 700, t('watchAd'), bodyStyle(15)).setOrigin(0.5).setWordWrapWidth(w - 80);
      makeButton(this, cx, 750, {
        w: 300,
        h: 56,
        label: `▶ ${t('extraHint')}`,
        fontSize: 20,
        color: COLORS.coral,
        onClick: () => {
          try {
            const p = window.bridge?.advertisement?.showRewarded?.();
            if (p && typeof (p as Promise<unknown>).then === 'function') {
              void (p as Promise<unknown>).then(() => {
                Save.data.shop.extraHints = Math.min(3, Save.data.shop.extraHints + 1);
                void Save.write();
                this.scene.start('game', { level: data.level, daily: isDaily });
              });
            } else {
              // No ad available: still retry (the player asked for it).
              this.scene.start('game', { level: data.level, daily: isDaily });
            }
          } catch {
            this.scene.start('game', { level: data.level, daily: isDaily });
          }
        },
      });
    }
  }
}
