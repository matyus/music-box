import { World, Bodies, Query, Composite } from 'matter-js';

const fountains = {};

function addBall(world, render, x, y, isStatic = false) {
  let ball = Bodies.circle(x, isStatic ? y : y + 20, 10, {
    friction: 0,
    restitution: 1,
    density: 1,
    isStatic
  });

  ball.plugin.wrap = {
    min: { x: render.bounds.min.x, y: render.bounds.min.y },
    max: { x: render.bounds.max.x, y: render.bounds.max.y }
  };

  World.add(world, ball);

  return ball
}


export function addFountain(world, render, x, y, delay, key = Object.keys(fountains).length) {
  const head = addBall(world, render, x, y, true);
  const body = window.setInterval(addBall, delay, world, render, x, y);

  head.interval = body;

  fountains[key] = {
    head,
    body
  }

  console.log('after', fountains);
};

export function removeFountain(world, event) {
  const { x, y } = event.source.constraint.pointA;

  const bodies = Object.values(fountains).map(fountain => fountain.head);

  const body = Query.point(bodies, { x, y })[0];

  if (body) {
    window.clearInterval(body.interval);

    Composite.remove(world, body);
  }
}



