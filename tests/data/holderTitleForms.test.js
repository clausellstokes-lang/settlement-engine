/**
 * holderTitleForms.test.js — TAIL-TITLES K-C: the leaf's table and its two readers (data/holderTitleForms.js). The births
 * arm is tests/generators/people/holderTitleForms.test.js. Every expected word a literal.
 */
import { describe, expect, it } from 'vitest';
import { faceOfRole, HOLDER_TITLE_FORMS, titleForHolder } from '../../src/data/holderTitleForms.js';
import { styledTitleOf } from '../../src/data/faceHonorifics.js';

describe('TAIL-TITLES K-C · titleForHolder', () => {
  it('a holder of the other sex takes the form; the face\'s own sex, no sex and an unlisted word keep it', () => {
    expect(titleForHolder('the ferryman', 'female')).toBe('the ferry keeper');
    expect(titleForHolder('the ferryman', 'male')).toBe('the ferryman');
    expect(titleForHolder('the district madam', 'male')).toBe('the keeper of the houses');
    expect(titleForHolder('the district madam', 'female')).toBe('the district madam');
    expect(titleForHolder("the newcomers' spokesman", 'female')).toBe("the newcomers' speaker");
    expect(titleForHolder('the lord', undefined)).toBe('the lord');
    expect(titleForHolder('the midwife', 'male')).toBe('the midwife'); // the owner's veto list: kept
    expect(titleForHolder("the lord's appointee", 'female')).toBe("the lord's appointee");
    expect(titleForHolder('Lord Marshal', 'female')).toBe('Lord Marshal'); // an office's title is the office's
    expect(titleForHolder(undefined, 'female')).toBe(undefined);
  });
  it('every form is a form of one face only, and no form is itself a listed face', () => {
    const forms = Object.values(HOLDER_TITLE_FORMS).flatMap((f) => Object.values(f));
    expect(new Set(forms).size).toBe(forms.length);
    for (const form of forms) expect(Object.hasOwn(HOLDER_TITLE_FORMS, form)).toBe(false);
  });
  it('styledTitleOf reads the leaf first', () => {
    expect(styledTitleOf('the alewife', 'male')).toBe('the brewster');
    expect(styledTitleOf('the boat-headman', 'female')).toBe('the boat-master');
    expect(styledTitleOf('the lord', 'female')).toBe('the lady');
  });
});

describe('TAIL-TITLES K-C · faceOfRole: the readers\' key is the face', () => {
  it('a role in its holder\'s form reads as the face; an office, the face itself and a bare role read as they are', () => {
    expect(faceOfRole({ role: 'the lady', institution: { title: 'the lord' } })).toBe('the lord');
    expect(faceOfRole({ role: 'the brewster', institution: { title: 'the alewife' } })).toBe('the alewife');
    expect(faceOfRole({ role: 'Lord Marshal', institution: { title: 'the watch commander' } })).toBe('Lord Marshal');
    expect(faceOfRole({ role: 'Elder', institution: { title: 'the boat-headman' } })).toBe('Elder');
    expect(faceOfRole({ role: 'the abbot', institution: { title: 'the abbot' } })).toBe('the abbot');
    expect(faceOfRole({ role: 'the abbess' })).toBe('the abbess');
    expect(faceOfRole(null)).toBe(undefined);
  });
});
