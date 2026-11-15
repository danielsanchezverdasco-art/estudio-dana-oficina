// Doubloon Rush — ResultsScene: stars (animated one by one), score, best,
// doubloons found, NEXT / RETRY / MENU. Interstitial on every 2nd completed
// level (never level 1, never a failed round, never mid-round). Optional
// rewarded "Luck x2" for the next round (opt-in, only if supported).

import Phaser from 'phaser';
import { t } from '../i18n';
import { playSfx } from '../audio';
import { showInterstitial, showRewarded, isRewardedSupported, isInterstitialSupported } from '../bridge/bridge';
import { makeButton, shadowed, coverFit } from './ui';

interface ResultsData {
  level: number;
  daily: boolean;
  score: number;
  stars: number;
  best: number;
  isNewBest: boolean;
  completed: boolean;
  doubloons: number;
}

export default class ResultsScene extends Phaser.Scene {
  private data_!: ResultsData;
  private adShown = false;

  constructor() {
    super('Results');
  }

  init(data: ResultsData): void {
    this.data_ = data;
    this.adShown = false;
  }

  create(): void {
    const W = this.scale.width;
    const H = this.scale.height;
    const d = this.data_;

    const bg = this.add.image(0, 0, W > H ? 'bg-beach-landscape' : 'bg-beach').setOrigin(0.5);
    coverFit(bg, W, H);

    const title = d.completed ? t('levelComplete') : d.score > 0 ? t('timeUp') : t('levelFailed');
    shadowed(this, W / 2, H * 0.14, title, 40, d.completed ? '#ffd23e' : '#ff6b6b');
    shadowed(this, W / 2, H * 0.14 + 48, d.daily ? t('daily') : `${t('level')} ${d.level}`, 24);

    // Stars, animated one by one.
    const starY = H * 0.3;
    for (let i = 0; i < 3; i++) {
      const star = this.add
        .text(W / 2 + (i - 1) * 84, starY, '★', {
          fontFamily: '"Lilita One", sans-serif',
          fontSize: '64px',
          color: i < d.stars ? '#ffd23e' : '#8d8578',
          stroke: '#3a2410',
          strokeThickness: 8,
        })
        .setOrigin(0.5)
        .setScale(0);
      this.tweens.add({
        targets: star,
        scale: 1,
        duration: 350,
        delay: 350 + i * 350,
        ease: 'Back.easeOut',
        onStart: () => {
          if (i < d.stars) playSfx('star');
        },
      });
    }

    shadowed(this, W / 2, starY + 90, `${t('score')}: ${d.score}`, 34);
    shadowed(this, W / 2, starY + 140, `${t('best')}: ${d.best}`, 24);
    if (d.isNewBest && d.score > 0) {
      const badge = shadowed(this, W / 2, starY + 180, t('newBest'), 26, '#7CFC00');
      this.tweens.add({ targets: badge, scale: 1.1, duration: 400, yoyo: true, repeat: -1 });
    }
    if (d.doubloons > 0) {
      shadowed(this, W / 2, starY + 216, `⬤ x${d.doubloons}`, 24, '#ffd23e');
    }

    // Buttons.
    const btnY = H * 0.72;
    if (d.completed) {
      makeButton(this, W / 2, btnY, t('next'), () => {
        playSfx('click');
        this.scene.start('Map');
      }, { w: 260, h: 88, fontSize: 30 });
      // Rewarded Luck x2 for the next round (opt-in only).
      if (isRewardedSupported()) {
        makeButton(this, W / 2, btnY + 104, `${t('luck')} — ${t('watchAd')} ▶`, () => {
          playSfx('click');
          void showRewarded().then((rewarded) => {
            if (rewarded) {
              this.registry.set('luckUntil', Date.now() + 30000);
              this.scene.start('Game', { level: d.daily ? -1 : Math.min(30, d.level + 1) });
            }
          });
        }, { w: 280, h: 64, fontSize: 20, bg: 0x6a1b9a, border: 0x4a148c });
      }
    } else {
      makeButton(this, W / 2, btnY, t('retry'), () => {
        playSfx('click');
        this.scene.start('Game', { level: d.daily ? -1 : d.level });
      }, { w: 260, h: 88, fontSize: 30 });
    }
    makeButton(this, W / 2, H * 0.72 + (d.completed && isRewardedSupported() ? 196 : 104), t('menu'), () => {
      playSfx('click');
      this.scene.start('Map');
    }, { w: 200, h: 60, fontSize: 22, bg: 0x616161, border: 0x424242 });

    // Interstitial at the natural pause after the stars finish (level 2, 4, 6…).
    if (d.completed && d.level % 2 === 0 && isInterstitialSupported()) {
      this.time.delayedCall(350 + 3 * 350 + 600, () => {
        if (!this.adShown && this.scene.isActive()) {
          this.adShown = true;
          void showInterstitial();
        }
      });
    }

    this.scale.on('resize', this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.onResize, this);
    });
  }

  private onResize(): void {
    this.scene.restart(this.data_);
  }
}
