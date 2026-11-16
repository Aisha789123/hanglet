// Statistics page: numbers, misses chart, Daily calendar and badges.
import { data } from "../core/storage.js";
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
  ["Played", stats.played],
  ["Win %", winPercent],
  ["Win streak", stats.winStreak],
  ["Best win streak", stats.bestWinStreak],
  ["Day streak", currentDailyStreak()],
  ["Best day streak", data.daily.bestStreak],
];
document.getElementById("stat-tiles").innerHTML = tiles
  .map(([label, value]) => `<div class="stat-tile"><strong>${value}</strong><span>${label}</span></div>`)
  .join("");

// ---------- Player progress ----------
const level = getLevelInfo(data.player.xp);
document.getElementById("progress-list").innerHTML = `
  <li>${icon("star")}<span>Player level</span><strong>${level.level}</strong></li>
  <li>${icon("spark")}<span>Total XP</span><strong>${data.player.xp}</strong></li>
  <li>${icon("coin")}<span>Coins</span><strong>${data.player.coins}</strong></li>
  <li>${icon("path")}<span>Levels complete</span><strong>${completedLevels(data.levels.stars)} / ${LEVEL_COUNT}</strong></li>
  <li>${icon("timer")}<span>Time Attack best</span><strong>${data.timed.best}</strong></li>
  <li>${icon("bulb")}<span>Hints used</span><strong>${stats.hintsUsed}</strong></li>`;

// ---------- Misses chart: how many misses in won games, plus losses ----------
const rows = stats.missesInWins.map((count, misses) => ({
  label: misses === stats.missesInWins.length - 1 ? `${misses}+` : String(misses),
  count,
}));
rows.push({ label: "Lost", count: stats.losses, isLost: true });
const biggest = Math.max(1, ...rows.map((row) => row.count));
const chart = document.getElementById("misses-chart");
if (stats.played === 0) {
  chart.innerHTML = '<p class="empty">Play a game to see your chart.</p>';
} else {
  chart.innerHTML = rows.map((row) => `
    <div class="bar-row${row.isLost ? " is-lost" : ""}">
      <span class="bar-label">${row.label}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${Math.max(4, (row.count / biggest) * 100)}%"></span></span>
      <span class="bar-value">${row.count}</span>
    </div>`).join("");
  chart.setAttribute("aria-label", rows.map((row) =>
    `${row.isLost ? "Lost" : `${row.label} misses`}: ${row.count}`).join(", "));
}

// ---------- Daily calendar ----------
const calendarEl = document.getElementById("calendar");
const monthLabel = document.getElementById("calendar-month");
let shownMonth = new Date();
shownMonth.setDate(1);

function renderCalendar() {
  const year = shownMonth.getFullYear();
  const month = shownMonth.getMonth();
  monthLabel.textContent = shownMonth.toLocaleDateString("en", { month: "long", year: "numeric" });

  // Monday is the first day of the week
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = toDateKey();
  let html = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    .map((day) => `<span class="calendar-head" aria-hidden="true">${day}</span>`).join("");
  html += '<span class="calendar-empty"></span>'.repeat(offset);

  for (let day = 1; day <= daysInMonth; day++) {
    const key = toDateKey(new Date(year, month, day));
    const entry = data.daily.history[key];
    let state = "";
    let label = "no Daily";
    if (entry) {
      state = entry.solved === entry.total ? "is-perfect" : entry.solved > 0 ? "is-played" : "is-missed";
      label = `Daily done, ${entry.solved} of ${entry.total} solved`;
    }
    const isToday = key === today ? " is-today" : "";
    html += `<span class="calendar-day ${state}${isToday}" aria-label="${day} ${monthLabel.textContent}: ${label}">${day}</span>`;
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
document.getElementById("badge-count").textContent = `${unlockedCount} of ${ACHIEVEMENTS.length}`;
document.getElementById("badges").innerHTML = ACHIEVEMENTS.map((achievement) => {
  const date = data.achievements[achievement.id];
  return `
    <li class="badge ${date ? "is-unlocked" : "is-locked"}">
      <span class="badge-icon">${icon(date ? achievement.icon : "lock")}</span>
      <span class="badge-text">
        <strong>${achievement.name}</strong>
        <span>${achievement.description}</span>
        ${date ? `<small>Unlocked ${date}</small>` : ""}
      </span>
    </li>`;
}).join("");
