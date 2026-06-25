/**
 * tests/utils/graphLayout.determinism.test.js
 *
 * forceLayout claims "the same graph produces the same layout across runs (no
 * jitter between re-renders)". A Math.random() nudge in the coincident-node
 * branch broke that: when two seeded nodes landed on the same point (or any
 * input collapses ≥9 nodes onto each other), each render perturbed them
 * differently, so the campaign relationship-map PDF was NON-deterministic.
 *
 * These tests pin the contract: identical input ⇒ byte-identical positions,
 * even when nodes start coincident (the branch that used to call Math.random).
 */
import { describe, test, expect } from 'vitest';
import { forceLayout, autoLayout } from '../../src/utils/graphLayout.js';

// 9 nodes forces the force-directed path (circularLayout handles ≤8).
function nineNodes() {
  return Array.from({ length: 9 }, (_, i) => ({ id: `n${i}`, label: `Node ${i}` }));
}
function ringEdges(nodes) {
  return nodes.map((node, i) => ({ from: node.id, to: nodes[(i + 1) % nodes.length].id }));
}

describe('forceLayout — deterministic relationship-map layout', () => {
  test('same graph produces byte-identical positions across repeated runs', () => {
    const nodes = nineNodes();
    const edges = ringEdges(nodes);

    const a = forceLayout(nodes, edges);
    const b = forceLayout(nodes, edges);

    expect(b).toEqual(a);
    // And not a degenerate all-same-point result.
    const xs = new Set(a.map(p => p.x.toFixed(6)));
    expect(xs.size).toBeGreaterThan(1);
  });

  test('coincident nodes (the former Math.random branch) still lay out deterministically', () => {
    // 's48' and 's200' are a deterministic seed COLLISION: forceLayout seeds
    // initial positions from `${id}-x` / `${id}-y`, and these two ids hash to the
    // identical start point (0.378, 0.379). On iteration 0 their separation is 0,
    // so the dist < 0.001 branch fires — the exact path that used Math.random()
    // and made the layout non-reproducible. With the deterministic offset, two
    // renders of the same graph must be byte-identical.
    const colliding = [{ id: 's48' }, { id: 's200' }];
    const filler = Array.from({ length: 7 }, (_, i) => ({ id: `f${i}` }));
    const nodes = [...colliding, ...filler]; // 9 nodes -> force-directed path
    const edges = ringEdges(nodes);

    const first = forceLayout(nodes, edges);
    const second = forceLayout(nodes, edges);
    expect(second).toEqual(first);

    // The two colliding nodes must have been pushed APART (the branch did its
    // job), not left stacked.
    const byId = new Map(first.map(p => [p.id, p]));
    const pa = byId.get('s48'), pb = byId.get('s200');
    expect(Math.hypot(pa.x - pb.x, pa.y - pb.y)).toBeGreaterThan(0);
  });

  test('autoLayout (the PDF entry point) is reproducible for 9+ settlements', () => {
    const nodes = nineNodes();
    const edges = ringEdges(nodes);
    expect(autoLayout(nodes, edges)).toEqual(autoLayout(nodes, edges));
  });
});
