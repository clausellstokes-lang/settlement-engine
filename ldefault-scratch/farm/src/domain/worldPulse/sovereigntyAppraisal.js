/**
 * sovereigntyAppraisal.js — WR-10 amendment S: WHAT IS A TOWN WORTH TO THE COURT
 * THAT IS LOOKING AT IT?
 *
 * A settlement has no price. It has as many prices as there are courts with an
 * opinion about it, and amendment S is built on the gap between them: a trade
 * clears when the seller's number and the buyer's number leave room between them,
 * and grinds when they do not. This leaf is ONE court's number and nothing else.
 *
 * K3 GOVERNS (NOBODY IS EVER CURRENT). Amendment S names the appraisal in the list
 * of paths that may never read true world state, so this module is pinned in
 * `envoyK3BeliefSeam.test.js` at the strongest available setting: ZERO IMPORTS. It
 * cannot reach a settlement's population, its stores or its roads because it cannot
 * reach anything at all. Every input arrives as an already-banded word that some
 * belief machinery produced; assembling those words from a court's belief map is a
 * caller's job, never this leaf's. The conquestFeasibility precedent, verbatim.
 *
 * K4 GOVERNS TOO (no merged estimates). `appraiseSettlementAsset` is ONE party's
 * picture. Two parties are TWO CALLS. There is no shared appraisal object anywhere
 * in this module, and the clearing rule that consumes it compares two independently
 * produced numbers rather than averaging them into a third.
 *
 * THE VOCABULARY IS BORROWED WHERE A SPELLING EXISTS (J-WR-10) — and the census that
 * settled each borrow is recorded here rather than asserted, because "borrowed" is a
 * claim about the whole tree:
 *   • TIER      ← `TIER_ORDER` (src/data/constants.js), verbatim, `unknown` prefixed.
 *   • STORES    ← the negotiation picture's `storesBand`, verbatim.
 *   • ROUTE     ← `ROUTE_FLOW_BANDS` (routeNetworkFlows.js), verbatim, `unknown` prefixed.
 *   • SELLER TRAJECTORY ← `WAR_COST_TRAJECTORIES` (warCosts.js), verbatim — the firesale
 *     discount reads a WAR trajectory because amendment S's firesale is a WARTIME one.
 *   • DEMOGRAPHIC TRAJECTORY — MINTED HERE, and that is a judgment on the record. A
 *     growth/decline DIRECTION has no spelling in the tree: `OVERFLOW_BANDS` is a
 *     pressure LEVEL, `WAR_COST_TRAJECTORIES` is a war's direction, and a repo-wide
 *     search for a settlement growth ladder returns nothing. J-WR-10 forbids a SECOND
 *     spelling of an existing concept; it cannot forbid the first spelling of one that
 *     does not exist, and inventing a synonym for OVERFLOW_BANDS would have been the
 *     actual violation. Vetoable, and the ladder is exported so the demographics lane
 *     adopts THIS one rather than minting a rival.
 *
 * `unknown` IS A REAL MEMBER, NEVER A NEUTRAL FACT, and it is load-bearing twice over.
 * A band that is absent, `unknown`, or not a member of its own ladder has NO number —
 * it makes the whole appraisal unknown rather than quietly reading as a midpoint,
 * which is the one translation the finite-semantics law forbids. And because the
 * demographic trajectory is one of the four legs, an appraisal attempted while
 * `demographicsEnabled` is dark comes back UNKNOWN by construction rather than by
 * convention: §3's flag-dependency ruling makes wave-P a LIT-PRECONDITION for WR-10,
 * and this is that ruling expressed as arithmetic instead of as a sentence.
 *
 * LAW B (§1b ABSOLUTE COHERENCE): the read carries an `evidence` record naming every
 * banded state that produced the score, and a `receipt` that says it in words. A
 * scorer whose number cannot be traced back to the beliefs that made it is a number
 * nobody can argue with, which is the opposite of what this engine is for.
 *
 * ⚠ EVERY NUMBER IN `SOVEREIGNTY_APPRAISAL_TUNING` IS AN UNSOAKED BAND. §7 THE TUNING
 * SURFACE owns them and the owner signs them at the soak redo under THE PROMISE. They
 * are authored raw here, deliberately NOT in proposedSoakBands.js — that gate requires
 * status exactly 'RATIFIED', and filing them there would forge a signature this wave
 * has no authority to give.
 *
 * PURE: no rng, no wall-clock, no mutation, no state, no imports. Deterministic over
 * its arguments. Strict-clean.
 */

