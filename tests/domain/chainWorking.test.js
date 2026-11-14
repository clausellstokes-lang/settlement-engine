/**
 * chainWorking.test.js — THE LEAF "A CHAIN WORKS THIS RESOURCE HERE" (COHERENCE-AGREE-7, REVIEW-AGREE-2 F4; the chair's
 * re-ruling of 2026-11-12: the leaf only). `src/domain/facts/chainWorking.js :: chainWorksResource` reads the chain's
 * own state; nothing in the generator reads it yet (the income source is unchanged), so the record moves 0 leaves.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { chainWorksResource, chainsWorking, WORKING_CHAIN_STATUSES } from '../../src/domain/facts/chainWorking.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** @param {object[]} activeChains */
const record = (activeChains) => ({ economicState: { activeChains } });
const chain = (/** @type {Record<string, unknown>} */ over) => ({ chainId: 'iron', resourceKey: 'iron_deposits', resourceInputKey: 'iron_deposits',
  resourceInputAvailable: true, status: 'running', ...over });

describe('the leaf reads the chain\'s own state', () => {
  test('a working chain whose input is the resource and is available works it', () => {
    for (const status of WORKING_CHAIN_STATUSES) expect(chainWorksResource(record([chain({ status })]), 'iron_deposits'), status).toBe(true);
  });
  test('an impaired or unexploited chain, a spent input, another input, or no chain at all works nothing', () => {
    expect(chainWorksResource(record([chain({ status: 'impaired' })]), 'iron_deposits')).toBe(false);
    expect(chainWorksResource(record([chain({ status: 'unexploited' })]), 'iron_deposits')).toBe(false);
    expect(chainWorksResource(record([chain({ resourceInputAvailable: false })]), 'iron_deposits')).toBe(false);
    expect(chainWorksResource(record([chain({ resourceInputKey: 'coal_deposits' })]), 'iron_deposits')).toBe(false);
    expect(chainWorksResource(record([]), 'iron_deposits')).toBe(false);
    expect(chainWorksResource(null, 'iron_deposits')).toBe(false);
  });
  test('a family is any of its members; the working chains come back in the record\'s order', () => {
    const smelt = chain({ chainId: 'smelting' });
    const mill = chain({ chainId: 'timber', resourceKey: 'managed_forest', resourceInputKey: 'managed_forest' });
    const rec = record([mill, chain({ status: 'impaired', chainId: 'weapons_armor' }), smelt]);
    expect(chainWorksResource(rec, ['managed_forest', 'mountain_timber'])).toBe(true);
    expect(chainsWorking(rec, ['iron_deposits', 'managed_forest']).map((c) => /** @type {{ chainId: string }} */ (c).chainId)).toEqual(['timber', 'smelting']);
  });
});

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/**
 * On the review's reading towns (REVIEW-AGREE-2 F4) and the lane's seeds, at this tip. r2read-village-1 prints "Local
 * coal fires the forges" and no chain works its coal; agree-village-1 prints "Local ore feeds the smithy" beside live
 * iron that no chain works (both the second wave's lines to cure through this leaf). agree-village-5 works its iron.
 * And the leaf agrees with the record's live roster: a chain's available input is a resource the record holds live
 * (measured over the lane's 4,141 births: every one of 28,298 chains that name an input).
 */
describe('the leaf on generated towns', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const birth = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed });
  test('the review\'s towns and the lane\'s seeds', () => {
    const village1 = birth('r2read-village-1');
    expect(village1.config.nearbyResources).toContain('coal_deposits'); // anchored: the coal is live
    expect(chainWorksResource(village1, 'coal_deposits')).toBe(false);
    const agree1 = birth('agree-village-1');
    expect(agree1.config.nearbyResources).toContain('iron_deposits'); // anchored: the iron is live
    expect(chainWorksResource(agree1, 'iron_deposits')).toBe(false);
    expect(chainWorksResource(agree1, 'managed_forest')).toBe(true);
    expect(chainWorksResource(birth('agree-village-5'), 'iron_deposits')).toBe(true);
  });
  test('a chain\'s available input is held live on the record', () => {
    const seeds = ['agree-village-1', 'agree-village-5', 'agree-town-0', 'agree-city-28', 'r2r-metropolis-2', 'r2read-city-0'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const town = birth(seed);
      const live = town.config.nearbyResources.filter((key) => !town.config.nearbyResourcesDepleted.includes(key));
      const worked = [...new Set(chainsWorking(town, town.config.nearbyResources).map((c) => /** @type {{ resourceInputKey: string }} */ (c).resourceInputKey))];
      expect(worked.length, `anchored: ${seed} works something`).toBeGreaterThan(0);
      expect(worked.filter((key) => !live.includes(key)), seed).toEqual([]);
    }), 'a chain works a resource the record does not hold live');
  });
});
