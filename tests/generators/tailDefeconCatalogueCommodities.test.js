/**
 * tailDefeconCatalogueCommodities.test.js — TAIL-DEFECON-C-4 (the chair's ruling D34, 2026-11-15): THE CATALOGUE'S
 * FALSE COMMODITIES. `src/data/resourceData.js` bundled a good with a resource that does not give it, and the land gate
 * is per resource, so one house at the resource admitted the bundled good onto the made list: a river fishery's SALT,
 * a precious-metal vein's GEMS, the hot springs' MEDICINAL HERBS (both hot-springs keys). The good leaves that
 * resource's `commodities`; the salt flats, the herb grounds and the groves keep theirs; a grove's honey and an oasis's
 * dates are kept as true. (Fishing grounds' salt is the next block: made only where a Salt works stands.)
 *
 * Born as the census born its 720 (RECORD-MEASURE-1, `seedcfg.mjs`, both arms). Each GONE row was red at 0e838bc65 and
 * names a good the town still makes; each KEEP row is green before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
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
/** @param {string} key @returns {string[]} */
const commoditiesOf = (key) => /** @type {any} */ (RESOURCE_DATA)[key].commodities;

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('D34: the catalogue bundles no good a resource does not give', () => {
  test('each resource gives no bundled good; it still gives its own (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['river_fish', 'salt', 'fish'],
      ['precious_metals', 'gems', 'luxury'],
    ], ([key, gone, still]) => {
      expectAbsentWithAnchor(commoditiesOf(key), gone, still, `${key}: the good it does not give, beside one it gives`);
      expect(commoditiesOf(key), `${key} gives no "${gone}" (it still gives "${still}")`).toContain(still);
    }), 'D34: a resource gives no good it does not give, and still gives its own');
  });
  test('each hot springs gives no medicinal herbs (it gives no commodity: its goods are its trade goods) (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([['hot_springs'], ['hot_springs_mineral']], ([key]) => {
      expect(commoditiesOf(key), `${key} gives no medicinal herbs (it gives no commodity)`).toEqual([]);
      expect(/** @type {any} */ (RESOURCE_DATA)[key].tradeGoods.length, `${key}: its goods are its trade goods`).toBeGreaterThan(0);
    }), 'D34: the hot springs give no commodity, and keep their trade goods');
  });
  test('KEPT: each resource still gives its good (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['salt_flats', 'salt'], ['desert_salt', 'salt'], ['foraging_areas', 'medicinal_herbs'], ['ancient_grove', 'medicinal_herbs'],
      ['ancient_grove', 'honey'], ['oasis_water', 'dates'], ['date_palms', 'dates'],
    ], ([key, good]) => {
      expect(commoditiesOf(key), `KEPT: ${key} still gives "${good}"`).toContain(good);
    }), 'D34: every kept resource still gives its good');
  });
});

/** (seed, the good the resource does not give, a good the town still makes) */
const GONE = [
  ['r2r-thorp-44', 'salt', 'fish'],              // a river fishery, no salt land
  ['r2r-hamlet-40', 'gems', 'grain'],            // a precious-metal vein, no gem deposit
  ['r2r-thorp-12', 'medicinal herbs', 'grain'],  // hot springs, no herb ground
  ['r2r-thorp-16', 'medicinal herbs', 'wool'],   // mineral hot springs, no herb ground
];
/** (seed, the good, kept where the land that gives it lies) */
const KEEP = [
  ['r2r-thorp-24', 'salt'],              // the salt flats
  ['r2r-thorp-1', 'medicinal herbs'],    // foraging areas beside the hot springs
  ['r2r-thorp-7', 'medicinal herbs'],    // an ancient grove beside the mineral hot springs
];

describe('D34: the made list holds no bundled good the land does not give', () => {
  test('each GONE town lists no bundled good; it still makes its own (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(GONE, ([seed, gone, still]) => {
      const list = madeIn(seed);
      expectAbsentWithAnchor(list, gone, still, `${seed}: the bundled good, beside a good the town makes`);
      expect(list, `${seed} lists no "${gone}"; it still makes "${still}"`).toContain(still);
    }), 'D34: no GONE town lists the bundled good, and each still makes its own');
  });
  test('each KEEP town still lists its good (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, good]) => {
      expect(madeIn(seed), `${seed} still lists "${good}"`).toContain(good);
    }), 'D34: every KEEP town still lists the good its land gives');
  });
  test('the inheritor: r2r-thorp-44, which makes no salt, imports it as a necessity', () => {
    expect(town('r2r-thorp-44').economicState.necessityImports).toContain('Salt');
  });
});

