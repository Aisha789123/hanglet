// The game screen. One page for all modes: daily, classic, levels, kids and challenge.
// The riddle gets clearer: Tilo starts with a smart clue, and every 2 wrong
// letters open a clearer one. "I know it!" lets you type the whole word.
// Solved at clue 1 = 3 stars, clue 2 = 2 stars, clue 3 = 1 star.
// The Kids world has its own small keyboard, easy clues and no losing.
import { data, save } from "../core/storage.js";
import { language, t, tn } from "../core/i18n.js";
import { MAX_STARS, Round, WRONG_WORD_COST } from "../core/round.js";
import { LENGTHS, PLAYABLE_CATEGORIES, getCategoryName, pickKidsWord, pickWord } from "../core/words.js";
import { dailyShareLine, getDailyNumber, getDailyWords, starLine } from "../core/daily.js";
import { LEVEL_COUNT, getLevel, highestUnlocked, maxLevelStars, starsForLevel } from "../core/levels.js";
import { DIFFICULTIES, easierDifficulty, freeLetters, getDifficulty, shouldSuggestEasier } from "../core/difficulty.js";
import { kidsHelp, kidsKeyboardLetters } from "../core/kids.js";
import { currentDailyStreak, recordDaily, recordKidsWord, recordLevel, recordWord, setDifficulty } from "../core/progress.js";
import { getFigure, isFigureOwned } from "../core/figures.js";
import { cleanWord, decodeChallenge } from "../core/challenge.js";
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
import { shareResult } from "../ui/share.js";
import { createMascot, mascotSvg } from "../ui/mascot.js";
import { burst, floatText, flyStars } from "../ui/effects.js";
import { showBadgePops, showUnlockPops } from "../ui/celebrations.js";
import { startMusic, stopMusic } from "../ui/music.js";

initPage("home");

// ---------- Mode ----------
const params = new URLSearchParams(location.search);
const MODE_NAMES = ["daily", "classic", "levels", "kids", "challenge"];
// Old links to Time Attack (removed in v5) open Classic
const modeName = MODE_NAMES.includes(params.get("mode")) ? params.get("mode") : "classic";
const isKids = modeName === "kids";
const isChallenge = modeName === "challenge";
document.body.classList.toggle("is-kids", isKids);

// ---------- Page elements ----------
const titleEl = document.getElementById("mode-title");
const subtitleEl = document.getElementById("mode-subtitle");
const helpButton = document.getElementById("help-button");
const setupEl = document.getElementById("setup");
const boardEl = document.getElementById("board");
const categoryEl = document.getElementById("category-chip");
const statusEl = document.getElementById("status-area");
const livesEl = document.getElementById("lives");
const figureEl = document.getElementById("figure");
const cluesEl = document.getElementById("clue-list");
const worthEl = document.getElementById("clue-worth");
const wordEl = document.getElementById("word");
const knowButton = document.getElementById("know-button");
const guessForm = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const guessNote = document.getElementById("guess-note");
const announcer = document.getElementById("announcer");
const dialog = document.getElementById("result-dialog");
const comboEl = document.getElementById("combo");
const backLink = document.getElementById("back-link");
const musicButton = document.getElementById("music-button");
const mascot = createMascot(document.getElementById("stage-mascot"), "thinking");

const keyboard = createKeyboard(document.getElementById("keyboard"), handleGuess);

// ---------- Game state ----------
let round = null;
let figure = null;
let busy = false; // true while waiting between words
let correctInRow = 0; // makes the "correct" sound go up
let tour = null; // the interactive tutorial, when it is running
let kidsHelped = false; // Kids: did Tilo help with this word?

function chosenFigureId() {
  const figureData = getFigure(data.settings.figure);
  return isFigureOwned(figureData, data) ? figureData.id : "balloon";
}

// The rules of the chosen difficulty (see js/core/difficulty.js)
function rules() {
  return isChallenge ? getDifficulty("normal") : getDifficulty(data.settings.options.difficulty);
}

function difficultyName() {
  return t(`difficulty.${rules().id}`);
}

// Kids have no figure that can be lost: the big picture takes its place
function createPictureStage(picture) {
  figureEl.innerHTML = `<div class="kids-picture">${pictureSvg(picture, t("kids.pictureLabel"))}</div>`;
  const box = figureEl.firstElementChild;
  return {
    update() {},
    win: () => box.classList.add("is-won"),
    lose() {},
    winSound: "win",
    delay: 900,
  };
}

// ---------- Shared round logic ----------

