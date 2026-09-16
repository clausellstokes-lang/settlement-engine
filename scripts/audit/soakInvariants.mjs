/**
 * soakInvariants.mjs — THE ONE HOME OF THE SOAK'S INVARIANTS (SOAKCHAIN Car 0; DESIGN_HORIZON §1.6).
 *
 * PURE, AND ON THE FINGERPRINTED SIDE OF THE WALL. This file lives under `scripts/audit`,
 * which is inside `REALM_SCALE_SOURCE_PATHS`, so adding it MOVES the certification
 * aggregate's `sourceFingerprint`. That is DECLARED (§4.7 R5), and it costs nothing in
 * practice because no realm-scale receipt is committed anywhere in the tree.
 *
 * WHY IT EXISTS. Three thresholds were spelled twice and one verdict was computed nowhere:
 *   - the 900 KB/settlement byte envelope lived in `whole-world-soak.mjs:862` AND in
 *     `scripts/soak/tripwires.mjs`, each with its own literal;
 *   - the 0.05/20 population envelope lived only as two inline numbers at `:842`;
 *   - the wall-time trend `q4 <= q1 * 8 + 50` lived in both, with NO SAMPLE FLOOR — at
 *     three years `meanOf(ms, 0, 0.25)` averages an EMPTY slice and returns 0, so the row
 *     read `Q1 0.0ms -> Q4 11703.0ms` and FAILED a run whose every world assertion passed
 *     (measured on the D2bR probe receipt, `passed: false, properties: []`);
 *   - and the LIVENESS floor did not exist at all. `whole-world-soak.mjs:886-896` computes
 *     `frozenTail` and PRINTS it as a finding nothing consumes, so a world whose composite
 *     hash stops changing at year 5 passes every assertion the estate owns.
 * ONE spelling of every threshold, one fold, three readers (the watchdog's `check()`, the
 * `liveness_floor` registry row, and Tier 1's century leg).
 *
 * ⛔ THE ONE DECADE FOLD. `foldDecades` is the estate's only liveness fold. READERREVIEW's
 * manifest `liveness[]` is `DecadeLivenessRow[]` BY IMPORT of this function; a second
 * reference implementation over `result.selected[].candidateType` is RETIRED (§13).
 *
 * ── THE THREE LITERALS CAR 0's MEASUREMENT HALF WAS SENT TO PRINT, AND THE FOUR FIGURES
 *    BEHIND THEM (ledger §882.12; receipt `laneG0SOAK-receipt.md`, nine runs all exit 0) ──
 *
 *   F1  median ms/year of the Tier-1 hand fixture, `century-a` SHIPPED, 10 y x 3 runs
 *         = 435.5 ms (cold run 447; per-run 447 / 435.5 / 422)
 *   F2  min `distinctTypes` per decade over EVERY measured decade — 43 decades across five
 *         series (the real 30y x 4s soak, `century-a` SHIPPED and LIT, `century-b` and
 *         `century-c` SHIPPED) = 20, at `century-b` decade 6
 *   F3  max `population / effectiveBoundOf(...).bound` over the LIT century, all 100 years
 *         x 4 settlements = 3.5741, at `leg-c` year 15 (population 386 against bound 108)
 *   F4  the 30y x 4s real soak: 139.39 s wall, `peakHeapUsedBytes` 418,070,280 B,
 *         RSS 1,084,817,408 B, `passed: true`, `failures: []`, `frozenTail: false`
 *
 *   LITERAL 1 — the Tier-1 SEED COUNT: `SEEDS = ['century-a', 'century-b']`, TWO. Measured
 *     compositions of the 360 s file budget: 1 seed 162.7 s (45.2 %), 2 seeds 222.5 s
 *     (61.8 %), 3 seeds 279.9 s (77.8 %). Three FIT this dev box, but §4.5 binds the count
 *     to the CI budget and the addition is cumulative with two sibling lanes inside the ONE
 *     30-minute `check-tests` job; two seeds leave 1.62x of machine-speed margin against
 *     three seeds' 1.29x. The literal lives in `tests/simulation/centuryLegSoak.test.js`.
 *   LITERAL 2 — `minDistinctTypesPerDecade: 10` = `max(6, floor(0.5 x F2))` = `max(6, 10)`.
 *     43 decades measured, none below 20, so the hard minimum 6 is INERT at this evidence
 *     and stays as the guard it is. ⚠ The figure is FIXTURE-DEPENDENT — re-derive it, never
 *     inherit it, if the Tier-1 fixture changes shape (the generated realm's leanest decade
 *     is 26 against the hand fixture's 20, a 30 % spread).
 *   LITERAL 3 — the LIT bound allowance: ⛔ REFUSED, AND DELIBERATELY ABSENT FROM THIS FILE.
 *     §4.1's rule is "tighten toward the measured max, never loosen past 1.5"; the measured
 *     max is F3 = 3.5741x, so every value the rule admits is BELOW the measurement and would
 *     land Car 3's arm red on a healthy world. The cause is the DENOMINATOR, not an
 *     overshoot: `densityCeilingOf` fell 720 -> 108 in ONE year on a tier demotion (hamlet
 *     600 x riverside 1.20 = 720; thorp 90 x 1.20 = 108) while the population FELL 277 ->
 *     221, and `effectiveBoundOf` is `min(K_food, D_tier)`. §14 E11 is REFUTED. The reshape
 *     — `population(y) <= 1.5 x max(bound(y), bound(y-1))`, plus a second row on
 *     `foodCapacityOf(...).mouths` alone (which moved only 394 -> 383 -> 391, a 3 % band,
 *     across the same span) — belongs to CAPACITY's author, is routed there by §4.7 R3, and
 *     is NOT invented here. No bound-allowance constant exists in this module by design.
 *
 * ⛔⛔ WHAT THIS FLOOR CANNOT SEE, STATED WHERE THE FLOOR LIVES. The LIT century's
 *   major-event stream is ZERO for 78 of its 100 years (dead from year 13 but for a single
 *   major at year 23; seven consecutive decades at 0), while the SHIPPED century keeps
 *   20-36 majors per decade throughout. `checkTempo` would convict that world — but it is
 *   `release`-gated (`behavioralContract.js:1031`) and this floor is not the oracle.
 *   `LIVENESS_FLOOR` grades no major band, so the floor as §1.6 specifies it PASSES that
 *   world. Rather than drop `yearlyMajorCounts` from the fold (which would lose the series)
 *   or mint a fourth `LivenessFailureKind` (which §4.1 pins at three, and which would red
 *   the weekly watchdog on the lit world before ⟦CHAIR-R9⟧'s lighting wave has ruled), the
 *   fold MEASURES the axis and the verdict REPORTS it: `verdict.reported.majorSilentDecades`
 *   and `minMajorsPerDecade` are computed on every run and named in the verdict's detail, so
 *   the gap is VISIBLE rather than implied. Adding the band is a chair act, and
 *   `soakInvariants.test.js` carries the LIT series as an executed pin so whoever adds it
 *   can see exactly what changes.
 */

