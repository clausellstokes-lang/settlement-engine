/**
 * tests/domain/foodWordsGoodsList.test.js — F3 FOOD-WORDS unit 2a (the chair's ruling,
 * 2026-11-04): an export list is a list of GOODS, not a sentence about the table, so the
 * food-words check does not read it; and "Game meat" names the game source, not livestock.
 * soak1k-20 (a secure village that hunts) printed "… Game meat … Preserved foods Meals and drink"
 * and the check read it as a livestock claim. Hand-built records only.
 */
import { describe, expect, it } from 'vitest';
import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';
import { sourcesNamedIn } from '../../src/domain/foodways.js';

const EXPORTS = ['Furs and pelts', 'Game meat', 'Hunting trophies', 'Leather goods', 'Preserved foods', 'Meals and drink'];
/** @param {object} foodRecord @param {string[]} [primaryExports] */
const place = (foodRecord, primaryExports = EXPORTS) => ({ economicState: { primaryExports, foodSecurity: { foodRecord } } });
const SECURE_HUNTERS = { band: 'secure', growsMoreThanEats: true, storageMonths: 2.1, foodSources: ['game'] };
const FAMINE = { band: 'famine', growsMoreThanEats: false, storageMonths: 0.2, foodSources: ['grain'] };

describe('an export list is goods, not a sentence', () => {
  it('the Economics tab list (goods run together) does not flag on a secure place', () => {
    expect(foodWordsFindings(place(SECURE_HUNTERS), EXPORTS.join(' '))).toEqual([]);
  });
  it('the Foundry row ("- **Exports:** a, b") does not flag on a secure place', () => {
    expect(foodWordsFindings(place(SECURE_HUNTERS), `- **Exports:** ${EXPORTS.join(', ')}`)).toEqual([]);
  });
  it('a list with one word that is not an export is still read', () => {
    const text = `${EXPORTS.join(' ')} and cheese for every table`;
    expect(foodWordsFindings(place(SECURE_HUNTERS), text).map((f) => f.code)).toEqual(['source_not_held']);
  });
  it('prose that claims plenty on a famine place still flags', () => {
    const codes = foodWordsFindings(place(FAMINE), 'The fields bring in a grain surplus and the table never wants for meat.').map((f) => f.code);
    expect(codes).toEqual(['surplus_without_surplus', 'source_not_held']);
  });
});

describe('"Game meat" is game', () => {
  it('names the game source, not livestock', () => {
    expect(sourcesNamedIn('Game meat')).toEqual(['game']);
    expect(sourcesNamedIn('salted meat and milk')).toEqual(['livestock']);
  });
  it('a sentence about game meat on the table does not flag a hunting place', () => {
    expect(foodWordsFindings(place(SECURE_HUNTERS), 'Game meat is the mainstay of the table.')).toEqual([]);
  });
});
