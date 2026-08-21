/**
 * conquestExecution.js — WR-8 amendment N: CONQUEST EXECUTION, and the two laws
 * that keep it the RARE ending rather than the default one.
 *
 * ── WHY THIS IS A LEAF, AND WHAT IT IS NOT ──────────────────────────────────
 * Its siblings `conquestFeasibility.js` and `conquestIntent.js` are BELIEF: what
 * a court thinks it could take, and whether it means to. K3 fences them at zero
 * imports because a belief that peeks at truth is not a belief. THIS module is
 * the other half of the same amendment and is governed by the opposite rule: it
 * prices what ACTUALLY HAPPENED once the walls came down, and the world's own
 * answer is allowed to be true. The fog decides the march; it does not decide
 * whether the march worked.
 *
 * That is not a licence to reach, though. This module still takes ONLY already-
 * read numbers and returns bands and factors — no worldState, no snapshot, no
 * ledger, and NO IMPORTS AT ALL, exactly like its belief siblings. The reads it
 * needs belong to `occupation.js`, which already holds every one of them.
 *
 * ── LAW 1: THE OVERWHELMING GATE ────────────────────────────────────────────
 * The amendment's own words: "⚠️ THE GATE IS THE WHOLE DESIGN, and it must be
 * strict: OVERWHELMING asymmetry only. If a moderate advantage produces
 * conquest, every war becomes a conquest and the entire negotiation system built
 * in C through L is decoration. Pin the negative case hardest: a CLEARLY WINNING
 * side that is not overwhelming must still have to negotiate."
 *
 * WHERE THE GATE LANDS, AND WHY IT IS THE LADDER AND NOT THE FALL. It would be
 * natural to read "the overwhelming gate" as gating whether the town falls at
 * all. It cannot land there, and the reason is a fact about this engine rather
 * than a preference: the war layer's siege verdict MINTS the conquest
 * power-transfer, and the pulse kernel already documents that suppressing a
 * conquest requires suppressing the seed AND the apply together — "the two
 * filters together leave NO occupation/ledger residue for a dismissed conquest".
 * A gate that dropped the occupation alone would leave a transferred power with
 * nobody holding it: no burden, no resistance, no revolt path, no liberation.
 *
 * So the gate lands where conquest EXECUTION actually lives — on how far a hold
 * may mature. OCCUPATION IS NOT ANNEXATION, and the ladder already says so:
 * `contested → unstable → extractive → stabilized → vassalized`, where
 * `vassalized` is the rung at which the occupation stops being a garrison and
 * becomes a client state. Under this doctrine only an OVERWHELMING victor may
 * climb past `extractive`. A clearly-winning one holds the walls and extracts —
 * and its war can only end at a table, because the ladder to a client state is
 * shut against it. THE NEGATIVE CASE IS THEREFORE STRUCTURAL: "clearly winning
 * but not overwhelming still negotiates" is not a tendency in a weight, it is a
 * rung that cannot be reached.
 *
 * THE STRICT DIRECTION ON SILENCE. An unmeasurable margin is not an overwhelming
 * one. `unknown` caps the ladder exactly as `clearly_winning` does, because
 * conquest is the rare ending and a gate that opened on missing data would be
 * the loose gate the amendment names as the failure mode.
 *
 * ── LAW 2: THE INHERITANCE COUNTERFORCE ─────────────────────────────────────
 * "⭐⭐ THE COUNTERFORCE IS INHERITANCE, AND IT NEEDS NO NEW RULE: THE VICTOR
 * TAKES THE LOSER'S PROBLEMS ALONG WITH THEIR GROUND. … their starving
 * population eats from your granaries … A realm that conquers a dying neighbour
 * has annexed a famine. This is the honest brake on conquest and every engine
 * needed to compute it already exists."
 *
 * Held to literally: the deficit is summed over what the occupier NOW HOLDS,
 * from the same two food readers the belief stage's own granary leg uses, and
 * NO new estimator is minted. It bites the occupier twice, in the two places the
 * occupation layer already speaks:
 *   BENEFIT is netted DOWN — you cannot draw tribute from an empty granary. The
 *     factor is 1/(1+hunger): monotone, never negative, never zero, and exactly
 *     1 when nothing you hold is hungry, so a well-fed empire is unchanged.
 *   BURDEN is raised — you are feeding them now.
 * Neither is capped by occupation COUNT, which is the point: the brake must be
 * able to outgrow the prize, or conquering a dying neighbour is still free.
 *
 * PURE: no rng, no wall-clock, no mutation, no state, no imports. Deterministic
 * over its arguments. Strict-clean.
 */

/**
 * The closed margin vocabulary. `unknown` is a real member and is NOT a neutral
 * fact: it caps the ladder, on the strict side of the gate.
 */
export const CONQUEST_MARGIN_BANDS = Object.freeze([
  'unknown', 'contested', 'clearly_winning', 'overwhelming',
]);

