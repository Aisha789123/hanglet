// A short confetti burst on a canvas, used on the win screen.
import { isReducedMotion } from "./appearance.js";

export function launchConfetti() {
  if (isReducedMotion()) return;

  const canvas = document.createElement("canvas");
  canvas.className = "confetti";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  context.scale(scale, scale);

  // Use the colors of the current theme
  const styles = getComputedStyle(document.documentElement);
  const colors = ["--accent", "--success", "--coin", "--danger"].map((name) =>
    styles.getPropertyValue(name).trim()
  );

  // Pieces start at the top center and fly out
  const pieces = Array.from({ length: 140 }, () => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
    y: window.innerHeight * 0.3,
    speedX: (Math.random() - 0.5) * 14,
    speedY: -Math.random() * 12 - 4,
    size: Math.random() * 6 + 5,
    angle: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  const startTime = performance.now();
  const duration = 2600;

  function draw(now) {
    const progress = (now - startTime) / duration;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.globalAlpha = Math.max(0, 1 - progress * progress);

    for (const piece of pieces) {
      piece.speedY += 0.35; // gravity
      piece.speedX *= 0.99; // air resistance
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.angle += piece.spin;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
      context.restore();
    }

    if (progress < 1) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(draw);
}
