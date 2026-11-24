// Service worker: saves all game files so Hanglet works offline.
// Change the version number after updating files, so players get the new ones.
// A new version waits until the player taps "Refresh" (see js/ui/layout.js).
const CACHE_NAME = "hanglet-v6";

const FILES = [
  "./",
  "./404.html",
  "./about.html",
  "./badges.html",
  "./challenge.html",
  "./dictionary.html",
  "./how-to-play.html",
  "./index.html",
  "./kids.html",
  "./levels.html",
  "./manifest-nl.webmanifest",
  "./manifest.webmanifest",
  "./play.html",
  "./privacy.html",
  "./settings.html",
  "./stats.html",
  "./assets/apple-touch-icon.png",
  "./assets/favicon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/logo.svg",
  "./css/base.css",
  "./css/components.css",
  "./css/figures.css",
  "./css/game.css",
  "./css/pages.css",
  "./data/i18n/en.json",
  "./data/i18n/nl.json",
  "./data/kids.js",
  "./data/words/en.js",
  "./data/words/nl.js",
  "./js/analytics.js",
  "./js/core/achievements.js",
  "./js/core/challenge.js",
  "./js/core/daily.js",
  "./js/core/dates.js",
  "./js/core/difficulty.js",
  "./js/core/figures.js",
  "./js/core/i18n.js",
  "./js/core/kids.js",
  "./js/core/levels.js",
  "./js/core/progress.js",
  "./js/core/random.js",
  "./js/core/round.js",
  "./js/core/season.js",
  "./js/core/storage.js",
  "./js/core/themes.js",
  "./js/core/words.js",
  "./js/pages/badges.js",
  "./js/pages/challenge.js",
  "./js/pages/dictionary.js",
  "./js/pages/home.js",
  "./js/pages/kids.js",
  "./js/pages/levels.js",
  "./js/pages/play.js",
  "./js/pages/settings.js",
  "./js/pages/static.js",
  "./js/pages/stats.js",
  "./js/theme-init.js",
  "./js/ui/appearance.js",
  "./js/ui/celebrations.js",
  "./js/ui/confetti.js",
  "./js/ui/countdown.js",
  "./js/ui/effects.js",
  "./js/ui/feedback.js",
  "./js/ui/figures/balloon.js",
  "./js/ui/figures/classic.js",
  "./js/ui/figures/flower.js",
  "./js/ui/figures/index.js",
  "./js/ui/figures/rocket.js",
  "./js/ui/figures/snowman.js",
  "./js/ui/figures/steps.js",
  "./js/ui/icons.js",
  "./js/ui/illustrations.js",
  "./js/ui/install.js",
  "./js/ui/keyboard.js",
  "./js/ui/layout.js",
  "./js/ui/map-scenery.js",
  "./js/ui/mascot.js",
  "./js/ui/music.js",
  "./js/ui/pictures.js",
  "./js/ui/share.js",
  "./js/ui/toast.js",
  "./js/ui/tutorial.js",
  "./js/ui/welcome.js",
];

// Save all files when the service worker is installed
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
});

// The player tapped "Refresh": the new version takes over
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

// Remove caches of older versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// Answer from the cache first, and update the cache in the background.
// "ignoreSearch" makes play.html?mode=daily use the saved play.html.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== location.origin && !isFont) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request, { ignoreSearch: url.origin === location.origin });
      const network = fetch(request)
        .then((response) => {
          if (response.ok || response.type === "opaque") {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => null);

      if (cached) return cached;
      const response = await network;
      if (response) return response;
      // Offline and not saved: show the home page for page visits
      if (request.mode === "navigate") return cache.match("./index.html");
      return Response.error();
    })
  );
});
