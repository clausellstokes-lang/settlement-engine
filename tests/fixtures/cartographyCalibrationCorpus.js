/**
 * cartographyCalibrationCorpus.js — THE CARTOGRAPHY GROUND: the calibration corpus
 * built from REAL `generateSettlementPipeline` output.
 *
 * ── WHY THIS FILE EXISTS (the defect it removes the habitat of) ──────────────
 * Every per-tier number in src/domain/townCartography/cartographyTuning.js is a
 * CALIBRATION: a ceiling measured against some corpus and then frozen. Until this
 * file, the only corpus the cartography stage was ever proved against was
 * tests/fixtures/townMapFixtures.js's V2_GOLDEN_CONFIGS — a hand-authored twenty-row
 * synthetic sample whose institution counts are AUTHORED CONSTANTS
 * (TIER_INSTITUTIONS = thorp 2, hamlet 4, village 6, town 10, city 16, metropolis 22),
 * every one of them far below the caps they were used to prove.
 *
 * That is not a small-sample problem. It is a WRONG-POPULATION problem: the synthetic
 * corpus cannot exceed a cap because its counts are written down, while the real
 * generator DRAWS them. Measured on the grid below, the real pipeline produces up to
 * 55 canonical institutions at `town` against a `MAXIMUM_INSTITUTION_BINDINGS` cap of
 * 32 — so 84 of 84 real town rows raise a premise error while all twenty synthetic
 * rows sit comfortably inside the band. A premise proved only against authored
 * constants is a premise proved against nothing.
 *
 * The corpus here is therefore the STAGE'S GROUND: real settlements, from the real
 * pipeline, across the estate's own golden-master grid, measured through the stage's
 * OWN public seam and frozen into a manifest that a future premise change is measured
 * against. Nothing in this file re-implements a rule the stage owns.
 *
 * ── THE SELECTION RULE (pinned; see calibrationRows) ─────────────────────────
 * The grid is the estate's golden-master grid — 6 tiers x 12 cultures x 7 terrains =
 * 504 rows, terrain paired with the trade route that honestly reaches it, exactly as
 * tests/property/generatorGoldenMaster.test.js pairs them.
 *
 * TWO dimensions the golden master holds FIXED are ROTATED here, deterministically by
 * row index, and the reason is measured rather than assumed. The calibration quantity
 * — the canonical institution roster the stage must draw — is a SEEDED DRAW inside a
 * tier band, so a single-seed grid systematically UNDER-measures its maximum. At one
 * fixed config (germanic/plains/road/civilized), eight seeds alone moved `hamlet` from
 * 11 to 20 and `town` from 45 to 58; the entire 12x7 culture-by-terrain sweep at ONE
 * seed moved `hamlet` only from 7 to 17. The seed dimension therefore dominates the
 * two the golden master varies, and a corpus that omits it is calibrated on the wrong
 * distribution no matter how wide it looks. `monsterThreat` is rotated for the same
 * reason at smaller amplitude (a plagued town measured +3 institutions over a safe one).
 *
 *   row index i = the enumeration order tier -> culture -> terrain
 *   monsterThreat = CALIBRATION_THREATS[i % 4]
 *   _seed         = CALIBRATION_SEEDS[i % 12]
 *
 * 4 and 12 are coprime with neither 7 (terrains) nor 12 (cultures) in a way that would
 * collapse the rotation onto one column: 504 rows visit every (tier, threat) pair 21
 * times and every (tier, seed) pair 7 times. The corpus is a pure function of the three
 * frozen vocabularies and the two frozen pools — no clock, no Math.random, no I/O.
 *
 * ── WHAT IS MEASURED, AND WHY IT IS NOT A MIRROR ─────────────────────────────
 * `measureCalibrationRow` runs the whole real compiler with the cartography rule LIT
 * and records THE STAGE'S OWN VERDICT: whether it compiled, and — when it did not —
 * which premise fired together with the integers that premise's own message states.
 * No eligibility rule, no cap comparison and no byte count is re-implemented here; a
 * fixture that mirrored the deriver would agree with it by construction and pin
 * nothing. The one upstream number the corpus records independently is
 * `settlement.institutions.length`, and the suite that reads this corpus PROVES the
 * correspondence between it and the stage's own reported binding count rather than
 * assuming it (tests/domain/townCartographyCalibration.test.js, the IDENTITY control).
 *
 * Pure and headless apart from the generator and compiler it deliberately drives.
 *
 * @enforced-by tests/domain/townCartographyCalibration.test.js
 */

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { compileTownSceneManifest, stableSceneStringify } from '../../src/domain/townScene/index.js';
import { CARTOGRAPHY_TIERS } from '../../src/domain/townCartography/cartographyTuning.js';
import { CULTURE_PROFILE_KEYS } from '../../src/domain/cultureProfiles.js';
import { NAMING_DATA } from '../../src/data/namingData.js';

