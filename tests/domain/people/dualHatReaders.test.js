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
import { shownHonorificOf } from '../../../src/domain/people/seatKeeperDisplay.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';

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
    // the office leads the line whatever the powers' order
    const master = { ...miller, memberships: [{ power: 'Craft Guilds', rank: 1, share: 1, veiled: false }, miller.memberships[0]] };
    expect(cardPowerLine(master, ['Craft Guilds', 'Town Council'], 'Town Council')).toBe('Mayor, first of Town Council · first of Craft Guilds');
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

  // COHERENCE-POWERS-3 (F10, REVIEW-POWERS F10): the card composes the two hats as the seat row does: a house honorific
  // that is itself an office's title never prints beside the office held (39 leaders on the review's corpus read
  // "Headman · Elder"). Literal expectations; births through birthConfig.
  it('the leader\'s honorific row never prints a second office beside the office held', async () => {
    const boatHeadman = { id: 'npc_boat', name: 'Iovita Cicero', title: 'the boat-headman', role: 'Elder',
      institution: { kind: 'house', key: "Fisher's landing", family: "Fisher's landing", title: 'the boat-headman', veiled: false },
      memberships: [{ power: 'Elder Council', rank: 1, share: 0, veiled: false }] };
    const town = { tier: 'thorp', powerStructure: { factions: [{ faction: 'Elder Council', isGoverning: true, power: 100 }] }, institutions: [], npcs: [boatHeadman] };
    expect(shownHonorificOf(boatHeadman, town)).toBe('Boat-Master'); // no office's title: the house's honorific stands
    expect(cardHatsOf(boatHeadman)).toBe('the boat-headman and Elder');
    await loadGenerationLawPayloads();
    const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
      selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const OFFICES = ['Headman', 'Elder', 'Household Elder', 'Reeve', 'Mayor', 'Lord Mayor', 'Alderman', 'Burgomaster'];
    const misses = [];
    for (const seed of ['rvw-thorp-24', 'rvw-thorp-64', 'rvw-thorp-68', 'rvw-thorp-3', 'rvw-thorp-2']) {
      const s = generateSettlementPipeline(birthConfig({ ...DIALS, settType: 'thorp' }), null, { seed, customContent: {} });
      const leader = (s.npcs || []).find((c) => (c.memberships || []).some((m) => m.rank === 1 && m.power === governingNameOf(s)));
      if (leader && cardOfficeOf(leader) && OFFICES.includes(shownHonorificOf(leader, s))) misses.push(`${seed}: ${shownHonorificOf(leader, s)} beside ${cardOfficeOf(leader)}`);
      if (seed === 'rvw-thorp-64') expect(`${shownHonorificOf(leader, s)} · ${cardPowerLine(leader, [], governingNameOf(s))}`).toBe('Boat-headman · Elder, first of Elder Council');
    }
    expect(misses).toEqual([]);
  }, 60_000);
});
