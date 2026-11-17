// The game screen. One page for all modes: daily, classic, levels, timed and kids.
import { data, save } from "../core/storage.js";
import { language, t, tn } from "../core/i18n.js";
import { Round } from "../core/round.js";
import { DIFFICULTIES, KIDS_LIVES, LENGTHS, PLAYABLE_CATEGORIES, getCategoryName, getLives, pickKidsWord, pickWord } from "../core/words.js";
import { DAILY_LIVES, getDailyNumber, getDailyWords } from "../core/daily.js";
import { LEVEL_COUNT, getLevel, highestUnlocked, starsForLevel } from "../core/levels.js";
import { HINTS, checkAchievements, countHint, currentDailyStreak, recordDaily, recordLevel, recordTimed, recordWord, spendCoins } from "../core/progress.js";
import { getFigure, isFigureOwned } from "../core/figures.js";
import { toDateKey } from "../core/dates.js";
import { initPage, refreshHeader } from "../ui/layout.js";
import { icon } from "../ui/icons.js";
import { pictureSvg } from "../ui/pictures.js";
import { createFigure } from "../ui/figures/index.js";
import { createKeyboard } from "../ui/keyboard.js";
import { playSound, vibrate } from "../ui/feedback.js";
import { launchConfetti } from "../ui/confetti.js";
import { isReducedMotion } from "../ui/appearance.js";
import { startCountdown } from "../ui/countdown.js";
import { startTutorial } from "../ui/tutorial.js";
import { showToast } from "../ui/toast.js";
import { shareResult } from "../ui/share.js";
import { createMascot, mascotSvg } from "../ui/mascot.js";
import { burst, floatText, flyCoins } from "../ui/effects.js";
import { showBadgePops, showLevelUp, showMissionPops } from "../ui/celebrations.js";
import { trackMission } from "../core/missions.js";
import { decodeChallenge } from "../core/challenge.js";
import { startMusic, stopMusic } from "../ui/music.js";

// ---------- Mode ----------
const params = new URLSearchParams(location.search);
const MODE_NAMES = ["daily", "classic", "levels", "timed", "kids", "challenge"];
const modeName = MODE_NAMES.includes(params.get("mode")) ? params.get("mode") : "classic";
const isKids = modeName === "kids";
if (isKids) document.body.classList.add("is-kids");

initPage("home");

// ---------- Page elements ----------
const titleEl = document.getElementById("mode-title");
const subtitleEl = document.getElementById("mode-subtitle");
const hintButton = document.getElementById("hint-button");
const setupEl = document.getElementById("setup");
const boardEl = document.getElementById("board");
const categoryEl = document.getElementById("category-chip");
const statusEl = document.getElementById("status-area");
const livesEl = document.getElementById("lives");
const figureEl = document.getElementById("figure");
const clueEl = document.getElementById("clue");
const wordEl = document.getElementById("word");
const announcer = document.getElementById("announcer");
const dialog = document.getElementById("result-dialog");
const hintSheet = document.getElementById("hint-sheet");
const comboEl = document.getElementById("combo");
const musicButton = document.getElementById("music-button");
const mascot = createMascot(document.getElementById("stage-mascot"), "happy");

const keyboard = createKeyboard(document.getElementById("keyboard"), handleGuess);

// ---------- Game state ----------
let round = null;
let figure = null;
let busy = false; // true while waiting between words
let correctInRow = 0; // makes the "correct" sound go up
let tour = null; // the interactive tutorial, when it is running

// Kids get a friendly figure: the classic one becomes the balloon
function chosenFigureId() {
  const figureData = getFigure(data.settings.figure);
  const id = isFigureOwned(figureData, data) ? figureData.id : "classic";
  return isKids && id === "classic" ? "balloon" : id;
}

// ---------- Shared round logic ----------

function startRound(pick, lives, earlierGuesses = []) {
  round = new Round({ ...pick, lives });
  busy = false;
  correctInRow = 0;
  keyboard.reset();
  keyboard.setLocked(false);
  figure = createFigure(chosenFigureId(), figureEl);
  mascot.setMood("happy");

  // Put back guesses from a Daily that was left halfway
  for (const letter of earlierGuesses) {
    keyboard.mark(letter, round.guess(letter));
  }
  // Kids see the picture and the description right away
  if (isKids) round.descriptionShown = true;

  categoryEl.textContent = getCategoryName(round.category);
  categoryEl.dataset.category = round.category;
  buildTiles();
  updateTiles();
  updateLives();
  updateClue();
  updateFigure(true);
  updateHintButton();
  setupEl.hidden = true;
  boardEl.hidden = false;
  announce(t("play.newWord", { count: round.word.length, category: getCategoryName(round.category) }));
  maybeStartTutorial();
}

function handleGuess(letter) {
  if (!round || busy || dialog.open || hintSheet.open || boardEl.hidden || round.isOver()) return;
  const result = round.guess(letter);
  if (result === "ignored") return;

  keyboard.mark(letter, result);
  if (result === "correct") {
    playSound("correct", correctInRow);
    correctInRow++;
    const newTiles = updateTiles();
    newTiles.forEach((tile) => burst(tile, 8));
    celebrate(newTiles.length);
    announce(t("play.letterRight", { letter: letter.toUpperCase() }));
  } else {
    correctInRow = 0;
    playSound("wrong");
    vibrate(40);
    shakeBoard();
    updateLives();
    mascot.setMood(round.livesLeft() <= 1 ? "surprised" : "thinking");
    mascot.react("shake");
    announce(t("play.letterWrong", { letter: letter.toUpperCase(), count: round.livesLeft() }));
  }
  updateFigure();
  tour?.notifyGuess(result);
  afterGuess();
}

