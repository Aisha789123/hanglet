// Daily treasure chest, daily missions and the "play offline" tip on the home page.
// On wide screens the chest and the offline tip sit next to the missions.
import { t } from "../core/i18n.js";
import { canOpenChest, openChest } from "../core/chest.js";
import { claimMission, getTodayMissions } from "../core/missions.js";
import { icon } from "./icons.js";
import { illustration } from "./illustrations.js";
import { flyCoins } from "./effects.js";
import { playSound } from "./feedback.js";
import { refreshHeader } from "./layout.js";
import { startCountdown } from "./countdown.js";
import { setupInstallButton } from "./install.js";

export function renderHomeRewards(container) {
  container.innerHTML = `
    <section class="chest-card card" aria-labelledby="chest-title"></section>
    <section class="missions-card card" aria-labelledby="missions-title"></section>
    <section class="offline-strip" aria-label="${t("home.offlineTitle")}">
      <span class="offline-icon">${icon("download")}</span>
      <p>${t("home.offlineShort")}</p>
      <button class="button button-secondary" id="install-button" type="button" hidden>${t("settings.install")}</button>
    </section>`;
  renderChest(container.querySelector(".chest-card"));
  renderMissions(container.querySelector(".missions-card"));
  setupInstallButton(container.querySelector("#install-button"));
}

// ---------- Treasure chest ----------
function renderChest(card) {
  const ready = canOpenChest();
  card.classList.toggle("is-ready", ready);
  card.innerHTML = `
    <div class="chest-art${ready ? " is-wiggling" : ""}">${illustration(ready ? "chest" : "chest-open")}</div>
    <div class="chest-text">
      <h2 id="chest-title">${t("chest.title")}</h2>
      <p class="chest-message">${ready ? t("chest.ready") : t("chest.opened")}</p>
      ${ready ? "" : `<p class="chest-next">${t("chest.next")} <strong class="countdown" id="chest-countdown"></strong></p>`}
    </div>
    ${ready ? `<button class="button button-sun" type="button" id="chest-open">${icon("gift")}<span>${t("chest.open")}</span></button>` : ""}`;

  if (!ready) {
    startCountdown(card.querySelector("#chest-countdown"), () => renderChest(card));
    return;
  }

  card.querySelector("#chest-open").addEventListener("click", () => {
    const reward = openChest();
    if (!reward) return;
    playSound("unlock");
    card.classList.remove("is-ready");
    card.querySelector(".chest-art").outerHTML = `<div class="chest-art is-opening">${illustration("chest-open")}</div>`;
    card.querySelector(".chest-message").innerHTML = `
      <span class="chest-reward">${icon("coin")}+${reward.coins}</span>
      ${reward.hint ? `<span class="chest-reward chest-hint">${icon("bulb")}${t("chest.freeHint")}</span>` : ""}`;
    const button = card.querySelector("#chest-open");
    flyCoins(card.querySelector(".chest-art"), reward.coins, () => {
      refreshHeader();
      playSound("coin");
    });
    button.remove();
  });
}

// ---------- Daily missions ----------
function renderMissions(card) {
  const missions = getTodayMissions();
  const doneCount = missions.filter((mission) => mission.claimed).length;
  card.innerHTML = `
    <div class="missions-header">
      <h2 id="missions-title">${t("missions.title")}</h2>
      <span class="chip">${t("missions.count", { done: doneCount, total: missions.length })}</span>
    </div>
    <ul class="mission-list">
      ${missions.map((mission) => {
        const text = t(`missions.${mission.id}`, { count: mission.target, category: t(`categories.${mission.category}`) });
        const percent = Math.round((mission.progress / mission.target) * 100);
        const state = mission.claimed ? "is-claimed" : mission.done ? "is-done" : "";
        const action = mission.claimed
          ? `<span class="mission-check">${icon("check")}</span>`
          : mission.done
            ? `<button class="button button-mint mission-claim" type="button" data-mission="${mission.id}">${icon("coin")}<span>+${mission.reward}</span></button>`
            : `<span class="mission-reward">${icon("coin")}${mission.reward}</span>`;
        return `
          <li class="mission ${state}">
            <span class="mission-icon">${icon(mission.icon)}</span>
            <div class="mission-body">
              <p>${text}</p>
              <div class="progress" role="progressbar" aria-label="${text}" aria-valuemin="0" aria-valuemax="${mission.target}" aria-valuenow="${mission.progress}"><span style="width:${percent}%"></span></div>
              <small>${mission.progress} / ${mission.target}</small>
            </div>
            ${action}
          </li>`;
      }).join("")}
    </ul>`;

  card.querySelectorAll(".mission-claim").forEach((button) => {
    button.addEventListener("click", () => {
      const coins = claimMission(button.dataset.mission);
      if (!coins) return;
      playSound("unlock");
      flyCoins(button, coins, () => {
        refreshHeader();
        playSound("coin");
      });
      renderMissions(card);
    });
  });
}
