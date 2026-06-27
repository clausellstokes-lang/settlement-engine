/**
 * factionPowerSum.test.js — faction power is a SHARE (a 100-point pie) and must
 * sum to exactly 100 across ALL tiers, after applyLegitimacyMultipliers.
 *
 * Regression for the audit finding: the legitimacy multipliers in
 * factionDynamics.applyLegitimacyMultipliers scaled each faction's power but
 * never renormalised, leaking the roster total off 100 — worst on small rosters
 * where a penalised governing faction is a large share (a thorp council summing
 * to ~85%). The fix renormalises (largest-remainder) after the multipliers,
 * preserving the relative legitimacy shift while restoring the share invariant
 * the rest of the system (renormalizeFactionPower, neighbourFactions) enforces.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

describe('faction power sums to exactly 100 across all tiers', () => {
  for (const tier of TIERS) {
    it(`${tier}: every non-empty faction roster sums to 100`, () => {
      for (let i = 0; i < 25; i++) {
        const s = generateSettlementPipeline({ settType: tier, culture: 'germanic' }, null, { seed: `fps-${tier}-${i}`, customContent: {} });
        const facs = s.powerStructure?.factions || [];
        if (!facs.length) continue;
        const sum = facs.reduce((t, f) => t + (Number(f.power) || 0), 0);
        expect(sum, `${tier} seed ${i} (n=${facs.length})`).toBe(100);
      }
    });
  }

  it('rawPower is preserved for the raw→effective display (legitimacy shift stays visible)', () => {
    // A low-legitimacy settlement should still show the governing faction losing
    // RELATIVE share (power < rawPower), just within a roster that sums to 100.
    let sawShift = false;
    for (let i = 0; i < 40 && !sawShift; i++) {
      const s = generateSettlementPipeline({ settType: 'town', culture: 'germanic' }, null, { seed: `fps-shift-${i}`, customContent: {} });
      const facs = s.powerStructure?.factions || [];
      if (facs.some(f => Number.isFinite(f.rawPower) && f.rawPower !== f.power)) sawShift = true;
    }
    expect(sawShift).toBe(true);
  });
});
