/**
 * legitimacyDefenseReconcile.test.js — [generators-pipeline-6].
 *
 * The assembly defense-readiness patch rewrites publicLegitimacy's label and
 * gov/crim multipliers when the readiness delta crosses a band, but the faction
 * powers had already been scaled by generatePowerStructure using the PROVISIONAL
 * multipliers — so the displayed multipliers contradicted the faction shares.
 * The fix re-derives faction powers from their preserved rawPower base with the
 * patched multipliers.
 *
 * Invariant pinned: the final faction powers are SELF-CONSISTENT with the final
 * publicLegitimacy multipliers — re-running applyLegitimacyMultipliers from
 * rawPower reproduces the exact same powers. Pre-fix this failed for every
 * band-crossing settlement (powers scaled by provisional, multipliers patched).
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { applyLegitimacyMultipliers } from '../../src/generators/factionDynamics.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

// Re-derive faction powers from rawPower with the settlement's FINAL legitimacy.
function rederivePowers(factions, publicLeg, tier) {
  const clone = factions.map((f) => ({ ...f }));
  for (const f of clone) if (typeof f.rawPower === 'number') f.power = f.rawPower;
  applyLegitimacyMultipliers(clone, publicLeg, tier);
  const m = {};
  for (const f of clone) m[f.faction] = f.power;
  return m;
}

describe('[generators-pipeline-6] faction powers agree with the patched legitimacy multipliers', () => {
  const CASES = [];
  // No neighbour bound (the corpus shape): factions are the base roster, all
  // carrying rawPower — so the invariant is exact.
  for (const tier of ['thorp', 'village', 'town', 'city', 'metropolis']) {
    for (let i = 0; i < 6; i++) CASES.push({ tier, seed: `p6-${tier}-${i}` });
  }

  test('every settlement is self-consistent (powers == re-derived from final legitimacy)', () => {
    let checked = 0;
    const failures = collectSeedFailures(CASES, ({ tier, seed }) => {
      const s = gen({ settType: tier, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, seed);
      const ps = s.powerStructure;
      if (!ps?.factions?.length || !ps.publicLegitimacy) return;
      checked++;
      const actual = {};
      for (const f of ps.factions) actual[f.faction] = f.power;
      expect(actual, `${tier}/${seed} powers vs re-derivation`).toEqual(rederivePowers(ps.factions, ps.publicLegitimacy, s.config.tier));
    });
    expect(checked).toBeGreaterThan(0); // non-vacuous
    expectNoSeedFailures(failures, 'every settlement is self-consistent with its final legitimacy multipliers');
  });

  // Non-corpus terrains/routes with weaker defense readiness (isolated/none) are
  // the ones most likely to cross a band — exercise them too.
  test('band-prone settlements (isolated/none routes) stay self-consistent', () => {
    for (const [terrainOverride, tradeRouteAccess] of [['forest', 'isolated'], ['plains', 'none'], ['desert', 'road']]) {
      for (let i = 0; i < 4; i++) {
        const s = gen({ settType: 'town', culture: 'germanic', terrainOverride, tradeRouteAccess }, `p6b-${terrainOverride}-${i}`);
        const ps = s.powerStructure;
        if (!ps?.factions?.length || !ps.publicLegitimacy) continue;
        const actual = {};
        for (const f of ps.factions) actual[f.faction] = f.power;
        expect(actual).toEqual(rederivePowers(ps.factions, ps.publicLegitimacy, s.config.tier));
      }
    }
  });
});
