/**
 * conquestFeasibility.js — WR-8 amendment N2: THE FEASIBILITY BELIEF COMPOSITE.
 *
 * A court does not march on what it can take. It marches on what it BELIEVES it
 * can take. This leaf is that belief and nothing else: a pure composite over
 * three closed banded reads — believed relative strength, believed coalition
 * reach, believed home-front reserves — from which four consumers draw (motive,
 * movement, the terms range, and the K.6 vote), plus the two characterful reads
 * the amendment names by hand (the collapse of a seat's two books under an
 * existential threat, and the post-hoc receipt of a court that was WRONG).
 *
 * K3 GOVERNS (NOBODY IS EVER CURRENT). Feasibility is named explicitly in the
 * amendment's list of paths that may never read true world state, so this module
 * is pinned in `envoyK3BeliefSeam.test.js` at the strongest available setting:
 * ZERO IMPORTS. It cannot reach a settlement's strength, its stores or its
 * pressures because it cannot reach anything at all. Every input arrives as an
 * already-banded word that some belief machinery produced; assembling those
 * words from a court's belief map is the STAGE's job (conquestDoctrineStage.js),
 * never this leaf's.
 *
 * K4 GOVERNS TOO (no merged estimates). Every read here is ONE PARTY'S picture.
 * Two parties are two calls; there is no shared feasibility object anywhere, and
 * `termsRangesOverlap` compares two independently-produced ranges rather than
 * averaging them into a third.
 *
 * THE VOCABULARY IS BORROWED, NOT MINTED (J-WR-10). The band ladders below are
 * the negotiation picture's own spellings — the strength ladder and the pressure
 * ladder, verbatim — so an envoy's frozen snapshot and a court's conquest read
 * speak one language and a value can move between them without translation.
 *
 * THE ASYMMETRY IS THE POINT. Believing you may BE conquered moves behaviour
 * further than believing you might conquer: the first is existential, the second
 * merely attractive. That is a BAND (`EXISTENTIAL_WEIGHT` over
 * `ATTRACTIVE_WEIGHT`), it is directional, and it is pinned on a mirrored state
 * pair — otherwise it is a number nobody checked.
 *
 * PURE: no rng, no wall-clock, no mutation, no state. Deterministic over its
 * arguments. Strict-clean. No React/Zustand imports, and no imports at all.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ THE UNWIRED LEDGER (lane W8-C, findings F4/F5) — DELIBERATELY DEFERRED,
 * DOCUMENTED, NOT A BUG TO RE-FIND. Four exports below have no production
 * consumer yet. They are recorded here BY NAME with the consumer each is owed,
 * so a later dead-code sweep reads a deferral rather than rediscovering rot:
 *
 *   `conquestMotivePressure01`  → CONSUMER 1 (motive). Owed to the sue-for-peace
 *       / war-continuation weighting: "a realm that believes it could take
 *       everything has little reason to settle for less."
 *   `conquestTermsRange` + `termsRangesOverlap` → CONSUMER 3 (the bargaining
 *       range). Owed to the peace-terms path. THE GRIND — two courts whose
 *       independently-built ranges do not overlap, receipted rather than errored —
 *       is the amendment's sharpest framing and is already written and pinned
 *       both ways; it is waiting for its seam, not for its design.
 *   `collapseSeatBooksUnderThreat` → the war-seat books. This is the subject of
 *       one of the THREE pins the amendment requested BY HAND (the books-collapse
 *       fixture), which is why it is kept rather than swept.
 *
 * ONE EXPORT WAS DELETED RATHER THAN DEFERRED, and the distinction is the whole
 * point: `conquestVoteWeight01` (CONSUMER 4, the K.6 vote) is GONE. It was not
 * merely unwired — it was a SECOND ANSWER to a question chair ruling CR-WIRE-A
 * had already closed in the other direction. The live ratification vote derives
 * its power band from the member's own frozen negotiation PICTURE, enforced by a
 * source scan over all three derivations, and a same-named second derivation
 * sitting here unwired is exactly the fork that gets picked up by the next hand
 * and quietly re-opens a settled ruling. A deferral is a thing waiting for its
 * consumer; a fork is a thing whose consumer already exists and chose otherwise.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * The strength ladder, verbatim from the negotiation picture's `strengthBand`.
 * `unknown` is a real member, never a neutral fact: a court that has not heard
 * has not concluded.
 */
