/**
 * W2-FIX-DATA-3 item 5 (the second seat's item 5; W2-FIX-DATA hand-back §8.3): the inland auction
 * house. Where every variant of the pool speaks of ships and the place has no water, the house takes
 * its inland text (`inlandDescriptions.js`, read by `assembleInstitutions`); that text still sold
 * "now and then persons" after the first seat reworded the same clause out of the canonical variants
 * (915bf42db). On the census's 720 it printed in 79 towns, every one an Auction house in a grounded
 * place with no house that trades in persons (r2r-city-0, on a road, is one). Red until the inland
 * text takes the canonical variant's cure.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { INLAND_DESCRIPTIONS } from '../../src/data/inlandDescriptions.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const CURED = "A formal house for the sale of costly goods: estates, livestock, art, and now and then a whole household's goods. It takes a premium from buyer and seller both.";

describe('W2-FIX-DATA-3: the inland auction house sells no persons', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('every inland auction text is the cured canonical variant with the ships taken out', () => {
    const keys = ['town|Economy|Auction house', 'city|Economy|Auction house', 'metropolis|Economy|Auction house'];
    for (const key of keys) expect(INLAND_DESCRIPTIONS[key], key).toBe(CURED);
    expect(Object.values(INLAND_DESCRIPTIONS).filter((t) => /\bpersons\b/i.test(t))).toEqual([]);
  });

  test('a road city that rolls an auction house prints the household goods, not persons (r2r-city-0)', () => {
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'city' }), null, { seed: 'r2r-city-0', customContent: {} });
    const house = town.institutions.find((/** @type {any} */ i) => i.name === 'Auction house');
    expect(house, 'the city has its auction house').toBeTruthy();
    expect(house.desc).toBe(CURED);
  }, 120_000);
});
