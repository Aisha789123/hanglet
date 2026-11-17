// The daily treasure chest: open it once per day for coins,
// and sometimes a free hint.
import { data, save } from "./storage.js";
import { toDateKey } from "./dates.js";

export const HINT_CHANCE = 0.3;

export function canOpenChest(dateKey = toDateKey()) {
  return data.chest.lastOpened !== dateKey;
}

// random() is a parameter so the tests can use a fixed number
export function openChest(random = Math.random, dateKey = toDateKey()) {
  if (!canOpenChest(dateKey)) return null;
  const coins = 20 + Math.floor(random() * 5) * 10; // 20, 30, 40, 50 or 60
  const hint = random() < HINT_CHANCE;
  data.chest.lastOpened = dateKey;
  data.player.coins += coins;
  if (hint) data.player.hintTokens += 1;
  save();
  return { coins, hint };
}
