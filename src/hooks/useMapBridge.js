/**
 * useMapBridge.js — FMG iframe bridge lifecycle + load watchdog.
 *
 * Extracted from WorldMap.jsx (behaviour-preserving). Constructs the bridge
 * singleton against the iframe, wires its push events into the store, and
 * installs a load watchdog so a 404'd / hung iframe surfaces a recoverable
 * error state instead of an endless "Summoning the world…" spinner (P10).
 *
 * Re-runs whenever `reloadKey` changes — the "Reload map" recovery action bumps
 * it to tear down the dead bridge, mount a fresh iframe (keyed on the same value
 * in WorldMapStage), and re-arm the watchdog.
 *
 * Side-effect hook: returns nothing. All store reads/writes are passed in as
 * stable setters so the hook stays a pure wiring layer.
 */

import { useEffect } from 'react';
import { createBridgeSingleton } from '../lib/mapBridge.js';
import { registerSpatialCaptureBridge, unregisterSpatialCaptureBridge } from '../lib/spatialCaptureRegistry.js';

const LOAD_TIMEOUT_MS = 15000;

// Generic reject copy for a placement that arrives via the FMG bridge and is
// refused by the store's authoritative gate. Mirrors WorldMap.handleDrop's UI
// copy (minus the settlement name, which the bridge event doesn't carry).
// Exported: KeyboardPlacementControl speaks the SAME refusal copy through the
// palette's live region, so the gate never has two spellings (E-I).
export const PLACEMENT_REJECT_COPY = {
  'no-campaign': 'Select a campaign before placing settlements on the map.',
  'not-canon':   'Only canon settlements can be placed. Canonize it first.',
  'duplicate':   'That settlement is already on this map.',
};

export function useMapBridge({
  iframeRef, bridgeRef, reloadKey,
  setMapReady, setMapLoading, setMapError, setBridgeReady,
  setMapSnapshot, setMapTemplates, setSelectedBurgId,
  addPlacement, removePlacementLocal, clearAllPlacementsLocal,
  showToast,
}) {
  useEffect(() => {
    const bridge = createBridgeSingleton(() => iframeRef.current);
    bridgeRef.current = bridge;
    // Expose the live bridge to the (lazy) spatial-canonize path, which lives in a
    // different subtree than the World Map and so can't receive it via props.
    registerSpatialCaptureBridge(bridge);

    // Load watchdog: if `ready` never fires (iframe 404 / hang), flip the map
    // into a recoverable error state with a domain message + "Reload map" CTA.
    let settled = false;
    const watchdog = setTimeout(() => {
      if (settled) return;
      settled = true;
      setMapLoading(false);
      setMapError("The map engine didn't load.");
    }, LOAD_TIMEOUT_MS);

    const offReady = bridge.on('ready', (data) => {
      settled = true;
      clearTimeout(watchdog);
      setMapReady(true);
      setMapLoading(false);
      setMapError(null);
      setBridgeReady(true);
      if (data?.seed != null) setMapSnapshot(null, data.seed);
      if (Array.isArray(data?.templates)) setMapTemplates(data.templates);
    });
    const offBurgSel = bridge.on('burgSelected', (data) => {
      if (data?.burg?.id != null) setSelectedBurgId(data.burg.id);
    });
    const offPlaced = bridge.on('settlementPlaced', (data) => {
      if (data?.burgId != null) {
        // addPlacement is the authoritative gate (campaign / canon / no-duplicate);
        // a settlementPlaced event that arrives without going through handleDrop's
        // pre-check (a direct FMG placement, a re-entrant echo) is rejected here
        // without mutating. Surface the reason so the refusal isn't silent.
        const res = addPlacement({
          burgId: data.burgId,
          settlementId: data.settlementId,
          x: data.x, y: data.y,
          cellId: data.cellId,
          via: 'drop',
        });
        if (res && res.ok === false) {
          showToast?.('info', PLACEMENT_REJECT_COPY[res.reason] || 'That settlement could not be placed.');
        }
      }
    });
    const offRemoved = bridge.on('placementRemoved', (data) => {
      if (data?.burgId != null) removePlacementLocal(data.burgId);
    });
    const offClearedAll = bridge.on('allPlacementsCleared', () => {
      clearAllPlacementsLocal();
    });

    return () => {
      clearTimeout(watchdog);
      offReady?.();
      offBurgSel?.();
      offPlaced?.();
      offRemoved?.();
      offClearedAll?.();
      unregisterSpatialCaptureBridge(bridge);
      bridge.destroy();
      bridgeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);
}
