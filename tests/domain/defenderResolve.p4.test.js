import { describe, expect, test } from 'vitest';

import { resolveSiegeVerdict } from '../../src/domain/worldPulse/warDeployment.js';
import { createPRNG } from '../../src/generators/prng.js';

/**
 * Defender-resolve P4 (flag-gated, default OFF): a besieged town's WILL — leadership/faith
 * temperament (facets.will), legitimacy, food/supply (facets.logistics), and hope (the
 * capacity odds) — biases the siege roll, and a fully-broken will capitulates outright.
 * Proves, on the verdict's own pFall (roll-independent): (1) OFF ⇒ will is ignored, pFall
 * is identical regardless of resolve (byte-identical); (2) ON ⇒ a resolute defender has a
 * LOWER fall probability than a broken one at the SAME capacity; (3) a fully-collapsed will
 * capitulates (falls with a bloodless surrender, not a storm).
 */
const TICK = 100;

// A plausible-band siege (attacker out-classes but does not auto-storm), so the verdict
// reaches the log-odds roll where willBias applies. capacityFor returns controllable
// offensive/homeDefense/facets so the test drives will + legitimacy precisely.
function verdict({ resolveOn, will, legit, logistics = 50, defOffPenalty = 0 }) {
  const capacityFor = (id) => id === 'atk'
    ? { offensive: 60, homeDefense: 30, facets: {} }
    : { offensive: 30, homeDefense: 40 - defOffPenalty, facets: { will, logistics } };
  return resolveSiegeVerdict({
    targetId: 'def',
    besiegers: ['atk'],
    capacityFor,
    effectiveStrengthFor: (id) => (id === 'atk' ? 60 : null),
    defenderItem: { name: 'Def', settlement: { powerStructure: { publicLegitimacy: { score: legit } } } },
    rng: createPRNG('resolve-seed'),
    tick: TICK, siegeAge: 0,
    defenderResolveEnabled: resolveOn,
  });
}

describe('defender resolve P4 — will biases the siege', () => {
  test('flag OFF: will is ignored — pFall identical for a resolute vs a broken defender', () => {
    const resolute = verdict({ resolveOn: false, will: 90, legit: 90, logistics: 90 });
    const broken = verdict({ resolveOn: false, will: 20, legit: 20, logistics: 20 });
    expect(resolute.pFall).toBe(broken.pFall);
  });

  test('flag ON: a RESOLUTE defender is less likely to fall than a BROKEN one (same capacity)', () => {
    const resolute = verdict({ resolveOn: true, will: 90, legit: 90, logistics: 90 });
    const broken = verdict({ resolveOn: true, will: 20, legit: 20, logistics: 20 });
    expect(resolute.pFall).toBeLessThan(broken.pFall);
    // And the resolute defender holds better than the will-agnostic baseline.
    const baseline = verdict({ resolveOn: false, will: 55, legit: 55, logistics: 55 });
    expect(resolute.pFall).toBeLessThan(baseline.pFall);
  });

  test('flag ON: a fully-collapsed will CAPITULATES (bloodless fall, not a storm)', () => {
    // Zero will + zero legitimacy + zero food + hopeless capacity ⇒ willScore ≤ the floor.
    const v = verdict({ resolveOn: true, will: 0, legit: 0, logistics: 0, defOffPenalty: 25 });
    expect(v.falls).toBe(true);
    expect(v.capitulation).toBe(true);
    expect(v.reasons.some(r => /capitulat|will broke/i.test(r))).toBe(true);
  });

  test('flag ON: a resolute defender does NOT spuriously capitulate', () => {
    const v = verdict({ resolveOn: true, will: 90, legit: 90, logistics: 90 });
    expect(v.capitulation).toBeUndefined();
  });
});
