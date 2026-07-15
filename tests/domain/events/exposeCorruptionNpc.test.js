import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';
import { EVENT_REGISTRY, isCorruptNpcTarget } from '../../../src/domain/events/registry.js';

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
  it('removes the exposed NPC, installs a clean successor in the seat, impairs BOTH institutions', () => {
    const next = mutateSettlement({ settlement: settlement(), event: { id: 'e1', type: 'EXPOSE_CORRUPTION', targetId: 'Captain Vex' }, now: NOW });
    expect(next.npcs.find((n) => n.name === 'Captain Vex')).toBeUndefined(); // removed
    const successor = next.npcs.find((n) => n.replacedNpc === 'Captain Vex');
    expect(successor).toBeTruthy();
    expect(successor.corrupt).toBeFalsy();
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

  it('is NPC-only: directly exposing an institution is a no-op (the chain runs only through an NPC)', () => {
    const next = mutateSettlement({ settlement: settlement(), event: { id: 'e4', type: 'EXPOSE_CORRUPTION', targetId: 'City Watch' }, now: NOW });
    const watch = next.institutions.find((i) => i.id === 'i2');
    // No direct legitimacy impairment was applied to the institution itself.
    expect(watch.impairments?.length || 0).toBe(0);
    // No corruption_exposed scandal was minted from a non-NPC target.
    expect((next.activeConditions || []).some((c) => c.archetype === 'corruption_exposed')).toBe(false);
    // The still-corrupt insider is untouched (exposure must name the NPC).
    expect(next.npcs.find((n) => n.name === 'Captain Vex')?.corrupt).toBe(true);
  });

  it('is NPC-only: directly exposing a faction is a no-op', () => {
    const next = mutateSettlement({ settlement: settlement(), event: { id: 'e5', type: 'EXPOSE_CORRUPTION', targetId: 'City Watch' }, now: NOW });
    const fac = (next.powerStructure?.factions || []).find((f) => f.id === 'f1');
    expect(fac.impairments?.length || 0).toBe(0);
  });
});

describe('§corruption — EXPOSE_CORRUPTION authored effects gate on a corrupt target', () => {
  const spec = EVENT_REGISTRY.EXPOSE_CORRUPTION;

  it('isCorruptNpcTarget resolves a corrupt NPC by name and rejects a clean one', () => {
    const s = settlement();
    expect(isCorruptNpcTarget(s, 'Captain Vex')).toBe(true); // corrupt
    expect(isCorruptNpcTarget(s, 'npc_guard')).toBe(true);   // by id too
    expect(isCorruptNpcTarget(s, 'Honest Mira')).toBe(false); // clean NPC
    expect(isCorruptNpcTarget(s, 'City Watch')).toBe(false);  // an institution, not an NPC
  });

  it('moves the dials only for a corrupt NPC target', () => {
    const s = settlement();
    const corrupt = spec.stateDeltas({ targetId: 'Captain Vex', payload: { severity: 0.7 } }, s);
    expect(corrupt.resilience).toBeLessThan(0);
    expect(corrupt.volatility).toBeGreaterThan(0);

    // A clean NPC (the no-op case) authors zero deltas — no phantom dial move.
    const clean = spec.stateDeltas({ targetId: 'Honest Mira', payload: { severity: 0.7 } }, s);
    expect(clean).toEqual({});
    // An institution target (the chain-only case) likewise authors nothing direct.
    const inst = spec.stateDeltas({ targetId: 'City Watch', payload: { severity: 0.7 } }, s);
    expect(inst).toEqual({});
  });

  it('writes scandal prose only for a corrupt NPC target', () => {
    const s = settlement();
    expect(spec.narrate({ targetId: 'Captain Vex' }, s)).toContain('publicly exposed');
    expect(spec.narrate({ targetId: 'Honest Mira' }, s)).toBe(''); // no prose for a no-op
    expect(spec.narrate({ targetId: 'City Watch' }, s)).toBe('');
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
