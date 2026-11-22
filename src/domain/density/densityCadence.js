/**
 * densityCadence.js — §810.1 R7/R8/R9 + §810.3 R14: THE LADDER IS ALIVE.
 *
 * The density law's SECOND CALLER (`applyDensityLaw.js`: "birth · growth ·
 * ascension — one law, never three"). Birth draws a settlement's political
 * fabric once; this file keeps it honest as the settlement moves up and down the
 * tier ladder.
 *
 *   R7  DENSITY IS ALIVE — the SAME Register VII ranges govern generation AND
 *       simulated tier promotion. On crossing a tier boundary the fabric
 *       THICKENS toward the new band **at a slow rolled cadence: one receipted
 *       emergence per interval**, never a batch.
 *   R8  REPRESENTATION FOLLOWS INFLUENCE — the spawn fills the LARGEST
 *       REPRESENTATION GAP first: a power strong in the influence ranking,
 *       legitimacy or economics, but unrepresented.
 *   R9  SYMMETRY IS MANDATORY — density also THINS on decline, weakest standing
 *       first. One-way thickening is a RATCHET, and a settlement that grew then
 *       shrank would keep a metropolis's fabric on a village's bones.
 *   R14 THE RULING FACTION IS EXEMPT FROM THINNING — R9's shrink arm never folds
 *       the ruling seat's house. Only EVENTS may end it (coup, conquest, the
 *       fall machinery), because "the density roll dissolved the government" is
 *       not a story, it is a hole.
 *
 * ── ONE STEP PER CALL, AND THAT IS THE CADENCE ───────────────────────────────
 *
 * R7's "slow rolled cadence" is expressed structurally rather than as a counter:
 * this planner returns AT MOST ONE step. A caller that runs it once per interval
 * gets exactly one receipted emergence per interval, and a caller that runs it
 * in a loop is visibly doing something the law does not sanction. Making the
 * cadence a property of the RETURN SHAPE means it cannot be forgotten by a
 * caller that only reads the happy path.
 *
 * ── PLAN, NOT APPLY — AND IT TAKES NO DRAW AT ALL ────────────────────────────
 *
 * As with `factionLifecycle.js`, this decides and returns an inert plan, and it
 * calls `_rng()` ZERO times. That is deliberate and it is stronger than gating:
 * every ordering here is TOTAL and DETERMINISTIC — R8 sorts by gap score with
 * ties broken on the key, R9 by standing with ties broken on the key — so the
 * same world always thickens and thins in the same order regardless of how the
 * candidate pool was assembled or what any other seam drew.
 *
 * ⚠ THE TIE-BREAK IS `compareCodepoint`, NOT `localeCompare`, AND THE REPO'S OWN
 * LINT RULE CAUGHT THE DIFFERENCE HERE. `String.prototype.localeCompare`
 * collates through the host's ICU/locale tables, so the SAME SEED can order two
 * equally-ranked houses differently on two devices — a same-seed divergence that
 * no amount of local testing would surface. "Deterministic" has to mean
 * cross-device deterministic; `domain/deterministicSort.js` is where that lives.
 *
 * A law with no draw cannot perturb the ambient stream, so this module is
 * dormancy-safe BY CONSTRUCTION. This lane measured the alternative: an ambient
 * draw from a stressor row that can NEVER FIRE still moved 104 of 240 same-seed
 * worlds. Where a future tuning pass wants a genuinely rolled cadence, it must
 * take a KEYED FORK (`density-law` → `growth-cadence`) — never the caller's
 * ambient stream — and re-earn the dormancy probes in the same act.
 *
 * ⚠ WHERE THE CANDIDATES COME FROM IS THE CALLER'S KNOWLEDGE, NOT THIS MODULE'S.
 * R8 ranks "a power strong in influence / legitimacy / economics but
 * unrepresented" — it presumes a pool of unrepresented powers, and the settlement
 * shape carries only the SEATED ones (`powerStructure.factions`). Rather than
 * invent a candidate source and call it law, this module takes the pool as input,
 * implements the ORDERING R8 actually specifies, and declines with a typed
 * `no_candidate_power` when the caller supplies none. Naming that seam is
 * honest; inventing it here would bury a design decision in a helper.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { factionEnvelopeForTier, tierKey } from './densityBands.js';
import { rollsRegisterVii } from './densityLaw.js';
import { seatKey } from './seatKey.js';
// ⚠ THE KERNEL'S CLAMP, NOT A LOCAL COPY (`tests/lint/clampPrimitiveBaseline.test.js`).
// All three call sites below pass through `num` first, so the kernel's explicit non-finite
// policy (⇒ 0) is unreachable here — a strictly safer floor, never a behaviour change.
import { clamp01 } from '../../kernel/math.js';

/** The three things an interval can do to the fabric. CLOSED. */
export const CADENCE_STEPS = Object.freeze(['thicken', 'thin', 'at_band']);

