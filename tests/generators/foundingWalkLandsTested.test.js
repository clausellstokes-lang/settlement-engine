/**
 * tests/generators/foundingWalkLandsTested.test.js — R2-CODE-A-12, the chair's ruling (2) (2026-11-14) on the reader's
 * MEDIUM (c) (REVIEW-R2-CODE-A, step 2 #1) and the bar's #300.
 * `foundingRowAdmits.js :: admittedRow` resolves a refused Origin row to "the next admitted row" of its pool (the
 * terrain's rows, then the commodity hooks), and an untested row was admitted everywhere: 95 of the 436 moved rows
 * landed on "was founded on rich farmland granted to a favoured noble", 81 with no crop (`r2r-thorp-8`); "grew around
 * a ferry crossing that became the first bridge only three generations ago" printed beside a River ferry and no bridge
 * (bar0-village-calm-rand-1). THE RULING: "the next admitted row" is a row whose own test holds; every row a walk can
 * land on carries a test; the farmland row names a grant, so it joins the founder pass-over.
 *   W1 every row a walk can land on (any terrain pool, alone or with any commodity hooks) carries its own test, or
 *      is one of the rows true of the pool's own key (its terrain, its route, its commodity), named by identity;
 *   W2 the collected towns: the false rows gone, and the row printed passes its own test on the final record;
 *   W3 the guard towns: each cured row still prints where the record makes it true.
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { TERRAIN_NARRATIVE_HOOKS } from '../../src/data/narrativeData.js';
import { FOUNDING_REASON_ADMITS, NAMES_A_FOUNDER, foundingStateOf } from '../../src/generators/narrative/foundingRowAdmits.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`) and the bar's (`render.bar0.jsx`), verbatim. @param {string} seed */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} }));
  const m = /** @type {RegExpExecArray} */ (/^(?:rr3x?|bar0)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
};
/** @param {any} s */
const reasonHolds = (s) => {
  const test = FOUNDING_REASON_ADMITS[String(s.history.founding.reason)];
  return !test || test(/** @type {any} */ (foundingStateOf(s.config, { _institutions: s.institutions }, null)));
};

/** The commodity hooks, read from their home (`narrativeGenerator.js :: genArrivalDetail`), pool by pool. */
const commodityPools = () => {
  const src = readFileSync(new URL('../../src/generators/narrativeGenerator.js', import.meta.url), 'utf8');
  const block = src.slice(src.indexOf('const COMMODITY_HOOKS'), src.indexOf('const commodityHooks'));
  /** @type {Record<string, string[]>} */ const pools = {}; let cur = '';
  for (const line of block.split('\n')) {
    const key = /^\s*(\w+): \[/.exec(line); if (key) { cur = key[1]; pools[cur] = []; continue; }
    const row = /^\s*["'](.*?)["'],?\s*$/.exec(line); if (row && cur) pools[cur].push(row[1].replace(/\\'/g, "'"));
  }
  return pools;
};

/** The untested rows a walk can land on, each true of its pool's own key (the pool is chosen by it). */
const TRUE_OF_THE_POOL = new Set([
  TERRAIN_NARRATIVE_HOOKS.crossroads[0], TERRAIN_NARRATIVE_HOOKS.crossroads[2], // a crossroads
  TERRAIN_NARRATIVE_HOOKS.river[0], // a river
  TERRAIN_NARRATIVE_HOOKS.road[0], // a road
  TERRAIN_NARRATIVE_HOOKS.isolated[2], // isolated
  TERRAIN_NARRATIVE_HOOKS.mountain[1], TERRAIN_NARRATIVE_HOOKS.mountain[5], // the mountains' pass
  'developed where two droving roads crossed, because animals needed water and drovers needed ale', // the livestock hooks
  "attracted practitioners seeking ingredients found nowhere else within three days' travel", // the alchemy hooks
]);

describe('the Origin walk lands only on a row whose own test holds', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('W1: every row a walk can land on carries its own test, or is true of its pool by identity', () => {
    const com = commodityPools();
    expect(Object.keys(com).length).toBeGreaterThan(5);
    /** @type {Set<string>} */ const landable = new Set();
    for (const tp of Object.values(TERRAIN_NARRATIVE_HOOKS)) for (const extra of [[], ...Object.values(com)]) {
      const pool = [...tp, ...extra];
      pool.forEach((row, i) => {
        if (!FOUNDING_REASON_ADMITS[row]) return; // a walk starts only at a refused, so tested, row
        for (let k = 1; k < pool.length; k++) {
          const r = pool[(i + k) % pool.length];
          if (FOUNDING_REASON_ADMITS[r] || NAMES_A_FOUNDER.has(r)) continue;
          landable.add(r); break;
        }
      });
    }
    expect(landable.size).toBeGreaterThan(0);
    expect(new Set([...landable].filter((r) => !FOUNDING_REASON_ADMITS[r]))).toEqual(TRUE_OF_THE_POOL);
  });

  it('W2: the collected towns print no false Origin row, and the row they print passes its own test (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['r2r-thorp-8', /rich farmland granted/], // the reader's town: farmland, no crop
      ['bar0-village-calm-rand-1', /ferry crossing that became the first bridge/], // the bar's #300: a ferry, no bridge
      ['rr3-thorp-calm-rand-4', /rich farmland granted/], ['rr3-thorp-under_siege-rand-4', /ferry crossing that became/],
      ['rr3-hamlet-mass_migration-rand-1', /^grew from a logging camp$/], ['rr3-village-under_siege-rand-4', /^grew from a logging camp$/],
      ['rr3-thorp-famine-rand-0', /herders gathered/], ['rr3-thorp-religious_conversion-rand-5', /grain storage depot/],
    ], ([seed, gone]) => {
      const s = born(/** @type {string} */ (seed));
      expect(typeof s.history?.founding, `${seed}: a founding`).toBe('object');
      expect(reasonHolds(s), `${seed}: the printed row passes its own test`).toBe(true);
      expect(String(s.history.founding.reason), `${seed}: the false row is gone`).not.toMatch(/** @type {RegExp} */ (gone)); // anchored: the line above asserts the row printed is true here; red at e6b636fd7 (8 of 8)
    }), 'W2: the collected towns');
  });

  it('W3: the guard towns keep each cured row where the record makes it true (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['rr3x-metropolis-wartime-crossroads-1', /rich farmland granted/],
      ['rr3x-metropolis-succession_void-river-2', /ferry crossing that became the first bridge/],
      ['rr3x-metropolis-religious_conversion-isolated-0', /^grew from a logging camp$/],
      ['rr3x-metropolis-plague_onset-crossroads-0', /herders gathered/],
      ['rr3x-metropolis-religious_conversion-road-0', /grain storage depot/],
    ], ([seed, kept]) => {
      const s = born(/** @type {string} */ (seed));
      expect(String(s.history.founding.reason), `${seed}: the row, true here`).toMatch(/** @type {RegExp} */ (kept));
      expect(reasonHolds(s), `${seed}: its test holds`).toBe(true);
    }), 'W3: the guard towns');
  });
});
