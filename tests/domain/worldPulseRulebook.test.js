import { describe, expect, test } from 'vitest';

import {
  STRESSOR_CATALOG,
  evaluateFactionRules,
  evaluateNpcRules,
  evaluateRelationshipRules,
  evaluateStressorRules,
  pressureIndex,
  resolveCandidateConflicts,
} from '../../src/domain/worldPulse/index.js';
import { NPC_ROLE_ARCHETYPES } from '../../src/domain/worldPulse/npcAgency.js';

function pressuresFor(settlementIds, score = 0.86) {
  return pressureIndex(settlementIds.flatMap(settlementId => [
    { settlementId, kind: 'food', score, label: 'Food pressure', reasons: ['test food'] },
    { settlementId, kind: 'disease', score, label: 'Disease pressure', reasons: ['test disease'] },
    { settlementId, kind: 'conflict', score, label: 'Conflict pressure', reasons: ['test conflict'] },
    { settlementId, kind: 'trade', score, label: 'Trade pressure', reasons: ['test trade'] },
    { settlementId, kind: 'legitimacy', score, label: 'Legitimacy pressure', reasons: ['test legitimacy'] },
    { settlementId, kind: 'crime', score, label: 'Criminal pressure', reasons: ['test crime'] },
  ]));
}

describe('World Pulse rulebook expansion', () => {
  test('relationship matrix covers every visible relationship type and queues visible label changes as proposals', () => {
    const relationshipTypes = ['neutral', 'trade_partner', 'allied', 'patron', 'client', 'rival', 'cold_war', 'hostile', 'criminal_network'];
    const edges = relationshipTypes.map((relationshipType, index) => ({
      id: `edge.${relationshipType}`,
      from: `a${index}`,
      to: `b${index}`,
      relationshipType,
    }));
    const relationshipStates = Object.fromEntries(edges.map(edge => [edge.id, {
      relationshipType: edge.relationshipType,
      trust: edge.relationshipType === 'trade_partner' ? 0.76 : 0.5,
      resentment: ['patron', 'client', 'rival', 'cold_war', 'hostile'].includes(edge.relationshipType) ? 0.72 : 0.16,
      dependency: ['patron', 'client'].includes(edge.relationshipType) ? 0.78 : 0.3,
      leverage: ['patron', 'hostile'].includes(edge.relationshipType) ? 0.7 : 0.3,
      fear: ['cold_war', 'hostile'].includes(edge.relationshipType) ? 0.72 : 0.2,
      tradeBalance: 0.64,
      pactStrength: edge.relationshipType === 'allied' ? 0.82 : 0.25,
      obligationFatigue: edge.relationshipType === 'allied' ? 0.58 : 0,
    }]));
    const snapshot = {
      worldState: { tick: 10, relationshipStates },
      regionalGraph: { edges },
    };

    const candidates = evaluateRelationshipRules(snapshot, pressuresFor(edges.flatMap(edge => [edge.from, edge.to])), { tick: 11 });

    for (const edge of edges) {
      expect(candidates.some(candidate => candidate.relationshipKey === edge.id)).toBe(true);
    }
    expect(candidates.every(candidate => candidate.ruleFamily === 'relationship')).toBe(true);
    expect(candidates.filter(candidate => candidate.proposalPayload?.kind === 'relationship_label_change')
      .every(candidate => candidate.applyMode === 'proposal')).toBe(true);
  });

  test('allied settlements buffer target pressure by creating supporter burden and conflict obligation drift', () => {
    const edge = {
      id: 'edge.ashford.briar',
      from: 'ashford',
      to: 'briar',
      relationshipType: 'allied',
    };
    const snapshot = {
      worldState: {
        tick: 12,
        relationshipStates: {
          [edge.id]: {
            relationshipType: 'allied',
            trust: 0.78,
            resentment: 0.08,
            pactStrength: 0.82,
            obligationFatigue: 0.18,
            aidBurden: 0.12,
            militaryBurden: 0.08,
          },
        },
      },
      regionalGraph: { edges: [edge] },
    };
    const candidates = evaluateRelationshipRules(snapshot, pressureIndex([
      { settlementId: 'ashford', kind: 'conflict', score: 0.22 },
      { settlementId: 'ashford', kind: 'food', score: 0.12 },
      { settlementId: 'ashford', kind: 'disease', score: 0.1 },
      { settlementId: 'briar', kind: 'food', score: 0.84 },
      { settlementId: 'briar', kind: 'disease', score: 0.66 },
      { settlementId: 'briar', kind: 'conflict', score: 0.73 },
      { settlementId: 'briar', kind: 'hostility', score: 0.61 },
    ]), { tick: 13 });

    const burden = candidates.find(candidate => candidate.ruleId === 'allied_aid_buffer');
    expect(burden).toBeTruthy();
    expect(burden.targetSaveId).toBe('ashford');
    expect(burden.condition?.archetype).toBe('alliance_burden');
    expect(burden.condition?.relatedSettlementId).toBe('briar');
    expect(burden.relationshipPatch.aidBurden).toBeGreaterThan(0.12);
    expect(burden.relationshipPatch.obligationFatigue).toBeGreaterThan(0.18);

    const obligation = candidates.find(candidate => candidate.ruleId === 'allied_conflict_obligation');
    expect(obligation).toBeTruthy();
    expect(obligation.applyMode).toBe('auto');
    expect(obligation.relationshipPatch.trajectory).toBe('committed');
  });

  test('overburdened alliances queue visible cooling as a proposal instead of auto-changing labels', () => {
    const edge = {
      id: 'edge.ashford.briar',
      from: 'ashford',
      to: 'briar',
      relationshipType: 'allied',
    };
    const snapshot = {
      worldState: {
        tick: 18,
        relationshipStates: {
          [edge.id]: {
            relationshipType: 'allied',
            trust: 0.44,
            resentment: 0.36,
            pactStrength: 0.24,
            obligationFatigue: 0.7,
            aidBurden: 0.62,
            militaryBurden: 0.55,
          },
        },
      },
      regionalGraph: { edges: [edge] },
    };
    const candidates = evaluateRelationshipRules(snapshot, pressureIndex([
      { settlementId: 'ashford', kind: 'conflict', score: 0.5 },
      { settlementId: 'briar', kind: 'food', score: 0.9 },
      { settlementId: 'briar', kind: 'disease', score: 0.74 },
      { settlementId: 'briar', kind: 'conflict', score: 0.86 },
    ]), { tick: 19 });

    const cooling = candidates.find(candidate => candidate.ruleId === 'allied_overburdened');
    expect(cooling).toBeTruthy();
    expect(cooling.applyMode).toBe('proposal');
    expect(cooling.proposalPayload).toMatchObject({
      kind: 'relationship_label_change',
      relationshipKey: edge.id,
      fromType: 'allied',
      toType: 'trade_partner',
    });
    expect(cooling.relationshipPatch.proposedRelationshipType).toBe('trade_partner');
    expect(cooling.conflictTags).toContain(`label:${edge.id}`);
  });

  test('stressor catalog births every stressor type and can spread an active roaming stressor', () => {
    const pressureRows = [
      'food',
      'disease',
      'conflict',
      'trade',
      'legitimacy',
      'crime',
    ].map(kind => ({
      settlementId: 'oakmere',
      settlementName: 'Oakmere',
      kind,
      label: `${kind} pressure`,
      score: 0.92,
      reasons: [`high ${kind}`],
    }));
    const snapshot = {
      worldState: {
        tick: 5,
        stressors: [{
          id: 'world_stressor.disease.ashford',
          type: 'disease_outbreak',
          originSettlementId: 'ashford',
          severity: 0.7,
          affectedSettlementIds: ['ashford'],
          spreadChannels: ['trade_route'],
        }],
      },
      regionalGraph: {
        // Spread now requires a CONFIRMED channel (design: suggested channels
        // never propagate), not an arbitrary edge.
        channels: [{ type: 'trade_route', from: 'ashford', to: 'briar', status: 'confirmed' }],
      },
    };

    const candidates = evaluateStressorRules(snapshot, pressureIndex(pressureRows), { tick: 6, pressures: pressureRows });

    for (const type of Object.keys(STRESSOR_CATALOG)) {
      expect(candidates.some(candidate => candidate.candidateType === `stressor_birth_${type}`)).toBe(true);
    }
    expect(candidates.some(candidate => candidate.candidateType === 'stressor_spread_disease_outbreak')).toBe(true);
  });

  test('NPC role archetypes produce pressure-matched actions', () => {
    const npcStates = Object.fromEntries(Object.keys(NPC_ROLE_ARCHETYPES).map((roleArchetype, index) => {
      const npcId = `ashford:npc_${roleArchetype}`;
      return [npcId, {
        npcId,
        settlementId: 'ashford',
        name: `NPC ${index}`,
        roleArchetype,
        factionId: `faction_${index % 3}`,
        factionSeat: index % 3 === 0 ? 'leader_champion' : 'agent_protege',
        dotRank: index % 3 === 0 ? 3 : 1,
        influenceBasis: NPC_ROLE_ARCHETYPES[roleArchetype].influenceBasis,
        shortGoal: 'expand_influence',
        longGoal: 'secure_office',
        ideal: 'prosperity',
        ambition: 0.82,
        loyalty: 0.6,
        momentum: 0.2,
        corruption: roleArchetype === 'criminal',
        goalProgress: { short: 0, long: 0 },
        rivalryTargets: [],
      }];
    }));
    const snapshot = { worldState: { tick: 3, npcStates } };

    const candidates = evaluateNpcRules(snapshot, pressuresFor(['ashford']), { tick: 4 });

    for (const roleArchetype of Object.keys(NPC_ROLE_ARCHETYPES)) {
      expect(candidates.some(candidate => candidate.ruleId?.startsWith(`npc_${roleArchetype}_`))).toBe(true);
    }
  });

  test('top factions can create government and institution proposals under low legitimacy', () => {
    const snapshot = {
      worldState: {
        tick: 2,
        factionStates: {
          'ashford:merchant_league': {
            factionId: 'ashford:merchant_league',
            settlementId: 'ashford',
            name: 'Merchant League',
            archetype: 'merchant',
            governmentPreference: 'merchant_charter',
            powerBases: ['wealth'],
            controlledInstitutions: [],
            suppressedInstitutions: [],
            lawPreferences: ['contract_priority'],
            rivals: ['ashford:temple_wardens'],
            legitimacyClaim: 0.5,
            riskTolerance: 0.6,
            momentum: 0.3,
            exhaustion: 0,
          },
          'ashford:temple_wardens': {
            factionId: 'ashford:temple_wardens',
            settlementId: 'ashford',
            name: 'Temple Wardens',
            archetype: 'religious',
            governmentPreference: 'temple_authority',
            powerBases: ['religious_authority'],
            controlledInstitutions: [],
            suppressedInstitutions: [],
            lawPreferences: ['temple_privilege'],
            rivals: ['ashford:merchant_league'],
            legitimacyClaim: 0.45,
            riskTolerance: 0.5,
            momentum: 0.2,
            exhaustion: 0,
          },
        },
      },
      settlements: [{
        id: 'ashford',
        settlement: {
          services: [{ id: 'granary', name: 'Public Granary' }],
          powerStructure: {
            factions: [
              { faction: 'Merchant League', power: 76 },
              { faction: 'Temple Wardens', power: 62 },
            ],
          },
        },
      }],
    };

    const candidates = evaluateFactionRules(snapshot, pressuresFor(['ashford'], 0.88), { tick: 3 });

    expect(candidates.some(candidate => candidate.proposalPayload?.kind === 'government_change')).toBe(true);
    expect(candidates.some(candidate => ['institution_capture', 'institution_suppression'].includes(candidate.proposalPayload?.kind))).toBe(true);
  });

  test('conflict resolution suppresses contradictory visible relationship transitions', () => {
    const candidates = resolveCandidateConflicts([
      {
        id: 'a',
        type: 'relationship',
        candidateType: 'trade_to_allied',
        relationshipKey: 'edge.a.b',
        severity: 0.7,
        applyMode: 'proposal',
        conflictTags: ['label:edge.a.b'],
        proposalPayload: { kind: 'relationship_label_change', relationshipKey: 'edge.a.b', fromType: 'trade_partner', toType: 'allied' },
      },
      {
        id: 'b',
        type: 'relationship',
        candidateType: 'trade_to_patron_client',
        relationshipKey: 'edge.a.b',
        severity: 0.55,
        applyMode: 'proposal',
        conflictTags: ['label:edge.a.b'],
        proposalPayload: { kind: 'relationship_label_change', relationshipKey: 'edge.a.b', fromType: 'trade_partner', toType: 'patron' },
      },
    ]);

    expect(candidates).toHaveLength(1);
    expect(candidates[0].id).toBe('a');
  });
});
