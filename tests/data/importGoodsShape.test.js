import { describe, it, expect } from 'vitest';
import { buildRegistry } from '../../src/lib/customRegistry.js';
import { IMPORT_GOODS_BY_TIER } from '../../src/data/tradeGoodsData.js';

// Regression: IMPORT_GOODS_BY_TIER used to be tier → bucket → array[], but
// customRegistry.enumeratePrebuiltTradeGoods walks tier → key → props expecting
// `key` to be a good name. That mismatch leaked the bucket labels ("basic",
// "fromHinterland", …) into the Compendium as fake trade goods and dropped the
// real imports. The export is now flat (tier → goodName → props) to match
// EXPORT_GOODS_BY_TIER, with supplier recorded on a `source` field.
const STRUCTURAL_BUCKET_KEYS = [
  'basic',
  'fromHigher',
  'fromHinterland',
  'fromCityOrMetropolis',
  'fromMetropolis',
];

describe('IMPORT_GOODS_BY_TIER shape → prebuilt trade-good enumeration', () => {
  it('exposes goods keyed by name, never by supplier bucket', () => {
    for (const [tier, byName] of Object.entries(IMPORT_GOODS_BY_TIER)) {
      for (const [name, props] of Object.entries(byName)) {
        expect(
          STRUCTURAL_BUCKET_KEYS.includes(name),
          `${tier}.${name} is a supplier bucket, not a good name`,
        ).toBe(false);
        // Each entry is a good-shaped object (not an array of goods).
        expect(Array.isArray(props)).toBe(false);
        expect(typeof props).toBe('object');
      }
    }
  });

  it('does not leak bucket labels into the Compendium trade-goods catalog', () => {
    const goods = buildRegistry({}).listAll('tradeGoods');
    const names = new Set(goods.map((g) => g.name));
    for (const bucket of STRUCTURAL_BUCKET_KEYS) {
      expect(names.has(bucket), `leaked bucket key "${bucket}"`).toBe(false);
    }
  });

  it('surfaces the real imports that the old array shape dropped', () => {
    const goods = buildRegistry({}).listAll('tradeGoods');
    const byName = new Map(goods.map((g) => [g.name, g]));
    // Sampled from every previously-bucketed tier.
    for (const name of ['Salt', 'Timber', 'International banking', 'Luxury imports', 'Legal services']) {
      const g = byName.get(name);
      expect(g, `missing import good "${name}"`).toBeTruthy();
      expect(g.directions).toContain('import');
    }
  });
});