// Mascot and combo text after a right letter
function celebrate(newLetters) {
  mascot.setMood(correctInRow >= 3 ? "cheering" : "happy");
  mascot.react("bounce");
  if (round.isOver()) return;
  if (correctInRow === 4) showMissionPops(trackMission({ type: "combo", count: correctInRow }));
  if (correctInRow >= 2) {
    const words = ["", "", "combo.nice", "combo.great", "combo.amazing"];
    const key = words[Math.min(correctInRow, 4)];
    floatText(comboEl, `${t(key)} ${t("combo.count", { count: correctInRow })}`, correctInRow >= 4 ? "coral" : "sun");
  } else if (newLetters >= 2) {
    floatText(comboEl, t("combo.double", { count: newLetters }), "mint");
  }
}

// Runs after every guess or hint
function afterGuess() {
  updateHintButton();
  mode.onGuess?.();
  if (!round.isOver()) return;

  const won = round.isWon();
  busy = true;
  keyboard.setLocked(true);
  updateHintButton();
  if (!won) updateTiles(true);
  updateClue(true);
  if (won) figure.win();
  else figure.lose();
  mascot.setMood(won ? "cheering" : "sad");
  playSound(won ? figure.winSound : figure.loseSound);
  // The rocket has its own launch sound, play the happy tune after it
  if (won && figure.winSound !== "win") setTimeout(() => playSound("win"), 900);
  vibrate(won ? [20, 40, 20] : [80, 40, 80]);

  // Let the figure animation play before the result screen
  const delay = isReducedMotion() ? 300 : figure.delay;
  setTimeout(() => mode.onRoundEnd(won), modeName === "timed" ? 0 : delay);
}

// ---------- Hints ----------

// A free hint from the treasure chest is used before coins
function usesToken() {
  return !isKids && data.player.hintTokens > 0;
}

function hintCost(hint) {
  if (modeName === "challenge" && hint.id === "description") return 0;
  return isKids || usesToken() ? 0 : hint.cost;
}

function hintAvailable(hint) {
  if (!round || round.isOver() || busy) return false;
  if (hint.id === "description") return round.canShowDescription();
  if (hint.id === "letter") return round.canRevealLetter();
  return round.canRemoveLetters();
}

function openHintSheet() {
  if (!round || round.isOver()) return;
  const coins = data.player.coins;
  hintSheet.innerHTML = `
    <div class="sheet-header">
      <h2 id="hint-title">${t("hints.title")}</h2>
      <span class="pill pill-coins">${icon("coin")}<span>${coins}</span></span>
    </div>
    ${usesToken() ? `<p class="token-note">${icon("gift")}${tn("hints.tokens", data.player.hintTokens)}</p>` : ""}
    <div class="hint-options">
      ${HINTS.map((hint) => {
        const cost = hintCost(hint);
        const disabled = !hintAvailable(hint) || coins < cost;
        const costText = cost === 0 ? t("hints.free") : String(cost);
        return `
          <button type="button" class="hint-option" data-hint="${hint.id}"${disabled ? " disabled" : ""}
            aria-label="${t(`hints.${hint.id}.title`)}. ${cost === 0 ? t("hints.free") : t("hints.cost", { coins: cost })}">
            <span class="hint-icon">${icon(hint.icon)}</span>
            <span class="hint-text"><strong>${t(`hints.${hint.id}.title`)}</strong><span>${t(`hints.${hint.id}.text`)}</span></span>
            <span class="hint-price">${cost > 0 ? icon("coin") : ""}${costText}</span>
          </button>`;
      }).join("")}
    </div>
    <button type="button" class="button button-secondary sheet-close">${t("common.close")}</button>`;

  hintSheet.querySelectorAll(".hint-option").forEach((button) => {
    button.addEventListener("click", () => useHint(button.dataset.hint));
  });
  hintSheet.querySelector(".sheet-close").addEventListener("click", () => hintSheet.close());
  hintSheet.showModal();
  hintSheet.querySelector(".hint-option:not(:disabled)")?.focus();
}

function useHint(id) {
  const hint = HINTS.find((item) => item.id === id);
  hintSheet.close();
  if (!hintAvailable(hint)) return;
  const cost = hintCost(hint);
  if (usesToken()) {
    data.player.hintTokens--;
    save();
  } else if (cost > 0 && !spendCoins(cost)) {
    showToast(t("hints.notEnough", { coins: cost }), icon("coin"));
    return;
  }
  countHint();
  playSound("hint");

  if (id === "description") {
    round.showDescription();
    updateClue();
    announce(round.description);
  } else if (id === "letter") {
    const letter = round.revealLetter();
    keyboard.mark(letter, "correct");
    updateTiles();
    updateFigure();
    announce(t("hints.letterShown", { letter: letter.toUpperCase() }));
  } else {
    const letters = round.removeWrongLetters(3);
    letters.forEach((letter) => keyboard.mark(letter, "removed"));
    announce(t("hints.lettersRemoved", { letters: letters.join(", ").toUpperCase() }));
  }
  refreshHeader();
  afterGuess();
}

