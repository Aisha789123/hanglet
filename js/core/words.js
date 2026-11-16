// Picking words based on the player's options.
import { CATEGORIES, WORDS } from "../../data/words.js";
import { pickRandom } from "./random.js";

export { CATEGORIES };

export const LENGTHS = [
  { id: "short", name: "Short", detail: "4–5 letters", min: 4, max: 5 },
  { id: "medium", name: "Medium", detail: "6–7 letters", min: 6, max: 7 },
  { id: "long", name: "Long", detail: "8+ letters", min: 8, max: 99 },
];

export const DIFFICULTIES = [
  { id: "easy", name: "Easy", lives: 8 },
  { id: "normal", name: "Normal", lives: 6 },
  { id: "hard", name: "Hard", lives: 4 },
];

// Every word together with its category, e.g. { word: "tiger", category: "animals" }
export const ALL_WORDS = CATEGORIES.flatMap((category) =>
  WORDS[category.id].map((word) => ({ word, category: category.id }))
);

export function getCategoryName(id) {
  const category = CATEGORIES.find((item) => item.id === id);
  return category ? category.name : "Mixed";
}

export function getLives(difficultyId) {
  const difficulty = DIFFICULTIES.find((item) => item.id === difficultyId);
  return difficulty ? difficulty.lives : 6;
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
  const pool = getWordPool(categoryId, lengthId);
  const fresh = pool.filter((item) => !recentWords.includes(item.word));
  return pickRandom(fresh.length > 0 ? fresh : pool);
}
