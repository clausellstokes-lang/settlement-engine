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
      'negative_stock', 'unbounded_growth', 'liveness_floor',
      'tick_duration_blowout', 'memory_watermark',
    ]);
    // TOTAL and DISJOINT: every row is in exactly one class, and both classes are live.
    const deterministic = tripwiresOfClass('deterministic').map((row) => row.id);
    const observability = tripwiresOfClass('host-observability').map((row) => row.id);
    expect([...deterministic, ...observability].sort()).toEqual([...TRIPWIRE_IDS].sort());
    expect(deterministic.filter((id) => observability.includes(id))).toEqual([]);
    // SOAKCHAIN Car 1 adds `liveness_floor` — deterministic, so 5 -> 6 and 7 -> 8. The
    // registry order is load-bearing (§10): the new row lands after `unbounded_growth` and
    // before both host-observability rows.
    expect(deterministic.length).toBe(6);
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

    // ── THE non_finite VACUITY, DEMONSTRATED AND THEN CLOSED (member 3; RS-1 §7.4) ──
    // ⛔ THE DEFECT, EXECUTED RATHER THAN ARGUED. `JSON.stringify` writes `null` for `NaN`
    // and for both infinities, so a row that re-scans a receipt READ BACK FROM DISK can
    // never fire on the class it names. Its zero across 177 measured cells was a WEAK
    // zero: not "no figure went non-finite", but "nothing was asked".
    const withNaN = clean({ yearlyBytes: [100_000, Number.NaN, 120_000, 130_000] });
    const asWritten = JSON.parse(JSON.stringify(withNaN));
    expect(asWritten.yearlyBytes[1]).toBe(null);
    // THE COUNTERFACTUAL: the live scan alone — the whole of the old row — finds NOTHING
    // in the parsed receipt, which is precisely the vacuity.
    expect(fired(asWritten)).toEqual([]);

    // ⭐ THE CURE: the soak censuses the LIVE receipt before serialization and carries the
    // dotted paths as STRINGS, which survive the round trip intact. The same parsed
    // receipt now convicts.
    const censused = { ...asWritten, nonFiniteFigures: ['$.yearlyBytes[1] = NaN'] };
    expect(fired(censused)).toEqual(['non_finite_ledger_figure']);
    expect(evaluateTripwires(censused).findings[0].detail)
      .toBe('non-finite figure $.yearlyBytes[1] = NaN');

    // ⚠ AND THE LIVE SCAN IS KEPT, NOT REPLACED — an IN-MEMORY receipt still holds native
    // NaNs and that path was never vacuous. Both halves fire, and neither double-counts.
    expect(fired(withNaN)).toEqual(['non_finite_ledger_figure']);
    expect(fired({ ...withNaN, nonFiniteFigures: ['$.yearlyBytes[1] = NaN'] }))
      .toEqual(['non_finite_ledger_figure']);

    // ⛔ AN ABSENT CENSUS IS NOT A FINDING. Every receipt archived before the writer-side
    // scan existed lacks the key, and convicting them would report a defect none of them
    // can be shown to have — the row reports what it measured, never what it could not.
    expect(fired(clean())).toEqual([]);
    expect(fired(clean({ nonFiniteFigures: [] }))).toEqual([]);
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

  it('liveness_floor ALWAYS folds live, convicts a frozen world, and names a writer that disagrees', () => {
    const fired = (receipt) => evaluateTripwires(receipt).findings.map((row) => row.id);
    const detailsOf = (receipt) => evaluateTripwires(receipt)
      .findings.filter((row) => row.id === 'liveness_floor').map((row) => row.detail);
    /** A decade of world, parameterised by how much it moves. */
    const world = ({ years, types, moving }) => clean({
      years,
      yearlyHashes: Array.from({ length: years }, (_, i) => (moving ? `hash-${i}` : 'the-same-hash')),
      behavioral: {
        yearly: Array.from({ length: years }, (_, i) => ({
          year: i + 1,
          majorEventCount: 3,
          eventTypeCounts: Object.fromEntries(types.map((type) => [`${type}_${i}`, 4])),
        })),
      },
    });
    const living = world({ years: 10, types: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'], moving: true });
    const dead = { ...world({ years: 10, types: ['a'], moving: false }), behavioral: {
      yearly: Array.from({ length: 10 }, (_, i) => ({ year: i + 1, majorEventCount: 0, eventTypeCounts: { only_one_type: 40 } })),
    } };

    // ⛔ THE SHAPE THE SOAK ONLY EVER PRINTED ABOUT: ten years, one typed event, a composite
    // that stops moving. `frozenTail` computed exactly this and nothing consumed it.
    expect(fired(dead)).toEqual(['liveness_floor', 'liveness_floor']);
    expect(detailsOf(dead)[0]).toContain('monoculture: decade 1 (years 1-10) carried 1 distinct typed events');
    expect(detailsOf(dead)[1]).toContain('frozen: decade 1 (years 1-10) moved the composite state in 1 of 10 years');
    // A living decade fires nothing, so the row is a measurement and not a stamp.
    expect(fired(living)).toEqual([]);
    // ⭐ AN ARCHIVED RECEIPT STILL CONVICTS — the fold's evidence survives JSON.
    expect(fired(JSON.parse(JSON.stringify(dead)))).toEqual(['liveness_floor', 'liveness_floor']);

    // THE CROSS-CHECK. A writer-side block that AGREES with the live fold adds nothing…
    const agreeing = { ...dead, liveness: { executable: true, failures: [
      { kind: 'monoculture', decade: 1 }, { kind: 'frozen', decade: 1 },
    ] } };
    expect(fired(agreeing)).toEqual(['liveness_floor', 'liveness_floor']);
    // …and a doctored one that claims the world is fine is NAMED rather than believed. A
    // writer-side `failures: []` would otherwise silence the fold entirely.
    const doctored = { ...dead, schemaVersion: 5, liveness: { executable: true, failures: [] } };
    const doctoredDetails = detailsOf(doctored);
    expect(doctoredDetails).toHaveLength(3);
    expect(doctoredDetails[2]).toBe(
      "liveness_writer_disagrees: the receipt's own liveness block (receiptSchemaVersion 5) "
      + 'lists [none] where the live fold finds [monoculture@1,frozen@1]',
    );

    // Below one FULL decade the row measured nothing, so it reports nothing — neither a
    // pass nor a finding (§206.2b's third status).
    expect(fired(world({ years: 3, types: ['a'], moving: false }))).toEqual([]);
    // And a receipt with no behavioral fold at all is silent rather than convicted.
    expect(fired(clean())).toEqual([]);
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