// ---------- Drawing the board ----------

function buildTiles() {
  wordEl.style.setProperty("--letters", round.word.length);
  wordEl.innerHTML = [...round.word].map(() => '<span class="tile"><span class="tile-letter"></span></span>').join("");
}

// Fill in guessed letters. With showAll, missing letters are shown too (after a loss).
function updateTiles(showAll = false) {
  const tiles = wordEl.children;
  const newTiles = [];
  let delay = 0;
  [...round.word].forEach((letter, index) => {
    const tile = tiles[index];
    if (tile.dataset.letter) return;
    const guessed = round.guessed.includes(letter);
    if (guessed || showAll) {
      tile.dataset.letter = letter;
      tile.firstElementChild.textContent = letter;
      tile.classList.add(guessed ? "is-revealed" : "is-missed");
      tile.style.animationDelay = `${delay}ms`;
      delay += 60;
      newTiles.push(tile);
    }
  });
  const spoken = [...round.word]
    .map((letter, index) => (tiles[index].dataset.letter ? letter.toUpperCase() : t("play.blank")))
    .join(" ");
  wordEl.setAttribute("aria-label", t("play.wordLabel", { count: round.word.length, letters: spoken }));
  return newTiles;
}

function updateLives() {
  const left = round.livesLeft();
  livesEl.innerHTML = Array.from({ length: round.lives }, (_, i) =>
    `<span class="life${i < left ? "" : " is-lost"}"></span>`
  ).join("");
  livesEl.setAttribute("aria-label", t("play.livesLabel", { left, total: round.lives }));
}

function updateFigure(instant = false) {
  figure.update({
    misses: round.misses,
    lives: round.lives,
    revealed: round.revealedCount(),
    total: round.word.length,
    instant,
  });
}

// The clue box: the picture (Kids) and the description (after a hint or at the end)
function updateClue(showAtEnd = false) {
  const showText = round.descriptionShown || showAtEnd;
  const picture = isKids && round.picture
    ? `<span class="clue-picture">${pictureSvg(round.picture, t("kids.pictureLabel"))}</span>`
    : "";
  clueEl.hidden = !showText && !picture;
  clueEl.innerHTML = `${picture}<p class="clue-text">${showText ? `${icon("quote")}<span>${round.description}</span>` : ""}</p>`;
}

function updateHintButton() {
  const anyHint = round && HINTS.some((hint) => hintAvailable(hint));
  hintButton.disabled = !anyHint;
  hintButton.setAttribute("aria-label", t("hints.buttonLabel", { coins: data.player.coins }));
}

function shakeBoard() {
  boardEl.classList.remove("is-shaking");
  void boardEl.offsetWidth; // restart the animation
  boardEl.classList.add("is-shaking");
}

function announce(text) {
  announcer.textContent = text;
}

// ---------- Tutorial ----------

function maybeStartTutorial() {
  if (data.tutorialDone || tour || modeName === "timed") return;
  tour = startTutorial([
    { target: "#word", text: "tour.word" },
    { target: isKids ? "#clue" : "#category-chip", text: isKids ? "tour.picture" : "tour.category" },
    { target: "#keyboard", text: "tour.keyboard", waitForGuess: true },
    { target: "#figure", text: "tour.figure" },
    { target: "#hint-button", text: isKids ? "tour.hintsFree" : "tour.hints" },
  ], () => {
    data.tutorialDone = true;
    save();
  });
}

// ---------- Result dialog ----------

function rewardsHtml(rewards) {
  if (!rewards) return "";
  const items = [`<span class="reward">${icon("star")}<span><span data-count="${rewards.xp}">+${rewards.xp}</span> XP</span></span>`];
  if (rewards.coins > 0) {
    items.push(`<span class="reward reward-coins">${icon("coin")}<span data-count="${rewards.coins}">+${rewards.coins}</span></span>`);
  }
  let html = `<div class="rewards">${items.join("")}</div>`;
  for (const theme of rewards.newThemes) {
    html += `<p class="unlock-note">${icon("palette")}${t("result.theme")} <strong>${t(`themes.${theme.id}`)}</strong> <a href="./settings.html">${t("result.tryIt")}</a></p>`;
  }
  return html;
}

// Merge two reward objects (used when a Daily finishes and badges are checked again)
function combineRewards(first, second) {
  return {
    ...first,
    levelAfter: second.levelAfter,
    newAchievements: [...first.newAchievements, ...second.newAchievements],
    newThemes: [...first.newThemes, ...second.newThemes],
  };
}

// The word as small tiles, with the description underneath
function wordReveal(word, description = "") {
  const tiles = [...word].map((letter, i) => `<span style="animation-delay:${i * 50}ms">${letter}</span>`).join("");
  return `
    <div class="result-tiles" role="img" aria-label="${t("result.wordWas", { word })}">${tiles}</div>
    ${description ? `<p class="result-description">${description}</p>` : ""}`;
}

