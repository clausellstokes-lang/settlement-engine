import { describe, expect, test } from 'vitest';

import { evaluateNpcRules, pressureIndex } from '../../src/domain/worldPulse/index.js';

function heir(progressLong) {
  return {
    worldState: {
      tick: 9,
      npcStates: {
        'a:heir': {
          npcId: 'a:heir', settlementId: 'a', name: 'Lady Vane',
          roleArchetype: 'heir', factionId: 'house_vane', factionSeat: 'lieutenant_operator',
          dotRank: 2, longGoal: 'secure_office', ambition: 0.7, loyalty: 0.5, momentum: 0.2,
          goalProgress: { short: 0.4, long: progressLong },
        },
      },
    },
  };
}

describe('NPC goal culmination', () => {
  test('a long-goal at threshold fires a culmination payoff', () => {
    const candidates = evaluateNpcRules(heir(0.86), pressureIndex([]), { tick: 10 });
    const culm = candidates.find(c => c.candidateType === 'npc_goal_culmination');
    expect(culm).toBeTruthy();
    expect(culm.applyMode).toBe('auto');
    expect(culm.npcPatch.goalProgress.long).toBe(0); // resets so it can't re-fire
    expect(culm.npcPatch.dotRank).toBe(3);            // advanced a rank
    expect(culm.condition.archetype).toBe('faction_challenge');
  });

  test('below the threshold does not culminate', () => {
    const candidates = evaluateNpcRules(heir(0.5), pressureIndex([]), { tick: 10 });
    expect(candidates.some(c => c.candidateType === 'npc_goal_culmination')).toBe(false);
  });
});
