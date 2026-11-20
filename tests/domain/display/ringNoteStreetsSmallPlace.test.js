/**
 * ringNoteStreetsSmallPlace.test.js — W2-C-LEAVES-9 (2026-11-14; the chair's ruling of 05:28 (1) on the presumed-things
 * door's banked row 2ad05ec341eede64, `streets`): the organised ring's second vantage, "Crime here answers to one ring. It
 * keeps the streets quiet …", says "the streets", a size word a thorp or a hamlet makes false (`registeredWords.js ::
 * streets`). It now DECLARES `tier: ≥ village` and passes the list door (`defenseDisplay.js :: withRingVantage`); where it
 * is refused the table's own note prints, the structure's key and label unmoved. COUNTED FIRST: no thorp or hamlet of the
 * census's 720 or the fresh 180 holds an organised ring (0 of 900), so no born town moves; the unit is the small place.
 */
import { describe, expect, test } from 'vitest';
import { deriveCriminalStructure } from '../../../src/domain/display/defenseDisplay.js';

const ring = { faction: "Thieves' Guild", category: 'criminal' };
/** A place whose seed draws the streets vantage (`hashKey('guard-thorp-0::defenseDisplay:organizedRing') % 4 === 1`). @param {string} tier */
const place = (tier) => ({
  _seed: 'guard-thorp-0', tier, powerStructure: { factions: [ring] }, institutions: [],
  economicState: { safetyProfile: { safetyLabel: 'Safe', safetyDesc: 'Quiet.', crimeTypes: [], criminalInstitutions: [] } },
});

describe('the ring note says "the streets" only where a place has streets', () => {
  test('a thorp and a hamlet that draw the streets vantage print the table\'s own note; key and label stand', () => {
    for (const tier of ['thorp', 'hamlet']) {
      const st = deriveCriminalStructure(place(tier));
      expect(st?.key).toBe('organized');
      expect(st?.label).toBe('Organized Syndicate');
      expect(st?.note).toBe('One criminal ring decides what crime is allowed here. Its rules are predictable and it can be bargained with; it puts down random violence because that brings the law, and it lives on protection money and on any official it can buy.');
    }
  });

  test('the guard: a village, a town and a city that draw it keep it, word for word', () => {
    for (const tier of ['village', 'town', 'city']) {
      expect(deriveCriminalStructure(place(tier))?.note).toBe('Crime here answers to one ring. It keeps the streets quiet because trouble brings the law, lives on protection money and on whatever official it can pay, and anyone who needs something from it can bargain.');
    }
  });
});
