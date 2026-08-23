/**
 * townCartographyCalibration.test.js — THE CARTOGRAPHY GROUND.
 *
 * The cartography stage's per-tier premises are CALIBRATIONS, and until this suite the
 * only corpus any of them was ever proved against was V2_GOLDEN_CONFIGS: twenty
 * hand-authored settlements whose institution counts are written down as constants
 * (thorp 2, hamlet 4, village 6, town 10, city 16, metropolis 22). A cap cannot be
 * exceeded by a corpus that cannot draw past it, so every cap looked green for months
 * while the real generator was producing counts two to five times larger.
 *
 * This suite replaces that ground. It runs the REAL `generateSettlementPipeline` across
 * the estate's own golden-master grid with the seed and threat dimensions rotated
 * (tests/fixtures/cartographyCalibrationCorpus.js states and defends the selection
 * rule), records what the stage ITSELF says about each settlement, and freezes the
 * result. A future premise change is measured against what the generator really
 * produces.
 *
 *   W0 RECORD      the manifest exists, and the ONE opt-in arm that re-records it.
 *   W1 CORPUS      the selection rule is a pure function of frozen vocabularies, the
 *                  arithmetic closes, and the manifest covers the corpus EXACTLY.
 *   W2 LIVE        a deterministic sample is RE-MEASURED live against the real
 *                  pipeline and must reproduce its manifest rows exactly, so a frozen
 *                  measurement cannot silently decay into a frozen fiction.
 *   W3 IDENTITY    the stage's own reported binding count equals the settlement's own
 *                  institution roster size — two numbers produced by different code,
 *                  compared, so the corpus's cheap quantity is PROVEN rather than
 *                  assumed to stand for the expensive one.
 *   W4 RATCHET     the per-tier premise-failure inventory is frozen and SHRINK-ONLY,
 *                  with the honesty companion that forbids a stale row.
 *   W5 HEADROOM    each cap is reported beside the maximum the real pipeline actually
 *                  produces, and the shortfall is named rather than left to be
 *                  rediscovered.
 *
 * ── WHY W4 IS A RATCHET AND NOT A ZERO ───────────────────────────────────────
 * At the base this suite was written against, 287 of 504 real settlements raise a
 * cartography premise error. A test asserting zero would be RED, and a red test is a
 * disabled guard that this estate's census cannot absorb. The frozen inventory makes
 * the debt visible, attributed per tier, and impossible to grow — which is what a
 * ratchet is for. Lowering a number as the ground is repaired is the ONLY legal edit.
 *
 * ── WHY EVERY SUITE AND TEST IS REGISTERED STRAIGHT-LINE ─────────────────────
 * The re-record path is an opt-in ARM of W0's single test, not a conditional
 * `describe`. Wrapping registration in `if (process.env…)` — the shape
 * generatorGoldenMaster uses — parks the whole file in
 * tests/lint/sovereigntyLightingContract.walker.test.js under
 * `SUITE_UNREGISTERED` / `TEST_UNREGISTERED`, and a parked file's pins are real
 * coverage the census cannot see. MEASURED, not assumed: the conditional draft of this
 * file walked the census to `+1 file / +1 parked / +0 credited / +0 titles /
 * +0 suiteTitles`, every title swallowed. The manifest is therefore read through
 * `readManifest()` per test rather than once at module scope, so the re-record arm's
 * write is visible to the arms that verify it in the same run.
 *
 * ── SHIFT RECORD ─────────────────────────────────────────────────────────────
 * A frozen measurement cannot show WHY it moved, so every re-record is written here.
 *
 * 2026-08-23 — FIRST RECORD (lane TE-CG-1, packet MF-CG1). Corpus captured at
 *   00e7af61 through the committed re-record arm below. 504 rows; dark compile
 *   504/504 clean; 287 lit failures in exactly TWO premise classes — 266
 *   `binding-cap` and 21 `tc4-bytes` — and zero in the `other` bucket. No tuning
 *   number was moved by the recording lane: the numbers below are the measured state
 *   of the estate, not a target this suite helped anyone reach.
 *
 * To re-record after an INTENTIONAL change, run:
 *   UPDATE_CARTOGRAPHY_CALIBRATION=1 npx vitest run tests/domain/townCartographyCalibration.test.js
 * and add a row above before committing. Re-recording without adding a row is a
 * deleted alarm.
 *
 * @enforced-by tests/fixtures/cartographyCalibrationCorpus.js
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  CALIBRATION_CULTURES,
  CALIBRATION_OUTCOMES,
  CALIBRATION_SAMPLE_STRIDE,
  CALIBRATION_SEEDS,
  CALIBRATION_TERRAINS,
  CALIBRATION_TERRAIN_ROUTE,
  CALIBRATION_THREATS,
  calibrationKeyOf,
  calibrationRows,
  calibrationSampleKeys,
  calibrationVocabularyReceipt,
  classifyCalibrationFailure,
  measureCalibrationRow,
} from '../fixtures/cartographyCalibrationCorpus.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
} from '../../src/domain/townCartography/cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;
const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'cartography-calibration-corpus.json');

/**
 * THE FROZEN INVENTORY — measured 2026-08-23 at 00e7af61, hand-audited against the
 * capture output. SHRINK-ONLY.
 *
 * `throws` is the number of the tier's 84 corpus rows on which the lit cartography
 * compile raises a premise error. To lower one: repair the premise that fires, re-record
 * the manifest, and lower the number here. NEVER raise a number — a tier that grows past
 * its frozen count means a change made the ground WORSE, which is the whole event this
 * ratchet exists to make loud.
 *
 * `maxInstitutions` is the largest canonical institution roster the real pipeline
 * produced at that tier over this corpus. It is an EXACT pin, not a ceiling: it measures
 * the GENERATOR, so a move in either direction is generator drift that must be seen and
 * explained, never silently absorbed.
 */
