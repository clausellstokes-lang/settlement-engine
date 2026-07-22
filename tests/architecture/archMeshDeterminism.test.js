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
import { roseWindowRuleset } from '../../src/domain/townMap/arch/rulesets/roseWindow.js';
import { vaultBayRuleset } from '../../src/domain/townMap/arch/rulesets/vaultBay.js';
import { traceryFamiliesRuleset } from '../../src/domain/townMap/arch/rulesets/traceryFamilies.js';
import { evilChapelRuleset } from '../../src/domain/townMap/arch/rulesets/evilChapel.js';
import { ARCH_GEOMETRY_VERSION } from '../../src/domain/townMap/arch/grammarIR.js';

const sha = (b) => createHash('sha256').update(Buffer.from(b.buffer, b.byteOffset, b.byteLength)).digest('hex');
const glbOf = (g, gen) => encodeGlb({ positions: g.positions, normals: g.normals, indices: g.indices, vertexCount: g.vertexCount, min: g.min, max: g.max }, { ao: g.ao, generator: gen });
const eqF = (a, b) => a.length === b.length && Array.prototype.every.call(a, (v, i) => v === b[i]);

// ── PINNED EXEMPLAR HASHES (ARCH_GEOMETRY_VERSION 2, 2026-07-22) ─────────────────────────────────
// V2 (K-2): the evil-chapel spire is embedded below the tower top to cure the tone-gate roof-underside
// striping (coincident spire-base / tower-top faces). ONLY K3_GLB_GOLDEN.chapel2 shifts; every hash
// below is byte-IDENTICAL to V1 (the cathedral/buttress GLBs + all 3 cathedral plate goldens unchanged).
const GOLDEN = {
  geometryVersion: 2,
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

// ── K-3 ORNAMENT GLB exemplar goldens. EXEMPLAR SAMPLE ONLY -- the milestone rose (all 3 tiers) + the
// signature tier of vault / tracery-families / evil-chapel; NEVER the shape x skin cross product. A hash
// change is a DECLARED same-seed geometry shift. rose/vault/tracery are V1-IDENTICAL; chapel2 re-pinned
// at ARCH_GEOMETRY_VERSION 2 (K-2, 2026-07-22): spire embedded below the tower top -- the tone-gate
// striping cure (evilChapel.js SPIRE_EMBED). ─────────────────────────────────────────────────────────
const K3_GLB_GOLDEN = {
  rose: {
    0: '202d310d2339d126936e24a7cb338eaf2c125129af40dfbb33c3f2387a60387d',
    1: 'f549d2898c1ee03445ef537cff34078aa444f9d5fefc8cbcea0c67b3921c0dbc',
    2: '17d8974cd95e7b69ef23bbbc2d1f82a8573741eb99ea3acfbf815a6f311bfc05',
  },
  vault2: 'd7542488b1ac13967f06918e3d5bc1b32e0622a9f90c500fffe01fb91311fce1',
  tracery2: '5ca68101a4e1795b6dcd2f68eb9525011e44de042881318ce1e5876cd9e2c334',
  chapel2: 'c3063e77749f9012e2f620f82b7bc04c2934178bb6b8bff45cd264a225ed41b4',
};
describe('K-3 ornament geometry is byte-deterministic + pinned (exemplar GLB goldens)', () => {
  const rose = roseWindowRuleset();
  for (const tier of [0, 1, 2]) {
    it(`rose-window tier ${tier}: double-build byte-identical + pinned GLB hash`, () => {
      const a = buildArchMesh(rose, { seedId: 'k3', tier }), b = buildArchMesh(rose, { seedId: 'k3', tier });
      expect(eqF(a.positions, b.positions) && eqF(a.normals, b.normals) && eqF(a.indices, b.indices) && eqF(a.ao, b.ao)).toBe(true);
      expect(sha(glbOf(a, 'k3-rose'))).toBe(K3_GLB_GOLDEN.rose[tier]);
    });
  }
  it('vault-bay signature GLB hash is pinned', () => {
    expect(sha(glbOf(buildArchMesh(vaultBayRuleset(), { seedId: 'k3', tier: 2 }), 'k3-vault'))).toBe(K3_GLB_GOLDEN.vault2);
  });
  it('tracery-families signature GLB hash is pinned', () => {
    expect(sha(glbOf(buildArchMesh(traceryFamiliesRuleset(), { seedId: 'k3', tier: 2 }), 'k3-tracery'))).toBe(K3_GLB_GOLDEN.tracery2);
  });
  it('evil-chapel signature GLB hash is pinned', () => {
    expect(sha(glbOf(buildArchMesh(evilChapelRuleset(), { seedId: 'k3', tier: 2 }), 'k3-chapel'))).toBe(K3_GLB_GOLDEN.chapel2);
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
