// The winter season: from 1 December to 6 January Hanglet gets a snowy look,
// the mascot wears a hat and there is an extra "Winter" word list.
// For testing you can add ?season=winter or ?season=off to any page.

const OVERRIDE_KEY = "hanglet-season";

function seasonOverride() {
  if (typeof location === "undefined" || typeof sessionStorage === "undefined") return null;
  try {
    const asked = new URLSearchParams(location.search).get("season");
    if (asked === "winter" || asked === "off") sessionStorage.setItem(OVERRIDE_KEY, asked);
    return sessionStorage.getItem(OVERRIDE_KEY);
  } catch {
    return null;
  }
}

export function isWinterDate(date) {
  const month = date.getMonth();
  return month === 11 || (month === 0 && date.getDate() <= 6);
}

export function isWinterSeason(date = new Date()) {
  const override = seasonOverride();
  if (override) return override === "winter";
  return isWinterDate(date);
}
