/**
 * The whole-world soak's deterministic spatial canon.
 *
 * A headless audit cannot capture a live FMG iframe, so it reuses the maintained,
 * transparent synthetic FMG pack from the spatial invariant suite and feeds that
 * capture shape through the production `buildSpatialDigest` authoring seam. This
 * is fixture data, not a second engine path: every runtime spatial read consumes
 * the same positive canon marker + frozen digest shape.
 *
 * The explicit disabled branch belongs to the all-dark behavioral control. It
 * returns no marker and no digest, preserving the constitutional aspatial path.
 */

import {
  buildSpatialDigest,
  COST_LAW_VERSION,
  SEASONAL_OVERLAY_VERSION,
  SPATIAL_GEOMETRY_VERSION,
} from '../../src/domain/spatial/index.js';
import {
  makeGridPack,
  placeSettlements,
} from '../../tests/fixtures/spatialPackFixtures.js';
import { deepFreeze } from '../../src/domain/worldPulse/worldState.js';

export const WHOLE_WORLD_SOAK_SPATIAL_FIXTURE_PATH =
  'tests/fixtures/spatialPackFixtures.js';

/**
 * @param {Array<{ id?: unknown, settlement?: { institutions?: unknown } }>} saves
 * @param {{ enabled?: boolean }} [options]
 * @returns {{ spatialCanonVersion?: number, spatialDigest?: ReturnType<typeof buildSpatialDigest> }}
 */
export function buildWholeWorldSoakSpatialCanon(
  saves,
  { enabled = true } = {},
) {
  if (!enabled) return {};

  const rows = Array.isArray(saves) ? saves : [];
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const seats = placeSettlements(pack, rows.length);
  const placements = seats.map((seat, index) => ({
    id: String(rows[index]?.id ?? ''),
    cellId: seat.cellId,
    institutions: Array.isArray(rows[index]?.settlement?.institutions)
      ? rows[index].settlement.institutions
      : [],
  }));
  const spatialDigest = buildSpatialDigest({
    pack,
    placements,
    spatialGeometryVersion: SPATIAL_GEOMETRY_VERSION,
    costLawVersion: COST_LAW_VERSION,
    overlayVersion: SEASONAL_OVERLAY_VERSION,
    seasonalRoads: true,
    seaLanes: true,
    teleport: true,
  });
  if (spatialDigest.settlementIds.length !== rows.length) {
    throw new Error(
      `whole-world soak spatial fixture mapped ${spatialDigest.settlementIds.length}/${rows.length} settlements`,
    );
  }
  deepFreeze(spatialDigest);
  return { spatialCanonVersion: 1, spatialDigest };
}
