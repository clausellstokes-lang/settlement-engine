/**
 * Integer left-face embedding over exact MF-T1A boundary geometry, extended by MF-T2C onto the
 * versioned coordinate ABI.
 *
 * ⭐⭐ EXACT ARITHMETIC IS NOT A STYLE CHOICE HERE, and the reason lives in the file because
 * preamble §P1 R-MF-2 requires it to. ABI quanta reach ~1.3e9, so a cross product of coordinate
 * differences reaches ~1.7e18 — two orders of magnitude past the safe-integer range. Executed on
 * the triangle `a=[0,0] b=[m−1,m] c=[m,m+1]` at `m = 1286630001`, which MF-T2B's widened wall
 * admits: the float cross reads `0` while the exact cross is `-1n`, so the ordering comparator
 * below saw a NON-tie as a tie and threw `'DCEL vertex has an angular tie'` on valid ground.
 * ⛔ The failure wears the message of a condition that did not occur, which is why it would be
 * chased as a geometry defect. `orient`, `compareRay`'s cross and the shoelace therefore
 * accumulate in BigInt and compare against `0n`. The angular-tie throw is PRESERVED, not removed:
 * it now fires only on a TRUE collinear tie, which is the one overlap shape the pairwise atomic
 * check structurally passes (two collinear boundaries sharing a single endpoint).
 *
 * ⭐ THE TRAVERSAL CURSOR (preamble §P1 R-MF-1). The face walk's dominant term was
 * `[...unvisited].sort(…)[0]` INSIDE the loop — `O(F · E log E)` priced against real leaf sizes
 * of 11,603 and 17,417 boundaries rather than against a fixture. The ids are sorted ONCE and a
 * cursor advances past visited ones, yielding the same codepoint-minimum start the per-iteration
 * sort produced. ⚠ The output is invariant regardless of which start is chosen: the cycle SET
 * does not depend on discovery order, each cycle is rotated to its minimum, and faces are sorted
 * by `faceId` — so the cursor is a cost repair and never a behaviour change.
 *
 * ⚠⚠ `HOLE_CYCLE` AND `ENCLOSED_BY_EXTERIOR` ARE DEFENSIVE VOCABULARY, AND THAT FINDING IS
 * EXECUTED RATHER THAN ASSUMED. A negative cycle is reclassified only when its component carries
 * a second, more-negative one — but a connected noded planar subdivision has exactly ONE
 * unbounded-face walk, so on the input this kernel admits each component carries exactly one
 * negative cycle. Measured over every fixture including nested rings: ZERO occurrences of either
 * token. A nested ring is a SEPARATE component whose negative cycle is its own component's outer,
 * and containment is answered by `locateFace`'s smallest-containing-cycle rule instead.
 * ⛔ No test asserts that either kind fires; their reachability is not a claim this member makes
 * (chair ruling, ODQ §328). They become live only if a later wave relaxes the noded precondition.
 *
 * ⛔ THE SEALED ARTIFACT DOES NOT MOVE. Everything the extension adds lives on the IN-MEMORY
 * embedding; `dcel.js` seals the legacy face triple key-for-key, so every PLANAR_DCEL digest
 * stays exactly where it is.
 *
 * PURITY: pure. Integer and BigInt arithmetic only — no clock read, no randomness, no locale
 * ordering. ⚠ That vocabulary is named in the ABSTRACT on purpose: the determinism companion
 * scans this file's RAW TEXT, and a scan a docstring can trigger is a scan someone widens to
 * excuse the docstring.
 */

import { compareCodepoint } from '../../deterministicSort.js';
import { sceneDigest, stableSceneStringify } from '../../townScene/stableScene.js';
import { MAX_WORLD_UNITS } from './coordinateAbi.js';
import { bounds, pointLocateRing } from './exactGeometry.js';
import { requireCanonicalId, requireCanonicalInt, requireCanonicalRecord } from './foundation.js';

/** @typedef {[number,number]} PointQ */
/** @typedef {'BOUNDED'|'EXTERIOR'|'HOLE_CYCLE'|'DEGENERATE'} FaceKind */

