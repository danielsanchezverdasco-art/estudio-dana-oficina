// Doubloon Rush — shared UI helpers (Phaser 3).
// All buttons use LOCAL-coordinate hit areas: Rectangle(0, 0, w, h) on the
// container, per the studio quality rules. Main buttons are >= 88 px tall.

import Phaser from 'phaser';

export const FONT = '"Lilita One", "Arial Black", sans-serif';
export const INK = '#3a2410'; // dark brown outline (readable on sand/sea)
export const GOLD = '#ffd23e';
export const CREAM = '#fff6d8';

export function textStyle(size: number, color = CREAM, stroke = INK): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT,
    fontSize: `${size}px`,
    color,
    stroke,
    strokeThickness: Math.max(4, Math.round(size / 6)),
    align: 'center',
  };
}

export function shadowed(scene: Phaser.Scene, x: number, y: number, str: string, size: number, color = CREAM): Phaser.GameObjects.Text {
  const t = scene.add.text(x, y, str, textStyle(size, color)).setOrigin(0.5);
  t.setShadow(0, 3, 'rgba(0,0,0,0.45)', 0, true, true);
  return t;
}

export interface ButtonOptions {
  w?: number;
  h?: number;
  fontSize?: number;
  bg?: number;
  bgAlpha?: number;
  border?: number;
  textColor?: string;
  disabled?: boolean;
}

/** Rounded-rect button with a LOCAL hit area. Returns the container. */
export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onTap: () => void,
  opts: ButtonOptions = {},
): Phaser.GameObjects.Container {
  const w = opts.w ?? 240;
  const h = opts.h ?? 88;
  const bg = opts.bg ?? 0x2e7d32;
  const border = opts.border ?? 0x1b4d1e;
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  const draw = (pressed: boolean) => {
    g.clear();
    g.fillStyle(border, 1);
    g.fillRoundedRect(-w / 2, -h / 2 + 4, w, h, 20);
    g.fillStyle(bg, opts.bgAlpha ?? 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h - 4, 20);
    g.lineStyle(3, 0xffffff, 0.35);
    g.strokeRoundedRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 8, 18);
  };
  draw(false);
  const labelText = scene.add
    .text(0, -2, label, textStyle(opts.fontSize ?? 30, opts.textColor ?? CREAM))
    .setOrigin(0.5);
  c.add([g, labelText]);
  if (!opts.disabled) {
    c.setInteractive(
      new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
      Phaser.Geom.Rectangle.Contains,
    );
    c.on('pointerdown', () => draw(true));
    c.on('pointerup', () => {
      draw(false);
      onTap();
    });
    c.on('pointerout', () => draw(false));
  } else {
    c.setAlpha(0.55);
  }
  return c;
}

/** Small round icon button (>= 48 px, the absolute minimum). */
export function makeIconButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onTap: () => void,
  size = 56,
): Phaser.GameObjects.Container {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  g.fillStyle(0x1b4d1e, 1);
  g.fillCircle(0, 2, size / 2);
  g.fillStyle(0x2e7d32, 1);
  g.fillCircle(0, 0, size / 2 - 2);
  g.lineStyle(2, 0xffffff, 0.4);
  g.strokeCircle(0, 0, size / 2 - 2);
  const t = scene.add.text(0, -1, label, textStyle(Math.round(size * 0.42))).setOrigin(0.5);
  c.add([g, t]);
  c.setInteractive(
    new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size),
    Phaser.Geom.Rectangle.Contains,
  );
  c.on('pointerup', onTap);
  return c;
}

/** Dark overlay panel (for pause / how-to / offers). */
export function makePanel(
  scene: Phaser.Scene,
  w: number,
  h: number,
): { container: Phaser.GameObjects.Container; bg: Phaser.GameObjects.Rectangle } {
  const W = scene.scale.width;
  const H = scene.scale.height;
  const container = scene.add.container(W / 2, H / 2);
  const dim = scene.add.rectangle(0, 0, W + 40, H + 40, 0x000000, 0.55).setOrigin(0.5);
  const box = scene.add.rectangle(0, 0, w, h, 0xfff6d8, 1).setOrigin(0.5);
  box.setStrokeStyle(4, 0x8a5a2b, 1);
  container.add([dim, box]);
  container.setSize(w, h);
  return { container, bg: box };
}

/** Cover-fit an image to the whole screen (no black bands). */
export function coverFit(img: Phaser.GameObjects.Image, w: number, h: number): void {
  const iw = img.width;
  const ih = img.height;
  const scale = Math.max(w / iw, h / ih);
  img.setDisplaySize(iw * scale, ih * scale);
  img.setPosition(w / 2, h / 2);
}
