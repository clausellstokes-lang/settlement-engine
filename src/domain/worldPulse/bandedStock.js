/**
 * bandedStock.js — THE BANDED-STOCK FAMILY (SP-5b), minted once, for the whole estate.
 *
 * WHY THIS LEAF EXISTS. The banded-decaying-stock idiom is the estate's most-reused
 * shape and, until this file, its most-forked one. Measured against the live tree on
 * 2026-08-04, FIFTEEN call sites spell `Math.pow(0.5, age / halfLife)` by hand, each
 * with its own privately-authored constant:
 *
 *   ageOverlay.js SCAR_DECADE_HALF_LIFE_WEEKS 520 · factionPairLedger.js 156 ·
 *   npcCredibility.js 52 · npcGrowthKernel.js 52 · npcLadderKernel.js 104 ·
 *   npcLadderState.js 156 / 156 / 312 · informationStatecraft.js · relationshipMemory.js ·
 *   momentum.js · urbanFabricKernel.js (two) · stressors.js · dispositionLedger.js 1040
 *
 * The numbers are not arbitrary — read together they are a LADDER that nobody wrote
 * down: a season, a year, a few years, a decade, a generation. Every one of them is an
 * exact multiple of `INTERVAL_WEEKS`, which is the estate's one time truth. This file
 * writes the ladder down, derives it from `INTERVAL_WEEKS` rather than hand-keying it,
 * and gives the family the one property the fifteen forks can only promise
 * individually: ANTI-RATCHET. Every stock in this family decays TOWARD NEUTRAL, never
 * away from it and never past it, and that is asserted once, over the shape, instead of
 * fifteen times as per-instance faith. The runaway's lesson is that a ratchet is the
 * estate's proven killer; a family whose decay law is one function cannot grow a
 * sixteenth ratchet by accident.
 *
 * WHAT IS DELIBERATELY NOT HERE.
 *   - No BANDING primitive. A stock's band EDGES are a per-instance tuning row (the
 *     owner signs them per volume at the soak redo), and a shared edges table would
 *     mint a vocabulary this wave has no authority to author. Instances band through
 *     their own tables and hand this file the resulting band WORDS.
 *   - No cause vocabulary. `cause` on a crossing receipt is the INSTANCE's closed
 *     vocabulary (dispositionLedger's DISPOSITION_SOURCE_KINDS is the worked example);
 *     this grammar checks that a cause is a token, never that it is one of ITS tokens.
 *   - No rounding. The shape is pure arithmetic; an instance rounds at its own
 *     persistence boundary, where it knows its own serialized precision. Rounding here
 *     would put a 5e-13 wobble between the shape and the anti-ratchet property it is
 *     supposed to guarantee.
 *
 * L5 (GAME-GRADE TRANSLATE) IS STRUCTURAL HERE: a crossing receipt carries band WORDS
 * and a tick, and `bandCrossingReceipt` REFUSES any non-integer number in any field.
 * A float cannot reach prose through this grammar because a float cannot enter it.
 *
 * PURE. No world state, no store, no PRNG, no imports beyond the time base.
 * Consumed by nothing at land time — dark by construction (the lane-P precedent).
 */
import { INTERVAL_WEEKS } from './intervalWeeks.js';

/**
 * The shared half-life ladder, ASCENDING (fastest-forgetting first). Volumes pick a
 * band; no volume authors a half-life. Every rung is a multiple of the one time base,
 * and every rung is a duration the tree already keeps memory on (see the header).
 * @type {readonly string[]}
 */
export const HALF_LIFE_BANDS = Object.freeze([
  'a_season',
  'a_year',
  'a_few_years',
  'a_decade',
  'a_generation',
]);

/**
 * Half-life band → weeks, DERIVED from `INTERVAL_WEEKS` so the family can never drift
 * off the campaign clock (SP-7's temporal contract: every decay declares its clock
 * denominated against the one time truth).
 * @type {Readonly<Record<string, number>>}
 */
