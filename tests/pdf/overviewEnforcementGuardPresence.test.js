/**
 * SW-9b-A (STYLE-2-CONTRADICTIONS §8, P9): the PDF Overview's enforcement line read the ratio
 * alone, so a town with no force printed "The criminals outmatch those who keep order" beside the
 * guard assessment's "There is no watch". The line now reads the same fact the safety lines read
 * (`factsOf(record).guardPresence`: watch ∨ garrison ∨ militia ∨ hired company) before the ratio.
 */
import { describe, it, expect } from 'vitest';
import { enforcementWords } from '../../src/pdf/sections/Overview.jsx';

describe('the PDF Overview enforcement line reads the force fact (P9)', () => {
  it('with no force standing, it says there is no watch and compares nobody', () => {
    expect(enforcementWords(0.4, false)).toBe('There is no watch.');
    expect(enforcementWords(2.5, false)).toBe('There is no watch.');
  });
  it('with a force standing, the ratio speaks as before', () => {
    expect(enforcementWords(0.4, true)).toBe('The criminals outmatch those who keep order.');
    expect(enforcementWords(1.2, true)).toBe('Those who keep order roughly match the criminals.');
    expect(enforcementWords(2.5, true)).toBe('Those who keep order clearly outmatch the criminals.');
    expect(enforcementWords(Number.NaN, true)).toBe('Not measured.');
  });
});
