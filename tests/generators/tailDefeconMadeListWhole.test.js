/**
 * tailDefeconMadeListWhole.test.js — TAIL-DEFECON-C-3 (the chair's ruling D30, 2026-11-15): THE MADE LIST, FINISHED.
 * The record's made list (`economicState.localProduction`, written by `computeActiveChains.js ::
 * deriveLocalProductionFromChains`) names a good only where the town can make it.
 *
 * (a) A MADE GOOD is listed only where a house that makes or works it stands, read by THE WHOLE TABLE
 *     (GOOD_WORKING_HOUSES, the one table the export steps read), not only for the outputs the export gates by a house:
 *     a brewing chain run by a Brewer lists no barrels without a Cooper; a Hunter's lodge makes no bows; a Weaver dyes
 *     no cloth; a Wayside shrine keeps no inn. (91 towns at 906ff0352; the made list alone moves.)
 * (b) A GATHERED OR HERDED GOOD (medicinal herbs, animal hides, wool, timber, clay: a land's commodity that a resource
 *     chain takes as its raw) is listed only where a house of the town works that chain, asked as the record's own
 *     exploitation asks it (the chain's processing tags or processors; a chain the terrain does not allow is not
 *     modelled, so not "unexploited"): the made list and `resourceAnalysis.exploitation` agree (D15). (123 towns at
 *     ea788e17c, exactly the towns whose made list held a raw the record names unexploited; the made list alone moves.)
 *     Coal and peat stay as designed (no chain takes them).
 *
 * Born as the census born its 720 (RECORD-MEASURE-1, `seedcfg.mjs`, both arms). Each GONE row was red at the base
 * (906ff0352) and names a good the town still makes; each KEEP row is the same good where its house stands, green
 * before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { madeListTerrainAllowsRaw } from '../../src/generators/computeActiveChains.js';
import { terrainAllowsResource } from '../../src/generators/resourceGenerator.js';
import { TERRAIN_DATA } from '../../src/data/geographyData.js';
import { RESOURCE_CHAINS } from '../../src/data/goods/chains.js';
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
/** @type {Map<string, string[]>} */
const made = new Map();
/** @param {string} seed */
const madeIn = (seed) => {
  if (!made.has(seed)) made.set(seed, /** @type {string[]} */ (birth(seed).economicState.localProduction || []));
  return /** @type {string[]} */ (made.get(seed));
};

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** (a) (seed, the good no house of the town makes or works, a good the town still makes) */
const GONE_A = [
  ['r2r-hamlet-27', 'Barrels and containers', 'Potions and elixirs'],   // no cooper
  ['r2r-village-16', 'Barrels and containers', 'Ale (barrel)'],         // a Brewer, no cooper
  ['r2r-town-1', 'Bows and crossbows', 'Furs and pelts'],               // a Hunter's lodge, no bowyer
  // RE-KEYED BY IDENTITY (SEAM-ECON item 6, 2026-11-17; BRIEF-BAR6-SEAM rule S5): BAR6-RECORD's declared cure (b) lists the
  // leatherworkers' goods only beside a cobbler, so this town (a tanner, no cobbler) no longer makes its sibling 'Leather
  // goods'; the same town and the same unmade good are kept, beside a good it still makes (its cooper's).
  ['r2r-town-21', 'Arrows (sheaf)', 'Barrels and containers'],          // no bowyer
  ['r2r-village-6', 'Dyed cloth', 'Preserved foods'],                   // a Tailor, no dyer
  ['r2r-town-19', 'Dyed cloth', 'Finished clothing'],                   // Weavers and a Tailor's guild, no dyer
  ['r2r-village-14', 'Hospitality for travellers', 'Salted fish'],      // no inn, tavern, alehouse, bath, waystation
  ['r2r-village-26', 'Hospitality for travellers', 'Medical care (basic)'], // a divine Healer, no inn
  ['r2r-hamlet-6', 'Quality tools and weapons', 'iron'],                // no smith or metalworker
  ['r2r-hamlet-40', 'Advanced weapons and armor', 'Honey and beeswax'], // no smith or metalworker
  ['r2r-village-5', 'River craft', 'Cargo barges'],                     // a River ferry, no shipyard or boatyard
  ['r2r-city-19', 'Ship construction', 'Information brokerage'],       // no shipyard or boatyard
  ['r2r-city-19', 'Ocean-going vessels', 'Information brokerage'],     // no shipyard
];
/** (a) (seed, the good, the house that makes it there) */
const KEEP_A = [
  ['r2r-village-36', 'Barrels and containers', 'Cooper'],
  ['r2r-village-29', 'Bows and crossbows', 'Bowyer'],
  ['r2r-village-55', 'Dyed cloth', 'Dyer'],
];

