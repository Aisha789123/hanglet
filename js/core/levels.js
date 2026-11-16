// The level path: 40 levels that get harder step by step.
import { CATEGORY_IDS } from "./words.js";

export const LEVEL_COUNT = 40;

// Level 1-10: short words, 11-20: medium, 21-40: long. Fewer lives every 10 levels.
export function getLevel(number) {
  const tier = Math.floor((number - 1) / 10);
  const lengths = ["short", "medium", "long", "long"];
  const lives = [8, 7, 6, 5];
  const category = CATEGORY_IDS[(number - 1) % CATEGORY_IDS.length];
  return {
    number,
    length: lengths[tier],
    lives: lives[tier],
    category,
    stage: ["warmup", "climb", "expert", "summit"][tier],
  };
}

// 3 stars for 0-1 misses, 2 stars for up to half of the lives, else 1 star
export function starsFor(misses, lives) {
  if (misses <= 1) return 3;
  if (misses <= lives / 2) return 2;
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
