// Color themes. Ocean is free, the others are unlocked as a reward.
// The colors themselves live in css/base.css ([data-theme="..."]).
import { getLevelInfo } from "./xp.js";

export const THEMES = [
  { id: "ocean", name: "Ocean", unlock: null },
  { id: "forest", name: "Forest", unlock: { level: 3 } },
  { id: "sunset", name: "Sunset", unlock: { level: 5 } },
  { id: "berry", name: "Berry", unlock: { level: 8 } },
  { id: "slate", name: "Slate", unlock: { level: 12 } },
  { id: "gold", name: "Gold", unlock: { achievement: "daily-streak-7" } },
];

export function isThemeUnlocked(theme, data) {
  if (!theme.unlock) return true;
  if (theme.unlock.level) {
    return getLevelInfo(data.player.xp).level >= theme.unlock.level;
  }
  return Boolean(data.achievements[theme.unlock.achievement]);
}

export function unlockText(theme) {
  if (!theme.unlock) return "Unlocked";
  if (theme.unlock.level) return `Reach level ${theme.unlock.level}`;
  return "Get a 7-day Daily streak";
}

export function getUnlockedThemes(data) {
  return THEMES.filter((theme) => isThemeUnlocked(theme, data));
}
