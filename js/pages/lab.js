// Lab page: a test of a new game idea, "the riddle gets clearer".
// - Every word has 3 clues. You start with clue 1 (smart and hard).
//   After 2 wrong letters clue 2 shows, after 2 more clue 3.
// - "I know it!" lets you type the whole word. A wrong word costs 2 lives.
// - Solved at clue 1 = 3 stars, clue 2 = 2 stars, clue 3 = 1 star.
// - A round has 5 words, then you see your stars and can share them.
// This page saves nothing: the player's progress in the real game stays the same.
import LAB_WORDS from "../../data/lab-words.js";
import { Round } from "../core/round.js";
import { language, t, tn } from "../core/i18n.js";
import { shuffle } from "../core/random.js";
import { cleanWord } from "../core/challenge.js";
import { initPage } from "../ui/layout.js";
import { createKeyboard } from "../ui/keyboard.js";
import { createMascot, mascotSvg } from "../ui/mascot.js";
import { icon } from "../ui/icons.js";
import { playSound, vibrate } from "../ui/feedback.js";
import { burst, floatText } from "../ui/effects.js";
import { launchConfetti } from "../ui/confetti.js";
import { shareResult } from "../ui/share.js";
import { isReducedMotion } from "../ui/appearance.js";

// ---------- Rules of the test ----------
const WORDS_PER_ROUND = 5;
const LIVES = 7;
const MISSES_PER_CLUE = 2; // a new clue after every 2 lost lives
const WRONG_WORD_COST = 2;
const MAX_STARS = 3;

// ---------- Texts (the lab has its own texts, so the language files stay the same) ----------
const TEXTS = {
  en: {
    title: "Hanglet Lab",
    wordOf: "Word {number} of {total}",
    clue: "Clue {number}",
    lockedNextOne: "Comes after 1 more wrong letter",
    lockedNext: "Comes after {count} more wrong letters",
    lockedLater: "Comes after clue {number}",
    worth: "Solve it now for",
    knowIt: "I know it!",
    guessLabel: "Type the whole word",
    check: "Check",
    cancel: "Cancel",
    costNote: "A wrong word costs {cost} lives.",
    lastLivesNote: "Careful: you only have {count} lives left.",
    wrongLength: "The word has {count} letters. Try again, this one is free.",
    wrongWord: "Not \"{guess}\". That costs {cost} lives.",
    newClue: "New clue! Clue {number} is open.",
    solvedAt: "Solved with clue {number}!",
    lost: "Not this time",
    starsWon: "{count} of {max} stars",
    allClues: "All clues",
    nextWord: "Next word",
    seeResult: "See your result",
    roundDone: "Round done!",
    total: "{count} of {max} stars",
    again: "Play another round",
    share: "Share",
    home: "Home",
    shareText: "Hanglet Lab: {count}/{max} stars",
    announceWord: "New word with {count} letters. Clue 1: {clue}",
  },
  nl: {
    title: "Hanglet Lab",
    wordOf: "Woord {number} van {total}",
    clue: "Aanwijzing {number}",
    lockedNextOne: "Komt na nog 1 foute letter",
    lockedNext: "Komt na nog {count} foute letters",
    lockedLater: "Komt na aanwijzing {number}",
    worth: "Raad het nu voor",
    knowIt: "Ik weet het!",
    guessLabel: "Typ het hele woord",
    check: "Controleer",
    cancel: "Annuleer",
    costNote: "Een fout woord kost {cost} levens.",
    lastLivesNote: "Let op: je hebt nog maar {count} levens.",
    wrongLength: "Het woord heeft {count} letters. Probeer opnieuw, dit kost niks.",
    wrongWord: "Niet \"{guess}\". Dat kost {cost} levens.",
    newClue: "Nieuwe aanwijzing! Aanwijzing {number} is open.",
    solvedAt: "Geraden bij aanwijzing {number}!",
    lost: "Deze keer niet",
    starsWon: "{count} van de {max} sterren",
    allClues: "Alle aanwijzingen",
    nextWord: "Volgend woord",
    seeResult: "Bekijk je uitslag",
    roundDone: "Ronde klaar!",
    total: "{count} van de {max} sterren",
    again: "Nog een ronde",
    share: "Delen",
    home: "Home",
    shareText: "Hanglet Lab: {count}/{max} sterren",
    announceWord: "Nieuw woord met {count} letters. Aanwijzing 1: {clue}",
  },
};

