import { describe, test, expect } from 'vitest';

import { distributeMigrants } from '../../src/domain/worldPulse/populationDynamics.js';

/**
 * Conservation invariant for the migrant split (audit finding). distributeMigrants
 * must never create or destroy population: the sum of the per-destination deltas
 * must equal `migrants` exactly, for ANY count — including the degenerate case the
 * old Math.max(1,…) floor mishandled (migrants < destinations), where it over-
 * assigned and forced the last delta negative (then filtered it out, leaking
 * phantom people). Unreachable on the live path today (migrants floored ≥ 11), so
 * this is the guard that keeps a future threshold change from silently re-opening it.
 */

// Four destinations, all equally desirable (empty pressureIdx ⇒ score 1.0, no
// relationship edges ⇒ weight 1.0), reachable from the source via graph edges.
function fourDestSnapshot() {
  const ids = ['d1', 'd2', 'd3', 'd4'];
  const byId = new Map(ids.map((id) => [id, { id, settlement: { population: 5000 } }]));
  const edges = ids.map((id) => ({ from: 'src', to: id }));
  return { byId, regionalGraph: { edges, channels: [] } };
}

const split = (migrants) =>
  distributeMigrants({ sourceId: 'src', migrants, snapshot: fourDestSnapshot(), pressureIdx: {}, mode: 'distributed', tick: 1 });

describe('distributeMigrants — population is conserved (no phantom people)', () => {
  test('the degenerate case the bug hit: 2 migrants over 4 destinations conserves (not 3)', () => {
    const { deltas } = split(2);
    const total = deltas.reduce((s, d) => s + d.delta, 0);
    expect(total).toBe(2);
    expect(deltas.every((d) => d.delta > 0)).toBe(true); // no zero/negative rows survive the filter
  });

  test.each([1, 2, 3, 4, 5, 8, 11, 25, 100])('sum(deltas) === migrants for migrants=%i', (migrants) => {
    const { deltas } = split(migrants);
    const total = deltas.reduce((s, d) => s + d.delta, 0);
    expect(total).toBe(migrants);
    expect(deltas.every((d) => Number.isInteger(d.delta) && d.delta > 0)).toBe(true);
  });

  test('the fixture actually distributes (not vacuous — multiple destinations receive)', () => {
    const { deltas } = split(25);
    expect(deltas.length).toBeGreaterThan(1);
  });
});
