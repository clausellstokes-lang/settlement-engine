/**
 * The long-soak behavioral certification contract.
 *
 * This module deliberately knows nothing about the simulation kernel. It accepts
 * normalized observations emitted by the maintained audit harness and answers a
 * narrower question: did the release matrix earn every behavioral claim we intend
 * to make? Keeping the oracle pure prevents the harness from quietly moving its
 * goalposts after seeing a run.
 *
 * The thresholds are conservative regression floors, not tuning targets. A miss
 * is evidence to inspect; it never auto-tunes the engine and it never rewrites the
 * committed certification manifest.
 */

import { BEHAVIORAL_CONTRACT_VERSION } from './certificationSchema.js';

/** @typedef {Record<string, unknown>} UnknownRecord */
/**
 * @typedef {Object} BehavioralYear
 * @property {unknown} [year]
 * @property {unknown} [eventCount]
 * @property {unknown} [majorEventCount]
 * @property {Record<string, unknown>} [eventTypeCounts]
 * @property {Record<string, unknown>} [moverCounts]
 * @property {Record<string, unknown>} [arcCounts]
 * @property {Record<string, unknown>} [motion]
 * @property {Record<string, unknown>} [attentionCounts]
 * @property {{
 *   pendingProposals?: unknown,
 *   attempts?: unknown,
 *   completions?: unknown,
 *   integrityFailures?: unknown,
 * }} [succession]
 * @property {{ crossFamilyEdges?: unknown, familyPairs?: unknown[] }} [causal]
 * @property {Record<string, UnknownRecord>} [stateVectors]
 */
/**
 * @typedef {Object} BehavioralReceipt
 * @property {unknown} [caseId]
 * @property {unknown} [seed]
 * @property {unknown} [years]
 * @property {unknown} [settlements]
 * @property {{
 *   schemaVersion?: unknown,
 *   yearly?: BehavioralYear[],
 *   settlementIds?: unknown[],
 *   controls?: {
 *     neighbor?: UnknownRecord,
 *     dark?: UnknownRecord,
 *   },
 * }} [behavioral]
 */
/**
 * @typedef {Object} BehavioralYearRow
 * @property {BehavioralReceipt} receipt
 * @property {BehavioralYear} year
 * @property {boolean} finalDecade
 */
/**
 * @typedef {Object} BehavioralCheck
 * @property {string} id
 * @property {string} label
 * @property {boolean} passed
 * @property {unknown} observed
 * @property {unknown} threshold
 */

export { BEHAVIORAL_CONTRACT_VERSION };
// v2 added uncapped post-apply receipts and authoritative major/succession/causal
// semantics. v3 separates pending succession proposals from actual applied
// attempts/completions. v4 separates public event tempo from state-only mechanical
// refreshes and records their count independently. Older receipts must never be
// reinterpreted by this oracle.
export const BEHAVIORAL_OBSERVATION_VERSION = 4;
export const HUMAN_CHRONICLE_REVIEW_VERSION = 1;

/**
 * The whole-world soak RECEIPT ENVELOPE version, which is a different axis from
 * BEHAVIORAL_OBSERVATION_VERSION above: the observation version governs the
 * meaning of each behavioral.yearly row, while this governs the receipt's
 * top-level sections. v5 ADDS the `subsystems` section (the per-subsystem rule
 * state and the worldState key census that subsystemCertification.js grades
 * against). It changes NO v4 field: every v4 section keeps its exact meaning, so
 * the behavioral oracle continues to read completed v4 evidence unchanged and
 * BEHAVIORAL_OBSERVATION_VERSION deliberately stays at 4. Bumping the observation
 * version instead would have blinded this oracle to every soak receipt already on
 * disk, which is a silent evidence regression rather than a schema improvement.
 */
export const SOAK_RECEIPT_SCHEMA_VERSION = 5;

/**
 * Receipt envelope versions this estate still reads. v4 receipts predate the
 * subsystems section; consumers must grade what a v4 receipt carries and report
 * the rest as an honest instrument gap rather than as a pass.
 * @type {ReadonlyArray<number>}
 */
export const SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS = Object.freeze([4, 5]);

export const CERTIFICATION_HORIZONS = Object.freeze({
  useful: Object.freeze({
    years: 30,
    role: 'A useful-campaign behavior horizon. Evidence-bearing, but not sufficient for the product certificate.',
    productGate: false,
  }),
  release: Object.freeze({
    years: 100,
    role: 'The release and endurance horizon. This is the only horizon that can earn the product certificate.',
    productGate: true,
  }),
  research: Object.freeze({
    years: 300,
    role: 'An attractor and legibility study. It diagnoses the model and never widens the launch promise by itself.',
    productGate: false,
  }),
});

/**
 * Macro families are intentionally broader than individual kernel functions.
 * A rare leaf may correctly stay dormant in one realm; a whole load-bearing
 * family going dark across the release matrix is a certification failure.
 */
export const BEHAVIORAL_MOVER_FAMILIES = Object.freeze([
  'pressure',
  'place',
  'population',
  'economy',
  'politics',
  'war',
  'faith',
  'people',
  'constructive',
  'knowledge',
]);

