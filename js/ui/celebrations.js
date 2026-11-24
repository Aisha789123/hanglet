// Celebrations on top of everything: badges and new figures or themes that pop.
import { t } from "../core/i18n.js";
import { icon } from "./icons.js";
import { playSound } from "./feedback.js";

let popLayer = null;
let queue = Promise.resolve();

// A layer in the browser's "top layer", so pops show above open dialogs
function getPopLayer() {
  if (!popLayer) {
    popLayer = document.createElement("div");
    popLayer.className = "pop-layer";
    popLayer.setAttribute("popover", "manual");
    popLayer.setAttribute("role", "status");
    popLayer.setAttribute("aria-live", "polite");
    document.body.appendChild(popLayer);
  }
  bringToFront(popLayer);
  return popLayer;
}

export function bringToFront(element) {
  if (!element.showPopover) return;
  try {
    if (element.matches(":popover-open")) element.hidePopover();
    element.showPopover();
  } catch {
    // Older browsers: the element just stays in the normal page
  }
}

// One card that pops in, stays a moment and leaves. Cards wait for each other.
function pop(html, tone) {
  queue = queue.then(() => new Promise((resolve) => {
    const card = document.createElement("div");
    card.className = `pop-card pop-${tone}`;
    card.innerHTML = html;
    getPopLayer().appendChild(card);
    playSound("unlock");
    setTimeout(() => card.classList.add("is-leaving"), 2400);
    setTimeout(() => {
      card.remove();
      resolve();
    }, 2800);
  }));
  return queue;
}

export function showBadgePops(achievements) {
  for (const achievement of achievements) {
    pop(`
      <span class="pop-medal">${icon(achievement.icon)}</span>
      <span class="pop-text"><small>${t("result.badge")}</small><strong>${t(`achievements.${achievement.id}.name`)}</strong></span>`, "badge");
  }
}

// A new figure or theme, unlocked with stars
export function showUnlockPops(unlocks) {
  for (const unlock of unlocks) {
    const isTheme = unlock.type === "theme";
    const name = isTheme ? t(`themes.${unlock.id}`) : t(`figures.${unlock.id}.name`);
    pop(`
      <span class="pop-medal">${icon(isTheme ? "palette" : "figure")}</span>
      <span class="pop-text"><small>${isTheme ? t("result.newTheme") : t("result.newFigure")}</small><strong>${name}</strong></span>`, "unlock");
  }
}