/** The rule key that lights the cartography stage inside the town-scene compile. */
const LIT_RULES = Object.freeze({
  simulationRules: Object.freeze({ townCartographyEnabled: true }),
});

/**
 * The culture vocabulary, DERIVED from the profile registry plus the one legacy alias
 * the panel still offers. Restating a literal list here would go stale the moment a
 * tradition was added — the exact drift the golden master's own comment warns about.
 */
export const CALIBRATION_CULTURES = Object.freeze([...CULTURE_PROFILE_KEYS, 'mediterranean']);

/**
 * The pipeline's REAL terrain vocabulary — the seven tokens `terrainOverride` accepts
 * and `getTerrainType` returns. Spelled out rather than imported because the pipeline
 * exposes no frozen export of them; `calibrationVocabularyReceipt` below carries the
 * count so a drift is at least visible to the suite's arithmetic.
 */
export const CALIBRATION_TERRAINS = Object.freeze([
  'plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert',
]);

/** Terrain paired with the route that honestly reaches its resources (golden master). */
export const CALIBRATION_TERRAIN_ROUTE = Object.freeze({
  plains: 'road', hills: 'road', forest: 'isolated',
  riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road',
});

/** The four canonical threat levels, rotated by row index. */
export const CALIBRATION_THREATS = Object.freeze(['safe', 'civilized', 'frontier', 'plagued']);

/**
 * The frozen seed pool. TWELVE seeds, rotated by row index — the dimension the golden
 * master holds fixed and the one that dominates the calibration quantity. The strings
 * are arbitrary labels; only their FIXEDNESS matters, so they may never be re-rolled
 * without re-recording the manifest and saying so in the suite's shift record.
 */
export const CALIBRATION_SEEDS = Object.freeze([
  'cg1-seed-00', 'cg1-seed-01', 'cg1-seed-02', 'cg1-seed-03',
  'cg1-seed-04', 'cg1-seed-05', 'cg1-seed-06', 'cg1-seed-07',
  'cg1-seed-08', 'cg1-seed-09', 'cg1-seed-10', 'cg1-seed-11',
]);

/**
 * @typedef {{ settType: string, culture: string, terrainOverride: string,
 *   tradeRouteAccess: string, monsterThreat: string, _seed: string }} CalibrationRow
 */

/**
 * THE CORPUS, built by the selection rule in this file's header.
 *
 * @returns {CalibrationRow[]} 504 rows in a fixed enumeration order
 */
export function calibrationRows() {
  /** @type {CalibrationRow[]} */
  const rows = [];
  let index = 0;
  for (const settType of CARTOGRAPHY_TIERS) {
    for (const culture of CALIBRATION_CULTURES) {
      for (const terrainOverride of CALIBRATION_TERRAINS) {
        rows.push({
          settType,
          culture,
          terrainOverride,
          tradeRouteAccess: CALIBRATION_TERRAIN_ROUTE[terrainOverride],
          monsterThreat: CALIBRATION_THREATS[index % CALIBRATION_THREATS.length],
          _seed: CALIBRATION_SEEDS[index % CALIBRATION_SEEDS.length],
        });
        index += 1;
      }
    }
  }
  return rows;
}

/**
 * The corpus's own shape, so the suite can close the arithmetic instead of trusting a
 * remembered figure. A vocabulary that drifts moves one of these and reds the walker.
 * @returns {{ tiers: number, cultures: number, terrains: number, threats: number,
 *   seeds: number, rows: number }}
 */
