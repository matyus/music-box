import Phaser from 'phaser';
import { menu, level } from './scenes';

export default class App {
  constructor(config) {
    return new Phaser.Game({
      ...config,
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
          debug: true
        }
      },
      scene: [
        menu,
        level
      ]
    });
  }
}
