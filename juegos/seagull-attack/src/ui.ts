// Theme + UI kit. One palette, one button builder, one juice helper — every
// scene uses these so the game looks and feels like one game.
// Palette (art-bible §4): each colour has a gameplay role.
//   sea teal   #17A2B8 — water/sky, calm, the world
//   sand       #F2C879 — beach, the ground
//   coral red  #FF6B4A — danger (gulls, crumbs lost, fail)
//   sun yellow #FFC93C — reward (coins, stars, chest)
//   leaf green #3FA34D — safe / win / go
//   cream      #FFF6E5 — UI panels
//   ink dark   #24313D — text and outlines
// Colourblind safety: danger is never colour alone — crumbs are sandwich
// icons, the timer also pulses, the ink bar also changes width/label.
import Phaser from 'phaser';
import { AudioEngine } from './audio';
import { Save } from './save';

export const COLORS = {
  sea: 0x17a2b8,
  seaCss: '#17a2b8',
  sand: 0xf2c879,
  sandCss: '#f2c879',
  coral: 0xff6b4a,
  coralCss: '#ff6b4a',
  sun: 0xffc93c,
  sunCss: '#ffc93c',
  leaf: 0x3fa34d,
  leafCss: '#3fa34d',
  cream: 0xfff6e5,
  creamCss: '#fff6e5',
  ink: 0x24313d,
  inkCss: '#24313d',
  white: 0xffffff,
  whiteCss: '#ffffff',
};

export const FONT_DISPLAY = 'Lilita One, "Arial Black", sans-serif';
export const FONT_BODY = 'Nunito, Arial, sans-serif';

export function headingStyle(size: number, color = COLORS.inkCss): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT_DISPLAY,
    fontSize: `${size}px`,
    color,
    stroke: '#ffffff',
    strokeThickness: Math.max(4, Math.round(size / 8)),
    shadow: { offsetX: 0, offsetY: 3, color: 'rgba(0,0,0,0.35)', blur: 0, fill: true },
  };
}

export function bodyStyle(size: number, color = COLORS.inkCss): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT_BODY,
    fontSize: `${size}px`,
    color,
    fontStyle: '700',
    stroke: 'rgba(255,255,255,0.85)',
    strokeThickness: Math.max(3, Math.round(size / 7)),
    shadow: { offsetX: 0, offsetY: 2, color: 'rgba(0,0,0,0.25)', blur: 0, fill: true },
  };
}

export interface ButtonOpts {
  w: number;
  h: number;
  label: string;
  fontSize?: number;
  color?: number; // base colour
  textColor?: string;
  onClick: () => void;
  icon?: string; // texture key drawn left of the label
}

/**
 * Big rounded button with a volume edge (lighter top strip) and a press
 * squash. The hit area is an explicit rectangle in the container's LOCAL
 * coordinates (0,0,w,h) — never the texture frame — per CONTROL-CALIDAD.
 * Minimum touch target: 88 px tall for main buttons, 48 px absolute minimum.
 */
export function makeButton(scene: Phaser.Scene, x: number, y: number, opts: ButtonOpts): Phaser.GameObjects.Container {
  const { w, h, label } = opts;
  const base = opts.color ?? COLORS.leaf;
  const fontSize = opts.fontSize ?? 30;
  const c = new Phaser.GameObjects.Container(scene, x, y);
  const g = scene.add.graphics();
  const r = Math.min(22, h / 2 - 2);
  // Shadow + body + lighter top edge = volume, not a flat rectangle.
  // All coordinates are centred on the container origin (-w/2..w/2, -h/2..h/2).
  g.fillStyle(0x000000, 0.25);
  g.fillRoundedRect(-w / 2 + 2, -h / 2 + 5, w, h, r);
  g.fillStyle(base, 1);
  g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
  g.fillStyle(0xffffff, 0.22);
  g.fillRoundedRect(-w / 2, -h / 2, w, Math.max(10, h * 0.28), { tl: r, tr: r, bl: 0, br: 0 });
  g.lineStyle(3, 0xffffff, 0.65);
  g.strokeRoundedRect(-w / 2 + 1.5, -h / 2 + 1.5, w - 3, h - 3, r);
  c.add(g);
  const children: Phaser.GameObjects.GameObject[] = [g];
  let labelX = 0;
  if (opts.icon) {
    const icon = scene.add.image(-w / 2 + 34, 0, opts.icon).setDisplaySize(h * 0.62, h * 0.62);
    c.add(icon);
    children.push(icon);
    labelX = 18;
  }
  const text = scene.add
    .text(labelX, 1, label, {
      fontFamily: FONT_DISPLAY,
      fontSize: `${fontSize}px`,
      color: opts.textColor ?? '#ffffff',
      stroke: 'rgba(0,0,0,0.35)',
      strokeThickness: 4,
    })
    .setOrigin(0.5);
  c.add(text);
  children.push(text);
  c.setSize(w, h);
  // Explicit local-coords hit area (manual requirement). For a Container the
  // input system offsets the hit area by -displayOrigin (-w/2, -h/2), so the
  // rectangle must start at (0,0) to land exactly on the visual button
  // (verified by probing: Rectangle(-w/2,-h/2,w,h) shifted the hit area
  // up-left by half the button and the corners missed).
  c.setInteractive(
    new Phaser.Geom.Rectangle(0, 0, w, h),
    Phaser.Geom.Rectangle.Contains,
  );
  c.on('pointerdown', () => {
    AudioEngine.click();
    scene.tweens.add({ targets: c, scaleX: 0.94, scaleY: 0.94, duration: 70 });
  });
  c.on('pointerup', () => {
    scene.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 90 });
    opts.onClick();
  });
  c.on('pointerout', () => {
    scene.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 90 });
  });
  scene.add.existing(c);
  return c;
}

