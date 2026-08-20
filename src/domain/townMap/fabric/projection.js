/** Fixed-survey projection and the shared screen/export draw-op seam. */

import { EXPORT_PALETTE } from '../../../design/townMapExportPalette.js';
import { drawListToSvg } from '../townMapDraw.js';
import {
  canonicalArtifactRef,
  canonicalRectBounds,
  requireCanonicalRecord,
  sealCanonicalArtifact,
} from './foundation.js';
import {
  COMPOSITE_SHAPE_LAW_VERSION,
  SHAPE_COORDINATE_ABI,
} from './shapes.js';

const FIXED_DIRECTION_Q = Object.freeze([2, 1]);
const FIXED_SHADOW_DENOMINATOR_Q = 4;

export const FIXED_SURVEY_LIGHT_V1 = sealCanonicalArtifact({
  artifactKind: 'PROJECTION_LIGHT_PROFILE',
  artifactId: 'light:fixed-survey:v1',
  profileVersion: 1,
  mode: 'FIXED_SURVEY',
  directionQ: FIXED_DIRECTION_Q,
  shadowRunDenominatorQ: FIXED_SHADOW_DENOMINATOR_Q,
});

/** @param {Record<string,unknown>} mass */
function massGeometry(mass) {
  const geometry = requireCanonicalRecord(mass.geometry, 'mass.geometry');
  if (geometry.artifactKind !== 'BUILDING_GEOMETRY') throw new TypeError('projection requires building geometry');
  return geometry;
}

/** @param {Record<string,unknown>} geometry */
function ridgeSegment(geometry) {
  if (geometry.lawVersion === COMPOSITE_SHAPE_LAW_VERSION) return null;
  const roof = requireCanonicalRecord(geometry.roof, 'geometry.roof');
  if (roof.kind !== 'GABLE') return null;
  const bounds = canonicalRectBounds(geometry.footprint, 'geometry.footprint');
  if (roof.ridgeAxis === 'X') {
    const midZ = Math.floor((bounds.minZ + bounds.maxZ) / 2);
    return [[bounds.minX, midZ], [bounds.maxX, midZ]];
  }
  const midX = Math.floor((bounds.minX + bounds.maxX) / 2);
  return [[midX, bounds.minZ], [midX, bounds.maxZ]];
}

/** @param {[number,number]} origin @param {[number,number]} a @param {[number,number]} b */
function turn(origin, a, b) {
  return (a[0] - origin[0]) * (b[1] - origin[1])
    - (a[1] - origin[1]) * (b[0] - origin[0]);
}

