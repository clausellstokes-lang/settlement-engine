/**
 * traditionFieldRite.test.js — B1(ii), NO TRADITION BLESSES FIELDS THE PLACE DOES NOT HAVE (the tenth chair's G64).
 *
 * `traditions/genesis.js :: deriveFoundingTraditions` draws an addition row's element and act as it always has; where the
 * drawn element is `field` and the place refuses it (a record THIS engine bore, whose food record NAMES its sources and
 * `grain` is not among them, and no farmland on the roster), the row takes the next attempt's draw. The twins must NOT
 * move: a place that grows grain; a place with farmland and no grain; a place whose source list is empty (unanswered); a
 * record an earlier engine bore (the legacy stamp, or no stamp at all), which keeps its whole set.
 *
 * RED FIRST (the line 9d22f040e): the born place below shows "The Quiet Furrow Feast" (element `field`, row 1).
 */
import { describe, expect, test } from 'vitest';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { GENERATOR_VERSION, LEGACY_GENERATOR_VERSION } from '../../src/domain/settlement.schema.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

/** The seed's identity: a plains road town whose row 1 draws a rite of the fields. */
const IDENTITY = { _seed: 'furrow-4', tier: 'town', population: 3000, config: { culture: 'celtic', terrainType: 'plains', tradeRouteAccess: 'road' } };
/** @param {unknown} foodSources @param {Record<string, unknown>} [over] */
const place = (foodSources, over = {}) => ({
  ...IDENTITY,
  generatorVersion: GENERATOR_VERSION,
  institutions: [{ name: 'Tavern' }],
  economicState: { foodSecurity: { foodRecord: { foodSources } } },
  ...over,
});
/** @param {ReturnType<typeof deriveFoundingTraditions>} set */
const elements = (set) => set.map((t) => t.coreMotif.element);
/** the set as drawn before the rule: an identity alone answers nothing the rule reads */
const before = deriveFoundingTraditions(IDENTITY);

describe('B1(ii): a born place that names no grain and holds no farmland shows no rite of the fields', () => {
  test('the premise: the seed draws a field rite in an addition row', () => {
    expect(elements(before)).toContain('field');
    expect(elements(before)[0]).not.toBe('field');
  });

  test('livestock and fish, no farmland: the field row takes another draw; every other row draws as before', () => {
    const after = deriveFoundingTraditions(place(['livestock', 'fish']));
    expectPresentThenAbsent(elements(before), elements(after), 'field', 'the rule replaces the field row');
    expect(after.length).toBe(before.length);
    const row = elements(before).indexOf('field');
    after.forEach((t, i) => {
      if (i === row) return;
      expect(t.coreMotif, `row ${i}'s draw`).toEqual(before[i].coreMotif);
    });
  });
});

describe('B1(ii): the twins keep their whole set', () => {
  const same = (/** @type {unknown} */ s) => expect(JSON.stringify(deriveFoundingTraditions(/** @type {any} */ (s)))).toBe(JSON.stringify(before));
  test('a place that grows grain', () => same(place(['grain', 'fish'])));
  test('a place with farmland and no grain', () => same(place(['livestock'], { institutions: [{ name: 'Tavern' }, { name: 'Farmland' }] })));
  test('a place whose source list is empty, or absent (unanswered)', () => {
    same(place([]));
    same(place(undefined));
  });
  test('a record an earlier engine bore keeps its false field rite (legacy stamp, or none)', () => {
    same(place(['livestock', 'fish'], { generatorVersion: LEGACY_GENERATOR_VERSION }));
    const { generatorVersion: _drop, ...stampless } = place(['livestock', 'fish']);
    same(stampless);
  });
});
