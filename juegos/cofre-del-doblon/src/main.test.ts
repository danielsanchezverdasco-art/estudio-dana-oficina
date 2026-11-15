// TEST BUILD ONLY — exposes the game instance for automated smoke tests.
// Never used in the production build (see vite.config.ts TEST_BUILD flag).

import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import MapScene from './scenes/MapScene';
import GameScene from './scenes/GameScene';
import ResultsScene from './scenes/ResultsScene';

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

const game = new Phaser.Game(config);
(window as unknown as { __game: Phaser.Game }).__game = game;
