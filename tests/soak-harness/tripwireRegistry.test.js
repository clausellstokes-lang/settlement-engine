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
      'capacity_plateau', 'capacity_floor_thaw', 'capacity_realm_load',
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
    //
    // CAPACITY C3 adds THREE capacity rows on the same reading, so 6 -> 9 and 8 -> 11, and
    // they land in the same place for the same reason: after the deterministic rows that
    // preceded them and before both host-observability rows.
    //
    // ⚠ THREE, NOT THE DESIGNED FOUR, AND THE MISSING ONE IS RECORDED RATHER THAN QUIETLY
    // DROPPED. `capacity_envelope_30y` would key on
    // `behavioral.yearly[29].motion.populationMoved / populationTransitions`; MEASURED at
    // this tip no such field is written — the yearly observation carries `majorEventCount`,
    // `eventTypeCounts` and `moverCounts` and no `motion` block. Adding it is a receipt
    // SCHEMA change, and a row over an absent field is an instrument that is NOT-EXECUTABLE
    // forever while presenting as coverage. The property is measured instead in the
    // unconditional chain, by demographicsEnvelope.test.js's STATE MOTION arm.
    expect(deterministic.length).toBe(9);
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
    expect(evaluateTripwires(clean())).toEqual({ findings: [], observability: [], notExecutable: [] });
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

    // ── CAPACITY C3: three rows, three planted defects, and the DARK control ──────
    // ⛔ THE GATE FIRST, BECAUSE IT IS THE ROWS' MOST IMPORTANT PROPERTY. Every capacity
    // row is NOT-EXECUTABLE unless the receipt's own subsystem block says the demographic
    // term was RUNNING. A clean receipt has no such block, which is why every arm above is
    // unchanged by three new rows.
    const lit = (over) => clean({ subsystems: { rules: { demographicsEnabled: true } }, ...over });
    // A capacity row names EVERY settlement it convicts, so it can fire more than once on
    // one receipt. WHICH rows fired is the question these plants ask, so the distinct ids
    // are what is compared — and the per-settlement detail is asserted separately below.
    const firedRows = (receipt) => [...new Set(fired(receipt))];
    /** @param {(y: number, i: number) => number} f */
    const years = (n, f) => Array.from({ length: n }, (_, y) => [0, 1, 2, 3].map((i) => f(y, i)));
    /**
     * ⛔ THE SERIES AND ITS DIED FLAGS ARE PLANTED TOGETHER, BECAUSE A ROW THAT SEES ONE
     * WITHOUT THE OTHER IS WORSE THAN A BLIND ONE: the remnant law's exception list lives in
     * the flags, and a plateau row reading populations alone convicts every lawful death.
     * Both are named in the rows' `requires`, so a fixture that plants only half now makes
     * the row NOT-EXECUTABLE rather than quietly changing what it means.
     */
    const capacity = (n, f) => ({
      yearlyPopulations: years(n, f),
      yearlyDiedFlags: years(n, () => false),
    });

    // 1. A REALM STILL CLIMBING AT YEAR 200 never plateaued. It is not FROZEN either, so
    //    the thaw row beside it must stay silent — that is the "only on its own" half.
    const climbing = lit(capacity(201, (y, i) => 100 + i * 100 + y));
    expect(firedRows(climbing)).toEqual(['capacity_plateau']);
    // and it named EVERY settlement that never plateaued, not just the first
    expect(fired(climbing)).toHaveLength(4);
    // and the DARK twin of the very same receipt is convicted by nothing at all
    expect(fired(clean(capacity(201, (y, i) => 100 + i * 100 + y)))).toEqual([]);

    // 2. A SETTLEMENT HELD AT ONE HEAD COUNT FOR A CENTURY is the pre-cure defect's OTHER
    //    half — the floored losers the bounded check never saw. Its three siblings step
    //    once, so they are neither frozen nor still climbing, and only the thaw row fires.
    const frozenSeries = (y, i) => (i === 0 ? 200 : 500 + i * 100 + Math.floor(y / 100));
    const frozen = lit(capacity(150, frozenSeries));
    expect(firedRows(frozen)).toEqual(['capacity_floor_thaw']);
    // exactly the ONE frozen settlement, not its three moving siblings
    expect(fired(frozen)).toHaveLength(1);
    expect(fired(clean(capacity(150, frozenSeries)))).toEqual([]);

    // 3. A REALM SITTING AT A FIFTH OF ITS OWN BOUND is not a plateaued realm. This plant
    //    carries no yearly series at all, so the two rows above are NOT-EXECUTABLE on it —
    //    and that is now a channel this arm can READ rather than a claim in a comment.
    const underloaded = lit({
      behavioral: { yearly: [{ realmDemography: { loadRatio01: 0.2, binding: { granary: 2, walls: 2 } } }] },
    });
    expect(firedRows(underloaded)).toEqual(['capacity_realm_load']);
    expect(evaluateTripwires(underloaded).notExecutable.map((row) => row.id))
      .toEqual(['capacity_plateau', 'capacity_floor_thaw']);
    expect(fired(clean({ behavioral: underloaded.behavioral }))).toEqual([]);

    // 4. A BINDING CENSUS THAT DOES NOT ACCOUNT FOR EVERY SETTLEMENT is the other clause,
    //    and it fires with the load inside its window so the two are not one arm.
    expect(firedRows(lit({
      behavioral: { yearly: [{ realmDemography: { loadRatio01: 0.8, binding: { granary: 1, walls: 1 } } }] },
    }))).toEqual(['capacity_realm_load']);

    // 5. AND THE PASSING CORNER, without which every plant above proves only that the rows
    //    can fire and never that they can be satisfied.
    const settled = lit({
      ...capacity(201, (y, i) => (y < 50 ? 100 + i * 100 + y : 150 + i * 100 + (y % 7))),
      behavioral: { yearly: [{ realmDemography: { loadRatio01: 0.8, binding: { granary: 2, walls: 2 } } }] },
    });
    expect(fired(settled)).toEqual([]);
    // ⭐ AND THE PASSING CORNER IS A PASS, NOT A SILENCE. Every capacity row RAN on it: the
    // third channel is empty, so this `[]` is a measurement rather than the weak zero the
    // same assertion reported for three weeks.
    expect(evaluateTripwires(settled).notExecutable).toEqual([]);
  });

  it('a row keyed on an ABSENT field is NOT-EXECUTABLE and names the field — it never answers []', () => {
    const lit = (over) => clean({ subsystems: { rules: { demographicsEnabled: true } }, ...over });
    const REASON = 'requires receipt.yearlyPopulations, receipt.yearlyDiedFlags — absent from this receipt';

    // ⛔⛔ THE DEFECT THIS ARM EXISTS FOR (M1-F1, measured on the real 300-year receipt).
    // `whole-world-soak.mjs` ships `finalPopulations` and `finalDiedFlags` and has never
    // shipped the per-year series, so BOTH capacity series rows hit their own
    // `Array.isArray(…) ? … : []` guard, read a zero-length series, took the `< 150` (resp.
    // `< 100`) early return and answered `[]` — a silent clean, on every receipt the estate
    // has ever written, while the receipt graded `fullInstrument: true`. The fixture below
    // is the shape the WRITER produces, not the shape the pin used to plant.
    const asTheWriterShipsIt = lit({});
    const blind = evaluateTripwires(asTheWriterShipsIt);
    expect(blind.findings).toEqual([]);
    expect(blind.notExecutable).toEqual([
      { id: 'capacity_plateau', class: 'deterministic', reason: REASON },
      { id: 'capacity_floor_thaw', class: 'deterministic', reason: REASON },
    ]);

    // HALF A SERIES IS STILL BLIND, and that is not pedantry: the died flags carry the
    // remnant law's exception list, so a plateau row reading populations alone convicts
    // every lawful death.
    expect(evaluateTripwires(lit({ yearlyPopulations: [[1], [2]] })).notExecutable
      .map((row) => row.reason))
      .toEqual([
        'requires receipt.yearlyDiedFlags — absent from this receipt',
        'requires receipt.yearlyDiedFlags — absent from this receipt',
      ]);
    // A key written with nothing in it carried no evidence either.
    expect(evaluateTripwires(lit({ yearlyPopulations: null, yearlyDiedFlags: null })).notExecutable)
      .toHaveLength(2);

    // ⭐ PLANT THE FIELDS AND THE ROWS EXECUTE — the existing behaviour, unchanged. Without
    // this half the arm above would pass on a registry whose rows had simply been disabled.
    const planted = lit({
      yearlyPopulations: Array.from({ length: 201 }, (_, y) => [100 + y]),
      yearlyDiedFlags: Array.from({ length: 201 }, () => [false]),
    });
    expect(evaluateTripwires(planted).notExecutable).toEqual([]);
    expect(evaluateTripwires(planted).findings.map((row) => row.id)).toEqual(['capacity_plateau']);

    // ⛔ AND A DARK CELL IS NOT A BLIND ONE. The §13 C8 rider's gate says the demographic
    // term was not running, so the rows measured the right thing about a term that was off:
    // they are NOT APPLICABLE, they list nothing, and a freeze gate must not be told a run
    // went blind because a subsystem was legitimately dark.
    expect(evaluateTripwires(clean({})).notExecutable).toEqual([]);
    expect(evaluateTripwires(clean({ subsystems: { rules: { demographicsEnabled: false } } })).notExecutable)
      .toEqual([]);
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
    // An EMPTY receipt lights no gate, so every capacity row is NOT APPLICABLE rather than
    // not-executable: the third channel stays empty and the two others answer nothing.
    expect(evaluateTripwires({})).toEqual({ findings: [], observability: [], notExecutable: [] });
  });
});
