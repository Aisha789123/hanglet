// The hangman drawing (SVG). It always has 10 parts. With fewer lives,
// one miss shows more than one part, so the drawing is full on the last miss.

const PARTS = [
  '<line x1="24" y1="186" x2="120" y2="186"/>', // base
  '<line x1="52" y1="186" x2="52" y2="18"/>', // pole
  '<line x1="52" y1="18" x2="136" y2="18"/>', // beam
  '<line x1="136" y1="18" x2="136" y2="44"/>', // rope
  '<circle cx="136" cy="60" r="16"/>', // head
  '<line x1="136" y1="76" x2="136" y2="126"/>', // body
  '<line x1="136" y1="90" x2="114" y2="112"/>', // left arm
  '<line x1="136" y1="90" x2="158" y2="112"/>', // right arm
  '<line x1="136" y1="126" x2="118" y2="158"/>', // left leg
  '<line x1="136" y1="126" x2="154" y2="158"/>', // right leg
];

export function createHangman(container) {
  // Faint "ghost" parts show how much is left, the real parts draw on top
  const ghost = PARTS.join("");
  const parts = PARTS.map((part, index) =>
    part.replace(/\/>$/, ` class="part${index < 4 ? " part-frame" : ""}" pathLength="1"/>`)
  ).join("");

  container.innerHTML = `
    <svg class="hangman" viewBox="0 0 180 200" role="img" aria-label="Hangman drawing, 0 of 10 parts">
      <g class="hangman-ghost">${ghost}</g>
      <g>${parts}</g>
    </svg>`;

  const svg = container.querySelector("svg");
  const partElements = [...svg.querySelectorAll(".part")];
  let shown = 0;

  function update(misses, lives) {
    const target = misses >= lives ? PARTS.length : Math.ceil((misses * PARTS.length) / lives);
    partElements.forEach((part, index) => {
      const visible = index < target;
      // New parts draw one after another
      part.style.transitionDelay = visible && index >= shown ? `${(index - shown) * 120}ms` : "0ms";
      part.classList.toggle("is-drawn", visible);
    });
    shown = target;
    svg.setAttribute("aria-label", `Hangman drawing, ${target} of ${PARTS.length} parts`);
  }

  return { update };
}
