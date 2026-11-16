// Comic art (option C) — ALL art is procedural, drawn in code at real
// resolution. No bitmaps are upscaled anywhere: every texture is generated
// on a canvas at 4x display size and downscaled by Phaser, so edges stay
// razor-sharp (the r1 verdict was "pixelated, no quality" — this is the
// fix at the source). Palette roles (art-direction-and-readability):
//   yellow  = protagonist (the dummy)      red/orange = danger
//   green   = goal / go                     gold      = coins
//   navy    = steel ink (the drawn ramp)    blue      = bouncy ink
//   orange  = boost ink                     cream     = paper world
// Thick black outlines everywhere (2-4 px at display size), flat premium
// colour, halftone dots, speed lines, radial rays on cream paper.
import Phaser from 'phaser';

export const COMIC = {
  ink: '#141414',
  paper: '#f7e8c3',
  paperDark: '#efd9a4',
  paperDeep: '#e3c98f',
  sun: '#facc15',
  sunDark: '#d97706',
  navy: '#1e3a5f',
  navyDark: '#12263f',
  blue: '#2563eb',
  orange: '#f97316',
  green: '#22c55e',
  greenDark: '#15803d',
  red: '#e23b2e',
  redDark: '#9f1d12',
  grey: '#9aa3ad',
  greyLight: '#c3cad1',
  greyDark: '#5b6470',
  violet: '#7c3aed',
  teal: '#0ea5e9',
  white: '#ffffff',
};

export const INK_HEX: Record<string, string> = {
  standard: COMIC.navy,
  elastic: COMIC.blue,
  boost: COMIC.orange,
};

function cv(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function outline(ctx: CanvasRenderingContext2D, lw: number): void {
  ctx.strokeStyle = COMIC.ink;
  ctx.lineWidth = lw;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

/** Yellow armour plate with thick outline + darker shade edge. */
function plate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = COMIC.sun;
  ctx.fill();
  ctx.fillStyle = 'rgba(217,119,6,0.35)';
  ctx.fillRect(x + 2, y + h - h * 0.3, w - 4, h * 0.3 - 2);
  outline(ctx, 5);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(x + 4, y + 3, w - 8, 5);
}

function bolt(ctx: CanvasRenderingContext2D, x: number, y: number, r = 3): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = COMIC.ink;
  ctx.fill();
}

/** Helmet head: yellow dome + big dark visor with a white reflection. */
function drawHelmet(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  // Dome.
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = COMIC.sun;
  ctx.fill();
  outline(ctx, 6);
  ctx.stroke();
  // Dome ridge + side vent.
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.62, Math.PI * 1.15, Math.PI * 1.85);
  ctx.strokeStyle = COMIC.sunDark;
  ctx.lineWidth = 4;
  ctx.stroke();
  // Visor: big dark rounded rect with white reflection streak.
  const vw = r * 1.5;
  const vh = r * 0.72;
  const vx = cx - vw / 2;
  const vy = cy - r * 0.12;
  ctx.beginPath();
  ctx.roundRect(vx, vy, vw, vh, vh * 0.32);
  ctx.fillStyle = '#16213a';
  ctx.fill();
  outline(ctx, 5);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(vx, vy, vw, vh, vh * 0.32);
  ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.moveTo(vx + vw * 0.18, vy + vh);
  ctx.lineTo(vx + vw * 0.42, vy);
  ctx.lineTo(vx + vw * 0.58, vy);
  ctx.lineTo(vx + vw * 0.34, vy + vh);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(vx + vw * 0.62, vy + vh * 0.2, vw * 0.1, vh * 0.6);
  ctx.restore();
  // Chin + ear discs.
  ctx.beginPath();
  ctx.roundRect(cx - r * 0.72, cy + vh * 0.55, r * 1.44, r * 0.5, 8);
  ctx.fillStyle = COMIC.sun;
  ctx.fill();
  outline(ctx, 5);
  ctx.stroke();
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + s * r * 0.95, cy + r * 0.1, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.sunDark;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
  }
}

