// Make a challenge: type a secret word and get a link for a friend.
import { language, t } from "../core/i18n.js";
import { MAX_LENGTH, MIN_LENGTH, challengeLink, cleanWord, encodeChallenge, isValidWord } from "../core/challenge.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";
import { createMascot } from "../ui/mascot.js";
import { copyText, showToast } from "../ui/toast.js";
import { playSound } from "../ui/feedback.js";

initPage("home");

const mascot = createMascot(document.getElementById("challenge-mascot"), "thinking", { label: t("mascot.label") });
const form = document.getElementById("challenge-form");
const wordInput = document.getElementById("challenge-word");
const preview = document.getElementById("word-preview");
const errorEl = document.getElementById("challenge-error");
const resultEl = document.getElementById("challenge-result");

document.getElementById("word-help").textContent = t("challenge.wordHelp", { min: MIN_LENGTH, max: MAX_LENGTH });

// Show the word as hidden tiles while typing
function updatePreview() {
  const word = cleanWord(wordInput.value).slice(0, MAX_LENGTH);
  preview.innerHTML = [...word].map((_, i) => `<span class="drop-tile drop-${i % 4}">?</span>`).join("");
  preview.setAttribute("aria-label", t("challenge.previewLabel", { count: word.length }));
}
wordInput.addEventListener("input", () => {
  updatePreview();
  errorEl.hidden = true;
});
updatePreview();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const word = cleanWord(wordInput.value);
  if (!isValidWord(word)) {
    errorEl.textContent = t("challenge.invalid", { min: MIN_LENGTH, max: MAX_LENGTH });
    errorEl.hidden = false;
    mascot.setMood("surprised");
    mascot.react("shake");
    wordInput.focus();
    return;
  }

  const code = encodeChallenge({
    word,
    clues: [1, 2, 3].map((n) => document.getElementById(`challenge-clue${n}`).value),
    name: document.getElementById("challenge-name").value,
    lang: language,
  });
  const link = challengeLink(code);
  const name = document.getElementById("challenge-name").value.trim();
  const message = t("challenge.message", { name: name || t("challenge.someone"), count: word.length });

  mascot.setMood("cheering");
  mascot.react("bounce");
  playSound("unlock");
  form.hidden = true;
  resultEl.hidden = false;
  resultEl.innerHTML = `
    <h2>${t("challenge.ready")}</h2>
    <p>${t("challenge.readyText")}</p>
    <label class="link-field">
      <span class="visually-hidden">${t("challenge.link")}</span>
      <input type="text" readonly value="${link}">
    </label>
    <div class="share-buttons">
      <a class="button button-mint" href="https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}" target="_blank" rel="noopener">${icon("quote")}<span>WhatsApp</span></a>
      <button class="button button-primary" type="button" id="copy-link">${icon("share")}<span>${t("challenge.copy")}</span></button>
      ${navigator.share ? `<button class="button button-secondary" type="button" id="share-link">${icon("share")}<span>${t("result.share")}</span></button>` : ""}
      <button class="button button-secondary" type="button" id="new-challenge">${icon("refresh")}<span>${t("challenge.another")}</span></button>
    </div>`;

  resultEl.querySelector("input").addEventListener("focus", (e) => e.target.select());
  resultEl.querySelector("#copy-link").addEventListener("click", async () => {
    const copied = await copyText(`${message} ${link}`);
    showToast(copied ? t("challenge.copied") : t("result.copyFailed"), icon("check"));
  });
  resultEl.querySelector("#share-link")?.addEventListener("click", () => {
    navigator.share({ text: message, url: link }).catch(() => {});
  });
  resultEl.querySelector("#new-challenge").addEventListener("click", () => {
    form.reset();
    updatePreview();
    form.hidden = false;
    resultEl.hidden = true;
    mascot.setMood("thinking");
    wordInput.focus();
  });
  resultEl.querySelector("#copy-link").focus();
});
