/** Canonical post-W3 boundary linework for the one admitted orthogonal cross. */

import { compareCodepoint } from '../../deterministicSort.js';
import { sceneDigest, stableSceneStringify } from '../../townScene/stableScene.js';
import {
  CURRENT_MAP_TRADITION_ID, FABRIC_COORDINATE_ABI,
  SETTLEMENT_FABRIC_FOUNDATION_LAW_VERSION, SETTLEMENT_FABRIC_FOUNDATION_SCHEMA_VERSION,
  canonicalArtifactRef, canonicalRectBounds, requireCanonicalId, requireCanonicalInt,
  requireCanonicalRecord, sealCanonicalArtifact, sealFabricFoundation,
} from './foundation.js';
import {
  SETTLEMENT_FRONTAGE_SUBDIVISION_LAW_VERSION, subdivideSettlementFrontages,
} from './frontage.js';
import { ORTHOGONAL_CROSS_PLAN_KIND } from './settlementFoundation.js';
import {
  STREET_GEOMETRY_LAW_VERSION, STREET_GEOMETRY_SCHEMA_VERSION,
  compileOrthogonalCrossStreetGeometry,
} from './streetGeometry.js';

export const CADASTRAL_BOUNDARY_ARRANGEMENT_SCHEMA_VERSION = 1;
export const CADASTRAL_BOUNDARY_ARRANGEMENT_LAW_VERSION =
  'mf-t1a-orthogonal-cross-cadastral-arrangement-v1';

const INPUT_KEYS = Object.freeze([
  'artifactId', 'foundation', 'frontageSubdivision', 'streetGeometry',
]);

/** @typedef {[number,number]} PointQ */

/** @param {unknown} value @param {string} label @param {readonly string[]} keys */
function exactRecord(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  const actual = Object.keys(record).sort(compareCodepoint);
  const expected = [...keys].sort(compareCodepoint);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new TypeError(`${label} must contain exactly ${expected.join(', ')}`);
  }
  return record;
}

/** @param {unknown} value @param {string} label @returns {PointQ} */
function point(value, label) {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new TypeError(`${label} must be an [x,z] point`);
  }
  return [requireCanonicalInt(value[0], `${label}[0]`), requireCanonicalInt(value[1], `${label}[1]`)];
}

/** @param {PointQ} left @param {PointQ} right */
function comparePoint(left, right) {
  return left[0] - right[0] || left[1] - right[1];
}

/** @param {unknown} left @param {unknown} right @param {string} label @returns {[PointQ,PointQ]} */
function canonicalLine(left, right, label) {
  const a = point(left, `${label}.a`); const b = point(right, `${label}.b`);
  if (comparePoint(a, b) === 0) throw new TypeError(`${label} must have positive length`);
  return comparePoint(a, b) < 0 ? [a, b] : [b, a];
}

/** @param {[PointQ,PointQ]} line */
function lineKey(line) { return JSON.stringify(line); }

/** @param {unknown} actual @param {unknown} expected @param {string} label */
function requireCanonicalReplay(actual, expected, label) {
  if (stableSceneStringify(actual) !== stableSceneStringify(expected)) {
    throw new TypeError(`${label} does not replay through its sole compiler`);
  }
}