// Numbers in the rewards count up from 0
function countUp(container) {
  if (isReducedMotion()) return;
  container.querySelectorAll("[data-count]").forEach((element) => {
    const target = Number(element.dataset.count);
    const start = performance.now();
    let finished = false;
    function step(now) {
      if (finished) return;
      // The frame time can be a little before "start", so keep progress between 0 and 1
      const progress = Math.min(1, Math.max(0, (now - start) / 700));
      element.textContent = `+${Math.round(target * (1 - (1 - progress) ** 3))}`;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // Always end on the right number, also when animation frames are slow or skipped
    setTimeout(() => {
      finished = true;
      element.textContent = `+${target}`;
    }, 900);
  });
}

// actions: [{ label, icon, primary, onClick, href }]
function showResult({ won, eyebrow, title, body = "", rewards = null, actions }) {
  dialog.className = `dialog result ${won ? "is-win" : "is-lose"}`;
  dialog.innerHTML = `
    <div class="result-hero">
      <div class="result-mascot">${mascotSvg(won ? "cheering" : "sad")}</div>
      <p class="eyebrow">${eyebrow}</p>
      <h2 id="result-title">${title}</h2>
    </div>
    <div class="result-body">${body}</div>
    ${rewardsHtml(rewards)}
    <div class="result-actions"></div>`;

  const actionsEl = dialog.querySelector(".result-actions");
  for (const action of actions) {
    const button = document.createElement(action.href ? "a" : "button");
    button.className = `button ${action.primary ? "button-primary" : "button-secondary"}`;
    button.innerHTML = `${action.icon ? icon(action.icon) : ""}<span>${action.label}</span>`;
    if (action.href) {
      button.href = action.href;
    } else {
      button.type = "button";
      button.addEventListener("click", action.onClick);
    }
    actionsEl.appendChild(button);
  }

  dialog.showModal();
  actionsEl.firstElementChild?.focus();
  countUp(dialog);
  if (won) launchConfetti();
  celebrateRewards(rewards);
}

// Coins fly to the counter, then level up, badges and missions show
function celebrateRewards(rewards) {
  if (!rewards) {
    refreshHeader();
    return;
  }
  const coinsEl = dialog.querySelector(".reward-coins");
  if (rewards.coins > 0 && coinsEl) {
    setTimeout(() => flyCoins(coinsEl, rewards.coins, () => {
      refreshHeader();
      playSound("coin");
    }), 500);
  } else {
    refreshHeader();
  }
  const missions = [...(rewards.missionsDone || []), ...(rewards.extraMissions || [])];
  setTimeout(async () => {
    if (rewards.levelAfter > rewards.levelBefore) {
      await showLevelUp(rewards.levelAfter, rewards.newThemes);
    }
    showBadgePops(rewards.newAchievements);
    showMissionPops(missions);
  }, 1100);
}

function closeResult() {
  if (dialog.open) dialog.close();
}

// The player has to choose an action, so Escape does nothing
dialog.addEventListener("cancel", (event) => event.preventDefault());

// getCard gives the data for the share picture (see js/ui/share.js)
function shareAction(getText, primary = false, getCard = null) {
  return {
    label: t("result.share"),
    icon: "share",
    primary,
    onClick: () => shareResult({ text: getText(), card: getCard ? getCard() : null }),
  };
}

function missesText(misses) {
  return tn("common.misses", misses);
}

function shareLink() {
  return location.origin + location.pathname.replace(/play\.html$/, "");
}

// ---------- Setup panel (Classic and Time Attack) ----------

function optionGroup(name, label, items, selected) {
  const options = items.map((item) => `
    <label class="segment"${name === "category" ? ` data-category="${item.id}"` : ""}>
      <input type="radio" name="${name}" value="${item.id}"${item.id === selected ? " checked" : ""}>
      <span>${item.name}${item.detail ? `<small>${item.detail}</small>` : ""}</span>
    </label>`).join("");
  return `<fieldset class="option-group"><legend>${label}</legend><div class="segments segments-${name}">${options}</div></fieldset>`;
}

function showSetup(intro, startLabel, onStart) {
  const options = data.settings.options;
  const categories = ["mixed", ...PLAYABLE_CATEGORIES].map((id) => ({ id, name: getCategoryName(id) }));
  const lengths = LENGTHS.map((item) => ({ id: item.id, name: t(`lengths.${item.id}`), detail: t(`lengths.${item.id}Detail`) }));
  const difficulties = DIFFICULTIES.map((item) => ({ id: item.id, name: t(`difficulty.${item.id}`), detail: tn("common.lives", item.lives) }));
  setupEl.innerHTML = `
    <p class="setup-intro">${intro}</p>
    <form class="setup-form">
      ${optionGroup("category", t("setup.category"), categories, options.category)}
      ${optionGroup("length", t("setup.length"), lengths, options.length)}
      ${optionGroup("difficulty", t("setup.difficulty"), difficulties, options.difficulty)}
      <button class="button button-primary button-large" type="submit">${icon("play")}<span>${startLabel}</span></button>
    </form>`;

  setupEl.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    data.settings.options = {
      category: form.get("category"),
      length: form.get("length"),
      difficulty: form.get("difficulty"),
    };
    save();
    playSound("tap");
    onStart();
  });

  boardEl.hidden = true;
  setupEl.hidden = false;
  hintButton.hidden = true;
}

function optionsSummary() {
  const { category, length, difficulty } = data.settings.options;
  return `${getCategoryName(category)} · ${t(`lengths.${length}`)} · ${t(`difficulty.${difficulty}`)}`;
}