export const CONQUEST_STRENGTH_BANDS = Object.freeze([
  'unknown', 'spent', 'strained', 'ready', 'strong', 'dominant',
]);

/**
 * The pressure ladder, verbatim from the negotiation picture's `allyStrengthBand`
 * and its siblings. Coalition reach and war exhaustion both read on it.
 */
export const CONQUEST_PRESSURE_BANDS = Object.freeze([
  'unknown', 'quiet', 'present', 'pressing', 'decisive',
]);

/** The stores ladder, verbatim from the negotiation picture's `storesBand`. */
export const CONQUEST_STORES_BANDS = Object.freeze([
  'unknown', 'bare', 'thin', 'stocked', 'deep',
]);

/**
 * THE TWO OUTPUT LADDERS. Both are new WORDS for a new read, not new
 * relationship vocabulary: nothing here names an edge, an axis or a treaty.
 */
export const CONQUEST_REACH_BANDS = Object.freeze([
  'unknown', 'out_of_reach', 'contested', 'within_reach', 'assured',
]);

export const CONQUEST_THREAT_BANDS = Object.freeze([
  'unknown', 'safe', 'pressed', 'imperilled', 'existential',
]);

/**
 * The banded inputs, projected onto 0..1. `unknown` has NO number: a missing
 * observation makes the whole read unknown rather than quietly reading as a
 * midpoint, which is the one translation the finite-semantics law forbids.
 */
const STRENGTH_INPUT = Object.freeze({
  spent: 0.1, strained: 0.3, ready: 0.5, strong: 0.7, dominant: 0.9,
});
const PRESSURE_INPUT = Object.freeze({
  quiet: 0, present: 0.3333, pressing: 0.6667, decisive: 1,
});
const STORES_INPUT = Object.freeze({
  bare: 0.05, thin: 0.3, stocked: 0.65, deep: 0.95,
});

export const CONQUEST_FEASIBILITY_TUNING = Object.freeze({
  // The three legs of the composite. Strength dominates — an army is the first
  // fact — but a court with no allies and an empty granary does not march on a
  // strength edge alone, which is what the other two legs are for.
  STRENGTH_W: 0.5,
  COALITION_W: 0.25,
  RESERVES_W: 0.25,
  // Home-front reserves are stores MINUS exhaustion: a deep granary in a realm
  // four years into a war is not a reserve, it is the last of one.
  EXHAUSTION_W: 0.6,
  // THE ASYMMETRY BAND (N2, stated in the amendment and pinned directionally).
  // The same composite magnitude moves behaviour further when it points at
  // being conquered than when it points at conquering.
  ATTRACTIVE_WEIGHT: 0.6,
  EXISTENTIAL_WEIGHT: 1,
  // The reach ladder's cuts. `assured` is deliberately hard to reach: the
  // overwhelming gate downstream (amendment N) is what actually opens a
  // conquest, and a belief that flatters itself must still meet it.
  REACH_CONTESTED: 0.4,
  REACH_WITHIN: 0.6,
  REACH_ASSURED: 0.82,
  // The threat ladder's cuts, deliberately EARLIER than the reach ladder's: a
  // court smells its own destruction before it smells someone else's.
  THREAT_PRESSED: 0.32,
  THREAT_IMPERILLED: 0.52,
  THREAT_EXISTENTIAL: 0.72,
  // The K.6 vote's belief-side weight floor. A member who believes nothing
  // still has a voice; it is simply not a loud one.
  VOTE_FLOOR: 0.2,
  // THE BOOKS COLLAPSE (N2). At/above this existential read a seat stops
  // keeping two books: the ruler's private interest and the realm's converge,
  // because a ruler of ashes rules nothing. The collapse is PROPORTIONAL, so
  // the fixture can show the two books diverging below the band and choosing
  // alike above it.
  BOOKS_COLLAPSE_FLOOR: 0.72,
});

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
 * absent or not a member of its own ladder. Null is load-bearing: it propagates
 * to an unknown READ rather than to a neutral one.
 * @param {unknown} band
 * @param {Readonly<Record<string, number>>} table
 * @returns {number | null}
 */
function bandInput(band, table) {
  const word = text(band);
  return Object.prototype.hasOwnProperty.call(table, word) ? table[word] : null;
}

/**
 * The band a 0..1 read falls in, given a ladder and its ascending cuts. The
 * ladder's first member is always `unknown` and is never returned here.
 * @param {number} value
 * @param {readonly string[]} ladder
 * @param {readonly number[]} cuts
 * @returns {string}
 */
