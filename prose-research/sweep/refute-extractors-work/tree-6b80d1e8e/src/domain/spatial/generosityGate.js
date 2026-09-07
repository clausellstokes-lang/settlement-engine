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
 * FIRST-PAINT LAW: this leaf is EAGER — it is in the first-paint static closure — so it
 * may never pull anything NEW into that closure. RN-B1 gives it its one dependency, and
 * the rule is honoured rather than waived: `canonicalRelationship.js` is ALREADY in the
 * entry chunk (measured in the built dist — both modules' literals live in the same
 * `assets/index-*.js`), so the edge costs ZERO first-paint bytes. The budget guard below
 * is the enforcer and it was re-run against a real build for this change. Never add a
 * dependency that is not already eager; never raise the budget to fit one.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */
import { canonicalRelationshipLabel } from '../relationships/canonicalRelationship.js';

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
 * Normalize a raw relationship label to the gate's bond-kind vocabulary: lowercased, and
 * routed through the CANONICAL resolver. Kept HERE so the eager handler and the lazy
 * affordance predicate normalize identically (the same-function law).
 *
 * ⛔ RN-B1 / G2 (ODQ §66.2, SIGNED). This used to fold exactly ONE spelling by hand
 * (`trade_partners`), so a persisted edge carrying any other legacy spelling of a
 * QUALIFYING kind was read as NON-qualifying and the generosity question was never even
 * asked of it. §66.2 named three such spellings; measured at the base, the population is
 * FIVE — `ally`, `allies`, `trade`, `liege`, `overlord` — every one of which the canonical
 * table already resolves to a qualifying label. Routing cures all five with ZERO content
 * widening; the mechanism is the ruling's, the wider population is this train's measurement.
 *
 * The hand-rolled fold is REPLACED rather than kept beside the router, because two
 * normalizers on one plane is the exact drift rn-1 exists to end. `trade_partners` still
 * folds — the canonical table carries it — so no behaviour it used to have is lost.
 * @param {unknown} raw @returns {string}
 */
export function normalizeBondKind(raw) {
  return canonicalRelationshipLabel(String(raw || '')).toLowerCase();
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
