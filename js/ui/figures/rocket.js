// Rocket figure: every right letter adds a part to the rocket. Every miss
// uses up fuel. With all letters found, the rocket launches!

const PART_COUNT = 7;

export function createRocket(container) {
  container.innerHTML = `
    <svg class="figure figure-rocket" viewBox="0 0 200 200" role="img">
      <g class="space"><circle cx="30" cy="30" r="2"/><circle cx="60" cy="58" r="1.5"/><circle cx="150" cy="20" r="2"/><circle cx="40" cy="120" r="1.5"/><circle cx="138" cy="70" r="1.5"/></g>
      <g class="rocket">
        <path class="flame" d="M90 156q10 40 20 0z"/>
        <path class="part body" data-part="1" d="M82 120h36v36H82z"/>
        <path class="part body" data-part="2" d="M82 84h36v36H82z"/>
        <path class="part nose" data-part="3" d="M82 84q18-48 36 0z"/>
        <circle class="part window" data-part="4" cx="100" cy="102" r="9"/>
        <path class="part fin" data-part="5" d="M82 128l-16 28h16z"/>
        <path class="part fin" data-part="6" d="M118 128l16 28h-16z"/>
        <rect class="part stripe" data-part="7" x="82" y="136" width="36" height="6"/>
        <path class="outline" d="M82 156V84q18-48 36 0v72z"/>
      </g>
      <g class="smoke"><circle cx="78" cy="168" r="10"/><circle cx="100" cy="174" r="12"/><circle cx="122" cy="168" r="10"/></g>
      <rect class="pad" x="58" y="166" width="84" height="9" rx="4.5"/>
      <g class="fuel"><rect class="fuel-frame" x="164" y="44" width="18" height="124" rx="6"/><g class="fuel-cells"></g></g>
    </svg>`;

  const svg = container.querySelector("svg");
  const parts = [...svg.querySelectorAll(".part")];
  const cells = svg.querySelector(".fuel-cells");
  let cellCount = 0;

  function drawFuelCells(lives) {
    const gap = 3;
    const height = (116 - gap * (lives - 1)) / lives;
    cells.innerHTML = Array.from({ length: lives }, (_, i) =>
      `<rect class="fuel-cell" x="168" y="${(164 - (i + 1) * height - i * gap).toFixed(1)}" width="10" height="${height.toFixed(1)}" rx="2"/>`
    ).join("");
    cellCount = lives;
  }

  function update({ misses, lives, revealed = 0, total = 1, instant }) {
    if (cellCount !== lives) drawFuelCells(lives);
    const built = Math.ceil((revealed / total) * PART_COUNT);
    parts.forEach((part) => part.classList.toggle("is-on", Number(part.dataset.part) <= built));
    // Empty fuel cells from the top
    [...cells.children].forEach((cell, index) => cell.classList.toggle("is-empty", index >= lives - misses));
    if (misses > 0 && !instant) {
      svg.classList.remove("is-shaking");
      void svg.getBoundingClientRect();
      svg.classList.add("is-shaking");
    }
    svg.setAttribute("aria-label", `${built} / ${PART_COUNT}`);
  }

  return {
    update,
    win: () => {
      parts.forEach((part) => part.classList.add("is-on"));
      svg.classList.add("is-won");
    },
    lose: () => svg.classList.add("is-lost"),
    winSound: "launch",
    loseSound: "lose",
    delay: 1500,
  };
}
