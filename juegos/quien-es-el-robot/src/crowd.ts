// Crowd + city art — all vectorial, generated at real resolution.
// No bitmaps are ever scaled up, so nothing can look pixelated (the art
// bible's anti-pixelado rule). Every person is a character, not a repeated
// sprite: 3 shapes x 6 palettes = 18 variants, plus 4 robot outfits.
// Textures (64x140 person frame, 390x844 backgrounds):
//   person-0..17, robot-hoodie/cap/jacket/scarf, antenna, eye-glow, glint,
//   bg-ny / bg-tokyo / bg-paris, dot (particle).
import Phaser from 'phaser';

const INK = 0x141414;

const SHIRTS = [0xe23b2e, 0x2563eb, 0x22c55e, 0xfacc15, 0x8b5cf6, 0xf97316];
const PANTS = [0x1e3a5f, 0x334155, 0x57534e, 0x1e3a5f, 0x334155, 0x57534e];
const SKINS = [0xfcd9b8, 0xe8b88a, 0xc68e5e, 0x8d5524, 0xfcd9b8, 0xe8b88a];
const HAIRS = [0x2d1b0e, 0x111111, 0x6b4a2f, 0x9ca3af, 0x2d1b0e, 0x111111];

function shade(hex: number, f: number): number {
  const r = Math.min(255, Math.round(((hex >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((hex >> 8) & 255) * f));
  const b = Math.min(255, Math.round((hex & 255) * f));
  return (r << 16) | (g << 8) | b;
}

/** Draw one person into a 64x140 graphics frame. */
function drawPerson(g: Phaser.GameObjects.Graphics, shape: number, palette: number, robot: boolean, outfit: string): void {
  const shirt = robot ? 0x9aa5ad : SHIRTS[palette];
  const pants = robot ? 0x4b5563 : PANTS[palette];
  const skin = SKINS[palette];
  const hair = HAIRS[palette];
  const wide = shape === 2 ? 6 : 0;
  const tall = shape === 0 ? -6 : 0;
  const bodyX = 12 - wide;
  const bodyW = 40 + wide * 2;
  const bodyY = 50 + tall;
  const bodyH = 52 - tall;
  const headY = 32 + tall;

  // Ground shadow (real soft shadow under the feet).
  g.fillStyle(0x000000, 0.16);
  g.fillEllipse(32, 136, 44 + wide, 8);
  // Legs + shoes.
  g.fillStyle(pants, 1);
  g.fillRoundedRect(20, 96 + tall, 10, 34, 3);
  g.fillRoundedRect(34, 96 + tall, 10, 34, 3);
  g.fillStyle(0x141414, 1);
  g.fillRoundedRect(17, 128, 14, 8, 3);
  g.fillRoundedRect(33, 128, 14, 8, 3);
  // Body (rounded rect + thick ink outline + top highlight = volume).
  g.fillStyle(shirt, 1);
  g.fillRoundedRect(bodyX, bodyY, bodyW, bodyH, 10);
  g.fillStyle(0xffffff, 0.18);
  g.fillRoundedRect(bodyX + 3, bodyY + 3, bodyW - 6, 12, 6);
  g.lineStyle(3, INK, 1);
  g.strokeRoundedRect(bodyX, bodyY, bodyW, bodyH, 10);
  // Arms.
  g.fillStyle(shade(shirt, 0.8), 1);
  g.fillRoundedRect(bodyX - 6, bodyY + 6, 8, 34, 4);
  g.fillRoundedRect(bodyX + bodyW - 2, bodyY + 6, 8, 34, 4);
  // Robot extras: hoodie pocket + zipper.
  if (robot) {
    g.fillStyle(0x6b7280, 1);
    g.fillRoundedRect(20, bodyY + 30, 24, 14, 4);
    g.lineStyle(2, 0x4b5563, 1);
    g.lineBetween(32, bodyY + 2, 32, bodyY + 28);
  }
  // Head.
  g.fillStyle(skin, 1);
  g.fillCircle(32, headY, 16);
  g.lineStyle(3, INK, 1);
  g.strokeCircle(32, headY, 16);
  // Hair / hat / hood.
  const hairStyle = robot ? 'hood' : ['hair', 'cap', 'hat', 'hair'][palette % 4];
  if (hairStyle === 'hair') {
    g.fillStyle(hair, 1);
    g.fillEllipse(32, headY - 10, 34, 16);
  } else if (hairStyle === 'cap') {
    g.fillStyle(0x2563eb, 1);
    g.fillEllipse(32, headY - 11, 34, 12);
    g.fillRoundedRect(28, headY - 18, 26, 6, 3);
  } else if (hairStyle === 'hat') {
    g.fillStyle(0x92400e, 1);
    g.fillEllipse(32, headY - 12, 36, 10);
    g.fillRoundedRect(22, headY - 22, 20, 12, 4);
  } else {
    // hood: grey arc framing the face (robot) or a scarf (people).
    g.fillStyle(0x9aa5ad, 1);
    g.fillEllipse(32, headY - 4, 38, 30);
    g.fillStyle(skin, 1);
    g.fillCircle(32, headY + 1, 13);
    g.lineStyle(3, INK, 1);
    g.strokeEllipse(32, headY - 4, 38, 30);
  }
  // Face: two dot eyes + smile (the robot's eyes are plain — the GLOWING eye
  // is a separate sprite, hidden until the beam reveals it).
  g.fillStyle(INK, 1);
  g.fillCircle(26, headY + 1, 1.8);
  g.fillCircle(38, headY + 1, 1.8);
  g.lineStyle(2, INK, 1);
  g.beginPath();
  g.arc(32, headY + 5, 5, 0.15 * Math.PI, 0.85 * Math.PI, false);
  g.strokePath();
  // Outfit accents (cap outfit = cap + backpack strap; scarf outfit = scarf).
  if (robot && outfit === 'cap') {
    g.fillStyle(0x2563eb, 1);
    g.fillEllipse(32, headY - 11, 34, 12);
    g.fillStyle(0x1e3a5f, 1);
    g.fillRoundedRect(18, bodyY + 4, 6, 30, 3);
    g.fillRoundedRect(40, bodyY + 4, 6, 30, 3);
  }
  if (robot && outfit === 'scarf') {
    g.fillStyle(0xe23b2e, 1);
    g.fillRoundedRect(20, bodyY - 4, 24, 10, 5);
  }
}

export function generateCrowdTextures(scene: Phaser.Scene): void {
  // 18 person variants.
  for (let v = 0; v < 18; v++) {
    const key = `person-${v}`;
    if (scene.textures.exists(key)) continue;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    drawPerson(g, Math.floor(v / 6), v % 6, false, '');
    g.generateTexture(key, 64, 140);
    g.destroy();
  }
  // 4 robot outfits (grey hoodie family — camouflage: grey among greys).
  for (const outfit of ['hoodie', 'cap', 'jacket', 'scarf']) {
    const key = `robot-${outfit}`;
    if (scene.textures.exists(key)) continue;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    drawPerson(g, 1, 0, true, outfit);
    g.generateTexture(key, 64, 140);
    g.destroy();
  }
  // Antenna (thin line + ball) — separate sprite, hidden until revealed.
  if (!scene.textures.exists('antenna')) {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.lineStyle(2, INK, 1);
    g.lineBetween(6, 22, 6, 4);
    g.fillStyle(0x22d3ee, 1);
    g.fillCircle(6, 3, 3);
    g.lineStyle(1, INK, 1);
    g.strokeCircle(6, 3, 3);
    g.generateTexture('antenna', 12, 24);
    g.destroy();
  }
  // Glowing eye — cyan radial dot, hidden until revealed.
  if (!scene.textures.exists('eye-glow')) {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0x22d3ee, 0.35);
    g.fillCircle(8, 8, 8);
    g.fillStyle(0x22d3ee, 1);
    g.fillCircle(8, 8, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(8, 8, 1.8);
    g.generateTexture('eye-glow', 16, 16);
    g.destroy();
  }
  // Decoy glint — white sparkle that flashes under the beam.
  if (!scene.textures.exists('glint')) {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(10, 0, 13, 7, 20, 10);
    g.fillTriangle(10, 0, 7, 7, 0, 10);
    g.fillTriangle(10, 20, 13, 13, 20, 10);
    g.fillTriangle(10, 20, 7, 13, 0, 10);
    g.generateTexture('glint', 20, 20);
    g.destroy();
  }
  // Particle dot.
  if (!scene.textures.exists('dot')) {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('dot', 8, 8);
    g.destroy();
  }
}

interface CityTheme {
  wall: number;
  wallDark: number;
  strip: number;
  sign: number;
  signText: string;
  bench: number;
}

/** Metro platform backgrounds, one per city (390x844, generated once). */
export function generateBackgrounds(scene: Phaser.Scene): void {
  const themes: Record<string, CityTheme> = {
    ny: { wall: 0xe8e0cc, wallDark: 0xcfc4a8, strip: 0xfacc15, sign: 0x1e3a5f, signText: 'NYC — 42 ST', bench: 0x2f5233 },
    tokyo: { wall: 0xf5f0f0, wallDark: 0xd9cfcf, strip: 0xf9a8d4, sign: 0x9d174d, signText: 'TOKYO — SHIBUYA', bench: 0x6b7280 },
    paris: { wall: 0xefe6d0, wallDark: 0xd6c9a8, strip: 0x60a5fa, sign: 0x1e3a5f, signText: 'PARIS — MÉTRO', bench: 0x7c5a3a },
  };
  for (const [city, t] of Object.entries(themes)) {
    const key = `bg-${city}`;
    if (scene.textures.exists(key)) continue;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    // Wall (tiles) + darker lower band.
    g.fillStyle(t.wall, 1);
    g.fillRect(0, 0, 390, 844);
    g.fillStyle(t.wallDark, 1);
    g.fillRect(0, 560, 390, 284);
    // Tile grid lines.
    g.lineStyle(1, 0x000000, 0.08);
    for (let y = 0; y < 560; y += 46) g.lineBetween(0, y, 390, y);
    for (let x = 0; x < 390; x += 46) g.lineBetween(x, 0, x, 560);
    // Station sign (top band).
    g.fillStyle(t.sign, 1);
    g.fillRoundedRect(40, 60, 310, 64, 10);
    g.lineStyle(3, INK, 1);
    g.strokeRoundedRect(40, 60, 310, 64, 10);
    // Bench (left, mid height).
    g.fillStyle(t.bench, 1);
    g.fillRoundedRect(16, 470, 120, 16, 6);
    g.fillRect(28, 486, 8, 40);
    g.fillRect(116, 486, 8, 40);
    // Safety strip + platform floor.
    g.fillStyle(t.strip, 1);
    g.fillRect(0, 700, 390, 14);
    g.fillStyle(0x000000, 0.12);
    g.fillRect(0, 714, 390, 130);
    // Floor perspective lines.
    g.lineStyle(2, 0x000000, 0.1);
    for (let i = 0; i < 7; i++) {
      const x = 30 + i * 55;
      g.lineBetween(x, 714, x - 18 + i * 6, 844);
    }
    g.generateTexture(key, 390, 844);
    g.destroy();
    // Sign text is drawn as a real Text object in GameScene (not baked in).
  }
}

export function citySignText(city: string): string {
  return city === 'ny' ? 'NYC — 42 ST' : city === 'tokyo' ? 'TOKYO — SHIBUYA' : 'PARIS — MÉTRO';
}

export function personTextureFor(variant: number): string {
  return `person-${variant}`;
}

export function robotTextureFor(outfit: string): string {
  return `robot-${outfit}`;
}
