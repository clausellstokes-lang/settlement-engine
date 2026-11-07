/**
 * tests/domain/facts/clergy.test.js — CENSUS-1h (R-AE; the chair's 08:3x item on CENSUS-5d): ONE
 * composite `clergy` = a named senior cleric (`priest`) ∨ a sacred house (`sacredHouse`), defined
 * once in the vocabulary because two DS-FTH lines need it. True if either holds; false only when
 * both are answered false; unanswered otherwise.
 * @enforced-by npx vitest run tests/domain/facts/clergy.test.js
 */
import { describe, expect, it } from 'vitest';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds, assertDeclarable, FACT_DIMENSIONS } from '../../../src/domain/facts/factVocabulary.js';

const roster = (...names) => factsOf({ institutions: names.map((name) => ({ name, category: 'Religious' })) });

describe('clergy (R-AE)', () => {
  it('is declarable', () => { expect(() => assertDeclarable('clergy')).not.toThrow(); });
  it('holds for a sacred house with no named cleric, and for a named cleric with no house', () => {
    expect(atomHolds('clergy', roster('Parish church'))).toBe(true);
    expect(atomHolds('clergy', { sacredHouse: false, faith: { seniorCleric: { name: 'Mother Ysolde' } } })).toBe(true);
  });
  it('is false only when both are answered false', () => {
    expect(atomHolds('clergy', { sacredHouse: false, faith: { seniorCleric: null } })).toBe(false);
    expect(FACT_DIMENSIONS.clergy.reader({ sacredHouse: false })).toBeUndefined();
  });
});
