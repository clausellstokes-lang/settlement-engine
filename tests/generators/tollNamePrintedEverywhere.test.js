/**
 * tollNamePrintedEverywhere.test.js — THE TOLL'S NAME, WHEREVER WORDS ARE MADE FROM A CHAIN (COHERENCE-AGREE-8,
 * REVIEW-AGREE-3 FINDING 1; the chair's ruling of 2026-11-12: the rename at print time).
 *
 * The crossroads toll runs on river and port towns too, and the page names it by the town's access ("River Toll —
 * River traffic", "Harbour Dues — Harbour traffic") through one leaf, `domain/display/chainPrintName.js`. The RECORD's
 * `economicState.activeChains[].label/resource` keep the catalogue's strings (the ruling: fifteen logic readers and a
 * saved world's re-derivation read them). Every OTHER place that makes words out of a chain's name or source asks the
 * leaf, whether it writes them at birth (an NPC's goal) or at print time.
 *
 * The seeds are the review's (census 720, born as `census.sh` births them): each carried "Strategic Crossroads Toll"
 * in a river or port town's NPC goals at faa20bc6c.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const CATALOGUE = /Strategic Crossroads/;
/** seed → [access, the toll's printed name] */
const SEEDS = {
  'r2r-city-8': ['river', 'River Toll'],
  'r2r-metropolis-8': ['river', 'River Toll'],
  'r2r-metropolis-49': ['port', 'Harbour Dues'],
};

/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of Object.keys(SEEDS)) {
    births[seed] = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  }
}, 180000);

describe('FINDING 1: an NPC\'s goal names the toll by the town\'s access', () => {
  for (const [seed, [access, printed]] of Object.entries(SEEDS)) {
    test(`${seed} (${access}): no goal names a crossroads, and a goal names "${printed}"`, () => {
      const s = births[seed];
      expect(s.config.tradeRouteAccess).toBe(access);
      expect(s.economicState.activeChains.some((c) => c.chainId === 'crossroads_trade'), 'anchored: the toll runs here').toBe(true);
      const goals = s.npcs.flatMap((n) => [n.goal?.short, n.goal?.long]).filter(Boolean);
      expect(goals.filter((g) => CATALOGUE.test(g))).toEqual([]);
      // anchored: the goal that named the catalogue's toll at faa20bc6c names the access's toll now
      expect(goals.some((g) => g.includes(printed)), 'a goal names the toll by its printed name').toBe(true);
    });
  }
});
