import { describe, expect, test } from 'vitest';

import { rollCandidates, volatilityMultiplier, VOLATILITY_MULTIPLIERS } from '../../src/domain/worldPulse/index.js';

const candidates = Array.from({ length: 5 }, (_, i) => ({
  id: `c${i}`,
  applyMode: 'auto',
  candidateType: 'test',
  severity: 0.5,
  probability: 0.4,
}));

// Constant roll so the only variable is the volatility multiplier.
const rng = { random: () => 0.5 };

describe('world volatility dial', () => {
  test('multiplier ordering: calm < normal < turbulent, normal is 1.0', () => {
    expect(volatilityMultiplier('normal')).toBe(1.0);
    expect(volatilityMultiplier('calm')).toBeLessThan(volatilityMultiplier('normal'));
    expect(volatilityMultiplier('turbulent')).toBeGreaterThan(volatilityMultiplier('normal'));
    expect(volatilityMultiplier('bogus')).toBe(1.0); // safe fallback
  });

  test('turbulent passes more candidates than normal/calm at the same roll', () => {
    const calm = rollCandidates(candidates, rng, { maxAuto: 10, volatility: VOLATILITY_MULTIPLIERS.calm });
    const normal = rollCandidates(candidates, rng, { maxAuto: 10, volatility: VOLATILITY_MULTIPLIERS.normal });
    const turbulent = rollCandidates(candidates, rng, { maxAuto: 10, volatility: VOLATILITY_MULTIPLIERS.turbulent });

    // roll 0.5 vs prob 0.4: calm(0.24) & normal(0.40) fail; turbulent(0.64) passes.
    expect(calm.selected.length).toBe(0);
    expect(normal.selected.length).toBe(0);
    expect(turbulent.selected.length).toBe(5);
  });

  test('omitting volatility is identical to normal (back-compat)', () => {
    const without = rollCandidates(candidates, rng, { maxAuto: 10 });
    const normal = rollCandidates(candidates, rng, { maxAuto: 10, volatility: 1.0 });
    expect(without.selected.length).toBe(normal.selected.length);
  });
});
