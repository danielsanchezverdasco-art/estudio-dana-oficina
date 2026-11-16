// Scooter skins — cosmetic tints for the delivery scooter, bought with
// earned coins only. No real-money payments, no paywall.
export interface Skin {
  id: string;
  nameEn: string;
  nameEs: string;
  price: number;
  /** tint applied to the scooter body art (0xffffff = no tint) */
  tint: number;
}

export const SKINS: Skin[] = [
  { id: 'classic', nameEn: 'Classic Red', nameEs: 'Roja clásica', price: 0, tint: 0xff6b5e },
  { id: 'mint', nameEn: 'Mint Scooter', nameEs: 'Moto menta', price: 100, tint: 0x2ec4b6 },
  { id: 'sunshine', nameEn: 'Sunshine Yellow', nameEs: 'Amarillo sol', price: 150, tint: 0xffc53d },
  { id: 'ocean', nameEn: 'Ocean Blue', nameEs: 'Azul océano', price: 200, tint: 0x2f9be8 },
  { id: 'bubblegum', nameEn: 'Bubblegum Pink', nameEs: 'Rosa chicle', price: 250, tint: 0xff6b9d },
  { id: 'shadow', nameEn: 'Shadow Black', nameEs: 'Negra sombra', price: 300, tint: 0x2e4057 },
];
