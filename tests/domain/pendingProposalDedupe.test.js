import { describe, expect, test } from 'vitest';

import {
  proposalSemanticKey,
  suppressEquivalentPendingProposalCandidates,
} from '../../src/domain/worldPulse/candidateEvents.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-06-01T00:00:00.000Z';

function governmentChallenge({
  tick,
  targetSaveId = 'a',
  factionId = 'a:temple_wardens',
  legitimacyBand = 'crisis',
} = {}) {
  return {
    id: `candidate.faction.faction_government_challenge.${factionId}.${tick}`,
    type: 'faction',
    candidateType: 'faction_government_challenge',
    targetSaveId,
    factionId,
    severity: tick % 2 ? 0.71 : 0.84,
    probability: tick % 2 ? 0.31 : 0.39,
    applyMode: 'proposal',
    headline: `Challenge at tick ${tick}`,
    proposalPayload: {
      kind: 'government_change',
      factionId,
      settlementId: targetSaveId,
      governmentPreference: 'merchant_council',
      legitimacyBand,
      preserveInstitutions: true,
    },
    metadata: { legitimacyBand, pressure: tick / 100 },
    conflictTags: [
      `faction:${factionId}`,
      `settlement:${targetSaveId}:faction`,
      `settlement:${targetSaveId}:government_change`,
    ],
  };
}

function proposal(outcome, status = 'pending') {
  return { id: `world_proposal.${outcome.id}`, status, outcome };
}

describe('pending proposal semantic hold guard', () => {
  test('suppresses an equivalent unresolved government challenge without letting tick/prose/pressure drift alter its identity', () => {
    const held = governmentChallenge({ tick: 5, legitimacyBand: 'strained' });
    const repeat = governmentChallenge({ tick: 12, legitimacyBand: 'crisis' });

    expect(proposalSemanticKey(repeat)).toBe(proposalSemanticKey(held));
    expect(suppressEquivalentPendingProposalCandidates(
      [repeat],
      { proposals: [proposal(held)] },
    )).toEqual([]);
  });

  test('retains deterministic input order for distinct factions, settlements, and institutions', () => {
    const held = governmentChallenge({ tick: 5 });
    const sameQuestion = governmentChallenge({ tick: 6 });
    const otherFaction = governmentChallenge({ tick: 6, factionId: 'a:merchant_league' });
    const otherSettlement = governmentChallenge({
      tick: 6,
      targetSaveId: 'b',
      factionId: 'b:temple_wardens',
    });
    const heldInstitution = {
      candidateType: 'institution_closure',
      targetSaveId: 'a',
      institutionPatch: { saveId: 'a', action: 'close', name: 'Old Mill' },
      conflictTags: ['a:institution:old_mill'],
    };
    const otherInstitution = {
      candidateType: 'institution_closure',
      targetSaveId: 'a',
      institutionPatch: { saveId: 'a', action: 'close', name: 'River Forge' },
      conflictTags: ['a:institution:river_forge'],
    };

    const result = suppressEquivalentPendingProposalCandidates(
      [sameQuestion, otherFaction, otherSettlement, otherInstitution],
      { proposals: [proposal(held), proposal(heldInstitution)] },
    );

    expect(result).toEqual([otherFaction, otherSettlement, otherInstitution]);
  });

  test.each(['applied', 'dismissed', 'expired'])(
    'a %s proposal releases the semantic hold and makes the candidate eligible again',
    (status) => {
      const prior = governmentChallenge({ tick: 5 });
      const eligible = governmentChallenge({ tick: 6 });
      const candidates = [eligible];

      expect(suppressEquivalentPendingProposalCandidates(
        candidates,
        { proposals: [proposal(prior, status)] },
      )).toBe(candidates);
    },
  );

  test('unknown unanchored shapes fail safe instead of becoming a candidate-type throttle', () => {
    const unknown = { candidateType: 'future_realm_question', applyMode: 'proposal' };
    const candidates = [{ ...unknown }];

    expect(proposalSemanticKey(unknown)).toBeNull();
    expect(suppressEquivalentPendingProposalCandidates(
      candidates,
      { proposals: [proposal(unknown)] },
    )).toBe(candidates);
  });
});

function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 60 },
        { faction: 'Temple Wardens', category: 'religious', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
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

test('a multi-tick pulse keeps one pending government challenge per faction and settlement', async () => {
  const ids = ['a', 'b', 'c'];
  const campaign = {
    id: 'camp-pending-proposal-dedupe',
    name: 'Pending Proposal Realm',
    settlementIds: ids,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: 'pause-seed',
      tick: 0,
      canonizedAt: NOW,
      stressors: [{
        id: 'world_stressor.famine.realm',
        type: 'famine',
        severity: 0.6,
        affectedSettlementIds: ids,
      }],
    },
  };
  const saves = [
    save('a', 'Ashford', {
      activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }],
    }),
    save('b', 'Briarwatch'),
    save('c', 'Caldmere'),
  ];

  const result = await simulateCampaignWorldInterval({
    campaign,
    saves,
    interval: 'one_year',
    commit: true,
    now: NOW,
  });
  const challenges = (result.worldState.proposals || [])
    .filter(p => p.status === 'pending'
      && p.outcome?.candidateType === 'faction_government_challenge');
  const semanticKeys = challenges.map(p => proposalSemanticKey(p.outcome));

  expect(challenges.length).toBeGreaterThan(0);
  expect(new Set(challenges.map(p => p.outcome.targetSaveId)).size).toBeGreaterThan(1);
  expect(new Set(challenges.map(p => p.outcome.factionId)).size).toBeGreaterThan(1);
  expect(new Set(semanticKeys).size).toBe(challenges.length);
});
