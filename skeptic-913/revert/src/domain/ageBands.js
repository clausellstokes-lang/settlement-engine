/**
 * domain/ageBands.js — the ONE temporal-register helper for the weekly tick.
 *
 * THE TICK IS ONE WEEK, on the COMMITTED 4-4-5 calendar (worldState.js, commits
 * 888c2769 + 6ca73878): 4-week months in a 4/4/5 quarter grid, THIRTEEN-week
 * seasons (four equal 13-week quarters; the 5-week months 3/6/9/12 close each
 * season), FIFTY-TWO-week years. Any elapsed-tick count reads its temporal
 * register through THIS shared helper — the cause-resolution lifecycle stamps
 * origin / resolution / historicization ticks, and W2's prose binds to the SAME
 * band boundaries here. Do NOT hardcode band arithmetic anywhere else (owner:
 * "emit the band boundaries from one shared helper").
 *
 * SINGLE SOURCE + DRIFT PIN: the boundaries below are pinned equal to the
 * calendar law in code — worldState.js's INTERVAL_WEEKS {one_week:1, one_month:4,
 * one_season:13, one_year:52} (advanceInterval.js re-exports it as
 * weeksPerInterval). They are NOT imported here because this file must stay a
 * true headless leaf (the display side-car imports it; worldState would drag
 * simulationRules/clock/clone into that chunk). Instead
 * tests/domain/causeResolutionLifecycle.test.js asserts band-boundary equality
 * against the imported INTERVAL_WEEKS table, so drift is impossible.
 *
 * PIN (the constitution's age-band rule): historicizing language ("the lean
 * years") is impossible below the YEARS threshold — only `years-past` permits it;
 * a freshly-resolved cause reads fresh ("the pay came through just last month" =
 * `this-month`). The lifecycle + W2 both gate their register on this.
 *
 * PURE: imports nothing, no rng, no wall-clock. A pure leaf both the engine
 * (worldPulse) and the display layer may import without crossing a boundary.
 */

/**
 * The age bands, widest-elapsed LAST, each with its inclusive upper bound in
 * WEEKS (ticks). `Infinity` is the open-ended terminal band. Ordered narrow→wide
 * so the first band whose `maxTicks` the elapsed count does not exceed wins.
 * Boundaries pinned to INTERVAL_WEEKS (see the module note): month 4, season 13,
 * year 52.
 * @type {ReadonlyArray<{ id: string, maxTicks: number, weeks: string }>}
 */
export const AGE_BANDS = Object.freeze([
  { id: 'this-week',   maxTicks: 1,        weeks: '≤1wk (this week)' },
  { id: 'this-month',  maxTicks: 4,        weeks: '≤4wk (this month)' },
  { id: 'this-season', maxTicks: 13,       weeks: '≤13wk (this season)' },
  { id: 'this-year',   maxTicks: 52,       weeks: '≤52wk (this year)' },
  { id: 'years-past',  maxTicks: Infinity, weeks: '>52wk (years past)' },
]);

/** The set of band ids, for coverage pins / exhaustive switches. */
export const AGE_BAND_IDS = Object.freeze(AGE_BANDS.map((b) => b.id));

/** The ONLY band whose register permits historicizing "the lean years" language
 *  — the constitution's PIN. The lifecycle refuses to historicize below it. */
export const HISTORICIZE_BAND = 'years-past';

/**
 * The temporal register of an elapsed-tick (elapsed WEEKS) count. Clamps a
 * negative or non-finite elapsed to 0 (⇒ `this-week`), so a clock skew never
 * throws. Deterministic, pure.
 * @param {number} elapsedTicks  ticks (weeks) since the stamped origin
 * @returns {string} an AGE_BANDS id
 */
export function ageBandForElapsed(elapsedTicks) {
  const e = Number.isFinite(elapsedTicks) && elapsedTicks > 0 ? elapsedTicks : 0;
  for (const band of AGE_BANDS) {
    if (e <= band.maxTicks) return band.id;
  }
  // Unreachable (the terminal band is Infinity) — defensive.
  return AGE_BANDS[AGE_BANDS.length - 1].id;
}

/**
 * The register for an event at `atTick` measured from `originTick`. A missing /
 * malformed origin reads `this-week` (elapsed 0). Pure.
 * @param {number|null|undefined} originTick
 * @param {number|null|undefined} atTick
 * @returns {string} an AGE_BANDS id
 */
export function ageBandBetween(originTick, atTick) {
  const from = Number(originTick);
  const to = Number(atTick);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return AGE_BANDS[0].id;
  return ageBandForElapsed(to - from);
}