/**
 * The occupation ladder, verbatim from `occupation.js`. Re-declared rather than
 * imported on the `conquestDoctrineStage` precedent — this leaf must not acquire
 * a reach it does not otherwise need, and a rung name is vocabulary, not state.
 * A drift between the two spellings is caught by a pin, not by a comment.
 */
export const CONQUEST_LADDER = Object.freeze([
  'contested', 'unstable', 'extractive', 'stabilized', 'vassalized',
]);

export const CONQUEST_EXECUTION_TUNING = Object.freeze({
  // ⚠️⚠️ THE GATE IS A POINTS GAP AND NOT A RATIO, AND THE REASON IS MEASURED,
  // NOT PREFERRED. This gate was first written as a capacity RATIO — "three
  // times the defender's whole military strength" — which reads like exactly the
  // steepness the amendment demands. It is unreachable. `theoreticalCapacity` is
  // a deliberately COMPRESSED 0..100 model with a high floor (simplicity over
  // fidelity, world scale), and the whole realm-scale spread is about twenty
  // points: a hamlet of ten measures 42.0 and a metropolis of a hundred thousand
  // measures 62.8. THE LARGEST RATIO EXPRESSIBLE ANYWHERE IN THE MODEL IS 1.50 —
  // a metropolis of a million against a hamlet of one. Any ratio band strict
  // enough to mean "overwhelming" is therefore a band nothing can ever enter,
  // and a gate that can never open is as dead as a leg that is a constant.
  //
  // The tree already contains this exact mistake, which is the corroboration:
  // `feasibilityGate.PLAUSIBLE_CEILING = 4.0` is the war layer's own
  // "overwhelming" ratio, and it is honestly marked "(documentation only — the
  // band is open-topped above the floor)" precisely because nothing reaches it.
  //
  // The GAP is the reachable instrument on the same model: it spans 0.19 (two
  // peer towns) to 20.8 (metropolis over hamlet) and orders pairs the way a
  // reader would. The bands below are read off that spread — a great city over a
  // large town is NOT overwhelming (gap ~4), a great city over a small town is
  // clearly winning (gap ~8), a great city over a village or smaller is
  // overwhelming (gap ~10-15).
  OVERWHELMING_GAP: 12,
  // The negative case's home. A side at or above this is CLEARLY WINNING and
  // the pins live here: it holds, it extracts, and it still has to negotiate.
  CLEARLY_WINNING_GAP: 5,
  // The highest rung a non-overwhelming hold may reach. `extractive` and not
  // `stabilized`, because a stabilized occupation is one rung from a client
  // state and the gap between the gate and the prize should be visible.
  CAPPED_CEILING: 'extractive',
  // What an overwhelming hold may reach: the whole ladder.
  OPEN_CEILING: 'vassalized',
  // How hard an inherited famine leans on the garrison bill. One whole
  // settlement's worth of empty granary adds this much burden severity.
  INHERITANCE_BURDEN_WEIGHT: 0.35,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number} */
function clamp01(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** @param {number} value @returns {number} 4-dp round, the repo's byte-tidy float */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/**
 * @typedef {Object} ConquestMarginVerdict
 * @property {string} band          one of CONQUEST_MARGIN_BANDS
 * @property {boolean} overwhelming may this hold mature into a client state?
 * @property {number|null} gap      the measured capacity-points gap, or null
 * @property {string} ceiling       the highest ladder rung this verdict permits
 * @property {string} receipt       the world's own sentence about the margin
 */

/**
 * THE OVERWHELMING GATE. Prices one victor's margin over one settlement it now
 * holds, from military capacities the occupation layer has already derived — as
 * a POINTS GAP, for the measured reason recorded in the tuning block above.
 *
 * A victor whose own capacity cannot be read is `unknown`: an army that cannot
 * be measured has not been measured, and silence caps the ladder.
 *
 * @param {{ occupierCapacity?: unknown, occupiedCapacity?: unknown,
 *   occupierName?: unknown, occupiedName?: unknown }} input
 * @returns {ConquestMarginVerdict}
 */
export function conquestMarginVerdict(input) {
  const row = recordOf(input);
  const occupierName = text(row.occupierName) || 'the victor';
  const occupiedName = text(row.occupiedName) || 'the held settlement';
  // ⚠️ `Number(null)` IS 0, AND 0 IS A RUIN. A null/undefined capacity means NOT
  // READ; a zero capacity means a settlement with nothing left. Coercing first
  // collapses the two and hands the strongest possible verdict to the case with
  // the least evidence — the exact inversion of the strict direction this gate is
  // built on. So the raw value is checked for number-ness BEFORE any coercion.
  const isNumeric = (/** @type {unknown} */ value) => (
    typeof value === 'number' ? Number.isFinite(value) : typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))
  );
  const T = CONQUEST_EXECUTION_TUNING;
  if (!isNumeric(row.occupierCapacity) || !isNumeric(row.occupiedCapacity)) {
    return {
      band: 'unknown',
      overwhelming: false,
      gap: null,
      ceiling: T.CAPPED_CEILING,
      receipt: `the margin between ${occupierName} and ${occupiedName} cannot be measured,`
        + ' and an unmeasured margin is not an overwhelming one.',
    };
  }
  const occupier = Number(row.occupierCapacity);
  const occupied = Number(row.occupiedCapacity);
  if (occupier <= 0 || occupied < 0) {
    return {
      band: 'unknown',
      overwhelming: false,
      gap: null,
      ceiling: T.CAPPED_CEILING,
      receipt: `the margin between ${occupierName} and ${occupiedName} cannot be measured,`
        + ' and an unmeasured margin is not an overwhelming one.',
    };
  }
  const gap = round4(occupier - occupied);
  if (gap >= T.OVERWHELMING_GAP) {
    return {
      band: 'overwhelming',
      overwhelming: true,
      gap,
      ceiling: T.OPEN_CEILING,
      receipt: `${occupierName} outweighs ${occupiedName} by ${gap} points of war-making capacity:`
        + ' this was never a contest, and the hold may become a client state.',
    };
  }
  const band = gap >= T.CLEARLY_WINNING_GAP ? 'clearly_winning' : 'contested';
  return {
    band,
    overwhelming: false,
    gap,
    ceiling: T.CAPPED_CEILING,
    receipt: band === 'clearly_winning'
      ? `${occupierName} is plainly winning against ${occupiedName} by ${gap} points — and plainly`
        + ' winning is not overwhelming. It may hold and extract; it may not annex, and its war ends at a table.'
      : `${occupierName} holds ${occupiedName} by ${gap} points, which is a garrison and not a conquest.`,
  };
}