function bandOf(value, ladder, cuts) {
  let index = 1;
  for (let i = 0; i < cuts.length; i += 1) {
    if (value >= cuts[i]) index = i + 2;
  }
  return ladder[clamp(index, 1, ladder.length - 1)];
}

/**
 * THE UNKNOWN READ. Every field a caller might branch on is present and honest:
 * the numbers are null (not zero), the bands are `unknown`, and the receipt says
 * why. A consumer that treats this as "no conquest" is correct; a consumer that
 * treats it as "safe" is also correct, because a court that has not heard has
 * not concluded either way.
 * @param {string} partyId @param {string} counterpartId @param {string} why
 * @returns {ConquestFeasibilityRead}
 */
function unknownRead(partyId, counterpartId, why) {
  return {
    partyId,
    counterpartId,
    known: false,
    believedRelativeStrength01: null,
    believedCoalitionReach01: null,
    believedHomeFrontReserves01: null,
    conquestReach01: null,
    conquestReachBand: 'unknown',
    beingConqueredRisk01: null,
    threatBand: 'unknown',
    behaviouralWeight01: null,
    receipt: `${partyId || 'the court'} cannot judge a conquest of ${counterpartId || 'its rival'}: ${why}.`,
  };
}

/**
 * @typedef {Object} ConquestFeasibilityRead
 * @property {string} partyId
 * @property {string} counterpartId
 * @property {boolean} known
 * @property {number|null} believedRelativeStrength01
 * @property {number|null} believedCoalitionReach01
 * @property {number|null} believedHomeFrontReserves01
 * @property {number|null} conquestReach01
 * @property {string} conquestReachBand
 * @property {number|null} beingConqueredRisk01
 * @property {string} threatBand
 * @property {number|null} behaviouralWeight01
 * @property {string} receipt
 */

/**
 * READ ONE PARTY'S FEASIBILITY BELIEF. Both directions come out of the one call
 * because they come out of the one picture: the same three legs, read once
 * pointing outward (could I take them) and once pointing inward (could they take
 * me). Nothing here is merged with the counterpart's own read — that would be
 * the K4 violation — and the counterpart's legs are the party's BELIEFS about
 * the counterpart, which is the whole point.
 *
 * @param {{
 *   partyId?: unknown, counterpartId?: unknown,
 *   ownStrengthBand?: unknown, rivalStrengthBand?: unknown,
 *   ownAllyStrengthBand?: unknown, rivalAllyStrengthBand?: unknown,
 *   ownStoresBand?: unknown, ownWarExhaustionBand?: unknown,
 * }} input
 * @returns {ConquestFeasibilityRead}
 */
