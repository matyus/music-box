import controls from './controls.css';

import { getSounds, getSoundMap } from './sound.js';
import { updatePlatformDiagram } from './platform.js';

let selectedSoundId = 0;

let currentSound = null;
let currentSoundLabel = null;
let currentSoundInput = null;

let currentKey = null;
let currentKeyLabel = null;
let currentKeyInput = null;

let delay = 1000;
let delayLabel = null;
let delayInput = null;

let rotate = 0.3;
let rotateLabel = null;
let rotateInput = null;

export function getSelectedSoundId() {
  return selectedSoundId;
}

export function getCurrentKey() {
  return currentKey;
}

export function getDelay() {
  return delay;
}

export function getRotation() {
  return rotate;
}

export function setCurrentKey(key) {
  currentKey = key;

  let element = document.getElementById('key');
  element.value = key;
}

export function updateCurrentKey(key) {
  currentKey = key;
  currentKeyInput.value = key;
}

export function buildControls(element) {
  const soundMap = getSoundMap();

  currentSoundLabel = document.createElement('label');
  currentSoundLabel.innerText = "sound";

  const currentSelectInput = document.createElement('select');

  currentSelectInput.id = 'select-sound';
  currentSelectInput.addEventListener('change', event => { console.log('select');  selectedSoundId = event.target.selectedOptions[0].value });

  for (const key in soundMap) {
    const option = document.createElement('option');
    option.value = key;
    option.text = getSounds()[key].name;

    currentSelectInput.add(option);
  }

  currentSoundLabel.append(currentSelectInput);

  element.append(currentSoundLabel);

  currentKeyLabel = document.createElement('label');
  currentKeyLabel.innerText = "current key";

  currentKeyInput = document.createElement('input');
  currentKeyInput.readOnly = true;
  currentKeyInput.disabled = true;
  currentKeyInput.value = getCurrentKey();

  currentKeyLabel.append(currentKeyInput);

  element.append(currentKeyLabel);

  delayLabel = document.createElement('label');
  delayLabel.innerText = "delay (ms)";

  delayInput = document.createElement('input');
  delayInput.type = "number";
  delayInput.value = getDelay();
  delayInput.addEventListener('keyup', event => { console.log('keyup', event); delay = event.target.value });

  delayLabel.append(delayInput);

  element.append(delayLabel);

  rotateLabel = document.createElement('label');
  rotateLabel.innerText = "rotate (angle)";

  rotateInput = document.createElement('input');
  rotateInput.type = "range";
  rotateInput.min = -1;
  rotateInput.max = 1;
  rotateInput.step = 0.01;
  rotateInput.value = getRotation();
  rotateInput.addEventListener('change', event => {
    rotate = event.target.value
    console.log(rotate);
    updatePlatformDiagram(rotate);
  });

  rotateLabel.append(rotateInput);

  element.append(rotateLabel);
}