/**
 * THE LADDER CAP, as a rung index the state machine can compare against. A
 * verdict's ceiling is the HIGHEST rung an occupation under it may occupy; the
 * state machine still has to earn every rung below it in the ordinary way
 * (dwell, hysteresis, resistance) — this only closes the top of the ladder.
 * @param {ConquestMarginVerdict|null|undefined} verdict @returns {number}
 */
export function conquestCeilingRank(verdict) {
  const ceiling = text(recordOf(verdict).ceiling) || CONQUEST_EXECUTION_TUNING.CAPPED_CEILING;
  const index = CONQUEST_LADDER.indexOf(ceiling);
  return index >= 0 ? index : CONQUEST_LADDER.indexOf(CONQUEST_EXECUTION_TUNING.CAPPED_CEILING);
}

/**
 * THE INHERITANCE COUNTERFORCE, summed over what the victor now holds.
 *
 * Each held settlement contributes the share of its own granary that is EMPTY —
 * `1 - months/capacity`, from the two readers the food engine already exposes —
 * and a settlement whose capacity cannot be read contributes NOTHING, because a
 * famine you cannot measure is not one you may charge the victor for.
 *
 * The sum is deliberately UNCAPPED by count. Capping it would make the tenth
 * dying town free, and the whole point of the counterforce is that it can
 * outgrow the prize.
 *
 * @param {Array<{ storageMonths?: unknown, capacityMonths?: unknown }>} held
 * @returns {{ hunger: number, measured: number, unmeasured: number, receipt: string }}
 */
export function inheritedHunger(held) {
  const rows = Array.isArray(held) ? held : [];
  let hunger = 0;
  let measured = 0;
  let unmeasured = 0;
  for (const raw of rows) {
    const row = recordOf(raw);
    const months = Number(row.storageMonths);
    const capacity = Number(row.capacityMonths);
    if (!Number.isFinite(months) || !Number.isFinite(capacity) || capacity <= 0) {
      unmeasured += 1;
      continue;
    }
    measured += 1;
    hunger += clamp01(1 - months / capacity);
  }
  const total = round4(hunger);
  return {
    hunger: total,
    measured,
    unmeasured,
    receipt: measured === 0
      ? 'nothing the victor holds can be weighed for hunger.'
      : `the victor now feeds ${measured} settlement${measured === 1 ? '' : 's'} it did not feed before,`
        + ` and ${total} granaries' worth of them are empty.`,
  };
}

/**
 * The factor an inherited famine applies to occupier BENEFIT. Exactly 1 when
 * nothing held is hungry, so a well-fed empire's yield is untouched; monotone
 * downward from there and never zero — a starving province still pays
 * something, just less and less.
 * @param {unknown} hunger @returns {number}
 */
export function inheritanceBenefitFactor(hunger) {
  const h = Number(hunger);
  if (!Number.isFinite(h) || h <= 0) return 1;
  return round4(1 / (1 + h));
}

/**
 * The severity an inherited famine ADDS to the occupier's garrison bill. Also
 * exactly 0 at zero hunger, so the dormant expression is the pre-wire one.
 * @param {unknown} hunger @returns {number}
 */
export function inheritanceBurdenAddend(hunger) {
  const h = Number(hunger);
  if (!Number.isFinite(h) || h <= 0) return 0;
  return round4(h * CONQUEST_EXECUTION_TUNING.INHERITANCE_BURDEN_WEIGHT);
}
