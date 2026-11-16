// Runs before the page is drawn, so the right colors show without a flash.
// This is a normal script (not a module), because modules run later.
(function () {
  var settings = {};
  try {
    var saved = JSON.parse(localStorage.getItem("hanglet-data-v1"));
    settings = (saved && saved.settings) || {};
  } catch (error) {
    settings = {};
  }
  var root = document.documentElement;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mode = settings.colorMode || "system";
  var reduceMotion = settings.reduceMotion === null || settings.reduceMotion === undefined
    ? prefersLessMotion
    : settings.reduceMotion;

  root.dataset.color = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
  root.dataset.theme = settings.theme || "ocean";
  root.dataset.motion = reduceMotion ? "reduce" : "full";
})();
