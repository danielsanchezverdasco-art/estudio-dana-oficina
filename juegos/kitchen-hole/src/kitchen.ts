// Kitchen art (Agujero Tragón) — ALL art is procedural, drawn in code.
// Same fix as Ramp r2 option C: every texture is generated on a canvas at
// 4x display size and downscaled by Phaser, so edges stay razor-sharp.
// Style (art bible, from the approved mockup v2): polished toy-3D, top-down
// kitchen — characters with volume and expressions, thick ink outlines,
// saturated colours, warm light, soft real shadows, textures (wood, metal,
// fabric, tiles). No flat drawing, no clip-art. The hole is the progress:
// it must read as a deep black pit with a violet swirl rim at any size.
import Phaser from 'phaser';
import { KIND_STATS, type ObjKind } from './rules';

export const KITCHEN = {
  ink: '#141414',
  paper: '#fdf3d8',
  paperDark: '#f3e3b8',
  cream: '#fff7e0',
  wood: '#b07a45',
  woodDark: '#8a5a2b',
  woodLight: '#d9a05f',
  tileMint: '#bfe8d2',
  tileTeal: '#7fc8bc',
  tileCream: '#f6ead0',
  checkerRed: '#d94f3d',
  marble: '#f2ede6',
  brass: '#c9a227',
  fridge: '#2563eb',
  fridgeDark: '#1d4ed8',
  fridgeLight: '#60a5fa',
  violet: '#7c3aed',
  violetLight: '#a78bfa',
  gold: '#facc15',
  goldDark: '#d97706',
  crumb: '#8a5a2b',
  cookie: '#d9a05f',
  apple: '#e23b2e',
  appleDark: '#9f1d12',
  leaf: '#22c55e',
  leafDark: '#15803d',
  donutPink: '#f472b6',
  donutBrown: '#a16207',
  croissant: '#e8a94e',
  cup: '#f8fafc',
  sushiRice: '#f8fafc',
  salmon: '#fb923c',
  seaweed: '#14532d',
  toaster: '#cbd5e1',
  steel: '#94a3b8',
  cake: '#f9a8d4',
  cakeCream: '#fff7ed',
  pizza: '#fbbf24',
  pepperoni: '#dc2626',
  plant: '#22c55e',
  pot: '#b45309',
  chairWood: '#92400e',
  stove: '#334155',
  table: '#92400e',
  tableLight: '#b45309',
  cat: '#f97316',
  catDark: '#c2410c',
  dog: '#92400e',
  dogDark: '#78350f',
  mouseGrey: '#9aa3ad',
  mouseDark: '#5b6470',
  octopus: '#7c3aed',
  white: '#ffffff',
  shadow: 'rgba(20,20,20,0.25)',
};

