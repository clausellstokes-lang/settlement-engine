/**
 * F5 unit 2 (2026-11-04): THE SOAK'S INSTITUTIONS BAND IS THE RULED I4 READING. Non-fabric houses
 * (`institutionalCatalog.js :: isFabricInstitution`) against `institutionBudget.js ::
 * expectedHousesAt` at each settlement's own population; outside = beyond ±40%; reported per tier
 * as the median of houses ÷ anchor and the share outside. The superseded 1–3 / 2–6 / 5–14 count
 * proposal no longer reads the record's raw row count.
 */
import { describe, expect, it } from 'vitest';
import { bandReadings, housesReading } from '../../scripts/audit/soak-review/bands.mjs';
import { fabricRows } from '../../src/data/institutionalCatalog.js';
import { expectedHousesAt } from '../../src/data/institutionBudget.js';

const FABRIC = fabricRows()[0].name;
const house = (k) => ({ name: `Hand-built house ${k}` });
/** A thorp of `pop` people with `houses` non-fabric houses and four fabric rows. */
const thorp = (pop, houses) => ({
  tier: 'thorp', population: pop,
  institutions: [...Array.from({ length: houses }, (_, k) => house(k)), ...Array.from({ length: 4 }, () => ({ name: FABRIC }))],
});
/** The aggregate's inputs for a set of records: the raw row-count field and the houses column. */
function inputs(records) {
  const counts = records.map((s) => s.institutions.length);
  const sorted = counts.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const fields = [{ path: 'chain.institutionCount', kind: 'numeric', byTier: { thorp: { median, p10: sorted[0], p90: sorted[sorted.length - 1] } } }];
  return { fields, valuesOf: (p) => (p === 'chain.institutionCount' ? counts : []), tierOf: records.map((s) => s.tier), houses: records.map(housesReading) };
}

describe('the houses reading of one record', () => {
  it('counts non-fabric houses and reads the anchor at the place\'s own population', () => {
    const r = housesReading(thorp(20, 4));
    expect(r.houses).toBe(4);
    expect(r.anchor).toBeCloseTo(expectedHousesAt(20), 2);
    expect(r.ratio).toBeCloseTo(4 / expectedHousesAt(20), 3);
  });
});

describe('the institutions band on the I4 rule', () => {
  it('thorps on the anchor curve, carrying fabric rows, are inside (rung 1B §3: median 1.00)', () => {
    const records = [12, 16, 20, 24, 28].map((pop) => thorp(pop, Math.round(expectedHousesAt(pop))));
    const { fields, valuesOf, tierOf, houses } = inputs(records);
    const { rows, outside } = bandReadings(fields, valuesOf, tierOf, houses);
    expect(outside).toEqual([]);
    const inst = rows.find((r) => r.band === 'institutions');
    expect(inst.byTier.thorp.medianInside).toBe(true);
    expect(inst.byTier.thorp.median).toBeGreaterThan(0.9);
    expect(inst.byTier.thorp.median).toBeLessThan(1.1);
    expect(inst.byTier.thorp.band).toEqual([0.6, 1.4]);
  });
  it('thorps at twice their anchor are outside, and the share counts every one', () => {
    const records = [12, 16, 20, 24, 28].map((pop) => thorp(pop, Math.round(2 * expectedHousesAt(pop))));
    const { fields, valuesOf, tierOf, houses } = inputs(records);
    const { outside } = bandReadings(fields, valuesOf, tierOf, houses);
    expect(outside).toHaveLength(1);
    expect(outside[0]).toMatchObject({ band: 'institutions', tier: 'thorp', low: 0.6, high: 1.4, outsideShare: 1 });
  });
});
