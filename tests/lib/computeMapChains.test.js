/**
 * computeMapChains.test.js — chain-edge id resolution (lib#16).
 *
 * Edges are resolved by settlement id via the pair's direction, NOT by a
 * last-wins display-name map. This guards against two placed settlements that
 * share a display name producing self-edges or misrouted overlay lines.
 */
import { describe, it, expect } from 'vitest';
import { computeMapChains } from '../../src/lib/computeMapChains.js';

// A producer of iron ore and a consumer with a smithy → one 'iron' edge.
const producer = (id, name) => ({
  id,
  name,
  settlement: { name, config: { nearbyResources: ['iron_ore'] }, institutions: [] },
});
const consumer = (id, name) => ({
  id,
  name,
  settlement: { name, config: { nearbyResources: [] }, institutions: [{ id: 'smithy', name: 'Smithy' }] },
});

const placements = (...ids) =>
  Object.fromEntries(ids.map((id, i) => [`slot${i}`, { settlementId: id }]));

describe('computeMapChains', () => {
  it('routes an edge by settlement id from producer to consumer', () => {
    const saves = [producer('p1', 'Oreton'), consumer('c1', 'Forgeburg')];
    const out = computeMapChains(saves, placements('p1', 'c1'));
    expect(out).toHaveLength(1);
    expect(out[0].good).toBe('iron');
    expect(out[0].path).toEqual(['p1', 'c1']); // producer → consumer, by id
  });

  it('does NOT misroute or self-edge when two settlements share a display name', () => {
    // Both named "Duplicate" but distinct ids. A name-keyed map would collapse
    // them to one id and produce a self-edge (p1→p1) or drop the edge.
    const saves = [producer('p1', 'Duplicate'), consumer('c1', 'Duplicate')];
    const out = computeMapChains(saves, placements('p1', 'c1'));
    expect(out).toHaveLength(1);
    // Endpoints are distinct ids in producer→consumer order — never a self-edge.
    expect(out[0].path).toEqual(['p1', 'c1']);
    expect(out[0].path[0]).not.toBe(out[0].path[1]);
  });

  it('returns [] when fewer than two settlements are placed', () => {
    const saves = [producer('p1', 'Oreton'), consumer('c1', 'Forgeburg')];
    expect(computeMapChains(saves, placements('p1'))).toEqual([]);
  });
});
