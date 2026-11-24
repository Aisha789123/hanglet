// Difficulty rules and the "make it easier?" offer.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_DIFFICULTY, DIFFICULTIES, easierDifficulty, freeLetters, getDifficulty, getLives, shouldSuggestEasier,
} from "../js/core/difficulty.js";
import { Round } from "../js/core/round.js";

test("new players start on Easy", () => {
  assert.equal(DEFAULT_DIFFICULTY, "easy");
});

test("Easy and Normal have 3 clues, Hard never shows clue 3", () => {
  assert.equal(getDifficulty("easy").maxClues, 3);
  assert.equal(getDifficulty("normal").maxClues, 3);
  assert.equal(getDifficulty("hard").maxClues, 2);
});

test("8, 7 and 6 lives", () => {
  assert.equal(getLives("easy"), 8);
  assert.equal(getLives("normal"), 7);
  assert.equal(getLives("hard"), 6);
});

test("only Easy gives the first letter for free", () => {
  assert.deepEqual(freeLetters("giraffe", "easy"), ["g"]);
  assert.deepEqual(freeLetters("giraffe", "normal"), []);
  assert.deepEqual(freeLetters("giraffe", "hard"), []);
});

test("easier difficulties have more lives", () => {
  assert.ok(getLives("easy") > getLives("normal"));
  assert.ok(getLives("normal") > getLives("hard"));
  assert.equal(DIFFICULTIES.length, 3);
});

test("an unknown difficulty falls back to the default", () => {
  assert.equal(getDifficulty("impossible").id, DEFAULT_DIFFICULTY);
});

test("one step easier, and nothing below Easy", () => {
  assert.equal(easierDifficulty("hard"), "normal");
  assert.equal(easierDifficulty("normal"), "easy");
  assert.equal(easierDifficulty("easy"), null);
});

test("the free first letter fills every tile with that letter", () => {
  const round = new Round({ word: "banana", category: "food", lives: 8 });
  for (const letter of freeLetters(round.word, "easy")) round.giveLetter(letter);
  assert.deepEqual(round.guessed, ["b"]);
  assert.equal(round.misses, 0);
  assert.equal(round.revealedCount(), 1);
});

test("giveLetter never gives away the last hidden letter", () => {
  const round = new Round({ word: "aaab", category: "x", lives: 6 });
  round.guess("a");
  assert.equal(round.giveLetter("b"), false);
  assert.equal(round.isWon(), false);
  assert.equal(round.giveLetter("z"), false, "a letter that is not in the word is never given");
});

test("Tilo offers an easier difficulty after 2 losses in a row", () => {
  assert.equal(shouldSuggestEasier({ lossStreak: 1, difficulty: "normal" }), false);
  assert.equal(shouldSuggestEasier({ lossStreak: 2, difficulty: "normal" }), true);
  assert.equal(shouldSuggestEasier({ lossStreak: 2, difficulty: "hard" }), true);
});

test("the offer comes back every 2 losses, not after every loss", () => {
  assert.equal(shouldSuggestEasier({ lossStreak: 3, difficulty: "normal" }), false);
  assert.equal(shouldSuggestEasier({ lossStreak: 4, difficulty: "normal" }), true);
});

test("no offer on Easy, in Kids or in a challenge from a friend", () => {
  assert.equal(shouldSuggestEasier({ lossStreak: 2, difficulty: "easy" }), false);
  assert.equal(shouldSuggestEasier({ lossStreak: 2, difficulty: "normal", mode: "kids" }), false);
  assert.equal(shouldSuggestEasier({ lossStreak: 2, difficulty: "normal", mode: "challenge" }), false);
});