/** Every typed reason the cadence declines to act. */
export const CADENCE_REFUSALS = Object.freeze([
  'dormant_law',          // v1: the law is not in force for this world
  'no_candidate_power',   // R8 has nobody unrepresented to seat
  'ruling_only',          // R14: the only foldable house is the government's
]);

/** @param {unknown} v @param {number} [d] */
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

/**
 * R8's REPRESENTATION GAP for one unrepresented power, in 0..1.
 *
 * The three terms are R8's own words — "the influence ranking / legitimacy /
 * economics" — weighted equally, because the ruling names them as a set and
 * gives no precedence among them. Any term the caller omits degrades to 0.5
 * ("unremarkable"), the same convention `densityParticularsFrom` uses, so a
 * partial context tilts nothing rather than tilting wrongly.
 *
 * @param {{influence01?: number, legitimacy01?: number, economics01?: number}} power
 * @returns {number}
 */
export function representationGapOf(power) {
  const influence = clamp01(num(power?.influence01, 0.5));
  const legitimacy = clamp01(num(power?.legitimacy01, 0.5));
  const economics = clamp01(num(power?.economics01, 0.5));
  return (influence + legitimacy + economics) / 3;
}

/** @param {string} step @param {string|null} reason */
function declined(step, reason) {
  return Object.freeze({ step, reason, emergence: null, thinning: null });
}

/**
 * Plan AT MOST ONE step of the growth/thinning cadence for this interval.
 *
 * @param {{
 *   tier?: string,
 *   config?: Record<string, unknown>,
 *   powerStructure?: {factions?: Array<Record<string, unknown>>}|null,
 *   candidatePowers?: Array<Record<string, unknown>>,
 * }} input
 * @returns {{step: string, reason: string|null,
 *            emergence: Readonly<Record<string, unknown>>|null,
 *            thinning: Readonly<Record<string, unknown>>|null}}
 */
export function planDensityCadence(input) {
  const config = input?.config || {};
  if (!rollsRegisterVii(config)) return declined('at_band', 'dormant_law');

  const tier = tierKey(input?.tier);
  const envelope = factionEnvelopeForTier(tier);
  const seats = Array.isArray(input?.powerStructure?.factions) ? input.powerStructure.factions : [];
  const count = seats.length;

  // ── R7: THICKEN toward the new band ────────────────────────────────────────
  if (count < envelope.min) {
    const seated = new Set(seats.map(s => seatKey(s)));
    const candidates = (Array.isArray(input?.candidatePowers) ? input.candidatePowers : [])
      .filter(p => {
        const key = String(p?.key || p?.name || '').trim();
        return key && !seated.has(key);
      });
    if (!candidates.length) return declined('thicken', 'no_candidate_power');

    // R8: LARGEST REPRESENTATION GAP FIRST. The sort is total and deterministic
    // — ties break on the key, never on iteration order, so the same world
    // always thickens in the same order regardless of how the pool was built.
    const ranked = candidates
      .map(p => ({
        key: String(p.key || p.name).trim(),
        name: String(p.name || p.key).trim(),
        category: String(p.category || 'other'),
        gapScore: representationGapOf(p),
      }))
      .sort((a, b) => (b.gapScore - a.gapScore) || compareCodepoint(a.key, b.key));

    return Object.freeze({
      step: 'thicken',
      reason: null,
      // ⭐ ONE. R7's cadence is "one receipted emergence per interval", and the
      // return shape enforces it: there is no plural here to accidentally drain.
      emergence: Object.freeze({ ...ranked[0], seatsBefore: count, bandMin: envelope.min }),
      thinning: null,
    });
  }

  // ── R9: THIN on decline (the anti-ratchet) ─────────────────────────────────
  if (count > envelope.max) {
    // ⛔ R14. The governing house is removed from the candidate pool BEFORE the
    // weakest-standing sort, not skipped afterwards — so it can never be chosen
    // even when it is genuinely the weakest thing in the settlement.
    const foldable = seats.filter(s => s?.isGoverning !== true);
    if (!foldable.length) return declined('thin', 'ruling_only');

    // R9: WEAKEST STANDING FIRST. Deterministic on ties, same reasoning as R8.
    const ranked = foldable
      .map(s => ({ key: seatKey(s), name: seatKey(s), standing: num(s?.power, 0) }))
      .sort((a, b) => (a.standing - b.standing) || compareCodepoint(a.key, b.key));

    return Object.freeze({
      step: 'thin',
      reason: null,
      emergence: null,
      thinning: Object.freeze({ ...ranked[0], seatsBefore: count, bandMax: envelope.max }),
    });
  }

  // Inside the band: the fabric already fits the tier. Nothing to do, and
  // saying so explicitly beats returning a null a caller has to interpret.
  return declined('at_band', null);
}
