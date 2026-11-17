// Everything that changes the player's progress: stats, streaks, XP, coins,
// the dictionary, achievements, figures and themes. Every function saves at the end.
import { data, save } from "./storage.js";
import { language } from "./i18n.js";
import { ACHIEVEMENTS, ACHIEVEMENT_COINS } from "./achievements.js";
import { getUnlockedThemes } from "./themes.js";
import { FIGURES, isFigureOwned } from "./figures.js";
import { getLevelInfo } from "./xp.js";
import { addDays, toDateKey } from "./dates.js";
import { trackMission } from "./missions.js";

// The three kinds of hints and what they cost. The description hint is only
// offered on Hard: on Easy and Normal the riddle is always on screen for free.
export const HINTS = [
  { id: "description", cost: 10, icon: "quote" },
  { id: "letter", cost: 20, icon: "bulb" },
  { id: "remove", cost: 15, icon: "eraser" },
];

// Rewards for one word. Hard games and games without misses give a bonus.
export function rewardForWord(won, misses, lives, difficulty = "normal") {
  if (!won) return { xp: 5, coins: 0 };
  const hard = difficulty === "hard";
  return {
    xp: 20 + (lives - misses) * 5 + (hard ? 15 : 0),
    coins: 10 + (hard ? 5 : 0) + (misses === 0 ? 5 : 0),
  };
}

// Save the result of one word (Daily, Classic, Levels). Returns the rewards.
export function recordWord({ won, misses, lives, word, category, difficulty = "normal", hintsUsed = 0 }) {
  const stats = data.stats;
  stats.played++;
  stats.recentWords = [word, ...stats.recentWords].slice(0, 40);

  if (won) {
    stats.wins++;
    stats.winStreak++;
    stats.lossStreak = 0;
    stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.winStreak);
    const index = Math.min(misses, stats.missesInWins.length - 1);
    stats.missesInWins[index]++;
    if (misses === 0) stats.flawless++;
    if (difficulty === "hard") stats.hardWins++;
    stats.longestWord = Math.max(stats.longestWord, word.length);
    stats.categoriesWon[category] = (stats.categoriesWon[category] || 0) + 1;
    addToDictionary(word, category);
  } else {
    stats.losses++;
    stats.winStreak = 0;
    stats.lossStreak = (stats.lossStreak || 0) + 1;
  }

  const missionsDone = trackMission({ type: "word", won, misses, length: word.length, category, hintsUsed });
  return { ...giveRewards(rewardForWord(won, misses, lives, difficulty)), missionsDone };
}

// The player said yes to "make it easier?" or changed the difficulty
export function setDifficulty(id) {
  data.settings.options.difficulty = id;
  data.stats.lossStreak = 0;
  save();
}

// Kids world: every word is solved (together with Tilo). No XP or coins,
// but a sticker of the picture. Returns true when the sticker is new.
export function recordKidsWord({ word, category, picture }) {
  const kids = data.kids;
  const isNew = !kids.stickers[picture];
  kids.stickers[picture] = (kids.stickers[picture] || 0) + 1;
  kids.solved++;
  data.stats.kidsWins++;
  data.stats.recentWords = [word, ...data.stats.recentWords].slice(0, 40);
  addToDictionary(word, category, picture);
  // Only badges (like "first Kids word") are checked, no rewards are shown
  giveRewards({ xp: 0, coins: 0 });
  return isNew;
}

// Remember a solved word in "My dictionary"
export function addToDictionary(word, category, picture = null) {
  if (!data.dictionary[language]) data.dictionary[language] = {};
  const words = data.dictionary[language];
  const entry = words[word];
  if (entry) {
    entry.count++;
  } else {
    words[word] = { category, picture, first: toDateKey(), count: 1 };
  }
}

export function countHint() {
  data.stats.hintsUsed++;
  save();
}

// Save a finished Daily and update the Daily streak
export function recordDaily(dateKey, results) {
  const daily = data.daily;
  if (daily.history[dateKey]) return;

  const solved = results.filter((result) => result.won).length;
  daily.history[dateKey] = { solved, total: results.length, results };
  daily.streak = daily.lastDate === addDays(dateKey, -1) ? daily.streak + 1 : 1;
  daily.bestStreak = Math.max(daily.bestStreak, daily.streak);
  daily.lastDate = dateKey;
  daily.progress = null;
  save();
  return trackMission({ type: "daily" });
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

// Save a finished level. Returns the missions that just got done.
export function recordLevel(number, stars) {
  const old = data.levels.stars[number] || 0;
  data.levels.stars[number] = Math.max(old, stars);
  save();
  return trackMission({ type: "level" });
}

// Save a finished Time Attack. Returns the rewards and if it is a new best.
export function recordTimed(score) {
  const timed = data.timed;
  const isBest = score > timed.best;
  timed.best = Math.max(timed.best, score);
  timed.sessions++;
  timed.totalWords += score;
  const missionsDone = trackMission({ type: "timed", score });
  const result = giveRewards({ xp: score * 12, coins: score * 4 });
  return { ...result, isBest, missionsDone };
}

export function spendCoins(amount) {
  if (data.player.coins < amount) return false;
  data.player.coins -= amount;
  save();
  return true;
}

// Buy a figure with coins. Returns true when it worked.
export function buyFigure(id) {
  const figure = FIGURES.find((item) => item.id === id);
  if (!figure || isFigureOwned(figure, data) || !figure.price) return false;
  if (!spendCoins(figure.price)) return false;
  data.figures.push(id);
  save();
  return true;
}

// Add XP and coins, then look for new achievements and themes
function giveRewards({ xp, coins }) {
  const levelBefore = getLevelInfo(data.player.xp).level;
  data.player.xp += xp;
  data.player.coins += coins;

  const newAchievements = [];
  let foundNew = true;
  // Achievements give coins and XP can unlock others, so check until nothing changes
  while (foundNew) {
    foundNew = false;
    for (const achievement of ACHIEVEMENTS) {
      if (!data.achievements[achievement.id] && achievement.check(data)) {
        data.achievements[achievement.id] = toDateKey();
        data.player.coins += ACHIEVEMENT_COINS;
        newAchievements.push(achievement);
        foundNew = true;
      }
    }
  }

  const newThemes = getUnlockedThemes(data).filter((theme) => !data.seenThemes.includes(theme.id));
  data.seenThemes.push(...newThemes.map((theme) => theme.id));

  save();
  return {
    xp,
    coins,
    levelBefore,
    levelAfter: getLevelInfo(data.player.xp).level,
    newAchievements,
    newThemes,
  };
}

// Achievements that only depend on things like streaks (e.g. after a Daily)
export function checkAchievements() {
  return giveRewards({ xp: 0, coins: 0 });
}
