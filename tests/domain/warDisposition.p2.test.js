import { describe, expect, test } from 'vitest';

import { computeWarSentiment } from '../../src/domain/worldPulse/disposition.js';
import { resolveCoupVerdict } from '../../src/domain/rulingPower.js';
import { createPRNG } from '../../src/generators/prng.js';

/**
 * War-disposition political flywheel P2 (flag-gated, default OFF): an exhausting/unpopular
 * war shifts the ruling seat's coup hold-chance, so an overextended aggressor can lose on
 * its own home front. Proves: (1) computeWarSentiment drags negative as war-exhaustion
 * rises and is bounded; (2) resolveCoupVerdict folds a negative war sentiment into a LOWER
 * hold-chance (more couplable); (3) warSentimentAdj=0 (the flag-off path) is byte-identical.
 */
const warlikeTown = () => ({
  name: 'Junta', powerStructure: {
    publicLegitimacy: { score: 50 },
    factions: [
      { faction: 'War Council', category: 'military', power: 40, isGoverning: true },
      { faction: 'Merchant League', category: 'economy', power: 35 },
      { faction: 'Temple', category: 'religious', power: 25 },
    ],
  },
  config: { government: 'Military Junta' },
  npcs: [
    { id: 'n1', name: 'Warlord Grax', importance: 'key', temperament: 'ruthless' },
    { id: 'n2', name: 'Reeve Ilsa', importance: 'notable' },
  ],
});

describe('computeWarSentiment', () => {
  test('war-exhaustion drags sentiment DOWN (a souring war erodes the regime)', () => {
    const s = warlikeTown();
    expect(computeWarSentiment(s, 0.9)).toBeLessThan(computeWarSentiment(s, 0));
  });

  test('bounded to [-1, 1]; leaderless + exhausted is negative', () => {
    expect(computeWarSentiment(warlikeTown(), 1)).toBeGreaterThanOrEqual(-1);
    expect(computeWarSentiment(warlikeTown(), 0)).toBeLessThanOrEqual(1);
    // No leadership signal ⇒ appetite 0; exhaustion still pulls it negative.
    expect(computeWarSentiment({}, 0.5)).toBeCloseTo(-0.75, 5);
    expect(computeWarSentiment({}, 0)).toBe(0);
  });
});

describe('resolveCoupVerdict folds war sentiment into the hold-chance', () => {
  const verdictWith = (adj) => resolveCoupVerdict({
    settlement: warlikeTown(), rng: createPRNG('coup-x'), severity: 0.6, warSentimentAdj: adj,
  });

  test('there is a real contest (the fixture produces challengers, not a vacuous pHold=1)', () => {
    expect(verdictWith(0).challengers.length).toBeGreaterThan(0);
  });

  test('a NEGATIVE war sentiment lowers the seat hold-chance (a sour war ⇒ more couplable)', () => {
    const sour = verdictWith(-0.3).pHold;
    const neutral = verdictWith(0).pHold;
    expect(sour).toBeLessThan(neutral);
  });

  test('warSentimentAdj = 0 is the flag-off path — identical to omitting it', () => {
    const withZero = resolveCoupVerdict({ settlement: warlikeTown(), rng: createPRNG('c'), severity: 0.6, warSentimentAdj: 0 }).pHold;
    const omitted = resolveCoupVerdict({ settlement: warlikeTown(), rng: createPRNG('c'), severity: 0.6 }).pHold;
    expect(withZero).toBe(omitted);
  });
});
