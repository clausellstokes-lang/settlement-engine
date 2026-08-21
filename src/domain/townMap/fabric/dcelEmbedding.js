/** Integer left-face embedding over exact MF-T1A boundary geometry. */

import { compareCodepoint } from '../../deterministicSort.js';
import { sceneDigest, stableSceneStringify } from '../../townScene/stableScene.js';
import { requireCanonicalId, requireCanonicalInt, requireCanonicalRecord } from './foundation.js';

/** @typedef {[number,number]} PointQ */

/** @param {unknown} value @param {string} label @returns {PointQ} */
function point(value, label) {
  if (!Array.isArray(value) || value.length !== 2) throw new TypeError(`${label} must be an [x,z] point`);
  return [requireCanonicalInt(value[0], `${label}[0]`), requireCanonicalInt(value[1], `${label}[1]`)];
}

/** @param {PointQ} left @param {PointQ} right */
function comparePoint(left, right) { return left[0] - right[0] || left[1] - right[1]; }

/** @param {PointQ} a @param {PointQ} b @param {PointQ} c */
function orient(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }

/** @param {PointQ} a @param {PointQ} b @param {PointQ} p */
function onSegment(a, b, p) {
  return p[0] >= Math.min(a[0], b[0]) && p[0] <= Math.max(a[0], b[0])
    && p[1] >= Math.min(a[1], b[1]) && p[1] <= Math.max(a[1], b[1]);
}

/** @param {[PointQ,PointQ]} left @param {[PointQ,PointQ]} right */
function rejectNonAtomicIntersection(left, right) {
  const shared = left.filter((a) => right.some((b) => comparePoint(a, b) === 0));
  if (shared.length === 1) return;
  if (shared.length > 1) throw new TypeError('DCEL boundaries must be unique');
  const [a, b] = left; const [c, d] = right;
  const abC = orient(a, b, c); const abD = orient(a, b, d);
  const cdA = orient(c, d, a); const cdB = orient(c, d, b);
  if ((abC === 0 && onSegment(a, b, c)) || (abD === 0 && onSegment(a, b, d))
    || (cdA === 0 && onSegment(c, d, a)) || (cdB === 0 && onSegment(c, d, b))
    || (((abC < 0 && abD > 0) || (abC > 0 && abD < 0))
      && ((cdA < 0 && cdB > 0) || (cdA > 0 && cdB < 0)))) {
    throw new TypeError('DCEL boundaries must be atomically noded without crossings or overlaps');
  }
}

/** @param {PointQ} vector */
function halfPlane(vector) { return vector[1] > 0 || (vector[1] === 0 && vector[0] >= 0) ? 0 : 1; }

/** @param {{vector:PointQ,halfEdgeId:string}} left @param {{vector:PointQ,halfEdgeId:string}} right */
function compareRay(left, right) {
  const half = halfPlane(left.vector) - halfPlane(right.vector);
  if (half) return half;
  const cross = left.vector[0] * right.vector[1] - left.vector[1] * right.vector[0];
  if (cross === 0) throw new TypeError('DCEL vertex has an angular tie');
  return cross > 0 ? -1 : 1;
}

/** @param {string[]} values */
function rotateToMinimum(values) {
  const minimum = [...values].sort(compareCodepoint)[0];
  const offset = values.indexOf(minimum);
  return [...values.slice(offset), ...values.slice(0, offset)];
}

/**
 * @param {{coordinateAbiVersion:string,settlementId:string,arrangementRef:{artifactId:string,contentHash:string},boundaries:Array<Record<string,unknown>>}} input
 */
