// Layout helpers — one place for every position rule, so portrait,
// landscape and desktop all place the same elements the same way.
// Design size: 390x844 (mobile portrait). The belt is the playfield:
// chef above it, cats below it.
export function isLandscape(w: number, h: number): boolean {
  return w > h;
}

/** HUD band at the top. */
export function playTop(h: number): number {
  return Math.max(96, h * 0.13);
}

/** Bottom edge of the play area (above the BOOST button row). */
export function playBottom(h: number): number {
  return h - Math.max(64, h * 0.09);
}

// ---------- sushi layout (design 390x844) ----------

/** Belt strip: y centre + height. */
export const BELT_Y = 268;
export const BELT_H = 110;
/** Chef cat: centre position. */
export const CHEF_X = 195;
export const CHEF_Y = 138;
/** Cats: centre x per colour (0 orange, 1 grey, 2 black-white). */
export const CAT_X = [72, 195, 318];
export const CAT_Y = 585;
export const CAT_MAT_Y = 668;
/** Plate display size. */
export const PLATE_SIZE = 56;
/** Cat display size (w x h). */
export const CAT_W = 110;
export const CAT_H = 130;
