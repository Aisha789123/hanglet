// Home page: player summary, Daily status with countdown, mode cards and the dictionary.
import { data } from "../core/storage.js";
import { language, t } from "../core/i18n.js";
import { getLevelInfo } from "../core/xp.js";
import { currentDailyStreak } from "../core/progress.js";
import { getDailyNumber } from "../core/daily.js";
import { highestUnlocked, completedLevels, LEVEL_COUNT } from "../core/levels.js";
import { findWord, getCategoryName } from "../core/words.js";
import { toDateKey } from "../core/dates.js";
import { initPage } from "../ui/layout.js";
import { icon, logoMark } from "../ui/icons.js";
import { startCountdown } from "../ui/countdown.js";
import { setupInstallButton } from "../ui/install.js";

initPage("home");

document.getElementById("hero-logo").innerHTML = logoMark("logo-mark hero-logo-mark");

// ---------- Player card ----------
const level = getLevelInfo(data.player.xp);
const percent = Math.round((level.current / level.needed) * 100);
document.getElementById("player-card").innerHTML = `
  <div class="player-level">
    <span class="level-badge" aria-hidden="true">${level.level}</span>
    <div class="player-level-text">
      <strong>${t("home.playerLevel", { level: level.level })}</strong>
      <div class="progress" role="progressbar" aria-label="${t("home.xpLabel")}" aria-valuemin="0" aria-valuemax="${level.needed}" aria-valuenow="${level.current}">
        <span style="width:${percent}%"></span>
      </div>
      <small>${level.current} / ${level.needed} XP</small>
    </div>
  </div>
  <dl class="player-stats">
    <div class="tone-orange">${icon("flame")}<dt>${t("stats.dayStreak")}</dt><dd>${currentDailyStreak()}</dd></div>
    <div class="tone-green">${icon("spark")}<dt>${t("stats.winStreak")}</dt><dd>${data.stats.winStreak}</dd></div>
    <div class="tone-yellow">${icon("coin")}<dt>${t("home.coins")}</dt><dd>${data.player.coins}</dd></div>
  </dl>`;

// ---------- Daily card ----------
const today = toDateKey();
const dailyEntry = data.daily.history[today];
const dailyStatus = document.getElementById("daily-status");
const dailyCta = document.getElementById("daily-cta");
if (dailyEntry) {
  dailyStatus.innerHTML = `${t("home.dailyDone", { solved: dailyEntry.solved, total: dailyEntry.total })} · ${t("home.nextIn")} <span class="countdown" id="home-countdown"></span>`;
  startCountdown(document.getElementById("home-countdown"), () => location.reload());
  dailyCta.querySelector("span").textContent = t("home.seeResult");
} else if (data.daily.progress && data.daily.progress.date === today) {
  dailyStatus.textContent = t("home.dailyBusy", { index: data.daily.progress.index + 1 });
  dailyCta.querySelector("span").textContent = t("home.continueDaily");
} else {
  dailyStatus.textContent = t("home.dailyReady", { number: getDailyNumber(today) });
}

// ---------- Other mode cards ----------
const nextLevel = highestUnlocked(data.levels.stars);
const done = completedLevels(data.levels.stars);
document.getElementById("levels-status").textContent =
  done >= LEVEL_COUNT ? t("home.levelsAllDone") : t("home.levelsStatus", { done, total: LEVEL_COUNT, next: nextLevel });
document.getElementById("timed-status").textContent =
  data.timed.best > 0 ? t("home.timedBest", { count: data.timed.best }) : t("home.timedNew");
document.getElementById("kids-status").textContent = t("home.kidsStatus");

// Families with kids see the Kids mode first
if (data.settings.kidsFirst) {
  const grid = document.querySelector(".mode-grid");
  const kidsCard = document.getElementById("kids-card");
  grid.prepend(kidsCard);
}

// ---------- My dictionary ----------
const words = Object.entries(data.dictionary[language] || {});
const dictionaryEl = document.getElementById("dictionary-teaser");
if (words.length > 0) {
  // The most recently added word
  const [lastWord, entry] = words[words.length - 1];
  const info = findWord(lastWord);
  dictionaryEl.innerHTML = `
    <p class="teaser-count">${t("home.dictionaryCount", { count: words.length })}</p>
    <p class="teaser-word"><strong>${lastWord}</strong> · ${getCategoryName(entry.category)}</p>
    ${info ? `<p class="teaser-description">${info.description}</p>` : ""}`;
} else {
  dictionaryEl.innerHTML = `<p class="teaser-description">${t("home.dictionaryEmpty")}</p>`;
}

setupInstallButton(document.getElementById("install-button"));
