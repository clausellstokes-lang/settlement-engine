/**
 * ringNoteStreetsSmallPlace.test.js — W2-C-LEAVES-9 (2026-11-14; the chair's ruling of 05:28 (1) on the presumed-things
 * door's banked row 2ad05ec341eede64, `streets`): the organised ring's second vantage, "Crime here answers to one ring. It
 * keeps the streets quiet …", says "the streets", a size word a thorp or a hamlet makes false (`registeredWords.js ::
 * streets`). It now DECLARES `tier: ≥ village` and passes the list door (`defenseDisplay.js :: withRingVantage`); where it
 * is refused the table's own note prints, the structure's key and label unmoved. POINT 121 (TAIL-PICKS): the vantage is the
 * first row in rendezvous rank the place can print, so a small place whose rank heads with the streets vantage (RING-2)
 * prints the NEXT row of its rank (re-pointed from the table's own note; the seed re-seated to one whose rank heads with it). COUNTED FIRST: no thorp or hamlet of the
 * census's 720 or the fresh 180 holds an organised ring (0 of 900), so no born town moves; the unit is the small place.
 */
import { describe, expect, test } from 'vitest';
import { deriveCriminalStructure } from '../../../src/domain/display/defenseDisplay.js';

const ring = { faction: "Thieves' Guild", category: 'criminal' };
/** A place whose rank heads with the streets vantage (`guard-thorp-4`: RING-2 > RING-3 > RING-4 > RING-1). @param {string} tier */
const place = (tier) => ({
  _seed: 'guard-thorp-4', tier, powerStructure: { factions: [ring] }, institutions: [],
  economicState: { safetyProfile: { safetyLabel: 'Safe', safetyDesc: 'Quiet.', crimeTypes: [], criminalInstitutions: [] } },
});

describe('the ring note says "the streets" only where a place has streets', () => {
  test('a thorp and a hamlet whose rank heads with the streets vantage print the next in rank (RING-3); key and label stand', () => {
    for (const tier of ['thorp', 'hamlet']) {
      const st = deriveCriminalStructure(place(tier));
      expect(st?.key).toBe('organized');
      expect(st?.label).toBe('Organized Syndicate');
      expect(st?.note).toBe('Shopkeepers here pay one ring for protection, and the ring pays any official who will take its money. It stamps out random violence, which would bring the law, and its terms are known and can be negotiated.');
    }
  });

  test('the guard: a village, a town and a city whose rank heads with it keep it, word for word', () => {
    for (const tier of ['village', 'town', 'city']) {
      expect(deriveCriminalStructure(place(tier))?.note).toBe('Crime here answers to one ring. It keeps the streets quiet because trouble brings the law, lives on protection money and on whatever official it can pay, and anyone who needs something from it can bargain.');
    }
  });
});
