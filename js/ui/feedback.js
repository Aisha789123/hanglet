// Sounds made with the Web Audio API (no audio files) and phone vibration.
// Every sound is built from short notes with a soft attack, a filter and a
// small echo, so it sounds warm instead of beepy.
import { data } from "../core/storage.js";

let audio = null;
let output = null;
let noiseBuffer = null;

// Browsers only allow sound after the player has tapped or pressed a key
function getAudio() {
  if (!audio) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audio = new AudioContext();

    // Main volume with a soft echo for some space
    output = audio.createGain();
    output.gain.value = 0.8;
    const echo = audio.createDelay();
    echo.delayTime.value = 0.13;
    const echoVolume = audio.createGain();
    echoVolume.gain.value = 0.18;
    output.connect(audio.destination);
    output.connect(echo);
    echo.connect(echoVolume);
    echoVolume.connect(audio.destination);
  }
  if (audio.state === "suspended") {
    audio.resume();
  }
  return audio;
}

// One note. Times are in seconds, "slide" moves the pitch to a new frequency.
function note({ frequency, delay = 0, length = 0.18, type = "sine", volume = 0.14, slide = null, filter = 4000 }) {
  const context = getAudio();
  if (!context) return;
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const lowpass = context.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (slide) oscillator.frequency.exponentialRampToValueAtTime(slide, start + length);
  lowpass.type = "lowpass";
  lowpass.frequency.value = filter;

  // Quick fade in, slow fade out
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);

  oscillator.connect(lowpass).connect(gain).connect(output);
  oscillator.start(start);
  oscillator.stop(start + length + 0.05);
}

// A burst of noise, used for the balloon pop and the rocket launch
function noise({ delay = 0, length = 0.3, volume = 0.2, from = 800, to = 3000 }) {
  const context = getAudio();
  if (!context) return;
  if (!noiseBuffer) {
    noiseBuffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const channel = noiseBuffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1;
  }
  const start = context.currentTime + delay;
  const source = context.createBufferSource();
  const bandpass = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = noiseBuffer;
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(from, start);
  bandpass.frequency.exponentialRampToValueAtTime(to, start + length);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  source.connect(bandpass).connect(gain).connect(output);
  source.start(start);
  source.stop(start + length);
}

// A friendly major scale for right letters, going up with every right letter
const SCALE = [523, 587, 659, 784, 880, 1047, 1175, 1319];

const SOUNDS = {
  tap: () => note({ frequency: 700, length: 0.05, type: "triangle", volume: 0.05 }),
  correct: (step = 0) => {
    const frequency = SCALE[Math.min(step, SCALE.length - 1)];
    note({ frequency, length: 0.22, type: "triangle", volume: 0.13 });
    note({ frequency: frequency * 2, length: 0.12, volume: 0.04 });
  },
  wrong: () => {
    note({ frequency: 220, slide: 140, length: 0.26, type: "sine", volume: 0.18, filter: 900 });
    note({ frequency: 110, length: 0.2, type: "triangle", volume: 0.06, filter: 600 });
  },
  hint: () => [1047, 1319, 1568].forEach((frequency, i) =>
    note({ frequency, delay: i * 0.06, length: 0.16, type: "triangle", volume: 0.08 })),
  coin: () => {
    note({ frequency: 988, length: 0.08, type: "square", volume: 0.04, filter: 3000 });
    note({ frequency: 1319, delay: 0.07, length: 0.18, type: "square", volume: 0.04, filter: 3000 });
  },
  win: () => {
    [523, 659, 784, 1047].forEach((frequency, i) =>
      note({ frequency, delay: i * 0.09, length: 0.3, type: "triangle", volume: 0.12 }));
    [523, 659, 784].forEach((frequency) =>
      note({ frequency, delay: 0.38, length: 0.9, type: "sine", volume: 0.05 }));
  },
  lose: () => [392, 349, 311, 262].forEach((frequency, i) =>
    note({ frequency, delay: i * 0.16, length: 0.32, type: "triangle", volume: 0.1, filter: 1400 })),
  unlock: () => [659, 784, 988, 1319].forEach((frequency, i) =>
    note({ frequency, delay: i * 0.08, length: 0.28, type: "triangle", volume: 0.1 })),
  tick: () => note({ frequency: 1200, length: 0.03, type: "square", volume: 0.025, filter: 2500 }),
  pop: () => noise({ length: 0.12, volume: 0.35, from: 2000, to: 600 }),
  launch: () => {
    noise({ length: 1.4, volume: 0.25, from: 300, to: 2500 });
    note({ frequency: 120, slide: 480, length: 1.2, type: "sawtooth", volume: 0.04, filter: 800 });
  },
};

export function playSound(name, value) {
  if (!data.settings.sound || !SOUNDS[name]) return;
  try {
    SOUNDS[name](value);
  } catch {
    // Sound is a nice extra, never break the game for it
  }
}

export function vibrate(pattern) {
  if (data.settings.vibration && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
