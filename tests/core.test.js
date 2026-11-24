// The core rules: the riddle gets clearer, "I know it!", stars, levels,
// the challenge link and the rewards.
import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_STARS, Round, WRONG_WORD_COST } from "../js/core/round.js";
import { LEVEL_COUNT, getLevel, highestUnlocked, starsForLevel } from "../js/core/levels.js";
import { cleanWord, decodeChallenge, encodeChallenge, isValidWord } from "../js/core/challenge.js";
import { data } from "../js/core/storage.js";
import { recordWord, setDifficulty, nextUnlock } from "../js/core/progress.js";
import { isThemeUnlocked, THEMES } from "../js/core/themes.js";
import { FIGURES, isFigureOwned } from "../js/core/figures.js";

const CLUES = ["smart clue", "clearer clue", "almost the answer"];

function newRound(options = {}) {
  return new Round({ word: "lion", category: "animals", lives: 7, clues: CLUES, ...options });
}

// ---------- Clues ----------

test("you start with only clue 1, worth 3 stars", () => {
  const round = newRound();
  assert.equal(round.openClues(), 1);
  assert.equal(round.starsNow(), 3);
  assert.equal(round.missesToNextClue(), 2);
});

test("every 2 wrong letters open the next clue", () => {
  const round = newRound();
  round.guess("x");
  assert.equal(round.openClues(), 1);
  assert.equal(round.missesToNextClue(), 1);
  round.guess("z");
  assert.equal(round.openClues(), 2);
  assert.equal(round.starsNow(), 2);
  round.guess("q");
  round.guess("w");
  assert.equal(round.openClues(), 3);
  assert.equal(round.starsNow(), 1);
  assert.equal(round.missesToNextClue(), 0, "there is no clue 4");
  round.guess("v");
  round.guess("u");
  assert.equal(round.openClues(), 3, "it never goes past clue 3");
});

test("right letters never open a clue", () => {
  const round = newRound();
  round.guess("l");
  round.guess("i");
  assert.equal(round.openClues(), 1);
});

test("Hard (2 clues): clue 3 never comes", () => {
  const round = newRound({ maxClues: 2, lives: 6 });
  for (const letter of "xzqwv") round.guess(letter);
  assert.equal(round.openClues(), 2);
  assert.equal(round.starsNow(), 2);
});

test("Kids: every wrong letter opens the next clue", () => {
  const round = new Round({ word: "cat", category: "animals", lives: Infinity, clues: CLUES, missesPerClue: 1 });
  round.guess("x");
  assert.equal(round.openClues(), 2);
  round.guess("z");
  assert.equal(round.openClues(), 3);
});

// ---------- Stars ----------

test("solved at clue 1, 2 or 3 gives 3, 2 or 1 stars; lost gives 0", () => {
  const atClue = (wrong) => {
    const round = newRound();
    for (const letter of wrong) round.guess(letter);
    for (const letter of "lion") round.guess(letter);
    return round.stars();
  };
  assert.equal(atClue(""), 3);
  assert.equal(atClue("x"), 3);
  assert.equal(atClue("xz"), 2);
  assert.equal(atClue("xzqw"), 1);
  assert.equal(atClue("xzqwvu"), 1);

  const lost = newRound();
  for (const letter of "xzqwvuy") lost.guess(letter);
  assert.equal(lost.isLost(), true);
  assert.equal(lost.stars(), 0);
  assert.equal(MAX_STARS, 3);
});

// ---------- "I know it!" ----------

test("I know it!: the right word solves the round at once", () => {
  const round = newRound();
  assert.equal(round.guessWord("lion"), "correct");
  assert.equal(round.isWon(), true);
  assert.equal(round.solvedByWord, true);
  assert.equal(round.stars(), 3);
});

test("I know it!: a wrong word costs 2 lives and can open a clue", () => {
  const round = newRound();
  assert.equal(WRONG_WORD_COST, 2);
  assert.equal(round.guessWord("bear"), "wrong");
  assert.equal(round.livesLeft(), 5);
  assert.equal(round.openClues(), 2);
  assert.equal(round.wordGuesses, 1);
});

test("I know it!: a word with the wrong length is free", () => {
  const round = newRound();
  assert.equal(round.guessWord("tiger"), "length");
  assert.equal(round.livesLeft(), 7);
});

test("I know it!: a wrong word can end the round, but never below 0 lives", () => {
  const round = newRound({ lives: 1 });
  assert.equal(round.guessWord("bear"), "wrong");
  assert.equal(round.isLost(), true);
  assert.equal(round.livesLeft(), 0);
  assert.equal(round.guessWord("lion"), "ignored");
});

// ---------- Basic round rules ----------

test("a round is won when every letter is found", () => {
  const round = newRound();
  for (const letter of "lion") assert.equal(round.guess(letter), "correct");
  assert.equal(round.isWon(), true);
});

