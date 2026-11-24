// Badge page: every badge as a medal, with progress for the ones you don't have yet.
import { data } from "../core/storage.js";
import { formatDate, t } from "../core/i18n.js";
import { ACHIEVEMENTS, LEGACY_ACHIEVEMENTS } from "../core/achievements.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";

initPage("badges");

const COLORS = ["sun", "coral", "mint", "sky", "berry"];
const unlocked = ACHIEVEMENTS.filter((a) => data.achievements[a.id]);

// Summary at the top
const percent = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);
document.getElementById("badge-summary").innerHTML = `
  <div class="badge-summary-medal medal medal-sun">${icon("trophy")}</div>
  <div class="badge-summary-text">
    <strong>${t("badges.collected", { count: unlocked.length, total: ACHIEVEMENTS.length })}</strong>
    <div class="progress" role="progressbar" aria-label="${t("badges.title")}" aria-valuemin="0" aria-valuemax="${ACHIEVEMENTS.length}" aria-valuenow="${unlocked.length}"><span style="width:${percent}%"></span></div>
  </div>`;

// Unlocked badges first, then the ones closest to done
function closeness(achievement) {
  if (!achievement.progress) return 0;
  const [current, target] = achievement.progress(data);
  return Math.min(1, current / target);
}
const sorted = [...ACHIEVEMENTS].sort((a, b) => {
  const aDone = data.achievements[a.id] ? 1 : 0;
  const bDone = data.achievements[b.id] ? 1 : 0;
  return bDone - aDone || closeness(b) - closeness(a);
});

document.getElementById("badge-grid").innerHTML = sorted.map((achievement) => {
  const date = data.achievements[achievement.id];
  const color = COLORS[ACHIEVEMENTS.indexOf(achievement) % COLORS.length];
  let progress = "";
  if (!date && achievement.progress) {
    const [current, target] = achievement.progress(data);
    const shown = Math.min(current, target);
    progress = `
      <div class="progress" role="progressbar" aria-label="${t(`achievements.${achievement.id}.name`)}" aria-valuemin="0" aria-valuemax="${target}" aria-valuenow="${shown}"><span style="width:${Math.round((shown / target) * 100)}%"></span></div>
      <small>${shown} / ${target}</small>`;
  }
  return `
    <li class="badge-card ${date ? "is-unlocked" : "is-locked"}">
      <div class="medal medal-${date ? color : "locked"}">
        ${icon(date ? achievement.icon : "lock")}
        <span class="medal-ribbon" aria-hidden="true"></span>
      </div>
      <strong>${t(`achievements.${achievement.id}.name`)}</strong>
      <span class="badge-description">${t(`achievements.${achievement.id}.description`)}</span>
      ${date ? `<small class="badge-date">${t("stats.unlockedOn", { date: formatDate(date) })}</small>` : progress}
    </li>`;
}).join("");

// Badges from earlier versions (Time Attack, hints, player levels) stay visible
const legacy = LEGACY_ACHIEVEMENTS.filter((achievement) => data.achievements[achievement.id]);
if (legacy.length > 0) {
  document.getElementById("badge-grid").insertAdjacentHTML("afterend", `
    <section class="legacy-badges" aria-labelledby="legacy-title">
      <h2 class="section-title" id="legacy-title">${t("badges.legacyTitle")}</h2>
      <p class="muted">${t("badges.legacyText")}</p>
      <ul class="badge-grid">${legacy.map((achievement) => `
        <li class="badge-card is-unlocked">
          <div class="medal medal-sky">${icon(achievement.icon)}<span class="medal-ribbon" aria-hidden="true"></span></div>
          <strong>${t(`achievements.${achievement.id}.name`)}</strong>
          <span class="badge-description">${t(`achievements.${achievement.id}.description`)}</span>
          <small class="badge-date">${t("stats.unlockedOn", { date: formatDate(data.achievements[achievement.id]) })}</small>
        </li>`).join("")}</ul>
    </section>`);
}
