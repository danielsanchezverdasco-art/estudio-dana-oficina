// Art factory: every texture is generated in code (Graphics → generateTexture).
// No binary art assets except the official hand (public/assets/img/hand.png)
// and the fonts — so the zip stays small and the art is exactly the mockup:
// toy-3D night New York — thick outlines, saturated colours, warm light, real
// soft shadows, textures in the buildings, no flat drawing, no clip-art.
// The art IS the mechanic: cars read by colour/shape, lights read by lens,
// patience reads as a ring on the car itself.
//
// Textures generated here:
//   bg-night      390x844 — the whole Times Square diorama, rendered once
//   car / taxi / bus / ambulance — pointing RIGHT, front at +x; the scene
//                   rotates them by the sim angle. 'car' is white-based so
//                   setTint colours it per car.
//   light-red / light-amber / light-green — 68x168 housings, one lens lit
//   dot           — 16x16 white circle (particles)
//   coin          — 44x44 gold coin with a star
import {
  CONFLICT,
  CX,
  CY,
  GAME_H,
  GAME_W,
  LIGHT_POS,
  PALETTE,
  PLAY_BOTTOM,
  PLAY_TOP,
  ROAD_H,
  ROAD_V,
  STOP,
} from './config';
import { drawStar } from './ui';

// Deterministic pseudo-random for the building windows (stable texture).
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

function shade(color: number, f: number): number {
  const r = Math.min(255, Math.round(((color >> 16) & 0xff) * f));
  const g = Math.min(255, Math.round(((color >> 8) & 0xff) * f));
  const b = Math.min(255, Math.round((color & 0xff) * f));
  return (r << 16) | (g << 8) | b;
}

/** Draw one car pointing RIGHT (front at +x) into a Graphics object. */
function drawCar(
  g: Phaser.GameObjects.Graphics,
  len: number,
  base: number,
  opts: { taxi?: boolean; bus?: boolean; ambulance?: boolean } = {},
): void {
  const H = 26;
  // Contact shadow (rotates with the car — reads as a grounded toy).
  g.fillStyle(0x000000, 0.28);
  g.fillRoundedRect(2, 3, len, H, 7);
  // Body with a thick dark outline.
  g.fillStyle(base, 1);
  g.fillRoundedRect(1, 1, len - 2, H - 2, 7);
  g.lineStyle(2, 0x0f172a, 1);
  g.strokeRoundedRect(1, 1, len - 2, H - 2, 7);
  // Top light edge = volume.
  g.fillStyle(0xffffff, 0.18);
  g.fillRoundedRect(3, 2, len - 6, 6, { tl: 5, tr: 5, bl: 0, br: 0 });
  // Wheels (top-down: dark bumps on the sides).
  g.fillStyle(0x0f172a, 1);
  for (const wx of [Math.round(len * 0.22) - 3, Math.round(len * 0.78) - 3]) {
    g.fillRoundedRect(wx, 0, 6, 4, 1);
    g.fillRoundedRect(wx, H - 4, 6, 4, 1);
  }
  // Windshield (front) + rear window.
  g.fillStyle(0x1e293b, 0.95);
  g.fillRoundedRect(len - 14, 4, 8, H - 8, 2);
  g.fillRoundedRect(6, 4, 6, H - 8, 2);
  // Roof band.
  g.fillStyle(shade(base, 0.72), 0.9);
  g.fillRoundedRect(len / 2 - 7, 3, 14, H - 6, 3);
  // Headlights (front) + taillights (rear).
  g.fillStyle(0xfef9c3, 1);
  g.fillCircle(len - 1, 6, 2);
  g.fillCircle(len - 1, H - 6, 2);
  g.fillStyle(0xef4444, 1);
  g.fillCircle(1, 6, 2);
  g.fillCircle(1, H - 6, 2);

  if (opts.taxi) {
    // Checker band along the side + white roof sign.
    for (let x = 12; x < len - 12; x += 8) {
      g.fillStyle((x / 8) % 2 === 0 ? 0x0f172a : 0xffffff, 1);
      g.fillRect(x, 11, 4, 4);
      g.fillRect(x, 15, 4, 4);
    }
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(len / 2 - 6, 9, 12, 8, 2);
    g.lineStyle(1, 0x0f172a, 1);
    g.strokeRoundedRect(len / 2 - 6, 9, 12, 8, 2);
  }
  if (opts.bus) {
    // Row of lit passenger windows + destination sign.
    g.fillStyle(0xbae6fd, 0.95);
    for (let x = 12; x < len - 18; x += 12) g.fillRoundedRect(x, 5, 8, 16, 2);
    g.fillStyle(0xfef9c3, 1);
    g.fillRoundedRect(len - 12, 8, 8, 10, 2);
  }
  if (opts.ambulance) {
    // Red cross on the roof + red/blue light bar.
    g.fillStyle(0xdc2626, 1);
    g.fillRect(len / 2 - 3, 6, 6, 14);
    g.fillRect(len / 2 - 8, 9, 16, 6);
    g.fillStyle(0xef4444, 1);
    g.fillRect(len / 2 - 10, 1, 8, 4);
    g.fillStyle(0x3b82f6, 1);
    g.fillRect(len / 2 + 2, 1, 8, 4);
  }
}