/** Cream paper with radial rays + halftone dots (the comic page). */
function drawPaper(ctx: CanvasRenderingContext2D, w: number, h: number, rays = 26): void {
  ctx.fillStyle = COMIC.paper;
  ctx.fillRect(0, 0, w, h);
  // Radial rays from a point above the top edge (sunburst).
  const cx = w * 0.5;
  const cy = -h * 0.12;
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < rays; i++) {
    const a0 = (i / rays) * Math.PI * 2;
    const a1 = a0 + (Math.PI * 2) / rays / 2.4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, Math.hypot(w, h), a0, a1);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(227,201,143,0.55)' : 'rgba(247,232,195,0)';
    ctx.fill();
  }
  ctx.restore();
  // Halftone dots along the top and bottom edges.
  ctx.fillStyle = 'rgba(20,20,20,0.16)';
  for (let y = 6; y < 46; y += 12) {
    for (let x = 6 + (y % 24 === 6 ? 0 : 6); x < w; x += 12) {
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (let y = h - 44; y < h - 4; y += 12) {
    for (let x = 6 + (y % 24 === 6 ? 0 : 6); x < w; x += 12) {
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Speed lines: a few thin diagonal streaks, low alpha.
  ctx.strokeStyle = 'rgba(20,20,20,0.10)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 7; i++) {
    const x = ((i * 173) % w) + 20;
    const y = ((i * 251) % h) + 40;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 90, y + 34);
    ctx.stroke();
  }
  // Thick black frame = the comic panel border.
  ctx.strokeStyle = COMIC.ink;
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, w - 10, h - 10);
}

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = COMIC.white;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.18, -r * 0.18, r, 0);
  ctx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r);
  ctx.quadraticCurveTo(-r * 0.18, r * 0.18, -r, 0);
  ctx.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r);
  ctx.fill();
  outline(ctx, 2);
  ctx.stroke();
  ctx.restore();
}

