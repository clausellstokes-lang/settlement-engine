/**
 * domain/certification/couplingRegistry.js — CW-0's growing cross-layer
 * coupling registry.
 *
 * Pure data plus pure lookup only: no state, writer, clock, or randomness. A
 * coupling row records the foreign read, the receipt field that makes it
 * reviewable, and the counterforce reading the same evidence. The registry
 * grows in the same change that lands each cross-layer read; this first seed is
 * WR-3's population-to-war lineage coupling.
 */

export const COUPLING_REGISTRY_SCHEMA_VERSION = 1;

/**
 * WR-3 / CPL-3. The lineage claim and kinship bond are two signs over the same
 * memoized parent-child evidence read. Positive claims persist through the
 * ordinary reason receipt. A suppressed score cannot truthfully enter that
 * ledger, so the direct read's suppression receipt is the registry field.
 */
export const WR3_LINEAGE_COUPLING = Object.freeze({
  pairId: 'CPL-3',
  direction: 'POP→WAR',
  read: 'src/domain/worldPulse/lineageClaim.js#makeLineageClaimRead.lineageClaimOf',
  receiptField: 'lineageClaimOf(...).suppression.receipt',
  counterforce: 'src/domain/worldPulse/lineageClaim.js#makeLineageClaimRead.kinshipBondOf',
  flags: Object.freeze([
    'demographicsEnabled',
    'lineageClaimEnabled',
    'peaceEngineEnabled',
    'warLayerEnabled',
  ]),
  owningVolume: 'WAR',
  owningWave: 'WR-3',
  intendedDesk: 'war',
});

export const COUPLING_REGISTRY = Object.freeze([
  WR3_LINEAGE_COUPLING,
]);

/**
 * Resolve one directional pair row. Unknown or incomplete keys return null;
 * callers never receive a fabricated fallback row.
 *
 * @param {unknown} pairId
 * @param {unknown} direction
 * @returns {Readonly<typeof WR3_LINEAGE_COUPLING> | null}
 */
export function couplingRowFor(pairId, direction) {
  const pair = String(pairId || '');
  const arrow = String(direction || '');
  return COUPLING_REGISTRY.find((row) => row.pairId === pair && row.direction === arrow) || null;
}
