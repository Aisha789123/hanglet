// Achievements (badges). Each one has a check that looks at the saved data.
// Names and descriptions are in the language files: achievements.<id>.name
import { CATEGORY_IDS } from "./words.js";
import { completedLevels, LEVEL_COUNT } from "./levels.js";
import { getLevelInfo } from "./xp.js";

export const ACHIEVEMENT_COINS = 25;

function dictionarySize(d) {
  return Object.values(d.dictionary).reduce((sum, words) => sum + Object.keys(words).length, 0);
}

export const ACHIEVEMENTS = [
  { id: "first-win", icon: "trophy", check: (d) => d.stats.wins >= 1 },
  { id: "wins-10", icon: "trophy", check: (d) => d.stats.wins >= 10, progress: (d) => [d.stats.wins, 10] },
  { id: "wins-50", icon: "crown", check: (d) => d.stats.wins >= 50, progress: (d) => [d.stats.wins, 50] },
  { id: "flawless", icon: "target", check: (d) => d.stats.flawless >= 1 },
  { id: "hard-win", icon: "bolt", check: (d) => d.stats.hardWins >= 1 },
  { id: "long-word", icon: "ruler", check: (d) => d.stats.longestWord >= 10 },
  { id: "daily-first", icon: "calendar", check: (d) => Object.keys(d.daily.history).length >= 1 },
  { id: "daily-streak-3", icon: "flame", check: (d) => d.daily.bestStreak >= 3, progress: (d) => [d.daily.bestStreak, 3] },
  { id: "daily-streak-7", icon: "flame", check: (d) => d.daily.bestStreak >= 7, progress: (d) => [d.daily.bestStreak, 7] },
  { id: "win-streak-5", icon: "spark", check: (d) => d.stats.bestWinStreak >= 5, progress: (d) => [d.stats.bestWinStreak, 5] },
  { id: "win-streak-10", icon: "spark", check: (d) => d.stats.bestWinStreak >= 10, progress: (d) => [d.stats.bestWinStreak, 10] },
  { id: "levels-10", icon: "path", check: (d) => completedLevels(d.levels.stars) >= 10, progress: (d) => [completedLevels(d.levels.stars), 10] },
  { id: "levels-all", icon: "flag", check: (d) => completedLevels(d.levels.stars) >= LEVEL_COUNT, progress: (d) => [completedLevels(d.levels.stars), LEVEL_COUNT] },
  { id: "timed-10", icon: "timer", check: (d) => d.timed.best >= 10, progress: (d) => [d.timed.best, 10] },
  { id: "hint-used", icon: "bulb", check: (d) => d.stats.hintsUsed >= 1 },
  { id: "explorer", icon: "compass", check: (d) => CATEGORY_IDS.every((c) => d.stats.categoriesWon[c]),
    progress: (d) => [CATEGORY_IDS.filter((c) => d.stats.categoriesWon[c]).length, CATEGORY_IDS.length] },
  { id: "player-level-5", icon: "star", check: (d) => getLevelInfo(d.player.xp).level >= 5, progress: (d) => [getLevelInfo(d.player.xp).level, 5] },
  { id: "kids-win", icon: "smile", check: (d) => d.stats.kidsWins >= 1 },
  { id: "dictionary-25", icon: "book", check: (d) => dictionarySize(d) >= 25, progress: (d) => [dictionarySize(d), 25] },
  { id: "dictionary-100", icon: "book", check: (d) => dictionarySize(d) >= 100, progress: (d) => [dictionarySize(d), 100] },
  { id: "bilingual", icon: "globe", check: (d) => Object.keys(d.dictionary.en || {}).length > 0 && Object.keys(d.dictionary.nl || {}).length > 0 },
];
