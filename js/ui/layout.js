// The shared parts of every page: header, mobile tab bar and footer.
import { data } from "../core/storage.js";
import { currentDailyStreak } from "../core/progress.js";
import { icon, logoMark } from "./icons.js";
import { applyAppearance, watchSystemChanges } from "./appearance.js";

const NAV_ITEMS = [
  { id: "home", label: "Play", href: "./index.html", icon: "home" },
  { id: "levels", label: "Levels", href: "./levels.html", icon: "path" },
  { id: "stats", label: "Stats", href: "./stats.html", icon: "chart" },
  { id: "settings", label: "Settings", href: "./settings.html", icon: "sliders" },
];

function navLinks(activePage, withIcons) {
  return NAV_ITEMS.map((item) => {
    const current = item.id === activePage ? ' aria-current="page"' : "";
    const iconHtml = withIcons ? icon(item.icon) : "";
    return `<a href="${item.href}"${current}>${iconHtml}<span>${item.label}</span></a>`;
  }).join("");
}

function headerHtml(activePage) {
  return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="./index.html" aria-label="Hanglet, home">
          ${logoMark()}<span class="brand-name">Hanglet</span>
        </a>
        <nav class="main-nav" aria-label="Main">${navLinks(activePage, false)}</nav>
        <div class="header-stats">
          <a class="pill pill-streak" href="./stats.html" id="header-streak"></a>
          <span class="pill pill-coins" id="header-coins"></span>
        </div>
      </div>
    </header>`;
}

function footerHtml() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          ${logoMark("logo-mark logo-mark-small")}
          <div>
            <strong>Hanglet</strong>
            <p>A calm word game. One letter at a time.</p>
          </div>
        </div>
        <nav class="footer-links" aria-label="Footer">
          <a href="./how-to-play.html">How to play</a>
          <a href="./about.html">About</a>
          <a href="./privacy.html">Privacy</a>
        </nav>
        <p class="footer-note">&copy; ${year} Hanglet. Your progress stays on this device.</p>
      </div>
    </footer>
    <nav class="tab-bar" aria-label="App">${navLinks(null, true)}</nav>`;
}

// Update the streak and coin counters in the header
export function refreshHeader() {
  const streak = currentDailyStreak();
  const coins = data.player.coins;
  const streakLink = document.getElementById("header-streak");
  const coinsPill = document.getElementById("header-coins");
  if (streakLink) {
    streakLink.innerHTML = `${icon("flame")}<span>${streak}</span>`;
    streakLink.setAttribute("aria-label", `Daily streak: ${streak} days. Open stats`);
    streakLink.classList.toggle("is-active", streak > 0);
  }
  if (coinsPill) {
    coinsPill.innerHTML = `${icon("coin")}<span>${coins}</span>`;
    coinsPill.setAttribute("aria-label", `${coins} coins`);
  }
}

// Call this once on every page
export function initPage(activePage) {
  applyAppearance();
  watchSystemChanges();

  document.body.insertAdjacentHTML("afterbegin", headerHtml(activePage));
  document.body.insertAdjacentHTML("beforeend", footerHtml());

  // Mark the active tab in the mobile tab bar
  const tab = document.querySelector(`.tab-bar a[href="${NAV_ITEMS.find((i) => i.id === activePage)?.href}"]`);
  if (tab) tab.setAttribute("aria-current", "page");

  refreshHeader();
  registerServiceWorker();
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