function roundResult(won) {
  return {
    won,
    misses: round.misses,
    lives: round.lives,
    word: round.word,
    category: round.category,
    picture: round.picture,
    isKids,
    hintsUsed: round.hintsUsed,
  };
}

// ---------- Mode: Classic ----------

const classic = {
  title: () => t("modes.classic.title"),
  start() {
    // "?category=animals" picks a category, "?start=1" skips the options screen
    const category = params.get("category");
    if (category && ["mixed", ...PLAYABLE_CATEGORIES].includes(category)) {
      data.settings.options.category = category;
      save();
    }
    if (params.get("start") === "1") {
      history.replaceState(null, "", "?mode=classic");
      params.delete("start");
      classic.next();
      return;
    }
    subtitleEl.textContent = t("modes.classic.subtitle");
    showSetup(t("setup.classicIntro"), t("setup.start"), () => classic.next());
  },
  next() {
    closeResult();
    const { category, length, difficulty } = data.settings.options;
    subtitleEl.textContent = optionsSummary();
    hintButton.hidden = false;
    startRound(pickWord(category, length, data.stats.recentWords), getLives(difficulty));
  },
  onRoundEnd(won) {
    const rewards = recordWord(roundResult(won));
    showResult({
      won,
      eyebrow: won ? `${missesText(round.misses)} · ${t("result.winStreak", { count: data.stats.winStreak })}` : t("result.outOfLives"),
      title: won ? t("result.solved") : t("result.notThisTime"),
      body: wordReveal(round.word, round.description),
      rewards,
      actions: [
        { label: t("result.nextWord"), icon: "next", primary: true, onClick: () => classic.next() },
        { label: t("result.options"), icon: "sliders", onClick: () => { closeResult(); classic.start(); } },
        ...(won ? [shareAction(() => t("share.classic", { count: round.word.length, misses: missesText(round.misses), link: shareLink() }), false,
          () => ({ title: t("modes.classic.title"), subtitle: t("share.letters", { count: round.word.length }), rows: [{ won: true, misses: round.misses, lives: round.lives }] }))] : []),
      ],
    });
  },
};

// ---------- Mode: Kids ----------

const kids = {
  title: () => t("modes.kids.title"),
  start() {
    subtitleEl.textContent = t("modes.kids.subtitle");
    kids.next();
  },
  next() {
    closeResult();
    hintButton.hidden = false;
    startRound(pickKidsWord(data.stats.recentWords), KIDS_LIVES);
  },
  onRoundEnd(won) {
    const rewards = recordWord(roundResult(won));
    const picture = round.picture ? `<div class="result-picture">${pictureSvg(round.picture)}</div>` : "";
    showResult({
      won,
      eyebrow: won ? t("kids.eyebrowWin") : t("kids.eyebrowLose"),
      title: won ? t("kids.win") : t("kids.lose"),
      body: picture + wordReveal(round.word, round.description),
      rewards,
      actions: [
        { label: t("kids.next"), icon: "next", primary: true, onClick: () => kids.next() },
        { label: t("common.home"), icon: "home", href: "./index.html" },
      ],
    });
  },
};

// ---------- Mode: Levels ----------
// A level has several words. Lose one word and the level is failed.
// The stars depend on all misses in the whole level.

let levelNumber = 1;
let levelResults = []; // { won, misses } per word
let levelWords = [];

