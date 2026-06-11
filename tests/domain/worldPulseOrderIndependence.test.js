import { describe, expect, test } from 'vitest';

import {
  ageRoamingStressors,
  previewCampaignWorldPulse,
  resolveCandidateConflicts,
  rollCandidates,
} from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// R4 pin (audit "saves-array-order dependence", probe-confirmed): the same
// campaign with its saves array reversed used to select DIFFERENT outcomes —
// rollCandidates drew one shared rng stream in candidate order, severity ties
// broke by insertion order, and stressor aging consumed one sequential stream.
// All three now key their randomness/ordering on the entity's IDENTITY, so
// save-list order is cosmetic.

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

function campaignFixture() {
  return {
    id: 'order-pin',
    name: 'Order Pin',
    settlementIds: ['a', 'b', 'c'],
    worldState: {
      rngSeed: 'order-pin-seed',
      tick: 3,
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.72, affectedSettlementIds: ['a'], age: 2 },
        { id: 'world_stressor.market_shock.b', type: 'market_shock', severity: 0.5, affectedSettlementIds: ['b'], age: 1 },
      ],
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

const NOW = '2026-01-01T00:00:00.000Z';

describe('world pulse — saves-array order independence', () => {
  test('identical campaign with saves reversed selects identical outcomes and per-settlement results', () => {
    const saves = [
      save('a', 'Ashford', { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] }),
      save('b', 'Briarwatch'),
      save('c', 'Crownhold'),
    ];

    const forward = previewCampaignWorldPulse({ campaign: campaignFixture(), saves, interval: 'one_month', now: NOW });
    const reversed = previewCampaignWorldPulse({ campaign: campaignFixture(), saves: [...saves].reverse(), interval: 'one_month', now: NOW });

    // Anti-vacuity: the fixture is hot enough that things actually happen.
    expect(forward.rollExplanations.length).toBeGreaterThan(3);
    expect(forward.selected.length).toBeGreaterThan(0);

    // Identical selected outcomes (order across settlements may differ for the
    // deterministic structural families, so compare by id).
    const ids = result => result.selected.map(o => o.id).sort();
    expect(ids(reversed)).toEqual(ids(forward));

    // Identical per-candidate rolls and pass/fail verdicts.
    const rolls = result => new Map(result.rollExplanations.map(r => [r.candidateId, `${r.roll}:${r.passed}`]));
    const forwardRolls = rolls(forward);
    const reversedRolls = rolls(reversed);
    expect([...reversedRolls.keys()].sort()).toEqual([...forwardRolls.keys()].sort());
    for (const [candidateId, verdict] of forwardRolls) {
      expect(`${candidateId} ${reversedRolls.get(candidateId)}`).toBe(`${candidateId} ${verdict}`);
    }

    // Identical per-settlement results.
    const bySave = result => new Map(result.settlementUpdates.map(u => [String(u.saveId), u.settlement]));
    const forwardSettlements = bySave(forward);
    const reversedSettlements = bySave(reversed);
    for (const id of ['a', 'b', 'c']) {
      expect(reversedSettlements.get(id)).toEqual(forwardSettlements.get(id));
    }

    // Identical stressor end-states and proposals.
    const stressorsById = result => [...result.worldState.stressors].sort((x, y) => x.id < y.id ? -1 : 1);
    expect(stressorsById(reversed)).toEqual(stressorsById(forward));
    const proposalIds = result => result.worldState.proposals.map(p => p.id).sort();
    expect(proposalIds(reversed)).toEqual(proposalIds(forward));
  });

  test('rollCandidates draws each candidate roll from an identity fork, not stream position', () => {
    const candidates = Array.from({ length: 6 }, (_, i) => ({
      id: `candidate.test.${i}`,
      applyMode: 'auto',
      candidateType: 'test',
      severity: 0.5,
      probability: 0.5,
    }));

    const forward = rollCandidates(candidates, createPRNG('roll-pin'), { maxAuto: 99 });
    const reversed = rollCandidates([...candidates].reverse(), createPRNG('roll-pin'), { maxAuto: 99 });

    const byId = run => new Map(run.rollExplanations.map(r => [r.candidateId, r.roll]));
    const forwardRolls = byId(forward);
    const reversedRolls = byId(reversed);
    for (const candidate of candidates) {
      expect(reversedRolls.get(candidate.id)).toBe(forwardRolls.get(candidate.id));
    }
    // Anti-vacuity: identity forks produce a spread of rolls, not one value.
    expect(new Set(forwardRolls.values()).size).toBeGreaterThan(1);
    expect(forward.selected.map(o => o.id).sort()).toEqual(reversed.selected.map(o => o.id).sort());
  });

  test('severity ties in conflict resolution break by stable id, not insertion order', () => {
    const contender = id => ({
      id,
      type: 'relationship',
      candidateType: 'label_drift',
      relationshipKey: 'edge.a.b',
      severity: 0.6,
      applyMode: 'auto',
      conflictTags: ['label:edge.a.b'],
    });
    const first = contender('candidate.alpha');
    const second = contender('candidate.beta');

    const forward = resolveCandidateConflicts([first, second]);
    const reversed = resolveCandidateConflicts([second, first]);

    // The exclusive label tag admits exactly one — and the SAME one both ways.
    expect(forward).toHaveLength(1);
    expect(reversed).toHaveLength(1);
    expect(forward[0].id).toBe('candidate.alpha');
    expect(reversed[0].id).toBe(forward[0].id);
  });

  test('stressor aging rolls fork per stressor id — reversing the list changes nothing', () => {
    const stressors = [
      { id: 'world_stressor.market_shock.a', type: 'market_shock', severity: 0.4, age: 2, affectedSettlementIds: ['a'] },
      { id: 'world_stressor.betrayal.b', type: 'betrayal', severity: 0.5, age: 1, affectedSettlementIds: ['b'] },
      { id: 'world_stressor.disease_outbreak.c', type: 'disease_outbreak', severity: 0.45, age: 4, affectedSettlementIds: ['c'] },
    ];
    const snapshot = { byId: new Map() };

    const forward = ageRoamingStressors(stressors, snapshot, createPRNG('age-pin'), { tick: 5, now: NOW });
    const reversed = ageRoamingStressors([...stressors].reverse(), snapshot, createPRNG('age-pin'), { tick: 5, now: NOW });

    const byId = run => new Map(
      run.stressors.map(s => [s.id, { status: s.status, severity: s.severity, roll: s.resolutionRoll ?? null }]),
    );
    expect(byId(reversed)).toEqual(byId(forward));
    expect(forward.resolved.map(s => s.id).sort()).toEqual(reversed.resolved.map(s => s.id).sort());
  });
});
