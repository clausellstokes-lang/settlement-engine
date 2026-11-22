/**
 * economyFingerprint.js - the versioned, draw-free fingerprint of the economic
 * fields the power projector reads.
 *
 * WHY THE LEAF SITS HERE, ONE LAYER DOWN. Two layers need one fact. The power
 * generator stamps this fingerprint onto the structure it projects, and the
 * record merge under src/domain/edit must recompute it when a DM edit moves one
 * of the four economic fields the projection consumed. A src/domain import of
 * src/generators would be the fifth file in the shrink-only baseline that
 * tests/build/domainGeneratorsBoundary.test.js freezes, and a second spelling of
 * a freshness digest drifts silently, which is the precise failure
 * assertPowerEconomyFreshness exists to catch. One fact, one spelling, one
 * address, and no new edge.
 *
 * THE ONE IMPORT. The estate's own FNV root in src/kernel/proseHash.js, which is
 * the same src/data to src/kernel edge historyData.js and npcData.js already
 * take, and which sits outside every pattern the src/data purity rule bans
 * (generators, store, lib, kernel/prng and kernel/rngContext). The leaf is
 * therefore pure data plus one pure hash: no draw, no clock, and no mutation of
 * either argument.
 */

import { fnv1a32 } from '../kernel/proseHash.js';

const ECONOMY_FINGERPRINT_VERSION = 'power-economy-v1';

function economyProjectionInput(economicState, tier) {
  return {
    tier: String(tier || ''),
    prosperity: economicState?.prosperity || 'Moderate',
    safetyLabel: economicState?.safetyProfile?.safetyLabel || 'Moderate',
    foodLabel: economicState?.foodSecurity?.label || 'Secure',
  };
}

/**
 * Versioned, draw-free fingerprint of every economic field the power projector
 * reads. FNV-1a is appropriate here because this is an internal freshness
 * assertion, not a security boundary; the explicit tuple order avoids object-key
 * ordering ambiguity.
 */
export function fingerprintPowerEconomyInput(economicState, tier) {
  const input = economyProjectionInput(economicState, tier);
  const serialized = JSON.stringify([
    ECONOMY_FINGERPRINT_VERSION,
    input.tier,
    input.prosperity,
    input.safetyLabel,
    input.foodLabel,
  ]);
  const digest = fnv1a32(serialized).toString(16).padStart(8, '0');
  return `${ECONOMY_FINGERPRINT_VERSION}:${digest}`;
}
