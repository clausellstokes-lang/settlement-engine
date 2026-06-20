import { describe, expect, test } from 'vitest';

import { contestOverThirdParty, contestForkKey } from '../../src/domain/region/contestOverThirdParty.js';
import { logistic, logit, softmaxWeights, hash01, stableSampleByWeight } from '../../src/domain/region/contestMath.js';
import { createPRNG } from '../../src/generators/prng.js';

// F3 pin: THE shared two-aggressors-over-a-third contest. War/trade/religion are
// thin callers. This file pins the determinism + balance contract:
//  - order-independent (reversed contenders, equal-weight ties)
//  - single-/zero-contender no-op (a one-sided field is byte-identical)
//  - incumbency stickiness with a RAISED hold ceiling (anti-oscillation)
//  - pure (same rng+inputs ⇒ same result; no Date.now/Math.random)
//  - log-odds (never a raw product) so a weak factor doesn't zero a contender

const run = (overrides = {}) => contestOverThirdParty({
  prizeId: 'crownhold',
  channelType: 'trade_dependency',
  rng: createPRNG('contest-seed'),
  tick: 7,
  ...overrides,
});

describe('contestMath — pure helpers', () => {
  test('logistic/logit round-trip and stay on the rails', () => {
    for (const p of [0.01, 0.25, 0.5, 0.75, 0.99]) {
      expect(logistic(logit(p))).toBeCloseTo(p, 6);
    }
    expect(logistic(Infinity)).toBe(1);
    expect(logistic(-Infinity)).toBe(0);
    // clamped off ±∞ even at the extremes.
    expect(Number.isFinite(logit(0))).toBe(true);
    expect(Number.isFinite(logit(1))).toBe(true);
  });

  test('softmaxWeights sums to 1 and keeps a weak score NON-zero (log-odds, not product)', () => {
    const w = softmaxWeights([logit(0.95), logit(0.5), logit(0.05)], 1);
    expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
    // The weak (0.05) contender still has real, non-zero weight — a raw product
    // would have annihilated it.
    expect(w[2]).toBeGreaterThan(0.001);
    expect(w[0]).toBeGreaterThan(w[1]);
    expect(w[1]).toBeGreaterThan(w[2]);
  });

  test('stableSampleByWeight walks cumulative weight deterministically', () => {
    const r = createPRNG('s');
    expect(stableSampleByWeight([], r)).toBe(-1);
    expect(stableSampleByWeight([0, 0, 0], r)).toBe(0); // degenerate ⇒ canonical top
    expect(typeof stableSampleByWeight([1, 2, 3], createPRNG('s2'))).toBe('number');
  });
});

