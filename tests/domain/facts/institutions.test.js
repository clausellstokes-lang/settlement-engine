/**
 * tests/domain/facts/institutions.test.js — CENSUS-1 wave 0, fact 11: THE INSTITUTION-PRESENCE HOME.
 * @enforced-by npx vitest run tests/domain/facts/institutions.test.js
 */
import { describe, expect, it } from 'vitest';
import { hasInstitution, INSTITUTION_KINDS } from '../../../src/domain/facts/institutions.js';
import { defenseFactsOf } from '../../../src/domain/defense/defenseFacts.js';

const rec = (...names) => ({ institutions: names.map((name) => ({ name })) });

describe('the institution-presence home (CENSUS-1 fact 11)', () => {
  it('one meaning per kind, over the live roster', () => {
    expect(hasInstitution(rec('Monastery or friary'), 'hospital')).toBe(false);
    expect(hasInstitution(rec('Monastery or friary'), 'monastery')).toBe(true);
    expect(hasInstitution(rec('Healer (divine, 1st level)'), 'healer')).toBe(true);
    expect(hasInstitution(rec('Grain mill'), 'mill')).toBe(true);
    expect(hasInstitution(rec('Sawmill'), 'mill')).toBe(false);
    expect(hasInstitution({ institutions: [{ name: 'Grain mill', status: 'ruined' }] }, 'mill')).toBe(false);
    expect(() => hasInstitution(rec(), 'castle')).toThrow(/unknown institution kind/);
    expect(INSTITUTION_KINDS).toEqual(expect.arrayContaining(['mill', 'smith', 'bathhouse', 'docks', 'quarry', 'mine', 'tavern', 'school', 'healer', 'temple']));
  });

  it('defenseFactsOf reads hospital and healer through the same table, its answers unmoved', () => {
    const d = defenseFactsOf(rec('Monastery or friary', 'Town watch'));
    expect([d.hasHospital, d.hasHealer, d.healerName]).toEqual([false, true, 'Monastery or friary']);
    expect(defenseFactsOf(rec('City hospital')).hasHospital).toBe(true);
  });
});

// CENSUS-1c unit 6 (the vocabulary rulings §6): the reader faults the lanes found.
describe('CENSUS-1c unit 6 · the institution patterns', () => {
  const rec = (/** @type {string[]} */ names) => ({ institutions: names.map((name) => ({ name, category: 'Economy' })) });
  it("'Access to external mill' is no mill here; a mill still is", () => {
    expect(hasInstitution(rec(['Access to external mill']), 'mill')).toBe(false);
    expect(hasInstitution(rec(['Mill']), 'mill')).toBe(true);
    expect(hasInstitution(rec(['Watermill']), 'mill')).toBe(false); // unchanged: no word boundary
  });
  it("'Access to parish church' is no temple here (the faith home's access-only reading); a church still is", () => {
    expect(hasInstitution(rec(['Access to parish church']), 'temple')).toBe(false);
    expect(hasInstitution(rec(['Parish church']), 'temple')).toBe(true);
  });
  it("'Ale house' and 'Alehouse' are taverns", () => {
    expect(hasInstitution(rec(['Ale house']), 'tavern')).toBe(true);
    expect(hasInstitution(rec(['Alehouse']), 'tavern')).toBe(true);
    expect(hasInstitution(rec(['Brewery']), 'tavern')).toBe(false);
  });
});
