/**
 * spatialCaptureRegistry.js — a tiny module-level handle to the LIVE map bridge,
 * so the (lazy) spatial-canonize path can reach the mounted FMG iframe from the
 * store without prop-drilling across the WorldMap ↔ RealmDashboard subtree gap.
 *
 * The World Map mounts a bridge (useMapBridge) and REGISTERS it here on ready;
 * teardown UNREGISTERS it. The spatial capture (campaignSpatialCanonize) reads
 * the current handle: present + ready ⇒ it can do the one-shot read-only
 * pack.cells capture; absent ⇒ the canonize action cleanly reports
 * `spatial_capture_unavailable` ("Open the world map to map geography").
 *
 * Deliberately DOM-free and dependency-free (a single module variable) so it adds
 * no first-paint weight and is trivially testable. This is a READ handle only —
 * nothing here mutates the map.
 */

/** @type {any} the live map bridge, or null when no World Map is mounted. */
let liveBridge = null;

/** Register the live map bridge (called by the World Map on mount/ready). @param {any} bridge */
export function registerSpatialCaptureBridge(bridge) {
  liveBridge = bridge || null;
}

/** Unregister the given bridge (idempotent; only clears if it is the current one). @param {any} bridge */
export function unregisterSpatialCaptureBridge(bridge) {
  if (!bridge || liveBridge === bridge) liveBridge = null;
}

/** The current live bridge, or null. @returns {any} */
export function getSpatialCaptureBridge() {
  return liveBridge;
}
