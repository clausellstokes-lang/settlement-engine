/**
 * spatial/generosityGate.js — THE §0.1 GENEROSITY GATE, as a zero-import leaf.
 *
 * qualifiesForGenerosity is the structural law of the generosity engine (design law 1:
 * no bond, no history, no obligation ⇒ the question is never even asked). It moved here
 * VERBATIM from generosityEV.js (which re-exports it — single source preserved for the
 * kernel, the tests, and every lazy consumer) so the EAGER event-mutation handlers
 * (mutateWorld.js forceRelief / offerCredit — the FORCE_RELIEF / OFFER_CREDIT counterpart
 * DM-verbs, Counterpart Criterion) can run the SAME gate function the organic mover runs
 * without dragging the whole lazy generosityEV kernel into the first-paint static closure
 * (the constitutional "lazy kernels" posture, design §6 — the registryProse idiom).
 *
 * FIRST-PAINT LAW: keep this leaf import-free. Never add a dependency here.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/**
 * @typedef {Object} BondRead
 * @property {string} kind         the live relationship kind ('allied'|'trade_partner'|'vassal'|'patron'|'client'|…)
 * @property {number} strength01   bond strength in [0,1] (trust/pact — the live edge, never a parallel derivation)
 * @property {number} [duty01]     patron/vassal duty weighting in [0,1] (a lord SHOULD relieve his vassal)
 */

/** The relationship kinds whose bond can, above a floor, open the generosity gate. */
export const QUALIFYING_KINDS = new Set(['allied', 'trade_partner', 'vassal', 'patron', 'client']);

/**
 * Normalize a raw relationship label to the gate's bond-kind vocabulary: lowercased,
 * with the legacy plural 'trade_partners' folded to the canonical singular (the same
 * alias the relationship events' write chokepoint folds — mutateWorld LEGACY_REL_ALIASES;
 * the regional read side is canonicalRelationshipLabel). Kept HERE so the eager handler
 * and the lazy affordance predicate normalize identically (the same-function law).
 * @param {unknown} raw @returns {string}
 */
export function normalizeBondKind(raw) {
  const k = String(raw || '').toLowerCase();
  return k === 'trade_partners' ? 'trade_partner' : k;
}

/**
 * THE §0.1 GATE — is this pair even ASKED the generosity question? True when ANY holds:
 *  - a qualifying relationship kind above BOND_FLOOR (ally / trade-partner⁺ / vassal / patron);
 *  - a live obligation record between them (a standing debt keeps the channel open);
 *  - the conscience exception (a strongly-good, charity-capable giver evaluates even a
 *    non-bonded neighbour at small magnitude — §2.1).
 * A cold pair with none of these is NEVER evaluated (design law 1). Pure, total.
 * @param {Object} args
 * @param {BondRead|null} [args.bond]
 * @param {boolean} [args.hasObligation]           a live obligation record exists between the pair
 * @param {boolean} [args.conscienceException]     the good-aligned charity-roster exception applies
 * @param {number} [args.bondFloor]                the qualifying bond floor (default 0.2)
 * @returns {boolean}
 */
export function qualifiesForGenerosity({ bond = null, hasObligation = false, conscienceException = false, bondFloor = 0.2 } = {}) {
  if (hasObligation === true) return true;
  if (conscienceException === true) return true;
  if (bond && QUALIFYING_KINDS.has(String(bond.kind)) && finiteNumber(bond.strength01, 0) >= bondFloor) return true;
  return false;
}
