/**
 * domain/foundingKind.js — THE TYPED FOUNDING RECORD (charter §5.0's missing input).
 *
 * `history.founding.kind` is the settlement's FOUNDING CHARACTER: who brought it into
 * being, as a bounded type rather than as prose. It exists because §5.0 (THE MORPHOLOGY
 * LAW) derives a settlement's plan from whether an AUTHORITY founded it, and until this
 * field there was no canonical answer — `settlementReason` and `founding.foundedBy` are
 * free prose, and §5.0 forbids a prose regex standing in for a missing fact. MF-P1
 * measured the consequence: across 120 live settlements the planned band was reached
 * 0% of the time, because the only inputs that existed (legitimacy, stability, faction
 * concentration) top out far below any threshold that keeps organic dominant.
 *
 * WHERE THE VALUE COMES FROM: the founder pools in generators/narrativeGenerator.js
 * (`FOUNDERS_BY_TIER`) are typed pairs, and `genArrivalDetail` reads the kind off the
 * SAME pool entry the prose came from. The type is therefore attached at the authoring
 * site and cannot contradict the sentence beside it. No draw is added.
 *
 * THE DORMANCY / BACKFILL LAW: an absent, unknown or malformed value reads as
 * `organic`, which is also §5.0's default morphology — so every settlement generated
 * before this field existed renders EXACTLY the map it rendered before, and no lived
 * history is edited. THE PROMISE holds for every world that already exists.
 *
 * PURITY: no Date, no Math.random, no localeCompare — this module is a vocabulary and
 * a coercion, nothing else.
 */

/**
 * The bounded founding vocabulary. Ordered from least to most imposed authority, which
 * is also the order §5.0's morphology scale reads them in.
 *
 *  • `organic`   — nobody founded it on purpose; it accreted. The historical default,
 *                  and the backfill value for every settlement minted before this field.
 *  • `refuge`    — founded by people escaping something (refugees, escaped serfs,
 *                  exiles). Sited for safety; grows organically but hugs its defence.
 *  • `religious` — founded by or around a religious community (culture-neutral: this
 *                  records the FACT of a founding body, never a doctrine — the deity
 *                  doctrine forbids theological content, and none is carried here).
 *  • `charter`   — founded by a grant: a noble's licence, a merchant consortium's
 *                  waypoint, a crown obligation to populate land. An authority WANTED
 *                  it to exist but did not draft its streets.
 *  • `military`  — founded as or around a military establishment; a garrison plan
 *                  imposes regularity on the part it holds.
 *  • `planned`   — founded by decree and laid out before it was built. The rarest, and
 *                  the ONLY kind that unlocks §5.0's PLANNED GEOMETRY band.
 *
 * @type {ReadonlyArray<'organic'|'refuge'|'religious'|'charter'|'military'|'planned'>}
 */
export const FOUNDING_KINDS = Object.freeze([
  'organic', 'refuge', 'religious', 'charter', 'military', 'planned',
]);

/** The value an absent / unknown founding record reads as (the backfill law). */
export const DEFAULT_FOUNDING_KIND = 'organic';

/**
 * ORDER PRESSURE by founding kind, 0..1 — how strongly the founding authority could
 * impose a plan. This is the §42/§43 home for the numbers §5.0's morphology selector
 * bands on; every value is an ARGUMENT about the historical record, not a tuning knob:
 *
 *  organic 0.00   — no founding authority existed to impose anything.
 *  refuge  0.06   — a refuge is sited deliberately (defensible ground) but built
 *                   ad hoc by people with nothing; the siting shows, the plan does not.
 *  religious 0.34 — a monastic or parish foundation lays out a precinct and lets the
 *                   secular town accrete around it: real regularity, locally bounded.
 *  charter 0.52   — a bastide/charter town is the historical middle of the scale: the
 *                   grant fixes the market place and the burgage frontages, and the
 *                   rest grows. This is the level at which REGULARIZED becomes right.
 *  military 0.70  — a garrison foundation lays out its own works to a plan and the
 *                   civil town regularizes against them.
 *  planned 1.00   — laid out whole before it was built (colonia, imperial decree).
 *
 * ⚠ UNSOAKED. These six values are PROPOSED-WITH-RATIONALE, not measured, and they ride
 * the owner's tuning signature. The selector that consumes them (fabric/morphology.js)
 * states the band thresholds they feed.
 * @type {Readonly<Record<string, number>>}
 */
export const FOUNDING_ORDER_PRESSURE = Object.freeze({
  organic: 0,
  refuge: 0.06,
  religious: 0.34,
  charter: 0.52,
  military: 0.70,
  planned: 1,
});

/**
 * Coerce any value to a known founding kind, defaulting to `organic` (the backfill law).
 * Fail-closed by design: an unknown string never becomes a more-planned kind by accident.
 * @param {unknown} v
 * @returns {'organic'|'refuge'|'religious'|'charter'|'military'|'planned'}
 */
export function coerceFoundingKind(v) {
  for (const k of FOUNDING_KINDS) if (k === v) return k;
  return DEFAULT_FOUNDING_KIND;
}

/**
 * Read a settlement's founding kind through the backfill law. Total: a settlement with
 * no history, no founding record, or a founding record minted before this field all
 * read `organic`.
 * @param {{ history?: { founding?: { kind?: unknown } } } | null | undefined} settlement
 * @returns {'organic'|'refuge'|'religious'|'charter'|'military'|'planned'}
 */
export function readFoundingKind(settlement) {
  const founding = settlement && settlement.history ? settlement.history.founding : null;
  return coerceFoundingKind(founding && typeof founding === 'object' ? founding.kind : undefined);
}

/**
 * The founding kind's order pressure, 0..1, through the backfill law.
 * @param {{ history?: { founding?: { kind?: unknown } } } | null | undefined} settlement
 * @returns {number}
 */
export function foundingOrderPressure(settlement) {
  const pressure = FOUNDING_ORDER_PRESSURE[readFoundingKind(settlement)];
  return typeof pressure === 'number' ? pressure : 0;
}
