import { describe, it, expect } from 'vitest';
import { customDeps, withCustomContent } from '../../src/lib/dependencyEngine.js';
import {
  computeFinishedGoodsDemand,
} from '../../src/generators/economy/finishedGoodsDemand.js';

// §14 trade flow, Phase 1 — a custom good/institution declaring it `satisfies` a
// finished-goods demand category contributes local supply (shrinking imports)
// and, for goods, names itself for export once local demand is met.
describe('customDeps.finishedGoodsSupply', () => {
  it('counts a present custom institution that satisfies a category (no export name)', () => {
    const cc = { institutions: [{ name: 'Dragonbone Foundry', localUid: 'd1', satisfies: 'military', economicWeight: 'major' }] };
    withCustomContent(cc, () => {
      const r = customDeps.finishedGoodsSupply('military', new Set(['dragonbone foundry']));
      expect(r.supply).toBe(3); // major → 3
      expect(r.goods).toEqual([]); // institutions add supply, not a named export good
    });
  });

  it('counts a custom trade good gated by its required institution and names it for export', () => {
    const cc = {
      institutions: [{ name: 'Dragonbone Foundry', localUid: 'd1' }],
      tradeGoods: [{ name: 'Dragonbone Greatswords', localUid: 'g1', satisfies: 'military', economicWeight: 'moderate', requiredInstitution: 'Dragonbone Foundry' }],
    };
    withCustomContent(cc, () => {
      const r = customDeps.finishedGoodsSupply('military', new Set(['dragonbone foundry']));
      expect(r.supply).toBe(2); // moderate → 2
      expect(r.goods).toContain('Dragonbone Greatswords');
    });
  });

  it('excludes a gated good when its required institution is absent', () => {
    const cc = { tradeGoods: [{ name: 'Dragonbone Greatswords', localUid: 'g1', satisfies: 'military', requiredInstitution: 'Dragonbone Foundry' }] };
    withCustomContent(cc, () => {
      const r = customDeps.finishedGoodsSupply('military', new Set()); // foundry not present
      expect(r.supply).toBe(0);
      expect(r.goods).toEqual([]);
    });
  });

  it('excludes a gated good whose requiredInstitution ref is DANGLING (unresolvable ≠ ungated)', () => {
    // A deleted institution / dropped ref resolves to '' (falsy). The old guard
    // `reqName && !present(reqName)` then skipped the gate and counted the good as freely
    // supplied — an unproducible good shrinking imports AND named as a local export. A
    // DECLARED-but-unresolvable requirement must gate the good OUT.
    const cc = { tradeGoods: [{ name: 'Ghost Blade', localUid: 'g1', satisfies: 'military', economicWeight: 'major', requiredInstitution: 'custom:DELETED_FORGE' }] };
    withCustomContent(cc, () => {
      const r = customDeps.finishedGoodsSupply('military', new Set()); // no institution present
      expect(r.supply).toBe(0);     // was 3 (gate inverted) before the fix
      expect(r.goods).toEqual([]);  // and it was wrongly named a local export
    });
  });

  it('is an inert no-op for a category nothing satisfies', () => {
    withCustomContent({}, () => {
      expect(customDeps.finishedGoodsSupply('luxury', new Set(['anything']))).toEqual({ supply: 0, goods: [] });
    });
  });

  it('defaults missing economicWeight to a moderate contribution', () => {
    const cc = { institutions: [{ name: 'Hedge Armory', localUid: 'h1', satisfies: 'military' }] };
    withCustomContent(cc, () => {
      expect(customDeps.finishedGoodsSupply('military', new Set(['hedge armory'])).supply).toBe(2);
    });
  });

  it('counts one exact same-name institution and rejects an ambiguous legacy name', () => {
    const first = {
      localUid: 'twin-arsenal-a',
      definitionId: 'definition:twin-arsenal-a',
      name: 'Twin Arsenal',
      satisfies: 'military',
      economicWeight: 'backbone',
    };
    const second = {
      localUid: 'twin-arsenal-b',
      definitionId: 'definition:twin-arsenal-b',
      name: 'Twin Arsenal',
      satisfies: 'military',
      economicWeight: 'backbone',
    };

    withCustomContent({ institutions: [first, second] }, () => {
      expect(customDeps.finishedGoodsSupply(
        'military',
        [first],
        'town',
      )).toEqual({
        supply: 5,
        goods: [],
      });
      expect(customDeps.finishedGoodsSupply(
        'military',
        new Set(['twin arsenal']),
        'town',
      )).toEqual({
        supply: 0,
        goods: [],
      });
    });
  });

  it('deduplicates exact trade-good projections and rejects ambiguous name-only goods', () => {
    const provider = {
      localUid: 'twin-forge',
      definitionId: 'definition:twin-forge',
      name: 'Twin Forge',
    };
    const first = {
      localUid: 'twin-blade-a',
      definitionId: 'definition:twin-blade-a',
      name: 'Twin Blade',
      satisfies: 'military',
      economicWeight: 'backbone',
      requiredInstitution: 'custom:twin-forge',
    };
    const second = {
      localUid: 'twin-blade-b',
      definitionId: 'definition:twin-blade-b',
      name: 'Twin Blade',
      satisfies: 'military',
      economicWeight: 'backbone',
      requiredInstitution: 'custom:twin-forge',
    };

    withCustomContent({
      institutions: [provider],
      tradeGoods: [first, second],
    }, () => {
      expect(customDeps.finishedGoodsSupply(
        'military',
        [provider],
        'town',
        { tradeGoods: [first, first] },
      )).toEqual({
        supply: 5,
        goods: ['Twin Blade'],
      });
      expect(customDeps.finishedGoodsSupply(
        'military',
        [provider],
        'town',
      )).toEqual({
        supply: 0,
        goods: [],
      });
    });
  });

  it('threads exact institution identity through the canonical demand-gap consumer', () => {
    const first = {
      localUid: 'canonical-arsenal-a',
      definitionId: 'definition:canonical-arsenal-a',
      name: 'Canonical Arsenal',
      satisfies: 'military',
      economicWeight: 'backbone',
    };
    const second = {
      ...first,
      localUid: 'canonical-arsenal-b',
      definitionId: 'definition:canonical-arsenal-b',
    };

    withCustomContent({ institutions: [first, second] }, () => {
      const exports = [];
      const imports = [];
      computeFinishedGoodsDemand(
        'town',
        'road',
        [{ name: 'Barracks' }, first],
        [],
        exports,
        imports,
      );

      // Barracks demand is 3 and one backbone arsenal supplies 5: the exact
      // -2 gap produces neither an import nor the "< -2" export bonus. Counting
      // both definitions would add the bonus; losing exact identity would add
      // an import.
      expect(exports).toEqual([]);
      expect(imports).toEqual([]);
    });
  });
});
