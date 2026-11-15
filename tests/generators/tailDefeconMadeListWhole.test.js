/**
 * tailDefeconMadeListWhole.test.js — TAIL-DEFECON-C-3 (the chair's ruling D30, 2026-11-15): THE MADE LIST, FINISHED.
 * The record's made list (`economicState.localProduction`, written by `computeActiveChains.js ::
 * deriveLocalProductionFromChains`) names a good only where the town can make it.
 *
 * (a) A MADE GOOD is listed only where a house that makes or works it stands, read by THE WHOLE TABLE
 *     (GOOD_WORKING_HOUSES, the one table the export steps read), not only for the outputs the export gates by a house:
 *     a brewing chain run by a Brewer lists no barrels without a Cooper; a Hunter's lodge makes no bows; a Weaver dyes
 *     no cloth; a Wayside shrine keeps no inn. (91 towns at 906ff0352; the made list alone moves.)
 *
 * Born as the census born its 720 (RECORD-MEASURE-1, `seedcfg.mjs`, both arms). Each GONE row was red at the base
 * (906ff0352) and names a good the town still makes; each KEEP row is the same good where its house stands, green
 * before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

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
  ['r2r-town-21', 'Arrows (sheaf)', 'Leather goods'],                   // no bowyer
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

describe('D30 (a): a made good is listed only where a house of the whole table makes or works it', () => {
  test.each(GONE_A)('%s lists no "%s"; it still makes "%s"', (seed, gone, still) => {
    const list = madeIn(seed);
    expect(list).not.toContain(gone);
    expect(list).toContain(still);
  });
  test.each(KEEP_A)('%s still lists "%s" (its %s stands)', (seed, good, house) => {
    expect(madeIn(seed)).toContain(good);
    expect(birth(seed).institutions.map((/** @type {any} */ i) => String(i.name)).some((n) => n.includes(house))).toBe(true);
  });
});
