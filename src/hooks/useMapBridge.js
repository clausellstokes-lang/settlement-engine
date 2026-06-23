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

const LOAD_TIMEOUT_MS = 15000;

export function useMapBridge({
  iframeRef, bridgeRef, reloadKey,
  setMapReady, setMapLoading, setMapError, setBridgeReady,
  setMapSnapshot, setMapTemplates, setSelectedBurgId,
  addPlacement, removePlacementLocal, clearAllPlacementsLocal,
}) {
  useEffect(() => {
    const bridge = createBridgeSingleton(() => iframeRef.current);
    bridgeRef.current = bridge;

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
        addPlacement({
          burgId: data.burgId,
          settlementId: data.settlementId,
          x: data.x, y: data.y,
          cellId: data.cellId,
          via: 'drop',
        });
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
      bridge.destroy();
      bridgeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);
}
