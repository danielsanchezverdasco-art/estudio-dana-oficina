// Level definitions. 30 hand-tuned levels, generated from one rule set so the
// numbers in this file ARE the numbers in the game (single source of truth).
// Design: teach -> test -> twist every ~5 levels.
//  - L1-5:  learn to draw (slow gulls, generous ink, no wind).
//  - L6-10: wind arrives; L10 = first pelican boss.
//  - L11-15: gulls dive from the sides too.
//  - L16-20: the umbrella is a no-draw zone.
//  - L21-25: wind + sides + umbrella together.
//  - L26-30: pelican bosses + the fastest waves.
// Anti-square math: a box around the sandwich needs ~700 px of line; the ink
// budget is 260-420 px, so the trivial "draw a square" shape can never win.
export const LEVEL_COUNT = 30;
export const LEVEL_TIME = 10; // seconds to survive, every level
export const LINE_WIDTH = 14; // visual width of the drawn line (px)
export const GULL_RADIUS = 30; // collision radius of a gull (px)

export interface UmbrellaDef {
  rx: number; // relative x (0..1 of screen width)
  ry: number; // relative y (0..1 of screen height)
  r: number; // radius in px
}

export interface LevelDef {
  n: number;
  gulls: number; // total gulls spawned during the level
  spawnInterval: number; // seconds between spawns
  speed: number; // gull dive speed, px/s
  wind: number; // -1..1, horizontal force on gulls
  sides: boolean; // gulls may spawn from the left/right edges
  umbrella?: UmbrellaDef;
  pelican: boolean; // pelican boss (3 HP; steals 1 crumb like any gull — its threat is size + slow speed, not a double steal)
  ink: number; // total line length the player may draw, px
}

export function levelDef(n: number): LevelDef {
  const speed = Math.min(130 + n * 8, 370);
  const gulls = Math.min(3 + Math.floor(n / 2), 12);
  const wind =
    n <= 5 ? 0 : n <= 10 ? 0.35 : n <= 15 ? 0.5 : n <= 20 ? 0.6 : n <= 25 ? 0.7 : 0.8;
  const windSigned = n % 2 === 0 ? wind : -wind;
  const ink = n === 1 ? 420 : n <= 5 ? 380 : n <= 10 ? 340 : n <= 15 ? 320 : n <= 20 ? 300 : n <= 25 ? 280 : 260;
  return {
    n,
    gulls,
    spawnInterval: Math.max(0.7, (LEVEL_TIME / gulls) * 0.9),
    speed,
    wind: windSigned,
    sides: n >= 11,
    umbrella: n >= 16 ? { rx: 0.5, ry: 0.3, r: 64 } : undefined,
    pelican: n % 10 === 0,
    ink,
  };
}

/** Today's daily-challenge level: day of year mapped onto 1..30. */
export function dailyLevel(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return (day % LEVEL_COUNT) + 1;
}
