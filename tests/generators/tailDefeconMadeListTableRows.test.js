/**
 * tailDefeconMadeListTableRows.test.js — TAIL-DEFECON-C-4 (the chair's ruling D33, 2026-11-15): THE TABLE'S MISSING
 * ROWS. Flour, textiles, glass and pottery had no row in `computeActiveChains.js :: GOOD_WORKING_HOUSES`, so the made
 * list (`economicState.localProduction`) printed them where no house of the town makes them. The rows, read from the
 * catalogue's houses: flour by a GRAIN mill (Mill, Mills (2-5); not a Sawmill, not a Maltster), bread by Bakers, cloth by
 * Weavers/Textile workers or a Fuller, clothing by a Tailor or Tailor's guild, glass by a Glassblower or Glassmakers,
 * pottery by a Potter. A land's commodity under such a name (the grain fields' "flour", the mill site's "flour" and
 * "processed textiles", the glass sand's "glass", the river clay's "pottery") is asked too. The table also gates the
 * export steps: a chain's "Baked goods" or "Finished clothing" is not exported where no baker or tailor stands.
 * (117 towns at 65a5ecfcf: localProduction 117, primaryExports 21, economicComplexity 1; no other family.)
 *
 * Born as the census born its 720 (RECORD-MEASURE-1, `seedcfg.mjs`, both arms). Each GONE row was red at 65a5ecfcf and
 * names a good the town still makes or exports; each KEEP row is the same good where its house stands, green before
 * and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's birth (the r2r- and r2s- arms). @param {string} seed */
const birth = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(\w+)-\d+$/);
  const over = s ? { selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] }
    : { settType: /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/))[1] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, ...over }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const born = new Map();
/** @param {string} seed */
const town = (seed) => {
  if (!born.has(seed)) born.set(seed, birth(seed));
  return born.get(seed);
};
/** @param {string} seed @returns {string[]} */
const madeIn = (seed) => town(seed).economicState.localProduction || [];
/** @param {string} seed @returns {string[]} */
const exportedFrom = (seed) => town(seed).economicState.primaryExports || [];

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** (seed, the good no house of the town makes, a good the town still makes) */
const GONE = [
  ['r2r-thorp-12', 'flour', 'grain'],                        // grain fields, no house at all
  ['r2r-hamlet-31', 'flour', 'grain'],                       // a Maltster malts; it does not grind
  ['r2r-hamlet-31', 'Baked goods', 'grain'],                 // the grain chain run by a Maltster, no baker
  ['r2r-hamlet-44', 'processed textiles', 'peat'],           // the mill site worked by a Maltster: no weaver or fuller
  ['r2r-village-55', 'Processed textiles', 'livestock'],     // a Mill, no weaver or fuller
  ['r2r-village-55', 'Finished clothing', 'livestock'],      // no tailor
  ['r2r-thorp-10', 'glass', 'livestock'],                    // glass sand, no glassblower
  ['r2s-occupied-thorp-0', 'pottery', 'fish'],               // river clay, no potter (r2r-thorp-27's list is empty after D34)
  ['r2r-hamlet-2', 'Fine wool cloth', 'wool'],               // alpine wool, no weaver or fuller
];
/** (seed, the good, the house that makes it there) */
const KEEP = [
  ['r2r-village-1', 'flour', 'Mill'],
  ['r2r-town-2', 'Baked goods', 'Bakers'],
  ['r2r-town-19', 'processed textiles', 'Weavers'],
  ['r2r-town-0', 'Processed textiles', 'Weavers'],
  ['r2r-village-6', 'Finished clothing', 'Tailor'],
  ['r2r-metropolis-19', 'glass', 'Glassmakers'],
  ['r2r-metropolis-19', 'Window glass', 'Glassmakers'],
  ['r2r-town-15', 'pottery', 'Potter'],
  ['r2r-town-12', 'Fine wool cloth', 'Weavers'],
];
/** the export side: (seed, the good no house makes, a good the town still exports) */
const GONE_EXPORT = [
  ['r2r-hamlet-31', 'Baked goods', 'Grain surplus'],             // a Maltster, no baker
  ['r2s-indebted-town-1', 'Finished clothing', 'Dyed cloth'],    // a Dyer, no tailor
  ['r2r-hamlet-31', 'Milled flour', 'Grain surplus'],            // a Maltster, no grain mill
];
const KEEP_EXPORT = [['r2r-town-2', 'Baked goods', 'Bakers']];

describe('D33: flour, textiles, glass and pottery are made only where a house of the table makes them', () => {
  test('each GONE town lists no good no house makes; it still makes its own (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(GONE, ([seed, gone, still]) => {
      const list = madeIn(seed);
      expectAbsentWithAnchor(list, gone, still, `${seed} lists no "${gone}"; it still makes "${still}"`);
      expect(list, `${seed} lists no "${gone}"; it still makes "${still}"`).toContain(still);
    }), 'D33: no GONE town lists a good no house of it makes, and each still makes its own');
  });
  test('each KEEP town still lists the good its house makes (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, good, house]) => {
      expect(madeIn(seed), `${seed} still lists "${good}"`).toContain(good);
      expect(town(seed).institutions.map((/** @type {any} */ i) => String(i.name)).some((n) => n.includes(house)), `${seed}: its ${house} stands`).toBe(true);
    }), 'D33: every KEEP town still lists the good, and its house stands');
  });
  test('each GONE_EXPORT town exports no good no house makes; it still exports its own (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(GONE_EXPORT, ([seed, gone, still]) => {
      const list = exportedFrom(seed);
      expectAbsentWithAnchor(list, gone, still, `${seed} exports no "${gone}"; it still exports "${still}"`);
      expect(list, `${seed} exports no "${gone}"; it still exports "${still}"`).toContain(still);
    }), 'D33: no GONE_EXPORT town exports a good no house of it makes, and each still exports its own');
  });
  test('each KEEP_EXPORT town still exports the good its house makes (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP_EXPORT, ([seed, good, house]) => {
      expect(exportedFrom(seed), `${seed} still exports "${good}"`).toContain(good);
      expect(town(seed).institutions.map((/** @type {any} */ i) => String(i.name)).some((n) => n.includes(house)), `${seed}: its ${house} stand`).toBe(true);
    }), 'D33: every KEEP_EXPORT town still exports the good, and its house stands');
  });
});
