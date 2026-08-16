/**
 * simMetricRegistry.mjs — the CLOSED simulation-metric vocabulary (ODQ §117a, §149.2).
 *
 * WHAT
 *   Eleven typed rows naming every figure the diagnostic soak publishes as a
 *   SIMULATION-class metric. Each row carries the exact receipt field it is read
 *   from, so the emitter transforms a soak receipt and never invents, resamples,
 *   or re-derives an observation.
 *
 * WHY ITS OWN REGISTRY, AND NOT `src/lib/analyticsEvents.js` (ODQ §149.2, chair)
 *   `EVENT_CLASS` there is DERIVED 1:1 from `EVENTS`, and `EVENTS` is shipped to
 *   the client AND bundled to the edge. A third class VALUE therefore cannot exist
 *   without eleven client-eager event names no client can ever emit, eleven
 *   `docs/METRICS_REGISTRY.md` coverage rows, and a five-bundle edge regeneration —
 *   which contradicts the telemetry charter's own "zero eager client bytes" wall.
 *   §117a's "same closed taxonomy" is therefore delivered as ONE NAME CONTRACT
 *   (`EVENT_NAME_RE`, imported below — a second regex is refused by name), ONE
 *   dictionary (the generated analytics dictionary renders a SIMULATION section
 *   from this file), ONE storage idiom (the 038/133 EAV rollup, reused by
 *   migration 196), and ONE read-only-by-construction discipline. The separation
 *   is asserted rather than asserted-about: the registry's own pin proves this
 *   name set is DISJOINT from `Object.values(EVENTS)`, in both directions.
 *
 * WHY UNDER `scripts/telemetry/` AND NOT UNDER `src/`
 *   `REALM_SCALE_SOURCE_PATHS` (scripts/audit/realm-scale-certification.mjs) is
 *   `src`, `scripts/audit`, `tests/fixtures/spatialPackFixtures.js`, `package.json`,
 *   `package-lock.json`. This directory is in none of them, so the module costs
 *   zero eager client bytes (structurally — no component can reach it), zero motion
 *   in either typecheck ratchet, zero `sizeBaseline` motion, and it does not move
 *   the certification source fingerprint.
 *
 * PII BY SCHEMA
 *   No row's `dims` may name an actor, session, user, consent tier, country, IP,
 *   device or email. The property is not a promise: it is walked by this module's
 *   own pin, by the engine-telemetry wall walker, and by migration 196's DDL,
 *   whose table declares no such column at all.
 */

import { EVENT_NAME_RE } from '../../src/lib/analyticsEvents.js';

/**
 * The third class §117a asks for. It is a CONSTANT here rather than a member of
 * `EVENT_CLASS`, because `EVENT_CLASS`'s key set is structurally `EVENTS`'s.
 */
export const SIM_EVENT_CLASS = 'simulation';

/**
 * The epoch vocabulary, DERIVED FROM THE OBSERVATION SCHEMA rather than chosen.
 *
 * ⛔ TWO VALUES, NOT THREE. The compile predicted a `decade` epoch on the premise
 * that "the succession observation is already decade-folded". MEASURED at this
 * base that premise is REFUTED: `observeBehavioralYear` returns
 * `succession: { pendingProposals, attempts, completions, integrityFailures,
 * integrityFailureKinds }` once per YEAR, and no decade fold exists anywhere in
 * `scripts/audit/behavioral-observation.mjs`, `scripts/audit/whole-world-soak.mjs`
 * or `src/domain/certification/behavioralContract.js`. A `decade` epoch would
 * therefore oblige the emitter to RESAMPLE, which the charter forbids in the same
 * sentence that gives the emitter its licence. `sim_succession` is a `year` row.
 */
export const SIM_METRIC_EPOCHS = Object.freeze(['run', 'year']);

/**
 * Receipt-field arity, read from the receipt writer at
 * `scripts/audit/whole-world-soak.mjs` (the `const receipt = {…}` block) and from
 * `buildBehavioralObservation`. This is what makes "the emitter never resamples"
 * checkable instead of promised: a row's epoch must be the epoch its own source
 * fields already have.
 *
 *   run-scalar        one value or one object for the whole run
 *   settlement-vector one value per settlement, taken once for the run
 *   year-series       one entry per observed year
 */
export const RECEIPT_FIELD_ARITY = Object.freeze({
  passed: 'run-scalar',
  properties: 'run-scalar',
  failures: 'run-scalar',
  schemaVersion: 'run-scalar',
  seed: 'run-scalar',
  years: 'run-scalar',
  settlements: 'run-scalar',
  finalHash: 'run-scalar',
  warConvergence: 'run-scalar',
  warConvergenceCensus: 'run-scalar',
  subsystems: 'run-scalar',
  startPopulations: 'settlement-vector',
  finalPopulations: 'settlement-vector',
  stressorCounts: 'year-series',
  'behavioral.yearly': 'year-series',
});

/** Which epoch each arity already is. A row may not disagree with its sources. */
export const EPOCH_BY_ARITY = Object.freeze({
  'run-scalar': 'run',
  'settlement-vector': 'run',
  'year-series': 'year',
});

