/**
 * relationshipColors.js — the SINGLE source of truth for the relationship-type
 * swatch used across the LIBRARY surface: the settlement card's neighbour chips,
 * the settlement-detail neighbour-network list, and the campaign PDF's
 * relationship lines.
 *
 * Previously REL_COLORS was duplicated with DIVERGENT values: SettlementCard
 * rendered `rival` as #8b1a1a / `patron` as #2a3a7a, while SettlementDetail (and
 * generateCampaignPDF) used #8a5010 / #4a1a6a — so the SAME relationship looked
 * one color on a library card and another in the dossier's neighbour list, a
 * visible coherence break (the cardinal sin). This module pins ONE palette so the
 * chip, the dossier row, and the exported PDF line stay in lockstep. The values
 * are the detail/PDF set (the card was the outlier), so this is a dedupe that
 * recolors only the card's three divergent chips into agreement.
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
  trade_partner: '#1a5a28',
  allied:        '#1a3a7a',
  patron:        '#4a1a6a',
  client:        '#6a3a1a',
  rival:         '#8a5010',
  cold_war:      '#8a3010',
  hostile:       '#8b1a1a',
  neutral:       '#6b5340',
});

export const REL_RGB = Object.freeze({
  trade_partner: [26,  90,  40],
  allied:        [26,  58, 122],
  patron:        [74,  26, 106],
  client:        [106, 58,  26],
  rival:         [138, 80,  16],
  cold_war:      [138, 48,  16],
  hostile:       [139, 26,  26],
  neutral:       [107, 83,  64],
});

/** Hex for a relationship type, falling back to the neutral hue. */
export function relColor(type) {
  return REL_HEX[type] || REL_HEX.neutral;
}

/** RGB channels for a relationship type, falling back to the neutral hue. */
export function relRgb(type) {
  return REL_RGB[type] || REL_RGB.neutral;
}
