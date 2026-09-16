/**
 * soakInvariants.test.js — SOAKCHAIN Car 0's proof surface (DESIGN_HORIZON §1.6, §4.5).
 *
 * THE ARM THAT MATTERS IS THE PLANT, BOTH WAYS. A liveness floor that only ever sees
 * healthy worlds cannot be distinguished from a floor that grades nothing at all, so every
 * verdict below is exercised on a world that must convict AND on one that must not. The
 * `frozen` plant is the exact shape `whole-world-soak.mjs:886-896` prints as a FINDING and
 * consumes nowhere: a world whose composite hash stops changing.
 *
 * The measured series pinned here come from Car 0's MEASUREMENT half (ledger §882.12,
 * receipt `laneG0SOAK-receipt.md`, nine runs all exit 0) and are re-measurements, not
 * inheritances — the module header carries their four figures.
 */

import { describe, expect, test } from 'vitest';

import {
  CAMPAIGN_HORIZON_YEARS,
  LIVENESS_CHECK_TITLE,
  LIVENESS_FAILURE_KINDS,
  LIVENESS_FLOOR,
  MOTION_FLOOR_01,
  MOVING_SHARE_FLOOR,
  POPULATION_ENVELOPE,
  WALL_TIME_TREND,
  YEARLY_BYTES_PER_SETTLEMENT_CEILING,
  foldDecades,
  livenessVerdict,
  nonFinitePaths,
  populationEnvelopeVerdict,
  wallTimeTrendVerdict,
  yearlyBytesVerdict,
} from '../../scripts/audit/soakInvariants.mjs';
// ⭐ THE CERTIFICATION SIDE'S OWN SPELLING OF THE CAMPAIGN HORIZON, imported so the twin is
// ASSERTED rather than described. `soakScriptSeams.test.js` already reaches into `src/` from
// this directory, so the reach is precedent and not a new seam.
import { CERTIFICATION_HORIZONS } from '../../src/domain/certification/behavioralContract.js';

/** Ten years of a living world: fresh types every year and a moving composite. */
function livingYears(years = 10) {
  const counts = [];
  const hashes = [];
  const majors = [];
  for (let year = 1; year <= years; year += 1) {
    const yearCounts = {};
    for (let n = 0; n < 12; n += 1) yearCounts[`type_${(year * 12) + n}`] = 3;
    counts.push(yearCounts);
    hashes.push(`hash-${year}`);
    majors.push(4);
  }
  return { counts, hashes, majors };
}

/** A DecadeLivenessRow built from measured figures, so a pin reads as the table it is. */
function measuredRow(decade, distinctTypes, events, majors, settlements = 4) {
  return {
    decade,
    firstYear: ((decade - 1) * 10) + 1,
    lastYear: decade * 10,
    years: 10,
    distinctTypes,
    events,
    eventsPerSettlement: events / settlements,
    majors,
    hashMoves: 10,
  };
}

/**
 * ⭐ THE LIT CENTURY, MEASURED. `century-a` with `demographicsEnabled: true` applied through
 * `composeSoakRules`'s overlay, ten decades, from `laneG0SOAK-receipt.md` §4. The major
 * stream dies at year 13 and returns for exactly one event at year 23.
 */
const LIT_CENTURY_DECADES = [
  measuredRow(1, 54, 2686, 168),
  measuredRow(2, 66, 2270, 27),
  measuredRow(3, 28, 1942, 1),
  measuredRow(4, 29, 1972, 0),
  measuredRow(5, 41, 2121, 0),
  measuredRow(6, 36, 2034, 0),
  measuredRow(7, 32, 2291, 0),
  measuredRow(8, 29, 2153, 0),
  measuredRow(9, 29, 2198, 0),
  measuredRow(10, 31, 2293, 0),
];

/** `century-a` SHIPPED, the same ten decades on the same fixture without the overlay. */
const SHIPPED_CENTURY_DECADES = [
  measuredRow(1, 52, 2587, 171),
  measuredRow(2, 34, 2442, 50),
  measuredRow(3, 43, 2248, 33),
  measuredRow(4, 42, 2427, 34),
  measuredRow(5, 39, 2173, 31),
  measuredRow(6, 21, 1898, 32),
  measuredRow(7, 21, 1831, 31),
  measuredRow(8, 32, 1951, 36),
  measuredRow(9, 40, 2001, 36),
  measuredRow(10, 29, 2031, 20),
];

