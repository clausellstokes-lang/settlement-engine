/**
 * tradeGoodsRegistry.test.js — [data-tables-1].
 *
 * The prebuilt tradeGoods enumerator (customRegistry.enumeratePrebuiltTradeGoods,
 * surfaced via buildRegistry().listPrebuilt('tradeGoods')) ingests TWO tables with
 * DIFFERENT shapes:
 *   - GOODS_MODIFIERS_BY_TIER (export): { tier: { goodName: props } }
 *   - IMPORT_GOODS_BY_TIER    (import): { tier: { groupKey: [{ name, … }] } }
 *
 * Reading the import table with the export shape iterated one level too shallow —
 * it minted the BUCKET KEYS (basic / fromHigher / fromCityOrMetropolis /
 * fromHinterland / fromMetropolis) as phantom goods with array `raw`, and never
 * descended into the arrays, so no real import good (Salt, Metal tools, Cloth …)
 * was enumerated at all. listPrebuilt('tradeGoods') feeds the Compendium
 * dependency picker, so users saw nonsense entries and a missing import vocabulary.
 *
 * This pins the ingest so a future table that adds another nesting level can't
 * silently re-introduce the drift.
 */

import { describe, expect, test } from 'vitest';

import { buildRegistry } from '../../src/lib/customRegistry.js';
import { IMPORT_GOODS_BY_TIER } from '../../src/data/tradeGoodsData.js';

/** Every bucket/group key across the import table (a key whose value is an array). */
function groupKeys(byTier) {
  const keys = new Set();
  for (const byName of Object.values(byTier || {})) {
    if (!byName || typeof byName !== 'object') continue;
    for (const [key, val] of Object.entries(byName)) {
      if (Array.isArray(val)) keys.add(key);
    }
  }
  return keys;
}

describe('[data-tables-1] prebuilt tradeGoods ingest flattens the import group-array shape', () => {
  const registry = buildRegistry({});
  const goods = registry.listPrebuilt('tradeGoods');
  const names = goods.map((g) => g.name);

  test('no enumerated good name is an import bucket/group key', () => {
    const buckets = groupKeys(IMPORT_GOODS_BY_TIER);
    // sanity: the table really does use group buckets (non-vacuous guard)
    expect(buckets.size).toBeGreaterThanOrEqual(3);
    const phantoms = names.filter((n) => buckets.has(n));
    expect(phantoms, `phantom goods minted from bucket keys: ${phantoms.join(', ')}`).toEqual([]);
  });

  test('known import goods enumerate with direction "import"', () => {
    for (const wanted of ['Salt', 'Metal tools', 'Cloth']) {
      const entry = goods.find((g) => g.name === wanted);
      expect(entry, `import good "${wanted}" must enumerate`).toBeTruthy();
      expect(entry.directions, `"${wanted}" must carry the import direction`).toContain('import');
    }
  });

  test('every real import good (by .name) reaches the registry', () => {
    // Flatten the import table by hand and assert each authored good name is present.
    const authored = new Set();
    for (const byName of Object.values(IMPORT_GOODS_BY_TIER)) {
      for (const val of Object.values(byName)) {
        if (Array.isArray(val)) {
          for (const item of val) if (item?.name) authored.add(item.name);
        } else if (val && typeof val === 'object' && val.name) {
          authored.add(val.name);
        }
      }
    }
    expect(authored.size).toBeGreaterThanOrEqual(10); // non-vacuous
    const missing = [...authored].filter((n) => !names.includes(n));
    expect(missing, `authored import goods absent from the registry: ${missing.join(', ')}`).toEqual([]);
  });
});
