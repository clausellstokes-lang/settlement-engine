/**
 * tests/domain/autonomy/fixture.js — the S7 walker/evaluator fixture: a REAL two-town
 * campaign in the exact shape the pulse kernel consumes (the seasonsMiniSoak/z2 idiom),
 * so signal resolution is proven against genuine world state, not mocks.
 */

import { ensureRegionalGraph } from '../../../src/domain/region/index.js';

export const NOW = '2026-04-04T00:00:00.000Z';

function town(name, terrainType, legitimacyScore, prosperity) {
  return {
    name,
    tier: 'town',
    population: 1600,
    config: { tradeRouteAccess: 'road', terrainType },
    institutions: [{ name: 'Granary', status: 'active' }],
    economicState: {
      prosperity,
      primaryExports: [],
      primaryImports: ['Bulk grain and foodstuffs'],
      foodSecurity: { dailyNeed: 3200, dailyProduction: 3200, surplusPct: 8, deficitPct: 0, storageMonths: 1.5, importDependency: 0.1, resilienceScore: 55 },
    },
    powerStructure: {
      publicLegitimacy: { score: legitimacyScore, label: 'Accepted' },
      factions: [
        { faction: 'Town Council', category: 'government', power: 60, isGoverning: true },
        { faction: 'Merchant Circle', category: 'economy', power: 45 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name.toLowerCase()}`, name: `Reeve of ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

/** @returns {{ campaign: object, saves: Array<object> }} */
export function autonomyFixture() {
  const saves = [
    {
      id: 'ashford', name: 'Ashford', phase: 'canon',
      settlement: town('Ashford', 'plains', 54, 'Comfortable'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: 'bramwick', name: 'Bramwick', phase: 'canon',
      settlement: town('Bramwick', 'mountain', 41, 'Struggling'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 's7-autonomy-fixture', name: 'S7 Autonomy Fixture',
    settlementIds: ['ashford', 'bramwick'],
    worldState: {
      rngSeed: 's7-autonomy-seed',
      tick: 0,
      stressors: [],
      // The pair signal's evolved stance: relationshipStates wins over the edge baseline.
      relationshipStates: {
        'e.ash.bram': { relationshipType: 'rival', fear: 0.2, resentment: 0.3 },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'e.ash.bram', from: 'ashford', to: 'bramwick', relationshipType: 'trade_partner' }],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** Recursively freeze (arrays + plain objects) — the purity probe's teeth. */
export function deepFreeze(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const key of Object.keys(value)) deepFreeze(value[key], seen);
  return Object.freeze(value);
}