export function readConquestFeasibility(input) {
  const row = recordOf(input);
  const partyId = text(row.partyId);
  const counterpartId = text(row.counterpartId);
  if (!partyId || !counterpartId || partyId === counterpartId) {
    return unknownRead(partyId, counterpartId, 'the pair is not two named settlements');
  }
  const ownStrength = bandInput(row.ownStrengthBand, STRENGTH_INPUT);
  const rivalStrength = bandInput(row.rivalStrengthBand, STRENGTH_INPUT);
  if (ownStrength == null || rivalStrength == null) {
    return unknownRead(partyId, counterpartId, 'it has no strength reading for one of the two armies');
  }
  const ownAllies = bandInput(row.ownAllyStrengthBand, PRESSURE_INPUT);
  const rivalAllies = bandInput(row.rivalAllyStrengthBand, PRESSURE_INPUT);
  if (ownAllies == null || rivalAllies == null) {
    return unknownRead(partyId, counterpartId, 'it has not heard who would march beside either side');
  }
  const stores = bandInput(row.ownStoresBand, STORES_INPUT);
  const exhaustion = bandInput(row.ownWarExhaustionBand, PRESSURE_INPUT);
  if (stores == null || exhaustion == null) {
    return unknownRead(partyId, counterpartId, 'it cannot read its own stores or its own weariness');
  }

  const T = CONQUEST_FEASIBILITY_TUNING;
  // Each leg is a 0..1 EDGE: 0.5 is parity, above is mine, below is theirs.
  const strengthEdge = clamp01(0.5 + (ownStrength - rivalStrength) / 2);
  const coalitionEdge = clamp01(0.5 + (ownAllies - rivalAllies) / 2);
  // Reserves are the one leg with no counterpart term: a court knows its own
  // granary far better than anyone else's, and pretending otherwise would smuggle
  // a truth read in through a belief it has no source for.
  const reserves = clamp01(stores * (1 - T.EXHAUSTION_W * exhaustion));

  const conquestReach01 = round4(clamp01(
    T.STRENGTH_W * strengthEdge + T.COALITION_W * coalitionEdge + T.RESERVES_W * reserves,
  ));
  // The inward read is NOT one minus the outward one. It inverts the two edges
  // (their army against mine, their friends against mine) but keeps reserves in
  // the same direction, because a full granary makes a siege survivable exactly
  // as it makes one sustainable.
  const beingConqueredRisk01 = round4(clamp01(
    T.STRENGTH_W * (1 - strengthEdge)
    + T.COALITION_W * (1 - coalitionEdge)
    + T.RESERVES_W * (1 - reserves),
  ));

  const conquestReachBand = bandOf(conquestReach01, CONQUEST_REACH_BANDS, [
    T.REACH_CONTESTED, T.REACH_WITHIN, T.REACH_ASSURED,
  ]);
  const threatBand = bandOf(beingConqueredRisk01, CONQUEST_THREAT_BANDS, [
    T.THREAT_PRESSED, T.THREAT_IMPERILLED, T.THREAT_EXISTENTIAL,
  ]);
  // THE ASYMMETRY, applied once, here, so every consumer inherits it rather than
  // each re-deciding how frightened a court should be.
  const behaviouralWeight01 = round4(clamp01(Math.max(
    conquestReach01 * T.ATTRACTIVE_WEIGHT,
    beingConqueredRisk01 * T.EXISTENTIAL_WEIGHT,
  )));

  return {
    partyId,
    counterpartId,
    known: true,
    believedRelativeStrength01: round4(strengthEdge),
    believedCoalitionReach01: round4(coalitionEdge),
    believedHomeFrontReserves01: round4(reserves),
    conquestReach01,
    conquestReachBand,
    beingConqueredRisk01,
    threatBand,
    behaviouralWeight01,
    receipt: `${partyId} believes a conquest of ${counterpartId} is ${conquestReachBand.split('_').join(' ')}`
      + ` and its own position ${threatBand}`
      + ` (armies ${text(row.ownStrengthBand)} against ${text(row.rivalStrengthBand)},`
      + ` allies ${text(row.ownAllyStrengthBand)} against ${text(row.rivalAllyStrengthBand)},`
      + ` stores ${text(row.ownStoresBand)} under ${text(row.ownWarExhaustionBand)} weariness).`,
  };
}

// ── THE FOUR CONSUMERS ───────────────────────────────────────────────────────

/**
 * CONSUMER 1 — MOTIVE. How hard this belief pushes the court toward war at all,
 * in either direction: the attractive pull of a reachable conquest, or the
 * existential shove of one coming the other way. Unknown reads exert NO pressure
 * (null, not zero) so a caller cannot mistake ignorance for calm.
 * @param {ConquestFeasibilityRead|null|undefined} read @returns {number|null}
 */
export function conquestMotivePressure01(read) {
  const row = recordOf(read);
  return row.known === true && typeof row.behaviouralWeight01 === 'number'
    ? row.behaviouralWeight01
    : null;
}

/**
 * CONSUMER 2 — MOVEMENT. Armies march on settlements when conquest is BELIEVED
 * in reach. This is the campaign-shape change the amendment names: the read is
 * what orders the candidate list, and the receipt is what says why the column
 * went where it went. A defensive court under existential threat does NOT march
 * out — it is exactly the case the asymmetry band exists to distinguish.
 * @param {ConquestFeasibilityRead|null|undefined} read @returns {boolean}
 */
export function conquestMarchAdvised(read) {
  const row = recordOf(read);
  if (row.known !== true) return false;
  if (row.threatBand === 'existential') return false;
  return row.conquestReachBand === 'within_reach' || row.conquestReachBand === 'assured';
}

/**
 * @typedef {Object} ConquestTermsRange
 * @property {string} partyId
 * @property {number|null} takeByForce01   what this court believes it could TAKE
 * @property {number|null} mustGiveToSurvive01  what it believes it must GIVE
 * @property {boolean} known
 * @property {string} receipt
 */

