/** Bounded semantic shape grammar for the first nonrectangular mass. */

import {
  canonicalRectBounds,
  requireCanonicalId,
  requireCanonicalInt,
  requireCanonicalRecord,
} from './foundation.js';

export const COMPOSITE_SHAPE_LAW_VERSION = 'explicit-composite-shape-v1';
export const SHAPE_COORDINATE_ABI = 'plan-q1-xy-zup-radial16-v2';
export const SHAPE_VOCABULARY_VERSION = 1;
export const PLAN_SHAPE_KINDS = Object.freeze(['RECTILINEAR', 'CIRCULAR', 'REGULAR_POLYGONAL']);
export const VERTICAL_SOLID_KINDS = Object.freeze(['EXTRUDED_POLYGON', 'CYLINDER']);
export const ROOF_SHAPE_KINDS = Object.freeze(['FLAT', 'GABLE', 'CONICAL', 'PYRAMIDAL']);

const UNIT_DENOMINATOR = 1024;
const CIRCULAR_UNIT_RING = Object.freeze([
  [1024, 0], [946, 392], [724, 724], [392, 946],
  [0, 1024], [-392, 946], [-724, 724], [-946, 392],
  [-1024, 0], [-946, -392], [-724, -724], [-392, -946],
  [0, -1024], [392, -946], [724, -724], [946, -392],
]);
const HEXAGON_UNIT_RING = Object.freeze([
  [1024, 0], [512, 887], [-512, 887],
  [-1024, 0], [-512, -887], [512, -887],
]);

/** @param {unknown} value @param {string} label @param {string[]} keys */
function requireExactKeys(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new TypeError(`${label} must contain exactly ${expected.join(', ')}`);
  }
  return record;
}

/** @param {unknown} value @param {string} label @returns {[number,number]} */
function requirePlanPoint(value, label) {
  if (!Array.isArray(value) || value.length !== 2) throw new TypeError(`${label} must be [x,y]`);
  return [
    requireCanonicalInt(value[0], `${label}[0]`),
    requireCanonicalInt(value[1], `${label}[1]`),
  ];
}

/** @param {number} radiusQ @param {number} unitQ */
function scaleUnit(radiusQ, unitQ) {
  const product = radiusQ * unitQ;
  return product >= 0
    ? Math.floor((product + UNIT_DENOMINATOR / 2) / UNIT_DENOMINATOR)
    : -Math.floor((-product + UNIT_DENOMINATOR / 2) / UNIT_DENOMINATOR);
}

/** @param {[number,number]} centerQ @param {number} radiusQ @param {ReadonlyArray<ReadonlyArray<number>>} units */
function scaleRing(centerQ, radiusQ, units) {
  const ring = units.map((unit) => /** @type {[number,number]} */ ([
    centerQ[0] + scaleUnit(radiusQ, Number(unit[0])),
    centerQ[1] + scaleUnit(radiusQ, Number(unit[1])),
  ]));
  if (new Set(ring.map((point) => JSON.stringify(point))).size !== ring.length) {
    throw new TypeError('quantized radial ring collapsed');
  }
  return ring;
}

/** @param {Record<string,unknown>} plan */
function compilePlanRing(plan) {
  const kind = String(plan.kind);
  if (kind === 'CIRCULAR') {
    const value = requireExactKeys(plan, 'radialPart.plan', ['centerQ', 'kind', 'orientation', 'radiusQ', 'segments']);
    if (value.orientation !== 'VERTEX_EAST' || value.segments !== 16) {
      throw new TypeError('CIRCULAR requires VERTEX_EAST and the frozen 16-segment LUT');
    }
    return scaleRing(
      requirePlanPoint(value.centerQ, 'radialPart.plan.centerQ'),
      requireCanonicalInt(value.radiusQ, 'radialPart.plan.radiusQ', 4, 250),
      CIRCULAR_UNIT_RING,
    );
  }
  if (kind === 'REGULAR_POLYGONAL') {
    const value = requireExactKeys(plan, 'radialPart.plan', ['centerQ', 'kind', 'orientation', 'radiusQ', 'sides']);
    const sides = requireCanonicalInt(value.sides, 'radialPart.plan.sides', 4, 8);
    if (value.orientation !== 'VERTEX_EAST' || ![4, 6, 8].includes(sides)) {
      throw new TypeError('REGULAR_POLYGONAL requires VERTEX_EAST and 4, 6, or 8 sides');
    }
    const units = sides === 6
      ? HEXAGON_UNIT_RING
      : CIRCULAR_UNIT_RING.filter((_, index) => index % (16 / sides) === 0);
    return scaleRing(
      requirePlanPoint(value.centerQ, 'radialPart.plan.centerQ'),
      requireCanonicalInt(value.radiusQ, 'radialPart.plan.radiusQ', 4, 250),
      units,
    );
  }
  throw new TypeError('radialPart.plan.kind must be CIRCULAR or REGULAR_POLYGONAL');
}

/** @param {Array<[number,number]>} ring @param {number} elevationQ */
function elevatedRing(ring, elevationQ) {
  return ring.map((point) => [point[0], point[1], elevationQ]);
}

