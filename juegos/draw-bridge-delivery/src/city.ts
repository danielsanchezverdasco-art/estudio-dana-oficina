// city.ts — ALL art for Draw Bridge Delivery, generated procedurally at
// real resolution (2x) with the canvas 2D API. No bitmap art is shipped or
// upscaled, so nothing can look pixelated. Sunny city by a river: the two
// cliffs the player bridges across, colourful houses, a bright sky.
//
// Art bible (from the approved mockup, LEVEL 7 screen):
//   - Sky: bright blue gradient to a warm horizon; big friendly sun, soft clouds.
//   - Cliffs: warm rock with strata + a grassy top (the platforms the
//     scooter drives on). River below: deep blue with white wave lines.
//   - Houses: flat comic colours (coral / teal / yellow) with dark outlines,
//     shutter windows, tiled roofs — the city the pizza is delivered to.
//   - The drawn bridge: warm wood planks with a dark edge + a soft orange
//     glow while the player is tracing (GameScene draws the glow).
//   - The scooter + rider: chunky comic shapes, big wheels, pizza box on the
//     back rack (vehicle.ts). Goal: a house door with an awning + a
//     checkered flag — "delivery point".
//   - Palette: sky #5fb6f2 -> #a8dcf7 -> #fff2b8; grass #58b368; rock
//     #b07a4a; river #2f9be8; wood #c68b4e; sun #ffd93b.
//   - Every texture has a 3 px dark outline discipline (comic readability:
//     art-direction-and-readability) and flat fills — no gradients inside
//     small objects, so they read at any size.
import Phaser from 'phaser';

