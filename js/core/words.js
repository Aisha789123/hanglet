// Picking words based on the language and the player's options.
import EN_WORDS from "../../data/words/en.js";
import NL_WORDS from "../../data/words/nl.js";
import KIDS from "../../data/kids.js";
import { language, t } from "./i18n.js";
import { pickRandom } from "./random.js";
import { isWinterSeason } from "./season.js";
import { isKidsLength } from "./kids.js";

const WORD_LISTS = { en: EN_WORDS, nl: NL_WORDS };

export const CATEGORY_IDS = ["animals", "food", "countries", "sports", "nature", "jobs", "science", "music", "colors", "clothing"];

// In the winter season there is one extra category, shown first
export const SEASON_CATEGORY = isWinterSeason() ? "winter" : null;
export const PLAYABLE_CATEGORIES = SEASON_CATEGORY ? [SEASON_CATEGORY, ...CATEGORY_IDS] : CATEGORY_IDS;

export const LENGTHS = [
  { id: "short", min: 4, max: 5 },
  { id: "medium", min: 6, max: 7 },
  { id: "long", min: 8, max: 99 },
];

// Every word of a language with its category and description
export function getAllWords(lang = language) {
  const list = WORD_LISTS[lang] || WORD_LISTS.en;
  return PLAYABLE_CATEGORIES.flatMap((category) =>
    list[category].map(([word, description]) => ({ word, description, category }))
  );
}

// Kids words: short words (3-5 letters) with a picture.
// A picture without a word in this language is skipped.
export function getKidsWords(lang = language) {
  return KIDS.filter((item) => item[lang] && isKidsLength(item[lang][0])).map((item) => ({
    word: item[lang][0],
    description: item[lang][1],
    category: item.category,
    picture: item.picture,
  }));
}

export const ALL_WORDS = getAllWords();
export const KIDS_WORDS = getKidsWords();

export function getCategoryName(id) {
  return t(`categories.${id}`);
}

// All words that match a category ("mixed" = all) and a length id
export function getWordPool(categoryId, lengthId) {
  const length = LENGTHS.find((item) => item.id === lengthId) || LENGTHS[1];
  const inCategory = categoryId === "mixed"
    ? ALL_WORDS
    : ALL_WORDS.filter((item) => item.category === categoryId);
  const pool = inCategory.filter(
    (item) => item.word.length >= length.min && item.word.length <= length.max
  );
  // Every category has words of every length, but stay safe just in case
  return pool.length > 0 ? pool : inCategory;
}

// Pick a random word, but not one of the recently played words
export function pickWord(categoryId, lengthId, recentWords = []) {
  return pickFresh(getWordPool(categoryId, lengthId), recentWords);
}

export function pickKidsWord(recentWords = []) {
  return pickFresh(KIDS_WORDS, recentWords);
}

function pickFresh(pool, recentWords) {
  const fresh = pool.filter((item) => !recentWords.includes(item.word));
  return pickRandom(fresh.length > 0 ? fresh : pool);
}

// Find the description and picture of a word (used by the dictionary)
// Searches every list of the language, also the season list outside the season
export function findWord(word) {
  const list = WORD_LISTS[language] || WORD_LISTS.en;
  for (const [category, words] of Object.entries(list)) {
    const found = words.find(([item]) => item === word);
    if (found) return { word, description: found[1], category };
  }
  return KIDS_WORDS.find((item) => item.word === word);
}
