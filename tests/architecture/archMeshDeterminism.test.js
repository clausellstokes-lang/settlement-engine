/**
 * archMeshDeterminism.test.js -- K-1 SPINE (meshGolden): double-build byte identity + SHA exemplars.
 *
 * The geometry is GOLDEN, the view is not. This extends the k0Determinism idiom to the grammar
 * kernel: a double build of the mesh + GLB + plate is byte-identical, and pinned SHA-256 exemplar
 * hashes of the GLB (all 3 cathedral tiers + the byte-parity buttress) and the canonical-angle plates
 * catch any same-seed geometry drift. THE PROMISE binds the STRUCTURE: same seed -> the same building,
 * byte-identical, forever. A hash change is a DECLARED same-seed geometry shift (bump
 * ARCH_GEOMETRY_VERSION + reprint) -- never a silent one. The vertex-intern key is the K-0b string key
 * over float32-baked coords (cross-engine exact via IEEE fround + spec Number->String); AO is a
 * parallel attribute outside the intern key, so it never perturbs positions/normals/indices.
 */
import { createHash } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import { buildArchMesh, emitMesh } from '../../src/domain/townMap/arch/emitter.js';
import { interpret } from '../../src/domain/townMap/arch/interpreter.js';
import { encodeGlb } from '../../src/domain/townMap/arch/glb.js';
import { renderMeshPlate } from '../../src/domain/townMap/arch/plate.js';
import { cathedralRuleset } from '../../src/domain/townMap/arch/rulesets/cathedral.js';
import { buttressRuleset } from '../../src/domain/townMap/arch/rulesets/buttressFragment.js';
import { ARCH_GEOMETRY_VERSION } from '../../src/domain/townMap/arch/grammarIR.js';

const sha = (b) => createHash('sha256').update(Buffer.from(b.buffer, b.byteOffset, b.byteLength)).digest('hex');
const glbOf = (g, gen) => encodeGlb({ positions: g.positions, normals: g.normals, indices: g.indices, vertexCount: g.vertexCount, min: g.min, max: g.max }, { ao: g.ao, generator: gen });
const eqF = (a, b) => a.length === b.length && Array.prototype.every.call(a, (v, i) => v === b[i]);

// ── PINNED EXEMPLAR HASHES (ARCH_GEOMETRY_VERSION 1, 2026-07-21) ─────────────────────────────────
const GOLDEN = {
  geometryVersion: 1,
  cathedralGlb: {
    0: '51c0a926ecf9058ae2981a64cdfcf3d684a49d7b84eedb953781de4a90d43cd2',
    1: 'f42685948ae9b03b0ced706a2b5e4da76f6b4a328caab553f9645a2d4704a509',
    2: '373f0145aa32259c9bb7d6f01a929d7dafd3964d37377bc4e41a7d70693d0047',
  },
  buttressGlb: '0780857ab2b1be69e28593d09067bf6804f33e3769a076bae1cb12bcf3c514aa',
  plate: {
    axonNW: '6bba4c5e68f3ea407b9d00984fcf6279bcc7d65cef8dd0658f7e2bbddda56dfb',
    westFront: 'fe968684fc73a7d8214a9bd9742a83a4442710929b70b8519f0010e6ef12892e',
    southElev: '1e530ceb9d89f3754c69a8775aa38fa7b752c2a0e46d59194333cd704d938341',
  },
};

describe('the grammar geometry is byte-deterministic (double build)', () => {
  const rs = cathedralRuleset();
  for (const tier of [0, 1, 2]) {
    it(`cathedral tier ${tier}: mesh + GLB double-build byte-identical`, () => {
      const a = buildArchMesh(rs, { seedId: 'k1', tier }), b = buildArchMesh(rs, { seedId: 'k1', tier });
      expect(eqF(a.positions, b.positions) && eqF(a.normals, b.normals) && eqF(a.indices, b.indices) && eqF(a.ao, b.ao)).toBe(true);
      expect(eqF(glbOf(a, 'k1'), glbOf(b, 'k1'))).toBe(true);
    });
  }
});

describe('the geometry-version stamp matches the pinned goldens', () => {
  it('a hash-affecting change must bump ARCH_GEOMETRY_VERSION', () => {
    expect(ARCH_GEOMETRY_VERSION).toBe(GOLDEN.geometryVersion);
  });
});

describe('SHA-256 exemplar goldens -- GLB (a hash change is a DECLARED geometry shift)', () => {
  const rs = cathedralRuleset();
  for (const tier of [0, 1, 2]) {
    it(`cathedral tier ${tier} GLB hash is pinned`, () => {
      expect(sha(glbOf(buildArchMesh(rs, { seedId: 'k1', tier }), 'k1-arch-grammar'))).toBe(GOLDEN.cathedralGlb[tier]);
    });
  }
  it('byte-parity buttress GLB hash is pinned', () => {
    const b = emitMesh(interpret(buttressRuleset(20, 49, 1), { tier: 2 }).terminals);
    expect(sha(glbOf(b, 'k1-buttress-grammar'))).toBe(GOLDEN.buttressGlb);
  });
});

describe('SHA-256 exemplar goldens -- the CPU plate at canonical angles (double-render + pinned)', () => {
  const g = buildArchMesh(cathedralRuleset(), { seedId: 'k1', tier: 2 });
  for (const view of ['axonNW', 'westFront', 'southElev']) {
    it(`plate ${view}: deterministic + pinned hash`, () => {
      const p1 = renderMeshPlate(g, { view, width: 900, height: 720, ss: 2 });
      const p2 = renderMeshPlate(g, { view, width: 900, height: 720, ss: 2 });
      expect(eqF(p1.rgb, p2.rgb)).toBe(true);
      expect(sha(p1.rgb)).toBe(GOLDEN.plate[view]);
    });
  }
});
