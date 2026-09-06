/**
 * k0bMesh.test.js -- K-0b SPIKE: the 3D-MESH determinism + integrity gate.
 *
 * K-0b raises the K-0 gothic geometry into a REAL 3D MESH (positions / normals / indices) and a
 * portable GLB -- the owner ruling v2 deliverable ("a FULL 3D STRUCTURE, not a plate";
 * docs/THE_ARCHITECTURE_KERNEL_3D.md). These pins hold the load-bearing K-0b properties:
 *
 *   THE GEOMETRY IS GOLDEN (byte-deterministic + pinnable), THE VIEW IS NOT. The mesh vertex data
 *   and the GLB bytes are a pure function of nothing -- byte-identical every build, cross-engine
 *   (positions float32-baked). The live WebGL render in the exhibit is device-dependent and
 *   DELIBERATELY NON-GOLDEN (a GPU view of the pinned truth), so no pixel is asserted here; only
 *   the geometry + the GLB container are. This is the K-0b constitutional split: THE PROMISE binds
 *   the STRUCTURE, not a photograph of it.
 *
 * Non-degeneracy + watertightness are asserted structurally (every solid primitive is individually
 * closed, so the assembly has ZERO boundary edges). Source PURITY (no trig / no transcendental in
 * the arch/ mesh leaves) is enforced by the arch-dir scan in k0GeometryTracery.test.js, which
 * iterates every arch/*.js -- mesh.js / cathedralSection.js / glb.js included.
 */
import { describe, it, expect } from 'vitest';
import { buildCathedralSection } from '../../src/domain/townMap/arch/cathedralSection.js';
import { createMesh, addBox, finalizeMesh } from '../../src/domain/townMap/arch/mesh.js';
import { encodeGlb, glbJsonString } from '../../src/domain/townMap/arch/glb.js';

/** float-array equality. @param {ArrayLike<number>} a @param {ArrayLike<number>} b */
const eqF = (a, b) => a.length === b.length && Array.prototype.every.call(a, (v, i) => v === b[i]);

/** quantized position-edge multiplicity map (watertightness probe). */
function boundaryEdgeCount(geo) {
  const key = (i) => `${geo.positions[i * 3].toFixed(3)},${geo.positions[i * 3 + 1].toFixed(3)},${geo.positions[i * 3 + 2].toFixed(3)}`;
  const edges = new Map();
  for (let t = 0; t < geo.indices.length; t += 3) {
    const v = [geo.indices[t], geo.indices[t + 1], geo.indices[t + 2]].map(key);
    for (let e = 0; e < 3; e++) {
      const p = [v[e], v[(e + 1) % 3]].sort();
      const k = `${p[0]}|${p[1]}`;
      edges.set(k, (edges.get(k) || 0) + 1);
    }
  }
  let odd = 0;
  for (const c of edges.values()) if (c % 2) odd++;
  return { odd, total: edges.size };
}

describe('the cathedral-section mesh is a real, non-degenerate 3D solid', () => {
  const geo = buildCathedralSection();

  it('has a substantial triangle mesh (high fidelity, not a plate)', () => {
    expect(geo.triangleCount).toBeGreaterThan(2000);
    expect(geo.vertexCount).toBeGreaterThan(geo.triangleCount); // faceted (per-face normals)
    expect(geo.indices.length).toBe(geo.triangleCount * 3);
  });

  it('has true depth in all three axes (a volume, not a flat fragment)', () => {
    expect(geo.max[0] - geo.min[0]).toBeGreaterThan(200); // width
    expect(geo.max[1] - geo.min[1]).toBeGreaterThan(300); // height
    expect(geo.max[2] - geo.min[2]).toBeGreaterThan(80);  // depth (wall thickness + forward piers)
  });

  it('every normal is unit-length within rational tolerance', () => {
    let maxErr = 0;
    for (let i = 0; i < geo.normals.length; i += 3) {
      const m = Math.sqrt(geo.normals[i] ** 2 + geo.normals[i + 1] ** 2 + geo.normals[i + 2] ** 2);
      const e = Math.abs(m - 1);
      if (e > maxErr) maxErr = e;
    }
    expect(maxErr).toBeLessThan(1e-3);
  });

  it('has no degenerate index triangles', () => {
    let degen = 0;
    for (let t = 0; t < geo.indices.length; t += 3) {
      const a = geo.indices[t], b = geo.indices[t + 1], c = geo.indices[t + 2];
      if (a === b || b === c || a === c) degen++;
    }
    expect(degen).toBe(0);
  });

  it('is watertight -- zero boundary (odd-multiplicity) edges', () => {
    const { odd, total } = boundaryEdgeCount(geo);
    expect(total).toBeGreaterThan(1000);
    expect(odd).toBe(0);
  });

  it('models the full gothic structural vocabulary in 3D', () => {
    expect(geo.elements.length).toBeGreaterThanOrEqual(15);
  });
});

