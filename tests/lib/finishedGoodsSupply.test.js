import { describe, it, expect } from 'vitest';
import { customDeps, withCustomContent } from '../../src/lib/dependencyEngine.js';

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
});
