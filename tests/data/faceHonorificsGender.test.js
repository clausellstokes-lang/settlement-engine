/**
 * faceHonorificsGender.test.js — POWERS-9 (ROUND-3-CUT-INCREMENT pf#250 "Alewife" on Lorcan Hayes, a man; pf#288; the
 * chair's row of 2026-11-13: "Madam" and "Goodwife" printed for MALE cards on the NPC card): A TITLE THAT IS A GENDERED
 * TRADE WORD FOLLOWS THE PERSON. data/faceHonorifics.js :: FACE_HONORIFICS held "Alewife" and "Madam" as plain words, read
 * for every card whatever its gender (honorificOfTitle, through domain/people/cardDoor.js and seatKeeper.js). They are
 * gendered forms now ({ male, female }); a man reads "Brewer", "Goodman", "Master".
 */
import { describe, expect, it } from 'vitest';
import { FACE_HONORIFICS, honorificOfTitle } from '../../src/data/faceHonorifics.js';

const WOMANS = /^(Alewife|Midwife|Goodwife|Madam|Mistress|Dame|Lady)$/;

describe('POWERS-9 · a gendered trade word follows the person', () => {
  it('no man is styled with a woman\'s word, on any seed', () => {
    const bad = [];
    for (const title of Object.keys(FACE_HONORIFICS)) {
      for (let i = 0; i < 40; i += 1) {
        const h = honorificOfTitle(title, 'male', `seed-${i}::${title}`);
        if (WOMANS.test(String(h || ''))) bad.push(`${title} -> ${h}`);
      }
    }
    expect([...new Set(bad)]).toEqual([]);
  });
  it('THE GUARD: a woman keeps her word (the alewife, the midwife, the madam)', () => {
    const seen = (title) => new Set(Array.from({ length: 40 }, (_, i) => honorificOfTitle(title, 'female', `seed-${i}::${title}`)));
    expect(seen('the alewife').has('Alewife')).toBe(true);
    expect(seen('the midwife').has('Midwife')).toBe(true);
    expect(seen('the madam')).toEqual(new Set(['Madam']));
    expect(seen('the district madam')).toEqual(new Set(['Madam']));
  });
});
