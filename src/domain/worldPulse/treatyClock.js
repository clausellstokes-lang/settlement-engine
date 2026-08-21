import { INTERVAL_WEEKS } from './intervalWeeks.js';

// Persisted treaties minted before the weekly-clock correction priced one
// nominal year as twelve ticks. Unmarked records must retain that historical
// interpretation; newly minted records carry the current fifty-two-week clock.
export const LEGACY_TREATY_TICKS_PER_YEAR = 12;
export const CURRENT_TREATY_TICKS_PER_YEAR = INTERVAL_WEEKS.one_year;

/** @param {number} value */
function round4(value) { return Math.round((Number(value) || 0) * 1e4) / 1e4; }

/** @param {unknown} value */
function isPositiveInteger(value) {
  return Number.isInteger(value) && Number(value) > 0;
}

/**
 * Resolve the clock a treaty was minted under. An absent or invalid marker is a
 * legacy persisted treaty, never an invitation to reinterpret its horizons.
 * @param {Record<string, unknown> | null | undefined} treaty
 */
export function treatyTicksPerYearOf(treaty) {
  const marker = treaty?.treatyTicksPerYear;
  return isPositiveInteger(marker) ? Number(marker) : LEGACY_TREATY_TICKS_PER_YEAR;
}

/**
 * Whole display years left on one term. A standalone calculation is current;
 * supplying a treaty resolves its persisted legacy/current clock marker.
 * @param {number} expiresTick @param {number} tick
 * @param {Record<string, unknown> | null | undefined} [treaty]
 */
export function treatyYearsRemaining(expiresTick, tick, treaty) {
  const ticks = Number(expiresTick) - Number(tick);
  if (!(ticks > 0)) return 0;
  const ticksPerYear = treaty == null ? CURRENT_TREATY_TICKS_PER_YEAR : treatyTicksPerYearOf(treaty);
  return Math.ceil(ticks / ticksPerYear);
}

/**
 * Resolve a requested duration, shortening it to the longest affordable whole
 * year instead of dropping the term when the authored ask outruns its budget.
 * @param {{ baseYears: number, maxYears: number, weight: number }} spec
 * @param {number} remaining @param {number} margin01 @param {number} press
 * @param {{ base: number, marginWeight: number, extremityWeight: number }} curve
 * @returns {{ years: number, weightSpent: number }}
 */
export function affordableTreatyDuration(spec, remaining, margin01, press, curve) {
  const scale = curve.base + curve.marginWeight * margin01 + curve.extremityWeight * margin01 * margin01;
  const requested = Math.min(spec.maxYears, Math.max(1, Math.round(spec.baseYears * scale * press)));
  const affordable = Math.floor(((remaining + 1e-9) * spec.baseYears) / spec.weight);
  let years = Math.min(requested, affordable);
  let weightSpent = round4(spec.weight * (years / spec.baseYears));
  while (years > 0 && weightSpent > remaining + 1e-9) {
    years -= 1;
    weightSpent = round4(spec.weight * (years / spec.baseYears));
  }
  return { years, weightSpent };
}

/** @param {unknown} value */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Same-schema nested migration for persisted treaty clocks. Only an unmarked or
 * invalid treaty record is copied and stamped; already-marked ledgers (and states
 * with no treaty ledger) are identity no-ops. The input graph is never mutated.
 *
 * @template {Record<string, unknown>} T
 * @param {T} raw
 * @returns {T}
 */
export function migrateTreatyClockMarkers(raw) {
  if (!isRecord(raw)) return raw;
  const spatialLedgers = /** @type {Record<string, unknown>} */ (raw.spatialLedgers);
  if (!isRecord(spatialLedgers)) return raw;
  const treaties = /** @type {Record<string, unknown>} */ (spatialLedgers.treaties);
  if (!isRecord(treaties)) return raw;

  /** @type {Record<string, unknown> | null} */
  let nextTreaties = null;
  for (const [key, value] of Object.entries(treaties)) {
    if (!isRecord(value)) continue;
    const treaty = /** @type {Record<string, unknown>} */ (value);
    if (isPositiveInteger(treaty.treatyTicksPerYear)) continue;
    if (!nextTreaties) nextTreaties = { ...treaties };
    nextTreaties[key] = {
      ...treaty,
      treatyTicksPerYear: LEGACY_TREATY_TICKS_PER_YEAR,
    };
  }

  if (!nextTreaties) return raw;
  return /** @type {T} */ ({
    ...raw,
    spatialLedgers: {
      ...spatialLedgers,
      treaties: nextTreaties,
    },
  });
}
