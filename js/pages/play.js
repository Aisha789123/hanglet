// The game screen. One page for all four modes: daily, classic, levels and timed.
import { data, save } from "../core/storage.js";
import { Round } from "../core/round.js";
import { CATEGORIES, DIFFICULTIES, LENGTHS, getCategoryName, getLives, pickWord } from "../core/words.js";
import { DAILY_LIVES, getDailyNumber, getDailyWords } from "../core/daily.js";
import { LEVEL_COUNT, getLevel, highestUnlocked, starsFor } from "../core/levels.js";
import { HINT_COST, checkAchievements, currentDailyStreak, recordDaily, recordLevel, recordTimed, recordWord, spendCoins } from "../core/progress.js";
import { timeUntilTomorrow, toDateKey } from "../core/dates.js";
import { initPage, refreshHeader } from "../ui/layout.js";
import { icon } from "../ui/icons.js";
import { createHangman } from "../ui/hangman.js";
import { createKeyboard } from "../ui/keyboard.js";
import { playSound, vibrate } from "../ui/feedback.js";
import { launchConfetti } from "../ui/confetti.js";
import { copyText, showToast } from "../ui/toast.js";

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
const wordEl = document.getElementById("word");
const announcer = document.getElementById("announcer");
const dialog = document.getElementById("result-dialog");

const hangman = createHangman(document.getElementById("hangman"));
const keyboard = createKeyboard(document.getElementById("keyboard"), handleGuess);

// ---------- Game state ----------
const params = new URLSearchParams(location.search);
const modeName = ["daily", "classic", "levels", "timed"].includes(params.get("mode"))
  ? params.get("mode")
  : "classic";

let round = null;
let busy = false; // true while waiting between words

// ---------- Shared round logic ----------

function startRound({ word, category, lives }, earlierGuesses = []) {
  round = new Round({ word, category, lives });
  busy = false;
  keyboard.reset();
  keyboard.setLocked(false);

  // Put back guesses from a Daily that was left halfway
  for (const letter of earlierGuesses) {
    keyboard.mark(letter, round.guess(letter));
  }

  categoryEl.textContent = getCategoryName(category);
  buildTiles();
  updateTiles();
  updateLives();
  hangman.update(round.misses, round.lives);
  updateHintButton();
  setupEl.hidden = true;
  boardEl.hidden = false;
  announce(`New word with ${word.length} letters. Category: ${getCategoryName(category)}.`);
}

function handleGuess(letter) {
  if (!round || busy || dialog.open || boardEl.hidden || round.isOver()) return;
  const result = round.guess(letter);
  if (result === "ignored") return;

  keyboard.mark(letter, result);
  if (result === "correct") {
    playSound("correct");
    updateTiles();
    announce(`${letter.toUpperCase()} is in the word.`);
  } else {
    playSound("wrong");
    vibrate(40);
    shakeBoard();
    updateLives();
    hangman.update(round.misses, round.lives);
    announce(`${letter.toUpperCase()} is not in the word. ${round.livesLeft()} lives left.`);
  }
  afterGuess();
}

function useHint() {
  if (!round || busy || round.isOver()) return;
  if (round.hiddenLetters().length < 2) {
    showToast("Hints can't reveal the last letter.", icon("bulb"));
    return;
  }
  if (!spendCoins(HINT_COST)) {
    showToast(`You need ${HINT_COST} coins for a hint.`, icon("coin"));
    return;
  }
  const letter = round.revealHint();
  data.stats.hintsUsed++;
  save();
  keyboard.mark(letter, "correct");
  playSound("hint");
  updateTiles();
  refreshHeader();
  announce(`Hint: ${letter.toUpperCase()} is in the word.`);
  afterGuess();
}

// Runs after every guess or hint
function afterGuess() {
  updateHintButton();
  mode.onGuess?.();
  if (round.isOver()) {
    keyboard.setLocked(true);
    if (round.isLost()) updateTiles(true);
    playSound(round.isWon() ? "win" : "lose");
    vibrate(round.isWon() ? [20, 40, 20] : [80, 40, 80]);
    mode.onRoundEnd(round.isWon());
  }
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
      delay += 50;
    }
  });
  const spoken = [...round.word]
    .map((letter, index) => (tiles[index].dataset.letter ? letter.toUpperCase() : "blank"))
    .join(" ");
  wordEl.setAttribute("aria-label", `Word with ${round.word.length} letters: ${spoken}`);
}