/** Small round icon button (pause, sound, language). Hit area: local circle. */
export function makeIconButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  radius: number,
  label: string,
  onClick: () => void,
): Phaser.GameObjects.Container {
  const c = new Phaser.GameObjects.Container(scene, x, y);
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.25);
  g.fillCircle(1, 3, radius);
  g.fillStyle(COLORS.cream, 1);
  g.fillCircle(0, 0, radius);
  g.lineStyle(3, 0xffffff, 0.9);
  g.strokeCircle(0, 0, radius - 1.5);
  c.add(g);
  const text = scene.add
    .text(0, 0, label, { fontFamily: FONT_DISPLAY, fontSize: `${Math.round(radius * 0.85)}px`, color: COLORS.inkCss })
    .setOrigin(0.5);
  c.add(text);
  c.setSize(radius * 2, radius * 2);
  // Same container offset as makeButton: the circle centre must be at
  // (radius, radius) in hit-area coords to sit on the visual button.
  c.setInteractive(
    new Phaser.Geom.Circle(radius, radius, radius),
    Phaser.Geom.Circle.Contains,
  );
  c.on('pointerdown', () => {
    AudioEngine.click();
    scene.tweens.add({ targets: c, scaleX: 0.9, scaleY: 0.9, duration: 70 });
  });
  c.on('pointerup', () => {
    scene.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 90 });
    onClick();
  });
  c.on('pointerout', () => {
    scene.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 90 });
  });
  scene.add.existing(c);
  return c;
}

/**
 * Juice budget (game-feel / game-juice): every event has ONE tier and one
 * bundle, fired from a single call. Tiers: small (trauma 0.15, no hit-stop),
 * medium (trauma 0.4, hit-stop 0.05 s), large (trauma 0.8, hit-stop 0.12 s).
 * Shake is trauma-squared with real-time decay; the HUD is never shaken.
 */
export type JuiceTier = 'small' | 'medium' | 'large';

export function juice(scene: Phaser.Scene, tier: JuiceTier, x: number, y: number): void {
  const cam = scene.cameras.main;
  const trauma = tier === 'small' ? 0.15 : tier === 'medium' ? 0.4 : 0.8;
  if (Save.data.settings.shake) {
    cam.shake(tier === 'small' ? 90 : tier === 'medium' ? 160 : 260, trauma * trauma * 0.02);
  }
  if (tier !== 'small') {
    // Hit-stop: freeze the world briefly. Restore with REAL time (a
    // delayedCall would be slowed by the timeScale itself).
    scene.time.timeScale = 0.05;
    const ms = tier === 'medium' ? 50 : 120;
    window.setTimeout(() => {
      if (scene.sys.isActive()) scene.time.timeScale = 1;
    }, ms);
  }
  // Sparkle burst at the event position.
  const p = scene.add.particles(x, y, 'dot', {
    speed: { min: 60, max: 220 },
    angle: { min: 0, max: 360 },
    lifespan: 420,
    scale: { start: 0.9, end: 0 },
    quantity: tier === 'small' ? 6 : tier === 'medium' ? 12 : 26,
    tint: tier === 'large' ? [COLORS.sun, COLORS.coral, COLORS.white] : COLORS.sun,
    emitting: false,
  });
  p.explode(tier === 'small' ? 6 : tier === 'medium' ? 12 : 26);
  scene.time.delayedCall(600, () => p.destroy());
}

/** Draw a 5-point star into a Graphics object (used for stars + topper). */
export function drawStar(g: Phaser.GameObjects.Graphics, cx: number, cy: number, r: number, color: number, alpha = 1): void {
  g.fillStyle(color, alpha);
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = cx + Math.cos(ang) * rad;
    const py = cy + Math.sin(ang) * rad;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fillPath();
}