export const HALF_LIFE_WEEKS = Object.freeze({
  a_season: INTERVAL_WEEKS.one_season,             // 13 — a rumour's warmth
  a_year: INTERVAL_WEEKS.one_year,                 // 52 — a season's grudge, a reputation
  a_few_years: 3 * INTERVAL_WEEKS.one_year,        // 156 — a bond, a standing, a grudge
  a_decade: 10 * INTERVAL_WEEKS.one_year,          // 520 — a scar on the fabric
  a_generation: 20 * INTERVAL_WEEKS.one_year,      // 1040 — what a people remembers
});

/** The two things a band crossing can be. There is no third. */
export const CROSSING_DIRECTIONS = Object.freeze(['rose', 'fell']);

/**
 * Weeks for a half-life band. THROWS on an unknown band rather than returning a
 * sentinel: every caller passes a frozen constant, so a miss here is a coding error,
 * and a silent fallback would be a stock that quietly forgets at the wrong rate — the
 * exact drift this family exists to remove.
 * @param {string} band one of HALF_LIFE_BANDS
 * @returns {number} weeks
 */
export function halfLifeWeeksOf(band) {
  const weeks = Object.prototype.hasOwnProperty.call(HALF_LIFE_WEEKS, String(band))
    ? HALF_LIFE_WEEKS[String(band)]
    : undefined;
  if (typeof weeks !== 'number') {
    throw new Error(
      `bandedStock: unknown half-life band "${String(band)}" — pick one of ${HALF_LIFE_BANDS.join(', ')}`,
    );
  }
  return weeks;
}

/**
 * THE ONE DECAY SHAPE. A stock relaxes toward its neutral on the named half-life.
 *
 * The anti-ratchet guarantee lives in this arithmetic and is asserted as a PROPERTY
 * over the shape (tests/domain/bandedStock.test.js) rather than per instance: the
 * returned value is never further from `neutral` than `value` was, never on the far
 * side of `neutral`, and strictly closer whenever any time has passed.
 *
 * @param {number} value      the current stock
 * @param {number} neutral    the value the stock relaxes toward
 * @param {number} ageWeeks   weeks elapsed since `value` was written (negatives are
 *                            clamped to 0 — a stock does not un-decay)
 * @param {string} band       one of HALF_LIFE_BANDS
 * @returns {number}
 */
export function decayTowardNeutral(value, neutral, ageWeeks, band) {
  const v = Number(value);
  const n = Number(neutral);
  const age = Number(ageWeeks);
  if (!Number.isFinite(v) || !Number.isFinite(n) || !Number.isFinite(age)) {
    throw new Error('bandedStock.decayTowardNeutral: value, neutral and ageWeeks must be finite numbers');
  }
  const weeks = halfLifeWeeksOf(band);
  // NO TIME, NO CHANGE — returned exactly, not recomputed. `n + (v - n) * 1` is not
  // bit-identical to `v` for every double, and a stock that drifts by 2e-17 on a
  // zero-week read would put a phantom band crossing in a receipt at the edges.
  if (!(age > 0)) return v;
  return n + (v - n) * Math.pow(0.5, age / weeks);
}

/**
 * The crossing detector. Returns `null` when nothing crossed, so a caller's receipt
 * emission is `if (crossing)` rather than a comparison it can spell backwards.
 *
 * @param {readonly string[]} ladder  the instance's OWN band ladder, ascending
 * @param {string} priorBand
 * @param {string} nextBand
 * @returns {{from: string, to: string, direction: string} | null}
 */
export function crossingOf(ladder, priorBand, nextBand) {
  return crossingBetween(assertLadder(ladder), priorBand, nextBand, 'priorBand', 'nextBand');
}

/**
 * The one direction rule, so the receipt grammar and the public detector cannot spell
 * `rose` and `fell` differently.
 * @param {string[]} rungs @param {unknown} a @param {unknown} b
 * @param {string} labelA @param {string} labelB
 * @returns {{from: string, to: string, direction: string} | null}
 */
