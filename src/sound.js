import { Howl } from 'howler';

import { SOUNDS } from './sounds/mario.js';

const soundMap = {};

export function getSounds() {
  return SOUNDS;
}

export function getSoundMap() {
  SOUNDS.forEach((sound, index) => soundMap[index] = new Howl({ src: sound.path }));
  return soundMap;
}

export function playSound(soundId) {
  soundMap[soundId].play();
}
