// Rules of the Kids world (ages 6-9). No DOM code, so it is easy to test.
// - Only short words (3-5 letters)
// - A small keyboard: the letters of the word plus 4-6 extra letters
// - You can't lose: after a wrong letter Tilo helps a bit more each time
import { shuffle } from "./random.js";

export const KIDS_MIN_LENGTH = 3;
export const KIDS_MAX_LENGTH = 5;
export const KIDS_MIN_EXTRA = 4;
export const KIDS_MAX_EXTRA = 6;

// Extra letters are easy to tell apart: no q, x, y, z or c
const EXTRA_POOL = "abdefghijklmnoprstuvw".split("");

export function isKidsLength(word) {
  return word.length >= KIDS_MIN_LENGTH && word.length <= KIDS_MAX_LENGTH;
}

// Fewer different letters in the word = more extra letters, so the
// keyboard always has 8 or 9 keys
export function extraLetterCount(word) {
  const unique = new Set(word).size;
  return Math.min(KIDS_MAX_EXTRA, Math.max(KIDS_MIN_EXTRA, 9 - unique));
}

// The keys of the Kids keyboard, in ABC order (easier to find for young kids)
export function kidsKeyboardLetters(word, random = Math.random) {
  const own = [...new Set(word)];
  const extras = shuffle(EXTRA_POOL.filter((letter) => !own.includes(letter)), random)
    .slice(0, extraLetterCount(word));
  return [...own, ...extras].sort();
}

// The first letter of the word (in reading order) that is not found yet
export function nextHiddenLetter(word, guessed) {
  return [...word].find((letter) => !guessed.includes(letter)) || null;
}

// What Tilo does after a wrong letter:
//   1st wrong letter → "glow": the next right key lights up
//   2nd and later    → "fill": Tilo fills in the next letter together with you
// The last letter is never filled in, so the child always finishes the word.
export function kidsHelp(word, guessed, wrongCount) {
  const letter = nextHiddenLetter(word, guessed);
  if (!letter) return null;
  const hiddenCount = new Set([...word].filter((item) => !guessed.includes(item))).size;
  const type = wrongCount >= 2 && hiddenCount >= 2 ? "fill" : "glow";
  return { type, letter };
}
