// The rest of the game logic: a round, levels, the challenge link, the chest,
// missions and rewards.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Round } from "../js/core/round.js";
import { LEVEL_COUNT, getLevel, highestUnlocked, starsForLevel } from "../js/core/levels.js";
import { cleanWord, decodeChallenge, encodeChallenge, isValidWord } from "../js/core/challenge.js";
import { canOpenChest, openChest } from "../js/core/chest.js";
import { getMissionsForDay } from "../js/core/missions.js";
import { data } from "../js/core/storage.js";
import { recordWord, rewardForWord, setDifficulty } from "../js/core/progress.js";

test("a round is won when every letter is found", () => {
  const round = new Round({ word: "lion", category: "animals", lives: 7 });
  for (const letter of "lion") assert.equal(round.guess(letter), "correct");
  assert.equal(round.isWon(), true);
});

test("a round is lost when the lives run out", () => {
  const round = new Round({ word: "lion", category: "animals", lives: 2 });
  round.guess("x");
  round.guess("z");
  assert.equal(round.isLost(), true);
  assert.equal(round.guess("l"), "ignored");
});

test("a round without a limit (Kids) can never be lost", () => {
  const round = new Round({ word: "cat", category: "animals", lives: Infinity });
  for (const letter of "bdefghij") round.guess(letter);
  assert.equal(round.isLost(), false);
});

test("40 levels, with longer words and more words per level", () => {
  assert.equal(LEVEL_COUNT, 40);
  assert.equal(getLevel(1).length, "short");
  assert.equal(getLevel(1).wordCount, 3);
  assert.equal(getLevel(40).wordCount, 6);
  assert.equal(getLevel(1).lives, undefined, "lives come from the difficulty now");
});

test("stars and unlocking levels", () => {
  assert.equal(starsForLevel(0, 3), 3);
  assert.equal(starsForLevel(5, 3), 2);
  assert.equal(starsForLevel(20, 3), 1);
  assert.equal(highestUnlocked({}), 1);
  assert.equal(highestUnlocked({ 1: 3, 2: 1 }), 3);
});

test("a challenge link keeps the word, the hint and the name", () => {
  const code = encodeChallenge({ word: "giraffe", hint: "Long neck", name: "Sam" });
  assert.ok(!code.includes("giraffe"));
  const back = decodeChallenge(code);
  assert.equal(back.word, "giraffe");
  assert.equal(back.hint, "Long neck");
  assert.equal(back.name, "Sam");
  assert.equal(decodeChallenge("broken!!"), null);
  assert.equal(cleanWord("Éclair 2"), "eclair");
  assert.equal(isValidWord("ab"), false);
});

test("the chest opens once a day", () => {
  data.chest.lastOpened = null;
  const reward = openChest(() => 0.99, "2026-11-17");
  assert.ok(reward.coins >= 20 && reward.coins <= 60);
  assert.equal(canOpenChest("2026-11-17"), false);
  assert.equal(openChest(() => 0, "2026-11-17"), null);
});

test("three missions a day, always with the Daily", () => {
  const missions = getMissionsForDay("2026-11-17");
  assert.equal(missions.length, 3);
  assert.ok(missions.some((mission) => mission.id === "daily"));
});

test("Hard gives a bonus, a loss gives a little XP", () => {
  assert.ok(rewardForWord(true, 0, 6, "hard").xp > rewardForWord(true, 0, 6, "normal").xp);
  assert.deepEqual(rewardForWord(false, 7, 7, "normal"), { xp: 5, coins: 0 });
});

test("losses in a row are counted, and a win or an easier difficulty resets them", () => {
  const lost = { won: false, misses: 7, lives: 7, word: "lion", category: "animals", difficulty: "normal" };
  data.stats.lossStreak = 0;
  recordWord(lost);
  recordWord(lost);
  assert.equal(data.stats.lossStreak, 2);
  setDifficulty("easy");
  assert.equal(data.stats.lossStreak, 0);
  assert.equal(data.settings.options.difficulty, "easy");
  recordWord(lost);
  recordWord({ ...lost, won: true, misses: 1 });
  assert.equal(data.stats.lossStreak, 0);
});

test("new players start on Easy with the balloon", () => {
  assert.equal(data.settings.figure, "balloon");
});