export const CITY = {
  skyTop: '#5fb6f2',
  skyMid: '#a8dcf7',
  horizon: '#fff2b8',
  sun: '#ffd93b',
  sunRay: '#ffcf3d',
  cloud: '#ffffff',
  grass: '#58b368',
  grassDark: '#3f9e4d',
  rock: '#b07a4a',
  rockDark: '#8a5a33',
  rockLight: '#c99a67',
  river: '#2f9be8',
  riverDeep: '#1f7fd0',
  wave: '#ffffff',
  wood: '#c68b4e',
  woodDark: '#9c6a35',
  woodEdge: '#7a4f24',
  ink: '#141414',
  coral: '#ff6b5e',
  teal: '#2ec4b6',
  yellow: '#ffc53d',
  roofRed: '#e2543e',
  roofTeal: '#2a9d8f',
  roofAmber: '#f4a261',
  cream: '#fff6d8',
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ctx = CanvasRenderingContext2D;

function tex(scene: Phaser.Scene, key: string, w: number, h: number, draw: (ctx: Ctx, w: number, h: number) => void): void {
  if (scene.textures.exists(key)) return;
  const c = scene.textures.createCanvas(key, w, h);
  if (!c) return;
  const ctx = c.getContext();
  draw(ctx, w, h);
  c.refresh();
}

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function outline(ctx: Ctx, width = 3): void {
  ctx.lineWidth = width;
  ctx.strokeStyle = CITY.ink;
  ctx.stroke();
}

function sky(ctx: Ctx, w: number, h: number): void {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, CITY.skyTop);
  g.addColorStop(0.55, CITY.skyMid);
  g.addColorStop(1, CITY.horizon);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function sun(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = CITY.sunRay;
  for (let i = 0; i < 12; i++) {
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(r + 6, -8);
    ctx.lineTo(r + 26, 0);
    ctx.lineTo(r + 6, 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = CITY.sun;
  ctx.fill();
  outline(ctx, 4);
  // Face: closed happy eyes + smile (PEGI 3, friendly).
  ctx.fillStyle = CITY.ink;
  ctx.beginPath();
  ctx.arc(x - r * 0.32, y - r * 0.1, r * 0.07, 0, Math.PI * 2);
  ctx.arc(x + r * 0.32, y - r * 0.1, r * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y + r * 0.18, r * 0.42, Math.PI * 0.15, Math.PI * 0.85);
  ctx.lineWidth = r * 0.09;
  ctx.strokeStyle = CITY.ink;
  ctx.stroke();
}

function cloud(ctx: Ctx, x: number, y: number, s: number): void {
  ctx.fillStyle = CITY.cloud;
  ctx.beginPath();
  ctx.arc(x, y, 26 * s, 0, Math.PI * 2);
  ctx.arc(x + 26 * s, y - 10 * s, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 52 * s, y, 24 * s, 0, Math.PI * 2);
  ctx.arc(x + 26 * s, y + 10 * s, 24 * s, 0, Math.PI * 2);
  ctx.fill();
}

function house(ctx: Ctx, x: number, y: number, w: number, h: number, body: string, roof: string): void {
  // Body.
  ctx.fillStyle = body;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = CITY.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  // Roof (triangle).
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + w / 2, y - h * 0.28);
  ctx.lineTo(x + w + 8, y);
  ctx.closePath();
  ctx.fillStyle = roof;
  ctx.fill();
  outline(ctx, 3);
  // Door.
  const dw = w * 0.26;
  const dh = h * 0.34;
  ctx.fillStyle = CITY.rockDark;
  rr(ctx, x + w / 2 - dw / 2, y + h - dh, dw, dh, 4);
  ctx.fill();
  outline(ctx, 2);
  ctx.fillStyle = CITY.yellow;
  ctx.beginPath();
  ctx.arc(x + w / 2 + dw / 2 - 5, y + h - dh / 2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // Windows (shutters).
  const ww = w * 0.2;
  const wh = h * 0.2;
  for (const wx of [x + w * 0.14, x + w * 0.66]) {
    ctx.fillStyle = '#dff3ff';
    rr(ctx, wx, y + h * 0.18, ww, wh, 3);
    ctx.fill();
    outline(ctx, 2);
    ctx.beginPath();
    ctx.moveTo(wx + ww / 2, y + h * 0.18);
    ctx.lineTo(wx + ww / 2, y + h * 0.18 + wh);
    ctx.moveTo(wx, y + h * 0.18 + wh / 2);
    ctx.lineTo(wx + ww, y + h * 0.18 + wh / 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = CITY.ink;
    ctx.stroke();
  }
}

function cliff(ctx: Ctx, x: number, y: number, w: number, h: number, flip: boolean): void {
  // Rock body.
  ctx.fillStyle = CITY.rock;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = CITY.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  // Strata lines.
  ctx.strokeStyle = CITY.rockDark;
  ctx.lineWidth = 3;
  const rnd = mulberry32(flip ? 7 : 3);
  for (let i = 1; i <= 3; i++) {
    const yy = y + (h / 4) * i;
    ctx.beginPath();
    ctx.moveTo(x + 6, yy);
    for (let xx = x + 6; xx <= x + w - 6; xx += 24) {
      ctx.lineTo(xx, yy + (rnd() - 0.5) * 10);
    }
    ctx.stroke();
  }
  // Cracks.
  ctx.beginPath();
  ctx.moveTo(x + w * (flip ? 0.7 : 0.3), y + 8);
  ctx.lineTo(x + w * (flip ? 0.6 : 0.4), y + h * 0.5);
  ctx.lineTo(x + w * (flip ? 0.75 : 0.25), y + h * 0.8);
  ctx.stroke();
  // Grassy top.
  ctx.fillStyle = CITY.grass;
  rr(ctx, x - 4, y - 10, w + 8, 22, 10);
  ctx.fill();
  ctx.strokeStyle = CITY.ink;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = CITY.grassDark;
  for (let xx = x + 8; xx < x + w - 8; xx += 18) {
    ctx.beginPath();
    ctx.arc(xx, y + 2, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function river(ctx: Ctx, x: number, y: number, w: number, h: number): void {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, CITY.river);
  g.addColorStop(1, CITY.riverDeep);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  // Wave lines.
  ctx.strokeStyle = CITY.wave;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const rnd = mulberry32(11);
  for (let row = 0; row < 3; row++) {
    const yy = y + 18 + row * ((h - 30) / 2);
    for (let xx = x + 14; xx < x + w - 30; xx += 64) {
      ctx.beginPath();
      ctx.arc(xx + rnd() * 10, yy, 12, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
    }
  }
  // Sparkles.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 10; i++) {
    const sx = x + 10 + rnd() * (w - 20);
    const sy = y + 8 + rnd() * (h - 16);
    ctx.beginPath();
    ctx.moveTo(sx, sy - 5);
    ctx.lineTo(sx + 2, sy - 2);
    ctx.lineTo(sx + 5, sy);
    ctx.lineTo(sx + 2, sy + 2);
    ctx.lineTo(sx, sy + 5);
    ctx.lineTo(sx - 2, sy + 2);
    ctx.lineTo(sx - 5, sy);
    ctx.lineTo(sx - 2, sy - 2);
    ctx.closePath();
    ctx.fill();
  }
}

function bird(ctx: Ctx, x: number, y: number, s: number): void {
  ctx.strokeStyle = CITY.ink;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 8 * s, y, 8 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 8 * s, y, 8 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

/** Full city scene (portrait 780x1688 or landscape 1688x780). */
function cityScene(ctx: Ctx, w: number, h: number, land: boolean): void {
  sky(ctx, w, h);
  sun(ctx, w * (land ? 0.86 : 0.78), h * 0.12, land ? 46 : 52);
  const rnd = mulberry32(land ? 21 : 5);
  for (let i = 0; i < (land ? 5 : 4); i++) {
    cloud(ctx, rnd() * w * 0.8 + w * 0.05, h * (0.08 + rnd() * 0.3), 0.8 + rnd() * 0.7);
  }
  bird(ctx, w * 0.3, h * 0.16, 1);
  bird(ctx, w * 0.42, h * 0.21, 0.8);
  // Distant skyline (small houses on the horizon, behind the cliffs).
  const horizonY = h * 0.62;
  const variants: [string, string][] = [
    [CITY.coral, CITY.roofRed],
    [CITY.teal, CITY.roofTeal],
    [CITY.yellow, CITY.roofAmber],
  ];
  let hx = w * 0.06;
  let vi = 0;
  while (hx < w * 0.94) {
    const hw = 60 + rnd() * 40;
    const hh = 70 + rnd() * 50;
    const [body, roof] = variants[vi % 3];
    house(ctx, hx, horizonY - hh, hw, hh, body, roof);
    hx += hw + 14 + rnd() * 20;
    vi++;
  }
  // No cliffs here: the GameScene draws the real platforms (their
  // positions change per level), so a painted cliff would never line up
  // with the physics. Only the river band at the very bottom.
  river(ctx, 0, h - 54, w, 54);
}

/** Menu scene: the rider on his scooter by the river, a half-drawn glowing bridge. */
function menuScene(ctx: Ctx, w: number, h: number, land: boolean): void {
  cityScene(ctx, w, h, land);
  // Half-drawn glowing bridge (orange dashed line across the river).
  const y0 = h * 0.66;
  const x0 = w * 0.14;
  const x1 = w * 0.62;
  ctx.save();
  ctx.strokeStyle = '#ff9f1c';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.shadowColor = '#ff9f1c';
  ctx.shadowBlur = 24;
  ctx.setLineDash([26, 18]);
  ctx.beginPath();
  ctx.moveTo(x0, y0 - 6);
  ctx.quadraticCurveTo(w * 0.38, y0 + 34, x1, y0 - 10);
  ctx.stroke();
  ctx.restore();
  // Pencil hand mark at the end of the line (a small hand-drawn star).
  ctx.strokeStyle = CITY.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x1 - 12, y0 - 22);
  ctx.lineTo(x1 + 12, y0 + 2);
  ctx.moveTo(x1 + 12, y0 - 22);
  ctx.lineTo(x1 - 12, y0 + 2);
  ctx.stroke();
  // Pizza floating above the bridge (the cargo).
  ctx.save();
  ctx.translate(w * 0.5, y0 - 90);
  ctx.rotate(-0.2);
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#f7b731';
  ctx.fill();
  outline(ctx, 4);
  ctx.fillStyle = '#d94f3d';
  for (const [px, py] of [[-12, -8], [10, -12], [0, 8], [12, 10], [-10, 12]] as const) {
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function generateCityTextures(scene: Phaser.Scene): void {
  // Backgrounds (2x of the 390x844 design space).
  tex(scene, 'bg-play', 780, 1688, (ctx, w, h) => cityScene(ctx, w, h, false));
  tex(scene, 'bg-play-land', 1688, 780, (ctx, w, h) => cityScene(ctx, w, h, true));
  tex(scene, 'bg-menu', 780, 1688, (ctx, w, h) => menuScene(ctx, w, h, false));
  tex(scene, 'bg-menu-land', 1688, 780, (ctx, w, h) => menuScene(ctx, w, h, true));
  tex(scene, 'bg-map', 780, 1688, (ctx, w, h) => {
    sky(ctx, w, h);
    sun(ctx, w * 0.82, h * 0.1, 48);
    cloud(ctx, w * 0.2, h * 0.2, 1.2);
    cloud(ctx, w * 0.6, h * 0.32, 1);
    river(ctx, 0, h - 120, w, 120);
  });
  for (const key of ['bg-shop', 'bg-result', 'bg-howto'] as const) {
    tex(scene, key, 780, 1688, (ctx, w, h) => cityScene(ctx, w, h, false));
  }

  // Sun / cloud (standalone, for HUD + decorations).
  tex(scene, 'sun', 240, 240, (ctx) => sun(ctx, 120, 120, 72));
  tex(scene, 'cloud', 260, 110, (ctx) => cloud(ctx, 40, 55, 1.4));

  // Houses (3 variants, for level dressing).
  tex(scene, 'house-a', 280, 400, (ctx) => house(ctx, 20, 110, 240, 270, CITY.coral, CITY.roofRed));
  tex(scene, 'house-b', 280, 420, (ctx) => house(ctx, 20, 120, 240, 280, CITY.teal, CITY.roofTeal));
  tex(scene, 'house-c', 280, 380, (ctx) => house(ctx, 20, 100, 240, 260, CITY.yellow, CITY.roofAmber));

  // Cliff + river strips (platforms / water in the GameScene).
  tex(scene, 'cliff', 400, 320, (ctx, w, h) => cliff(ctx, 0, 20, w, h - 20, false));
  tex(scene, 'river', 780, 240, (ctx, w, h) => river(ctx, 0, 0, w, h));

  // Wood plank (drawn bridge segments use the flat colour + this edge).
  tex(scene, 'wood', 240, 48, (ctx, w, h) => {
    ctx.fillStyle = CITY.wood;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = CITY.woodDark;
    for (let x = 0; x < w; x += 48) ctx.fillRect(x, 0, 4, h);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, 4, w, 6);
    ctx.strokeStyle = CITY.woodEdge;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, w, h);
  });

  // Pizza (the cargo — also the tappable menu toy).
  tex(scene, 'pizza', 192, 192, (ctx) => {
    ctx.beginPath();
    ctx.arc(96, 96, 84, 0, Math.PI * 2);
    ctx.fillStyle = '#f7b731';
    ctx.fill();
    outline(ctx, 6);
    ctx.beginPath();
    ctx.arc(96, 96, 62, 0, Math.PI * 2);
    ctx.fillStyle = '#ffdf8e';
    ctx.fill();
    ctx.fillStyle = '#d94f3d';
    for (const [px, py] of [[-30, -24], [28, -30], [0, 4], [34, 26], [-28, 30], [-4, -38]] as const) {
      ctx.beginPath();
      ctx.arc(96 + px, 96 + py, 13, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#58b368';
    for (const [px, py] of [[-14, 14], [18, -6]] as const) {
      ctx.beginPath();
      ctx.arc(96 + px, 96 + py, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Checkered flag (delivery point).
  tex(scene, 'flag', 128, 192, (ctx) => {
    ctx.fillStyle = CITY.rockDark;
    ctx.fillRect(14, 8, 10, 176);
    ctx.strokeStyle = CITY.ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 8, 10, 176);
    const s = 17;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#141414' : '#ffffff';
        ctx.fillRect(24 + c * s, 10 + r * s, s, s);
      }
    }
    ctx.strokeStyle = CITY.ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 10, 4 * s, 3 * s);
  });

  // Trampoline pad.
  tex(scene, 'trampoline', 240, 80, (ctx, w, h) => {
    ctx.fillStyle = '#e2543e';
    rr(ctx, 4, 10, w - 8, h - 20, 16);
    ctx.fill();
    outline(ctx, 4);
    ctx.fillStyle = '#ffffff';
    for (let x = 20; x < w - 20; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 14);
      ctx.lineTo(x + 20, 14);
      ctx.lineTo(x + 10, h - 14);
      ctx.lineTo(x - 10, h - 14);
      ctx.closePath();
      ctx.fill();
    }
  });

  // Fan (wind source).
  tex(scene, 'fan', 240, 240, (ctx) => {
    ctx.beginPath();
    ctx.arc(120, 120, 104, 0, Math.PI * 2);
    ctx.fillStyle = '#dff3ff';
    ctx.fill();
    outline(ctx, 5);
    ctx.fillStyle = CITY.teal;
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(120, 120);
      ctx.rotate((i * Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.ellipse(0, -52, 26, 52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(120, 120, 26, 0, Math.PI * 2);
    ctx.fillStyle = CITY.ink;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(120, 120, 12, 0, Math.PI * 2);
    ctx.fillStyle = CITY.yellow;
    ctx.fill();
  });

  // Wind streaks (translucent, tiled over a wind zone).
  tex(scene, 'wind', 240, 80, (ctx, w, h) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    for (const [y, len] of [[18, 150], [40, 200], [62, 130]] as const) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(20 + len, y);
      ctx.stroke();
    }
  });

  // Coin.
  tex(scene, 'coin', 128, 144, (ctx) => {
    ctx.beginPath();
    ctx.arc(64, 72, 56, 0, Math.PI * 2);
    ctx.fillStyle = '#ffc53d';
    ctx.fill();
    outline(ctx, 5);
    ctx.beginPath();
    ctx.arc(64, 72, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#ffdf8e';
    ctx.fill();
    ctx.fillStyle = '#e8a100';
    ctx.beginPath();
    ctx.moveTo(64, 44);
    ctx.lineTo(72, 62);
    ctx.lineTo(90, 64);
    ctx.lineTo(76, 76);
    ctx.lineTo(80, 94);
    ctx.lineTo(64, 84);
    ctx.lineTo(48, 94);
    ctx.lineTo(52, 76);
    ctx.lineTo(38, 64);
    ctx.lineTo(56, 62);
    ctx.closePath();
    ctx.fill();
  });

  // Treasure chest.
  tex(scene, 'chest', 192, 192, (ctx) => {
    ctx.fillStyle = '#8a5a33';
    rr(ctx, 26, 76, 140, 96, 12);
    ctx.fill();
    outline(ctx, 5);
    ctx.fillStyle = '#a06a3e';
    ctx.beginPath();
    ctx.arc(96, 76, 70, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = CITY.ink;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#ffc53d';
    ctx.fillRect(88, 66, 16, 96);
    ctx.strokeRect(88, 66, 16, 96);
    ctx.fillStyle = '#e8a100';
    rr(ctx, 82, 96, 28, 26, 6);
    ctx.fill();
    ctx.strokeRect(82, 96, 28, 26);
  });

  // Rider head with helmet (fail screen + shop previews).
  const riderHead = (ctx: Ctx, cx: number, cy: number, s: number) => {
    // Helmet.
    ctx.beginPath();
    ctx.arc(cx, cy - 18 * s, 52 * s, Math.PI, 0);
    ctx.fillStyle = '#ff6b5e';
    ctx.fill();
    outline(ctx, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 52 * s, cy - 22 * s, 104 * s, 10 * s);
    // Face.
    ctx.beginPath();
    ctx.arc(cx, cy + 6 * s, 40 * s, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcf9e';
    ctx.fill();
    outline(ctx, 4);
    // Smile + eyes.
    ctx.fillStyle = CITY.ink;
    ctx.beginPath();
    ctx.arc(cx - 15 * s, cy, 4 * s, 0, Math.PI * 2);
    ctx.arc(cx + 15 * s, cy, 4 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + 12 * s, 16 * s, Math.PI * 0.15, Math.PI * 0.85);
    ctx.lineWidth = 4 * s;
    ctx.strokeStyle = CITY.ink;
    ctx.stroke();
  };
  tex(scene, 'rider-head', 240, 380, (ctx) => riderHead(ctx, 120, 150, 1.6));
  tex(scene, 'rider-head-menu', 584, 1024, (ctx) => riderHead(ctx, 292, 380, 4.4));

  // Hint dot.
  tex(scene, 'dot', 48, 48, (ctx) => {
    ctx.beginPath();
    ctx.arc(24, 24, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = CITY.ink;
    ctx.lineWidth = 4;
    ctx.stroke();
  });
}
