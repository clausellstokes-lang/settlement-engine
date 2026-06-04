/**
 * Successor inference tests - when a pillar NPC dies, the engine should
 * suggest reasonable replacements ranked by institutional/factional
 * overlap and importance tier.
 */

import { describe, test, expect } from 'vitest';
import { inferSuccessors, precomputeSuccessors } from '../../src/domain/entities/successors.js';
import { createNpc } from '../../src/domain/entities/npcs.js';

const settlementFixture = () => ({
  npcs: [
    createNpc({
      id: 'npc.priestess', name: 'High Priestess Mara', importance: 'pillar',
      linkedInstitutionIds: ['inst.temple'], linkedFactionIds: ['faction.clergy'],
      influence: 80,
    }),
    // Likely successor: same temple, key tier
    createNpc({
      id: 'npc.deputy', name: 'Deputy Priest Tovin', importance: 'key',
      linkedInstitutionIds: ['inst.temple'], linkedFactionIds: ['faction.clergy'],
      influence: 60,
    }),
    // Less likely: same faction but different institution
    createNpc({
      id: 'npc.scribe', name: 'Scribe Elren', importance: 'notable',
      linkedInstitutionIds: ['inst.library'], linkedFactionIds: ['faction.clergy'],
      influence: 30,
    }),
    // Irrelevant: different institution and faction
    createNpc({
      id: 'npc.smith', name: 'Smith Garon', importance: 'notable',
      linkedInstitutionIds: ['inst.smithy'], linkedFactionIds: ['faction.guild'],
      influence: 40,
    }),
    // Dead NPC - should be filtered out
    createNpc({
      id: 'npc.deadOne', name: 'Old Priest Elias', importance: 'key',
      linkedInstitutionIds: ['inst.temple'], linkedFactionIds: ['faction.clergy'],
      status: 'dead',
    }),
    // The one we're killing - should not appear in own successor list
  ],
});

describe('inferSuccessors', () => {
  test('returns ranked candidates sorted by overlap + importance', () => {
    const settlement = settlementFixture();
    const outgoing = settlement.npcs[0]; // High Priestess
    const successors = inferSuccessors({ outgoing, settlement });

    expect(successors.length).toBeGreaterThan(0);
    // Deputy should be #1 - same temple AND same faction AND key tier
    expect(successors[0].id).toBe('npc.deputy');
  });

  test('excludes dead, removed, exiled NPCs', () => {
    const settlement = settlementFixture();
    const outgoing = settlement.npcs[0];
    const successors = inferSuccessors({ outgoing, settlement });
    const ids = successors.map(n => n.id);
    expect(ids).not.toContain('npc.deadOne');
  });

  test('excludes the outgoing NPC themselves', () => {
    const settlement = settlementFixture();
    const outgoing = settlement.npcs[0];
    const successors = inferSuccessors({ outgoing, settlement });
    const ids = successors.map(n => n.id);
    expect(ids).not.toContain('npc.priestess');
  });

  test('respects the limit', () => {
    const settlement = settlementFixture();
    const outgoing = settlement.npcs[0];
    const successors = inferSuccessors({ outgoing, settlement, limit: 1 });
    expect(successors.length).toBe(1);
  });

  test('returns [] for unrelated NPC', () => {
    const settlement = settlementFixture();
    const stranger = createNpc({
      id: 'npc.stranger', name: 'Wandering Stranger',
      linkedInstitutionIds: [], linkedFactionIds: [],
    });
    const successors = inferSuccessors({ outgoing: stranger, settlement });
    expect(successors).toEqual([]);
  });

  test('handles missing settlement gracefully', () => {
    expect(inferSuccessors({ outgoing: null, settlement: null })).toEqual([]);
    expect(inferSuccessors({ outgoing: { id: 'x' }, settlement: null })).toEqual([]);
  });
});

describe('precomputeSuccessors', () => {
  test('returns ID list for setting potentialSuccessors at generation time', () => {
    const settlement = settlementFixture();
    const npc = settlement.npcs[0];
    const ids = precomputeSuccessors({ npc, settlement });
    expect(Array.isArray(ids)).toBe(true);
    expect(ids[0]).toBe('npc.deputy');
  });
});
