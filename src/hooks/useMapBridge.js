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
 * Side-effect hook: returns only the runtime-resolved iframe URL. All store
 * reads/writes are passed in as stable setters so the hook stays a wiring
 * layer; mapRuntimeConfig remains the sole URL/origin authority.
 */

import { useEffect } from 'react';
import { createBridgeSingleton } from '../lib/mapBridge.js';
import { readMapRuntimeConfig } from '../lib/mapRuntimeConfig.js';
import { registerSpatialCaptureBridge, unregisterSpatialCaptureBridge } from '../lib/spatialCaptureRegistry.js';
// SEAM-1 (S3) only. A ONE-SHOT imperative read inside an event callback, never a
// subscription — so the hook stays the wiring layer its header promises (WorldMap's
// own drop handler reads the store the same way, `useStore.getState()`).
import { useStore } from '../store/index.js';
import { resolveSettlementTerrain } from '../domain/resolveTerrain.js';

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

/**
 * W-SEAM SEAM-1 (S3) — THE TERRAIN FIT CHIP.
 *
 * A settlement carries its own declared terrain (`config.terrainType`, minted at
 * genesis from its trade route and read through domain/resolveTerrain.js). The map
 * carries a completely different truth about the cell it just landed on. The two
 * vocabularies never met, so the disagreement was permanent and silent: a settlement
 * declared `coastal` and dropped mid-plain is fed as a port by foodBalance forever,
 * while derivePortEligibility reads coastal:false and never grants it a sea lane.
 *
 * This says so, once, at the moment the DM can still act on it — and NOTHING more.
 * It never rewrites `terrainType` (genesis derivations hang off that value; for a
 * canon settlement the write would be lived-history-adjacent — the bug-or-truth
 * fork), never blocks the placement, and swallows every failure.
 *
 * It rides the `settlementPlaced` ECHO rather than WorldMap's drop handler because
 * this is the ONE path every placement takes — the drag-drop, the keyboard placement
 * control, and a direct FMG placement all arrive here, and the store's authoritative
 * gate has already accepted the row by the time we run.
 *
 * COST: one extra `getSpatialPack` RPC per accepted placement, and only when the
 * settlement actually declares a terrain. That is the same read AutoplacementConsent
 * already performs on a gesture; it is fire-and-forget, so the placement paints first.
 * (The cheaper shape — the cell's h/biome riding the placeSettlement reply — is a
 * public/map/sf-bridge.js change and belongs to W-CAP's single bridge act, not here.)
 *
 * The domain/spatial import is DYNAMIC: that module must never enter a first-paint
 * static closure, and this reuses the chunk the spatial canonize already splits, so
 * the chip costs zero eager bytes.
 *
 * @param {any} bridge @param {any} data the settlementPlaced payload
 * @param {((kind:string, text:string)=>void)|undefined} showToast
 */
function reportTerrainFit(bridge, data, showToast) {
  if (!showToast || !Number.isInteger(data?.cellId)) return;
  const saved = (useStore.getState().savedSettlements || [])
    .find((/** @type {any} */ sv) => String(sv?.id) === String(data.settlementId));
  const declared = resolveSettlementTerrain(saved);
  if (!declared) return;
  (async () => {
    try {
      const reply = await bridge.getSpatialPack();
      const { normalizeSpatialPack, terrainAgreement } = await import('../domain/spatial/index.js');
      const pack = normalizeSpatialPack(reply?.pack);
      if (pack.cellCount <= 0) return;
      if (terrainAgreement(declared, pack, data.cellId) !== 'disagrees') return;
      showToast('info', `${data.name || 'That settlement'} is ${declared}, but the map here is not. Its dossier and its geography will disagree.`);
    } catch (_) { /* advisory only: a slow, absent or failed pack read never surfaces */ }
  })();
}

export function useMapBridge({
  enabled = true,
  iframeRef, bridgeRef, reloadKey,
  setMapReady, setMapLoading, setMapError, setBridgeReady,
  setMapSnapshot, setMapTemplates, setSelectedBurgId,
  addPlacement, removePlacementLocal, clearAllPlacementsLocal,
  flagGeographyDiverged,
  showToast,
}) {
  const {
    frameUrl,
    frameOrigin: targetOrigin,
    configurationError,
  } = readMapRuntimeConfig();

  useEffect(() => {
    if (!enabled) return undefined;
    if (!targetOrigin) {
      setMapReady(false);
      setBridgeReady(false);
      setMapLoading(false);
      setMapError(configurationError || 'The terrain engine is not securely configured.');
      return undefined;
    }

    setMapReady(false);
    setBridgeReady(false);
    setMapError(null);
    setMapLoading(true);
    let bridge;
    try {
      bridge = createBridgeSingleton(
        () => iframeRef.current,
        { targetOrigin },
      );
    } catch (error) {
      setMapReady(false);
      setBridgeReady(false);
      setMapLoading(false);
      setMapError(error instanceof Error ? error.message : String(error));
      return undefined;
    }
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
          return;
        }
        reportTerrainFit(bridge, data, showToast);
      }
    });
    const offRemoved = bridge.on('placementRemoved', (data) => {
      if (data?.burgId != null) removePlacementLocal(data.burgId);
    });
    const offClearedAll = bridge.on('allPlacementsCleared', () => {
      clearAllPlacementsLocal();
    });
    // W-SEAM SEAM-1 (S1). The iframe has pushed `fmg:terrainChanged` since the bridge
    // was written and NOTHING listened — so a DM could raise a sea under a mapped
    // realm and the frozen spatial digest would keep narrating the old land, with no
    // warning, no block, and no offer to refreeze.
    //
    // ⚠ This event UNDER-COVERS, deliberately noted here as well as at the store flag:
    // sf-bridge emits it on tool ACTIVATION only (before any edit), the rivers /
    // coastline / lakes editors open by double-clicking the map without crossing the
    // bridge at all, and terrainUndo / terrainRedo emit nothing. A listener therefore
    // repairs LESS than the seam implies, which is exactly why the store flag is named
    // "may have diverged" and the CTA copy says "may have changed". The complete cure
    // is SEAM-3's provenance-stamped capture + fingerprint diff (owner-gated).
    const offTerrainChanged = bridge.on('terrainChanged', () => {
      flagGeographyDiverged?.();
    });

    return () => {
      clearTimeout(watchdog);
      offReady?.();
      offBurgSel?.();
      offPlaced?.();
      offRemoved?.();
      offClearedAll?.();
      offTerrainChanged?.();
      unregisterSpatialCaptureBridge(bridge);
      bridge.destroy();
      bridgeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, reloadKey, frameUrl, targetOrigin, configurationError]);

  return frameUrl;
}
