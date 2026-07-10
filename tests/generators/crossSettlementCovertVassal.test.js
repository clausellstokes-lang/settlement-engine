/**
 * crossSettlementCovertVassal.test.js — the criminal_network / vassal
 * relationship types generate cross-settlement conflict content (E5).
 *
 * Before the port, crossSettlementConflicts had ZERO handling for either type:
 * a vassal or criminal_network link produced no NPC conflicts and no faction
 * engagement (the neutral fallback swallowed them), and neighbourBackLink had
 * no covert-contact template — the RelationshipsTab rendered an empty conflict
 * panel for exactly the relationship types the regional layer emits.
 */
import { describe, it, expect } from 'vitest';
import { generateCrossSettlementConflicts } from '../../src/generators/crossSettlementConflicts.js';
import { createPRNG } from '../../src/kernel/prng.js';

const settlement = (name, seedTag) => ({
  name,
  _seed: seedTag,
  npcs: [
    { name: `${name} Reeve`, role: 'Reeve', category: 'government' },
    { name: `${name} Captain`, role: 'Guard Captain', category: 'military' },
    { name: `${name} Factor`, role: 'Trade Factor', category: 'economy' },
    { name: `${name} Fence`, role: 'Fence', category: 'criminal' },
  ],
  factions: [
    { name: `${name} Council`, category: 'government' },
    { name: `${name} Syndicate`, category: 'criminal' },
    { name: `${name} League`, category: 'economy' },
  ],
});

const gen = (relType) => generateCrossSettlementConflicts(
  settlement('Ashford', 'seed-a'), settlement('Briar', 'seed-b'),
  relType, `link-${relType}`, createPRNG(`e5-${relType}`),
);

describe('criminal_network / vassal cross-settlement conflicts', () => {
  for (const relType of ['vassal', 'criminal_network']) {
    it(`${relType} links generate NPC conflicts with a ${relType}-specific nature`, () => {
      const { forA, forB } = gen(relType);
      const npcConflicts = [...forA, ...forB].filter((c) => c.type === 'conflict');
      expect(npcConflicts.length).toBeGreaterThan(0);
      for (const c of npcConflicts) {
        expect(c.relType).toBe(relType);
        expect(String(c.conflictNature || '')).not.toBe('');
        expect(String(c.description || '')).not.toContain('undefined');
      }
    });

    it(`${relType} links engage factions (doFaction covers the type)`, () => {
      const { forA, forB } = gen(relType);
      const factionConflicts = [...forA, ...forB].filter((c) => c.type === 'faction_engagement');
      expect(factionConflicts.length).toBeGreaterThan(0);
      for (const c of factionConflicts) {
        expect(String(c.description || '')).not.toContain('undefined');
      }
    });
  }

  it('is deterministic for the same pair identity', () => {
    expect(JSON.stringify(gen('criminal_network'))).toBe(JSON.stringify(gen('criminal_network')));
  });
});
