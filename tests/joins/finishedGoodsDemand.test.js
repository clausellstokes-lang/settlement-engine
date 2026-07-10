import { describe, expect, test } from 'vitest';

import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_FINISHED_GOODS_DEMAND } from '../../src/data/economicData.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';

// INSTITUTION_FINISHED_GOODS_DEMAND resolves its consumer/supplier keywords as
// free-string joins in economicGenerator's finished-goods loop (sumLongestMatch):
//
//   - a consumer keyword, and a supplier keyword WITHOUT '_', must be a substring
//     of a catalog institution NAME (lowercased) — `name.includes(keyword)`.
//   - a supplier keyword WITH '_' matches the separate nearbyResources namespace
//     (`hasRes`), so it must be a real RESOURCE_DATA key.
//
// Both joins fail SILENTLY: a keyword matching nothing simply never contributes
// demand/supply, understating imports or exports with no crash and no test failure.
// That is exactly how the dead 'foraging' supplier (it should have been the resource
// key 'foraging_areas', but had no '_' so it took the institution-name path and
// matched nothing) went unnoticed. This test pins every keyword so a typo reds the
// gate instead of silently dropping an institution's finished-goods economics — the
// same silent-string-join class tests/joins/goods.test.js closes for the other tables.

/** Every institution name the catalog can generate, lowercased. */
function catalogNameSetLower() {
  const names = new Set();
  for (const tierBlock of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tierBlock)) {
      for (const name of Object.keys(category)) names.add(name.toLowerCase());
    }
  }
  return names;
}

const RESOURCE_KEYS = new Set(Object.keys(RESOURCE_DATA));

describe('joins: INSTITUTION_FINISHED_GOODS_DEMAND keywords resolve', () => {
  const names = catalogNameSetLower();
  const matchesInstitution = (/** @type {string} */ kw) => {
    const k = kw.toLowerCase();
    for (const n of names) if (n.includes(k)) return true;
    return false;
  };

  test('the harness actually sees data (not vacuous)', () => {
    expect(Object.keys(INSTITUTION_FINISHED_GOODS_DEMAND).length).toBeGreaterThan(3);
    expect(names.size).toBeGreaterThan(100);
  });

  test('every consumer keyword is a substring of a catalog institution name', () => {
    const dead = [];
    for (const [category, cfg] of Object.entries(INSTITUTION_FINISHED_GOODS_DEMAND)) {
      for (const kw of Object.keys(cfg.consumers || {})) {
        if (!matchesInstitution(kw)) dead.push(`${category}.consumers['${kw}']`);
      }
    }
    expect(dead, `consumer keywords matching no catalog institution: ${dead.join(', ')}`).toEqual([]);
  });

  test('every supplier keyword resolves (underscore → RESOURCE_DATA key, else → catalog name)', () => {
    const dead = [];
    for (const [category, cfg] of Object.entries(INSTITUTION_FINISHED_GOODS_DEMAND)) {
      for (const kw of Object.keys(cfg.suppliers || {})) {
        const ok = kw.includes('_') ? RESOURCE_KEYS.has(kw) : matchesInstitution(kw);
        if (!ok) dead.push(`${category}.suppliers['${kw}']`);
      }
    }
    expect(dead, `supplier keywords resolving to nothing (dead join): ${dead.join(', ')}`).toEqual([]);
  });
});
