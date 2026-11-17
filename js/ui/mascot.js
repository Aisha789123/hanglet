// Tilo, the Hanglet mascot: a friendly letter tile with a little hook on top.
// Moods: happy, thinking, surprised, sad, cheering.

export const MOODS = ["happy", "thinking", "surprised", "sad", "cheering"];

// Eyes, mouth and arms change with the mood. Everything else stays the same.
const FACES = {
  happy: {
    eyes: '<g class="tilo-eyes"><ellipse cx="47" cy="63" rx="7" ry="8" fill="#fff"/><ellipse cx="73" cy="63" rx="7" ry="8" fill="#fff"/><circle cx="48" cy="64" r="4" fill="#26243a"/><circle cx="74" cy="64" r="4" fill="#26243a"/><circle cx="49.5" cy="62" r="1.4" fill="#fff"/><circle cx="75.5" cy="62" r="1.4" fill="#fff"/></g>',
    mouth: '<path d="M51 79q9 9 18 0" fill="none" stroke="#26243a" stroke-width="3.5" stroke-linecap="round"/>',
    arms: '<path d="M22 80q-9 6-6 15M98 80q9 6 6 15" class="tilo-arm"/>',
  },
  thinking: {
    eyes: '<g class="tilo-eyes"><ellipse cx="47" cy="63" rx="7" ry="8" fill="#fff"/><ellipse cx="73" cy="63" rx="7" ry="8" fill="#fff"/><circle cx="50" cy="60" r="4" fill="#26243a"/><circle cx="76" cy="60" r="4" fill="#26243a"/></g><path d="M40 51l12-2M68 49l12 2" stroke="#26243a" stroke-width="3" stroke-linecap="round"/>',
    mouth: '<path d="M54 82h12" fill="none" stroke="#26243a" stroke-width="3.5" stroke-linecap="round"/>',
    arms: '<path d="M22 80q-9 6-6 15" class="tilo-arm"/><path d="M98 82q4 10-14 4" class="tilo-arm"/><g class="tilo-think"><circle cx="104" cy="34" r="3"/><circle cx="111" cy="24" r="4.5"/></g>',
  },
  surprised: {
    eyes: '<g class="tilo-eyes"><circle cx="47" cy="62" r="9" fill="#fff"/><circle cx="73" cy="62" r="9" fill="#fff"/><circle cx="47" cy="62" r="3.5" fill="#26243a"/><circle cx="73" cy="62" r="3.5" fill="#26243a"/></g><path d="M38 47q8-6 15-2M67 45q7-4 15 2" fill="none" stroke="#26243a" stroke-width="3" stroke-linecap="round"/>',
    mouth: '<ellipse cx="60" cy="83" rx="6" ry="7" fill="#26243a"/><ellipse cx="60" cy="86" rx="3.5" ry="3" fill="#ff7a8a"/>',
    arms: '<path d="M22 76q-12-4-12-16M98 76q12-4 12-16" class="tilo-arm"/>',
  },
  sad: {
    eyes: '<g class="tilo-eyes"><ellipse cx="47" cy="65" rx="6.5" ry="7" fill="#fff"/><ellipse cx="73" cy="65" rx="6.5" ry="7" fill="#fff"/><circle cx="47" cy="67" r="3.5" fill="#26243a"/><circle cx="73" cy="67" r="3.5" fill="#26243a"/></g><path d="M39 55l12 3M81 55l-12 3" stroke="#26243a" stroke-width="3" stroke-linecap="round"/><path class="tilo-tear" d="M40 74q-3 6 0 8q3-2 0-8z" fill="#5bb8f5"/>',
    mouth: '<path d="M52 87q8-7 16 0" fill="none" stroke="#26243a" stroke-width="3.5" stroke-linecap="round"/>',
    arms: '<path d="M22 84q-6 8-2 16M98 84q6 8 2 16" class="tilo-arm"/>',
  },
  cheering: {
    eyes: '<g class="tilo-eyes"><path d="M40 64q7-9 14 0M66 64q7-9 14 0" fill="none" stroke="#26243a" stroke-width="3.5" stroke-linecap="round"/></g>',
    mouth: '<path d="M48 76q12 0 24 0q-2 13-12 13t-12-13z" fill="#26243a"/><path d="M53 84q7 5 14 0" fill="#ff7a8a"/>',
    arms: '<path d="M22 74q-14-8-12-26M98 74q14-8 12-26" class="tilo-arm"/><g class="tilo-sparkles"><path d="M10 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M110 22l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/></g>',
  },
};

// Winter hat and scarf for the season look
const WINTER = '<g class="tilo-winter"><path d="M34 40q26-34 52 0z" fill="#e5484d"/><rect x="30" y="36" width="60" height="10" rx="5" fill="#fff"/><circle cx="60" cy="10" r="7" fill="#fff"/></g>';

// In the winter season Tilo wears a hat and scarf
function isWinterLook() {
  return typeof document !== "undefined" && document.documentElement.dataset.season === "winter";
}

export function mascotSvg(mood = "happy", { winter = isWinterLook(), label = "" } = {}) {
  const face = FACES[mood] || FACES.happy;
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `
    <svg class="tilo tilo-${mood}" viewBox="0 0 120 130" ${aria} focusable="false">
      <ellipse class="tilo-shadow" cx="60" cy="124" rx="34" ry="5"/>
      <g class="tilo-body">
        <path class="tilo-hook" d="M60 30v-9a8 8 0 1 1 8-8" fill="none" stroke-width="5" stroke-linecap="round"/>
        ${face.arms}
        <ellipse cx="44" cy="118" rx="10" ry="6" class="tilo-foot"/>
        <ellipse cx="76" cy="118" rx="10" ry="6" class="tilo-foot"/>
        <rect x="20" y="34" width="80" height="80" rx="24" class="tilo-edge"/>
        <rect x="20" y="28" width="80" height="80" rx="24" class="tilo-face"/>
        <path d="M32 40q8-6 18-6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>
        <ellipse cx="36" cy="80" rx="7" ry="4.5" fill="#ff8f8f" opacity=".55"/>
        <ellipse cx="84" cy="80" rx="7" ry="4.5" fill="#ff8f8f" opacity=".55"/>
        ${face.eyes}
        ${face.mouth}
        ${winter ? WINTER : ""}
      </g>
    </svg>`;
}

// A mascot that can change mood and react with a small animation
export function createMascot(container, mood = "happy", options = {}) {
  let current = mood;
  container.classList.add("tilo-holder");
  container.innerHTML = mascotSvg(mood, options);

  function setMood(next) {
    if (next === current) return;
    current = next;
    container.innerHTML = mascotSvg(next, options);
  }

  // type: "bounce" (happy jump) or "shake" (oops)
  function react(type) {
    container.classList.remove("is-bounce", "is-shake");
    void container.offsetWidth; // restart the animation
    container.classList.add(`is-${type}`);
  }

  return { setMood, react, get mood() { return current; } };
}