// pick: { word, clues, category, picture }. earlier: a Daily that was left halfway.
function startRound(pick, earlier = { guessed: [], wordGuesses: 0 }) {
  const current = rules();
  round = new Round({
    ...pick,
    lives: isKids ? Infinity : current.lives,
    // Hard never shows clue 3. A friend's challenge has as many clues as the friend wrote.
    maxClues: isChallenge ? pick.clues.length : current.maxClues,
    // Kids: every wrong letter opens the next (easier) clue
    missesPerClue: isKids ? 1 : undefined,
  });
  busy = false;
  correctInRow = 0;
  kidsHelped = false;
  keyboard.reset(isKids ? kidsKeyboardLetters(round.word) : undefined);
  keyboard.setLocked(false);
  closeGuessForm();
  knowButton.hidden = isKids;
  knowButton.disabled = false;
  figure = isKids ? createPictureStage(round.picture) : createFigure(chosenFigureId(), figureEl);
  mascot.setMood("thinking");

  // Put back guesses from a Daily that was left halfway
  for (const letter of earlier.guessed) {
    keyboard.mark(letter, round.guess(letter));
  }
  for (let i = 0; i < earlier.wordGuesses; i++) round.guessWord("#".repeat(round.word.length));
  // Easy: the first letter is a gift
  const given = isKids || isChallenge ? [] : freeLetters(round.word, current.id);
  for (const letter of given) {
    if (round.giveLetter(letter)) keyboard.mark(letter, "correct");
  }

  categoryEl.textContent = getCategoryName(round.category);
  categoryEl.dataset.category = round.category;
  buildTiles();
  updateTiles();
  updateLives();
  updateClues();
  updateFigure(true);
  setupEl.hidden = true;
  boardEl.hidden = false;
  const firstClue = round.clues[0] || t("play.noChallengeClue");
  announce(t("play.newWord", { count: round.word.length, clue: firstClue })
    + (given.length ? ` ${t("play.freeLetter")}` : ""));
  maybeStartTutorial();
}

function handleGuess(letter) {
  if (!round || busy || dialog.open || !guessForm.hidden || boardEl.hidden || round.isOver()) return;
  if (!keyboard.has(letter)) return; // Kids: only the letters on the small keyboard
  const cluesBefore = round.openClues();
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
    mascot.react("shake");
    if (isKids) {
      // No lives in the Kids world: Tilo helps instead
      mascot.setMood("thinking");
      kidsAssist(false);
    } else {
      updateLives();
      mascot.setMood(round.livesLeft() <= 2 ? "surprised" : "thinking");
      announce(t("play.letterWrong", { letter: letter.toUpperCase(), count: round.livesLeft() }));
    }
  }
  updateFigure();
  tour?.notifyGuess(result);
  afterMove(cluesBefore);
}

// Mascot and combo text after a right letter
function celebrate(newLetters) {
  mascot.setMood(correctInRow >= 3 ? "cheering" : "happy");
  mascot.react("bounce");
  if (round.isOver()) return;
  if (correctInRow >= 2) {
    const words = ["", "", "combo.nice", "combo.great", "combo.amazing"];
    const key = words[Math.min(correctInRow, 4)];
    floatText(comboEl, `${t(key)} ${t("combo.count", { count: correctInRow })}`, correctInRow >= 4 ? "coral" : "sun");
  } else if (newLetters >= 2) {
    floatText(comboEl, t("combo.double", { count: newLetters }), "mint");
  }
}

// Tilo says something short under the clues (and for screen readers)
function say(text) {
  const bubble = document.getElementById("tilo-says");
  bubble.textContent = text;
  bubble.classList.remove("is-new");
  void bubble.offsetWidth; // restart the pop animation
  bubble.classList.add("is-new");
  announce(text);
}

// Kids world: after a wrong letter (or the Help button) Tilo helps.
// First a key lights up, after that Tilo fills in a letter together with you.
function kidsAssist(fromButton) {
  const help = kidsHelp(round.word, round.guessed, fromButton ? 2 : round.misses);
  if (!help) return;
  kidsHelped = true;
  if (help.type === "fill" && round.giveLetter(help.letter)) {
    keyboard.mark(help.letter, "correct");
    updateTiles().forEach((tile) => burst(tile, 8));
    playSound("hint");
    mascot.setMood("cheering");
    mascot.react("bounce");
    say(t("kids.fill", { letter: help.letter.toUpperCase() }));
    return;
  }
  keyboard.glow(help.letter);
  say(fromButton ? t("kids.glow") : `${t("kids.tryOther")} ${t("kids.glow")}`);
}

