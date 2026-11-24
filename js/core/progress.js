// Everything that changes the player's progress: stats, streaks, stars,
// the dictionary, badges and unlocked looks. Every function saves at the end.
import { data, save } from "./storage.js";
import { language } from "./i18n.js";
import { ACHIEVEMENTS } from "./achievements.js";
import { THEMES, isThemeUnlocked } from "./themes.js";
import { FIGURES, isFigureOwned } from "./figures.js";
import { addDays, toDateKey } from "./dates.js";
import { MAX_STARS } from "./round.js";

// Save the result of one riddle (Daily, Classic, Levels, Challenge). Returns the rewards.
// clue = the clue the player was on at the end (1, 2 or 3)
export function recordWord({ won, stars, clue, misses, word, category, difficulty = "normal", solvedByWord = false }) {
  const stats = data.stats;
  stats.played++;
  stats.starWords++;
  stats.recentWords = [word, ...stats.recentWords].slice(0, 60);

  if (won) {
    stats.wins++;
    stats.winStreak++;
    stats.lossStreak = 0;
    stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.winStreak);
    stats.starsEarned += stars;
    stats.solvedAtClue[Math.min(MAX_STARS, Math.max(1, clue)) - 1]++;
    if (solvedByWord) stats.knowItWins++;
    if (misses === 0) stats.flawless++;
    if (difficulty === "hard") stats.hardWins++;
    stats.longestWord = Math.max(stats.longestWord, word.length);
    stats.categoriesWon[category] = (stats.categoriesWon[category] || 0) + 1;
    data.player.stars += stars;
    addToDictionary(word, category, null, clue);
  } else {
    stats.losses++;
    stats.winStreak = 0;
    stats.lossStreak = (stats.lossStreak || 0) + 1;
  }
  return { stars: won ? stars : 0, ...checkRewards() };
}

// The player said yes to "make it easier?" or changed the difficulty
export function setDifficulty(id) {
  data.settings.options.difficulty = id;
  data.stats.lossStreak = 0;
  save();
}

// Kids world: every word is solved (together with Tilo). No stars,
// but a sticker of the picture. Returns true when the sticker is new.
export function recordKidsWord({ word, category, picture }, clue = 1) {
  const kids = data.kids;
  const isNew = !kids.stickers[picture];
  kids.stickers[picture] = (kids.stickers[picture] || 0) + 1;
  kids.solved++;
  data.stats.kidsWins++;
  data.stats.recentWords = [word, ...data.stats.recentWords].slice(0, 60);
  addToDictionary(word, category, picture, clue);
  // Only badges (like "first Kids word") are checked, no rewards are shown
  checkRewards();
  return isNew;
}

// Remember a solved word in "My dictionary", with the best clue it was solved at
export function addToDictionary(word, category, picture = null, clue = null) {
  if (!data.dictionary[language]) data.dictionary[language] = {};
  const words = data.dictionary[language];
  const entry = words[word];
  if (entry) {
    entry.count++;
    if (clue) {
      entry.clue = entry.clue ? Math.min(entry.clue, clue) : clue;
      entry.last = clue;
    }
  } else {
    words[word] = { category, picture, first: toDateKey(), count: 1, clue, last: clue };
  }
}

// Save a finished Daily and update the Daily streak.
// results: [{ won, stars, word, category }]
export function recordDaily(dateKey, results) {
  const daily = data.daily;
  if (daily.history[dateKey]) return checkRewards();

  const solved = results.filter((result) => result.won).length;
  const stars = results.reduce((sum, result) => sum + (result.stars || 0), 0);
  daily.history[dateKey] = { solved, total: results.length, stars, results };
  daily.streak = daily.lastDate === addDays(dateKey, -1) ? daily.streak + 1 : 1;
  daily.bestStreak = Math.max(daily.bestStreak, daily.streak);
  daily.lastDate = dateKey;
  daily.progress = null;
  if (stars === results.length * MAX_STARS) data.stats.perfectDailies++;
  return checkRewards();
}

// The streak only counts if the last Daily was today or yesterday
export function currentDailyStreak() {
  const today = toDateKey();
  const last = data.daily.lastDate;
  if (last === today || last === addDays(today, -1)) {
    return data.daily.streak;
  }
  return 0;
}

// Save a finished level (keeps the best result)
export function recordLevel(number, stars) {
  const old = data.levels.stars[number] || 0;
  data.levels.stars[number] = Math.max(old, stars);
  return checkRewards();
}

// The figure or theme that comes next, for "12 more stars for the rocket"
export function nextUnlock() {
  const locked = [
    ...FIGURES.filter((figure) => !isFigureOwned(figure, data)).map((figure) => ({ type: "figure", id: figure.id, stars: figure.stars })),
    ...THEMES.filter((theme) => !isThemeUnlocked(theme, data)).map((theme) => ({ type: "theme", id: theme.id, stars: theme.stars })),
  ];
  return locked.sort((a, b) => a.stars - b.stars)[0] || null;
}

// Look for new badges and newly unlocked figures and themes, then save
export function checkRewards() {
  const newAchievements = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!data.achievements[achievement.id] && achievement.check(data)) {
      data.achievements[achievement.id] = toDateKey();
      newAchievements.push(achievement);
    }
  }

  const unlockedNow = [
    ...FIGURES.filter((figure) => figure.stars > 0 && isFigureOwned(figure, data)).map((figure) => ({ type: "figure", id: figure.id })),
    ...THEMES.filter((theme) => theme.stars > 0 && isThemeUnlocked(theme, data)).map((theme) => ({ type: "theme", id: theme.id })),
  ];
  const newUnlocks = unlockedNow.filter((item) => !data.seenUnlocks.includes(`${item.type}:${item.id}`));
  data.seenUnlocks.push(...newUnlocks.map((item) => `${item.type}:${item.id}`));

  save();
  return { newAchievements, newUnlocks };
}
