/**
 * terrainInstitutionModifiersReachable.test.js — [data-tables-2] + reachability ratchet.
 *
 * TERRAIN_DATA institutionModifiers with a `name` are matched against catalog
 * institutions by the runtime substring rule (assembleInstitutions.js:88 —
 * `name.includes(mod.name.toLowerCase())`). 16 named modifiers matched NO catalog
 * institution, so terrain→economy boosts (forest→carpenter/bowyer, hills→shepherd,
 * plains→weaver, desert→salt) silently rolled as ×1.0 no-ops. Renamed to live
 * substrings / re-pointed dead patterns to live targets.
 *
 * Ratchet (mirrors the RESOURCE_CHAINS F32 pin): EVERY named terrain modifier must
 * match ≥1 catalog institution under the runtime rule, so a future dead pattern
 * can never silently weaken terrain flavour again.
 */

import { describe, test, expect } from 'vitest';
import { TERRAIN_DATA } from '../../src/data/geographyData.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

const CATALOG_NAMES = (() => {
  const s = new Set();
  for (const tier of Object.values(institutionalCatalog))
    for (const cat of Object.values(tier))
      for (const n of Object.keys(cat)) s.add(n.toLowerCase());
  return [...s];
})();

// The exact runtime matcher from assembleInstitutions.
const matchesCatalog = (modName) => {
  const needle = String(modName).toLowerCase();
  return CATALOG_NAMES.some((n) => n.includes(needle));
};

describe('[data-tables-2] every named terrain institution modifier is reachable', () => {
  const named = [];
  for (const [terrain, data] of Object.entries(TERRAIN_DATA)) {
    for (const mod of data.institutionModifiers || []) {
      if (mod.name) named.push({ terrain, name: mod.name });
    }
  }

  test('the modifier set is non-empty (assertions are not vacuous)', () => {
    expect(named.length).toBeGreaterThan(10);
  });

  test('RATCHET: every named modifier matches at least one catalog institution', () => {
    for (const { terrain, name } of named) {
      expect({ terrain, name, reachable: matchesCatalog(name) }).toEqual({ terrain, name, reachable: true });
    }
  });
});