export function calibrationVocabularyReceipt() {
  return {
    tiers: CARTOGRAPHY_TIERS.length,
    cultures: CALIBRATION_CULTURES.length,
    terrains: CALIBRATION_TERRAINS.length,
    threats: CALIBRATION_THREATS.length,
    seeds: CALIBRATION_SEEDS.length,
    rows: CARTOGRAPHY_TIERS.length * CALIBRATION_CULTURES.length * CALIBRATION_TERRAINS.length,
  };
}

/**
 * The manifest key for one row. Same shape as the golden master's key so the two
 * corpora are visibly siblings.
 * @param {CalibrationRow} row
 * @returns {string}
 */
export function calibrationKeyOf(row) {
  return [
    row.settType, row.culture, row.terrainOverride,
    row.tradeRouteAccess, row.monsterThreat, row._seed,
  ].join('|');
}

/**
 * THE PREMISE CLASSES this corpus distinguishes. Derived from the stage's own message
 * text, which is the only place the stage states which ceiling it refused against.
 * `other` is deliberately present and deliberately expected to be empty: a premise
 * class this corpus has never seen must be LOUD rather than silently folded into one
 * of the known two.
 */
export const CALIBRATION_OUTCOMES = Object.freeze(['ok', 'binding-cap', 'tc4-bytes', 'other']);

/**
 * Classify one thrown premise by the stage's own words, and lift out the integers the
 * message states. Nothing here recomputes those integers.
 *
 * @param {string} message
 * @returns {{ outcome: string, reported: number[] }}
 */
export function classifyCalibrationFailure(message) {
  const cap = /(\d+) institution bindings exceed the \w+ cap of (\d+)/.exec(message);
  if (cap) return { outcome: 'binding-cap', reported: [Number(cap[1]), Number(cap[2])] };
  const bytes = /the TC-4 layer measures (\d+) bytes against the \w+ band of (\d+)/.exec(message);
  if (bytes) return { outcome: 'tc4-bytes', reported: [Number(bytes[1]), Number(bytes[2])] };
  return { outcome: 'other', reported: [] };
}

/**
 * THE TWO READINGS OF "THE SAME FOOTPRINT", and why there are exactly two.
 *
 * TE-CG-2 measured the drawn corpus under five readings before choosing. Two of them
 * are the ones that mean something different from each other:
 *
 *   EXACT      — the same vertex list at the same absolute coordinates. Two buildings
 *                that read exact are not a repeated shape, they are one building
 *                standing INSIDE another, and `cartographyProperty.js` subtracts
 *                member footprints from the parcel ring under an EVEN-ODD fill, so a
 *                stacked pair cancels its own hole and the yard renders as solid
 *                ground. This is never correct at any tier and its ceiling is zero.
 *   TRANSLATE  — the same shape and size, somewhere else. This is the reading that
 *                means "copy-paste on the map", and it is legitimately TIER-SCALED:
 *                `PLAN_UNIT_CM_BY_TIER` makes a thorp's plan unit 10 cm to a
 *                metropolis's 80, and a thorp genuinely is a dozen of the same
 *                cottage. Its ceiling therefore bands by tier.
 *
 * The three readings NOT recorded, and why: cycle-canonical-exact measured identically
 * to exact on all 53,420 pre-fix rows (a duplicate always shared its vertex order too),
 * full SSS congruence is translate plus rotation and moves the number without changing
 * what a reader sees, and area-within-1% reads 95% pre-fix and 76% post-fix because
 * four class shrinks over one parcel fan simply produce similar areas — it measures
 * the shrink ladder, not repetition.
 *
 * Both count ROWS IN A DUPLICATE GROUP, not pairs and not groups: the question the
 * defect asks is "how many drawn buildings look like another one", so a group of five
 * contributes five.
 */

/** @param {unknown} footprint @returns {string} the exact reading's key */
export function exactFootprintKey(footprint) {
  return JSON.stringify(footprint);
}

/**
 * The translate reading's key: vertices re-based on each starting vertex in turn, the
 * codepoint-least spelling kept. Rotating the start is what makes it a reading of the
 * SHAPE rather than of the array — the packer emits a cell's vertices in the parent's
 * winding, so the same shape can arrive at two different starting corners.
 * @param {unknown} footprint @returns {string}
 */
