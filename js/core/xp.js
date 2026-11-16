// Player level based on XP. Every level needs 50 XP more than the one before.

export function xpForNextLevel(level) {
  return 100 + (level - 1) * 50;
}

// For example 260 XP gives { level: 3, current: 10, needed: 200 }
export function getLevelInfo(xp) {
  let level = 1;
  let rest = xp;
  while (rest >= xpForNextLevel(level)) {
    rest -= xpForNextLevel(level);
    level++;
  }
  return { level, current: rest, needed: xpForNextLevel(level) };
}
