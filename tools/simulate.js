// Plays Hanglet automatically to check how hard it is (the rules of v5:
// 3 clues that get clearer, "I know it!" and 3/2/1 stars).
//   node tools/simulate.js [rounds] [difficulty] [seed]
// Three simple players, all on the same words:
//   "letters": guesses the most common letters of the language first and
//              never reads the clues (a worst case)
//   "clues":   the same, but recognises the word from the clues and then
//              types it with "I know it!". How many tiles must be visible
//              depends on the open clue (RECOGNISE below, an assumption:
//              change it to try other players)
//   "list":    knows the category, the length and the whole word list, and
//              guesses the letter that fits most words left (a best case)
// Words are picked like the Daily: a third short, a third medium, a third long.
import EN from "../data/words/en.js";
import NL from "../data/words/nl.js";
import { Round } from "../js/core/round.js";
import { freeLetters, getDifficulty } from "../js/core/difficulty.js";
import { seededRandom } from "../js/core/random.js";

const rounds = Number(process.argv[2]) || 50;
const difficulty = getDifficulty(process.argv[3] || "normal");
const random = seededRandom(Number(process.argv[4]) || 2026);

// Letter frequency order per language
const ORDER = {
  en: "etaoinsrhldcumfpgwybvkxjqz",
  nl: "enatirodslgvhkmubpwjczfxyq",
};
const LISTS = { en: EN, nl: NL };
const BUCKETS = [[4, 5], [6, 7], [8, 99]];
// Part of the tiles that must be visible before the word "clicks", with clue 1, 2 or 3 open
const RECOGNISE = [0.75, 0.5, 0.25];

// Every word except the season list (like the Daily)
function allWords(lang) {
  return Object.entries(LISTS[lang])
    .filter(([category]) => category !== "winter")
    .flatMap(([category, words]) => words.map((item) => ({ ...item, category })));
}

function pickWords(lang, count) {
  const words = allWords(lang);
  return Array.from({ length: count }, (_, i) => {
    const [min, max] = BUCKETS[i % 3];
    const group = words.filter((item) => item.word.length >= min && item.word.length <= max);
    return group[Math.floor(random() * group.length)];
  });
}

function startRound(item) {
  const round = new Round({ ...item, lives: difficulty.lives, maxClues: difficulty.maxClues });
  for (const letter of freeLetters(item.word, difficulty.id)) round.giveLetter(letter);
  return round;
}

function playByLetters(item, lang) {
  const round = startRound(item);
  for (const letter of ORDER[lang]) {
    if (round.isOver()) break;
    round.guess(letter);
  }
  return round;
}

function playByClues(item, lang) {
  const round = startRound(item);
  for (const letter of ORDER[lang]) {
    if (round.isOver()) break;
    if (round.revealedCount() / round.word.length >= RECOGNISE[round.openClues() - 1]) {
      round.guessWord(round.word);
      break;
    }
    round.guess(letter);
  }
  return round;
}

// Does a word fit what is on the board so far?
function fits(word, round) {
  return [...word].every((letter, i) => {
    const shown = round.guessed.includes(round.word[i]);
    if (shown) return letter === round.word[i];
    return !round.guessed.includes(letter);
  });
}

function playByList(item, lang) {
  const round = startRound(item);
  const pool = LISTS[lang][item.category].map(({ word }) => word).filter((word) => word.length === item.word.length);
  while (!round.isOver()) {
    const left = pool.filter((word) => fits(word, round));
    const counts = {};
    for (const word of left) {
      for (const letter of new Set(word)) {
        if (!round.guessed.includes(letter)) counts[letter] = (counts[letter] || 0) + 1;
      }
    }
    const best = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || ORDER[lang].indexOf(a) - ORDER[lang].indexOf(b))[0];
    round.guess(best || [...ORDER[lang]].find((letter) => !round.guessed.includes(letter)));
  }
  return round;
}

// Win %, stars per word and % solved at clue 1
function summary(played) {
  const won = played.filter((round) => round.isWon());
  const stars = played.reduce((sum, round) => sum + round.stars(), 0);
  const atClue1 = won.filter((round) => round.openClues() === 1).length;
  const percent = (n, total) => `${Math.round((n / Math.max(1, total)) * 100)}%`;
  return `${percent(won.length, played.length)} won, ${(stars / played.length).toFixed(1)}★, ${percent(atClue1, won.length)} at clue 1`.padEnd(32);
}

console.log(`Hanglet simulation: ${rounds} rounds per language on ${difficulty.id} (${difficulty.lives} lives, ${difficulty.maxClues} clues)\n`);
console.log("language | common letters first             | + reads the clues                | knows the word list");
for (const lang of ["en", "nl"]) {
  const words = pickWords(lang, rounds);
  const row = [playByLetters, playByClues, playByList].map((player) => summary(words.map((item) => player(item, lang))));
  console.log(`${lang.padEnd(8)} | ${row.join(" | ")}`);
}
