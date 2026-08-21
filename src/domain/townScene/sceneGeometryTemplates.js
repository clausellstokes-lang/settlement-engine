/**
 * Reusable LOD geometry for scene instances.
 *
 * This module owns visual vocabulary only. Templates are normalized local
 * meshes with no canonical position, semantic identity, or mutable settlement
 * state; the geometry compiler supplies those joins through instances.
 */

import { silhouetteForKind } from '../townMap/massing.js';
import {
  addSceneBox,
  addSceneGableRoof,
  addScenePyramidRoof,
  addSceneQuad,
  clampGeometryNumber,
  createSceneMeshBuilder,
  finishSceneMesh,
  geometryNumber,
  geometryRecord,
} from './sceneGeometryMesh.js';

/** @typedef {ReturnType<typeof createSceneMeshBuilder>} SceneGeometryBuilder */

/**
 * Add the smallest recognition marks that distinguish an institution after its
 * primary massing already reads correctly. These are deliberately template
 * geometry, not freestanding scene entities: a mill wheel or inn sign explains
 * an existing canonical building and owns no simulation identity of its own.
 *
 * @param {SceneGeometryBuilder} builder
 * @param {Record<string, unknown>} silhouette
 * @param {number} horizontalVariant
 * @param {number} maxHeight
 */
function addBuildingRecognitionFeatures(
  builder,
  silhouette,
  horizontalVariant,
  maxHeight,
) {
  const parts = Array.isArray(silhouette.parts)
    ? silhouette.parts.map(geometryRecord)
    : [];
  const features = Array.isArray(silhouette.feat)
    ? silhouette.feat.map(geometryRecord)
    : [];

  for (const feature of features) {
    const part = parts[Math.round(geometryNumber(feature.c))];
    if (!part) continue;
    const centerX = horizontalVariant * geometryNumber(part.dx) / 2;
    const centerZ = geometryNumber(part.dy) / 2;
    const halfWidth = clampGeometryNumber(
      geometryNumber(part.hw, 0.8) / 2,
      0.04,
      0.5,
    );
    const halfDepth = clampGeometryNumber(
      geometryNumber(part.hd, 0.8) / 2,
      0.04,
      0.5,
    );
    const top = clampGeometryNumber(
      geometryNumber(part.hMul, 1) / maxHeight,
      0.18,
      1,
    );
    const kind = String(feature.t || '');

    if (kind === 'cross') {
      // The cross rises only a small distance beyond the normalized mass. Scene
      // bounds reserve that headroom, so camera and fog math remain exact.
      addSceneBox(
        builder,
        centerX - 0.025,
        centerX + 0.025,
        top - 0.02,
        top + 0.16,
        centerZ - 0.025,
        centerZ + 0.025,
        'detail',
      );
      addSceneBox(
        builder,
        centerX - 0.11,
        centerX + 0.11,
        top + 0.065,
        top + 0.11,
        centerZ - 0.025,
        centerZ + 0.025,
        'detail',
      );
    } else if (kind === 'wheel') {
      addVerticalWheel(
        builder,
        centerX + horizontalVariant * (halfWidth + 0.035),
        0.38,
        centerZ,
        0.29,
        'detail',
      );
    } else if (kind === 'sign') {
      const signX = centerX + horizontalVariant * (halfWidth + 0.09);
      const signZ = centerZ + halfDepth * 0.7;
      addSceneBox(
        builder,
        signX - 0.025,
        signX + 0.025,
        0,
        0.62,
        signZ - 0.025,
        signZ + 0.025,
        'detail',
      );
      addSceneBox(
        builder,
        signX - 0.15,
        signX + 0.15,
        0.39,
        0.57,
        signZ - 0.035,
        signZ + 0.035,
        'detail',
      );
    } else if (kind === 'smoke') {
      // The authored `smoke` feature means “readable chimney”; the fixed
      // portrait does not invent a live fire or animated weather state.
      addSceneBox(
        builder,
        centerX - halfWidth * 0.72,
        centerX + halfWidth * 0.72,
        top - 0.015,
        Math.min(1.14, top + 0.04),
        centerZ - halfDepth * 0.72,
        centerZ + halfDepth * 0.72,
        'detail',
      );
    } else if (kind === 'jetty') {
      const direction = horizontalVariant;
      const inner = centerX + direction * Math.max(0.08, halfWidth * 0.35);
      const outer = centerX + direction * Math.min(0.62, halfWidth + 0.34);
      addSceneBox(
        builder,
        Math.min(inner, outer),
        Math.max(inner, outer),
        0.03,
        0.10,
        centerZ - Math.max(0.12, halfDepth * 0.32),
        centerZ + Math.max(0.12, halfDepth * 0.32),
        'detail',
      );
    }
  }
}

