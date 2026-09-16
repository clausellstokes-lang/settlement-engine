/**
 * domain/spatial — the pure spatial-canon engine (Phase 5.5 KEYSTONE).
 *
 * The frozen, integer-quantized spatial digest: territory (a Voronoi-of-
 * settlements partition), gates, neighbour tiers, base distance matrix, and route
 * receipts, derived ONCE at an entitled canonize from a captured FMG pack and
 * read (never recomputed) thereafter. Everything here is pure + seeded — no
 * iframe, no tier/auth, no Date/Math.random — so the digest is byte-identical on
 * replay across clients.
 *
 * FIRST PAINT: this module must NEVER enter the entry static closure. Its sole
 * store consumer (campaignWorldPulseSlice's spatial canonize) reaches it through a
 * DYNAMIC import at action time, so Rollup splits it into its own lazy chunk.
 * Keep it that way — no eager/static import of this barrel from a first-paint
 * module.
 */

export {
  BIOME_COST,
  LAND_HEIGHT,
  COST_SCALE,
  DIST_SCALE,
  TERRAIN_CLASSES,
  MOUNTAIN_HEIGHT,
  terrainClassOf,
  landCostRaw,
  seaCostRaw,
  quantizeCellCost,
  quantizeDist,
  buildCostField,
  SEASONAL_OVERLAY_VERSION,
  SLOW_NOT_SEVER_MAX,
  SEASON_TERRAIN_COST,
  buildSeasonalOverlay,
} from './spatialCost.js';

export {
  SPATIAL_GEOMETRY_VERSION,
  COST_LAW_VERSION,
  OVERLAY_VERSION,
  BIOME_TEXTURE_VERSION,
  normalizeSpatialPack,
  resolveSeeds,
  buildSpatialDigest,
} from './spatialDigest.js';

export {
  SEA_LANE_VERSION,
  SEA_COST_PER_DIST,
  SEA_LANE_CAPACITY,
  SEA_LANE_K_NEIGHBOURS,
  STORM_SEASON_COST,
  waterAccessInstitutionNames,
  hasWaterAccessInstitution,
  isCoastalCell,
  isRiverCell,
  derivePortEligibility,
  buildSeaLaneSet,
  buildSeaLanes,
} from './seaLanes.js';

export {
  TELEPORT_EDGE_VERSION,
  TELEPORT_EDGE_COST,
  TELEPORT_EDGE_CAPACITY,
  teleportInstitutionNames,
  hasTeleportInstitution,
  deriveTeleportEligibility,
  buildTeleportEdgeSet,
  buildTeleportEdges,
} from './teleportEdges.js';
