/**
 * simMetricRegistry.test.js — the SIMULATION class is a closed vocabulary that
 * shares the product taxonomy's ONE name contract and shares nothing else
 * (ODQ §117a; the chair's §149.2 ruling).
 *
 * Each arm below carries a PLANTED CONTROL: the same assertion is re-run against
 * a deliberately defective row set and must convict it. A registry pin that
 * cannot red is a disabled guard, and this estate has banked that lesson enough
 * times to pay for the four extra lines.
 */

import { describe, expect, it } from 'vitest';
import { EVENTS, EVENT_NAME_RE } from '../../src/lib/analyticsEvents.js';
import {
  SIM_METRICS,
  SIM_METRIC_NAMES,
  SIM_METRIC_EPOCHS,
  SIM_EVENT_CLASS,
  EPOCH_BY_ARITY,
  RECEIPT_FIELD_ARITY,
  registryDefects,
} from '../../scripts/telemetry/simMetricRegistry.mjs';

/** A well-formed row to mutate into each control. */
const sound = SIM_METRICS[0];
const withRow = (patch) => [{ ...sound, ...patch }];

describe('the simulation metric registry', () => {
  it('spells every name with the ONE wire contract imported from analyticsEvents.js', () => {
    expect(SIM_METRIC_NAMES.length).toBe(12);
    expect(SIM_METRIC_NAMES.filter((name) => !EVENT_NAME_RE.test(name))).toEqual([]);
    expect(SIM_METRICS.filter((row) => row.class !== SIM_EVENT_CLASS)).toEqual([]);
    expect(registryDefects()).toEqual([]);
    // CONTROL: the regex is the real gate, not a decoration.
    expect(registryDefects(withRow({ name: 'Sim_Run_Summary' }))).toEqual([
      'Sim_Run_Summary: name fails EVENT_NAME_RE',
    ]);
  });

  it('is DISJOINT from the product EVENTS taxonomy, and reserves its own prefix', () => {
    const productNames = new Set(Object.values(EVENTS));
    const simNames = new Set(SIM_METRIC_NAMES);
    expect(SIM_METRIC_NAMES.filter((name) => productNames.has(name))).toEqual([]);
    // The second direction is NOT the same statement as the first: it says no
    // product event may later join this class by naming itself into it.
    expect([...productNames].filter((name) => name.startsWith('sim_') || simNames.has(name))).toEqual([]);
    // CONTROL: a genuine collision is visible to the same arm.
    const planted = [...SIM_METRIC_NAMES, [...productNames][0]];
    expect(planted.filter((name) => productNames.has(name))).toEqual([[...productNames][0]]);
  });

  it('is PII-FREE BY SCHEMA — no dim names an actor, session, user, consent or country', () => {
    const dims = SIM_METRICS.flatMap((row) => row.dims);
    expect(dims.length).toBeGreaterThan(0);
    expect(registryDefects().filter((defect) => /PII-bearing/.test(defect))).toEqual([]);
    // CONTROL: a planted PII dim must convict, or the arm proves nothing.
    expect(registryDefects(withRow({ dims: ['actor_id'] }))).toEqual([
      'sim_run_summary: dim actor_id is PII-bearing',
    ]);
  });

  it('declares an epoch its own source fields already have — the emitter never resamples', () => {
    expect([...SIM_METRIC_EPOCHS]).toEqual(['run', 'year']);
    expect(SIM_METRICS.filter((row) => !SIM_METRIC_EPOCHS.includes(row.epoch))).toEqual([]);
    for (const row of SIM_METRICS) {
      for (const field of row.source) {
        expect(EPOCH_BY_ARITY[RECEIPT_FIELD_ARITY[field]]).toBe(row.epoch);
      }
    }
    // CONTROL A — a row claiming a per-year epoch over a run-scalar field.
    expect(registryDefects(withRow({ epoch: 'year' }))).toContain(
      'sim_run_summary: source passed is run-scalar (epoch run) but the row declares year',
    );
    // CONTROL B — a source field that is not on the measured receipt at all.
    expect(registryDefects(withRow({ source: ['inventedField'] }))).toEqual([
      'sim_run_summary: source inventedField is not a measured receipt field',
    ]);
  });
});
