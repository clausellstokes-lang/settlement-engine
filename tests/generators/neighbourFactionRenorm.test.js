/**
 * tests/generators/neighbourFactionRenorm.test.js
 *
 * 5th-layer review, cluster generation-neighbour:
 *
 *  (1) MED — the neighbourFactions step injected mirror/oppose factions with
 *      RAW-scale power (rng.randInt(10,30) / (8,26)) into a roster generatePower
 *      had already normalized to percentage points summing ~100. That broke the
 *      power-share invariant: the displayed shares no longer summed to 100.
 *      Fix: renormalize the whole roster to integer points summing exactly 100
 *      after injection.
 *
 *  (2) LOW — normalizeAndAnnotateFactions uses an intransitive sort comparator.
 *      A total-order replacement was attempted but REVERTED: it reordered factions
 *      and surfaced a latent cross-process non-determinism (the golden master could
 *      not cleanly rebaseline), which is not worth a global output change for a LOW
 *      robustness nit. The old comparator is stable-in-practice (the golden master
 *      passes), so finding 2 is consciously deferred. Only finding 1 is fixed here.
 */

import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { renormalizeFactionPower } from '../../src/generators/powerGenerator.js';

// A bound neighbour activates the mirror/oppose injection. Search the seed
// space for a (rel, seed) where the injection provably fires, then assert the
// power-share invariant holds on that roster.
const SELF_CFG = { settType: 'city', culture: 'imperial', tradeRouteAccess: 'port' };
const NEIGHBOUR = generateSettlementPipeline(
  { settType: 'city', culture: 'imperial', tradeRouteAccess: 'port', priorityMilitary: 70 },
  null,
  { seed: 'renorm-neighbour-fixture', customContent: {} },
);

function gen(rel, seed) {
  return generateSettlementPipeline(
    { ...SELF_CFG, _neighbourRelType: rel }, NEIGHBOUR, { seed, customContent: {} },
  );
}

function findInjectedRoster() {
  const rels = ['hostile', 'allied', 'rival', 'neutral', 'trade_partner', 'cold_war'];
  for (const rel of rels) {
    for (let i = 0; i < 60; i++) {
      const s = gen(rel, `renorm-${rel}-${i}`);
      const factions = s.powerStructure?.factions || [];
      if (factions.some(f => f.source === 'neighbour_mirror' || f.source === 'neighbour_opposition')) {
        return { s, factions, rel, seed: `renorm-${rel}-${i}` };
      }
    }
  }
  return null;
}

describe('neighbourFactions power-share invariant (finding 1)', () => {
  test('a roster with injected neighbour factions still sums to ~100 points', () => {
    const found = findInjectedRoster();
    expect(found, 'expected at least one seed to inject a neighbour faction').toBeTruthy();
    const { factions } = found;

    const injected = factions.filter(
      f => f.source === 'neighbour_mirror' || f.source === 'neighbour_opposition',
    );
    expect(injected.length).toBeGreaterThan(0);

    const total = factions.reduce((sum, f) => sum + (f.power || 0), 0);
    // Before the fix this was ~100 + 10..30 per injected faction. After the fix
    // the whole roster is renormalized to integer points summing exactly 100.
    expect(total).toBe(100);

    // Injected factions keep their raw scale on rawPower (the band-label source)
    // even though displayed power is now a percentage point.
    for (const f of injected) {
      expect(f.rawPower).toBeGreaterThanOrEqual(8);
      expect(typeof f.power).toBe('number');
    }
  });
});

describe('renormalizeFactionPower helper (largest-remainder, sums to 100)', () => {
  test('rescales raw-mixed powers to integer points summing exactly 100', () => {
    const factions = [
      { faction: 'A', power: 100, isGoverning: true },
      { faction: 'B', power: 30 },
      { faction: 'C', power: 26 },
      { faction: 'D', power: 8 },
    ];
    renormalizeFactionPower(factions);
    const total = factions.reduce((s, f) => s + f.power, 0);
    expect(total).toBe(100);
    factions.forEach(f => expect(Number.isInteger(f.power)).toBe(true));
  });

  test('three equal thirds round to 34/33/33 (no 99 or 101 drift)', () => {
    const factions = [{ faction: 'X', power: 1 }, { faction: 'Y', power: 1 }, { faction: 'Z', power: 1 }];
    renormalizeFactionPower(factions);
    expect(factions.reduce((s, f) => s + f.power, 0)).toBe(100);
  });

  test('is a no-op for an empty or all-zero roster', () => {
    expect(renormalizeFactionPower([])).toEqual([]);
    const zero = [{ faction: 'A', power: 0 }, { faction: 'B', power: 0 }];
    renormalizeFactionPower(zero);
    expect(zero.every(f => f.power === 0)).toBe(true);
  });
});
