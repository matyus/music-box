# music box

## Artist statement

This is the most annoying game ever, if you wield it irresponsibly.

You can experience this game here: [https://matyus.github.io/music-box](https://matyus.github.io/music-box).

## Getting started

```
yarn install
yarn start
```

## Building docs

```
yarn build
```

**Note:** The GitHub pages are built using an absolute url to `https://matyus.github.io/music-box/`.

## Core concepts

Component | Purpose
----------|--------
Fountain | Continually emits balls at the specified **delay**.
Platform | Refracts balls and can be placed at any **angle**. Plays a **sound** upon each ball collision.

## How to make music

- Add a **fountain** by clicking `f` on the keyboard and clicking anywhere on the screen
- Remove a **fountain** by clicking `F` on the keyboard and clicking on the **fountain** you want to remove
- Add a **platform** by clicking `p` on the keyboard and clicking anywhere on the screen
- Remove a **platform** by clicking `P` on the keyboard and clicking on the **platform** you want to remove
- Update the **angle** of a **platform** by selecting a new **angle**, pressing `u` on the keyboard, and then clicking on the **platform** you want to update
- Update the sound of an existing platform by choosing the new **sound** in the dropdown, pressing `s` on the keyboard, and then clicking on the **platform** you want to update

