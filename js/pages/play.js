// The game screen. One page for all modes: daily, classic, levels, timed and kids.
import { data, save } from "../core/storage.js";
import { language, t, tn } from "../core/i18n.js";
import { Round } from "../core/round.js";
import { CATEGORY_IDS, DIFFICULTIES, KIDS_LIVES, LENGTHS, getCategoryName, getLives, pickKidsWord, pickWord } from "../core/words.js";
import { DAILY_LIVES, getDailyNumber, getDailyWords } from "../core/daily.js";
import { LEVEL_COUNT, getLevel, highestUnlocked, starsFor } from "../core/levels.js";
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
import { copyText, showToast } from "../ui/toast.js";

// ---------- Mode ----------
const params = new URLSearchParams(location.search);
const MODE_NAMES = ["daily", "classic", "levels", "timed", "kids"];
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
    updateTiles();
    announce(t("play.letterRight", { letter: letter.toUpperCase() }));
  } else {
    correctInRow = 0;
    playSound("wrong");
    vibrate(40);
    shakeBoard();
    updateLives();
    announce(t("play.letterWrong", { letter: letter.toUpperCase(), count: round.livesLeft() }));
  }
  updateFigure();
  tour?.notifyGuess(result);
  afterGuess();
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
  playSound(won ? figure.winSound : figure.loseSound);
  // The rocket has its own launch sound, play the happy tune after it
  if (won && figure.winSound !== "win") setTimeout(() => playSound("win"), 900);
  vibrate(won ? [20, 40, 20] : [80, 40, 80]);

  // Let the figure animation play before the result screen
  const delay = isReducedMotion() ? 300 : figure.delay;
  setTimeout(() => mode.onRoundEnd(won), modeName === "timed" ? 0 : delay);
}

// ---------- Hints ----------

