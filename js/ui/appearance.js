// Applies color mode, theme, text size, contrast and motion settings to the page.
import { data } from "../core/storage.js";

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

export function applyAppearance() {
  const root = document.documentElement;
  const { colorMode, theme, textSize, contrast } = data.settings;
  const isDark = colorMode === "system" ? darkQuery.matches : colorMode === "dark";
  root.dataset.color = isDark ? "dark" : "light";
  root.dataset.theme = theme;
  root.dataset.text = textSize;
  root.dataset.contrast = contrast;
  root.dataset.motion = isReducedMotion() ? "reduce" : "full";

  // Match the browser bar color with the page background
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.content = getComputedStyle(root).getPropertyValue("--bg").trim() || "#f6f7f9";
  }
}

export function isReducedMotion() {
  const setting = data.settings.reduceMotion;
  return setting === null ? motionQuery.matches : setting;
}

// Follow the device when it switches between light and dark
export function watchSystemChanges() {
  darkQuery.addEventListener("change", applyAppearance);
  motionQuery.addEventListener("change", applyAppearance);
}
