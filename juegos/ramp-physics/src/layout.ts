// Layout helpers — one place for every position rule, so portrait,
// landscape and desktop all place the same elements the same way.
// Design size: 390x844 (mobile portrait). Landscape uses the wide blueprint
// background; desktop is the same layout scaled to the window.
export function isLandscape(w: number, h: number): boolean {
  return w > h;
}

/** Playfield margins (HUD at top, ink bar + buttons at bottom). */
export function playTop(h: number): number {
  return Math.max(96, h * 0.13);
}
export function playBottom(h: number): number {
  return h - Math.max(64, h * 0.09);
}

/** Dummy display size (head width) at the design scale. */
export function dummySize(w: number, h: number): number {
  const s = Math.min(w, h);
  return Math.max(48, Math.min(72, s * 0.15));
}

/** Flag display height. */
export function flagSize(w: number, h: number): number {
  const s = Math.min(w, h);
  return Math.max(56, Math.min(84, s * 0.18));
}
