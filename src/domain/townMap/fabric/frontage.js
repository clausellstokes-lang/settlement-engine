/**
 * W3's first bounded frontage-first subdivision. One routine owns the four
 * explicit morphology axes; no district/tier/culture-specific variant exists.
 */

import {
  FABRIC_FOUNDATION_LAW_VERSION, FABRIC_FOUNDATION_SCHEMA_VERSION,
  canonicalArtifactRef,
  canonicalRectBounds,
  requireCanonicalId,
  requireCanonicalInt,
  requireCanonicalRecord,
  sealCanonicalArtifact,
} from './foundation.js';
import { compareCodepoint } from '../../deterministicSort.js';

export const FRONTAGE_SUBDIVISION_LAW_VERSION = 'w3-frontage-four-axis-v1';
export const SETTLEMENT_FRONTAGE_SUBDIVISION_LAW_VERSION = 'w3-frontage-settlement-v1';
export const FRONTAGE_AXIS_KEYS = Object.freeze([
  'emptinessQ', 'gridChaosQ', 'sizeFloorQ', 'sizeVariationQ',
]);

/** @param {unknown} value */
function requireAxes(value) {
  const axes = requireCanonicalRecord(value, 'frontage axes');
  const keys = Object.keys(axes).sort();
  if (JSON.stringify(keys) !== JSON.stringify(FRONTAGE_AXIS_KEYS)) {
    throw new TypeError(`frontage axes must be exactly ${FRONTAGE_AXIS_KEYS.join(', ')}`);
  }
  return {
    sizeFloorQ: requireCanonicalInt(axes.sizeFloorQ, 'sizeFloorQ', 24, 500),
    gridChaosQ: requireCanonicalInt(axes.gridChaosQ, 'gridChaosQ'),
    sizeVariationQ: requireCanonicalInt(axes.sizeVariationQ, 'sizeVariationQ'),
    emptinessQ: requireCanonicalInt(axes.emptinessQ, 'emptinessQ', 0, 950),
  };
}

/** @param {number} widthQ @param {number} floorQ @param {number} variationQ */
function plotWidths(widthQ, floorQ, variationQ) {
  const count = Math.max(1, Math.floor(widthQ / floorQ));
  const widths = Array.from({ length: count }, () => floorQ);
  let spare = widthQ - floorQ * count;
  if (spare === 0) return widths;
  const weights = widths.map((_, index) => {
    if (variationQ === 0) return 1000;
    return index % 2 === 0 ? 1000 + variationQ : 1000 - variationQ;
  });
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  for (let index = 0; index < widths.length; index += 1) {
    const share = index === widths.length - 1
      ? spare
      : Math.floor((widthQ - floorQ * count) * weights[index] / totalWeight);
    widths[index] += share;
    spare -= share;
  }
  return widths;
}

/**
 * Seeded stop threshold, not a sampled plot-size distribution.
 * @param {unknown} foundationHash
 * @param {number} sizeFloorQ
 */
function stopThresholdQ(foundationHash, sizeFloorQ) {
  const word = parseInt(String(foundationHash).slice(9, 17), 16) >>> 0;
  const span = Math.max(1, Math.floor(sizeFloorQ / 5));
  return sizeFloorQ + (word % (span + 1));
}

/** @param {Array<[number,number]>} ring @param {number} edgeIndex */
function edgeFrame(ring, edgeIndex) {
  const a = ring[edgeIndex];
  const b = ring[(edgeIndex + 1) % ring.length];
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const widthQ = Math.abs(dx) + Math.abs(dz);
  const tx = Math.sign(dx);
  const tz = Math.sign(dz);
  /** @param {number} u @param {number} v @returns {[number,number]} */
  const point = (u, v) => [a[0] + tx * u - tz * v, a[1] + tz * u + tx * v];
  return {
    a, widthQ, tx, tz, ix: -tz, iz: tx,
    point,
  };
}

/** @param {Array<[number,number]>} polygon */
function polygonAreaQ(polygon) {
  let twice = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const next = (index + 1) % polygon.length;
    twice += polygon[index][0] * polygon[next][1] - polygon[next][0] * polygon[index][1];
  }
  return Math.abs(twice) / 2;
}

/** @param {Array<[number,number]>} ring @param {string} label */
function canonicalizeGeneratedRect(ring, label) {
  const xs = ring.map((point) => point[0]); const zs = ring.map((point) => point[1]);
  const [minX, maxX, minZ, maxZ] = [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)];
  return canonicalRectBounds([[minX, minZ], [maxX, minZ], [maxX, maxZ], [minX, maxZ]], label).ring;
}
/**
 * @param {Record<string, unknown>} source
 * @param {string} blockId
 * @param {{sizeFloorQ:number,gridChaosQ:number,sizeVariationQ:number,emptinessQ:number}} axes
 * @param {(stopQ:number,splitStaggerQ:number,backlandAreaQ:number)=>void} [recordMetrics]
 */
