import Matter, {
  Engine,
  Events,
  Render,
  Runner,
  Composite,
  Composites,
  Common,
  MouseConstraint,
  Mouse,
  Query,
  World,
  Bodies
} from "matter-js";

import { MatterCollisionEvents } from "matter-collision-events";

import { Howl, Howler } from 'howler';

//import { SOUNDS } from "./sounds/why.js";
import { SOUNDS } from "./sounds/super-mario.js";
//import { SOUNDS } from "./sounds/random.js";


// which is was pressed last?
let key = null;

// store the sounds has a hash map
let soundMap = {};
let selectedSound = 1;

// store all the objects that the balls will bounce off of
const obstructions = {};

const fountains = {}

// create the hash map of all the sounds
function buildSoundMap(sounds) {

  const struct = {};

  sounds.forEach((file, index) => {
    struct[index + 1] = new Howl({ src: [file] })
  });

  return struct;
};

function renderSoundSelect(soundMap) {
  const select = document.createElement("select");
  select.id = "select-sound";
  select.addEventListener('change', event => {
    selectedSound = event.target.selectedOptions[0].value;
  });

  for (const key in soundMap) {
    const option = document.createElement("option");
    option.value = key;
    option.text = soundMap[key]._src;

    select.add(option);
  }

  document.body.append(select);

}

function nextSound(body, sound) {
  const currentSound = obstructions[body.id].sound;

  obstructions[body.id].sound = sound;
}

function detectObstructionCreation({ startX, startY, endX, endY }) {
  return !(startX === endX && startY === endY);
};

function setObstructionSound(body, sound = selectedSound) {
  obstructions[body.id] = {
    body,
    sound
  }
};

function getObstructionBodies() {
  return Object.values(obstructions).map(obstruction => obstruction.body);
};

function renderObstuction(coords, world) {
  buildRectangle(world, coords, getSlope(coords));
};

function destroyObstruction(body, world) {
  Composite.remove(world, body);
};

function buildRectangle(world, coords, slope) {
  const rectangle = Bodies.rectangle(coords.startX + 45, coords.startY - 10, getLength(coords), 10, { isStatic: true, angle: slope });

  rectangle.onCollide(pair => handleCollide(pair));

  setObstructionSound(rectangle);

  World.add(world, [ rectangle ]);
};

function buildFountain(world, render, x = 20, y = 20, delay, key = Object.keys(fountains).length) {
  const input = document.createElement('input');
  input.type = "number";
  input.value = delay;

  input.addEventListener('keyup', event => {
    if (event.key === "Enter") {
      updateFountain(world, render, x, y, event.target.value, key);
    }
  });

  fountains[key] = {
    delay,
    input,
    interval: setInterval(addBall, delay, world, render, { x, y }),
  }


  document.body.appendChild(input);

}

function updateFountain(world, render, x, y, delay, key) {
  clearInterval(fountains[key].interval);
  fountains[key].input.remove();
  buildFountain(world, render, x, y, delay, key);
}

function handleCollide({ bodyA, bodyB }) {
  const obstruction = (bodyA.label === "Rectangle Body") ? bodyA : bodyB

  soundMap[obstructions[obstruction.id].sound].play();
};


const getSlope = ({ startX, startY, endX, endY }) => {
  const a = startY - endY;
  const b = startX - endX;

  if (a === 0 && b === 0) {
    return 0;
  }

  return a / b

};

const getLength = ({ startX, startY, endX, endY }) => {
  const a = startX - endX;
  const b = startY - endY;

  if (a === 0 && b === 0) {
    return 0;
  }

  return Math.sqrt(a*a + b*b);
};

const addBall = (world, render, config) => {

  const ball = Bodies.circle(config.x, config.y, 10, {
    friction: 0,
    restitution: 1,
    density: 1
  });

    ball.plugin.wrap = {
      min: { x: render.bounds.min.x, y: render.bounds.min.y },
      max: { x: render.bounds.max.x, y: render.bounds.max.y }
    };

    World.add(world, ball);

};

export default class App {
  constructor() {
    console.log({
      Engine,
      Events,
      Render,
      Runner,
      Composite,
      Composites,
      Common,
      Matter,
      MouseConstraint,
      Mouse,
      Query,
      World,
      Bodies
    });

    Matter.use(MatterCollisionEvents);

    soundMap = buildSoundMap(SOUNDS);
    renderSoundSelect(soundMap);

    // create engine
    var engine = Engine.create();
    var world = engine.world;

    // create renderer
    var render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 1000,
        height: 600,
        showAngleIndicator: true,
        showCollisions: true
      }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // drop a ball
    buildFountain(world, render, 200, 20, 2000);
    buildFountain(world, render, 400, 20, 1000);
    buildFountain(world, render, 600, 20, 500);
    buildFountain(world, render, 800, 20, 4000);

    // add mouse control
    var mouse = Mouse.create(render.canvas);
    var mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    var coords = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    };

    Events.on(mouseConstraint, "mousedown", function (event) {
      const { x, y } = event.source.constraint.pointA;

      coords.startX = x;
      coords.startY = y;
    });

    Events.on(mouseConstraint, "mouseup", function (event) {
      const { x, y } = event.source.constraint.pointA;

      coords.endX = x
      coords.endY = y

      if (detectObstructionCreation(coords)) {
        renderObstuction(coords, world);
      } else {
        const bodies = Query.point(getObstructionBodies(), { x, y });

        if (bodies.length > 0) {
          switch (key) {
            case "Shift":
              destroyObstruction(bodies[0], world);
              break;
            default: nextSound(bodies[0], selectedSound)
          }
        }
      }
    });

    window.addEventListener('keydown', event => {
      key = event.key;
    });

    window.addEventListener('keyup', event => {
      key = null;
    });

  }
}