function hintCost(hint) {
  return isKids ? 0 : hint.cost;
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
  if (cost > 0 && !spendCoins(cost)) {
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
    }
  });
  const spoken = [...round.word]
    .map((letter, index) => (tiles[index].dataset.letter ? letter.toUpperCase() : t("play.blank")))
    .join(" ");
  wordEl.setAttribute("aria-label", t("play.wordLabel", { count: round.word.length, letters: spoken }));
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
  if (rewards.levelAfter > rewards.levelBefore) {
    html += `<p class="unlock-note">${icon("spark")}${t("result.levelUp", { level: rewards.levelAfter })}</p>`;
  }
  for (const achievement of rewards.newAchievements) {
    html += `<p class="unlock-note">${icon(achievement.icon)}${t("result.badge")} <strong>${t(`achievements.${achievement.id}.name`)}</strong></p>`;
  }
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
    function step(now) {
      // The frame time can be a little before "start", so keep progress between 0 and 1
      const progress = Math.min(1, Math.max(0, (now - start) / 700));
      element.textContent = `+${Math.round(target * (1 - (1 - progress) ** 3))}`;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// actions: [{ label, icon, primary, onClick, href }]
function showResult({ won, eyebrow, title, body = "", rewards = null, actions }) {
  dialog.className = `dialog result ${won ? "is-win" : "is-lose"}`;
  dialog.innerHTML = `
    <div class="result-hero">
      <div class="result-badge">${icon(won ? "check" : "heart")}</div>
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
  if (rewards && (rewards.newAchievements.length || rewards.newThemes.length)) {
    setTimeout(() => playSound("unlock"), 500);
  } else if (rewards && rewards.coins > 0) {
    setTimeout(() => playSound("coin"), 400);
  }
  refreshHeader();
}

function closeResult() {
  if (dialog.open) dialog.close();
}

// The player has to choose an action, so Escape does nothing
dialog.addEventListener("cancel", (event) => event.preventDefault());

function shareAction(getText, primary = false) {
  return {
    label: t("result.share"),
    icon: "share",
    primary,
    onClick: async () => {
      const copied = await copyText(getText());
      showToast(copied ? t("result.copied") : t("result.copyFailed"), icon("check"));
    },
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
  const categories = ["mixed", ...CATEGORY_IDS].map((id) => ({ id, name: getCategoryName(id) }));
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
  };
}

// ---------- Mode: Classic ----------

const classic = {
  title: () => t("modes.classic.title"),
  start() {
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
        ...(won ? [shareAction(() => t("share.classic", { count: round.word.length, misses: missesText(round.misses), link: shareLink() }))] : []),
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

let levelNumber = 1;

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
    titleEl.textContent = t("levels.level", { number: levelNumber });
    subtitleEl.textContent = `${t(`stages.${level.stage}`)} · ${getCategoryName(level.category)} · ${tn("common.lives", level.lives)}`;
    history.replaceState(null, "", `?mode=levels&level=${levelNumber}`);
    hintButton.hidden = false;
    startRound(pickWord(level.category, level.length, data.stats.recentWords), level.lives);
  },
  onRoundEnd(won) {
    const stars = won ? starsFor(round.misses, round.lives) : 0;
    if (won) recordLevel(levelNumber, stars);
    const rewards = recordWord(roundResult(won));
    const starRow = `<div class="star-row" aria-label="${t("levels.starsLabel", { count: stars })}">${[1, 2, 3]
      .map((n) => `<span class="${n <= stars ? "is-earned" : ""}">${icon("star")}</span>`).join("")}</div>`;
    const isLast = levelNumber >= LEVEL_COUNT;

    const actions = won
      ? [
          isLast
            ? { label: t("levels.map"), icon: "path", primary: true, href: "./levels.html" }
            : { label: t("levels.level", { number: levelNumber + 1 }), icon: "next", primary: true, onClick: () => { levelNumber++; levels.play(); } },
          { label: t("levels.map"), icon: "path", href: "./levels.html" },
          shareAction(() => t("share.level", { number: levelNumber, stars, link: shareLink() })),
        ]
      : [
          { label: t("result.tryAgain"), icon: "refresh", primary: true, onClick: () => levels.play() },
          { label: t("levels.map"), icon: "path", href: "./levels.html" },
        ];

    showResult({
      won,
      eyebrow: t("levels.level", { number: levelNumber }),
      title: won ? (isLast ? t("levels.summit") : t("levels.complete")) : t("levels.failed"),
      body: (won ? starRow : "") + wordReveal(round.word, round.description),
      rewards,
      actions: isLast && won ? actions.filter((a, i) => i !== 1) : actions,
    });
  },
};

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
    statusEl.innerHTML = dailyDots(progress.results, progress.index, words.length);
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
    statusEl.innerHTML = dailyDots(progress.results, progress.index, words.length);

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
    recordDaily(today, results);
    rewards = combineRewards(rewards, checkAchievements());
    const solved = results.filter((r) => r.won).length;
    showResult({
      won: solved > 0,
      eyebrow: `${t("modes.daily.titleNumber", { number: dailyNumber })} · ${t("result.dayStreak", { count: currentDailyStreak() })}`,
      title: t("modes.daily.solvedOf", { solved, total: results.length }),
      body: wordReveal(round.word, round.description) + dailySummary(results),
      rewards,
      actions: [
        shareAction(() => dailyShareText(results), true),
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
          <button class="button button-primary" type="button" id="share-daily">${icon("share")}<span>${t("result.shareResult")}</span></button>
          <a class="button button-secondary" href="./play.html?mode=classic">${icon("infinity")}<span>${t("modes.daily.playClassic")}</span></a>
        </div>
      </div>`;
    startCountdown(document.getElementById("next-daily"), () => location.reload());
    setupEl.querySelector("#share-daily").addEventListener("click", shareAction(() => dailyShareText(entry.results)).onClick);
  },
};

function dailyDots(results, index, total) {
  return `<ol class="daily-dots" aria-label="${t("modes.daily.dotsLabel")}">${Array.from({ length: total }, (_, i) => {
    const result = results[i];
    const state = result ? (result.won ? "is-won" : "is-lost") : i === index ? "is-current" : "";
    const label = result
      ? (result.won ? t("modes.daily.dotSolved") : t("modes.daily.dotMissed"))
      : i === index ? t("modes.daily.dotCurrent") : t("modes.daily.dotTodo");
    return `<li class="${state}" aria-label="${i + 1}: ${label}"></li>`;
  }).join("")}</ol>`;
}

function dailySummary(results, showWords = false) {
  return `<ul class="daily-summary">${results.map((r, i) => `
    <li class="${r.won ? "is-won" : "is-lost"}">
      ${icon(r.won ? "check" : "close")}
      <span>${showWords ? `<strong>${r.word}</strong> · ${getCategoryName(r.category)}` : t("modes.daily.wordNumber", { number: i + 1 })}</span>
      <span class="muted">${r.won ? missesText(r.misses) : t("modes.daily.notSolved")}</span>
    </li>`).join("")}</ul>`;
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
        shareAction(() => t("share.timed", { count: timedScore, link: shareLink() })),
      ],
    });
  },
};

// ---------- Start ----------

const MODES = { classic, levels, daily, timed, kids };
const mode = MODES[modeName];

document.title = `${mode.title()} – Hanglet`;
titleEl.textContent = mode.title();
hintButton.innerHTML = `${icon("bulb")}<span>${t("hints.button")}</span>`;
hintButton.addEventListener("click", openHintSheet);
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