/**
 * Add a thin, closed octagonal wheel in the local Y/Z plane. A true ring stays
 * recognizable from oblique cameras where crossed rectangular bars collapse.
 *
 * @param {SceneGeometryBuilder} builder
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} centerZ
 * @param {number} radius
 * @param {string} role
 */
function addVerticalWheel(
  builder,
  centerX,
  centerY,
  centerZ,
  radius,
  role,
) {
  const directions = [
    [0, -1],
    [0.707, -0.707],
    [1, 0],
    [0.707, 0.707],
    [0, 1],
    [-0.707, 0.707],
    [-1, 0],
    [-0.707, -0.707],
  ];
  const halfThickness = 0.025;
  const innerRadius = radius * 0.62;
  for (let index = 0; index < directions.length; index++) {
    const current = directions[index];
    const next = directions[(index + 1) % directions.length];
    const outerA = /** @type {[number, number, number]} */ ([
      centerX - halfThickness,
      centerY + current[0] * radius,
      centerZ + current[1] * radius,
    ]);
    const outerB = /** @type {[number, number, number]} */ ([
      centerX - halfThickness,
      centerY + next[0] * radius,
      centerZ + next[1] * radius,
    ]);
    const innerB = /** @type {[number, number, number]} */ ([
      centerX - halfThickness,
      centerY + next[0] * innerRadius,
      centerZ + next[1] * innerRadius,
    ]);
    const innerA = /** @type {[number, number, number]} */ ([
      centerX - halfThickness,
      centerY + current[0] * innerRadius,
      centerZ + current[1] * innerRadius,
    ]);
    const backOuterA = /** @type {[number, number, number]} */ ([
      centerX + halfThickness,
      outerA[1],
      outerA[2],
    ]);
    const backOuterB = /** @type {[number, number, number]} */ ([
      centerX + halfThickness,
      outerB[1],
      outerB[2],
    ]);
    const backInnerB = /** @type {[number, number, number]} */ ([
      centerX + halfThickness,
      innerB[1],
      innerB[2],
    ]);
    const backInnerA = /** @type {[number, number, number]} */ ([
      centerX + halfThickness,
      innerA[1],
      innerA[2],
    ]);
    addSceneQuad(builder, outerA, innerA, innerB, outerB, 0.9, role);
    addSceneQuad(
      builder,
      backOuterB,
      backInnerB,
      backInnerA,
      backOuterA,
      0.9,
      role,
    );
    addSceneQuad(
      builder,
      outerB,
      backOuterB,
      backOuterA,
      outerA,
      0.82,
      role,
    );
    addSceneQuad(
      builder,
      innerA,
      backInnerA,
      backInnerB,
      innerB,
      0.82,
      role,
    );
  }
  addSceneBox(
    builder,
    centerX - 0.06,
    centerX + 0.06,
    centerY - 0.045,
    centerY + 0.045,
    centerZ - 0.045,
    centerZ + 0.045,
    role,
  );
}

