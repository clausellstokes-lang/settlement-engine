/** Pure row derivation for the one admitted multi-block settlement plan. */

import { compareCodepoint } from '../../deterministicSort.js';

export const ORTHOGONAL_CROSS_PLAN_KIND = 'ORTHOGONAL_CROSS_V1';
export const ORTHOGONAL_CROSS_CELL_NAMES = Object.freeze([
  'HIGH_X_HIGH_Z',
  'HIGH_X_LOW_Z',
  'LOW_X_HIGH_Z',
  'LOW_X_LOW_Z',
]);

/** @type {Readonly<Record<'HORIZONTAL'|'VERTICAL', Readonly<Record<string,number>>>>} */
const EDGE_BY_AXIS = Object.freeze({
  HORIZONTAL: Object.freeze({
    HIGH_X_HIGH_Z: 0,
    HIGH_X_LOW_Z: 2,
    LOW_X_HIGH_Z: 0,
    LOW_X_LOW_Z: 2,
  }),
  VERTICAL: Object.freeze({
    HIGH_X_HIGH_Z: 3,
    HIGH_X_LOW_Z: 3,
    LOW_X_HIGH_Z: 1,
    LOW_X_LOW_Z: 1,
  }),
});

/** @param {number} minX @param {number} minZ @param {number} maxX @param {number} maxZ @returns {Array<[number,number]>} */
function rectRing(minX, minZ, maxX, maxZ) {
  return [[minX, minZ], [maxX, minZ], [maxX, maxZ], [minX, maxZ]];
}

/** @param {Array<[number,number]>} ring */
function rectAreaQ(ring) {
  return (ring[1][0] - ring[0][0]) * (ring[2][1] - ring[1][1]);
}

/**
 * @param {unknown} value @param {string} label @param {string[]} expected
 * @param {(value:unknown,label:string)=>Record<string,unknown>} record
 * @returns {Record<string,unknown>}
 */
function exactKeys(value, label, expected, record) {
  const result = record(value, label);
  if (JSON.stringify(Object.keys(result).sort(compareCodepoint))
    !== JSON.stringify([...expected].sort(compareCodepoint))) {
    throw new TypeError(`${label} must contain exactly ${[...expected].sort(compareCodepoint).join(', ')}`);
  }
  return result;
}

/**
 * Validate the closed plan before deriving any row.
 * @param {unknown} planValue
 * @param {{
 *   canonicalRectBounds:(value:unknown,label?:string)=>{ring:Array<[number,number]>,minX:number,maxX:number,minZ:number,maxZ:number,widthQ:number,depthQ:number},
 *   requireCanonicalId:(value:unknown,label:string)=>string,
 *   requireCanonicalInt:(value:unknown,label:string,min?:number,max?:number)=>number,
 *   requireCanonicalRecord:(value:unknown,label:string)=>Record<string,unknown>,
 * }} validators
 */
export function prepareOrthogonalCrossPlan(planValue, validators) {
  const { canonicalRectBounds, requireCanonicalId, requireCanonicalInt, requireCanonicalRecord } = validators;
  const plan = exactKeys(planValue, 'plan', [
    'cells', 'frontageAxis', 'groundRing', 'horizontalStreet', 'kind', 'setbackQ', 'verticalStreet',
  ], requireCanonicalRecord);
  if (plan.kind !== ORTHOGONAL_CROSS_PLAN_KIND) throw new TypeError('unsupported fabric plan kind');
  const bounds = canonicalRectBounds(plan.groundRing, 'plan.groundRing');
  const vertical = exactKeys(plan.verticalStreet, 'plan.verticalStreet', ['maxXQ', 'minXQ', 'streetId'], requireCanonicalRecord);
  const horizontal = exactKeys(plan.horizontalStreet, 'plan.horizontalStreet', ['maxZQ', 'minZQ', 'streetId'], requireCanonicalRecord);
  const verticalStreet = { streetId: requireCanonicalId(vertical.streetId, 'verticalStreet.streetId'),
    minXQ: requireCanonicalInt(vertical.minXQ, 'verticalStreet.minXQ'),
    maxXQ: requireCanonicalInt(vertical.maxXQ, 'verticalStreet.maxXQ') };
  const horizontalStreet = { streetId: requireCanonicalId(horizontal.streetId, 'horizontalStreet.streetId'),
    minZQ: requireCanonicalInt(horizontal.minZQ, 'horizontalStreet.minZQ'),
    maxZQ: requireCanonicalInt(horizontal.maxZQ, 'horizontalStreet.maxZQ') };
  if (verticalStreet.streetId === horizontalStreet.streetId
    || verticalStreet.minXQ <= bounds.minX || verticalStreet.maxXQ >= bounds.maxX
    || verticalStreet.minXQ >= verticalStreet.maxXQ
    || horizontalStreet.minZQ <= bounds.minZ || horizontalStreet.maxZQ >= bounds.maxZ
    || horizontalStreet.minZQ >= horizontalStreet.maxZQ) {
    throw new TypeError('street bands must be distinct, positive, and strictly inside ground');
  }
  if (!Array.isArray(plan.cells) || plan.cells.length !== 4) throw new TypeError('orthogonal cross requires exactly four cells');
  const cells = /** @type {unknown[]} */ (plan.cells).map((value, index) => {
    const cell = exactKeys(value, `plan.cells[${index}]`, ['blockId', 'cell', 'edgeId'], requireCanonicalRecord);
    return { cell: String(cell.cell),
      blockId: requireCanonicalId(cell.blockId, `plan.cells[${index}].blockId`),
      edgeId: requireCanonicalId(cell.edgeId, `plan.cells[${index}].edgeId`) };
  });
  if (JSON.stringify(cells.map((cell) => cell.cell).sort(compareCodepoint))
      !== JSON.stringify(ORTHOGONAL_CROSS_CELL_NAMES)
    || new Set(cells.map((cell) => cell.blockId)).size !== 4
    || new Set(cells.map((cell) => cell.edgeId)).size !== 4) {
    throw new TypeError('cell names, block IDs, and edge IDs must each be exact and unique');
  }
  const frontageAxis = String(plan.frontageAxis);
  if (!['HORIZONTAL', 'VERTICAL'].includes(frontageAxis)) throw new TypeError('unsupported frontage axis');
  return { bounds, verticalStreet, horizontalStreet, cells,
    frontageAxis: /** @type {'HORIZONTAL'|'VERTICAL'} */ (frontageAxis),
    setbackQ: requireCanonicalInt(plan.setbackQ, 'plan.setbackQ', 0, 250) };
}

