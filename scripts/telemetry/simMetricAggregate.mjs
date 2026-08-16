/**
 * simMetricAggregate.mjs — the READ layer: emitted rows → the tuning-curve report.
 *
 * ⛔ THE SOAK NEEDS ZERO CLOUD. This aggregator never opens a database connection.
 * It reads the SAME JSONL the loader would publish, so a full diagnostic run and
 * its report complete on a laptop with no project configured — which is what makes
 * the harness usable in the fix loop rather than only after a deploy.
 *
 * ONE VOCABULARY, TWO FACES. The band families below are enumerated FROM the
 * registry, never hand-listed, so the Node face and the SQL face cannot fork. The
 * SQL face (migration 196) deliberately enumerates NO metric name at all — one
 * generic EAV rollup in the 038/133 idiom — so the only vocabulary it can fork on
 * is the EPOCH set, and that one is pinned against this registry key-for-key.
 *
 * THE POPULATION TRAJECTORY IS FIRST-CLASS. The recorded 300-year population
 * runaway is the tuning pass's own input, so the report carries it as year-indexed
 * rows rather than as a summary statistic: a runaway is a SHAPE, and a mean hides
 * shapes.
 */

import { SIM_METRICS, simMetricsByEpoch } from './simMetricRegistry.mjs';

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

/**
 * ONE band family per `epoch: 'year'` registry row. SK-5 freezes its curve bands
 * from exactly this set, so a registry row with no band family is a gap the
 * harness would silently not watch.
 */
export function bandFamilies() {
  return simMetricsByEpoch('year').map((row) => row.name);
}

/** Group rows by metric, preserving emission order inside each group. */
function byMetric(rows) {
  const out = new Map(SIM_METRICS.map((row) => [row.name, []]));
  for (const row of rows) {
    if (!out.has(row.metric)) out.set(row.metric, []);
    out.get(row.metric).push(row);
  }
  return out;
}

/** A year-indexed series keyed by one dimension, e.g. `measure` or `mover_family`. */
function series(rows, key, filter = () => true) {
  const out = new Map();
  for (const row of rows) {
    if (!filter(row)) continue;
    const bucket = String(row.dims?.[key] ?? '');
    if (!out.has(bucket)) out.set(bucket, []);
    const list = out.get(bucket);
    list[row.epoch_index] = num(row.value);
  }
  return Object.fromEntries([...out.keys()].sort()
    .map((bucket) => [bucket, [...out.get(bucket)].map((value) => num(value))]));
}

/** Run-epoch rows folded to a plain `{bucket: value}` map under one histogram. */
function histogram(rows, name) {
  const out = {};
  for (const row of rows) {
    if (String(row.dims?.histogram ?? '') !== name) continue;
    out[String(row.dims?.bucket ?? '')] = num(row.value);
  }
  return out;
}

/**
 * Build the tuning-curve report.
 * @param {Array<Record<string, unknown>>} rows emitter output for ONE run
 */
export function aggregate(rows) {
  const groups = byMetric(rows);
  const identity = rows[0] || {};
  const population = series(groups.get('sim_population_epoch') || [], 'settlement_band',
    (row) => row.dims?.measure === 'population');
  const years = Math.max(0, ...Object.values(population).map((list) => list.length));
  const trajectory = [];
  for (let year = 0; year < years; year += 1) {
    trajectory.push({
      year,
      total: Object.values(population).reduce((sum, list) => sum + num(list[year]), 0),
      byBand: Object.fromEntries(Object.entries(population).map(([band, list]) => [band, num(list[year])])),
    });
  }
  return {
    kind: 'sim_tuning_curve_report',
    run: {
      runId: identity.run_id ?? null,
      seedFamily: identity.seed_family ?? null,
      scale: identity.scale ?? null,
      horizon: identity.horizon ?? null,
      profile: identity.profile ?? null,
      sourceFingerprint: identity.source_fingerprint ?? null,
      schemaVersion: identity.schema_version ?? null,
    },
    bandFamilies: bandFamilies(),
    populationTrajectory: trajectory,
    prosperityLadder: series(groups.get('sim_prosperity_epoch') || [], 'rung'),
    governance: series(groups.get('sim_governance_epoch') || [], 'measure'),
    moverActivity: series(groups.get('sim_mover_activity') || [], 'mover_family',
      (row) => row.dims?.lane === 'total'),
    eventTempo: series(groups.get('sim_event_tempo') || [], 'measure'),
    stressorRhythm: series(groups.get('sim_stressor_rhythm') || [], 'measure').active_stressors || [],
    succession: series(groups.get('sim_succession') || [], 'measure'),
    warCadence: {
      duration: histogram(groups.get('sim_war_convergence') || [], 'duration'),
      ending: histogram(groups.get('sim_war_convergence') || [], 'ending'),
      decidingTerm: histogram(groups.get('sim_war_convergence') || [], 'deciding_term'),
      census: histogram(groups.get('sim_war_convergence') || [], 'census'),
    },
    findings: Object.fromEntries((groups.get('sim_finding') || [])
      .map((row) => [String(row.dims?.finding_kind ?? ''), num(row.value)])),
  };
}

/**
 * THE RUNAWAY READ, stated as a shape rather than a verdict. Returns the per-year
 * growth multiple against year 0 and the year the multiple first crosses `factor`.
 * It reports; it never fails a run — the tuning pass owns the verdict, and this
 * module has no authority to sign a band.
 */
export function populationRunaway(report, factor = 2) {
  const trajectory = report.populationTrajectory || [];
  const base = num(trajectory[0]?.total);
  const multiples = trajectory.map((row) => (base > 0 ? num(row.total) / base : 0));
  const crossedAt = multiples.findIndex((multiple) => multiple >= factor);
  return { base, multiples, factor, crossedAt: crossedAt < 0 ? null : crossedAt };
}
