// One round of the game: one word, a number of lives and the guessed letters.
// This file has no DOM code, so it is easy to test and reuse in every mode.

export class Round {
  constructor({ word, category, lives }) {
    this.word = word;
    this.category = category;
    this.lives = lives;
    this.guessed = [];
    this.misses = 0;
    this.hintsUsed = 0;
  }

  // Returns "correct", "wrong", or "ignored" (game over or already guessed)
  guess(letter) {
    if (this.isOver() || this.guessed.includes(letter)) {
      return "ignored";
    }
    this.guessed.push(letter);
    if (this.word.includes(letter)) {
      return "correct";
    }
    this.misses++;
    return "wrong";
  }

  // Reveal one random hidden letter. Only allowed if 2 or more are still hidden.
  revealHint() {
    const hidden = this.hiddenLetters();
    if (this.isOver() || hidden.length < 2) {
      return null;
    }
    const letter = hidden[Math.floor(Math.random() * hidden.length)];
    this.guessed.push(letter);
    this.hintsUsed++;
    return letter;
  }

  // The different letters of the word that are not guessed yet
  hiddenLetters() {
    const letters = [...new Set(this.word)];
    return letters.filter((letter) => !this.guessed.includes(letter));
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
