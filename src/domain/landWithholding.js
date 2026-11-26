/**
 * domain/landWithholding.js — B1(i), THE LAND AND WHAT STANDS ON IT (CLOSE-7; the tenth chair's RULING-R24 R24-B1(i) and its
 * ruling R24b on the measure, 2026-11-24).
 *
 * ONE QUESTION, ONE FUNCTION: does this land withhold this house here? The answer is DECLARED AS DATA in three places and read
 * here only:
 *   - the terrain's own table says what the land withholds (`TERRAIN_DATA[terrain].withholds`; the desert alone: fish, timber,
 *     game);
 *   - each catalogue family says what its house lives on (`livesOn`, registry-only: `institutionalCatalog.js :: livesOnOf`);
 *   - one small table says which routes and native nearby resources give each thing (`geographyData.js :: LAND_GIVERS`; an
 *     oasis gives no fish); a thing marked `entrepot` is also given by a route that makes the place an entrepot by itself
 *     (`tradeRouteSemantics.js :: routeMakesEntrepot`, B1(i)c: furs).
 * A house is withheld where the land withholds what it lives on AND neither the place's route nor its native nearby resources
 * give it. The passes that add a catalogue house (assembleInstitutions' draw, the cascade, the faction boost) make their own
 * draw exactly as before and ask this AFTER it: a withheld house is then not taken, so no other house's draw shifts and a house
 * the place's resources give keeps exactly the chance it had. It never touches `getResourceMultiplier`.
 *
 * Pure: no randomness, no clock, no write.
 */
import { TERRAIN_DATA, LAND_GIVERS } from '../data/geographyData.js';
import { livesOnOf } from '../data/institutionalCatalog.js';
import { routeMakesEntrepot } from './tradeRouteSemantics.js';

/**
 * @typedef {{ terrainType?: string | null, tradeRoute?: string | null, nearbyResources?: ReadonlyArray<string> | null }} LandHere
 *   the place's terrain, its trade route and its NATIVE nearby resource keys (`nativeSemanticResourceKeys`, the list the draw reads)
 */

/**
 * Does this land withhold this house here?
 * @param {LandHere | null | undefined} land
 * @param {{ name?: unknown, isCustom?: unknown, source?: unknown } | string | null | undefined} house a roster or catalogue row, or a catalogue name
 * @returns {boolean}
 */
export function landWithholdsHouse(land, house) {
  const thing = livesOnOf(house);
  if (!thing || !land) return false;
  const terrain = /** @type {Record<string, { withholds?: ReadonlyArray<string> }>} */ (TERRAIN_DATA)[String(land.terrainType ?? '')];
  if (!terrain || !Array.isArray(terrain.withholds) || !terrain.withholds.includes(thing)) return false;
  const givers = /** @type {Record<string, { routes: ReadonlyArray<string>, resources: ReadonlyArray<string>, entrepot?: boolean }>} */ (LAND_GIVERS)[thing];
  if (!givers) return false;
  if (land.tradeRoute != null && givers.routes.includes(String(land.tradeRoute))) return false;
  if (givers.entrepot && routeMakesEntrepot(land.tradeRoute)) return false; // B1(i)c: an entrepot route gives what passes through it
  const near = Array.isArray(land.nearbyResources) ? land.nearbyResources : [];
  return !near.some((key) => givers.resources.includes(String(key)));
}
