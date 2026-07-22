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

// ── PINNED EXEMPLAR HASHES (ARCH_GEOMETRY_VERSION 3, 2026-07-22) ─────────────────────────────────
// V2 (K-2): the evil-chapel spire was embedded below the tower top to cure the tone-gate roof-underside
// striping. V3 (K-4): THE GENERAL STRIPING CURE (kit.js seatedSpire) seats every stacked spire cap below
// the top of the primitive it rested on (the crocket/grotesque/skull caps + the cathedral pinnacle-on-
// pier joint), removing the coincident-face z-fight kit-wide. Cathedral GLB tiers 1 + 2 carry the
// pinnacle kit asset, so they shift; tier 0 (glyph, no statuary) is byte-IDENTICAL. Of the tier-2 cathedral
// plates, axonNW + southElev shift (the seated cap moves in view); westFront is byte-IDENTICAL (a west
// elevation sees the horizontal cap faces edge-on, so the embed changes no visible pixel). Buttress, rose,
// vault, tracery stack no coincident cap and are byte-IDENTICAL. (K3_GLB_GOLDEN.chapel2 re-pinned below.)
const GOLDEN = {
  geometryVersion: 3,
  cathedralGlb: {
    0: '51c0a926ecf9058ae2981a64cdfcf3d684a49d7b84eedb953781de4a90d43cd2',
    1: 'ac444134e851b82c26cfceff1bf0bcca3745ed7b1e01ad0b7fc709ae602f9aab',
    2: '87b85f2b5cad99ff950839e64763eef4311abe1c19de41993a831b084a6162ad',
  },
  buttressGlb: '0780857ab2b1be69e28593d09067bf6804f33e3769a076bae1cb12bcf3c514aa',
  plate: {
    axonNW: '431bfa5874ecea644f0e9fbd729f4cf6613e732860ee83098e626694da526ed3',
    westFront: 'fe968684fc73a7d8214a9bd9742a83a4442710929b70b8519f0010e6ef12892e',
    southElev: '52176cebfdd908421e6a5fac52b78b8b3555123986859be1981668c088c0c943',
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
// change is a DECLARED same-seed geometry shift. rose/vault/tracery stack no coincident cap and are
// V1-IDENTICAL. chapel2 re-pinned at ARCH_GEOMETRY_VERSION 3 (K-4, 2026-07-22): the general striping
// cure (kit.js seatedSpire) seats the evil-chapel's grotesque + skull caps below the blocks they rested
// on -- superseding the V2 chapel-only re-pin. ────────────────────────────────────────────────────────
const K3_GLB_GOLDEN = {
  rose: {
    0: '202d310d2339d126936e24a7cb338eaf2c125129af40dfbb33c3f2387a60387d',
    1: 'f549d2898c1ee03445ef537cff34078aa444f9d5fefc8cbcea0c67b3921c0dbc',
    2: '17d8974cd95e7b69ef23bbbc2d1f82a8573741eb99ea3acfbf815a6f311bfc05',
  },
  vault2: 'd7542488b1ac13967f06918e3d5bc1b32e0622a9f90c500fffe01fb91311fce1',
  tracery2: '5ca68101a4e1795b6dcd2f68eb9525011e44de042881318ce1e5876cd9e2c334',
  chapel2: 'cad9762cdcf7d40c62a3f48a4135104810fcae00602c6ae3b09260726e363513',
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
