/**
 * prebuiltResourceChains — the lazy leaf that carries the resource-chains
 * registry enumerator + its ~60 KB SUPPLY_CHAIN_NEEDS table off the first-paint
 * path (FP-G10 first-paint reclaim).
 *
 * The enumerator below used to live in customRegistry.js, whose static
 * `import { SUPPLY_CHAIN_NEEDS } from '../data/supplyChainData.js'` was the SOLE
 * first-paint (eager) importer of that table — dragging ~33 KB of chain data into
 * the eager `data` chunk for a registry category that NO first-paint path
 * consumes. The category is read only by dependencyEngine.chainsFedByResource (a
 * legacy `feedsChains` resolver whose slug-reconstruction fallback is
 * byte-identical to the enumerated engineChainId — every chain id is already a
 * slug) and by no live UI (feedsChains is no longer an authored dependency
 * field). So the enumerator + table now live here and self-register with
 * customRegistry on load. supplyChainData.js keeps its other (already-lazy)
 * generator/domain importers, so it simply leaves the eager closure and rides a
 * lazy chunk instead.
 *
 * Loading this module (generators/computeActiveChains.js — the feedsChains
 * consumer, on the lazy engine chunk — imports it) populates the
 * `resourceChains` prebuilt category; until then it is EMPTY — byte-identical,
 * because every consumer either falls back (chainsFedByResource) or never lists
 * the category. @enforced-by tests/lib/prebuiltResourceChains.test.js.
 */

import { SUPPLY_CHAIN_NEEDS } from '../data/supplyChainData.js';
import { slugify, registerPrebuiltResourceChains } from './customRegistry.js';

/**
 * Enumerate the prebuilt resource-chain registry entries. Sourced from
 * SUPPLY_CHAIN_NEEDS (need_group → chains[]) which is what the engine matches
 * against. Each chain's refId slug encodes the full chain id
 * (`<needKey>__<chainId>`) so consumers can reconstruct `<needKey>.<chainId>` to
 * compare with the engine's chain ids. Moved verbatim from customRegistry.js.
 * @returns {Array<object>}
 */
export function enumeratePrebuiltResourceChains() {
  const out = [];
  for (const [needKey, need] of Object.entries(SUPPLY_CHAIN_NEEDS || {})) {
    if (!needKey) continue;
    const chains = Array.isArray(need?.chains) ? need.chains : [];
    for (const chain of chains) {
      if (!chain || typeof chain !== 'object') continue;
      const slug = `${needKey}__${slugify(chain.id || chain.label || '')}`;
      out.push({
        refId: `prebuilt:resourceChains:${slug}`,
        name: chain.label || chain.id || slug,
        category: 'resourceChains',
        subcategory: need?.label || needKey,
        source: 'prebuilt',
        tags: chain.exportable ? ['exportable'] : [],
        desc: Array.isArray(chain.outputs) && chain.outputs.length
          ? `→ ${chain.outputs.slice(0, 4).join(', ')}`
          : (chain.resource ? `from ${chain.resource}` : ''),
        // Engine-facing chain id (matches `${needKey}.${chain.id}` exactly)
        engineChainId: chain.id ? `${needKey}.${chain.id}` : null,
        raw: chain,
      });
    }
  }
  return out;
}

// Self-register on load: from here on, buildRegistry surfaces the prebuilt
// resourceChains category (customRegistry invalidates its prebuilt cache).
registerPrebuiltResourceChains(enumeratePrebuiltResourceChains);
