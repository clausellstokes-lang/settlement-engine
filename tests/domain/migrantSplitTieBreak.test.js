/**
 * migrantSplitTieBreak.test.js — the migrant destination ranking is order-independent.
 *
 * Regression pin for the low-severity finding: distributeMigrants sorted candidate
 * destinations by weighted score with NO tie-break, so two equal-score destinations
 * ranked by candidateDestinations' Set-build (edge insertion) order. A refactor that
 * reordered edges/channels would silently perturb the split and break the golden master.
 * The fix appends a codepoint tie-break on id, so equal-score destinations rank by id.
 */
import { describe, expect, test } from 'vitest';

import { distributeMigrants } from '../../src/domain/worldPulse/populationDynamics.js';

// Four equally-desirable destinations (empty pressureIdx ⇒ score 1.0, no edges ⇒
// weight 1.0), presented to the splitter in an arbitrary insertion order.
function snapshotOrdered(order) {
  const byId = new Map(order.map((id) => [id, { id, settlement: { population: 5000 } }]));
  const edges = order.map((id) => ({ from: 'src', to: id }));
  return { byId, regionalGraph: { edges, channels: [] } };
}

const concentrated = (order) =>
  distributeMigrants({ sourceId: 'src', migrants: 100, snapshot: snapshotOrdered(order), pressureIdx: {}, mode: 'concentrated', tick: 1 });

describe('distributeMigrants — equal-score ranking is deterministic (codepoint tie-break)', () => {
  test('the lowest id wins the concentrated destination regardless of insertion order', () => {
    const a = concentrated(['d3', 'd1', 'd4', 'd2']);
    const b = concentrated(['d2', 'd4', 'd1', 'd3']);
    // Without the tie-break, `a` would concentrate on d3 and `b` on d2 (Set-build order).
    expect(a.deltas[0].saveId).toBe('d1');
    expect(b.deltas[0].saveId).toBe('d1');
    expect(a.deltas).toEqual(b.deltas);
  });

  test('the distributed split is also insertion-order-independent', () => {
    const a = distributeMigrants({ sourceId: 'src', migrants: 97, snapshot: snapshotOrdered(['d3', 'd1', 'd4', 'd2']), pressureIdx: {}, mode: 'distributed', tick: 1 });
    const b = distributeMigrants({ sourceId: 'src', migrants: 97, snapshot: snapshotOrdered(['d4', 'd2', 'd3', 'd1']), pressureIdx: {}, mode: 'distributed', tick: 1 });
    const norm = (r) => [...r.deltas].sort((x, y) => (x.saveId < y.saveId ? -1 : 1));
    expect(norm(a)).toEqual(norm(b));
  });
});
