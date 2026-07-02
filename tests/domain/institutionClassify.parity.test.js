import { describe, test, expect } from 'vitest';

import {
  institutionIsFoodAnchor,
  institutionIsLawOrder,
  institutionMatchesRegex,
  _testing,
} from '../../src/domain/institutionClassify.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';

const { ALL_CATALOG_NAMES, foodAnchorPredicate, lawOrderPredicate } = _testing;

// The load-bearing guarantee of the id-first migration: for every UNRENAMED
// catalog institution the id-first result is IDENTICAL to the legacy name rule,
// so generation + event output stay byte-identical. The win is additive — a
// stamped-but-renamed instance stays classified where the name rule would drop it.
describe('institutionClassify — id-first === name rule for the whole catalog (zero regression)', () => {
  test('sanity: the catalog list is non-trivial and every name resolves to an id', () => {
    expect(ALL_CATALOG_NAMES.length).toBeGreaterThan(100);
    for (const name of ALL_CATALOG_NAMES) {
      expect(catalogIdForName(name), `no id for "${name}"`).toBeTruthy();
    }
  });

  test('food-anchor: id-first matches the name rule for every catalog institution', () => {
    for (const name of ALL_CATALOG_NAMES) {
      const byName = foodAnchorPredicate(name);
      // Scramble the display name so ONLY the stamped catalogId can match.
      const byId = institutionIsFoodAnchor({ name: 'zzz-scrambled-zzz', catalogId: catalogIdForName(name) });
      expect(byId, `food-anchor mismatch for "${name}"`).toBe(byName);
    }
  });

  test('law-order: id-first matches the name rule for every catalog institution', () => {
    for (const name of ALL_CATALOG_NAMES) {
      const byName = lawOrderPredicate(name);
      const byId = institutionIsLawOrder({ name: 'zzz-scrambled-zzz', catalogId: catalogIdForName(name) });
      expect(byId, `law-order mismatch for "${name}"`).toBe(byName);
    }
  });

  test('rename-proof: a stamped food anchor stays classified under a name the rule would miss', () => {
    const id = catalogIdForName('Town granary');
    expect(id).toBeTruthy();
    expect(foodAnchorPredicate("Old Pete's grain hoard")).toBe(false);            // name rule misses it
    expect(institutionIsFoodAnchor({ name: "Old Pete's grain hoard", catalogId: id })).toBe(true); // id keeps it
  });

  test('institutionMatchesRegex: id-first matches the regex for every catalog institution', () => {
    const RE = /court|watch|granar|temple|guild|barracks|dock/i; // a representative multi-token pattern
    for (const name of ALL_CATALOG_NAMES) {
      const byName = RE.test(name);
      const byId = institutionMatchesRegex({ name: 'zzz-scrambled-zzz', catalogId: catalogIdForName(name) }, RE);
      expect(byId, `regex mismatch for "${name}"`).toBe(byName);
    }
  });

  test('institutionMatchesRegex is rename-proof for a stamped institution', () => {
    const id = catalogIdForName('Town granary');
    expect(id).toBeTruthy();
    const RE = /granar/i;
    expect(RE.test("Old Pete's grain hoard")).toBe(false);                                  // name rule misses it
    expect(institutionMatchesRegex({ name: "Old Pete's grain hoard", catalogId: id }, RE)).toBe(true); // id keeps it
    // unstamped falls to the regex on the display name
    expect(institutionMatchesRegex({ name: 'Communal granary' }, RE)).toBe(true);
    expect(institutionMatchesRegex({ name: 'Blacksmith' }, RE)).toBe(false);
  });

  test('unstamped custom institutions fall to the name predicate (unchanged legacy behavior)', () => {
    expect(institutionIsFoodAnchor({ name: 'Communal granary' })).toBe(true);
    expect(institutionIsFoodAnchor({ name: 'Sawmill' })).toBe(false);
    expect(institutionIsFoodAnchor({ name: 'Blacksmith' })).toBe(false);
    expect(institutionIsLawOrder({ name: 'Village court' })).toBe(true);
    expect(institutionIsLawOrder({ name: 'Town watch' })).toBe(true);
    expect(institutionIsLawOrder({ name: 'Tavern' })).toBe(false);
  });
});
