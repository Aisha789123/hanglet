// On-screen A-Z keyboard. The real keyboard works too (see the play page).

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export function createKeyboard(container, onPress) {
  container.innerHTML = "";
  const buttons = {};

  for (const letter of ALPHABET) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key";
    button.textContent = letter;
    button.setAttribute("aria-label", `Letter ${letter.toUpperCase()}`);
    button.addEventListener("click", () => onPress(letter));
    container.appendChild(button);
    buttons[letter] = button;
  }

  // state is "correct" or "wrong"
  function mark(letter, state) {
    const button = buttons[letter];
    button.classList.add(`is-${state}`);
    button.disabled = true;
    const result = state === "correct" ? "in the word" : "not in the word";
    button.setAttribute("aria-label", `Letter ${letter.toUpperCase()}, ${result}`);
  }

  function reset() {
    for (const letter of ALPHABET) {
      const button = buttons[letter];
      button.className = "key";
      button.disabled = false;
      button.setAttribute("aria-label", `Letter ${letter.toUpperCase()}`);
    }
  }

  // Lock or unlock every key that is not used yet
  function setLocked(locked) {
    container.classList.toggle("is-locked", locked);
    container.setAttribute("aria-disabled", String(locked));
  }

  return { mark, reset, setLocked };
}