// After every letter, word or help: open a new clue, or end the round
function afterMove(cluesBefore) {
  updateClues();
  if (!round.isOver() && round.openClues() > cluesBefore) {
    playSound("hint");
    if (!isKids) say(t("play.newClue", { number: round.openClues() }));
    else announce(t("play.newClue", { number: round.openClues() }));
  }
  mode.onGuess?.();
  if (round.isOver()) endRound();
}

function endRound() {
  const won = round.isWon();
  busy = true;
  keyboard.setLocked(true);
  closeGuessForm();
  knowButton.disabled = true;
  if (!won) updateTiles(true);
  updateClues(true);
  if (won) figure.win();
  else figure.lose();
  mascot.setMood(won ? "cheering" : "sad");
  playSound(won ? figure.winSound : figure.loseSound);
  // The rocket has its own launch sound, play the happy tune after it
  if (won && figure.winSound !== "win") setTimeout(() => playSound("win"), 900);
  vibrate(won ? [20, 40, 20] : [80, 40, 80]);

  // Let the figure animation play before the result screen
  const delay = isReducedMotion() ? 300 : figure.delay;
  setTimeout(() => mode.onRoundEnd(won), delay);
}

// ---------- "I know it!": type the whole word ----------

function openGuessForm() {
  if (!round || busy || round.isOver()) return;
  guessForm.hidden = false;
  knowButton.hidden = true;
  guessInput.value = "";
  guessInput.maxLength = round.word.length + 4;
  const left = round.livesLeft();
  const warning = left <= WRONG_WORD_COST;
  guessNote.textContent = t("play.costNote", { cost: WRONG_WORD_COST })
    + (warning ? ` ${t("play.lastLives", { count: left })}` : "");
  guessNote.classList.toggle("is-warning", warning);
  keyboard.setLocked(true);
  guessInput.focus();
}

function closeGuessForm() {
  guessForm.hidden = true;
  knowButton.hidden = isKids;
  if (round && !round.isOver() && !busy) keyboard.setLocked(false);
}

