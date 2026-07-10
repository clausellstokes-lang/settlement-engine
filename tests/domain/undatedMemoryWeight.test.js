import { describe, expect, test } from 'vitest';

import {
  relationshipMemoryWeight,
  buildRelationshipPostures,
} from '../../src/domain/worldPulse/index.js';

// B03 finding #7: a memory row with a non-finite tick used to score a fixed
// default weight (0.35) forever, so undated/legacy rows never aged out and
// permanently inflated memoryScore / dailyLifeWeight / posture classification.
// They must now age to nothing (weight 0).

describe('undated relationship memory rows age out instead of scoring forever', () => {
  test('relationshipMemoryWeight returns 0 for a non-finite event tick', () => {
    expect(relationshipMemoryWeight(undefined, 10)).toBe(0);
    expect(relationshipMemoryWeight(null, 10)).toBe(0);
    expect(relationshipMemoryWeight(NaN, 10)).toBe(0);
    // Dated rows still age normally.
    expect(relationshipMemoryWeight(10, 10)).toBe(1);
    expect(relationshipMemoryWeight(-20, 10)).toBe(0);
  });

  test('an undated incident does not inflate memoryScore in a built posture', () => {
    const edge = { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' };
    const worldState = {
      tick: 12,
      relationshipStates: {
        'edge.a.b': {
          relationshipType: 'rival',
          resentment: 0.4, // below the 0.62 escalation gate on its own
          // An undated legacy incident: no tick. It must contribute 0.
          recentIncidents: [{ type: 'rival_sabotage', severity: 0.9 }],
        },
      },
    };
    const [posture] = buildRelationshipPostures({
      worldState,
      regionalGraph: { edges: [edge] },
      currentTick: 12,
    });
    expect(posture.memoryScore).toBe(0);
    // With no memory inflation the rival posture stays 'managed', not escalating.
    expect(posture.posture).toBe('managed_rivalry');
  });

  test('a dated incident still scores and can lift the posture', () => {
    const edge = { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' };
    const worldState = {
      tick: 12,
      relationshipStates: {
        'edge.a.b': {
          relationshipType: 'rival',
          resentment: 0.4,
          recentIncidents: [{ type: 'rival_sabotage', severity: 0.9, tick: 12 }],
        },
      },
    };
    const [posture] = buildRelationshipPostures({
      worldState,
      regionalGraph: { edges: [edge] },
      currentTick: 12,
    });
    expect(posture.memoryScore).toBeGreaterThan(0.5);
    expect(posture.posture).toBe('escalating_rivalry');
  });
});