/** @param {string} partId @param {Array<[number,number]>} ring @param {number} baseQ @param {number} topQ */
function shaftPatches(partId, ring, baseQ, topQ) {
  const lower = elevatedRing(ring, baseQ);
  const upper = elevatedRing(ring, topQ);
  return [
    { patchId: `${partId}:shaft:base`, role: 'BASE', vertices: [...lower].reverse() },
    { patchId: `${partId}:shaft:top`, role: 'TOP', vertices: upper },
    ...ring.map((_, index) => {
      const next = (index + 1) % ring.length;
      return {
        patchId: `${partId}:shaft:wall:${index + 1}`,
        role: 'WALL',
        vertices: [lower[index], lower[next], upper[next], upper[index]],
      };
    }),
  ];
}

/** @param {string} partId @param {Array<[number,number]>} ring @param {number} eaveQ @param {number} apexQ */
function capPatches(partId, ring, eaveQ, apexQ) {
  const eave = elevatedRing(ring, eaveQ);
  const centerX = Math.floor(ring.reduce((sum, point) => sum + point[0], 0) / ring.length);
  const centerY = Math.floor(ring.reduce((sum, point) => sum + point[1], 0) / ring.length);
  const apex = [centerX, centerY, apexQ];
  return [
    { patchId: `${partId}:cap:base`, role: 'ROOF_BASE', vertices: [...eave].reverse() },
    ...ring.map((_, index) => ({
      patchId: `${partId}:cap:facet:${index + 1}`,
      role: 'ROOF',
      vertices: [eave[index], eave[(index + 1) % ring.length], apex],
    })),
  ];
}

/** @param {ReadonlyArray<number>} a @param {ReadonlyArray<number>} b */
function edgeKey(a, b) {
  const ends = [JSON.stringify(a), JSON.stringify(b)].sort();
  return `${ends[0]}|${ends[1]}`;
}

