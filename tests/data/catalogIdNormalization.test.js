import { describe, test, expect } from 'vitest';

import { catalogIdForName, normalizeCatalogName } from '../../src/data/institutionalCatalog.js';

/**
 * Symmetric id-normalization (audit finding). The catalog id index was BUILT with
 * `name.toLowerCase()` (no trim) but LOOKED UP with `.trim().toLowerCase()` — an
 * asymmetry the doc comment already contradicted ("lowercase, trimmed"). A catalog
 * or query name with stray whitespace would index un-trimmed yet look up trimmed,
 * a silent id-join miss. Both sides now route through normalizeCatalogName, so this
 * pins that they stay in lockstep.
 */
describe('institution catalog id-normalization is symmetric', () => {
  test('normalizeCatalogName trims + lowercases + is idempotent', () => {
    expect(normalizeCatalogName('  Town Hall  ')).toBe('town hall');
    expect(normalizeCatalogName('TAVERN')).toBe('tavern');
    const once = normalizeCatalogName('  Market Square ');
    expect(normalizeCatalogName(once)).toBe(once); // idempotent
  });

  test('clean, padded, and mixed-case lookups all resolve to the SAME id', () => {
    const clean = catalogIdForName('Barracks');
    expect(clean).not.toBeNull(); // sanity: a real catalog name
    expect(catalogIdForName('  Barracks  ')).toBe(clean);
    expect(catalogIdForName('BARRACKS')).toBe(clean);
    expect(catalogIdForName('\tBarracks\n')).toBe(clean);
  });

  test('a multi-word name is equally whitespace-robust', () => {
    const clean = catalogIdForName('Town Hall');
    expect(clean).not.toBeNull();
    expect(catalogIdForName('   Town Hall   ')).toBe(clean);
  });

  test('unknown names and null return null (no fuzzy fallback here)', () => {
    expect(catalogIdForName('   ')).toBeNull();
    expect(catalogIdForName(null)).toBeNull();
    expect(catalogIdForName('definitely-not-a-real-institution')).toBeNull();
  });
});
