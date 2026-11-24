// The Daily: three riddles per day (short, medium, long). Every player with
// the same language gets the same words, because the date is the seed.
// The Daily only uses the fixed categories, never the season list, so it is
// also the same for players who test the winter look with ?season=winter.
import { CATEGORY_IDS, getWords } from "./words.js";
import { language } from "./i18n.js";
import { seededRandom, shuffle } from "./random.js";
import { daysBetween, toDateKey } from "./dates.js";

const FIRST_DAY = "2026-01-01";
export const DAILY_SIZE = 3;

// Daily #1 was on the first day, every day after that adds one
export function getDailyNumber(dateKey = toDateKey()) {
  return daysBetween(FIRST_DAY, dateKey) + 1;
}

// Each length group is shuffled once with a fixed seed. Day N takes word N.
function wordForDay(words, dayNumber, min, max, seed) {
  const group = words.filter((item) => item.word.length >= min && item.word.length <= max);
  const ordered = shuffle(group, seededRandom(seed));
  const index = ((dayNumber % ordered.length) + ordered.length) % ordered.length;
  return ordered[index];
}

export function getDailyWords(dateKey = toDateKey(), lang = language) {
  const day = getDailyNumber(dateKey);
  const words = getWords(lang, CATEGORY_IDS);
  return [
    wordForDay(words, day, 4, 5, 1101),
    wordForDay(words, day, 6, 7, 2202),
    wordForDay(words, day, 8, 99, 3303),
  ];
}

// "⭐⭐⭐ ⭐⭐ ❌" for a list of star counts (0 = not solved)
export function starLine(starsList) {
  return starsList.map((stars) => (stars > 0 ? "⭐".repeat(stars) : "❌")).join(" ");
}

// The share text: "Hanglet #330 ⭐⭐⭐ ⭐⭐ ⭐ (6/9)"
export function dailyShareLine(number, starsList) {
  const total = starsList.reduce((sum, stars) => sum + stars, 0);
  return `Hanglet #${number} ${starLine(starsList)} (${total}/${starsList.length * 3})`;
}