/** @param {Array<[number,number]>} points */
function convexHull(points) {
  const sorted = [...new Map(points.map((point) => [JSON.stringify(point), point])).values()]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (sorted.length < 3) throw new TypeError('projected shell silhouette must contain three points');
  const lower = [];
  for (const point of sorted) {
    while (lower.length >= 2 && turn(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper = [];
  for (const point of [...sorted].reverse()) {
    while (upper.length >= 2 && turn(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** @param {Record<string,unknown>} geometry */
function shadowPolygon(geometry) {
  if (geometry.lawVersion === COMPOSITE_SHAPE_LAW_VERSION) {
    if (geometry.coordinateAbiVersion !== SHAPE_COORDINATE_ABI || !Array.isArray(geometry.shell)) {
      throw new TypeError('composite shadow requires its exact coordinate ABI and shell');
    }
    const projected = geometry.shell.flatMap((value) => {
      const patch = requireCanonicalRecord(value, 'shape shell patch');
      if (!Array.isArray(patch.vertices)) throw new TypeError('shape shell patch vertices are required');
      return patch.vertices.map((vertex) => {
        if (!Array.isArray(vertex) || vertex.length !== 3 || vertex.some((axis) => !Number.isSafeInteger(axis))) {
          throw new TypeError('shape shell vertices must be quantized [x,y,z]');
        }
        return /** @type {[number,number]} */ ([
          vertex[0] + Math.floor(vertex[2] * FIXED_DIRECTION_Q[0] / FIXED_SHADOW_DENOMINATOR_Q),
          vertex[1] + Math.floor(vertex[2] * FIXED_DIRECTION_Q[1] / FIXED_SHADOW_DENOMINATOR_Q),
        ]);
      });
    });
    return convexHull(projected);
  }
  const heightQ = Number(geometry.maxHeightQ);
  const dx = Math.floor(heightQ * FIXED_DIRECTION_Q[0] / FIXED_SHADOW_DENOMINATOR_Q);
  const dz = Math.floor(heightQ * FIXED_DIRECTION_Q[1] / FIXED_SHADOW_DENOMINATOR_Q);
  return /** @type {Array<[number,number]>} */ (geometry.footprint).map((point) => [point[0] + dx, point[1] + dz]);
}

/** @param {Record<string,unknown>} geometry @returns {Array<{surfaceId:string,ring:Array<[number,number]>}>} */
function planSurfaces(geometry) {
  if (geometry.lawVersion !== COMPOSITE_SHAPE_LAW_VERSION) {
    return [{
      surfaceId: 'legacy',
      ring: /** @type {Array<[number,number]>} */ (geometry.footprint),
    }];
  }
  if (!Array.isArray(geometry.projectionSurfaces) || geometry.projectionSurfaces.length !== 2
    || !Array.isArray(geometry.shell)) {
    throw new TypeError('composite geometry requires two canonical plan surfaces');
  }
  const patchById = new Map(geometry.shell.map((value) => {
    const patch = requireCanonicalRecord(value, 'shape shell patch');
    return [String(patch.patchId), patch];
  }));
  return geometry.projectionSurfaces.map((value) => {
    const surface = requireCanonicalRecord(value, 'plan surface');
    const patch = patchById.get(String(surface.sourcePatchId));
    if (!patch || !Array.isArray(patch.vertices) || patch.vertices.length < 4) {
      throw new TypeError('plan surface must resolve one canonical shell patch');
    }
    return {
      surfaceId: String(surface.surfaceId),
      ring: patch.vertices.map((vertex) => /** @type {[number,number]} */ ([vertex[0], vertex[1]])),
    };
  });
}

/** @param {string} primitiveId @param {string} semanticId @param {string} kind @param {Record<string,unknown>} op */
function primitive(primitiveId, semanticId, kind, op) {
  return { primitiveId, semanticId, kind, op };
}

/**
 * Audience filtering happens before any building draw op or unresolved warning
 * exists. Package metadata is never copied into a primitive.
 * @param {{document:Record<string,unknown>,resolutionReport:Record<string,unknown>,audience:'PUBLIC'|'DM'}} input
 */
export function projectFirstSliceFixedSurvey(input) {
  const source = requireCanonicalRecord(input, 'projection input');
  const mapArtifact = requireCanonicalRecord(source.document, 'map artifact');
  const report = requireCanonicalRecord(source.resolutionReport, 'resolutionReport');
  const audience = source.audience;
  if (!['PUBLIC', 'DM'].includes(String(audience))) throw new TypeError('audience must be PUBLIC or DM');
  const foundation = requireCanonicalRecord(mapArtifact.foundation, 'map artifact.foundation');
  const subdivision = requireCanonicalRecord(mapArtifact.subdivision, 'map artifact.subdivision');
  const blocks = /** @type {Array<Record<string,unknown>>} */ (foundation.blockFaces);
  const frontages = /** @type {Array<Record<string,unknown>>} */ (subdivision.frontages);
  const masses = /** @type {Array<Record<string,unknown>>} */ (mapArtifact.masses);
  const visibleMasses = masses.filter((mass) => audience === 'DM' || massGeometry(mass).privacy === 'PUBLIC');
  const visibleIds = new Set(visibleMasses.map((mass) => String(massGeometry(mass).buildingId)));
  const unresolvedRows = Array.isArray(report.unresolved) ? report.unresolved : [];
  const unresolvedVisible = new Set(unresolvedRows
    .map((row) => requireCanonicalRecord(row, 'unresolved row'))
    .map((row) => requireCanonicalRecord(row.subject, 'unresolved subject'))
    .map((subject) => String(subject.entityId))
    .filter((entityId) => visibleIds.has(entityId)));
  const semanticPrimitives = [];

  for (const block of blocks) {
    semanticPrimitives.push(primitive(
      `block:${block.blockId}`,
      String(block.blockId),
      'GROUND',
      { t: 'poly', pts: block.ring, closed: true, fill: EXPORT_PALETTE.parchment, stroke: EXPORT_PALETTE.muted, strokeWidth: 1 },
    ));
  }
  for (const frontage of frontages) {
    const segment = /** @type {Array<[number,number]>} */ (frontage.segment);
    semanticPrimitives.push(primitive(
      String(frontage.frontageId),
      String(frontage.plotId),
      'FRONTAGE',
      { t: 'line', x1: segment[0][0], y1: segment[0][1], x2: segment[1][0], y2: segment[1][1], stroke: EXPORT_PALETTE.street, strokeWidth: 2 },
    ));
  }
  for (const mass of visibleMasses) {
    const geometry = massGeometry(mass);
    const buildingId = String(geometry.buildingId);
    semanticPrimitives.push(primitive(
      `${buildingId}:shadow`, buildingId, 'SHADOW',
      { t: 'poly', pts: shadowPolygon(geometry), closed: true, fill: EXPORT_PALETTE.ink, fillOpacity: 0.16 },
    ));
    for (const surface of planSurfaces(geometry)) {
      const suffix = surface.surfaceId === 'legacy' ? '' : `:${String(surface.surfaceId)}`;
      semanticPrimitives.push(primitive(
        `${buildingId}:surface${suffix}`, buildingId, 'BUILDING',
        { t: 'poly', pts: surface.ring, closed: true, fill: EXPORT_PALETTE.buildingFill, stroke: EXPORT_PALETTE.ink, strokeWidth: 2 },
      ));
    }
    const ridge = ridgeSegment(geometry);
    if (ridge) {
      semanticPrimitives.push(primitive(
        `${buildingId}:ridge`, buildingId, 'ROOF_RIDGE',
        { t: 'line', x1: ridge[0][0], y1: ridge[0][1], x2: ridge[1][0], y2: ridge[1][1], stroke: EXPORT_PALETTE.muted, strokeWidth: 1 },
      ));
    }
    if (unresolvedVisible.has(buildingId)) {
      const bounds = canonicalRectBounds(geometry.footprint, 'warning footprint');
      semanticPrimitives.push(primitive(
        `${buildingId}:unresolved`, buildingId, 'UNRESOLVED_CUSTOM_CONTENT',
        {
          t: 'circle',
          cx: Math.floor((bounds.minX + bounds.maxX) / 2),
          cy: Math.floor((bounds.minZ + bounds.maxZ) / 2),
          r: 8,
          fill: EXPORT_PALETTE.anchor,
          stroke: EXPORT_PALETTE.ink,
          strokeWidth: 2,
        },
      ));
    }
  }
  const drawOps = semanticPrimitives.map((row) => row.op);
  const sourceAuthority = audience === 'DM'
    ? {
      kind: 'DM_CANONICAL',
      documentRef: canonicalArtifactRef(mapArtifact),
      contentResolutionReportRef: canonicalArtifactRef(report),
    }
    : {
      kind: 'PUBLIC_DERIVATION',
      publicInputRef: canonicalArtifactRef(sealCanonicalArtifact({
        artifactKind: 'PUBLIC_PROJECTION_INPUT',
        artifactId: `${mapArtifact.artifactId}:public-input`,
        foundationRef: canonicalArtifactRef(foundation),
        subdivisionRef: canonicalArtifactRef(subdivision),
        visibleGeometryRefs: visibleMasses.map((mass) => canonicalArtifactRef(massGeometry(mass))),
        unresolvedVisibleEntityIds: [...unresolvedVisible].sort(),
      })),
    };
  return sealCanonicalArtifact({
    artifactKind: 'FIRST_SLICE_PROJECTION',
    artifactId: `${mapArtifact.artifactId}:projection:${String(audience).toLowerCase()}`,
    sourceAuthority,
    lightProfile: FIXED_SURVEY_LIGHT_V1,
    audience,
    semanticPrimitives,
    drawOps,
    warnings: [...unresolvedVisible].map((entityId) => ({ code: 'UNRESOLVED_CUSTOM_CONTENT', entityId })),
  });
}

/** @param {Record<string,unknown>} projection */
export function firstSliceScreenDrawOps(projection) {
  return projection.drawOps;
}

/** @param {Record<string,unknown>} projection @param {{width?:number,height?:number}} [options] */
export function firstSliceProjectionToSvg(projection, options = {}) {
  if (!Array.isArray(projection.drawOps)) throw new TypeError('projection.drawOps must be an array');
  return drawListToSvg(/** @type {Parameters<typeof drawListToSvg>[0]} */ (projection.drawOps), {
    width: options.width,
    height: options.height,
    background: EXPORT_PALETTE.parchment,
  });
}
