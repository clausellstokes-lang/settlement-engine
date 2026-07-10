import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

// F4 integration pin: the disposition multiplier actually flows through the real
// pulse (advanceCampaignWorld → evaluateWorldPulseRules → ctx → candidateBase). An
// EMPTY ledger leaves candidate severities untouched (legacy byte-identity, also
// covered by the full suite); injecting an aggressive disposition into worldState
// BOOSTS escalation candidates the actor drives. This is the read-LAST-tick path —
// the disposition is read from the ledger present at the start of the tick.

function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 2200,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 70 },
        { faction: 'Iron Wardens', category: 'military', power: 60 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}

function saves() {
  return [
    save('a', 'Ashford', { activeConditions: [{ archetype: 'regional_conflict_pressure', severity: 0.7 }] }),
    save('b', 'Briarwatch'),
    save('c', 'Crownhold'),
  ];
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function campaignFixture(dispositionStats = {}) {
  return {
    id: 'disposition-pin',
    name: 'Disposition Pin',
    settlementIds: ['a', 'b', 'c'],
    worldState: {
      rngSeed: 'disposition-seed',
      tick: 4,
      dispositionStats,
      stressors: [
        { id: 'world_stressor.war_pressure.a', type: 'war_pressure', severity: 0.6, affectedSettlementIds: ['a'], age: 1 },
      ],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
      ],
      channels: [
        { type: 'war_front', from: 'a', to: 'b', status: 'confirmed' },
      ],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

const NOW = '2026-01-01T00:00:00.000Z';
const run = (disp) => previewCampaignWorldPulse({ campaign: campaignFixture(disp), saves: saves(), interval: 'one_month', now: NOW });

const severityById = (result) => {
  const map = new Map();
  for (const c of result.candidates || []) {
    if (c && c.id != null && Number.isFinite(c.severity)) map.set(c.id, c.severity);
  }
  return map;
};

describe('disposition multiplier — pulse integration', () => {
  test('injecting an aggressive disposition changes the pulse output (the seam is live)', () => {
    const baseline = run({}); // empty ledger
    const aggressive = run({ a: { score: 8 }, b: { score: 8 }, c: { score: 8 } }); // max aggressive

    const base = severityById(baseline);
    const aggr = severityById(aggressive);

    // anti-vacuity: relationship candidates were actually generated.
    expect(base.size).toBeGreaterThan(0);

    // The two runs differ — disposition reached candidateBase.
    let changed = 0;
    let boosted = 0;
    for (const [id, sev] of aggr) {
      if (base.has(id) && base.get(id) !== sev) {
        changed += 1;
        if (sev > base.get(id)) boosted += 1;
      }
    }
    expect(changed).toBeGreaterThan(0);
    // At least one escalation candidate was BOOSTED by the aggression (rival edges
    // drive escalation candidates).
    expect(boosted).toBeGreaterThan(0);
  });

  test('an empty ledger is identical to no ledger key at all (byte-neutral)', () => {
    const withEmpty = severityById(run({}));
    const withoutKey = severityById(previewCampaignWorldPulse({
      campaign: (() => { const c = campaignFixture(); delete c.worldState.dispositionStats; return c; })(),
      saves: saves(), interval: 'one_month', now: NOW,
    }));
    expect([...withEmpty.entries()].sort()).toEqual([...withoutKey.entries()].sort());
  });
});
