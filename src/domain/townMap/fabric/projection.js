/** Fixed-survey projection and the shared screen/export draw-op seam. */

import { EXPORT_PALETTE } from '../../../design/townMapExportPalette.js';
import { drawListToSvg } from '../townMapDraw.js';
import { sceneDigest, stableSceneStringify } from '../../townScene/stableScene.js';
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

// MF-T2G (ODQ §299.3b): the §288-nonconforming PROJECTION_LIGHT_PROFILE record was
// stripped; a conforming fixed-survey profile arrives with D4+ light (§288.8), not here.

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

/** @param {Record<string,unknown>} geometry @param {string} buildingId */
function unresolvedPrimitive(geometry, buildingId) {
  const bounds = canonicalRectBounds(geometry.footprint, 'warning footprint');
  return primitive(`${buildingId}:unresolved`, buildingId, 'UNRESOLVED_CUSTOM_CONTENT', {
    t: 'circle', cx: Math.floor((bounds.minX + bounds.maxX) / 2),
    cy: Math.floor((bounds.minZ + bounds.maxZ) / 2), r: 8,
    fill: EXPORT_PALETTE.anchor, stroke: EXPORT_PALETTE.ink, strokeWidth: 2,
  });
}

/** @param {Record<string,unknown>} artifact @param {string} label */
function requireArtifactDigest(artifact, label) {
  const { contentHash, ...body } = artifact;
  if (typeof contentHash !== 'string' || contentHash !== sceneDigest(body)) {
    throw new TypeError(`${label} contentHash mismatch`);
  }
}

/** @param {unknown} left @param {unknown} right */
function sameCanonical(left, right) { return stableSceneStringify(left) === stableSceneStringify(right); }

/** @param {unknown} value */
function isExactCommittedRef(value) {
  const ref = requireCanonicalRecord(value, 'committed artifact ref');
  return Object.keys(ref).length === 2 && sameCanonical(ref, canonicalArtifactRef(ref));
}

/**
 * Sole fixed-survey core. Audience filtering happens before any building draw
 * op, warning, or source authority exists.
 * @param {Record<string,unknown>} input
 */
