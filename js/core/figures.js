// The figures a player can choose. The drawings live in js/ui/figures/.

export const FIGURES = [
  { id: "classic", price: 0 },
  { id: "balloon", price: 0 },
  { id: "flower", price: 150 },
  { id: "snowman", achievement: "wins-10" },
  { id: "rocket", price: 300 },
];

export function getFigure(id) {
  return FIGURES.find((figure) => figure.id === id) || FIGURES[0];
}

// Free figures and figures unlocked by a badge are always owned
export function isFigureOwned(figure, data) {
  if (figure.price === 0) return true;
  if (figure.achievement) return Boolean(data.achievements[figure.achievement]);
  return data.figures.includes(figure.id);
}
