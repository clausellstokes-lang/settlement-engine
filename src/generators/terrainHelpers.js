
/**
 * terrainHelpers.js
 * Terrain type resolution and geographic modifiers
 */

// getCompatibleResources MOVED DOWN A LAYER (W-E). The terrain/route legality
// predicate is read by BOTH generation and the simulation, so it now lives in
// src/domain/resourceTerrainCompatibility.js — the layer both may import — and is
// re-exported here so every existing caller of terrainHelpers is untouched. See
// that file's header and tests/build/domainGeneratorsBoundary.test.js.
export { getCompatibleResources } from '../domain/resourceTerrainCompatibility.js';

// ─────────────────────────────────────────────────────────

// getTerrainType — map trade route to terrain category
// terrainOverride allows explicit desert/mountain/hills selection
/**
 * @param {string} tradeRoute
 * @param {string|null} [terrainOverride]
 * @returns {string}
 */
export const getTerrainType = (tradeRoute, terrainOverride = null) => {
  if (terrainOverride && terrainOverride !== 'auto') return terrainOverride;
  return ({
    port: "coastal",
    river: "riverside",
    crossroads: "plains",
    road: "plains",
    isolated: "forest",
    mountain_pass: "mountain",
    mountain_road: "mountain",
    desert_road: "desert",
  })[tradeRoute] || "plains";
};

// getDefaultResources
export const getDefaultResources = (r) => {
  const s = {
    port: [
      "fishing_grounds",
      "salt_flats",
      "deep_harbour",
      "shipbuilding_timber",
    ],
    river: [
      "river_mills",
      "fertile_floodplain",
      "river_fish",
      "river_clay",
    ],
    crossroads: [
      "grain_fields",
      "grazing_land",
      "crossroads_position",
    ],
    road: [
      "grain_fields",
      "grazing_land",
      "managed_forest",
    ],
    isolated: [
      "hunting_grounds",
      "managed_forest",
      "foraging_areas",
    ],
  };
  return s[r] || s.road;
};