/** The realm-total population envelope, boundaries EXCLUSIVE. `whole-world-soak.mjs:842`. */
export const POPULATION_ENVELOPE = Object.freeze({ min: 0.05, max: 20 });

/**
 * ⭐ INHERITED VERBATIM from `whole-world-soak.mjs:858-862` and its in-code rationale:
 * "~900KB/settlement is a wide envelope over the measured ~150KB/settlement at 6y
 * (~385KB/settlement extrapolated to 30y)". `scripts/soak/tripwires.mjs` RE-EXPORTS this
 * binding under its existing name so the pin that imports it from there keeps working.
 */
export const YEARLY_BYTES_PER_SETTLEMENT_CEILING = 900_000;

/**
 * The wall-time trend band, INHERITED verbatim (`q4 <= q1 * 8 + 50`), plus the sample floor
 * the tree never had. Below `sampleFloorYears` the Q1 slice is EMPTY and its mean is 0, so
 * the comparison is `q4 <= 50` and every honest run fails it. That is a NOT-EXECUTABLE
 * precondition (§206.2b's third status), not a failure.
 */
export const WALL_TIME_TREND = Object.freeze({ factor: 8, slackMs: 50, sampleFloorYears: 4 });

/**
 * THE LIVENESS FLOOR. `minDistinctTypesPerDecade` is LITERAL 2 above — measured, not chosen.
 * Every other figure is a hard minimum with its own derivation:
 *   decadeYears 10                 the charter's decade, and the fold's only grain
 *   sampleFloorYears 10            below one FULL decade there is no row to grade
 *   minHashMovesPerDecade 10       every year of a live world moves the composite; measured
 *                                  10/10 in all 43 decades of five series, so this is the
 *                                  observed behaviour and not an aspiration
 *   minEventsPerSettlementDecade 1 a settlement-decade with zero typed events is silent by
 *                                  definition; the leanest measured decade carried 328
 */
