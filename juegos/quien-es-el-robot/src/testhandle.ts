// Test handle — test builds ONLY. In production (__TEST_BUILD__ === false)
// this module's body never runs and the window.__game object never exists
// (Playgama test-leftover rule). The smoke test and the level solver drive
// the game through this handle instead of poking internals.
import Phaser from 'phaser';
import { placeCrowd, levelDef, type RobotLevel } from './levels';

declare global {
  // eslint-disable-next-line no-var
  var __TEST_BUILD__: boolean | undefined;
}

export interface GameTestHandle {
  state(): unknown;
  startLevel(level: number): void;
  /** Move the scanner beam to (x, y) in design coords. */
  scan(x: number, y: number): void;
  /** Tap at (x, y) in design coords. */
  tap(x: number, y: number): void;
  /** The robot's current position (after drift) in design coords. */
  robotPos(): { x: number; y: number };
  /** Is the robot currently revealed? */
  revealed(): boolean;
  /** The level's deterministic solution: robot slot from the seed. */
  solution(level: number): { x: number; y: number };
  useHint(): void;
  save(): unknown;
  resetSave(): void;
}

export function installTestHandle(game: Phaser.Game): void {
  if (!__TEST_BUILD__) return;
  const handle: GameTestHandle = {
    state() {
      const scene = game.scene.getScene('game') as unknown as Record<string, unknown>;
      const fn = scene.__testState as (() => unknown) | undefined;
      return fn ? fn() : { scene: game.scene.getScenes(true).map((s) => s.scene.key) };
    },
    startLevel(level: number) {
      const menu = game.scene.getScene('menu');
      if (menu.sys.isActive()) menu.scene.stop();
      const map = game.scene.getScene('map');
      if (map.sys.isActive()) map.scene.stop();
      const gameScene = game.scene.getScene('game');
      gameScene.scene.start('game', { level });
    },
    scan(x: number, y: number) {
      const scene = game.scene.getScene('game') as unknown as Record<string, unknown>;
      const fn = scene.__testScan as ((x: number, y: number) => void) | undefined;
      if (fn) fn(x, y);
    },
    tap(x: number, y: number) {
      const scene = game.scene.getScene('game') as unknown as Record<string, unknown>;
      const fn = scene.__testTap as ((x: number, y: number) => void) | undefined;
      if (fn) fn(x, y);
    },
    robotPos() {
      const scene = game.scene.getScene('game') as unknown as Record<string, unknown>;
      const fn = scene.__testRobotPos as (() => { x: number; y: number }) | undefined;
      return fn ? fn() : { x: -1, y: -1 };
    },
    revealed() {
      const scene = game.scene.getScene('game') as unknown as Record<string, unknown>;
      const fn = scene.__testRevealed as (() => boolean) | undefined;
      return fn ? fn() : false;
    },
    solution(level: number) {
      const def: RobotLevel = levelDef(level);
      const { robot } = placeCrowd(def);
      return { x: robot.x, y: robot.y };
    },
    useHint() {
      const scene = game.scene.getScene('game') as unknown as Record<string, unknown>;
      const fn = scene.__testHint as (() => void) | undefined;
      if (fn) fn();
    },
    save() {
      return undefined;
    },
    resetSave() {
      // No-op: the smoke test starts from a fresh in-memory save.
    },
  };
  (window as unknown as { __game?: GameTestHandle }).__game = handle;
}
