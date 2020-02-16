import { Scene } from 'phaser';

const fontStyles = {
  color: '#000000',
  fontFamily: 'monospace'
};

let
  cursors,
  player,
  platforms,
  stars,
  score = 0,
  scoreText,
  bombs,
  gameOver = false,
  timeout;

export default class Level extends Scene {
  constructor (data) {
    console.log('constructor level', data);
    super({
      key: 'level'
    });

    window.clearTimeout(timeout);
  }

  init (data) {
    console.log('init level', data);
  }

  preload () {
    console.log('preload level');

    this.load.image('sky', require('../assets/sky.png'));
    this.load.image('ground', require('../assets/platform.png'));
    this.load.image('star', require('../assets/star.png'));
    this.load.image('bomb', require('../assets/bomb.png'));

    this.load.spritesheet('dude', require('../assets/dude.png'), { frameWidth: 32, frameHeight: 48 });
  }

  create () {
    console.log('create level');

    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    this.add.text(10, 10, 'Level 1', fontStyles).setOrigin(0, 0);
    scoreText = this.add.text(10, 30, `Score: ${score}`, fontStyles).setOrigin(0, 0);

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [
        { key: 'dude', frame: 4 }
      ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70, stepY: 10 }
    });

    stars.children.iterate(star => star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)));

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, this.collectStar, null, this);

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

  }

  update () {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }

  collectStar (player, star) {
    star.disableBody(true, true);

    score++;
    scoreText.setText(`Score: ${score}`);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(star => star.enableBody(true, star.x, 0, true, true));
    }

    const xAxis = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    let bomb = bombs.create(xAxis, 16, 'bomb');
    bomb.setBounce(0.2);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

  }

  hitBomb (player, bomb) {
    this.physics.pause();

    player.setTint(0xffff00);
    player.anims.play('turn');

    gameOver = true;

    timeout = window.setTimeout(() => {
      this.scene.start('menu', { previousScore: score })
    }, 1000);

    return this;
  }
}
