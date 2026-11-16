// Color themes. Ocean is free, the others are unlocked as a reward.
// The colors themselves live in css/base.css ([data-theme="..."]).
import { getLevelInfo } from "./xp.js";

export const THEMES = [
  { id: "ocean", unlock: null },
  { id: "lagoon", unlock: { level: 2 } },
  { id: "forest", unlock: { level: 3 } },
  { id: "coral", unlock: { level: 4 } },
  { id: "sunset", unlock: { level: 5 } },
  { id: "berry", unlock: { level: 8 } },
  { id: "slate", unlock: { level: 12 } },
  { id: "gold", unlock: { achievement: "daily-streak-7" } },
];

export function isThemeUnlocked(theme, data) {
  if (!theme.unlock) return true;
  if (theme.unlock.level) {
    return getLevelInfo(data.player.xp).level >= theme.unlock.level;
  }
  return Boolean(data.achievements[theme.unlock.achievement]);
}

export function getUnlockedThemes(data) {
  return THEMES.filter((theme) => isThemeUnlocked(theme, data));
}
