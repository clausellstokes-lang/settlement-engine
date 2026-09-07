/**
 * domain/interior/index.js — THE KEYED SCALE (building interiors) barrel — DOOR 3.
 *
 * The public surface of the deterministic interior render model + its draw / export /
 * edits lanes. This barrel (and everything under src/domain/interior/) is imported by
 * NOTHING eager — only tests and the lazy InteriorView component reach it, so the
 * entry's first-paint static closure is byte-identical (the interior fingerprint stays
 * off the entry closure — tests/build/interiorLazy.test.js, the townMapLazy idiom).
 */

// THE MODEL — pure projection: `${seed}::interior:v1:<institutionId>`.
export { buildInteriorModel, toPublicSafeInterior, INTERIOR_VERSION } from './interiorModel.js';
// THE FACET GRAMMAR (THE WALL — data-only room/furnishing vocabularies).
export {
  INTERIOR_KINDS, ROOM_KINDS, FURNISHING_KINDS,
  interiorKindOf, interiorFunctionOf, resolveRoomSet, tierIndexOf, templateOf,
} from './interiorTemplates.js';
// THE ENVELOPE LAW — the footprint from the active town model.
export {
  deriveBuildingFootprint, footprintSizeFor, institutionIdOf,
  SIDE_NORTH, SIDE_EAST, SIDE_SOUTH, SIDE_WEST,
} from './interiorFootprint.js';
// THE DRAW PROJECTION — model → primitive ops → SVG (every lens applies).
export {
  buildInteriorDrawList, interiorDrawListToSvg, buildInteriorSvg, hasDrawableInterior,
} from './interiorDraw.js';
// THE EXPORT LANE — UVTT pre-walled by construction + the pricing seam.
export {
  buildInteriorUvtt, interiorExportSvg, interiorExportFilename, interiorExportGateReady,
} from './interiorExport.js';
// THE SCOPED COSMETIC SIDECAR — the mapEdits idiom, per institution.
export {
  INTERIOR_EDITS_SCHEMA_KEYS,
  readInteriorEdits, readInteriorEditEntry, readInteriorPins, readInteriorStyleLens,
  normalizeInteriorEntry, normalizeInteriorEdits,
  withInteriorPinNudge, withInteriorStyleLens, applyInteriorEdits,
} from './interiorEdits.js';
