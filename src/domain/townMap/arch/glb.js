/**
 * domain/townMap/arch/glb.js -- K-0b SPIKE: a deterministic binary glTF (GLB) encoder.
 *
 * The 3D MESH is the deliverable and the TRUTH (docs/THE_ARCHITECTURE_KERNEL_3D.md v2); the GLB is
 * its PORTABLE, importable form. This encoder is byte-reproducible by construction: a fixed buffer
 * layout (POSITION float32, then NORMAL float32, then indices uint32), all multi-byte writes
 * little-endian through a DataView, a fixed JSON key order, and fixed 4-byte chunk padding. So a
 * double build is `cmp`-clean and cross-engine stable (positions are already float32-baked in
 * mesh.js). The LIVE WebGL render of this GLB is device-dependent and NON-golden; the GLB BYTES
 * are golden -- that is the K-0b split (geometry is pinned, the view is a view).
 *
 * PURITY: integer/DataView writes + JSON only -- 0 transcendental sites (the arch/ scan binds it).
 *
 * @typedef {{ positions: Float32Array, normals: Float32Array, indices: Uint32Array, vertexCount: number, min: readonly [number, number, number], max: readonly [number, number, number] }} Geo
 */

const GLB_MAGIC = 0x46546c67;   // 'glTF'
const JSON_TYPE = 0x4e4f534a;   // 'JSON'
const BIN_TYPE = 0x004e4942;    // 'BIN\0'
const FLOAT = 5126, UINT = 5125;
const ARRAY_BUFFER = 34962, ELEMENT_ARRAY_BUFFER = 34963, TRIANGLES = 4;

/** round a length up to the next multiple of 4. @param {number} n @returns {number} */
function pad4(n) {
  return (n + 3) & ~3;
}

/**
 * The glTF JSON tree for a mesh (the single source of truth the encoder + the validator share).
 * Fixed key order + fixed content -> JSON.stringify is deterministic. When `ao` is supplied it is
 * appended AFTER the indices in the buffer and exposed as a custom `_AO` SCALAR attribute, so the
 * NO-AO path is byte-identical to the K-0b golden (the K-1 additions never touch the old bytes).
 * @param {Geo} geo @param {[number, number, number, number]} baseColor @param {string} generator @param {Float32Array|null} [ao]
 * @returns {object}
 */
function gltfTree(geo, baseColor, generator, ao) {
  const V = geo.vertexCount;
  const posBytes = geo.positions.length * 4;
  const nrmBytes = geo.normals.length * 4;
  const idxBytes = geo.indices.length * 4;
  /** @type {Record<string, number>} */
  const primAttrs = { POSITION: 0, NORMAL: 1 };
  const accessors = [
    { bufferView: 0, componentType: FLOAT, count: V, type: 'VEC3', min: [geo.min[0], geo.min[1], geo.min[2]], max: [geo.max[0], geo.max[1], geo.max[2]] },
    { bufferView: 1, componentType: FLOAT, count: V, type: 'VEC3' },
    { bufferView: 2, componentType: UINT, count: geo.indices.length, type: 'SCALAR' },
  ];
  const bufferViews = [
    { buffer: 0, byteOffset: 0, byteLength: posBytes, target: ARRAY_BUFFER },
    { buffer: 0, byteOffset: posBytes, byteLength: nrmBytes, target: ARRAY_BUFFER },
    { buffer: 0, byteOffset: posBytes + nrmBytes, byteLength: idxBytes, target: ELEMENT_ARRAY_BUFFER },
  ];
  let bufLen = posBytes + nrmBytes + idxBytes;
  if (ao) {
    const aoBytes = ao.length * 4;
    bufferViews.push({ buffer: 0, byteOffset: bufLen, byteLength: aoBytes, target: ARRAY_BUFFER });
    accessors.push({ bufferView: 3, componentType: FLOAT, count: V, type: 'SCALAR' });
    primAttrs._AO = 3;
    bufLen += aoBytes;
  }
  return {
    asset: { version: '2.0', generator },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: 'gothic-nave-bay' }],
    meshes: [{
      name: 'gothic-nave-bay',
      primitives: [{ attributes: primAttrs, indices: 2, material: 0, mode: TRIANGLES }],
    }],
    materials: [{
      name: 'ashlar-stone',
      pbrMetallicRoughness: { baseColorFactor: baseColor, metallicFactor: 0, roughnessFactor: 0.85 },
      doubleSided: true,
    }],
    accessors,
    bufferViews,
    buffers: [{ byteLength: bufLen }],
  };
}

