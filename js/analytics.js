// ============================================================================
// Visitor statistics with GoatCounter (https://www.goatcounter.com)
// GoatCounter is privacy-friendly: no cookies, no personal data, no tracking
// across websites. It only counts page views.
//
// HOW TO TURN IT ON:
//   1. Make a free account at https://www.goatcounter.com
//   2. Pick a code, for example "hanglet" → https://hanglet.goatcounter.com
//   3. Fill in that code below, between the quotes:
//
//        export const GOATCOUNTER_CODE = "hanglet";
//
// Leave it empty ("") to keep statistics turned off.
// ============================================================================
export const GOATCOUNTER_CODE = "";

export function startAnalytics() {
  // Off when no code is set, and never on a local file
  if (!GOATCOUNTER_CODE || location.protocol === "file:") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.appendChild(script);
}
