// Result: win (stars pop in one by one, coins earned) or fail. Next /
// Replay / Menu. On fail, an optional rewarded ad grants +1 Extra Ink
// (persisted in the save) and retries the level — the reward is granted
// ONLY in the 'rewarded' state, per the Bridge rules.
// Layout is top-anchored: the card height is computed from the content so
// no button ever hangs below the card (round-1 fix).
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { t } from '../i18n';
import { Save } from '../save';
import { COLORS, bodyStyle, drawStar, headingStyle, makeButton } from '../ui';

interface ResultData {
  level: number;
  win: boolean;
  stars: number;
  coinsEarned: number;
  coinsCollected: number;
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
    const bg = this.add.image(w / 2, h / 2, w > h ? 'bg-play-land' : 'bg-play');
    const tex = this.textures.get(w > h ? 'bg-play-land' : 'bg-play').getSourceImage() as HTMLImageElement;
    bg.setScale(Math.max(w / tex.width, h / tex.height));
    const dim = this.add.rectangle(0, 0, w, h, 0x0f172a, 0.45).setOrigin(0);
    void dim;

    const rewardedSupported = !data.win && this.rewardedSupported();
    // Card height from the content: title + stars/gull + coins + buttons.
    const chh = data.win ? 520 : rewardedSupported ? 560 : 450;
    const cw = Math.min(340, w - 40);
    const cx = w / 2;
    const cy = h / 2;
    const top = cy - chh / 2;
    const card = this.add.graphics();
    card.fillStyle(COLORS.cream, 1);
    card.fillRoundedRect(cx - cw / 2, top, cw, chh, 24);
    card.lineStyle(4, 0xffffff, 0.9);
    card.strokeRoundedRect(cx - cw / 2, top, cw, chh, 24);

    const title = this.add
      .text(cx, top + 52, data.win ? t('winTitle') : t('failTitle'), headingStyle(data.win ? 30 : 26, data.win ? COLORS.leafCss : COLORS.coralCss))
      .setOrigin(0.5);
    title.setWordWrapWidth(cw - 32);
    title.setAlign('center');
    if (!data.win) {
      const sub = this.add.text(cx, top + 100, t('failSub'), bodyStyle(18)).setOrigin(0.5);
      sub.setWordWrapWidth(cw - 40);
      sub.setAlign('center');
    }

    // Stars pop in one by one (win) / gull celebrating (fail).
    if (data.win) {
      for (let i = 0; i < 3; i++) {
        const sg = this.add.graphics();
        const filled = i < data.stars;
        drawStar(sg, cx + (i - 1) * 74, top + 150, 30, filled ? COLORS.sun : 0xcfd8dc);
        sg.setScale(0);
        this.tweens.add({ targets: sg, scaleX: 1, scaleY: 1, duration: 320, delay: 350 + i * 260, ease: 'Back.easeOut' });
        if (filled) {
          this.time.delayedCall(350 + i * 260, () => AudioEngine.pop());
        }
      }
    } else {
      const head = this.add.image(cx, top + 164, 'dummy-head').setDisplaySize(64, 112);
      this.tweens.add({ targets: head, y: top + 142, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    // Coins earned.
    const coinsY = data.win ? top + 216 : top + 236;
    const coinIcon = this.add.image(cx - 52, coinsY, 'coin').setDisplaySize(40, 46);
    const coinsText = this.add
      .text(cx - 24, coinsY, `+${data.coinsEarned}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '34px', color: COLORS.inkCss })
      .setOrigin(0, 0.5);
    void coinIcon;
    void coinsText;

    // Buttons, stacked from a cursor so they always fit the card.
    let by = data.win ? top + 296 : top + 304;
    const btn = (label: string, color: number, hh: number, onClick: () => void, textColor?: string) => {
      const b = makeButton(this, cx, by, {
        w: 240, h: hh, fontSize: hh >= 76 ? 28 : 24, label, color, textColor, onClick,
      });
      by += hh + 16;
      return b;
    };
    if (data.win) {
      if (data.level < 30) {
        btn(t('next'), COLORS.leaf, 76, () => this.scene.start('Game', { level: data.level + 1, daily: false }));
      }
      btn(t('replay'), COLORS.sea, 64, () => this.scene.start('Game', { level: data.level, daily: data.daily }));
      btn(t('menu'), COLORS.coral, 64, () => this.scene.start('Menu'));
    } else {
      btn(t('retry'), COLORS.leaf, 76, () => this.scene.start('Game', { level: data.level, daily: data.daily }));
      btn(t('menu'), COLORS.coral, 64, () => this.scene.start('Menu'));
      if (rewardedSupported) {
        btn(`▶ ${t('extraInk')}`, COLORS.sun, 64, () => this.showRewarded(data), COLORS.inkCss);
        const hint = this.add.text(cx, by + 4, t('watchAd'), bodyStyle(16)).setOrigin(0.5);
        void hint;
      }
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.unsubscribeRewarded());
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
        Save.data.shop.extraInk = Math.min(3, Save.data.shop.extraInk + 1);
        void Save.write();
        this.unsubscribeRewarded();
        this.scene.start('Game', { level: data.level, daily: data.daily, extraInk: true });
      }
    };
    this.rewardedHandler = handler;
    try {
      rewarded.on?.('rewarded_state_changed', handler);
    } catch {
      /* the mock platform may not emit */
    }
    try {
      rewarded.show('extra_ink');
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
