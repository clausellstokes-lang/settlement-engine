/**
 * fishingChainDedup.test.js — [data-tables-5].
 *
 * 'fish' and 'fishing' were both keyed to resource 'Fishing grounds' (a duplicate
 * authoring pass), and 'river_fishing' substitute-activated on 'Fishing grounds' —
 * so a coastal town displayed THREE near-identical fishing industries, including a
 * 'River Fishing' with no river. The thin 'fish' chain is retired (its output
 * folded into 'fishing'), and river_fishing no longer substitutes on Fishing grounds.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const coastal = (seed) => generateSettlementPipeline({
  settType: 'town', culture: 'germanic', terrainOverride: 'coastal', tradeRouteAccess: 'port',
  nearbyResourcesRandom: false, nearbyResources: ['fishing_grounds'], nearbyResourcesState: { fishing_grounds: 'abundant' },
}, null, { seed, customContent: {} });

const fishingChainIds = (s) =>
  (s.economicState?.activeChains || []).map((c) => c.chainId).filter((id) => /fish/i.test(id));

describe('[data-tables-5] a coastal town shows one fishing industry, not three', () => {
  test('no thin "fish" chain and no riverless "River Fishing" on a coastal town', () => {
    for (const seed of ['dt5a', 'dt5b', 'dt5c', 'dt5d', 'dt5e', 'dt5f']) {
      const ids = fishingChainIds(coastal(seed));
      expect(ids, `seed ${seed}`).not.toContain('fish');
      expect(ids, `seed ${seed}`).not.toContain('river_fishing');
      // the richer 'fishing' chain is the one that represents the coastal industry
      expect(ids, `seed ${seed}`).toContain('fishing');
    }
  });

  test('the retired fish chain id no longer exists in the catalog', () => {
    // guard against a future re-introduction of the duplicate
    const s = coastal('dt5-catalog');
    const allIds = (s.economicState?.activeChains || []).map((c) => c.chainId);
    expect(allIds).not.toContain('fish');
  });
});