describe('the mesh geometry is byte-deterministic (GOLDEN)', () => {
  it('a double build is identical in positions, normals and indices', () => {
    const a = buildCathedralSection();
    const b = buildCathedralSection();
    expect(eqF(a.positions, b.positions)).toBe(true);
    expect(eqF(a.normals, b.normals)).toBe(true);
    expect(eqF(a.indices, b.indices)).toBe(true);
  });
});

describe('mesh primitives are individually closed manifolds', () => {
  it('a lone box has zero boundary edges', () => {
    const m = createMesh();
    addBox(m, 0, 10, 0, 20, 0, 5);
    const geo = finalizeMesh(m);
    expect(geo.triangleCount).toBe(12); // 6 quads
    expect(boundaryEdgeCount(geo).odd).toBe(0);
  });
});

describe('the GLB is a valid, byte-deterministic container (portable geometry)', () => {
  const geo = buildCathedralSection();
  const glbA = encodeGlb(geo);
  const glbB = encodeGlb(geo);

  it('double-encode is byte-identical', () => {
    expect(eqF(glbA, glbB)).toBe(true);
    expect(glbA.length).toBeGreaterThan(0);
  });

  it('has a well-formed GLB header (magic / version 2 / self-consistent length)', () => {
    const dv = new DataView(glbA.buffer, glbA.byteOffset, glbA.byteLength);
    expect(dv.getUint32(0, true)).toBe(0x46546c67); // 'glTF'
    expect(dv.getUint32(4, true)).toBe(2);
    expect(dv.getUint32(8, true)).toBe(glbA.length);
  });

  it('JSON chunk parses and its accessors match the mesh', () => {
    const dv = new DataView(glbA.buffer, glbA.byteOffset, glbA.byteLength);
    const jsonLen = dv.getUint32(12, true);
    expect(dv.getUint32(16, true)).toBe(0x4e4f534a); // 'JSON'
    const json = JSON.parse(new TextDecoder().decode(glbA.subarray(20, 20 + jsonLen)));
    expect(json.asset.version).toBe('2.0');
    expect(json.accessors[0].count).toBe(geo.vertexCount); // POSITION
    expect(json.accessors[1].count).toBe(geo.vertexCount); // NORMAL
    expect(json.accessors[2].count).toBe(geo.indices.length); // indices
    expect(json.accessors[0].min).toHaveLength(3);
    expect(json.accessors[0].max).toHaveLength(3);
    // the second (BIN) chunk exists and is 4-byte aligned
    const binHdr = 20 + jsonLen;
    expect(dv.getUint32(binHdr + 4, true)).toBe(0x004e4942); // 'BIN\0'
    expect(dv.getUint32(binHdr, true) % 4).toBe(0);
  });

  it('glbJsonString mirrors the encoder JSON chunk exactly (single source of truth)', () => {
    const dv = new DataView(glbA.buffer, glbA.byteOffset, glbA.byteLength);
    const jsonLen = dv.getUint32(12, true);
    const embedded = new TextDecoder().decode(glbA.subarray(20, 20 + jsonLen)).replace(/ +$/, '');
    expect(embedded).toBe(glbJsonString(geo));
  });
});