test("a round is lost when the lives run out", () => {
  const round = newRound({ lives: 2 });
  round.guess("x");
  round.guess("z");
  assert.equal(round.isLost(), true);
  assert.equal(round.guess("l"), "ignored");
});

test("a round without a limit (Kids) can never be lost", () => {
  const round = new Round({ word: "cat", category: "animals", lives: Infinity, clues: CLUES });
  for (const letter of "bdefghij") round.guess(letter);
  assert.equal(round.isLost(), false);
});

// ---------- Levels ----------

test("40 levels, with longer words and more riddles per level", () => {
  assert.equal(LEVEL_COUNT, 40);
  assert.equal(getLevel(1).length, "short");
  assert.equal(getLevel(1).wordCount, 3);
  assert.equal(getLevel(40).wordCount, 6);
});

test("level stars come from the stars earned in the level", () => {
  assert.equal(starsForLevel(9, 3), 3);
  assert.equal(starsForLevel(8, 3), 3);
  assert.equal(starsForLevel(7, 3), 2);
  assert.equal(starsForLevel(6, 3), 2);
  assert.equal(starsForLevel(5, 3), 1);
  assert.equal(starsForLevel(3, 3), 1);
  assert.equal(starsForLevel(15, 6), 3);
  assert.equal(starsForLevel(11, 6), 2);
  assert.equal(starsForLevel(10, 6), 1);
  assert.equal(highestUnlocked({}), 1);
  assert.equal(highestUnlocked({ 1: 3, 2: 1 }), 3);
});

// ---------- Challenge link ----------

test("a challenge link keeps the word, up to 3 clues and the name", () => {
  const code = encodeChallenge({ word: "giraffe", clues: ["Tall", "", "Long neck", "too many"], name: "Sam" });
  assert.ok(!code.includes("giraffe"));
  const back = decodeChallenge(code);
  assert.equal(back.word, "giraffe");
  assert.deepEqual(back.clues, ["Tall", "Long neck", "too many"]);
  assert.equal(back.name, "Sam");
  assert.equal(decodeChallenge("broken!!"), null);
  assert.equal(cleanWord("Éclair 2"), "eclair");
  assert.equal(isValidWord("ab"), false);
});

// ---------- Rewards ----------

test("solving gives stars, counts the clue and fills the dictionary", () => {
  const starsBefore = data.player.stars;
  const result = recordWord({ won: true, stars: 3, clue: 1, misses: 0, word: "lion", category: "animals", solvedByWord: true });
  assert.equal(result.stars, 3);
  assert.equal(data.player.stars, starsBefore + 3);
  assert.equal(data.stats.solvedAtClue[0], 1);
  assert.equal(data.stats.knowItWins, 1);
  const entry = Object.values(data.dictionary).find((words) => words.lion)?.lion;
  assert.equal(entry.clue, 1);
  recordWord({ won: true, stars: 1, clue: 3, misses: 4, word: "lion", category: "animals" });
  assert.equal(entry.clue, 1, "the dictionary keeps the best clue");
  assert.equal(entry.last, 3);
});

test("losses in a row are counted, and a win or an easier difficulty resets them", () => {
  const lost = { won: false, stars: 0, clue: 3, misses: 7, word: "lion", category: "animals", difficulty: "normal" };
  data.stats.lossStreak = 0;
  recordWord(lost);
  recordWord(lost);
  assert.equal(data.stats.lossStreak, 2);
  setDifficulty("easy");
  assert.equal(data.stats.lossStreak, 0);
  assert.equal(data.settings.options.difficulty, "easy");
  recordWord(lost);
  recordWord({ ...lost, won: true, stars: 2, clue: 2, misses: 2 });
  assert.equal(data.stats.lossStreak, 0);
});

test("stars unlock figures and themes, and they are announced once", () => {
  data.player.stars = 0;
  data.seenUnlocks = [];
  assert.equal(isFigureOwned(FIGURES.find((f) => f.id === "rocket"), data), false);
  assert.equal(nextUnlock().stars, 10);
  data.player.stars = 24;
  const result = recordWord({ won: true, stars: 3, clue: 1, misses: 0, word: "tiger", category: "animals" });
  assert.deepEqual(result.newUnlocks.map((item) => `${item.type}:${item.id}`).sort(), ["figure:flower", "theme:forest", "theme:lagoon"]);
  const again = recordWord({ won: true, stars: 1, clue: 3, misses: 4, word: "tiger", category: "animals" });
  assert.deepEqual(again.newUnlocks, []);
  assert.ok(THEMES.every((theme, i) => i === 0 || theme.stars > THEMES[i - 1].stars), "themes get more expensive");
  assert.equal(isThemeUnlocked(THEMES[0], data), true);
});

test("new players start on Easy with the balloon", () => {
  assert.equal(data.settings.figure, "balloon");
});
