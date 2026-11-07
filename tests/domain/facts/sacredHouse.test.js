/**
 * tests/domain/facts/sacredHouse.test.js — CENSUS-1f unit 5 (R-AE): ONE composite `sacredHouse`
 * (a temple-kind ∨ a monastery-kind house, as the roster names them), declarable, answered by
 * `factsOf`; `temple` stays narrow (a friary is a sacred house, not a temple).
 *
 * @enforced-by npx vitest run tests/domain/facts/sacredHouse.test.js
 */
import { describe, expect, it } from 'vitest';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds, assertDeclarable } from '../../../src/domain/facts/factVocabulary.js';

const roster = (...names) => factsOf({ institutions: names.map((name) => ({ name, category: 'Religious' })) });

describe('sacredHouse (R-AE)', () => {
  it('is declarable', () => { expect(() => assertDeclarable('sacredHouse')).not.toThrow(); });
  it('holds for a church, a wayside shrine, a monastery or friary', () => {
    for (const n of ['Parish church', 'Wayside shrine', 'Monastery or friary', 'Great cathedral']) expect(atomHolds('sacredHouse', roster(n)), n).toBe(true);
  });
  it('a friary is a sacred house but not a temple (temple stays narrow)', () => {
    expect(atomHolds('sacredHouse', roster('Monastery or friary'))).toBe(true);
    expect(atomHolds('temple', roster('Monastery or friary'))).toBe(false);
  });
  it('access to a neighbour\'s church, or a burial ground, is none', () => {
    expect(atomHolds('sacredHouse', roster('Access to parish church', 'Parish burial grounds'))).toBe(false);
  });
});
