/**
 * tripwireRegistry.test.js — SK-2A's proof surface (sk-a; ODQ §141.2).
 *
 * THE PARTITION IS THE ARM THAT MATTERS. If a wall-clock or memory row could mint a
 * finding, SK-1's in-pool ≡ solo proof would be unprovable by construction: eight
 * workers sharing memory bandwidth fire duration tripwires a solo run never sees. So the
 * split is asserted TOTAL and DISJOINT, and the class boundary is enforced by
 * source-scanning each deterministic row's own detector for a clock read — machinery,
 * not a naming convention.
 */

import { describe, expect, it } from 'vitest';

import {
  TRIPWIRES,
  TRIPWIRE_CLASSES,
  TRIPWIRE_IDS,
  WALL_TIME_TREND_FACTOR,
  YEARLY_BYTES_PER_SETTLEMENT_CEILING,
  evaluateTripwires,
  tripwireRegistryDefects,
  tripwiresOfClass,
} from '../../scripts/soak/tripwires.mjs';

/** A clean receipt: nothing should fire. */
const clean = (overrides = {}) => ({
  settlements: 4,
  failures: [],
  startPopulations: [100, 200, 300, 400],
  finalPopulations: [120, 210, 280, 390],
  finalDiedFlags: [false, false, false, false],
  stressorCounts: [1, 2, 1, 0],
  yearlyBytes: [100_000, 110_000, 120_000, 130_000],
  yearlyMs: [100, 110, 120, 130],
  peakHeapUsedBytes: 200 * 1024 * 1024,
  ...overrides,
});

describe('the tripwire registry', () => {
  it('the registry is closed, typed, and every threshold carries a derivation home', () => {
    expect(tripwireRegistryDefects()).toEqual([]);
    expect([...TRIPWIRE_CLASSES]).toEqual(['deterministic', 'host-observability']);
    expect([...TRIPWIRE_IDS]).toEqual([
      'throw_or_assert', 'non_finite_ledger_figure', 'population_collapse',
      'negative_stock', 'unbounded_growth',
      'tick_duration_blowout', 'memory_watermark',
    ]);
    // TOTAL and DISJOINT: every row is in exactly one class, and both classes are live.
    const deterministic = tripwiresOfClass('deterministic').map((row) => row.id);
    const observability = tripwiresOfClass('host-observability').map((row) => row.id);
    expect([...deterministic, ...observability].sort()).toEqual([...TRIPWIRE_IDS].sort());
    expect(deterministic.filter((id) => observability.includes(id))).toEqual([]);
    expect(deterministic.length).toBe(5);
    expect(observability.length).toBe(2);
  });

  it('no DETERMINISTIC row reads a clock or the heap, and the scan really convicts', () => {
    for (const row of tripwiresOfClass('deterministic')) {
      expect(/Date\.now|performance\.now|memoryUsage/.test(String(row.detect)), `${row.id} reads a clock`).toBe(false);
    }
    // CONTROL — the same scan, applied to a planted row that does. Without this the arm
    // above passes on an empty registry and on a registry of no-op detectors alike.
    const planted = [{
      id: 'planted', class: 'deterministic', band: 'b', home: 'a derivation home long enough to pass',
      detect: () => (Date.now() > 0 ? ['fired'] : []),
    }];
    expect(tripwireRegistryDefects(planted)).toEqual([
      'planted: a DETERMINISTIC row reads a clock or the heap — it belongs in host-observability',
    ]);
    // …and the host-observability rows DO read them, which is what makes them that class.
    expect(/memoryUsage|peakHeapUsedBytes/.test(String(tripwiresOfClass('host-observability')
      .find((row) => row.id === 'memory_watermark').detect))).toBe(true);
  });

  it('a clean receipt fires NOTHING — the registry is not a false-finding factory', () => {
    expect(evaluateTripwires(clean())).toEqual({ findings: [], observability: [] });
    // A properly-died settlement legitimately holds zero: the remnant law, honoured.
    expect(evaluateTripwires(clean({
      finalPopulations: [120, 0, 280, 390],
      finalDiedFlags: [false, true, false, false],
    })).findings).toEqual([]);
  });

  it('each DETERMINISTIC row fires on its own defect, and only on its own', () => {
    const fired = (receipt) => evaluateTripwires(receipt).findings.map((row) => row.id);
    expect(fired(clean({ failures: ['byte-identical re-run (same seed)'] }))).toEqual(['throw_or_assert']);
    expect(fired(clean({ yearlyBytes: [100_000, Number.NaN, 120_000, 130_000] })))
      .toEqual(['non_finite_ledger_figure']);
    // The remnant law's OTHER side: a zero with no died flag IS a finding.
    expect(fired(clean({ finalPopulations: [120, 0, 280, 390] }))).toEqual(['population_collapse']);
    expect(fired(clean({ stressorCounts: [1, -2, 1, 0] }))).toEqual(['negative_stock']);
    // The ceiling is INHERITED verbatim: 900_000 × settlements.
    const ceiling = YEARLY_BYTES_PER_SETTLEMENT_CEILING * 4;
    expect(fired(clean({ yearlyBytes: [1, 2, 3, ceiling] }))).toEqual(['unbounded_growth']);
    expect(fired(clean({ yearlyBytes: [1, 2, 3, ceiling - 1] }))).toEqual([]);
  });

  it('HOST-OBSERVABILITY rows never mint a finding, which is what makes the pool proof possible', () => {
    // A pooled worker under memory pressure: both observability rows fire hard.
    const pressured = clean({
      yearlyMs: [10, 10, 10, 10 * WALL_TIME_TREND_FACTOR + 1000],
      peakHeapUsedBytes: 900 * 1024 * 1024,
    });
    const { findings, observability } = evaluateTripwires(pressured);
    // ⛔ THE WHOLE POINT: zero findings. An unsplit registry would report this cell as
    // non-deterministic for the crime of having been run beside seven siblings.
    expect(findings).toEqual([]);
    expect(observability.map((row) => row.id)).toEqual(['tick_duration_blowout', 'memory_watermark']);
    for (const row of observability) expect(row.class).toBe('host-observability');
    // And a genuine state defect in the SAME receipt is still convicted, so the split
    // silences the class and not the cell.
    expect(evaluateTripwires({ ...pressured, stressorCounts: [-1] }).findings.map((row) => row.id))
      .toEqual(['negative_stock']);
  });

  it('every row is a REGISTRY ROW — a new class costs its row or the guard is invisible', () => {
    for (const row of TRIPWIRES) {
      expect(typeof row.detect).toBe('function');
      expect(String(row.home).length).toBeGreaterThan(20);
      expect(String(row.band).length).toBeGreaterThan(0);
      // The detector must be TOTAL: an empty or malformed receipt yields an array, never
      // a throw. A registry that crashes on a truncated receipt disables itself exactly
      // when a run went wrong.
      expect(Array.isArray(row.detect({}))).toBe(true);
      expect(Array.isArray(row.detect(null))).toBe(true);
    }
    expect(evaluateTripwires({})).toEqual({ findings: [], observability: [] });
  });
});
