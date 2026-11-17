// Celebrations on top of everything: level up, badges that pop and finished missions.
import { t } from "../core/i18n.js";
import { icon } from "./icons.js";
import { mascotSvg } from "./mascot.js";
import { playSound } from "./feedback.js";
import { launchConfetti } from "./confetti.js";

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

export function showMissionPops(missions) {
  for (const mission of missions) {
    pop(`
      <span class="pop-medal">${icon(mission.icon)}</span>
      <span class="pop-text"><small>${t("missions.done")}</small><strong>${t(`missions.${mission.id}`, { count: mission.target, category: t(`categories.${mission.category}`) })}</strong></span>`, "mission");
  }
}

// A big "Level up!" screen with the mascot. Resolves when it is closed.
export function showLevelUp(level, themes = []) {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "dialog level-up";
    dialog.setAttribute("aria-labelledby", "level-up-title");
    const themeNotes = themes.map((theme) =>
      `<p class="unlock-note">${icon("palette")}${t("result.theme")} <strong>${t(`themes.${theme.id}`)}</strong></p>`).join("");
    dialog.innerHTML = `
      <div class="level-up-rays" aria-hidden="true"></div>
      <div class="level-up-mascot">${mascotSvg("cheering")}</div>
      <p class="eyebrow">${t("levelUp.eyebrow")}</p>
      <h2 id="level-up-title">${t("levelUp.title")}</h2>
      <div class="level-up-number" aria-label="${t("home.playerLevel", { level })}">${level}</div>
      <p>${t("levelUp.text")}</p>
      ${themeNotes}
      <button class="button button-sun button-large" type="button">${t("levelUp.button")}</button>`;
    document.body.appendChild(dialog);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (dialog.open) dialog.close();
      dialog.remove();
      resolve();
    };
    // The button finishes right away; "close" also covers the Escape key
    dialog.querySelector("button").addEventListener("click", finish);
    dialog.addEventListener("close", finish);
    dialog.showModal();
    dialog.querySelector("button").focus();
    playSound("unlock");
    launchConfetti();
  });
}
