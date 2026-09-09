/**
 * tests/lib/prebuiltResourceChains.test.js — FP-G10 first-paint reclaim pin.
 *
 * The resource-chains registry enumerator + its ~60 KB SUPPLY_CHAIN_NEEDS table
 * were split off the first-paint closure into the lazy leaf
 * src/lib/prebuiltResourceChains.js (customRegistry no longer statically imports
 * supplyChainData.js). This locks the two invariants that make that split
 * behaviour-preserving:
 *
 *   1. REGISTRATION — buildRegistry's `resourceChains` category is EMPTY until
 *      the leaf loads, and POPULATED (identically to the old inline enumerator)
 *      once it does. The leaf self-registers on import.
 *
 *   2. FALLBACK BYTE-IDENTITY — dependencyEngine.chainsFedByResource resolves a
 *      legacy `feedsChains` ref to the SAME engine chain id whether the category
 *      is empty (slug-reconstruction fallback) or populated (enumerated
 *      engineChainId). This is the core safety property: every SUPPLY_CHAIN_NEEDS
 *      chain id is already a slug, so the two paths cannot diverge. If a future
 *      chain id stops being slug-form (or gains a `__`), this fails loudly.
 */

import { describe, it, expect } from 'vitest';
import { buildRegistry } from '../../src/lib/customRegistry.js';
import { customDeps, withCustomContent } from '../../src/lib/dependencyEngine.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';

// Pick a real (needKey, chain) pair to exercise the feedsChains resolution.
function firstChain() {
  for (const [needKey, need] of Object.entries(SUPPLY_CHAIN_NEEDS || {})) {
    const chains = Array.isArray(need?.chains) ? need.chains : [];
    for (const chain of chains) if (chain?.id) return { needKey, chain };
  }
  throw new Error('SUPPLY_CHAIN_NEEDS has no chain with an id');
}

const { needKey, chain } = firstChain();
const feedsRef = `prebuilt:resourceChains:${needKey}__${chain.id}`;
const expectedChainId = `${needKey}.${chain.id}`;
const customContent = {
  resources: [{ name: 'PinTestOre', localUid: 'pin-test-ore', feedsChains: [feedsRef] }],
};

describe('FP-G10 — prebuilt resource-chains lazy split', () => {
  it('resourceChains category is EMPTY before the leaf loads (first-paint reclaim)', () => {
    // No import of prebuiltResourceChains.js has happened in this module yet.
    const reg = buildRegistry({});
    expect(reg.listPrebuilt('resourceChains')).toEqual([]);
  });

  it('chainsFedByResource resolves feedsChains via the slug FALLBACK when empty', () => {
    const got = withCustomContent(customContent, () => {
      customDeps.invalidate();
      return customDeps.chainsFedByResource('PinTestOre');
    });
    expect(got).toEqual([expectedChainId]);
  });

  it('the leaf self-registers on load and populates the category identically', async () => {
    const { enumeratePrebuiltResourceChains } = await import('../../src/lib/prebuiltResourceChains.js');
    // buildRegistry now surfaces the category (cache was invalidated on register).
    const reg = buildRegistry({});
    const listed = reg.listPrebuilt('resourceChains');
    expect(listed.length).toBeGreaterThan(0);
    // The registered category equals the enumerator's direct output (non-vacuity
    // + no drift from the pre-split inline enumerator, which produced this shape).
    expect(listed).toEqual(enumeratePrebuiltResourceChains());
    // The exercised ref now resolves to an entry carrying the engineChainId.
    const entry = reg.resolve(feedsRef);
    expect(entry?.engineChainId).toBe(expectedChainId);
  });

  it('chainsFedByResource is BYTE-IDENTICAL via the ENUMERATED path once loaded', () => {
    const got = withCustomContent(customContent, () => {
      customDeps.invalidate();
      return customDeps.chainsFedByResource('PinTestOre');
    });
    // Same result as the empty/fallback case above — the whole point of the split.
    expect(got).toEqual([expectedChainId]);
  });

  it('every SUPPLY_CHAIN_NEEDS chain id is slug-form (guards the fallback equivalence)', async () => {
    const { slugify } = await import('../../src/lib/customRegistry.js');
    const s = (x) => slugify(x);
    const offenders = [];
    for (const [nk, need] of Object.entries(SUPPLY_CHAIN_NEEDS || {})) {
      for (const c of (Array.isArray(need?.chains) ? need.chains : [])) {
        if (!c?.id) continue;
        if (s(c.id) !== c.id) offenders.push(`${nk}:${c.id} -> ${s(c.id)}`);
        if (String(c.id).includes('__')) offenders.push(`${nk}:${c.id} (contains __)`);
      }
    }
    expect(
      offenders,
      `these chain ids would break the chainsFedByResource slug fallback: ${offenders.join(', ')}`,
    ).toEqual([]);
  });
});