const FROZEN = Object.freeze({
  thorp: Object.freeze({ throws: 28, maxInstitutions: 11 }),
  hamlet: Object.freeze({ throws: 71, maxInstitutions: 24 }),
  village: Object.freeze({ throws: 83, maxInstitutions: 41 }),
  town: Object.freeze({ throws: 84, maxInstitutions: 62 }),
  city: Object.freeze({ throws: 21, maxInstitutions: 55 }),
  metropolis: Object.freeze({ throws: 0, maxInstitutions: 63 }),
});

/** Rows per tier in the corpus — cultures x terrains, closed by the receipt in W1. */
const ROWS_PER_TIER = 84;

const rows = calibrationRows();

/**
 * @typedef {{ tier: string, institutions: number, districts: number,
 *   sceneBuildings: number, dark: string, outcome: string, reported: number[] }} Row
 */

/** Read the frozen measurement. Per test, never once at module scope — see the header.
 *  @returns {Record<string, Row>} */
function readManifest() {
  return existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};
}

/** @param {Record<string, Row>} manifest @param {string} tier @returns {Array<[string, Row]>} */
function rowsOfTier(manifest, tier) {
  return Object.entries(manifest).filter(([, value]) => value.tier === tier);
}

/** @param {Record<string, Row>} manifest @param {string} tier @returns {number} */
function throwsOfTier(manifest, tier) {
  return rowsOfTier(manifest, tier).filter(([, value]) => value.outcome !== 'ok').length;
}