function cv(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function outline(ctx: CanvasRenderingContext2D, lw: number): void {
  ctx.strokeStyle = KITCHEN.ink;
  ctx.lineWidth = lw;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

/** Soft ellipse shadow under an object (drawn by the scene, not the texture). */
export function drawShadow(g: Phaser.GameObjects.Graphics, x: number, y: number, r: number): void {
  g.fillStyle(0x141414, 0.22);
  g.fillEllipse(x, y + r * 0.55, r * 1.7, r * 0.7);
}

/** Two-dot happy face, centred at (cx, cy) with eye spacing s. */
function happyFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, scale = 1): void {
  ctx.fillStyle = KITCHEN.ink;
  ctx.beginPath();
  ctx.arc(cx - s * scale, cy, 2.2 * scale, 0, Math.PI * 2);
  ctx.arc(cx + s * scale, cy, 2.2 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = KITCHEN.ink;
  ctx.lineWidth = 2.4 * scale;
  ctx.beginPath();
  ctx.arc(cx, cy + 2 * scale, 5 * scale, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

type DrawFn = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => void;

const DRAW: Record<string, DrawFn> = {
  crumb(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.crumb;
    ctx.fill();
    outline(ctx, 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fill();
  },
  cookie(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.cookie;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.fillStyle = '#6b3a1a';
    for (const [dx, dy] of [[-0.35, -0.2], [0.3, -0.35], [0.05, 0.3], [-0.1, 0.05], [0.4, 0.25]] as const) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy + dy * r, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.35, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fill();
  },
  apple(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.08, r * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.apple;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    // Leaf + stem.
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.45, cy - r * 0.85, r * 0.4, r * 0.2, -0.6, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.leaf;
    ctx.fill();
    ctx.strokeStyle = KITCHEN.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.8);
    ctx.lineTo(cx + r * 0.1, cy - r * 1.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.25, r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fill();
  },
  donut(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.donutBrown;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    // Pink frosting with a wavy edge.
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.donutPink;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.paper;
    ctx.fill();
    outline(ctx, 3);
    ctx.stroke();
    // Sprinkles.
    const colors = ['#fff', '#facc15', '#22c55e', '#2563eb'];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.3;
      const sx = cx + Math.cos(a) * r * 0.58;
      const sy = cy + Math.sin(a) * r * 0.58;
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sx - 3, sy);
      ctx.lineTo(sx + 3, sy + 2);
      ctx.stroke();
    }
  },
  croissant(ctx, cx, cy, r) {
    // Crescent: three overlapping circles, golden with darker ridges.
    ctx.fillStyle = KITCHEN.croissant;
    for (const [dx, dy, rr] of [[-0.45, 0.15, 0.55], [0, -0.1, 0.62], [0.45, 0.15, 0.55]] as const) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy + dy * r, rr * r, 0, Math.PI * 2);
      ctx.fill();
    }
    outline(ctx, 4);
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.1, r * 0.62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.5;
    for (const x of [-0.35, 0, 0.35]) {
      ctx.beginPath();
      ctx.moveTo(cx + x * r, cy - r * 0.55);
      ctx.lineTo(cx + x * r, cy + r * 0.4);
      ctx.stroke();
    }
  },
  cup(ctx, cx, cy, r) {
    // White mug, top-down: rim + coffee + handle + tiny face.
    ctx.beginPath();
    ctx.arc(cx + r * 0.85, cy, r * 0.42, -Math.PI * 0.6, Math.PI * 0.6);
    ctx.strokeStyle = KITCHEN.ink;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.cup;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
    ctx.fillStyle = '#6b3a1a';
    ctx.fill();
    happyFace(ctx, cx, cy - r * 0.05, r * 0.22, 1.4);
  },
  sushi(ctx, cx, cy, r) {
    // Maki roll: dark seaweed ring, white rice, salmon centre.
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.seaweed;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.sushiRice;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.salmon;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - r * 0.15, cy - r * 0.15, r * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
  },
};

Object.assign(DRAW, {
  toaster(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.9, cy - r * 0.7, r * 1.8, r * 1.4, r * 0.3);
    ctx.fillStyle = KITCHEN.toaster;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    // Slots + lever + face.
    ctx.fillStyle = KITCHEN.ink;
    ctx.fillRect(cx - r * 0.6, cy - r * 0.55, r * 1.2, r * 0.18);
    ctx.fillStyle = KITCHEN.steel;
    ctx.fillRect(cx + r * 0.55, cy - r * 0.1, r * 0.22, r * 0.5);
    happyFace(ctx, cx, cy + r * 0.3, r * 0.22, 1.3);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(cx - r * 0.7, cy - r * 0.55, r * 1.4, r * 0.12);
  },
  cake(ctx, cx, cy, r) {
    // Slice: pink layers, cream filling, cherry on top.
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.85, cy + r * 0.7);
    ctx.lineTo(cx - r * 0.85, cy - r * 0.2);
    ctx.lineTo(cx + r * 0.85, cy - r * 0.2);
    ctx.lineTo(cx + r * 0.85, cy + r * 0.7);
    ctx.closePath();
    ctx.fillStyle = KITCHEN.cake;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.fillStyle = KITCHEN.cakeCream;
    ctx.fillRect(cx - r * 0.85, cy + r * 0.05, r * 1.7, r * 0.18);
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.45, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.apple;
    ctx.fill();
    outline(ctx, 3);
    ctx.stroke();
  },
  pizza(ctx, cx, cy, r) {
    // Slice pointing up: golden crust, pepperoni, cheese shine.
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx - r * 0.85, cy + r * 0.75);
    ctx.lineTo(cx + r * 0.85, cy + r * 0.75);
    ctx.closePath();
    ctx.fillStyle = KITCHEN.pizza;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy + r * 0.15, r * 0.22, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.3, cy + r * 0.35, r * 0.22, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.05, cy - r * 0.35, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.pepperoni;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - r * 0.2, cy + r * 0.55, r * 0.3, 0, Math.PI * 2);
    ctx.strokeStyle = KITCHEN.ink;
    ctx.lineWidth = 5;
    ctx.stroke();
  },
  plant(ctx, cx, cy, r) {
    // Terracotta pot + three leaves.
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.45, r * 0.6, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.pot;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    for (const [dx, ang, len] of [[-0.35, -0.5, 0.95], [0, 0, 1.1], [0.35, 0.5, 0.95]] as const) {
      ctx.save();
      ctx.translate(cx + dx * r, cy + r * 0.2);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.ellipse(0, -len * r * 0.5, r * 0.28, len * r * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = KITCHEN.plant;
      ctx.fill();
      ctx.strokeStyle = KITCHEN.ink;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  },
  chair(ctx, cx, cy, r) {
    // Wooden chair, top-down: seat + backrest + legs.
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.8, cy - r * 0.55, r * 1.6, r * 1.1, r * 0.25);
    ctx.fillStyle = KITCHEN.chairWood;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.8, cy - r * 0.95, r * 1.6, r * 0.45, r * 0.2);
    ctx.fillStyle = KITCHEN.tableLight;
    ctx.fill();
    outline(ctx, 3);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(cx - r * 0.6, cy - r * 0.4, r * 1.2, r * 0.18);
  },
  stove(ctx, cx, cy, r) {
    // Dark stove: four burners + knobs + oven window.
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.9, cy - r * 0.8, r * 1.8, r * 1.6, r * 0.25);
    ctx.fillStyle = KITCHEN.stove;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    for (const [dx, dy] of [[-0.45, -0.35], [0.45, -0.35], [-0.45, 0.3], [0.45, 0.3]] as const) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy + dy * r, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = KITCHEN.steel;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    ctx.fillStyle = KITCHEN.gold;
    ctx.fillRect(cx - r * 0.5, cy + r * 0.62, r, r * 0.12);
  },
  table(ctx, cx, cy, r) {
    // Round wooden table with a checkered cloth edge.
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.table;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
    ctx.fillStyle = '#f6ead0';
    ctx.fill();
    ctx.strokeStyle = KITCHEN.checkerRed;
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.72, cy + Math.sin(a) * r * 0.72);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.pizza;
    ctx.fill();
    outline(ctx, 3);
    ctx.stroke();
  },
  fridge(ctx, cx, cy, r) {
    // Blue fridge with a smiling face, top-down: tall rounded rect,
    // door split, handle, magnet dots.
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.72, cy - r, r * 1.44, r * 2, r * 0.35);
    ctx.fillStyle = KITCHEN.fridge;
    ctx.fill();
    outline(ctx, 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.72, cy - r, r * 1.44, r * 0.85, r * 0.3);
    ctx.fillStyle = KITCHEN.fridgeLight;
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(cx - r * 0.55, cy - r * 0.9, r * 0.35, r * 1.7);
    // Face on the lower door.
    happyFace(ctx, cx, cy + r * 0.35, r * 0.24, 1.6);
    // Handle + magnets.
    ctx.fillStyle = KITCHEN.ink;
    ctx.fillRect(cx + r * 0.55, cy - r * 0.1, r * 0.1, r * 0.7);
    for (const [dx, dy, c] of [[-0.4, -0.55, '#facc15'], [0.35, -0.6, '#f472b6'], [0.1, 0.75, '#22c55e']] as const) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy + dy * r, r * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    }
  },
  cat(ctx, cx, cy, r) {
    // Orange cat: round body, triangle ears, tail curl, face.
    ctx.strokeStyle = KITCHEN.ink;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx + r * 0.8, cy + r * 0.5, r * 0.45, 0, Math.PI * 1.5);
    ctx.strokeStyle = KITCHEN.cat;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.cat;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    for (const dx of [-0.5, 0.5]) {
      ctx.beginPath();
      ctx.moveTo(cx + dx * r * 0.9, cy - r * 0.55);
      ctx.lineTo(cx + dx * r * 1.15, cy - r * 1.05);
      ctx.lineTo(cx + dx * r * 0.45, cy - r * 0.8);
      ctx.closePath();
      ctx.fillStyle = KITCHEN.cat;
      ctx.fill();
      outline(ctx, 3);
      ctx.stroke();
    }
    happyFace(ctx, cx, cy + r * 0.05, r * 0.28, 1.5);
    ctx.strokeStyle = KITCHEN.catDark;
    ctx.lineWidth = 3;
    for (const x of [-0.45, 0, 0.45]) {
      ctx.beginPath();
      ctx.moveTo(cx + x * r, cy + r * 0.5);
      ctx.lineTo(cx + x * r, cy + r * 0.75);
      ctx.stroke();
    }
  },
  dog(ctx, cx, cy, r) {
    // Brown dog: round body, floppy ears, snout, face.
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.dog;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    for (const dx of [-0.75, 0.75]) {
      ctx.beginPath();
      ctx.ellipse(cx + dx * r, cy - r * 0.1, r * 0.3, r * 0.55, dx * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = KITCHEN.dogDark;
      ctx.fill();
      outline(ctx, 3);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.35, r * 0.4, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#d9a05f';
    ctx.fill();
    outline(ctx, 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.28, r * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.ink;
    ctx.fill();
    happyFace(ctx, cx, cy - r * 0.25, r * 0.26, 1.5);
  },
  mouse(ctx, cx, cy, r) {
    // Grey mouse: body, big round ears, tail, nose.
    ctx.strokeStyle = KITCHEN.mouseGrey;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.6, cy + r * 0.4);
    ctx.quadraticCurveTo(cx + r * 1.3, cy + r * 0.9, cx + r * 1.1, cy + r * 0.2);
    ctx.stroke();
    for (const dx of [-0.45, 0.45]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy - r * 0.7, r * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = KITCHEN.mouseGrey;
      ctx.fill();
      outline(ctx, 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy - r * 0.7, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#f9a8d4';
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.1, r * 0.8, r * 0.65, 0, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.mouseGrey;
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + r * 0.7, cy + r * 0.05, r * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.ink;
    ctx.fill();
    ctx.fillStyle = KITCHEN.ink;
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy - r * 0.1, r * 0.1, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.25, cy - r * 0.1, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
  },
  coin(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.gold;
    ctx.fill();
    outline(ctx, 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.68, 0, Math.PI * 2);
    ctx.strokeStyle = KITCHEN.goldDark;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = KITCHEN.goldDark;
    ctx.font = `bold ${r * 0.9}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', cx, cy + r * 0.05);
  },
  star(ctx, cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 === 0 ? r : r * 0.45;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = KITCHEN.gold;
    ctx.fill();
    outline(ctx, 3);
    ctx.stroke();
  },
  sparkle(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx + r * 0.2, cy - r * 0.2, cx + r, cy);
    ctx.quadraticCurveTo(cx + r * 0.2, cy + r * 0.2, cx, cy + r);
    ctx.quadraticCurveTo(cx - r * 0.2, cy + r * 0.2, cx - r, cy);
    ctx.quadraticCurveTo(cx - r * 0.2, cy - r * 0.2, cx, cy - r);
    ctx.fillStyle = KITCHEN.gold;
    ctx.fill();
    outline(ctx, 2.5);
    ctx.stroke();
  },
  octopus(ctx, cx, cy, r) {
    // Dana Games mascot cameo: purple octopus, hidden in each game.
    ctx.fillStyle = KITCHEN.octopus;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI + Math.PI * 0.1;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r * 0.55, cy + r * 0.55 + Math.sin(a) * r * 0.2, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.1, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
    outline(ctx, 4);
    ctx.stroke();
    ctx.fillStyle = KITCHEN.white;
    for (const dx of [-0.28, 0.28]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy - r * 0.2, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = KITCHEN.ink;
    for (const dx of [-0.28, 0.28]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy - r * 0.2, r * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = KITCHEN.ink;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.15, r * 0.25, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  },
} satisfies Record<string, DrawFn>);

/** The hole, drawn live each frame (it grows): violet glow, black pit, rotating swirl. */
export function drawHole(g: Phaser.GameObjects.Graphics, x: number, y: number, r: number, time: number, rim = 0x7c3aed, rimLight = 0xa78bfa): void {
  g.fillStyle(rim, 0.22);
  g.fillEllipse(x, y, r * 2.5, r * 2.1);
  g.fillStyle(0x141414, 1);
  g.fillEllipse(x, y, r * 2, r * 1.66);
  g.lineStyle(3, rim, 0.95);
  g.strokeEllipse(x, y, r * 2, r * 1.66);
  // Swirl: three arcs rotating with time, violet light.
  g.lineStyle(2.5, rimLight, 0.85);
  for (let i = 0; i < 3; i++) {
    const a0 = time * 1.6 + (i * Math.PI * 2) / 3;
    g.beginPath();
    g.arc(x, y, r * (0.55 - i * 0.12), a0, a0 + Math.PI * 0.9);
    g.strokePath();
  }
  // Depth cue: a pale crescent at the top edge.
  g.lineStyle(2, 0xffffff, 0.35);
  g.beginPath();
  g.arc(x, y, r * 0.82, Math.PI * 1.15, Math.PI * 1.85);
  g.strokePath();
}

export type KitchenName = 'grandma' | 'foodtruck' | 'bakery' | 'pizzeria' | 'sushi' | 'grand';

/** Map a level's display kitchen name to its floor key. */
export function floorKey(kitchen: string): KitchenName {
  if (kitchen.startsWith('Grandma')) return 'grandma';
  if (kitchen.startsWith('Food Truck')) return 'foodtruck';
  if (kitchen.startsWith('Bakery')) return 'bakery';
  if (kitchen.startsWith('Pizzeria')) return 'pizzeria';
  if (kitchen.startsWith('Sushi')) return 'sushi';
  return 'grand';
}

/** Floor + fixed decor for one kitchen, drawn once per level (Graphics). */
export function drawFloor(g: Phaser.GameObjects.Graphics, kitchen: KitchenName, w: number, h: number): void {
  const K = KITCHEN;
  if (kitchen === 'grandma') {
    g.fillStyle(0xb07a45, 1);
    g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 46) {
      g.fillStyle(0x8a5a2b, 1);
      g.fillRect(0, y, w, 3);
      g.lineStyle(1, 0x8a5a2b, 0.4);
      for (let i = 0; i < 3; i++) {
        const gy = y + 10 + i * 12;
        g.beginPath();
        g.moveTo(20 + i * 40, gy);
        g.lineTo(w - 30 - i * 30, gy + 4);
        g.strokePath();
      }
    }
  } else if (kitchen === 'foodtruck') {
    g.fillStyle(0x94a3b8, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0x64748b, 1);
    for (let y = 0; y < h; y += 52) for (let x = 0; x < w; x += 52) {
      if ((x / 52 + y / 52) % 2 === 0) g.fillRect(x, y, 52, 52);
    }
    // Checker border, diner style.
    for (let x = 0; x < w; x += 32) {
      g.fillStyle((x / 32) % 2 === 0 ? 0xd94f3d : 0xf6ead0, 1);
      g.fillRect(x, 0, 32, 16);
      g.fillRect(x, h - 16, 32, 16);
    }
  } else if (kitchen === 'bakery') {
    g.fillStyle(0xbfe8d2, 1);
    g.fillRect(0, 0, w, h);
    g.lineStyle(2, 0x8fd0ae, 1);
    for (let y = 0; y <= h; y += 52) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.strokePath();
    }
    for (let x = 0; x <= w; x += 52) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.strokePath();
    }
    g.fillStyle(0xf472b6, 0.8);
    for (let y = 26; y < h; y += 52) for (let x = 26; x < w; x += 52) g.fillCircle(x, y, 3);
  } else if (kitchen === 'pizzeria') {
    g.fillStyle(0xb07a45, 1);
    g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 46) {
      g.fillStyle(0x8a5a2b, 1);
      g.fillRect(0, y, w, 3);
    }
    // Red-check tablecloth bands top + bottom.
    for (const y0 of [0, h - 64]) {
      for (let x = 0; x < w; x += 32) {
        g.fillStyle((x / 32) % 2 === 0 ? 0xd94f3d : 0xf6ead0, 1);
        g.fillRect(x, y0, 32, 64);
      }
    }
  } else if (kitchen === 'sushi') {
    g.fillStyle(0x7fc8bc, 1);
    g.fillRect(0, 0, w, h);
    g.lineStyle(2, 0x5aa897, 1);
    for (let y = 0; y <= h; y += 58) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.strokePath();
    }
    // Bamboo mat strip across the middle.
    g.fillStyle(0xd9a05f, 1);
    g.fillRect(0, 380, w, 84);
    g.lineStyle(2, 0x8a5a2b, 1);
    for (let x = 0; x <= w; x += 18) {
      g.beginPath();
      g.moveTo(x, 380);
      g.lineTo(x, 464);
      g.strokePath();
    }
  } else {
    // Grand kitchen: marble + brass border + grey veins.
    g.fillStyle(0xf2ede6, 1);
    g.fillRect(0, 0, w, h);
    g.lineStyle(1.5, 0xb8b0a4, 0.7);
    const veins: Array<Array<[number, number]>> = [
      [[30, 60], [120, 140], [90, 260], [200, 380]],
      [[300, 80], [240, 220], [330, 340], [260, 520]],
      [[60, 500], [150, 600], [110, 720], [220, 800]],
    ];
    for (const v of veins) {
      g.beginPath();
      g.moveTo(v[0][0], v[0][1]);
      for (let i = 1; i < v.length; i++) g.lineTo(v[i][0], v[i][1]);
      g.strokePath();
    }
    g.lineStyle(6, 0xc9a227, 1);
    g.strokeRect(6, 6, w - 12, h - 12);
  }
  void K;
}

/** Extra (non-kind) textures with their display radii. */
const EXTRA: Record<string, { draw: DrawFn; r: number }> = {
  cat: { draw: DRAW.cat, r: 26 },
  dog: { draw: DRAW.dog, r: 26 },
  mouse: { draw: DRAW.mouse, r: 10 },
  coin: { draw: DRAW.coin, r: 10 },
  star: { draw: DRAW.star, r: 14 },
  sparkle: { draw: DRAW.sparkle, r: 12 },
  octopus: { draw: DRAW.octopus, r: 16 },
};

/** Generate every object texture at 4x (BootScene calls this once). */
export function generateKitchenTextures(scene: Phaser.Scene): void {
  const make = (key: string, draw: DrawFn, r: number): void => {
    if (scene.textures.exists(key)) return;
    const size = Math.ceil((r * 2 + 16) * 4);
    const [c, ctx] = cv(size, size);
    const cx = size / 2;
    const cy = size / 2;
    draw(ctx, cx, cy, r * 4);
    scene.textures.addCanvas(key, c);
  };
  for (const kind of Object.keys(KIND_STATS) as ObjKind[]) {
    const draw = DRAW[kind];
    if (draw) make(`kh-${kind}`, draw, KIND_STATS[kind].r);
  }
  for (const [key, v] of Object.entries(EXTRA)) make(`kh-${key}`, v.draw, v.r);
}

/** Texture key for an object kind (goldens reuse the kind texture + sparkle). */
export function textureFor(kind: ObjKind): string {
  return `kh-${kind}`;
}

/** Menu + backdrop textures (bg-menu, bg-play, bg-play-land, chest).
 * The menu illustration is the concept itself: the kitchen with the hole
 * swallowing a croissant on loop and the fridge smiling. Drawn at 2x. */
export function generateMenuTextures(scene: Phaser.Scene): void {
  // --- bg-menu (390x844 @2x): grandma's kitchen, illustrated. ---
  if (!scene.textures.exists('bg-menu')) {
    const W = 780;
    const H = 1688;
    const [c, ctx] = cv(W, H);
    // Wall (cream) + wood floor.
    ctx.fillStyle = KITCHEN.cream;
    ctx.fillRect(0, 0, W, 900);
    ctx.fillStyle = KITCHEN.wood;
    ctx.fillRect(0, 900, W, H - 900);
    ctx.fillStyle = KITCHEN.woodDark;
    for (let y = 900; y < H; y += 92) ctx.fillRect(0, y, W, 6);
    // Window with sun (top-right) + hanging plant (top-left).
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(520, 120, 200, 200);
    ctx.strokeStyle = KITCHEN.ink;
    ctx.lineWidth = 8;
    ctx.strokeRect(520, 120, 200, 200);
    ctx.beginPath();
    ctx.moveTo(620, 120);
    ctx.lineTo(620, 320);
    ctx.moveTo(520, 220);
    ctx.lineTo(720, 220);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(660, 180, 34, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.gold;
    ctx.fill();
    DRAW.plant(ctx, 120, 260, 110);
    // Table with checkered cloth, centre.
    ctx.beginPath();
    ctx.ellipse(390, 1080, 300, 130, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f6ead0';
    ctx.fill();
    outline(ctx, 8);
    ctx.stroke();
    ctx.fillStyle = KITCHEN.checkerRed;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(390 + Math.cos(a) * 210, 1080 + Math.sin(a) * 90);
      ctx.lineTo(390 + Math.cos(a) * 300, 1080 + Math.sin(a) * 130);
      ctx.lineTo(390 + Math.cos(a + 0.4) * 300, 1080 + Math.sin(a + 0.4) * 130);
      ctx.lineTo(390 + Math.cos(a + 0.4) * 210, 1080 + Math.sin(a + 0.4) * 90);
      ctx.closePath();
      ctx.fill();
    }
    // The hole, swallowing a croissant (the menu's living centrepiece)
    // is drawn LIVE by MenuScene (Graphics + tween) — the static
    // background must NOT draw its own hole, or the menu shows two.
    DRAW.sparkle(ctx, 180, 1180, 26);
    DRAW.sparkle(ctx, 610, 1200, 22);
    DRAW.sparkle(ctx, 560, 1440, 26);
    scene.textures.addCanvas('bg-menu', c);
  }

  // --- bg-play (portrait) / bg-play-land (landscape): wood floor + vignette. ---
  const floorBg = (key: string, w: number, h: number): void => {
    if (scene.textures.exists(key)) return;
    const [c, ctx] = cv(w, h);
    ctx.fillStyle = KITCHEN.wood;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = KITCHEN.woodDark;
    const step = Math.round((h / 844) * 46);
    for (let y = 0; y < h; y += step) ctx.fillRect(0, y, w, 3);
    const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.28)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    scene.textures.addCanvas(key, c);
  };
  floorBg('bg-play', 780, 1688);
  floorBg('bg-play-land', 1688, 780);

  // --- chest: treasure chest for the map (56x57 @4x). ---
  if (!scene.textures.exists('chest')) {
    const [c, ctx] = cv(224, 228);
    ctx.beginPath();
    ctx.roundRect(12, 70, 200, 140, 16);
    ctx.fillStyle = '#92400e';
    ctx.fill();
    outline(ctx, 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(112, 78, 88, Math.PI, 0);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    outline(ctx, 8);
    ctx.stroke();
    ctx.fillStyle = KITCHEN.gold;
    ctx.fillRect(100, 60, 24, 150);
    ctx.beginPath();
    ctx.arc(112, 150, 18, 0, Math.PI * 2);
    ctx.fillStyle = KITCHEN.goldDark;
    ctx.fill();
    outline(ctx, 5);
    ctx.stroke();
    scene.textures.addCanvas('chest', c);
  }
}
