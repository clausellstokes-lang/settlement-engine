/**
 * tests/generators/safetyModerateSmallPlace.test.js — UPKEEP-14, the chair's ruling (f) (the bar's #166 and #218): the
 * Moderate safety line "A mix of safer and more exposed areas. ... Residents know which corners to avoid." printed in
 * thorps and hamlets (79 of the 972). Areas, main paths and corners belong to a village or larger: a thorp or a hamlet
 * gets the small-place line; a village keeps its own.
 */
import { describe, expect, it } from 'vitest';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';

const ROSTER = [{ name: 'Dwellings (1-8)', category: 'Infrastructure' }, { name: 'Subsistence farming', category: 'Economy' }];

describe('(f) the Moderate line is not printed in a thorp or a hamlet', () => {
  for (const tier of ['thorp', 'hamlet']) {
    it(`${tier}: the small-place line, no areas or corners`, () => {
      const p = generateSafetyProfile({}, tier, ROSTER);
      expect(p.safetyLabel, 'fixture premise: a clean small place reads Moderate').toBe('Moderate');
      expect(p.safetyDesc).toBe('The neighbours keep an eye on one another, and what trouble there is, everyone soon hears of.');
    });
  }
  it('village: the line written for its size is kept', () => {
    const p = generateSafetyProfile({}, 'village', ROSTER);
    expect(p.safetyLabel).toBe('Moderate');
    expect(p.safetyDesc).toMatch(/^A mix of safer and more exposed areas\. /);
  });
});
