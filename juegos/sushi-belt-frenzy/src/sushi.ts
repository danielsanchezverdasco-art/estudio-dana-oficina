// Sushi art — ALL procedural, drawn on canvas at 4x display size and
// downscaled by Phaser (the anti-pixelation rule from Ramp Physics r2).
// Style (biblia-arte-sushi.md): polished 3D-toy video-game art — volume,
// thick black outlines, saturated colours, warm light, real soft shadows,
// wood/fabric/paper textures. Never flat, never clip-art.
// Every colour has a gameplay role; colour is NEVER alone: each cat and
// each plate also carries a symbol (● orange / ▲ grey / ◆ black-white),
// and wasabi carries flames + "!".
import Phaser from 'phaser';

export const SUSHI = {
  paper: 0xfff3d6,
  paperCss: '#fff3d6',
  woodLight: 0xe8b06a,
  woodLightCss: '#e8b06a',
  woodDark: 0x8a5a2b,
  woodDarkCss: '#8a5a2b',
  belt: 0x3d2b1f,
  beltCss: '#3d2b1f',
  orange: 0xf97316,
  orangeCss: '#f97316',
  grey: 0x94a3b8,
  greyCss: '#94a3b8',
  bw: 0x1f2937,
  bwCss: '#1f2937',
  salmon: 0xff8a65,
  salmonCss: '#ff8a65',
  tuna: 0xe23b2e,
  tunaCss: '#e23b2e',
  wasabi: 0x22c55e,
  wasabiCss: '#22c55e',
  gold: 0xfacc15,
  goldCss: '#facc15',
  leaf: 0x22c55e,
  leafCss: '#22c55e',
  coral: 0xe23b2e,
  coralCss: '#e23b2e',
  cream: 0xfff8e7,
  creamCss: '#fff8e7',
  ink: 0x141414,
  inkCss: '#141414',
  octopus: 0x7c3aed,
  octopusCss: '#7c3aed',
  white: 0xffffff,
  whiteCss: '#ffffff',
};

export type CatColorId = 'orange' | 'grey' | 'bw';
export const CAT_COLORS: Record<CatColorId, { main: string; light: string; dark: string; symbol: '●' | '▲' | '◆' }> = {
  orange: { main: '#f97316', light: '#fdba74', dark: '#c2410c', symbol: '●' },
  grey: { main: '#94a3b8', light: '#cbd5e1', dark: '#475569', symbol: '▲' },
  bw: { main: '#f8fafc', light: '#ffffff', dark: '#1f2937', symbol: '◆' },
};

const S = 4; // supersample: canvas pixels per display pixel
const INK = '#141414';

function mkCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = Math.round(w * S);
  c.height = Math.round(h * S);
  const ctx = c.getContext('2d')!;
  ctx.scale(S, S);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  return [c, ctx];
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number): void {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

/** Fill + thick black comic outline. */
function shape(ctx: CanvasRenderingContext2D, fill: string, lw = 4): void {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = INK;
  ctx.stroke();
}

/** Soft real shadow under an object. */
function shadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ellipse(ctx, x, y, rx, ry);
  ctx.fill();
  ctx.restore();
}

export type CatMood = 'idle' | 'happy' | 'angry' | 'cough';