export const LIVENESS_FLOOR = Object.freeze({
  decadeYears: 10,
  sampleFloorYears: 10,
  minHashMovesPerDecade: 10,
  minEventsPerSettlementDecade: 1,
  minDistinctTypesPerDecade: 10,
});

/** The closed vocabulary of liveness failures (finite semantics; §4.1 pins it at three). */
export const LIVENESS_FAILURE_KINDS = Object.freeze(['silent', 'monoculture', 'frozen']);

/**
 * ═══ THE STATE-MOTION BAND — LIFTED HERE AT §909 CAR 3, AND THE LIFT IS THE WHOLE POINT ══
 *
 * ⛔⛔ A THRESHOLD WITH NO IMPORTABLE HOME DISARMS THE ROW THAT NEEDS IT. `capacity_envelope_30y`
 * was designed at CAPACITY C3 and shipped UNARMED for two separate reasons, and only the
 * second was true: the recorded one ("the field is not written") was refuted at §907 — the
 * `motion` block has been on every yearly row since `37459391a`, 2026-07-28 — and the real
 * one was that its bar's ONE home was `tests/domain/demographicsEnvelope.test.js`, a test
 * file `scripts/soak/tripwires.mjs` must not import. Re-typing `0.05` in the registry would
 * have been a SECOND SPELLING of one envelope, which that file's own header refuses. So the
 * band moves HERE, beside `LIVENESS_FLOOR`, exactly as `YEARLY_BYTES_PER_SETTLEMENT_CEILING`
 * and `WALL_TIME_TREND` already did, and BOTH former homes import it.
 *
 * ⚠ THE MOTION FLOOR WAS SPELLED TWICE BEFORE THIS LIFT and the two spellings had to agree
 * for the suite and the observer to be measuring the same thing: an inline `0.0025` in
 * `behavioral-observation.mjs`'s per-settlement motion comparison (the `>= MOTION_FLOOR_01`
 * line, which is what that literal became) and the suite's own constant. Two homes is
 * the five-homes defect in miniature — the observer counts a transition as MOVED at the
 * quarter percent, and the suite grades the share of transitions that moved, so a drift in
 * either spelling would silently re-define the other's denominator.
 *
 * ⛔ THIS MODULE IMPORTS NOTHING, AND THAT IS DELIBERATE — it is the leaf both sides of the
 * engine/telemetry wall may read. So the campaign horizon is spelled here rather than
 * imported from `src/domain/certification/behavioralContract.js`, whose
 * `CERTIFICATION_HORIZONS.useful.years` is the same figure on the certification side.
 *
 * ⚠⚠ AND THE LIFT MOVED THAT SPELLING RATHER THAN REMOVING IT — corrected at §909 car 5 on a
 * skeptic's count, because the difference is exactly the one this header exists to state.
 * TWO definitions before (`demographicsEnvelope.test.js`'s own `const`, and the certification
 * contract's) and TWO after (this one, and the certification contract's): what the lift
 * genuinely bought is that the SUITE no longer types the figure — its `CAMPAIGN_YEARS` is
 * now an alias of this constant, so the soak row and the suite arm cannot drift. The
 * certification twin remains, and a stated twin with nothing asserting the two are equal is
 * the shape that drifts, so `tests/soak-harness/soakInvariants.test.js` now carries the
 * equality as an arm and pins all three lifted bars as controls read from this module.
 */

/** A settlement-year transition COUNTS as motion at a quarter percent of the head count. */
export const MOTION_FLOOR_01 = 0.0025;

/**
 * The share of settlement-year transitions that must move. An order of magnitude under the
 * measurement: 110 of 120 (0.9167) over the customer horizon on the real 300-year lit
 * receipt, and 170 of 180 (0.9444) on the envelope suite's own fixture.
 */
export const MOVING_SHARE_FLOOR = 0.05;