/** @param {Record<string,unknown>} source @param {ReturnType<typeof canonicalRectBounds>} ground @param {Array<{streetId:string,bounds:ReturnType<typeof canonicalRectBounds>}>} corridors */
function requireFoundationReplay(source, ground, corridors) {
  const vertical = corridors.find((row) => row.bounds.minZ === ground.minZ && row.bounds.maxZ === ground.maxZ);
  const horizontal = corridors.find((row) => row.bounds.minX === ground.minX && row.bounds.maxX === ground.maxX);
  const blocks = /** @type {Array<Record<string,unknown>>} */ (source.blockFaces);
  const edges = /** @type {Array<Record<string,unknown>>} */ (source.streetEdges);
  if (!vertical || !horizontal || !Array.isArray(blocks) || !Array.isArray(edges)) throw new TypeError('one exact cross is required');
  const edgeByBlock = new Map(edges.map((edge) => [edge.blockId, edge]));
  if (blocks.length !== 4 || edges.length !== 4 || edgeByBlock.size !== 4) throw new TypeError('cross requires four exact block-edge pairs');
  const cells = blocks.map((block, index) => {
    const bounds = canonicalRectBounds(block.ring, `blockFaces[${index}].ring`);
    const x = bounds.maxX === vertical.bounds.minX ? 'LOW_X' : bounds.minX === vertical.bounds.maxX ? 'HIGH_X' : null;
    const z = bounds.maxZ === horizontal.bounds.minZ ? 'LOW_Z' : bounds.minZ === horizontal.bounds.maxZ ? 'HIGH_Z' : null;
    const blockId = requireCanonicalId(block.blockId, `blockFaces[${index}].blockId`);
    const edge = edgeByBlock.get(blockId);
    if (!x || !z || !edge) throw new TypeError('block must be one exact corridor complement');
    return { cell: `${x}_${z}`, blockId, edgeId: requireCanonicalId(edge.edgeId, `street edge ${blockId}`) };
  });
  const streetIds = new Set(edges.map((edge) => edge.streetId));
  const frontageAxis = streetIds.size === 1 && streetIds.has(vertical.streetId) ? 'VERTICAL'
    : streetIds.size === 1 && streetIds.has(horizontal.streetId) ? 'HORIZONTAL' : null;
  const setbacks = new Set(edges.map((edge) => edge.setbackQ));
  if (!frontageAxis || setbacks.size !== 1) throw new TypeError('street edges require one frontage axis and setback');
  const replay = sealFabricFoundation(/** @type {Parameters<typeof sealFabricFoundation>[0]} */ (/** @type {unknown} */ ({
    artifactId: source.artifactId, effectiveAt: source.effectiveAt,
    plan: { kind: ORTHOGONAL_CROSS_PLAN_KIND, groundRing: ground.ring,
      verticalStreet: { streetId: vertical.streetId, minXQ: vertical.bounds.minX, maxXQ: vertical.bounds.maxX },
      horizontalStreet: { streetId: horizontal.streetId, minZQ: horizontal.bounds.minZ, maxZQ: horizontal.bounds.maxZ },
      cells, frontageAxis, setbackQ: [...setbacks][0] },
  })));
  requireCanonicalReplay(source, replay, 'foundation');
}

/** @param {[PointQ,PointQ]} line @param {{minX:number,maxX:number,minZ:number,maxZ:number}} bounds */
function liesOnExtent(line, bounds) {
  const [a, b] = line;
  return (a[0] === b[0] && (a[0] === bounds.minX || a[0] === bounds.maxX))
    || (a[1] === b[1] && (a[1] === bounds.minZ || a[1] === bounds.maxZ));
}

/** @param {[PointQ,PointQ]} line @param {Array<{streetId:string,bounds:ReturnType<typeof canonicalRectBounds>}>} corridors */
function streetIdForRow(line, corridors) {
  const [a, b] = line;
  const matches = corridors.filter(({ bounds }) => (
    a[0] === b[0] && (a[0] === bounds.minX || a[0] === bounds.maxX)
  ) || (
    a[1] === b[1] && (a[1] === bounds.minZ || a[1] === bounds.maxZ)
  ));
  if (matches.length !== 1) throw new TypeError('ROW boundary must resolve one street corridor');
  return matches[0].streetId;
}

