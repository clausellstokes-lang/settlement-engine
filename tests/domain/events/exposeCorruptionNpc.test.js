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
      id: 'npc_guard', name: 'Captain Vex', corrupt: true, corruptionVector: 'greed',
      corruptTies: { criminalInstitution: "Thieves' Guild Chapter" }, factionAffiliation: 'City Watch', timesExposed: 0,
    },
    { id: 'npc_clerk', name: 'Honest Mira', corrupt: false },
  ],
});

describe('§corruption Phase 4 — EXPOSE_CORRUPTION targets a corrupt NPC', () => {
  it('cleans + scars the NPC and impairs BOTH the criminal and home institution', () => {
    const next = mutateSettlement({ settlement: settlement(), event: { id: 'e1', type: 'EXPOSE_CORRUPTION', targetId: 'Captain Vex' }, now: NOW });
    const vex = next.npcs.find((n) => n.name === 'Captain Vex');
    expect(vex.corrupt).toBe(false);
    expect(vex.ousted).toBe(true);
    expect(vex.timesExposed).toBe(1); // scar accrues
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
    expect(vex.corrupt).toBe(false);
    expect(vex.ousted).toBe(true);
  });
});
