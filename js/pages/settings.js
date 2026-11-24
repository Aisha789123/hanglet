// Settings page: language, difficulty, appearance, accessibility, themes, figures,
// sound and feel, the tutorial, and your progress (download, load, reset).
import { data, save, resetAll, exportData, parseImport, replaceAll } from "../core/storage.js";
import { language, t, tn } from "../core/i18n.js";
import { THEMES, isThemeUnlocked } from "../core/themes.js";
import { FIGURES, isFigureOwned } from "../core/figures.js";
import { setDifficulty } from "../core/progress.js";
import { toDateKey } from "../core/dates.js";
import { initPage, setLanguage } from "../ui/layout.js";
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
document.getElementById("stars-have").textContent = tn("settings.youHave", data.player.stars);

function unlockText(item) {
  return item.stars > 0 ? tn("settings.needStars", item.stars) : t("settings.free");
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
          aria-label="${name}${unlocked ? "" : `, ${t("settings.locked")}: ${unlockText(theme)}`}">
          <span class="theme-swatch" data-theme="${theme.id}"><span></span><span></span><span></span>${unlocked ? (selected ? icon("check") : "") : icon("lock")}</span>
          <span class="theme-name">${name}</span>
          <small>${selected ? t("settings.inUse") : unlocked ? t("settings.choose") : `${icon("star")}${unlockText(theme)}`}</small>
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

// ---------- Figures (unlocked with stars) ----------
const figureList = document.getElementById("figure-list");

function renderFigures() {
  figureList.innerHTML = FIGURES.map((figure) => {
    const owned = isFigureOwned(figure, data);
    const selected = settings.figure === figure.id;
    const status = selected ? t("settings.inUse") : owned ? t("settings.choose") : unlockText(figure);
    return `
      <li>
        <button type="button" class="figure-option${selected ? " is-selected" : ""}${owned ? "" : " is-locked"}"
          data-figure-id="${figure.id}" ${owned ? "" : "disabled"} aria-pressed="${selected}">
          <span class="figure-preview" data-preview="${figure.id}"></span>
          <span class="figure-name">${t(`figures.${figure.id}.name`)}</span>
          <small>${t(`figures.${figure.id}.text`)}</small>
          <span class="figure-status">${owned ? "" : `${icon("lock")}${icon("star")}`}${status}</span>
        </button>
      </li>`;
  }).join("");
  figureList.querySelectorAll("[data-preview]").forEach((element) => figurePreview(element.dataset.preview, element));
}

figureList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-figure-id]");
  if (!button || button.disabled) return;
  playSound("tap");
  settings.figure = button.dataset.figureId;
  save();
  renderFigures();
  figureList.querySelector(`[data-figure-id="${settings.figure}"]`).focus();
});
renderFigures();

// ---------- Tutorial ----------
document.getElementById("tutorial-button").addEventListener("click", () => {
  data.tutorialDone = false;
  save();
  location.href = "./play.html?mode=classic";
});

// ---------- Your progress: download and load a file ----------
document.getElementById("export-button").addEventListener("click", () => {
  const blob = new Blob([exportData()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hanglet-progress-${toDateKey()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(t("settings.exportDone"), icon("download"));
});

const importFile = document.getElementById("import-file");
const importDialog = document.getElementById("import-dialog");
let importedData = null;

document.getElementById("import-button").addEventListener("click", () => importFile.click());
importFile.addEventListener("change", async () => {
  const file = importFile.files[0];
  importFile.value = "";
  if (!file) return;
  importedData = parseImport(await file.text());
  if (!importedData) {
    showToast(t("settings.importFailed"), icon("close"));
    return;
  }
  importDialog.showModal();
});
document.getElementById("import-cancel").addEventListener("click", () => {
  importedData = null;
  importDialog.close();
});
document.getElementById("import-confirm").addEventListener("click", () => {
  if (importedData && replaceAll(importedData)) {
    sessionStorage.setItem("hanglet-message", "settings.importDone");
    location.reload();
  }
});

// ---------- Reset ----------
const resetDialog = document.getElementById("reset-dialog");
document.getElementById("reset-button").addEventListener("click", () => resetDialog.showModal());
document.getElementById("reset-cancel").addEventListener("click", () => resetDialog.close());
document.getElementById("reset-confirm").addEventListener("click", () => {
  resetAll();
  // Reload so the page starts with fresh default data, then show a message
  sessionStorage.setItem("hanglet-message", "settings.resetDone");
  location.reload();
});

// A message after a reload (reset or import)
const message = sessionStorage.getItem("hanglet-message");
if (message) {
  sessionStorage.removeItem("hanglet-message");
  showToast(t(message), icon("check"));
}

setupInstallButton(document.getElementById("install-button"));
