import { Scene } from 'phaser';

const fontStyles = {
  color: '#000000',
  fontFamily: 'monospace'
};

export default class Menu extends Scene {
  constructor (data) {
    console.log('constructor', data);

    super({
      key: 'menu'
    });

  }

  init (data) {
    console.log('init menu', data);
    this.previousScore = data.previousScore;
  }

  preload () {
    console.log('preload menu');
  }

  create () {
    console.log('create menu');
    this.add.text(10, 10, 'Press any key to start', fontStyles).setOrigin(0, 0);
    if (this.previousScore) {
      this.add.text(10, 30, `Previous score ${this.previousScore}`, fontStyles).setOrigin(0, 0);
    }

    this.input.keyboard.on('keyup', () => {
      this.scene.start('level');
    });
  }

  update () {
  }
}