/** (b) (seed, the raw the record names unexploited, a good the town still makes) */
const GONE_B = [
  ['r2r-thorp-9', 'medicinal herbs', 'Honey and beeswax'],     // no apothecary, alchemist or healing house
  ['r2r-thorp-14', 'wool', 'Honey and beeswax'],               // no weaver, fuller or dyer
  ['r2r-thorp-14', 'animal hides', 'Honey and beeswax'],       // no tanner or leatherworker
  ['r2r-village-18', 'timber', 'Preserved foods'],             // no sawmill or carpenters' guild
];
/** (b) a town whose only good was such a raw: its list is empty, the Produced-locally row silent by design */
const EMPTIED_B = [['r2r-thorp-0', 'medicinal herbs'], ['r2r-thorp-41', 'medicinal herbs'],
  // RE-KEYED BY IDENTITY (TAIL-DEFECON-C-4, D34): a GONE row ("clay"; it still made "medicinal herbs", the hot springs'):
  // the springs give no herbs, so hamlet-18 lists nothing (no potter or brickmaker for its clay).
  ['r2r-hamlet-18', 'clay']];
/** (b) (seed, the raw, kept where a house of the town works its chain) */
const KEEP_B = [
  ['r2r-town-49', 'animal hides'],   // Tanners
  ['r2r-town-15', 'clay'],           // a Potter and a Brickmaker
  ['r2r-village-8', 'medicinal herbs'],
  ['r2r-hamlet-48', 'wool'],
  ['r2r-hamlet-12', 'timber'],
];

describe('D30 (b): a gathered or herded good is listed only where the record\'s exploitation works it', () => {
  test('each GONE_B town lists no unworked raw; it still makes its own (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(GONE_B, ([seed, gone, still]) => {
      const list = madeIn(seed);
      expectAbsentWithAnchor(list, gone, still, `${seed}: the unworked raw, beside a good the town makes`);
      expect(list, `${seed} lists no "${gone}"; it still makes "${still}"`).toContain(still);
    }), 'D30 (b): no GONE_B town lists the unworked raw, and each still makes its own');
  });
  test('each EMPTIED_B town lists no raw, and nothing else (silent by design) (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(EMPTIED_B, ([seed, gone]) => {
      expect(madeIn(seed), `${seed} lists no "${gone}", and nothing else (silent by design)`).toEqual([]);
      expect(gone, `${seed}: the row names its raw`).toBeTruthy();
    }), 'D30 (b): every EMPTIED_B town lists nothing');
  });
  test('each KEEP_B town still lists its raw (a house works its chain) (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP_B, ([seed, good]) => {
      expect(madeIn(seed), `${seed} still lists "${good}" (a house works its chain)`).toContain(good);
    }), 'D30 (b): every KEEP_B town still lists the raw a house of it works');
  });
});

test('D30 (b): the made list\'s terrain check is the exploitation record\'s own, on every terrain and every chain raw', () => {
  const raws = [...new Set(Object.values(RESOURCE_CHAINS).map((c) => String(/** @type {any} */ (c).rawResource)))];
  let pairs = 0;
  for (const [terrain, t] of Object.entries(TERRAIN_DATA)) for (const raw of raws) {
    const allowed = /** @type {any} */ (t).allowedResources || [];
    expect(madeListTerrainAllowsRaw(allowed, raw), `${terrain} / ${raw}`).toBe(terrainAllowsResource(allowed, raw));
    pairs++;
  }
  expect(pairs).toBeGreaterThan(50);
});

describe('D30 (a): a made good is listed only where a house of the whole table makes or works it', () => {
  test('each GONE_A town lists no unmade good; it still makes its own (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(GONE_A, ([seed, gone, still]) => {
      const list = madeIn(seed);
      expectAbsentWithAnchor(list, gone, still, `${seed}: the unmade good, beside a good the town makes`);
      expect(list, `${seed} lists no "${gone}"; it still makes "${still}"`).toContain(still);
    }), 'D30 (a): no GONE_A town lists the unmade good, and each still makes its own');
  });
  test('each KEEP_A town still lists the good its house makes (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP_A, ([seed, good, house]) => {
      expect(madeIn(seed), `${seed} still lists "${good}"`).toContain(good);
      expect(birth(seed).institutions.map((/** @type {any} */ i) => String(i.name)).some((n) => n.includes(house)), `${seed}: its ${house} stands`).toBe(true);
    }), 'D30 (a): every KEEP_A town still lists the good, and its house stands');
  });
});
