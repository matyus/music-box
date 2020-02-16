# Phaser 3 Tutorial

Following the [Making your first Phaser 3 game](https://phaser.io/tutorials/making-your-first-phaser-3-game/part1) except using [ES6](https://en.wikipedia.org/wiki/ECMAScript) and [Parcel](https://parceljs.org/).

## Getting started

### Prerequsites

- node10
- `yarn`
- `parcel`

### Installation

```
yarn install
```

### Server

Please look to [package.json](./package.json) for all the commands:

```
yarn dev
```

## Parcel concepts

- The entry point is [src/index.html](./src/index.html).
- "Everything" is in [src/app/](./src/app/).

## Architecture

- Each Scene gets its own file: [src/app/scenes/](./src/app/scenes/) and must extend `Phaser.Scene`.
- Because of Parcel/ES6, image paths must use `require`. (e.g. `this.load.image('sky', require('../assets/sky.png'));`)

## Phaser concepts

### Order of operations

- `constructor` gets called for all the Scenes up front when the app initializes and then never again. This is also where you name the key for your Scene.
- When a scene is loaded:
  - init
  - preload
  - create
  - update (this gets called basically on every frame).

source: [Phaser.Types.Scenes](https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html)

### Keyboard input

You get this for free using `createCursorKeys()` in the `create` method:

```js
cursors = this.input.keyboard.createCursorKeys();
```

source: [Phaser.Input.Keyboard.KeyboardPlugin](https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html#createCursorKeys__anchor)

Then you can refer to the actual keypresses in the `update` method:

```js
if (cursors.left.isDown) {
```

### Gravity and Floors/Walls/Boundaries

Gravity is a config thing, so once you `add` objects to the scene, they'll naturally fall in the direction of gravity:

```js
new Phaser.Game({
  // …
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true
    }
  }
  // …
});
```

Once that is established you need to setup some boundaries.

Use `staticGroup()` for the the "load bearing walls":

```js
platforms = this.physics.add.staticGroup();
```

source: [Phaser.Physics.Arcade.StaticGroup](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.StaticGroup.html)

Then setup your character to respect the physics using `collider`:

```js
this.physics.add.collider(player, platforms);
```

source: [Phaser.Physics.Arcade.Collider](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Collider.html)

### Colliding with actionables

If you want to take an action when your character collides (read: overlaps) with something, then you need to setup a callback:

```js
this.physics.add.overlap(player, stars, this.collectStar, null, this);
```

source: [Phaser.Physics.Arcade.ArcadePhysics](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.ArcadePhysics.html#overlap__anchor)

### Groups

You can group a bunch of things together, for instance a collection of stars:

```js
stars = this.physics.add.group({
  key: 'star',
  repeat: 11,
  setXY: { x: 12, y: 0, stepX: 70, stepY: 10 }
});
```

source: [GroupCreateConfig](https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Group.html#.GroupCreateConfig__anchor)

### Random numbers

Phaser makes it easy to semi-randomly scatter things around:

```js
Phaser.Math.Between(400, 800)
```

source: [Phaser.Math](https://photonstorm.github.io/phaser3-docs/Phaser.Math.html#.Between__anchor)

### Passing data between Scenes

Sending scene:

```js
// level.js

this.scene.start('<scene name>', { foo: 100, bar: false });
```

source: [Phaser.Plugins.BasePlugin](https://photonstorm.github.io/phaser3-docs/Phaser.Plugins.BasePlugin.html#start)

Receiving scene:

```js
// menu.js

init (data) {
  this.foo = data.foo;
  this.bar = data.bar;
}
```

## Resources

- [https://phaser.io/tutorials/making-your-first-phaser-3-game/part1]()
- [https://photonstorm.github.io/phaser3-docs/index.html#toc3__anchor]()
- [https://github.com/samme/phaser-parcel]()
- [http://labs.phaser.io/edit.html?src=src%5Cscenes%5Cpassing%20data%20to%20a%20scene.js]()
- [https://github.com/parcel-bundler/parcel/issues/235]()


