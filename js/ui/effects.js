// Small "juicy" effects: particles, floating combo text and flying stars.
// Nothing happens when the player asked for less motion.
import { isReducedMotion } from "./appearance.js";
import { bringToFront } from "./celebrations.js";

const COLORS = ["#ffc531", "#ff6b4a", "#22b573", "#3fa9f5", "#ef4f8b"];

let layer = null;

// One fixed layer on top of everything (also above open dialogs) for all effects
function getLayer() {
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "effects-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.setAttribute("popover", "manual");
    document.body.appendChild(layer);
  }
  bringToFront(layer);
  return layer;
}

// Little pieces that burst out of an element (used on right letters)
export function burst(element, count = 10) {
  if (isReducedMotion() || !element) return;
  const box = element.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const effects = getLayer();
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const distance = 30 + Math.random() * 30;
    piece.className = i % 3 === 0 ? "particle particle-star" : "particle";
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.background = COLORS[i % COLORS.length];
    piece.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    effects.appendChild(piece);
    setTimeout(() => piece.remove(), 700);
  }
}

// Big text that pops up and floats away, e.g. "Combo x3"
export function floatText(container, text, tone = "sun") {
  const label = document.createElement("span");
  label.className = `float-text float-${tone}`;
  label.textContent = text;
  container.appendChild(label);
  setTimeout(() => label.remove(), isReducedMotion() ? 900 : 1300);
}

// Stars that fly from an element to the star counter in the header.
// Calls onArrive once, when the first star lands.
export function flyStars(fromElement, amount, onArrive) {
  const target = document.getElementById("header-stars");
  if (!fromElement || !target || isReducedMotion()) {
    onArrive?.();
    return;
  }
  const from = fromElement.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const count = Math.min(6, Math.max(1, amount));
  let arrived = false;
  const effects = getLayer();
  const arrive = () => {
    if (arrived) return;
    arrived = true;
    onArrive?.();
  };
  // Safety net: update the counter even if an animation never finishes
  setTimeout(arrive, 1400);

  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "flying-star";
    star.style.left = `${from.left + from.width / 2 + (Math.random() - 0.5) * 40}px`;
    star.style.top = `${from.top + from.height / 2 + (Math.random() - 0.5) * 20}px`;
    effects.appendChild(star);

    const dx = to.left + to.width / 2 - parseFloat(star.style.left);
    const dy = to.top + to.height / 2 - parseFloat(star.style.top);
    const delay = i * 70;
    star.animate([
      { transform: "translate(0, 0) scale(0.6)", opacity: 0 },
      { transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 60}px) scale(1.1)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.7)`, opacity: 1 },
    ], { duration: 750, delay, easing: "cubic-bezier(0.5, 0, 0.7, 1)", fill: "both" }).onfinish = () => {
      star.remove();
      target.classList.remove("is-bumped");
      void target.offsetWidth;
      target.classList.add("is-bumped");
      arrive();
    };
  }
}
