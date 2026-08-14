/**
 * habitCurve.js — HB-0. THE FROZEN CURVE: reinforcement, decay, the seat shock, the one
 * rounding door, and the single affine map from a stored stock to a chooser multiplicand.
 *
 * PURE. No world state, no store, no PRNG, no clock read — `ageWeeks` arrives as a
 * PARAMETER and the clock-resolution law (a write that cannot resolve the clock writes
 * NOTHING) binds HB-2's writer, not this leaf. Zero callers at land time.
 *
 * ── WHAT THIS LEAF REFUSES TO AUTHOR ────────────────────────────────────────────
 *
 * It authors NO decay law: the half-life arithmetic is `bandedStock.decayTowardNeutral`,
 * ridden verbatim, and this module contains no second `Math.pow(0.5, …)`. Eighteen such
 * sites were measured under `src/` at the code of record and habit adds none — a
 * sixteenth hand-rolled fork is exactly what J-HB-3 refused in writing, and the refusal is
 * stronger now than when it was made, because that law has proven production riders.
 *
 * It authors NO band vocabulary. The half-life bands are indexed out of the imported
 * ladder and the outcome-grading weights are POSITIONAL against the imported severity
 * ladder, so no rung word is spelled anywhere in this file — including in this comment.
 * The band-family walker asserts that exactly one module speaks those rungs, over RAW
 * source with no code-only strip, so a rung inside a JSDoc line would red it just as
 * loudly as one inside an expression.
 *
 * ⚠ THE VOLUME'S RUNG-KEYED WEIGHT OBJECT IS A READING AID, NOT AN AUTHORING
 * INSTRUCTION. Unquoted object keys would evade that scan while restating a vocabulary
 * the ladder already answers — the derive-don't-restate law forbids it independently.
 *
 * ── THE UPDATE, IN ONE EXPRESSION ───────────────────────────────────────────────
 *
 *   decayed = decayTowardNeutral(stock, NEUTRAL_I, ageWeeks, halfLifeBandFor(lawWord))
 *   shocked = seatAdjusted(decayed, entrySeat, currentSeat)
 *   step    = learnRateFor(lawWord) * severityWeightOf(outcomeRung)
 *   next    = direction > 0 ? shocked + step * (CAP_I - shocked)
 *                           : shocked - step * (shocked - FLOOR_I)
 *   stock'  = roundToUnits(next)
 *
 * TILT-NEVER-LOCK IS STRUCTURAL, NOT CLAMPED. The update moves a FRACTION of the
 * remaining distance to the bound, so the bound is asymptotic and unattainable in finite
 * steps; the clamp inside `roundToUnits` is belt-and-braces against arithmetic surprise
 * and is never the thing doing the work. A clamped-linear update would reach the cap and
 * then LOCK, which is the dead-arm failure wearing a cap's clothing.
 *
 * ⛔ THE INVARIANT IS ON PAIRWISE ODDS RATIOS (J-HB-18), never on a per-probability
 * ratio. Under a renormalized post-softmax load the per-probability quantity is the
 * factor over the probability-weighted mean factor, which ranges over the FULL interval
 * the pair bound describes and is ATTAINED at the state this design is built to produce.
 * The pairwise form is true BY CONSTRUCTION because the renormalizer cancels out of a
 * ratio of ratios, leaving exactly the factor ratio.
 *
 * ── THE ROUNDING FENCE (chair question Q3, ADOPTED at OWNER_DECISION_QUEUE §36) ──
 *
 * `decayTowardNeutral` ends in an implementation-approximated power, so a unit-in-the-
 * last-place difference across engines could, at a knife edge, move a SELECTION. The
 * fence is that the stock is stored and compared as an INTEGER in ten-thousandth units
 * and every factor is derived from the rounded integer, never from the float. Rounding
 * happens BEFORE any comparison, on every path, so a tiny difference is annihilated
 * unless the true value sits exactly on a rounding edge — a measure-zero set, identically
 * located on every device because the rounding is the same operation everywhere.
 *
 * `roundToUnits` IS THE SINGLE ROUNDING DOOR and a float stock never leaves this leaf. A
 * fence with two gates is not a fence, so the family's walker pins that no second
 * rounding spelling exists here. ⚠ THE HONEST RESIDUAL, recorded rather than smoothed:
 * the fence makes divergence unobservable at the stock, not impossible in the arithmetic.
 * Integer-domain decay through a precomputed rational half-life table is recorded as a
 * future widening, and the cross-run same-input stock-identity check is the instrument
 * that would see the residual bite.
 *
 * ⚠ ALL CONSTANTS BELOW ARE RAW-AUTHORED PROPOSALS. None is ratified, none enters the
 * soak band manifest, and none may be authored anywhere but `HABIT_TUNING`.
 *
 * @enforced-by tests/domain/habitCurve.test.js
 */
