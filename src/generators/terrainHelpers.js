
/**
 * terrainHelpers.js
 * Terrain type resolution and geographic modifiers
 */

import {RESOURCE_DATA} from '../data/resourceData.js';

// ─────────────────────────────────────────────────────────

// getTerrainType — map trade route to terrain category
// terrainOverride allows explicit desert/mountain/hills selection
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

// getCompatibleResources
// Water terrain overrides for route-based resource compatibility.
// A coastal or riverside settlement can access water resources regardless of trade route.
const WATER_TERRAIN_RESOURCES = new Set([
  'fishing_grounds', 'river_fish', 'salt_flats', 'deep_harbour',
  'shipbuilding_timber', 'river_mills', 'river_clay', 'fertile_floodplain',
]);
const WATER_TERRAIN = new Set(['coastal', 'riverside']);

export const getCompatibleResources = (route, terrain = null) =>
  Object.entries(RESOURCE_DATA).map(([key, r]) => {
    const routeBlocked = (r.forbidden || []).includes(route);
    const resTerrain = r.terrain || null; // desert, mountain, or null (universal)

    // Water terrain override: if settlement terrain is coastal/riverside, water resources
    // are compatible regardless of trade route (a coastal road hamlet can still fish).
    const terrainUnlocks = terrain && WATER_TERRAIN.has(terrain) && WATER_TERRAIN_RESOURCES.has(key);
    // River-specific resources should only unlock on riverside terrain, not coastal
    const riverOnly = (key === 'river_fish' || key === 'river_mills' || key === 'river_clay' || key === 'fertile_floodplain');
    const terrainUnlocksActual = terrainUnlocks && (!riverOnly || terrain === 'riverside');

    let compatible, incompatibleReason;

    if (resTerrain) {
      // Terrain-specific resource: only show when that terrain is selected
      if (!terrain) {
        compatible = false;
        incompatibleReason = 'Requires ' + resTerrain + ' terrain override';
      } else if (terrain === resTerrain) {
        compatible = true;
        incompatibleReason = null;
      } else {
        compatible = false;
        incompatibleReason = 'Only available in ' + resTerrain + ' terrain';
      }
    } else if (terrainUnlocksActual) {
      // Water resource + water terrain → compatible regardless of trade route
      compatible = !routeBlocked;  // only blocked if explicitly in forbidden (e.g. isolated)
      incompatibleReason = routeBlocked ? (r.warning || 'Not compatible with ' + route + ' access.') : null;
    } else {
      // Universal resource: use route-based compatibility
      compatible = !routeBlocked;
      incompatibleReason = routeBlocked ? (r.warning || 'Not compatible with ' + route + ' access.') : null;
    }

    return { key, ...r, compatible, incompatibleReason };
  });

// getDefaultResources
export const getDefaultResources=r=>{const s={port:["fishing_grounds","salt_flats","deep_harbour","shipbuilding_timber"],river:["river_mills","fertile_floodplain","river_fish","river_clay"],crossroads:["grain_fields","grazing_land","crossroads_position"],road:["grain_fields","grazing_land","managed_forest"],isolated:["hunting_grounds","managed_forest","foraging_areas"]};return s[r]||s.road};