/**
 * The eleven. `dims` are the typed dimension keys each emitted row carries beyond
 * the run identity; `unit` names what `value` counts.
 */
export const SIM_METRICS = Object.freeze([
  Object.freeze({
    name: 'sim_run_summary',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['property', 'outcome']),
    unit: 'count',
    epoch: 'run',
    source: Object.freeze([
      'passed', 'properties', 'failures', 'schemaVersion', 'seed', 'years',
      'settlements', 'finalHash', 'startPopulations', 'finalPopulations',
    ]),
  }),
  Object.freeze({
    name: 'sim_population_epoch',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['settlement_band', 'measure']),
    unit: 'people',
    epoch: 'year',
    source: Object.freeze(['behavioral.yearly']),
  }),
  Object.freeze({
    name: 'sim_prosperity_epoch',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['rung', 'measure']),
    unit: 'settlements',
    epoch: 'year',
    source: Object.freeze(['behavioral.yearly']),
  }),
  Object.freeze({
    name: 'sim_governance_epoch',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['measure']),
    unit: 'count',
    epoch: 'year',
    source: Object.freeze(['behavioral.yearly']),
  }),
  Object.freeze({
    name: 'sim_mover_activity',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['mover_family', 'lane']),
    unit: 'events',
    epoch: 'year',
    source: Object.freeze(['behavioral.yearly']),
  }),
  Object.freeze({
    name: 'sim_event_tempo',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['measure']),
    unit: 'events',
    epoch: 'year',
    source: Object.freeze(['behavioral.yearly']),
  }),
  Object.freeze({
    name: 'sim_war_convergence',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['histogram', 'bucket']),
    unit: 'wars',
    epoch: 'run',
    source: Object.freeze(['warConvergence', 'warConvergenceCensus']),
  }),
  Object.freeze({
    name: 'sim_stressor_rhythm',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['measure']),
    unit: 'stressors',
    epoch: 'year',
    source: Object.freeze(['stressorCounts']),
  }),
  Object.freeze({
    name: 'sim_succession',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['measure']),
    unit: 'count',
    epoch: 'year',
    source: Object.freeze(['behavioral.yearly']),
  }),
  Object.freeze({
    name: 'sim_belief_knowledge',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['container', 'measure']),
    unit: 'count',
    epoch: 'run',
    source: Object.freeze(['subsystems']),
  }),
  Object.freeze({
    name: 'sim_finding',
    class: SIM_EVENT_CLASS,
    dims: Object.freeze(['finding_kind']),
    unit: 'findings',
    epoch: 'run',
    source: Object.freeze(['failures', 'properties']),
  }),
]);

/** The closed name set, in registry order. */
export const SIM_METRIC_NAMES = Object.freeze(SIM_METRICS.map((row) => row.name));

/**
 * Dimension keys that would make the class PII-bearing. Held here rather than in
 * the test so the walker, the emitter and the pin all read ONE spelling.
 */
export const FORBIDDEN_DIM_RE = /actor|session|user|consent|country|\bip\b|device|email/i;

/** @param {string} name @returns {Readonly<object>|null} */
export function simMetric(name) {
  return SIM_METRICS.find((row) => row.name === name) || null;
}

/** Every row whose epoch is `epoch`, in registry order. */
export function simMetricsByEpoch(epoch) {
  return SIM_METRICS.filter((row) => row.epoch === epoch);
}

/**
 * The registry's own defect scan, exported so the pin, the walker and the
 * dictionary generator convict identically rather than each re-deriving the rule.
 * @returns {string[]} one sentence per defect; empty means the registry is sound.
 */
export function registryDefects(rows = SIM_METRICS) {
  const defects = [];
  const seen = new Set();
  for (const row of rows) {
    if (!EVENT_NAME_RE.test(row.name)) defects.push(`${row.name}: name fails EVENT_NAME_RE`);
    if (seen.has(row.name)) defects.push(`${row.name}: duplicate registry name`);
    seen.add(row.name);
    if (row.class !== SIM_EVENT_CLASS) defects.push(`${row.name}: class is not ${SIM_EVENT_CLASS}`);
    if (!SIM_METRIC_EPOCHS.includes(row.epoch)) defects.push(`${row.name}: epoch ${row.epoch} is outside the vocabulary`);
    for (const dim of row.dims) {
      if (FORBIDDEN_DIM_RE.test(dim)) defects.push(`${row.name}: dim ${dim} is PII-bearing`);
    }
    if (!row.source.length) defects.push(`${row.name}: no source field`);
    for (const field of row.source) {
      const arity = RECEIPT_FIELD_ARITY[field];
      if (!arity) { defects.push(`${row.name}: source ${field} is not a measured receipt field`); continue; }
      if (EPOCH_BY_ARITY[arity] !== row.epoch) {
        defects.push(`${row.name}: source ${field} is ${arity} (epoch ${EPOCH_BY_ARITY[arity]}) but the row declares ${row.epoch}`);
      }
    }
  }
  return defects;
}
