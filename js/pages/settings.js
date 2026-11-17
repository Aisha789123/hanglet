// Settings page: language, difficulty, appearance, accessibility, themes, figures,
// sound and feel, the tutorial and resetting progress.
import { data, save, resetAll } from "../core/storage.js";
import { language, t } from "../core/i18n.js";
import { THEMES, isThemeUnlocked } from "../core/themes.js";
import { FIGURES, isFigureOwned } from "../core/figures.js";
import { buyFigure, setDifficulty } from "../core/progress.js";
import { initPage, refreshHeader, setLanguage } from "../ui/layout.js";
import { applyAppearance, isReducedMotion } from "../ui/appearance.js";
import { icon } from "../ui/icons.js";
import { figurePreview } from "../ui/figures/index.js";
import { playSound, vibrate } from "../ui/feedback.js";
import { startMusic, stopMusic } from "../ui/music.js";
import { showToast } from "../ui/toast.js";
import { setupInstallButton } from "../ui/install.js";

initPage("settings");

const settings = data.settings;

// ---------- Radio groups (language and color mode) ----------
function setupRadios(formId, current, onChange) {
  const form = document.getElementById(formId);
  const input = form.querySelector(`input[value="${current}"]`);
  if (input) input.checked = true;
  form.addEventListener("change", (event) => onChange(event.target.value));
}

setupRadios("language-choice", language, (value) => setLanguage(value));
setupRadios("difficulty-choice", settings.options.difficulty, (value) => setDifficulty(value));
setupRadios("color-mode", settings.colorMode, (value) => {
  settings.colorMode = value;
  save();
  applyAppearance();
});

// ---------- Switches ----------
function setupSwitch(id, getValue, setValue) {
  const input = document.getElementById(id);
  input.checked = getValue();
  input.addEventListener("change", () => {
    setValue(input.checked);
    save();
  });
}

setupSwitch("large-text-switch", () => settings.textSize === "large", (on) => {
  settings.textSize = on ? "large" : "normal";
  applyAppearance();
});
setupSwitch("contrast-switch", () => settings.contrast === "high", (on) => {
  settings.contrast = on ? "high" : "normal";
  applyAppearance();
});
setupSwitch("motion-switch", () => isReducedMotion(), (on) => {
  settings.reduceMotion = on;
  applyAppearance();
});
setupSwitch("kids-first-switch", () => settings.kidsFirst, (on) => {
  settings.kidsFirst = on;
});
setupSwitch("sound-switch", () => settings.sound, (on) => {
  settings.sound = on;
  if (on) playSound("win");
});
setupSwitch("music-switch", () => settings.music, (on) => {
  settings.music = on;
  if (on) startMusic();
  else stopMusic();
});
setupSwitch("vibration-switch", () => settings.vibration, (on) => {
  settings.vibration = on;
  if (on) vibrate(30);
});

if (!("vibrate" in navigator)) {
  document.getElementById("vibration-note").textContent = t("settings.vibrationUnsupported");
}

// ---------- Color themes ----------
const themeList = document.getElementById("theme-list");

function themeUnlockText(theme) {
  if (!theme.unlock) return t("settings.free");
  if (theme.unlock.level) return t("settings.reachLevel", { level: theme.unlock.level });
  return t("settings.unlockStreak");
}

function renderThemes() {
  themeList.innerHTML = THEMES.map((theme) => {
    const unlocked = isThemeUnlocked(theme, data);
    const selected = settings.theme === theme.id;
    const name = t(`themes.${theme.id}`);
    return `
      <li>
        <button type="button" class="theme-option${selected ? " is-selected" : ""}" data-theme-id="${theme.id}"
          ${unlocked ? "" : "disabled"} aria-pressed="${selected}"
          aria-label="${name}${unlocked ? "" : `, ${t("settings.locked")}: ${themeUnlockText(theme)}`}">
          <span class="theme-swatch" data-theme="${theme.id}"><span></span><span></span><span></span>${unlocked ? (selected ? icon("check") : "") : icon("lock")}</span>
          <span class="theme-name">${name}</span>
          <small>${selected ? t("settings.inUse") : themeUnlockText(theme)}</small>
        </button>
      </li>`;
  }).join("");
}

themeList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme-id]");
  if (!button || button.disabled) return;
  settings.theme = button.dataset.themeId;
  save();
  applyAppearance();
  renderThemes();
  themeList.querySelector(`[data-theme-id="${settings.theme}"]`).focus();
  playSound("tap");
});
renderThemes();

// ---------- Figures shop ----------
const figureList = document.getElementById("figure-list");

function figureStatus(figure, owned) {
  if (settings.figure === figure.id) return t("settings.inUse");
  if (owned) return t("settings.choose");
  if (figure.achievement) return t("settings.unlockBadge", { badge: t(`achievements.${figure.achievement}.name`) });
  return t("settings.buyFor", { coins: figure.price });
}

function renderFigures() {
  figureList.innerHTML = FIGURES.map((figure) => {
    const owned = isFigureOwned(figure, data);
    const selected = settings.figure === figure.id;
    const canBuy = !owned && figure.price && data.player.coins >= figure.price;
    const disabled = !owned && !canBuy;
    return `
      <li>
        <button type="button" class="figure-option${selected ? " is-selected" : ""}${owned ? "" : " is-locked"}"
          data-figure-id="${figure.id}" ${disabled ? "disabled" : ""} aria-pressed="${selected}">
          <span class="figure-preview" data-preview="${figure.id}"></span>
          <span class="figure-name">${t(`figures.${figure.id}.name`)}</span>
          <small>${t(`figures.${figure.id}.text`)}</small>
          <span class="figure-status">${!owned && figure.price ? icon("coin") : owned ? "" : icon("lock")}${figureStatus(figure, owned)}</span>
        </button>
      </li>`;
  }).join("");
  figureList.querySelectorAll("[data-preview]").forEach((element) => figurePreview(element.dataset.preview, element));
}

figureList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-figure-id]");
  if (!button || button.disabled) return;
  const figure = FIGURES.find((item) => item.id === button.dataset.figureId);
  if (!isFigureOwned(figure, data)) {
    if (!buyFigure(figure.id)) return;
    playSound("unlock");
    showToast(t("settings.bought", { name: t(`figures.${figure.id}.name`) }), icon("gift"));
    refreshHeader();
  } else {
    playSound("tap");
  }
  settings.figure = figure.id;
  save();
  renderFigures();
  figureList.querySelector(`[data-figure-id="${figure.id}"]`).focus();
});
renderFigures();

// ---------- Tutorial ----------
document.getElementById("tutorial-button").addEventListener("click", () => {
  data.tutorialDone = false;
  save();
  location.href = "./play.html?mode=classic";
});

// ---------- Reset ----------
const resetDialog = document.getElementById("reset-dialog");
document.getElementById("reset-button").addEventListener("click", () => resetDialog.showModal());
document.getElementById("reset-cancel").addEventListener("click", () => resetDialog.close());
document.getElementById("reset-confirm").addEventListener("click", () => {
  resetAll();
  // Reload so the page starts with fresh default data, then show a message
  sessionStorage.setItem("hanglet-reset", "1");
  location.reload();
});

if (sessionStorage.getItem("hanglet-reset") === "1") {
  sessionStorage.removeItem("hanglet-reset");
  showToast(t("settings.resetDone"), icon("check"));
}

setupInstallButton(document.getElementById("install-button"));
