/**
 * servicesMagicalInfra.test.js — a supply gap covered by magical trade
 * infrastructure is SUPPLIED, not impaired.
 *
 * Regression pin: computeChainSets flagged EVERY trade-dependent service in an
 * isolated town as IMPAIRED (`... || isIsolated`), even when the generator had
 * already marked the dependency as met through a teleport/airship channel
 * ("Supplied via magical trade infrastructure: …", severity 'vulnerable'). Those
 * services now land in a dedicated `magicalInfra` set (→ a blue "Magical
 * Infrastructure" tag) and drop out of every impairment set + count.
 */
import { describe, test, expect } from 'vitest';

import { computeChainSets } from '../../src/components/new/tabHelpers.js';

const MAGICAL = {
  institution: 'Bakery', resource: 'Grain', severity: 'vulnerable',
  impact: 'Supplied via magical trade infrastructure: teleportation imports replace road access.',
  affectedServices: ['Fresh bread', 'Meals'],
};
const SEVERED = {
  institution: 'Market square', resource: 'Trade access + grain', severity: 'critical',
  impact: 'No trade access. Running on existing stockpiles only.',
  affectedServices: ['Weekly market'],
};

const settlement = (deps, route = 'isolated') => ({
  config: { tradeRouteAccess: route },
  economicState: { tradeDependencies: deps },
});

describe('computeChainSets — magical infrastructure is supplied, not impaired', () => {
  test('a magically-supplied dep on an isolated route lands in magicalInfra, NOT impaired', () => {
    const { impaired, magicalInfra } = computeChainSets(settlement([MAGICAL]));
    expect(magicalInfra.has('Fresh bread')).toBe(true);
    expect(magicalInfra.has('Meals')).toBe(true);
    expect(magicalInfra.has('Bakery')).toBe(true);
    expect(impaired.has('Fresh bread')).toBe(false);
    expect(impaired.has('Bakery')).toBe(false);
  });

  test('the impaired count excludes magically-supplied services (the false-impaired fix)', () => {
    const { impaired } = computeChainSets(settlement([MAGICAL]));
    // Before the fix, an isolated route forced all three into `impaired`.
    expect(impaired.size).toBe(0);
  });

  test('a genuinely severed dep on an isolated route is still impaired', () => {
    const { impaired, magicalInfra } = computeChainSets(settlement([SEVERED]));
    expect(impaired.has('Weekly market')).toBe(true);
    expect(magicalInfra.has('Weekly market')).toBe(false);
  });

  test('magical supply takes precedence when a service is in BOTH a magical and a severed dep', () => {
    const both = [MAGICAL, { ...SEVERED, affectedServices: ['Fresh bread'] }];
    const { impaired, magicalInfra } = computeChainSets(settlement(both));
    expect(magicalInfra.has('Fresh bread')).toBe(true);
    expect(impaired.has('Fresh bread')).toBe(false);
  });

  test('the supply reason (Needs X …) is still surfaced for magical services', () => {
    const { depReasons } = computeChainSets(settlement([MAGICAL]));
    expect(depReasons.get('Fresh bread')?.resource).toBe('Grain');
    expect(depReasons.get('Fresh bread')?.impact).toMatch(/magical trade infrastructure/i);
  });
});