import { HALF_LIFE_BANDS, decayTowardNeutral } from '../bandedStock.js';
import { severityRankOf } from '../bandFamilies.js';
import { LAW_WORDS } from '../lawWord.js';

/**
 * THE VOLATILITY ORDER, MOST VOLATILE FIRST. Semantic, and deliberately NOT the law-word
 * export's own codepoint order — a court with no law forgets fast and learns fast; a
 * lawful one is slow at both. The tuning maps below key on this order, never on an index
 * into the sorted export.
 * @type {readonly string[]}
 */
export const LAW_WORD_VOLATILITY = Object.freeze(['lawless', 'balanced', 'lawful']);

/**
 * How far up the shared half-life ladder the least volatile court sits. The three bands
 * are INDEXED OUT of the imported ladder rather than spelled, so a rename or a reorder
 * upstream reds this family instead of silently re-pointing a decay.
 */
const HALF_LIFE_BAND_OFFSET = 1;

/** Learn rates by volatility order (refinement 16). */
const LEARN_RATES = Object.freeze([0.22, 0.14, 0.09]);

/**
 * Outcome-grading weights, POSITIONAL against the imported severity ladder's own order.
 * ⚠ NOT MONOTONE, and that is the one counterintuitive row: the ladder's top rung grades
 * an outcome so total that it teaches less about the ACTION than the rung below it —
 * a court routed at the walls learns about the war, not about the sortie.
 */
const SEVERITY_W = Object.freeze([0.35, 1.0, 1.4, 0.8]);

/**
 * THE ONE TUNING BAG. Every habit dial lives here and nowhere else. Deliberately
 * UNANNOTATED: the frozen literal's own inferred shape is the contract, so a member that
 * changes kind reds the typechecker rather than passing through a widened annotation.
 */
export const HABIT_TUNING = Object.freeze({
  /** The neutral stock, in ten-thousandth units. */
  NEUTRAL_I: 5000,
  /** The tilt floor. Equidistant from neutral with the cap — see `applyCredit`. */
  FLOOR_I: 1500,
  /** The tilt cap. */
  CAP_I: 8500,
  /** The chooser multiplicand's half-span. */
  HABIT_SPAN: 0.35,
  /** The observer's term is WEAKER than self-knowledge. */
  ANTICIPATION_SPAN: 0.2,
  /** How much awareness of being watched damps own habit. */
  DEVIATE_W: 0.6,
  /** A new seat keeps half the distance from neutral. */
  SEAT_SHOCK_KEEP: 0.5,
  /** Learn rate by law word, DERIVED from the volatility order. */
  LEARN_RATE: Object.freeze(Object.fromEntries(
    LAW_WORD_VOLATILITY.map((word, index) => [word, LEARN_RATES[index]]),
  )),
  /** Half-life band by law word, INDEXED out of the shared ladder. */
  HALF_LIFE: Object.freeze(Object.fromEntries(
    LAW_WORD_VOLATILITY.map((word, index) => [word, HALF_LIFE_BANDS[HALF_LIFE_BAND_OFFSET + index]]),
  )),
  /** Outcome weights, positional against the shared ladder. */
  SEVERITY_W,
});

/**
 * The learn rate a court of this law word carries. THROWS on an unknown word: the estate
 * has ONE law-word spelling and a silent fallback would learn at a rate nobody chose.
 * @param {string} lawWord
 * @returns {number}
 */
export function learnRateFor(lawWord) {
  const rate = HABIT_TUNING.LEARN_RATE[String(lawWord)];
  if (typeof rate !== 'number') throw new Error(unknownLawWord(lawWord));
  return rate;
}

/**
 * The half-life band a court of this law word forgets on — a MEMBER of the shared ladder,
 * never a rate this family authors.
 * @param {string} lawWord
 * @returns {string}
 */
export function halfLifeBandFor(lawWord) {
  const band = HABIT_TUNING.HALF_LIFE[String(lawWord)];
  if (typeof band !== 'string') throw new Error(unknownLawWord(lawWord));
  return band;
}

/**
 * The grading weight of an outcome rung, INDEXED through the imported ladder. The weight
 * table's length is pinned equal to the ladder's, so a rung added upstream reds this
 * family rather than mapping silently to nothing.
 * @param {string} rung
 * @returns {number}
 */
export function severityWeightOf(rung) {
  return SEVERITY_W[severityRankOf(rung)];
}

/**
 * THE ONE ROUNDING DOOR. Rounds to whole ten-thousandth units and holds the result inside
 * the tilt bounds. Every stored stock and every factor input passes through here, and no
 * second rounding expression exists in this family.
 * @param {number} value
 * @returns {number}
 */
