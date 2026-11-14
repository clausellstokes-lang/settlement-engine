/**
 * W2-B-DECLARE item 4 (the class table §5.1, "an access-only church"): the faith reading's own two answers as
 * atoms — `church` (a house that is a church stands here; a wayside shrine is not one) and `church access` (no
 * church here, and the people go to a neighbour's) — each read through `factsOf(record).faith`, the one home.
 */
import { describe, expect, test } from 'vitest';

import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds, declarationAdmits, declarationOfTags, FACT_DIMENSIONS } from '../../../src/domain/facts/factVocabulary.js';

const place = (names) => factsOf({ tier: 'thorp', population: 40, config: {}, institutions: names.map((name) => ({ name })) });

describe('the faith atoms', () => {
  test('a parish church, a shrine with access to a neighbour\'s church, a shrine alone, and nothing', () => {
    const rows = [['Parish church'], ['Wayside shrine', 'Access to parish church'], ['Wayside shrine'], []]
      .map((names) => [atomHolds('church', place(names)), atomHolds('church access', place(names)), atomHolds('sacredHouse', place(names))]);
    expect(rows).toEqual([[true, false, true], [false, true, true], [false, false, true], [false, false, false]]);
  });

  test('both are homed on the faith reading, and a line declaring the access is refused where a church stands', () => {
    expect([FACT_DIMENSIONS.church.home, FACT_DIMENSIONS['church access'].home]).toEqual(['faith', 'faith']);
    const access = declarationOfTags(['church access']);
    expect(declarationAdmits(access, place(['Wayside shrine', 'Access to parish church'])).admitted).toBe(true);
    expect(declarationAdmits(access, place(['Parish church'])).refused).toEqual(['church access']);
  });
});
