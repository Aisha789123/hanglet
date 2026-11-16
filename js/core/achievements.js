// Achievements (badges). Each one has a check that looks at the saved data.
import { CATEGORIES } from "./words.js";
import { completedLevels, LEVEL_COUNT } from "./levels.js";
import { getLevelInfo } from "./xp.js";

export const ACHIEVEMENT_COINS = 25;

export const ACHIEVEMENTS = [
  { id: "first-win", name: "First win", description: "Win your first game", icon: "trophy",
    check: (d) => d.stats.wins >= 1 },
  { id: "wins-10", name: "Getting good", description: "Win 10 games", icon: "trophy",
    check: (d) => d.stats.wins >= 10 },
  { id: "wins-50", name: "Word master", description: "Win 50 games", icon: "crown",
    check: (d) => d.stats.wins >= 50 },
  { id: "flawless", name: "Flawless", description: "Win a game without a single miss", icon: "target",
    check: (d) => d.stats.flawless >= 1 },
  { id: "hard-win", name: "Brave", description: "Win a game on Hard", icon: "bolt",
    check: (d) => d.stats.hardWins >= 1 },
  { id: "long-word", name: "Long haul", description: "Solve a word with 10 or more letters", icon: "ruler",
    check: (d) => d.stats.longestWord >= 10 },
  { id: "daily-first", name: "Daily habit", description: "Finish your first Daily", icon: "calendar",
    check: (d) => Object.keys(d.daily.history).length >= 1 },
  { id: "daily-streak-3", name: "Warming up", description: "Reach a 3-day Daily streak", icon: "flame",
    check: (d) => d.daily.bestStreak >= 3 },
  { id: "daily-streak-7", name: "Week strong", description: "Reach a 7-day Daily streak", icon: "flame",
    check: (d) => d.daily.bestStreak >= 7 },
  { id: "win-streak-5", name: "Hot hand", description: "Win 5 games in a row", icon: "spark",
    check: (d) => d.stats.bestWinStreak >= 5 },
  { id: "win-streak-10", name: "Unstoppable", description: "Win 10 games in a row", icon: "spark",
    check: (d) => d.stats.bestWinStreak >= 10 },
  { id: "levels-10", name: "Climber", description: "Complete 10 levels", icon: "path",
    check: (d) => completedLevels(d.levels.stars) >= 10 },
  { id: "levels-all", name: "Summit", description: `Complete all ${LEVEL_COUNT} levels`, icon: "flag",
    check: (d) => completedLevels(d.levels.stars) >= LEVEL_COUNT },
  { id: "timed-10", name: "Speed reader", description: "Solve 10 words in one Time Attack", icon: "timer",
    check: (d) => d.timed.best >= 10 },
  { id: "hint-used", name: "A little help", description: "Use your first hint", icon: "bulb",
    check: (d) => d.stats.hintsUsed >= 1 },
  { id: "explorer", name: "Explorer", description: "Win a game in every category", icon: "compass",
    check: (d) => CATEGORIES.every((c) => d.stats.categoriesWon[c.id]) },
  { id: "player-level-5", name: "Rising star", description: "Reach player level 5", icon: "star",
    check: (d) => getLevelInfo(d.player.xp).level >= 5 },
];
