// Home page: today's Daily in the middle (Tilo, 3 riddles, one big button),
// then Classic, Levels and the Kids world, and a small strip with your stars.
import { data } from "../core/storage.js";
import { language, t, tn } from "../core/i18n.js";
import { currentDailyStreak, nextUnlock } from "../core/progress.js";
import { getDailyNumber } from "../core/daily.js";
import { MAX_STARS } from "../core/round.js";
import { highestUnlocked, completedLevels, LEVEL_COUNT } from "../core/levels.js";
import { SEASON_CATEGORY } from "../core/words.js";
import { toDateKey } from "../core/dates.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";
import { createMascot, mascotSvg } from "../ui/mascot.js";
import { illustration } from "../ui/illustrations.js";
import { startCountdown } from "../ui/countdown.js";
import { pictureSvg } from "../ui/pictures.js";

initPage("home");

const today = toDateKey();
const dailyEntry = data.daily.history[today];
const dailyProgress = data.daily.progress && data.daily.progress.date === today ? data.daily.progress : null;
const dailyNumber = getDailyNumber(today);

// ---------- Tilo with a greeting ----------
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

// ---------- Today's Daily: one slot per riddle with its stars ----------
const results = dailyEntry ? dailyEntry.results : dailyProgress ? dailyProgress.results : [];
const currentIndex = dailyEntry ? -1 : dailyProgress ? dailyProgress.index : 0;
document.getElementById("daily-number").textContent = t("home.dailyEyebrow", { number: dailyNumber });
document.getElementById("daily-rings").innerHTML = [0, 1, 2].map((i) => {
  const result = results[i];
  const state = result ? (result.won ? "is-won" : "is-lost") : i === currentIndex ? "is-current" : "is-todo";
  const stars = result && result.won ? (result.stars ?? MAX_STARS) : 0;
  const label = result
    ? (result.won ? tn("common.stars", stars) : t("modes.daily.dotMissed"))
    : i === currentIndex ? t("modes.daily.dotCurrent") : t("modes.daily.dotTodo");
  const inner = result
    ? (result.won ? `<span class="slot-stars">${icon("star").repeat(stars)}</span>` : icon("close"))
    : `<span class="slot-number">${i + 1}</span>`;
  return `<div class="riddle-slot ${state}" role="img" aria-label="${t("modes.daily.wordNumber", { number: i + 1 })}: ${label}">${inner}</div>`;
}).join("");

const statusEl = document.getElementById("daily-status");
const playButton = document.getElementById("play-button");
const playLabel = document.getElementById("play-label");
if (dailyEntry) {
  const stars = dailyEntry.stars ?? results.reduce((sum, result) => sum + (result.stars || 0), 0);
  statusEl.textContent = t("home.dailyDone", { stars });
  playLabel.textContent = t("home.seeResult");
  playButton.classList.add("is-done");
} else if (dailyProgress) {
  statusEl.textContent = t("home.dailyBusy", { index: dailyProgress.index + 1 });
  playLabel.textContent = t("home.continueDaily");
} else {
  statusEl.textContent = t("home.dailyReady");
  playLabel.textContent = t("home.playButton");
}
const streak = currentDailyStreak();
if (streak > 0) {
  statusEl.insertAdjacentHTML("beforeend", ` <span class="streak-chip">${icon("flame")}${t("result.dayStreak", { count: streak })}</span>`);
}
startCountdown(document.getElementById("daily-countdown"), () => location.reload());

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

// ---------- Classic, Levels and the Kids world ----------
const nextLevel = highestUnlocked(data.levels.stars);
const levelsDone = completedLevels(data.levels.stars);
const stickerCount = Object.keys(data.kids.stickers).length;
const kidsArt = ["cat", "sun", "apple"].map((name) => `<span class="sticker">${pictureSvg(name)}</span>`).join("");
const modes = [
  { id: "classic", href: "./play.html?mode=classic", color: "mint", art: illustration("classic", "mode-art"), status: null },
  { id: "levels", href: "./levels.html", color: "coral", art: illustration("levels", "mode-art"),
    status: levelsDone >= LEVEL_COUNT ? t("home.levelsDone") : t("home.levelsNext", { next: nextLevel }) },
  { id: "kids", href: "./kids.html", color: "sun", art: `<span class="mode-art kids-art" aria-hidden="true">${kidsArt}</span>`,
    status: stickerCount > 0 ? t("home.kidsStickers", { count: stickerCount }) : null },
];
// "Show the Kids world first" puts the Kids tile first
if (data.settings.kidsFirst) modes.unshift(modes.pop());
document.getElementById("mode-tiles").innerHTML = modes.map((mode) => `
  <a class="mode-tile tile-${mode.color}" href="${mode.href}" id="tile-${mode.id}">
    ${mode.art}
    <span class="mode-tile-text">
      <strong>${t(`modes.${mode.id}.title`)}</strong>
      <span>${t(`modes.${mode.id}.text`)}</span>
      ${mode.status ? `<em>${mode.status}</em>` : ""}
    </span>
  </a>`).join("");

// ---------- Your stars, the next unlock, the dictionary and challenges ----------
const next = nextUnlock();
const nextText = next
  ? t("home.nextUnlock", {
    count: next.stars - data.player.stars,
    name: next.type === "theme" ? t(`themes.${next.id}`) : t(`figures.${next.id}.name`),
  })
  : t("home.allUnlocked");
const wordCount = Object.keys(data.dictionary[language] || {}).length;
document.getElementById("home-strip").innerHTML = `
  <a class="strip-item strip-stars" href="./settings.html#looks">
    ${icon("star")}<strong>${data.player.stars}</strong><span>${nextText}</span>
  </a>
  <a class="strip-item" href="./dictionary.html">${icon("book")}<span>${tn("home.wordsCollected", wordCount)}</span></a>
  <a class="strip-item" href="./challenge.html">${icon("share")}<span>${t("home.challenge")}</span></a>`;
