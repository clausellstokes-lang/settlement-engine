/**
 * demographicsWorks.js — WAVE P3, WHAT A COMPLETED PLAN LEAVES BEHIND.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §5 (the overflow responses) and acceptance claim
 * 3 ("capacity expansion produces RENEWED bounded growth — stepwise history, NOT a
 * flat plateau") are this file's contract.
 *
 * ── WHY THIS IS ITS OWN LEAF AND NOT PART OF THE PLAN WRITER ────────────────
 * An import cycle, and a real one. The plan writer must read the settlement's THREE
 * READINGS, which live in demographicsPushPull.js, which reads demographicsRates.js.
 * If the bound and the food capacity in demographicsRates then read the completed
 * works back off the plan writer, the family closes a loop: rates -> plans ->
 * pushPull -> rates. This leaf breaks it by owning the ledger's NAME, the works
 * vocabulary and the effect arithmetic, and by importing nothing from the family at
 * all. Both sides read ONE writer for what a finished aqueduct is worth.
 *
 * ── A WORK RAISES A BOUND; IT NEVER MINTS A PERSON (law 4) ──────────────────
 * Every effect here moves a CEILING — how many can be housed, how many can be fed,
 * how readily people leave. Not one of them adds or removes a soul, so the wave's
 * conservation check is untouched by construction: a settlement that finishes an
 * aqueduct is not larger the next morning, it is merely allowed to become larger,
 * and the rates then take it there at their own speed. That is exactly the stepwise
 * history acceptance claim 3 asks for and a plateau criterion would have forbidden.
 *
 * ── BOUNDED, BANDED, AND CAPPED ────────────────────────────────────────────
 * A settlement may bank at most WORKS_CAP of each kind, so the ceiling cannot be
 * walked upward forever by a town that simply keeps planning: the map's ground and
 * the granary's flow remain the realm's real limits (§5b, law 2). Every dial is a
 * closed authored table; design §10 tuning-pass property.
 *
 * Pure leaf: no store, no React, no clock, no randomness, no I/O, no writes.
 *
 * @enforced-by tests/domain/demographicsPlans.test.js
 */

/**
 * THE LEDGER'S NAME, declared once. Both the writer (demographicsPlans.js) and every
 * reader take it from here, so the key can never be spelled two ways — the
 * writer/reader payload-spelling drift that has already cost this tree a feature's
 * whole lifetime.
 */
export const DEMOGRAPHIC_PLANS_LEDGER = 'demographicPlans';

/**
 * THE CLOSED WORKS VOCABULARY, codepoint-ordered. Three of the six responses leave a
 * lasting mark; `promotion` deliberately leaves none (the tier ladder is the EXISTING
 * conserved path and this wave adds no second writer to it), `satellite` leaves a
 * steading rather than a work, and `send` is finished the moment it is chosen.
 * @type {ReadonlyArray<string>}
 */
export const WORKS_KINDS = Object.freeze(['emigration', 'imports', 'infrastructure']);

export const WORKS_TUNING = Object.freeze({
  /** How many of each kind a settlement may bank. Three is the whole ladder: a place
   *  that has built its wells, its wharves and its walls has spent what a settlement
   *  of its grade can spend, and the ground and the granary bind again. */
  WORKS_CAP: 3,
  /** Each completed public work raises the density ceiling by this share. Three of
   *  them are worth a quarter again as much room — real, and nowhere near a tier. */
  INFRASTRUCTURE_STEP: 0.08,
  /** Each standing import arrangement raises what the roads bring by this share of
   *  the generated channel. It raises the IMPORT side only: local production is the
   *  fields' own physics and no policy grows grain. */
  IMPORT_STEP: 0.10,
  /** Each emigration policy adds this much to the departure rate's own push term.
   *  Capped at one whole push by the cap above, so a settlement can encourage its
   *  people to leave and never conscript them onto the road. */
  ENCOURAGEMENT_STEP: 0.25,
});

const T = WORKS_TUNING;

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * @typedef {Object} CompletedWorks
 * @property {number} emigration
 * @property {number} imports
 * @property {number} infrastructure
 */

/**
 * THE COMPLETED WORKS of one settlement, read straight off the plan ledger.
 *
 * TOTAL AND ABSENT-TOLERANT by contract: no ledger, no entry, or a ragged entry all
 * read as zero of everything, which is what makes every consumer below a no-op on a
 * dark or dormant world without a second gate of its own.
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} settlementId
 * @returns {CompletedWorks}
 */
export function worksOf(worldState, settlementId) {
  const ledger = asObject(asObject(asObject(worldState).spatialLedgers)[DEMOGRAPHIC_PLANS_LEDGER]);
  const works = asObject(asObject(ledger[String(settlementId)]).works);
  return {
    emigration: Math.max(0, Math.min(T.WORKS_CAP, Math.floor(num(works.emigration, 0)))),
    imports: Math.max(0, Math.min(T.WORKS_CAP, Math.floor(num(works.imports, 0)))),
    infrastructure: Math.max(0, Math.min(T.WORKS_CAP, Math.floor(num(works.infrastructure, 0)))),
  };
}

/**
 * THE DENSITY-CEILING FACTOR a settlement's public works have earned. Always at
 * least 1, so a settlement with no works reads its authored ceiling verbatim and
 * every P1 number is byte-identical without works.
 * @param {Record<string, unknown>|null|undefined} worldState @param {string} settlementId
 * @returns {number}
 */
export function infrastructureFactorOf(worldState, settlementId) {
  return 1 + T.INFRASTRUCTURE_STEP * worksOf(worldState, settlementId).infrastructure;
}

/**
 * THE IMPORT FACTOR a settlement's standing arrangements have earned. Always at
 * least 1 (see above). Multiplies the import side of K_food and NEVER the local
 * production side: law 2 says food is the cap, and a treaty does not make a field.
 * @param {Record<string, unknown>|null|undefined} worldState @param {string} settlementId
 * @returns {number}
 */
export function importFactorOf(worldState, settlementId) {
  return 1 + T.IMPORT_STEP * worksOf(worldState, settlementId).imports;
}

/**
 * HOW HARD A SETTLEMENT IS PUSHING ITS OWN PEOPLE OUT, 0 to 1. Read by the
 * homeostat's departure rate as an ADDITIONAL push term, never as a replacement for
 * one: a settlement with no grievance and a standing emigration policy still sits
 * under the departure floor and sheds nobody, because a policy is a permission and
 * not a reason.
 * @param {Record<string, unknown>|null|undefined} worldState @param {string} settlementId
 * @returns {number}
 */
export function encouragement01Of(worldState, settlementId) {
  const n = worksOf(worldState, settlementId).emigration;
  return Math.max(0, Math.min(1, T.ENCOURAGEMENT_STEP * n));
}