// ── The borrowed ladders (see the census in the header) ──────────────────────

/** The settlement tier ladder, verbatim from `TIER_ORDER`, with `unknown` prefixed. */
export const SOVEREIGNTY_TIER_BANDS = Object.freeze([
  'unknown', 'thorp', 'hamlet', 'village', 'town', 'city', 'metropolis',
]);

/** The stores ladder, verbatim from the negotiation picture's `storesBand`. */
export const SOVEREIGNTY_STORES_BANDS = Object.freeze([
  'unknown', 'bare', 'thin', 'stocked', 'deep',
]);

/** The route-position ladder, verbatim from `ROUTE_FLOW_BANDS`, `unknown` prefixed. */
export const SOVEREIGNTY_ROUTE_BANDS = Object.freeze([
  'unknown', 'none', 'trace', 'stirring', 'steady', 'established',
]);

/**
 * THE DEMOGRAPHIC TRAJECTORY — minted here (see the header's judgment). A DIRECTION,
 * not a level: `steady` is a town that is neither filling nor emptying, and it sits
 * in the middle because a flat town is genuinely worth less than a growing one and
 * more than a dying one. Amendment S calls this "the future projection", and it is
 * the only leg of the appraisal that prices what the asset is BECOMING.
 */
export const SOVEREIGNTY_TRAJECTORY_BANDS = Object.freeze([
  'unknown', 'emptying', 'ebbing', 'steady', 'growing', 'swelling',
]);

/**
 * The seller's WAR trajectory as the buyer believes it — verbatim
 * `WAR_COST_TRAJECTORIES` with `unknown` prefixed. This is the firesale's only input,
 * and it is optional: a court with no opinion about whether its counterpart is losing
 * simply does not discount, which is different from believing it is winning.
 */
export const SOVEREIGNTY_SELLER_TRAJECTORY_BANDS = Object.freeze([
  'unknown', 'losing', 'even', 'winning',
]);

/** The appraised-value ladder this leaf PRODUCES. `unknown` is never returned by the
 *  banding function — it is the value an unknown READ carries. */
export const SOVEREIGNTY_VALUE_BANDS = Object.freeze([
  'unknown', 'trifling', 'modest', 'substantial', 'great', 'crown_jewel',
]);

// ── The banded inputs, projected onto 0..1 ───────────────────────────────────
//
// `unknown` appears in NO table below. That absence is the mechanism: `bandInput`
// returns null for any word it cannot find, and null propagates to an unknown read.

const TIER_INPUT = Object.freeze({
  thorp: 0.05, hamlet: 0.2, village: 0.4, town: 0.62, city: 0.82, metropolis: 1,
});
const STORES_INPUT = Object.freeze({
  bare: 0.05, thin: 0.3, stocked: 0.65, deep: 0.95,
});
const ROUTE_INPUT = Object.freeze({
  none: 0, trace: 0.2, stirring: 0.45, steady: 0.7, established: 1,
});
const TRAJECTORY_INPUT = Object.freeze({
  emptying: 0, ebbing: 0.25, steady: 0.5, growing: 0.78, swelling: 1,
});