/** @param {Array<Record<string,unknown>>} patches @param {string} label */
function assertClosedShell(patches, label) {
  const counts = new Map();
  for (const patch of patches) {
    if (!Array.isArray(patch.vertices) || patch.vertices.length < 3) {
      throw new TypeError(`${label} has a malformed patch`);
    }
    for (let index = 0; index < patch.vertices.length; index += 1) {
      const key = edgeKey(patch.vertices[index], patch.vertices[(index + 1) % patch.vertices.length]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  if ([...counts.values()].some((count) => count !== 2)) {
    throw new TypeError(`${label} must be a closed two-use edge shell`);
  }
}

/** @param {Record<string,unknown>} patch */
function convertAttachmentPatch(patch) {
  const vertices = /** @type {Array<ReadonlyArray<number>>} */ (patch.vertices);
  return {
    ...patch,
    patchId: `attachment:${String(patch.patchId)}`,
    vertices: vertices.map((vertex) => [vertex[0], vertex[2], vertex[1]]),
  };
}

/**
 * Compile non-authoritative shape fragments for one validated rectilinear attachment.
 * @param {{attachmentGeometry:Record<string,unknown>,radialPart:Record<string,unknown>,plotRing:unknown}} input
 */
export function compileCompositeShapeFragments(input) {
  const source = requireCanonicalRecord(input, 'composite shape input');
  const attachment = requireCanonicalRecord(source.attachmentGeometry, 'attachmentGeometry');
  if (attachment.lawVersion !== COMPOSITE_SHAPE_LAW_VERSION) {
    throw new TypeError('attachmentGeometry must be compiled under the composite shape law');
  }
  const radial = requireExactKeys(source.radialPart, 'radialPart', [
    'attachmentAnchorQ', 'materials', 'partId', 'plan', 'role', 'roof', 'vertical',
  ]);
  if (radial.role !== 'TOWER') throw new TypeError('the bounded radial part role must be TOWER');
  const partId = requireCanonicalId(radial.partId, 'radialPart.partId');
  const plan = requireCanonicalRecord(radial.plan, 'radialPart.plan');
  const vertical = requireExactKeys(radial.vertical, 'radialPart.vertical', ['baseQ', 'kind', 'topQ']);
  const roof = requireExactKeys(radial.roof, 'radialPart.roof', ['apexQ', 'eaveQ', 'kind']);
  const materials = requireExactKeys(radial.materials, 'radialPart.materials', ['roofMaterialId', 'wallMaterialId']);
  requireCanonicalId(materials.wallMaterialId, 'radialPart.materials.wallMaterialId');
  requireCanonicalId(materials.roofMaterialId, 'radialPart.materials.roofMaterialId');

  const circular = plan.kind === 'CIRCULAR';
  if ((circular && (vertical.kind !== 'CYLINDER' || roof.kind !== 'CONICAL'))
    || (!circular && (vertical.kind !== 'EXTRUDED_POLYGON' || roof.kind !== 'PYRAMIDAL'))) {
    throw new TypeError('plan, vertical solid, and roof form are incompatible');
  }
  const ring = compilePlanRing(plan);
  const plot = canonicalRectBounds(source.plotRing, 'shape plot ring');
  if (ring.some((point) => point[0] < plot.minX || point[0] > plot.maxX
    || point[1] < plot.minZ || point[1] > plot.maxZ)) {
    throw new TypeError('radial plan must remain inside the W3 fitted plot');
  }
  const attachmentBounds = canonicalRectBounds(attachment.footprint, 'attachment footprint');
  const center = requirePlanPoint(plan.centerQ, 'radialPart.plan.centerQ');
  const anchor = requirePlanPoint(radial.attachmentAnchorQ, 'radialPart.attachmentAnchorQ');
  if (JSON.stringify(anchor) !== JSON.stringify(center)
    || center[0] < attachmentBounds.minX || center[0] > attachmentBounds.maxX
    || center[1] < attachmentBounds.minZ || center[1] > attachmentBounds.maxZ) {
    throw new TypeError('attachment anchor must equal the radial center inside the rectangle');
  }
  if (!ring.some((point) => point[0] < attachmentBounds.minX || point[0] > attachmentBounds.maxX
    || point[1] < attachmentBounds.minZ || point[1] > attachmentBounds.maxZ)) {
    throw new TypeError('radial part must extend beyond its rectangular attachment');
  }

  const baseQ = requireCanonicalInt(vertical.baseQ, 'radialPart.vertical.baseQ', 0, 500);
  const topQ = requireCanonicalInt(vertical.topQ, 'radialPart.vertical.topQ', baseQ + 1, 850);
  const eaveQ = requireCanonicalInt(roof.eaveQ, 'radialPart.roof.eaveQ', topQ, 850);
  const apexQ = requireCanonicalInt(roof.apexQ, 'radialPart.roof.apexQ', eaveQ + 1, 950);
  if (baseQ !== attachment.baseElevationQ || eaveQ !== topQ || topQ <= Number(attachment.maxHeightQ)) {
    throw new TypeError('shaft/cap elevations must join explicitly above the attachment');
  }

  const sourceAttachmentShell = /** @type {Array<Record<string,unknown>>} */ (attachment.shell);
  const sourceBase = sourceAttachmentShell.find((patch) => patch.patchId === 'base');
  const sourceBaseVertices = /** @type {Array<ReadonlyArray<number>>|undefined} */ (sourceBase?.vertices);
  const sourceBaseRing = sourceBaseVertices?.map((vertex) => [vertex[0], vertex[2]]);
  if (JSON.stringify(sourceBaseRing) !== JSON.stringify(attachment.footprint)) {
    throw new TypeError('attachment footprint must equal its canonical base shell');
  }
  const attachmentShell = sourceAttachmentShell.map(convertAttachmentPatch);
  const shaftShell = shaftPatches(partId, ring, baseQ, topQ);
  const capShell = capPatches(partId, ring, eaveQ, apexQ);
  assertClosedShell(attachmentShell, 'rectangular attachment');
  assertClosedShell(shaftShell, 'radial shaft');
  assertClosedShell(capShell, 'radial cap');
  const shell = [...attachmentShell, ...shaftShell, ...capShell];
  if (new Set(shell.map((patch) => patch.patchId)).size !== shell.length) {
    throw new TypeError('composite shell patch IDs must be unique');
  }

  const primaryPartId = `${String(attachment.buildingId)}:primary`;
  return Object.freeze({
    coordinateAbiVersion: SHAPE_COORDINATE_ABI,
    shapeVocabularyVersion: SHAPE_VOCABULARY_VERSION,
    solidComposition: 'UNION_OF_CLOSED_SHELLS',
    maxHeightQ: apexQ,
    projectionSurfaces: [
      {
        surfaceId: `${primaryPartId}:plan`,
        partId: primaryPartId,
        shapeKind: 'RECTILINEAR',
        sourcePatchId: 'attachment:base',
      },
      {
        surfaceId: `${partId}:plan`,
        partId,
        shapeKind: plan.kind,
        sourcePatchId: `${partId}:cap:base`,
      },
    ],
    shapeParts: [
      {
        partId: primaryPartId,
        role: 'PRIMARY_RANGE',
        planShape: { kind: 'RECTILINEAR' },
        verticalSolid: { kind: 'EXTRUDED_POLYGON' },
        roofForm: attachment.roof,
        shellPatchIds: attachmentShell.map((patch) => patch.patchId),
      },
      {
        partId,
        role: 'TOWER',
        planShape: plan,
        verticalSolid: vertical,
        roofForm: roof,
        materials,
        shellPatchIds: [...shaftShell, ...capShell].map((patch) => patch.patchId),
      },
    ],
    attachments: [{
      attachmentId: `${String(attachment.buildingId)}:attachment:1`,
      kind: 'OVERLAP_ANCHOR',
      partAId: primaryPartId,
      partBId: partId,
      anchorQ: anchor,
    }],
    componentShells: [
      { componentId: primaryPartId, patchIds: attachmentShell.map((patch) => patch.patchId) },
      { componentId: `${partId}:shaft`, patchIds: shaftShell.map((patch) => patch.patchId) },
      { componentId: `${partId}:cap`, patchIds: capShell.map((patch) => patch.patchId) },
    ],
    shell: Object.freeze(shell),
  });
}