/**
 * CONSUMER 3 — THE BARGAINING RANGE. Both ends are beliefs and both come from
 * the same read: the ceiling is what force could win, the floor is what survival
 * costs. A court that believes itself strong has a high ceiling and a floor at
 * nothing; a court that believes itself doomed has a floor that may sit ABOVE
 * its own ceiling, which is the honest shape of desperation.
 * @param {ConquestFeasibilityRead|null|undefined} read @returns {ConquestTermsRange}
 */
export function conquestTermsRange(read) {
  const row = recordOf(read);
  const partyId = text(row.partyId);
  if (row.known !== true
    || typeof row.conquestReach01 !== 'number'
    || typeof row.beingConqueredRisk01 !== 'number') {
    return {
      partyId,
      takeByForce01: null,
      mustGiveToSurvive01: null,
      known: false,
      receipt: `${partyId || 'the court'} has no bargaining range: it cannot judge the war.`,
    };
  }
  const takeByForce01 = round4(row.conquestReach01);
  const mustGiveToSurvive01 = round4(row.beingConqueredRisk01);
  return {
    partyId,
    takeByForce01,
    mustGiveToSurvive01,
    known: true,
    receipt: `${partyId} believes it could take ${takeByForce01} by force`
      + ` and must give ${mustGiveToSurvive01} to survive.`,
  };
}

/**
 * DO TWO INDEPENDENTLY-BUILT RANGES OVERLAP? A deal exists only where each side's
 * DEMAND fits inside the other's CONCESSION: what A believes it could take must
 * not exceed what B believes it must give, and the mirror. Two courts that both
 * believe themselves the stronger therefore do NOT overlap — each demands more
 * than the other will concede — which is the mutual-overestimate war the
 * amendment is describing. NON-OVERLAP IS NOT AN ERROR: it is THE GRIND, and it
 * is receipted as such, because a war that continues because neither side can see
 * the other's arithmetic is the characterful outcome, not a failure of the
 * machinery.
 *
 * No merged estimate is formed (K4): the two ranges are compared, never averaged.
 * @param {ConquestTermsRange|null|undefined} left
 * @param {ConquestTermsRange|null|undefined} right
 * @returns {{ overlaps: boolean, known: boolean, receipt: string }}
 */
export function termsRangesOverlap(left, right) {
  const a = recordOf(left);
  const b = recordOf(right);
  if (a.known !== true || b.known !== true) {
    return {
      overlaps: false,
      known: false,
      receipt: 'neither side can price the war, so no range can be compared.',
    };
  }
  const aGive = Number(a.mustGiveToSurvive01);
  const aTake = Number(a.takeByForce01);
  const bGive = Number(b.mustGiveToSurvive01);
  const bTake = Number(b.takeByForce01);
  const overlaps = aTake <= bGive && bTake <= aGive;
  const names = `${text(a.partyId) || 'one side'} and ${text(b.partyId) || 'the other'}`;
  return {
    overlaps,
    known: true,
    receipt: overlaps
      ? `${names} price the war compatibly; a settlement exists between them.`
      : `${names} do not: each believes it could take more than the other believes it must give, and the war grinds on.`,
  };
}

// ── CONSUMER 4 (THE K.6 VOTE) IS NOT HERE, AND THAT IS THE RULING ────────────
//
// `conquestVoteWeight01` stood here and was DELETED by lane W8-C under chair
// ruling CR-WIRE-A, which had already answered this exact question in the other
// direction BEFORE this function was written: a coalition member's weight in the
// ratification vote is derived from the member's OWN FROZEN NEGOTIATION PICTURE,
// through `envoyRatificationStage`'s single derivation, and that derivation's
// one-argument signature is enforced by a source scan precisely so no second
// channel can appear. This function was that second channel. See the UNWIRED
// LEDGER in the module header for why the other unwired reads were KEPT and this
// one was not: they await a consumer, this one had a consumer that chose
// otherwise. `VOTE_FLOOR` stays in the tuning block as the ruling's own record.

// ── THE TWO CHARACTERFUL READS ───────────────────────────────────────────────