export const SOVEREIGNTY_APPRAISAL_TUNING = Object.freeze({
  // THE FOUR LEGS. Tier dominates because a town is first of all its people; the
  // route position is next because a settlement off every road is a settlement you
  // cannot use; stores and trajectory are the smaller corrections — what it holds
  // now and where it is heading.
  TIER_W: 0.4,
  ROUTE_W: 0.25,
  STORES_W: 0.15,
  TRAJECTORY_W: 0.2,
  // THE FIRESALE (amendment S: "wartime firesales legal, discounted through the
  // buyer's belief of the seller's trajectory"). A court that believes its
  // counterpart is losing prices the asset DOWN, because it believes the seller
  // cannot wait. Applied only on `losing` — `even` and `winning` are not discounts
  // in the other direction, because a desperate BUYER is a different mechanism that
  // amendment S does not name.
  FIRESALE_LOSING_MULT: 0.72,
  // The value ladder's ascending cuts (trifling | modest | substantial | great |
  // crown_jewel). `crown_jewel` is deliberately hard to reach: most towns are not.
  VALUE_MODEST: 0.24,
  VALUE_SUBSTANTIAL: 0.44,
  VALUE_GREAT: 0.66,
  VALUE_CROWN_JEWEL: 0.85,
});

// ── Local primitives (zero imports — the K3 pin's price, paid deliberately) ──
//
// ⚠ THIS FILE IS A REGISTERED EXCEPTION TO THE ONE-CLAMP RULE (chair ruling
// CR-WR10-A(b), 2026-08-04). `scripts/.clamp-primitive-baseline.json` carries a row
// for this module and `tests/lint/clampPrimitiveBaseline.test.js`'s ceiling widened
// 61 → 62 to admit it — the ONE justified widening of a shrink-only ratchet in this
// wave, documented rather than smuggled. THE STRUCTURAL REASON IS THE K3 PIN: this
// module is pinned at ZERO IMPORTS in `tests/domain/envoyK3BeliefSeam.test.js`
// (amendment S names the appraisal among the paths that may never read true world
// state), so it CANNOT import `src/kernel/math.js` without deleting the very pin that
// makes the belief seam real. The sibling that could migrate did: `sovereigntyBundle.js`
// dropped its local copy for the kernel primitive under CR-WR10-A(a).
//
// The local copy is the PASSTHROUGH variant (a non-finite value rides through) rather
// than the kernel's ISFINITE policy. No caller can reach it with one — every argument
// below is either an integer index or a sum of table lookups — but the divergence is
// named here rather than left to be rediscovered, because the baseline's own rule is
// that a copy with divergent non-finite semantics stays frozen until its migration is
// separately proven byte-neutral.

/** @param {number} value @param {number} lo @param {number} hi @returns {number} */
function clamp(value, lo, hi) {
  return value < lo ? lo : value > hi ? hi : value;
}

