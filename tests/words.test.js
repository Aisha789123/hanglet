// Word lists: the rules from the top of data/words/en.js and nl.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import EN from "../data/words/en.js";
import NL from "../data/words/nl.js";
import { CATEGORY_IDS } from "../js/core/words.js";

const LISTS = { en: EN, nl: NL };
const MIN_WORDS = 200; // per language, without the season list
const MIN_PER_LENGTH = 6; // short, medium and long words per category (a level has up to 6)

for (const [lang, list] of Object.entries(LISTS)) {
  const items = Object.values(list).flat();
  const all = items.map((item) => item.word);

  test(`${lang}: every category exists, plus the winter list`, () => {
    for (const category of [...CATEGORY_IDS, "winter"]) assert.ok(Array.isArray(list[category]), category);
    assert.deepEqual(Object.keys(list).sort(), [...CATEGORY_IDS, "winter"].sort(), "no unknown categories");
  });

  test(`${lang}: at least ${MIN_WORDS} words`, () => {
    const count = CATEGORY_IDS.reduce((sum, category) => sum + list[category].length, 0);
    assert.ok(count >= MIN_WORDS, `${count} words`);
  });

  test(`${lang}: words are a-z only, at least 4 letters`, () => {
    for (const { word } of items) assert.match(word, /^[a-z]{4,}$/, word);
  });

  test(`${lang}: every word has exactly 3 clues`, () => {
    for (const { word, clues } of items) {
      assert.ok(Array.isArray(clues), word);
      assert.equal(clues.length, 3, `${word} has ${clues.length} clues`);
      for (const clue of clues) assert.ok(typeof clue === "string" && clue.trim().length >= 5, `${word}: a real clue`);
      assert.equal(new Set(clues).size, 3, `${word}: three different clues`);
    }
  });

  test(`${lang}: the word is never in its own clues`, () => {
    for (const { word, clues } of items) {
      for (const clue of clues) assert.ok(!clue.toLowerCase().includes(word), `${word}: "${clue}"`);
    }
  });

  test(`${lang}: no word appears twice`, () => {
    assert.deepEqual(all.filter((word, i) => all.indexOf(word) !== i), []);
  });

  test(`${lang}: every category has enough short, medium and long words`, () => {
    for (const category of CATEGORY_IDS) {
      const lengths = list[category].map(({ word }) => word.length);
      assert.ok(lengths.filter((n) => n <= 5).length >= MIN_PER_LENGTH, `${category} short`);
      assert.ok(lengths.filter((n) => n >= 6 && n <= 7).length >= MIN_PER_LENGTH, `${category} medium`);
      assert.ok(lengths.filter((n) => n >= 8).length >= MIN_PER_LENGTH, `${category} long`);
    }
  });
}

test("both languages have their own words, not a translated list", () => {
  const english = new Set(Object.values(EN).flat().map((item) => item.word));
  const shared = Object.values(NL).flat().filter((item) => english.has(item.word));
  // Some words are the same in both languages (piano, pizza, japan), but not most of them
  assert.ok(shared.length < 40, `${shared.length} shared words`);
});
