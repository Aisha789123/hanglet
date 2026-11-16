// The Daily challenge: three words per day (short, medium, long), the same for
// every player, because the words are picked with the date as seed.
import { ALL_WORDS } from "./words.js";
import { seededRandom, shuffle } from "./random.js";
import { daysBetween, toDateKey } from "./dates.js";

export const DAILY_LIVES = 6;
const FIRST_DAY = "2026-01-01";

// Daily #1 was on the first day, every day after that adds one
export function getDailyNumber(dateKey = toDateKey()) {
  return daysBetween(FIRST_DAY, dateKey) + 1;
}

// Each length group is shuffled once with a fixed seed. Day N takes word N.
function wordForDay(dayNumber, min, max, seed) {
  const group = ALL_WORDS.filter((item) => item.word.length >= min && item.word.length <= max);
  const ordered = shuffle(group, seededRandom(seed));
  const index = ((dayNumber % ordered.length) + ordered.length) % ordered.length;
  return ordered[index];
}

export function getDailyWords(dateKey = toDateKey()) {
  const day = getDailyNumber(dateKey);
  return [
    wordForDay(day, 4, 5, 1101),
    wordForDay(day, 6, 7, 2202),
    wordForDay(day, 8, 99, 3303),
  ];
}
