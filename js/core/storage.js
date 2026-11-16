// Saving and loading all player data in localStorage.
// There is no server: everything stays on the player's device.

export const STORAGE_KEY = "hanglet-data-v1";

function createDefaultData() {
  return {
    settings: {
      language: null, // null = follow the browser
      colorMode: "system", // "system", "light" or "dark"
      theme: "ocean",
      figure: "classic",
      textSize: "normal", // "normal" or "large"
      contrast: "normal", // "normal" or "high"
      sound: true,
      vibration: true,
      reduceMotion: null, // null = follow the device setting
      kidsFirst: false, // show Kids mode first on the home page
      options: { category: "mixed", length: "medium", difficulty: "normal" },
    },
    player: { xp: 0, coins: 40 },
    stats: {
      played: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      bestWinStreak: 0,
      // missesInWins[3] = number of games won with 3 misses
      missesInWins: [0, 0, 0, 0, 0, 0, 0, 0],
      flawless: 0,
      hardWins: 0,
      kidsWins: 0,
      longestWord: 0,
      hintsUsed: 0,
      categoriesWon: {},
      recentWords: [],
    },
    daily: {
      history: {}, // "2026-11-16": { solved: 2, total: 3, results: [...] }
      streak: 0,
      bestStreak: 0,
      lastDate: null,
      progress: null, // the Daily that is being played right now
    },
    levels: { stars: {} }, // { "1": 3, "2": 2 }
    timed: { best: 0, sessions: 0, totalWords: 0 },
    achievements: {}, // { "first-win": "2026-11-16" }
    seenThemes: ["ocean"],
    figures: ["classic", "balloon"], // figures the player owns
    dictionary: { en: {}, nl: {} }, // solved words per language
    welcomeDone: false,
    tutorialDone: false,
  };
}

// Fill in missing fields with defaults, so older saved data keeps working
function mergeWithDefaults(saved) {
  const data = createDefaultData();
  if (!saved || typeof saved !== "object") {
    return data;
  }
  for (const key of Object.keys(data)) {
    const value = saved[key];
    if (value === undefined) continue;
    if (Array.isArray(data[key])) {
      data[key] = Array.isArray(value) ? value : data[key];
    } else if (typeof data[key] === "object" && data[key] !== null) {
      data[key] = { ...data[key], ...value };
    } else {
      data[key] = value;
    }
  }
  data.settings.options = { ...createDefaultData().settings.options, ...data.settings.options };
  // Players from version 1 already know the game
  if (saved.stats && saved.stats.played > 0 && saved.tutorialDone === undefined) {
    data.tutorialDone = true;
  }
  return data;
}

function load() {
  try {
    return mergeWithDefaults(JSON.parse(localStorage.getItem(STORAGE_KEY)));
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
