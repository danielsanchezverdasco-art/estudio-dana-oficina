// Debug handle for the probing skill (probing-web-game-mechanics).
// DELIBERATE DECISION (documented): the handle exists ONLY in the test
// build (VITE_TEST_BUILD=1, outDir dist-test). The production build sets
// __TEST_BUILD__ to false and this module is tree-shaken away, so the
// production zip has no window.__* handle and no test parameters.
// Probing without it would only check "loads and doesn't crash", which the
// skill explicitly calls a smoke test in disguise — the mechanics (fit
// rule, growth ladder, pet steal, golden timing, star thresholds, chest
// every 3 levels, 30 solution playbacks) need the handle to be asserted.
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
    version: 'kitchen-hole-test-1',
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
    /** Drag the hole to (x, y) — the hole chases the point every frame. */
    dragTo(x: number, y: number): void {
      gameScene()?.testDragTo(x, y);
    },
    /** The level's solution waypoints (planned route, replayed by the harness). */
    solution(): unknown {
      return gameScene()?.testSolution() ?? [];
    },
    /** The 3-star route (golden-aware, holds the last object for goldens). */
    solution3(): unknown {
      return gameScene()?.testSolution3() ?? [];
    },
    /** Test only: sim time scale (speed up headless playback). */
    setTimeScale(scale: number): void {
      gameScene()?.testSetTimeScale(scale);
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