/** @param {Array<Record<string,unknown>>} boundaries @param {Array<Record<string,unknown>>} plots */
function validateTopology(boundaries, plots) {
  const ids = new Set(); const lines = new Set(); const vertices = new Set();
  const neighbours = new Map(); const plotUses = new Map(); const blockUses = new Map();
  let rowCount = 0; let hardCount = 0; let extentCount = 0; let dividerCount = 0;
  for (const boundary of boundaries) {
    ids.add(boundary.boundaryId); const geometry = /** @type {[PointQ,PointQ]} */ (boundary.geometry);
    lines.add(lineKey(geometry)); const keys = geometry.map((value) => JSON.stringify(value));
    for (const key of keys) { vertices.add(key); if (!neighbours.has(key)) neighbours.set(key, new Set()); }
    neighbours.get(keys[0]).add(keys[1]); neighbours.get(keys[1]).add(keys[0]);
    rowCount += boundary.role === 'STREET_RIGHT_OF_WAY' ? 1 : 0;
    hardCount += boundary.role === 'REGISTERED_HARD_BLOCK' ? 1 : 0;
    const source = /** @type {Record<string,unknown>} */ (boundary.source);
    if (typeof source.blockId === 'string') blockUses.set(source.blockId, (blockUses.get(source.blockId) ?? 0) + 1);
    extentCount += source.kind === 'SETTLEMENT_EXTENT' ? 1 : 0;
    dividerCount += source.kind === 'PARCEL_DIVIDER' ? 1 : 0;
    const members = source.kind === 'PARCEL_DIVIDER' ? source.plotEdges : source.plotEdge ? [source.plotEdge] : [];
    for (const member of /** @type {Array<Record<string,unknown>>} */ (members)) {
      plotUses.set(member.plotId, (plotUses.get(member.plotId) ?? 0) + 1);
    }
  }
  const pending = [vertices.values().next().value]; const reached = new Set();
  while (pending.length) {
    const vertex = pending.pop(); if (reached.has(vertex)) continue; reached.add(vertex);
    pending.push(...neighbours.get(vertex));
  }
  if (boundaries.length !== 32 || ids.size !== 32 || lines.size !== 32 || vertices.size !== 24
    || reached.size !== 24 || rowCount !== 12 || hardCount !== 20
    || extentCount !== 16 || dividerCount !== 4 || boundaries.length - vertices.size + 1 !== 9
    || plots.length !== 8 || plots.some((plot) => plotUses.get(plot.plotId) !== 4)
    || blockUses.size !== 4 || [...blockUses.values()].some((count) => count !== 7)) {
    throw new TypeError('post-W3 arrangement must close at V24/E32/C1 with exact lineage');
  }
}

/**
 * Publish the sole boundary geometry consumed by the later DCEL.
 * @param {unknown} input
 */
