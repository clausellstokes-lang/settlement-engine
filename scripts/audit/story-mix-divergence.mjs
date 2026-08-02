/**
 * Pure seed-pair comparison for the whole-world soak's event-type mix.
 *
 * Total-variation distance answers the useful question in plain units: what
 * share of one normalized story mix must move to become the other? The second
 * threshold converts that share back into events using the smaller sample. It
 * prevents the exact weak proof this instrument replaces, where one changed RNG
 * draw was enough to earn `seed_divergent` through an unrelated state hash.
 *
 * These are acceptance thresholds, declared before the pending soak rerun. They
 * are deliberately not inferred from whatever the next measurement happens to
 * produce.
 */
export const STORY_MIX_DIVERGENCE_THRESHOLDS = Object.freeze({
  minTotalVariationDistance: 0.10,
  minShiftedEventEquivalents: 2,
});
export const STORY_MIX_DIVERGENCE_INSTRUMENT = 'event_type_total_variation_v1';

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** Floating arithmetic at an authored boundary may land one machine epsilon
 * below it (for example, two tenths times ten). Admit only that representation
 * noise; this is not a measurement tolerance and cannot widen the envelope. */
function meetsBoundary(value, boundary) {
  const epsilon = Number.EPSILON * Math.max(1, Math.abs(value), Math.abs(boundary)) * 8;
  return value + epsilon >= boundary;
}

/**
 * @param {unknown} yearly
 * @param {string} label
 */
function aggregateEventTypeCounts(yearly, label) {
  /** @type {Record<string, number>} */
  const counts = Object.create(null);
  /** @type {string[]} */
  const invalidEntries = [];

  if (!Array.isArray(yearly)) {
    return { counts, totalEvents: 0, distinctTypes: 0, years: 0, invalidEntries: [`${label}.yearly`] };
  }

  for (let index = 0; index < yearly.length; index += 1) {
    const eventTypeCounts = isRecord(yearly[index])
      ? yearly[index].eventTypeCounts
      : null;
    if (!isRecord(eventTypeCounts)) {
      invalidEntries.push(`${label}.yearly[${index}].eventTypeCounts`);
      continue;
    }
    for (const [type, rawCount] of Object.entries(eventTypeCounts)) {
      const count = Number(rawCount);
      if (typeof rawCount !== 'number' || !Number.isSafeInteger(count) || count < 0) {
        invalidEntries.push(`${label}.yearly[${index}].eventTypeCounts.${type}`);
        continue;
      }
      counts[type] = (counts[type] || 0) + count;
    }
  }

  const totalEvents = Object.values(counts)
    .reduce((total, count) => total + count, 0);
  return {
    counts,
    totalEvents,
    distinctTypes: Object.values(counts).filter((count) => count > 0).length,
    years: yearly.length,
    invalidEntries,
  };
}

/**
 * Compare the aggregate selected-event distributions for equal observation
 * windows from two seed runs. Tempo alone cannot satisfy this check: count maps
 * with identical proportions have zero distance even when their totals differ.
 *
 * @param {unknown} baselineYearly
 * @param {unknown} comparisonYearly
 */
export function compareStoryMixDistributions(baselineYearly, comparisonYearly) {
  const baseline = aggregateEventTypeCounts(baselineYearly, 'baseline');
  const comparison = aggregateEventTypeCounts(comparisonYearly, 'comparison');
  const types = [...new Set([
    ...Object.keys(baseline.counts),
    ...Object.keys(comparison.counts),
  ])].sort();

  const typeShifts = types.map((type) => {
    const baselineShare = baseline.totalEvents > 0
      ? (baseline.counts[type] || 0) / baseline.totalEvents
      : 0;
    const comparisonShare = comparison.totalEvents > 0
      ? (comparison.counts[type] || 0) / comparison.totalEvents
      : 0;
    return {
      type,
      baselineCount: baseline.counts[type] || 0,
      comparisonCount: comparison.counts[type] || 0,
      baselineShare,
      comparisonShare,
      absoluteShareShift: Math.abs(baselineShare - comparisonShare),
    };
  }).sort((left, right) => (
    (right.absoluteShareShift - left.absoluteShareShift)
    || (left.type < right.type ? -1 : left.type > right.type ? 1 : 0)
  ));

  const totalVariationDistance = typeShifts
    .reduce((total, shift) => total + shift.absoluteShareShift, 0) / 2;
  const shiftedEventEquivalents = totalVariationDistance
    * Math.min(baseline.totalEvents, comparison.totalEvents);
  const invalidEntries = [
    ...baseline.invalidEntries,
    ...comparison.invalidEntries,
  ];
  const equalWindows = baseline.years > 0 && baseline.years === comparison.years;
  const nonEmpty = baseline.totalEvents > 0 && comparison.totalEvents > 0;
  const passed = invalidEntries.length === 0
    && equalWindows
    && nonEmpty
    && meetsBoundary(
      totalVariationDistance,
      STORY_MIX_DIVERGENCE_THRESHOLDS.minTotalVariationDistance,
    )
    && meetsBoundary(
      shiftedEventEquivalents,
      STORY_MIX_DIVERGENCE_THRESHOLDS.minShiftedEventEquivalents,
    );

  return {
    passed,
    thresholds: STORY_MIX_DIVERGENCE_THRESHOLDS,
    baseline,
    comparison,
    equalWindows,
    nonEmpty,
    totalVariationDistance,
    shiftedEventEquivalents,
    typeShifts,
    invalidEntries,
  };
}

/**
 * Project the pure comparison into the durable child-receipt evidence. Keeping
 * this in the instrument module prevents the soak and aggregate validator from
 * drifting on field spellings or on which value actually earns the verdict.
 *
 * @param {{
 *   comparison: ReturnType<typeof compareStoryMixDistributions>,
 *   windowYears: number,
 *   baselineSeed: string,
 *   comparisonSeed: string,
 *   hashDiverged: boolean,
 * }} input
 */
