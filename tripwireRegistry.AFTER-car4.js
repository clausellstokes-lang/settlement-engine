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

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  TRIPWIRES,
  TRIPWIRE_CLASSES,
  TRIPWIRE_IDS,
  WALL_TIME_TREND_FACTOR,
  YEARLY_BYTES_PER_SETTLEMENT_CEILING,
  evaluateTripwires,
  nestedWriterFields,
  receiptWriterFields,
  tripwireFieldReach,
  tripwireFieldsRead,
  tripwireRegistryDefects,
  tripwiresOfClass,
} from '../../scripts/soak/tripwires.mjs';
import {
  CAMPAIGN_HORIZON_YEARS,
  MOTION_FLOOR_01,
  MOVING_SHARE_FLOOR,
} from '../../scripts/audit/soakInvariants.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
/**
 * ⛔ THE WRITER IS READ AS TEXT, NEVER IMPORTED. `scripts/soak/**` is an ARM_B_ROOT of the
 * engine/telemetry wall, and `whole-world-soak.mjs` reaches the engine; importing it from a
 * harness that pins Arm B would drag the whole simulation across the seam to answer a
 * question about forty key names.
 */
const WRITER_SOURCE = readFileSync(join(ROOT, 'scripts/audit/whole-world-soak.mjs'), 'utf8');
/**
 * ⭐ THE SECOND WRITER, READ THE SAME WAY (§909 car 2). `capacity_realm_load` stands on
 * `behavioral.yearly[last].realmDemography`, and the module that ships that key is the
 * OBSERVER, not the soak — so a walker handed only the soak's text could grade the row's
 * first segment and nothing else. Text-read for the same ARM_B_ROOT reason as above.
 */