export function projectResolvedFirstSliceFixedSurvey(input) {
  const source = requireCanonicalRecord(input, 'resolved projection input');
  const audience = source.audience;
  if (!['PUBLIC', 'DM'].includes(String(audience))) throw new TypeError('audience must be PUBLIC or DM');
  const foundation = requireCanonicalRecord(source.foundation, 'projection foundation');
  const subdivision = requireCanonicalRecord(source.frontageSubdivision, 'projection frontageSubdivision');
  const blocks = /** @type {Array<Record<string,unknown>>} */ (foundation.blockFaces);
  const frontages = /** @type {Array<Record<string,unknown>>} */ (subdivision.frontages);
  const masses = /** @type {Array<Record<string,unknown>>} */ (source.masses);
  const descriptor = requireCanonicalRecord(source.sourceDescriptor, 'projection sourceDescriptor');
  let constructionAuthority = null; if (descriptor.kind === 'MASSING_CONSTRUCTION_STATE') {
    const beforeDocument = requireCanonicalRecord(descriptor.beforeDocument, 'before document'); const report = requireCanonicalRecord(descriptor.resolutionReport, 'resolutionReport');
    const state = requireCanonicalRecord(descriptor.constructionState, 'construction state'); const receipt = requireCanonicalRecord(descriptor.receipt, 'construction receipt');
    for (const [artifact, label] of /** @type {Array<[Record<string,unknown>,string]>} */ ([[beforeDocument, 'before document'], [report, 'resolutionReport'], [state, 'construction state'], [receipt, 'construction receipt']])) requireArtifactDigest(artifact, label);
    const bundle = requireCanonicalRecord(beforeDocument.massingBundle, 'before massingBundle'); const roster = requireCanonicalRecord(bundle.massingRoster, 'before massingRoster');
    const compileInput = requireCanonicalRecord(beforeDocument.massingCompileInput, 'before massingCompileInput'); const changes = Array.isArray(state.changeOperationRefs) ? state.changeOperationRefs : [];
    const stateMasses = Array.isArray(state.buildingMasses) ? state.buildingMasses : []; const effect = requireCanonicalRecord(receipt.effect, 'receipt.effect');
    const baseMasses = Array.isArray(bundle.buildingMasses) ? bundle.buildingMasses : [];
    const basePreserved = baseMasses.length === 2 && baseMasses.every((base) => stateMasses.filter((mass) => sameCanonical(base, mass)).length === 1);
    const addedMasses = stateMasses.filter((mass) => !baseMasses.some((base) => sameCanonical(base, mass)));
    const massIds = stateMasses.map((mass) => String(massGeometry(requireCanonicalRecord(mass, 'state mass')).buildingId));
    const effected = stateMasses.filter((mass) => sameCanonical(canonicalArtifactRef(requireCanonicalRecord(mass, 'state mass')), effect.massRef)); const effectGeometry = effected.length === 1 ? massGeometry(effected[0]) : {};
    if (descriptor.lawVersion !== 'mf-t1x-first-slice-massing-construction-fixed-survey-v1'
      || beforeDocument.artifactKind !== 'FIRST_SLICE_MASSING_DOCUMENT' || beforeDocument.schemaVersion !== 1 || beforeDocument.lawVersion !== 'mf-t1s-first-slice-massing-document-v1'
      || report.artifactKind !== 'CONTENT_RESOLUTION_REPORT'
      || state.artifactKind !== 'FIRST_SLICE_MASSING_CONSTRUCTION_STATE' || state.schemaVersion !== 1 || state.lawVersion !== 'mf-t1x-first-slice-massing-construction-state-v1'
      || receipt.artifactKind !== 'FANTASY_CONSTRUCTION_RECEIPT' || receipt.schemaVersion !== 1 || receipt.lawVersion !== state.lawVersion
      || !sameCanonical(report.sourceDocumentRef, canonicalArtifactRef(beforeDocument))
      || !sameCanonical(state.beforeDocumentRef, canonicalArtifactRef(beforeDocument)) || !sameCanonical(state.baseMassingRosterRef, canonicalArtifactRef(roster))
      || changes.length !== 1 || !sameCanonical(changes[0], receipt.operationRef) || !isExactCommittedRef(changes[0]) || !isExactCommittedRef(receipt.mechanismRef)
      || stateMasses.length !== 3 || !basePreserved || new Set(massIds).size !== 3 || !sameCanonical(massIds, [...massIds].sort())
      || !Array.isArray(source.unresolvedEntityIds) || source.unresolvedEntityIds.length !== 0 || !Array.isArray(report.unresolved) || report.unresolved.length !== 0
      || !sameCanonical(receipt.beforeDocumentRef, canonicalArtifactRef(beforeDocument)) || !sameCanonical(receipt.afterConstructionStateRef, canonicalArtifactRef(state))
      || !sameCanonical(Object.keys(effect).sort(), ['buildingId', 'kind', 'massRef', 'plotRef']) || effect.kind !== 'BUILDING_ADDED' || addedMasses.length !== 1 || effected.length !== 1 || !sameCanonical(effected[0], addedMasses[0]) || effect.buildingId !== effectGeometry.buildingId || !sameCanonical(effect.plotRef, effectGeometry.plotRef)
      || !sameCanonical(foundation, compileInput.foundation) || !sameCanonical(subdivision, compileInput.frontageSubdivision) || !sameCanonical(masses, stateMasses)) {
      throw new TypeError('massing construction projection descriptor is invalid');
    }
    constructionAuthority = { beforeDocument, report, state, receipt, roster };
  }
  const visibleMasses = masses.filter((mass) => audience === 'DM' || massGeometry(mass).privacy === 'PUBLIC');
  const visibleIds = new Set(visibleMasses.map((mass) => String(massGeometry(mass).buildingId)));
  const unresolvedVisible = new Set((Array.isArray(source.unresolvedEntityIds)
    ? source.unresolvedEntityIds : []).map(String).filter((entityId) => visibleIds.has(entityId)));
  const unresolvedVisibleIds = [...unresolvedVisible];
  if (descriptor.kind === 'MASSING_DOCUMENT') unresolvedVisibleIds.sort();
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
    if (descriptor.kind !== 'MASSING_DOCUMENT' && unresolvedVisible.has(buildingId)) {
      semanticPrimitives.push(unresolvedPrimitive(geometry, buildingId));
    }
  }
  if (descriptor.kind === 'MASSING_DOCUMENT') {
    for (const entityId of unresolvedVisibleIds) {
      const mass = visibleMasses.find((row) => String(massGeometry(row).buildingId) === entityId);
      if (mass) semanticPrimitives.push(unresolvedPrimitive(massGeometry(mass), entityId));
    }
  }
  const drawOps = semanticPrimitives.map((row) => row.op);
  let sourceAuthority;
  let artifactId;
  if (descriptor.kind === 'DOCUMENT') {
    const mapArtifact = requireCanonicalRecord(descriptor.document, 'map artifact');
    const report = requireCanonicalRecord(descriptor.resolutionReport, 'resolutionReport');
    sourceAuthority = audience === 'DM'
      ? {
        kind: 'DM_CANONICAL', documentRef: canonicalArtifactRef(mapArtifact),
        contentResolutionReportRef: canonicalArtifactRef(report),
      }
      : {
        kind: 'PUBLIC_DERIVATION',
        publicInputRef: canonicalArtifactRef(sealCanonicalArtifact({
          artifactKind: 'PUBLIC_PROJECTION_INPUT', artifactId: `${mapArtifact.artifactId}:public-input`,
          foundationRef: canonicalArtifactRef(foundation), subdivisionRef: canonicalArtifactRef(subdivision),
          visibleGeometryRefs: visibleMasses.map((mass) => canonicalArtifactRef(massGeometry(mass))),
          unresolvedVisibleEntityIds: [...unresolvedVisible].sort(),
        })),
      };
    artifactId = `${mapArtifact.artifactId}:projection:${String(audience).toLowerCase()}`;
  } else if (descriptor.kind === 'MASSING') {
    const roster = requireCanonicalRecord(descriptor.massingRoster, 'massingRoster');
    const lawVersion = String(descriptor.lawVersion);
    sourceAuthority = audience === 'DM'
      ? { kind: 'DM_MASSING_ROSTER', lawVersion, massingRosterRef: canonicalArtifactRef(roster) }
      : {
        kind: 'PUBLIC_MASSING_DERIVATION', lawVersion,
        firstSliceFabricRootRef: roster.firstSliceFabricRootRef,
        foundationRef: canonicalArtifactRef(foundation),
        frontageSubdivisionRef: canonicalArtifactRef(subdivision),
        visibleGeometryRefs: visibleMasses.map((mass) => canonicalArtifactRef(massGeometry(mass))),
      };
    artifactId = `projection:${String(audience).toLowerCase()}:${sceneDigest({
      domain: lawVersion, audience, sourceAuthority,
    })}`;
  } else if (descriptor.kind === 'MASSING_DOCUMENT') {
    const massingDocument = requireCanonicalRecord(descriptor.document, 'massing document');
    const report = requireCanonicalRecord(descriptor.resolutionReport, 'resolutionReport');
    const lawVersion = String(descriptor.lawVersion);
    requireArtifactDigest(massingDocument, 'massing document');
    requireArtifactDigest(report, 'resolutionReport');
    if (massingDocument.artifactKind !== 'FIRST_SLICE_MASSING_DOCUMENT' || report.artifactKind !== 'CONTENT_RESOLUTION_REPORT' || lawVersion !== 'mf-t1s-first-slice-massing-document-fixed-survey-v1') {
      throw new TypeError('massing document projection descriptor is invalid');
    }
    if (stableSceneStringify(report.sourceDocumentRef)
      !== stableSceneStringify(canonicalArtifactRef(massingDocument))) {
      throw new TypeError('resolutionReport belongs to another massing document');
    }
    const compileInput = requireCanonicalRecord(massingDocument.massingCompileInput, 'massingCompileInput');
    const bundle = requireCanonicalRecord(massingDocument.massingBundle, 'massingBundle');
    if (stableSceneStringify(foundation) !== stableSceneStringify(compileInput.foundation)
      || stableSceneStringify(subdivision) !== stableSceneStringify(compileInput.frontageSubdivision)
      || stableSceneStringify(masses) !== stableSceneStringify(bundle.buildingMasses)) {
      throw new TypeError('massing document projection inputs do not match the document');
    }
    sourceAuthority = audience === 'DM'
      ? {
        kind: 'DM_MASSING_DOCUMENT', lawVersion,
        documentRef: canonicalArtifactRef(massingDocument), contentResolutionReportRef: canonicalArtifactRef(report),
      }
      : {
        kind: 'PUBLIC_MASSING_DOCUMENT_DERIVATION', lawVersion,
        firstSliceFabricRootRef: requireCanonicalRecord(bundle.massingRoster, 'massingRoster').firstSliceFabricRootRef,
        foundationRef: canonicalArtifactRef(requireCanonicalRecord(compileInput.foundation, 'document foundation')),
        frontageSubdivisionRef: canonicalArtifactRef(requireCanonicalRecord(compileInput.frontageSubdivision, 'document frontageSubdivision')),
        visibleGeometryRefs: visibleMasses.map((mass) => canonicalArtifactRef(massGeometry(mass))),
        unresolvedVisibleEntityIds: unresolvedVisibleIds,
      };
    artifactId = `projection:${String(audience).toLowerCase()}:${sceneDigest({
      domain: lawVersion, audience, sourceAuthority,
    })}`;
  } else if (constructionAuthority) {
    const { beforeDocument, report, state, receipt, roster } = constructionAuthority;
    const lawVersion = String(descriptor.lawVersion);
    if (audience === 'DM') {
      sourceAuthority = {
        kind: 'DM_MASSING_CONSTRUCTION_STATE', lawVersion,
        documentRef: canonicalArtifactRef(beforeDocument), contentResolutionReportRef: canonicalArtifactRef(report),
        constructionStateRef: canonicalArtifactRef(state), receiptRef: canonicalArtifactRef(receipt),
      };
    } else {
      const publicLaw = 'mf-t1s-first-slice-massing-document-fixed-survey-v1';
      sourceAuthority = {
        kind: 'PUBLIC_MASSING_DOCUMENT_DERIVATION', lawVersion: publicLaw,
        firstSliceFabricRootRef: roster.firstSliceFabricRootRef,
        foundationRef: canonicalArtifactRef(foundation), frontageSubdivisionRef: canonicalArtifactRef(subdivision),
        visibleGeometryRefs: visibleMasses.map((mass) => canonicalArtifactRef(massGeometry(mass))),
        unresolvedVisibleEntityIds: [],
      };
      artifactId = `projection:public:${sceneDigest({ domain: publicLaw, audience, sourceAuthority })}`;
    }
    if (audience === 'DM') artifactId = `projection:dm:${sceneDigest({ domain: lawVersion, audience, sourceAuthority })}`;
  } else {
    throw new TypeError('projection sourceDescriptor kind is not supported');
  }
  return sealCanonicalArtifact({
    artifactKind: 'FIRST_SLICE_PROJECTION',
    artifactId,
    sourceAuthority,
    audience,
    semanticPrimitives,
    drawOps,
    warnings: unresolvedVisibleIds.map((entityId) => ({ code: 'UNRESOLVED_CUSTOM_CONTENT', entityId })),
  });
}

