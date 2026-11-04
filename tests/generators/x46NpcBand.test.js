/**
 * X-46 car 4 — THE NPC BAND (`docs/DESIGN_X46_SCALE_TRAIN.md` §5).
 *
 * Register VII's named-NPC mass band takes the owner's figures, and the sizing stage reads
 * the settlement's POPULATION inside its tier's band as one more tilt, so the named roster
 * follows the population while the band's edges stay where the table puts them. The car is
 * built DARK: `REGISTER_VII_SIGNATURE` is the owner's and is never flipped here; the lit
 * arms below reach Register VII through the config marker a lit signature would mint at the
 * birth boundary (`newSettlementDensityLaw`), never through the file.
 */
import { describe, it, expect } from 'vitest';
import { DENSITY_BANDS, TIER_ORDER } from '../../src/domain/density/densityBands.js';

describe('X-46 car 4 (i) — Register VII\'s mass band is the owner\'s figures', () => {
  it('reads 1–2 / 2–4 / 4–7 / 6–12 / 12–18 / 18–30, smallest tier first', () => {
    // The chair's proposal on the ledger (2026-11-02, not vetoed), the metropolis ceiling 30
    // kept from Register VII because "18-and-up" needs an edge the roll can clamp to.
    expect(TIER_ORDER.map(t => [DENSITY_BANDS[t].mass.min, DENSITY_BANDS[t].mass.max]))
      .toEqual([[1, 2], [2, 4], [4, 7], [6, 12], [12, 18], [18, 30]]);
  });

  it('every adjacent pair of bands touches or overlaps, so the overlap can agree within one person', () => {
    for (let i = 1; i < TIER_ORDER.length; i += 1) {
      const lower = DENSITY_BANDS[TIER_ORDER[i - 1]].mass;
      const upper = DENSITY_BANDS[TIER_ORDER[i]].mass;
      expect(upper.min - lower.max).toBeLessThanOrEqual(1);
    }
  });
});
