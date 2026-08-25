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
import { reconcileProductionAfterResourceChange } from '../../src/domain/worldPulse/resourceDynamicsKernel.js';

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

describe('[data-tables-3] a persisted retired "fish" chain is reconciled away', () => {
  // fishingChainDedup (data-tables-5) only proves FRESH generation drops the thin
  // chain. A PRE-fix save persisted the 'food_security.fish' chain verbatim, and the
  // surgical reconcile diffs before/after over the CURRENT vocabulary — which no
  // longer produces 'fish' — so it never appears in either set and the orphan would
  // survive forever (still exporting 'Preserved foods'). RETIRED_CHAIN_ALIASES lets
  // the reconcile resolve it. Simulate the pre-fix save by stamping the orphan back on.
  const withOrphan = (s) => ({
    ...s.economicState,
    activeChains: [
      { needKey: 'food_security', chainId: 'fish', label: 'Fish', outputs: ['Preserved foods'], status: 'operational', exportable: true },
      ...(s.economicState?.activeChains || []),
    ],
  });
  const chainIds = (es) => (es.activeChains || []).map((c) => `${c.needKey}.${c.chainId}`);

  test('the orphan is co-removed when fishing_grounds is removed', () => {
    const s = coastal('dt3-remove');
    const es = withOrphan(s);
    expect(chainIds(es), 'pre-condition: the orphan is stamped').toContain('food_security.fish');
    expect(chainIds(es)).toContain('food_security.fishing');
    const out = reconcileProductionAfterResourceChange(es, {
      settlement: s, oldResources: ['fishing_grounds'], newResources: [], oldDepleted: [], newDepleted: [],
    });
    expect(chainIds(out), 'orphan co-removed with its successor').not.toContain('food_security.fish');
    expect(chainIds(out), 'the successor is gone too (resource removed)').not.toContain('food_security.fishing');
  });

  test('the duplicate is deduped while the real fishing industry survives', () => {
    const s = coastal('dt3-dedup');
    const es = withOrphan(s);
    // A resource change elsewhere (iron discovered) triggers a delta; fishing_grounds
    // stays, so 'fishing' survives and the stale 'fish' twin is deduped away.
    const out = reconcileProductionAfterResourceChange(es, {
      settlement: s, oldResources: ['fishing_grounds'], newResources: ['fishing_grounds', 'iron_deposits'], oldDepleted: [], newDepleted: [],
    });
    expect(chainIds(out), 'duplicate deduped').not.toContain('food_security.fish');
    expect(chainIds(out), 'the live fishing industry is preserved').toContain('food_security.fishing');
  });
});
