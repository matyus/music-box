import Matter, { Engine, Events, Render, World, Bodies, Composites, Constraint, Mouse, MouseConstraint } from 'matter-js'; // eslint-disable-line
import { MatterCollisionEvents } from 'matter-collision-events';

import { buildPlatformDiagram, addPlatform, updatePlatformSound, updatePlatformAngle, removePlatform } from './platform.js';
import { addFountain, removeFountain } from './fountain.js';
import { buildControls, getCurrentKey, updateCurrentKey, getDelay, getRotation } from './controls.js';

Matter.use(MatterCollisionEvents);


export default function Game(element) {
  window.addEventListener("keydown", event => { updateCurrentKey(event.key) });

  // create an engine
  var engine = Engine.create();

  engine.world.gravity.y = .5;
  engine.world.gravity.x = 0;

  // create a renderer
  var render = Render.create({
    element,
    engine,
    options: {
      width: window.innerWidth,
      wireframes: false
    },
    showDebug: true,
    showVelocity: true,
    showShadows: true,
    showMousePosition: true
  });

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

  var mouse = Mouse.create(render.canvas);
  var mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 1,
      render: {
        visible: true
      }
    }
  });

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  Events.on(mouseConstraint, "mouseup", event => {
    switch (getCurrentKey()) {
      case "p":
        addPlatform(engine.world, event);
        break;
      case "P":
        removePlatform(engine.world, event);
        break;
      case "u":
        updatePlatformAngle(engine.world, event, getRotation());
        break;
      case "s":
        updatePlatformSound(engine.world, event);
        break;
      case "f":
        const { x, y } = event.source.constraint.pointA;

        addFountain(engine.world, render, x, y, getDelay());
        break;
      case "F":
        removeFountain(engine.world, event);
        break;
      default: return null;
    }
  });

  // add all of the bodies to the world
  World.add(engine.world, mouseConstraint);

  buildControls(document.getElementById('controls'));
  buildPlatformDiagram(engine.world);
}
