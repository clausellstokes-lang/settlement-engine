/**
 * simMetricEmitter.mjs — the soak-receipt → SIMULATION-metric transform (ODQ §117a).
 *
 * WHAT IT IS
 *   A PURE function from a completed `whole-world-soak.mjs` receipt to JSONL rows
 *   shaped exactly like `world_sim_metrics`. It edits no engine file and no soak
 *   file: `whole-world-soak.mjs` already writes the entire receipt to
 *   `--receipt <path>`, so everything this transform needs is on disk before it
 *   runs. That is what makes "provably outside the deterministic core" STRUCTURAL
 *   rather than argued — and it is why this member cannot collide with the soak
 *   harness family's own edits to `scripts/audit/whole-world-soak.mjs`.
 *
 * PURITY, AND WHY IT IS A CONTRACT RATHER THAN A HABIT
 *   No `Date.now()`, no `Math.random()`, no filesystem read, no `process.env`, and
 *   no import from `src/domain`, `src/generators`, `src/kernel` or `src/store`.
 *   Run identity is `(run_id, seed_family, scale, horizon, profile,
 *   source_fingerprint, schema_version)` and every component is supplied BY THE
 *   CALLER or read FROM THE RECEIPT — never derived from the ambient environment,
 *   because a metric row whose identity depends on where it was computed cannot be
 *   compared across runs. `emit(r)` twice is byte-identical, and that is pinned.
 *
 * REFUSAL, NOT BEST EFFORT
 *   An unsupported `schemaVersion` throws. A receipt one envelope version ahead is
 *   not a receipt with some missing fields; it is a receipt whose fields may mean
 *   something else, and a best-effort parse would publish that silently.
 *
 * FINITE SEMANTICS
 *   Every dimension value is a typed bucket from a closed vocabulary declared in
 *   this file. No settlement id, no faction name, no prose, no seed, and no free
 *   text reaches a row. Failures are classified into a closed `finding_kind`
 *   vocabulary; anything unrecognised is `unclassified`, which is a bucket and not
 *   a passthrough.
 */

import {
  SIM_METRICS,
  SIM_METRIC_NAMES,
  FORBIDDEN_DIM_RE,
  registryDefects,
} from './simMetricRegistry.mjs';

/**
 * Mirrors `SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS` in
 * `src/domain/certification/behavioralContract.js`. It is re-declared rather than
 * imported ON PURPOSE: importing it would give this Node-side tool an edge into
 * `src/domain`, which is the exact edge Arm B of the engine-telemetry wall walker
 * forbids. The wall is worth more than the shared constant, and the walker's own
 * Arm B would red if this file reached for it.
 */
export const SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS = Object.freeze([4, 5]);

/** Population bands. Typed buckets, so no settlement identity ever reaches a row. */
export const SETTLEMENT_BANDS = Object.freeze([
  Object.freeze({ band: 'hamlet', below: 200 }),
  Object.freeze({ band: 'village', below: 1000 }),
  Object.freeze({ band: 'town', below: 5000 }),
  Object.freeze({ band: 'city', below: Infinity }),
]);

/** The closed finding vocabulary. Order is the classification order. */
export const FINDING_KINDS = Object.freeze([
  Object.freeze({ kind: 'determinism', match: /identical|diverge|hash|replay|rerun/i }),
  Object.freeze({ kind: 'population', match: /population|collaps|depopulat/i }),
  Object.freeze({ kind: 'numeric', match: /nan|infinit|negative|non-finite/i }),
  Object.freeze({ kind: 'memory', match: /heap|bytes|memory|size/i }),
  Object.freeze({ kind: 'war', match: /war|siege|treaty/i }),
  Object.freeze({ kind: 'worker', match: /worker|isolat/i }),
  Object.freeze({ kind: 'crash', match: /crash|throw|error|exception/i }),
]);

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const obj = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const arr = (value) => (Array.isArray(value) ? value : []);

/** @param {number} population */
export function settlementBand(population) {
  const value = num(population);
  return (SETTLEMENT_BANDS.find((row) => value < row.below) || SETTLEMENT_BANDS[SETTLEMENT_BANDS.length - 1]).band;
}

/** @param {unknown} failure */
export function findingKind(failure) {
  const text = String(failure ?? '');
  return (FINDING_KINDS.find((row) => row.match.test(text)) || { kind: 'unclassified' }).kind;
}

/**
 * The run identity every row carries. Every component is caller-supplied or
 * receipt-read; none is ambient.
 */
function runIdentity(receipt, identity) {
  return {
    run_id: String(identity.runId),
    seed_family: String(identity.seedFamily ?? receipt.seed ?? ''),
    scale: num(receipt.settlements),
    horizon: num(receipt.years),
    profile: String(identity.profile ?? 'default'),
    source_fingerprint: String(identity.sourceSha),
    schema_version: num(receipt.schemaVersion),
  };
}

const row = (identity, metric, epochKind, epochIndex, dims, value) => ({
  ...identity,
  metric,
  epoch_kind: epochKind,
  epoch_index: epochIndex,
  dims,
  value: num(value),
});

