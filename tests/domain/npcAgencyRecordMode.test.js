import { describe, expect, test } from 'vitest';

import {
  applyNpcPatch,
  evaluateNpcRules,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';
import {
  isPublicOutcome,
  isStateOnlyOutcome,
} from '../../src/domain/worldPulse/pulseHelpers.js';

function npcState(patch = {}) {
  return {
    npcId: 'ashford:clerk',
    settlementId: 'ashford',
    name: 'Tam Ledgerwell',
    roleArchetype: 'civic',
    factionId: 'council',
    factionSeat: 'agent_protege',
    dotRank: 1,
    influenceBasis: ['bureaucracy'],
    shortGoal: 'secure_records',
    longGoal: 'secure_office',
    ideal: 'order',
    flaw: 'pride',
    ambition: 0.6,
    loyalty: 0.5,
    momentum: 0.1,
    leverage: 0,
    corruptionHeat: 0,
    ambitionHeat: 0,
    corruption: false,
    goalProgress: { short: 0.2, long: 0.1 },
    rivalryTargets: [],
    lastActedTick: 3,
    ...patch,
  };
}

function snapshotFor(states) {
  return {
    worldState: {
      tick: 4,
      npcStates: Object.fromEntries(states.map(state => [state.npcId, state])),
      relationshipStates: {},
    },
    regionalGraph: { edges: [] },
    settlements: [{
      id: 'ashford',
      name: 'Ashford',
      settlement: { name: 'Ashford', tier: 'town', population: 1500, npcs: [] },
      activeConditions: [],
    }],
  };
}

function pressures(values) {
  return pressureIndex(Object.entries(values).map(([kind, score]) => ({
    settlementId: 'ashford',
    kind,
    score,
  })));
}

function actionFor(state, pressureValues, extraStates = []) {
  return evaluateNpcRules(
    snapshotFor([state, ...extraStates]),
    pressures(pressureValues),
    { tick: 5 },
  ).find(candidate => candidate.npcId === state.npcId);
}

describe('NPC repeated-action record mode', () => {
  test('an automatic repeat of the same non-targeted action is state-only without changing its state mutation', () => {
    const state = npcState({ lastAction: 'reform' });
    const repeat = actionFor(state, { legitimacy: 0.5 });

    expect(repeat).toMatchObject({
      candidateType: 'npc_reform',
      applyMode: 'auto',
      recordMode: 'state_only',
      rivalNpcId: null,
    });
    expect(isStateOnlyOutcome(repeat)).toBe(true);
    expect(isPublicOutcome(repeat)).toBe(false);

    const tagged = applyNpcPatch(
      { tick: 5, npcStates: { [state.npcId]: state } },
      repeat,
    );
    const { recordMode: _recordMode, ...legacyShape } = repeat;
    const untagged = applyNpcPatch(
      { tick: 5, npcStates: { [state.npcId]: state } },
      legacyShape,
    );

    expect(tagged).toEqual(untagged);
    expect(tagged.npcStates[state.npcId]).toMatchObject(repeat.npcPatch);
    expect(tagged.npcStates[state.npcId].goalProgress.short)
      .toBeGreaterThan(state.goalProgress.short);
  });

  test.each([
    ['first action', null],
    ['changed action', 'bargain'],
  ])('%s remains public', (_label, lastAction) => {
    const action = actionFor(npcState({ lastAction }), { legitimacy: 0.5 });

    expect(action).toMatchObject({
      candidateType: 'npc_reform',
      applyMode: 'auto',
    });
    expect(action.recordMode).toBeUndefined();
    expect(isPublicOutcome(action)).toBe(true);
  });

  test('a repeated action that crosses its proposal threshold remains a public DM question', () => {
    const proposal = actionFor(
      npcState({ ambition: 0.9, momentum: 0.5, lastAction: 'reform' }),
      { legitimacy: 0.95 },
    );

    expect(proposal).toMatchObject({
      candidateType: 'npc_reform',
      applyMode: 'proposal',
      proposalPayload: { kind: 'npc_action', actionFamily: 'reform' },
    });
    expect(proposal.recordMode).toBeUndefined();
    expect(isPublicOutcome(proposal)).toBe(true);
  });

  test('a repeated automatic move against a named rival remains public', () => {
    const actor = npcState({
      npcId: 'ashford:dissident',
      name: 'Sister Mara',
      roleArchetype: 'dissident',
      factionId: 'reformers',
      dotRank: 2,
      ambition: 0.9,
      momentum: 0.3,
      lastAction: 'expose',
    });
    const rival = npcState({
      npcId: 'ashford:reeve',
      name: 'Brother Aldric',
      roleArchetype: 'civic',
      factionId: 'council',
      ambition: 0.2,
      lastActedTick: 4,
    });
    const targeted = actionFor(actor, { crime: 0.45 }, [rival]);

    expect(targeted).toMatchObject({
      candidateType: 'npc_expose',
      applyMode: 'auto',
      rivalNpcId: rival.npcId,
      rivalPatch: {
        lastTargetedBy: actor.npcId,
      },
    });
    expect(targeted.recordMode).toBeUndefined();
    expect(isPublicOutcome(targeted)).toBe(true);
  });
});
