// Cat skins + restaurant themes — cosmetic, bought with earned coins only.
// No real-money payments, no paywall. Skins tint the cats; themes recolour
// the restaurant wall + floor tint (applied as a tint on the background).
export interface Skin {
  id: string;
  nameEn: string;
  nameEs: string;
  price: number;
  /** tint applied to the cat art (0xffffff = no tint) */
  tint: number;
}

export const SKINS: Skin[] = [
  { id: 'classic', nameEn: 'Classic Cats', nameEs: 'Gatos clásicos', price: 0, tint: 0xffffff },
  { id: 'ninja', nameEn: 'Ninja Cats', nameEs: 'Gatos ninja', price: 300, tint: 0x9fb4c7 },
  { id: 'samurai', nameEn: 'Samurai Cats', nameEs: 'Gatos samurái', price: 600, tint: 0xf3c969 },
  { id: 'chef', nameEn: 'Chef Cats', nameEs: 'Gatos chef', price: 1000, tint: 0xffffff },
  { id: 'pink', nameEn: 'Pink Cats', nameEs: 'Gatos rosas', price: 400, tint: 0xf9a8d4 },
  { id: 'gold', nameEn: 'Golden Cats', nameEs: 'Gatos dorados', price: 800, tint: 0xfde68a },
];

export interface Theme {
  id: string;
  nameEn: string;
  nameEs: string;
  price: number;
  /** tint applied to the background image */
  tint: number;
}

export const THEMES: Theme[] = [
  { id: 'tokyo', nameEn: 'Tokyo', nameEs: 'Tokio', price: 0, tint: 0xffffff },
  { id: 'osaka', nameEn: 'Osaka', nameEs: 'Osaka', price: 500, tint: 0xffe4b3 },
  { id: 'fishmarket', nameEn: 'Fish Market', nameEs: 'Mercado de pescado', price: 1000, tint: 0xbfe3ff },
];