/**
 * THE BOOKS COLLAPSE (N2). A war seat ordinarily keeps two books — the realm's
 * and the ruler's private one (or a covert patron's) — and they diverge. Under a
 * believed EXISTENTIAL threat they converge: a ruler of ashes rules nothing, so
 * the private interest and the realm's interest choose alike. Desperation makes
 * courts honest.
 *
 * This takes an already-read books SHAPE, never a worldState: `warSeatBooks.js`
 * is a truth reader and this leaf may not touch it. The collapse is proportional
 * above the floor, so a fixture can show the same seat diverging below the band
 * and agreeing above it.
 *
 * @param {{ settlementWeight01?: unknown, seatWeight01?: unknown, patronWeight01?: unknown,
 *   continueBias01?: unknown, peaceBias01?: unknown }|null|undefined} books
 * @param {ConquestFeasibilityRead|null|undefined} read
 * @returns {{ collapsed: boolean, settlementWeight01: number, seatWeight01: number,
 *   patronWeight01: number, collapse01: number, receipt: string }}
 */
export function collapseSeatBooksUnderThreat(books, read) {
  const row = recordOf(books);
  const settlement = clamp01(Number(row.settlementWeight01) || 0);
  const seat = clamp01(Number(row.seatWeight01) || 0);
  const patron = clamp01(Number(row.patronWeight01) || 0);
  const feasibility = recordOf(read);
  const threat = feasibility.known === true && typeof feasibility.beingConqueredRisk01 === 'number'
    ? feasibility.beingConqueredRisk01
    : 0;
  const T = CONQUEST_FEASIBILITY_TUNING;
  if (threat < T.BOOKS_COLLAPSE_FLOOR) {
    return {
      collapsed: false,
      settlementWeight01: round4(settlement),
      seatWeight01: round4(seat),
      patronWeight01: round4(patron),
      collapse01: 0,
      receipt: 'the seat keeps its own books: the war is not yet its own survival.',
    };
  }
  // Proportional from the floor to certainty, so the collapse has a slope rather
  // than a cliff, and a court one point over the band is not instantly selfless.
  const collapse01 = round4(clamp01((threat - T.BOOKS_COLLAPSE_FLOOR) / (1 - T.BOOKS_COLLAPSE_FLOOR)));
  const kept = 1 - collapse01;
  return {
    collapsed: true,
    settlementWeight01: round4(clamp01(settlement + (seat + patron) * collapse01)),
    seatWeight01: round4(seat * kept),
    patronWeight01: round4(patron * kept),
    collapse01,
    receipt: `the threat is ${text(feasibility.threatBand)}: the seat's private book folds into the realm's,`
      + ' because a ruler of ashes rules nothing.',
  };
}

/**
 * THE MISTAKEN-FEASIBILITY RECEIPT (N2, requested by hand and pinned BOTH
 * DIRECTIONS). A court believed and acted; the world then answered. This says
 * what was believed, what happened, and — when they disagree — that the court
 * was wrong, in its own voice, after the fact.
 *
 * It never rewrites the belief. The read stays exactly what the court held at
 * the time, because a receipt that quietly corrected itself would erase the only
 * evidence that the fog is real.
 *
 * @param {ConquestFeasibilityRead|null|undefined} read
 * @param {{ conquestSucceeded?: unknown, wasConquered?: unknown }|null|undefined} observed
 * @returns {{ mistaken: boolean, direction: string, receipt: string }}
 */
export function mistakenFeasibilityReceipt(read, observed) {
  const row = recordOf(read);
  const outcome = recordOf(observed);
  const partyId = text(row.partyId) || 'the court';
  const counterpartId = text(row.counterpartId) || 'its rival';
  if (row.known !== true) {
    return {
      mistaken: false,
      direction: 'none',
      receipt: `${partyId} held no judgement to be wrong about.`,
    };
  }
  const believedReach = row.conquestReachBand === 'within_reach' || row.conquestReachBand === 'assured';
  const believedDoomed = row.threatBand === 'existential';
  const succeeded = outcome.conquestSucceeded === true;
  const conquered = outcome.wasConquered === true;
  if (believedReach && !succeeded) {
    return {
      mistaken: true,
      direction: 'overreached',
      receipt: `${partyId} marched believing ${counterpartId} within reach, and it was not.`
        + ` The judgement stands in the record as it was made: ${row.receipt}`,
    };
  }
  if (believedDoomed && !conquered) {
    return {
      mistaken: true,
      direction: 'despaired',
      receipt: `${partyId} gave away what it did not have to give, believing itself already lost to ${counterpartId}.`
        + ` It was not. The judgement stands in the record as it was made: ${row.receipt}`,
    };
  }
  return {
    mistaken: false,
    direction: 'none',
    receipt: `${partyId} judged the war as it turned out to be.`,
  };
}
