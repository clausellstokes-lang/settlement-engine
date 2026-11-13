/**
 * midwifeHonorific.test.js — COHERENCE-POWERS-7 (the cold list REVIEW-W2A-3, MEDIUM #543 #569 #593 #657): AN HONORIFIC
 * NAMES NO GENDER ITS CARD DOES NOT HAVE. The midwife's pool held "Goodwife" as a plain form, so a male midwife read
 * "Connection: Goodwife Tomislav Krylov" (rw3-town-calm-1) and "Goodwife" on his card (rw3-city-infiltrated-1, Erdenebayar
 * Jadaran). The form is gendered, as the registry's other gendered forms are ({ male, female }, read by the card's
 * gender): a man is "Goodman", the word the registry already gives the eldest householder. The pool keeps its two places,
 * so every other card keeps the form its seed picks.
 *
 * Before the cure, at the lane's base 714381934: 120 towns of the census's 720 and the reviewer's 20 give a male midwife
 * "Goodwife". Every expected word a literal.
 */
import { describe, expect, it } from 'vitest';
import { FACE_HONORIFICS, honorificOfTitle } from '../../src/data/faceHonorifics.js';

describe('COHERENCE-POWERS-7 · the midwife\'s honorific reads the card\'s gender', () => {
  it('the pool keeps two places: "Midwife", then the gendered good-wife/good-man form', () => {
    expect(FACE_HONORIFICS['the midwife']).toHaveLength(2);
    expect(FACE_HONORIFICS['the midwife'][0]).toBe('Midwife');
  });
  it('every seed that picks the second form gives a man "Goodman" and a woman "Goodwife"', () => {
    let second = 0;
    for (let i = 0; i < 200; i += 1) {
      const seed = `npc_midwife_${i}::Midwife`;
      const man = honorificOfTitle('the midwife', 'male', seed);
      const woman = honorificOfTitle('the midwife', 'female', seed);
      expect(man).not.toBe('Goodwife');
      if (man === 'Midwife') { expect(woman).toBe('Midwife'); continue; }
      second += 1;
      expect(man).toBe('Goodman');
      expect(woman).toBe('Goodwife');
    }
    expect(second, 'non-vacuity: the second form is picked').toBeGreaterThan(20);
  });
});
