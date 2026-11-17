// Plays Hanglet automatically to check how hard it is.
//   node tools/simulate.js [rounds] [difficulty] [seed]
// Three simple players, all on the same words:
//   "letters":  guesses the most common letters of the language first and
//               ignores the riddle (the simple strategy, a worst case)
//   "riddle":   the same, but with the riddle on screen the player recognises
//               the word once half of the tiles are filled in (an assumption,
//               change RECOGNISE below to try other players)
//   "category": knows the category, the length and the whole word list, and
//               guesses the letter that fits most words left (a best case)
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
const CATEGORIES = ["animals", "food", "countries", "sports", "nature", "jobs", "science", "music", "colors", "clothing"];
const BUCKETS = [[4, 5], [6, 7], [8, 99]];
const RECOGNISE = 0.5; // part of the tiles that must be visible before the riddle "clicks"

function allWords(lang) {
  return CATEGORIES.flatMap((category) => LISTS[lang][category].map(([word]) => ({ word, category })));
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
  const round = new Round({ ...item, lives: difficulty.lives });
  for (const letter of freeLetters(item.word, difficulty.id)) round.giveLetter(letter);
  return round;
}

function playByLetters(item, lang) {
  const round = startRound(item);
  for (const letter of ORDER[lang]) {
    if (round.isOver()) break;
    round.guess(letter);
  }
  return round.isWon();
}

function playByRiddle(item, lang) {
  const round = startRound(item);
  if (!difficulty.riddle) return playByLetters(item, lang);
  for (const letter of ORDER[lang]) {
    if (round.isOver()) break;
    if (round.revealedCount() / round.word.length >= RECOGNISE) return true;
    round.guess(letter);
  }
  return round.isWon();
}

// Does a word fit what is on the board so far?
function fits(word, round) {
  return [...word].every((letter, i) => {
    const shown = round.guessed.includes(round.word[i]);
    if (shown) return letter === round.word[i];
    return !round.guessed.includes(letter);
  });
}

function playByCategory(item, lang) {
  const round = startRound(item);
  const pool = LISTS[lang][item.category].map(([word]) => word).filter((word) => word.length === item.word.length);
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
  return round.isWon();
}

const results = [];
for (const lang of ["en", "nl"]) {
  const words = pickWords(lang, rounds);
  const letters = words.filter((item) => playByLetters(item, lang)).length;
  const riddle = words.filter((item) => playByRiddle(item, lang)).length;
  const category = words.filter((item) => playByCategory(item, lang)).length;
  results.push({ lang, letters, riddle, category });
}

const percent = (n) => `${Math.round((n / rounds) * 100)}%`;
console.log(`Hanglet simulation: ${rounds} rounds per language on ${difficulty.id} (${difficulty.lives} lives)\n`);
const cell = (n) => `${n}/${rounds} = ${percent(n)}`.padEnd(20);
console.log("language | common letters first | + reads the riddle   | knows the word list");
for (const { lang, letters, riddle, category } of results) {
  console.log(`${lang.padEnd(8)} | ${cell(letters)} | ${cell(riddle)} | ${cell(category)}`);
}