export function roundToUnits(value) {
  const v = Number(value);
  if (!Number.isFinite(v)) return HABIT_TUNING.NEUTRAL_I;
  const rounded = Math.round(v);
  if (rounded < HABIT_TUNING.FLOOR_I) return HABIT_TUNING.FLOOR_I;
  if (rounded > HABIT_TUNING.CAP_I) return HABIT_TUNING.CAP_I;
  return rounded;
}

/**
 * THE SEAT SHOCK (refinement 8), a PURE function with exactly two callers by design — the
 * read path and the write path — so a lazy read can never become a hidden write the
 * writer disagrees with. A new seat keeps a fixed share of the distance from neutral: it
 * has yet to learn the old lessons but it inherits a court, its clerks and its habits of
 * mind, so a partial keep, never a reset and never a carry-forward.
 *
 * ⚠ An unresolvable seat identity applies NO shock. The seat resolves through the one
 * existing resolver and never through a display name — the faction-key defect class has
 * bitten four times.
 *
 * @param {number} stock @param {string|null|undefined} entrySeat
 * @param {string|null|undefined} currentSeat
 * @returns {number}
 */
export function seatAdjusted(stock, entrySeat, currentSeat) {
  const s = Number(stock);
  if (!Number.isFinite(s)) return HABIT_TUNING.NEUTRAL_I;
  const from = entrySeat == null ? '' : String(entrySeat);
  const to = currentSeat == null ? '' : String(currentSeat);
  if (!from || !to || from === to) return s;
  const neutral = HABIT_TUNING.NEUTRAL_I;
  return neutral + (s - neutral) * HABIT_TUNING.SEAT_SHOCK_KEEP;
}

/**
 * THE CREDIT FOLD. Decays the stored stock to now, applies the seat shock, then moves a
 * fraction of the remaining distance toward the bound the outcome points at.
 *
 * ⚠ FLOOR AND CAP ARE EQUIDISTANT FROM NEUTRAL AND MUST STAY SO. Moving one without the
 * other makes reinforcement and decay different-sized instruments, which is a behaviour
 * change disguised as a dial; the family's walker asserts the symmetry and names that
 * reason in its failure message.
 *
 * @param {{ stock?: number, lawWord: string, outcomeRung: string, direction: number,
 *   ageWeeks?: number, entrySeat?: string|null, currentSeat?: string|null }} args
 * @returns {number} the next stock, in whole ten-thousandth units
 */
export function applyCredit({
  stock = HABIT_TUNING.NEUTRAL_I, lawWord, outcomeRung, direction,
  ageWeeks = 0, entrySeat = null, currentSeat = null,
}) {
  const start = Number.isFinite(Number(stock)) ? Number(stock) : HABIT_TUNING.NEUTRAL_I;
  const decayed = decayTowardNeutral(
    start, HABIT_TUNING.NEUTRAL_I, ageWeeks, halfLifeBandFor(lawWord),
  );
  const shocked = seatAdjusted(decayed, entrySeat, currentSeat);
  const step = learnRateFor(lawWord) * severityWeightOf(outcomeRung);
  const next = direction > 0
    ? shocked + step * (HABIT_TUNING.CAP_I - shocked)
    : shocked - step * (shocked - HABIT_TUNING.FLOOR_I);
  return roundToUnits(next);
}

/**
 * THE STOCK TO FACTOR MAP — one affine expression, in one function, with no second
 * spelling. An ABSENT stock returns EXACTLY the number one, which is the same door a dark
 * flag goes through: an empty ledger is not a ledger of zeros, it is an absent key.
 *
 * The arithmetic is deliberately ASYMMETRIC in stock space and SYMMETRIC in factor space,
 * so the factor's reachable interval is exactly one span either side of one.
 *
 * @param {number|null|undefined} stock
 * @param {number} [span] the effective span at the site (the deviation damper narrows it)
 * @returns {number}
 */
export function habitFactor(stock, span = HABIT_TUNING.HABIT_SPAN) {
  if (stock == null) return 1;
  const raw = Number(stock);
  if (!Number.isFinite(raw)) return 1;
  const rounded = roundToUnits(raw);
  if (rounded === HABIT_TUNING.NEUTRAL_I) return 1;
  const tilt01 = (rounded - HABIT_TUNING.NEUTRAL_I)
    / (HABIT_TUNING.CAP_I - HABIT_TUNING.NEUTRAL_I);
  return 1 + span * tilt01;
}

/** @param {unknown} lawWord @returns {string} */
function unknownLawWord(lawWord) {
  return `habitCurve: unknown law word ${JSON.stringify(lawWord)} — the estate's one`
    + ` law-band spelling is [${LAW_WORDS.join(', ')}] and habit reads it, never re-mints it`;
}