/**
 * Predeclared v1 gates. Rates use settlement-time denominators so a four-town
 * realm and a thirty-town realm are comparable. Very low floors catch silence
 * without pretending that rare events should become routine.
 */
export const BEHAVIORAL_THRESHOLDS = Object.freeze({
  mover: Object.freeze({
    minEventsPer100SettlementYears: 0.25,
    minFinalDecadeCaseShare: 0.25,
    maxSingleFamilyShare: 0.65,
  }),
  tempo: Object.freeze({
    minEventsPerSettlementYear: 0.25,
    maxEventsPerSettlementYear: 52,
    minMajorEventsPerSettlementDecade: 0.25,
    maxMajorEventsPerSettlementDecade: 20,
    minDistinctEventTypes: 12,
    minEffectiveTypeDiversity: 4,
    maxDominantTypeShare: 0.55,
  }),
  arcs: Object.freeze({
    minEachPolarityPer100SettlementYears: 0.25,
    minEachPolarityCaseShare: 0.25,
    requireEachPolarityInFinalDecade: true,
  }),
  motion: Object.freeze({
    populationMinMovingShare: 0.05,
    populationFinalDecadeMinMovingShare: 0.02,
    prosperityMinMovingShare: 0.03,
    prosperityFinalDecadeMinMovingShare: 0.01,
    powerMinMovingShare: 0.02,
    powerFinalDecadeMinMovingShare: 0.01,
    minMedianPowerEntropyRange: 0.03,
  }),
  neighbor: Object.freeze({
    minReleaseProbes: 3,
    minScaleBands: 2,
    minSeedFamilies: 2,
    minTargetDistanceAtUsefulHorizon: 0.001,
    minRetainedFractionFromPeak: 0.50,
    minPositiveCheckpoints: 2,
  }),
  succession: Object.freeze({
    minAttemptsPerSettlementDecade: 0.05,
    minCompletionsPerSettlementDecade: 0.02,
    minCompletionShare: 0.05,
    maxCompletionShare: 0.95,
    maxIntegrityFailures: 0,
  }),
  attention: Object.freeze({
    minJainFairness: 0.70,
    minCasePassShare: 0.90,
    maxZeroAttentionSettlementShare: 0.05,
    maxSettlementToMeanRatio: 4,
  }),
  darkControls: Object.freeze({
    minReleaseProbes: 3,
    minScaleBands: 2,
    minSeedFamilies: 2,
    maxDarkActivity: 0,
    maxConditionalStateLeaks: 0,
    requireLitBaselineActivity: true,
  }),
  interactions: Object.freeze({
    maxBurstYearsShare: 0.05,
    maxP99EventsPerSettlementYear: 80,
    minCrossFamilyEdgesPer100SettlementYears: 0.10,
    maxCrossFamilyEdgeShareOfEvents: 0.50,
    minDistinctFamilyPairs: 3,
  }),
  humanChronicle: Object.freeze({
    minSampleCases: 2,
    minScaleBands: 2,
    minSeedFamilies: 2,
    minEntriesReviewed: 30,
    requiredCriteria: Object.freeze([
      'causalLegibility',
      'temporalCoherence',
      'settlementAttribution',
      'arcReadability',
    ]),
  }),
});

/**
 * @param {unknown} value
 * @param {number} [fallback]
 * @returns {number}
 */
const finite = (value, fallback = 0) => (
  Number.isFinite(Number(value)) ? Number(value) : fallback
);

/** @param {unknown[]} values @returns {number} */
const sum = (values) => {
  let total = 0;
  for (const value of values) total += finite(value);
  return total;
};

/**
 * @param {unknown} numerator
 * @param {number} denominator
 * @returns {number}
 */
const ratio = (numerator, denominator) => (
  denominator > 0 ? finite(numerator) / denominator : 0
);

/**
 * @param {unknown} count
 * @param {number} denominator
 * @param {number} scale
 * @returns {number}
 */
const rate = (count, denominator, scale) => ratio(count, denominator) * scale;

/** @param {unknown} value @returns {UnknownRecord} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {UnknownRecord} */ (value)
    : {}
);

/** @param {unknown} value @returns {Array<[string, unknown]>} */
const entriesOf = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.entries(/** @type {UnknownRecord} */ (value))
    : []
);

/** @param {unknown[]} values @returns {Record<string, number>} */
function countMap(values) {
  /** @type {Record<string, number>} */
  const result = {};
  for (const value of values) {
    for (const [key, count] of entriesOf(value)) {
      result[key] = (result[key] || 0) + finite(count);
    }
  }
  return result;
}

/**
 * @param {number[]} values
 * @param {number} fraction
 * @returns {number|null}
 */
function percentile(values, fraction) {
  const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * fraction;
  const low = Math.floor(position);
  const high = Math.ceil(position);
  if (low === high) return sorted[low];
  return sorted[low] + ((sorted[high] - sorted[low]) * (position - low));
}

/** @param {number[]} values @returns {number|null} */
function median(values) {
  return percentile(values, 0.5);
}

