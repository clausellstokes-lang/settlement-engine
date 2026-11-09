import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';

const NOW = '2026-06-08T00:00:00.000Z';
const settlement = () => ({
  name: 'Town',
  institutions: [{ id: 'i1', name: "Thieves' Guild Chapter" }, { id: 'i2', name: 'City Watch' }],
  powerStructure: { factions: [{ id: 'f1', name: 'City Watch', controlsInstitutionIds: ['i2'] }] },
  factions: [],
  npcs: [
    {
      // ALLEGIANCE-CAR1 (2026-11-08): the retired `corrupt` mark is the card's hidden `allegiance` (allegianceOf)
      id: 'npc_guard', name: 'Captain Vex', allegiance: { power: null, house: "Thieves' Guild Chapter", vector: 'greed', via: 'retainer', handler: null, share: 0.15, veiled: true, covert: true },
      factionAffiliation: 'City Watch', timesExposed: 0,
    },
    { id: 'npc_clerk', name: 'Honest Mira', corrupt: false },
  ],
});

describe('§corruption Phase 4 — EXPOSE_CORRUPTION targets a corrupt NPC', () => {
  it('removes the exposed NPC, installs a clean successor in the seat, impairs BOTH institutions', () => {
    const next = mutateSettlement({ settlement: settlement(), event: { id: 'e1', type: 'EXPOSE_CORRUPTION', targetId: 'Captain Vex' }, now: NOW });
    expect(next.npcs.find((n) => n.name === 'Captain Vex')).toBeUndefined(); // removed
    const successor = next.npcs.find((n) => n.replacedNpc === 'Captain Vex');
    expect(successor).toBeTruthy();
    expect(successor.corrupt).toBeFalsy();
    expect(successor.allegiance).toBeUndefined(); // ALLEGIANCE-CAR1: the successor holds no allegiance
    expect(successor.factionAffiliation).toBe('City Watch'); // inherited the seat
    const guild = next.institutions.find((i) => i.id === 'i1');
    const watch = next.institutions.find((i) => i.id === 'i2');
    expect(guild.impairments?.length).toBeGreaterThan(0); // criminal institution tarnished
    expect(watch.impairments?.length).toBeGreaterThan(0); // home institution tarnished
  });

  it('a clean NPC target falls through (no spurious corruption change)', () => {
    const next = mutateSettlement({ settlement: settlement(), event: { id: 'e2', type: 'EXPOSE_CORRUPTION', targetId: 'Honest Mira' }, now: NOW });
    expect(next.npcs.find((n) => n.name === 'Honest Mira').corrupt).toBeFalsy();
  });
});

describe('§corruption Phase 4 — removing a criminal institution severs ties', () => {
  it('clears corruption on NPCs tied to the removed criminal institution', () => {
    const next = mutateSettlement({ settlement: settlement(), event: { id: 'e3', type: 'REMOVE_INSTITUTION', targetId: "Thieves' Guild Chapter" }, now: NOW });
    const vex = next.npcs.find((n) => n.name === 'Captain Vex');
    // ALLEGIANCE-CAR1: the severed card loses its allegiance (the clean state)
    expect(vex.allegiance).toBeUndefined();
    expect(vex.ousted).toBe(true);
  });
});