function checkWord(event) {
  event.preventDefault();
  if (!round || round.isOver()) return;
  const guess = cleanWord(guessInput.value);
  if (!guess) return;
  const cluesBefore = round.openClues();
  const result = round.guessWord(guess);

  // A typo in the length is free: the tiles already show how long the word is
  if (result === "length") {
    guessNote.textContent = t("play.wrongLength", { count: round.word.length });
    guessNote.classList.add("is-warning");
    guessInput.select();
    return;
  }
  closeGuessForm();
  if (result === "correct") {
    [...new Set(round.word)].forEach((letter) => keyboard.mark(letter, "correct"));
    playSound("correct", 4);
    updateTiles().forEach((tile) => burst(tile, 10));
    mascot.setMood("cheering");
    mascot.react("bounce");
  } else if (result === "wrong") {
    playSound("wrong");
    vibrate([60, 40, 60]);
    shakeBoard();
    mascot.setMood("surprised");
    mascot.react("shake");
    updateLives();
    updateFigure();
    floatText(comboEl, `−${WRONG_WORD_COST}`, "coral");
    say(t("play.wrongWord", { guess, cost: WRONG_WORD_COST }));
    knowButton.focus();
  }
  afterMove(cluesBefore);
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

// Hearts plus the text "5 lives left". Kids have no lives.
function updateLives() {
  livesEl.hidden = isKids;
  if (isKids) return;
  const left = round.livesLeft();
  const hearts = Array.from({ length: round.lives }, (_, i) =>
    `<span class="heart${i < left ? "" : " is-lost"}">${icon("heart")}</span>`
  ).join("");
  livesEl.innerHTML = `<span class="hearts" aria-hidden="true">${hearts}</span><span class="lives-text">${tn("play.lives", left)}</span>`;
  livesEl.classList.toggle("is-low", left <= 2);
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

// Star icons: filled for earned, empty for the rest
function starIcons(count, max = MAX_STARS) {
  return Array.from({ length: max }, (_, i) => `<span class="${i < count ? "is-earned" : ""}">${icon("star")}</span>`).join("");
}

// The clues: open ones with their text, closed ones say when they come.
// With showAll (after the round) every clue is open.
function updateClues(showAll = false) {
  const open = round.openClues();
  const clues = round.clues.length > 0 ? round.clues : [t("play.noChallengeClue")];
  cluesEl.innerHTML = clues.map((clue, i) => {
    const number = i + 1;
    const isOpen = showAll || number <= open;
    const isCurrent = !showAll && number === open;
    let text = clue;
    if (!isOpen) {
      if (number > round.maxClues) text = t("play.lockedHard");
      else if (number === open + 1) text = isKids ? t("kids.lockedNext") : tn("play.lockedNext", round.missesToNextClue());
      else text = t("play.lockedLater", { number: number - 1 });
    }
    return `
      <li class="clue ${isOpen ? "is-open" : "is-locked"}${isCurrent ? " is-current" : ""}">
        <span class="clue-number" aria-hidden="true">${isOpen ? number : icon("lock")}</span>
        <span class="clue-body">
          <span class="clue-label">${t("play.clue", { number })}</span>
          <span class="clue-text">${text}</span>
        </span>
      </li>`;
  }).join("");

  // "Solve it now for ★★★" (no stars in the Kids world)
  if (isKids || round.isOver()) {
    worthEl.innerHTML = "";
  } else {
    const stars = round.starsNow();
    worthEl.innerHTML = `<span>${t("play.worth")}</span><span class="star-row star-row-small" role="img" aria-label="${tn("common.stars", stars)}">${starIcons(stars)}</span>`;
  }
}

function shakeBoard() {
  boardEl.classList.remove("is-shaking");
  void boardEl.offsetWidth; // restart the animation
  boardEl.classList.add("is-shaking");
}

function announce(text) {
  announcer.textContent = "";
  setTimeout(() => (announcer.textContent = text), 50);
}

// ---------- Tutorial ----------

function maybeStartTutorial() {
  if (data.tutorialDone || tour) return;
  const steps = isKids
    ? [
      { target: "#stage-card", text: "tour.picture" },
      { target: "#word", text: "tour.word" },
      { target: "#keyboard", text: "tour.kidsKeyboard", waitForGuess: true },
      { target: "#help-button", text: "tour.hintsFree" },
    ]
    : [
      { target: "#clue-panel", text: "tour.clues" },
      { target: "#word", text: "tour.word" },
      { target: "#keyboard", text: "tour.keyboard", waitForGuess: true },
      { target: "#lives", text: "tour.figure" },
      { target: "#know-button", text: "tour.knowIt" },
    ];
  tour = startTutorial(steps, () => {
    data.tutorialDone = true;
    save();
  });
}

// ---------- Result dialog ----------

// Stars earned, and new figures or themes
function rewardsHtml(rewards) {
  if (!rewards) return "";
  let html = "";
  if (rewards.stars > 0) {
    html += `<div class="rewards"><span class="reward reward-stars">${icon("star")}<span><span data-count="${rewards.stars}">+${rewards.stars}</span></span></span>
      <span class="reward-total">${tn("result.totalStars", data.player.stars)}</span></div>`;
  }
  for (const unlock of rewards.newUnlocks || []) {
    const name = unlock.type === "theme" ? t(`themes.${unlock.id}`) : t(`figures.${unlock.id}.name`);
    const label = unlock.type === "theme" ? t("result.newTheme") : t("result.newFigure");
    html += `<p class="unlock-note">${icon(unlock.type === "theme" ? "palette" : "figure")}${label} <strong>${name}</strong> <a href="./settings.html">${t("result.tryIt")}</a></p>`;
  }
  return html;
}

// The word as tiles, the stars, and all clues with the one you solved it at
function wordReveal({ word, clues, won, clue, showStars = true }) {
  const tiles = [...word].map((letter, i) => `<span style="animation-delay:${i * 50}ms">${letter}</span>`).join("");
  const stars = won ? MAX_STARS + 1 - clue : 0;
  const clueList = clues.map((text, i) =>
    `<li class="${won && i + 1 === clue ? "is-solved-here" : ""}"><strong>${i + 1}</strong><span>${text}</span></li>`).join("");
  return `
    <div class="result-tiles" role="img" aria-label="${t("result.wordWas", { word })}">${tiles}</div>
    ${showStars ? `<div class="star-row star-row-big" role="img" aria-label="${tn("common.stars", stars)}">${starIcons(stars)}</div>` : ""}
    ${clues.length ? `<details class="result-clues"${won ? "" : " open"}><summary>${t("result.allClues")}</summary><ol>${clueList}</ol></details>` : ""}`;
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
  if (dialog.open) dialog.close();
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

  if (!won) maybeOfferEasier();
  dialog.showModal();
  actionsEl.firstElementChild?.focus();
  countUp(dialog);
  if (won && (!rewards || rewards.stars === MAX_STARS || isKids)) launchConfetti();
  // Earned stars fly to the counter in the header
  const starsEl = dialog.querySelector(".reward-stars");
  if (rewards && rewards.stars > 0 && starsEl) {
    setTimeout(() => flyStars(starsEl, rewards.stars, () => {
      refreshHeader();
      playSound("coin");
    }), 500);
  } else {
    refreshHeader();
  }
  if (rewards) {
    setTimeout(() => {
      showBadgePops(rewards.newAchievements || []);
      showUnlockPops(rewards.newUnlocks || []);
    }, 900);
  }
}

function closeResult() {
  if (dialog.open) dialog.close();
}

// Lost 2 words in a row? Tilo kindly offers an easier difficulty in the result.
function maybeOfferEasier() {
  const difficulty = rules().id;
  const easier = easierDifficulty(difficulty);
  if (!shouldSuggestEasier({ lossStreak: data.stats.lossStreak, difficulty, mode: modeName })) return;
  const level = t(`difficulty.${easier}`);
  const card = document.createElement("div");
  card.className = "adapt-card";
  card.innerHTML = `
    <div class="adapt-mascot">${mascotSvg("happy")}</div>
    <div class="adapt-body">
      <strong>${t("adapt.title")}</strong>
      <p>${t("adapt.text", { level, extra: t(`adapt.${easier}Extra`) })}</p>
      <div class="adapt-actions">
        <button type="button" class="button button-sun adapt-yes">${t("adapt.yes")}</button>
        <button type="button" class="button button-secondary adapt-no">${t("adapt.no")}</button>
      </div>
    </div>`;
  dialog.querySelector(".result-body").after(card);
  card.querySelector(".adapt-yes").addEventListener("click", () => {
    setDifficulty(easier);
    playSound("tap");
    card.querySelector(".adapt-body").innerHTML = `<strong>${t("adapt.done", { level })}</strong>`;
    card.classList.add("is-done");
    mode.onDifficultyChange?.();
    announce(t("adapt.done", { level }));
  });
  card.querySelector(".adapt-no").addEventListener("click", () => {
    card.remove();
    dialog.querySelector(".result-actions .button")?.focus();
  });
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

function shareLink() {
  return location.origin + location.pathname.replace(/play\.html$/, "");
}

// The result of the round, for recordWord()
function roundResult(won) {
  return {
    won,
    stars: round.stars(),
    clue: round.openClues(),
    misses: round.misses,
    word: round.word,
    category: round.category,
    difficulty: rules().id,
    solvedByWord: round.solvedByWord,
  };
}

function resultTitle(won) {
  return won ? t("result.solvedAt", { number: round.openClues() }) : t("result.notThisTime");
}

function reveal(won) {
  return wordReveal({ word: round.word, clues: round.clues, won, clue: round.openClues() });
}

// ---------- Setup panel (Classic) ----------

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
  const difficulties = DIFFICULTIES.map((item) => ({ id: item.id, name: t(`difficulty.${item.id}`), detail: t(`difficulty.${item.id}Detail`) }));
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
}

function optionsSummary() {
  const { category, length } = data.settings.options;
  return `${getCategoryName(category)} · ${t(`lengths.${length}`)} · ${difficultyName()}`;
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
    const { category, length } = data.settings.options;
    subtitleEl.textContent = optionsSummary();
    startRound(pickWord(category, length, data.stats.recentWords));
  },
  onDifficultyChange() {
    subtitleEl.textContent = optionsSummary();
  },
  onRoundEnd(won) {
    const stars = round.stars();
    const rewards = recordWord(roundResult(won));
    showResult({
      won,
      eyebrow: won ? t("result.winStreak", { count: data.stats.winStreak }) : t("result.outOfLives"),
      title: resultTitle(won),
      body: reveal(won),
      rewards,
      actions: [
        { label: t("result.nextWord"), icon: "next", primary: true, onClick: () => classic.next() },
        { label: t("result.options"), icon: "sliders", onClick: () => { closeResult(); classic.start(); } },
        ...(won ? [shareAction(() => `${t("share.classic", { count: round.word.length, number: round.openClues() })} ${starLine([stars])}\n${shareLink()}`, false,
          () => ({ title: t("modes.classic.title"), subtitle: t("share.letters", { count: round.word.length }), stars }))] : []),
      ],
    });
  },
};

// ---------- Mode: Kids ----------
// You can't lose: the word is always finished (with Tilo's help if needed).
// No stars, every word gives a sticker for the sticker book.

const kids = {
  title: () => t("modes.kids.title"),
  start() {
    subtitleEl.textContent = t("modes.kids.subtitle");
    backLink.href = "./kids.html";
    helpButton.hidden = false;
    helpButton.innerHTML = `${icon("smile")}<span>${t("kids.help")}</span>`;
    helpButton.setAttribute("aria-label", t("kids.helpLabel"));
    helpButton.addEventListener("click", () => {
      if (!round || busy || round.isOver()) return;
      kidsAssist(true);
      afterMove(round.openClues());
    });
    kids.next();
  },
  next() {
    closeResult();
    startRound(pickKidsWord(data.stats.recentWords));
  },
  onRoundEnd() {
    const isNew = recordKidsWord(round, round.openClues());
    const count = data.kids.stickers[round.picture];
    const compliments = t("kids.compliments").split("|");
    const sticker = `
      <div class="sticker-reveal${isNew ? " is-new" : ""}">
        <span class="sticker">${pictureSvg(round.picture)}</span>
        <p>${isNew ? t("kids.newSticker") : t("kids.stickerAgain", { count })}</p>
      </div>`;
    showResult({
      won: true,
      eyebrow: kidsHelped ? t("kids.together") : compliments[Math.floor(Math.random() * compliments.length)],
      title: t("kids.win"),
      body: sticker + wordReveal({ word: round.word, clues: round.clues, won: true, clue: round.openClues(), showStars: false }),
      actions: [
        { label: t("kids.next"), icon: "next", primary: true, onClick: () => kids.next() },
        { label: t("kids.stickerBook"), icon: "smile", href: "./kids.html#stickers" },
      ],
    });
  },
};

// ---------- Mode: Levels ----------
// A level has several riddles. Lose one and the level is failed.
// The level stars depend on all stars earned in the level.

let levelNumber = 1;
let levelResults = []; // { won, stars } per riddle
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
    backLink.href = "./levels.html";
    history.replaceState(null, "", `?mode=levels&level=${levelNumber}`);
    levels.nextWord();
  },
  nextWord() {
    closeResult();
    const level = getLevel(levelNumber);
    const index = levelResults.length;
    subtitleEl.textContent = `${t("modes.daily.progress", { index: index + 1, total: level.wordCount })} · ${getCategoryName(level.category)} · ${difficultyName()}`;
    statusEl.innerHTML = progressDots(levelResults, index, level.wordCount);
    startRound(levelWords[index]);
  },
  onDifficultyChange() {
    levels.nextWord();
  },
  onRoundEnd(won) {
    const level = getLevel(levelNumber);
    const stars = round.stars();
    levelResults.push({ won, stars });
    const rewards = recordWord(roundResult(won));
    statusEl.innerHTML = progressDots(levelResults, levelResults.length, level.wordCount);
    const isLast = levelNumber >= LEVEL_COUNT;

    if (!won) {
      showResult({
        won: false,
        eyebrow: t("levels.level", { number: levelNumber }),
        title: t("levels.failed"),
        body: reveal(false) + `<p class="result-text">${t("levels.failedText")}</p>`,
        rewards,
        actions: [
          { label: t("result.tryAgain"), icon: "refresh", primary: true, onClick: () => levels.play() },
          { label: t("levels.map"), icon: "path", href: "./levels.html" },
        ],
      });
      return;
    }

    // More riddles to go in this level
    if (levelResults.length < level.wordCount) {
      showResult({
        won: true,
        eyebrow: t("modes.daily.wordOf", { index: levelResults.length, total: level.wordCount }),
        title: resultTitle(true),
        body: reveal(true),
        rewards,
        actions: [{ label: t("result.nextWord"), icon: "next", primary: true, onClick: () => levels.nextWord() }],
      });
      return;
    }

    // The whole level is done
    const earned = levelResults.reduce((sum, result) => sum + result.stars, 0);
    const levelStars = starsForLevel(earned, level.wordCount);
    const levelRewards = recordLevel(levelNumber, levelStars);
    const starsList = levelResults.map((result) => result.stars);
    showResult({
      won: true,
      eyebrow: `${t("levels.level", { number: levelNumber })} · ${t("levels.earned", { count: earned, max: maxLevelStars(level.wordCount) })}`,
      title: isLast ? t("levels.summit") : t("levels.complete"),
      body: `<div class="star-row star-row-big" role="img" aria-label="${t("levels.starsLabel", { count: levelStars })}">${starIcons(levelStars)}</div>
        <p class="share-line">${starLine(starsList)}</p>`,
      rewards: {
        ...rewards,
        newAchievements: [...rewards.newAchievements, ...levelRewards.newAchievements],
        newUnlocks: [...rewards.newUnlocks, ...levelRewards.newUnlocks],
      },
      actions: [
        isLast
          ? { label: t("levels.map"), icon: "path", primary: true, href: "./levels.html" }
          : { label: t("levels.level", { number: levelNumber + 1 }), icon: "next", primary: true, onClick: () => { levelNumber++; levels.play(); } },
        ...(isLast ? [] : [{ label: t("levels.map"), icon: "path", href: "./levels.html" }]),
        shareAction(() => `${t("share.level", { number: levelNumber })} ${starLine(starsList)} (${earned}/${maxLevelStars(level.wordCount)})\n${shareLink()}`, false,
          () => ({ title: t("levels.level", { number: levelNumber }), subtitle: starLine(starsList), stars: levelStars })),
      ],
    });
  },
};

