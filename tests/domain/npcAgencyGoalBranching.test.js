import { describe, expect, test } from 'vitest';

import { evaluateNpcRules, pressureIndex } from '../../src/domain/worldPulse/index.js';

// Pin: NPC goal branching classifies conditions by archetype id ONLY (mirror
// of the R1 pressure/population fix). Label prose must never read as a crisis,
// and the context signature must not move when a DM relabels a condition.

function npcState(patch = {}) {
  return {
    npcId: 'a:clerk',
    settlementId: 'a',
    name: 'Tam Ledgerwell',
    roleArchetype: 'civic',
    factionId: 'council',
    factionSeat: 'agent_protege',
    dotRank: 1,
    influenceBasis: ['bureaucracy'],
    contextSignature: 'town|local|',
    contextTier: 'town',
    shortGoal: 'win_public_legitimacy',
    longGoal: 'secure_office',
    ideal: 'order',
    flaw: 'pride',
    ambition: 0.2,
    loyalty: 0.5,
    momentum: 0,
    corruption: false,
    goalProgress: { short: 0, long: 0 },
    rivalryTargets: [],
    ...patch,
  };
}

function snapshotWith(activeConditions, state = npcState()) {
  return {
    worldState: { tick: 4, npcStates: { [state.npcId]: state }, relationshipStates: {} },
    regionalGraph: { edges: [] },
    settlements: [{
      id: 'a',
      name: 'Ashford',
      settlement: { name: 'Ashford', tier: 'town', population: 1500, npcs: [] },
      activeConditions,
    }],
  };
}

function rebranchFor(activeConditions, state = npcState()) {
  const candidates = evaluateNpcRules(snapshotWith(activeConditions, state), pressureIndex([]), { tick: 5 });
  return candidates.find(candidate => candidate.candidateType === 'npc_goal_rebranch') || null;
}

describe('NPC goal branching classifies by condition archetype, not label prose', () => {
  test('a settlement with ONLY siege_lifted recovery does not branch NPCs into crisis goals', () => {
    const rebranch = rebranchFor([{ archetype: 'siege_lifted', label: 'Siege lifted' }]);
    expect(rebranch).toBeNull();
  });

  test('an active war_pressure condition still branches into crisis goals', () => {
    const rebranch = rebranchFor([{ archetype: 'war_pressure', label: 'Wartime pressure' }]);
    expect(rebranch).toBeTruthy();
    expect(rebranch.npcPatch.shortGoal).toBe('survive_crisis');
    expect(rebranch.npcPatch.longGoal).toBe('restore_order');
  });

  test('a crisis word in the label does not branch goals when the archetype is non-crisis', () => {
    const rebranch = rebranchFor([{ archetype: 'regional_information_shock', label: 'War festival' }]);
    expect(rebranch).toBeNull();
  });

  test('a cosmetic label edit does not move the context signature or re-trigger a rebranch', () => {
    const state = npcState({ contextSignature: 'town|local|war_pressure' });
    const rebranch = rebranchFor([{ archetype: 'war_pressure', label: 'The Long Siege of Ashford' }], state);
    expect(rebranch).toBeNull();
  });

  test('custom_crisis branches via crisis-class affectedSystems, never via label', () => {
    const viaSystems = rebranchFor([
      { archetype: 'custom_crisis', label: 'The Ashfall', affectedSystems: ['food_security', 'public_legitimacy'] },
    ]);
    expect(viaSystems).toBeTruthy();
    expect(viaSystems.npcPatch.shortGoal).toBe('survive_crisis');

    const proseOnly = rebranchFor([
      { archetype: 'custom_crisis', label: 'War memorial dedication', affectedSystems: ['public_legitimacy', 'social_trust'] },
    ]);
    expect(proseOnly).toBeNull();
  });

  test('a condition without an archetype is dropped from the signature instead of leaking its label', () => {
    const rebranch = rebranchFor([{ label: 'War memorial dedication' }]);
    expect(rebranch).toBeNull();
  });
});
