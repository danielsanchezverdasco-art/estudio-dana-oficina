// Doubloon Rush — MenuScene: illustrated beach menu (title in the calm sky
// area, PLAY / HOW TO, sound toggle, Dana octopus mascot cameo).
// Tapping the baked-in chest fires a coin fountain + parrot squawk.

import Phaser from 'phaser';
import { t } from '../i18n';
import { loadSave, totalStars, writeSave } from '../save';
import { playSfx, setMuted, isMuted, vibrate } from '../audio';
import { coverFit, makeButton, makeIconButton, makePanel, shadowed, FONT, CREAM } from './ui';

export default class MenuScene extends Phaser.Scene {
  private soundBtn: Phaser.GameObjects.Container | null = null;
  private soundLabel: Phaser.GameObjects.Text | null = null;
  private octopus: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('Menu');
  }

  create(): void {
    const W = this.scale.width;
    const H = this.scale.height;

    const bg = this.add.image(0, 0, 'bg-menu').setOrigin(0.5);
    coverFit(bg, W, H);

    // Title in the calm sky area (top quarter), two lines so it never
    // overflows the 390 px width (56 px measured: DOUBLOON ≈ 346 px wide).
    shadowed(this, W / 2, H * 0.07, 'DOUBLOON', 56, '#ffd23e');
    shadowed(this, W / 2, H * 0.07 + 52, 'RUSH', 56, '#ffd23e');
    shadowed(this, W / 2, H * 0.07 + 104, t('subtitle'), Math.round(W * 0.045));

    // Floating coins above the baked-in chest (bottom centre of the art).
    for (let i = 0; i < 5; i++) {
      const coin = this.add
        .image(W / 2 + Phaser.Math.Between(-90, 90), H * 0.62 + Phaser.Math.Between(-10, 60), 'items', 'coins')
        .setScale(0.16);
      this.tweens.add({
        targets: coin,
        y: H * 0.62 - Phaser.Math.Between(60, 140),
        alpha: 0,
        duration: Phaser.Math.Between(1200, 2000),
        delay: i * 320,
        repeat: -1,
        onRepeat: () => {
          coin.setAlpha(1);
          coin.setY(H * 0.62 + Phaser.Math.Between(-10, 60));
        },
      });
    }

    // Invisible tap zone over the baked-in chest: coin fountain + squawk.
    // Phaser hit rects are top-left relative (it adds displayOrigin).
    const chestZone = this.add.zone(W / 2, H * 0.72, W * 0.62, H * 0.22);
    chestZone.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, W * 0.62, H * 0.22),
      Phaser.Geom.Rectangle.Contains,
    );
    chestZone.on('pointerdown', (p: Phaser.Input.Pointer) => this.coinBurst(p.x, p.y));

    // Dana octopus mascot cameo (bottom-left corner, clear of the buttons).
    this.octopus = this.add
      .image(W * 0.11, H * 0.96, 'octopus', 'octopus')
      .setScale(0.09)
      .setInteractive(); // default hit area = the whole sprite
    this.octopus.on('pointerdown', () => {
      playSfx('squawk');
      vibrate(15);
      this.tweens.add({ targets: this.octopus, scale: 0.12, duration: 120, yoyo: true });
    });

    // Buttons.
    const playBtn = makeButton(this, W / 2, H * 0.86, t('play'), () => {
      playSfx('click');
      this.scene.start('Map');
    });
    playBtn.setScale(1);
    this.tweens.add({ targets: playBtn, scale: 1.05, duration: 700, yoyo: true, repeat: -1 });

    makeButton(
      this,
      W / 2,
      H * 0.86 + 100,
      t('howTo'),
      () => {
        playSfx('click');
        this.showHowTo();
      },
      { w: 200, h: 56, fontSize: 22, bg: 0x8a5a2b, border: 0x5d3a17 },
    );

    // Sound toggle (top-right).
    this.soundBtn = makeIconButton(this, W - 44, 44, '♪', () => {
      void loadSave().then((save) => {
        save.soundOn = !save.soundOn;
        setMuted(!save.soundOn);
        this.soundLabel?.setText(save.soundOn ? '♪' : '✕');
        void writeSave(save);
      });
    });
    this.soundLabel = this.soundBtn.getAt(1) as Phaser.GameObjects.Text;

    // Best + stars line (top-left).
    void loadSave().then((save) => {
      setMuted(!save.soundOn);
      this.soundLabel?.setText(save.soundOn ? '♪' : '✕');
      const best = Math.max(0, ...Object.values(save.bestScores));
      shadowed(this, 16, 28, `★ ${totalStars(save)}/90   ${t('best')}: ${best}`, 20).setOrigin(0, 0.5);
    });

    this.scale.on('resize', this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.onResize, this);
    });
  }

  private coinBurst(x: number, y: number): void {
    playSfx('coin');
    vibrate(10);
    for (let i = 0; i < 8; i++) {
      const coin = this.add
        .image(x, y, 'items', 'coins')
        .setScale(0.14)
        .setDepth(10);
      this.tweens.add({
        targets: coin,
        x: x + Phaser.Math.Between(-110, 110),
        y: y - Phaser.Math.Between(60, 190),
        angle: Phaser.Math.Between(-180, 180),
        alpha: 0,
        duration: 750,
        onComplete: () => coin.destroy(),
      });
    }
  }

  private showHowTo(): void {
    const W = this.scale.width;
    const { container } = makePanel(this, Math.min(340, W - 32), 430);
    const panel = container;
    const title = shadowed(this, 0, -180, t('howTo'), 28, '#ffd23e');
    panel.add(title);

    const rows: { frame: string; atlas: string; text: string; scale: number }[] = [
      { frame: 'chest_gold_open', atlas: 'chests', text: t('tapChests'), scale: 0.22 },
      { frame: 'bomb', atlas: 'items', text: t('avoidBombs'), scale: 0.22 },
      { frame: 'crab', atlas: 'items', text: t('scareCrab'), scale: 0.22 },
      { frame: 'doubloon', atlas: 'items', text: t('goldenDoubloon'), scale: 0.22 },
    ];
    rows.forEach((row, i) => {
      const y = -120 + i * 72;
      const img = this.add.image(-130, y, row.atlas, row.frame).setScale(row.scale);
      const txt = this.add
        .text(-88, y, row.text, { fontFamily: FONT, fontSize: '17px', color: '#3a2410', wordWrap: { width: 200 } })
        .setOrigin(0, 0.5);
      panel.add([img, txt]);
    });

    const close = makeButton(this, 0, 185, t('menu'), () => {
      playSfx('click');
      panel.destroy();
    }, { w: 180, h: 56, fontSize: 22 });
    panel.add(close);
    // Block the chest zone while the panel is open.
    panel.setDepth(50);
  }

  private onResize(): void {
    this.scene.restart();
  }
}
