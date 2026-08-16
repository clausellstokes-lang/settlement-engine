/**
 * simMetricAggregate.test.js — the read layer reports the SHAPE, and the two faces
 * of the one vocabulary cannot fork (ODQ §117a; the venue-vocabulary five-homes
 * lesson applied in advance).
 *
 * ⛔ THE ANTI-FORK PIN IS AN ABSENCE PIN, AND THAT IS DELIBERATE. The compile
 * specified a parity pin over metric identifiers parsed out of the migration's view
 * definitions. Migration 196 as built enumerates NO metric name at all — it is ONE
 * generic EAV rollup in the 038/133 idiom the compile itself mandated — so a
 * name-parity pin would compare an empty set against an empty set and pass forever.
 * The honest pin is therefore: the SQL face names no metric (with a control proving
 * the scan WOULD see one), and the one vocabulary it does enumerate — the epoch
 * CHECK constraint — is compared key-for-key against the registry in BOTH
 * directions, with a planted extra identifier on each side.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { aggregate, bandFamilies, populationRunaway } from '../../scripts/telemetry/simMetricAggregate.mjs';
import { emitRows } from '../../scripts/telemetry/simMetricEmitter.mjs';
import { SIM_METRIC_NAMES, SIM_METRIC_EPOCHS, simMetricsByEpoch } from '../../scripts/telemetry/simMetricRegistry.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MIGRATION = readFileSync(join(ROOT, 'supabase/migrations/196_world_sim_metrics.sql'), 'utf8');
const FIXTURE = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/simSoakReceiptFixture.json'), 'utf8'));
const ROWS = emitRows(FIXTURE.clean, { runId: 'run-agg', sourceSha: 'c'.repeat(40), profile: 'cert30' });

/** Every single-quoted literal inside the epoch CHECK constraint. */
function epochVocabularyIn(sql) {
  const clause = sql.match(/epoch_kind\s+in\s*\(([^)]*)\)/i);
  return clause ? [...clause[1].matchAll(/'([a-z_]+)'/g)].map((match) => match[1]).sort() : [];
}

describe('the simulation metric read layer', () => {
  it('enumerates its band families FROM the registry, one per year-epoch row', () => {
    expect(bandFamilies()).toEqual(simMetricsByEpoch('year').map((row) => row.name));
    expect(bandFamilies().length).toBeGreaterThanOrEqual(7);
    expect(bandFamilies().filter((name) => !SIM_METRIC_NAMES.includes(name))).toEqual([]);
    // A year-epoch row with no band family is a curve nobody would watch.
    expect(simMetricsByEpoch('year').filter((row) => !bandFamilies().includes(row.name))).toEqual([]);
  });

  it('carries the population trajectory as YEAR-INDEXED ROWS, because a runaway is a shape', () => {
    const report = aggregate(ROWS);
    expect(report.kind).toBe('sim_tuning_curve_report');
    expect(report.run.runId).toBe('run-agg');
    expect(report.populationTrajectory.map((row) => row.year)).toEqual([0, 1, 2]);
    const totals = report.populationTrajectory.map((row) => row.total);
    expect(totals).toEqual([6490, 6660, 6830]);
    expect(Object.keys(report.populationTrajectory[0].byBand).sort())
      .toEqual(['city', 'hamlet', 'town', 'village']);
    const runaway = populationRunaway(report, 2);
    expect(runaway.base).toBe(6490);
    expect(runaway.crossedAt).toBe(null);
    // CONTROL: the read really detects a runaway when one is there.
    expect(populationRunaway({ populationTrajectory: [{ total: 100 }, { total: 250 }] }, 2).crossedAt).toBe(1);
  });

  it('folds every other year-epoch family into a series, and the run-epoch war histograms', () => {
    const report = aggregate(ROWS);
    expect(report.eventTempo.events).toEqual([13, 14, 15]);
    expect(report.stressorRhythm).toEqual([7, 9, 8]);
    expect(report.succession.completions).toEqual([0, 1, 0]);
    expect(report.moverActivity.war).toEqual([6, 7, 8]);
    expect(report.prosperityLadder['2']).toEqual([1, 1, 1]);
    expect(report.governance.power_moved).toEqual([0, 2, 0]);
    expect(report.warCadence.duration).toEqual({ short: 2, long: 1, generational: 0, unresolved: 1, unmeasured: 0 });
    expect(report.warCadence.census.countedWars).toBe(4);
    expect(report.narrationTempo.news_rows_observed).toEqual([40, 50, 60]);
    expect(report.narrationTempo.family_repeat_rate_milli).toEqual([75, 80, 83]);
    expect(report.findings).toEqual({});
  });

  it('cannot fork from the SQL face: that face names NO metric, and its one vocabulary matches', () => {
    // (a) the ABSENCE pin — the SQL enumerates no metric identifier at all.
    expect(SIM_METRIC_NAMES.filter((name) => MIGRATION.includes(name))).toEqual([]);
    // CONTROL: the scan would see one if it were there.
    expect(SIM_METRIC_NAMES.filter((name) => `${MIGRATION}\n-- ${SIM_METRIC_NAMES[0]}`.includes(name)))
      .toEqual([SIM_METRIC_NAMES[0]]);
    // (b) the one vocabulary the SQL DOES enumerate, compared BOTH ways.
    const sqlEpochs = epochVocabularyIn(MIGRATION);
    expect(sqlEpochs).toEqual([...SIM_METRIC_EPOCHS].sort());
    expect(sqlEpochs.filter((epoch) => !SIM_METRIC_EPOCHS.includes(epoch))).toEqual([]);
    expect([...SIM_METRIC_EPOCHS].filter((epoch) => !sqlEpochs.includes(epoch))).toEqual([]);
    // CONTROL, each direction: a planted extra identifier on either side convicts.
    expect(epochVocabularyIn("check (epoch_kind in ('run', 'year', 'decade'))")
      .filter((epoch) => !SIM_METRIC_EPOCHS.includes(epoch))).toEqual(['decade']);
    expect([...SIM_METRIC_EPOCHS, 'century'].filter((epoch) => !sqlEpochs.includes(epoch))).toEqual(['century']);
  });
});
