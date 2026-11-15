// Layout helpers — one place for every position rule, so portrait,
// landscape and desktop all place the same elements the same way.
// Design size: 390x844 (mobile portrait). Landscape uses the wide beach
// background; desktop is the same layout scaled to the window.
export function isLandscape(w: number, h: number): boolean {
  return w > h;
}

/** Where the sandwich sits (centre of the beach towel in both backgrounds). */
export function sandwichAnchor(w: number, h: number): { x: number; y: number } {
  return isLandscape(w, h) ? { x: w * 0.44, y: h * 0.7 } : { x: w * 0.5, y: h * 0.55 };
}

/** Sandwich display width: big enough to read, small enough to defend. */
export function sandwichSize(w: number, h: number): number {
  const s = Math.min(w, h);
  return Math.max(110, Math.min(190, s * 0.42));
}

/** Gull display width. */
export function gullSize(w: number, h: number): number {
  const s = Math.min(w, h);
  return Math.max(72, Math.min(120, s * 0.26));
}

/** Playfield margins (HUD at top, ink bar at bottom). */
export function playTop(h: number): number {
  return Math.max(96, h * 0.13);
}
export function playBottom(h: number): number {
  return h - Math.max(64, h * 0.09);
}
