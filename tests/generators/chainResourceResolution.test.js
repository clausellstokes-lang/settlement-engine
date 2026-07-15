/**
 * chainResourceResolution.test.js
 *
 * Guard for B08 finding #16: computeActiveChains.resourceLabelToKey() resolves a
 * supply-chain resource LABEL (e.g. 'Grain fields') to a RESOURCE_DATA KEY (e.g.
 * 'grain_fields') by fuzzy word overlap (>4-char words, prefix match). This is
 * correct for today's closed label set, but it is rename-fragile: a future
 * resource label whose distinguishing word is <=4 chars, or two labels sharing a
 * dominant word, could silently resolve to the wrong key (or to none) and
 * mis-activate / kill a chain with no other failing test.
 *
 * This pins the invariant: every chain.resource and every resourceSubstitute in
 * SUPPLY_CHAIN_NEEDS resolves to a real RESOURCE_DATA key.
 */

import { describe, expect, test } from 'vitest';

import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import { resourceLabelToKey } from '../../src/generators/computeActiveChains.js';

const RESOURCE_KEYS = new Set(Object.keys(RESOURCE_DATA));

/** Every (need, chainId, label) tuple the supply-chain taxonomy declares. */
function allChainResourceLabels() {
  const out = [];
  for (const [need, block] of Object.entries(SUPPLY_CHAIN_NEEDS)) {
    for (const chain of block.chains || []) {
      const labels = [chain.resource, ...(chain.resourceSubstitutes || [])].filter(Boolean);
      for (const label of labels) out.push({ need, chainId: chain.id, label });
    }
  }
  return out;
}

describe('supply-chain resource labels resolve to RESOURCE_DATA keys', () => {
  test('every chain.resource and resourceSubstitute resolves to a key', () => {
    const unresolved = allChainResourceLabels()
      .filter(({ label }) => {
        const key = resourceLabelToKey(label);
        return !key || !RESOURCE_KEYS.has(key);
      })
      .map(({ need, chainId, label }) => `${need}/${chainId}: "${label}"`);

    expect(
      unresolved,
      `supply-chain resource labels that do not resolve to a RESOURCE_DATA key: ${unresolved.join(', ')}`,
    ).toEqual([]);
  });

  test('the label set is non-empty (test is not vacuous)', () => {
    expect(allChainResourceLabels().length).toBeGreaterThan(0);
  });
});
