// Home page: mascot hero, the big Play button, the Daily card, mode tiles and progress.
import { data } from "../core/storage.js";
import { language, t } from "../core/i18n.js";
import { getLevelInfo } from "../core/xp.js";
import { currentDailyStreak } from "../core/progress.js";
import { getDailyNumber } from "../core/daily.js";
import { highestUnlocked, completedLevels, LEVEL_COUNT } from "../core/levels.js";
import { SEASON_CATEGORY, findWord, getCategoryName } from "../core/words.js";
import { toDateKey } from "../core/dates.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";
import { createMascot, mascotSvg } from "../ui/mascot.js";
import { illustration } from "../ui/illustrations.js";
import { isReducedMotion } from "../ui/appearance.js";
import { startCountdown } from "../ui/countdown.js";
import { pictureSvg } from "../ui/pictures.js";
import { renderHomeRewards } from "../ui/home-rewards.js";

initPage("home");

const today = toDateKey();
const dailyEntry = data.daily.history[today];
const dailyProgress = data.daily.progress && data.daily.progress.date === today ? data.daily.progress : null;
const dailyNumber = getDailyNumber(today);

// ---------- Mascot with a greeting ----------
const mascot = createMascot(document.getElementById("hero-mascot"), "happy", { label: t("mascot.label") });
const hour = new Date().getHours();
const greeting = hour < 12 ? t("home.morning") : hour < 18 ? t("home.afternoon") : t("home.evening");
const message = dailyEntry ? t("home.speechDone") : dailyProgress ? t("home.speechBusy") : t("home.speechReady");
document.getElementById("hero-speech").textContent = `${greeting} ${message}`;

// Tilo cheers when you poke him
document.getElementById("hero-mascot").addEventListener("click", () => {
  mascot.setMood("cheering");
  mascot.react("bounce");
  setTimeout(() => mascot.setMood("happy"), 1400);
});

// ---------- Letter tiles that drop in and form a word ----------
const dropEl = document.getElementById("word-drop");
const dropWords = t("home.dropWords").split(",");
let dropIndex = 0;

function showDropWord() {
  const word = dropWords[dropIndex % dropWords.length];
  dropEl.innerHTML = [...word].map((letter, i) =>
    `<span class="drop-tile drop-${i % 4}" style="animation-delay:${i * 90}ms">${letter}</span>`
  ).join("");
  dropIndex++;
}
showDropWord();
if (!isReducedMotion()) setInterval(showDropWord, 3800);

// ---------- The big Play button: the Daily first, then Classic ----------
const playButton = document.getElementById("play-button");
const playSub = document.getElementById("play-sub");
if (dailyEntry) {
  playButton.href = "./play.html?mode=classic&start=1";
  playSub.textContent = t("home.playSubClassic");
} else {
  playButton.href = "./play.html?mode=daily";
  playSub.textContent = dailyProgress
    ? t("home.dailyBusy", { index: dailyProgress.index + 1 })
    : t("home.playSubDaily", { number: dailyNumber });
}

// ---------- Daily card with a progress ring per word ----------
const results = dailyEntry ? dailyEntry.results : dailyProgress ? dailyProgress.results : [];
const currentIndex = dailyEntry ? -1 : dailyProgress ? dailyProgress.index : 0;
const ringCircumference = 2 * Math.PI * 20;
document.getElementById("daily-rings").innerHTML = [0, 1, 2].map((i) => {
  const result = results[i];
  const state = result ? (result.won ? "is-won" : "is-lost") : i === currentIndex ? "is-current" : "is-todo";
  // A won word fills the ring, a lost word shows how many lives were left
  const fill = result ? (result.won ? 1 : 0.25) : i === currentIndex ? 0.12 : 0;
  const label = result
    ? (result.won ? t("modes.daily.dotSolved") : t("modes.daily.dotMissed"))
    : i === currentIndex ? t("modes.daily.dotCurrent") : t("modes.daily.dotTodo");
  const inner = result ? icon(result.won ? "check" : "close") : `<span>${i + 1}</span>`;
  return `
    <div class="ring ${state}" role="img" aria-label="${t("modes.daily.wordNumber", { number: i + 1 })}: ${label}">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle class="ring-track" cx="24" cy="24" r="20"/>
        <circle class="ring-fill" cx="24" cy="24" r="20" stroke-dasharray="${(fill * ringCircumference).toFixed(1)} ${ringCircumference.toFixed(1)}"/>
      </svg>
      <span class="ring-inner">${inner}</span>
    </div>`;
}).join("");

