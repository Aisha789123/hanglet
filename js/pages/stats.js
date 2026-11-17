// Statistics page: numbers, misses chart, Daily calendar and badges.
import { data } from "../core/storage.js";
import { formatDate, language, t } from "../core/i18n.js";
import { getLevelInfo } from "../core/xp.js";
import { currentDailyStreak } from "../core/progress.js";
import { ACHIEVEMENTS } from "../core/achievements.js";
import { completedLevels, LEVEL_COUNT } from "../core/levels.js";
import { toDateKey } from "../core/dates.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";

initPage("stats");

const stats = data.stats;

// ---------- Number tiles ----------
const winPercent = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
const tiles = [
  ["stats.played", stats.played, "blue"],
  ["stats.winPercent", winPercent, "green"],
  ["stats.winStreak", stats.winStreak, "teal"],
  ["stats.bestWinStreak", stats.bestWinStreak, "teal"],
  ["stats.dayStreak", currentDailyStreak(), "orange"],
  ["stats.bestDayStreak", data.daily.bestStreak, "orange"],
];
document.getElementById("stat-tiles").innerHTML = tiles
  .map(([label, value, tone]) => `<div class="stat-tile tone-${tone}"><strong>${value}</strong><span>${t(label)}</span></div>`)
  .join("");

// ---------- Player progress ----------
const level = getLevelInfo(data.player.xp);
const dictionaryCount = Object.keys(data.dictionary[language] || {}).length;
document.getElementById("progress-list").innerHTML = `
  <li>${icon("star")}<span>${t("stats.playerLevel")}</span><strong>${level.level}</strong></li>
  <li>${icon("spark")}<span>${t("stats.totalXp")}</span><strong>${data.player.xp}</strong></li>
  <li>${icon("coin")}<span>${t("home.coins")}</span><strong>${data.player.coins}</strong></li>
  <li>${icon("path")}<span>${t("stats.levelsDone")}</span><strong>${completedLevels(data.levels.stars)} / ${LEVEL_COUNT}</strong></li>
  <li>${icon("timer")}<span>${t("stats.timedBest")}</span><strong>${data.timed.best}</strong></li>
  <li>${icon("book")}<span>${t("stats.wordsCollected")}</span><strong>${dictionaryCount}</strong></li>
  <li>${icon("bulb")}<span>${t("stats.hintsUsed")}</span><strong>${stats.hintsUsed}</strong></li>`;

// ---------- Misses chart: how many misses in won games, plus losses ----------
const rows = stats.missesInWins.map((count, misses) => ({
  label: misses === stats.missesInWins.length - 1 ? `${misses}+` : String(misses),
  count,
}));
rows.push({ label: t("stats.lost"), count: stats.losses, isLost: true });
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
  chart.setAttribute("aria-label", rows.map((row) =>
    `${row.isLost ? row.label : t("stats.missesLabel", { count: row.label })}: ${row.count}`).join(", "));
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
      label = t("stats.dailyDone", { solved: entry.solved, total: entry.total });
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
