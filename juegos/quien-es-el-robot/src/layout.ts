// Layout helpers — one place for every position rule, so portrait,
// landscape and desktop all place the same elements the same way.
// Design size: 390x844 (mobile portrait). Landscape uses the wide comic
// background; desktop is the same layout scaled to the window.
export function isLandscape(w: number, h: number): boolean {
  return w > h;
}

/** Playfield margins (HUD at top, buttons at bottom). */
export function playTop(h: number): number {
  return Math.max(96, h * 0.13);
}
export function playBottom(h: number): number {
  return h - Math.max(64, h * 0.09);
}

/** Person display size (body width) at the design scale. */
export function personSize(w: number, h: number): number {
  const s = Math.min(w, h);
  return Math.max(48, Math.min(72, s * 0.15));
}
