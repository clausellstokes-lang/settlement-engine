/**
 * settlementThreat.js — the SINGLE source of truth for how a settlement's
 * `config.monsterThreat` is shown: the label word AND the token color.
 *
 * Previously two surfaces disagreed about the SAME underlying value (P2, the
 * cardinal cross-surface contradiction): the SettlementPalette pill mapped
 * 'plagued' → a red "PLAGUED" chip, while DossierHeaderRow mapped that same
 * 'plagued' → the word "Embattled" in a different hue — so one settlement read
 * as two different threats depending on which surface the GM looked at. Routing
 * both through this helper makes the word and the hue identical everywhere.
 *
 * Contrast (P7): each tone exposes a `text` color audited >= 4.5:1 on CARD and a
 * lighter `fill` for the tint/border. embattled's raw hue (#C87060) fails AA as
 * text (3.43:1), so its `text` is the darkened #A0492F step (5.84:1) while the
 * fill keeps the lighter hue — the fill-vs-text split the Button/token system
 * already mandates. tests/design/contrast.test.js pins these pairs.
 */

import { swatch } from '../theme.js';

/** @typedef {{ label: string, text: string, fill: string }} ThreatDisplay */

const THREAT_DISPLAY = Object.freeze({
  frontier: { label: 'Frontier',  text: swatch['#8C6F32'], fill: swatch['#C9A24C'] },
  embattled: { label: 'Embattled', text: swatch['#A0492F'], fill: swatch['#C87060'] },
  plagued:   { label: 'Plagued',   text: swatch['#A23434'], fill: swatch['#A23434'] },
});

/**
 * Display label + token colors for a monsterThreat value. Returns null for the
 * absent/unknown case (and for 'frontier', which both surfaces suppress as the
 * calm baseline) so callers can self-gate exactly as before.
 * @param {string|null|undefined} threat
 * @returns {ThreatDisplay | null}
 */
export function threatDisplay(threat) {
  return THREAT_DISPLAY[threat] || null;
}
