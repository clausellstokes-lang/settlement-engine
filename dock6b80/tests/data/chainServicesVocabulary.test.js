/**
 * chainServicesVocabulary.test.js — pins the `services` vocabulary on supply chains.
 *
 * Each chain in SUPPLY_CHAIN_NEEDS carries a `services` array (e.g. ['food'],
 * ['equipment'], ['magic']) that flows straight to the display / PDF layers.
 * Unlike a chain's resource / processingInstitutions / upstreamChains — all of
 * which are join-pinned against real catalog names in tests/joins/chains.test.js —
 * the `services` tags were validated against NOTHING. A typo'd tag (e.g. 'fud',
 * 'equipement', 'magik') would render silently wherever the chain's services are
 * surfaced, with no test or runtime guard to catch it.
 *
 * This guard closes that gap: it collects every distinct `services` value across
 * all chains and asserts each is in CANONICAL_SERVICE_TAGS — a closed allowlist
 * derived from the values the data ACTUALLY uses today. A future typo now fails
 * the gate instead of shipping.
 *
 * Adding a genuinely-new service tag is a DELIBERATE act: add it to
 * CANONICAL_SERVICE_TAGS below in the same change that introduces it on a chain.
 */
import { describe, expect, test } from 'vitest';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';

// Closed vocabulary, derived from the service tags every chain in
// supplyChainData.js currently uses (enumerated 2026-06-30). New tags must be
// added here deliberately, together with the chain that introduces them.
const CANONICAL_SERVICE_TAGS = new Set([
  'construction',
  'crafts',
  'criminal',
  'employment',
  'entertainment',
  'equipment',
  'food',
  'fuel',
  'healing',
  'information',
  'legal',
  'lodging',
  'magic',
  'military',
  'security',
  'textiles',
  'trade',
  'transport',
]);

// Flatten every chain across all need groups.
const allChains = Object.entries(SUPPLY_CHAIN_NEEDS).flatMap(([needKey, need]) =>
  need.chains.map((chain) => ({ needKey, fullId: `${needKey}.${chain.id}`, ...chain })),
);

describe('supply-chain services vocabulary', () => {
  test('every chain.services entry is a real string in the canonical set', () => {
    const offenders = [];
    for (const chain of allChains) {
      // `services` is always present today, but guard against a chain that
      // forgets it (undefined) rather than throwing inside the loop.
      const services = chain.services || [];
      expect(Array.isArray(services), `${chain.fullId}.services must be an array`).toBe(true);
      for (const svc of services) {
        if (typeof svc !== 'string' || !CANONICAL_SERVICE_TAGS.has(svc)) {
          offenders.push(`${chain.fullId}: '${svc}'`);
        }
      }
    }
    // A non-empty list means a typo'd or undeclared service tag slipped in —
    // fix the typo, or add the new tag to CANONICAL_SERVICE_TAGS deliberately.
    expect(offenders).toEqual([]);
  });

  test('the canonical set has no dead tags (every allowlisted tag is used)', () => {
    // Keeps the allowlist honest in the other direction: a tag listed here but
    // emitted by no chain is dead schema that should be pruned (or the chain
    // that was meant to use it is missing it).
    const used = new Set(allChains.flatMap((c) => c.services || []));
    const dead = [...CANONICAL_SERVICE_TAGS].filter((tag) => !used.has(tag));
    expect(dead).toEqual([]);
  });
});