document.getElementById("daily-number").textContent = t("modes.daily.titleNumber", { number: dailyNumber });
const dailyStatus = document.getElementById("daily-status");
const dailyCta = document.getElementById("daily-cta");
if (dailyEntry) {
  dailyStatus.textContent = t("home.dailyDone", { solved: dailyEntry.solved, total: dailyEntry.total });
  dailyCta.querySelector("span").textContent = t("home.seeResult");
  dailyCta.className = "button button-secondary";
} else if (dailyProgress) {
  dailyStatus.textContent = t("home.dailyBusy", { index: dailyProgress.index + 1 });
  dailyCta.querySelector("span").textContent = t("home.continueDaily");
} else {
  dailyStatus.textContent = t("home.dailyReadyText");
}
const streak = currentDailyStreak();
if (streak > 0) {
  dailyStatus.insertAdjacentHTML("beforeend", ` <span class="streak-chip">${icon("flame")}${t("result.dayStreak", { count: streak })}</span>`);
}
startCountdown(document.getElementById("daily-countdown"), () => location.reload());

// ---------- Daily chest and missions ----------
renderHomeRewards(document.getElementById("home-rewards"));

// ---------- Winter special (only in the season) ----------
if (SEASON_CATEGORY) {
  document.querySelector(".hero-card").insertAdjacentHTML("afterend", `
    <a class="season-card" href="./play.html?mode=classic&start=1&category=${SEASON_CATEGORY}">
      <span class="season-mascot">${mascotSvg("cheering")}</span>
      <span class="season-text">
        <strong>${t("season.title")}</strong>
        <span>${t("season.text")}</span>
      </span>
      <span class="button button-sun">${t("season.play")}</span>
    </a>`);
}

// ---------- Mode tiles ----------
const nextLevel = highestUnlocked(data.levels.stars);
const levelsDone = completedLevels(data.levels.stars);
const modes = [
  { id: "classic", href: "./play.html?mode=classic", color: "mint", status: t("home.classicStatus") },
  { id: "levels", href: "./levels.html", color: "coral",
    status: levelsDone >= LEVEL_COUNT ? t("home.levelsAllDone") : t("home.levelsNext", { next: nextLevel }) },
  { id: "timed", href: "./play.html?mode=timed", color: "berry",
    status: data.timed.best > 0 ? t("home.timedBest", { count: data.timed.best }) : t("home.timedNew") },
  { id: "challenge", href: "./challenge.html", color: "sky", status: t("home.challengeStatus") },
];
document.getElementById("mode-tiles").innerHTML = modes.map((mode) => `
  <a class="mode-tile tile-${mode.color}" href="${mode.href}" id="tile-${mode.id}">
    ${illustration(mode.id === "challenge" ? "challenge" : mode.id, "mode-art")}
    <span class="mode-tile-text">
      <strong>${t(`modes.${mode.id}.title`)}</strong>
      <span>${t(`modes.${mode.id}.text`)}</span>
      <em>${mode.status}</em>
    </span>
  </a>`).join("");

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
    <div class="tone-orange">${icon("flame")}<dt>${t("stats.dayStreak")}</dt><dd>${streak}</dd></div>
    <div class="tone-green">${icon("spark")}<dt>${t("stats.winStreak")}</dt><dd>${data.stats.winStreak}</dd></div>
    <div class="tone-yellow">${icon("coin")}<dt>${t("home.coins")}</dt><dd>${data.player.coins}</dd></div>
  </dl>`;

// ---------- My dictionary ----------
const words = Object.entries(data.dictionary[language] || {});
const dictionaryEl = document.getElementById("dictionary-teaser");
if (words.length > 0) {
  const [lastWord, entry] = words[words.length - 1];
  const info = findWord(lastWord);
  dictionaryEl.innerHTML = `
    <p class="teaser-count">${t("home.dictionaryCount", { count: words.length })}</p>
    <p class="teaser-word"><strong>${lastWord}</strong> · ${getCategoryName(entry.category)}</p>
    ${info ? `<p class="teaser-description">${info.description}</p>` : ""}`;
} else {
  dictionaryEl.innerHTML = `<p class="teaser-description">${t("home.dictionaryEmpty")}</p>`;
}

// ---------- Kids world banner (its own world with its own start button) ----------
const kidsBanner = document.getElementById("kids-banner");
document.getElementById("kids-banner-art").innerHTML = ["cat", "sun", "apple", "boat"]
  .map((name) => `<span class="sticker">${pictureSvg(name)}</span>`).join("");
const stickerCount = Object.keys(data.kids.stickers).length;
document.getElementById("kids-banner-stickers").textContent = stickerCount > 0 ? t("home.kidsStickers", { count: stickerCount }) : "";
// "Show the Kids world first" puts the banner right under the hero
if (data.settings.kidsFirst) {
  document.querySelector(".hero-card").after(kidsBanner);
}
