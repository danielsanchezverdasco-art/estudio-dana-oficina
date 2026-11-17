import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import MapScene from './scenes/MapScene';
import GameScene from './scenes/GameScene';
import ResultsScene from './scenes/ResultsScene';
import { initBridge } from './bridge/bridge';

// Production build exposes NO window.* globals of its own.
// (The Playgama Bridge script itself sets window.bridge — that is the
// platform SDK, loaded from public/playgama-bridge.js.)

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#1a5c8a',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: 390,
    height: 844,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [BootScene, MenuScene, MapScene, GameScene, ResultsScene],
  disableContextMenu: true,
};

// Initialise the Bridge BEFORE the engine starts (same as Scribble Striker
// and Marble Rush): the r1 build initialised it inside BootScene, after a
// font wait of up to 2.5 s, so game_ready could arrive after Playgama's QA
// window had already closed ("Game Ready signal check failed").
void (async () => {
  await initBridge();
  new Phaser.Game(config);
})();