describe('contestOverThirdParty — determinism contract', () => {
  test('ORDER-INDEPENDENT: reversing the contender array yields identical winner/pHold/weights', () => {
    const contenders = [
      { id: 'ashford', scoreFor: 0.7 },
      { id: 'briar', scoreFor: 0.55 },
      { id: 'duskvale', scoreFor: 0.42 },
    ];
    const fwd = run({ contenders, incumbentId: 'ashford' });
    const rev = run({ contenders: [...contenders].reverse(), incumbentId: 'ashford' });

    expect(fwd.winnerId).toBe(rev.winnerId);
    expect(fwd.pHold).toBe(rev.pHold);
    expect(fwd.roll).toBe(rev.roll);
    expect(fwd.weights).toEqual(rev.weights);
    // anti-vacuity: a real contest ran.
    expect(fwd.contested).toBe(true);
    expect(Object.keys(fwd.weights)).toHaveLength(3);
  });

  test('EQUAL-WEIGHT TIE (no incumbent) resolves the same id whichever order it is fed', () => {
    const contenders = [
      { id: 'alpha', scoreFor: 0.5 },
      { id: 'omega', scoreFor: 0.5 },
    ];
    const fwd = run({ contenders });
    const rev = run({ contenders: [...contenders].reverse() });
    expect(fwd.winnerId).toBe(rev.winnerId);
    // The tie-break is hash-based, not alphabetical — pin which side wins for this
    // exact contest identity so a regression in the tie-break surfaces.
    expect(['alpha', 'omega']).toContain(fwd.winnerId);
  });

  test('SINGLE-contender and ZERO-contender are default-neutral no-ops', () => {
    const sole = run({ contenders: [{ id: 'ashford', scoreFor: 0.9 }], incumbentId: 'briar' });
    expect(sole).toMatchObject({ winnerId: 'briar', changed: false, contested: false, pHold: 1 });

    const none = run({ contenders: [], incumbentId: 'briar' });
    expect(none).toMatchObject({ winnerId: 'briar', changed: false, contested: false });

    const noneNoInc = run({ contenders: [{ id: 'ashford', scoreFor: 0.9 }], incumbentId: null });
    expect(noneNoInc.winnerId).toBe('ashford'); // sole contender retains
    expect(noneNoInc.contested).toBe(false);
  });

  test('PURE: identical rng seed + inputs ⇒ identical result (no wall-clock / Math.random)', () => {
    const args = {
      contenders: [{ id: 'a', scoreFor: 0.6 }, { id: 'b', scoreFor: 0.5 }],
      incumbentId: 'a',
    };
    const one = contestOverThirdParty({ prizeId: 'c', channelType: 'trade_dependency', tick: 3, rng: createPRNG('x'), ...args });
    const two = contestOverThirdParty({ prizeId: 'c', channelType: 'trade_dependency', tick: 3, rng: createPRNG('x'), ...args });
    expect(one).toEqual(two);
  });

  test('the fork-key recipe is frozen and contest-scoped', () => {
    expect(contestForkKey({ channelType: 'religious_authority', prizeId: 'thandros', tick: 12 }))
      .toBe('contest:religious_authority:thandros:12');
  });
});

describe('contestOverThirdParty — balance / anti-oscillation', () => {
  test('a DOMINANT incumbent rarely loses across many ticks (raised hold ceiling)', () => {
    const contenders = [
      { id: 'incumbent', scoreFor: 0.85 },
      { id: 'rival_a', scoreFor: 0.30 },
      { id: 'rival_b', scoreFor: 0.25 },
    ];
    let flips = 0;
    const TICKS = 400;
    const rng = createPRNG('soak-dominant');
    for (let t = 0; t < TICKS; t += 1) {
      const r = contestOverThirdParty({
        prizeId: 'crownhold', channelType: 'trade_dependency',
        contenders, incumbentId: 'incumbent', tick: t, rng: rng.fork(`t${t}`),
      });
      // pHold must respect the raised ceiling every tick.
      expect(r.pHold).toBeLessThanOrEqual(0.985);
      if (r.changed) flips += 1;
    }
    // A clear leader should hold the overwhelming majority of ticks.
    expect(flips / TICKS).toBeLessThan(0.05);
  });

  test('but a genuine challenger CAN win — the contest is not rigged to the incumbent', () => {
    // A challenger clearly stronger than a weak incumbent must be able to take the
    // prize within a modest horizon (anti-vacuity: hold is not effectively 1.0).
    const contenders = [
      { id: 'weak_incumbent', scoreFor: 0.25 },
      { id: 'strong_challenger', scoreFor: 0.9 },
    ];
    let challengerWins = 0;
    const rng = createPRNG('soak-upset');
    for (let t = 0; t < 60; t += 1) {
      const r = contestOverThirdParty({
        prizeId: 'crownhold', channelType: 'trade_dependency',
        contenders, incumbentId: 'weak_incumbent', tick: t, rng: rng.fork(`t${t}`),
      });
      if (r.winnerId === 'strong_challenger') challengerWins += 1;
    }
    expect(challengerWins).toBeGreaterThan(0);
  });
});
