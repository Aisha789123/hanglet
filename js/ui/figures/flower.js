// Flower figure: a happy flower in a pot that loses one petal at a time.
import { stepsFor, STEPS } from "./steps.js";

// Petals fall in this order, so the flower stays balanced
const FALL_ORDER = [0, 5, 2, 7, 4, 9, 1, 6, 3, 8];

export function createFlower(container) {
  const petals = Array.from({ length: 10 }, (_, i) =>
    `<g transform="rotate(${i * 36} 100 70)"><ellipse class="petal" data-index="${i}" cx="100" cy="44" rx="10" ry="20"/></g>`
  ).join("");

  container.innerHTML = `
    <svg class="figure figure-flower" viewBox="0 0 200 200" role="img">
      <ellipse class="ground" cx="100" cy="192" rx="60" ry="5"/>
      <g class="plant">
        <path class="stem" d="M100 166c-4-26 6-44 0-74"/>
        <path class="leaf" d="M100 140c-18-2-30-12-32-26 16 0 28 10 32 26z"/>
        <path class="leaf" d="M101 122c16-4 26-14 28-28-14 2-25 12-28 28z"/>
        <g class="flower-head">
          ${petals}
          <circle class="flower-center" cx="100" cy="70" r="15"/>
          <g class="flower-face"><circle cx="95" cy="67" r="1.8"/><circle cx="105" cy="67" r="1.8"/><path d="M95 74q5 4 10 0"/></g>
        </g>
      </g>
      <path class="pot" d="M74 162h52l-7 30H81z"/>
      <rect class="pot-rim" x="70" y="156" width="60" height="10" rx="4"/>
    </svg>`;

  const svg = container.querySelector("svg");
  const petalElements = [...svg.querySelectorAll(".petal")];

  function update({ misses, lives }) {
    const step = stepsFor(misses, lives);
    FALL_ORDER.forEach((index, order) => {
      petalElements[index].classList.toggle("is-fallen", order < step);
    });
    svg.setAttribute("aria-label", `${step} / ${STEPS}`);
  }

  return {
    update,
    win: () => svg.classList.add("is-won"),
    lose: () => svg.classList.add("is-lost"),
    winSound: "win",
    loseSound: "lose",
    delay: 900,
  };
}
