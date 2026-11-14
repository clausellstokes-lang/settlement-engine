/**
 * tests/domain/events/imposeCorruption.test.js
 *
 * IMPOSE_CORRUPTION — a DM turns a clean NPC by linking them to a criminal organization in the
 * settlement. ALLEGIANCE-CAR1 (2026-11-08): it writes the card's hidden `allegiance` — the one shape
 * birth writes (domain/people/allegiance.js): its house the org, its vector the flaw's, its handler dealt
 * draw-free — so the corruption is canon, visible to the DM, and later exposable.
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
  it('turns a clean NPC: an allegiance with a vector to the settlement criminal org', () => {
    const next = impose(settlement(), 'Honest Mira');
    const mira = next.npcs.find(n => n.name === 'Honest Mira');
    expect(mira.allegiance).toBeTruthy();
    expect(typeof mira.allegiance.vector).toBe('string');
    expect(mira.allegiance.vector.length).toBeGreaterThan(0);
    expect(mira.allegiance.house).toBe("Thieves' Guild");
    expect(mira.allegiance).toMatchObject({ veiled: true, covert: true, share: 0.15 });
  });

  it('honors an explicit criminal organization in the payload', () => {
    const s = settlement();
    s.institutions.push({ id: 'i3', name: 'Smugglers Ring', category: 'criminal' });
    const next = impose(s, 'Honest Mira', { criminalInstitution: 'Smugglers Ring' });
    expect(next.npcs.find(n => n.name === 'Honest Mira').allegiance.house).toBe('Smugglers Ring');
  });

  it('leaves an already-corrupt NPC untouched (no re-corruption)', () => {
    const s = settlement();
    s.npcs[0].allegiance = { power: null, house: 'Old Patron', vector: 'greed', via: 'retainer', handler: null, share: 0.15, veiled: true, covert: true };
    const next = impose(s, 'Honest Mira');
    const mira = next.npcs.find(n => n.name === 'Honest Mira');
    expect(mira.allegiance.house).toBe('Old Patron'); // not overwritten
  });

  it('is a no-op when the settlement has no criminal organization to link to', () => {
    const s = settlement();
    s.institutions = [{ id: 'i2', name: 'City Watch' }]; // no criminal org
    const next = impose(s, 'Honest Mira');
    expect(next.npcs.find(n => n.name === 'Honest Mira').allegiance).toBeUndefined();
  });

  it('is a no-op for an unknown target NPC (no NPC turned)', () => {
    const s = settlement();
    const next = impose(s, 'Nobody In Particular');
    expect(next.npcs.every(n => !n.allegiance)).toBe(true);
  });

  // ── W-DOCTRINE-3b §6 — THE BENEFICIARY PICKER (a foreign court, not the local underworld) ──
  describe('foreign beneficiary leash', () => {
    // buildEvent normalizes the leash before it reaches the handler; the handler stamps it verbatim.
    const foreignLeash = { kind: 'foreign_settlement', settlementId: 'crown', factionName: null, viaLocalOrg: null, covert: true };

    it('a FOREIGN-kind leash stamps allegiance.leash and names NO local org (the channel replaces it)', () => {
      const next = impose(settlement(), 'Honest Mira', { leash: foreignLeash });
      const mira = next.npcs.find(n => n.name === 'Honest Mira');
      expect(mira.allegiance.leash).toEqual(foreignLeash);
      expect(mira.allegiance.house).toBe(''); // no local org named
      expect(mira.allegiance.power).toBeNull();
    });

    it('the channel requirement REPLACES the local-org rule: a foreign leash works with NO local org', () => {
      const s = settlement();
      s.institutions = [{ id: 'i2', name: 'City Watch' }]; // no criminal org at all
      const next = impose(s, 'Honest Mira', { leash: foreignLeash });
      expect(next.npcs.find(n => n.name === 'Honest Mira').allegiance.leash).toEqual(foreignLeash); // foreign path needs no local underworld
    });

    it('a foreign leash with NO resolvable endpoint is a no-op (veto no_beneficiary)', () => {
      const next = impose(settlement(), 'Honest Mira', { leash: { kind: 'foreign_settlement', settlementId: null, factionName: null, covert: true } });
      expect(next.npcs.find(n => n.name === 'Honest Mira').allegiance).toBeUndefined();
    });

    it('the LOCAL path is byte-identical when no foreign leash is supplied (no leash key)', () => {
      const next = impose(settlement(), 'Honest Mira');
      const mira = next.npcs.find(n => n.name === 'Honest Mira');
      expect(mira.allegiance.house).toBe("Thieves' Guild");
      expect(mira.allegiance.leash).toBeUndefined();
    });
  });
});
