import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import MapScene from './scenes/MapScene';
import GameScene from './scenes/GameScene';
import ResultsScene from './scenes/ResultsScene';

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

new Phaser.Game(config);
