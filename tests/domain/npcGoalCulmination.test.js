import { describe, expect, test } from 'vitest';

import { evaluateNpcRules, pressureIndex } from '../../src/domain/worldPulse/index.js';

function heir(progressLong, npcId = 'a:heir') {
  return {
    worldState: {
      tick: 9,
      npcStates: {
        [npcId]: {
          npcId, settlementId: 'a', name: 'Lady Vane',
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

  test('the culmination telling is deterministic per beat and varies across NPCs', () => {
    const telling = (npcId) => {
      const candidate = evaluateNpcRules(heir(0.86, npcId), pressureIndex([]), { tick: 10 })
        .find(c => c.candidateType === 'npc_goal_culmination');
      return {
        headline: candidate.headline,
        summary: candidate.summary,
        reasons: candidate.reasons,
        condition: candidate.condition.description,
        cause: candidate.condition.causes[0].reason,
      };
    };

    expect(telling('a:heir:stable')).toEqual(telling('a:heir:stable'));
    const tellings = Array.from({ length: 24 }, (_, i) => telling(`a:heir:${i}`));
    for (const field of ['headline', 'summary', 'condition', 'cause']) {
      expect(new Set(tellings.map(row => row[field])).size, `${field} has authored variety`).toBeGreaterThan(1);
    }
    expect(new Set(tellings.map(row => row.reasons.join(' '))).size).toBeGreaterThan(1);
  });
});