/**
 * D34, FISHING GROUNDS: they give no salt WITHOUT A SALT WORKS (the ruling's words). The commodity stays in the data (a
 * coast's Salt works boils or pans its salt; taking it out would tell 14 coastal salt works they lack salt), and the
 * made list asks a Salt works for the coast's salt (`computeActiveChains.js :: LAND_GOOD_HOUSES`, by resource: the salt
 * flats' and the desert's salt keep the land's gate). 25 towns at 680d16b54, the made list alone.
 */
const GONE_COAST = [
  ['r2r-thorp-22', 'fish'],   // a Fishing community, no salt works
  ['r2r-hamlet-26', 'fish'],  // a Fisher's landing, no salt works
];
const KEEP_COAST = ['r2r-hamlet-8', 'r2r-hamlet-53', 'r2r-village-51']; // fishing grounds and a Salt works, no salt land

describe('D34: the coast\'s salt is made only where a salt works stands', () => {
  test('the data keeps the coast\'s salt', () => {
    expect(commoditiesOf('fishing_grounds')).toEqual(['fish', 'salt']);
  });
  test('each coast with no salt works lists no "salt"; it still makes its own (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(GONE_COAST, ([seed, still]) => {
      const list = madeIn(seed);
      expectAbsentWithAnchor(list, 'salt', still, `${seed}: no salt without a salt works, beside a good the town makes`);
      expect(list, `${seed} lists no "salt"; it still makes "${still}"`).toContain(still);
    }), 'D34: no coast without a salt works lists salt, and each still makes its own');
  });
  test('each coast with a Salt works still lists "salt" (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP_COAST, (seed) => {
      expect(town(seed).config.nearbyResources, `${seed}: on the fishing grounds`).toContain('fishing_grounds');
      expect(town(seed).institutions.map((/** @type {any} */ i) => String(i.name)), `${seed}: its Salt works stands`).toContain('Salt works');
      expect(madeIn(seed), `${seed} still lists "salt" (its Salt works stands on the fishing grounds)`).toContain('salt');
    }), 'D34: every coast with a Salt works still lists salt');
  });
});

/**
 * R11 (RULING-R, the eleventh chair, 2026-11-27; its ruling 123-1): THE DATE PALMS GIVE DATES, NOT GRAIN. The catalogue
 * bundled grain with the palms (commodities grain and dates, the trade good "Desert grain"), so a place whose food record
 * names no grain listed grain among what it makes and exported "Desert grain" (V dp-thorp-22 of the whole-town measure).
 * The palms give dates, and their third trade good is "Pressed dates" in the grain good's place, so no export list changes
 * its length. A palm place beside grain fields still makes grain.
 */
const GONE_PALMS = ['r2r-thorp-4', 'r2r-thorp-95']; // date palms, no grain among the food sources
const KEEP_PALMS = ['r2r-hamlet-14'];               // date palms beside grain fields

describe('R11: the date palms give dates, not grain', () => {
  test('the data: the palms give dates and no grain; their trade goods name dates, never grain', () => {
    expectAbsentWithAnchor(commoditiesOf('date_palms'), 'grain', 'dates', 'date_palms: no grain, beside the dates it gives');
    expect(/** @type {any} */ (RESOURCE_DATA).date_palms.tradeGoods).toEqual(['Date harvest', 'Dried fruit', 'Pressed dates']);
  });
  test('each palm town with no grain source lists no grain and exports no "Desert grain"; it still makes dates (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(GONE_PALMS, (seed) => {
      const t = town(seed);
      expect(t.config.nearbyResources, `${seed}: among the date palms`).toContain('date_palms');
      // anchored: the KEEP row below reads this same list on a palm town and finds its grain, so the path cannot go empty unseen
      expect(t.economicState.foodSecurity.foodRecord.foodSources, `${seed}: its food record names no grain`).not.toContain('grain');
      expectAbsentWithAnchor(madeIn(seed), 'grain', 'dates', `${seed}: no grain the land does not give, beside the dates it makes`);
      expectAbsentWithAnchor(t.economicState.primaryExports, 'Desert grain', 'Pressed dates', `${seed}: the palms' good, in the grain good's place`);
    }), 'R11: no palm town without a grain source makes or exports grain, and each still makes dates');
  });
  test('a palm town beside grain fields still makes grain (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP_PALMS, (seed) => {
      expect(town(seed).economicState.foodSecurity.foodRecord.foodSources, `${seed}: its grain fields`).toContain('grain');
      expect(madeIn(seed), `${seed} still lists "grain"`).toContain('grain');
    }), 'R11: a palm town with grain fields still makes grain');
  });
});