/** Generate every texture the game uses. Called once from BootScene. */
export function generateComicTextures(scene: Phaser.Scene): void {
  const T = scene.textures;
  const add = (key: string, c: HTMLCanvasElement): void => {
    if (T.exists(key)) T.remove(key);
    T.addCanvas(key, c);
  };

  // ---- Dummy parts (4x display size) ----
  // Head: menu bust 292x512 (helmet + shoulders), display 28x49 in-game
  // uses the same texture cropped by the ragdoll — the in-game head is the
  // helmet only, so we generate the helmet at 112x196 (28x49 @4x).
  {
    const [c, ctx] = cv(112, 196);
    ctx.clearRect(0, 0, 112, 196);
    drawHelmet(ctx, 56, 62, 44);
    // Neck + shoulders (the part below the helmet, visible in-game).
    plate(ctx, 22, 118, 68, 62, 12);
    bolt(ctx, 34, 132);
    bolt(ctx, 78, 132);
    add('dummy-head', c);
  }
  // Menu bust (292x512): big helmet + torso, used on the menu screen.
  {
    const [c, ctx] = cv(292, 512);
    ctx.clearRect(0, 0, 292, 512);
    drawHelmet(ctx, 146, 150, 108);
    plate(ctx, 46, 300, 200, 150, 22);
    bolt(ctx, 66, 322);
    bolt(ctx, 226, 322);
    bolt(ctx, 66, 428);
    bolt(ctx, 226, 428);
    // Chest light.
    ctx.beginPath();
    ctx.arc(146, 372, 18, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.green;
    ctx.fill();
    outline(ctx, 5);
    ctx.stroke();
    add('dummy-head-menu', c);
  }
  {
    const [c, ctx] = cv(136, 148);
    ctx.clearRect(0, 0, 136, 148);
    plate(ctx, 8, 8, 120, 132, 16);
    bolt(ctx, 26, 28);
    bolt(ctx, 110, 28);
    bolt(ctx, 26, 122);
    bolt(ctx, 110, 122);
    ctx.beginPath();
    ctx.arc(68, 74, 16, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.green;
    ctx.fill();
    outline(ctx, 5);
    ctx.stroke();
    add('dummy-torso', c);
  }
  const limb = (key: string, w: number, h: number): void => {
    const [c, ctx] = cv(w * 4, h * 4);
    ctx.clearRect(0, 0, w * 4, h * 4);
    plate(ctx, 6, 6, w * 4 - 12, h * 4 - 12, 14);
    ctx.beginPath();
    ctx.arc((w * 4) / 2, (h * 4) / 2, 9, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.ink;
    ctx.fill();
    add(key, c);
  };
  limb('dummy-upperarm', 15, 22);
  limb('dummy-forearm', 15, 22);
  limb('dummy-thigh', 17, 24);
  limb('dummy-shin', 16, 24);

  // ---- Props ----
  {
    // Fan: grey ring, 6 blades, hub, motion swirls.
    const [c, ctx] = cv(256, 256);
    ctx.clearRect(0, 0, 256, 256);
    ctx.beginPath();
    ctx.arc(128, 128, 112, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.greyLight;
    ctx.fill();
    outline(ctx, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(128, 128, 92, 0, Math.PI * 2);
    ctx.fillStyle = '#d7dde3';
    ctx.fill();
    outline(ctx, 6);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.save();
      ctx.translate(128, 128);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(58, 0, 52, 20, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = COMIC.grey;
      ctx.fill();
      outline(ctx, 5);
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(128, 128, 26, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.greyDark;
    ctx.fill();
    outline(ctx, 6);
    ctx.stroke();
    bolt(ctx, 128, 128, 7);
    // Motion swirls around the rim.
    ctx.strokeStyle = COMIC.ink;
    ctx.lineWidth = 5;
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1;
      ctx.beginPath();
      ctx.arc(128, 128, 124, a, a + 1.1);
      ctx.stroke();
    }
    add('prop-fan', c);
  }
  {
    // Dynamite: 3 red sticks, rope, sparking fuse, TNT label.
    const [c, ctx] = cv(192, 192);
    ctx.clearRect(0, 0, 192, 192);
    ctx.save();
    ctx.translate(96, 104);
    ctx.rotate(-0.5);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.roundRect(i * 26 - 13, -52, 26, 104, 8);
      ctx.fillStyle = COMIC.red;
      ctx.fill();
      outline(ctx, 6);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(i * 26 - 9, -48, 6, 96);
    }
    // Rope bands.
    ctx.strokeStyle = '#8a6d3b';
    ctx.lineWidth = 7;
    for (const y of [-30, 28]) {
      ctx.beginPath();
      ctx.moveTo(-42, y);
      ctx.lineTo(42, y);
      ctx.stroke();
    }
    // Fuse + spark.
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.quadraticCurveTo(26, -78, 44, -66);
    ctx.strokeStyle = COMIC.ink;
    ctx.lineWidth = 6;
    ctx.stroke();
    sparkle(ctx, 50, -70, 16);
    ctx.fillStyle = COMIC.orange;
    ctx.beginPath();
    ctx.arc(50, -70, 7, 0, Math.PI * 2);
    ctx.fill();
    // TNT label.
    ctx.fillStyle = COMIC.white;
    ctx.font = 'bold 26px "Lilita One", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TNT', 0, 8);
    ctx.restore();
    add('prop-dynamite', c);
  }
  {
    // Portal: violet/teal swirling rings + stars.
    const [c, ctx] = cv(256, 256);
    ctx.clearRect(0, 0, 256, 256);
    ctx.beginPath();
    ctx.arc(128, 128, 112, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.violet;
    ctx.fill();
    outline(ctx, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(128, 128, 86, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.teal;
    ctx.fill();
    outline(ctx, 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(128, 128, 58, 0, Math.PI * 2);
    ctx.fillStyle = '#fdf6d8';
    ctx.fill();
    outline(ctx, 5);
    ctx.stroke();
    // Swirl arcs.
    ctx.strokeStyle = COMIC.white;
    ctx.lineWidth = 6;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(128, 128, 72, i * 2.1, i * 2.1 + 1.2);
      ctx.stroke();
    }
    sparkle(ctx, 78, 70, 12);
    sparkle(ctx, 184, 178, 10);
    add('prop-portal', c);
  }
  {
    // Checkered flag on a pole, with sparkles.
    const [c, ctx] = cv(176, 248);
    ctx.clearRect(0, 0, 176, 248);
    // Pole.
    ctx.fillStyle = COMIC.greyDark;
    ctx.fillRect(28, 8, 10, 232);
    outline(ctx, 4);
    ctx.strokeRect(28, 8, 10, 232);
    ctx.beginPath();
    ctx.arc(33, 8, 9, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.sun;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    // Flag: 4x3 checker.
    const fx = 38;
    const fy = 14;
    const cw = 32;
    const ch = 26;
    for (let r = 0; r < 3; r++) {
      for (let col = 0; col < 4; col++) {
        ctx.fillStyle = (r + col) % 2 === 0 ? COMIC.ink : COMIC.white;
        ctx.fillRect(fx + col * cw, fy + r * ch, cw, ch);
      }
    }
    ctx.strokeStyle = COMIC.ink;
    ctx.lineWidth = 5;
    ctx.strokeRect(fx, fy, cw * 4, ch * 3);
    sparkle(ctx, 156, 30, 12);
    sparkle(ctx, 150, 108, 9);
    add('prop-flag', c);
  }
  {
    // Coin: gold, thick outline, star.
    const [c, ctx] = cv(128, 128);
    ctx.clearRect(0, 0, 128, 128);
    ctx.beginPath();
    ctx.arc(64, 64, 54, 0, Math.PI * 2);
    ctx.fillStyle = COMIC.sun;
    ctx.fill();
    outline(ctx, 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(64, 64, 42, 0, Math.PI * 2);
    ctx.strokeStyle = COMIC.sunDark;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = COMIC.white;
    ctx.beginPath();
    ctx.moveTo(64, 34);
    ctx.lineTo(72, 56);
    ctx.lineTo(95, 56);
    ctx.lineTo(77, 70);
    ctx.lineTo(84, 92);
    ctx.lineTo(64, 79);
    ctx.lineTo(44, 92);
    ctx.lineTo(51, 70);
    ctx.lineTo(33, 56);
    ctx.lineTo(56, 56);
    ctx.closePath();
    ctx.fill();
    add('coin', c);
  }
  {
    // Star (gold, for Result + map).
    const [c, ctx] = cv(128, 128);
    ctx.clearRect(0, 0, 128, 128);
    ctx.fillStyle = COMIC.sun;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const r = i % 2 === 0 ? 56 : 25;
      const x = 64 + Math.cos(a) * r;
      const y = 64 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    outline(ctx, 7);
    ctx.stroke();
    add('prop-star', c);
  }
  {
    // Ink pot.
    const [c, ctx] = cv(128, 128);
    ctx.clearRect(0, 0, 128, 128);
    ctx.beginPath();
    ctx.roundRect(34, 52, 60, 56, 12);
    ctx.fillStyle = COMIC.navy;
    ctx.fill();
    outline(ctx, 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(64, 52, 30, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0b1526';
    ctx.fill();
    outline(ctx, 5);
    ctx.stroke();
    ctx.fillStyle = COMIC.white;
    ctx.font = 'bold 22px "Lilita One", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INK', 64, 92);
    add('prop-inkpot', c);
  }
  {
    // Chest.
    const [c, ctx] = cv(224, 228);
    ctx.clearRect(0, 0, 224, 228);
    ctx.beginPath();
    ctx.roundRect(22, 84, 180, 120, 14);
    ctx.fillStyle = '#8a6d3b';
    ctx.fill();
    outline(ctx, 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(112, 84, 62, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = '#a8842f';
    ctx.fill();
    outline(ctx, 7);
    ctx.stroke();
    ctx.fillStyle = COMIC.sun;
    ctx.fillRect(102, 74, 20, 130);
    ctx.strokeStyle = COMIC.ink;
    ctx.lineWidth = 5;
    ctx.strokeRect(102, 74, 20, 130);
    ctx.beginPath();
    ctx.roundRect(92, 118, 40, 36, 8);
    ctx.fillStyle = COMIC.sun;
    ctx.fill();
    outline(ctx, 5);
    ctx.stroke();
    add('chest', c);
  }

  // ---- Backgrounds (2x display size, cream comic paper) ----
  {
    const [c, ctx] = cv(780, 1688);
    drawPaper(ctx, 780, 1688, 26);
    add('bg-play', c);
    const [c2, ctx2] = cv(780, 1688);
    drawPaper(ctx2, 780, 1688, 30);
    // Menu: bigger burst behind the title + a dummy silhouette zone.
    ctx2.save();
    ctx2.translate(390, 300);
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      ctx2.rotate((Math.PI * 2) / 18);
      ctx2.fillStyle = 'rgba(250,204,21,0.5)';
      ctx2.beginPath();
      ctx2.moveTo(0, 0);
      ctx2.lineTo(420, -26);
      ctx2.lineTo(420, 26);
      ctx2.closePath();
      ctx2.fill();
    }
    ctx2.restore();
    add('bg-menu', c2);
  }
  {
    const [c, ctx] = cv(1688, 780);
    drawPaper(ctx, 1688, 780, 30);
    add('bg-play-land', c);
  }

  // ---- Particle dot (white circle) + gold star, generated once. ----
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 1);
  g.fillCircle(16, 16, 14);
  g.generateTexture('dot', 32, 32);
  g.clear();
  g.destroy();
}

/** Draw a comic ramp into a Graphics object: thick black under-stroke,
 * coloured core, crosshatch ticks, and (elastic) a spring zig-zag or
 * (boost) chevrons. `pts` are the stroke points. */
export function drawComicRamp(
  g: Phaser.GameObjects.Graphics,
  pts: { x: number; y: number }[],
  ink: 'standard' | 'elastic' | 'boost',
): void {
  if (pts.length < 2) return;
  const color =
    ink === 'standard' ? 0x1e3a5f : ink === 'elastic' ? 0x2563eb : 0xf97316;
  // Black under-stroke (the outline), then the coloured core.
  for (const [w, c] of [
    [16, 0x141414],
    [10, color],
  ] as const) {
    g.lineStyle(w, c, 1);
    g.beginPath();
    pts.forEach((pt, i) => {
      if (i === 0) g.moveTo(pt.x, pt.y);
      else g.lineTo(pt.x, pt.y);
    });
    g.strokePath();
  }
  // Round caps at every point so the stroke never looks cut.
  for (const pt of pts) {
    g.fillStyle(color, 1);
    g.fillCircle(pt.x, pt.y, 5);
  }
  // Crosshatch: short perpendicular ticks every ~16 px along the stroke.
  g.lineStyle(2, 0x141414, 0.55);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.floor(len / 16);
    const nx = -(b.y - a.y) / (len || 1);
    const ny = (b.x - a.x) / (len || 1);
    for (let s = 1; s <= steps; s++) {
      const px = a.x + ((b.x - a.x) * s) / (steps + 1);
      const py = a.y + ((b.y - a.y) * s) / (steps + 1);
      g.lineBetween(px - nx * 6, py - ny * 6, px + nx * 6, py + ny * 6);
    }
  }
  if (ink === 'elastic') {
    // Spring zig-zag above the stroke.
    g.lineStyle(3, 0xffffff, 0.9);
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const steps = Math.max(2, Math.floor(len / 18));
      const nx = -(b.y - a.y) / (len || 1);
      const ny = (b.x - a.x) / (len || 1);
      g.beginPath();
      for (let s = 0; s <= steps; s++) {
        const px = a.x + ((b.x - a.x) * s) / steps + nx * (s % 2 === 0 ? -8 : 8);
        const py = a.y + ((b.y - a.y) * s) / steps + ny * (s % 2 === 0 ? -8 : 8);
        if (s === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.strokePath();
    }
  }
  if (ink === 'boost') {
    // Chevrons pointing downhill.
    g.lineStyle(3, 0xffffff, 0.9);
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const steps = Math.floor(len / 28);
      const ux = (b.x - a.x) / (len || 1);
      const uy = (b.y - a.y) / (len || 1);
      const nx = -uy;
      const ny = ux;
      for (let s = 1; s <= steps; s++) {
        const px = a.x + ux * s * 28;
        const py = a.y + uy * s * 28;
        g.beginPath();
        g.moveTo(px - ux * 7 + nx * 7, py - uy * 7 + ny * 7);
        g.lineTo(px, py);
        g.lineTo(px - ux * 7 - nx * 7, py - uy * 7 - ny * 7);
        g.strokePath();
      }
    }
  }
}

/** Draw a comic platform slab (grey, thick black outline, hatched side,
 * lighter top face) into a Graphics object. */
export function drawComicPlatform(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  // Body.
  g.fillStyle(0x9aa3ad, 1);
  g.fillRect(x, y, w, h);
  // Top face (lighter, 8 px).
  g.fillStyle(0xc3cad1, 1);
  g.fillRect(x, y, w, 8);
  // Side hatch: diagonal lines on the lower half.
  g.lineStyle(2, 0x5b6470, 0.5);
  const step = 18;
  for (let hx = x + 8; hx < x + w - 4; hx += step) {
    g.lineBetween(hx, y + h - 4, hx + 12, y + 14);
  }
  // Thick black outline + a second inner line on the top edge.
  g.lineStyle(4, 0x141414, 1);
  g.strokeRect(x + 2, y + 2, w - 4, h - 4);
  g.lineStyle(2, 0x141414, 0.8);
  g.lineBetween(x, y + 10, x + w, y + 10);
}
