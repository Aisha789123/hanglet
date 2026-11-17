// Small illustrations for the mode tiles and rewards (viewBox 0 0 120 100).

const ILLUSTRATIONS = {
  // A calendar page with a sun peeking out
  daily: `
    <circle cx="88" cy="26" r="16" fill="#ffc531"/>
    <rect x="22" y="22" width="64" height="66" rx="12" fill="#ffffff"/>
    <rect x="22" y="22" width="64" height="20" rx="10" fill="#ff6b4a"/>
    <rect x="22" y="34" width="64" height="8" fill="#ff6b4a"/>
    <rect x="34" y="14" width="6" height="16" rx="3" fill="#26243a"/>
    <rect x="68" y="14" width="6" height="16" rx="3" fill="#26243a"/>
    <text x="54" y="77" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="30" fill="#26243a">3</text>`,

  // A small stack of letter tiles
  classic: `
    <g transform="rotate(-10 40 60)"><rect x="18" y="38" width="38" height="40" rx="10" fill="#e0a21c"/><rect x="18" y="34" width="38" height="40" rx="10" fill="#ffc531"/><text x="37" y="64" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="26" fill="#26243a">A</text></g>
    <g transform="rotate(8 82 52)"><rect x="62" y="30" width="38" height="40" rx="10" fill="#d94d2f"/><rect x="62" y="26" width="38" height="40" rx="10" fill="#ff6b4a"/><text x="81" y="56" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="26" fill="#fff">B</text></g>
    <g transform="rotate(-3 60 80)"><rect x="42" y="62" width="34" height="34" rx="9" fill="#237fc4"/><rect x="42" y="58" width="34" height="34" rx="9" fill="#3fa9f5"/><text x="59" y="84" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#fff">C</text></g>`,

  // A winding path to a flag on a hill
  levels: `
    <path d="M0 100V78q30-14 60-4t60-6v32z" fill="#22b573"/>
    <path d="M14 96q30-10 26-26t30-18 22-22" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 12"/>
    <circle cx="16" cy="94" r="7" fill="#ffc531" stroke="#fff" stroke-width="3"/>
    <circle cx="44" cy="66" r="7" fill="#ffc531" stroke="#fff" stroke-width="3"/>
    <path d="M94 34V6" stroke="#26243a" stroke-width="4" stroke-linecap="round"/>
    <path d="M94 6h20l-6 7 6 7H94z" fill="#ff6b4a"/>`,

  // A stopwatch
  timed: `
    <rect x="50" y="6" width="20" height="10" rx="4" fill="#26243a"/>
    <path d="M90 22l8-8" stroke="#26243a" stroke-width="6" stroke-linecap="round"/>
    <circle cx="60" cy="56" r="38" fill="#ffffff"/>
    <circle cx="60" cy="56" r="38" fill="none" stroke="#26243a" stroke-width="6"/>
    <path d="M60 56L60 30A26 26 0 0 1 84 46z" fill="#ffc531"/>
    <path d="M60 56V32M60 56l16 10" stroke="#26243a" stroke-width="5" stroke-linecap="round"/>
    <circle cx="60" cy="56" r="5" fill="#ff6b4a"/>`,

  // A balloon and a kite
  kids: `
    <path d="M86 8l18 22-18 26-18-26z" fill="#3fa9f5"/>
    <path d="M86 8v48M68 30h36" stroke="#ffffff" stroke-width="2"/>
    <path d="M86 56c-6 8 6 12 0 22s6 12 2 18" fill="none" stroke="#26243a" stroke-width="2"/>
    <ellipse cx="38" cy="38" rx="24" ry="28" fill="#ff6b4a"/>
    <ellipse cx="29" cy="27" rx="5" ry="9" fill="#fff" opacity=".4" transform="rotate(-20 29 27)"/>
    <path d="M35 66l3 4 3-4z" fill="#d94d2f"/>
    <path d="M38 70c-6 8 6 14 0 28" fill="none" stroke="#26243a" stroke-width="2"/>`,

  // An envelope with a letter tile
  challenge: `
    <rect x="14" y="30" width="92" height="62" rx="10" fill="#ffffff"/>
    <path d="M14 38l46 30 46-30" fill="none" stroke="#26243a" stroke-width="5" stroke-linejoin="round"/>
    <g transform="rotate(12 76 22)"><rect x="60" y="8" width="32" height="34" rx="8" fill="#e0a21c"/><rect x="60" y="4" width="32" height="34" rx="8" fill="#ffc531"/><text x="76" y="29" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#26243a">?</text></g>`,

  // A treasure chest (closed)
  chest: `
    <rect x="16" y="46" width="88" height="46" rx="8" fill="#b9733f"/>
    <path d="M16 54h88" stroke="#8d5229" stroke-width="5"/>
    <path d="M16 48c0-26 88-26 88 0z" fill="#d48a4c"/>
    <path d="M38 32v60M82 32v60" stroke="#ffc531" stroke-width="6"/>
    <rect x="50" y="48" width="20" height="18" rx="4" fill="#ffc531"/>
    <circle cx="60" cy="57" r="3" fill="#8d5229"/>`,

  // A treasure chest (open, with coins)
  "chest-open": `
    <path d="M18 40L28 10h64l10 30z" fill="#d48a4c"/>
    <path d="M38 12l-6 28M82 12l6 28" stroke="#ffc531" stroke-width="6"/>
    <circle cx="44" cy="46" r="10" fill="#ffc531" stroke="#e0a21c" stroke-width="3"/>
    <circle cx="62" cy="40" r="10" fill="#ffc531" stroke="#e0a21c" stroke-width="3"/>
    <circle cx="78" cy="48" r="10" fill="#ffc531" stroke="#e0a21c" stroke-width="3"/>
    <rect x="16" y="50" width="88" height="42" rx="8" fill="#b9733f"/>
    <path d="M16 58h88" stroke="#8d5229" stroke-width="5"/>
    <path d="M38 50v42M82 50v42" stroke="#ffc531" stroke-width="6"/>`,
};

export function illustration(name, className = "illustration") {
  return `<svg class="${className}" viewBox="0 0 120 100" aria-hidden="true" focusable="false">${ILLUSTRATIONS[name] || ""}</svg>`;
}
