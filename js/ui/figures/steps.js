// Every figure has 10 steps. With fewer lives, one miss takes more steps,
// so the figure is always "finished" on the last miss.
export const STEPS = 10;

export function stepsFor(misses, lives) {
  if (misses >= lives) return STEPS;
  return Math.ceil((misses * STEPS) / lives);
}