describe('W0 the frozen record, and the one arm that re-records it', () => {
  it('the manifest exists, and UPDATE_CARTOGRAPHY_CALIBRATION re-records it', () => {
    // ONE test, TWO arms, registered straight-line so the file stays credited. The
    // re-record arm is opt-in because it drives 504 full pipeline generations and 1,008
    // scene compiles; CI takes the existence arm and W2's live sample instead.
    if (process.env.UPDATE_CARTOGRAPHY_CALIBRATION) {
      /** @type {Record<string, Row>} */
      const out = {};
      for (const row of rows) {
        const measured = measureCalibrationRow(row);
        out[measured.key] = {
          tier: measured.tier,
          institutions: measured.institutions,
          districts: measured.districts,
          sceneBuildings: measured.sceneBuildings,
          dark: measured.dark,
          outcome: measured.outcome,
          reported: measured.reported,
        };
      }
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      // ⚠ KEY ORDER BY CONSTRUCTION, NEVER BY REPLACER. `JSON.stringify(out, keys, n)`
      // reads its second argument as an ALLOW-LIST applied at EVERY level, so an array of
      // top-level keys silently empties every nested record — the first capture wrote 504
      // rows of `{}` and only W1's outcome arm noticed. Sorting the entries is the shape
      // that cannot do that.
      const sorted = Object.fromEntries(Object.keys(out).sort().map((key) => [key, out[key]]));
      writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 1)}\n`);
      expect(Object.keys(out).length).toBe(rows.length);
    }
    expect(existsSync(MANIFEST), 'run UPDATE_CARTOGRAPHY_CALIBRATION=1 to create it').toBe(true);
  }, 1_200_000);
});

describe('W1 the corpus is a rule, and the manifest covers it exactly', () => {
  it('the vocabulary arithmetic closes', () => {
    const receipt = calibrationVocabularyReceipt();
    expect(receipt.tiers).toBe(6);
    expect(receipt.terrains).toBe(7);
    expect(receipt.threats).toBe(4);
    expect(receipt.seeds).toBe(12);
    // Cultures are DERIVED from the profile registry; the corpus size is derived from
    // the three vocabularies, so this closes rather than restates.
    expect(receipt.cultures).toBe(CALIBRATION_CULTURES.length);
    expect(receipt.rows).toBe(receipt.tiers * receipt.cultures * receipt.terrains);
    expect(rows.length).toBe(receipt.rows);
    expect(receipt.rows / receipt.tiers).toBe(ROWS_PER_TIER);
  });

  it('every row obeys the stated selection rule, index for index', () => {
    // The rule is the fixture's contract, so it is CHECKED rather than described: a row
    // that drifted off the rotation would still hash into the manifest and would make
    // the corpus a list somebody edited instead of a function anybody can rebuild.
    /** @type {string[]} */
    const offenders = [];
    rows.forEach((row, index) => {
      if (row.monsterThreat !== CALIBRATION_THREATS[index % CALIBRATION_THREATS.length]) {
        offenders.push(`${index}: threat ${row.monsterThreat}`);
      }
      if (row._seed !== CALIBRATION_SEEDS[index % CALIBRATION_SEEDS.length]) {
        offenders.push(`${index}: seed ${row._seed}`);
      }
      if (row.tradeRouteAccess !== CALIBRATION_TERRAIN_ROUTE[row.terrainOverride]) {
        offenders.push(`${index}: route ${row.tradeRouteAccess}`);
      }
      if (!CALIBRATION_TERRAINS.includes(row.terrainOverride)) {
        offenders.push(`${index}: terrain ${row.terrainOverride}`);
      }
    });
    expect(offenders).toEqual([]);
  });

  it('the rotation reaches every (tier, seed) and (tier, threat) pair', () => {
    // A rotation whose period aligned with the inner loop would visit one column and
    // look exactly as broad as this one. That failure is invisible to a row count, so
    // it is closed here by construction.
    const seedPairs = new Set(rows.map((row) => `${row.settType}|${row._seed}`));
    const threatPairs = new Set(rows.map((row) => `${row.settType}|${row.monsterThreat}`));
    expect(seedPairs.size).toBe(CARTOGRAPHY_TIERS.length * CALIBRATION_SEEDS.length);
    expect(threatPairs.size).toBe(CARTOGRAPHY_TIERS.length * CALIBRATION_THREATS.length);
  });

  it('the manifest key set equals the corpus key set exactly', () => {
    // Exact, never a subset: an added row without a measurement and a stale row whose
    // config no longer exists are the same defect wearing two faces.
    expect(rows.map(calibrationKeyOf).sort()).toEqual(Object.keys(readManifest()).sort());
  });

  it('every recorded row carries a known outcome and a dark compile that succeeded', () => {
    const manifest = readManifest();
    const unknown = Object.entries(manifest)
      .filter(([, value]) => !CALIBRATION_OUTCOMES.includes(value.outcome))
      .map(([key, value]) => `${key}: ${value.outcome}`);
    expect(unknown).toEqual([]);
    // `other` is deliberately expected empty: a premise class this corpus has never
    // seen must be loud rather than folded into one of the two known ones.
    const other = Object.entries(manifest)
      .filter(([, value]) => value.outcome === 'other').map(([key]) => key);
    expect(other).toEqual([]);
    // The pipeline's output is NOT malformed, and that is a load-bearing claim: it is
    // what makes every failure below a CALIBRATION defect rather than a generator bug.
    const darkFailures = Object.entries(manifest)
      .filter(([, value]) => value.dark !== 'ok').map(([key, value]) => `${key}: ${value.dark}`);
    expect(darkFailures).toEqual([]);
  });

  it('the failure classifier reads the stage\'s own words, and refuses foreign ones', () => {
    // The classifier is the corpus's only interpretation step, so its NEGATIVE arm
    // matters more than its positive one: a classifier that matched everything would
    // make the `other` bucket above vacuously empty.
    expect(classifyCalibrationFailure(
      'townCartography TC-3 premise: 52 institution bindings exceed the town cap of 32',
    )).toEqual({ outcome: 'binding-cap', reported: [52, 32] });
    expect(classifyCalibrationFailure(
      'townCartography TC-3 premise: the TC-4 layer measures 71209 bytes against the city band of 70400',
    )).toEqual({ outcome: 'tc4-bytes', reported: [71209, 70400] });
    expect(classifyCalibrationFailure('some other premise entirely'))
      .toEqual({ outcome: 'other', reported: [] });
  });
});

describe('W2 the frozen measurement is re-measured live', () => {
  it('the sample rule picks a stride UNION every tier\'s argmax row', () => {
    const manifest = readManifest();
    const recorded = Object.entries(manifest)
      .map(([key, value]) => ({ key, tier: value.tier, institutions: value.institutions }));
    const sample = calibrationSampleKeys(recorded);
    expect(sample.length).toBeGreaterThanOrEqual(
      Math.ceil(rows.length / CALIBRATION_SAMPLE_STRIDE),
    );
    // The argmax rows are the only rows whose drift can move a recorded ceiling, so
    // their presence is the property that makes the sample worth running at all.
    for (const tier of CARTOGRAPHY_TIERS) {
      const best = recorded
        .filter((entry) => entry.tier === tier)
        .reduce((left, right) => (right.institutions > left.institutions ? right : left));
      expect(sample, `${tier} argmax row is not sampled`).toContain(best.key);
    }
  });

  it('every sampled row reproduces its manifest record exactly', () => {
    // This is what keeps the manifest honest. It runs the REAL pipeline and the REAL
    // compiler; if generation or the stage moved, the sampled rows disagree and this
    // reds — the manifest cannot quietly become a description of a tree that is gone.
    const manifest = readManifest();
    const recorded = Object.entries(manifest)
      .map(([key, value]) => ({ key, tier: value.tier, institutions: value.institutions }));
    const sample = calibrationSampleKeys(recorded);
    const byKey = new Map(rows.map((row) => [calibrationKeyOf(row), row]));
    /** @type {string[]} */
    const drift = [];
    for (const key of sample) {
      const measured = measureCalibrationRow(/** @type {never} */ (byKey.get(key)));
      const frozen = manifest[key];
      if (measured.institutions !== frozen.institutions
        || measured.districts !== frozen.districts
        || measured.sceneBuildings !== frozen.sceneBuildings
        || measured.dark !== frozen.dark
        || measured.outcome !== frozen.outcome
        || measured.reported.join(',') !== frozen.reported.join(',')) {
        drift.push(`${key}: recorded ${JSON.stringify(frozen)} measured ${JSON.stringify({
          institutions: measured.institutions,
          districts: measured.districts,
          sceneBuildings: measured.sceneBuildings,
          dark: measured.dark,
          outcome: measured.outcome,
          reported: measured.reported,
        })}`);
      }
    }
    expect(drift).toEqual([]);
  }, 600_000);
});

describe('W3 the corpus quantity is proven, not assumed', () => {
  it('the stage\'s reported binding count equals the settlement\'s institution roster', () => {
    // TWO independently produced numbers: the left one is parsed out of the premise
    // message the TC-3b leaf itself raises, the right one is the length of the roster
    // the pipeline wrote long before any compile. Their agreement is what licenses the
    // rest of this suite to reason about `institutions` as the calibration quantity —
    // and their disagreement, if the binder's eligibility rule ever narrows, is
    // exactly the event that must not pass silently.
    const capRows = Object.entries(readManifest())
      .filter(([, value]) => value.outcome === 'binding-cap');
    // Non-vacuity: an empty left-hand side would make the filter below prove nothing.
    expect(capRows.length).toBeGreaterThan(200);
    const disagreements = capRows
      .filter(([, value]) => value.reported[0] !== value.institutions)
      .map(([key, value]) => `${key}: stage ${value.reported[0]} roster ${value.institutions}`);
    expect(disagreements).toEqual([]);
  });

  it('every binding-cap row reports the tier cap the tuning table actually holds', () => {
    const wrong = Object.entries(readManifest())
      .filter(([, value]) => value.outcome === 'binding-cap')
      .filter(([, value]) => (
        value.reported[1] !== cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, value.tier)
      ))
      .map(([key, value]) => `${key}: reported ${value.reported[1]}`);
    expect(wrong).toEqual([]);
  });

  it('every tc4-bytes row reports the DERIVED band, not a second authored table', () => {
    // The TC-4 band is documented as derived — MAXIMUM_CARTOGRAPHY_BUILDINGS x the
    // per-row byte band. Reading that derivation back out of the stage's own message
    // is what proves the documentation is still true of the code.
    const byteRows = Object.entries(readManifest())
      .filter(([, value]) => value.outcome === 'tc4-bytes');
    expect(byteRows.length).toBeGreaterThan(0);
    const wrong = byteRows
      .filter(([, value]) => (
        value.reported[1]
        !== cartographyBand(T.MAXIMUM_CARTOGRAPHY_BUILDINGS, value.tier) * T.TC4_ROW_BYTES_BAND
      ))
      .map(([key, value]) => `${key}: reported band ${value.reported[1]}`);
    expect(wrong).toEqual([]);
  });
});

describe('W4 the premise-failure inventory only shrinks', () => {
  it('every tier contributes its full share of the corpus', () => {
    const manifest = readManifest();
    for (const tier of CARTOGRAPHY_TIERS) {
      expect(rowsOfTier(manifest, tier).length, tier).toBe(ROWS_PER_TIER);
    }
  });

  it('no tier throws on more rows than its frozen count', () => {
    const manifest = readManifest();
    /** @type {string[]} */
    const violations = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const throws = throwsOfTier(manifest, tier);
      const ceiling = FROZEN[tier].throws;
      if (throws > ceiling) {
        violations.push(
          `${tier}: ${throws} of ${ROWS_PER_TIER} real settlements raise a cartography premise `
          + `error; the frozen count is ${ceiling}. The stage's per-tier ceilings are `
          + 'CALIBRATIONS and this corpus is the ground they are calibrated against. '
          + 'Repair the premise that fires, re-record with '
          + 'UPDATE_CARTOGRAPHY_CALIBRATION=1, and LOWER this tier\'s number in FROZEN. '
          + 'Never raise a number: a tier that grew made the ground worse.',
        );
      }
    }
    expect(violations).toEqual([]);
  });

  it('HONESTY: no frozen row is stale', () => {
    // Without this, a repaired tier keeps its old headroom and the ratchet quietly
    // stops guarding it. A tier frozen at 0 asserts only that it stays at 0.
    const manifest = readManifest();
    /** @type {string[]} */
    const stale = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const throws = throwsOfTier(manifest, tier);
      const ceiling = FROZEN[tier].throws;
      if (ceiling > 0 && throws < ceiling) {
        stale.push(`${tier}: ${throws} < frozen ${ceiling} — bank the win, lower the number`);
      }
    }
    expect(stale).toEqual([]);
  });

  it('the recorded per-tier institution maximum is exactly what was frozen', () => {
    // EXACT, not a bound: this measures the GENERATOR. A literal table compared against
    // a manifest-derived maximum is two readings; deriving both sides from the manifest
    // would be the same reading twice and would rise with the corpus forever.
    const manifest = readManifest();
    /** @type {Record<string, number>} */
    const measured = {};
    for (const tier of CARTOGRAPHY_TIERS) {
      measured[tier] = rowsOfTier(manifest, tier)
        .reduce((best, [, value]) => Math.max(best, value.institutions), 0);
    }
    expect(measured).toEqual(Object.fromEntries(
      CARTOGRAPHY_TIERS.map((tier) => [tier, FROZEN[tier].maxInstitutions]),
    ));
  });
});

