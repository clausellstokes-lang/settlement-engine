/**
 * relationshipColors.js — the SINGLE source of truth for the relationship-type
 * swatch across the LIBRARY surface (the settlement card's neighbour chips, the
 * settlement-detail neighbour-network list, the campaign PDF's relationship lines)
 * AND the world map: relationshipEdgeStyle.js now DERIVES the map edge colors from
 * REL_HEX so the map line, the dossier chip, and the PDF line share one hue per
 * type. These are the muted parchment brand hues (the map's old vivid Tailwind set
 * was the outlier and was reconciled to these). Covers every canonical relationship
 * type, including vassal and criminal_network which the live palettes previously
 * left to a grey/neutral fallback.
 *
 * ⚠ THE HEADER ABOVE WAS AN OVERCLAIM UNTIL §67.2 (DA-A3), AND IT IS RECORDED
 * HERE AS HISTORY RATHER THAN QUIETLY CORRECTED. This module described itself as
 * the single source while SEVEN duplicate tables were live, and its own account
 * of the divergence ("the card was the outlier", "recolors only the card's three
 * divergent chips") understated it in both size and kind:
 *
 *   - `src/pdf/theme.js` and `SettlementCard.jsx` held the SAME wrong table, and
 *     its error was SEMANTIC, not cosmetic: `allied` carried canonical
 *     TRADE_PARTNER's hue, so the react-PDF chapter painted an alliance in the
 *     trade colour; `trade_partner` carried a hue in no canonical table;
 *     rival/cold_war/hostile all collapsed onto one red; patron/client onto one
 *     blue. Five of nine types rendered wrong, one of them on the paid PDF.
 *   - `SettlementDetail.jsx`, `new/neighbourComponents.jsx`,
 *     `new/tabs/RelationshipsTab.jsx` (twice) and `utils/generateCampaignPDF.js`
 *     carried the canonical VALUES but were each missing `vassal` and
 *     `criminal_network`, so both of those live edge types fell to the neutral
 *     grey everywhere except the map.
 *   - `RelationshipsTab.jsx` held TWO tables thirty lines apart that disagreed
 *     with each other on four values. The compile searched for a recorded intent
 *     for the darker set and found none, so it converged (J-TC21-3).
 *
 * The claim is TRUE AS OF DA-A3 and not before: every surface now calls
 * relColor()/relRgb(), and tests/lint/relationshipEdgeCriminalNetwork.test.js
 * asserts it across every surface for all ten canonical types.
 *
 * `secret_alliance` is EXPECTED-DEAD by corpus (J-TC21-8): it has zero producers
 * anywhere in the engine and is absent from both relationship planes, so it keeps
 * its authored PDF LABEL and gets no palette row — a label for an unproducible
 * type is harmless, a palette entry would assert a membership the corpus refuses.
 *
 * This is a relationship-domain palette, not a design token: these hues are NOT
 * in theme.js (no GOLD/INK equivalent), so they live here as the canonical
 * cross-surface source rather than being re-forked per component.
 *
 *   REL_HEX[type]      → "#rrggbb" for the web surfaces (card + detail).
 *   REL_RGB[type]      → [r,g,b]   for jsPDF (which takes numeric channels).
 *   relColor(type)     → hex with a neutral fallback.
 *   relRgb(type)       → rgb with a neutral fallback.
 */

export const REL_HEX = Object.freeze({
  trade_partner:    '#1a5a28',
  allied:           '#1a3a7a',
  patron:           '#4a1a6a',
  client:           '#6a3a1a',
  vassal:           '#3a1a5a',
  rival:            '#8a5010',
  cold_war:         '#8a3010',
  hostile:          '#8b1a1a',
  criminal_network: '#5a2a8a',
  neutral:          '#6b5340',
});

export const REL_RGB = Object.freeze({
  trade_partner:    [26,  90,  40],
  allied:           [26,  58, 122],
  patron:           [74,  26, 106],
  client:           [106, 58,  26],
  vassal:           [58,  26,  90],
  rival:            [138, 80,  16],
  cold_war:         [138, 48,  16],
  hostile:          [139, 26,  26],
  criminal_network: [90,  42, 138],
  neutral:          [107, 83,  64],
});

/** Hex for a relationship type, falling back to the neutral hue. */
export function relColor(type) {
  return REL_HEX[type] || REL_HEX.neutral;
}

/** RGB channels for a relationship type, falling back to the neutral hue. */
export function relRgb(type) {
  return REL_RGB[type] || REL_RGB.neutral;
}
