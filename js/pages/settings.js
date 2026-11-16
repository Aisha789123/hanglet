// Settings page: appearance, themes, sound and feel, and resetting progress.
import { data, save, resetAll } from "../core/storage.js";
import { THEMES, isThemeUnlocked, unlockText } from "../core/themes.js";
import { initPage } from "../ui/layout.js";
import { applyAppearance, isReducedMotion } from "../ui/appearance.js";
import { icon } from "../ui/icons.js";
import { playSound, vibrate } from "../ui/feedback.js";
import { showToast } from "../ui/toast.js";
import { setupInstallButton } from "../ui/install.js";

initPage("settings");

const settings = data.settings;

// ---------- Color mode ----------
const modeForm = document.getElementById("color-mode");
modeForm.querySelector(`input[value="${settings.colorMode}"]`).checked = true;
modeForm.addEventListener("change", (event) => {
  settings.colorMode = event.target.value;
  save();
  applyAppearance();
});

// ---------- Themes ----------
const themeList = document.getElementById("theme-list");

function renderThemes() {
  themeList.innerHTML = THEMES.map((theme) => {
    const unlocked = isThemeUnlocked(theme, data);
    const selected = settings.theme === theme.id;
    return `
      <li>
        <button type="button" class="theme-option${selected ? " is-selected" : ""}" data-theme-id="${theme.id}"
          ${unlocked ? "" : "disabled"} aria-pressed="${selected}"
          aria-label="${theme.name} theme${unlocked ? "" : `, locked: ${unlockText(theme)}`}">
          <span class="theme-swatch" data-theme="${theme.id}">${unlocked ? (selected ? icon("check") : "") : icon("lock")}</span>
          <span class="theme-name">${theme.name}</span>
          <small>${selected ? "In use" : unlockText(theme)}</small>
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

// ---------- Switches ----------
function setupSwitch(id, getValue, setValue) {
  const input = document.getElementById(id);
  input.checked = getValue();
  input.addEventListener("change", () => {
    setValue(input.checked);
    save();
  });
}

setupSwitch("sound-switch", () => settings.sound, (on) => {
  settings.sound = on;
  if (on) playSound("correct");
});
setupSwitch("vibration-switch", () => settings.vibration, (on) => {
  settings.vibration = on;
  if (on) vibrate(30);
});
setupSwitch("motion-switch", () => isReducedMotion(), (on) => {
  settings.reduceMotion = on;
  applyAppearance();
});

// Hide the vibration option on devices that can't vibrate
if (!("vibrate" in navigator)) {
  document.getElementById("vibration-note").textContent = "Not supported on this device.";
}

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
  showToast("Your progress has been reset.", icon("check"));
}

setupInstallButton(document.getElementById("install-button"));
