// The three difficulties and what they change. Every mode (Daily, Classic,
// Levels, Time Attack) follows the difficulty the player picked.
// This file has no DOM code and no imports, so it is easy to test.
//   easy:   riddle on screen + the first letter is filled in for free
//   normal: riddle on screen
//   hard:   no riddle, only the category

export const DIFFICULTIES = [
  { id: "easy", lives: 8, riddle: true, freeFirstLetter: true },
  { id: "normal", lives: 7, riddle: true, freeFirstLetter: false },
  { id: "hard", lives: 6, riddle: false, freeFirstLetter: false },
];

// New players start on Easy
export const DEFAULT_DIFFICULTY = "easy";

export function getDifficulty(id) {
  return DIFFICULTIES.find((item) => item.id === id) || getDifficulty(DEFAULT_DIFFICULTY);
}

export function getLives(id) {
  return getDifficulty(id).lives;
}

// The letters that are filled in before the player starts
export function freeLetters(word, id) {
  return getDifficulty(id).freeFirstLetter && word ? [word[0]] : [];
}

// One step easier, or null when it is already the easiest
export function easierDifficulty(id) {
  const index = DIFFICULTIES.findIndex((item) => item.id === id);
  return index > 0 ? DIFFICULTIES[index - 1].id : null;
}

// Lost 2 words in a row (and 4, 6, ...)? Then Tilo offers an easier difficulty.
// Not in Kids (you can't lose there) or in a friend's challenge (fixed rules).
export const LOSSES_BEFORE_SUGGESTION = 2;

export function shouldSuggestEasier({ lossStreak, difficulty, mode = "classic" }) {
  if (mode === "kids" || mode === "challenge") return false;
  if (!easierDifficulty(difficulty)) return false;
  return lossStreak >= LOSSES_BEFORE_SUGGESTION && lossStreak % LOSSES_BEFORE_SUGGESTION === 0;
}