/** @param {number} value @returns {number} */
function clamp01(value) {
  return clamp(value, 0, 1);
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/**
 * Project one banded word onto its number, or null when the band is `unknown`,
 * absent, or not a member of its own ladder.
 * @param {unknown} band @param {Readonly<Record<string, number>>} table
 * @returns {number | null}
 */
function bandInput(band, table) {
  const word = text(band);
  return Object.prototype.hasOwnProperty.call(table, word) ? table[word] : null;
}

/** The band a 0..1 read falls in. The ladder's first member is `unknown` and is
 *  never returned here. @param {number} value @param {readonly string[]} ladder
 *  @param {readonly number[]} cuts @returns {string} */
function bandOf(value, ladder, cuts) {
  let index = 1;
  for (let i = 0; i < cuts.length; i += 1) {
    if (value >= cuts[i]) index = i + 2;
  }
  return ladder[clamp(index, 1, ladder.length - 1)];
}

/** The word a caller handed us, normalized to a ladder member for the receipt.
 *  @param {unknown} band @param {readonly string[]} ladder @returns {string} */
function wordOf(band, ladder) {
  const word = text(band);
  return ladder.indexOf(word) > 0 ? word : 'unknown';
}

/**
 * @typedef {Object} SovereigntyAppraisalEvidence
 * @property {string} tierBand
 * @property {string} storesBand
 * @property {string} routeBand
 * @property {string} trajectoryBand
 * @property {string} sellerTrajectoryBand
 * @property {boolean} firesaleApplied
 */

/**
 * @typedef {Object} SovereigntyAppraisal
 * @property {string} assetId
 * @property {string} appraiserId
 * @property {boolean} known
 * @property {number|null} value01     this court's own-lens valuation of the asset
 * @property {string} valueBand        a SOVEREIGNTY_VALUE_BANDS member
 * @property {SovereigntyAppraisalEvidence} evidence  LAW B: the state that made the score
 * @property {string} receipt
 */

/**
 * THE UNKNOWN APPRAISAL. Every field a caller might branch on is present and honest:
 * the number is null (not zero), the band is `unknown`, the evidence still names what
 * was and was not heard, and the receipt says why. A consumer that treats this as "no
 * trade" is correct; a consumer that treats it as "worthless" is WRONG, and the null
 * rather than a zero is what stops it.
 * @param {string} assetId @param {string} appraiserId @param {string} why
 * @param {SovereigntyAppraisalEvidence} evidence
 * @returns {SovereigntyAppraisal}
 */
function unknownAppraisal(assetId, appraiserId, why, evidence) {
  return {
    assetId,
    appraiserId,
    known: false,
    value01: null,
    valueBand: 'unknown',
    evidence,
    receipt: `${appraiserId || 'the court'} cannot price ${assetId || 'the holding'}: ${why}.`,
  };
}

/**
 * APPRAISE ONE SETTLEMENT ASSET THROUGH ONE COURT'S OWN PICTURE (amendment S,
 * "Valuation (K3 governs)").
 *
 * Four banded legs — believed tier, believed stores, believed route position, and the
 * believed demographic trajectory — compose into one 0..1 number and one word. A
 * caller that wants both sides of a trade calls this TWICE with two different courts'
 * pictures; there is no two-party form, and that is the K4 ruling rather than an
 * omission.
 *
 * ANY missing leg returns an unknown appraisal. That is strictest-reading deliberate:
 * amendment S prices a town on what a court believes about it, and a court that has
 * not heard three of the four things has not formed a price — it has formed a guess,
 * and a guess that reads as a number is how a belief engine quietly becomes an
 * omniscient one.
 *
 * @param {{
 *   assetId?: unknown, appraiserId?: unknown,
 *   tierBand?: unknown, storesBand?: unknown, routeBand?: unknown,
 *   trajectoryBand?: unknown, sellerTrajectoryBand?: unknown,
 * }} input
 * @returns {SovereigntyAppraisal}
 */
export function appraiseSettlementAsset(input) {
  const row = recordOf(input);
  const assetId = text(row.assetId);
  const appraiserId = text(row.appraiserId);

  const tierWord = wordOf(row.tierBand, SOVEREIGNTY_TIER_BANDS);
  const storesWord = wordOf(row.storesBand, SOVEREIGNTY_STORES_BANDS);
  const routeWord = wordOf(row.routeBand, SOVEREIGNTY_ROUTE_BANDS);
  const trajectoryWord = wordOf(row.trajectoryBand, SOVEREIGNTY_TRAJECTORY_BANDS);
  const sellerWord = wordOf(row.sellerTrajectoryBand, SOVEREIGNTY_SELLER_TRAJECTORY_BANDS);
  const firesale = sellerWord === 'losing';

  /** @type {SovereigntyAppraisalEvidence} */
  const evidence = {
    tierBand: tierWord,
    storesBand: storesWord,
    routeBand: routeWord,
    trajectoryBand: trajectoryWord,
    sellerTrajectoryBand: sellerWord,
    firesaleApplied: false,
  };

  if (!assetId || !appraiserId || assetId === appraiserId) {
    return unknownAppraisal(assetId, appraiserId, 'the pair is not an asset and a court', evidence);
  }

  const tier = bandInput(tierWord, TIER_INPUT);
  const stores = bandInput(storesWord, STORES_INPUT);
  const route = bandInput(routeWord, ROUTE_INPUT);
  const trajectory = bandInput(trajectoryWord, TRAJECTORY_INPUT);

  if (tier == null) {
    return unknownAppraisal(assetId, appraiserId, 'it has not heard how large the place is', evidence);
  }
  if (stores == null) {
    return unknownAppraisal(assetId, appraiserId, 'it cannot read what the place holds', evidence);
  }
  if (route == null) {
    return unknownAppraisal(assetId, appraiserId, 'it does not know what roads the place sits on', evidence);
  }
  if (trajectory == null) {
    // The demographicsEnabled lit-precondition, expressed as arithmetic: with wave-P
    // dark there is no trajectory to hear, so there is no price to name.
    return unknownAppraisal(assetId, appraiserId, 'it cannot see whether the place is filling or emptying', evidence);
  }

  const T = SOVEREIGNTY_APPRAISAL_TUNING;
  const composite = clamp01(
    tier * T.TIER_W + route * T.ROUTE_W + stores * T.STORES_W + trajectory * T.TRAJECTORY_W,
  );
  const value01 = round4(firesale ? clamp01(composite * T.FIRESALE_LOSING_MULT) : composite);
  const valueBand = bandOf(
    value01,
    SOVEREIGNTY_VALUE_BANDS,
    [T.VALUE_MODEST, T.VALUE_SUBSTANTIAL, T.VALUE_GREAT, T.VALUE_CROWN_JEWEL],
  );
  evidence.firesaleApplied = firesale;

  const firesaleClause = firesale
    ? `, discounted because it believes the holder is losing its war`
    : '';
  // THE RECEIPT NAMES THE BAND, NEVER THE SCALAR (addendum A-1's prose-numerics law
  // and the GAME-GRADE TRANSLATE doctrine, which agree here): `value01` is the
  // engine's own notation and a reader has no use for `0.6382`. The number is not
  // hidden — it is on the read as `value01`, next to the `evidence` record — so LAW B's
  // traceability is intact; what changes is that the SENTENCE speaks the world's
  // vocabulary. The band comes from `valueBand`, which was already computed above from
  // this same `value01`, so the prose and the field can never disagree.
  return {
    assetId,
    appraiserId,
    known: true,
    value01,
    valueBand,
    evidence,
    receipt: `${appraiserId} prices ${assetId} as a ${sovereigntyBandPhrase(valueBand)} holding`
      + ` from a ${tierWord} seat with ${storesWord} stores on ${routeWord} roads,`
      + ` ${trajectoryWord}${firesaleClause}.`,
  };
}

/**
 * A LADDER WORD SPELLED AS READER PROSE. The ladders are closed snake_case tokens
 * because a vocabulary must be exact; a receipt is a sentence, and the GAME-GRADE law
 * forbids showing a reader the token (`crown_jewel` is the only member this currently
 * touches). Exported rather than re-declared in `sovereigntyBundle.js` for the reason
 * `sovereigntyValueBand` is: one spelling of one thing, so the two modules' receipts
 * cannot drift apart. It is a pure spelling — it never re-derives the band it is given.
 * @param {string} band @returns {string}
 */
export function sovereigntyBandPhrase(band) {
  return String(band).replace(/_/g, ' ');
}

/**
 * The band a bare 0..1 valuation falls in — exported so the bundle stacker and any
 * later Herald voice speak the SAME ladder as the appraisal rather than re-cutting it.
 * Returns `unknown` for a null/non-finite read, which is the honest word for a court
 * that has not priced the thing.
 * @param {unknown} value01 @returns {string}
 */
export function sovereigntyValueBand(value01) {
  const n = Number(value01);
  if (value01 == null || !Number.isFinite(n)) return 'unknown';
  const T = SOVEREIGNTY_APPRAISAL_TUNING;
  return bandOf(
    clamp01(n),
    SOVEREIGNTY_VALUE_BANDS,
    [T.VALUE_MODEST, T.VALUE_SUBSTANTIAL, T.VALUE_GREAT, T.VALUE_CROWN_JEWEL],
  );
}
