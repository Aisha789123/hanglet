// Calm background music, made live with the Web Audio API (no audio files).
// A soft chord pad and a slow, random melody from a friendly scale.
// It is off by default and can be turned on in Settings or on the game screen.

const TEMPO = 76; // beats per minute
const BEAT = 60 / TEMPO;

// Four gentle chords (C, A minor, F, G) and the notes that fit them
const CHORDS = [
  [261.6, 329.6, 392.0],
  [220.0, 261.6, 329.6],
  [174.6, 220.0, 261.6],
  [196.0, 246.9, 293.7],
];
const MELODY = [523.3, 587.3, 659.3, 784.0, 880.0, 1046.5];

let context = null;
let master = null;
let timer = null;
let nextTime = 0;
let step = 0;

function setup() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;
  context = new AudioContext();
  master = context.createGain();
  master.gain.value = 0;
  const lowpass = context.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1800;
  master.connect(lowpass).connect(context.destination);
  return true;
}

function play(frequency, start, length, volume, type) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.4, length / 3));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  oscillator.connect(gain).connect(master);
  oscillator.start(start);
  oscillator.stop(start + length + 0.05);
}

// Plan the next beats a little ahead of time, so timing stays smooth
function schedule() {
  while (nextTime < context.currentTime + 0.6) {
    const chord = CHORDS[Math.floor(step / 8) % CHORDS.length];
    if (step % 8 === 0) {
      chord.forEach((frequency) => play(frequency / 2, nextTime, BEAT * 8, 0.035, "sine"));
    }
    // A melody note on most beats, sometimes a rest
    if (step % 2 === 0 && Math.random() < 0.75) {
      const note = MELODY[Math.floor(Math.random() * MELODY.length)];
      play(note, nextTime, BEAT * 1.6, 0.03, "triangle");
    }
    nextTime += BEAT / 2;
    step++;
  }
}

export function startMusic() {
  if (timer) return;
  if (!context && !setup()) return;
  context.resume();
  nextTime = context.currentTime + 0.1;
  master.gain.cancelScheduledValues(context.currentTime);
  master.gain.setTargetAtTime(1, context.currentTime, 0.8);
  timer = setInterval(schedule, 200);
  schedule();
}

export function stopMusic() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
  master.gain.setTargetAtTime(0, context.currentTime, 0.3);
}

export function isMusicPlaying() {
  return Boolean(timer);
}