const OBSERVER_SOURCE = readFileSync(join(ROOT, 'scripts/audit/behavioral-observation.mjs'), 'utf8');
/** The envelope suite, read as text so the ONE-SPELLING claim is checked and not asserted. */
const ENVELOPE_SUITE_SOURCE = readFileSync(join(ROOT, 'tests/domain/demographicsEnvelope.test.js'), 'utf8');
/** Source with `//` comments stripped, so a figure QUOTED in prose is not read as a spelling. */
const codeOnly = (source) => source.split('\n').map((line) => line.replace(/\/\/.*$/, '')).join('\n');

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
      'capacity_envelope_30y',
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
    // ⭐⭐ AND THE FOURTH IS HERE AT §909 CAR 3 — 11 → 12 and 9 → 10, which is the design's
    // own §2.5 C3 prediction, landing in the same place and for the same reason as its three
    // siblings: after the deterministic rows that preceded it and before both
    // host-observability rows.
    //
    // ⚠ IT WAS REFUSED TWICE AND ONLY THE SECOND REFUSAL WAS TRUE. The first said
    // `behavioral.yearly[].motion` "does not exist" — false when written, refuted at §907
    // car 3, and re-refuted by the tree below. The second was the threshold's home: the bar
    // lived in a test file `scripts/soak/**` may not import, so arming the row would have
    // re-typed `0.05` into the registry — the second spelling `tripwires.mjs`'s own header
    // refuses. §909 car 3 lifted both bars into `scripts/audit/soakInvariants.mjs` and both
    // former homes import them, so the row and this suite's STATE MOTION arm now stand on
    // ONE spelling and cannot drift apart.
    expect(deterministic.length).toBe(10);
    expect(observability.length).toBe(2);

    // ⛔ AND THE FALSE CLAIM CANNOT BE RE-MADE BY READING THIS FILE. The writer is text-read
    // here so "no `motion` block at all" is refuted by the tree rather than by memory.
    expect(OBSERVER_SOURCE).toMatch(/motion: \{\s*\n\s*populationTransitions,\s*\n\s*populationMoved,/);
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
    // row is NOT APPLICABLE unless the receipt's own subsystem block says the demographic
    // term was RUNNING. A clean receipt has no such block, which is why every arm above is
    // unchanged by the four capacity rows.
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
      // ⭐ THREE SINCE §909: this plant carries a realm reading and NO per-year series and no
      // `motion` block, so the two series rows and the envelope row all say so positively.
      .toEqual(['capacity_plateau', 'capacity_floor_thaw', 'capacity_envelope_30y']);
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
      // ⭐ THE MOTION BLOCK RIDES ALONG SINCE §909 CAR 3. The passing corner claims EVERY
      // capacity row ran on this receipt, so it must carry what all FOUR of them require;
      // one observed year is below the envelope row's own thirty-year horizon, so that row
      // executes and is silent by its own guard rather than by an absent field.
      behavioral: {
        yearly: [{
          realmDemography: { loadRatio01: 0.8, binding: { granary: 2, walls: 2 } },
          motion: { populationTransitions: 4, populationMoved: 4 },
        }],
      },
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
    const NESTED_REASON = 'requires receipt.behavioral.yearly[last].realmDemography — absent from this receipt';
    const MOTION_REASON = 'requires receipt.behavioral.yearly[last].motion — absent from this receipt';
    /** The realm reading a receipt must carry for `capacity_realm_load` to be executable. */
    const realmReading = { realmDemography: { loadRatio01: 0.8, binding: { granary: 2, walls: 2 } } };

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
      // ⭐ AND THE THIRD ROW JOINED THE LEDGER AT §909 CAR 2, which is a DECLARED grade
      // movement and not a drive-by: `capacity_realm_load` keys on a NESTED additive key,
      // so on a lit receipt that carries no realm reading it used to answer a silent clean.
      { id: 'capacity_realm_load', class: 'deterministic', reason: NESTED_REASON },
      // …and the FOURTH at car 3, on the same reading: a receipt with no `motion` block
      // measured nothing about the envelope, and the row now says which path it wanted.
      { id: 'capacity_envelope_30y', class: 'deterministic', reason: MOTION_REASON },
    ]);

    // HALF A SERIES IS STILL BLIND, and that is not pedantry: the died flags carry the
    // remnant law's exception list, so a plateau row reading populations alone convicts
    // every lawful death.
    expect(evaluateTripwires(lit({ yearlyPopulations: [[1], [2]] })).notExecutable
      .map((row) => row.reason))
      .toEqual([
        'requires receipt.yearlyDiedFlags — absent from this receipt',
        'requires receipt.yearlyDiedFlags — absent from this receipt',
        NESTED_REASON,
        MOTION_REASON,
      ]);
    // A key written with nothing in it carried no evidence either.
    expect(evaluateTripwires(lit({ yearlyPopulations: null, yearlyDiedFlags: null })).notExecutable)
      .toHaveLength(4);

    // ⭐ PLANT THE FIELDS AND THE ROWS EXECUTE — the existing behaviour, unchanged. Without
    // this half the arm above would pass on a registry whose rows had simply been disabled.
    const planted = lit({
      yearlyPopulations: Array.from({ length: 201 }, (_, y) => [100 + y]),
      yearlyDiedFlags: Array.from({ length: 201 }, () => [false]),
      // The realm reading rides along from §909 car 2: the arm's claim is that planting what
      // the rows REQUIRE makes them execute, so it must plant what ALL THREE require or it
      // would be asserting the cure for two rows against a third that stayed blind.
      behavioral: { yearly: [{ ...realmReading, motion: { populationTransitions: 4, populationMoved: 4 } }] },
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

  it('NO ROW MAY KEY ON A FIELD THE RECEIPT WRITER DOES NOT WRITE — the class, banked and shrink-only', () => {
    /**
     * ⛔⛔ A GUESS ABOUT REACHABILITY WAS WRONG IN BOTH DIRECTIONS IN ONE LANDING.
     * `capacity_envelope_30y` was refused at C3 for keying on an "unwritten" field that was
     * in fact written five weeks earlier; `capacity_plateau` and `capacity_floor_thaw`
     * shipped keyed on fields that genuinely are not written, and nothing checked them,
     * because the check was a person remembering. This arm is that check as machinery: what
     * each row reads, from the row's own source; what the writer writes, from the writer's
     * own source; and the difference.
     *
     * ⛔ THE BASELINE IS A RATCHET AND IT ONLY SHRINKS — AND AT §909 IT REACHED ZERO. Two
     * rows were banked as unreachable; `whole-world-soak.mjs` now ships `yearlyPopulations`
     * and `yearlyDiedFlags` from run A, so BOTH figures are 0 and the banked pair moves
     * `2 → 0` and `4 → 0`. A THIRD row would fail this arm, and so would a RE-BLINDING of
     * either row cured here: the ratchet is now a floor at zero and nothing may climb off it.
     */
    const UNREACHABLE_ROWS_BANKED = 0;
    const UNREACHABLE_PAIRS_BANKED = 0;

    const reach = tripwireFieldReach(TRIPWIRES, WRITER_SOURCE, OBSERVER_SOURCE);

    // The writer's key set is a real reading, not an empty set that would make every row
    // look unreachable — 40+ keys, and the ones the deterministic rows actually stand on.
    expect(reach.written.length).toBeGreaterThan(35);
    for (const field of ['failures', 'finalPopulations', 'finalDiedFlags', 'startPopulations',
      'stressorCounts', 'yearlyBytes', 'yearlyHashes', 'settlements', 'behavioral', 'liveness',
      'subsystems', 'notExecutable', 'peakHeapUsedBytes', 'yearlyMs',
      // ⭐ THE TWO §909 SHIPPED, asserted POSITIVELY beside their FINAL-state siblings. They
      // were anchored ABSENCES here until the series landed; an absence cured is asserted as
      // a presence, never quietly deleted.
      'yearlyPopulations', 'yearlyDiedFlags']) {
      expect(reach.written, `the writer's key set is missing ${field}`).toContain(field);
    }

    const unreachableRows = [...new Set(reach.unreachable.map((row) => row.id))];
    expect(unreachableRows).toEqual([]);
    expect(unreachableRows.length).toBeLessThanOrEqual(UNREACHABLE_ROWS_BANKED);
    expect(reach.unreachable.length).toBeLessThanOrEqual(UNREACHABLE_PAIRS_BANKED);
    expect(reach.unreachable).toEqual([]);
    // No row is beyond the walker's reading.
    expect(reach.unreadable).toEqual([]);
    // …and no DECLARED requirement is beyond a writer either (§909 car 2). A read is what a
    // row touches; a require is what it says its silence depends on, and the second is the
    // one a freeze gate acts on — so both are graded, in their own channels.
    expect(reach.unreachablePaths).toEqual([]);

    // ⛔⛔ A ZERO IS ONLY A MEASUREMENT IF THE INSTRUMENT COULD HAVE SAID OTHERWISE. With
    // both series shipped, every assertion above passes just as well on a walker that
    // silently reports nothing — the exact weak zero this whole registry exists to refuse.
    // So the PRE-§909 writer is reconstructed by deleting the two shipped lines, and the
    // walker is re-run against it: it must find the OLD 2 rows and 4 pairs. That is the
    // control which proves the zero above was caused by the shipping.
    const legacyWriter = WRITER_SOURCE
      .replace(/\n\s*yearlyPopulations: runA\.yearlyPopulations,/, '\n')
      .replace(/\n\s*yearlyDiedFlags: runA\.yearlyDiedFlags\.map\(\(year\) => year\.map\(Boolean\)\),/, '\n');
    // ⚠ AND THE CONTROL IS PROVED NON-VACUOUS FIRST. A rename that stopped either replace
    // from matching would leave `legacyWriter` identical to the real source and the control
    // would assert the cure against the cure — an assertion that cannot fail.
    expect(legacyWriter.length).toBeLessThan(WRITER_SOURCE.length);
    // …and each absence is ANCHORED by its own FINAL-state sibling — same object literal in
    // the writer, same `receiptWriterFields` read — so a reconstruction that emptied the key
    // set reds here instead of "proving" a deletion it never had to make. The length check
    // above catches a replace that matched NOTHING; these catch a read that returned nothing.
    expectAbsentWithAnchor(receiptWriterFields(legacyWriter), 'yearlyPopulations',
      'finalPopulations', 'the pre-§909 writer still has a live key set');
    expectAbsentWithAnchor(receiptWriterFields(legacyWriter), 'yearlyDiedFlags',
      'finalDiedFlags', 'the pre-§909 writer still has a live key set');
    const legacyReach = tripwireFieldReach(TRIPWIRES, legacyWriter, OBSERVER_SOURCE);
    expect(legacyReach.unreachable).toEqual([
      { id: 'capacity_plateau', field: 'yearlyDiedFlags' },
      { id: 'capacity_plateau', field: 'yearlyPopulations' },
      { id: 'capacity_floor_thaw', field: 'yearlyDiedFlags' },
      { id: 'capacity_floor_thaw', field: 'yearlyPopulations' },
    ]);
    // …and the DECLARED-requirement channel convicts the same pre-§909 writer independently,
    // in the order the rows declare them. Two channels agreeing on one control is what makes
    // either believable; `capacity_realm_load`'s nested path is grounded in the observer and
    // is untouched by deleting two lines from the soak, which is the discrimination.
    expect(legacyReach.unreachablePaths).toEqual([
      { id: 'capacity_plateau', path: 'yearlyPopulations', segment: 'yearlyPopulations' },
      { id: 'capacity_plateau', path: 'yearlyDiedFlags', segment: 'yearlyDiedFlags' },
      { id: 'capacity_floor_thaw', path: 'yearlyPopulations', segment: 'yearlyPopulations' },
      { id: 'capacity_floor_thaw', path: 'yearlyDiedFlags', segment: 'yearlyDiedFlags' },
    ]);

    // ⭐ AND EVERY UNREACHABLE ROW STILL DECLARES ITS OWN BLINDNESS — the law survives the
    // cure, and it is read off the CONTROL because the live reach is now empty. The two rows
    // KEEP their `requires`: an archived v4/v5 receipt written before §909 still lacks both
    // fields, and its silence must still grade NOT-EXECUTABLE rather than clean.
    //
    // ⛔ THE IDENTITY WAS RESTATED AT §909 CAR 2, AND THE OLD SPELLING WAS THE COINCIDENCE.
    // "Unreachable rows == rows that declare `requires`" held only while every requirement
    // was a top-level field of ONE writer. `capacity_realm_load` declares a requirement it
    // CAN reach — grounded in the observer — so the equality now fails in the harmless
    // direction and would have to be weakened to nothing to keep its old shape. The law it
    // was protecting is a SUBSET law, and it is asserted as one: whatever the walker
    // convicts, in either channel, is a row that announced its dependency.
    const convictedBy = (grade) => [...new Set(
      [...grade.unreachable, ...grade.unreachablePaths].map((row) => row.id),
    )];
    const declaresRequires = TRIPWIRES.filter((row) => Array.isArray(row.requires)).map((row) => row.id);
    expect(convictedBy(legacyReach)).toEqual(['capacity_plateau', 'capacity_floor_thaw']);
    expect(convictedBy(legacyReach).filter((id) => !declaresRequires.includes(id))).toEqual([]);
    // …and blinding BOTH writers at once recovers the TOTALITY the old equality asserted:
    // every row that declares a requirement can be convicted of losing it, none excepted.
    // ⚠ BOTH NESTED KEYS ARE BLINDED, not just one: `capacity_envelope_30y` stands on
    // `motion` and `capacity_realm_load` on `realmDemography`, so a control that removed
    // only one would recover three quarters of the roster and call it a totality.
    const legacyObserver = OBSERVER_SOURCE
      .replace(/\n\s*\.\.\.\(realmDemography \? \{ realmDemography \} : \{\}\),/, '\n')
      .replace(/\n(\s*)motion: \{/, '\n$1motionRenamedForControl: {');
    expect(legacyObserver.length).toBeLessThan(OBSERVER_SOURCE.length);
    // ⭐ EACH BLINDING IS ANCHORED, and the two anchors catch DIFFERENT ways this control
    // could go vacuous. `realmSelfSufficiency` sits one line ABOVE `realmDemography` in the
    // observer's own literal and ships through the same CONDITIONAL SHORTHAND SPREAD branch
    // of the key scanner — the exact branch §909 car 2 found blind — so a scanner that
    // stopped reading spreads reds here rather than reporting a deletion it never made.
    // `motionRenamedForControl` is the renamed twin itself, and it is the ONLY reading that
    // proves the rename matched: the length check above cannot, because the rename LENGTHENS
    // the source and only the deletion shortens it, so a dead rename regex hides behind it.
    expectAbsentWithAnchor(nestedWriterFields(legacyObserver), 'realmDemography',
      'realmSelfSufficiency', 'the blinded observer still ships its spread sibling');
    expectAbsentWithAnchor(nestedWriterFields(legacyObserver), 'motion',
      'motionRenamedForControl', 'the motion rename really matched');
    expect(convictedBy(tripwireFieldReach(TRIPWIRES, legacyWriter, legacyObserver)))
      .toEqual(declaresRequires);

    // ⛔ THE THIRD ROW, REFUSED WITH A MEASUREMENT. A walker that read only `receiptBody`
    // would report `non_finite_ledger_figure` as unreachable too — and it is not:
    // `nonFiniteFigures` is added one statement later, in
    // `const receipt = { ...receiptBody, nonFiniteFigures }`. The false positive is
    // reproduced here on purpose, because a guard that cries wolf gets deleted.
    const bodyOnly = WRITER_SOURCE.slice(0, WRITER_SOURCE.indexOf('const receipt = {'));
    expectAbsentWithAnchor(receiptWriterFields(bodyOnly), 'nonFiniteFigures', 'finalPopulations',
      'the truncated body is still a live key set');
    // ⚠ AND THE FALSE POSITIVE IS NOW ALONE, which is itself the §909 measurement. Before the
    // series landed this list read three ids; the two capacity rows have left it because
    // their fields live INSIDE `receiptBody` and survive the truncation, so the only row the
    // body-only read still slanders is the one whose key really is added a statement later.
    expect([...new Set(tripwireFieldReach(TRIPWIRES, bodyOnly).unreachable.map((row) => row.id))])
      .toEqual(['non_finite_ledger_figure']);
    expect(receiptWriterFields(bodyOnly)).toContain('yearlyPopulations');
    expect(receiptWriterFields(bodyOnly)).toContain('yearlyDiedFlags');
    expect(reach.written).toContain('nonFiniteFigures');

    // ⛔ THE NEGATIVE CONTROL. Without it this arm passes on a walker that reads nothing.
    const planted = [{
      id: 'planted', class: 'deterministic', band: 'b', home: 'a derivation home long enough to pass',
      detect: (receipt) => (receipt?.doesNotExist ? ['fired'] : []),
    }];
    expect(tripwireFieldReach(planted, WRITER_SOURCE).unreachable)
      .toEqual([{ id: 'planted', field: 'doesNotExist' }]);

    // The `for (const field of [...]) … receipt?.[field]` idiom is READ, not skipped —
    // `negative_stock` is built that way and four of its fields would otherwise be invisible.
    expect(tripwireFieldsRead(TRIPWIRES.find((row) => row.id === 'negative_stock')).fields.sort())
      .toEqual(['finalPopulations', 'startPopulations', 'stressorCounts', 'yearlyBytes']);
    // …and a computed read the walker CANNOT resolve is refused rather than passed by
    // default: a row this guard cannot see is not a row this guard has cleared.
    const opaque = tripwireFieldsRead({ detect: (receipt) => [receipt?.[String(Math.random())]] });
    expect(opaque.unreadable).toContain('a computed `receipt[…]` read whose key list is not a literal array');
    expect(tripwireFieldReach([{ id: 'opaque', detect: (receipt) => [receipt?.[String(Math.random())]] }], WRITER_SOURCE)
      .unreadable.map((row) => row.id)).toEqual(['opaque']);
  });

  it('a NESTED requirement is grounded in its own writer, and an ungrounded one is refused rather than passed', () => {
    /**
     * ⛔⛔ THE WEAK ZERO HAD A THIRD FLOOR (§909 car 2). `capacity_realm_load` was never
     * unreachable the way its two siblings were — it keys on `behavioral`, which the soak
     * ships — but the field it actually stands on is one level down:
     * `behavioral.yearly[last].realmDemography`, an ADDITIVE key the OBSERVER ships
     * CONDITIONALLY. On a receipt without it the detector took `if (!reading …) return []`
     * and answered a silent clean. `requires` graded TOP-LEVEL names only, so nothing in the
     * estate could see that. The path is the unit now, and this arm is the proof that both
     * halves of the new machinery — the runtime channel and the walker — can say NO.
     */
    expect(TRIPWIRES.find((row) => row.id === 'capacity_realm_load').requires)
      .toEqual(['behavioral.yearly[last].realmDemography']);

    // ── THE WALKER HALF ──────────────────────────────────────────────────────────────
    // The observer really does ship the leaf, and it ships it as a CONDITIONAL SHORTHAND
    // SPREAD — the form the writer scanner could not see until this car, which is asserted
    // against the observer's own text so a refactor to any other form reds here rather than
    // silently making the path look ungrounded.
    expect(nestedWriterFields(OBSERVER_SOURCE)).toContain('realmDemography');
    expect(OBSERVER_SOURCE).toMatch(/\.\.\.\(realmDemography \? \{ realmDemography \} : \{\}\)/);
    expect(tripwireFieldReach(TRIPWIRES, WRITER_SOURCE, OBSERVER_SOURCE).unreachablePaths).toEqual([]);

    // ⛔ AND THE ZERO IS CAUSED, on the OBSERVER this time. Reconstruct the pre-P4 observer
    // by deleting the one line that ships the key, prove the deletion non-vacuous, and the
    // walker must convict the path at exactly the segment that went missing.
    const legacyObserver = OBSERVER_SOURCE
      .replace(/\n\s*\.\.\.\(realmDemography \? \{ realmDemography \} : \{\}\),/, '\n');
    expect(legacyObserver.length).toBeLessThan(OBSERVER_SOURCE.length);
    // ⭐ ANCHORED on the SPREAD SIBLING one line above it in the observer's own literal
    // (`...(realmSelfSufficiency ? { realmSelfSufficiency } : {})`). It travels the same
    // conditional-shorthand-spread branch of the scanner, so the one drift that would make
    // this absence meaningless — a scanner blind to spreads again, which is precisely the
    // defect car 2's walker extension cured — reds on the anchor instead of reading clean.
    expectAbsentWithAnchor(nestedWriterFields(legacyObserver), 'realmDemography',
      'realmSelfSufficiency', 'the pre-P4 observer still ships its other spread key');
    expect(tripwireFieldReach(TRIPWIRES, WRITER_SOURCE, legacyObserver).unreachablePaths).toEqual([
      {
        id: 'capacity_realm_load',
        path: 'behavioral.yearly[last].realmDemography',
        segment: 'realmDemography',
      },
    ]);

    // ⛔⛔ NO NESTED SOURCE ⇒ UNREADABLE, NEVER A PASS. A walker that graded `behavioral` and
    // shrugged at the rest would report a clean sheet about the exact level where the weak
    // zero lived. This is the arm that keeps the two-argument call from becoming a loophole.
    expect(tripwireFieldReach(TRIPWIRES, WRITER_SOURCE).unreadable).toEqual([
      {
        id: 'capacity_realm_load',
        reason: 'a nested `requires` path (behavioral.yearly[last].realmDemography) and no '
          + 'nested-writer source to ground it in',
      },
      {
        id: 'capacity_envelope_30y',
        reason: 'a nested `requires` path (behavioral.yearly[last].motion) and no '
          + 'nested-writer source to ground it in',
      },
    ]);

    // A first segment the RECEIPT writer never writes is convicted at that segment, so the
    // two levels are graded against the two different sources and not conflated.
    const plantedTop = [{
      id: 'planted', class: 'deterministic', band: 'b', home: 'a derivation home long enough to pass',
      requires: ['noSuchSection.yearly[last].realmDemography'], detect: () => [],
    }];
    expect(tripwireFieldReach(plantedTop, WRITER_SOURCE, OBSERVER_SOURCE).unreachablePaths)
      .toEqual([{ id: 'planted', path: 'noSuchSection.yearly[last].realmDemography', segment: 'noSuchSection' }]);
    const plantedLeaf = [{
      id: 'planted', class: 'deterministic', band: 'b', home: 'a derivation home long enough to pass',
      requires: ['behavioral.yearly[last].noSuchReading'], detect: () => [],
    }];
    expect(tripwireFieldReach(plantedLeaf, WRITER_SOURCE, OBSERVER_SOURCE).unreachablePaths)
      .toEqual([{ id: 'planted', path: 'behavioral.yearly[last].noSuchReading', segment: 'noSuchReading' }]);

    // ── THE RUNTIME HALF ─────────────────────────────────────────────────────────────
    const lit = (over) => clean({ subsystems: { rules: { demographicsEnabled: true } }, ...over });
    const NESTED_REASON = 'requires receipt.behavioral.yearly[last].realmDemography — absent from this receipt';
    const reasonsFor = (receipt, id) => evaluateTripwires(receipt).notExecutable
      .filter((row) => row.id === id).map((row) => row.reason);

    // A LIT receipt whose last observed year carries no realm reading: the row could not
    // run, and now it says so instead of answering [].
    expect(reasonsFor(lit({ behavioral: { yearly: [{ year: 1 }] } }), 'capacity_realm_load'))
      .toEqual([NESTED_REASON]);
    // …and the same for every shape of absence the path can meet on the way down.
    expect(reasonsFor(lit({}), 'capacity_realm_load')).toEqual([NESTED_REASON]);
    expect(reasonsFor(lit({ behavioral: { yearly: [] } }), 'capacity_realm_load')).toEqual([NESTED_REASON]);
    expect(reasonsFor(lit({ behavioral: { yearly: null } }), 'capacity_realm_load')).toEqual([NESTED_REASON]);
    expect(reasonsFor(lit({ behavioral: { yearly: [{ realmDemography: null }] } }), 'capacity_realm_load'))
      .toEqual([NESTED_REASON]);

    // ⭐ `[last]` MEANS THE LAST ROW AND NOT ANY ROW, which is what the detector reads. A
    // series whose EARLIER years carry the reading and whose final year does not measured
    // nothing about the horizon it is asked about.
    const reading = { loadRatio01: 0.8, binding: { granary: 2, walls: 2 } };
    expect(reasonsFor(lit({ behavioral: { yearly: [{ realmDemography: reading }, { year: 2 }] } }), 'capacity_realm_load'))
      .toEqual([NESTED_REASON]);
    // …and PRESENT on the last row, the row executes: the third channel is empty for it and
    // the band is what speaks. Without this half the arm proves only that the row can refuse.
    const carried = lit({ behavioral: { yearly: [{ year: 1 }, { realmDemography: reading }] } });
    expect(reasonsFor(carried, 'capacity_realm_load')).toEqual([]);
    expect(evaluateTripwires(carried).findings.map((row) => row.id)).toEqual([]);
    expect(evaluateTripwires(lit({
      behavioral: { yearly: [{ realmDemography: { loadRatio01: 0.2, binding: { granary: 2, walls: 2 } } }] },
    })).findings.map((row) => row.id)).toEqual(['capacity_realm_load']);

    // ⛔ A DARK CELL IS STILL NOT A BLIND ONE. `gate` is read BEFORE `requires`, so a receipt
    // that legitimately ran the term dark lists nothing at all — the re-grade this car
    // performs reaches LIT receipts only, and that boundary is machinery, not a promise.
    expect(evaluateTripwires(clean({ subsystems: { rules: { demographicsEnabled: false } } })).notExecutable)
      .toEqual([]);

    // ── AND A MALFORMED PATH IS A REGISTRY DEFECT, NOT A PERMANENT INSTRUMENT GAP ─────
    // `receiptCarries` answers false for a path it cannot parse, so an unconvicted typo
    // would make its row NOT-EXECUTABLE on every receipt for ever and read exactly like an
    // honest gap. The scan names it instead.
    const malformed = (path) => tripwireRegistryDefects([{
      id: 'planted', class: 'deterministic', band: 'b', home: 'a derivation home long enough to pass',
      requires: [path], detect: () => [],
    }]);
    expect(malformed('behavioral..yearly')).toEqual([
      'planted: requires path "behavioral..yearly" is not a dotted field path (name, or name[last])',
    ]);
    expect(malformed('behavioral.yearly[0].realmDemography')).toHaveLength(1);
    expect(malformed('behavioral.yearly[last] .realmDemography')).toHaveLength(1);
    // …and the two live spellings are NOT convicted, so the scan is a rule and not a wall.
    expect(malformed('yearlyPopulations')).toEqual([]);
    expect(malformed('behavioral.yearly[last].realmDemography')).toEqual([]);
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

  it('capacity_envelope_30y is ARMED on ONE spelling of its bar, and it can both convict and be satisfied', () => {
    /**
     * ⭐⭐ THE FOURTH DESIGNED ROW, ARMED AT §909 CAR 3. It shipped unarmed on two recorded
     * grounds and only the second was true — the first said the `motion` block "does not
     * exist" and the block has been on every yearly row since 2026-07-28. The true ground
     * was that its bar's ONE home was an unimportable test file, so this arm's FIRST job is
     * to prove the lift actually collapsed the spellings rather than adding a third.
     */
    const row = TRIPWIRES.find((entry) => entry.id === 'capacity_envelope_30y');
    expect(row.class).toBe('deterministic');
    expect(String(row.home)).toContain('demographicsEnvelope');

    // ── ONE SPELLING, CHECKED IN THE TREE ────────────────────────────────────────────
    // The band STRING is built from the imported constants, so a bar that moved in
    // soakInvariants.mjs moves this text with it and cannot be silently out of date.
    expect(row.band).toContain(String(MOVING_SHARE_FLOOR));
    expect(row.band).toContain(String(MOTION_FLOOR_01));
    expect(row.band).toContain(String(CAMPAIGN_HORIZON_YEARS));
    // …and BOTH former homes now import rather than re-type. The motion floor is the
    // unambiguous witness — `0.05` also spells `capacity_plateau`'s unrelated tolerance, so
    // scanning for it would convict a coincidence.
    // ⭐ ANCHORED on the IDENTIFIER THAT REPLACED THE LITERAL. A bare "no `0.0025` here" is
    // true of a file that went missing, of a path that never resolved, and of a
    // comment-stripper that ate the code along with the comments — three ways to certify a
    // one-spelling lift nobody read. `MOTION_FLOOR_01` survives `codeOnly` in both sources
    // (it is live code, not prose), so each absence now stands on a source proved readable.
    expectAbsentWithAnchor(codeOnly(OBSERVER_SOURCE), '0.0025', 'MOTION_FLOOR_01',
      'the observer was really read, comments stripped');
    expectAbsentWithAnchor(codeOnly(ENVELOPE_SUITE_SOURCE), '0.0025', 'MOTION_FLOOR_01',
      'the envelope suite was really read, comments stripped');
    expect(OBSERVER_SOURCE).toContain("import { MOTION_FLOOR_01 } from './soakInvariants.mjs'");
    expect(ENVELOPE_SUITE_SOURCE).toContain("from '../../scripts/audit/soakInvariants.mjs'");
    expect(codeOnly(ENVELOPE_SUITE_SOURCE)).toContain('MOVING_SHARE_FLOOR');
    // ⚠ AND THE OBSERVER STILL COUNTS AT THAT BAR — the import would be decoration if the
    // comparison had drifted to another figure.
    expect(OBSERVER_SOURCE).toMatch(/Math\.max\(1, beforePopulation\) >= MOTION_FLOOR_01/);

    // ── THE ROW ITSELF ───────────────────────────────────────────────────────────────
    const lit = (over) => clean({ subsystems: { rules: { demographicsEnabled: true } }, ...over });
    /** `years` yearly rows, four settlements each, `movedPerYear` of which moved. */
    const motion = (years, movedPerYear) => ({
      behavioral: {
        yearly: Array.from({ length: years }, (_, y) => ({
          year: y + 1,
          motion: { populationTransitions: 4, populationMoved: movedPerYear },
        })),
      },
    });
    const firedRows = (receipt) => evaluateTripwires(receipt).findings.map((entry) => entry.id);
    const envelopeRows = (receipt) => evaluateTripwires(receipt).notExecutable
      .filter((entry) => entry.id === 'capacity_envelope_30y').map((entry) => entry.reason);

    // A FROZEN CAMPAIGN: nothing moves for thirty years. Convicted, with the arithmetic on
    // its face — this is the finding the row exists to make.
    const frozen = lit(motion(CAMPAIGN_HORIZON_YEARS, 0));
    expect(firedRows(frozen)).toEqual(['capacity_envelope_30y']);
    expect(evaluateTripwires(frozen).findings[0].detail)
      .toContain(`only 0 of 120 settlement-year transitions moved the head count over the first ${CAMPAIGN_HORIZON_YEARS} years`);
    // …and the PASSING CORNER, without which the plant above proves only that it can fire.
    // One settlement in four moving every year is 0.25, five times the bar.
    expect(firedRows(lit(motion(CAMPAIGN_HORIZON_YEARS, 1)))).toEqual([]);
    // The bar is a real edge: 4 of 120 is 0.0333 and convicts, 6 of 120 is 0.05 and does not.
    const uneven = (movedTotal) => lit({
      behavioral: {
        yearly: Array.from({ length: CAMPAIGN_HORIZON_YEARS }, (_, y) => ({
          year: y + 1,
          motion: { populationTransitions: 4, populationMoved: y < movedTotal ? 1 : 0 },
        })),
      },
    });
    expect(firedRows(uneven(4))).toEqual(['capacity_envelope_30y']);
    expect(firedRows(uneven(6))).toEqual([]);

    // ⛔ BELOW THE HORIZON IT DID NOT MEASURE, and that silence is neither a pass nor a
    // finding: the row grades a thirty-year window and a shorter run has none.
    expect(firedRows(lit(motion(CAMPAIGN_HORIZON_YEARS - 1, 0)))).toEqual([]);
    expect(envelopeRows(lit(motion(CAMPAIGN_HORIZON_YEARS - 1, 0)))).toEqual([]);

    // ⛔⛔ A ZERO DENOMINATOR IS NAMED, NOT ANSWERED WITH `[]`. `moved / 0` would be the exact
    // weak zero this lane exists to close, arriving through an arithmetic guard.
    expect(firedRows(lit({
      behavioral: {
        yearly: Array.from({ length: CAMPAIGN_HORIZON_YEARS }, (_, y) => ({
          year: y + 1, motion: { populationTransitions: 0, populationMoved: 0 },
        })),
      },
    }))).toEqual(['capacity_envelope_30y']);

    // ⛔ NO `motion` BLOCK AT ALL is a pre-2026-07-28 receipt, and its silence grades
    // NOT-EXECUTABLE with the path on its face rather than clean.
    expect(envelopeRows(lit({ behavioral: { yearly: [{ year: 1 }] } })))
      .toEqual(['requires receipt.behavioral.yearly[last].motion — absent from this receipt']);

    // ⛔ AND THE DARK TWIN IS NOT APPLICABLE. The bar's derivation home runs the DEMOGRAPHIC
    // kernel, so grading a world whose head counts move by another term would be a category
    // error. Measured on a real dark 30-year receipt the share is 0.70 — well above the bar
    // — so the gate costs no finding; it costs a claim the row is not entitled to make.
    expect(firedRows(clean(motion(CAMPAIGN_HORIZON_YEARS, 0)))).toEqual([]);
    expect(envelopeRows(clean(motion(CAMPAIGN_HORIZON_YEARS, 0)))).toEqual([]);
  });
});
