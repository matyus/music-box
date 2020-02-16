# music box with matter.js

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

## App concepts

- The entry point is [src/index.html](./src/index.html).
- "Everything" is in [src/app/](./src/app/).

## Architecture

- This is hack project so everything is dumped into the `constructor`.
- Because of Parcel/ES6, image paths must use `require`. (e.g. `this.load.image('sky', require('../assets/sky.png'));`)

## matter.js concepts

### Order of operations

- Engine
- Render
- Runner
- World
- Events

### Other

- This project uses a plugin that adds support for event handling based on object collisions.
