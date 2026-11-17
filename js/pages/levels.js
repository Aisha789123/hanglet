// Level map: 40 levels on a winding path, from the bottom (level 1) to the top.
import { data } from "../core/storage.js";
import { t } from "../core/i18n.js";
import { LEVEL_COUNT, getLevel, highestUnlocked, completedLevels } from "../core/levels.js";
import { getCategoryName } from "../core/words.js";
import { seededRandom } from "../core/random.js";
import { initPage } from "../ui/layout.js";
import { icon } from "../ui/icons.js";

initPage("levels");

const STEP = 104; // pixels between two levels
const STAGE_GAP = 64; // extra room between two stages for the stage label
const TOP_SPACE = 130;
const BOTTOM_SPACE = 70;
const stars = data.levels.stars;
const unlocked = highestUnlocked(stars);
const doneCount = completedLevels(stars);
const map = document.getElementById("level-map");
const stageCount = Math.ceil(LEVEL_COUNT / 10);
const mapHeight = TOP_SPACE + BOTTOM_SPACE + (LEVEL_COUNT - 1) * STEP + (stageCount - 1) * STAGE_GAP;

document.getElementById("levels-progress").textContent = t("levels.progress", { done: doneCount, total: LEVEL_COUNT });

// Position of a level: x in percent (a gentle wave), y in pixels from the top
function position(number) {
  const stage = Math.floor((number - 1) / 10);
  return {
    x: 50 + Math.sin((number - 1) * 0.75) * 28,
    y: mapHeight - BOTTOM_SPACE - (number - 1) * STEP - stage * STAGE_GAP,
  };
}

// A smooth path through a list of level numbers
function pathThrough(numbers) {
  return numbers.map((number, i) => {
    const { x, y } = position(number);
    if (i === 0) return `M ${x} ${y}`;
    const previous = position(numbers[i - 1]);
    const middle = (previous.y + y) / 2;
    return `C ${previous.x} ${middle}, ${x} ${middle}, ${x} ${y}`;
  }).join(" ");
}

const allLevels = Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1);
const reached = allLevels.filter((number) => number <= unlocked);

// Four stages, each with its own soft background color
let html = "";
for (let start = 1; start <= LEVEL_COUNT; start += 10) {
  const level = getLevel(start);
  // Each stage band starts with room for its label above the top level
  const isFirst = start === 1;
  const isLast = start + 9 >= LEVEL_COUNT;
  const top = isLast ? 0 : position(start + 9).y - STEP / 2 - STAGE_GAP;
  const bottom = isFirst ? mapHeight : position(start).y + STEP / 2;
  html += `
    <div class="map-stage stage-${level.stage}" style="top:${top}px;height:${bottom - top}px">
      <span class="stage-label">${t(`stages.${level.stage}`)} · ${t("levels.wordsShort", { count: level.wordCount })} · ${t(`lengths.${level.length}`)}</span>
    </div>`;
}

// Small decorations on the sides, always in the same place
const random = seededRandom(42);
for (let i = 0; i < 26; i++) {
  const y = TOP_SPACE + random() * (mapHeight - TOP_SPACE - BOTTOM_SPACE);
  const left = random() < 0.5;
  const x = left ? 3 + random() * 10 : 87 + random() * 10;
  const kind = ["tree", "rock", "spark"][Math.floor(random() * 3)];
  html += `<span class="map-deco deco-${kind}" style="top:${y.toFixed(0)}px;left:${x.toFixed(1)}%" aria-hidden="true"></span>`;
}

// The path: the whole road dashed, the part you reached in color
html += `
  <svg class="map-path" viewBox="0 0 100 ${mapHeight}" preserveAspectRatio="none" aria-hidden="true">
    <path class="road" d="${pathThrough(allLevels)}"/>
    <path class="road-done" d="${pathThrough(reached)}"/>
  </svg>`;

// The level buttons
html += '<ol class="map-levels">';
for (const number of allLevels) {
  const level = getLevel(number);
  const { x, y } = position(number);
  const earned = stars[number] || 0;
  const isLocked = number > unlocked;
  const isCurrent = number === unlocked && !earned;
  const state = isLocked ? "is-locked" : isCurrent ? "is-current" : "is-done";
  const starIcons = [1, 2, 3].map((n) => `<span class="${n <= earned ? "is-earned" : ""}">${icon("star")}</span>`).join("");
  const label = isLocked
    ? t("levels.lockedLabel", { number })
    : t("levels.nodeLabel", { number, category: getCategoryName(level.category), stars: earned });
  const inner = `
    <span class="node-circle">${isLocked ? icon("lock") : number}</span>
    <span class="node-stars" aria-hidden="true">${starIcons}</span>
    ${isCurrent ? `<span class="node-here">${t("levels.play")}</span>` : ""}`;
  const style = `style="left:${x}%;top:${y}px"`;
  html += isLocked
    ? `<li class="map-node ${state}" ${style}><span aria-label="${label}">${inner}</span></li>`
    : `<li class="map-node ${state}" ${style}><a href="./play.html?mode=levels&level=${number}" aria-label="${label}">${inner}</a></li>`;
}
html += "</ol>";

map.style.height = `${mapHeight}px`;
map.innerHTML = html;

// Start with the current level in the middle of the screen
const current = map.querySelector(".is-current, .map-node:nth-child(" + unlocked + ")");
if (current) {
  const box = current.getBoundingClientRect();
  window.scrollTo({ top: window.scrollY + box.top - window.innerHeight / 2, behavior: "instant" });
}
