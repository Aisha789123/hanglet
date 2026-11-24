// Statistics page: numbers, "at which clue" chart, Daily calendar and badges.
import { data } from "../core/storage.js";
import { formatDate, language, t } from "../core/i18n.js";
import { currentDailyStreak } from "../core/progress.js";
import { ACHIEVEMENTS } from "../core/achievements.js";
import { completedLevels, LEVEL_COUNT } from "../core/levels.js";
import { toDateKey } from "../core/dates.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";

initPage("stats");

const stats = data.stats;

// ---------- Number tiles ----------
// The star numbers only count riddles played with clues (since version 2)
const solvedPercent = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
const solvedWithClues = stats.solvedAtClue.reduce((sum, count) => sum + count, 0);
const averageStars = stats.starWords > 0 ? (stats.starsEarned / stats.starWords).toFixed(1) : "0";
const clue1Percent = solvedWithClues > 0 ? Math.round((stats.solvedAtClue[0] / solvedWithClues) * 100) : 0;
const tiles = [
  ["stats.avgStars", averageStars.replace(".", language === "nl" ? "," : "."), "yellow"],
  ["stats.clue1Percent", clue1Percent, "green"],
  ["stats.solvedPercent", solvedPercent, "blue"],
  ["stats.played", stats.played, "blue"],
  ["stats.dayStreak", currentDailyStreak(), "orange"],
  ["stats.bestDayStreak", data.daily.bestStreak, "orange"],
];
document.getElementById("stat-tiles").innerHTML = tiles
  .map(([label, value, tone]) => `<div class="stat-tile tone-${tone}"><strong>${value}</strong><span>${t(label)}</span></div>`)
  .join("");

// ---------- Progress ----------
const dictionaryCount = Object.keys(data.dictionary[language] || {}).length;
document.getElementById("progress-list").innerHTML = `
  <li>${icon("star")}<span>${t("stats.totalStars")}</span><strong>${data.player.stars}</strong></li>
  <li>${icon("spark")}<span>${t("stats.bestWinStreak")}</span><strong>${stats.bestWinStreak}</strong></li>
  <li>${icon("bulb")}<span>${t("stats.knowItWins")}</span><strong>${stats.knowItWins}</strong></li>
  <li>${icon("calendar")}<span>${t("stats.perfectDailies")}</span><strong>${stats.perfectDailies}</strong></li>
  <li>${icon("path")}<span>${t("stats.levelsDone")}</span><strong>${completedLevels(data.levels.stars)} / ${LEVEL_COUNT}</strong></li>
  <li>${icon("book")}<span>${t("stats.wordsCollected")}</span><strong>${dictionaryCount}</strong></li>`;

// ---------- Chart: at which clue did you solve it? ----------
const rows = stats.solvedAtClue.map((count, i) => ({ label: t("stats.clueRow", { number: i + 1 }), count, stars: 3 - i }));
rows.push({ label: t("stats.notSolved"), count: stats.losses, isLost: true });
const biggest = Math.max(1, ...rows.map((row) => row.count));
const chart = document.getElementById("misses-chart");
if (stats.played === 0) {
  chart.innerHTML = `<p class="empty">${t("stats.chartEmpty")}</p>`;
} else {
  chart.innerHTML = rows.map((row) => `
    <div class="bar-row${row.isLost ? " is-lost" : ""}">
      <span class="bar-label">${row.label}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${Math.max(4, (row.count / biggest) * 100)}%"></span></span>
      <span class="bar-value">${row.count}</span>
    </div>`).join("");
  chart.setAttribute("aria-label", rows.map((row) => `${row.label}: ${row.count}`).join(", "));
}

// ---------- Daily calendar ----------
const calendarEl = document.getElementById("calendar");
const monthLabel = document.getElementById("calendar-month");
const shownMonth = new Date();
shownMonth.setDate(1);

function renderCalendar() {
  const year = shownMonth.getFullYear();
  const month = shownMonth.getMonth();
  monthLabel.textContent = shownMonth.toLocaleDateString(language, { month: "long", year: "numeric" });

  // Monday is the first day of the week
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = toDateKey();
  const dayNames = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(language, { weekday: "narrow" }));
  let html = dayNames.map((day) => `<span class="calendar-head" aria-hidden="true">${day}</span>`).join("");
  html += '<span class="calendar-empty"></span>'.repeat(offset);

  for (let day = 1; day <= daysInMonth; day++) {
    const key = toDateKey(new Date(year, month, day));
    const entry = data.daily.history[key];
    let state = "";
    let label = t("stats.noDaily");
    if (entry) {
      state = entry.solved === entry.total ? "is-perfect" : entry.solved > 0 ? "is-played" : "is-missed";
      label = t("stats.dailyDone", { solved: entry.solved, total: entry.total })
        + (entry.stars !== undefined ? `, ${entry.stars}/${entry.total * 3}` : "");
    }
    const isToday = key === today ? " is-today" : "";
    html += `<span class="calendar-day ${state}${isToday}" aria-label="${formatDate(key)}: ${label}">${day}</span>`;
  }
  calendarEl.innerHTML = html;
}

document.getElementById("calendar-prev").addEventListener("click", () => {
  shownMonth.setMonth(shownMonth.getMonth() - 1);
  renderCalendar();
});
document.getElementById("calendar-next").addEventListener("click", () => {
  shownMonth.setMonth(shownMonth.getMonth() + 1);
  renderCalendar();
});
renderCalendar();

// ---------- Achievements ----------
const unlockedCount = ACHIEVEMENTS.filter((a) => data.achievements[a.id]).length;
document.getElementById("badge-count").textContent = t("stats.badgeCount", { count: unlockedCount, total: ACHIEVEMENTS.length });
