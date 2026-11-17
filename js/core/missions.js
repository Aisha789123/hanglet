// Daily missions: three small goals per day, the same three for everyone,
// picked with the date as seed. Finishing one gives coins.
import { data, save } from "./storage.js";
import { CATEGORY_IDS } from "./words.js";
import { seededRandom, shuffle } from "./random.js";
import { daysBetween, toDateKey } from "./dates.js";

// Every mission listens to game events: { type: "word" | "daily" | "level" | "timed" | "combo", ... }
export const MISSIONS = [
  { id: "win3", target: 3, reward: 30, icon: "trophy",
    count: (e) => (e.type === "word" && e.won ? 1 : 0) },
  { id: "flawless2", target: 2, reward: 40, icon: "target",
    count: (e) => (e.type === "word" && e.won && e.misses === 0 ? 1 : 0) },
  { id: "long1", target: 1, reward: 30, icon: "ruler",
    count: (e) => (e.type === "word" && e.won && e.length >= 8 ? 1 : 0) },
  { id: "daily", target: 1, reward: 30, icon: "calendar",
    count: (e) => (e.type === "daily" ? 1 : 0) },
  { id: "combo4", target: 1, reward: 25, icon: "spark",
    count: (e) => (e.type === "combo" && e.count >= 4 ? 1 : 0) },
  { id: "timed5", target: 1, reward: 40, icon: "timer",
    count: (e) => (e.type === "timed" && e.score >= 5 ? 1 : 0) },
  { id: "level1", target: 1, reward: 30, icon: "path",
    count: (e) => (e.type === "level" ? 1 : 0) },
  { id: "nohint3", target: 3, reward: 35, icon: "bulb",
    count: (e) => (e.type === "word" && e.won && e.hintsUsed === 0 ? 1 : 0) },
  { id: "category2", target: 2, reward: 35, icon: "grid",
    count: (e, mission) => (e.type === "word" && e.won && e.category === mission.category ? 1 : 0) },
];

// The category for "category2" changes every day
function categoryForDay(dateKey) {
  const day = daysBetween("2026-01-01", dateKey);
  return CATEGORY_IDS[((day % CATEGORY_IDS.length) + CATEGORY_IDS.length) % CATEGORY_IDS.length];
}

// The three missions of a day. Always includes playing the Daily.
export function getMissionsForDay(dateKey = toDateKey()) {
  const day = daysBetween("2026-01-01", dateKey);
  const others = shuffle(MISSIONS.filter((m) => m.id !== "daily"), seededRandom(day * 7919 + 17));
  const picked = [MISSIONS.find((m) => m.id === "daily"), others[0], others[1]];
  return picked.map((mission) => ({ ...mission, category: categoryForDay(dateKey) }));
}

// Start a fresh mission list when a new day begins
function todayState() {
  const today = toDateKey();
  if (!data.missions || data.missions.date !== today) {
    data.missions = { date: today, progress: {}, claimed: {} };
  }
  return data.missions;
}

// Missions with their progress for the screen
export function getTodayMissions() {
  const state = todayState();
  return getMissionsForDay(state.date).map((mission) => {
    const progress = Math.min(mission.target, state.progress[mission.id] || 0);
    return {
      ...mission,
      progress,
      done: progress >= mission.target,
      claimed: Boolean(state.claimed[mission.id]),
    };
  });
}

// Send a game event to today's missions. Returns the missions that just got done.
export function trackMission(event) {
  const state = todayState();
  const finished = [];
  for (const mission of getMissionsForDay(state.date)) {
    const before = state.progress[mission.id] || 0;
    if (before >= mission.target) continue;
    const add = mission.count(event, mission);
    if (add > 0) {
      state.progress[mission.id] = before + add;
      if (before + add >= mission.target) finished.push(mission);
    }
  }
  save();
  return finished;
}

// Collect the coins of a finished mission. Returns the coins, or 0.
export function claimMission(id) {
  const mission = getTodayMissions().find((item) => item.id === id);
  if (!mission || !mission.done || mission.claimed) return 0;
  data.missions.claimed[id] = true;
  data.player.coins += mission.reward;
  save();
  return mission.reward;
}

export function unclaimedCount() {
  return getTodayMissions().filter((mission) => mission.done && !mission.claimed).length;
}