export function buildStoryMixDivergenceEvidence({
  comparison,
  windowYears,
  baselineSeed,
  comparisonSeed,
  hashDiverged,
}) {
  return {
    instrument: STORY_MIX_DIVERGENCE_INSTRUMENT,
    verdict: comparison.passed ? 'PASS' : 'FAIL',
    passed: comparison.passed,
    windowYears,
    seeds: {
      baseline: baselineSeed,
      divergent: comparisonSeed,
    },
    thresholds: { ...comparison.thresholds },
    totalVariationDistance: comparison.totalVariationDistance,
    shiftedEventEquivalents: comparison.shiftedEventEquivalents,
    sampleTotals: {
      baseline: comparison.baseline.totalEvents,
      divergent: comparison.comparison.totalEvents,
    },
    distinctTypeTotals: {
      baseline: comparison.baseline.distinctTypes,
      divergent: comparison.comparison.distinctTypes,
    },
    topTypeShifts: comparison.typeShifts.slice(0, 5),
    equalWindows: comparison.equalWindows,
    nonEmpty: comparison.nonEmpty,
    invalidEntries: comparison.invalidEntries,
    // Diagnostic only. A false value cannot veto a measured mix verdict and a
    // true value cannot rescue one; it explains whether state also forked.
    hashDiverged,
  };
}

/** @param {unknown} value @returns {value is number} */
const isNonNegativeSafeInteger = (value) => (
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
);

/** @param {unknown} value @returns {value is number} */
const isUnitFinite = (value) => (
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
);

/**
 * Admission wall for a v5 child receipt. This validates a PASSING instrument,
 * not arbitrary failed diagnostics: the realm-scale collector must reject a
 * truncated or hand-edited receipt before it can feed certification.
 *
 * @param {unknown} raw
 * @returns {boolean}
 */
export function isPassingStoryMixDivergenceEvidence(raw) {
  if (!isRecord(raw)) return false;
  const thresholds = isRecord(raw.thresholds) ? raw.thresholds : {};
  const seeds = isRecord(raw.seeds) ? raw.seeds : {};
  const sampleTotals = isRecord(raw.sampleTotals) ? raw.sampleTotals : {};
  const distinctTypeTotals = isRecord(raw.distinctTypeTotals)
    ? raw.distinctTypeTotals
    : {};
  const totalVariationDistance = raw.totalVariationDistance;
  const shiftedEventEquivalents = raw.shiftedEventEquivalents;
  const baselineTotal = sampleTotals.baseline;
  const divergentTotal = sampleTotals.divergent;
  const expectedShifted = Number(totalVariationDistance)
    * Math.min(Number(baselineTotal), Number(divergentTotal));
  const roundingSlack = Number.EPSILON
    * Math.max(1, Math.abs(expectedShifted), Math.abs(Number(shiftedEventEquivalents)))
    * 16;
  const topTypeShifts = Array.isArray(raw.topTypeShifts) ? raw.topTypeShifts : [];
  const shiftsValid = topTypeShifts.length > 0 && topTypeShifts.every((shift) => (
    isRecord(shift)
    && typeof shift.type === 'string'
    && shift.type.length > 0
    && isNonNegativeSafeInteger(shift.baselineCount)
    && isNonNegativeSafeInteger(shift.comparisonCount)
    && isUnitFinite(shift.baselineShare)
    && isUnitFinite(shift.comparisonShare)
    && isUnitFinite(shift.absoluteShareShift)
  ));

  return raw.instrument === STORY_MIX_DIVERGENCE_INSTRUMENT
    && raw.verdict === 'PASS'
    && raw.passed === true
    && Number.isSafeInteger(raw.windowYears)
    && Number(raw.windowYears) > 0
    && typeof seeds.baseline === 'string'
    && seeds.baseline.length > 0
    && typeof seeds.divergent === 'string'
    && seeds.divergent.length > 0
    && seeds.baseline !== seeds.divergent
    && thresholds.minTotalVariationDistance
      === STORY_MIX_DIVERGENCE_THRESHOLDS.minTotalVariationDistance
    && thresholds.minShiftedEventEquivalents
      === STORY_MIX_DIVERGENCE_THRESHOLDS.minShiftedEventEquivalents
    && isUnitFinite(totalVariationDistance)
    && meetsBoundary(
      Number(totalVariationDistance),
      STORY_MIX_DIVERGENCE_THRESHOLDS.minTotalVariationDistance,
    )
    && typeof shiftedEventEquivalents === 'number'
    && Number.isFinite(shiftedEventEquivalents)
    && meetsBoundary(
      shiftedEventEquivalents,
      STORY_MIX_DIVERGENCE_THRESHOLDS.minShiftedEventEquivalents,
    )
    && isNonNegativeSafeInteger(baselineTotal)
    && baselineTotal > 0
    && isNonNegativeSafeInteger(divergentTotal)
    && divergentTotal > 0
    && isNonNegativeSafeInteger(distinctTypeTotals.baseline)
    && distinctTypeTotals.baseline > 0
    && distinctTypeTotals.baseline <= baselineTotal
    && isNonNegativeSafeInteger(distinctTypeTotals.divergent)
    && distinctTypeTotals.divergent > 0
    && distinctTypeTotals.divergent <= divergentTotal
    && Math.abs(Number(shiftedEventEquivalents) - expectedShifted) <= roundingSlack
    && shiftsValid
    && raw.equalWindows === true
    && raw.nonEmpty === true
    && Array.isArray(raw.invalidEntries)
    && raw.invalidEntries.length === 0
    && typeof raw.hashDiverged === 'boolean';
}
