// Home page: player summary, Daily status and the mode cards.
import { data } from "../core/storage.js";
import { getLevelInfo } from "../core/xp.js";
import { currentDailyStreak } from "../core/progress.js";
import { getDailyNumber } from "../core/daily.js";
import { highestUnlocked, completedLevels, LEVEL_COUNT } from "../core/levels.js";
import { toDateKey } from "../core/dates.js";
import { initPage } from "../ui/layout.js";
import { icon, logoMark } from "../ui/icons.js";
import { setupInstallButton } from "../ui/install.js";

initPage("home");

document.getElementById("hero-logo").innerHTML = logoMark("logo-mark hero-logo-mark");

// Player card
const level = getLevelInfo(data.player.xp);
const percent = Math.round((level.current / level.needed) * 100);
document.getElementById("player-card").innerHTML = `
  <div class="player-level">
    <span class="level-badge" aria-hidden="true">${level.level}</span>
    <div class="player-level-text">
      <strong>Player level ${level.level}</strong>
      <div class="progress" role="progressbar" aria-label="XP to next level" aria-valuemin="0" aria-valuemax="${level.needed}" aria-valuenow="${level.current}">
        <span style="width:${percent}%"></span>
      </div>
      <small>${level.current} / ${level.needed} XP</small>
    </div>
  </div>
  <dl class="player-stats">
    <div>${icon("flame")}<dt>Day streak</dt><dd>${currentDailyStreak()}</dd></div>
    <div>${icon("spark")}<dt>Win streak</dt><dd>${data.stats.winStreak}</dd></div>
    <div>${icon("coin")}<dt>Coins</dt><dd>${data.player.coins}</dd></div>
  </dl>`;

// Daily card status
const today = toDateKey();
const dailyEntry = data.daily.history[today];
const dailyStatus = document.getElementById("daily-status");
const dailyCta = document.getElementById("daily-cta");
if (dailyEntry) {
  dailyStatus.textContent = `Done today · ${dailyEntry.solved}/${dailyEntry.total} solved`;
  dailyCta.querySelector("span").textContent = "See today's result";
} else if (data.daily.progress && data.daily.progress.date === today) {
  dailyStatus.textContent = `In progress · word ${data.daily.progress.index + 1} of 3`;
  dailyCta.querySelector("span").textContent = "Continue the Daily";
} else {
  dailyStatus.textContent = `Daily #${getDailyNumber(today)} is ready`;
}

// Levels and Time Attack details
const nextLevel = highestUnlocked(data.levels.stars);
const done = completedLevels(data.levels.stars);
document.getElementById("levels-status").textContent =
  done >= LEVEL_COUNT ? "All levels complete" : `${done} of ${LEVEL_COUNT} done · next: level ${nextLevel}`;
document.getElementById("timed-status").textContent =
  data.timed.best > 0 ? `Best: ${data.timed.best} words` : "2 minutes on the clock";

setupInstallButton(document.getElementById("install-button"));
