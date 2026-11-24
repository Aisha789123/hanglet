// Kids world: the small keyboard, Tilo's help and the short words.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  KIDS_MAX_EXTRA, KIDS_MAX_LENGTH, KIDS_MIN_EXTRA, KIDS_MIN_LENGTH, extraLetterCount, kidsHelp, kidsKeyboardLetters, nextHiddenLetter,
} from "../js/core/kids.js";
import { seededRandom } from "../js/core/random.js";
import KIDS from "../data/kids.js";
import { PICTURE_NAMES } from "../js/ui/pictures.js";

const SAMPLE = ["cat", "bee", "zon", "moon", "apple", "pizza", "boek", "trein"];

test("the keyboard has every letter of the word", () => {
  for (const word of SAMPLE) {
    const keys = kidsKeyboardLetters(word, seededRandom(1));
    for (const letter of word) assert.ok(keys.includes(letter), `${letter} of ${word}`);
  }
});

test("the keyboard has 4 to 6 extra letters, not 26", () => {
  for (const word of SAMPLE) {
    const keys = kidsKeyboardLetters(word, seededRandom(2));
    const extras = keys.length - new Set(word).size;
    assert.ok(extras >= KIDS_MIN_EXTRA && extras <= KIDS_MAX_EXTRA, `${word}: ${extras} extras`);
    assert.ok(keys.length <= 10);
  }
});

test("the keyboard has no double keys and is in ABC order", () => {
  for (const word of SAMPLE) {
    const keys = kidsKeyboardLetters(word, seededRandom(3));
    assert.equal(new Set(keys).size, keys.length);
    assert.deepEqual(keys, [...keys].sort());
  }
});

test("extra letters are never hard ones like q, x, y or z", () => {
  for (let seed = 0; seed < 50; seed++) {
    const keys = kidsKeyboardLetters("cat", seededRandom(seed));
    for (const letter of "qxyz") assert.ok(!keys.includes(letter));
  }
});

test("fewer different letters means more extra letters", () => {
  assert.equal(extraLetterCount("bee"), 6);
  assert.equal(extraLetterCount("boek"), 5);
  assert.equal(extraLetterCount("apple"), 5);
  assert.equal(extraLetterCount("trein"), 4);
});

test("after the 1st wrong letter a key lights up", () => {
  assert.deepEqual(kidsHelp("cat", [], 1), { type: "glow", letter: "c" });
});

test("after the 2nd wrong letter Tilo fills in the next letter", () => {
  assert.deepEqual(kidsHelp("cat", ["c"], 2), { type: "fill", letter: "a" });
});

test("Tilo never fills in the last letter: the child finishes the word", () => {
  assert.deepEqual(kidsHelp("cat", ["c", "a"], 5), { type: "glow", letter: "t" });
  assert.equal(kidsHelp("cat", ["c", "a", "t"], 5), null);
});

test("the next hidden letter follows the reading order", () => {
  assert.equal(nextHiddenLetter("moon", ["m"]), "o");
  assert.equal(nextHiddenLetter("moon", ["m", "o", "n"]), null);
});

test("every Kids word is 3 to 5 letters, a to z, with a picture and exactly 3 clues", () => {
  for (const item of KIDS) {
    assert.ok(PICTURE_NAMES.includes(item.picture), `picture ${item.picture} exists`);
    for (const lang of ["en", "nl"]) {
      if (!item[lang]) continue;
      const [word, clues] = item[lang];
      assert.match(word, /^[a-z]+$/);
      assert.ok(word.length >= KIDS_MIN_LENGTH && word.length <= KIDS_MAX_LENGTH, `${lang} ${word}`);
      assert.equal(clues.length, 3, `${lang} ${word} has 3 clues`);
      for (const clue of clues) {
        assert.ok(clue.length > 5, `${lang} ${word}: a real clue`);
        assert.ok(!clue.toLowerCase().includes(word), `${lang} ${word} is in its own clue: "${clue}"`);
      }
    }
  }
});

test("both languages have plenty of Kids words", () => {
  for (const lang of ["en", "nl"]) {
    assert.ok(KIDS.filter((item) => item[lang]).length >= 40, lang);
  }
});
