// Service worker: saves all game files so Hanglet works offline.
// Change the version number after updating files, so players get the new ones.
const CACHE_NAME = "hanglet-v1";

const FILES = [
  "./",
  "./index.html",
  "./play.html",
  "./levels.html",
  "./stats.html",
  "./settings.html",
  "./how-to-play.html",
  "./about.html",
  "./privacy.html",
  "./404.html",
  "./manifest.webmanifest",
  "./css/base.css",
  "./css/components.css",
  "./css/pages.css",
  "./data/words.js",
  "./js/theme-init.js",
  "./js/core/achievements.js",
  "./js/core/daily.js",
  "./js/core/dates.js",
  "./js/core/levels.js",
  "./js/core/progress.js",
  "./js/core/random.js",
  "./js/core/round.js",
  "./js/core/storage.js",
  "./js/core/themes.js",
  "./js/core/words.js",
  "./js/core/xp.js",
  "./js/ui/appearance.js",
  "./js/ui/confetti.js",
  "./js/ui/feedback.js",
  "./js/ui/hangman.js",
  "./js/ui/icons.js",
  "./js/ui/install.js",
  "./js/ui/keyboard.js",
  "./js/ui/layout.js",
  "./js/ui/toast.js",
  "./js/pages/home.js",
  "./js/pages/levels.js",
  "./js/pages/play.js",
  "./js/pages/settings.js",
  "./js/pages/static.js",
  "./js/pages/stats.js",
  "./assets/favicon.svg",
  "./assets/logo.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png",
];

// Save all files when the service worker is installed
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
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
