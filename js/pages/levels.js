// Level path page: 40 levels in 4 stages, unlocked one by one.
import { data } from "../core/storage.js";
import { LEVEL_COUNT, getLevel, highestUnlocked, completedLevels } from "../core/levels.js";
import { getCategoryName, LENGTHS } from "../core/words.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";

initPage("levels");

const stars = data.levels.stars;
const unlocked = highestUnlocked(stars);
const path = document.getElementById("level-path");

document.getElementById("levels-progress").textContent =
  `${completedLevels(stars)} of ${LEVEL_COUNT} levels complete`;

let html = "";
for (let start = 1; start <= LEVEL_COUNT; start += 10) {
  const first = getLevel(start);
  const length = LENGTHS.find((item) => item.id === first.length);
  html += `
    <section class="stage">
      <header class="stage-header">
        <h2>${first.stage}</h2>
        <p>Levels ${start}–${start + 9} · ${length.name} words · ${first.lives} lives</p>
      </header>
      <ol class="level-grid">`;

  for (let number = start; number < start + 10; number++) {
    const level = getLevel(number);
    const earned = stars[number] || 0;
    const isLocked = number > unlocked;
    const isCurrent = number === unlocked && !earned;
    const state = isLocked ? "is-locked" : isCurrent ? "is-current" : "is-done";
    const starIcons = [1, 2, 3]
      .map((n) => `<span class="${n <= earned ? "is-earned" : ""}">${icon("star")}</span>`)
      .join("");
    const label = isLocked
      ? `Level ${number}, locked`
      : `Level ${number}, ${getCategoryName(level.category)}, ${earned} of 3 stars`;
    const inner = `
      <span class="level-number">${isLocked ? icon("lock") : number}</span>
      <span class="level-category">${getCategoryName(level.category)}</span>
      <span class="level-stars" aria-hidden="true">${starIcons}</span>`;

    html += isLocked
      ? `<li><span class="level-node ${state}" aria-label="${label}">${inner}</span></li>`
      : `<li><a class="level-node ${state}" href="./play.html?mode=levels&level=${number}" aria-label="${label}">${inner}</a></li>`;
  }
  html += "</ol></section>";
}
path.innerHTML = html;

// Scroll to the current level when the player is further along the path
if (unlocked > 5) {
  path.querySelector(".is-current")?.scrollIntoView({ block: "center" });
}