/**
 * The face kinds this embedding publishes. A positive cycle is `BOUNDED`; a component's
 * most-negative cycle is `EXTERIOR`; any other negative cycle of that component is `HOLE_CYCLE`;
 * a zero-area cycle is `DEGENERATE` and is REPORTED rather than thrown.
 */
export const PLANAR_EMBEDDING_FACE_KINDS = Object.freeze(
  /** @type {readonly FaceKind[]} */ (['BOUNDED', 'EXTERIOR', 'HOLE_CYCLE', 'DEGENERATE']),
);

/**
 * The rounding radius point location works to: HALF an ABI quantum. It is the structural
 * consequence of `COORDINATE_ABI.boundaryRule === 'CLOSED'` read over an integer lattice — a
 * point is ON a boundary exactly when it sits inside the half-quantum that rounds to it — and it
 * is ported verbatim from the reference's own locate call. ⛔ Internal and UNEXPORTED on purpose:
 * it is ABI structure rather than tuning surface (chair ruling, ODQ §328), and exporting it would
 * invite a caller to supply a different radius and make the boundary rule a per-caller opinion.
 */
const BOUNDARY_EPS_Q = 0.5;

/** Is this a coordinate the ABI can speak about at all? @param {unknown} value */
function insideAbi(value) {
  return typeof value === 'number' && Number.isSafeInteger(value)
    && value <= MAX_WORLD_UNITS && value >= -MAX_WORLD_UNITS;
}

/** @param {unknown} value @param {string} label @returns {PointQ} */
function point(value, label) {
  if (!Array.isArray(value) || value.length !== 2) throw new TypeError(`${label} must be an [x,z] point`);
  return [requireCanonicalInt(value[0], `${label}[0]`), requireCanonicalInt(value[1], `${label}[1]`)];
}

/** @param {PointQ} left @param {PointQ} right */
function comparePoint(left, right) { return left[0] - right[0] || left[1] - right[1]; }

/** Exact orientation, in BigInt — see the header. @param {PointQ} a @param {PointQ} b
 *  @param {PointQ} c @returns {bigint} */
function orient(a, b, c) {
  return (BigInt(b[0]) - BigInt(a[0])) * (BigInt(c[1]) - BigInt(a[1]))
    - (BigInt(b[1]) - BigInt(a[1])) * (BigInt(c[0]) - BigInt(a[0]));
}

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
  if ((abC === 0n && onSegment(a, b, c)) || (abD === 0n && onSegment(a, b, d))
    || (cdA === 0n && onSegment(c, d, a)) || (cdB === 0n && onSegment(c, d, b))
    || (((abC < 0n && abD > 0n) || (abC > 0n && abD < 0n))
      && ((cdA < 0n && cdB > 0n) || (cdA > 0n && cdB < 0n)))) {
    throw new TypeError('DCEL boundaries must be atomically noded without crossings or overlaps');
  }
}

/** @param {PointQ} vector */
function halfPlane(vector) { return vector[1] > 0 || (vector[1] === 0 && vector[0] >= 0) ? 0 : 1; }

