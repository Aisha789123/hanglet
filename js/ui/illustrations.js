// Small illustrations for the mode tiles on the home page (viewBox 0 0 120 100).

const ILLUSTRATIONS = {
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

};

export function illustration(name, className = "illustration") {
  return `<svg class="${className}" viewBox="0 0 120 100" aria-hidden="true" focusable="false">${ILLUSTRATIONS[name] || ""}</svg>`;
}
