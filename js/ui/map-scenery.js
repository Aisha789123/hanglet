// The landscape of the level map. Every world (stage) has its own scenery:
//   warmup: green meadow with round trees, bushes, flowers and a pond
//   climb:  forest with pine trees, mushrooms and a river
//   expert: desert with cacti, rocks and red mesas
//   summit: snowy mountains with snow pines
// Small things (trees, rocks...) stand next to the road, the big shapes
// (hills, mountains, river) are drawn behind everything.
import { seededRandom } from "../core/random.js";

// Small drawings. viewBox is 0 0 60 60 and the item stands on the bottom edge.
const SPRITES = {
  tree: '<rect x="27" y="36" width="6" height="22" rx="2" fill="#8a5a3c"/><circle cx="30" cy="26" r="16" fill="#3bb273"/><circle cx="20" cy="33" r="10" fill="#2f9e63"/><circle cx="40" cy="33" r="10" fill="#2f9e63"/><circle cx="25" cy="20" r="4" fill="#5fd08f"/>',
  bush: '<ellipse cx="30" cy="50" rx="24" ry="10" fill="#2f9e63"/><circle cx="20" cy="46" r="10" fill="#3bb273"/><circle cx="34" cy="42" r="12" fill="#3bb273"/><circle cx="24" cy="44" r="2" fill="#ff6b8a"/><circle cx="38" cy="38" r="2" fill="#ff6b8a"/>',
  flowers: '<path d="M14 58v-14M30 58v-20M46 58v-12" stroke="#2f9e63" stroke-width="3" stroke-linecap="round"/><circle cx="14" cy="42" r="5" fill="#ff6b8a"/><circle cx="30" cy="36" r="6" fill="#ffc531"/><circle cx="46" cy="44" r="5" fill="#a77bf3"/><circle cx="14" cy="42" r="2" fill="#fff3b0"/><circle cx="30" cy="36" r="2.4" fill="#fff"/><circle cx="46" cy="44" r="2" fill="#fff3b0"/>',
  pond: '<ellipse cx="30" cy="50" rx="28" ry="9" fill="#5bb8f5"/><ellipse cx="24" cy="48" rx="10" ry="3" fill="#a5dbff"/><circle cx="42" cy="50" r="3" fill="#3bb273"/>',
  pine: '<rect x="27" y="48" width="6" height="10" fill="#7a4f2e"/><path d="M30 4L12 30h8L8 50h44L40 30h8z" fill="#1f8a5b"/><path d="M30 4l-6 9 6-2 6 2z" fill="#2fae66"/>',
  mushroom: '<rect x="25" y="40" width="10" height="18" rx="4" fill="#fff4e0"/><path d="M8 42c0-16 10-24 22-24s22 8 22 24z" fill="#ef4f6b"/><circle cx="20" cy="32" r="3.5" fill="#fff"/><circle cx="34" cy="26" r="3" fill="#fff"/><circle cx="42" cy="36" r="2.5" fill="#fff"/>',
  rock: '<path d="M6 58l8-18 14-8 16 6 10 20z" fill="#9aa7b8"/><path d="M14 40l14-8 6 10-12 6z" fill="#b8c3d2"/>',
  cactus: '<path d="M26 58V16a4 4 0 0 1 8 0v42z" fill="#2fae66"/><path d="M26 38h-8a4 4 0 0 1-4-4V24a3 3 0 0 1 6 0v8h6M34 32h8V20a3 3 0 0 1 6 0v12a4 4 0 0 1-4 4h-10" fill="#2fae66"/><circle cx="30" cy="12" r="3" fill="#ff6b8a"/>',
  dune: '<path d="M0 58c10-14 22-20 34-18 12 2 20 10 26 18z" fill="#f2c27a"/><path d="M20 46c6-3 12-4 18-2" stroke="#e0a95c" stroke-width="2" fill="none" stroke-linecap="round"/>',
  redrock: '<path d="M6 58V30l10-6h28l10 8v26z" fill="#d9774f"/><path d="M6 38h48M10 48h40" stroke="#c4603b" stroke-width="2"/>',
  snowpine: '<rect x="27" y="48" width="6" height="10" fill="#7a4f2e"/><path d="M30 4L12 30h8L8 50h44L40 30h8z" fill="#2a7a63"/><path d="M30 4l-9 13 9-3 9 3zM18 30l12-3 12 3-4-6h-16zM10 50l20-4 20 4-6-8H16z" fill="#ffffff"/>',
  snowrock: '<path d="M6 58l8-18 14-8 16 6 10 20z" fill="#8e9db3"/><path d="M14 40l14-8 16 6-6 4-10-3-8 4z" fill="#ffffff"/>',
  snowman: '<circle cx="30" cy="46" r="12" fill="#ffffff" stroke="#cfe0f2" stroke-width="2"/><circle cx="30" cy="26" r="9" fill="#ffffff" stroke="#cfe0f2" stroke-width="2"/><path d="M30 26l9 2-9 2z" fill="#ff9f1c"/><circle cx="27" cy="23" r="1.4" fill="#26243a"/><circle cx="33" cy="23" r="1.4" fill="#26243a"/><path d="M22 33h16" stroke="#ef4f6b" stroke-width="3" stroke-linecap="round"/>',
};