function updateLives() {
  const left = round.livesLeft();
  livesEl.innerHTML = Array.from({ length: round.lives }, (_, i) =>
    `<span class="life${i < left ? "" : " is-lost"}"></span>`
  ).join("");
  livesEl.setAttribute("aria-label", `${left} of ${round.lives} lives left`);
}

function updateHintButton() {
  const canUse = round && !round.isOver() && !busy && round.hiddenLetters().length >= 2;
  hintButton.disabled = !canUse;
  hintButton.setAttribute("aria-label", `Use a hint for ${HINT_COST} coins. You have ${data.player.coins} coins.`);
}

function shakeBoard() {
  boardEl.classList.remove("is-shaking");
  void boardEl.offsetWidth; // restart the animation
  boardEl.classList.add("is-shaking");
}

function announce(text) {
  announcer.textContent = text;
}

// ---------- Result dialog ----------

function rewardsHtml(rewards) {
  if (!rewards) return "";
  const items = [`<span class="reward">${icon("star")}+${rewards.xp} XP</span>`];
  if (rewards.coins > 0) items.push(`<span class="reward reward-coins">${icon("coin")}+${rewards.coins}</span>`);
  let html = `<div class="rewards">${items.join("")}</div>`;
  if (rewards.levelAfter > rewards.levelBefore) {
    html += `<p class="unlock-note">${icon("spark")}You reached player level ${rewards.levelAfter}!</p>`;
  }
  for (const achievement of rewards.newAchievements) {
    html += `<p class="unlock-note">${icon(achievement.icon)}Badge unlocked: <strong>${achievement.name}</strong></p>`;
  }
  for (const theme of rewards.newThemes) {
    html += `<p class="unlock-note">${icon("palette")}New theme: <strong>${theme.name}</strong> <a href="./settings.html">Try it</a></p>`;
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

// actions: [{ label, icon, primary, onClick }]
function showResult({ won, eyebrow, title, body = "", rewards = null, actions }) {
  dialog.className = `dialog result ${won ? "is-win" : "is-lose"}`;
  dialog.innerHTML = `
    <div class="result-badge">${icon(won ? "check" : "close")}</div>
    <p class="eyebrow">${eyebrow}</p>
    <h2 id="result-title">${title}</h2>
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
  if (won) launchConfetti();
  refreshHeader();
}

function closeResult() {
  if (dialog.open) dialog.close();
}

// Escape closes the dialog only where that makes sense (see each mode)
dialog.addEventListener("cancel", (event) => event.preventDefault());

function shareAction(getText) {
  return {
    label: "Share",
    icon: "share",
    onClick: async () => {
      const copied = await copyText(getText());
      showToast(copied ? "Result copied. Paste it anywhere!" : "Could not copy the result.", icon("check"));
    },
  };
}

function missesText(misses) {
  return misses === 1 ? "1 miss" : `${misses} misses`;
}

function wordReveal(word) {
  return `<p class="result-word" aria-label="The word was ${word}">${word}</p>`;
}

// ---------- Setup panel (Classic and Time Attack) ----------

function optionGroup(name, label, items, selected) {
  const options = items.map((item) => `
    <label class="segment">
      <input type="radio" name="${name}" value="${item.id}"${item.id === selected ? " checked" : ""}>
      <span>${item.name}${item.detail ? `<small>${item.detail}</small>` : ""}</span>
    </label>`).join("");
  return `<fieldset class="option-group"><legend>${label}</legend><div class="segments segments-${name}">${options}</div></fieldset>`;
}

function showSetup(intro, startLabel, onStart) {
  const options = data.settings.options;
  const categories = [{ id: "mixed", name: "Mixed" }, ...CATEGORIES];
  const difficulties = DIFFICULTIES.map((d) => ({ ...d, detail: `${d.lives} lives` }));
  setupEl.innerHTML = `
    <p class="setup-intro">${intro}</p>
    <form class="setup-form">
      ${optionGroup("category", "Category", categories, options.category)}
      ${optionGroup("length", "Word length", LENGTHS, options.length)}
      ${optionGroup("difficulty", "Difficulty", difficulties, options.difficulty)}
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
  const lengthName = LENGTHS.find((l) => l.id === length)?.name;
  const difficultyName = DIFFICULTIES.find((d) => d.id === difficulty)?.name;
  return `${getCategoryName(category)} · ${lengthName} · ${difficultyName}`;
}

// ---------- Mode: Classic ----------

const classic = {
  title: "Classic",
  start() {
    subtitleEl.textContent = "Endless play, word after word";
    showSetup("Pick your options and play as many words as you like.", "Start playing", () => classic.next());
  },
  next() {
    closeResult();
    const { category, length, difficulty } = data.settings.options;
    const pick = pickWord(category, length, data.stats.recentWords);
    subtitleEl.textContent = optionsSummary();
    hintButton.hidden = false;
    startRound({ ...pick, lives: getLives(difficulty) });
  },
  onRoundEnd(won) {
    const rewards = recordWord({ ...roundResult(won) });
    const streak = data.stats.winStreak;
    showResult({
      won,
      eyebrow: won ? `${missesText(round.misses)} · Win streak ${streak}` : "Out of lives",
      title: won ? "Solved!" : "Not this time",
      body: wordReveal(round.word),
      rewards,
      actions: [
        { label: "Next word", icon: "next", primary: true, onClick: () => classic.next() },
        { label: "Options", icon: "sliders", onClick: () => { closeResult(); classic.start(); } },
        ...(won ? [shareAction(() => `I solved a ${round.word.length}-letter word in Hanglet with ${missesText(round.misses)}. ${shareLink()}`)] : []),
      ],
    });
  },
};

// ---------- Mode: Levels ----------

let levelNumber = 1;

const levels = {
  title: "Levels",
  start() {
    const unlocked = highestUnlocked(data.levels.stars);
    const asked = parseInt(params.get("level"), 10);
    levelNumber = asked >= 1 && asked <= unlocked ? asked : unlocked;
    levels.play();
  },
  play() {
    closeResult();
    const level = getLevel(levelNumber);
    titleEl.textContent = `Level ${levelNumber}`;
    subtitleEl.textContent = `${level.stage} · ${getCategoryName(level.category)} · ${level.lives} lives`;
    history.replaceState(null, "", `?mode=levels&level=${levelNumber}`);
    hintButton.hidden = false;
    const pick = pickWord(level.category, level.length, data.stats.recentWords);
    startRound({ ...pick, lives: level.lives });
  },
  onRoundEnd(won) {
    const stars = won ? starsFor(round.misses, round.lives) : 0;
    if (won) recordLevel(levelNumber, stars);
    const rewards = recordWord({ ...roundResult(won) });
    const starRow = `<div class="star-row" aria-label="${stars} of 3 stars">${[1, 2, 3]
      .map((n) => `<span class="${n <= stars ? "is-earned" : ""}">${icon("star")}</span>`).join("")}</div>`;
    const isLast = levelNumber >= LEVEL_COUNT;

    const actions = won
      ? [
          isLast
            ? { label: "Level path", icon: "path", primary: true, href: "./levels.html" }
            : { label: `Level ${levelNumber + 1}`, icon: "next", primary: true, onClick: () => { levelNumber++; levels.play(); } },
          { label: "Replay", icon: "refresh", onClick: () => levels.play() },
          shareAction(() => `I finished level ${levelNumber} in Hanglet with ${stars} of 3 stars. ${shareLink()}`),
        ]
      : [
          { label: "Try again", icon: "refresh", primary: true, onClick: () => levels.play() },
          { label: "Level path", icon: "path", href: "./levels.html" },
        ];

    showResult({
      won,
      eyebrow: `Level ${levelNumber}`,
      title: won ? (isLast ? "You reached the summit!" : "Level complete") : "Level failed",
      body: (won ? starRow : "") + wordReveal(round.word),
      rewards,
      actions,
    });
  },
};

// ---------- Mode: Daily ----------

const today = toDateKey();
const dailyNumber = getDailyNumber(today);
const dailyWords = getDailyWords(today);

const daily = {
  title: `Daily #${dailyNumber}`,
  start() {
    if (data.daily.history[today]) {
      daily.showDone();
      return;
    }
    // Continue a Daily that was started earlier today, or start a new one
    if (!data.daily.progress || data.daily.progress.date !== today) {
      data.daily.progress = { date: today, index: 0, results: [], guessed: [] };
      save();
    }
    daily.playCurrent();
  },
  playCurrent() {
    closeResult();
    const progress = data.daily.progress;
    subtitleEl.textContent = `Word ${progress.index + 1} of ${dailyWords.length} · ${getCategoryName(dailyWords[progress.index].category)}`;
    statusEl.innerHTML = dailyDots(progress.results, progress.index);
    hintButton.hidden = false;
    startRound({ ...dailyWords[progress.index], lives: DAILY_LIVES }, progress.guessed);
  },
  onGuess() {
    data.daily.progress.guessed = [...round.guessed];
    save();
  },
  onRoundEnd(won) {
    const progress = data.daily.progress;
    let rewards = recordWord({ ...roundResult(won) });
    progress.results.push({ won, misses: round.misses, lives: round.lives, word: round.word, category: round.category });
    progress.index++;
    progress.guessed = [];
    save();
    statusEl.innerHTML = dailyDots(progress.results, progress.index);

    const finished = progress.index >= dailyWords.length;
    if (!finished) {
      showResult({
        won,
        eyebrow: `Word ${progress.index} of ${dailyWords.length}`,
        title: won ? "Nice one!" : "Missed it",
        body: wordReveal(round.word),
        rewards,
        actions: [{ label: "Next word", icon: "next", primary: true, onClick: () => daily.playCurrent() }],
      });
      return;
    }

    const results = progress.results;
    recordDaily(today, results);
    rewards = combineRewards(rewards, checkAchievements());
    const solved = results.filter((r) => r.won).length;
    showResult({
      won: solved > 0,
      eyebrow: `Daily #${dailyNumber} · Streak ${currentDailyStreak()}`,
      title: `${solved} of ${results.length} solved`,
      body: wordReveal(round.word) + dailySummary(results),
      rewards,
      actions: [
        { ...shareAction(() => dailyShareText(results)), primary: true },
        { label: "Done", icon: "check", onClick: () => { closeResult(); daily.showDone(); } },
      ],
    });
  },
  showDone() {
    const entry = data.daily.history[today];
    subtitleEl.textContent = "Come back tomorrow for new words";
    hintButton.hidden = true;
    boardEl.hidden = true;
    setupEl.hidden = false;
    setupEl.innerHTML = `
      <div class="daily-done">
        <p class="eyebrow">Daily #${dailyNumber}</p>
        <h2>You solved ${entry.solved} of ${entry.total} today</h2>
        ${dailySummary(entry.results, true)}
        <div class="daily-done-stats">
          <div><strong>${currentDailyStreak()}</strong><span>Day streak</span></div>
          <div><strong id="next-daily">${timeUntilTomorrow()}</strong><span>Next Daily</span></div>
        </div>
        <div class="result-actions">
          <button class="button button-primary" type="button" id="share-daily">${icon("share")}<span>Share result</span></button>
          <a class="button button-secondary" href="./play.html?mode=classic">${icon("infinity")}<span>Play Classic</span></a>
        </div>
      </div>`;
    setupEl.querySelector("#share-daily").addEventListener("click", shareAction(() => dailyShareText(entry.results)).onClick);
  },
};

function dailyDots(results, index) {
  return `<ol class="daily-dots" aria-label="Daily progress">${dailyWords.map((_, i) => {
    const result = results[i];
    const state = result ? (result.won ? "is-won" : "is-lost") : i === index ? "is-current" : "";
    const label = result ? (result.won ? "solved" : "missed") : i === index ? "current" : "to do";
    return `<li class="${state}" aria-label="Word ${i + 1}: ${label}"></li>`;
  }).join("")}</ol>`;
}

function dailySummary(results, showWords = false) {
  return `<ul class="daily-summary">${results.map((r, i) => `
    <li class="${r.won ? "is-won" : "is-lost"}">
      ${icon(r.won ? "check" : "close")}
      <span>${showWords ? `<strong>${r.word}</strong> · ${getCategoryName(r.category)}` : `Word ${i + 1}`}</span>
      <span class="muted">${r.won ? missesText(r.misses) : "not solved"}</span>
    </li>`).join("")}</ul>`;
}

// Spoiler-free: only shows solved or not and how many misses
function dailyShareText(results) {
  const solved = results.filter((r) => r.won).length;
  const lines = results.map((r) => {
    const marks = "●".repeat(r.misses) + "○".repeat(Math.max(0, r.lives - r.misses));
    return `${r.won ? "✅" : "❌"} ${marks}`;
  });
  return `Hanglet Daily #${dailyNumber} · ${solved}/${results.length}\n${lines.join("\n")}\n${shareLink()}`;
}

// ---------- Mode: Time Attack ----------

const TIME_LIMIT = 120; // seconds
let timerId = null;
let endTime = 0;
let timedScore = 0;

const timed = {
  title: "Time Attack",
  start() {
    subtitleEl.textContent = "Solve as many words as you can in 2 minutes";
    statusEl.innerHTML = "";
    showSetup("The clock starts as soon as you press start. A missed word costs no time, just move on!", "Start the clock", () => timed.begin());
  },
  begin() {
    closeResult();
    timedScore = 0;
    endTime = Date.now() + TIME_LIMIT * 1000;
    subtitleEl.textContent = optionsSummary();
    statusEl.innerHTML = `
      <div class="timer" role="timer" aria-label="Time left">
        <span class="timer-bar"><span id="timer-fill"></span></span>
        <span class="timer-text" id="timer-text">2:00</span>
      </div>
      <span class="score-chip" id="timed-score" aria-live="polite">0 solved</span>`;
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
    startRound({ ...pick, lives: getLives(difficulty) });
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
    busy = true;
    updateHintButton();
    if (won) {
      timedScore++;
      document.getElementById("timed-score").textContent = `${timedScore} solved`;
    }
    // Short pause so the player sees the word, then the next one
    setTimeout(() => {
      if (Date.now() < endTime) timed.next();
    }, won ? 650 : 1300);
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
      eyebrow: rewards.isBest ? "New personal best!" : `Best: ${data.timed.best}`,
      title: `${timedScore} ${timedScore === 1 ? "word" : "words"} solved`,
      body: `<p class="result-text">Time is up. ${round && !round.isWon() ? `The last word was <strong>${round.word}</strong>.` : ""}</p>`,
      rewards,
      actions: [
        { label: "Play again", icon: "refresh", primary: true, onClick: () => timed.begin() },
        { label: "Options", icon: "sliders", onClick: () => { closeResult(); timed.start(); } },
        shareAction(() => `I solved ${timedScore} words in 2 minutes in Hanglet Time Attack. ${shareLink()}`),
      ],
    });
  },
};

// ---------- Helpers and start ----------

function roundResult(won) {
  return {
    won,
    misses: round.misses,
    lives: round.lives,
    word: round.word,
    category: round.category,
    hintsUsed: 0, // hints are counted when they are used
  };
}

function shareLink() {
  return location.origin + location.pathname.replace(/play\.html$/, "");
}

const MODES = { classic, levels, daily, timed };
const mode = MODES[modeName];

document.title = `${mode.title} – Hanglet`;
titleEl.textContent = mode.title;
hintButton.innerHTML = `${icon("bulb")}<span>Hint</span><span class="hint-cost">${icon("coin")}${HINT_COST}</span>`;
hintButton.addEventListener("click", useHint);

// Play with the real keyboard too
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const letter = event.key.toLowerCase();
  if (letter.length === 1 && letter >= "a" && letter <= "z") {
    handleGuess(letter);
  }
});

mode.start();
