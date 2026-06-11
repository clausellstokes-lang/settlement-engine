/**
 * tests/generators/notableAbsences.test.js — deriveNotableAbsences honesty
 * against real generateAvailableServices output.
 *
 * The absence derivation (domain/display/servicesDisplay.js) reads the
 * generator's bucket map: a settlement whose magical transit fills the
 * transport bucket must not be told 'Transportation' is notably absent, and
 * a town whose inns serve meals must not read as foodless. Guaranteed (p=1.0)
 * services make these pins seed-stable; the seeded loop proves it.
 */
import { describe, it, expect } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';
import { deriveNotableAbsences } from '../../src/domain/display/servicesDisplay.js';

const SEEDS = Array.from({ length: 25 }, (_, i) => `absence-${i}`);

/** Run generateAvailableServices under a seeded PRNG (deterministic per seed). */
function servicesWithSeed(seed, tier, institutions, config) {
  setActiveRng(createPRNG(seed));
  try {
    return generateAvailableServices(tier, institutions, {}, config);
  } finally {
    clearActiveRng();
  }
}

const absenceKeys = (tier, buckets) => deriveNotableAbsences(tier, buckets).map((a) => a.key);

describe('deriveNotableAbsences vs generated services', () => {
  it("a metropolis with a Teleportation circle never lists 'transport' absent", () => {
    const insts = [{ name: 'Teleportation circle', category: 'Magic' }];
    const config = { settType: 'metropolis', magicExists: true };
    for (const seed of SEEDS) {
      const buckets = servicesWithSeed(seed, 'metropolis', insts, { ...config });
      expect(absenceKeys('metropolis', buckets), `seed ${seed}`).not.toContain('transport');
    }
  });

  it("a metropolis with an airship dock never lists 'transport' absent", () => {
    const insts = [{ name: 'Airship docking (high magic)', category: 'Magic' }];
    const config = { settType: 'metropolis', magicExists: true };
    for (const seed of SEEDS) {
      const buckets = servicesWithSeed(seed, 'metropolis', insts, { ...config });
      expect(absenceKeys('metropolis', buckets), `seed ${seed}`).not.toContain('transport');
    }
  });

  it("a metropolis with no transit institutions DOES list 'transport' absent (the gate is real)", () => {
    const insts = [{ name: 'Great library', category: 'Knowledge' }];
    const config = { settType: 'metropolis', magicExists: true };
    for (const seed of SEEDS) {
      const buckets = servicesWithSeed(seed, 'metropolis', insts, { ...config });
      expect(absenceKeys('metropolis', buckets), `seed ${seed}`).toContain('transport');
    }
  });

  it("a town whose inns and taverns serve meals never lists 'food' absent", () => {
    const insts = [
      { name: 'Inn (multiple)', category: 'Economy' },
      { name: 'Taverns (5-20)', category: 'Entertainment' },
    ];
    const config = { settType: 'town', magicExists: true };
    for (const seed of SEEDS) {
      const buckets = servicesWithSeed(seed, 'town', insts, { ...config });
      expect(absenceKeys('town', buckets), `seed ${seed}`).not.toContain('food');
    }
  });
});
