// One round of the game: one word, its clues, a number of lives and the guesses.
// The riddle gets clearer: you start with clue 1, and every few lost lives
// open the next clue. You can also type the whole word ("I know it!").
// This file has no DOM code, so it is easy to test and reuse in every mode.

export const MAX_STARS = 3;
export const MISSES_PER_CLUE = 2; // a new clue after every 2 lost lives
export const WRONG_WORD_COST = 2; // a wrong "I know it!" costs 2 lives

export class Round {
  // maxClues: how many clues can open (Hard: 2). missesPerClue: Kids use 1.
  constructor({ word, category, lives, clues = [], maxClues = MAX_STARS, missesPerClue = MISSES_PER_CLUE, picture = null }) {
    this.word = word;
    this.category = category;
    this.lives = lives;
    this.clues = clues;
    this.maxClues = Math.max(1, Math.min(maxClues, clues.length || 1));
    this.missesPerClue = missesPerClue;
    this.picture = picture;
    this.guessed = [];
    this.misses = 0;
    this.wordGuesses = 0; // wrong "I know it!" guesses
    this.solvedByWord = false; // solved with "I know it!"
  }

  // Returns "correct", "wrong", or "ignored" (game over or already guessed)
  guess(letter) {
    if (this.isOver() || this.guessed.includes(letter)) return "ignored";
    this.guessed.push(letter);
    if (this.word.includes(letter)) return "correct";
    this.misses++;
    return "wrong";
  }

  // "I know it!": the whole word at once.
  // Returns "correct", "wrong" (costs lives), "length" (wrong length, free) or "ignored".
  guessWord(text) {
    if (this.isOver() || !text) return "ignored";
    if (text.length !== this.word.length) return "length";
    if (text === this.word) {
      for (const letter of new Set(this.word)) {
        if (!this.guessed.includes(letter)) this.guessed.push(letter);
      }
      this.solvedByWord = true;
      return "correct";
    }
    this.wordGuesses++;
    this.misses = Math.min(this.lives, this.misses + WRONG_WORD_COST);
    return "wrong";
  }

  // Fill in a letter for free: the first letter on Easy, or Tilo's help in Kids.
  // It is not a miss. The last hidden letter is never given away.
  giveLetter(letter) {
    if (this.isOver() || this.guessed.includes(letter) || !this.word.includes(letter)) return false;
    if (this.hiddenLetters().length < 2) return false;
    this.guessed.push(letter);
    return true;
  }

  // ---------- Clues and stars ----------

  // How many clues are open: 1, 2 or 3
  openClues() {
    return Math.min(this.maxClues, 1 + Math.floor(this.misses / this.missesPerClue));
  }

  // Wrong letters until the next clue opens, or 0 when no clue is left
  missesToNextClue() {
    if (this.openClues() >= this.maxClues) return 0;
    return this.openClues() * this.missesPerClue - this.misses;
  }

  // Stars if you solve it now: clue 1 = 3, clue 2 = 2, clue 3 = 1
  starsNow() {
    return MAX_STARS + 1 - this.openClues();
  }

  // Stars for the finished round (0 when lost)
  stars() {
    return this.isWon() ? this.starsNow() : 0;
  }

  // ---------- State ----------

  // The different letters of the word that are not guessed yet
  hiddenLetters() {
    return [...new Set(this.word)].filter((letter) => !this.guessed.includes(letter));
  }

  // How many letter tiles are filled in (for the rocket figure)
  revealedCount() {
    return [...this.word].filter((letter) => this.guessed.includes(letter)).length;
  }

  livesLeft() {
    return this.lives - this.misses;
  }

  isWon() {
    return this.hiddenLetters().length === 0;
  }

  isLost() {
    return this.misses >= this.lives;
  }

  isOver() {
    return this.isWon() || this.isLost();
  }
}