describe('W5 the headroom every cap actually has against real output', () => {
  it('reports each binding cap beside the maximum the real pipeline produces', () => {
    // NOT an assertion that the caps are adequate — at this base four of them are not,
    // which is what W4's inventory records. This pin fixes the RELATIONSHIP so that a
    // later lane raising a cap cannot claim headroom it did not measure: the moment a
    // cap clears its tier's real maximum, this list shrinks and the expectation below
    // must be edited deliberately.
    /** @type {string[]} */
    const short = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const cap = cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, tier);
      if (cap < FROZEN[tier].maxInstitutions) {
        short.push(`${tier}: cap ${cap} < measured max ${FROZEN[tier].maxInstitutions}`);
      }
    }
    expect(short).toEqual([
      'thorp: cap 8 < measured max 11',
      'hamlet: cap 12 < measured max 24',
      'village: cap 20 < measured max 41',
      'town: cap 32 < measured max 62',
    ]);
  });

  it('records that city and metropolis clear their measured maxima', () => {
    // The complement of the list above, spelled out so the two halves cannot both be
    // wrong in the same direction without one of them reddening. FOUR of six tiers are
    // short and only these two are not, which is the measurement that makes the caps a
    // ladder-wide calibration question rather than a one-tier nudge.
    for (const tier of ['city', 'metropolis']) {
      expect(cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, tier), tier)
        .toBeGreaterThanOrEqual(FROZEN[tier].maxInstitutions);
    }
  });

  it('the binding cap never exceeds the total building cap, at every tier', () => {
    // The invariant tests/domain/townCartographyBuildings.test.js also holds, restated
    // here because it is the CONSTRAINT any repair of the caps above must satisfy: a
    // flagship is drawn for every bound institution, so a binding cap over the total
    // building cap promises more flagships than the layer may ever emit.
    for (const tier of CARTOGRAPHY_TIERS) {
      expect(cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, tier), tier)
        .toBeLessThanOrEqual(cartographyBand(T.MAXIMUM_CARTOGRAPHY_BUILDINGS, tier));
    }
  });
});
