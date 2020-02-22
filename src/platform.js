import { Composite, World, Body, Bodies, Query } from 'matter-js';

import { playSound } from './sound.js';
import { getSelectedSoundId, getRotation } from './controls.js';

const platforms = {};
let platformDiagram = null;

function handleCollision(pair) {
  const { bodyA, bodyB } = pair;
  const { id } = bodyA.label === "Rectangle Body" ? bodyA : bodyB;
  const { soundId } = platforms[id];

  playSound(soundId);
}

function createPlatform(world, x, y, angle) {
  var body = Bodies.rectangle(x, y, 50, 10, {
    angle,
    render: {
      fillStyle: 'white'
    },
    isStatic: true,
  });

  platforms[body.id] = {
    body,
    soundId: getSelectedSoundId()
  }

  body.onCollide(handleCollision);

  World.add(world, body);
};

export function addPlatform(world, event) {
  const { x, y } = event.source.constraint.pointA;
  const angle = getRotation();

  createPlatform(world, x, y, angle);
};

export function removePlatform(world, event) {
  const { x, y } = event.source.constraint.pointA;
  const bodies = Object.values(platforms).map(platform => platform.body);
  const body = Query.point(bodies, { x, y })[0];

  if (body) {
    Composite.remove(world, body);
  }
};

export function updatePlatformSound(world, event) {
  const { x, y } = event.source.constraint.pointA;
  const bodies = Object.values(platforms).map(platform => platform.body);
  const platformId = Query.point(bodies, { x, y })[0].id;

  platforms[platformId].soundId = getSelectedSoundId();
}

export function updatePlatformAngle(world, event, angle) {
  const { x, y } = event.source.constraint.pointA;
  const bodies = Object.values(platforms).map(platform => platform.body);
  const body = Query.point(bodies, { x, y })[0];

  if (body) {
    Body.setAngle(body, angle);
  }
}

export function buildPlatformDiagram(world) {
  platformDiagram = Bodies.rectangle(30, 20, 25, 5, {
    isStatic: true,
    render: {
      strokeStyle: 'gray',
      lineWidth: 3
    },
    angle: getRotation()
  })

  World.add(world, platformDiagram);
}

export function updatePlatformDiagram(angle) {
  Body.setAngle(platformDiagram, angle);
}
