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

  it('scope "individual" (default) does NOT mark the home institution', () => {
    const next = impose(settlement(), 'Honest Mira', { scope: 'individual' });
    const watch = next.institutions.find(i => i.name === 'City Watch');
    expect((watch.impairments || []).some(im => im.type === 'corruption')).toBe(false);
  });

  it('scope "individual_institution" covertly compromises the NPC home institution', () => {
    // Mira homes in the City Watch; the bigger scope marks it with a COVERT
    // corruption impairment (not a public legitimacy hit).
    const next = impose(settlement(), 'Honest Mira', { scope: 'individual_institution' });
    const watch = next.institutions.find(i => i.name === 'City Watch');
    const mark = (watch.impairments || []).find(im => im.type === 'corruption');
    expect(mark).toBeTruthy();
    expect(mark.covert).toBe(true);
    expect(mark.type).not.toBe('legitimacy'); // covert, not a public scandal
    // The NPC is still turned exactly as the individual scope would.
    expect(next.npcs.find(n => n.name === 'Honest Mira').corrupt).toBe(true);
  });

  it('the covert institution-scope mark never leaks to the revealed exposure channel', async () => {
    // The covert mark feeds the sim through compromisedSecurityInstitutions: it
    // must read as covert, never revealed, or it would raise the exposure
    // visibility of the very NPC it was meant to conceal (the inverse of intent).
    const { compromisedSecurityInstitutions, patronageSecurityDrag } = await import('../../../src/domain/corruption.js');
    const next = impose(settlement(), 'Honest Mira', { scope: 'individual_institution' });
    const { covert, revealed } = compromisedSecurityInstitutions(next);
    expect(covert).toContain('City Watch');
    expect(revealed).toHaveLength(0);
    expect(patronageSecurityDrag(next).revealed).toHaveLength(0);
  });
});

describe('IMPOSE_CORRUPTION stateDeltas — scope drives a distinct, larger dial', () => {
  it('the institution scope moves a strictly larger resilience hit than the individual scope', async () => {
    const { EVENT_REGISTRY } = await import('../../../src/domain/events/registry.js');
    const ind = EVENT_REGISTRY.IMPOSE_CORRUPTION.stateDeltas({ payload: { scope: 'individual', severity: 0.5 } });
    const inst = EVENT_REGISTRY.IMPOSE_CORRUPTION.stateDeltas({ payload: { scope: 'individual_institution', severity: 0.5 } });
    expect(inst.resilience).toBeLessThan(ind.resilience); // more negative = bigger hit
    expect(Math.abs(inst.resilience)).toBeGreaterThan(Math.abs(ind.resilience));
  });
});