/**
 * Returns unsealed rows only. The caller remains the sole artifact/hash owner.
 * All IDs, bounds, uniqueness, and enum membership are validated before entry.
 * @param {{
 *   bounds:{minX:number,maxX:number,minZ:number,maxZ:number},
 *   verticalStreet:{streetId:string,minXQ:number,maxXQ:number},
 *   horizontalStreet:{streetId:string,minZQ:number,maxZQ:number},
 *   cells:Array<{cell:string,blockId:string,edgeId:string}>,
 *   frontageAxis:'VERTICAL'|'HORIZONTAL',
 *   setbackQ:number,
 * }} input
 */
export function deriveOrthogonalCrossRows(input) {
  const { bounds, verticalStreet, horizontalStreet, frontageAxis, setbackQ } = input;
  /** @type {Record<string,Array<[number,number]>>} */
  const rings = {
    LOW_X_LOW_Z: rectRing(bounds.minX, bounds.minZ, verticalStreet.minXQ, horizontalStreet.minZQ),
    HIGH_X_LOW_Z: rectRing(verticalStreet.maxXQ, bounds.minZ, bounds.maxX, horizontalStreet.minZQ),
    LOW_X_HIGH_Z: rectRing(bounds.minX, horizontalStreet.maxZQ, verticalStreet.minXQ, bounds.maxZ),
    HIGH_X_HIGH_Z: rectRing(verticalStreet.maxXQ, horizontalStreet.maxZQ, bounds.maxX, bounds.maxZ),
  };
  const cellByName = new Map(input.cells.map((cell) => [cell.cell, cell]));
  const blockFaces = ORTHOGONAL_CROSS_CELL_NAMES.map((cellName) => {
    const cell = cellByName.get(cellName);
    if (!cell) throw new TypeError(`missing orthogonal cross cell ${cellName}`);
    return { blockId: cell.blockId, ring: rings[cellName] };
  }).sort((left, right) => compareCodepoint(left.blockId, right.blockId));
  const streetEdges = ORTHOGONAL_CROSS_CELL_NAMES.map((cellName) => {
    const cell = cellByName.get(cellName);
    if (!cell) throw new TypeError(`missing orthogonal cross cell ${cellName}`);
    return {
      edgeId: cell.edgeId,
      streetId: frontageAxis === 'VERTICAL' ? verticalStreet.streetId : horizontalStreet.streetId,
      blockId: cell.blockId,
      edgeIndex: EDGE_BY_AXIS[frontageAxis][cellName],
      setbackQ,
    };
  }).sort((left, right) => compareCodepoint(left.edgeId, right.edgeId));
  const verticalRing = rectRing(
    verticalStreet.minXQ, bounds.minZ, verticalStreet.maxXQ, bounds.maxZ,
  );
  const horizontalRing = rectRing(
    bounds.minX, horizontalStreet.minZQ, bounds.maxX, horizontalStreet.maxZQ,
  );
  const streetCorridors = [
    { streetId: verticalStreet.streetId, ring: verticalRing },
    { streetId: horizontalStreet.streetId, ring: horizontalRing },
  ].sort((left, right) => compareCodepoint(left.streetId, right.streetId));
  const groundAreaQ = (bounds.maxX - bounds.minX) * (bounds.maxZ - bounds.minZ);
  const intersectionAreaQ = (verticalStreet.maxXQ - verticalStreet.minXQ)
    * (horizontalStreet.maxZQ - horizontalStreet.minZQ);
  const streetUnionAreaQ = rectAreaQ(verticalRing) + rectAreaQ(horizontalRing) - intersectionAreaQ;
  const blockAreaQ = blockFaces.reduce((sum, block) => sum + rectAreaQ(block.ring), 0);
  if (groundAreaQ !== streetUnionAreaQ + blockAreaQ) {
    throw new TypeError('orthogonal cross rows do not conserve ground area');
  }
  return {
    streetCorridors,
    blockFaces,
    streetEdges,
    metrics: { groundAreaQ, streetUnionAreaQ, blockAreaQ },
  };
}