/** @param {Record<string, number>} counts @returns {number} */
function effectiveDiversity(counts) {
  const values = Object.values(counts).filter((value) => value > 0);
  const total = sum(values);
  if (!total) return 0;
  // Inverse Simpson diversity is an effective-number metric like exp(Shannon),
  // but uses only correctly-rounded arithmetic. The release oracle therefore
  // stays byte-stable across JS engines instead of adding transcendental math
  // to a source-bound certification receipt.
  const squares = sum(values.map((value) => value * value));
  return squares > 0 ? (total * total) / squares : 0;
}

/** @param {number[]} counts @returns {number} */
function jainFairness(counts) {
  if (!counts.length) return 0;
  const total = sum(counts);
  const squares = sum(counts.map((value) => finite(value) * finite(value)));
  if (squares === 0) return 0;
  return (total * total) / (counts.length * squares);
}

/**
 * @param {string} id
 * @param {string} label
 * @param {boolean} passed
 * @param {unknown} observed
 * @param {unknown} threshold
 * @returns {BehavioralCheck}
 */
function makeCheck(id, label, passed, observed, threshold) {
  return {
    id,
    label,
    passed: passed === true,
    observed,
    threshold,
  };
}

/** @param {BehavioralReceipt[]} receipts @returns {BehavioralReceipt[]} */
function releaseCasesFrom(receipts) {
  return receipts.filter((receipt) => (
    finite(receipt?.years) === CERTIFICATION_HORIZONS.release.years
    && receipt?.behavioral?.schemaVersion === BEHAVIORAL_OBSERVATION_VERSION
  ));
}

/** @param {BehavioralReceipt} receipt @returns {string} */
function seedFamilyOf(receipt) {
  const match = /-seed(\d+)$/.exec(String(receipt?.caseId || ''));
  return match ? `seed${match[1]}` : String(receipt?.seed || '');
}

/** @param {BehavioralReceipt[]} receipts @returns {BehavioralYearRow[]} */
function yearlyRowsOf(receipts) {
  return receipts.flatMap((receipt) => (
    Array.isArray(receipt?.behavioral?.yearly)
      ? receipt.behavioral.yearly.map((year) => ({
          receipt,
          year,
          finalDecade: finite(year?.year) > finite(receipt?.years) - 10,
        }))
      : []
  ));
}

/**
 * @param {BehavioralReceipt} receipt
 * @param {string} field
 * @returns {Record<string, number[]>}
 */
function valuesBySettlement(receipt, field) {
  /** @type {Record<string, number[]>} */
  const result = {};
  for (const row of receipt?.behavioral?.yearly || []) {
    for (const [settlementId, rawVector] of entriesOf(row?.stateVectors)) {
      const value = finite(asRecord(rawVector)[field], Number.NaN);
      if (!Number.isFinite(value)) continue;
      if (!result[settlementId]) result[settlementId] = [];
      result[settlementId].push(value);
    }
  }
  return result;
}

/**
 * @param {BehavioralReceipt[]} receipts
 * @param {BehavioralYearRow[]} rows
 * @param {number} settlementYears
 * @returns {BehavioralCheck[]}
 */
function checkMoverActivity(receipts, rows, settlementYears) {
  const thresholds = BEHAVIORAL_THRESHOLDS.mover;
  const totals = countMap(rows.map(({ year }) => year?.moverCounts));
  const classifiedTotal = sum(Object.values(totals));
  const finalRows = rows.filter((row) => row.finalDecade);
  /** @type {BehavioralCheck[]} */
  const checks = [];

  for (const family of BEHAVIORAL_MOVER_FAMILIES) {
    const familyTotal = finite(totals[family]);
    const activeCases = receipts.filter((receipt) => (
      sum((receipt.behavioral?.yearly || [])
        .filter((year) => finite(year?.year) > finite(receipt.years) - 10)
        .map((year) => year?.moverCounts?.[family])) > 0
    )).length;
    checks.push(makeCheck(
      `mover.${family}.total`,
      `${family} mover remains active across the release span`,
      rate(familyTotal, settlementYears, 100)
        >= thresholds.minEventsPer100SettlementYears,
      {
        events: familyTotal,
        per100SettlementYears: rate(familyTotal, settlementYears, 100),
      },
      { minEventsPer100SettlementYears: thresholds.minEventsPer100SettlementYears },
    ));
    checks.push(makeCheck(
      `mover.${family}.tail`,
      `${family} mover reaches the final decade`,
      ratio(activeCases, receipts.length) >= thresholds.minFinalDecadeCaseShare,
      {
        activeCases,
        cases: receipts.length,
        share: ratio(activeCases, receipts.length),
        finalDecadeEvents: sum(finalRows.map(({ year }) => year?.moverCounts?.[family])),
      },
      { minFinalDecadeCaseShare: thresholds.minFinalDecadeCaseShare },
    ));
  }

  const dominant = Object.entries(totals).sort((left, right) => right[1] - left[1])[0] || [null, 0];
  checks.push(makeCheck(
    'mover.dominance',
    'no mover family monopolizes the classified activity',
    classifiedTotal > 0 && ratio(dominant[1], classifiedTotal) <= thresholds.maxSingleFamilyShare,
    {
      family: dominant[0],
      events: dominant[1],
      classifiedEvents: classifiedTotal,
      share: ratio(dominant[1], classifiedTotal),
    },
    { maxSingleFamilyShare: thresholds.maxSingleFamilyShare },
  ));
  return checks;
}