const levels = {
  title: () => t("modes.levels.title"),
  start() {
    const unlocked = highestUnlocked(data.levels.stars);
    const asked = parseInt(params.get("level"), 10);
    levelNumber = asked >= 1 && asked <= unlocked ? asked : unlocked;
    levels.play();
  },
  play() {
    closeResult();
    const level = getLevel(levelNumber);
    levelResults = [];
    // Pick all words of the level at the start, all different
    levelWords = [];
    const avoid = [...data.stats.recentWords];
    for (let i = 0; i < level.wordCount; i++) {
      const pick = pickWord(level.category, level.length, avoid);
      levelWords.push(pick);
      avoid.push(pick.word);
    }
    titleEl.textContent = t("levels.level", { number: levelNumber });
    history.replaceState(null, "", `?mode=levels&level=${levelNumber}`);
    hintButton.hidden = false;
    levels.nextWord();
  },
  nextWord() {
    closeResult();
    const level = getLevel(levelNumber);
    const index = levelResults.length;
    subtitleEl.textContent = `${t("modes.daily.progress", { index: index + 1, total: level.wordCount })} · ${t(`stages.${level.stage}`)} · ${getCategoryName(level.category)}`;
    statusEl.innerHTML = progressDots(levelResults, index, level.wordCount);
    startRound(levelWords[index], level.lives);
  },
  onRoundEnd(won) {
    const level = getLevel(levelNumber);
    levelResults.push({ won, misses: round.misses });
    const rewards = recordWord(roundResult(won));
    statusEl.innerHTML = progressDots(levelResults, levelResults.length, level.wordCount);
    const isLast = levelNumber >= LEVEL_COUNT;

    if (!won) {
      showResult({
        won: false,
        eyebrow: t("levels.level", { number: levelNumber }),
        title: t("levels.failed"),
        body: wordReveal(round.word, round.description) + `<p class="result-text">${t("levels.failedText")}</p>`,
        rewards,
        actions: [
          { label: t("result.tryAgain"), icon: "refresh", primary: true, onClick: () => levels.play() },
          { label: t("levels.map"), icon: "path", href: "./levels.html" },
        ],
      });
      return;
    }

    // More words to go in this level
    if (levelResults.length < level.wordCount) {
      showResult({
        won: true,
        eyebrow: t("modes.daily.wordOf", { index: levelResults.length, total: level.wordCount }),
        title: t("result.niceOne"),
        body: wordReveal(round.word, round.description),
        rewards,
        actions: [{ label: t("result.nextWord"), icon: "next", primary: true, onClick: () => levels.nextWord() }],
      });
      return;
    }

    // The whole level is done
    const totalMisses = levelResults.reduce((sum, result) => sum + result.misses, 0);
    const stars = starsForLevel(totalMisses, level.wordCount);
    const levelMissions = recordLevel(levelNumber, stars);
    const starRow = `<div class="star-row" aria-label="${t("levels.starsLabel", { count: stars })}">${[1, 2, 3]
      .map((n) => `<span class="${n <= stars ? "is-earned" : ""}">${icon("star")}</span>`).join("")}</div>`;
    showResult({
      won: true,
      eyebrow: `${t("levels.level", { number: levelNumber })} · ${tn("common.misses", totalMisses)}`,
      title: isLast ? t("levels.summit") : t("levels.complete"),
      body: starRow + wordReveal(round.word, round.description),
      rewards: { ...rewards, extraMissions: levelMissions },
      actions: [
        isLast
          ? { label: t("levels.map"), icon: "path", primary: true, href: "./levels.html" }
          : { label: t("levels.level", { number: levelNumber + 1 }), icon: "next", primary: true, onClick: () => { levelNumber++; levels.play(); } },
        ...(isLast ? [] : [{ label: t("levels.map"), icon: "path", href: "./levels.html" }]),
        shareAction(() => t("share.level", { number: levelNumber, stars, link: shareLink() }), false,
          () => ({ title: t("levels.level", { number: levelNumber }), subtitle: t("levels.starsLabel", { count: stars }), stars, rows: levelResults })),
      ],
    });
  },
};

// Dots that show the words of a level or the Daily: solved, missed, now, to do
function progressDots(results, index, total) {
  return `<ol class="daily-dots" aria-label="${t("modes.daily.dotsLabel")}">${Array.from({ length: total }, (_, i) => {
    const result = results[i];
    const state = result ? (result.won ? "is-won" : "is-lost") : i === index ? "is-current" : "";
    const label = result
      ? (result.won ? t("modes.daily.dotSolved") : t("modes.daily.dotMissed"))
      : i === index ? t("modes.daily.dotCurrent") : t("modes.daily.dotTodo");
    return `<li class="${state}" aria-label="${i + 1}: ${label}"></li>`;
  }).join("")}</ol>`;
}

// ---------- Mode: Daily ----------

const today = toDateKey();
const dailyNumber = getDailyNumber(today);

// A Daily started in another language keeps its own words
function dailyWords() {
  const progress = data.daily.progress;
  const lang = progress && progress.date === today && progress.lang ? progress.lang : language;
  return getDailyWords(today, lang);
}

const daily = {
  title: () => t("modes.daily.titleNumber", { number: dailyNumber }),
  start() {
    if (data.daily.history[today]) {
      daily.showDone();
      return;
    }
    // Continue a Daily that was started earlier today, or start a new one
    if (!data.daily.progress || data.daily.progress.date !== today) {
      data.daily.progress = { date: today, lang: language, index: 0, results: [], guessed: [] };
      save();
    }
    daily.playCurrent();
  },
  playCurrent() {
    closeResult();
    const progress = data.daily.progress;
    const words = dailyWords();
    subtitleEl.textContent = t("modes.daily.progress", { index: progress.index + 1, total: words.length });
    statusEl.innerHTML = progressDots(progress.results, progress.index, words.length);
    hintButton.hidden = false;
    startRound(words[progress.index], DAILY_LIVES, progress.guessed);
  },
  onGuess() {
    data.daily.progress.guessed = [...round.guessed];
    save();
  },
  onRoundEnd(won) {
    const progress = data.daily.progress;
    const words = dailyWords();
    let rewards = recordWord(roundResult(won));
    progress.results.push({ won, misses: round.misses, lives: round.lives, word: round.word, category: round.category });
    progress.index++;
    progress.guessed = [];
    save();
    statusEl.innerHTML = progressDots(progress.results, progress.index, words.length);

    if (progress.index < words.length) {
      showResult({
        won,
        eyebrow: t("modes.daily.wordOf", { index: progress.index, total: words.length }),
        title: won ? t("result.niceOne") : t("result.missedIt"),
        body: wordReveal(round.word, round.description),
        rewards,
        actions: [{ label: t("result.nextWord"), icon: "next", primary: true, onClick: () => daily.playCurrent() }],
      });
      return;
    }

    const results = progress.results;
    const dailyMissions = recordDaily(today, results);
    rewards = { ...combineRewards(rewards, checkAchievements()), extraMissions: dailyMissions };
    const solved = results.filter((r) => r.won).length;
    showResult({
      won: solved > 0,
      eyebrow: `${t("modes.daily.titleNumber", { number: dailyNumber })} · ${t("result.dayStreak", { count: currentDailyStreak() })}`,
      title: t("modes.daily.solvedOf", { solved, total: results.length }),
      body: wordReveal(round.word, round.description) + dailySummary(results),
      rewards,
      actions: [
        { label: t("modes.daily.playMore"), icon: "play", primary: true, href: playMoreLink(results) },
        shareAction(() => dailyShareText(results), false, () => dailyCard(results)),
        { label: t("common.done"), icon: "check", onClick: () => { closeResult(); daily.showDone(); } },
      ],
    });
  },
  showDone() {
    const entry = data.daily.history[today];
    subtitleEl.textContent = t("modes.daily.comeBack");
    hintButton.hidden = true;
    boardEl.hidden = true;
    setupEl.hidden = false;
    setupEl.innerHTML = `
      <div class="daily-done">
        <p class="eyebrow">${t("modes.daily.titleNumber", { number: dailyNumber })}</p>
        <h2>${t("modes.daily.doneTitle", { solved: entry.solved, total: entry.total })}</h2>
        ${dailySummary(entry.results, true)}
        <div class="daily-done-stats">
          <div><strong>${currentDailyStreak()}</strong><span>${t("stats.dayStreak")}</span></div>
          <div><strong id="next-daily" class="countdown">--:--:--</strong><span>${t("modes.daily.next")}</span></div>
        </div>
        <div class="result-actions">
          <a class="button button-primary" href="${playMoreLink(entry.results)}">${icon("play")}<span>${t("modes.daily.playMore")}</span></a>
          <button class="button button-secondary" type="button" id="share-daily">${icon("share")}<span>${t("result.shareResult")}</span></button>
        </div>
      </div>`;
    startCountdown(document.getElementById("next-daily"), () => location.reload());
    setupEl.querySelector("#share-daily").addEventListener("click", shareAction(() => dailyShareText(entry.results), false, () => dailyCard(entry.results)).onClick);
  },
};

