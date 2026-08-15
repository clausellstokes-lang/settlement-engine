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
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';
import { deriveNotableAbsences } from '../../src/domain/display/servicesDisplay.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SEEDS = Array.from({ length: 25 }, (_, i) => `absence-${i}`);

/**
 * The liveness anchor for every "X is not notably absent" assertion here.
 * 'healing' is derived by the SAME deriveNotableAbsences pass over the SAME bucket
 * map as the excluded key, and no fixture in this file supplies a healing provider —
 * so it is absent on all 25 seeds of all three negative cases (measured 2026-07-27,
 * intersection == union == the full key set). If the derivation ever stops returning
 * keys at all, the anchor reds instead of the exclusion passing vacuously.
 */
const LIVE_ABSENCE_ANCHOR = 'healing';

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
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const buckets = servicesWithSeed(seed, 'metropolis', insts, { ...config });
      expectAbsentWithAnchor(
        absenceKeys('metropolis', buckets), 'transport', LIVE_ABSENCE_ANCHOR, `seed ${seed}`,
      );
    });
    expectNoSeedFailures(failures, "a Teleportation circle keeps 'transport' off the absence list");
  });

  it("a metropolis with an airship dock never lists 'transport' absent", () => {
    const insts = [{ name: 'Airship docking (high magic)', category: 'Magic' }];
    const config = { settType: 'metropolis', magicExists: true };
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const buckets = servicesWithSeed(seed, 'metropolis', insts, { ...config });
      expectAbsentWithAnchor(
        absenceKeys('metropolis', buckets), 'transport', LIVE_ABSENCE_ANCHOR, `seed ${seed}`,
      );
    });
    expectNoSeedFailures(failures, "an airship dock keeps 'transport' off the absence list");
  });

  it("a metropolis with no transit institutions DOES list 'transport' absent (the gate is real)", () => {
    const insts = [{ name: 'Great library', category: 'Knowledge' }];
    const config = { settType: 'metropolis', magicExists: true };
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const buckets = servicesWithSeed(seed, 'metropolis', insts, { ...config });
      expect(absenceKeys('metropolis', buckets), `seed ${seed}`).toContain('transport');
    });
    expectNoSeedFailures(failures, "no transit institutions DOES list 'transport' absent");
  });

  it("a town whose inns and taverns serve meals never lists 'food' absent", () => {
    const insts = [
      { name: 'Inn (multiple)', category: 'Economy' },
      { name: 'Taverns (5-20)', category: 'Entertainment' },
    ];
    const config = { settType: 'town', magicExists: true };
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const buckets = servicesWithSeed(seed, 'town', insts, { ...config });
      expectAbsentWithAnchor(
        absenceKeys('town', buckets), 'food', LIVE_ABSENCE_ANCHOR, `seed ${seed}`,
      );
    });
    expectNoSeedFailures(failures, "inns and taverns keep 'food' off the absence list");
  });
});
