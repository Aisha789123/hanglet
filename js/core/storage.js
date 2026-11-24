// Saving and loading all player data in localStorage.
// There is no server: everything stays on the player's device.
// Players can download their progress as a file and load it again (Settings).
import { DEFAULT_DIFFICULTY } from "./difficulty.js";

// The key stays the same as in version 1, so nobody loses their progress
export const STORAGE_KEY = "hanglet-data-v1";
export const DATA_VERSION = 2;

function createDefaultData() {
  return {
    version: DATA_VERSION,
    settings: {
      language: null, // null = follow the browser
      colorMode: "system", // "system", "light" or "dark"
      theme: "ocean",
      figure: "balloon", // friendly default, the classic figure can be picked in Settings
      textSize: "normal", // "normal" or "large"
      contrast: "normal", // "normal" or "high"
      sound: true,
      music: false, // cheerful background music, off by default
      vibration: true,
      reduceMotion: null, // null = follow the device setting
      kidsFirst: false, // show the Kids world first on the home page
      options: { category: "mixed", length: "medium", difficulty: DEFAULT_DIFFICULTY },
    },
    player: { stars: 0 }, // every star earned, it unlocks figures and themes
    stats: {
      played: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      lossStreak: 0, // words lost in a row, for the "make it easier?" offer
      bestWinStreak: 0,
      flawless: 0, // solved without a wrong letter
      hardWins: 0,
      kidsWins: 0,
      longestWord: 0,
      categoriesWon: {},
      recentWords: [],
      // Since version 2 (the riddle gets clearer)
      starWords: 0, // words played with clues, for the average
      starsEarned: 0, // stars from those words
      solvedAtClue: [0, 0, 0], // solved at clue 1, 2 and 3
      knowItWins: 0, // solved with "I know it!"
      perfectDailies: 0, // Dailies with 9 of 9 stars
    },
    daily: {
      history: {}, // "2026-11-16": { solved: 2, total: 3, stars: 6, results: [...] }
      streak: 0,
      bestStreak: 0,
      lastDate: null,
      progress: null, // the Daily that is being played right now
    },
    levels: { stars: {} }, // { "1": 3, "2": 2 }
    achievements: {}, // { "first-win": "2026-11-16" }
    unlocked: { themes: [], figures: [] }, // looks unlocked in version 1 stay unlocked
    seenUnlocks: [], // "theme:lagoon", "figure:rocket": already announced
    dictionary: { en: {}, nl: {} }, // solved words per language
    kids: { stickers: {}, solved: 0 }, // Kids world: stickers per picture
    welcomeDone: false,
    tutorialDone: false,
  };
}

// Fill in missing fields with defaults, so older saved data keeps working
function mergeWithDefaults(saved) {
  const data = createDefaultData();
  for (const key of Object.keys(data)) {
    const value = saved[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(data[key])) {
      data[key] = Array.isArray(value) ? value : data[key];
    } else if (typeof data[key] === "object" && data[key] !== null) {
      data[key] = typeof value === "object" ? { ...data[key], ...value } : data[key];
    } else {
      data[key] = value;
    }
  }
  data.settings.options = { ...createDefaultData().settings.options, ...data.settings.options };
  if (!Array.isArray(data.stats.solvedAtClue) || data.stats.solvedAtClue.length !== 3) {
    data.stats.solvedAtClue = [0, 0, 0];
  }
  return data;
}

// Version 1 → 2: coins, XP, hints, the chest, missions and Time Attack are gone.
// Streaks, badges, the dictionary, levels, stickers and settings stay.
// Themes and figures the player already had stay unlocked.
function upgradeFromVersion1(saved) {
  const upgraded = { ...saved };
  upgraded.unlocked = {
    themes: Array.isArray(saved.seenThemes) ? [...saved.seenThemes] : [],
    figures: Array.isArray(saved.figures) ? [...saved.figures] : [],
  };
  // The snowman came with the "Getting good" badge
  if (saved.achievements && saved.achievements["wins-10"]) upgraded.unlocked.figures.push("snowman");
  upgraded.seenUnlocks = [
    ...upgraded.unlocked.themes.map((id) => `theme:${id}`),
    ...upgraded.unlocked.figures.map((id) => `figure:${id}`),
  ];
  // A Daily that was halfway had the old words: start today's Daily fresh
  if (upgraded.daily) upgraded.daily = { ...upgraded.daily, progress: null };
  // Players from version 1 already know the game
  if (saved.stats && saved.stats.played > 0 && saved.tutorialDone === undefined) {
    upgraded.tutorialDone = true;
  }
  delete upgraded.seenThemes;
  delete upgraded.figures;
  delete upgraded.timed;
  delete upgraded.chest;
  delete upgraded.missions;
  if (upgraded.player) upgraded.player = { stars: 0 };
  if (upgraded.stats) {
    upgraded.stats = { ...upgraded.stats };
    delete upgraded.stats.missesInWins;
    delete upgraded.stats.hintsUsed;
  }
  return upgraded;
}

// Any saved data (old or new) → data in the current version
export function migrate(saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return createDefaultData();
  const upgraded = (saved.version || 1) < 2 ? upgradeFromVersion1(saved) : saved;
  const data = mergeWithDefaults(upgraded);
  data.version = DATA_VERSION;
  return data;
}

function load() {
  try {
    return migrate(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return createDefaultData();
  }
}

// The one shared data object used by every page
export const data = load();

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage can be full or blocked (private mode). The game still works.
  }
}

export function resetAll() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to remove
  }
}

// ---------- Export and import (a file the player keeps) ----------

// The text of the progress file
export function exportData(source = data, dateKey = new Date().toISOString().slice(0, 10)) {
  return JSON.stringify({ app: "hanglet", version: DATA_VERSION, exported: dateKey, data: source }, null, 2);
}

// Read a progress file. Returns the data, or null when the file is not a Hanglet file.
export function parseImport(text) {
  try {
    const file = JSON.parse(text);
    if (!file || file.app !== "hanglet" || typeof file.data !== "object" || file.data === null) return null;
    return migrate(file.data);
  } catch {
    return null;
  }
}

// Replace all progress with imported data. The page reloads afterwards.
export function replaceAll(newData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return true;
  } catch {
    return false;
  }
}