function dailySummary(results, showWords = false) {
  return `<ul class="daily-summary">${results.map((r, i) => `
    <li class="${r.won ? "is-won" : "is-lost"}">
      ${icon(r.won ? "check" : "close")}
      <span>${showWords ? `<strong>${r.word}</strong> · ${getCategoryName(r.category)}` : t("modes.daily.wordNumber", { number: i + 1 })}</span>
      <span class="muted">${r.won ? missesText(r.misses) : t("modes.daily.notSolved")}</span>
    </li>`).join("")}</ul>`;
}

// "Play more" goes straight to Classic, with the category of the last Daily word
function playMoreLink(results) {
  const last = results[results.length - 1];
  const category = last && PLAYABLE_CATEGORIES.includes(last.category) ? last.category : "mixed";
  return `./play.html?mode=classic&start=1&category=${category}`;
}

// The share picture of a Daily
function dailyCard(results) {
  const solved = results.filter((r) => r.won).length;
  return {
    title: t("modes.daily.titleNumber", { number: dailyNumber }),
    subtitle: t("modes.daily.solvedOf", { solved, total: results.length }),
    rows: results,
  };
}

// Spoiler-free: only shows solved or not and how many misses
function dailyShareText(results) {
  const solved = results.filter((r) => r.won).length;
  const lines = results.map((r) => {
    const marks = "●".repeat(r.misses) + "○".repeat(Math.max(0, r.lives - r.misses));
    return `${r.won ? "✅" : "❌"} ${marks}`;
  });
  return `${t("share.daily", { number: dailyNumber, solved, total: results.length })}\n${lines.join("\n")}\n${shareLink()}`;
}

// ---------- Mode: Time Attack ----------

const TIME_LIMIT = 120; // seconds
let timerId = null;
let endTime = 0;
let timedScore = 0;

