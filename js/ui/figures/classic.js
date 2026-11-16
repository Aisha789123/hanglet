// Classic figure: a wooden frame and a little person, drawn part by part.
import { stepsFor, STEPS } from "./steps.js";

export function createClassic(container) {
  container.innerHTML = `
    <svg class="figure figure-classic" viewBox="0 0 200 200" role="img">
      <ellipse class="ground" cx="96" cy="186" rx="84" ry="9"/>
      <rect class="part wood" data-step="1" x="30" y="174" width="96" height="11" rx="5.5"/>
      <rect class="part wood" data-step="2" x="52" y="24" width="11" height="156" rx="5.5"/>
      <rect class="part wood" data-step="3" x="52" y="20" width="92" height="11" rx="5.5"/>
      <path class="part wood-line" data-step="4" d="M60 66L98 28"/>
      <path class="part rope" data-step="5" d="M134 30c3 8-2 14 0 22"/>
      <g class="person">
        <g class="part" data-step="6">
          <circle class="head" cx="134" cy="68" r="16"/>
          <g class="face face-normal"><circle cx="128" cy="66" r="2.2"/><circle cx="140" cy="66" r="2.2"/><path d="M128.5 75.5q5.5-3 11 0"/></g>
          <g class="face face-happy"><path d="M126 66q2-3 4 0M138 66q2-3 4 0"/><path d="M127 73q7 7 14 0"/></g>
          <g class="face face-lost"><path d="M125.5 63.5l5 5M130.5 63.5l-5 5M137.5 63.5l5 5M142.5 63.5l-5 5"/><path d="M129 77h10"/></g>
        </g>
        <path class="part limb" data-step="7" d="M134 84v44"/>
        <path class="part limb" data-step="8" d="M114 108l20-14 20 14"/>
        <path class="part limb" data-step="9" d="M134 128l-15 30"/>
        <path class="part limb" data-step="10" d="M134 128l15 30"/>
      </g>
    </svg>`;

  const svg = container.querySelector("svg");
  const parts = [...svg.querySelectorAll(".part")];

  function update({ misses, lives }) {
    const shown = stepsFor(misses, lives);
    let delay = 0;
    parts.forEach((part) => {
      const visible = Number(part.dataset.step) <= shown;
      if (visible && !part.classList.contains("is-on")) {
        part.style.transitionDelay = `${delay}ms`;
        delay += 120;
      }
      part.classList.toggle("is-on", visible);
    });
    svg.setAttribute("aria-label", `${shown} / ${STEPS}`);
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