describe('the soak invariants — one home per threshold', () => {
  test('every threshold this module owns is spelled exactly once, with the value the tree already carried', () => {
    expect(POPULATION_ENVELOPE).toEqual({ min: 0.05, max: 20 });
    expect(YEARLY_BYTES_PER_SETTLEMENT_CEILING).toBe(900_000);
    expect(WALL_TIME_TREND).toEqual({ factor: 8, slackMs: 50, sampleFloorYears: 4 });
    // The two inherited bands are the soak's own literals, unchanged: `900_000 * SETTLEMENTS`
    // at whole-world-soak.mjs:862 and `q4 <= q1 * 8 + 50` at :870. The sample floor is the
    // only NEW figure, and it is a precondition rather than a band.
    expect(LIVENESS_FAILURE_KINDS).toEqual(['silent', 'monoculture', 'frozen']);
    expect(LIVENESS_CHECK_TITLE).toBe(
      'the world keeps moving: every decade carries distinct typed events and the composite state changes every year',
    );
  }, 20_000);

  test('the three §909 lifted bars hold their values, and the campaign horizon cannot drift from its certification twin', () => {
    /**
     * ⛔⛔ THE LIFT MOVED A SPELLING; IT DID NOT REMOVE ONE (§909 car 5, on a skeptic's
     * count). `CAMPAIGN_HORIZON_YEARS` was two definitions before the lift and is two after
     * — this module and `CERTIFICATION_HORIZONS.useful.years` — and NOTHING in the estate
     * reddened when they drifted. The lift is ratified because the envelope suite stopped
     * TYPING the figure, and this arm is the guard the ratification was conditional on.
     */
    expect(CAMPAIGN_HORIZON_YEARS).toBe(CERTIFICATION_HORIZONS.useful.years);
    // …and the twin is a real reading, not an undefined that would make the equality vacuous
    // on both sides. A `useful` horizon that stopped existing must red here, not pass.
    expect(typeof CERTIFICATION_HORIZONS.useful.years).toBe('number');
    expect(CERTIFICATION_HORIZONS.useful.years).toBeGreaterThan(0);

    // ── THE THREE LIFTED VALUES, PINNED AS CONTROLS READ FROM THE MODULE ─────────────
    // A tuning value that moves without a declared cause is the estate's STATE-NEVER-FATE
    // clause; these three are read here so the move reds in a test rather than arriving as a
    // quiet re-grade of `capacity_envelope_30y` and the envelope suite at once.
    expect(CAMPAIGN_HORIZON_YEARS).toBe(30);
    expect(MOVING_SHARE_FLOOR).toBe(0.05);
    expect(MOTION_FLOOR_01).toBe(0.0025);
    // The two floors are shares of a whole, so a value outside (0, 1] is not a tightening —
    // it is a bar that cannot be met or cannot be missed.
    for (const bar of [MOVING_SHARE_FLOOR, MOTION_FLOOR_01]) {
      expect(bar).toBeGreaterThan(0);
      expect(bar).toBeLessThanOrEqual(1);
    }
  }, 20_000);

  test('the liveness floor carries Car 0 measured literal and its hard minimum stays inert', () => {
    expect(LIVENESS_FLOOR).toEqual({
      decadeYears: 10,
      sampleFloorYears: 10,
      minHashMovesPerDecade: 10,
      minEventsPerSettlementDecade: 1,
      minDistinctTypesPerDecade: 10,
    });
    // LITERAL 2, re-derived here rather than typed in: `max(6, floor(0.5 x 20))` over the
    // 43 measured decades whose minimum was 20 (`century-b` decade 6).
    const measuredMinimum = 20;
    expect(Math.max(6, Math.floor(0.5 * measuredMinimum))).toBe(LIVENESS_FLOOR.minDistinctTypesPerDecade);
    // And the `max(6, ...)` guard is INERT at this evidence: the measured term wins.
    expect(Math.floor(0.5 * measuredMinimum) > 6).toBe(true);
  }, 20_000);

  test('nonFinitePaths finds a planted NaN by its dotted path and stays empty on clean input', () => {
    expect(nonFinitePaths({ a: { b: [1, Number.NaN, 3] } })).toEqual(['$.a.b[1] = NaN']);
    expect(nonFinitePaths({ a: { b: [1, Number.POSITIVE_INFINITY] } })).toEqual(['$.a.b[1] = Infinity']);
    expect(nonFinitePaths({ a: 1, b: [2, 3], c: 'text' })).toEqual([]);
    expect(nonFinitePaths(null)).toEqual([]);
    expect(nonFinitePaths(undefined)).toEqual([]);
    // A cycle terminates rather than overflowing: the soak scans live threaded state.
    const cyclic = { value: 1 };
    cyclic.self = cyclic;
    expect(nonFinitePaths(cyclic)).toEqual([]);
  }, 20_000);

  test('the population envelope boundaries are EXCLUSIVE and a zero start is not executable', () => {
    expect(populationEnvelopeVerdict({ startTotal: 100, finalTotal: 500 }).passed).toBe(true);
    // Exactly ON either boundary fails, which is what `ratio > 0.05 && ratio < 20` means.
    expect(populationEnvelopeVerdict({ startTotal: 100, finalTotal: 2000 }).passed).toBe(false);
    expect(populationEnvelopeVerdict({ startTotal: 100, finalTotal: 5 }).passed).toBe(false);
    expect(populationEnvelopeVerdict({ startTotal: 100, finalTotal: 1999 }).passed).toBe(true);
    expect(populationEnvelopeVerdict({ startTotal: 100, finalTotal: 6 }).passed).toBe(true);
    const empty = populationEnvelopeVerdict({ startTotal: 0, finalTotal: 0 });
    expect(empty.executable).toBe(false);
    expect(empty.ratio).toBe(null);
    // The measured SHIPPED century's realm ratio, which the soak's own check reports.
    expect(populationEnvelopeVerdict({ startTotal: 17682, finalTotal: 6067 }).detail)
      .toBe('17682 -> 6067 (x0.34; envelope 0.05-20)');
  }, 20_000);

  test('the byte envelope verdict inherits the ceiling verbatim and fires only at or past it', () => {
    const ceiling = YEARLY_BYTES_PER_SETTLEMENT_CEILING * 4;
    expect(yearlyBytesVerdict({ yearlyBytes: [1, 2, ceiling - 1], settlements: 4 }).passed).toBe(true);
    expect(yearlyBytesVerdict({ yearlyBytes: [1, 2, ceiling], settlements: 4 }).passed).toBe(false);
    expect(yearlyBytesVerdict({ yearlyBytes: [], settlements: 4 }).executable).toBe(false);
    expect(yearlyBytesVerdict({ yearlyBytes: [1], settlements: 0 }).executable).toBe(false);
    // The measured LIT century's worst year against the four-settlement ceiling.
    const measured = yearlyBytesVerdict({ yearlyBytes: [1_075_435], settlements: 4 });
    expect(measured.passed).toBe(true);
    expect(measured.ceiling).toBe(3_600_000);
  }, 20_000);

  test('the wall-time trend is NOT-EXECUTABLE below its sample floor, and the tree defect is executed', () => {
    // ⛔ THE DEFECT ITSELF, RUN. These are the D2bR probe receipt three rows. Under the
    // tree's own `q4 <= q1 * 8 + 50` the Q1 slice is EMPTY, its mean is 0, and the row
    // reads `Q1 0.0ms -> Q4 11703.0ms` and FAILS a run whose every world assertion passed.
    const threeYears = wallTimeTrendVerdict([15185, 15028, 11703]);
    expect(threeYears.executable).toBe(false);
    expect(threeYears.passed).toBe(true);
    expect(threeYears.q1).toBe(null);
    // The counterfactual: the SAME comparison without the floor convicts this healthy run.
    const bareQ1 = 0;
    expect(11703 <= (bareQ1 * WALL_TIME_TREND.factor) + WALL_TIME_TREND.slackMs).toBe(false);
    // At the floor it executes, and the measured 30-year soak's own quartiles pass.
    const measured = wallTimeTrendVerdict([2193.9, 2100, 2000, 1870.9]);
    expect(measured.executable).toBe(true);
    expect(measured.passed).toBe(true);
    // A genuine blowout still convicts, so the floor silenced a precondition, not the band.
    expect(wallTimeTrendVerdict([10, 10, 10, 10, 10, 10, 10, 100_000]).passed).toBe(false);
  }, 20_000);
});

