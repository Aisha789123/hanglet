// The shared parts of every page: header, mobile tab bar, footer,
// translations, the welcome dialog and the service worker.
import { data, save } from "../core/storage.js";
import { currentDailyStreak } from "../core/progress.js";
import { LANGUAGES, language, t, translatePage } from "../core/i18n.js";
import { icon, logoMark, logoWordmark } from "./icons.js";
import { applyAppearance, watchSystemChanges } from "./appearance.js";
import { showWelcome } from "./welcome.js";
import { startAnalytics } from "../analytics.js";

const NAV_ITEMS = [
  { id: "home", label: "nav.play", href: "./index.html", icon: "home" },
  { id: "levels", label: "nav.levels", href: "./levels.html", icon: "path" },
  { id: "dictionary", label: "nav.words", href: "./dictionary.html", icon: "book" },
  { id: "badges", label: "nav.badges", href: "./badges.html", icon: "trophy" },
  { id: "stats", label: "nav.stats", href: "./stats.html", icon: "chart" },
];

function navLinks(activePage, withIcons) {
  return NAV_ITEMS.map((item) => {
    const current = item.id === activePage ? ' aria-current="page"' : "";
    const iconHtml = withIcons ? icon(item.icon) : "";
    return `<a href="${item.href}"${current}>${iconHtml}<span>${t(item.label)}</span></a>`;
  }).join("");
}

function headerHtml(activePage) {
  return `
    <a class="skip-link" href="#main">${t("nav.skip")}</a>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="./index.html" aria-label="${t("nav.homeLabel")}">
          ${logoWordmark()}
        </a>
        <nav class="main-nav" aria-label="${t("nav.main")}">${navLinks(activePage, false)}</nav>
        <div class="header-stats">
          <a class="pill pill-streak" href="./stats.html" id="header-streak"></a>
          <span class="pill pill-coins" id="header-coins"></span>
          <a class="icon-button header-settings" href="./settings.html" aria-label="${t("nav.settings")}"${activePage === "settings" ? ' aria-current="page"' : ""}>${icon("sliders")}</a>
        </div>
      </div>
    </header>`;
}

function footerHtml(activePage) {
  const year = new Date().getFullYear();
  const languageButtons = LANGUAGES.map((item) =>
    `<button type="button" data-language="${item.id}" lang="${item.id}" aria-pressed="${item.id === language}">${item.name}</button>`
  ).join("");
  return `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          ${logoMark("logo-mark logo-mark-small")}
          <div>
            <strong>Hanglet</strong>
            <p>${t("footer.tagline")}</p>
          </div>
        </div>
        <nav class="footer-links" aria-label="${t("nav.footer")}">
          <a href="./how-to-play.html">${t("nav.howToPlay")}</a>
          <a href="./about.html">${t("nav.about")}</a>
          <a href="./privacy.html">${t("nav.privacy")}</a>
        </nav>
        <div class="language-switch" role="group" aria-label="${t("settings.language")}">${icon("globe")}${languageButtons}</div>
        <p class="footer-note">&copy; ${year} Hanglet. ${t("footer.note")}</p>
      </div>
    </footer>
    <nav class="tab-bar" aria-label="${t("nav.app")}">${navLinks(activePage, true)}</nav>`;
}

// Change the language and reload the page in that language
export function setLanguage(id) {
  data.settings.language = id;
  save();
  location.reload();
}

// Update the streak and coin counters in the header
export function refreshHeader() {
  const streak = currentDailyStreak();
  const coins = data.player.coins;
  const streakLink = document.getElementById("header-streak");
  const coinsPill = document.getElementById("header-coins");
  if (streakLink) {
    streakLink.innerHTML = `${icon("flame")}<span>${streak}</span>`;
    streakLink.setAttribute("aria-label", t("header.streak", { count: streak }));
    streakLink.classList.toggle("is-active", streak > 0);
  }
  if (coinsPill) {
    coinsPill.innerHTML = `${icon("coin")}<span>${coins}</span>`;
    coinsPill.setAttribute("aria-label", t("header.coins", { count: coins }));
  }
}

// Title and description in the chosen language (search engines that run
// JavaScript and the browser tab both use these)
function applySeoTexts() {
  const page = location.pathname.split("/").pop().replace(".html", "") || "index";
  const title = t(`seo.${page}.title`);
  const description = t(`seo.${page}.description`);
  if (title.startsWith("seo.")) return;
  if (page !== "play") document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
}

// Call this once on every page
export function initPage(activePage) {
  applyAppearance();
  watchSystemChanges();

  document.body.insertAdjacentHTML("afterbegin", headerHtml(activePage));
  document.body.insertAdjacentHTML("beforeend", footerHtml(activePage));
  translatePage();
  applySeoTexts();
  delete document.documentElement.dataset.translating;

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.language !== language) setLanguage(button.dataset.language);
    });
  });

  refreshHeader();
  registerServiceWorker();
  startAnalytics();

  if (!data.welcomeDone) {
    showWelcome();
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // Offline support is optional, the game works without it
      });
    });
  }
}
