import { describe, expect, test } from 'vitest';

import { computeAllyRelief, resolveSiegeVerdict } from '../../src/domain/worldPulse/warDeployment.js';
import { createPRNG } from '../../src/generators/prng.js';

/**
 * Ally defense P3 (flag-gated, default OFF): a besieged town's allied/vassal/patron
 * neighbours — if not themselves under siege — send relief that bolsters its defense in
 * the siege verdict. Proves: (1) computeAllyRelief reads support edges and sums a fraction
 * of each free ally's home defense (a besieged ally sends nothing); (2) the relief lowers
 * the fall probability; (3) reliefBonus=0 (the flag-off path) is byte-identical.
 */
function snapshotWith(edges) {
  const byId = new Map([['def', {}], ['ally', {}], ['ally2', {}], ['foe', {}]]);
  return { byId, regionalGraph: { edges }, worldState: { relationshipStates: {} } };
}
const cap = (homeDefense) => () => ({ offensive: 20, homeDefense, facets: {} });

describe('computeAllyRelief', () => {
  test('sums a fraction of each allied/vassal neighbour home defense', () => {
    const snap = snapshotWith([
      { from: 'ally', to: 'def', relationshipType: 'allied' },
      { from: 'def', to: 'ally2', relationshipType: 'vassal' },
      { from: 'foe', to: 'def', relationshipType: 'hostile' }, // not a support edge
    ]);
    const capFor = (id) => ({ ally: 50, ally2: 100, foe: 999 }[id] !== undefined ? { homeDefense: { ally: 50, ally2: 100 }[id] || 0 } : { homeDefense: 0 });
    const relief = computeAllyRelief(snap, 'def', capFor, new Set());
    expect(relief).toBeCloseTo((50 + 100) * 0.4, 5); // 60; the hostile foe contributes nothing
  });

  test('an ally that is itself besieged sends NOTHING', () => {
    const snap = snapshotWith([{ from: 'ally', to: 'def', relationshipType: 'allied' }]);
    const capFor = () => ({ homeDefense: 50 });
    expect(computeAllyRelief(snap, 'def', capFor, new Set(['ally']))).toBe(0);
    expect(computeAllyRelief(snap, 'def', capFor, new Set())).toBeCloseTo(20, 5);
  });

  test('a friendless target gets 0', () => {
    expect(computeAllyRelief(snapshotWith([]), 'def', cap(50), new Set())).toBe(0);
  });
});

describe('relief bolsters the siege verdict', () => {
  const verdict = (reliefBonus) => resolveSiegeVerdict({
    targetId: 'def', besiegers: ['atk'],
    capacityFor: (id) => (id === 'atk' ? { offensive: 60, homeDefense: 30, facets: {} } : { offensive: 30, homeDefense: 40, facets: {} }),
    effectiveStrengthFor: (id) => (id === 'atk' ? 60 : null),
    defenderItem: { name: 'Def', settlement: {} },
    rng: createPRNG('ally-seed'), tick: 100, siegeAge: 0,
    defenderReliefBonus: reliefBonus,
  });

  test('relief lowers the fall probability (allies hold at the walls)', () => {
    expect(verdict(20).pFall).toBeLessThan(verdict(0).pFall);
  });

  test('reliefBonus 0 is the flag-off path — identical to omitting it', () => {
    const withZero = verdict(0).pFall;
    const omitted = resolveSiegeVerdict({
      targetId: 'def', besiegers: ['atk'],
      capacityFor: (id) => (id === 'atk' ? { offensive: 60, homeDefense: 30, facets: {} } : { offensive: 30, homeDefense: 40, facets: {} }),
      effectiveStrengthFor: (id) => (id === 'atk' ? 60 : null),
      defenderItem: { name: 'Def', settlement: {} }, rng: createPRNG('ally-seed'), tick: 100, siegeAge: 0,
    }).pFall;
    expect(withZero).toBe(omitted);
  });
});
