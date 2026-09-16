import { describe, expect, test } from 'vitest';

import {
  canonicalRelationshipSeed,
  ensureRelationshipEdgeSeed,
} from '../../src/domain/worldPulse/relationshipEdgeSeed.js';

const NOW = '2026-08-01T00:00:00.000Z';

function escalation(seed = {}) {
  return {
    id: 'world_outcome.trade_war_escalation.inc.chal.8',
    headline: 'Aville answers lost trade with the sword',
    metadata: {
      relationshipSeed: {
        fromId: 'chal',
        toId: 'inc',
        relationshipKey: 'edge.chal.inc',
        fromType: 'neutral',
        ...seed,
      },
    },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: 'edge.chal.inc',
      fromType: 'neutral',
      toType: 'hostile',
    },
  };
}

describe('WR-0c relationship edge seed', () => {
  test('canonicalizes reciprocal missing-pair declarations to one identity', () => {
    expect(canonicalRelationshipSeed('inc', 'chal')).toEqual({
      fromId: 'chal', toId: 'inc', relationshipKey: 'edge.chal.inc',
    });
    expect(canonicalRelationshipSeed('chal', 'inc')).toEqual({
      fromId: 'chal', toId: 'inc', relationshipKey: 'edge.chal.inc',
    });
    expect(canonicalRelationshipSeed('inc', 'inc')).toBeNull();
  });

  test('materializes one deterministic identity edge for an unconnected escalation pair', () => {
    const graph = { schemaVersion: 2, edges: [], channels: [], updatedAt: 'before' };
    const next = ensureRelationshipEdgeSeed(graph, escalation(), NOW);

    expect(next.edges).toEqual([{
      id: 'edge.chal.inc',
      from: 'chal',
      to: 'inc',
      relationshipType: 'neutral',
      status: 'active',
      channelIds: [],
      evidence: [{
        source: 'trade_war_escalation',
        reason: 'Aville answers lost trade with the sword',
        outcomeId: 'world_outcome.trade_war_escalation.inc.chal.8',
      }],
      updatedAt: NOW,
    }]);
    expect(next.updatedAt).toBe(NOW);
  });

  test('is reference-identical when the pair already has an edge in either orientation', () => {
    const forward = { edges: [{ id: 'authored', from: 'inc', to: 'chal', relationshipType: 'rival' }] };
    const reverse = { edges: [{ id: 'authored', from: 'chal', to: 'inc', relationshipType: 'rival' }] };
    expect(ensureRelationshipEdgeSeed(forward, escalation(), NOW)).toBe(forward);
    expect(ensureRelationshipEdgeSeed(reverse, escalation(), NOW)).toBe(reverse);
  });

  test('invalid and self-addressed declarations are no-ops', () => {
    const graph = { edges: [] };
    expect(ensureRelationshipEdgeSeed(graph, {}, NOW)).toBe(graph);
    expect(ensureRelationshipEdgeSeed(graph, escalation({ toId: 'chal' }), NOW)).toBe(graph);
    expect(ensureRelationshipEdgeSeed(graph, escalation({ fromId: '' }), NOW)).toBe(graph);
  });
});