function crossingBetween(rungs, a, b, labelA, labelB) {
  const from = assertRung(rungs, a, labelA);
  const to = assertRung(rungs, b, labelB);
  if (from === to) return null;
  return Object.freeze({
    from,
    to,
    direction: rungs.indexOf(to) > rungs.indexOf(from) ? 'rose' : 'fell',
  });
}

/**
 * @typedef {{stockKind: string, ladder: readonly string[], from: string, to: string,
 *            cause: string, tick: number}} BandCrossingArgs
 */

/**
 * THE ONE CROSSING-RECEIPT GRAMMAR. Every banded stock in the estate reports a band
 * crossing in this shape and no other: what moved, from which word to which word, which
 * way, on whose account, and when.
 *
 * FAIL-CLOSED BY CONSTRUCTION. Every field is validated and the whole receipt is
 * frozen; a non-integer number anywhere REDS, which is L5 enforced at the grammar
 * rather than hoped for at the composer (a source scan cannot see a composer).
 *
 * @param {BandCrossingArgs} args
 * @returns {Readonly<{stockKind: string, from: string, to: string, direction: string,
 *                     cause: string, tick: number}>}
 */
export function bandCrossingReceipt(args) {
  const a = /** @type {Partial<BandCrossingArgs>} */ (args && typeof args === 'object' ? args : {});
  const stockKind = assertToken(a.stockKind, 'stockKind');
  const cause = assertToken(a.cause, 'cause');
  const crossing = crossingBetween(assertLadder(a.ladder), a.from, a.to, 'from', 'to');
  if (!crossing) {
    throw new Error(
      `bandedStock.bandCrossingReceipt: ${stockKind} did not cross (from === to) — a receipt`
      + ' records a crossing, and emitting one for a non-event is how a feed becomes wallpaper',
    );
  }
  const tick = a.tick;
  if (typeof tick !== 'number' || !Number.isInteger(tick) || tick < 0) {
    throw new Error(`bandedStock.bandCrossingReceipt: ${stockKind} tick must be a non-negative integer`);
  }
  return Object.freeze({
    stockKind,
    from: crossing.from,
    to: crossing.to,
    direction: crossing.direction,
    cause,
    tick,
  });
}

/**
 * A band ladder: at least two distinct non-empty word rungs, ascending. Throws rather
 * than returning an empty set — a ladder that parsed to nothing would make every
 * crossing check below vacuously true. Takes `unknown` deliberately: it is the boundary
 * validator, and a validator that only accepts already-valid input is decoration.
 * @param {unknown} ladder
 * @returns {string[]}
 */
function assertLadder(ladder) {
  if (!Array.isArray(ladder) || ladder.length < 2) {
    throw new Error('bandedStock: a band ladder needs at least two rungs');
  }
  const rungs = ladder.map((rung, i) => assertToken(rung, `ladder[${i}]`));
  if (new Set(rungs).size !== rungs.length) {
    throw new Error(`bandedStock: a band ladder may not repeat a rung (${rungs.join(', ')})`);
  }
  return rungs;
}

/**
 * @param {string[]} rungs @param {unknown} band @param {string} label @returns {string}
 */
function assertRung(rungs, band, label) {
  const word = assertToken(band, label);
  if (!rungs.includes(word)) {
    throw new Error(`bandedStock: ${label} "${word}" is not a rung of [${rungs.join(', ')}]`);
  }
  return word;
}

/**
 * A receipt token: a non-empty lower-case word (underscores allowed). Deliberately
 * strict — engine tokens are what the Herald's registration machinery keys on, and a
 * token carrying a space, a digit-only body, or a number is a float or a sentence
 * wearing a key's clothes.
 * @param {unknown} value @param {string} label @returns {string}
 */
function assertToken(value, label) {
  if (typeof value !== 'string' || !/^[a-z][a-z_]*$/.test(value)) {
    throw new Error(
      `bandedStock: ${label} must be a lower-case word token (got ${JSON.stringify(value)})`,
    );
  }
  return value;
}
