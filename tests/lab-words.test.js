// Checks for the word list of the lab test page (data/lab-words.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import LAB_WORDS from "../data/lab-words.js";

for (const lang of ["en", "nl"]) {
  const words = LAB_WORDS[lang];

  test(`lab ${lang}: 40 words`, () => {
    assert.equal(words.length, 40);
  });

  test(`lab ${lang}: words are a-z, at least 4 letters, with 3 clues`, () => {
    for (const { word, clues } of words) {
      assert.match(word, /^[a-z]{4,}$/, word);
      assert.equal(clues.length, 3, word);
      clues.forEach((clue) => assert.ok(clue.trim().length > 5, `${word}: empty clue`));
    }
  });

  test(`lab ${lang}: the word is never in its own clues`, () => {
    for (const { word, clues } of words) {
      clues.forEach((clue) => assert.ok(!clue.toLowerCase().includes(word), `${word}: "${clue}"`));
    }
  });

  test(`lab ${lang}: no word appears twice`, () => {
    const list = words.map((item) => item.word);
    assert.equal(new Set(list).size, list.length);
  });
}
