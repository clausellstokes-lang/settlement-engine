import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

// F0 byte-identity oracle (dormant-until-deity religion layer): a campaign with
// NO assigned deity must stay BYTE-IDENTICAL after later phases bolt on additive
// EMPTY ledgers. F1 added `dispositionStats:{}` and `deployments:{}` to
// worldState (now present-but-empty on every world); R4 may add `pantheon`
// conditionally. A raw JSON.stringify gate would flag those empty additions as
// churn even though they carry no signal.
//
// This file defines the load-bearing oracle `normalizeForDormancy` — a
// STRUCTURAL normalized deep-equal that treats an ABSENT key as its default
// (an empty object/array). It drops empty-{}/[] keys, recurses, and sorts object
// keys, so absent === {} === []. Every later "byte-identical" gate references
// this normalizer. The test proves (a) adding empty ledgers is byte-neutral
// UNDER the oracle, (b) the oracle is doing real work (raw deep-equal WOULD
// differ on those keys), and (c) a deity-free pulse carries no pantheon/deity
// structure anywhere — the dormancy guarantee.

// --- THE ORACLE ----------------------------------------------------------
// Recursive structural normalizer. Drops keys whose value normalizes to an
// empty object or empty array (absent === {} === []), recurses into nested
// containers, and is order-stable for object keys (keys sorted). Returns a
// canonical form suitable for deep-equal comparison.
export function normalizeForDormancy(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeForDormancy);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      const normalized = normalizeForDormancy(value[key]);
      // Absent === empty-object === empty-array: skip empty containers.
      const isEmptyObject = normalized
        && typeof normalized === 'object'
        && !Array.isArray(normalized)
        && Object.keys(normalized).length === 0;
      const isEmptyArray = Array.isArray(normalized) && normalized.length === 0;
      if (isEmptyObject || isEmptyArray) continue;
      out[key] = normalized;
    }
    return out;
  }
  return value;
}

// --- Fixture (modelled on worldPulseOrderIndependence.test.js) ----------
// Deity-free on purpose: no deity/pantheon anywhere in any save or worldState.
function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 28, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 72 },
        { faction: 'Temple Wardens', category: 'religious', power: 54 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name, patch),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function campaignFixture(worldStatePatch = {}) {
  return {
    id: 'religion-dormancy-pin',
    name: 'Religion Dormancy Pin',
    settlementIds: ['a', 'b', 'c'],
    worldState: {
      rngSeed: 'religion-dormancy-seed',
      tick: 3,
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.72, affectedSettlementIds: ['a'], age: 2 },
        { id: 'world_stressor.market_shock.b', type: 'market_shock', severity: 0.5, affectedSettlementIds: ['b'], age: 1 },
      ],
      ...worldStatePatch,
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
      ],
      channels: [
        { type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'migration_pressure', from: 'a', to: 'c', status: 'confirmed' },
        { type: 'trade_route', from: 'b', to: 'c', status: 'confirmed' },
      ],
    }),
    wizardNews: { currentTick: 3, entries: [] },
  };
}

function makeSaves() {
  return [
    save('a', 'Ashford', { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] }),
    save('b', 'Briarwatch'),
    save('c', 'Crownhold'),
  ];
}

const NOW = '2026-01-01T00:00:00.000Z';

// Structural scan: collect every object key appearing anywhere in a value tree.
function collectKeys(value, into = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, into);
  } else if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      into.add(key);
      collectKeys(value[key], into);
    }
  }
  return into;
}

describe('religion dormancy — byte-identity oracle', () => {
  test('empty additive ledgers (dispositionStats/deployments) are byte-neutral under the oracle', () => {
    // result A: untouched deity-free campaign.
    const resultA = previewCampaignWorldPulse({
      campaign: campaignFixture(),
      saves: makeSaves(),
      interval: 'one_month',
      now: NOW,
    });
    // result B: SAME fixture, but worldState carries the empty ledgers F1 adds.
    const resultB = previewCampaignWorldPulse({
      campaign: campaignFixture({ dispositionStats: {}, deployments: {} }),
      saves: makeSaves(),
      interval: 'one_month',
      now: NOW,
    });

    // Anti-vacuity: the fixture is HOT — the pulse actually did work.
    expect(resultA.selected.length).toBeGreaterThan(0);
    expect(resultA.rollExplanations.length).toBeGreaterThan(3);

    // (a) The empty-ledger addition is byte-neutral UNDER the oracle.
    expect(normalizeForDormancy(resultA.worldState)).toEqual(normalizeForDormancy(resultB.worldState));

    // Same for the full result envelope surfaces the dormancy gate references.
    const envelope = result => ({
      selected: result.selected,
      settlementUpdates: result.settlementUpdates,
    });
    expect(normalizeForDormancy(envelope(resultA))).toEqual(normalizeForDormancy(envelope(resultB)));

    // (b) The oracle is doing REAL work: augmenting A's worldState with an empty
    // container under a FRESH key differs under raw deep-equal, yet the oracle
    // erases it. We use a synthetic probe key (`__oracleProbe`) that no phase
    // populates — so this proof stays valid now that F1 has landed the real empty
    // ledgers (dispositionStats/deployments) into the default world shape (they
    // are present-but-empty on resultA.worldState and the oracle already collapses
    // them, which is exactly the byte-neutrality assertion (a) above relies on).
    const augmented = { ...resultA.worldState, __oracleProbe: {} };
    expect(augmented).not.toEqual(resultA.worldState);
    expect(Object.prototype.hasOwnProperty.call(augmented, '__oracleProbe')).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(resultA.worldState, '__oracleProbe')).toBe(false);
    // ...yet the oracle erases that difference.
    expect(normalizeForDormancy(augmented)).toEqual(normalizeForDormancy(resultA.worldState));
  });

  test('a deity-free pulse carries no pantheon/deity structure anywhere', () => {
    const result = previewCampaignWorldPulse({
      campaign: campaignFixture(),
      saves: makeSaves(),
      interval: 'one_month',
      now: NOW,
    });

    // Anti-vacuity: confirm the path was exercised (real keys were collected).
    const worldStateKeys = collectKeys(result.worldState);
    expect(worldStateKeys.size).toBeGreaterThan(5);
    expect(worldStateKeys.has('stressors')).toBe(true);

    // The dormancy guarantee: scan the ENTIRE result envelope for deity keys.
    const allKeys = collectKeys({
      worldState: result.worldState,
      selected: result.selected,
      settlementUpdates: result.settlementUpdates,
      proposals: result.proposals,
      candidates: result.candidates,
    });
    const forbidden = ['pantheon', 'primaryDeitySnapshot', 'deity', 'deityId', 'deitySnapshot', 'deities'];
    for (const key of forbidden) {
      expect(allKeys.has(key)).toBe(false);
    }
  });
});