/**
 * The customer horizon, in years — the window a reader actually plays inside, and the one
 * the state-motion band is graded over. The certification side spells the same figure as
 * `CERTIFICATION_HORIZONS.useful.years`; this is its soak-side home.
 */
export const CAMPAIGN_HORIZON_YEARS = 30;

/**
 * Every non-finite number in a structure, as dotted paths. The soak's own scan idiom,
 * hoisted so `whole-world-soak.mjs` and `scripts/soak/tripwires.mjs` stop carrying one
 * copy each.
 * @returns {string[]} at most `limit` entries; `[]` on null, undefined and primitives
 */
export function nonFinitePaths(node, path = '$', out = [], seen = new Set(), limit = 5) {
  if (out.length >= limit) return out;
  if (typeof node === 'number') {
    if (!Number.isFinite(node)) out.push(`${path} = ${node}`);
    return out;
  }
  if (!node || typeof node !== 'object' || seen.has(node)) return out;
  seen.add(node);
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) nonFinitePaths(node[i], `${path}[${i}]`, out, seen, limit);
    return out;
  }
  for (const key of Object.keys(node)) nonFinitePaths(node[key], `${path}.${key}`, out, seen, limit);
  return out;
}

const finiteNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

/**
 * THE ONE DECADE FOLD.
 *
 * `distinctTypes` is the UNION of `eventTypeCounts` keys over the decade — a union, never a
 * sum, because a decade that repeats one type ten thousand times is exactly the monoculture
 * this grades. `hashMoves` counts years whose composite differs from the previous year's,
 * and THE FIRST YEAR OF THE SERIES COUNTS AS A MOVE (it has no predecessor to be equal to;
 * counting it as a non-move would convict every world of one frozen year it never had).
 * FULL decades only — a partial tail is REPORTED as `partialTailYears` and never graded,
 * because a three-year tail cannot carry a ten-year floor.
 *
 * @param {{yearlyEventTypeCounts: Array<Record<string, number>>, yearlyHashes: string[],
 *          yearlyMajorCounts?: number[], settlements: number, decadeYears?: number}} input
 * @returns {{rows: Array<object>, partialTailYears: number}}
 */
export function foldDecades({
  yearlyEventTypeCounts,
  yearlyHashes,
  yearlyMajorCounts = [],
  settlements,
  decadeYears = LIVENESS_FLOOR.decadeYears,
}) {
  const counts = Array.isArray(yearlyEventTypeCounts) ? yearlyEventTypeCounts : [];
  const hashes = Array.isArray(yearlyHashes) ? yearlyHashes : [];
  const majors = Array.isArray(yearlyMajorCounts) ? yearlyMajorCounts : [];
  const places = Math.max(1, finiteNumber(settlements));
  const span = Math.max(1, finiteNumber(decadeYears) || LIVENESS_FLOOR.decadeYears);
  const years = Math.min(counts.length, hashes.length);
  const fullDecades = Math.floor(years / span);

  const rows = [];
  for (let decade = 0; decade < fullDecades; decade += 1) {
    const first = decade * span;
    const last = first + span - 1;
    const types = new Set();
    let events = 0;
    let majorCount = 0;
    let hashMoves = 0;
    for (let i = first; i <= last; i += 1) {
      const yearCounts = counts[i] && typeof counts[i] === 'object' ? counts[i] : {};
      for (const type of Object.keys(yearCounts)) {
        types.add(type);
        events += finiteNumber(yearCounts[type]);
      }
      majorCount += finiteNumber(majors[i]);
      if (i === 0 || hashes[i] !== hashes[i - 1]) hashMoves += 1;
    }
    rows.push({
      decade: decade + 1,
      firstYear: first + 1,
      lastYear: last + 1,
      years: span,
      distinctTypes: types.size,
      events,
      eventsPerSettlement: events / places,
      majors: majorCount,
      hashMoves,
    });
  }
  return { rows, partialTailYears: years - (fullDecades * span) };
}

/**
 * Grade the fold. Every failure NAMES its decade, its kind, the measured figure and the
 * floor it fell under (the NEWS ADDRESS LAW), and the verdict states POSITIVELY whether it
 * could execute at all.
 *
 * @param {{rows: Array<object>, partialTailYears?: number}|Array<object>} folded
 * @param {{years: number, settlements: number, floor?: object}} context
 */
