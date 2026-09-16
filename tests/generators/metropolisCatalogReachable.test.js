/**
 * metropolisCatalogReachable.test.js — [generators-pipeline-5] + inventory ratchet.
 *
 * The 24 metropolis-only catalog institutions used to be invisible to every UI
 * catalog lookup: getInstitutionalCatalog('metropolis') returned only the city
 * block, and the 'all'/full-meta merges stopped at city. So no user could view,
 * require, or force-exclude any metropolis-only institution, and the generator's
 * force path was unreachable. The lookups now merge city+metropolis.
 *
 * The walker is an only-grows reachability ratchet: EVERY institution in EVERY
 * catalog tier must be reachable from getInstitutionalCatalog(tier) — so a future
 * top-tier catalog addition can never silently become unreachable again.
 */

import { describe, test, expect } from 'vitest';
import {
  getInstitutionalCatalog,
  getFullCatalogWithTierMeta,
  getInstitutionsForTier,
} from '../../src/generators/lookups.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

const namesOf = (catalog) => {
  const s = new Set();
  for (const insts of Object.values(catalog || {})) for (const n of Object.keys(insts)) s.add(n);
  return s;
};

describe('[generators-pipeline-5] metropolis catalog is reachable from the lookups', () => {
  test('the metropolis block is non-empty (assertions are not vacuous)', () => {
    expect(namesOf(institutionalCatalog.metropolis).size).toBeGreaterThan(0);
  });

  test('every metropolis-only institution is reachable via getInstitutionalCatalog("metropolis")', () => {
    const reachable = namesOf(getInstitutionalCatalog('metropolis'));
    const cityNames = namesOf(institutionalCatalog.city);
    const metroOnly = [...namesOf(institutionalCatalog.metropolis)].filter((n) => !cityNames.has(n));
    expect(metroOnly.length).toBeGreaterThan(0);
    for (const n of metroOnly) expect(reachable.has(n)).toBe(true);
  });

  test('metropolis-only institutions are reachable via the "all" and full-meta merges', () => {
    const all = namesOf(getInstitutionalCatalog('all'));
    const full = namesOf(getFullCatalogWithTierMeta());
    for (const n of namesOf(institutionalCatalog.metropolis)) {
      expect(all.has(n)).toBe(true);
      expect(full.has(n)).toBe(true);
    }
  });

  test('getInstitutionsForTier("metropolis") includes both city and metropolis names', () => {
    const set = getInstitutionsForTier('metropolis');
    for (const n of namesOf(institutionalCatalog.metropolis)) expect(set.has(n)).toBe(true);
    for (const n of namesOf(institutionalCatalog.city)) expect(set.has(n)).toBe(true);
  });

  // Inventory ratchet: every catalog tier's every institution is reachable.
  test('RATCHET: every catalog institution (all tiers) is reachable from getInstitutionalCatalog', () => {
    for (const tier of Object.keys(institutionalCatalog)) {
      const reachable = namesOf(getInstitutionalCatalog(tier));
      for (const n of namesOf(institutionalCatalog[tier])) {
        expect({ tier, name: n, reachable: reachable.has(n) }).toEqual({ tier, name: n, reachable: true });
      }
    }
  });
});
