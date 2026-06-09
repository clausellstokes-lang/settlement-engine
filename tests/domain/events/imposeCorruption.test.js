/**
 * tests/domain/events/imposeCorruption.test.js
 *
 * IMPOSE_CORRUPTION — a DM turns a clean NPC by linking them to a criminal organization in the
 * settlement. It writes the exact shape the world-pulse corruption loop seeds from
 * (corrupt + corruptionVector + corruptTies.criminalInstitution), so the corruption is canon,
 * visible, propagating, and later exposable.
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';

const NOW = '2026-06-09T00:00:00.000Z';

const settlement = () => ({
  name: 'Town',
  institutions: [
    { id: 'i1', name: "Thieves' Guild", category: 'criminal' }, // a criminal organization
    { id: 'i2', name: 'City Watch' },
  ],
  powerStructure: { factions: [{ id: 'f1', name: 'City Watch' }] },
  factions: [],
  npcs: [
    { id: 'npc_clerk', name: 'Honest Mira', corrupt: false, flaws: ['greedy'], factionAffiliation: 'City Watch' },
    { id: 'npc_saint', name: 'Saint Cora', corrupt: false },
  ],
});

const impose = (s, targetId, payload) => mutateSettlement({
  settlement: s, event: { id: 'e1', type: 'IMPOSE_CORRUPTION', targetId, payload }, now: NOW,
});

describe('IMPOSE_CORRUPTION', () => {
  it('turns a clean NPC: sets corrupt + vector + ties to the settlement criminal org', () => {
    const next = impose(settlement(), 'Honest Mira');
    const mira = next.npcs.find(n => n.name === 'Honest Mira');
    expect(mira.corrupt).toBe(true);
    expect(typeof mira.corruptionVector).toBe('string');
    expect(mira.corruptionVector.length).toBeGreaterThan(0);
    expect(mira.corruptTies?.criminalInstitution).toBe("Thieves' Guild");
  });

  it('honors an explicit criminal organization in the payload', () => {
    const s = settlement();
    s.institutions.push({ id: 'i3', name: 'Smugglers Ring', category: 'criminal' });
    const next = impose(s, 'Honest Mira', { criminalInstitution: 'Smugglers Ring' });
    expect(next.npcs.find(n => n.name === 'Honest Mira').corruptTies.criminalInstitution).toBe('Smugglers Ring');
  });

  it('leaves an already-corrupt NPC untouched (no re-corruption)', () => {
    const s = settlement();
    s.npcs[0].corrupt = true;
    s.npcs[0].corruptTies = { criminalInstitution: 'Old Patron' };
    const next = impose(s, 'Honest Mira');
    const mira = next.npcs.find(n => n.name === 'Honest Mira');
    expect(mira.corrupt).toBe(true);
    expect(mira.corruptTies.criminalInstitution).toBe('Old Patron'); // not overwritten
  });

  it('is a no-op when the settlement has no criminal organization to link to', () => {
    const s = settlement();
    s.institutions = [{ id: 'i2', name: 'City Watch' }]; // no criminal org
    const next = impose(s, 'Honest Mira');
    expect(next.npcs.find(n => n.name === 'Honest Mira').corrupt).toBeFalsy();
  });

  it('is a no-op for an unknown target NPC (no NPC turned)', () => {
    const s = settlement();
    const next = impose(s, 'Nobody In Particular');
    expect(next.npcs.every(n => !n.corrupt)).toBe(true);
  });
});
