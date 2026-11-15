// Theme + UI kit. One palette, one button builder, one juice helper — every
// scene uses these so the game looks and feels like one game.
// Palette (art-bible §4, blueprint workshop): each colour has a gameplay role.
//   paper      #F1F5F9 — blueprint grid paper, the world
//   ink dark   #0F172A — outlines, text, the dummy's dark parts
//   steel      #64748B — standard ink / ramps (friction 0.4)
//   elastic    #2563EB — elastic ink (blue, bouncy)
//   boost      #F97316 — accelerator ink (orange, boost on contact)
//   leaf green #22C55E — safe / win / go
//   coral red  #EF4444 — danger (dynamite, fail, out of ink)
//   sun yellow #FACC15 — reward (coins, stars, the dummy's yellow)
//   cream      #FFFFFF — UI panels
// Colourblind safety: danger is never colour alone — dynamite barrels have
// a skull-free "TNT" label, the ink bar also changes width/label, elastic
// ramps show a spring zig-zag, accelerator ramps show chevrons.
import Phaser from 'phaser';
import { AudioEngine } from './audio';
import { Save } from './save';

export const COLORS = {
  paper: 0xf1f5f9,
  paperCss: '#f1f5f9',
  steel: 0x64748b,
  steelCss: '#64748b',
  elastic: 0x2563eb,
  elasticCss: '#2563eb',
  boost: 0xf97316,
  boostCss: '#f97316',
  leaf: 0x22c55e,
  leafCss: '#22c55e',
  coral: 0xef4444,
  coralCss: '#ef4444',
  sun: 0xfacc15,
  sunCss: '#facc15',
  cream: 0xffffff,
  creamCss: '#ffffff',
  ink: 0x0f172a,
  inkCss: '#0f172a',
  white: 0xffffff,
  whiteCss: '#ffffff',
  // Back-compat aliases used by the shared scenes.
  sea: 0x2563eb,
  seaCss: '#2563eb',
  sand: 0xfacc15,
  sandCss: '#facc15',
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