export function livenessVerdict(folded, { years, settlements, floor = LIVENESS_FLOOR } = {}) {
  const rows = Array.isArray(folded) ? folded : (Array.isArray(folded?.rows) ? folded.rows : []);
  const partialTailYears = Array.isArray(folded) ? 0 : finiteNumber(folded?.partialTailYears);
  const observedYears = finiteNumber(years) || rows.reduce((total, row) => total + finiteNumber(row.years), 0);
  const places = Math.max(1, finiteNumber(settlements));
  const band = { ...LIVENESS_FLOOR, ...(floor || {}) };

  if (observedYears < band.sampleFloorYears || rows.length === 0) {
    return {
      executable: false,
      reason: `a liveness floor needs one FULL decade: ${observedYears} year(s) against a `
        + `sample floor of ${band.sampleFloorYears}, ${rows.length} full decade(s) folded`,
      passed: true,
      rows,
      failures: [],
      partialTailYears,
      settlements: places,
      years: observedYears,
      floor: band,
      reported: reportedFiguresOf(rows),
    };
  }

  const failures = [];
  for (const row of rows) {
    if (row.eventsPerSettlement < band.minEventsPerSettlementDecade) {
      failures.push({
        kind: 'silent',
        decade: row.decade,
        firstYear: row.firstYear,
        lastYear: row.lastYear,
        figure: 'eventsPerSettlement',
        measured: row.eventsPerSettlement,
        floor: band.minEventsPerSettlementDecade,
        detail: `decade ${row.decade} (years ${row.firstYear}-${row.lastYear}) carried `
          + `${row.eventsPerSettlement} typed events per settlement, under the floor of `
          + `${band.minEventsPerSettlementDecade}`,
      });
    }
    if (row.distinctTypes < band.minDistinctTypesPerDecade) {
      failures.push({
        kind: 'monoculture',
        decade: row.decade,
        firstYear: row.firstYear,
        lastYear: row.lastYear,
        figure: 'distinctTypes',
        measured: row.distinctTypes,
        floor: band.minDistinctTypesPerDecade,
        detail: `decade ${row.decade} (years ${row.firstYear}-${row.lastYear}) carried `
          + `${row.distinctTypes} distinct typed events, under the floor of `
          + `${band.minDistinctTypesPerDecade}`,
      });
    }
    if (row.hashMoves < band.minHashMovesPerDecade) {
      failures.push({
        kind: 'frozen',
        decade: row.decade,
        firstYear: row.firstYear,
        lastYear: row.lastYear,
        figure: 'hashMoves',
        measured: row.hashMoves,
        floor: band.minHashMovesPerDecade,
        detail: `decade ${row.decade} (years ${row.firstYear}-${row.lastYear}) moved the `
          + `composite state in ${row.hashMoves} of ${row.years} years, under the floor of `
          + `${band.minHashMovesPerDecade}`,
      });
    }
  }

  return {
    executable: true,
    reason: '',
    passed: failures.length === 0,
    rows,
    failures,
    partialTailYears,
    settlements: places,
    years: observedYears,
    floor: band,
    reported: reportedFiguresOf(rows),
  };
}

/**
 * The axis the floor MEASURES and does not grade — see the file header. Reported on every
 * verdict, executable or not, so a world whose major stream has died is named even though
 * no failure kind can currently convict it.
 */
function reportedFiguresOf(rows) {
  const silent = rows.filter((row) => finiteNumber(row.majors) === 0).map((row) => row.decade);
  return {
    minDistinctTypesPerDecade: rows.length ? Math.min(...rows.map((row) => finiteNumber(row.distinctTypes))) : null,
    minEventsPerSettlementDecade: rows.length ? Math.min(...rows.map((row) => finiteNumber(row.eventsPerSettlement))) : null,
    minHashMovesPerDecade: rows.length ? Math.min(...rows.map((row) => finiteNumber(row.hashMoves))) : null,
    minMajorsPerDecade: rows.length ? Math.min(...rows.map((row) => finiteNumber(row.majors))) : null,
    majorSilentDecades: silent.length,
    majorSilentDecadeNumbers: silent,
  };
}

/**
 * The realm-total population envelope. Boundaries are EXCLUSIVE, matching
 * `whole-world-soak.mjs:842`'s `ratio > 0.05 && ratio < 20` exactly.
 */
