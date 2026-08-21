/**
 * View-only presentation of the manifest's authorized living-state channels.
 *
 * Conditions, persistent scars, and reconstruction remain separate shapes so
 * they are distinguishable without color. This module receives Three from the
 * lazy runtime; importing it cannot pull WebGL into the eager application graph.
 */
import {
  AMBER,
  BLUE,
  GOLD,
  GREEN,
  INK,
  RED,
} from '../../theme.js';
import { clamp } from '../../../kernel/math.js';
import {
  townSceneConditionTint,
  townSceneLivingMarkerKind,
} from '../../../domain/townScene/sceneLivingPresentation.js';

export { townSceneConditionTint };

const TAU = Math.PI * 2;

function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function recordHash(value) {
  const text = String(value || 'living-state');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Bilinear terrain sampling for direct-position condition markers.
 *
 * Geometry already contains the authoritative terrain surface. Sampling the
 * same manifest grid here only places view-only markers on that surface; it
 * cannot change canonical structure or simulation distance.
 */
export function townSceneTerrainHeightAt(manifest, planX, planZ) {
  const terrain = manifest?.terrain || {};
  const heights = Array.isArray(terrain.heights) ? terrain.heights : [];
  const gridSize = Math.max(2, Math.trunc(finite(terrain.gridSize, 2)));
  if (heights.length < gridSize * gridSize) return 0;
  const extent = Math.max(1, finite(manifest?.space?.planExtent, 1000));
  const x = clamp(finite(planX) / extent * (gridSize - 1), 0, gridSize - 1);
  const z = clamp(finite(planZ) / extent * (gridSize - 1), 0, gridSize - 1);
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  const x1 = Math.min(gridSize - 1, x0 + 1);
  const z1 = Math.min(gridSize - 1, z0 + 1);
  const tx = x - x0;
  const tz = z - z0;
  const at = (column, row) => finite(heights[row * gridSize + column]);
  const top = at(x0, z0) + (at(x1, z0) - at(x0, z0)) * tx;
  const bottom = at(x0, z1) + (at(x1, z1) - at(x0, z1)) * tx;
  return (top + (bottom - top) * tz) * finite(terrain.heightUnitCm, 1);
}

function targetSemanticIds(record) {
  return [
    ...(Array.isArray(record.buildingIds) ? record.buildingIds : []),
    record.buildingId,
    ...(Array.isArray(record.wallIds) ? record.wallIds : []),
    record.wallId,
    ...(Array.isArray(record.districtIds)
      ? record.districtIds.map((id) => `district:${id}`)
      : []),
    record.districtId ? `district:${record.districtId}` : null,
  ].filter(Boolean);
}

function averageTargetPosition(semanticPositions, semanticIds) {
  const positions = semanticIds
    .map((semanticId) => semanticPositions.get(semanticId))
    .filter(Boolean);
  if (!positions.length) return null;
  const sum = positions.reduce(
    (value, position) => [
      value[0] + position.x,
      value[1] + position.y,
      value[2] + position.z,
    ],
    [0, 0, 0],
  );
  return sum.map((value) => value / positions.length);
}

function directPosition(manifest, record) {
  if (!Array.isArray(record.position) || record.position.length < 2) return null;
  const planX = finite(record.position[0]);
  const planZ = finite(record.position[1]);
  const planUnitCm = Math.max(1, finite(manifest?.space?.planUnitCm, 1));
  return [
    planX * planUnitCm,
    townSceneTerrainHeightAt(manifest, planX, planZ),
    planZ * planUnitCm,
  ];
}

function markerRows(manifest) {
  const living = manifest?.living || {};
  return [
    ...(living.conditions || []).map((record) => ({
      record,
      markerKind: townSceneLivingMarkerKind(record, 'condition'),
    })),
    ...(living.scars || []).map((record) => ({
      record,
      markerKind: townSceneLivingMarkerKind(record, 'scar'),
    })),
    ...(living.reconstruction || []).map((record) => ({
      record,
      markerKind: townSceneLivingMarkerKind(record, 'reconstruction'),
    })),
  ];
}

function markerGeometry(THREE, markerKind, size) {
  if (markerKind === 'hazard') return new THREE.ConeGeometry(size * 0.82, size * 1.8, 4);
  if (markerKind === 'fire') {
    const flame = new THREE.Shape();
    flame.moveTo(0, -size);
    flame.lineTo(-size * 0.72, -size * 0.18);
    flame.lineTo(-size * 0.22, size * 0.08);
    flame.lineTo(-size * 0.42, size);
    flame.lineTo(size * 0.18, size * 0.52);
    flame.lineTo(size * 0.68, size * 0.86);
    flame.lineTo(size * 0.48, size * 0.02);
    flame.lineTo(size * 0.82, -size * 0.42);
    return new THREE.ShapeGeometry(flame);
  }
  if (markerKind === 'flood') {
    return new THREE.BoxGeometry(size * 2.05, size * 0.34, size * 0.72);
  }
  if (markerKind === 'plague') {
    return new THREE.SphereGeometry(size * 0.88, 7, 5);
  }
  if (markerKind === 'siege') {
    return new THREE.CylinderGeometry(size * 0.72, size * 0.92, size * 1.75, 4);
  }
  if (markerKind === 'scar') return new THREE.TorusGeometry(size * 0.82, size * 0.2, 6, 14);
  if (markerKind === 'occupation') {
    const flag = new THREE.Shape();
    flag.moveTo(-size * 0.08, -size);
    flag.lineTo(-size * 0.08, size);
    flag.lineTo(size, size * 0.72);
    flag.lineTo(size * 0.55, size * 0.22);
    flag.lineTo(size, -size * 0.28);
    flag.lineTo(-size * 0.08, 0);
    return new THREE.ShapeGeometry(flag);
  }
  if (markerKind === 'abandonment') return new THREE.TetrahedronGeometry(size * 1.05, 0);
  if (markerKind === 'neglect') {
    return new THREE.CylinderGeometry(size * 0.5, size * 0.78, size * 1.55, 5);
  }
  if (markerKind === 'repair') {
    return new THREE.CylinderGeometry(size * 0.48, size * 0.48, size * 1.9, 6);
  }
  if (markerKind === 'construction') {
    return new THREE.BoxGeometry(size * 1.55, size * 1.35, size * 0.34);
  }
  if (markerKind === 'reconstruction') return new THREE.BoxGeometry(size * 1.35, size * 1.7, size * 1.35);
  return new THREE.OctahedronGeometry(size, 0);
}

function markerColor(markerKind) {
  if (markerKind === 'hazard') return RED;
  if (markerKind === 'fire') return AMBER;
  if (markerKind === 'flood') return BLUE;
  if (markerKind === 'plague') return GREEN;
  if (markerKind === 'siege') return INK;
  if (markerKind === 'scar') return INK;
  if (markerKind === 'occupation') return RED;
  if (markerKind === 'abandonment') return INK;
  if (markerKind === 'reconstruction' || markerKind === 'repair' || markerKind === 'construction') {
    return GOLD;
  }
  return AMBER;
}

/**
 * Add one shared-geometry draw per present marker kind to an existing scene.
 * The vocabulary is frozen and bounded; record count never becomes draw count.
 *
 * @returns {any[]} marker meshes, primarily for diagnostics/tests
 */
export function addTownSceneLivingMarkers({
  THREE,
  scene,
  manifest,
  bounds,
  semanticPositions,
  pickables,
  materials,
  ownedGeometries,
}) {
  const groups = new Map();
  for (const row of markerRows(manifest)) {
    const semanticId = String(row.record.id || '');
    if (!semanticId) continue;
    const target = averageTargetPosition(
      semanticPositions,
      targetSemanticIds(row.record),
    );
    const origin = directPosition(manifest, row.record) || target || bounds.center;
    const hash = recordHash(semanticId);
    const size = clamp(bounds.diagonal * 0.007, 36, 220);
    const angle = (hash % 16) * TAU / 16;
    const radius = size * (0.35 + ((hash >>> 4) % 4) * 0.16);
    const position = [
      origin[0] + Math.sin(angle) * radius,
      origin[1] + size * 1.35,
      origin[2] + Math.cos(angle) * radius,
    ];
    const group = groups.get(row.markerKind) || [];
    group.push({
      semanticId,
      position,
      severity: clamp(finite(row.record.severityPermille) / 1000, 0, 1),
    });
    groups.set(row.markerKind, group);
    semanticPositions.set(semanticId, new THREE.Vector3(...position));
  }

  const markerMeshes = [];
  for (const [markerKind, records] of groups) {
    const size = clamp(bounds.diagonal * 0.007, 36, 220);
    const geometry = markerGeometry(THREE, markerKind, size);
    const material = new THREE.MeshStandardMaterial({
      color: markerColor(markerKind),
      roughness: 0.72,
      metalness: markerKind === 'reconstruction' ? 0.12 : 0.02,
      emissive: markerColor(markerKind),
      emissiveIntensity: 0.08,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, records.length);
    mesh.name = `living:${markerKind}`;
    mesh.castShadow = true;
    mesh.renderOrder = 4;
    mesh.userData.townSceneInstanced = true;
    mesh.userData.visibleInstances = records.map((record, index) => {
      const scale = 0.82 + record.severity * 0.38;
      const quaternion = new THREE.Quaternion();
      if (markerKind === 'scar') {
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
      }
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...record.position),
        quaternion,
        new THREE.Vector3(scale, scale, scale),
      );
      mesh.setMatrixAt(index, matrix);
      return { record: { semanticId: record.semanticId } };
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingBox();
    mesh.computeBoundingSphere();
    scene.add(mesh);
    pickables.push(mesh);
    materials.set(`living:${markerKind}`, material);
    ownedGeometries.add(geometry);
    markerMeshes.push(mesh);
  }
  return markerMeshes;
}
