// The figures a player can choose. The drawings live in js/ui/figures/.
// Classic and balloon are free, the others are unlocked with stars.
// Figures a player had in an older version stay unlocked (data.unlocked).

export const FIGURES = [
  { id: "classic", stars: 0 },
  { id: "balloon", stars: 0 },
  { id: "flower", stars: 25 },
  { id: "snowman", stars: 60 },
  { id: "rocket", stars: 120 },
];

export function getFigure(id) {
  return FIGURES.find((figure) => figure.id === id) || FIGURES[0];
}

export function isFigureOwned(figure, data) {
  return data.player.stars >= figure.stars || data.unlocked.figures.includes(figure.id);
}
