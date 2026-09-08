/**
 * inferFactionCategoryBloc.test.js — [generators-domain-7].
 *
 * 'Bloc' was in the economy keyword list and economy is checked before noble, so
 * every political/succession bloc the stress injector mints ('Loyalist Noble Bloc',
 * 'Claimant Bloc A/B', 'Third Bloc (Neutrals)') misclassified as 'economy' — pulling
 * merchant-class goods/NPC compatibility for aristocratic succession factions.
 * The fix drops bare 'Bloc' from economy and adds the political tokens
 * ('Claimant'/'Loyalist') to noble. Concrete economic blocs keep their category via
 * their real token ('Merchant'/'Garrison'/'Landed').
 */

import { describe, test, expect } from 'vitest';
import { inferFactionCategory } from '../../src/generators/power/factionCategories.js';

describe('[generators-domain-7] inferFactionCategory — Bloc no longer shadows political factions', () => {
  // Every faction name the succession/politically-fractured stress injector mints.
  const SUCCESSION_BLOCS = {
    'Loyalist Noble Bloc': 'noble',
    'Reform Noble Bloc': 'noble',
    'Claimant Bloc A': 'noble',
    'Claimant Bloc B': 'noble',
    'Noble Claimant (Senior Line)': 'noble',
    'Noble Claimant (Reform Faction)': 'noble',
    'Loyalist Noble Opposition': 'noble',
  };

  for (const [name, expected] of Object.entries(SUCCESSION_BLOCS)) {
    test(`"${name}" → ${expected} (not economy)`, () => {
      expect(inferFactionCategory(name)).toBe(expected);
    });
  }

  test('"Third Bloc (Neutrals)" is no longer economy (neutral political bloc → other)', () => {
    expect(inferFactionCategory('Third Bloc (Neutrals)')).not.toBe('economy');
  });

  // Concrete economic/military/noble blocs keep their category via their real token.
  const CONCRETE_BLOCS = {
    'The Merchant Bloc': 'economy',
    'The Garrison Bloc': 'military',
    'The Landed Bloc': 'noble',
  };
  for (const [name, expected] of Object.entries(CONCRETE_BLOCS)) {
    test(`"${name}" stays ${expected}`, () => {
      expect(inferFactionCategory(name)).toBe(expected);
    });
  }

  // Guard: no succession bloc slips into economy.
  test('no succession bloc is classified as economy', () => {
    for (const name of [...Object.keys(SUCCESSION_BLOCS), 'Third Bloc (Neutrals)']) {
      expect(inferFactionCategory(name)).not.toBe('economy');
    }
  });
});