/** @param {{vector:PointQ,halfEdgeId:string}} left @param {{vector:PointQ,halfEdgeId:string}} right */
function compareRay(left, right) {
  const half = halfPlane(left.vector) - halfPlane(right.vector);
  if (half) return half;
  const cross = BigInt(left.vector[0]) * BigInt(right.vector[1])
    - BigInt(left.vector[1]) * BigInt(right.vector[0]);
  if (cross === 0n) throw new TypeError('DCEL vertex has an angular tie');
  return cross > 0n ? -1 : 1;
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
  const sortedIds = [...edgeById.keys()].sort(compareCodepoint);
  const unvisited = new Set(sortedIds);
  /** @type {Array<{halfEdgeIds:string[],area2:bigint,faceId:string,points:PointQ[]}>} */ const cycles = [];
  let cursor = 0;
  while (unvisited.size) {
    while (cursor < sortedIds.length && !unvisited.has(sortedIds[cursor])) cursor += 1;
    const start = sortedIds[cursor];
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
      return sum + BigInt(value[0]) * BigInt(next[1]) - BigInt(value[1]) * BigInt(next[0]);
    }, 0n);
    const faceId = requireCanonicalId(`dcel-face:${sceneDigest({
      coordinateAbiVersion, settlementId, halfEdgeIds,
    })}`, 'faceId');
    cycles.push({ halfEdgeIds, area2, faceId, points });
  }
  // COMPONENTS, so each gets its OWN outer face — the single `outerFaceId` is correct only under
  // a one-negative-cycle census, and names an arbitrary cycle the moment a second component
  // exists. The walk is a DFS over vertex KEYS in codepoint order, followed through each
  // half-edge's own destination, so no hash order reaches the component indices.
  /** @type {Map<string,number>} */ const componentByKey = new Map();
  let componentCount = 0;
  for (const rootKey of [...vertexByKey.keys()].sort(compareCodepoint)) {
    if (componentByKey.has(rootKey)) continue;
    componentByKey.set(rootKey, componentCount);
    /** @type {string[]} */ const stack = [rootKey];
    for (let key = stack.pop(); key !== undefined; key = stack.pop()) {
      for (const outgoingId of vertexByKey.get(key)?.outgoing ?? []) {
        const destinationKey = edgeById.get(outgoingId)?.destinationKey;
        if (destinationKey === undefined || componentByKey.has(destinationKey)) continue;
        componentByKey.set(destinationKey, componentCount); stack.push(destinationKey);
      }
    }
    componentCount += 1;
  }
  const componentOf = cycles.map((cycle) => {
    const component = componentByKey.get(edgeById.get(cycle.halfEdgeIds[0])?.originKey ?? '');
    if (component === undefined) throw new TypeError('DCEL cycle has no component');
    return component;
  });
  /** @type {Map<number,{faceId:string,area2:bigint}>} */ const outerByComponent = new Map();
  cycles.forEach((cycle, index) => {
    if (cycle.area2 >= 0n) return;
    const held = outerByComponent.get(componentOf[index]);
    if (!held || cycle.area2 < held.area2) outerByComponent.set(componentOf[index], cycle);
  });
  const outerFaceIds = [...outerByComponent.entries()]
    .sort((left, right) => left[0] - right[0]).map(([, cycle]) => cycle.faceId);
  const outerIdSet = new Set(outerFaceIds);
  /** @type {FaceKind[]} */
  const kindOf = cycles.map((cycle) => {
    if (cycle.area2 > 0n) return 'BOUNDED';
    if (cycle.area2 === 0n) return 'DEGENERATE';
    return outerIdSet.has(cycle.faceId) ? 'EXTERIOR' : 'HOLE_CYCLE';
  });
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
  // ⚠ ONE permutation drives BOTH published arrays. `faces` is sorted by `faceId` while
  // `metrics.area2s` keeps DISCOVERY order, so zipping those two reads another cycle's area —
  // which is exactly how a compile-time probe mis-attributed this kernel's outer face. `faceIndex`
  // is therefore built from the same `order` as `faces` and aligns with it index for index.
  const order = cycles.map((cycle, index) => index)
    .sort((left, right) => compareCodepoint(cycles[left].faceId, cycles[right].faceId));
  const faces = order.map((index) => ({
    faceId: cycles[index].faceId, faceKind: kindOf[index],
    boundaryHalfEdgeId: cycles[index].halfEdgeIds[0],
    innerBoundaryHalfEdgeIds: /** @type {string[]} */ ([]),
    component: componentOf[index],
  }));
  const faceIndex = order.map((index) => ({
    ring: cycles[index].points,
    bounds: cycles[index].points.length >= 3 ? bounds(cycles[index].points) : null,
    area2: cycles[index].area2,
  }));
  return { vertices, halfEdges, faces, faceIndex,
    outerFaceId: outerFaceIds[0], outerFaceIds, componentCount,
    metrics: { area2s: cycles.map((cycle) => cycle.area2), cycleLengths: cycles.map((cycle) => cycle.halfEdgeIds.length),
      degrees: [...vertexByKey.values()].map((vertex) => vertex.outgoing.length),
      degenerateFaces: kindOf.filter((kind) => kind === 'DEGENERATE').length,
      holeCycles: kindOf.filter((kind) => kind === 'HOLE_CYCLE').length } };
}

