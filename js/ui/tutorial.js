// A short interactive tour of the game screen for first-time players.
// Each step puts a spotlight on one part of the screen. One step waits
// until the player taps a letter.
import { t } from "../core/i18n.js";

// steps: [{ target: "#word", text: "key", waitForGuess: true }]
export function startTutorial(steps, onDone) {
  let index = 0;
  let waiting = false;

  const spotlight = document.createElement("div");
  spotlight.className = "tour-spotlight";
  spotlight.setAttribute("aria-hidden", "true");

  const bubble = document.createElement("div");
  bubble.className = "tour-bubble";
  bubble.setAttribute("role", "dialog");
  bubble.setAttribute("aria-live", "polite");
  bubble.setAttribute("aria-label", t("tour.label"));
  bubble.tabIndex = -1; // so it can get focus while waiting for a guess
  bubble.innerHTML = `
    <p class="tour-count"></p>
    <p class="tour-text"></p>
    <div class="tour-actions">
      <button type="button" class="button button-secondary tour-skip">${t("tour.skip")}</button>
      <button type="button" class="button button-primary tour-next">${t("tour.next")}</button>
    </div>`;

  document.body.append(spotlight, bubble);
  const nextButton = bubble.querySelector(".tour-next");

  function place() {
    const step = steps[index];
    const target = document.querySelector(step.target);
    if (!target) return;
    target.scrollIntoView({ block: "nearest" });
    const box = target.getBoundingClientRect();
    const padding = 8;
    Object.assign(spotlight.style, {
      top: `${box.top - padding}px`,
      left: `${box.left - padding}px`,
      width: `${box.width + padding * 2}px`,
      height: `${box.height + padding * 2}px`,
    });
    // Put the bubble below the target, or above it when there is no room
    const below = box.bottom + 16;
    const bubbleHeight = bubble.offsetHeight;
    const top = below + bubbleHeight < window.innerHeight ? below : Math.max(12, box.top - bubbleHeight - 16);
    bubble.style.top = `${top}px`;
  }

  function show() {
    const step = steps[index];
    waiting = Boolean(step.waitForGuess);
    bubble.querySelector(".tour-count").textContent = t("tour.step", { step: index + 1, total: steps.length });
    bubble.querySelector(".tour-text").textContent = t(step.text);
    nextButton.hidden = waiting;
    nextButton.textContent = index === steps.length - 1 ? t("tour.done") : t("tour.next");
    place();
    (waiting ? bubble : nextButton).focus();
  }

  function finish() {
    window.removeEventListener("resize", place);
    spotlight.remove();
    bubble.remove();
    onDone();
  }

  function next() {
    index++;
    if (index >= steps.length) finish();
    else show();
  }

  nextButton.addEventListener("click", next);
  bubble.querySelector(".tour-skip").addEventListener("click", finish);
  window.addEventListener("resize", place);
  show();

  // The game calls this after every guess
  return {
    notifyGuess(result) {
      if (!waiting) return;
      waiting = false;
      bubble.querySelector(".tour-text").textContent = t(result === "correct" ? "tour.goodGuess" : "tour.wrongGuess");
      nextButton.hidden = false;
      nextButton.focus();
    },
    isActive: () => document.body.contains(bubble),
  };
}
