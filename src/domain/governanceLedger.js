/**
 * domain/governanceLedger.js — the canonical conserved governance quantity for a settlement.
 *
 * Mirrors foodLedger / defenseLedger. powerGenerator persists the public
 * legitimacy on `powerStructure.publicLegitimacy = { score, label, breakdown, ... }`. Four
 * lenses read that score, each with slightly DIFFERENT null-handling: causalState
 * derivePublicLegitimacy + deriveRulingAuthority (`leg && typeof leg.score === 'number'`),
 * capacityModel deriveAdministrative (`publicLegitimacy?.score`), and deriveSystemState
 * deriveVolatility (which, before Stage 2a, mis-tested `typeof === 'number'` against the object).
 *
 * This is the ONE read-point for the conserved legitimacy quantity. Each lens still applies
 * its OWN transfer (verbatim / *0.5 / *0.3 / thresholds) — those weights are intentionally
 * lens-specific, exactly as each food lens bands deficitPct differently. The ledger only
 * unifies the READ + null/legacy handling, so a bare-number legacy save now works everywhere.
 *
 * Governing-faction power is deliberately NOT folded in: deriveRulingAuthority keys it off the
 * named governing faction while deriveAdministrative uses government-archetype power — two
 * distinct notions, not a shared conserved quantity.
 *
 * Pure; defensive; neutral defaults (with `present: false`) for an un-generated settlement.
 */

/**
 * @typedef {Object} GovernanceLedger
 * @property {number} legitimacyScore  0..100 public legitimacy of the ruling order
 * @property {string|null} legitimacyLabel  banded label, when the producer supplied one
 * @property {boolean} present  true once a real publicLegitimacy (object or legacy number) backed it
 */

/** @type {GovernanceLedger} */
const NEUTRAL = Object.freeze({
  legitimacyScore: 50,   // neutral baseline — neither shores up nor undermines a lens
  legitimacyLabel: null,
  present: false,
});

/** @param {any} v @returns {boolean} */
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {GovernanceLedger}
 */
export function governanceLedger(settlement) {
  const leg = settlement?.powerStructure?.publicLegitimacy;
  // Canonical shape: an object carrying a numeric .score (+ optional label).
  if (leg && typeof leg === 'object' && isNum(leg.score)) {
    return {
      legitimacyScore: leg.score,
      legitimacyLabel: typeof leg.label === 'string' ? leg.label : null,
      present: true,
    };
  }
  // Legacy shape: a bare number. Honour it so old saves still move every lens.
  if (isNum(leg)) {
    return { legitimacyScore: leg, legitimacyLabel: null, present: true };
  }
  return NEUTRAL;
}
