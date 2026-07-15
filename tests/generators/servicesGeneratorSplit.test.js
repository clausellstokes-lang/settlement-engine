/**
 * tests/generators/servicesGeneratorSplit.test.js
 *
 * Locks the public contract of the servicesGenerator.js module split. The
 * 1838-line file was reorganized into focused submodules under
 * src/generators/services/ (serviceTierData.js, serviceResolution.js,
 * serviceCategory.js). This is a PURE reorganization — zero behaviour change —
 * so the guard here is structural:
 *   - the public entry still exports BOTH public symbols (SERVICE_TIER_DATA,
 *     generateAvailableServices), so every existing importer is unaffected;
 *   - the entry's re-export and the submodule export are the same object;
 *   - generateAvailableServices stays deterministic under a seeded PRNG (same
 *     seed → byte-identical category buckets).
 */
import { describe, it, expect } from 'vitest';

import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { SERVICE_TIER_DATA, generateAvailableServices } from '../../src/generators/servicesGenerator.js';
import { SERVICE_TIER_DATA as TIER_DATA_FROM_SUBMODULE } from '../../src/generators/services/serviceTierData.js';

/** Run generateAvailableServices under a seeded PRNG (deterministic per seed). */
function servicesWithSeed(seed, tier, institutions, config) {
  setActiveRng(createPRNG(seed));
  try {
    return generateAvailableServices(tier, institutions, {}, config);
  } finally {
    clearActiveRng();
  }
}

describe('servicesGenerator module split — public contract', () => {
  it('re-exports both public symbols from the entry point', () => {
    expect(SERVICE_TIER_DATA).toBeTypeOf('object');
    expect(generateAvailableServices).toBeTypeOf('function');
  });

  it('the entry re-export is the same object as the submodule export', () => {
    expect(SERVICE_TIER_DATA).toBe(TIER_DATA_FROM_SUBMODULE);
  });

  it('SERVICE_TIER_DATA still carries every settlement tier', () => {
    expect(Object.keys(SERVICE_TIER_DATA).sort()).toEqual(
      ['city', 'hamlet', 'metropolis', 'thorp', 'town', 'village'].sort(),
    );
  });

  it('generateAvailableServices returns all eleven category buckets', () => {
    const out = servicesWithSeed('split-buckets', 'city', [{ name: 'Banking houses' }], { settType: 'city' });
    expect(Object.keys(out).sort()).toEqual(
      [
        'criminal',
        'employment',
        'entertainment',
        'equipment',
        'food',
        'healing',
        'information',
        'legal',
        'lodging',
        'magic',
        'transport',
      ].sort(),
    );
  });

  it('is deterministic across the split: same seed → identical output', () => {
    const insts = [{ name: 'Garrison' }, { name: 'Blacksmiths (3-10)' }, { name: "Travelers' inn" }];
    const cfg = { settType: 'town', tradeRouteAccess: 'road' };
    const a = servicesWithSeed('split-determinism', 'town', insts, cfg);
    const b = servicesWithSeed('split-determinism', 'town', insts, cfg);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