describe('the one decade fold and the liveness verdict', () => {
  test('the fold takes the UNION of typed keys, grades FULL decades only, and reports the tail', () => {
    const { counts, hashes, majors } = livingYears(23);
    const folded = foldDecades({
      yearlyEventTypeCounts: counts,
      yearlyHashes: hashes,
      yearlyMajorCounts: majors,
      settlements: 4,
    });
    expect(folded.rows).toHaveLength(2);
    expect(folded.partialTailYears).toBe(3);
    expect(folded.rows[0]).toMatchObject({
      decade: 1, firstYear: 1, lastYear: 10, years: 10, distinctTypes: 120, events: 360,
    });
    expect(folded.rows[0].eventsPerSettlement).toBe(90);
    expect(folded.rows[1]).toMatchObject({ decade: 2, firstYear: 11, lastYear: 20 });
    // A UNION, never a sum: ten years each repeating the SAME twelve types is 12 distinct.
    const repeated = foldDecades({
      yearlyEventTypeCounts: Array.from({ length: 10 }, () => ({ a: 1, b: 2 })),
      yearlyHashes: hashes.slice(0, 10),
      settlements: 4,
    });
    expect(repeated.rows[0].distinctTypes).toBe(2);
    expect(repeated.rows[0].events).toBe(30);
  }, 20_000);

  test('hashMoves counts the first year of the series as a move and a repeat as a stall', () => {
    const counts = livingYears(10).counts;
    const moving = foldDecades({
      yearlyEventTypeCounts: counts,
      yearlyHashes: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
      settlements: 4,
    });
    expect(moving.rows[0].hashMoves).toBe(10);
    // The first year has no predecessor to be equal to; counting it as a non-move would
    // convict every world of one frozen year it never had.
    const stalledAfterThree = foldDecades({
      yearlyEventTypeCounts: counts,
      yearlyHashes: ['a', 'b', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
      settlements: 4,
    });
    expect(stalledAfterThree.rows[0].hashMoves).toBe(3);
  }, 20_000);

  test('a healthy decade series passes the floor with an empty failure list', () => {
    const { counts, hashes, majors } = livingYears(30);
    const verdict = livenessVerdict(
      foldDecades({ yearlyEventTypeCounts: counts, yearlyHashes: hashes, yearlyMajorCounts: majors, settlements: 4 }),
      { years: 30, settlements: 4 },
    );
    expect(verdict.executable).toBe(true);
    expect(verdict.failures).toEqual([]);
    expect(verdict.passed).toBe(true);
    expect(verdict.rows).toHaveLength(3);
    // The measured SHIPPED century passes on its own figures, which is what makes the
    // plants below evidence about worlds rather than evidence about an empty grader.
    const shipped = livenessVerdict(
      { rows: SHIPPED_CENTURY_DECADES, partialTailYears: 0 },
      { years: 100, settlements: 4 },
    );
    expect(shipped.failures).toEqual([]);
    expect(shipped.reported.minDistinctTypesPerDecade).toBe(21);
  }, 20_000);

  test('MONOCULTURE — one typed event per year convicts the decade and names its floor', () => {
    const verdict = livenessVerdict(
      foldDecades({
        yearlyEventTypeCounts: Array.from({ length: 10 }, () => ({ only_one_type: 40 })),
        yearlyHashes: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        settlements: 4,
      }),
      { years: 10, settlements: 4 },
    );
    expect(verdict.executable).toBe(true);
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((row) => row.kind)).toEqual(['monoculture']);
    expect(verdict.failures[0]).toMatchObject({
      decade: 1, figure: 'distinctTypes', measured: 1, floor: 10,
    });
    expect(verdict.failures[0].detail).toBe(
      'decade 1 (years 1-10) carried 1 distinct typed events, under the floor of 10',
    );
  }, 20_000);

  test('FROZEN — identical composite hashes convict the decade the soak only ever printed about', () => {
    const { counts } = livingYears(10);
    const verdict = livenessVerdict(
      foldDecades({
        yearlyEventTypeCounts: counts,
        yearlyHashes: Array.from({ length: 10 }, () => 'the-same-hash'),
        settlements: 4,
      }),
      { years: 10, settlements: 4 },
    );
    expect(verdict.failures.map((row) => row.kind)).toEqual(['frozen']);
    expect(verdict.failures[0]).toMatchObject({ figure: 'hashMoves', measured: 1, floor: 10 });
    expect(verdict.failures[0].detail).toBe(
      'decade 1 (years 1-10) moved the composite state in 1 of 10 years, under the floor of 10',
    );
  }, 20_000);

  test('SILENT — a zero-event settlement-decade convicts on the events floor', () => {
    const verdict = livenessVerdict(
      foldDecades({
        yearlyEventTypeCounts: Array.from({ length: 10 }, () => ({})),
        yearlyHashes: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        settlements: 4,
      }),
      { years: 10, settlements: 4 },
    );
    // A world with no typed events at all is silent AND monocultural; both are true and
    // both are reported, because collapsing them would hide one of the two shapes.
    expect(verdict.failures.map((row) => row.kind)).toEqual(['silent', 'monoculture']);
    expect(verdict.failures[0]).toMatchObject({ figure: 'eventsPerSettlement', measured: 0, floor: 1 });
    expect(verdict.failures[0].detail).toBe(
      'decade 1 (years 1-10) carried 0 typed events per settlement, under the floor of 1',
    );
  }, 20_000);

  test('below one FULL decade the verdict is NOT-EXECUTABLE and says so positively', () => {
    const { counts, hashes, majors } = livingYears(9);
    const verdict = livenessVerdict(
      foldDecades({ yearlyEventTypeCounts: counts, yearlyHashes: hashes, yearlyMajorCounts: majors, settlements: 4 }),
      { years: 9, settlements: 4 },
    );
    expect(verdict.executable).toBe(false);
    expect(verdict.rows).toEqual([]);
    expect(verdict.failures).toEqual([]);
    // ⛔ NOT A SOFTENED PASS: the reason is on the receipt, so silence and a claim read
    // differently (§206.2b's third status).
    expect(verdict.reason).toBe(
      'a liveness floor needs one FULL decade: 9 year(s) against a sample floor of 10, 0 full decade(s) folded',
    );
    // The D2bR three-year receipt: the same status, for the same reason.
    expect(livenessVerdict({ rows: [], partialTailYears: 3 }, { years: 3, settlements: 4 }).executable).toBe(false);
  }, 20_000);

  test('⛔ THE GAP, EXECUTED — the LIT century dead major stream PASSES the floor and is REPORTED', () => {
    const verdict = livenessVerdict(
      { rows: LIT_CENTURY_DECADES, partialTailYears: 0 },
      { years: 100, settlements: 4 },
    );
    // The floor as §1.6 specifies it passes a world whose major-event stream has been dead
    // for 78 of 100 years. That is not a bug in this test — it is the finding, and it is
    // pinned here so whoever adds a `minMajorsPerDecade` band sees exactly what changes.
    expect(verdict.executable).toBe(true);
    expect(verdict.failures).toEqual([]);
    expect(verdict.passed).toBe(true);
    // ⭐ AND THE AXIS IS MEASURED ANYWAY, so the gap is VISIBLE rather than implied.
    expect(verdict.reported.majorSilentDecades).toBe(7);
    expect(verdict.reported.majorSilentDecadeNumbers).toEqual([4, 5, 6, 7, 8, 9, 10]);
    expect(verdict.reported.minMajorsPerDecade).toBe(0);
    // The SHIPPED century over the SAME fixture keeps 20-36 majors a decade throughout, so
    // this is specific to the lit demographics and not a property of the fixture.
    const shipped = livenessVerdict({ rows: SHIPPED_CENTURY_DECADES, partialTailYears: 0 }, { years: 100, settlements: 4 });
    expect(shipped.reported.majorSilentDecades).toBe(0);
    expect(shipped.reported.minMajorsPerDecade).toBe(20);
  }, 20_000);

  test('every failure names its decade, its kind, its figure and the floor it fell under', () => {
    const verdict = livenessVerdict(
      foldDecades({
        yearlyEventTypeCounts: Array.from({ length: 20 }, () => ({ one: 1 })),
        yearlyHashes: Array.from({ length: 20 }, () => 'still'),
        settlements: 4,
      }),
      { years: 20, settlements: 4 },
    );
    expect(verdict.failures).toHaveLength(4);
    for (const failure of verdict.failures) {
      expect(LIVENESS_FAILURE_KINDS).toContain(failure.kind);
      expect(typeof failure.decade).toBe('number');
      expect(typeof failure.figure).toBe('string');
      expect(typeof failure.floor).toBe('number');
      expect(String(failure.detail).length).toBeGreaterThan(40);
    }
    // Decade 2 is graded on its own terms, not folded into decade 1's verdict.
    expect(verdict.failures.map((row) => `${row.decade}:${row.kind}`))
      .toEqual(['1:monoculture', '1:frozen', '2:monoculture', '2:frozen']);
  }, 20_000);

  test('the fold and the verdict are TOTAL — an empty or malformed receipt yields a verdict, never a throw', () => {
    expect(foldDecades({ yearlyEventTypeCounts: [], yearlyHashes: [], settlements: 4 }))
      .toEqual({ rows: [], partialTailYears: 0 });
    expect(foldDecades({ settlements: 0 })).toEqual({ rows: [], partialTailYears: 0 });
    expect(livenessVerdict([], {}).executable).toBe(false);
    expect(livenessVerdict({}, {}).executable).toBe(false);
    expect(populationEnvelopeVerdict({}).executable).toBe(false);
    expect(wallTimeTrendVerdict(null).executable).toBe(false);
    expect(yearlyBytesVerdict({}).executable).toBe(false);
    // A run that could not measure something is not a run that measured zero.
    expect(livenessVerdict([], {}).reported.majorSilentDecades).toBe(0);
  }, 20_000);
});