/**
 * ⭐⭐ POINT LOCATION — the third leg of ODQ §287.8, minted here because both codex packets list
 * it as an explicit non-goal. `COORDINATE_ABI.boundaryRule` is `'CLOSED'`, so a point ON a
 * boundary is returned as its own `BOUNDARY` verdict rather than folded into either side: a face
 * census and a legality census that disagree only about the boundary are two censuses, not one.
 *
 * ⭐ EVERY non-degenerate cycle is a candidate, not only the positive ones. A point can be
 * enclosed by a NEGATIVE cycle — that is what an outer boundary walked with the unbounded side on
 * the left looks like — and restricting the search to `BOUNDED` faces answers `OUTER` for every
 * point inside a component whose boundary closes no positive ring.
 *
 * ⭐ AT EQUAL |area2| A `BOUNDED` CYCLE WINS. A closed ring produces TWO walks of identical
 * magnitude — the region, and the same curve read from the other side — so picking by iteration
 * order would make the verdict depend on discovery order. The region is the answer.
 *
 * ⚠ The point is in ABI integer QUANTA, the embedding's own coordinate space (ODQ §303.5: on the
 * integer wall the versioned ABI wins). Unit conversion stays the caller's.
 *
 * @param {ReturnType<typeof derivePlanarDcelEmbedding>} embedding
 * @param {readonly number[]} pointQ `[xQ, zQ]`, ABI integer quanta
 */
export function locateFace(embedding, pointQ) {
  if (!Array.isArray(pointQ) || pointQ.length !== 2
    || !insideAbi(pointQ[0]) || !insideAbi(pointQ[1])) {
    return { kind: 'OUTSIDE_ABI', faceId: null };
  }
  const [xQ, zQ] = pointQ;
  /** @type {string[]} */ const hits = [];
  /** @type {{faceId:string,faceKind:FaceKind}|null} */ let best = null;
  /** @type {bigint|null} */ let bestArea = null;
  let bestVerdict = '';
  embedding.faceIndex.forEach((entry, index) => {
    const face = embedding.faces[index];
    if (face.faceKind === 'DEGENERATE' || entry.bounds === null || entry.ring.length < 3) return;
    if (xQ < entry.bounds[0] || xQ > entry.bounds[2]
      || zQ < entry.bounds[1] || zQ > entry.bounds[3]) return;
    const verdict = pointLocateRing(entry.ring, xQ, zQ, BOUNDARY_EPS_Q);
    if (verdict === 'OUTSIDE') return;
    hits.push(face.faceId);
    const magnitude = entry.area2 < 0n ? -entry.area2 : entry.area2;
    if (bestArea !== null && magnitude > bestArea) return;
    if (bestArea !== null && magnitude === bestArea
      && !(face.faceKind === 'BOUNDED' && best?.faceKind !== 'BOUNDED')) return;
    bestArea = magnitude; best = face; bestVerdict = verdict;
  });
  const picked = /** @type {{faceId:string,faceKind:FaceKind}|null} */ (best);
  if (picked === null) {
    return { kind: 'OUTER', faceId: embedding.outerFaceIds[0] ?? null, faces: /** @type {string[]} */ ([]) };
  }
  if (bestVerdict === 'BOUNDARY') {
    return { kind: 'BOUNDARY', faceId: picked.faceId, faceKind: picked.faceKind, faces: hits };
  }
  return { kind: picked.faceKind === 'BOUNDED' ? 'INSIDE' : 'ENCLOSED_BY_EXTERIOR',
    faceId: picked.faceId, faceKind: picked.faceKind, faces: hits };
}
