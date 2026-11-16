// Scanner beam skins — cosmetic tints for the scanner beam, bought with
// earned coins only. No real-money payments, no paywall.
export interface BeamSkin {
  id: string;
  nameEn: string;
  nameEs: string;
  price: number;
  /** beam tint */
  tint: number;
}

export const BEAMS: BeamSkin[] = [
  { id: 'cyan', nameEn: 'Cyan Scanner', nameEs: 'Escáner cian', price: 0, tint: 0x22d3ee },
  { id: 'magenta', nameEn: 'Magenta Beam', nameEs: 'Haz magenta', price: 150, tint: 0xe879f9 },
  { id: 'lime', nameEn: 'Lime Beam', nameEs: 'Haz lima', price: 250, tint: 0xa3e635 },
  { id: 'gold', nameEn: 'Golden Beam', nameEs: 'Haz dorado', price: 350, tint: 0xfacc15 },
  { id: 'violet', nameEn: 'Violet Beam', nameEs: 'Haz violeta', price: 450, tint: 0x8b5cf6 },
];