/** A sitting cat, front view, ~110x130 display. Drawn once per colour x mood. */
function drawCat(ctx: CanvasRenderingContext2D, color: CatColorId, mood: CatMood): void {
  const C = CAT_COLORS[color];
  const isBw = color === 'bw';
  // Tail (behind the body, right side).
  ctx.save();
  ctx.translate(88, 96);
  ctx.rotate(0.5);
  rr(ctx, -8, -26, 16, 52, 8);
  shape(ctx, isBw ? '#1f2937' : C.main, 4);
  ctx.restore();
  shadow(ctx, 55, 126, 46, 8);
  // Body: big rounded blob with a lighter belly.
  ellipse(ctx, 55, 92, 42, 38);
  shape(ctx, C.main, 5);
  ellipse(ctx, 55, 100, 28, 26);
  ctx.fillStyle = isBw ? '#ffffff' : C.light;
  ctx.fill();
  // Paws.
  ellipse(ctx, 32, 122, 13, 8);
  shape(ctx, isBw ? '#f8fafc' : C.light, 3);
  ellipse(ctx, 78, 122, 13, 8);
  shape(ctx, isBw ? '#f8fafc' : C.light, 3);
  // Black patches for the black-white cat (eye patch + ear).
  if (isBw) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(38, 52, 20, 16, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    ctx.restore();
  }
  // Head.
  circle(ctx, 55, 52, 34);
  shape(ctx, C.main, 5);
  // Ears.
  ctx.save();
  ctx.translate(30, 26);
  ctx.rotate(-0.35);
  ctx.beginPath();
  ctx.moveTo(-12, 10);
  ctx.lineTo(0, -14);
  ctx.lineTo(12, 10);
  ctx.closePath();
  shape(ctx, C.main, 4);
  ctx.beginPath();
  ctx.moveTo(-6, 6);
  ctx.lineTo(0, -6);
  ctx.lineTo(6, 6);
  ctx.closePath();
  ctx.fillStyle = '#fda4af';
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(80, 26);
  ctx.rotate(0.35);
  ctx.beginPath();
  ctx.moveTo(-12, 10);
  ctx.lineTo(0, -14);
  ctx.lineTo(12, 10);
  ctx.closePath();
  shape(ctx, isBw ? '#1f2937' : C.main, 4);
  ctx.beginPath();
  ctx.moveTo(-6, 6);
  ctx.lineTo(0, -6);
  ctx.lineTo(6, 6);
  ctx.closePath();
  ctx.fillStyle = '#fda4af';
  ctx.fill();
  ctx.restore();
  // Eyes.
  if (mood === 'cough') {
    // Squeezed shut: two "> <" marks.
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.moveTo(36, 46);
    ctx.lineTo(46, 51);
    ctx.lineTo(36, 56);
    ctx.moveTo(74, 46);
    ctx.lineTo(64, 51);
    ctx.lineTo(74, 56);
    ctx.stroke();
  } else if (mood === 'angry') {
    // Half-lidded + angled brows.
    ctx.fillStyle = '#ffffff';
    ellipse(ctx, 42, 50, 9, 10);
    ctx.fill();
    ellipse(ctx, 68, 50, 9, 10);
    ctx.fill();
    ctx.fillStyle = INK;
    circle(ctx, 43, 52, 4);
    ctx.fill();
    circle(ctx, 67, 52, 4);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.moveTo(32, 38);
    ctx.lineTo(50, 44);
    ctx.moveTo(78, 38);
    ctx.lineTo(60, 44);
    ctx.stroke();
  } else {
    // Big happy eyes with shine.
    ctx.fillStyle = '#ffffff';
    ellipse(ctx, 42, 50, 10, 12);
    ctx.fill();
    ellipse(ctx, 68, 50, 10, 12);
    ctx.fill();
    ctx.fillStyle = INK;
    circle(ctx, 43, 51, 5);
    ctx.fill();
    circle(ctx, 67, 51, 5);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    circle(ctx, 41, 48, 2);
    ctx.fill();
    circle(ctx, 65, 48, 2);
    ctx.fill();
  }
  // Nose + mouth.
  ctx.beginPath();
  ctx.moveTo(50, 62);
  ctx.lineTo(60, 62);
  ctx.lineTo(55, 67);
  ctx.closePath();
  ctx.fillStyle = '#f472b6';
  ctx.fill();
  if (mood === 'happy') {
    // Open happy mouth + tongue.
    ellipse(ctx, 55, 74, 11, 9);
    shape(ctx, '#7f1d1d', 3);
    ellipse(ctx, 55, 77, 7, 5);
    ctx.fillStyle = '#f472b6';
    ctx.fill();
  } else if (mood === 'idle') {
    // Open mouth asking for food (the menu / waiting pose).
    ellipse(ctx, 55, 73, 8, 10);
    shape(ctx, '#7f1d1d', 3);
  } else if (mood === 'angry') {
    // Zigzag grumpy mouth.
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.moveTo(45, 74);
    ctx.lineTo(50, 70);
    ctx.lineTo(55, 74);
    ctx.lineTo(60, 70);
    ctx.lineTo(65, 74);
    ctx.stroke();
  } else {
    // Cough: small "o" mouth + green puffs.
    circle(ctx, 55, 74, 5);
    shape(ctx, '#7f1d1d', 3);
    ctx.fillStyle = 'rgba(34,197,94,0.85)';
    circle(ctx, 78, 66, 7);
    ctx.fill();
    circle(ctx, 84, 74, 5);
    ctx.fill();
    circle(ctx, 76, 80, 4);
    ctx.fill();
  }
  // Whiskers.
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(20,20,20,0.55)';
  ctx.beginPath();
  ctx.moveTo(22, 62);
  ctx.lineTo(38, 64);
  ctx.moveTo(22, 70);
  ctx.lineTo(38, 68);
  ctx.moveTo(88, 62);
  ctx.lineTo(72, 64);
  ctx.moveTo(88, 70);
  ctx.lineTo(72, 68);
  ctx.stroke();
  // Collar with the colour symbol (colour is never alone).
  ctx.save();
  ctx.beginPath();
  ctx.arc(55, 86, 30, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.lineWidth = 7;
  ctx.strokeStyle = color === 'orange' ? '#f97316' : color === 'grey' ? '#64748b' : '#1f2937';
  ctx.stroke();
  ctx.restore();
  circle(ctx, 55, 112, 9);
  shape(ctx, '#facc15', 3);
  ctx.fillStyle = INK;
  ctx.font = 'bold 11px Nunito, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(C.symbol, 55, 113);
}

/** The chef cat: white cat with a chef hat + red neckerchief, half body
 * (behind the counter). `pointing` raises one arm to warn. */
function drawChef(ctx: CanvasRenderingContext2D, pointing: boolean): void {
  shadow(ctx, 75, 118, 58, 9);
  // Body.
  ellipse(ctx, 75, 92, 52, 34);
  shape(ctx, '#f8fafc', 5);
  // Red neckerchief.
  ctx.beginPath();
  ctx.moveTo(48, 72);
  ctx.lineTo(102, 72);
  ctx.lineTo(75, 92);
  ctx.closePath();
  shape(ctx, '#e23b2e', 4);
  // Head.
  circle(ctx, 75, 46, 32);
  shape(ctx, '#f8fafc', 5);
  // Ears (one pokes through the hat).
  ctx.save();
  ctx.translate(50, 22);
  ctx.rotate(-0.3);
  ctx.beginPath();
  ctx.moveTo(-11, 9);
  ctx.lineTo(0, -13);
  ctx.lineTo(11, 9);
  ctx.closePath();
  shape(ctx, '#f8fafc', 4);
  ctx.restore();
  // Chef hat: puffy white cloud + band.
  ctx.fillStyle = '#ffffff';
  circle(ctx, 55, 18, 16);
  ctx.fill();
  circle(ctx, 75, 12, 19);
  ctx.fill();
  circle(ctx, 95, 18, 16);
  ctx.fill();
  rr(ctx, 48, 18, 54, 16, 8);
  shape(ctx, '#ffffff', 4);
  // Eyes: closed happy arcs + smile.
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.arc(62, 46, 7, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(88, 46, 7, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(70, 60);
  ctx.lineTo(80, 60);
  ctx.lineTo(75, 64);
  ctx.closePath();
  ctx.fillStyle = '#f472b6';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(75, 62, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // Arm: idle (paw on the counter) or pointing (raised, warning).
  if (pointing) {
    ctx.save();
    ctx.translate(118, 84);
    ctx.rotate(-0.9);
    rr(ctx, -8, -30, 16, 34, 8);
    shape(ctx, '#f8fafc', 4);
    circle(ctx, 0, -32, 9);
    shape(ctx, '#f8fafc', 4);
    ctx.restore();
    // "!" warning bubble handled by the scene (text), not the texture.
  } else {
    ellipse(ctx, 112, 108, 14, 9);
    shape(ctx, '#f8fafc', 4);
  }
  // Whiskers.
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(20,20,20,0.5)';
  ctx.beginPath();
  ctx.moveTo(44, 56);
  ctx.lineTo(58, 58);
  ctx.moveTo(106, 56);
  ctx.lineTo(92, 58);
  ctx.stroke();
}

// ---------- plates ----------

function plateBase(ctx: CanvasRenderingContext2D, rim: string, symbol: string): void {
  shadow(ctx, 28, 50, 26, 5);
  // Plate: white dish + coloured rim + symbol on the rim.
  circle(ctx, 28, 28, 26);
  shape(ctx, '#ffffff', 5);
  ctx.lineWidth = 5;
  ctx.strokeStyle = rim;
  circle(ctx, 28, 28, 21);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = 'bold 10px Nunito, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 28, 46);
  // Inner shadow ring (the dish depth).
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  circle(ctx, 28, 28, 16);
  ctx.stroke();
}

/** Nigiri on top of the plate: rice + fish with volume + shine. */
function nigiri(ctx: CanvasRenderingContext2D, fish: string, stripes: string, kind: 'salmon' | 'tuna' | 'shrimp' | 'egg'): void {
  // Rice.
  rr(ctx, 16, 22, 24, 13, 6);
  shape(ctx, '#fffef5', 3);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(19 + i * 7, 24, 2, 9);
  }
  // Fish slice, draped over the rice.
  if (kind === 'shrimp') {
    ctx.beginPath();
    ctx.moveTo(14, 24);
    ctx.quadraticCurveTo(28, 8, 42, 24);
    ctx.quadraticCurveTo(28, 18, 14, 24);
    ctx.closePath();
    shape(ctx, fish, 3);
    ctx.lineWidth = 2;
    ctx.strokeStyle = stripes;
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.quadraticCurveTo(28, 13, 36, 20);
    ctx.stroke();
  } else {
    rr(ctx, 14, 14, 28, 11, 5);
    shape(ctx, fish, 3);
    // Fat stripes (salmon/tuna) or yolk line (egg).
    ctx.lineWidth = 2;
    ctx.strokeStyle = stripes;
    ctx.beginPath();
    ctx.moveTo(19, 16);
    ctx.lineTo(24, 23);
    ctx.moveTo(28, 16);
    ctx.lineTo(33, 23);
    ctx.moveTo(37, 16);
    ctx.lineTo(42, 23);
    ctx.stroke();
  }
  // Shine.
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ellipse(ctx, 24, 16, 7, 2.5);
  ctx.fill();
}

function drawPlate(ctx: CanvasRenderingContext2D, kind: 'salmon' | 'tuna' | 'shrimp' | 'egg', color: CatColorId): void {
  const C = CAT_COLORS[color];
  plateBase(ctx, C.main, C.symbol);
  const fish = kind === 'salmon' ? '#ff8a65' : kind === 'tuna' ? '#e23b2e' : kind === 'shrimp' ? '#fda4af' : '#facc15';
  const stripes = kind === 'salmon' ? '#ffccbc' : kind === 'tuna' ? '#ff8a80' : kind === 'shrimp' ? '#f472b6' : '#f59e0b';
  nigiri(ctx, fish, stripes, kind);
}

function drawWasabiPlate(ctx: CanvasRenderingContext2D): void {
  plateBase(ctx, '#22c55e', '!');
  // Wasabi mound: bumpy green hill with flames.
  ctx.fillStyle = '#16a34a';
  circle(ctx, 22, 26, 9);
  ctx.fill();
  circle(ctx, 30, 23, 10);
  ctx.fill();
  circle(ctx, 34, 28, 7);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.arc(28, 26, 12, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = '#4ade80';
  circle(ctx, 25, 21, 3);
  ctx.fill();
  circle(ctx, 32, 24, 2.5);
  ctx.fill();
  // Flame marks above the mound.
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(22, 12);
  ctx.quadraticCurveTo(18, 6, 22, 2);
  ctx.quadraticCurveTo(26, 6, 22, 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(34, 12);
  ctx.quadraticCurveTo(30, 7, 34, 3);
  ctx.quadraticCurveTo(38, 7, 34, 12);
  ctx.closePath();
  ctx.fill();
}

function drawGoldenPlate(ctx: CanvasRenderingContext2D, color: CatColorId): void {
  const C = CAT_COLORS[color];
  shadow(ctx, 28, 52, 28, 5);
  circle(ctx, 28, 28, 27);
  shape(ctx, '#facc15', 5);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#b45309';
  circle(ctx, 28, 28, 22);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Nunito, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 28, 28);
  ctx.fillStyle = INK;
  ctx.font = 'bold 9px Nunito, Arial, sans-serif';
  ctx.fillText(C.symbol, 28, 47);
  // Sparkles.
  ctx.fillStyle = '#ffffff';
  circle(ctx, 12, 12, 2.5);
  ctx.fill();
  circle(ctx, 44, 10, 2);
  ctx.fill();
}

// ---------- mats, belt, props ----------

function drawMat(ctx: CanvasRenderingContext2D, color: CatColorId): void {
  const C = CAT_COLORS[color];
  shadow(ctx, 60, 36, 56, 6);
  rr(ctx, 4, 6, 112, 28, 14);
  shape(ctx, C.light, 4);
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.main;
  rr(ctx, 10, 11, 100, 18, 9);
  ctx.stroke();
  ctx.fillStyle = C.dark;
  ctx.font = 'bold 16px Nunito, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(C.symbol, 60, 21);
}

function drawBeltStrip(ctx: CanvasRenderingContext2D): void {
  // Wood frame top + bottom, dark felt middle with slats + chevrons.
  rr(ctx, 0, 0, 390, 110, 10);
  shape(ctx, '#8a5a2b', 5);
  rr(ctx, 6, 14, 378, 82, 8);
  ctx.fillStyle = '#3d2b1f';
  ctx.fill();
  // Wood grain.
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(6, 7);
  ctx.lineTo(384, 7);
  ctx.moveTo(6, 103);
  ctx.lineTo(384, 103);
  ctx.stroke();
  // Felt slats.
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 3;
  for (let x = 26; x < 384; x += 26) {
    ctx.beginPath();
    ctx.moveTo(x, 18);
    ctx.lineTo(x, 92);
    ctx.stroke();
  }
  // Direction chevrons (the belt moves right).
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (let x = 30; x < 380; x += 52) {
    ctx.beginPath();
    ctx.moveTo(x, 44);
    ctx.lineTo(x + 12, 55);
    ctx.lineTo(x, 66);
    ctx.lineTo(x + 6, 55);
    ctx.closePath();
    ctx.fill();
  }
}

function drawCoin(ctx: CanvasRenderingContext2D): void {
  shadow(ctx, 15, 32, 13, 3);
  circle(ctx, 15, 17, 14);
  shape(ctx, '#facc15', 4);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#b45309';
  circle(ctx, 15, 17, 10);
  ctx.stroke();
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 15px Nunito, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 15, 18);
}

function drawChest(ctx: CanvasRenderingContext2D): void {
  shadow(ctx, 28, 54, 24, 4);
  rr(ctx, 4, 14, 48, 38, 6);
  shape(ctx, '#8a5a2b', 4);
  rr(ctx, 4, 14, 48, 14, 6);
  shape(ctx, '#a9713a', 4);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(24, 14, 8, 38);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(24, 14, 8, 4);
  rr(ctx, 21, 30, 14, 12, 3);
  shape(ctx, '#facc15', 3);
  circle(ctx, 28, 36, 2.5);
  ctx.fillStyle = INK;
  ctx.fill();
}

function drawDot(ctx: CanvasRenderingContext2D): void {
  circle(ctx, 4, 4, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

function drawOctopus(ctx: CanvasRenderingContext2D): void {
  // Dana Games mascot cameo: a tiny purple octopus.
  circle(ctx, 15, 12, 10);
  shape(ctx, '#7c3aed', 3);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#7c3aed';
  for (let i = 0; i < 4; i++) {
    const x = 8 + i * 5;
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.quadraticCurveTo(x + 2, 26, x - 1, 29);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffffff';
  circle(ctx, 11, 11, 3);
  ctx.fill();
  circle(ctx, 19, 11, 3);
  ctx.fill();
  ctx.fillStyle = INK;
  circle(ctx, 11, 11, 1.5);
  ctx.fill();
  circle(ctx, 19, 11, 1.5);
  ctx.fill();
}

// ---------- backgrounds ----------

function drawRestaurant(ctx: CanvasRenderingContext2D, w: number, h: number, landscape: boolean): void {
  // Warm cream wall.
  ctx.fillStyle = '#fff3d6';
  ctx.fillRect(0, 0, w, h);
  // Subtle paper texture: faint horizontal bands.
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  for (let y = 40; y < h; y += 80) ctx.fillRect(0, y, w, 26);
  // Noren curtain (top centre): dark blue with a white circle.
  const nw = landscape ? 220 : 170;
  const nx = (w - nw) / 2;
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(nx, 0, nw, 64);
  ctx.fillStyle = '#ffffff';
  circle(ctx, w / 2, 32, 18);
  ctx.fill();
  ctx.fillStyle = '#1e3a5f';
  ctx.font = 'bold 20px Nunito, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('鮨', w / 2, 33);
  // Red paper lantern (left).
  const lx = landscape ? 60 : 46;
  const ly = landscape ? 96 : 108;
  ctx.fillStyle = '#141414';
  ctx.fillRect(lx - 16, ly - 34, 32, 8);
  ctx.fillRect(lx - 16, ly + 26, 32, 8);
  ctx.fillStyle = '#e23b2e';
  ellipse(ctx, lx, ly, 26, 30);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(lx, ly, 12 + Math.abs(i) * 8, 30, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Window with cherry blossom (right).
  const wx = landscape ? w - 190 : w - 116;
  const wy = landscape ? 70 : 96;
  const ww = landscape ? 150 : 96;
  const wh = landscape ? 120 : 96;
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(wx - 6, wy - 6, ww + 12, wh + 12);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(wx, wy, ww, wh);
  // Cherry branch + blossoms.
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(wx, wy + wh - 10);
  ctx.quadraticCurveTo(wx + ww / 2, wy + 20, wx + ww - 8, wy + 30);
  ctx.stroke();
  ctx.fillStyle = '#f9a8d4';
  for (const [bx, by] of [[wx + 20, wy + 40], [wx + 50, wy + 26], [wx + 80, wy + 44], [wx + 62, wy + 62]] as const) {
    circle(ctx, bx, by, 7);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    circle(ctx, bx, by, 3);
    ctx.fill();
    ctx.fillStyle = '#f9a8d4';
  }
  // Wood floor (bottom).
  const floorY = landscape ? h - 64 : h - 104;
  ctx.fillStyle = '#c98a4b';
  ctx.fillRect(0, floorY, w, h - floorY);
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 2;
  for (let y = floorY + 26; y < h; y += 26) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // Purple octopus cameo: peeking from behind the lantern.
  ctx.save();
  ctx.translate(lx + 30, ly - 28);
  ctx.scale(0.8, 0.8);
  drawOctopus(ctx);
  ctx.restore();
}

// ---------- generator ----------

export function generateSushiTextures(scene: Phaser.Scene): void {
  const add = (key: string, c: HTMLCanvasElement): void => {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, c);
  };
  const fromDraw = (key: string, w: number, h: number, fn: (ctx: CanvasRenderingContext2D) => void): void => {
    const [c, ctx] = mkCanvas(w, h);
    fn(ctx);
    add(key, c);
  };

  // Cats: 3 colours x 4 moods.
  for (const color of ['orange', 'grey', 'bw'] as CatColorId[]) {
    for (const mood of ['idle', 'happy', 'angry', 'cough'] as CatMood[]) {
      fromDraw(`cat-${color}-${mood}`, 110, 130, (ctx) => drawCat(ctx, color, mood));
    }
    // Short alias: the idle texture is also the base key.
    fromDraw(`cat-${color}`, 110, 130, (ctx) => drawCat(ctx, color, 'idle'));
  }
  // Chef (idle + pointing).
  fromDraw('chef-cat', 150, 130, (ctx) => drawChef(ctx, false));
  fromDraw('chef-cat-point', 150, 130, (ctx) => drawChef(ctx, true));
  // Mats.
  for (const color of ['orange', 'grey', 'bw'] as CatColorId[]) {
    fromDraw(`mat-${color}`, 120, 40, (ctx) => drawMat(ctx, color));
  }
  // Plates.
  const plateKinds = ['salmon', 'tuna', 'shrimp', 'egg'] as const;
  const plateColors = ['orange', 'grey', 'bw'] as const;
  for (const kind of plateKinds) {
    for (const color of plateColors) {
      fromDraw(`plate-${kind}-${color}`, 56, 56, (ctx) => drawPlate(ctx, kind, color));
    }
  }
  fromDraw('plate-wasabi', 56, 56, (ctx) => drawWasabiPlate(ctx));
  for (const color of ['orange', 'grey', 'bw'] as CatColorId[]) {
    fromDraw(`plate-golden-${color}`, 56, 56, (ctx) => drawGoldenPlate(ctx, color));
  }
  // Belt + props.
  fromDraw('belt-strip', 390, 110, (ctx) => drawBeltStrip(ctx));
  fromDraw('coin', 30, 34, (ctx) => drawCoin(ctx));
  fromDraw('chest', 56, 57, (ctx) => drawChest(ctx));
  fromDraw('dot', 8, 8, (ctx) => drawDot(ctx));
  fromDraw('octopus', 30, 30, (ctx) => drawOctopus(ctx));
  // Backgrounds.
  fromDraw('bg-menu', 390, 844, (ctx) => drawRestaurant(ctx, 390, 844, false));
  fromDraw('bg-play', 390, 844, (ctx) => drawRestaurant(ctx, 390, 844, false));
  fromDraw('bg-play-land', 844, 390, (ctx) => drawRestaurant(ctx, 844, 390, true));
}
