// Sharing a result: a picture (made on a canvas) plus a short text, without spoilers.
// Phones get the normal share menu; other devices get a small share window.
import { t } from "../core/i18n.js";
import { icon } from "./icons.js";
import { mascotSvg } from "./mascot.js";
import { copyText, showToast } from "./toast.js";

const SIZE = 1080;
const TILE_COLORS = [["#ff6b4a", "#d94d2f", "#ffffff"], ["#ffc531", "#e0a21c", "#26243a"], ["#22b573", "#17885a", "#ffffff"], ["#3fa9f5", "#237fc4", "#ffffff"]];

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

// The mascot as a picture: the colors are added inside the SVG
function mascotImage(mood) {
  const style = "<style>.tilo-face{fill:#ffc531}.tilo-edge,.tilo-foot{fill:#e0a21c}.tilo-hook{stroke:#26243a}.tilo-arm{fill:none;stroke:#e0a21c;stroke-width:7;stroke-linecap:round}.tilo-shadow{fill:rgba(0,0,0,.15)}.tilo-sparkles{fill:#fff}.tilo-think circle{fill:#fff}</style>";
  const svg = mascotSvg(mood).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="260" ').replace(/(<svg[^>]*>)/, `$1${style}`);
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

function drawStar(ctx, x, y, radius, filled) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fillStyle = filled ? "#ffc531" : "#dfe8f4";
  ctx.fill();
}