function deriveFrontageBlockRows(source, blockId, axes, normalizeFittedFootprint = false, recordMetrics = () => {}) {
  requireCanonicalId(blockId, 'blockId');
  const blocks = /** @type {Array<Record<string, unknown>>} */ (source.blockFaces);
  const streets = /** @type {Array<Record<string, unknown>>} */ (source.streetEdges);
  const block = blocks.find((row) => row.blockId === blockId);
  const street = streets.find((row) => row.blockId === blockId);
  if (!block || !street) throw new TypeError('block must have one explicit street edge');
  const bounds = canonicalRectBounds(block.ring, 'block.ring');
  const edgeIndex = requireCanonicalInt(street.edgeIndex, 'edgeIndex', 0, 3);
  const frame = edgeFrame(bounds.ring, edgeIndex);
  const depthQ = edgeIndex % 2 === 0 ? bounds.depthQ : bounds.widthQ;
  const setbackQ = requireCanonicalInt(street.setbackQ, 'setbackQ', 0, 250);
  const stopQ = stopThresholdQ(source.contentHash, axes.sizeFloorQ);
  const widths = plotWidths(frame.widthQ, stopQ, axes.sizeVariationQ);
  const frontBoundaries = [0];
  for (const width of widths) frontBoundaries.push(frontBoundaries[frontBoundaries.length - 1] + width);
  const rearBoundaries = frontBoundaries.map((front, index) => {
    if (index === 0 || index === frontBoundaries.length - 1) return front;
    const adjacent = Math.min(widths[index - 1], widths[index]);
    const magnitude = Math.floor(adjacent * axes.gridChaosQ / 4000);
    return front + (index % 2 === 0 ? magnitude : -magnitude);
  });
  const usableDepthQ = depthQ - setbackQ;
  const occupiedDepthQ = Math.max(1, Math.floor(usableDepthQ * (1000 - axes.emptinessQ) / 1000));
  const footprintRearQ = Math.min(depthQ, setbackQ + occupiedDepthQ);

  const plots = widths.map((frontageWidthQ, index) => {
    const frontStartQ = frontBoundaries[index];
    const frontEndQ = frontBoundaries[index + 1];
    const rearStartQ = rearBoundaries[index];
    const rearEndQ = rearBoundaries[index + 1];
    const fittedLeftQ = Math.max(frontStartQ, rearStartQ);
    const fittedRightQ = Math.min(frontEndQ, rearEndQ);
    if (fittedRightQ - fittedLeftQ < 1) throw new TypeError('grid chaos leaves no fitted footprint');
    const plotId = `${blockId}:plot:${String(index + 1).padStart(2, '0')}`;
    const frontageId = `${blockId}:frontage:${String(index + 1).padStart(2, '0')}`;
    const fittedFootprint = [
      frame.point(fittedLeftQ, setbackQ), frame.point(fittedRightQ, setbackQ),
      frame.point(fittedRightQ, footprintRearQ), frame.point(fittedLeftQ, footprintRearQ),
    ];
    return {
      plotId,
      frontageId,
      plotPolygon: [
        frame.point(frontStartQ, 0), frame.point(frontEndQ, 0),
        frame.point(rearEndQ, depthQ), frame.point(rearStartQ, depthQ),
      ],
      fittedFootprint: normalizeFittedFootprint
        ? canonicalizeGeneratedRect(fittedFootprint, `plot ${plotId} fittedFootprint`)
        : fittedFootprint,
      frontageWidthQ,
    };
  });
  const frontages = plots.map((plot) => ({
    frontageId: plot.frontageId,
    blockId,
    plotId: plot.plotId,
    streetEdgeId: street.edgeId,
    segment: [plot.plotPolygon[0], plot.plotPolygon[1]],
  }));
  const plotAreas = plots.map((plot) => polygonAreaQ(plot.plotPolygon)).sort((a, b) => a - b);
  const backlandCore = footprintRearQ < depthQ ? {
    backlandId: `${blockId}:backland`,
    polygon: [
      frame.point(0, footprintRearQ), frame.point(frame.widthQ, footprintRearQ),
      frame.point(frame.widthQ, depthQ), frame.point(0, depthQ),
    ],
  } : null;
  recordMetrics(stopQ, rearBoundaries.reduce((sum, value, index) => sum + Math.abs(value - frontBoundaries[index]), 0), backlandCore ? frame.widthQ * (depthQ - footprintRearQ) : 0);

  return {
    blockId,
    axes,
    frontages,
    plots,
    backlandCore,
    metrics: {
      plotCount: plots.length,
      stopThresholdQ: stopQ,
      plotAreaP50Q: plotAreas[Math.floor(plotAreas.length / 2)],
      splitStaggerQ: rearBoundaries.reduce((sum, value, index) => sum + Math.abs(value - frontBoundaries[index]), 0),
      frontageWidthSpreadQ: Math.max(...widths) - Math.min(...widths),
      backlandAreaQ: backlandCore ? frame.widthQ * (depthQ - footprintRearQ) : 0,
    },
  };
}
/**
 * @param {ReturnType<import('./foundation.js').sealFabricFoundation>} foundation
 * @param {string} blockId
 * @param {{sizeFloorQ:number,gridChaosQ:number,sizeVariationQ:number,emptinessQ:number}} rawAxes
 */
