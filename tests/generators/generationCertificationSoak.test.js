/**
 * Contract tests for the scheduled generation-certification soak.
 *
 * The full 1,200-settlement lane belongs to weekly/manual CI. These tests keep
 * its vocabulary, its joint lattice, and its independent oracle honest on the
 * ordinary change path.
 */

import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  DEFAULT_COUNT,
  GENERATION_DIMENSIONS,
  configForIndex,
  inspectSettlement,
} from '../../scripts/audit/generation-certification-soak.mjs';

const DIMENSION_KEYS = {
  tiers: config => config.settType,
  cultures: config => config.culture,
  terrains: config => config.terrainOverride,
  routes: config => config.tradeRouteAccess,
  threats: config => config.monsterThreat,
  contentProfiles: config => config.contentProfile,
  magicScenarios: config => `${config.magicExists}:${config.priorityMagic}`,
};

function expectedValues(name) {
  const values = GENERATION_DIMENSIONS[name];
  if (name !== 'magicScenarios') return [...values];
  return values.map(value => `${value.magicExists}:${value.priorityMagic}`);
}

function observedDimensions(count) {
  const observed = Object.fromEntries(
    Object.keys(DIMENSION_KEYS).map(name => [name, new Set()]),
  );
  for (let index = 0; index < count; index += 1) {
    const config = configForIndex(index);
    for (const [name, keyFor] of Object.entries(DIMENSION_KEYS)) {
      observed[name].add(keyFor(config));
    }
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
    // The three positive toHaveProperty pins above prove this config object is
    // live and carries the CURRENT vocabulary, so the two retired-alias negatives
    // below cannot pass against an empty or undefined config.
    expect(config).not.toHaveProperty('terrain'); // anchored: live-config pins above
    expect(config).not.toHaveProperty('magicLevel'); // anchored: live-config pins above
  });
});

describe('generation certification soak pairwise lattice', () => {
  it('fills every joint cell of every dimension pair across the full corpus', () => {
    // Per-dimension coverage cannot see two CORRELATED selectors: phase terms
    // with a shared period cancel, and one dimension collapses into a pure
    // function of another. Measured 2026-07-28, before configForIndex gave
    // monsterThreat and the magic scenario their own phase period:
    // routes×threats covered 6/18 joint cells and routes×magicScenarios
    // 12/24, so e.g. mountain_pass worlds were only ever certified under
    // heartland threat. This walks the full default soak corpus and names
    // every empty joint cell.
    const names = Object.keys(DIMENSION_KEYS);
    const seen = new Set();
    for (let index = 0; index < DEFAULT_COUNT; index += 1) {
      const config = configForIndex(index);
      const keys = names.map(name => `${name}:${DIMENSION_KEYS[name](config)}`);
      for (let a = 0; a < keys.length; a += 1) {
        for (let b = a + 1; b < keys.length; b += 1) {
          seen.add(`${keys[a]}|${keys[b]}`);
        }
      }
    }

    const missing = [];
    for (let a = 0; a < names.length; a += 1) {
      for (let b = a + 1; b < names.length; b += 1) {
        for (const valueA of expectedValues(names[a])) {
          for (const valueB of expectedValues(names[b])) {
            if (!seen.has(`${names[a]}:${valueA}|${names[b]}:${valueB}`)) {
              missing.push(`${names[a]}.${valueA} × ${names[b]}.${valueB}`);
            }
          }
        }
      }
    }
    expect(missing).toEqual([]);
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
