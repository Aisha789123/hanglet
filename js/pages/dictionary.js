// "My dictionary": every word the player has solved, with its description.
import { data } from "../core/storage.js";
import { formatDate, language, t, tn } from "../core/i18n.js";
import { ALL_WORDS, CATEGORY_IDS, KIDS_WORDS, findWord, getCategoryName } from "../core/words.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";
import { pictureSvg } from "../ui/pictures.js";

initPage("dictionary");

const entries = Object.entries(data.dictionary[language] || {}).map(([word, entry]) => ({
  word,
  ...entry,
  description: findWord(word)?.description || "",
}));
const totalWords = new Set([...ALL_WORDS, ...KIDS_WORDS].map((item) => item.word)).size;

const listEl = document.getElementById("word-list");
const searchEl = document.getElementById("word-search");
const filterEl = document.getElementById("category-filter");
const countEl = document.getElementById("dictionary-count");

// Collected words out of all words in this language
const percent = Math.round((entries.length / totalWords) * 100);
countEl.innerHTML = `
  <strong>${t("dictionary.collected", { count: entries.length, total: totalWords })}</strong>
  <div class="progress" role="progressbar" aria-label="${t("dictionary.progressLabel")}" aria-valuemin="0" aria-valuemax="${totalWords}" aria-valuenow="${entries.length}"><span style="width:${percent}%"></span></div>`;

// Category filter: only categories that have words
const usedCategories = ["all", ...CATEGORY_IDS, "winter", "things"].filter(
  (id) => id === "all" || entries.some((entry) => entry.category === id)
);
filterEl.innerHTML = usedCategories.map((id, index) => `
  <label class="segment segment-small" data-category="${id}">
    <input type="radio" name="category" value="${id}"${index === 0 ? " checked" : ""}>
    <span>${id === "all" ? t("dictionary.all") : getCategoryName(id)}</span>
  </label>`).join("");

function render() {
  const search = searchEl.value.trim().toLowerCase();
  const category = filterEl.querySelector("input:checked")?.value || "all";
  const shown = entries
    .filter((entry) => category === "all" || entry.category === category)
    .filter((entry) => entry.word.includes(search) || entry.description.toLowerCase().includes(search))
    .sort((a, b) => a.word.localeCompare(b.word));

  if (entries.length === 0) {
    listEl.innerHTML = `<li class="empty-state">${icon("book")}<p>${t("dictionary.empty")}</p><a class="button button-primary" href="./play.html?mode=daily">${t("dictionary.startPlaying")}</a></li>`;
    return;
  }
  if (shown.length === 0) {
    listEl.innerHTML = `<li class="empty-state"><p>${t("dictionary.noResults")}</p></li>`;
    return;
  }
  listEl.innerHTML = shown.map((entry) => `
    <li class="word-card" data-category="${entry.category}">
      ${entry.picture ? `<span class="word-picture">${pictureSvg(entry.picture)}</span>` : ""}
      <div class="word-card-body">
        <div class="word-card-top">
          <h2 class="word-card-word">${entry.word}</h2>
          <span class="chip chip-category" data-category="${entry.category}">${getCategoryName(entry.category)}</span>
        </div>
        <p class="word-card-description">${entry.description}</p>
        <p class="word-card-meta">${tn("dictionary.solvedTimes", entry.count)} · ${t("dictionary.since", { date: formatDate(entry.first) })}</p>
      </div>
    </li>`).join("");
}

searchEl.addEventListener("input", render);
filterEl.addEventListener("change", render);
render();
