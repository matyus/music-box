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

const SCALE = [
  require('./assets/Why/Note01.wav'),
  require('./assets/Why/Note02.wav'),
  require('./assets/Why/Note03.wav'),
  require('./assets/Why/Note04.wav'),
  require('./assets/Why/Note05.wav'),
  require('./assets/Why/Note06.wav'),
  require('./assets/Why/Note07.wav'),
  require('./assets/Why/Note08.wav'),
  require('./assets/Why/Note09.wav'),
  require('./assets/Why/Note10.wav'),
  require('./assets/Why/Note11.wav'),
  require('./assets/Why/Note12.wav')
];

// which is was pressed last?
let key = null;

// store the sounds has a hash map
let scaleMap = {};

// store all the objects that the balls will bounce off of
const obstructions = {};

const fountains = {}

// create the hash map of all the sounds
const buildScaleMap = () => {

  const struct = {};

  SCALE.forEach((file, index) => {
    struct[index + 1] = new Howl({ src: [file] })
  });

  return struct;
};

function nextSound(body) {
  const currentSound = obstructions[body.id].sound;

  obstructions[body.id].sound = currentSound >= SCALE.length ? 1 : currentSound + 1;
}

function detectObstructionCreation({ startX, startY, endX, endY }) {
  return !(startX === endX && startY === endY);
};

function setObstructionSound(body, sound = 1) {
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

function buildFountain(world, render, x = 20, y = 20, key = Object.keys(fountains).length) {
  fountains[key] = setInterval(addBall, 1000, world, render, { x, y });
  console.log({ fountains });
}

function handleCollide({ bodyA, bodyB }) {
  const obstruction = (bodyA.label === "Rectangle Body") ? bodyA : bodyB

  scaleMap[obstructions[obstruction.id].sound].play();
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

    scaleMap = buildScaleMap();

    // create engine
    var engine = Engine.create();
    var world = engine.world;

    // create renderer
    var render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
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
    buildFountain(world, render);
    buildFountain(world, render, 200, 20);
    buildFountain(world, render, 400, 20);
    buildFountain(world, render, 600, 20);

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
            default: nextSound(bodies[0])
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