export function derivePlanarDcelEmbedding(input) {
  const { coordinateAbiVersion, settlementId, arrangementRef, boundaries } = input;
  /** @type {Map<string,{point:PointQ,support:Record<string,unknown>,anchors:Array<{boundaryId:string,endpointIndex:number}>,outgoing:string[]}>} */
  const vertexByKey = new Map();
  /** @type {Map<string,{halfEdgeId:string,boundaryId:string,endpointIndex:number,originKey:string,destinationKey:string,boundaryRef:Record<string,unknown>}>} */
  const edgeById = new Map();
  /** @type {Array<[PointQ,PointQ]>} */ const lines = [];
  const boundaryIds = new Set(); const supports = new Set();
  for (const [boundaryIndex, raw] of boundaries.entries()) {
    const boundary = requireCanonicalRecord(raw, `boundaries[${boundaryIndex}]`);
    const boundaryId = requireCanonicalId(boundary.boundaryId, `boundaries[${boundaryIndex}].boundaryId`);
    const support = requireCanonicalRecord(boundary.support, `boundaries[${boundaryIndex}].support`);
    const supportKey = stableSceneStringify(support); supports.add(supportKey);
    if (supportKey !== stableSceneStringify({ kind: 'PLANAR_SURFACE', leafIndex: 0 })) {
      throw new TypeError('DCEL requires one surface-leaf support');
    }
    if (!Array.isArray(boundary.geometry) || boundary.geometry.length !== 2) {
      throw new TypeError('DCEL boundary geometry must contain two endpoints');
    }
    const line = /** @type {[PointQ,PointQ]} */ (boundary.geometry.map((value, endpointIndex) => (
      point(value, `boundaries[${boundaryIndex}].geometry[${endpointIndex}]`)
    )));
    if (comparePoint(line[0], line[1]) >= 0 || boundaryIds.has(boundaryId)) {
      throw new TypeError('DCEL boundaries require canonical unique identity and direction');
    }
    boundaryIds.add(boundaryId); lines.push(line);
    const keys = line.map((value) => stableSceneStringify([support, value]));
    for (let endpointIndex = 0; endpointIndex < 2; endpointIndex += 1) {
      const key = keys[endpointIndex]; const endpoint = line[endpointIndex];
      const vertex = vertexByKey.get(key) ?? { point: endpoint, support, anchors: [], outgoing: [] };
      vertex.anchors.push({ boundaryId, endpointIndex }); vertexByKey.set(key, vertex);
      const halfEdgeId = requireCanonicalId(`dcel-half-edge:${sceneDigest({
        coordinateAbiVersion, settlementId, boundaryId, endpointIndex,
      })}`, 'halfEdgeId');
      const edge = { halfEdgeId, boundaryId, endpointIndex, originKey: key,
        destinationKey: keys[1 - endpointIndex], boundaryRef: {
          ...arrangementRef, kind: 'BOUNDARY', boundaryId,
        } };
      if (edgeById.has(halfEdgeId)) throw new TypeError('DCEL half-edge identity collision');
      edgeById.set(halfEdgeId, edge); vertex.outgoing.push(halfEdgeId);
    }
  }
  if (supports.size !== 1) throw new TypeError('DCEL requires exactly one support');
  for (let left = 0; left < lines.length; left += 1) {
    for (let right = left + 1; right < lines.length; right += 1) {
      rejectNonAtomicIntersection(lines[left], lines[right]);
    }
  }
  const twinById = new Map();
  for (const edge of edgeById.values()) {
    const twin = [...edgeById.values()].find((candidate) => candidate.boundaryId === edge.boundaryId
      && candidate.endpointIndex === 1 - edge.endpointIndex);
    if (!twin) throw new TypeError('DCEL boundary must produce one twin pair');
    twinById.set(edge.halfEdgeId, twin.halfEdgeId);
  }
  for (const vertex of vertexByKey.values()) {
    vertex.outgoing.sort((leftId, rightId) => {
      const left = edgeById.get(leftId); const right = edgeById.get(rightId);
      if (!left || !right) throw new TypeError('DCEL outgoing edge is unresolved');
      const leftEnd = vertexByKey.get(left.destinationKey)?.point;
      const rightEnd = vertexByKey.get(right.destinationKey)?.point;
      if (!leftEnd || !rightEnd) throw new TypeError('DCEL endpoint is unresolved');
      return compareRay({ vector: [leftEnd[0] - vertex.point[0], leftEnd[1] - vertex.point[1]], halfEdgeId: leftId },
        { vector: [rightEnd[0] - vertex.point[0], rightEnd[1] - vertex.point[1]], halfEdgeId: rightId });
    });
  }
  const nextById = new Map();
  for (const edge of edgeById.values()) {
    const twinId = twinById.get(edge.halfEdgeId); const destination = vertexByKey.get(edge.destinationKey);
    if (!twinId || !destination) throw new TypeError('DCEL twin destination is unresolved');
    const index = destination.outgoing.indexOf(twinId);
    if (index < 0) throw new TypeError('DCEL twin is absent from its destination');
    nextById.set(edge.halfEdgeId, destination.outgoing[(index - 1 + destination.outgoing.length) % destination.outgoing.length]);
  }
  const previousById = new Map();
  for (const [halfEdgeId, nextHalfEdgeId] of nextById) {
    if (previousById.has(nextHalfEdgeId)) throw new TypeError('DCEL next relation is not a permutation');
    previousById.set(nextHalfEdgeId, halfEdgeId);
  }
  const unvisited = new Set([...edgeById.keys()]);
  /** @type {Array<{halfEdgeIds:string[],area2:number,faceId:string,faceKind:'BOUNDED'|'EXTERIOR'}>} */ const cycles = [];
  while (unvisited.size) {
    const start = [...unvisited].sort(compareCodepoint)[0];
    if (!start) throw new TypeError('DCEL face traversal has no canonical start');
    /** @type {string[]} */ const walked = []; let current = start;
    do {
      if (!unvisited.delete(current)) throw new TypeError('DCEL face traversal is not a disjoint cycle');
      walked.push(current); const nextId = nextById.get(current);
      if (!nextId || walked.length > edgeById.size) throw new TypeError('DCEL face traversal does not close');
      current = nextId;
    } while (current !== start);
    const halfEdgeIds = rotateToMinimum(walked);
    /** @type {PointQ[]} */
    const points = halfEdgeIds.map((id) => {
      const edge = edgeById.get(id); const vertex = edge ? vertexByKey.get(edge.originKey) : undefined;
      if (!vertex) throw new TypeError('DCEL face point is unresolved');
      return vertex.point;
    });
    const area2 = points.reduce((sum, value, index) => {
      const next = points[(index + 1) % points.length];
      return sum + value[0] * next[1] - value[1] * next[0];
    }, 0);
    if (area2 === 0) throw new TypeError('DCEL face must have nonzero signed area');
    const faceId = requireCanonicalId(`dcel-face:${sceneDigest({
      coordinateAbiVersion, settlementId, halfEdgeIds,
    })}`, 'faceId');
    cycles.push({ halfEdgeIds, area2, faceId, faceKind: area2 > 0 ? 'BOUNDED' : 'EXTERIOR' });
  }
  const faceByHalfEdge = new Map(cycles.flatMap((cycle) => cycle.halfEdgeIds.map((id) => [id, cycle.faceId])));
  const vertices = [...vertexByKey.values()].map((vertex) => {
    vertex.anchors.sort((left, right) => compareCodepoint(left.boundaryId, right.boundaryId)
      || left.endpointIndex - right.endpointIndex);
    const anchor = vertex.anchors[0];
    return { vertexId: requireCanonicalId(`dcel-vertex:${sceneDigest({
      coordinateAbiVersion, settlementId, support: vertex.support, point: vertex.point,
    })}`, 'vertexId'), geometryRef: { ...arrangementRef, kind: 'BOUNDARY_ENDPOINT', ...anchor },
    incidentHalfEdgeId: [...vertex.outgoing].sort(compareCodepoint)[0] };
  }).sort((left, right) => compareCodepoint(left.vertexId, right.vertexId));
  const vertexIdByKey = new Map([...vertexByKey.entries()].map(([key, vertex]) => [key,
    requireCanonicalId(`dcel-vertex:${sceneDigest({ coordinateAbiVersion, settlementId,
      support: vertex.support, point: vertex.point })}`, 'vertexId')]));
  const halfEdges = [...edgeById.values()].map((edge) => ({ halfEdgeId: edge.halfEdgeId,
    boundaryRef: edge.boundaryRef, originVertexId: vertexIdByKey.get(edge.originKey),
    twinHalfEdgeId: twinById.get(edge.halfEdgeId), nextHalfEdgeId: nextById.get(edge.halfEdgeId),
    previousHalfEdgeId: previousById.get(edge.halfEdgeId), faceId: faceByHalfEdge.get(edge.halfEdgeId),
  })).sort((left, right) => compareCodepoint(left.halfEdgeId, right.halfEdgeId));
  const faces = cycles.map((cycle) => ({ faceId: cycle.faceId, faceKind: cycle.faceKind,
    boundaryHalfEdgeId: cycle.halfEdgeIds[0] })).sort((left, right) => compareCodepoint(left.faceId, right.faceId));
  return { vertices, halfEdges, faces, outerFaceId: cycles.find((cycle) => cycle.faceKind === 'EXTERIOR')?.faceId,
    metrics: { area2s: cycles.map((cycle) => cycle.area2), cycleLengths: cycles.map((cycle) => cycle.halfEdgeIds.length),
      degrees: [...vertexByKey.values()].map((vertex) => vertex.outgoing.length) } };
}