function runSummaryRows(receipt, id) {
  const out = [];
  for (const property of arr(receipt.properties)) {
    out.push(row(id, 'sim_run_summary', 'run', 0, { property: String(property), outcome: 'earned' }, 1));
  }
  out.push(row(id, 'sim_run_summary', 'run', 0, { property: 'passed', outcome: 'observed' }, receipt.passed ? 1 : 0));
  out.push(row(id, 'sim_run_summary', 'run', 0, { property: 'failures', outcome: 'observed' }, arr(receipt.failures).length));
  const start = arr(receipt.startPopulations).reduce((total, value) => total + num(value), 0);
  const final = arr(receipt.finalPopulations).reduce((total, value) => total + num(value), 0);
  out.push(row(id, 'sim_run_summary', 'run', 0, { property: 'population_total', outcome: 'start' }, start));
  out.push(row(id, 'sim_run_summary', 'run', 0, { property: 'population_total', outcome: 'final' }, final));
  return out;
}

function populationRows(year, index, id) {
  const out = [];
  const totals = new Map(SETTLEMENT_BANDS.map((band) => [band.band, { population: 0, settlements: 0 }]));
  for (const vector of Object.values(obj(year.stateVectors))) {
    const band = totals.get(settlementBand(obj(vector).population));
    band.population += num(obj(vector).population);
    band.settlements += 1;
  }
  for (const [band, sums] of totals) {
    out.push(row(id, 'sim_population_epoch', 'year', index, { settlement_band: band, measure: 'population' }, sums.population));
    out.push(row(id, 'sim_population_epoch', 'year', index, { settlement_band: band, measure: 'settlements' }, sums.settlements));
  }
  return out;
}

function prosperityRows(year, index, id) {
  const rungs = new Map();
  for (const vector of Object.values(obj(year.stateVectors))) {
    const rung = String(num(obj(vector).prosperity));
    rungs.set(rung, (rungs.get(rung) || 0) + 1);
  }
  return [...rungs.keys()].sort().map((rung) => (
    row(id, 'sim_prosperity_epoch', 'year', index, { rung, measure: 'settlements' }, rungs.get(rung))
  ));
}

function governanceRows(year, index, id) {
  const motion = obj(year.motion);
  const entropies = Object.values(obj(year.stateVectors)).map((vector) => num(obj(vector).powerEntropy));
  const mean = entropies.length ? entropies.reduce((total, value) => total + value, 0) / entropies.length : 0;
  return [
    row(id, 'sim_governance_epoch', 'year', index, { measure: 'power_transitions' }, motion.powerTransitions),
    row(id, 'sim_governance_epoch', 'year', index, { measure: 'power_moved' }, motion.powerMoved),
    row(id, 'sim_governance_epoch', 'year', index, { measure: 'prosperity_transitions' }, motion.prosperityTransitions),
    row(id, 'sim_governance_epoch', 'year', index, { measure: 'prosperity_moved' }, motion.prosperityMoved),
    row(id, 'sim_governance_epoch', 'year', index, { measure: 'power_entropy_mean_milli' }, Math.round(mean * 1000)),
  ];
}

function moverRows(year, index, id) {
  const lanes = [
    ['total', obj(year.moverCounts)],
    ['selected', obj(year.selectedMoverCounts)],
    ['post_apply', obj(year.postApplyMoverCounts)],
  ];
  return lanes.flatMap(([lane, counts]) => Object.keys(counts).sort().map((family) => (
    row(id, 'sim_mover_activity', 'year', index, { mover_family: family, lane }, counts[family])
  )));
}

function tempoRows(year, index, id) {
  return [
    ['events', year.eventCount],
    ['majors', year.majorEventCount],
    ['mechanical', year.mechanicalOutcomeCount],
    ['unclassified', year.unclassifiedEventCount],
    ['post_apply_receipts', year.postApplyReceiptCount],
  ].map(([measure, value]) => row(id, 'sim_event_tempo', 'year', index, { measure }, value));
}

function successionRows(year, index, id) {
  const succession = obj(year.succession);
  return [
    ['pending_proposals', succession.pendingProposals],
    ['attempts', succession.attempts],
    ['completions', succession.completions],
    ['integrity_failures', succession.integrityFailures],
  ].map(([measure, value]) => row(id, 'sim_succession', 'year', index, { measure }, value));
}

/**
 * The §151.3 band rider's row: news cadence and narration repetition, per year.
 * Rates are emitted in MILLI so the report reads as integers everywhere and no
 * float formatting can drift between the Node face and the SQL face.
 */
function narrationRows(year, index, id) {
  const phrase = obj(year.phraseRepetition);
  return [
    ['news_rows_observed', phrase.observations],
    ['windows', phrase.windows],
    ['exact_repeats', phrase.exactRepeats],
    ['family_repeats', phrase.familyRepeats],
    ['exact_repeat_rate_milli', Math.round(num(phrase.exactRepeatRate) * 1000)],
    ['family_repeat_rate_milli', Math.round(num(phrase.familyRepeatRate) * 1000)],
  ].map(([measure, value]) => row(id, 'sim_narration_tempo', 'year', index, { measure }, value));
}

