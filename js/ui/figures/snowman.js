// Snowman figure: the sun comes out and the snowman melts a bit with every miss.
import { stepsFor, STEPS } from "./steps.js";

export function createSnowman(container) {
  container.innerHTML = `
    <svg class="figure figure-snowman" viewBox="0 0 200 200" role="img">
      <g class="sun"><circle cx="166" cy="34" r="14"/><path d="M166 12v-6M166 62v-6M144 34h-6M194 34h-6M150 18l-4-4M182 50l4 4M150 50l-4 4M182 18l4-4"/></g>
      <ellipse class="snow-ground" cx="100" cy="186" rx="84" ry="9"/>
      <ellipse class="puddle" cx="100" cy="186" rx="20" ry="5"/>
      <g class="snowman">
        <circle class="snow" cx="100" cy="150" r="32"/>
        <circle class="snow" cx="100" cy="102" r="24"/>
        <circle class="snow" cx="100" cy="64" r="18"/>
        <circle class="coal" cx="100" cy="96" r="2.6"/>
        <circle class="coal" cx="100" cy="108" r="2.6"/>
        <circle class="coal" cx="100" cy="146" r="2.6"/>
        <circle class="coal" cx="94" cy="60" r="2.2"/>
        <circle class="coal" cx="106" cy="60" r="2.2"/>
        <path class="mouth" d="M93 71q7 5 14 0"/>
        <path class="scarf" d="M83 80h34v7H83zM106 86h8v16h-8z"/>
        <g class="drop drop-arm-left"><path class="arm" d="M78 100L50 84M57 88l-7-8"/></g>
        <g class="drop drop-arm-right"><path class="arm arm-right" d="M122 100l28-16M143 88l7-8"/></g>
        <g class="drop drop-hat"><rect class="hat" x="85" y="34" width="30" height="16" rx="2"/><rect class="hat" x="78" y="48" width="44" height="5" rx="2.5"/><rect class="hat-band" x="85" y="44" width="30" height="4"/></g>
        <g class="drop drop-nose"><path class="nose" d="M100 64l17 3-17 4z"/></g>
      </g>
    </svg>`;

  const svg = container.querySelector("svg");
  const snowman = svg.querySelector(".snowman");
  const puddle = svg.querySelector(".puddle");
  const sun = svg.querySelector(".sun");
  // Which part drops off at which step
  const drops = [
    [3, svg.querySelector(".drop-arm-left")],
    [5, svg.querySelector(".drop-arm-right")],
    [7, svg.querySelector(".drop-hat")],
    [9, svg.querySelector(".drop-nose")],
  ];

  function update({ misses, lives }) {
    const step = stepsFor(misses, lives);
    snowman.style.transform = `scale(${1 + step * 0.02}, ${1 - step * 0.05})`;
    puddle.setAttribute("rx", 20 + step * 6);
    sun.style.opacity = String(0.15 + step * 0.085);
    drops.forEach(([from, part]) => part.classList.toggle("is-dropped", step >= from));
    svg.setAttribute("aria-label", `${step} / ${STEPS}`);
  }

  return {
    update,
    win: () => svg.classList.add("is-won"),
    lose: () => {
      snowman.style.transform = "";
      svg.classList.add("is-lost");
    },
    winSound: "win",
    loseSound: "lose",
    delay: 1000,
  };
}