/** The exact glTF JSON chunk string (for JSON-validation in the gate, no GLB re-parse). @param {Geo} geo @param {Float32Array|null} [ao] @returns {string} */
export function glbJsonString(geo, ao) {
  return JSON.stringify(gltfTree(geo, [0.82, 0.77, 0.67, 1], 'k0b-arch-spike', ao || null));
}

/**
 * Encode a finalized mesh to GLB bytes. Single node, single stone PBR material. When `opts.ao` is a
 * per-vertex Float32Array it is embedded as a `_AO` SCALAR attribute (the shading-identity channel);
 * omitting it reproduces the K-0b GLB byte-for-byte.
 * @param {Geo} geo
 * @param {{ baseColor?: [number, number, number, number], generator?: string, ao?: Float32Array|null }} [opts]
 * @returns {Uint8Array}
 */
export function encodeGlb(geo, opts) {
  const ao = (opts && opts.ao) || null;
  const posBytes = geo.positions.length * 4;
  const nrmBytes = geo.normals.length * 4;
  const idxBytes = geo.indices.length * 4;
  const aoBytes = ao ? ao.length * 4 : 0;
  const binLen = posBytes + nrmBytes + idxBytes + aoBytes;    // all lengths are multiples of 4
  const baseColor = (opts && opts.baseColor) || [0.82, 0.77, 0.67, 1];

  // ── BIN payload (little-endian via DataView) ──────────────────────────────
  const bin = new Uint8Array(pad4(binLen));
  const dv = new DataView(bin.buffer);
  let o = 0;
  for (let i = 0; i < geo.positions.length; i++, o += 4) dv.setFloat32(o, geo.positions[i], true);
  for (let i = 0; i < geo.normals.length; i++, o += 4) dv.setFloat32(o, geo.normals[i], true);
  for (let i = 0; i < geo.indices.length; i++, o += 4) dv.setUint32(o, geo.indices[i], true);
  if (ao) for (let i = 0; i < ao.length; i++, o += 4) dv.setFloat32(o, ao[i], true);

  // ── JSON chunk (space-padded to 4) ────────────────────────────────────────
  const jsonStr = JSON.stringify(gltfTree(geo, baseColor, (opts && opts.generator) || 'k0b-arch-spike', ao));
  const jsonBytes = new Uint8Array(pad4(jsonStr.length));
  for (let i = 0; i < jsonStr.length; i++) jsonBytes[i] = jsonStr.charCodeAt(i) & 0xff;
  for (let i = jsonStr.length; i < jsonBytes.length; i++) jsonBytes[i] = 0x20;

  // ── assemble: header(12) + JSON chunk(8+len) + BIN chunk(8+len) ────────────
  const total = 12 + 8 + jsonBytes.length + 8 + bin.length;
  const out = new Uint8Array(total);
  const odv = new DataView(out.buffer);
  odv.setUint32(0, GLB_MAGIC, true);
  odv.setUint32(4, 2, true);
  odv.setUint32(8, total, true);
  odv.setUint32(12, jsonBytes.length, true);
  odv.setUint32(16, JSON_TYPE, true);
  out.set(jsonBytes, 20);
  const binHdr = 20 + jsonBytes.length;
  odv.setUint32(binHdr, bin.length, true);
  odv.setUint32(binHdr + 4, BIN_TYPE, true);
  out.set(bin, binHdr + 8);
  return out;
}
