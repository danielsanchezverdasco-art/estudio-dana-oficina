// Dummy skins — cosmetic tints for the crash-test dummy, bought with
// earned coins only. No real-money payments, no paywall.
export interface Skin {
  id: string;
  nameEn: string;
  nameEs: string;
  price: number;
  /** tint applied to the head + torso art (0xffffff = no tint) */
  tint: number;
}

export const SKINS: Skin[] = [
  { id: 'classic', nameEn: 'Classic Yellow', nameEs: 'Amarillo clásico', price: 0, tint: 0xffffff },
  { id: 'red', nameEn: 'Red Racer', nameEs: 'Rojo corredor', price: 150, tint: 0xff8a80 },
  { id: 'blue', nameEn: 'Blue Bolt', nameEs: 'Azul eléctrico', price: 250, tint: 0x93c5fd },
  { id: 'green', nameEn: 'Green Machine', nameEs: 'Verde máquina', price: 350, tint: 0x86efac },
  { id: 'pink', nameEn: 'Pink Pop', nameEs: 'Rosa pop', price: 400, tint: 0xf9a8d4 },
  { id: 'gold', nameEn: 'Golden Dummy', nameEs: 'Muñeco dorado', price: 500, tint: 0xfde68a },
];
