// Result: win (stars pop in one by one, coins earned) or fail. Next /
// Replay / Menu. On fail, an optional rewarded ad grants a retry with +2 s
// patience — the reward is granted ONLY in the 'rewarded' state, per the
// Bridge rules. On win, an interstitial shows at natural pauses (every 3rd
// win, never on the first win, never mid-round).
// Layout is top-anchored: the card height is computed from the content so
// no button ever hangs below the card (round-1 fix).
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { t } from '../i18n';
import { Save } from '../save';
import { COLORS, bodyStyle, drawStar, headingStyle, makeButton } from '../ui';

export interface ResultData {
  level: number;
  win: boolean;
  kind: 'crash' | 'gridlock' | 'win' | 'time';
  stars: number;
  coinsEarned: number;
  clears: number;
  quota: number;
  score: number;
  daily: boolean;
}

export class ResultScene extends Phaser.Scene {
  private rewardedHandler: ((state: string) => void) | null = null;

  constructor() {
    super('Result');
  }

  create(data: ResultData): void {
    const w = this.scale.width;
    const h = this.scale.height;
    this.add.image(w / 2, h / 2, 'bg-night').setDisplaySize(w, h).setDepth(0);
    const dim = this.add.rectangle(0, 0, w, h, 0x0f172a, 0.6).setOrigin(0).setDepth(1);
    void dim;

    const rewardedSupported = !data.win && this.rewardedSupported();
    // Card height from the content: title + stars + coins + buttons.
    const chh = data.win ? 520 : rewardedSupported ? 560 : 450;
    const cw = Math.min(340, w - 40);
    const cx = w / 2;
    const cy = h / 2;
    const top = cy - chh / 2;
    const card = this.add.graphics().setDepth(2);
    card.fillStyle(COLORS.cream, 1);
    card.fillRoundedRect(cx - cw / 2, top, cw, chh, 24);
    card.lineStyle(4, 0x141414, 1);
    card.strokeRoundedRect(cx - cw / 2, top, cw, chh, 24);

    const titleKey = data.win ? 'winTitle' : data.kind === 'crash' ? 'failCrash' : data.kind === 'gridlock' ? 'failGridlock' : 'failTime';
    const title = this.add
      .text(cx, top + 52, t(titleKey), headingStyle(data.win ? 30 : 26, data.win ? COLORS.leafCss : COLORS.coralCss))
      .setOrigin(0.5)
      .setDepth(3);
    title.setWordWrapWidth(cw - 32);
    title.setAlign('center');
    if (!data.win) {
      const subKey = data.kind === 'crash' ? 'failSubCrash' : data.kind === 'gridlock' ? 'failSubGridlock' : 'failSubTime';
      const sub = this.add.text(cx, top + 100, t(subKey), bodyStyle(18)).setOrigin(0.5).setDepth(3);
      sub.setWordWrapWidth(cw - 40);
      sub.setAlign('center');
    }

    // Stars pop in one by one (win) / score line (fail).
    if (data.win) {
      for (let i = 0; i < 3; i++) {
        const sg = this.add.graphics().setDepth(3);
        const filled = i < data.stars;
        drawStar(sg, cx + (i - 1) * 74, top + 150, 30, filled ? COLORS.sun : 0xcfd8dc);
        sg.setScale(0);
        this.tweens.add({ targets: sg, scaleX: 1, scaleY: 1, duration: 320, delay: 350 + i * 260, ease: 'Back.easeOut' });
        if (filled) {
          this.time.delayedCall(350 + i * 260, () => AudioEngine.pop());
        }
      }
    } else {
      this.add
        .text(cx, top + 150, `🚗 ${data.clears}/${data.quota} · ⭐ ${data.score}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '22px', color: COLORS.inkCss })
        .setOrigin(0.5)
        .setDepth(3);
    }

    // Coins earned.
    const coinsY = data.win ? top + 216 : top + 206;
    this.add.image(cx - 52, coinsY, 'coin').setDisplaySize(40, 40).setDepth(3);
    this.add
      .text(cx - 24, coinsY, `+${data.coinsEarned}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '34px', color: COLORS.inkCss })
      .setOrigin(0, 0.5)
      .setDepth(3);

    // Buttons, stacked from a cursor so they always fit the card.
    let by = data.win ? top + 296 : top + 264;
    const btn = (label: string, color: number, hh: number, onClick: () => void, textColor?: string) => {
      const b = makeButton(this, cx, by, {
        w: 240, h: hh, fontSize: hh >= 76 ? 28 : 24, label, color, textColor, onClick,
      });
      by += hh + 16;
      return b;
    };
    if (data.win) {
      if (data.level < 30 && !data.daily) {
        btn(t('next'), COLORS.leaf, 76, () => this.scene.start('Game', { level: data.level + 1, daily: false }));
      }
      btn(t('replay'), COLORS.sea, 64, () => this.scene.start('Game', { level: data.level, daily: data.daily }));
      btn(t('menu'), COLORS.coral, 64, () => this.scene.start('Menu'));
      // Interstitial at a natural pause: every 3rd win, never the first.
      if (Save.data.wins > 0 && Save.data.wins % 3 === 0) this.showInterstitial();
    } else {
      btn(t('retry'), COLORS.leaf, 76, () => this.scene.start('Game', { level: data.level, daily: data.daily }));
      btn(t('menu'), COLORS.coral, 64, () => this.scene.start('Menu'));
      if (rewardedSupported) {
        btn(`▶ ${t('retryBoost')}`, COLORS.sun, 64, () => this.showRewarded(data), COLORS.inkCss);
        const hint = this.add.text(cx, by + 4, t('watchAd'), bodyStyle(16)).setOrigin(0.5).setDepth(3);
        void hint;
      }
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.unsubscribeRewarded());
  }