// Which small things grow in which world
const STAGE_SPRITES = {
  warmup: ["tree", "bush", "flowers", "tree", "flowers", "pond"],
  climb: ["pine", "pine", "mushroom", "bush", "rock", "pine"],
  expert: ["cactus", "rock", "dune", "cactus", "redrock"],
  summit: ["snowpine", "snowrock", "snowpine", "snowman"],
};

// Big shapes behind a world. Width 400, height 200; stretched to the width of the map.
const BACKDROPS = {
  warmup: '<path d="M0 200V120c60-40 120-40 180-10s130 20 220-30v120z" fill="var(--map-hill-2)"/><path d="M0 200v-40c80-30 150-10 220 10s120 0 180-20v50z" fill="var(--map-hill-1)"/>',
  climb: '<path d="M0 200V90c50-30 110-20 160 10s150 0 240-40v140z" fill="var(--map-hill-2)"/><path d="M-10 200c40-40 90-40 120-80s100-40 140-70 100-30 160-40" fill="none" stroke="var(--map-water)" stroke-width="22" stroke-linecap="round"/><path d="M0 200v-30c90-20 200 10 400-20v50z" fill="var(--map-hill-1)"/>',
  expert: '<path d="M0 200V110h50l14-30h60l12 30h40v-50h70l16 40h60l20-20h58v120z" fill="var(--map-hill-2)"/><path d="M0 200v-40c100-24 220 10 400-20v60z" fill="var(--map-hill-1)"/>',
  summit: '<path d="M0 200V100L60 30l40 40 50-60 70 80 50-50 60 60 70-50v150z" fill="var(--map-hill-2)"/><path d="M60 30l-14 16 10 4 8-8 10 10 8-6zM150 10l-18 22 12 2 8-8 12 10 6-12zM270 50l-14 14 10 2 6-6 10 8 4-6z" fill="#ffffff"/><path d="M0 200v-40c100-20 250 10 400-20v60z" fill="var(--map-hill-1)"/>',
};

const CLOUD = '<svg class="map-cloud" viewBox="0 0 100 50" aria-hidden="true"><path d="M20 44a14 14 0 0 1 2-28 18 18 0 0 1 34-6 14 14 0 0 1 24 10 12 12 0 0 1 0 24z" fill="#ffffff"/></svg>';

export function sprite(kind) {
  return `<svg class="map-sprite" viewBox="0 0 60 60" aria-hidden="true">${SPRITES[kind]}</svg>`;
}

// The backdrop of one world, drawn at the bottom of its band
export function stageBackdrop(stage) {
  return `<svg class="map-backdrop" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">${BACKDROPS[stage]}</svg>`;
}

// Small things on both sides of the road. "top" and "bottom" are the pixel
// edges of the world band. Always the same places (seeded), so the map
// does not jump around.
export function stageScenery(stage, top, bottom, seed) {
  const random = seededRandom(seed);
  const kinds = STAGE_SPRITES[stage];
  const count = Math.round((bottom - top) / 90);
  let html = "";
  for (let i = 0; i < count; i++) {
    const y = top + 70 + ((bottom - top - 90) * (i + random() * 0.6)) / count;
    const left = i % 2 === 0;
    const x = left ? 4 + random() * 11 : 85 + random() * 11;
    const size = 34 + Math.round(random() * 22);
    const kind = kinds[Math.floor(random() * kinds.length)];
    html += `<span class="map-deco" style="top:${y.toFixed(0)}px;left:${x.toFixed(1)}%;--size:${size}px">${sprite(kind)}</span>`;
  }
  // Two clouds per world, drifting slowly
  for (let i = 0; i < 2; i++) {
    const y = top + 40 + random() * (bottom - top - 160);
    const x = 10 + random() * 70;
    html += `<span class="map-cloud-wrap" style="top:${y.toFixed(0)}px;left:${x.toFixed(1)}%;--drift:${(16 + random() * 10).toFixed(0)}s">${CLOUD}</span>`;
  }
  return html;
}
