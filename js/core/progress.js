// Everything that changes the player's progress: stats, streaks, XP, coins,
// achievements and unlocked themes. Every function saves the data at the end.
import { data, save } from "./storage.js";
import { ACHIEVEMENTS, ACHIEVEMENT_COINS } from "./achievements.js";
import { getUnlockedThemes } from "./themes.js";
import { getLevelInfo } from "./xp.js";
import { addDays, toDateKey } from "./dates.js";

export const HINT_COST = 20;

// Rewards for one word. Hard games and games without misses give a bonus.
export function rewardForWord(won, misses, lives) {
  if (!won) return { xp: 5, coins: 0 };
  const hard = lives <= 4;
  return {
    xp: 20 + (lives - misses) * 5 + (hard ? 15 : 0),
    coins: 10 + (hard ? 5 : 0) + (misses === 0 ? 5 : 0),
  };
}

// Save the result of one word (Daily, Classic and Levels). Returns the rewards.
export function recordWord({ won, misses, lives, word, category, hintsUsed }) {
  const stats = data.stats;
  stats.played++;
  stats.hintsUsed += hintsUsed;
  stats.recentWords = [word, ...stats.recentWords].slice(0, 40);

  if (won) {
    stats.wins++;
    stats.winStreak++;
    stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.winStreak);
    const index = Math.min(misses, stats.missesInWins.length - 1);
    stats.missesInWins[index]++;
    if (misses === 0) stats.flawless++;
    if (lives <= 4) stats.hardWins++;
    stats.longestWord = Math.max(stats.longestWord, word.length);
    stats.categoriesWon[category] = (stats.categoriesWon[category] || 0) + 1;
  } else {
    stats.losses++;
    stats.winStreak = 0;
  }

  return giveRewards(rewardForWord(won, misses, lives));
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
