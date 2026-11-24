// The Daily: 3 riddles a day, the same for everyone with the same language,
// also when someone tests the winter look with ?season=winter.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { dailyShareLine, getDailyNumber, getDailyWords, starLine } from "../js/core/daily.js";
import { CATEGORY_IDS } from "../js/core/words.js";
import { addDays } from "../js/core/dates.js";

const START = "2026-11-24";
const DAYS = 120;
const dates = Array.from({ length: DAYS }, (_, i) => addDays(START, i));

test("3 riddles a day: short, medium and long, each with 3 clues", () => {
  for (const lang of ["en", "nl"]) {
    const [short, medium, long] = getDailyWords(START, lang);
    assert.ok(short.word.length <= 5, short.word);
    assert.ok(medium.word.length >= 6 && medium.word.length <= 7, medium.word);
    assert.ok(long.word.length >= 8, long.word);
    for (const item of [short, medium, long]) assert.equal(item.clues.length, 3);
  }
});

test("the same date gives the same words, every time", () => {
  for (const date of dates.slice(0, 10)) {
    assert.deepEqual(getDailyWords(date, "en"), getDailyWords(date, "en"));
    assert.deepEqual(getDailyWords(date, "nl"), getDailyWords(date, "nl"));
  }
});

test("the Daily never uses the winter list, also in December", () => {
  for (const date of [...dates, "2026-12-01", "2026-12-25", "2027-01-06"]) {
    for (const lang of ["en", "nl"]) {
      for (const item of getDailyWords(date, lang)) assert.ok(CATEGORY_IDS.includes(item.category), `${date} ${item.word}`);
    }
  }
});

test("?season=winter does not change the Daily", () => {
  // Load the game logic in a new Node process that pretends the page was opened with ?season=winter
  const script = `
    const store = {};
    globalThis.location = { search: "?season=winter" };
    globalThis.sessionStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); } };
    const { getDailyWords } = await import("./js/core/daily.js");
    const { SEASON_CATEGORY } = await import("./js/core/words.js");
    const dates = ${JSON.stringify(dates.slice(0, 30))};
    console.log(JSON.stringify({ season: SEASON_CATEGORY, words: dates.map((d) => getDailyWords(d, "nl").map((w) => w.word)) }));`;
  const output = JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" }));
  assert.equal(output.season, "winter", "the season test really ran in winter mode");
  const normal = dates.slice(0, 30).map((d) => getDailyWords(d, "nl").map((w) => w.word));
  assert.deepEqual(output.words, normal);
});

test("words don't come back too soon", () => {
  const seen = dates.slice(0, 30).flatMap((date) => getDailyWords(date, "en").map((item) => item.word));
  assert.equal(new Set(seen).size, seen.length, "30 days without a repeat");
});

test("Daily numbers count up by one per day", () => {
  assert.equal(getDailyNumber("2026-01-01"), 1);
  assert.equal(getDailyNumber("2026-11-26"), 330);
});

test("share text with stars, e.g. Hanglet #330 ⭐⭐⭐ ⭐⭐ ⭐ (6/9)", () => {
  assert.equal(dailyShareLine(330, [3, 2, 1]), "Hanglet #330 ⭐⭐⭐ ⭐⭐ ⭐ (6/9)");
  assert.equal(dailyShareLine(12, [3, 0, 3]), "Hanglet #12 ⭐⭐⭐ ❌ ⭐⭐⭐ (6/9)");
  assert.equal(starLine([1]), "⭐");
});
