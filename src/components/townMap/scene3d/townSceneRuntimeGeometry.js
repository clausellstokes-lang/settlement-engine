/**
 * Renderer-neutral geometry records lowered into Three buffer objects.
 *
 * These helpers intentionally own no scene, camera, renderer, or animation
 * state. Keeping conversion and semantic-range math here makes the imperative
 * lifecycle in `threeSceneRuntime` substantially easier to audit.
 */
import { townSceneAoShade } from './townSceneRuntimeMaterials.js';

export function finiteTownSceneVector(value, fallback = [0, 0, 0]) {
  if (!Array.isArray(value) || value.length < 3) return fallback;
  return value.slice(0, 3).map((part, index) => (
    Number.isFinite(part) ? part : fallback[index]
  ));
}

export function createTownSceneBufferGeometry(THREE, record) {
  const geometry = new THREE.BufferGeometry();
  const positions = record.positions instanceof Float32Array
    ? record.positions
    : Float32Array.from(record.positions || []);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  if (record.normals?.length === positions.length) {
    const normals = record.normals instanceof Float32Array
      ? record.normals
      : Float32Array.from(record.normals);
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  }
  if (record.ao?.length === positions.length / 3) {
    const ao = record.ao instanceof Float32Array
      ? record.ao
      : Float32Array.from(record.ao);
    geometry.setAttribute('ao', new THREE.BufferAttribute(ao, 1));
    // MeshStandardMaterial multiplies its base color by vertex color. Encoding
    // deterministic AO as neutral RGB deepens recesses without baking a
    // skin-specific color into a shared template.
    const colors = new Float32Array(ao.length * 3);
    for (let index = 0; index < ao.length; index++) {
      const shade = townSceneAoShade(ao[index]);
      colors[index * 3] = shade;
      colors[index * 3 + 1] = shade;
      colors[index * 3 + 2] = shade;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }
  const indices = record.indices instanceof Uint32Array
    ? record.indices
    : Uint32Array.from(record.indices || []);
  if (indices.length) geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function townSceneSemanticForFace(ranges, faceIndex) {
  if (!Number.isInteger(faceIndex)) return null;
  const indexOffset = faceIndex * 3;
  const match = (ranges || []).find((range) => (
    indexOffset >= range.start && indexOffset < range.start + range.count
  ));
  return match?.semanticId || null;
}

export function townSceneSemanticRangeCenter(record, range) {
  const positions = record.positions || [];
  const indices = record.indices || [];
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  const end = Math.min(indices.length, range.start + range.count);
  for (let offset = range.start; offset < end; offset++) {
    const vertex = indices[offset] * 3;
    const x = positions[vertex];
    const y = positions[vertex + 1];
    const z = positions[vertex + 2];
    if (![x, y, z].every(Number.isFinite)) continue;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }
  if (!Number.isFinite(minX)) return null;
  return [
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2,
  ];
}

export function townSceneGeometryBounds(geometry) {
  const min = finiteTownSceneVector(geometry?.bounds?.min, [-500, 0, -500]);
  const max = finiteTownSceneVector(geometry?.bounds?.max, [500, 500, 500]);
  return {
    min,
    max,
    center: [
      (min[0] + max[0]) / 2,
      (min[1] + max[1]) / 2,
      (min[2] + max[2]) / 2,
    ],
    diagonal: Math.max(
      100,
      Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]),
    ),
  };
}

/**
 * InstancedMesh does not invalidate aggregate bounds when matrices change.
 * Repacking LODs must refresh both renderer-culling and raycast bounds.
 */
export function refreshTownSceneInstanceBounds(mesh) {
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingBox?.();
  mesh.computeBoundingSphere?.();
}
