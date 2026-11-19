/**
 * R2-CODE-B item 4 — THE CRISIS CAST READS THE FACT'S ONE HOME (the cold list REVIEW-W2A-3,
 * f385d487b: MEDIUM #328 "defends: no military, garrison or watch stands" on a siege hamlet whose
 * Tonight sheet reads "Defence: Adventurers' charter hall."; #855 "would treat: Zuma Kanil · a
 * merchant, with the seat itself in dispute" where Zuma Kanil is the master smith).
 */
import { describe, expect, test } from 'vitest';
import { CAST_REASONS, defenderCandidates, treaterCandidates } from '../../src/domain/crisis/crisisCast.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';

const hamlet = (institutions) => ({
  tier: 'hamlet', population: 41, npcs: [], institutions,
  powerStructure: { governingName: "Headman's Authority", factions: [{ faction: "Headman's Authority", category: 'government', power: 30, isGoverning: true }] },
});

describe('the defender reads the defence home the Tonight sheet reads', () => {
  test('a charter hall that musters the defence is the defender, named for the place it is', () => {
    const s = hamlet([{ name: "Adventurers' charter hall", category: 'Adventuring' }, { name: 'Dwellings (5-25)' }]);
    expect(defenseFactsOf(s).defenceNames).toEqual(["Adventurers' charter hall"]);
    const { candidates } = defenderCandidates(s);
    expect(candidates.map((c) => c.name)).toEqual(["Adventurers' charter hall"]);
    expect(candidates[0].reason).toBe(CAST_REASONS.defenderInstitutionPlace);
  });
  test('a town\'s watch keeps "the town\'s defence"', () => {
    const s = { ...hamlet([{ name: 'Town watch' }]), tier: 'town', population: 2400 };
    expect(defenderCandidates(s).candidates[0]).toMatchObject({ name: 'Town watch', reason: CAST_REASONS.defenderInstitution });
  });
  test('every house the defence home names is a defender candidate, and no other house', () => {
    const s = { ...hamlet([{ name: 'Palisade' }, { name: 'Household levy' }, { name: 'Mercenary company' }, { name: 'Caravan guards' }, { name: 'Weekly market' }]), tier: 'village', population: 300 };
    expect(defenderCandidates(s).candidates.map((c) => c.name).sort()).toEqual([...defenseFactsOf(s).defenceNames].sort());
  });
});

describe('"a merchant" is said only of a person whose own role is trade', () => {
  const contested = (npcs) => ({
    tier: 'town', npcs, institutions: [{ name: 'Weekly market' }],
    powerStructure: { governingName: 'Town Council', publicLegitimacy: { isContested: true, isLegitimacyCrisis: false }, factions: [{ faction: 'Merchant Guilds', category: 'economy', power: 20 }, { faction: 'Town Council', category: 'government', power: 10, isGoverning: true }] },
  });
  test('the master smith of a merchant power is a member of it, not a merchant', () => {
    const row = treaterCandidates(contested([{ id: 'z', name: 'Zuma Kanil', role: 'the master smith', memberships: [{ power: 'Merchant Guilds', rank: 1 }] }])).candidates[0];
    expect(row).toMatchObject({ name: 'Zuma Kanil' });
    expect(row.reason).toBe(CAST_REASONS.treaterMerchantMember);
  });
  test('a grain factor is a merchant', () => {
    const row = treaterCandidates(contested([{ id: 'p', name: 'Pell Rook', role: 'Grain Factor', memberships: [{ power: 'Merchant Guilds', rank: 1 }] }])).candidates[0];
    expect(row).toMatchObject({ name: 'Pell Rook', reason: CAST_REASONS.treaterMerchant });
  });
});
