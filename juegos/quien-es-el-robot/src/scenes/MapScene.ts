// Map: 30 nodes on a winding path, drag to scroll, stars per level, locked
// nodes, a chest every 3rd level (50 coins) and the daily-challenge sun.
import Phaser from 'phaser';
import { COLORS, headingStyle, bodyStyle, makeButton, makeIconButton, drawStar } from '../ui';
import { Save } from '../save';
import { t } from '../i18n';
import { LEVEL_COUNT, cityOf } from '../levels';

export class MapScene extends Phaser.Scene {
  constructor() {
    super('map');
  }

  create(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const cx = w / 2;
    const contentH = LEVEL_COUNT * 92 + 200;
    const cam = this.cameras.main;
    cam.setBounds(0, 0, w, Math.max(h, contentH));
    cam.scrollY = 0;

    const bg = this.add.image(0, 0, 'bg-ny').setOrigin(0).setScrollFactor(0);
    bg.setDisplaySize(w, h);

    this.add.text(cx, 56, t('map'), headingStyle(34)).setOrigin(0.5).setScrollFactor(0);
    this.add
      .text(cx, 96, `🪙 ${Save.data.coins}`, bodyStyle(18))
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Winding path nodes, bottom (level 1) to top (level 30).
    const nodeY = (i: number): number => contentH - 120 - i * 92;
    const nodeX = (i: number): number => cx + Math.sin(i * 0.9) * (w * 0.28);

    const g = this.add.graphics();
    g.lineStyle(8, 0xffffff, 0.55);
    g.beginPath();
    for (let i = 0; i < LEVEL_COUNT; i++) {
      const x = nodeX(i);
      const y = nodeY(i);
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.strokePath();

    for (let i = 0; i < LEVEL_COUNT; i++) {
      const level = i + 1;
      const x = nodeX(i);
      const y = nodeY(i);
      const unlocked = level <= Save.data.unlocked;
      const stars = Save.data.stars[level] ?? 0;
      const city = cityOf(level);
      const cityColor = city === 'ny' ? COLORS.steel : city === 'tokyo' ? 0xec4899 : COLORS.scanner;

      const node = this.add.container(x, y);
      const circle = this.add.graphics();
      circle.fillStyle(0x000000, 0.25);
      circle.fillCircle(2, 4, 34);
      circle.fillStyle(unlocked ? cityColor : 0x9ca3af, 1);
      circle.fillCircle(0, 0, 32);
      circle.lineStyle(4, 0x141414, 1);
      circle.strokeCircle(0, 0, 30);
      node.add(circle);
      const label = this.add
        .text(0, 0, unlocked ? `${level}` : '🔒', {
          fontFamily: 'Lilita One, "Arial Black", sans-serif',
          fontSize: '26px',
          color: '#ffffff',
          stroke: '#141414',
          strokeThickness: 4,
        })
        .setOrigin(0.5);
      node.add(label);
      // Stars under the node.
      for (let s = 0; s < 3; s++) {
        const sg = this.add.graphics();
        drawStar(sg, x - 24 + s * 24, y + 44, 10, s < stars ? COLORS.sun : 0xd1d5db, 1);
        this.add.existing(sg);
      }
      // Chest every 3rd level.
      if (level % 3 === 0 && unlocked && !Save.data.chest[level]) {
        const chest = this.add
          .text(x + 52, y - 8, '🎁', { fontSize: '34px' })
          .setInteractive({ useHandCursor: true });
        chest.on('pointerdown', () => {
          Save.data.chest[level] = true;
          Save.data.coins += 50;
          void Save.write();
          this.scene.restart();
        });
      }
      // Daily sun badge on today's daily level.
      if (level === Save.dailyLevelToday()) {
        this.add.text(x - 52, y - 8, '☀️', { fontSize: '30px' });
      }
      if (unlocked) {
        node.setSize(76, 76);
        node.setInteractive(
          new Phaser.Geom.Rectangle(0, 0, 76, 76),
          Phaser.Geom.Rectangle.Contains,
        );
        node.on('pointerdown', () => {
          this.scene.start('game', { level });
        });
      }
    }

    // Drag to scroll.
    let dragging = false;
    let lastY = 0;
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      dragging = true;
      lastY = p.y;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!dragging) return;
      cam.scrollY = Phaser.Math.Clamp(cam.scrollY - (p.y - lastY), 0, Math.max(0, contentH - h));
      lastY = p.y;
    });
    this.input.on('pointerup', () => {
      dragging = false;
    });

    // Back button.
    makeButton(this, cx, h - 48, {
      w: 200,
      h: 56,
      label: t('back'),
      fontSize: 22,
      color: COLORS.scanner,
      onClick: () => this.scene.start('menu'),
    }).setScrollFactor(0);
    makeIconButton(this, 40, 40, 28, '✕', () => this.scene.start('menu')).setScrollFactor(0);
  }
}
