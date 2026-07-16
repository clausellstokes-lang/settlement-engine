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

/**
 * [data-tables-2] UPPER-BOUND WALKER (the double-stack pin).
 *
 * getResourceMultiplier (assembleInstitutions.js:88-92) multiplies EVERY name-modifier
 * row whose lowercased name is a substring of the institution's name. The G2 round-1
 * revival renamed dead rows ("Foresters' guild"→"Sawmill", "Stonemasons' guild"→"Stone
 * quarry") onto names that were substrings of siblings ("Sawmill"⊂both Sawmill rows;
 * "Stone quarry" contains "quarry", matched by the "Quarry" row) — so one institution
 * absorbed the product of two rows (forest Sawmill ×3×2.5, mountain Stone quarry ×2.5×2,
 * hills ×1.8×1.5), a fixed-then-regressed defect.
 *
 * This ratchet is the mirror of the reachability one: no single catalog institution may
 * match MORE THAN ONE named modifier row within a terrain. Together the two bound every
 * row to exactly one live institution family, so neither a dead pattern nor a double-stack
 * can slip back in.
 */
describe('[data-tables-2] no catalog institution double-matches a terrain’s modifier rows', () => {
  test('RATCHET: each institution matches ≤1 named modifier row per terrain', () => {
    const offenders = [];
    for (const [terrain, data] of Object.entries(TERRAIN_DATA)) {
      const namedRows = (data.institutionModifiers || []).filter((m) => m.name);
      for (const instName of CATALOG_NAMES) {
        const matched = namedRows.filter((m) => instName.includes(String(m.name).toLowerCase()));
        if (matched.length > 1) {
          offenders.push({ terrain, institution: instName, rows: matched.map((m) => `${m.name}×${m.modifier}`) });
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