function lab(key, params = {}) {
  let text = (TEXTS[language] || TEXTS.en)[key] ?? key;
  for (const [name, value] of Object.entries(params)) {
    text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}

// ---------- Page elements ----------
initPage("lab");

const subtitleEl = document.getElementById("lab-subtitle");
const totalEl = document.getElementById("lab-total");
const boardEl = document.getElementById("board");
const worthEl = document.getElementById("lab-worth");
const livesEl = document.getElementById("lives");
const cluesEl = document.getElementById("lab-clues");
const wordEl = document.getElementById("word");
const knowButton = document.getElementById("know-button");
const guessForm = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const guessNote = document.getElementById("guess-note");
const comboEl = document.getElementById("combo");
const announcer = document.getElementById("announcer");
const dialog = document.getElementById("result-dialog");
const mascot = createMascot(document.getElementById("lab-mascot"), "thinking");
const keyboard = createKeyboard(document.getElementById("keyboard"), handleGuess);

document.title = `${lab("title")} – Hanglet`;
document.getElementById("lab-title").textContent = lab("title");
knowButton.innerHTML = `${icon("bulb")}<span>${lab("knowIt")}</span>`;
document.getElementById("guess-label").textContent = lab("guessLabel");
document.getElementById("guess-check").textContent = lab("check");
document.getElementById("guess-cancel").textContent = lab("cancel");

// ---------- Game state ----------
// The words are shuffled once; every round takes the next 5, so words only
// come back after the whole list has been played.
let deck = [];
let roundWords = [];
let results = []; // stars per word: 0 (lost) to 3
let index = 0;
let item = null; // { word, clues }
let round = null;
let busy = false;

function nextFromDeck() {
  if (deck.length === 0) deck = shuffle(LAB_WORDS[language] || LAB_WORDS.en);
  return deck.pop();
}

// 1, 2 or 3: which clues are open, based on the lives lost
function clueLevel() {
  return Math.min(MAX_STARS, 1 + Math.floor(round.misses / MISSES_PER_CLUE));
}

function starsText(count) {
  return count > 0 ? "⭐".repeat(count) : "❌";
}

function announce(text) {
  announcer.textContent = "";
  setTimeout(() => (announcer.textContent = text), 50);
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

// ---------- A round of 5 words ----------

function startRound() {
  roundWords = Array.from({ length: WORDS_PER_ROUND }, nextFromDeck);
  results = [];
  index = 0;
  startWord();
}

function startWord() {
  item = roundWords[index];
  round = new Round({ word: item.word, category: "lab", lives: LIVES });
  busy = false;
  keyboard.reset();
  keyboard.setLocked(false);
  closeGuessForm();
  knowButton.disabled = false;
  mascot.setMood("thinking");
  subtitleEl.textContent = lab("wordOf", { number: index + 1, total: WORDS_PER_ROUND });
  updateTotal();
  buildTiles();
  updateTiles();
  updateLives();
  updateClues();
  boardEl.hidden = false;
  announce(lab("announceWord", { count: item.word.length, clue: item.clues[0] }));
}

function handleGuess(letter) {
  if (!round || busy || dialog.open || !guessForm.hidden || round.isOver()) return;
  const levelBefore = clueLevel();
  const result = round.guess(letter);
  if (result === "ignored") return;

  keyboard.mark(letter, result);
  if (result === "correct") {
    playSound("correct");
    const newTiles = updateTiles();
    newTiles.forEach((tile) => burst(tile, 8));
    mascot.setMood("happy");
    mascot.react("bounce");
    announce(t("play.letterRight", { letter: letter.toUpperCase() }));
  } else {
    playSound("wrong");
    vibrate(40);
    shake();
    mascot.setMood(round.livesLeft() <= 2 ? "surprised" : "thinking");
    mascot.react("shake");
    updateLives();
    announce(t("play.letterWrong", { letter: letter.toUpperCase(), count: round.livesLeft() }));
  }
  afterMove(levelBefore);
}

// After every letter or word: open a new clue, or end the word
function afterMove(levelBefore) {
  updateClues();
  if (!round.isOver() && clueLevel() > levelBefore) {
    playSound("hint");
    say(lab("newClue", { number: clueLevel() }));
  }
  if (round.isOver()) endWord();
}

// ---------- "I know it!": type the whole word ----------

function openGuessForm() {
  if (!round || busy || round.isOver()) return;
  guessForm.hidden = false;
  knowButton.hidden = true;
  guessInput.value = "";
  guessInput.maxLength = item.word.length + 4;
  const left = round.livesLeft();
  guessNote.textContent = left <= WRONG_WORD_COST
    ? `${lab("costNote", { cost: WRONG_WORD_COST })} ${lab("lastLivesNote", { count: left })}`
    : lab("costNote", { cost: WRONG_WORD_COST });
  guessNote.classList.toggle("is-warning", left <= WRONG_WORD_COST);
  keyboard.setLocked(true);
  guessInput.focus();
}

function closeGuessForm() {
  guessForm.hidden = true;
  knowButton.hidden = false;
  if (round && !round.isOver()) keyboard.setLocked(false);
}

function checkWord(event) {
  event.preventDefault();
  if (!round || round.isOver()) return;
  const guess = cleanWord(guessInput.value);
  if (!guess) return;

  // A typo in the length is free: the tiles already show how long the word is
  if (guess.length !== item.word.length) {
    guessNote.textContent = lab("wrongLength", { count: item.word.length });
    guessNote.classList.add("is-warning");
    guessInput.select();
    return;
  }

  const levelBefore = clueLevel();
  closeGuessForm();
  if (guess === item.word) {
    // Fill in every letter at once
    for (const letter of new Set(item.word)) {
      if (!round.guessed.includes(letter)) {
        round.guessed.push(letter);
        keyboard.mark(letter, "correct");
      }
    }
    updateTiles().forEach((tile) => burst(tile, 8));
  } else {
    round.misses = Math.min(round.lives, round.misses + WRONG_WORD_COST);
    playSound("wrong");
    vibrate([60, 40, 60]);
    shake();
    mascot.setMood("surprised");
    mascot.react("shake");
    updateLives();
    floatText(comboEl, `−${WRONG_WORD_COST}`, "coral");
    say(lab("wrongWord", { guess, cost: WRONG_WORD_COST }));
    knowButton.focus();
  }
  afterMove(levelBefore);
}

// ---------- End of a word and of the round ----------

function endWord() {
  busy = true;
  const won = round.isWon();
  const stars = won ? MAX_STARS + 1 - clueLevel() : 0;
  const solvedAt = clueLevel();
  results.push(stars);
  keyboard.setLocked(true);
  knowButton.disabled = true;
  closeGuessForm();
  if (!won) updateTiles(true);
  updateTotal();
  // Show all clues, so you can judge them as a tester
  updateClues(true);
  mascot.setMood(won ? "cheering" : "sad");
  playSound(won ? "win" : "lose");
  vibrate(won ? [20, 40, 20] : [80, 40, 80]);

  const isLast = index === WORDS_PER_ROUND - 1;
  setTimeout(() => showWordResult(won, stars, solvedAt, isLast), isReducedMotion() ? 300 : 900);
}

function showWordResult(won, stars, solvedAt, isLast) {
  const tiles = [...item.word].map((letter, i) => `<span style="animation-delay:${i * 50}ms">${letter}</span>`).join("");
  const clues = item.clues.map((clue, i) =>
    `<li class="${won && i + 1 === solvedAt ? "is-solved-here" : ""}"><strong>${i + 1}</strong> ${clue}</li>`).join("");
  showDialog({
    won,
    eyebrow: lab("wordOf", { number: index + 1, total: WORDS_PER_ROUND }),
    title: won ? lab("solvedAt", { number: solvedAt }) : lab("lost"),
    body: `
      <div class="result-tiles" role="img" aria-label="${t("result.wordWas", { word: item.word })}">${tiles}</div>
      <p class="lab-stars" aria-label="${lab("starsWon", { count: stars, max: MAX_STARS })}">${starsText(stars)}</p>
      <p class="lab-clues-title">${lab("allClues")}</p>
      <ol class="lab-clue-list">${clues}</ol>`,
    actions: [
      isLast
        ? { label: lab("seeResult"), icon: "trophy", primary: true, onClick: showRoundResult }
        : { label: lab("nextWord"), icon: "play", primary: true, onClick: () => { closeDialog(); index++; startWord(); } },
    ],
  });
  if (won && stars === MAX_STARS) launchConfetti();
}

function roundTotal() {
  return results.reduce((sum, stars) => sum + stars, 0);
}

function showRoundResult() {
  const total = roundTotal();
  const max = WORDS_PER_ROUND * MAX_STARS;
  const line = results.map(starsText).join(" ");
  const shareText = `${lab("shareText", { count: total, max })}\n${line}\n${location.href.split("?")[0]}`;
  showDialog({
    won: total > 0,
    eyebrow: lab("roundDone"),
    title: lab("total", { count: total, max }),
    body: `<p class="lab-share-line">${line}</p>`,
    actions: [
      { label: lab("again"), icon: "refresh", primary: true, onClick: () => { closeDialog(); startRound(); } },
      { label: lab("share"), icon: "share", onClick: () => shareResult({
        text: shareText,
        card: { title: lab("title"), subtitle: line, big: total },
      }) },
      { label: lab("home"), icon: "home", href: "./index.html" },
    ],
  });
  if (total >= max - 3) launchConfetti();
}

// actions: [{ label, icon, primary, onClick, href }]
function showDialog({ won, eyebrow, title, body, actions }) {
  // The round result replaces the result of the last word
  closeDialog();
  dialog.className = `dialog result lab-result ${won ? "is-win" : "is-lose"}`;
  dialog.innerHTML = `
    <div class="result-hero">
      <div class="result-mascot">${mascotSvg(won ? "cheering" : "sad")}</div>
      <p class="eyebrow">${eyebrow}</p>
      <h2 id="result-title">${title}</h2>
    </div>
    <div class="result-body">${body}</div>
    <div class="result-actions"></div>`;
  const actionsEl = dialog.querySelector(".result-actions");
  for (const action of actions) {
    const button = document.createElement(action.href ? "a" : "button");
    button.className = `button ${action.primary ? "button-primary" : "button-secondary"}`;
    button.innerHTML = `${icon(action.icon)}<span>${action.label}</span>`;
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
}

function closeDialog() {
  if (dialog.open) dialog.close();
}

// ---------- Drawing ----------

function buildTiles() {
  wordEl.style.setProperty("--letters", item.word.length);
  wordEl.innerHTML = [...item.word].map(() => '<span class="tile"><span class="tile-letter"></span></span>').join("");
}

// Fill in guessed letters. With showAll, missing letters are shown too (after a loss).
function updateTiles(showAll = false) {
  const tiles = wordEl.children;
  const newTiles = [];
  let delay = 0;
  [...item.word].forEach((letter, i) => {
    const tile = tiles[i];
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
  const spoken = [...item.word]
    .map((letter, i) => (tiles[i].dataset.letter ? letter.toUpperCase() : t("play.blank")))
    .join(" ");
  wordEl.setAttribute("aria-label", t("play.wordLabel", { count: item.word.length, letters: spoken }));
  return newTiles;
}

// Hearts plus the text "5 lives left"
function updateLives() {
  const left = round.livesLeft();
  const hearts = Array.from({ length: round.lives }, (_, i) =>
    `<span class="heart${i < left ? "" : " is-lost"}">${icon("heart")}</span>`
  ).join("");
  livesEl.innerHTML = `<span class="hearts" aria-hidden="true">${hearts}</span><span class="lives-text">${tn("play.lives", left)}</span>`;
  livesEl.classList.toggle("is-low", left <= 2);
  livesEl.setAttribute("aria-label", t("play.livesLabel", { left, total: round.lives }));
}

// The three clues: open ones with their text, closed ones with when they come.
// With showAll (after the word) every clue is open.
function updateClues(showAll = false) {
  const level = clueLevel();
  cluesEl.innerHTML = item.clues.map((clue, i) => {
    const number = i + 1;
    const open = showAll || number <= level;
    const isNewest = !showAll && number === level;
    let locked = "";
    if (!open && number === level + 1) {
      const count = MISSES_PER_CLUE * level - round.misses;
      locked = count === 1 ? lab("lockedNextOne") : lab("lockedNext", { count });
    } else if (!open) {
      locked = lab("lockedLater", { number: number - 1 });
    }
    return `
      <li class="lab-clue ${open ? "is-open" : "is-locked"} ${isNewest ? "is-current" : ""}" data-clue="${number}">
        <span class="lab-clue-number" aria-hidden="true">${open ? number : icon("lock")}</span>
        <span class="lab-clue-body">
          <span class="lab-clue-label">${lab("clue", { number })}</span>
          <span class="lab-clue-text">${open ? clue : locked}</span>
        </span>
      </li>`;
  }).join("");
  const stars = round.isOver() ? 0 : MAX_STARS + 1 - level;
  worthEl.innerHTML = round.isOver()
    ? ""
    : `<span>${lab("worth")}</span> <span class="lab-worth-stars" aria-label="${lab("starsWon", { count: stars, max: MAX_STARS })}">${starsText(stars)}</span>`;
}

function updateTotal() {
  const max = WORDS_PER_ROUND * MAX_STARS;
  totalEl.innerHTML = `<span aria-hidden="true">⭐</span> <span>${roundTotal()} / ${max}</span>`;
  totalEl.setAttribute("aria-label", lab("total", { count: roundTotal(), max }));
}

function shake() {
  boardEl.classList.remove("is-shaking");
  void boardEl.offsetWidth; // restart the animation
  boardEl.classList.add("is-shaking");
}

// ---------- Start ----------

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

// The player has to choose an action, so Escape does nothing
dialog.addEventListener("cancel", (event) => event.preventDefault());

// Play with the real keyboard too
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target.closest?.("input, textarea")) return;
  const letter = event.key.toLowerCase();
  if (letter.length === 1 && letter >= "a" && letter <= "z") {
    handleGuess(letter);
  }
});

startRound();
