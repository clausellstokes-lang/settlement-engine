/**
 * townMapEdgeAnnotations.test.js — SM-5 (3) EDGE ANNOTATIONS.
 *
 * Labels the map's exits with the settlement's named neighbours — honestly: names +
 * relationship (the only town-scale data), NO invented distance. A real integer-weeks
 * resolver (the realm spatial-digest seam) is the ONLY way a travel number appears.
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildEdgeAnnotations } from '../../src/components/townMap/edgeAnnotations.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const model = () => buildTownMapModel(
  makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'edge-1' }),
  { layoutLawVersion: 2 },
);
const withNeighbors = (neighbors) => ({
  ...makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'edge-1' }),
  neighbors,
});

describe('edge annotations — named neighbours on the exits', () => {
  it('assigns named neighbours to exit roads in stable (name-sorted) order, honest labels', () => {
    const m = model();
    const s = withNeighbors([
      { name: 'Zephyr Hold', relationshipType: 'rival' },
      { name: 'Ashford', relationshipType: 'trade_partner' },
    ]);
    const ann = buildEdgeAnnotations(m, s);
    expect(ann.length).toBe(2); // 2 neighbours, ≤ road count
    // name-sorted: Ashford before Zephyr Hold
    expect(ann.map((a) => a.neighborName)).toEqual(['Ashford', 'Zephyr Hold']);
    expect(ann[0].relationshipLabel).toBe('trade partner');
    expect(ann[1].relationshipLabel).toBe('a rival');
    // NO invented travel number without a resolver
    expect(ann[0].travelLabel).toBeNull();
    // anchored to a real road edge point, nudged inward (inside the 0..1000 box)
    for (const a of ann) {
      expect(a.x).toBeGreaterThanOrEqual(0);
      expect(a.x).toBeLessThanOrEqual(1000);
      expect(['start', 'middle', 'end']).toContain(a.align);
      expect(typeof a.roadId).toBe('string');
    }
  });

  it('caps at the number of exit roads (extra neighbours are not map exits)', () => {
    const m = model();
    const many = Array.from({ length: 8 }, (_, i) => ({ name: `Town ${String.fromCharCode(65 + i)}`, relationshipType: 'neutral' }));
    const ann = buildEdgeAnnotations(m, withNeighbors(many));
    expect(ann.length).toBe(m.frame.roads.length); // capped
  });

  it('a real integer-weeks resolver (the digest seam) is the ONLY source of a travel number', () => {
    const m = model();
    const s = withNeighbors([{ name: 'Ashford', relationshipType: 'allied' }]);
    const ann = buildEdgeAnnotations(m, s, { weeksFor: () => 3 });
    expect(ann[0].travelLabel).toBe('≈3 weeks away');
    // a resolver that returns null/garbage invents nothing
    expect(buildEdgeAnnotations(m, s, { weeksFor: () => null })[0].travelLabel).toBeNull();
    expect(buildEdgeAnnotations(m, s, { weeksFor: () => 1 })[0].travelLabel).toBe('≈1 week away');
  });

  it('no neighbours or no roads ⇒ [] (never throws)', () => {
    const m = model();
    expect(buildEdgeAnnotations(m, withNeighbors([]))).toEqual([]);
    expect(buildEdgeAnnotations(m, {})).toEqual([]);
    expect(buildEdgeAnnotations(m, null)).toEqual([]);
    expect(buildEdgeAnnotations(null, withNeighbors([{ name: 'X' }]))).toEqual([]);
    // unnamed neighbours are ignored
    expect(buildEdgeAnnotations(m, withNeighbors([{ relationshipType: 'rival' }]))).toEqual([]);
  });
});
