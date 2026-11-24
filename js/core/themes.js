// Color themes. Ocean is free, the others are unlocked with stars.
// The colors themselves live in css/base.css ([data-theme="..."]).
// Themes a player unlocked in an older version stay unlocked (data.unlocked).

export const THEMES = [
  { id: "ocean", stars: 0 },
  { id: "lagoon", stars: 10 },
  { id: "forest", stars: 25 },
  { id: "coral", stars: 45 },
  { id: "sunset", stars: 70 },
  { id: "berry", stars: 100 },
  { id: "slate", stars: 140 },
  { id: "gold", stars: 200 },
];

export function isThemeUnlocked(theme, data) {
  return data.player.stars >= theme.stars || data.unlocked.themes.includes(theme.id);
}

export function getUnlockedThemes(data) {
  return THEMES.filter((theme) => isThemeUnlocked(theme, data));
}
