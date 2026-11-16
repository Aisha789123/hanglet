// Everything that changes the player's progress: stats, streaks, XP, coins,
// the dictionary, achievements, figures and themes. Every function saves at the end.
import { data, save } from "./storage.js";
import { language } from "./i18n.js";
import { ACHIEVEMENTS, ACHIEVEMENT_COINS } from "./achievements.js";
import { getUnlockedThemes } from "./themes.js";
import { FIGURES, isFigureOwned } from "./figures.js";
import { getLevelInfo } from "./xp.js";
import { addDays, toDateKey } from "./dates.js";

// The three kinds of hints and what they cost (free in Kids mode)
export const HINTS = [
  { id: "description", cost: 10, icon: "quote" },
  { id: "letter", cost: 20, icon: "bulb" },
  { id: "remove", cost: 15, icon: "eraser" },
];

// Rewards for one word. Hard games and games without misses give a bonus.
export function rewardForWord(won, misses, lives, isKids = false) {
  if (!won) return { xp: 5, coins: 0 };
  if (isKids) return { xp: 15, coins: 5 };
  const hard = lives <= 4;
  return {
    xp: 20 + (lives - misses) * 5 + (hard ? 15 : 0),
    coins: 10 + (hard ? 5 : 0) + (misses === 0 ? 5 : 0),
  };
}

// Save the result of one word (Daily, Classic, Levels and Kids). Returns the rewards.
export function recordWord({ won, misses, lives, word, category, picture = null, isKids = false }) {
  const stats = data.stats;
  stats.played++;
  stats.recentWords = [word, ...stats.recentWords].slice(0, 40);

  if (won) {
    stats.wins++;
    stats.winStreak++;
    stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.winStreak);
    const index = Math.min(misses, stats.missesInWins.length - 1);
    stats.missesInWins[index]++;
    if (misses === 0) stats.flawless++;
    if (lives <= 4) stats.hardWins++;
    if (isKids) stats.kidsWins++;
    stats.longestWord = Math.max(stats.longestWord, word.length);
    stats.categoriesWon[category] = (stats.categoriesWon[category] || 0) + 1;
    addToDictionary(word, category, picture);
  } else {
    stats.losses++;
    stats.winStreak = 0;
  }

  return giveRewards(rewardForWord(won, misses, lives, isKids));
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

export function recordLevel(number, stars) {
  const old = data.levels.stars[number] || 0;
  data.levels.stars[number] = Math.max(old, stars);
  save();
}

// Save a finished Time Attack. Returns the rewards and if it is a new best.
export function recordTimed(score) {
  const timed = data.timed;
  const isBest = score > timed.best;
  timed.best = Math.max(timed.best, score);
  timed.sessions++;
  timed.totalWords += score;
  const result = giveRewards({ xp: score * 12, coins: score * 4 });
  return { ...result, isBest };
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
