// CENSUS-4d (the chair's answer 3 to CENSUS-4c, R-W): `Bowyers & fletchers (guild) | Military
// supply` read "to garrison and militia" and declared `needs: garrison, militia` — a conjunction no
// birth holds (CENSUS-4c: 0 of 558; the golden corpus: 0 of 212). A never-true line is a wrong
// presumption, not an empty slot: it is reworded to what it really needs, whichever armed force
// stands (`guardPresence`, the vocabulary's one composite), and takes no twin.
import { describe, it, expect } from 'vitest';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { parseAtom } from '../../src/domain/facts/factVocabulary.js';

const ROW = INSTITUTION_SERVICES['Bowyers & fletchers (guild)']['Military supply'];

describe('the bowyers\' military supply presumes a guard, not two forces', () => {
  it('declares guardPresence alone, an atom of the vocabulary', () => {
    expect(ROW.needs).toEqual(['guardPresence']);
    expect(parseAtom('guardPresence')).not.toBeNull();
    expect(ROW.excludes).toBeUndefined();
  });
  it('its text names no particular force', () => {
    expect(ROW.desc).toBe('Contract supply of bows and arrows to the local guard. Volume pricing.');
    expect(ROW.desc).not.toMatch(/\b(?:garrison|militia|watch|mercenar\w*)\b/i); // anchored: the exact desc is pinned on the line above
  });
});
