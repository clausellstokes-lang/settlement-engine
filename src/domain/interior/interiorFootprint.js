/**
 * domain/interior/interiorFootprint.js — THE ENVELOPE LAW (DOOR 3).
 *
 * An interior fits its building's ACTUAL footprint from the settlement's active town
 * layout model — the map and the interior may NEVER disagree about a building's size
 * or its entrance side. This module derives that footprint, read-only, from the same
 * model the map draws (v2 where the settlement's mapEdits select layoutLawVersion 2,
 * v1 otherwise — buildTownMapModel dispatches).
 *
 * THE MAP'S FOOTPRINT IS A POINT. Both town models place a building as a POSITION with
 * a `kind` ('landmark' renders as a small square; 'fill' renders as a district-wide
 * accent, no discrete footprint). So the ENVELOPE has two deterministic parts:
 *   • ENTRANCE SIDE — read FROM the map: the building faces the street, which arrives
 *     from its district centroid, so the entrance sits on the footprint edge facing the
 *     centroid (the dominant axis of centroid − position). This is the "shared with the
 *     map" invariant the envelope-law pin checks.
 *   • FOOTPRINT SIZE — derived from KIND × tier × prosperity (JUDGMENT, vetoable):
 *     because the model renders every landmark as a uniform square and every fill as a
 *     district accent, there is no per-building polygon to read a size from; the
 *     interior's cell dimensions are inferred from the institution's kind aspect and the
 *     settlement's scale. A landmark yields source:'landmark'; a fill / absent building
 *     yields source:'derived' with the same size rule and a core-facing default entrance.
 *
 * Pure, deterministic, integer-only. No Date / Math.random / localeCompare.
 */

import { buildTownMapModel } from '../townMap/townMapModel.js';
import { readMapEdits } from '../townMap/mapEdits.js';
import { anchorForInstitution } from '../townMap/anchors.js';
import { clamp } from '../../kernel/math.js';
import { templateOf } from './interiorTemplates.js';

/** Entrance side indices — the footprint edge the door sits on. */
export const SIDE_NORTH = 0; // top    (−y)
export const SIDE_EAST = 1;  // right  (+x)
export const SIDE_SOUTH = 2; // bottom (+y)
export const SIDE_WEST = 3;  // left   (−x)

/** Footprint cell bounds — an interior is never smaller than a hovel nor larger than a
 *  keep hall (simplicity-over-fidelity: institution interiors are rooms, not dungeons). */
const MIN_CELLS = 4;
const MAX_CELLS = 30;

/**
 * @typedef {Object} BuildingFootprint
 * @property {string} institutionId     the stable anchor (anchorForInstitution)
 * @property {number} widthCells        footprint width in interior grid cells
 * @property {number} depthCells        footprint depth (entrance-to-back) in cells
 * @property {number} entranceSide      SIDE_* — the edge the door sits on (from the map)
 * @property {'landmark'|'derived'} source  landmark = a discrete map footprint; derived = fill/absent
 * @property {{ x:number, y:number }|null} mapPosition  the building's town-space point (or null)
 */

/** The town-space direction from a point to a target, reduced to a cardinal SIDE_*
 *  (the dominant axis). @param {number} dx @param {number} dy @returns {number} */
function cardinalSide(dx, dy) {
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? SIDE_EAST : SIDE_WEST;
  return dy >= 0 ? SIDE_SOUTH : SIDE_NORTH;
}

/** Tier scale (×100) on footprint size — a hamlet shop is small, a city hall large.
 *  @param {number} tierIndex @returns {number} */
function tierScale(tierIndex) {
  return 80 + Math.max(0, tierIndex) * 12; // idx 0 → 0.80 … idx 6 → 1.52
}

/** Prosperity scale (×100) on footprint size — the prosperous tavern IS bigger.
 *  @param {number} prosperity01 @returns {number} */
function prosperityScale(prosperity01) {
  const p = typeof prosperity01 === 'number' && Number.isFinite(prosperity01)
    ? (prosperity01 < 0 ? 0 : prosperity01 > 1 ? 1 : prosperity01) : 0.5;
  return 84 + Math.round(p * 32); // 0 → 0.84 … 1 → 1.16
}

/**
 * Derive the footprint size (cells) for a kind at a scale. Deterministic, integer.
 * @param {string} kind @param {number} tierIndex @param {number} prosperity01
 * @returns {{ widthCells: number, depthCells: number }}
 */
export function footprintSizeFor(kind, tierIndex, prosperity01) {
  const tpl = templateOf(kind);
  const scale = tierScale(tierIndex) * prosperityScale(prosperity01); // ×10000
  const w = clamp(Math.round((tpl.baseCells * tpl.widthRatio * scale) / 1000000), MIN_CELLS, MAX_CELLS);
  const d = clamp(Math.round((tpl.baseCells * tpl.depthRatio * scale) / 1000000), MIN_CELLS, MAX_CELLS);
  return { widthCells: w, depthCells: d };
}

/**
 * Derive the building's envelope footprint from the settlement's ACTIVE town model.
 * Pure + read-only (never mutates the settlement, never writes the model). The
 * entrance side comes from the map (the centroid-facing edge); a building absent from
 * the model (degenerate map, or an institution the assigner floored away) falls to a
 * core-facing default entrance (SIDE_SOUTH — the market core sits toward the frame
 * center/bottom) and the same size rule — recorded source:'derived'.
 * @param {import('./interiorModel.js').InteriorSettlement} settlement
 * @param {string} institutionId    anchorForInstitution(inst)
 * @param {string} kind             interiorKindOf(inst)
 * @param {number} tierIndex
 * @param {number} prosperity01
 * @returns {BuildingFootprint}
 */
export function deriveBuildingFootprint(settlement, institutionId, kind, tierIndex, prosperity01) {
  const { widthCells, depthCells } = footprintSizeFor(kind, tierIndex, prosperity01);
  // The town model reads a broader settlement shape than the interior does; the
  // interior view is a structural subset, so bridge through `unknown` (a real-type
  // cast, never `any`) to the model's own input type. Read-only — never mutated.
  const townSettlement = /** @type {import('../townMap/townMapModel.js').TownMapSettlement} */ (
    /** @type {unknown} */ (settlement));
  const model = buildTownMapModel(townSettlement, readMapEdits(townSettlement));
  const buildings = Array.isArray(model?.buildings) ? model.buildings : [];
  const building = buildings.find((b) => b.anchorKey === institutionId) || null;

  if (!building || !building.position) {
    return {
      institutionId, widthCells, depthCells,
      entranceSide: SIDE_SOUTH, source: 'derived', mapPosition: null,
    };
  }
  const districts = Array.isArray(model?.districts) ? model.districts : [];
  const district = districts.find((d) => d.id === building.districtId) || null;
  const centroid = district && district.centroid ? district.centroid : { x: 500, y: 500 };
  const entranceSide = cardinalSide(centroid.x - building.position.x, centroid.y - building.position.y);
  return {
    institutionId, widthCells, depthCells, entranceSide,
    source: building.kind === 'landmark' ? 'landmark' : 'derived',
    mapPosition: { x: building.position.x, y: building.position.y },
  };
}

/** Re-export the stable anchor helper so interior callers key on the SAME identity the
 *  map uses (catalogId → localUid → name-slug).
 *  @param {import('./interiorModel.js').InteriorInstitution} inst @returns {string} */
export function institutionIdOf(inst) {
  return anchorForInstitution(inst);
}
