// Hole skins — cosmetic rim + swirl colours for the black hole, bought
// with earned coins only. No real-money payments, no paywall. The hole
// itself stays black (it is a pit); the skin recolours its glowing rim.
export interface Skin {
  id: string;
  nameEn: string;
  nameEs: string;
  price: number;
  /** rim + glow colour (0xRRGGBB) */
  rim: number;
  /** swirl highlight colour */
  rimLight: number;
}

export const SKINS: Skin[] = [
  { id: 'classic', nameEn: 'Classic Void', nameEs: 'Vacío clásico', price: 0, rim: 0x7c3aed, rimLight: 0xa78bfa },
  { id: 'chocolate', nameEn: 'Chocolate Hole', nameEs: 'Agujero de chocolate', price: 150, rim: 0xb45309, rimLight: 0xe8a94e },
  { id: 'magnet', nameEn: 'Magnet Hole', nameEs: 'Agujero imán', price: 250, rim: 0xdc2626, rimLight: 0xf87171 },
  { id: 'golden', nameEn: 'Golden Hole', nameEs: 'Agujero dorado', price: 350, rim: 0xd97706, rimLight: 0xfacc15 },
  { id: 'galaxy', nameEn: 'Galaxy Hole', nameEs: 'Agujero galaxia', price: 500, rim: 0x4c1d95, rimLight: 0xc4b5fd },
];
