/**
 * legacyPlacements.js — pure map-state adapter.
 *
 * Extracted byte-for-byte from WorldMap.jsx (no logic change).
 */

/**
 * Convert mapState.placements (burgId → {settlementId, x, y, ...}) into the
 * flat array shape that bridge.restorePlacements expects.
 */
export function legacyPlacementsArray(ms) {
  if (!ms?.placements) return [];
  // If _legacyPlacements already exists (v1 migration), use it
  if (Array.isArray(ms._legacyPlacements) && ms._legacyPlacements.length) {
    return ms._legacyPlacements;
  }
  const out = [];
  for (const [burgIdStr, p] of Object.entries(ms.placements)) {
    if (typeof p?.x !== 'number' || typeof p?.y !== 'number') continue;
    out.push({
      burgId: Number(burgIdStr),
      settlementId: p.settlementId || null,
      x: p.x,
      y: p.y,
      name: p.name,
      population: p.population,
    });
  }
  return out;
}
