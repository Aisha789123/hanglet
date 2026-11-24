// "Challenge a friend": the secret word travels inside the link.
// It is scrambled (not real security, but nobody can read the word in the link)
// so no server is needed.

const KEY = "hanglet-tilo";
const VERSION = "1";

export const MIN_LENGTH = 3;
export const MAX_LENGTH = 14;

// Make a word from what the player typed: lowercase, no accents, letters only
export function cleanWord(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

export function isValidWord(word) {
  return /^[a-z]+$/.test(word) && word.length >= MIN_LENGTH && word.length <= MAX_LENGTH;
}

// Text → bytes → mixed with the key → base64 that is safe in a URL
function scramble(text) {
  const bytes = new TextEncoder().encode(text);
  const mixed = bytes.map((byte, i) => byte ^ KEY.charCodeAt(i % KEY.length));
  let binary = "";
  mixed.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unscramble(code) {
  const base64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "===".slice((base64.length + 3) % 4));
  const bytes = Uint8Array.from(binary, (char, i) => char.charCodeAt(0) ^ KEY.charCodeAt(i % KEY.length));
  return new TextDecoder().decode(bytes);
}

export const MAX_CLUES = 3;
export const MAX_CLUE_LENGTH = 80;

// Up to 3 clues, without empty ones. Older links had one hint as a text.
function cleanClues(clues) {
  const list = Array.isArray(clues) ? clues : [clues];
  return list
    .map((clue) => String(clue || "").trim().slice(0, MAX_CLUE_LENGTH))
    .filter((clue) => clue !== "")
    .slice(0, MAX_CLUES);
}

// { word, clues, name, lang } → code for the link
export function encodeChallenge({ word, clues = [], name = "", lang = "en" }) {
  const payload = JSON.stringify({ w: cleanWord(word), h: cleanClues(clues), n: name.trim().slice(0, 20), l: lang });
  return VERSION + scramble(payload);
}

// Code from the link → challenge, or null when the link is broken
export function decodeChallenge(code) {
  try {
    if (!code || code[0] !== VERSION) return null;
    const payload = JSON.parse(unscramble(code.slice(1)));
    const word = cleanWord(payload.w || "");
    if (!isValidWord(word)) return null;
    return {
      word,
      clues: cleanClues(payload.h),
      name: String(payload.n || "").slice(0, 20),
      lang: payload.l === "nl" ? "nl" : "en",
    };
  } catch {
    return null;
  }
}

// The full link to share
export function challengeLink(code, base = location.href) {
  return new URL(`play.html?mode=challenge&c=${code}`, base).href;
}
