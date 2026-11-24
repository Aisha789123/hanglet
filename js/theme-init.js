// Runs before the page is drawn, so the right colors, text size and language
// show without a flash. This is a normal script (not a module), because modules run later.
(function () {
  var data = {};
  try {
    data = JSON.parse(localStorage.getItem("hanglet-data-v1")) || {};
  } catch (error) {
    data = {};
  }
  var settings = data.settings || {};
  var root = document.documentElement;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mode = settings.colorMode || "system";
  var reduceMotion = settings.reduceMotion === null || settings.reduceMotion === undefined
    ? prefersLessMotion
    : settings.reduceMotion;

  // Same rule as js/core/i18n.js: saved language, else the browser language
  var language = settings.language;
  if (language !== "en" && language !== "nl") {
    var browser = (navigator.languages || [navigator.language]).join(",").toLowerCase();
    language = /(^|,)nl/.test(browser) ? "nl" : "en";
  }

  root.lang = language;

  // The installed app gets its name and shortcuts in the chosen language
  var manifest = document.querySelector('link[rel="manifest"]');
  if (manifest && language === "nl") manifest.href = "manifest-nl.webmanifest";
  root.dataset.color = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
  root.dataset.theme = settings.theme || "ocean";
  root.dataset.motion = reduceMotion ? "reduce" : "full";
  root.dataset.text = settings.textSize || "normal";
  root.dataset.contrast = settings.contrast || "normal";

  // Winter season: 1 December - 6 January (?season=winter or ?season=off to test)
  var season = null;
  try {
    var asked = new URLSearchParams(location.search).get("season");
    if (asked === "winter" || asked === "off") sessionStorage.setItem("hanglet-season", asked);
    season = sessionStorage.getItem("hanglet-season");
  } catch (error) {
    season = null;
  }
  var now = new Date();
  var isWinter = season ? season === "winter" : now.getMonth() === 11 || (now.getMonth() === 0 && now.getDate() <= 6);
  if (isWinter) root.dataset.season = "winter";

  // Hide English texts until the Dutch texts are filled in (max 1.5 seconds)
  if (language !== "en") {
    root.dataset.translating = "true";
    setTimeout(function () {
      delete root.dataset.translating;
    }, 1500);
  }
})();