function warRows(receipt, id) {
  const observation = obj(receipt.warConvergence);
  const census = obj(receipt.warConvergenceCensus);
  const histograms = [
    ['duration', obj(observation.warDurationHistogram)],
    ['ending', obj(observation.endingsMix)],
    ['ending_unclassified', obj(observation.endingsUnclassified)],
    ['deciding_term', obj(observation.terminationDecidingTermHistogram)],
  ];
  const out = histograms.flatMap(([histogram, counts]) => Object.keys(counts).sort().map((bucket) => (
    row(id, 'sim_war_convergence', 'run', 0, { histogram, bucket }, counts[bucket])
  )));
  for (const bucket of ['countedWars', 'closedWars', 'aliveAtHorizonWars', 'classifiedEndings', 'unclassifiedEndings']) {
    out.push(row(id, 'sim_war_convergence', 'run', 0, { histogram: 'census', bucket }, census[bucket]));
  }
  return out;
}

function beliefRows(receipt, id) {
  const stateKeys = obj(obj(receipt.subsystems).stateKeys);
  return Object.keys(stateKeys).sort().flatMap((container) => {
    const fold = obj(stateKeys[container]);
    return [
      row(id, 'sim_belief_knowledge', 'run', 0, { container, measure: 'years_observed' }, fold.years),
      row(id, 'sim_belief_knowledge', 'run', 0, { container, measure: 'max_entries' }, fold.maxEntries),
      row(id, 'sim_belief_knowledge', 'run', 0, { container, measure: 'final_entries' }, fold.finalEntries),
    ];
  });
}

function findingRows(receipt, id) {
  const counts = new Map();
  for (const failure of arr(receipt.failures)) {
    const kind = findingKind(failure);
    counts.set(kind, (counts.get(kind) || 0) + 1);
  }
  return [...counts.keys()].sort().map((kind) => (
    row(id, 'sim_finding', 'run', 0, { finding_kind: kind }, counts.get(kind))
  ));
}

/**
 * Transform one soak receipt into metric rows.
 *
 * @param {Record<string, unknown>} receipt a parsed whole-world-soak receipt
 * @param {{ runId:string, sourceSha:string, seedFamily?:string, profile?:string }} identity
 * @returns {Array<Record<string, unknown>>} rows, in a deterministic order
 */
export function emitRows(receipt, identity) {
  const defects = registryDefects();
  if (defects.length) throw new Error(`simMetricRegistry is defective: ${defects.join('; ')}`);
  const version = num(obj(receipt).schemaVersion);
  if (!SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS.includes(version)) {
    throw new Error(
      `unsupported soak receipt schemaVersion ${version}; supported: ${SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS.join(', ')}`,
    );
  }
  if (!identity || !identity.runId || !identity.sourceSha) {
    throw new Error('emitRows requires an identity with runId and sourceSha; neither is derived from the environment');
  }
  const id = runIdentity(obj(receipt), identity);
  const rows = [...runSummaryRows(obj(receipt), id)];
  arr(obj(obj(receipt).behavioral).yearly).forEach((rawYear, index) => {
    const year = obj(rawYear);
    rows.push(
      ...populationRows(year, index, id),
      ...prosperityRows(year, index, id),
      ...governanceRows(year, index, id),
      ...moverRows(year, index, id),
      ...tempoRows(year, index, id),
      ...successionRows(year, index, id),
      ...narrationRows(year, index, id),
    );
  });
  arr(obj(receipt).stressorCounts).forEach((count, index) => {
    rows.push(row(id, 'sim_stressor_rhythm', 'year', index, { measure: 'active_stressors' }, count));
  });
  rows.push(...warRows(obj(receipt), id), ...beliefRows(obj(receipt), id), ...findingRows(obj(receipt), id));
  return rows;
}

/** The same transform, serialised. Deterministic: key order is construction order. */
export function emit(receipt, identity) {
  return emitRows(receipt, identity).map((entry) => JSON.stringify(entry)).join('\n');
}

/**
 * The emitted-side PII scan. The registry pin proves the DECLARED dims are clean;
 * this proves the EMITTED ones are, which is a different statement — a transform
 * could invent a dimension key the registry never declared.
 * @returns {string[]} one sentence per offending row
 */
export function emittedDimViolations(rows) {
  const declared = new Map(SIM_METRICS.map((entry) => [entry.name, new Set(entry.dims)]));
  const out = [];
  for (const entry of rows) {
    if (!SIM_METRIC_NAMES.includes(entry.metric)) {
      out.push(`${entry.metric}: emitted a metric name the registry does not declare`);
      continue;
    }
    for (const key of Object.keys(entry.dims || {})) {
      if (FORBIDDEN_DIM_RE.test(key)) out.push(`${entry.metric}: emitted PII dim ${key}`);
      else if (!declared.get(entry.metric).has(key)) out.push(`${entry.metric}: emitted undeclared dim ${key}`);
    }
  }
  return out;
}
