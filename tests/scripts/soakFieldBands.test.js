/**
 * tests/scripts/soakFieldBands.test.js — the per-field distributions by tier with the owner's
 * bands marked (lane SOAK-2, unit 4; docs/DESIGN_X46_SCALE_TRAIN.md §1: the owner's population
 * table, and the institution and named-NPC budgets on the ledger).
 *
 * scripts/audit/soak-review/bands.mjs :: bandReadings marks every field a band covers, says
 * per tier whether its median sits inside, and counts the settlements outside.
 */
import { describe, expect, it } from 'vitest';

import { FIELD_BANDS, bandReadings } from '../../scripts/audit/soak-review/bands.mjs';

describe('soak field bands', () => {
  it('the owner\'s population table and the named-NPC budget are the field bands, on both the walked and the chain paths', () => {
    expect(FIELD_BANDS.population.bands.thorp).toEqual([5, 30]);
    expect(FIELD_BANDS.population.bands.metropolis).toEqual([15000, Infinity]);
    // F5 unit 2 (2026-11-04): the institutions count band (1–3 / 2–6 / 5–14 …) was the superseded
    // proposal; ruling I4's houses ÷ anchor reading replaced it (tests/audit/soakReviewHousesBand.test.js).
    expect(FIELD_BANDS.institutions).toBeUndefined();
    expect(FIELD_BANDS.npcs.bands.city).toEqual([12, 18]);
    expect(FIELD_BANDS.population.paths).toEqual(['population', 'chain.population']);
  });

  it('a median outside its band is listed with its tier; one inside is not; an open top never fails high', () => {
    const tierOf = ['thorp', 'thorp', 'thorp', 'metropolis', 'metropolis', 'metropolis'];
    const values = { population: [10, 40, 50, 20000, 90000, 15500], 'chain.npcCount': [1, 2, 2, 25, 30, 40] };
    const fields = [
      { path: 'population', kind: 'numeric', byTier: { thorp: { median: 40, p10: 10, p90: 50 }, metropolis: { median: 20000, p10: 15500, p90: 90000 } } },
      { path: 'chain.npcCount', kind: 'numeric', byTier: { thorp: { median: 2, p10: 1, p90: 2 }, metropolis: { median: 30, p10: 25, p90: 40 } } },
      { path: 'unbanded.field', kind: 'numeric', byTier: { thorp: { median: 999 } } },
    ];
    const { rows, outside } = bandReadings(fields, (p) => values[p], tierOf);
    expect(rows.map((r) => r.path)).toEqual(['population', 'chain.npcCount']);
    const pop = rows.find((r) => r.path === 'population');
    expect(pop.byTier.thorp).toMatchObject({ median: 40, band: [5, 30], medianInside: false, outsideShare: 0.667, n: 3 });
    expect(pop.byTier.metropolis).toMatchObject({ medianInside: true, outsideShare: 0 });
    expect(outside).toEqual([{ path: 'population', band: 'population', tier: 'thorp', median: 40, low: 5, high: 30, outsideShare: 0.667 }]);
  });
});
