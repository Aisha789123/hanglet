// Word lists: the rules from the top of data/words/en.js and nl.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import EN from "../data/words/en.js";
import NL from "../data/words/nl.js";

const LISTS = { en: EN, nl: NL };
const CATEGORIES = ["animals", "food", "countries", "sports", "nature", "jobs", "science", "music", "colors", "clothing", "winter"];

// Words that were taken out in v4 because they were too rare or too hard
const REMOVED = {
  en: ["qatar", "oman", "fiji", "proton", "mauve", "khaki", "lacrosse", "solstice"],
  nl: ["qatar", "oman", "fiji", "elektron", "karmijn", "cyaan", "maillot", "maretak"],
};

for (const [lang, list] of Object.entries(LISTS)) {
  const all = Object.values(list).flat().map(([word]) => word);

  test(`${lang}: every category exists`, () => {
    for (const category of CATEGORIES) assert.ok(Array.isArray(list[category]), category);
  });

  test(`${lang}: words are a-z, at least 4 letters, with a riddle`, () => {
    for (const [category, words] of Object.entries(list)) {
      for (const [word, description] of words) {
        assert.match(word, /^[a-z]{4,}$/, `${category}: ${word}`);
        assert.ok(description.length >= 8, `${word} needs a real riddle`);
      }
    }
  });

  test(`${lang}: the word is never in its own riddle`, () => {
    for (const words of Object.values(list)) {
      for (const [word, description] of words) {
        assert.ok(!description.toLowerCase().includes(word), `${word}: "${description}"`);
      }
    }
  });

  test(`${lang}: no word appears twice`, () => {
    assert.deepEqual(all.filter((word, i) => all.indexOf(word) !== i), []);
  });

  test(`${lang}: every category has short, medium and long words`, () => {
    for (const category of CATEGORIES.filter((c) => c !== "winter")) {
      const lengths = list[category].map(([word]) => word.length);
      assert.ok(lengths.some((n) => n <= 5), `${category} short`);
      assert.ok(lengths.some((n) => n >= 6 && n <= 7), `${category} medium`);
      assert.ok(lengths.some((n) => n >= 8), `${category} long`);
    }
  });

  test(`${lang}: rare words that were too hard stay out`, () => {
    for (const word of REMOVED[lang]) assert.ok(!all.includes(word), word);
  });
}