// Dots that show the riddles of a level or the Daily: solved, missed, now, to do
function progressDots(results, index, total) {
  return `<ol class="daily-dots" aria-label="${t("modes.daily.dotsLabel")}">${Array.from({ length: total }, (_, i) => {
    const result = results[i];
    const state = result ? (result.won ? "is-won" : "is-lost") : i === index ? "is-current" : "";
    const label = result
      ? (result.won ? tn("common.stars", result.stars) : t("modes.daily.dotMissed"))
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

function dailyStars(results) {
  return results.map((result) => result.stars || 0);
}

function dailyShareText(results) {
  return `${dailyShareLine(dailyNumber, dailyStars(results))}\n${shareLink()}`;
}

function dailyCard(results) {
  const total = dailyStars(results).reduce((sum, stars) => sum + stars, 0);
  return {
    title: t("modes.daily.titleNumber", { number: dailyNumber }),
    subtitle: starLine(dailyStars(results)),
    big: `${total}/${results.length * MAX_STARS}`,
  };
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
      data.daily.progress = { date: today, lang: language, index: 0, results: [], guessed: [], wordGuesses: 0 };
      save();
    }
    daily.playCurrent();
  },
  playCurrent() {
    closeResult();
    const progress = data.daily.progress;
    const words = dailyWords();
    subtitleEl.textContent = `${t("modes.daily.progress", { index: progress.index + 1, total: words.length })} · ${difficultyName()}`;
    statusEl.innerHTML = progressDots(progress.results, progress.index, words.length);
    startRound(words[progress.index], { guessed: progress.guessed || [], wordGuesses: progress.wordGuesses || 0 });
  },
  onGuess() {
    data.daily.progress.guessed = [...round.guessed];
    data.daily.progress.wordGuesses = round.wordGuesses;
    save();
  },
  onDifficultyChange() {},
  onRoundEnd(won) {
    const progress = data.daily.progress;
    const words = dailyWords();
    const stars = round.stars();
    let rewards = recordWord(roundResult(won));
    progress.results.push({ won, stars, word: round.word, category: round.category });
    progress.index++;
    progress.guessed = [];
    progress.wordGuesses = 0;
    save();
    statusEl.innerHTML = progressDots(progress.results, progress.index, words.length);

    if (progress.index < words.length) {
      showResult({
        won,
        eyebrow: t("modes.daily.wordOf", { index: progress.index, total: words.length }),
        title: resultTitle(won),
        body: reveal(won),
        rewards,
        actions: [{ label: t("result.nextWord"), icon: "next", primary: true, onClick: () => daily.playCurrent() }],
      });
      return;
    }

    const results = progress.results;
    const dailyRewards = recordDaily(today, results);
    rewards = {
      ...rewards,
      newAchievements: [...rewards.newAchievements, ...dailyRewards.newAchievements],
      newUnlocks: [...rewards.newUnlocks, ...dailyRewards.newUnlocks],
    };
    const total = dailyStars(results).reduce((sum, value) => sum + value, 0);
    showResult({
      won: total > 0,
      eyebrow: `${t("modes.daily.titleNumber", { number: dailyNumber })} · ${t("result.dayStreak", { count: currentDailyStreak() })}`,
      title: t("modes.daily.starsOf", { stars: total, max: results.length * MAX_STARS }),
      body: reveal(won) + dailySummary(results),
      rewards,
      actions: [
        shareAction(() => dailyShareText(results), true, () => dailyCard(results)),
        { label: t("modes.daily.playMore"), icon: "play", href: playMoreLink(results) },
        { label: t("common.done"), icon: "check", onClick: () => { closeResult(); daily.showDone(); } },
      ],
    });
  },
  showDone() {
    const entry = data.daily.history[today];
    const results = entry.results || [];
    const total = entry.stars ?? dailyStars(results).reduce((sum, value) => sum + value, 0);
    subtitleEl.textContent = t("modes.daily.comeBack");
    boardEl.hidden = true;
    setupEl.hidden = false;
    setupEl.innerHTML = `
      <div class="daily-done">
        <p class="eyebrow">${t("modes.daily.titleNumber", { number: dailyNumber })}</p>
        <h2>${t("modes.daily.starsOf", { stars: total, max: entry.total * MAX_STARS })}</h2>
        <p class="share-line">${starLine(dailyStars(results))}</p>
        ${dailySummary(results, true)}
        <div class="daily-done-stats">
          <div><strong>${currentDailyStreak()}</strong><span>${t("stats.dayStreak")}</span></div>
          <div><strong id="next-daily" class="countdown">--:--:--</strong><span>${t("modes.daily.next")}</span></div>
        </div>
        <div class="result-actions">
          <button class="button button-primary" type="button" id="share-daily">${icon("share")}<span>${t("result.shareResult")}</span></button>
          <a class="button button-secondary" href="${playMoreLink(results)}">${icon("play")}<span>${t("modes.daily.playMore")}</span></a>
        </div>
      </div>`;
    startCountdown(document.getElementById("next-daily"), () => location.reload());
    setupEl.querySelector("#share-daily").addEventListener("click", shareAction(() => dailyShareText(results), false, () => dailyCard(results)).onClick);
  },
};

function dailySummary(results, showWords = false) {
  return `<ul class="daily-summary">${results.map((r, i) => `
    <li class="${r.won ? "is-won" : "is-lost"}">
      ${icon(r.won ? "check" : "close")}
      <span>${showWords ? `<strong>${r.word}</strong> · ${getCategoryName(r.category)}` : t("modes.daily.wordNumber", { number: i + 1 })}</span>
      <span class="muted">${r.won ? starLine([r.stars || 0]) : t("modes.daily.notSolved")}</span>
    </li>`).join("")}</ul>`;
}

// "Play more" goes straight to Classic, with the category of the last Daily word
function playMoreLink(results) {
  const last = results[results.length - 1];
  const category = last && PLAYABLE_CATEGORIES.includes(last.category) ? last.category : "mixed";
  return `./play.html?mode=classic&start=1&category=${category}`;
}

// ---------- Mode: Challenge from a friend ----------

const challengeData = decodeChallenge(params.get("c"));

const challenge = {
  title: () => t("modes.challenge.title"),
  start() {
    if (!challengeData) {
      boardEl.hidden = true;
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
    startRound({ word: challengeData.word, category: "challenge", clues: challengeData.clues });
  },
  onRoundEnd(won) {
    const name = challengeData.name || t("challenge.someone");
    const stars = round.stars();
    const rewards = recordWord(roundResult(won));
    showResult({
      won,
      eyebrow: challengeData.name ? t("challenge.from", { name: challengeData.name }) : t("challenge.fromFriend"),
      title: resultTitle(won),
      body: reveal(won),
      rewards,
      actions: [
        { label: t("challenge.makeOwn"), icon: "play", primary: true, href: "./challenge.html" },
        shareAction(() => (won
          ? t("challenge.solvedShare", { name, stars: starLine([stars]), link: shareLink() })
          : t("challenge.lostShare", { name, link: shareLink() })), false,
        () => ({ title: t("modes.challenge.title"), subtitle: name, stars })),
        { label: t("common.home"), icon: "home", href: "./index.html" },
      ],
    });
  },
};

// ---------- Start ----------

const MODES = { classic, levels, daily, kids, challenge };
const mode = MODES[modeName];

document.title = `${mode.title()} – Hanglet`;
titleEl.textContent = mode.title();
knowButton.innerHTML = `${icon("bulb")}<span>${t("play.knowIt")}</span>`;
knowButton.addEventListener("click", openGuessForm);
guessForm.addEventListener("submit", checkWord);
document.getElementById("guess-cancel").addEventListener("click", () => {
  closeGuessForm();
  knowButton.focus();
});
guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeGuessForm();
    knowButton.focus();
  }
});

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
