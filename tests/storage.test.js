// Saved data: players from version 1 keep their progress, and a progress
// file can be downloaded and loaded again.
import { test } from "node:test";
import assert from "node:assert/strict";
import { DATA_VERSION, exportData, migrate, parseImport } from "../js/core/storage.js";
import { isThemeUnlocked, THEMES } from "../js/core/themes.js";
import { FIGURES, isFigureOwned } from "../js/core/figures.js";

// What a player's data looked like in version 1 (v4 of the game)
const VERSION_1 = {
  settings: { language: "nl", theme: "coral", figure: "rocket", options: { category: "food", length: "long", difficulty: "hard" } },
  player: { xp: 900, coins: 345, hintTokens: 2 },
  stats: { played: 40, wins: 30, losses: 10, winStreak: 4, bestWinStreak: 9, missesInWins: [1, 2, 3, 4, 5, 6, 7, 2], hintsUsed: 6, categoriesWon: { food: 3 } },
  daily: {
    history: { "2026-11-20": { solved: 2, total: 3, results: [] } },
    streak: 5, bestStreak: 8, lastDate: "2026-11-20",
    progress: { date: "2026-11-24", index: 1, results: [{ won: true }], guessed: ["a"] },
  },
  levels: { stars: { 1: 3, 2: 2, 3: 1 } },
  timed: { best: 12, sessions: 3, totalWords: 20 },
  achievements: { "first-win": "2026-11-01", "wins-10": "2026-11-05", "timed-10": "2026-11-06" },
  seenThemes: ["ocean", "lagoon", "forest", "coral"],
  figures: ["classic", "balloon", "rocket"],
  dictionary: { en: {}, nl: { kaas: { category: "food", picture: null, first: "2026-11-02", count: 2 } } },
  kids: { stickers: { cat: 2 }, solved: 2 },
  chest: { lastOpened: "2026-11-20" },
  missions: { date: "2026-11-20", progress: {}, claimed: {} },
  welcomeDone: true,
  tutorialDone: true,
};

test("version 1 players keep streaks, badges, dictionary, levels and stickers", () => {
  const data = migrate(structuredClone(VERSION_1));
  assert.equal(data.version, DATA_VERSION);
  assert.equal(data.daily.streak, 5);
  assert.equal(data.daily.bestStreak, 8);
  assert.equal(data.daily.lastDate, "2026-11-20");
  assert.ok(data.daily.history["2026-11-20"]);
  assert.deepEqual(Object.keys(data.achievements).sort(), ["first-win", "timed-10", "wins-10"]);
  assert.equal(data.dictionary.nl.kaas.count, 2);
  assert.deepEqual(data.levels.stars, { 1: 3, 2: 2, 3: 1 });
  assert.equal(data.kids.stickers.cat, 2);
  assert.equal(data.stats.wins, 30);
  assert.equal(data.stats.bestWinStreak, 9);
  assert.equal(data.settings.options.difficulty, "hard");
  assert.equal(data.settings.language, "nl");
});

test("version 1 players keep the themes and figures they had", () => {
  const data = migrate(structuredClone(VERSION_1));
  assert.equal(data.player.stars, 0);
  const theme = (id) => THEMES.find((item) => item.id === id);
  const figure = (id) => FIGURES.find((item) => item.id === id);
  assert.equal(isThemeUnlocked(theme("coral"), data), true);
  assert.equal(isThemeUnlocked(theme("gold"), data), false);
  assert.equal(isFigureOwned(figure("rocket"), data), true);
  assert.equal(isFigureOwned(figure("snowman"), data), true, "the snowman came with the wins-10 badge");
  assert.equal(isFigureOwned(figure("flower"), data), false);
  assert.ok(data.seenUnlocks.includes("theme:coral"), "old looks are not announced as new");
});

test("coins, XP, hints, the chest, missions and Time Attack are gone", () => {
  const data = migrate(structuredClone(VERSION_1));
  assert.deepEqual(data.player, { stars: 0 });
  for (const key of ["timed", "chest", "missions", "seenThemes", "figures"]) assert.equal(data[key], undefined, key);
  assert.equal(data.stats.missesInWins, undefined);
  assert.equal(data.daily.progress, null, "a Daily from the old version starts fresh");
  assert.deepEqual(data.stats.solvedAtClue, [0, 0, 0]);
});

test("broken or empty data gives a fresh start", () => {
  assert.equal(migrate(null).version, DATA_VERSION);
  assert.equal(migrate("nonsense").player.stars, 0);
  assert.equal(migrate([]).settings.figure, "balloon");
});

test("a progress file can be downloaded and loaded again", () => {
  const data = migrate(structuredClone(VERSION_1));
  data.player.stars = 77;
  const text = exportData(data, "2026-11-24");
  const file = JSON.parse(text);
  assert.equal(file.app, "hanglet");
  assert.equal(file.exported, "2026-11-24");
  const loaded = parseImport(text);
  assert.equal(loaded.player.stars, 77);
  assert.equal(loaded.daily.streak, 5);
});

test("an old version 1 file can be loaded too", () => {
  const loaded = parseImport(JSON.stringify({ app: "hanglet", version: 1, data: VERSION_1 }));
  assert.equal(loaded.version, DATA_VERSION);
  assert.equal(loaded.daily.bestStreak, 8);
});

test("files that are not from Hanglet are refused", () => {
  assert.equal(parseImport("not json"), null);
  assert.equal(parseImport(JSON.stringify({ app: "other", data: {} })), null);
  assert.equal(parseImport(JSON.stringify({ app: "hanglet" })), null);
});
