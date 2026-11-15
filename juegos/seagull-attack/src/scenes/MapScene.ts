// Level map: 30 nodes on a winding path, drag to scroll. Stars per level,
// lock on unplayed levels, treasure chest every 3rd level (tap to claim),
// sun badge on today's daily-challenge level.
import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { t } from '../i18n';
import { LEVEL_COUNT } from '../levels';
import { Save } from '../save';
import { COLORS, bodyStyle, drawStar, headingStyle, juice, makeIconButton } from '../ui';

const NODE_GAP = 118;

export class MapScene extends Phaser.Scene {
  private container: Phaser.GameObjects.Container | null = null;
  private dragged = false;
  private dragStartY = 0;
  private dragStartContainerY = 0;
  private bg: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('Map');
  }

  create(): void {
    this.buildLayout();
    this.scale.on('resize', this.buildLayout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.buildLayout, this);
    });
  }

  private buildLayout(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    if (this.bg) this.bg.destroy();
    if (this.container) this.container.destroy();
    this.dragged = false;

    this.bg = this.add.image(w / 2, h / 2, w > h ? 'bg-beach-land' : 'bg-beach');
    const tex = this.textures.get(w > h ? 'bg-beach-land' : 'bg-beach').getSourceImage() as HTMLImageElement;
    const cover = Math.max(w / tex.width, h / tex.height);
    this.bg.setScale(cover);
    this.bg.setDepth(-10);

    const title = this.add.text(w / 2, 44, t('map'), headingStyle(40)).setOrigin(0.5);
    title.setDepth(10);
    const back = makeIconButton(this, 44, 44, 26, '‹', () => this.scene.start('Menu'));
    back.setDepth(10);
    // Header band: nodes scroll underneath it instead of overlapping the
    // title (the top node used to sit right behind "LEVELS").
    const band = this.add.rectangle(0, 0, w, 104, 0x0a2a33, 0.95).setOrigin(0);
    band.setDepth(9);

    const totalH = 170 + (LEVEL_COUNT - 1) * NODE_GAP + 140;
    this.container = this.add.container(0, 0);
    const c = this.container;

    for (let i = 0; i < LEVEL_COUNT; i++) {
      const level = i + 1;
      const y = totalH - 140 - i * NODE_GAP;
      const x = w / 2 + Math.sin(i * 0.85) * w * 0.24;
      const unlocked = level <= Save.data.unlocked;
      const isCurrent = level === Save.data.unlocked;
      const stars = Save.data.stars[level] ?? 0;
      const isDaily = level === Save.dailyLevelToday();

      const node = this.add.container(x, y);
      const g = this.add.graphics();
      const r = isCurrent ? 34 : 30;
      g.fillStyle(0x000000, 0.25);
      g.fillCircle(2, 4, r);
      g.fillStyle(unlocked ? (isCurrent ? COLORS.leaf : COLORS.sun) : 0x9aa5ad, 1);
      g.fillCircle(0, 0, r);
      g.lineStyle(4, 0xffffff, 0.9);
      g.strokeCircle(0, 0, r - 2);
      node.add(g);
      if (unlocked) {
        const num = this.add
          .text(0, 0, `${level}`, { fontFamily: 'Lilita One, sans-serif', fontSize: '30px', color: COLORS.inkCss })
          .setOrigin(0.5);
        node.add(num);
      } else {
        // Padlock, drawn (no emoji): shackle + body.
        const lock = this.add.graphics();
        lock.lineStyle(4, COLORS.ink, 1);
        lock.strokeCircle(0, -6, 9);
        lock.fillStyle(COLORS.ink, 1);
        lock.fillRoundedRect(-11, -4, 22, 18, 4);
        lock.fillStyle(0xffffff, 1);
        lock.fillCircle(0, 5, 2.5);
        node.add(lock);
      }
      // Stars under the node.
      for (let s = 0; s < 3; s++) {
        const sg = this.add.graphics();
        drawStar(sg, (s - 1) * 24, r + 16, 10, s < stars ? COLORS.sun : 0xcfd8dc);
        if (s >= stars) sg.setAlpha(0.7);
        node.add(sg);
      }
      // Daily-challenge sun badge.
      if (isDaily && unlocked) {
        const dg = this.add.graphics();
        dg.fillStyle(COLORS.coral, 1);
        dg.fillCircle(r - 2, -r + 2, 14);
        dg.fillStyle(0xffffff, 1);
        dg.fillCircle(r - 2, -r + 2, 9);
        node.add(dg);
      }
      node.setSize(r * 2 + 10, r * 2 + 44);
      // Container offset (see ui.ts): the circle centre must be at
      // (r+5, r+22) in hit-area coords to sit on the visual node.
      node.setInteractive(
        new Phaser.Geom.Circle(r + 5, r + 22, r + 6),
        Phaser.Geom.Circle.Contains,
      );
      node.on('pointerup', () => {
        if (this.dragged) return;
        if (!unlocked) {
          AudioEngine.fail();
          return;
        }
        AudioEngine.click();
        this.scene.start('Game', { level, daily: isDaily });
      });
      c.add(node);
      if (isCurrent) {
        this.tweens.add({ targets: node, scaleX: 1.08, scaleY: 1.08, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }

      // Treasure chest every 3rd level (offset right of the node).
      if (level % 3 === 0 && unlocked) {
        const claimed = !!Save.data.chest[level];
        const chest = this.add.image(x + 92, y, 'chest').setDisplaySize(56, 57);
        if (claimed) chest.setAlpha(0.45);
        else {
          chest.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
          chest.on('pointerup', () => {
            if (this.dragged) return;
            Save.data.chest[level] = true;
            Save.data.coins += 50;
            void Save.write();
            AudioEngine.chest();
            juice(this, 'large', chest.x, chest.y);
            this.buildLayout();
          });
          this.tweens.add({ targets: chest, y: y - 6, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        }
        c.add(chest);
      }
    }

    // Start scrolled so the current level is centred.
    const currentY = totalH - 140 - (Save.data.unlocked - 1) * NODE_GAP;
    const minY = Math.min(0, h - totalH - 80);
    c.y = Phaser.Math.Clamp(-(currentY - h * 0.5), minY, 0);

    // Drag to scroll (pointer on the background, not on a node).
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragStartY = p.y;
      this.dragStartContainerY = c.y;
      this.dragged = false;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!p.isDown) return;
      const dy = p.y - this.dragStartY;
      if (Math.abs(dy) > 12) this.dragged = true;
      c.y = Phaser.Math.Clamp(this.dragStartContainerY + dy, minY, 0);
    });
  }
}