function buildCarTextures(scene: Phaser.Scene): void {
  const mk = (key: string, len: number, base: number, opts?: { taxi?: boolean; bus?: boolean; ambulance?: boolean }) => {
    const g = scene.add.graphics();
    drawCar(g, len, base, opts);
    g.generateTexture(key, len, 26);
    g.destroy();
  };
  mk('car', 44, 0xffffff); // white base — tinted per car
  mk('taxi', 44, PALETTE.taxi, { taxi: true });
  mk('bus', 64, PALETTE.bus, { bus: true });
  mk('ambulance', 52, PALETTE.ambulance, { ambulance: true });
}

function buildLightTextures(scene: Phaser.Scene): void {
  // Housing 68x168 (displayed at 34x84): dark body, three lenses, ONE lit
  // with a glow. Lens order top→bottom: red, amber, green.
  const lenses: Array<{ y: number; color: number; key: string }> = [
    { y: 30, color: PALETTE.stop, key: 'light-red' },
    { y: 84, color: PALETTE.warn, key: 'light-amber' },
    { y: 138, color: PALETTE.go, key: 'light-green' },
  ];
  for (const lit of lenses) {
    const g = scene.add.graphics();
    g.fillStyle(0x1f2937, 1);
    g.fillRoundedRect(4, 4, 60, 160, 14);
    g.lineStyle(3, 0x0f172a, 1);
    g.strokeRoundedRect(4, 4, 60, 160, 14);
    // Top light edge.
    g.fillStyle(0xffffff, 0.08);
    g.fillRoundedRect(6, 5, 56, 10, { tl: 12, tr: 12, bl: 0, br: 0 });
    for (const lens of lenses) {
      const isLit = lens.key === lit.key;
      if (isLit) {
        g.fillStyle(lens.color, 0.3);
        g.fillCircle(34, lens.y, 26);
      }
      g.fillStyle(isLit ? lens.color : 0x334155, 1);
      g.fillCircle(34, lens.y, 20);
      g.lineStyle(2, 0x0f172a, 1);
      g.strokeCircle(34, lens.y, 20);
      if (isLit) {
        g.fillStyle(0xffffff, 0.75);
        g.fillCircle(34, lens.y, 6);
      } else {
        g.fillStyle(0x000000, 0.35);
        g.fillCircle(34, lens.y + 4, 14);
      }
    }
    g.generateTexture(lit.key, 68, 168);
    g.destroy();
  }
}

