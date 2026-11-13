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

describe('FINDING 1: the pipeline rail\'s chain receipts name the toll\'s source by the town\'s access', () => {
  // `simulationTrace[]` (economyReconcilePass) is printed by the pipeline rail: "Because of Resource: …", and the
  // cause's reason beside it
  const PRINTED_SOURCE = { river: 'River traffic', port: 'Harbour traffic' };
  for (const [seed, [access]] of Object.entries(SEEDS)) {
    test(`${seed} (${access}): no chain receipt names a crossroads, and the toll's names "${PRINTED_SOURCE[access]}"`, () => {
      const s = births[seed];
      const causes = s.simulationTrace.filter((t) => t.targetType === 'supply_chain').flatMap((t) => t.causes || []);
      expect(causes.filter((c) => CATALOGUE.test(`${c.source} ${c.reason} ${c.effect}`))).toEqual([]);
      // anchored: the toll's receipt still carries its resource cause, under the printed source
      expect(causes.some((c) => c.source === `resource.${PRINTED_SOURCE[access]}` && c.reason.startsWith(PRINTED_SOURCE[access]))).toBe(true);
    });
  }
});

describe('FINDING 1: the read-time chain projections name the toll by the town\'s access', () => {
  // `deriveSupplyChainState` is the canonical chain projection: its `name` and `dependencies` are printed by the
  // explanation rail ("… requires resource: …", "… is the supply chain for …"), the causal views, the capacity and
  // causal-state contributors and the counterfactual's labels
  const PRINTED_SOURCE = { river: 'River traffic', port: 'Harbour traffic' };
  for (const [seed, [access, printed]] of Object.entries(SEEDS)) {
    test(`${seed} (${access}): the projection, the explanation and the causal view name "${printed}", never a crossroads`, async () => {
      const { deriveAllSupplyChainStates } = await import('../../src/domain/supplyChainState.js');
      const { explainSupplyChain, entityCatalog } = await import('../../src/domain/explanation.js');
      const { deriveCausalView, supportedCausalViews } = await import('../../src/domain/causalViews.js');
      const s = births[seed];
      const toll = deriveAllSupplyChainStates(s).find((c) => c.resourceKey === 'crossroads_position');
      expect(toll, 'anchored: the toll is projected').toBeTruthy();
      expect([toll.name, toll.dependencies.find((d) => d.startsWith('resource: '))]).toEqual([printed, `resource: ${PRINTED_SOURCE[access]}`]);
      expect(toll.resource, 'the projection keeps the record\'s resource (a logic key)').toBe('Strategic Crossroads');
      const words = JSON.stringify([
        explainSupplyChain(s, toll.id),
        entityCatalog(s),
        // a view's words are its summary; its entries are the projection's data (the record's `resource` key)
        supportedCausalViews().map((v) => deriveCausalView(s, v).summary),
      ]);
      expect(words).toContain(printed);
      expect(words.match(/Strategic Crossroads[^"]*/g) || []).toEqual([]);
    });
  }
});
