/**
 * resourceTerrainCompatibility.js — THE ONE terrain/route legality read over the
 * native resource catalog.
 *
 * WHY THIS FILE EXISTS (a layering inversion, not a new capability). The predicate
 * below is verbatim the `getCompatibleResources` that lived in
 * src/generators/terrainHelpers.js. It answers a pure question about RESOURCE_DATA
 * — "could this resource exist at a settlement with this terrain and this trade
 * route?" — and it is read from BOTH layers: generation rolls its native roster
 * from it (generators/steps/resolveResources.js), and the simulation reads it to
 * decide what a resource strike or a new steading may legitimately hold
 * (domain/worldPulse/resourceDynamicsKernel.js, domain/worldPulse/steadingTopography.js).
 *
 * A shared leaf that both layers need belongs in the layer BOTH may import. Leaving
 * it in src/generators forced every new simulation reader to open a fresh
 * domain -> generators edge, which is the cycle tests/build/domainGeneratorsBoundary.js
 * exists to stop metastasizing; that ratchet's own instruction is "move the shared
 * leaf down a layer". This is that move. src/generators/terrainHelpers.js re-exports
 * the symbol, so every existing caller is untouched and the frozen baseline is
 * unchanged (a later wave can point resourceDynamicsKernel here and SHRINK it).
 *
 * PURE: one src/data import, no store, no React, no I/O, no Date/Math.random.
 *
 * @enforced-by tests/build/domainGeneratorsBoundary.test.js,
 *   tests/domain/steadingTopography.test.js, tests/generators/resolveResources.test.js
 */

import { RESOURCE_DATA } from '../data/resourceData.js';

// Water terrain overrides for route-based resource compatibility.
// A coastal or riverside settlement can access water resources regardless of trade route.
const WATER_TERRAIN_RESOURCES = new Set([
  'fishing_grounds', 'river_fish', 'salt_flats', 'deep_harbour',
  'shipbuilding_timber', 'river_mills', 'river_clay', 'fertile_floodplain',
]);
const WATER_TERRAIN = new Set(['coastal', 'riverside']);

/**
 * The catalog fields this predicate reads. RESOURCE_DATA is an object literal, so
 * tsc infers a 33-member heterogeneous union in which the optional keys exist on
 * only some arms; the domain layer typechecks strict, so the catalog is read
 * through ONE declared row shape (the resourceDynamicsKernel idiom). Erased at
 * runtime — the values are the same object.
 * @typedef {{ forbidden?: string[], terrain?: string, terrainRequired?: string[],
 *   warning?: string }} ResourceTerrainRow
 */
const CATALOG = /** @type {Record<string, ResourceTerrainRow & Record<string, unknown>>} */ (
  /** @type {unknown} */ (RESOURCE_DATA));

/**
 * @param {string} route
 * @param {string|null} [terrain]
 * @returns {Array<{ key: string, compatible: boolean, incompatibleReason: (string|null) } & Record<string, unknown>>}
 */
export const getCompatibleResources = (route, terrain = null) =>
  Object.entries(CATALOG).map(([key, r]) => {
    // `port` describes connectivity, not water body. Riverside disambiguates
    // it as a river port, so resource eligibility must use the river rules:
    // fishing weirs and mill sites are valid; reefs and deep harbours are not.
    const resourceRoute =
      route === 'port' && terrain === 'riverside'
        ? 'river'
        : route;
    const routeBlocked = (r.forbidden || []).includes(resourceRoute);
    const resTerrain = r.terrain || null; // desert, mountain, or null (universal)
    const requiredTerrains = Array.isArray(r.terrainRequired)
      ? r.terrainRequired
      : null;

    // Water terrain override: if settlement terrain is coastal/riverside, water resources
    // are compatible regardless of trade route (a coastal road hamlet can still fish).
    const terrainUnlocks = terrain && WATER_TERRAIN.has(terrain) && WATER_TERRAIN_RESOURCES.has(key);
    // River-specific resources should only unlock on riverside terrain, not coastal
    const riverOnly = (key === 'river_fish' || key === 'river_mills' || key === 'river_clay' || key === 'fertile_floodplain');
    const terrainUnlocksActual = terrainUnlocks && (!riverOnly || terrain === 'riverside');

    let compatible, incompatibleReason;

    if (
      requiredTerrains
      && (!terrain || !requiredTerrains.includes(terrain))
    ) {
      compatible = false;
      incompatibleReason =
        `Only available in ${requiredTerrains.join(' or ')} terrain`;
    } else if (resTerrain) {
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