export function populationEnvelopeVerdict({ startTotal, finalTotal, envelope = POPULATION_ENVELOPE } = {}) {
  const start = finiteNumber(startTotal);
  const final = finiteNumber(finalTotal);
  const band = { ...POPULATION_ENVELOPE, ...(envelope || {}) };
  if (!(start > 0)) {
    return {
      executable: false,
      reason: `a population ratio needs a positive start total; measured ${start}`,
      passed: true,
      ratio: null,
      startTotal: start,
      finalTotal: final,
      envelope: band,
      detail: '',
    };
  }
  const ratio = final / start;
  return {
    executable: true,
    reason: '',
    passed: ratio > band.min && ratio < band.max,
    ratio,
    startTotal: start,
    finalTotal: final,
    envelope: band,
    detail: `${start} -> ${final} (x${ratio.toFixed(2)}; envelope ${band.min}-${band.max})`,
  };
}

/**
 * The per-year wall-time trend, WITH the sample floor the tree never had. Below the floor
 * the Q1 slice is empty, its mean is 0, and the band degenerates to `q4 <= 50` — which is
 * why the D2bR three-year probe reported `Q1 0.0ms -> Q4 11703.0ms` and failed a run whose
 * every world assertion had passed. That is a precondition that did not hold, so it is
 * NOT-EXECUTABLE and it never reaches `failures`.
 */
export function wallTimeTrendVerdict(yearlyMs, { trend = WALL_TIME_TREND } = {}) {
  const ms = (Array.isArray(yearlyMs) ? yearlyMs : []).filter((value) => Number.isFinite(Number(value))).map(Number);
  const band = { ...WALL_TIME_TREND, ...(trend || {}) };
  if (ms.length < band.sampleFloorYears) {
    return {
      executable: false,
      reason: `a per-year trend needs ${band.sampleFloorYears} years; ${ms.length} sampled, `
        + 'and below the floor the Q1 slice is empty and its mean is 0',
      passed: true,
      q1: null,
      q4: null,
      trend: band,
      detail: '',
    };
  }
  const meanOf = (list, from, to) => {
    const slice = list.slice(Math.floor(list.length * from), Math.floor(list.length * to));
    return slice.reduce((sum, value) => sum + value, 0) / Math.max(1, slice.length);
  };
  const q1 = meanOf(ms, 0, 0.25);
  const q4 = meanOf(ms, 0.75, 1);
  return {
    executable: true,
    reason: '',
    passed: q4 <= q1 * band.factor + band.slackMs,
    q1,
    q4,
    trend: band,
    detail: `Q1 ${q1.toFixed(1)}ms -> Q4 ${q4.toFixed(1)}ms/year`,
  };
}

/**
 * The ONE spelling of the byte envelope's verdict, so the soak's check and the registry row
 * cannot drift. `>=` is the firing comparison, matching the registry's existing row.
 */
export function yearlyBytesVerdict({ yearlyBytes, settlements, ceilingPerSettlement = YEARLY_BYTES_PER_SETTLEMENT_CEILING } = {}) {
  const bytes = (Array.isArray(yearlyBytes) ? yearlyBytes : []).filter((value) => Number.isFinite(Number(value))).map(Number);
  const places = Math.max(0, finiteNumber(settlements));
  if (!bytes.length || !places) {
    return {
      executable: false,
      reason: 'a byte envelope needs at least one measured year and a settlement count',
      passed: true,
      maxBytes: null,
      ceiling: null,
      detail: '',
    };
  }
  const ceiling = ceilingPerSettlement * places;
  const maxBytes = Math.max(...bytes);
  return {
    executable: true,
    reason: '',
    passed: maxBytes < ceiling,
    maxBytes,
    ceiling,
    detail: `max ${(maxBytes / 1e6).toFixed(2)}MB < ${(ceiling / 1e6).toFixed(2)}MB (${places} settlements)`,
  };
}

/**
 * THE CHECK'S LITERAL TITLE, spelled ONCE (§4.1). The watchdog, the registry row's band and
 * Tier 1's arm all name the same string, so a reader grepping a red finds every home.
 */
export const LIVENESS_CHECK_TITLE = 'the world keeps moving: every decade carries distinct typed events and the composite state changes every year';
