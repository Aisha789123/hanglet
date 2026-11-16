// Short sounds made with the Web Audio API (no audio files) and phone vibration.
import { data } from "../core/storage.js";

let audio = null;

// Browsers only allow sound after the player has tapped or pressed a key
function getAudio() {
  if (!audio) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audio = new AudioContext();
  }
  if (audio.state === "suspended") {
    audio.resume();
  }
  return audio;
}

// Play one soft tone. "delay" and "length" are in seconds.
function tone(frequency, delay = 0, length = 0.12, type = "sine", volume = 0.12) {
  const context = getAudio();
  if (!context) return;
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  // Fade in and out quickly to avoid clicks
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + length + 0.02);
}

const SOUNDS = {
  tap: () => tone(520, 0, 0.05, "sine", 0.05),
  correct: () => { tone(660, 0, 0.09); tone(880, 0.07, 0.12); },
  wrong: () => tone(196, 0, 0.18, "triangle", 0.14),
  hint: () => { tone(740, 0, 0.08); tone(988, 0.06, 0.1); },
  win: () => [523, 659, 784, 1047].forEach((note, i) => tone(note, i * 0.09, 0.22)),
  lose: () => [392, 330, 262].forEach((note, i) => tone(note, i * 0.14, 0.25, "triangle")),
  tick: () => tone(1000, 0, 0.04, "square", 0.03),
};

export function playSound(name) {
  if (!data.settings.sound || !SOUNDS[name]) return;
  try {
    SOUNDS[name]();
  } catch {
    // Sound is a nice extra, never break the game for it
  }
}

export function vibrate(pattern) {
  if (data.settings.vibration && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