export function compileOrthogonalCrossCadastralArrangement(input) {
  const request = exactRecord(input, 'boundary arrangement input', INPUT_KEYS);
  const artifactId = requireCanonicalId(request.artifactId, 'artifactId');
  const foundation = requireCanonicalRecord(request.foundation, 'foundation');
  const subdivision = requireCanonicalRecord(request.frontageSubdivision, 'frontageSubdivision');
  const geometry = requireCanonicalRecord(request.streetGeometry, 'streetGeometry');
  const rebuiltGeometry = compileOrthogonalCrossStreetGeometry({
    artifactId: requireCanonicalId(geometry.artifactId, 'streetGeometry.artifactId'),
    settlementId: requireCanonicalId(geometry.settlementId, 'streetGeometry.settlementId'),
    foundation,
  });
  requireCanonicalReplay(geometry, rebuiltGeometry, 'streetGeometry');
  const rebuiltSubdivision = subdivideSettlementFrontages(
    /** @type {Parameters<typeof subdivideSettlementFrontages>[0]} */ (foundation),
    /** @type {Parameters<typeof subdivideSettlementFrontages>[1]} */ (subdivision.axes),
  );
  requireCanonicalReplay(subdivision, rebuiltSubdivision, 'frontageSubdivision');
  if (foundation.schemaVersion !== SETTLEMENT_FABRIC_FOUNDATION_SCHEMA_VERSION
    || foundation.lawVersion !== SETTLEMENT_FABRIC_FOUNDATION_LAW_VERSION
    || foundation.coordinateAbiVersion !== FABRIC_COORDINATE_ABI
    || foundation.mapTraditionId !== CURRENT_MAP_TRADITION_ID
    || foundation.planKind !== ORTHOGONAL_CROSS_PLAN_KIND || foundation.leafIndex !== 0
    || subdivision.lawVersion !== SETTLEMENT_FRONTAGE_SUBDIVISION_LAW_VERSION
    || geometry.schemaVersion !== STREET_GEOMETRY_SCHEMA_VERSION
    || geometry.lawVersion !== STREET_GEOMETRY_LAW_VERSION) {
    throw new TypeError('boundary arrangement source identity is not admitted');
  }
  const ground = exactRecord(foundation.ground, 'foundation.ground', ['kind', 'ring', 'surfaceId']);
  if (ground.kind !== 'SURFACE') throw new TypeError('boundary arrangement requires surface ground');
  const groundSurfaceId = requireCanonicalId(ground.surfaceId, 'foundation.ground.surfaceId');
  const bounds = canonicalRectBounds(ground.ring, 'foundation.ground.ring');
  const corridorRows = /** @type {Array<Record<string,unknown>>} */ (foundation.streetCorridors);
  const corridors = corridorRows.map((row, index) => ({
    streetId: requireCanonicalId(row.streetId, `streetCorridors[${index}].streetId`),
    bounds: canonicalRectBounds(row.ring, `streetCorridors[${index}].ring`),
  }));
  const vertical = corridors.find((row) => row.bounds.minZ === bounds.minZ && row.bounds.maxZ === bounds.maxZ);
  const horizontal = corridors.find((row) => row.bounds.minX === bounds.minX && row.bounds.maxX === bounds.maxX);
  if (!vertical || !horizontal || vertical === horizontal) throw new TypeError('one exact cross is required');
  requireFoundationReplay(foundation, bounds, corridors);
  const frontages = /** @type {Array<Record<string,unknown>>} */ (subdivision.frontages);
  const plots = /** @type {Array<Record<string,unknown>>} */ (subdivision.plots);
  const frontageByPlot = new Map(frontages.map((row) => [row.plotId, row]));
  /** @type {Map<string,{geometry:[PointQ,PointQ],members:Array<Record<string,unknown>>}>} */
  const buckets = new Map();
  for (const plot of plots) {
    const plotId = requireCanonicalId(plot.plotId, 'plot.plotId');
    const frontage = frontageByPlot.get(plotId);
    if (!frontage) throw new TypeError('every plot must resolve one frontage row');
    if (!Array.isArray(plot.plotPolygon) || plot.plotPolygon.length !== 4) throw new TypeError('plot must be quadrilateral');
    for (let edgeIndex = 0; edgeIndex < 4; edgeIndex += 1) {
      const from = point(plot.plotPolygon[edgeIndex], `plot ${plotId} edge ${edgeIndex}`);
      const to = point(plot.plotPolygon[(edgeIndex + 1) % 4], `plot ${plotId} edge ${edgeIndex}`);
      const line = canonicalLine(from, to, `plot ${plotId} edge ${edgeIndex}`); const key = lineKey(line);
      const bucket = buckets.get(key) ?? { geometry: line, members: [] };
      bucket.members.push({ plotId, edgeIndex, blockId: frontage.blockId, from, to }); buckets.set(key, bucket);
    }
  }
  const subdivisionRef = canonicalArtifactRef(subdivision); const foundationRef = canonicalArtifactRef(foundation);
  /** @type {Array<Record<string,unknown>>} */ const boundaries = [];
  /**
   * @param {[PointQ,PointQ]} geometryLine
   * @param {'STREET_RIGHT_OF_WAY'|'REGISTERED_HARD_BLOCK'} role
   * @param {{artifactId:string,contentHash:string}} sourceRef
   * @param {Record<string,unknown>} source
   */
  const addBoundary = (geometryLine, role, sourceRef, source) => boundaries.push({
    boundaryId: requireCanonicalId(`cadastral-boundary:${sceneDigest({
      coordinateAbiVersion: FABRIC_COORDINATE_ABI, settlementId: geometry.settlementId, geometry: geometryLine,
    })}`, 'boundaryId'),
    role, support: { kind: 'PLANAR_SURFACE', leafIndex: 0 }, geometry: geometryLine, sourceRef, source,
  });
  for (const bucket of buckets.values()) {
    const members = bucket.members.sort((a, b) => compareCodepoint(a.plotId, b.plotId) || Number(a.edgeIndex) - Number(b.edgeIndex));
    if (members.length === 2) {
      if (members[0].blockId !== members[1].blockId
        || stableSceneStringify([members[0].from, members[0].to])
          !== stableSceneStringify([members[1].to, members[1].from])) {
        throw new TypeError('shared divider must be an opposite pair in one block');
      }
      addBoundary(bucket.geometry, 'REGISTERED_HARD_BLOCK', subdivisionRef, {
        kind: 'PARCEL_DIVIDER', blockId: members[0].blockId,
        plotEdges: members.map(({ plotId, edgeIndex }) => ({ plotId, edgeIndex })),
      });
    } else if (members.length === 1) {
      const member = members[0]; const plotEdge = { plotId: member.plotId, edgeIndex: member.edgeIndex };
      if (liesOnExtent(bucket.geometry, bounds)) {
        addBoundary(bucket.geometry, 'REGISTERED_HARD_BLOCK', subdivisionRef, {
          kind: 'SETTLEMENT_EXTENT', origin: 'PLOT_EDGE', groundSurfaceId,
          blockId: member.blockId, plotEdge,
        });
      } else {
        addBoundary(bucket.geometry, 'STREET_RIGHT_OF_WAY', subdivisionRef, {
          kind: 'STREET_RIGHT_OF_WAY', blockId: member.blockId,
          streetId: streetIdForRow(bucket.geometry, corridors), plotEdge,
        });
      }
    } else throw new TypeError('plot edge must resolve once or as one shared divider pair');
  }
  const openings = [
    { line: [[vertical.bounds.minX, bounds.minZ], [vertical.bounds.maxX, bounds.minZ]], edge: 0, streetId: vertical.streetId },
    { line: [[bounds.maxX, horizontal.bounds.minZ], [bounds.maxX, horizontal.bounds.maxZ]], edge: 1, streetId: horizontal.streetId },
    { line: [[vertical.bounds.minX, bounds.maxZ], [vertical.bounds.maxX, bounds.maxZ]], edge: 2, streetId: vertical.streetId },
    { line: [[bounds.minX, horizontal.bounds.minZ], [bounds.minX, horizontal.bounds.maxZ]], edge: 3, streetId: horizontal.streetId },
  ];
  for (const opening of openings) addBoundary(
    canonicalLine(opening.line[0], opening.line[1], 'ground street opening'),
    'REGISTERED_HARD_BLOCK', foundationRef,
    { kind: 'SETTLEMENT_EXTENT', origin: 'GROUND_STREET_OPENING', groundSurfaceId,
      groundEdgeIndex: opening.edge, streetId: opening.streetId },
  );
  boundaries.sort((left, right) => compareCodepoint(left.boundaryId, right.boundaryId));
  validateTopology(boundaries, plots);
  return sealCanonicalArtifact({
    artifactKind: 'CADASTRAL_BOUNDARY_ARRANGEMENT', artifactId,
    schemaVersion: CADASTRAL_BOUNDARY_ARRANGEMENT_SCHEMA_VERSION,
    lawVersion: CADASTRAL_BOUNDARY_ARRANGEMENT_LAW_VERSION,
    coordinateAbiVersion: FABRIC_COORDINATE_ABI, mapTraditionId: CURRENT_MAP_TRADITION_ID,
    settlementId: geometry.settlementId, effectiveAt: foundation.effectiveAt, leafIndex: 0,
    foundationRef, frontageSubdivisionRef: subdivisionRef,
    streetGeometryRef: canonicalArtifactRef(geometry), arrangementKind: 'ORTHOGONAL_CROSS_POST_W3',
    boundaries,
  });
}