/**
 * @param {BehavioralYearRow[]} rows
 * @param {number} settlementYears
 * @returns {BehavioralCheck[]}
 */
function checkTempo(rows, settlementYears) {
  const thresholds = BEHAVIORAL_THRESHOLDS.tempo;
  const events = sum(rows.map(({ year }) => year?.eventCount));
  const majors = sum(rows.map(({ year }) => year?.majorEventCount));
  const typeCounts = countMap(rows.map(({ year }) => year?.eventTypeCounts));
  const distinctTypes = Object.values(typeCounts).filter((count) => count > 0).length;
  const diversity = effectiveDiversity(typeCounts);
  const dominant = Object.entries(typeCounts).sort((left, right) => right[1] - left[1])[0] || [null, 0];
  const eventRate = rate(events, settlementYears, 1);
  const majorRate = rate(majors, settlementYears, 10);

  return [
    makeCheck(
      'tempo.events',
      'event tempo stays alive without becoming weekly noise',
      eventRate >= thresholds.minEventsPerSettlementYear
        && eventRate <= thresholds.maxEventsPerSettlementYear,
      { events, perSettlementYear: eventRate },
      {
        minEventsPerSettlementYear: thresholds.minEventsPerSettlementYear,
        maxEventsPerSettlementYear: thresholds.maxEventsPerSettlementYear,
      },
    ),
    makeCheck(
      'tempo.majors',
      'major-event tempo stays consequential without thrashing',
      majorRate >= thresholds.minMajorEventsPerSettlementDecade
        && majorRate <= thresholds.maxMajorEventsPerSettlementDecade,
      { majorEvents: majors, perSettlementDecade: majorRate },
      {
        minMajorEventsPerSettlementDecade:
          thresholds.minMajorEventsPerSettlementDecade,
        maxMajorEventsPerSettlementDecade:
          thresholds.maxMajorEventsPerSettlementDecade,
      },
    ),
    makeCheck(
      'tempo.diversity',
      'the event vocabulary is diverse and not a disguised monoculture',
      distinctTypes >= thresholds.minDistinctEventTypes
        && diversity >= thresholds.minEffectiveTypeDiversity
        && ratio(dominant[1], events) <= thresholds.maxDominantTypeShare,
      {
        distinctTypes,
        effectiveTypeDiversity: diversity,
        dominantType: dominant[0],
        dominantTypeShare: ratio(dominant[1], events),
      },
      {
        minDistinctEventTypes: thresholds.minDistinctEventTypes,
        minEffectiveTypeDiversity: thresholds.minEffectiveTypeDiversity,
        maxDominantTypeShare: thresholds.maxDominantTypeShare,
      },
    ),
  ];
}

/**
 * @param {BehavioralReceipt[]} receipts
 * @param {BehavioralYearRow[]} rows
 * @param {number} settlementYears
 * @returns {BehavioralCheck[]}
 */
function checkArcs(receipts, rows, settlementYears) {
  const thresholds = BEHAVIORAL_THRESHOLDS.arcs;
  const finalRows = rows.filter((row) => row.finalDecade);
  /** @type {BehavioralCheck[]} */
  const checks = [];
  /** @type {Array<'constructive'|'destructive'>} */
  const polarities = ['constructive', 'destructive'];
  for (const polarity of polarities) {
    const count = sum(rows.map(({ year }) => year?.arcCounts?.[polarity]));
    const activeCases = receipts.filter((receipt) => (
      sum((receipt.behavioral?.yearly || [])
        .map((year) => year?.arcCounts?.[polarity])) > 0
    )).length;
    const tailCount = sum(finalRows.map(({ year }) => year?.arcCounts?.[polarity]));
    checks.push(makeCheck(
      `arcs.${polarity}`,
      `${polarity} arcs remain part of the world`,
      rate(count, settlementYears, 100)
          >= thresholds.minEachPolarityPer100SettlementYears
        && ratio(activeCases, receipts.length) >= thresholds.minEachPolarityCaseShare
        && (!thresholds.requireEachPolarityInFinalDecade || tailCount > 0),
      {
        count,
        per100SettlementYears: rate(count, settlementYears, 100),
        activeCaseShare: ratio(activeCases, receipts.length),
        finalDecadeCount: tailCount,
      },
      thresholds,
    ));
  }
  return checks;
}

/**
 * @param {BehavioralYearRow[]} rows
 * @param {'population'|'prosperity'|'power'} dimension
 * @param {boolean} [finalDecadeOnly]
 */
function motionShare(rows, dimension, finalDecadeOnly = false) {
  const selected = finalDecadeOnly ? rows.filter((row) => row.finalDecade) : rows;
  const transitions = sum(selected.map(({ year }) => year?.motion?.[`${dimension}Transitions`]));
  const moved = sum(selected.map(({ year }) => year?.motion?.[`${dimension}Moved`]));
  return { transitions, moved, share: ratio(moved, transitions) };
}

/**
 * @param {BehavioralReceipt[]} receipts
 * @param {BehavioralYearRow[]} rows
 * @returns {BehavioralCheck[]}
 */