  private showInterstitial(): void {
    try {
      const b = (window as unknown as { bridge?: { advertisement?: { interstitial?: { show?: (p: string) => void; isSupported?: boolean } } } }).bridge;
      if (b?.advertisement?.interstitial?.isSupported) {
        b.advertisement.interstitial.show?.('level_completed');
      }
    } catch {
      /* ads are optional */
    }
  }

  private rewardedSupported(): boolean {
    try {
      const b = (window as unknown as { bridge?: { advertisement?: { rewarded?: { isSupported?: boolean } } } }).bridge;
      return b?.advertisement?.rewarded?.isSupported === true;
    } catch {
      return false;
    }
  }

  private showRewarded(data: ResultData): void {
    const b = (window as unknown as {
      bridge?: {
        advertisement?: {
          rewarded?: { show?: (p: string) => void; on?: (e: string, cb: (s: string) => void) => void; off?: (e: string, cb: (s: string) => void) => void };
        };
      };
    }).bridge;
    const rewarded = b?.advertisement?.rewarded;
    if (!rewarded?.show) return;
    const handler = (state: string) => {
      // Reward ONLY in the 'rewarded' state — never on open/close.
      if (state === 'rewarded') {
        this.unsubscribeRewarded();
        this.scene.start('Game', { level: data.level, daily: data.daily, extraPatience: 2 });
      }
    };
    this.rewardedHandler = handler;
    try {
      rewarded.on?.('rewarded_state_changed', handler);
    } catch {
      /* the mock platform may not emit these */
    }
    try {
      rewarded.show('retry_boost');
    } catch {
      this.unsubscribeRewarded();
    }
  }

  private unsubscribeRewarded(): void {
    if (!this.rewardedHandler) return;
    try {
      const b = (window as unknown as { bridge?: { advertisement?: { rewarded?: { off?: (e: string, cb: (s: string) => void) => void } } } }).bridge;
      b?.advertisement?.rewarded?.off?.('rewarded_state_changed', this.rewardedHandler);
    } catch {
      /* ignore */
    }
    this.rewardedHandler = null;
  }
}