export function translateFootprintKey(footprint) {
  const points = Array.isArray(footprint) ? footprint : [];
  let best = '';
  for (let start = 0; start < points.length; start++) {
    const origin = points[start];
    /** @type {Array<[number, number]>} */
    const rebased = [];
    for (let step = 0; step < points.length; step++) {
      const point = points[(start + step) % points.length];
      rebased.push([point[0] - origin[0], point[1] - origin[1]]);
    }
    const spelling = JSON.stringify(rebased);
    if (best === '' || spelling < best) best = spelling;
  }
  return best;
}

/**
 * How many of `buildings` share their footprint with at least one OTHER row of the
 * same block, under `keyOf`. Zero for a block of one, by construction.
 * @param {ReadonlyArray<unknown>} buildings
 * @param {(footprint: unknown) => string} keyOf
 * @returns {number}
 */
export function duplicateFootprintRows(buildings, keyOf) {
  /** @type {Map<string, number>} */
  const seen = new Map();
  for (const row of buildings) {
    const key = keyOf(record(row).footprint);
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  let rows = 0;
  for (const count of seen.values()) if (count > 1) rows += count;
  return rows;
}

/**
 * MEASURE ONE ROW through the real pipeline and the real compiler.
 *
 * The dark compile is run first and separately, because a dark failure and a lit
 * failure are different diseases: dark is the base manifest refusing the settlement,
 * lit is the cartography stage refusing the base manifest. Folding them together would
 * let a base-level regression wear the cartography stage's name.
 *
 * ── THE TWO LIT FIGURES, AND WHY THEY ARE −1 ON A THROW ──────────────────────
 * `cartoBuildings` and `cartoRowBytes` are the TC-4 layer's own emitted row count and
 * its own UTF-8 size, read off the block the stage produced and serialized with the
 * stage's OWN `stableSceneStringify` — the same function cartographyBuildings.js
 * measures itself with at the line that raises the byte premise. They are the
 * calibration input `CARTOGRAPHY_CALIBRATION.MAX_BUILDING_ROW_BYTES` derives from.
 *
 * They read −1 when the lit compile threw, and that is not a gap to paper over: a
 * settlement that could not draw has no drawn size. It is also why the byte
 * calibration could not be taken at the base this corpus was first recorded against
 * — 287 of 504 rows threw before the figure existed — and the packet states that
 * bootstrap rather than hiding it.
 *
 * ── THE TWO DUPLICATE COUNTS (TE-CG-2) ──────────────────────────────────────
 * `cartoDupExact` and `cartoDupTranslate` are the drawn block's own duplicate-footprint
 * census under the two readings above, recorded per row so the rate is a property of
 * the CORPUS rather than of whichever settlement a reviewer happened to open. They
 * read −1 on a row that could not draw, for the same reason the two byte figures do.
 *
 * @param {CalibrationRow} row
 * @returns {{ key: string, tier: string, institutions: number, districts: number,
 *   sceneBuildings: number, dark: string, outcome: string, reported: number[],
 *   cartoBuildings: number, cartoRowBytes: number, cartoInstitutionRefs: number,
 *   cartoDupExact: number, cartoDupTranslate: number }}
 */
export function measureCalibrationRow(row) {
  const { _seed, ...config } = row;
  const settlement = generateSettlementPipeline(config, null, { seed: _seed, customContent: {} });

  let districts = -1;
  let sceneBuildings = -1;
  let dark = 'ok';
  try {
    const manifest = compileTownSceneManifest(
      { settlement, audience: 'dm' },
      { namingPools: NAMING_DATA },
    );
    districts = Array.isArray(manifest.districts) ? manifest.districts.length : -1;
    sceneBuildings = Array.isArray(manifest.buildings) ? manifest.buildings.length : -1;
  } catch (error) {
    dark = `throw: ${error instanceof Error ? error.message : String(error)}`;
  }

  let outcome = 'ok';
  /** @type {number[]} */
  let reported = [];
  let cartoBuildings = -1;
  let cartoRowBytes = -1;
  let cartoInstitutionRefs = -1;
  let cartoDupExact = -1;
  let cartoDupTranslate = -1;
  try {
    const lit = compileTownSceneManifest(
      { settlement, audience: 'dm', worldState: LIT_RULES },
      { namingPools: NAMING_DATA },
    );
    const buildings = record(record(lit).cartography).buildings;
    if (Array.isArray(buildings) && buildings.length > 0) {
      cartoBuildings = buildings.length;
      const bytes = new TextEncoder().encode(stableSceneStringify({ buildings })).byteLength;
      // Per ROW, rounded UP: the band the derivation reads is a per-row ceiling, and a
      // ceiling that rounded down would be one byte short of the row it measured.
      cartoRowBytes = Math.ceil(bytes / buildings.length);
      // THE IDENTITY QUANTITY, and it is the one the suite's W3 control turns on. Every
      // bound institution draws a FLAGSHIP unconditionally, so the number of DISTINCT
      // institutionRefs the drawn block carries is the binding count — produced by
      // cartographyParcels.js's binder, entirely independently of the roster length the
      // pipeline wrote. Recorded on every row that draws, so the control survives the
      // cure: the old control read the binding count out of a THROWN premise message,
      // which stops existing the moment the caps admit the roster.
      cartoInstitutionRefs = new Set(
        buildings.map((row) => record(row).institutionRef).filter((ref) => typeof ref === 'string'),
      ).size;
      cartoDupExact = duplicateFootprintRows(buildings, exactFootprintKey);
      cartoDupTranslate = duplicateFootprintRows(buildings, translateFootprintKey);
    }
  } catch (error) {
    const classified = classifyCalibrationFailure(
      error instanceof Error ? error.message : String(error),
    );
    outcome = classified.outcome;
    reported = classified.reported;
  }

  return {
    key: calibrationKeyOf(row),
    tier: row.settType,
    institutions: Array.isArray(settlement.institutions) ? settlement.institutions.length : -1,
    districts,
    sceneBuildings,
    dark,
    outcome,
    reported,
    cartoBuildings,
    cartoRowBytes,
    cartoInstitutionRefs,
    cartoDupExact,
    cartoDupTranslate,
  };
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** The stride the committed sample uses. Frozen: changing it changes what CI proves. */
export const CALIBRATION_SAMPLE_STRIDE = 11;

/**
 * THE COMMITTED SAMPLE, and the rule that selects it — pinned here so the suite proves
 * the rule rather than a hand-picked list.
 *
 * The manifest is a frozen measurement, and a frozen measurement decays silently. The
 * sample is what re-measures it LIVE on every run at a cost the suite can carry: a
 * fixed stride through the corpus, UNIONED with the row that carries each tier's
 * recorded maximum institution count. The stride gives breadth; the argmax rows give
 * the only rows whose drift can move a ceiling, which is the property the corpus is
 * for. Rows are returned in corpus order, de-duplicated.
 *
 * ⚠ ACCEPTED COST, stated rather than hidden: drift confined to a NON-sampled,
 * NON-argmax row is invisible until the next full re-record. That is the price of not
 * running 504 full pipelines per suite; the argmax union is what keeps the price off
 * the figures the manifest actually asserts.
 *
 * @param {ReadonlyArray<{ key: string, tier: string, institutions: number }>} recorded
 * @param {number} [stride]
 * @returns {string[]} manifest keys, in corpus order
 */
export function calibrationSampleKeys(recorded, stride = CALIBRATION_SAMPLE_STRIDE) {
  const order = new Map(recorded.map((entry, index) => [entry.key, index]));
  /** @type {Set<string>} */
  const picked = new Set();
  for (let index = 0; index < recorded.length; index += stride) picked.add(recorded[index].key);
  /** @type {Map<string, { key: string, institutions: number }>} */
  const argmax = new Map();
  for (const entry of recorded) {
    const best = argmax.get(entry.tier);
    if (!best || entry.institutions > best.institutions) argmax.set(entry.tier, entry);
  }
  for (const entry of argmax.values()) picked.add(entry.key);
  return [...picked].sort((left, right) => (order.get(left) ?? 0) - (order.get(right) ?? 0));
}
