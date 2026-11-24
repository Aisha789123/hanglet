// Translations. The texts live in data/i18n/en.json and data/i18n/nl.json.
// Use t("key") for a text and translatePage() for HTML with data-i18n attributes.
import { data } from "./storage.js";

export const LANGUAGES = [
  { id: "en", name: "English" },
  { id: "nl", name: "Nederlands" },
];

// First choice: the saved language. Otherwise the language of the browser.
export function detectLanguage() {
  const browserLanguages = typeof navigator === "undefined" ? [] : navigator.languages || [navigator.language];
  return browserLanguages.some((code) => String(code).toLowerCase().startsWith("nl")) ? "nl" : "en";
}

export const language = LANGUAGES.some((l) => l.id === data.settings.language)
  ? data.settings.language
  : detectLanguage();

// Load a JSON file as a module, or with fetch for older browsers
async function loadStrings(lang) {
  const url = new URL(`../../data/i18n/${lang}.json`, import.meta.url);
  try {
    const module = await import(url.href, { with: { type: "json" } });
    return module.default;
  } catch {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch {
      return {};
    }
  }
}

const strings = await loadStrings(language);
const fallback = language === "en" ? strings : await loadStrings("en");

function lookup(source, key) {
  return key.split(".").reduce((value, part) => (value == null ? undefined : value[part]), source);
}

// t("play.knowIt") → "I know it!", t("play.clue", { number: 2 }) → "Clue 2"
export function t(key, params = {}) {
  let text = lookup(strings, key) ?? lookup(fallback, key) ?? key;
  if (typeof text !== "string") return key;
  for (const [name, value] of Object.entries(params)) {
    text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}

// Plural: uses "key.one" for 1 and "key.other" for everything else
export function tn(key, count, params = {}) {
  return t(`${key}.${count === 1 ? "one" : "other"}`, { count, ...params });
}

// Fill in all elements with data-i18n="key" (text) and
// data-i18n-attr="aria-label:key; placeholder:key" (attributes)
export function translatePage(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    for (const pair of element.dataset.i18nAttr.split(";")) {
      const [attribute, key] = pair.split(":").map((part) => part.trim());
      if (attribute && key) element.setAttribute(attribute, t(key));
    }
  });
}

// Short date in the chosen language, e.g. "17 Nov 2026"
export function formatDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(language, { day: "numeric", month: "short", year: "numeric" });
}

if (typeof document !== "undefined") {
  document.documentElement.lang = language;
}
