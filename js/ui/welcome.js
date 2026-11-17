// Welcome dialog on the very first visit: pick a language, who is playing
// and if the text should be larger.
import { data, save } from "../core/storage.js";
import { LANGUAGES, language, t } from "../core/i18n.js";
import { icon, logoMark } from "./icons.js";

export function showWelcome() {
  const dialog = document.createElement("dialog");
  dialog.className = "dialog welcome";
  dialog.setAttribute("aria-labelledby", "welcome-title");

  const languageOptions = LANGUAGES.map((item) => `
    <label class="choice">
      <input type="radio" name="language" value="${item.id}"${item.id === language ? " checked" : ""}>
      <span lang="${item.id}">${icon("globe")}${item.name}</span>
    </label>`).join("");

  dialog.innerHTML = `
    <form method="dialog" class="welcome-form">
      ${logoMark("logo-mark welcome-logo")}
      <h2 id="welcome-title">${t("welcome.title")}</h2>
      <p>${t("welcome.text")}</p>

      <fieldset class="option-group">
        <legend>${t("welcome.language")}</legend>
        <div class="choices">${languageOptions}</div>
      </fieldset>

      <fieldset class="option-group">
        <legend>${t("welcome.who")}</legend>
        <div class="choices">
          <label class="choice"><input type="radio" name="audience" value="all" checked><span>${icon("smile")}${t("welcome.everyone")}</span></label>
          <label class="choice"><input type="radio" name="audience" value="kids"><span>${icon("school")}${t("welcome.kids")}</span></label>
        </div>
      </fieldset>

      <label class="setting-row welcome-text-size">
        ${icon("text")}
        <span class="setting-text"><strong>${t("settings.largeText")}</strong><span>${t("settings.largeTextHelp")}</span></span>
        <input class="switch" type="checkbox" role="switch" name="large-text">
      </label>

      <button class="button button-primary button-large" type="submit">${icon("play")}<span>${t("welcome.start")}</span></button>
    </form>`;

  document.body.appendChild(dialog);

  dialog.querySelector("form").addEventListener("submit", () => {
    const form = new FormData(dialog.querySelector("form"));
    data.settings.language = form.get("language");
    data.settings.kidsFirst = form.get("audience") === "kids";
    data.settings.textSize = form.get("large-text") ? "large" : "normal";
    data.welcomeDone = true;
    save();
    // Kids go straight to their own world. Everyone else reloads, so every
    // text uses the chosen language and settings.
    if (data.settings.kidsFirst && !location.pathname.endsWith("kids.html")) {
      location.href = "./kids.html";
    } else {
      location.reload();
    }
  });

  // The choice is needed, so Escape does not close it
  dialog.addEventListener("cancel", (event) => event.preventDefault());
  dialog.showModal();
}
