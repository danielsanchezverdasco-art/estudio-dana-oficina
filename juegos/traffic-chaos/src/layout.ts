// Layout helpers. Design size is 390x844 (mobile portrait) and the game
// scales with Phaser.Scale.FIT, so scene coordinates ARE design coordinates:
// (0,0) top-left, (390,844) bottom-right, centre (195,422). These helpers
// exist so no scene hard-codes a magic number twice.
import { GAME_H, GAME_W } from './config';

export const DESIGN_W = GAME_W;
export const DESIGN_H = GAME_H;
export const CENTER_X = GAME_W / 2;
export const CENTER_Y = GAME_H / 2;

/** Scale an image to COVER the design size (backgrounds). */
export function coverScale(imgW: number, imgH: number): number {
  return Math.max(DESIGN_W / imgW, DESIGN_H / imgH);
}

/** Scale an image to FIT inside the design size (covers, logos). */
export function fitScale(imgW: number, imgH: number): number {
  return Math.min(DESIGN_W / imgW, DESIGN_H / imgH);
}
