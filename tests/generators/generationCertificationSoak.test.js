/**
 * Contract tests for the scheduled generation-certification soak.
 *
 * The full 1,200-settlement lane belongs to weekly/manual CI. These tests keep
 * its vocabulary and independent oracle honest on the ordinary change path.
 */

import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  GENERATION_DIMENSIONS,
  configForIndex,
  inspectSettlement,
} from '../../scripts/audit/generation-certification-soak.mjs';

function observedDimensions(count) {
  const observed = {
    tiers: new Set(),
    cultures: new Set(),
    terrains: new Set(),
    routes: new Set(),
    threats: new Set(),
    contentProfiles: new Set(),
    magicScenarios: new Set(),
  };
  for (let index = 0; index < count; index += 1) {
    const config = configForIndex(index);
    observed.tiers.add(config.settType);
    observed.cultures.add(config.culture);
    observed.terrains.add(config.terrainOverride);
    observed.routes.add(config.tradeRouteAccess);
    observed.threats.add(config.monsterThreat);
    observed.contentProfiles.add(config.contentProfile);
    observed.magicScenarios.add(
      `${config.magicExists}:${config.priorityMagic}`,
    );
  }
  return observed;
}

describe('generation certification soak vocabulary', () => {
  it('covers every live dimension without retired config aliases', () => {
    const observed = observedDimensions(120);

    expect([...observed.tiers].sort()).toEqual(
      [...GENERATION_DIMENSIONS.tiers].sort(),
    );
    expect([...observed.cultures].sort()).toEqual(
      [...GENERATION_DIMENSIONS.cultures].sort(),
    );
    expect([...observed.terrains].sort()).toEqual(
      [...GENERATION_DIMENSIONS.terrains].sort(),
    );
    expect([...observed.routes].sort()).toEqual(
      [...GENERATION_DIMENSIONS.routes].sort(),
    );
    expect([...observed.threats].sort()).toEqual(
      [...GENERATION_DIMENSIONS.threats].sort(),
    );
    expect([...observed.contentProfiles].sort()).toEqual(
      [...GENERATION_DIMENSIONS.contentProfiles].sort(),
    );
    expect([...observed.magicScenarios].sort()).toEqual(
      GENERATION_DIMENSIONS.magicScenarios
        .map(value => `${value.magicExists}:${value.priorityMagic}`)
        .sort(),
    );

    const config = configForIndex(0);
    expect(config).toHaveProperty('terrainOverride');
    expect(config).toHaveProperty('magicExists');
    expect(config).toHaveProperty('priorityMagic');
    expect(config).not.toHaveProperty('terrain');
    expect(config).not.toHaveProperty('magicLevel');
  });
});

describe('generation certification soak independent oracle', () => {
  it('catches final-graph and conservation defects even when the receipt passes', () => {
    const settlement = {
      tier: 'town',
      population: 1_200,
      generationCoherenceReceipt: {
        status: 'coherent',
        checks: [{
          id: 'synthetic',
          status: 'pass',
          findings: [],
        }],
      },
      institutions: [
        { name: 'Market' },
        { name: 'Market' },
      ],
      npcs: [{
        id: 'npc-1',
        name: 'Alda Vale',
        factionAffiliation: 'Missing faction',
      }],
      relationships: [{
        npc1Id: 'npc-1',
        npc1Name: 'Alda Vale',
        npc2Id: 'npc-missing',
        npc2Name: 'Nobody',
      }],
      powerStructure: {
        factions: [{
          faction: 'Council',
          power: 70,
        }],
      },
      factions: [{
        name: 'Civic bloc',
        members: [{ id: 'npc-missing' }],
      }],
      conflicts: [{
        parties: ['Civic bloc', 'Missing bloc'],
      }],
      history: {
        historicalEvents: [
          { yearsAgo: 5 },
          { yearsAgo: 10 },
        ],
      },
      economicState: {
        incomeSources: [
          { source: 'Market', percentage: 60 },
          { source: 'Tolls', percentage: 30 },
        ],
      },
      economicViability: {
        issues: [{
          severity: 'implausible',
          category: 'Resource Access',
          description: 'A generated institution has no usable input.',
        }],
      },
      arrivalScene: 'The missing grain arrives via none.',
    };

    expect(
      inspectSettlement(settlement, {
        settType: 'town',
        tradeRouteAccess: 'none',
      })
        .map(finding => finding.code),
    ).toEqual(expect.arrayContaining([
      'receipt_judgments_invalid',
      'duplicate_institutions',
      'relationship_endpoint_missing',
      'faction_power_not_conserved',
      'npc_faction_missing',
      'faction_member_missing',
      'conflict_faction_missing',
      'history_order_invalid',
      'income_not_conserved',
      'generated_resource_access_impossible',
      'impossible_route_claim',
    ]));
  });
});