function checkMotion(receipts, rows) {
  const thresholds = BEHAVIORAL_THRESHOLDS.motion;
  /** @type {BehavioralCheck[]} */
  const checks = [];
  /** @type {Array<'population'|'prosperity'|'power'>} */
  const dimensions = ['population', 'prosperity', 'power'];
  for (const dimension of dimensions) {
    const all = motionShare(rows, dimension);
    const tail = motionShare(rows, dimension, true);
    const min = thresholds[`${dimension}MinMovingShare`];
    const tailMin = thresholds[`${dimension}FinalDecadeMinMovingShare`];
    checks.push(makeCheck(
      `motion.${dimension}`,
      `${dimension} continues to move through the release horizon`,
      all.transitions > 0 && all.share >= min
        && tail.transitions > 0 && tail.share >= tailMin,
      { wholeSpan: all, finalDecade: tail },
      { minMovingShare: min, finalDecadeMinMovingShare: tailMin },
    ));
  }

  const entropyRanges = receipts.flatMap((receipt) => (
    Object.values(valuesBySettlement(receipt, 'powerEntropy'))
      .filter((values) => values.length >= 2)
      .map((values) => Math.max(...values) - Math.min(...values))
  ));
  const medianRange = median(entropyRanges);
  checks.push(makeCheck(
    'motion.power_entropy',
    'the faction-power topology does not lock to one invariant distribution',
    medianRange != null && medianRange >= thresholds.minMedianPowerEntropyRange,
    { settlementsMeasured: entropyRanges.length, medianRange },
    { minMedianPowerEntropyRange: thresholds.minMedianPowerEntropyRange },
  ));
  return checks;
}

/** @param {BehavioralReceipt[]} receipts @returns {BehavioralCheck[]} */
function checkNeighborControls(receipts) {
  const thresholds = BEHAVIORAL_THRESHOLDS.neighbor;
  const probes = receipts
    .map((receipt) => ({
      receipt,
      probe: receipt?.behavioral?.controls?.neighbor,
    }))
    .filter(({ probe }) => probe?.executed === true);
  const scaleBands = new Set(probes.map(({ receipt }) => finite(receipt?.settlements)));
  const seedFamilies = new Set(probes.map(({ receipt }) => seedFamilyOf(receipt)));
  const individuallyPassing = probes.filter(({ probe }) => {
    const checkpoints = Array.isArray(probe?.checkpoints)
      ? probe.checkpoints.map(asRecord)
      : [];
    const positive = checkpoints.filter((checkpoint) => finite(checkpoint?.targetDistance) > 0);
    const useful = checkpoints
      .filter((checkpoint) => finite(checkpoint?.year) <= CERTIFICATION_HORIZONS.useful.years)
      .at(-1);
    const peak = Math.max(0, ...checkpoints.map((checkpoint) => finite(checkpoint?.targetDistance)));
    const usefulDistance = finite(useful?.targetDistance);
    return usefulDistance >= thresholds.minTargetDistanceAtUsefulHorizon
      && positive.length >= thresholds.minPositiveCheckpoints
      && (peak === 0 || usefulDistance / peak >= thresholds.minRetainedFractionFromPeak);
  }).length;

  return [makeCheck(
    'neighbor.perturbation',
    'a bounded change to one neighbour propagates and remains visible outside its source',
    probes.length >= thresholds.minReleaseProbes
      && individuallyPassing === probes.length
      && scaleBands.size >= thresholds.minScaleBands
      && seedFamilies.size >= thresholds.minSeedFamilies,
    {
      probes: probes.length,
      individuallyPassing,
      scaleBands: [...scaleBands].sort((a, b) => a - b),
      seedFamilies: seedFamilies.size,
    },
    thresholds,
  )];
}

/**
 * @param {BehavioralYearRow[]} rows
 * @param {number} settlementYears
 * @returns {BehavioralCheck[]}
 */
function checkSuccession(rows, settlementYears) {
  const thresholds = BEHAVIORAL_THRESHOLDS.succession;
  const pendingProposals = sum(
    rows.map(({ year }) => year?.succession?.pendingProposals),
  );
  const attempts = sum(rows.map(({ year }) => year?.succession?.attempts));
  const completions = sum(rows.map(({ year }) => year?.succession?.completions));
  const failures = sum(rows.map(({ year }) => year?.succession?.integrityFailures));
  const attemptRate = rate(attempts, settlementYears, 10);
  const completionRate = rate(completions, settlementYears, 10);
  const completionShare = ratio(completions, attempts);
  return [makeCheck(
    'succession.integrity',
    'applied succession attempts turn over at volume without malformed or impossible seats',
    attemptRate >= thresholds.minAttemptsPerSettlementDecade
      && completionRate >= thresholds.minCompletionsPerSettlementDecade
      && completionShare >= thresholds.minCompletionShare
      && completionShare <= thresholds.maxCompletionShare
      && failures <= thresholds.maxIntegrityFailures,
    {
      pendingProposals,
      attempts,
      completions,
      integrityFailures: failures,
      attemptsPerSettlementDecade: attemptRate,
      completionsPerSettlementDecade: completionRate,
      completionShare,
    },
    thresholds,
  )];
}

