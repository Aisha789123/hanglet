// On-screen keyboard. The real keyboard works too (see the play page).
// Normally it has all 26 letters; the Kids world uses a small set of letters.
import { t } from "../core/i18n.js";

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export function createKeyboard(container, onPress) {
  let buttons = {};

  // Build the keys. Kids keys get a color number for their own bright color.
  function setLetters(letters = ALPHABET) {
    container.innerHTML = "";
    buttons = {};
    container.classList.toggle("is-small-set", letters.length < ALPHABET.length);
    container.style.setProperty("--key-count", letters.length);
    letters.forEach((letter, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "key";
      button.dataset.color = String(index % 6);
      button.textContent = letter;
      button.setAttribute("aria-label", t("keyboard.letter", { letter: letter.toUpperCase() }));
      button.addEventListener("click", () => onPress(letter));
      container.appendChild(button);
      buttons[letter] = button;
    });
  }

  // state is "correct", "wrong" or "removed" (taken away by a hint)
  function mark(letter, state) {
    const button = buttons[letter];
    if (!button || state === "ignored") return;
    button.classList.remove("is-glowing");
    button.classList.add(`is-${state}`);
    button.disabled = true;
    button.setAttribute("aria-label", t(`keyboard.${state}`, { letter: letter.toUpperCase() }));
  }

  // Tilo's tip in the Kids world: this key lights up
  function glow(letter) {
    Object.values(buttons).forEach((button) => button.classList.remove("is-glowing"));
    buttons[letter]?.classList.add("is-glowing");
  }

  function has(letter) {
    return Boolean(buttons[letter]);
  }

  function reset(letters = ALPHABET) {
    setLetters(letters);
  }

  // Lock or unlock every key that is not used yet
  function setLocked(locked) {
    container.classList.toggle("is-locked", locked);
    container.setAttribute("aria-disabled", String(locked));
  }

  setLetters();
  return { mark, glow, has, reset, setLocked };
}
