// Balloon figure: it loses air with every miss, pops when all lives are gone
// and floats away on a win.
import { stepsFor, STEPS } from "./steps.js";

export function createBalloon(container) {
  container.innerHTML = `
    <svg class="figure figure-balloon" viewBox="0 0 200 200" role="img">
      <g class="sky">
        <path d="M24 52a10 10 0 0 1 18-6 12 12 0 0 1 22 6z"/>
        <path d="M146 92a9 9 0 0 1 16-5 11 11 0 0 1 20 5z"/>
      </g>
      <g class="balloon-flyer">
        <path class="string" d="M100 134c-9 14 9 26 0 52"/>
        <g class="balloon">
          <ellipse class="balloon-body" cx="100" cy="78" rx="44" ry="52"/>
          <ellipse class="balloon-shine" cx="82" cy="56" rx="9" ry="17" transform="rotate(-22 82 56)"/>
          <path class="balloon-knot" d="M94 129l6 7 6-7z"/>
        </g>
        <g class="puff"><path d="M88 142l-8 6M100 146v9M112 142l8 6"/></g>
        <g class="burst"><path d="M100 40v-18M100 116v18M62 78H44M138 78h18M72 50L60 38M128 50l12-12M72 106l-12 12M128 106l12 12"/></g>
      </g>
      <ellipse class="ground" cx="100" cy="190" rx="40" ry="5"/>
    </svg>`;

  const svg = container.querySelector("svg");
  const balloon = svg.querySelector(".balloon");
  let lastStep = 0;

  function update({ misses, lives, instant }) {
    const step = stepsFor(misses, lives);
    const scale = 1 - step * 0.055;
    balloon.style.transform = `scale(${scale.toFixed(3)})`;
    // A little wobble and a puff of air on every miss
    if (step > lastStep && !instant) {
      svg.classList.remove("is-leaking");
      void svg.getBoundingClientRect();
      svg.classList.add("is-leaking");
    }
    lastStep = step;
    svg.setAttribute("aria-label", `${step} / ${STEPS}`);
  }

  return {
    update,
    win: () => svg.classList.add("is-won"),
    lose: () => svg.classList.add("is-lost"),
    winSound: "win",
    loseSound: "pop",
    delay: 1100,
  };
}