/**
 * @param {BehavioralReceipt} receipt
 * @returns {{
 *   counts: number[],
 *   fairness: number,
 *   zeroCount: number,
 *   maxToMean: number,
 * }}
 */
function attentionFor(receipt) {
  const ids = /** @type {string[]} */ (
    Array.isArray(receipt?.behavioral?.settlementIds)
      ? receipt.behavioral.settlementIds.map(String)
      : []
  );
  const totals = countMap((receipt?.behavioral?.yearly || [])
    .map((year) => year?.attentionCounts));
  const counts = ids.map((id) => finite(totals[id]));
  const mean = ratio(sum(counts), counts.length);
  return {
    counts,
    fairness: jainFairness(counts),
    zeroCount: counts.filter((count) => count === 0).length,
    maxToMean: mean > 0 ? Math.max(...counts) / mean : Number.POSITIVE_INFINITY,
  };
}

/** @param {BehavioralReceipt[]} receipts @returns {BehavioralCheck[]} */
function checkAttention(receipts) {
  const thresholds = BEHAVIORAL_THRESHOLDS.attention;
  const cases = receipts.map(attentionFor);
  const passingCases = cases.filter((entry) => (
    entry.fairness >= thresholds.minJainFairness
    && entry.maxToMean <= thresholds.maxSettlementToMeanRatio
  )).length;
  const settlements = sum(cases.map((entry) => entry.counts.length));
  const zeroSettlements = sum(cases.map((entry) => entry.zeroCount));
  return [makeCheck(
    'attention.fairness',
    'the Chronicle does not repeatedly ignore the same settlements',
    cases.length > 0
      && ratio(passingCases, cases.length) >= thresholds.minCasePassShare
      && ratio(zeroSettlements, settlements)
        <= thresholds.maxZeroAttentionSettlementShare,
    {
      cases: cases.length,
      passingCases,
      casePassShare: ratio(passingCases, cases.length),
      settlements,
      zeroAttentionSettlements: zeroSettlements,
      zeroAttentionSettlementShare: ratio(zeroSettlements, settlements),
      medianJainFairness: median(cases.map((entry) => entry.fairness)),
    },
    thresholds,
  )];
}

/** @param {BehavioralReceipt[]} receipts @returns {BehavioralCheck[]} */
function checkDarkControls(receipts) {
  const thresholds = BEHAVIORAL_THRESHOLDS.darkControls;
  const probes = receipts
    .map((receipt) => ({
      receipt,
      probe: receipt?.behavioral?.controls?.dark,
    }))
    .filter(({ probe }) => probe?.executed === true);
  const scaleBands = new Set(probes.map(({ receipt }) => finite(receipt?.settlements)));
  const seedFamilies = new Set(probes.map(({ receipt }) => seedFamilyOf(receipt)));
  const passing = probes.filter(({ probe }) => (
    Number.isFinite(probe?.litBaselineActivityCount)
    && Number.isFinite(probe?.darkActivityCount)
    && Array.isArray(probe?.conditionalStateLeaks)
    && finite(probe.darkActivityCount) <= thresholds.maxDarkActivity
    && probe.conditionalStateLeaks.length
      <= thresholds.maxConditionalStateLeaks
    && (!thresholds.requireLitBaselineActivity
      || finite(probe.litBaselineActivityCount) > 0)
  )).length;

  return [makeCheck(
    'controls.dark',
    'the all-dark control advances only its clock and emits no gated behavior',
    probes.length >= thresholds.minReleaseProbes
      && passing === probes.length
      && scaleBands.size >= thresholds.minScaleBands
      && seedFamilies.size >= thresholds.minSeedFamilies,
    {
      probes: probes.length,
      passing,
      scaleBands: [...scaleBands].sort((a, b) => a - b),
      seedFamilies: seedFamilies.size,
    },
    thresholds,
  )];
}

/**
 * @param {BehavioralYearRow[]} rows
 * @param {number} settlementYears
 * @returns {BehavioralCheck[]}
 */
