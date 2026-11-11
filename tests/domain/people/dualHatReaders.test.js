/**
 * dualHatReaders.test.js — COHERENCE-POWERS, cure (i) (the chair's ruling of 2026-11-11: "ONE PERSON, ONE
 * FACE ... the office's face IS the leader"): where a house leads, the seat's house bears no face of its own,
 * and the readers that find a house's face by its key fall back to the seat holder; the two hats print on
 * the person's card line, the seat row and the seat's house card. A town saved before the cure keeps its
 * office face, and every reader reads it as before (nothing is migrated).
 */
import { describe, expect, it } from 'vitest';
import { cardHatsOf, cardOfficeOf, cardPowerLine, governingNameOf } from '../../../src/domain/people/cardPowers.js';
import { seatHouseFaceOf } from '../../../src/domain/dossier/seatHolder.js';
import { deriveLevers } from '../../../src/domain/crisis/crisisCast.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { institutionsWithServices } from '../../../src/components/new/tabs/InstitutionsTab.jsx';

const miller = Object.freeze({
  id: 'npc_mills_2_5', name: 'Egilbert Neumann', title: 'the miller', role: 'Mayor',
  institution: { kind: 'house', key: 'Mills (2-5)', family: 'Mills (2-5)', title: 'the miller', veiled: false },
  memberships: [{ power: 'Town Council', rank: 1, share: 0, veiled: false }, { power: 'Craft Guilds', rank: 2, share: 1, veiled: false }],
});
const mayor = Object.freeze({
  id: 'npc_mayor_and_council', name: 'Klara Schröder', title: 'the mayor', role: 'the mayor',
  institution: { kind: 'house', key: 'Mayor and council', family: 'Mayor and council', title: 'the mayor', veiled: false },
  memberships: [{ power: 'Town Council', rank: 1, share: 1, veiled: false }],
});
const powerStructure = { factions: [
  { faction: 'Town Council', category: 'government', power: 40, isGoverning: true },
  { faction: 'Craft Guilds', category: 'economy', power: 20 },
] };
const institutions = [{ name: 'Mayor and council', category: 'Government' }, { name: 'Mills (2-5)', category: 'Economy' }];
/** born today: a house leads, the seat's house bears no face */
const born = { tier: 'town', powerStructure, institutions, npcs: [miller] };
/** saved before the cure: the office's own face leads */
const saved = { tier: 'town', powerStructure, institutions, npcs: [mayor, { ...miller, role: miller.title, memberships: [miller.memberships[1]] }] };

describe('COHERENCE-POWERS — the dual hat, as the page reads it', () => {
  it('the card line names the office on the governing power\'s first; every other card reads as before', () => {
    expect(governingNameOf(born)).toBe('Town Council');
    expect(cardOfficeOf(miller)).toBe('Mayor');
    expect(cardPowerLine(miller, [], 'Town Council')).toBe('Mayor, first of Town Council · second of Craft Guilds');
    expect(cardOfficeOf(mayor)).toBe(null);
    expect(cardPowerLine(mayor, [], 'Town Council')).toBe('first of Town Council');
  });

  it('the seat row names both hats; an office face, its role', () => {
    expect(cardHatsOf(miller)).toBe('the miller and Mayor');
    expect(cardHatsOf(mayor)).toBe('the mayor');
    // the ruling chain the Power tab's seat row and the governance account print (powerStrata.js :: rulingChainOf)
    expect(rulingChainOf(born).npc).toMatchObject({ name: 'Egilbert Neumann', role: 'the miller and Mayor' });
    expect(rulingChainOf(saved).npc).toMatchObject({ name: 'Klara Schröder', role: 'the mayor' });
  });

  it('the seat\'s house with no face of its own is faced by the seat holder; a save before the cure keeps its office face', () => {
    expect(seatHouseFaceOf(born, 'Mayor and council')?.id).toBe('npc_mills_2_5');
    expect(seatHouseFaceOf(born, 'Mills (2-5)')).toBe(null);
    const rowsBorn = Object.fromEntries(institutionsWithServices(born).map((r) => [r.inst.name, r.face?.id ?? null]));
    expect(rowsBorn['Mayor and council']).toBe('npc_mills_2_5');
    const rowsSaved = Object.fromEntries(institutionsWithServices(saved).map((r) => [r.inst.name, r.face?.id ?? null]));
    expect(rowsSaved['Mayor and council']).toBe('npc_mayor_and_council');
  });

  it('the crisis cast\'s lever on the seat\'s house is held by the leader; a save before the cure, by the office face', () => {
    const holderOf = (s) => deriveLevers(s, 'infiltrated').find((l) => l.institution === 'Mayor and council')?.holderId ?? null;
    expect(holderOf(born)).toBe('npc_mills_2_5');
    expect(holderOf(saved)).toBe('npc_mayor_and_council');
  });
});
