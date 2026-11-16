// One round of the game: one word, a number of lives and the guessed letters.
// This file has no DOM code, so it is easy to test and reuse in every mode.

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export class Round {
  constructor({ word, category, lives, description = "", picture = null }) {
    this.word = word;
    this.category = category;
    this.lives = lives;
    this.description = description;
    this.picture = picture;
    this.guessed = [];
    this.removed = []; // wrong letters taken away by a hint
    this.misses = 0;
    this.hintsUsed = 0;
    this.descriptionShown = false;
  }

  // Returns "correct", "wrong", or "ignored" (game over, already guessed or removed)
  guess(letter) {
    if (this.isOver() || this.guessed.includes(letter) || this.removed.includes(letter)) {
      return "ignored";
    }
    this.guessed.push(letter);
    if (this.word.includes(letter)) {
      return "correct";
    }
    this.misses++;
    return "wrong";
  }

  // ---------- Hints ----------

  canRevealLetter() {
    return !this.isOver() && this.hiddenLetters().length >= 2;
  }

  // Reveal one random hidden letter (never the last one)
  revealLetter() {
    if (!this.canRevealLetter()) return null;
    const hidden = this.hiddenLetters();
    const letter = hidden[Math.floor(Math.random() * hidden.length)];
    this.guessed.push(letter);
    this.hintsUsed++;
    return letter;
  }

  // Wrong letters that are still on the keyboard
  unusedWrongLetters() {
    return ALPHABET.filter(
      (letter) => !this.word.includes(letter) && !this.guessed.includes(letter) && !this.removed.includes(letter)
    );
  }

  canRemoveLetters() {
    return !this.isOver() && this.unusedWrongLetters().length >= 3;
  }

  // Take away 3 wrong letters. They don't count as misses.
  removeWrongLetters(count = 3) {
    if (!this.canRemoveLetters()) return [];
    const letters = this.unusedWrongLetters();
    const picked = [];
    while (picked.length < count) {
      const index = Math.floor(Math.random() * letters.length);
      picked.push(letters.splice(index, 1)[0]);
    }
    this.removed.push(...picked);
    this.hintsUsed++;
    return picked;
  }

  canShowDescription() {
    return !this.isOver() && !this.descriptionShown && this.description !== "";
  }

  showDescription() {
    if (!this.canShowDescription()) return false;
    this.descriptionShown = true;
    this.hintsUsed++;
    return true;
  }

  // ---------- State ----------

  // The different letters of the word that are not guessed yet
  hiddenLetters() {
    const letters = [...new Set(this.word)];
    return letters.filter((letter) => !this.guessed.includes(letter));
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