function checkInteractions(rows, settlementYears) {
  const thresholds = BEHAVIORAL_THRESHOLDS.interactions;
  const normalizedYearRates = rows.map(({ receipt, year }) => (
    ratio(finite(year?.eventCount), finite(receipt?.settlements))
  ));
  const p99 = percentile(normalizedYearRates, 0.99);
  const medianRate = median(normalizedYearRates) || 0;
  const burstFloor = Math.max(8, medianRate * 6);
  const burstYears = normalizedYearRates.filter((value) => value > burstFloor).length;
  const burstShare = ratio(burstYears, normalizedYearRates.length);
  const events = sum(rows.map(({ year }) => year?.eventCount));
  const crossFamilyEdges = sum(rows.map(({ year }) => year?.causal?.crossFamilyEdges));
  const familyPairs = new Set(rows.flatMap(({ year }) => (
    Array.isArray(year?.causal?.familyPairs) ? year.causal.familyPairs : []
  )));
  const edgeRate = rate(crossFamilyEdges, settlementYears, 100);
  const edgeShare = ratio(crossFamilyEdges, events);

  return [
    makeCheck(
      'interactions.anomaly',
      'event bursts remain exceptional rather than becoming the normal clock',
      p99 != null
        && p99 <= thresholds.maxP99EventsPerSettlementYear
        && burstShare <= thresholds.maxBurstYearsShare,
      {
        p99EventsPerSettlementYear: p99,
        burstFloor,
        burstYears,
        yearsMeasured: normalizedYearRates.length,
        burstYearsShare: burstShare,
      },
      {
        maxP99EventsPerSettlementYear:
          thresholds.maxP99EventsPerSettlementYear,
        maxBurstYearsShare: thresholds.maxBurstYearsShare,
      },
    ),
    makeCheck(
      'interactions.super_additivity',
      'cross-family consequences exist without becoming a cascade storm',
      edgeRate >= thresholds.minCrossFamilyEdgesPer100SettlementYears
        && edgeShare <= thresholds.maxCrossFamilyEdgeShareOfEvents
        && familyPairs.size >= thresholds.minDistinctFamilyPairs,
      {
        crossFamilyEdges,
        per100SettlementYears: edgeRate,
        shareOfEvents: edgeShare,
        distinctFamilyPairs: familyPairs.size,
      },
      {
        minCrossFamilyEdgesPer100SettlementYears:
          thresholds.minCrossFamilyEdgesPer100SettlementYears,
        maxCrossFamilyEdgeShareOfEvents:
          thresholds.maxCrossFamilyEdgeShareOfEvents,
        minDistinctFamilyPairs: thresholds.minDistinctFamilyPairs,
      },
    ),
  ];
}

/** @param {unknown} value @returns {boolean} */
function validIsoTimestamp(value) {
  return typeof value === 'string'
    && value.trim() !== ''
    && Number.isFinite(Date.parse(value));
}

/**
 * Validate the signed human Chronicle sample. Automated prose heuristics are
 * useful diagnostics, but cannot stand in for a person reading the record.
 *
 * @param {unknown} raw
 * @param {{ sourceCommit?: string, eligibleCaseIds?: string[] }} [context]
 */
export function validateHumanChronicleReview(raw, context = {}) {
  const thresholds = BEHAVIORAL_THRESHOLDS.humanChronicle;
  /** @type {string[]} */
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['Human Chronicle review is missing.'], review: null };
  }
  const review = asRecord(raw);
  if (review.schemaVersion !== HUMAN_CHRONICLE_REVIEW_VERSION) {
    errors.push(`schemaVersion must be ${HUMAN_CHRONICLE_REVIEW_VERSION}.`);
  }
  if (review.kind !== 'human_chronicle_review') {
    errors.push('kind must be human_chronicle_review.');
  }
  if (review.reviewerKind !== 'human') {
    errors.push('reviewerKind must be human; automated review cannot mint this evidence.');
  }
  if (typeof review.reviewer !== 'string' || review.reviewer.trim() === '') {
    errors.push('reviewer must be a non-empty name or stable reviewer id.');
  }
  if (!validIsoTimestamp(review.reviewedAt)) {
    errors.push('reviewedAt must be a valid ISO timestamp.');
  }
  if (context.sourceCommit && review.sourceCommit !== context.sourceCommit) {
    errors.push('sourceCommit does not match the source-bound soak.');
  }
  if (review.verdict !== 'pass') {
    errors.push('verdict must be pass.');
  }
  if (finite(review.entriesReviewed) < thresholds.minEntriesReviewed) {
    errors.push(`entriesReviewed must be at least ${thresholds.minEntriesReviewed}.`);
  }
  if (review.includedFinalDecade !== true) {
    errors.push('includedFinalDecade must be true.');
  }

  const sampleCaseIds = Array.isArray(review.sampleCaseIds)
    ? [...new Set(review.sampleCaseIds.map(String))]
    : [];
  if (sampleCaseIds.length < thresholds.minSampleCases) {
    errors.push(`sampleCaseIds must contain at least ${thresholds.minSampleCases} distinct cases.`);
  }
  const eligible = new Set((context.eligibleCaseIds || []).map(String));
  const unknown = sampleCaseIds.filter((caseId) => eligible.size && !eligible.has(caseId));
  if (unknown.length) {
    errors.push(`sampleCaseIds contains cases outside the release evidence: ${unknown.join(', ')}.`);
  }

  const parsed = sampleCaseIds.map((caseId) => {
    const match = /-(\d+)y-(\d+)s-seed(\d+)$/.exec(caseId);
    return match
      ? { years: Number(match[1]), settlements: Number(match[2]), seed: Number(match[3]) }
      : null;
  });
  if (parsed.some((value) => value == null)) {
    errors.push('every sampleCaseId must retain the canonical horizon/scale/seed suffix.');
  } else {
    const validParsed = /** @type {Array<{
     *   years: number,
     *   settlements: number,
     *   seed: number,
     * }>} */ (parsed);
    const scaleBands = new Set(validParsed.map((value) => value.settlements));
    const seedFamilies = new Set(validParsed.map((value) => value.seed));
    if (scaleBands.size < thresholds.minScaleBands) {
      errors.push(`the human sample must span at least ${thresholds.minScaleBands} scale bands.`);
    }
    if (seedFamilies.size < thresholds.minSeedFamilies) {
      errors.push(`the human sample must span at least ${thresholds.minSeedFamilies} seed families.`);
    }
    if (validParsed.some((value) => value.years !== CERTIFICATION_HORIZONS.release.years)) {
      errors.push(`human certification samples must come from ${CERTIFICATION_HORIZONS.release.years}-year release cases.`);
    }
  }

  const criteria = asRecord(review.criteria);
  for (const criterion of thresholds.requiredCriteria) {
    if (criteria[criterion] !== 'pass') {
      errors.push(`criteria.${criterion} must be pass.`);
    }
  }
  if (!Array.isArray(review.blockingNotes)) {
    errors.push('blockingNotes must be an array.');
  } else if (review.blockingNotes.length > 0) {
    errors.push('blockingNotes must be empty for a passing review.');
  }
  return { ok: errors.length === 0, errors, review };
}

