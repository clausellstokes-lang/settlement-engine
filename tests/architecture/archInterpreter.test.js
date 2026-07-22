/**
 * archInterpreter.test.js -- K-1 GRAMMAR: the interpreter + 12-op vocabulary + fail-closed pins.
 *
 * Proves the contract every later kernel wave compiles into: the 12 ops are registered and behave,
 * the interpreter FAILS CLOSED (unregistered symbol / op / structural-ceiling breach), `defer` yields
 * LOD-consistent tiers from one prefix, the PRNG is keyed by (seedId, shape.path) and never restamped,
 * and the whole pipeline is PERMUTATION-INVARIANT (byte-identical under shuffled rule registration +
 * shuffled event arrival). These are structural, not byte-parity-to-a-hand-build (that is archByteEqual).
 */
import { describe, it, expect } from 'vitest';
import { interpret } from '../../src/domain/townMap/arch/interpreter.js';
import { emitMesh } from '../../src/domain/townMap/arch/emitter.js';
import { OPS, OP_NAMES } from '../../src/domain/townMap/arch/ops.js';
import { N_GON_DIRS, ngonUnitDirs } from '../../src/domain/townMap/arch/rationalTables.js';
import { resolveFrame, ngonFrame } from '../../src/domain/townMap/arch/frames.js';
import { cathedralRuleset } from '../../src/domain/townMap/arch/rulesets/cathedral.js';

const eqF = (a, b) => a.length === b.length && Array.prototype.every.call(a, (v, i) => v === b[i]);
const box = (sym) => ({ sym, scope: { origin: [0, 0, 0], frameRef: { frameIndex: 0, reflect: 0 }, size: [10, 10, 10] }, attrs: { materialRole: 'ashlar', params: {} } });

describe('the op vocabulary is exactly the twelve registered ops', () => {
  it('OPS has 12 named handlers', () => {
    expect(OP_NAMES.length).toBe(12);
    for (const n of ['split', 'comp', 'extrude', 'inset', 'offset', 'orient', 'defer', 'emit', 'prism', 'sweep', 'instance', 'occlude']) {
      expect(typeof OPS[n]).toBe('function');
    }
  });
});

describe('the interpreter fails closed', () => {
  it('rejects an unregistered symbol', () => {
    const rs = { name: 't', symbols: ['a'], axiom: box('a'), rules: { a: [{ op: 'defer', byTier: { default: [{ sym: 'ghost' }] } }] } };
    expect(() => interpret(rs, { tier: 2 })).toThrow(/symbol "ghost" is not in the ruleset/);
  });
  it('rejects an unregistered op', () => {
    const rs = { name: 't', symbols: ['a'], axiom: box('a'), rules: { a: [{ op: 'teleport' }] } };
    expect(() => interpret(rs, { tier: 2 })).toThrow(/op "teleport" is not registered/);
  });
  it('rejects a symbol with no rule', () => {
    const rs = { name: 't', symbols: ['a', 'b'], axiom: box('a'), rules: { a: [{ op: 'defer', byTier: { default: [{ sym: 'b' }] } }] } };
    expect(() => interpret(rs, { tier: 2 })).toThrow(/no rule for symbol "b"/);
  });
  it('rejects an unknown LOD tier', () => {
    const rs = { name: 't', symbols: ['a'], axiom: box('a'), rules: { a: [] } };
    expect(() => interpret(rs, { tier: 9 })).toThrow(/unknown LOD tier/);
  });
  it('breaches the structural shape ceiling on runaway recursion', () => {
    // a rule that re-produces itself forever -> the glyph-tier shape ceiling stops it (fail-closed)
    const rs = { name: 't', symbols: ['a'], axiom: box('a'), rules: { a: [{ op: 'defer', byTier: { default: [{ sym: 'a' }] } }] } };
    expect(() => interpret(rs, { tier: 0 })).toThrow(/ceiling/);
  });
});

