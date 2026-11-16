// Debug handle for the probing skill (probing-web-game-mechanics).
// DELIBERATE DECISION (documented): the handle exists ONLY in the test
// build (VITE_TEST_BUILD=1, outDir dist-test). The production build sets
// __TEST_BUILD__ to false and this module is tree-shaken away, so the
// production zip has no window.__* handle and no test parameters.
// Probing without it would only check "loads and doesn't crash", which the
// skill explicitly calls a smoke test in disguise — the mechanics (serve
// rules, wasabi stun, golden x3, combo, hearts, 30 level wins) need the
// handle to be asserted.
import Phaser from 'phaser';
import { currentLang } from './i18n';
import { Save, defaultSave } from './save';
import { GameScene } from './scenes/GameScene';

export function installTestHandle(game: Phaser.Game): void {
  const gameScene = (): GameScene | null => {
    const s = game.scene.getScene('Game') as GameScene | null;
    return s && s.scene.isActive() ? s : null;
  };

  const handle = {
    version: 'sushi-belt-test-1',
    game,
    state(): Record<string, unknown> {
      const active = game.scene.getScenes(true).map((s) => s.scene.key);
      const out: Record<string, unknown> = { activeScenes: active, lang: currentLang(), save: JSON.parse(JSON.stringify(Save.data)) };
      const gs = gameScene();
      if (gs) out.game = gs.testGetState();
      return out;
    },
    startLevel(level: number): void {
      for (const key of ['Menu', 'Map', 'Result', 'Shop']) game.scene.stop(key);
      game.scene.start('Game', { level });
    },
    /** Tap a plate (auto-serve to its matching cat). */
    tap(plateId: number): void {
      gameScene()?.testTapPlate(plateId);
    },
    /** Serve a plate to a given cat (0 orange, 1 grey, 2 black-white). */
    serve(plateId: number, cat: number): void {
      gameScene()?.testServePlate(plateId, cat);
    },
    /** Press BOOST (slow-mo). */
    boost(): void {
      gameScene()?.testBoost();
    },
    /** Advance the sim by dt seconds without waiting on rAF (see testStep). */
    step(dt: number): void {
      gameScene()?.testStep(dt);
    },
    /** The level's spawn schedule (plate ids, kinds, colours, times). */
    schedule(): unknown {
      return gameScene()?.testSchedule() ?? [];
    },
    save(): unknown {
      return JSON.parse(JSON.stringify(Save.data));
    },
    resetSave(): void {
      Save.data = defaultSave();
      void Save.write();
    },
  };
  (window as unknown as { __game: unknown }).__game = handle;
}
