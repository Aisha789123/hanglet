// All figures share the same small interface:
//   const figure = createFigure("balloon", container);
//   figure.update({ misses, lives, revealed, total });
//   figure.win();  figure.lose();
// Each figure also says which sound fits its win and lose animation.
import { createClassic } from "./classic.js";
import { createBalloon } from "./balloon.js";
import { createFlower } from "./flower.js";
import { createSnowman } from "./snowman.js";
import { createRocket } from "./rocket.js";

export { STEPS, stepsFor } from "./steps.js";

const CREATORS = {
  classic: createClassic,
  balloon: createBalloon,
  flower: createFlower,
  snowman: createSnowman,
  rocket: createRocket,
};

export function createFigure(id, container) {
  const create = CREATORS[id] || CREATORS.classic;
  container.innerHTML = "";
  return create(container);
}

// A small still picture of a figure, for the settings shop
export function figurePreview(id, container) {
  const figure = createFigure(id, container);
  figure.update({ misses: 2, lives: 6, revealed: 4, total: 6, instant: true });
  container.querySelector("svg")?.setAttribute("aria-hidden", "true");
  return figure;
}