/** Build one normalized, reusable building template for a concrete LOD. */
/** @param {string} shapeKind @param {string} variantId @param {number} lod */
export function buildingTemplate(shapeKind, variantId, lod) {
  const builder = createSceneMeshBuilder();
  const silhouette = silhouetteForKind(shapeKind);
  // LOD0 is shared across variants, but it is not a featureless cube. Roofline
  // and primary massing are the minimum recognition contract; LOD1 adds bounded
  // secondary detail and LOD2 adds role marks such as wheels, signs, and crosses.
  const horizontalVariant = lod < 2
    ? 1
    : variantId === 'mirror' ? -1 : 1;
  const parts = silhouette.parts;
  let maxHeight = 1;
  for (const part of parts) {
    maxHeight = Math.max(maxHeight, geometryNumber(part.hMul, 1));
  }
  for (const part of parts) {
    // Mirroring authored part centers preserves footprint, scale, canonical
    // position, and simulation joins while producing a distinct silhouette.
    const cx = horizontalVariant * geometryNumber(part.dx) / 2;
    const cz = geometryNumber(part.dy) / 2;
    const halfW = clampGeometryNumber(geometryNumber(part.hw, 0.8) / 2, 0.04, 0.5);
    const halfD = clampGeometryNumber(geometryNumber(part.hd, 0.8) / 2, 0.04, 0.5);
    const roof = String(part.roof || 'gable');
    const roofShare = roof !== 'flat'
      ? (roof === 'spire' ? 0.42 : 0.22)
      : 0;
    const totalHeight = clampGeometryNumber(
      geometryNumber(part.hMul, 1) / maxHeight,
      0.18,
      1,
    );
    const eave = totalHeight * (1 - roofShare);
    addSceneBox(
      builder,
      cx - halfW,
      cx + halfW,
      0,
      eave,
      cz - halfD,
      cz + halfD,
      'structure',
    );
    if (roofShare > 0) {
      if (roof === 'gable' || roof === 'wheelhouse') {
        addSceneGableRoof(
          builder,
          cx - halfW,
          cx + halfW,
          eave,
          totalHeight,
          cz - halfD,
          cz + halfD,
        );
      } else {
        addScenePyramidRoof(
          builder,
          cx - halfW,
          cx + halfW,
          eave,
          totalHeight,
          cz - halfD,
          cz + halfD,
        );
      }
    }
  }
  if (lod >= 1) {
    // Centered one-part houses are symmetric, so this bounded side mass gives
    // every admitted variant real geometry without changing canonical footprint.
    const detailCenterX = horizontalVariant * 0.34;
    addSceneBox(
      builder,
      detailCenterX - 0.12,
      detailCenterX + 0.12,
      0,
      0.34,
      0.02,
      0.36,
      'detail',
    );
  }
  if (lod >= 2) {
    addBuildingRecognitionFeatures(
      builder,
      /** @type {Record<string, unknown>} */ (silhouette),
      horizontalVariant,
      maxHeight,
    );
  }
  return finishSceneMesh(builder, {
    // LOD0/1 share one medium-distance template. Cosmetic mirror geometry is
    // admitted at LOD2, keeping the full vocabulary below the mesh ceiling.
    id: `template:building:${shapeKind}:${lod < 2 ? 'base' : variantId}:lod${lod}`,
    kind: 'building',
    lod,
  });
}

/** Build a shared low-poly vegetation template. */
/** @param {string} kind @param {number} lod */
export function vegetationTemplate(kind, lod) {
  const builder = createSceneMeshBuilder();
  if (kind === 'reed') {
    const stems = lod === 0 ? 1 : 3;
    for (let i = 0; i < stems; i++) {
      const x = stems === 1 ? 0 : (i - 1) * 0.15;
      addSceneBox(builder, x - 0.035, x + 0.035, 0, 1, -0.035, 0.035, null);
    }
  } else if (kind === 'scrub') {
    addScenePyramidRoof(builder, -0.48, 0.48, 0, 0.7, -0.48, 0.48);
  } else {
    addSceneBox(builder, -0.08, 0.08, 0, 0.42, -0.08, 0.08, null);
    if (lod === 0) {
      addScenePyramidRoof(builder, -0.38, 0.38, 0.32, 1, -0.38, 0.38);
    } else {
      addScenePyramidRoof(builder, -0.48, 0.48, 0.25, 0.72, -0.48, 0.48);
      addScenePyramidRoof(builder, -0.38, 0.38, 0.55, 1, -0.38, 0.38);
    }
  }
  return finishSceneMesh(builder, {
    id: `template:vegetation:${kind}:lod${lod}`,
    kind: 'vegetation',
    lod,
  });
}