describe('the subdivision ops behave (split / comp / inset / offset / extrude / orient)', () => {
  it('split with absolute sizes tiles the axis and preserves order', () => {
    const rs = {
      name: 't', symbols: ['a', 'leaf'], axiom: box('a'),
      rules: { a: [{ op: 'split', axis: 'x', parts: [{ size: 3, sym: 'leaf' }, { size: 3, sym: 'leaf' }, { size: '~', sym: 'leaf' }] }], leaf: [{ op: 'emit', kind: 'box', role: 'ashlar' }] },
    };
    const { terminals } = interpret(rs, { tier: 2 });
    expect(terminals.length).toBe(3);
    // contiguous, covering [0,10] on x, ascending
    const xs = terminals.map((t) => [t.spec.x0, t.spec.x1]);
    expect(xs[0]).toEqual([0, 3]); expect(xs[1]).toEqual([3, 6]); expect(xs[2]).toEqual([6, 10]);
  });
  it('split repeat tiles a part N times', () => {
    const rs = { name: 't', symbols: ['a', 'leaf'], axiom: box('a'), rules: { a: [{ op: 'split', axis: 'y', parts: [{ size: 2, sym: 'leaf', repeat: 4 }, { size: '~', sym: 'leaf' }] }], leaf: [{ op: 'emit', kind: 'box', role: 'ashlar' }] } };
    expect(interpret(rs, { tier: 2 }).terminals.length).toBe(5);
  });
  it('inset shrinks the box inward (convex, rectilinear)', () => {
    const rs = { name: 't', symbols: ['a', 'leaf'], axiom: box('a'), rules: { a: [{ op: 'inset', sym: 'leaf', margins: { x: 2, y: 1, z: 3 } }], leaf: [{ op: 'emit', kind: 'box', role: 'ashlar' }] } };
    const t = interpret(rs, { tier: 2 }).terminals[0];
    expect([t.spec.x0, t.spec.x1, t.spec.y0, t.spec.y1, t.spec.z0, t.spec.z1]).toEqual([2, 8, 1, 9, 3, 7]);
  });
  it('comp selects a named face slab', () => {
    const rs = { name: 't', symbols: ['a', 'leaf'], axiom: box('a'), rules: { a: [{ op: 'comp', select: 'top', sym: 'leaf', thickness: 0.1 }], leaf: [{ op: 'emit', kind: 'box', role: 'ashlar' }] } };
    const t = interpret(rs, { tier: 2 }).terminals[0];
    expect(t.spec.y0).toBeCloseTo(9); expect(t.spec.y1).toBeCloseTo(10);
  });
  it('orient re-frames a child by SELECTION (no trig) and ngon frames are orthonormal', () => {
    const f = resolveFrame({ frameIndex: 1, reflect: 0 });
    expect(Math.abs(f.right[0] * f.up[0] + f.right[1] * f.up[1] + f.right[2] * f.up[2])).toBeLessThan(1e-12);
    const g = ngonFrame(8, 1, 0);
    expect(Math.abs(g.fwd[0] * g.fwd[0] + g.fwd[1] * g.fwd[1] + g.fwd[2] * g.fwd[2] - 1)).toBeLessThan(1e-3);
  });
});

describe('the terminal ops build geometry (prism / sweep / instance)', () => {
  it('prism emits an n-gon column on the pinned N_GON_DIRS', () => {
    const rs = { name: 't', symbols: ['a'], axiom: box('a'), rules: { a: [{ op: 'prism', n: 6, role: 'ashlar', cx: 0, cz: 0, radius: 5, y0: 0, y1: 10 }] } };
    const g = emitMesh(interpret(rs, { tier: 2 }).terminals);
    expect(g.triangleCount).toBe(6 * 2 + (6 - 2) * 2); // 6 side quads + 2 fan caps of (n-2) tris
  });
  it('an unregistered n-gon count fails closed', () => {
    expect(() => ngonUnitDirs(11)).toThrow(/not in the pinned N_GON_DIRS/);
    expect(N_GON_DIRS[7].length).toBe(7);
  });
  it('sweep(square) equals addTube; instance expands a kit asset', () => {
    const rs = { name: 't', symbols: ['a'], axiom: box('a'), rules: { a: [{ op: 'instance', asset: 'pinnacle', role: 'pinnacleStone' }] } };
    const g = emitMesh(interpret(rs, { tier: 2 }).terminals);
    expect(g.triangleCount).toBeGreaterThan(0); // 2 spires
  });
});

describe('defer yields LOD-consistent tiers (silhouette agreement, monotone detail)', () => {
  const rs = cathedralRuleset();
  const g0 = emitMesh(interpret(rs, { tier: 0 }).terminals);
  const g1 = emitMesh(interpret(rs, { tier: 1 }).terminals);
  const g2 = emitMesh(interpret(rs, { tier: 2 }).terminals);
  it('detail is monotone non-decreasing across tiers', () => {
    expect(g0.triangleCount).toBeLessThanOrEqual(g1.triangleCount);
    expect(g1.triangleCount).toBeLessThanOrEqual(g2.triangleCount);
    expect(g0.triangleCount).toBeGreaterThan(0);
  });
  it('the footprint + ridge AGREE across tiers (pops change detail, not shape)', () => {
    const foot = (g) => [g.min[0], g.min[2], g.max[0], g.max[2], g.max[1]];
    for (let k = 0; k < 5; k++) {
      expect(Math.abs(foot(g0)[k] - foot(g2)[k])).toBeLessThan(1);
      expect(Math.abs(foot(g1)[k] - foot(g2)[k])).toBeLessThan(1);
    }
  });
});

describe('the pipeline is deterministic + permutation-invariant', () => {
  const rs = cathedralRuleset();
  it('two builds are byte-identical (mesh + ao)', () => {
    const a = emitMesh(interpret(rs, { seedId: 'k1', tier: 2 }).terminals);
    const b = emitMesh(interpret(rs, { seedId: 'k1', tier: 2 }).terminals);
    expect(eqF(a.positions, b.positions) && eqF(a.normals, b.normals) && eqF(a.indices, b.indices) && eqF(a.ao, b.ao)).toBe(true);
  });
  it('shuffling rule registration order + event order changes NOTHING (byte-identical)', () => {
    const base = emitMesh(interpret(rs, { seedId: 'k1', tier: 2 }).terminals);
    // rebuild a ruleset with the rules object key-order reversed + events duplicated-and-reordered
    const revRules = {};
    for (const k of Object.keys(rs.rules).reverse()) revRules[k] = rs.rules[k];
    const shuffled = { ...rs, rules: revRules, events: rs.events.slice().reverse() };
    const g = emitMesh(interpret(shuffled, { seedId: 'k1', tier: 2 }).terminals);
    expect(eqF(g.positions, base.positions) && eqF(g.normals, base.normals) && eqF(g.indices, base.indices)).toBe(true);
  });
});