function buildBackground(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  const rng = mulberry32(20261116);
  // Night base.
  g.fillStyle(0x0f172a, 1);
  g.fillRect(0, PLAY_TOP, GAME_W, PLAY_BOTTOM - PLAY_TOP);
  // Sidewalk blocks (4 corners) with a lighter top edge.
  g.fillStyle(0x1e293b, 1);
  g.fillRect(0, PLAY_TOP, ROAD_V.x0, ROAD_H.y0 - PLAY_TOP);
  g.fillRect(ROAD_V.x1, PLAY_TOP, GAME_W - ROAD_V.x1, ROAD_H.y0 - PLAY_TOP);
  g.fillRect(0, ROAD_H.y1, ROAD_V.x0, PLAY_BOTTOM - ROAD_H.y1);
  g.fillRect(ROAD_V.x1, ROAD_H.y1, GAME_W - ROAD_V.x1, PLAY_BOTTOM - ROAD_H.y1);

  // Buildings: darker slabs with lit windows (toy diorama). One window in the
  // SW building hides the Dana mascot (purple octopus) — the studio cameo.
  const blocks: Array<[number, number, number, number, number]> = [
    [12, PLAY_TOP + 12, 116, 120, 1],
    [262, PLAY_TOP + 12, 116, 120, 2],
    [12, 560, 116, 150, 3],
    [262, 560, 116, 150, 4],
  ];
  const litColors = [0xfbbf24, 0xfde68a, 0x67e8f9, 0xf0abfc, 0xa5b4fc];
  for (const [x, y, w, h, id] of blocks) {
    g.fillStyle(0x16233a, 1);
    g.fillRect(x, y, w, h);
    g.fillStyle(0x24365a, 1);
    g.fillRect(x, y, w, 8);
    // Windows: 4 cols x rows of 10x12.
    const cols = 4;
    const rows = Math.floor((h - 20) / 22);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = x + 10 + c * 26;
        const wy = y + 16 + r * 22;
        if (rng() < 0.55) {
          g.fillStyle(litColors[Math.floor(rng() * litColors.length)], 1);
        } else {
          g.fillStyle(0x0b1220, 1);
        }
        g.fillRect(wx, wy, 12, 12);
      }
    }
    // Billboards on the two top buildings + the SE one.
    if (id === 1) {
      g.fillStyle(0xec4899, 1);
      g.fillRect(x + 8, y + h - 34, w - 16, 26);
      drawStar(g, x + w / 2, y + h - 21, 9, 0xffffff);
    }
    if (id === 2) {
      g.fillStyle(0x06b6d4, 1);
      g.fillRect(x + 8, y + h - 34, w - 16, 26);
      g.fillStyle(0xffffff, 1);
      g.beginPath();
      g.moveTo(x + w / 2 + 6, y + h - 30);
      g.lineTo(x + w / 2 - 6, y + h - 14);
      g.lineTo(x + w / 2 + 2, y + h - 14);
      g.lineTo(x + w / 2 - 6, y + h - 10);
      g.lineTo(x + w / 2 + 8, y + h - 26);
      g.lineTo(x + w / 2, y + h - 26);
      g.closePath();
      g.fillPath();
    }
    if (id === 4) {
      g.fillStyle(0xf59e0b, 1);
      g.fillRect(x + 8, y + 8, w - 16, 26);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(x + w / 2, y + 21, 8);
    }
    // Octopus cameo in the SW building (id 3), second window row.
    if (id === 3) {
      const ox = x + 10 + 1 * 26 + 6;
      const oy = y + 16 + 1 * 22 + 6;
      g.fillStyle(0xa855f7, 1);
      g.fillCircle(ox, oy, 6);
      for (let k = -1; k <= 1; k++) g.fillCircle(ox + k * 5, oy + 7, 2);
    }
  }

  // Asphalt.
  g.fillStyle(PALETTE.road, 1);
  g.fillRect(ROAD_V.x0, PLAY_TOP, ROAD_V.x1 - ROAD_V.x0, PLAY_BOTTOM - PLAY_TOP);
  g.fillRect(0, ROAD_H.y0, GAME_W, ROAD_H.y1 - ROAD_H.y0);
  // Wet sheen: soft light streaks under the lamps.
  g.fillStyle(0xffffff, 0.05);
  g.fillRect(ROAD_V.x0, 300, ROAD_V.x1 - ROAD_V.x0, 40);
  g.fillRect(60, ROAD_H.y0, 120, ROAD_H.y1 - ROAD_H.y0);
  g.fillRect(210, ROAD_H.y0, 120, ROAD_H.y1 - ROAD_H.y0);
  // Center dashed lines.
  g.fillStyle(0xfacc15, 1);
  for (let y = PLAY_TOP + 8; y < PLAY_BOTTOM - 20; y += 34) {
    if (y > ROAD_H.y0 - 20 && y < ROAD_H.y1) continue;
    g.fillRect(CX - 2, y, 4, 18);
  }
  for (let x = 8; x < GAME_W - 20; x += 34) {
    if (x > ROAD_V.x0 - 20 && x < ROAD_V.x1) continue;
    g.fillRect(x, CY - 2, 18, 4);
  }
  // Crosswalks (white stripes at each approach).
  g.fillStyle(0xe2e8f0, 0.92);
  for (let x = ROAD_V.x0 + 6; x < ROAD_V.x1 - 6; x += 14) {
    g.fillRect(x, ROAD_H.y0 - 16, 8, 12);
    g.fillRect(x, ROAD_H.y1 + 4, 8, 12);
  }
  for (let y = ROAD_H.y0 + 6; y < ROAD_H.y1 - 6; y += 14) {
    g.fillRect(ROAD_V.x0 - 16, y, 12, 8);
    g.fillRect(ROAD_V.x1 + 4, y, 12, 8);
  }
  // Stop lines (white, at the sim's stop coordinates).
  g.fillStyle(0xf8fafc, 1);
  g.fillRect(ROAD_V.x0 + 4, STOP.N - 2, ROAD_V.x1 - ROAD_V.x0 - 8, 4);
  g.fillRect(ROAD_V.x0 + 4, STOP.S - 2, ROAD_V.x1 - ROAD_V.x0 - 8, 4);
  g.fillRect(STOP.W - 2, ROAD_H.y0 + 4, 4, ROAD_H.y1 - ROAD_H.y0 - 8);
  g.fillRect(STOP.E - 2, ROAD_H.y0 + 4, 4, ROAD_H.y1 - ROAD_H.y0 - 8);
  // Lane arrows (triangles on the road, pointing the drive direction).
  const arrow = (x: number, y: number, angleDeg: number) => {
    g.fillStyle(0xf8fafc, 0.85);
    g.beginPath();
    const a = (angleDeg * Math.PI) / 180;
    const p = (dx: number, dy: number) => {
      const rx = dx * Math.cos(a) - dy * Math.sin(a);
      const ry = dx * Math.sin(a) + dy * Math.cos(a);
      return [x + rx, y + ry] as const;
    };
    const [x1, y1] = p(0, -10);
    const [x2, y2] = p(-7, 7);
    const [x3, y3] = p(7, 7);
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.lineTo(x3, y3);
    g.closePath();
    g.fillPath();
  };
  arrow(222, 330, 180); // N lane drives south
  arrow(168, 530, 0); // S lane drives north
  arrow(100, 458, 90); // W lane drives east
  arrow(290, 402, 270); // E lane drives west
  // Street lamps: warm glow at the 4 intersection corners.
  for (const [lx, ly] of [
    [132, 360],
    [258, 360],
    [132, 500],
    [258, 500],
  ] as const) {
    g.fillStyle(0xfde68a, 0.14);
    g.fillCircle(lx, ly, 16);
    g.fillStyle(0x0f172a, 1);
    g.fillRect(lx - 2, ly - 9, 4, 18);
    g.fillStyle(0xfef3c7, 1);
    g.fillCircle(lx, ly - 9, 3);
  }
  // Traffic-light posts (short dark posts below each housing).
  for (const dir of ['N', 'S', 'E', 'W'] as const) {
    const pos = LIGHT_POS[dir];
    g.fillStyle(0x1f2937, 1);
    g.fillRect(pos.x - 3, pos.y + 42, 6, 22);
  }
  // Conflict box hint: a faint outline so the danger zone reads.
  g.lineStyle(1, 0xef4444, 0.12);
  g.strokeRect(CONFLICT.x0, CONFLICT.y0, CONFLICT.x1 - CONFLICT.x0, CONFLICT.y1 - CONFLICT.y0);

  g.generateTexture('bg-night', GAME_W, GAME_H);
  g.destroy();
}

function buildSmallTextures(scene: Phaser.Scene): void {
  // 'dot' — particle sprite.
  const d = scene.add.graphics();
  d.fillStyle(0xffffff, 1);
  d.fillCircle(8, 8, 7);
  d.generateTexture('dot', 16, 16);
  d.destroy();
  // 'coin' — gold coin with a star.
  const c = scene.add.graphics();
  c.fillStyle(0xfacc15, 1);
  c.fillCircle(22, 22, 20);
  c.lineStyle(3, 0xb45309, 1);
  c.strokeCircle(22, 22, 19);
  drawStar(c, 22, 22, 11, 0xf59e0b);
  c.generateTexture('coin', 44, 44);
  c.destroy();
}

/** Generate every texture the game needs. Called once from BootScene. */
export function buildArtTextures(scene: Phaser.Scene): void {
  buildBackground(scene);
  buildCarTextures(scene);
  buildLightTextures(scene);
  buildSmallTextures(scene);
}