const timed = {
  title: () => t("modes.timed.title"),
  start() {
    subtitleEl.textContent = t("modes.timed.subtitle");
    statusEl.innerHTML = "";
    showSetup(t("setup.timedIntro"), t("setup.startClock"), () => timed.begin());
  },
  begin() {
    closeResult();
    timedScore = 0;
    endTime = Date.now() + TIME_LIMIT * 1000;
    subtitleEl.textContent = optionsSummary();
    statusEl.innerHTML = `
      <div class="timer" role="timer" aria-label="${t("modes.timed.timeLeft")}">
        <span class="timer-bar"><span id="timer-fill"></span></span>
        <span class="timer-text" id="timer-text">2:00</span>
      </div>
      <span class="score-chip" id="timed-score" aria-live="polite">${t("modes.timed.solved", { count: 0 })}</span>`;
    hintButton.hidden = false;
    timed.next();
    clearInterval(timerId);
    timerId = setInterval(timed.tick, 250);
    timed.tick();
  },
  next() {
    const { category, length, difficulty } = data.settings.options;
    const pick = pickWord(category, length, data.stats.recentWords);
    data.stats.recentWords = [pick.word, ...data.stats.recentWords].slice(0, 40);
    startRound(pick, getLives(difficulty));
  },
  tick() {
    const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    const fill = document.getElementById("timer-fill");
    const text = document.getElementById("timer-text");
    fill.style.transform = `scaleX(${left / TIME_LIMIT})`;
    text.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    statusEl.querySelector(".timer").classList.toggle("is-urgent", left <= 10);
    if (left <= 10 && left > 0 && text.dataset.last !== String(left)) playSound("tick");
    text.dataset.last = left;
    if (left === 0) timed.finish();
  },
  onRoundEnd(won) {
    showMissionPops(trackMission({
      type: "word", won, misses: round.misses, length: round.word.length, category: round.category, hintsUsed: round.hintsUsed,
    }));
    if (won) {
      timedScore++;
      document.getElementById("timed-score").textContent = t("modes.timed.solved", { count: timedScore });
    }
    // Short pause so the player sees the word, then the next one
    setTimeout(() => {
      if (Date.now() < endTime) timed.next();
    }, won ? 700 : 1400);
  },
  finish() {
    clearInterval(timerId);
    busy = true;
    keyboard.setLocked(true);
    updateHintButton();
    const rewards = recordTimed(timedScore);
    playSound(timedScore > 0 ? "win" : "lose");
    showResult({
      won: timedScore > 0,
      eyebrow: rewards.isBest ? t("modes.timed.newBest") : t("modes.timed.best", { count: data.timed.best }),
      title: tn("modes.timed.result", timedScore),
      body: `<p class="result-text">${t("modes.timed.timeUp")}</p>${round && !round.isWon() ? wordReveal(round.word, round.description) : ""}`,
      rewards,
      actions: [
        { label: t("result.playAgain"), icon: "refresh", primary: true, onClick: () => timed.begin() },
        { label: t("result.options"), icon: "sliders", onClick: () => { closeResult(); timed.start(); } },
        shareAction(() => t("share.timed", { count: timedScore, link: shareLink() }), false,
          () => ({ title: t("modes.timed.title"), subtitle: tn("modes.timed.result", timedScore), big: timedScore })),
      ],
    });
  },
};

// ---------- Mode: Challenge from a friend ----------

const challengeData = decodeChallenge(params.get("c"));

const challenge = {
  title: () => t("modes.challenge.title"),
  start() {
    if (!challengeData) {
      subtitleEl.textContent = "";
      hintButton.hidden = true;
      setupEl.hidden = false;
      setupEl.innerHTML = `
        <div class="daily-done">
          <h2>${t("challenge.broken")}</h2>
          <p class="setup-intro">${t("challenge.brokenText")}</p>
          <div class="result-actions">
            <a class="button button-primary" href="./challenge.html">${icon("play")}<span>${t("challenge.makeOwn")}</span></a>
          </div>
        </div>`;
      return;
    }
    subtitleEl.textContent = challengeData.name
      ? t("challenge.from", { name: challengeData.name })
      : t("challenge.fromFriend");
    hintButton.hidden = false;
    startRound({ word: challengeData.word, category: "challenge", description: challengeData.hint }, DAILY_LIVES);
  },
  onRoundEnd(won) {
    const name = challengeData.name || t("challenge.someone");
    showResult({
      won,
      eyebrow: challengeData.name ? t("challenge.from", { name: challengeData.name }) : t("challenge.fromFriend"),
      title: won ? t("result.solved") : t("result.notThisTime"),
      body: wordReveal(round.word, challengeData.hint),
      actions: [
        { label: t("challenge.makeOwn"), icon: "play", primary: true, href: "./challenge.html" },
        shareAction(() => (won
          ? t("challenge.solvedShare", { name, misses: missesText(round.misses), link: shareLink() })
          : t("challenge.lostShare", { name, link: shareLink() })), false,
        () => ({ title: t("modes.challenge.title"), subtitle: name, rows: [{ won, misses: round.misses, lives: round.lives }] })),
        { label: t("common.home"), icon: "home", href: "./index.html" },
      ],
    });
  },
};

// ---------- Start ----------

const MODES = { classic, levels, daily, timed, kids, challenge };
const mode = MODES[modeName];

document.title = `${mode.title()} – Hanglet`;
titleEl.textContent = mode.title();
hintButton.innerHTML = `${icon("bulb")}<span>${t("hints.button")}</span>`;
hintButton.addEventListener("click", openHintSheet);

// Background music: off by default, remembered in the settings
function updateMusicButton() {
  musicButton.innerHTML = icon("music");
  musicButton.setAttribute("aria-pressed", String(data.settings.music));
  musicButton.classList.toggle("is-on", data.settings.music);
}
musicButton.addEventListener("click", () => {
  data.settings.music = !data.settings.music;
  save();
  if (data.settings.music) startMusic();
  else stopMusic();
  updateMusicButton();
});
updateMusicButton();
// Browsers only allow sound after the first tap or key press
if (data.settings.music) {
  const startOnce = () => {
    if (data.settings.music) startMusic();
    window.removeEventListener("pointerdown", startOnce);
    window.removeEventListener("keydown", startOnce);
  };
  window.addEventListener("pointerdown", startOnce);
  window.addEventListener("keydown", startOnce);
}
hintSheet.addEventListener("click", (event) => {
  // Clicking the dark area outside the sheet closes it
  if (event.target === hintSheet) hintSheet.close();
});

// Play with the real keyboard too
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target.closest?.("input, textarea")) return;
  const letter = event.key.toLowerCase();
  if (letter.length === 1 && letter >= "a" && letter <= "z") {
    handleGuess(letter);
  }
});

mode.start();