/** @param {{document:Record<string,unknown>,resolutionReport:Record<string,unknown>,audience:'PUBLIC'|'DM'}} input */
export function projectFirstSliceFixedSurvey(input) {
  const source = requireCanonicalRecord(input, 'projection input');
  const audience = source.audience;
  const mapArtifact = requireCanonicalRecord(
    JSON.parse(stableSceneStringify(source.document)), 'map artifact',
  );
  const report = requireCanonicalRecord(
    JSON.parse(stableSceneStringify(source.resolutionReport)), 'resolutionReport',
  );
  requireArtifactDigest(mapArtifact, 'map artifact');
  requireArtifactDigest(report, 'resolutionReport');
  if (stableSceneStringify(report.sourceDocumentRef)
    !== stableSceneStringify(canonicalArtifactRef(mapArtifact))) {
    throw new TypeError('resolutionReport belongs to another map artifact');
  }
  const unresolvedEntityIds = (Array.isArray(report.unresolved) ? report.unresolved : [])
    .map((row) => requireCanonicalRecord(row, 'unresolved row'))
    .map((row) => requireCanonicalRecord(row.subject, 'unresolved subject'))
    .map((subject) => String(subject.entityId));
  return projectResolvedFirstSliceFixedSurvey({
    audience,
    foundation: mapArtifact.foundation,
    frontageSubdivision: mapArtifact.subdivision,
    masses: mapArtifact.masses,
    unresolvedEntityIds,
    sourceDescriptor: { kind: 'DOCUMENT', document: mapArtifact, resolutionReport: report },
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
