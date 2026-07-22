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

// The keys here MUST be EXACTLY the canonical monster-threat tiers the generator
// emits (src/data/monsterThreat.js MONSTER_THREAT_TIERS: heartland/frontier/
// plagued) — the vocabularyTotality walker (tests/lint/vocabularyTotality.walker
// .test.js) reds on any drift. Cycle-3 H1: the dead 'embattled' arm (no producer
// has ever emitted it) is removed, and the previously-missing 'heartland' arm
// (resolveConfig emits it for ~a third of default random settlements) is added.
// 'heartland' is the CALMEST tier — even calmer than 'frontier' — so both
// surfaces suppress it as a calm baseline via isCalmThreat below; its arm exists
// for vocabulary totality and carries the calm-gold tones (frontier's audited
// pair) should any surface ever choose to show it.
const THREAT_DISPLAY = Object.freeze({
  heartland: { label: 'Heartland', text: swatch['#8C6F32'], fill: swatch['#C9A24C'] },
  frontier:  { label: 'Frontier',  text: swatch['#8C6F32'], fill: swatch['#C9A24C'] },
  plagued:   { label: 'Plagued',   text: swatch['#A23434'], fill: swatch['#A23434'] },
});

/**
 * The calm-baseline tiers both surfaces (DossierHeaderRow, SettlementPalette)
 * SUPPRESS — they show no threat pill for these. Historically only 'frontier'
 * was suppressed (an inline `!== 'frontier'` guard on each surface); 'heartland'
 * is calmer still, so an unsuppressed heartland used to render a broken raw
 * "HEARTLAND" chip on the dossier header (H1). Routing both suppression gates
 * through this one predicate makes the calm set a single source of truth.
 * @param {string|null|undefined} threat
 * @returns {boolean}
 */
export function isCalmThreat(threat) {
  return threat === 'frontier' || threat === 'heartland';
}

/**
 * Display label + token colors for a monsterThreat value. Returns null for the
 * absent/unknown case so callers can self-gate; callers additionally suppress
 * the calm baseline via isCalmThreat.
 * @param {string|null|undefined} threat
 * @returns {ThreatDisplay | null}
 */
export function threatDisplay(threat) {
  return THREAT_DISPLAY[threat] || null;
}
