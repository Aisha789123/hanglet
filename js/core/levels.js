// The level path: 40 levels that get harder step by step.
import { CATEGORY_IDS } from "./words.js";
import { MAX_STARS } from "./round.js";

export const LEVEL_COUNT = 40;

// Level 1-10: short words, 11-20: medium, 21-40: long.
// Every level has several riddles: 3 in the first stage, up to 6 in the last.
// The lives and the clues follow the difficulty the player picked.
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

// Level stars from all stars earned in the level (every riddle gives 1 to 3).
// On average 2.5 or more per riddle = 3 stars, 1.75 or more = 2 stars, else 1.
// For 3 riddles: 8-9 stars = 3, 6-7 = 2, 3-5 = 1.
export function starsForLevel(earnedStars, wordCount) {
  if (earnedStars >= Math.ceil(wordCount * 2.5)) return 3;
  if (earnedStars >= Math.ceil(wordCount * 1.75)) return 2;
  return 1;
}

// The most stars you can earn in a level
export function maxLevelStars(wordCount) {
  return wordCount * MAX_STARS;
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