const CHECK_GROUP_PROPERTIES = Object.freeze({
  mover: 'mover_activity',
  tempo: 'event_tempo_diversity',
  arcs: 'constructive_and_destructive_arcs',
  motion: 'state_motion',
  neighbor: 'neighbor_perturbation',
  succession: 'succession_integrity',
  attention: 'attention_fairness',
  controls: 'dark_controls',
  interactions: 'interaction_bounded',
});

/**
 * @param {BehavioralCheck[]} checks
 * @param {boolean} humanReviewPassed
 * @returns {string[]}
 */
function earnedBehavioralProperties(checks, humanReviewPassed) {
  /** @type {string[]} */
  const earned = [];
  for (const [prefix, property] of Object.entries(CHECK_GROUP_PROPERTIES)) {
    const group = checks.filter((check) => check.id.startsWith(`${prefix}.`));
    if (group.length && group.every((check) => check.passed)) earned.push(property);
  }
  if (earned.includes('mover_activity') && earned.includes('event_tempo_diversity')) {
    earned.push('stressor_rhythm');
  }
  if (earned.includes('mover_activity') && earned.includes('state_motion')) {
    earned.push('no_stasis');
  }
  if (humanReviewPassed) earned.push('chronicle_human_reviewed');
  return earned;
}

/**
 * Evaluate a complete realm-scale evidence matrix.
 *
 * @param {{
 *   profile: string,
 *   complete: boolean,
 *   source?: { commit?: string },
 *   receipts?: BehavioralReceipt[],
 *   humanReview?: unknown,
 * }} input
 */
export function evaluateBehavioralCertification(input) {
  const receipts = Array.isArray(input?.receipts) ? input.receipts : [];
  const observedReceipts = receipts.filter((receipt) => (
    receipt?.behavioral?.schemaVersion === BEHAVIORAL_OBSERVATION_VERSION
  ));
  const releaseCases = releaseCasesFrom(receipts);
  const rows = yearlyRowsOf(releaseCases);
  const settlementYears = sum(releaseCases.map((receipt) => (
    finite(receipt?.years) * finite(receipt?.settlements)
  )));
  const eligibleCaseIds = releaseCases.map((receipt) => String(receipt?.caseId || ''));
  const profileEligible = input?.profile === 'release';
  const observationsComplete = profileEligible
    && input?.complete === true
    && releaseCases.length > 0
    && releaseCases.every((receipt) => (
      Array.isArray(receipt?.behavioral?.yearly)
      && receipt.behavioral.yearly.length === CERTIFICATION_HORIZONS.release.years
    ));

  const checks = observationsComplete
    ? [
        ...checkMoverActivity(releaseCases, rows, settlementYears),
        ...checkTempo(rows, settlementYears),
        ...checkArcs(releaseCases, rows, settlementYears),
        ...checkMotion(releaseCases, rows),
        ...checkNeighborControls(observedReceipts),
        ...checkSuccession(rows, settlementYears),
        ...checkAttention(releaseCases),
        ...checkDarkControls(observedReceipts),
        ...checkInteractions(rows, settlementYears),
      ]
    : [];
  const automatedPassed = observationsComplete
    && checks.length > 0
    && checks.every((check) => check.passed);
  const human = validateHumanChronicleReview(input?.humanReview, {
    sourceCommit: input?.source?.commit,
    eligibleCaseIds,
  });
  const passed = automatedPassed && human.ok;
  const propertiesEarned = earnedBehavioralProperties(checks, human.ok);

  return {
    schemaVersion: BEHAVIORAL_CONTRACT_VERSION,
    kind: 'behavioral_certification_evaluation',
    horizons: CERTIFICATION_HORIZONS,
    profile: input?.profile || null,
    profileEligible,
    observationsComplete,
    releaseCasesMeasured: releaseCases.length,
    settlementYearsMeasured: settlementYears,
    automatedPassed,
    humanChronicleReview: {
      passed: human.ok,
      errors: human.errors,
      review: human.review,
    },
    passed,
    checks,
    failures: checks.filter((check) => !check.passed).map((check) => check.id),
    propertiesEarned,
    claimBoundary: profileEligible
      ? (passed
          ? 'Eligible for an operator-reviewed manifest entry; this evaluator does not write or publish one.'
          : 'Not eligible for product certification until every automated check and the human Chronicle review pass.')
      : 'This profile is regression or research evidence and cannot earn the product certificate.',
  };
}