export function subdivideFrontageBlock(foundation, blockId, rawAxes) {
  const source = requireCanonicalRecord(foundation, 'foundation');
  if (source.artifactKind !== 'SEALED_FABRIC_FOUNDATION'
    || source.schemaVersion !== FABRIC_FOUNDATION_SCHEMA_VERSION || source.lawVersion !== FABRIC_FOUNDATION_LAW_VERSION) {
    throw new TypeError('one-block frontage requires a schema-v1 fabric foundation');
  }
  return sealCanonicalArtifact({
    artifactKind: 'FRONTAGE_SUBDIVISION',
    artifactId: `${source.artifactId}:frontage:${blockId}`,
    lawVersion: FRONTAGE_SUBDIVISION_LAW_VERSION,
    coordinateAbiVersion: source.coordinateAbiVersion,
    foundationRef: canonicalArtifactRef(/** @type {{artifactId:string,contentHash:string}} */ (source)),
    ...deriveFrontageBlockRows(source, blockId, requireAxes(rawAxes), false),
  });
}
/**
 * @param {ReturnType<import('./foundation.js').sealFabricFoundation>} foundation
 * @param {{sizeFloorQ:number,gridChaosQ:number,sizeVariationQ:number,emptinessQ:number}} rawAxes
 */
export function subdivideSettlementFrontages(foundation, rawAxes) {
  const source = requireCanonicalRecord(foundation, 'settlement foundation');
  if (source.artifactKind !== 'SEALED_FABRIC_FOUNDATION'
    || source.lawVersion !== 'mf-w3-orthogonal-cross-v1'
    || source.schemaVersion !== 2) {
    throw new TypeError('settlement frontage requires the orthogonal-cross foundation');
  }
  const axes = requireAxes(rawAxes);
  const blocks = /** @type {Array<Record<string,unknown>>} */ (source.blockFaces);
  if (!Array.isArray(blocks) || blocks.length !== 4) throw new TypeError('settlement foundation requires four blocks');
  /** @type {Array<[number,number,number]>} */ const metricRows = [];
  const results = [...blocks]
    .sort((left, right) => compareCodepoint(left.blockId, right.blockId))
    .map((block) => deriveFrontageBlockRows(source, String(block.blockId), axes, true, (stop, split, backland) => metricRows.push([stop, split, backland])));
  const frontages = results.flatMap((result) => result.frontages).sort((left, right) => compareCodepoint(left.frontageId, right.frontageId));
  const plots = results.flatMap((result) => result.plots).sort((left, right) => compareCodepoint(left.plotId, right.plotId));
  const backlandCores = results.filter((result) => result.backlandCore).map((result) => ({ blockId: result.blockId, ...result.backlandCore }))
    .sort((left, right) => compareCodepoint(left.backlandId, right.backlandId));
  const plotAreas = plots.map((plot) => polygonAreaQ(plot.plotPolygon)).sort((a, b) => a - b);
  const frontageWidths = plots.map((plot) => Number(plot.frontageWidthQ));
  const stopThresholds = new Set(metricRows.map((row) => row[0]));
  if (stopThresholds.size !== 1) throw new TypeError('settlement W3 stop threshold must be singular');
  return sealCanonicalArtifact({
    artifactKind: 'FRONTAGE_SUBDIVISION',
    artifactId: `${source.artifactId}:frontage:settlement`,
    lawVersion: SETTLEMENT_FRONTAGE_SUBDIVISION_LAW_VERSION,
    coordinateAbiVersion: source.coordinateAbiVersion,
    foundationRef: canonicalArtifactRef(/** @type {{artifactId:string,contentHash:string}} */ (source)),
    blockIds: results.map((result) => result.blockId),
    axes,
    frontages,
    plots,
    backlandCores,
    metrics: {
      blockCount: results.length,
      plotCount: plots.length,
      stopThresholdQ: metricRows[0][0],
      plotAreaP50Q: plotAreas[Math.floor(plotAreas.length / 2)],
      splitStaggerQ: metricRows.reduce((sum, row) => sum + row[1], 0),
      frontageWidthSpreadQ: Math.max(...frontageWidths) - Math.min(...frontageWidths),
      backlandAreaQ: metricRows.reduce((sum, row) => sum + row[2], 0),
    },
  });
}
/** @param {Record<string, unknown>} subdivision @param {string} plotId */
export function frontagePlotById(subdivision, plotId) {
  const plots = Array.isArray(subdivision.plots) ? subdivision.plots : [];
  return plots.find((plot) => plot && typeof plot === 'object' && plot.plotId === plotId) ?? null;
}
