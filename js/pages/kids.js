// The Kids world: its own start page with Tilo and the sticker book.
// Every solved Kids word gives a sticker of its picture.
import { data } from "../core/storage.js";
import { t } from "../core/i18n.js";
import { KIDS_WORDS } from "../core/words.js";
import { initPage } from "../ui/layout.js";
import { createMascot } from "../ui/mascot.js";
import { pictureSvg } from "../ui/pictures.js";

initPage("home");

const mascot = createMascot(document.getElementById("kids-mascot"), "happy", { label: t("mascot.label") });
document.getElementById("kids-speech").textContent = t("kids.hello");
document.getElementById("kids-mascot").addEventListener("click", () => {
  mascot.setMood("cheering");
  mascot.react("bounce");
  setTimeout(() => mascot.setMood("happy"), 1400);
});

// The sticker book: found stickers first, then the ones still to find
const stickers = data.kids.stickers;
const found = KIDS_WORDS.filter((item) => stickers[item.picture]);
const missing = KIDS_WORDS.filter((item) => !stickers[item.picture]);
document.getElementById("sticker-count").textContent = t("kids.stickerCount", { count: found.length, total: KIDS_WORDS.length });
document.getElementById("sticker-grid").innerHTML = [
  ...found.map((item, i) => `
    <li class="sticker-slot is-found" style="--tilt:${(i % 5) * 3 - 6}deg">
      <span class="sticker">${pictureSvg(item.picture)}</span>
      <span class="sticker-word">${item.word}</span>
      ${stickers[item.picture] > 1 ? `<span class="sticker-times">×${stickers[item.picture]}</span>` : ""}
    </li>`),
  ...missing.map(() => `
    <li class="sticker-slot" aria-label="${t("kids.notFound")}">
      <span class="sticker sticker-empty" aria-hidden="true">?</span>
    </li>`),
].join("");
