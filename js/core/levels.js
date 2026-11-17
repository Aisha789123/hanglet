// The level path: 40 levels that get harder step by step.
import { CATEGORY_IDS } from "./words.js";

export const LEVEL_COUNT = 40;

// Level 1-10: short words, 11-20: medium, 21-40: long.
// Every level has several words: 3 in the first stage, up to 6 in the last.
// The lives and the riddle follow the difficulty the player picked.
export function getLevel(number) {
  const tier = Math.floor((number - 1) / 10);
  const lengths = ["short", "medium", "long", "long"];
  const wordCounts = [3, 4, 5, 6];
  const category = CATEGORY_IDS[(number - 1) % CATEGORY_IDS.length];
  return {
    number,
    length: lengths[tier],
    wordCount: wordCounts[tier],
    category,
    stage: ["warmup", "climb", "expert", "summit"][tier],
  };
}

// Stars for a whole level, based on all misses in all its words.
// 3 words: 0-1 misses = 3 stars, up to 6 = 2 stars, more = 1 star.
export function starsForLevel(totalMisses, wordCount) {
  if (totalMisses <= wordCount - 2) return 3;
  if (totalMisses <= wordCount * 2) return 2;
  return 1;
}

// The highest level the player can play: the first level without stars
export function highestUnlocked(stars) {
  let level = 1;
  while (level < LEVEL_COUNT && stars[level]) {
    level++;
  }
  return level;
}

export function completedLevels(stars) {
  return Object.keys(stars).filter((key) => stars[key] > 0).length;
}