// card: { title, subtitle, rows: [{ won, misses, lives }], stars, big }
export async function drawShareCard(card) {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  try {
    await document.fonts.load('700 64px "Fredoka"');
  } catch {
    // The normal font is fine too
  }
  const font = (size) => `700 ${size}px "Fredoka", "Nunito", sans-serif`;

  // Background with soft circles
  const gradient = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  gradient.addColorStop(0, "#3fa9f5");
  gradient.addColorStop(1, "#1d6fe0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath(); ctx.arc(80, 1000, 220, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(1020, 90, 200, 0, Math.PI * 2); ctx.fill();

  // HANGLET in letter tiles
  const letters = [..."HANGLET"];
  const tile = 104;
  const gap = 14;
  const startX = (SIZE - (letters.length * tile + (letters.length - 1) * gap)) / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  letters.forEach((letter, i) => {
    const [fill, edge, text] = TILE_COLORS[i % 4];
    const x = startX + i * (tile + gap);
    const y = 70 + (i % 2 === 0 ? 0 : 10);
    ctx.fillStyle = edge;
    roundedRect(ctx, x, y + 10, tile, tile, 26); ctx.fill();
    ctx.fillStyle = fill;
    roundedRect(ctx, x, y, tile, tile, 26); ctx.fill();
    ctx.fillStyle = text;
    ctx.font = font(64);
    ctx.fillText(letter, x + tile / 2, y + tile / 2 + 4);
  });

  // White panel with the result
  ctx.fillStyle = "#1554b0";
  roundedRect(ctx, 90, 262, SIZE - 180, 640, 56); ctx.fill();
  ctx.fillStyle = "#ffffff";
  roundedRect(ctx, 90, 250, SIZE - 180, 640, 56); ctx.fill();

  ctx.fillStyle = "#1b2440";
  ctx.font = font(66);
  ctx.fillText(card.title, SIZE / 2, 340);
  ctx.fillStyle = "#55617c";
  ctx.font = font(44);
  ctx.fillText(card.subtitle || "", SIZE / 2, 410);

  if (card.big !== undefined) {
    // One big score, e.g. "6/9" stars in the Daily. Longer texts get a wider box.
    const text = String(card.big);
    const width = text.length > 2 ? 420 : 260;
    ctx.fillStyle = "#ffc531";
    roundedRect(ctx, SIZE / 2 - width / 2, 470, width, 230, 50); ctx.fill();
    ctx.fillStyle = "#26243a";
    ctx.font = font(text.length > 2 ? 130 : 150);
    ctx.fillText(text, SIZE / 2, 595);
  } else {
    if (card.stars !== undefined) {
      [0, 1, 2].forEach((i) => drawStar(ctx, SIZE / 2 + (i - 1) * 120, 495, 52, i < card.stars));
    }
    // One row per word: a check or cross, then a dot for every miss
    const rows = (card.rows || []).slice(0, 6);
    const rowTop = card.stars !== undefined ? 580 : 480;
    const rowHeight = Math.min(96, (840 - rowTop) / Math.max(rows.length, 1));
    rows.forEach((row, i) => {
      const y = rowTop + i * rowHeight;
      const size = rowHeight * 0.72;
      const left = 230;
      ctx.fillStyle = row.won ? "#22b573" : "#ff6b4a";
      roundedRect(ctx, left, y, size, size, 16); ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      if (row.won) {
        ctx.moveTo(left + size * 0.25, y + size * 0.52);
        ctx.lineTo(left + size * 0.43, y + size * 0.7);
        ctx.lineTo(left + size * 0.76, y + size * 0.32);
      } else {
        ctx.moveTo(left + size * 0.3, y + size * 0.3); ctx.lineTo(left + size * 0.7, y + size * 0.7);
        ctx.moveTo(left + size * 0.7, y + size * 0.3); ctx.lineTo(left + size * 0.3, y + size * 0.7);
      }
      ctx.stroke();
      const lives = row.lives || Math.max(row.misses, 6);
      for (let dot = 0; dot < Math.min(lives, 10); dot++) {
        ctx.fillStyle = dot < row.misses ? "#ff6b4a" : "#dfe8f4";
        ctx.beginPath();
        ctx.arc(left + size + 50 + dot * 46, y + size / 2, 15, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // The mascot and a line at the bottom
  const mood = card.rows && card.rows.length && !card.rows.some((row) => row.won) ? "happy" : "cheering";
  const mascot = await mascotImage(mood);
  if (mascot) ctx.drawImage(mascot, 780, 700, 220, 238);
  ctx.fillStyle = "#ffffff";
  ctx.font = font(46);
  ctx.textAlign = "left";
  ctx.fillText(t("share.cardFooter"), 110, 975);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

// Share text + picture. Falls back to a small window with download and copy.
export async function shareResult({ text, card }) {
  let blob = null;
  try {
    blob = card ? await drawShareCard(card) : null;
  } catch {
    blob = null;
  }
  const file = blob ? new File([blob], "hanglet.png", { type: "image/png" }) : null;
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  showShareWindow(text, blob);
}

function showShareWindow(text, blob) {
  const dialog = document.createElement("dialog");
  dialog.className = "dialog share-window";
  dialog.setAttribute("aria-labelledby", "share-title");
  const imageUrl = blob ? URL.createObjectURL(blob) : null;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(text)}`;
  dialog.innerHTML = `
    <h2 id="share-title">${t("share.title")}</h2>
    ${imageUrl ? `<img class="share-preview" src="${imageUrl}" alt="${t("share.imageAlt")}">` : ""}
    <div class="share-buttons">
      <button class="button button-primary" type="button" data-action="copy">${icon("share")}<span>${t("share.copyText")}</span></button>
      <a class="button button-mint" href="${whatsapp}" target="_blank" rel="noopener">${icon("quote")}<span>WhatsApp</span></a>
      ${imageUrl ? `<a class="button button-secondary" href="${imageUrl}" download="hanglet.png">${icon("download")}<span>${t("share.download")}</span></a>` : ""}
      <button class="button button-secondary" type="button" data-action="close">${t("common.close")}</button>
    </div>`;
  document.body.appendChild(dialog);
  dialog.querySelector('[data-action="copy"]').addEventListener("click", async () => {
    const copied = await copyText(text);
    showToast(copied ? t("result.copied") : t("result.copyFailed"), icon("check"));
  });
  const close = () => {
    if (dialog.open) dialog.close();
    dialog.remove();
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  };
  dialog.querySelector('[data-action="close"]').addEventListener("click", close);
  dialog.addEventListener("close", close);
  dialog.showModal();
}
