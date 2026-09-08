/**
 * showOnMap.js — DESK-2's "show on map" verb: fly the world-map camera to a
 * placed settlement, from a WORD surface (the Gazetteer register, herald rows).
 *
 * MODE-SPECIFIC BY LAW (the tie-back amendment): the camera is mode-specific
 * (FMG map-pixels vs image pixels — mapSlice's own comment), and only the FMG
 * iframe exposes a programmatic camera (`bridge.setViewport` → FMG's zoomTo —
 * the WorldMap.jsx viewport-restore idiom). An image-backdrop map owns its
 * pan/zoom locally in MapOverlay with no store-driven camera, so this verb
 * honestly reports `image_mode` instead of pretending. The bridge is reached
 * through the spatialCaptureRegistry handle — the sanctioned cross-subtree
 * path (the herald lives outside the WorldMap prop tree).
 *
 * Pure wiring; no store writes, no persisted state, no canon bytes.
 */

import { useStore } from '../../store/index.js';
import { getSpatialCaptureBridge } from '../../lib/spatialCaptureRegistry.js';

/** The placement row for a settlement id, or null. @param {any} state @param {any} settlementId */
export function placementOf(state, settlementId) {
  const placements = state?.mapState?.placements || {};
  for (const p of Object.values(placements)) {
    if (p && String(p.settlementId) === String(settlementId)) return p;
  }
  return null;
}

/** May the verb work right now for this settlement? (placed ∧ FMG mode) */
export function canShowOnMap(state, settlementId) {
  if (state?.mapState?.customBackdrop?.imageUrl) return false;
  const p = placementOf(state, settlementId);
  return !!p && typeof p.x === 'number' && typeof p.y === 'number';
}

/**
 * Fly the camera to the settlement's placement. Total — every failure is a
 * typed reason, never a throw.
 * @param {any} settlementId
 * @param {{ scale?: number, duration?: number }} [opts]
 * @returns {{ ok: boolean, reason?: 'unplaced'|'image_mode'|'no_map' }}
 */
export function showSettlementOnMap(settlementId, { scale = 3, duration = 600 } = {}) {
  const state = useStore.getState();
  if (state?.mapState?.customBackdrop?.imageUrl) return { ok: false, reason: 'image_mode' };
  const p = placementOf(state, settlementId);
  if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') return { ok: false, reason: 'unplaced' };
  const bridge = getSpatialCaptureBridge();
  if (!bridge || !bridge.isReady) return { ok: false, reason: 'no_map' };
  bridge.setViewport({ cx: p.x, cy: p.y, scale, duration });
  return { ok: true };
}
