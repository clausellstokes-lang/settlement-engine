/**
 * WorldMap.jsx — Unified world-map workspace.
 *
 * Architecture (v2, 2026-04):
 *   iframe (FMG geography engine)
 *     └─ <MapOverlay> (React-owned SVG for annotations + relationship lines)
 *   toolbar row 1 — mode switcher (View / Terrain / Annotate)
 *   toolbar row 2 — contextual toolbar for the current mode
 *   sidebar — settlement palette (drag to place), campaign controls
 *
 * State is held in the Zustand map slice. This component is a controller —
 * it wires DOM events to bridge RPC calls and bridge push events to store
 * actions. There is no local placement/burg state in React.
 */

import React, { useEffect, useMemo, useRef, useState, useCallback, Suspense, lazy } from 'react';
import {
  FolderOpen, Save, Trash2, RefreshCw, Eye, Mountain, PenTool, X, Pin, Layers, Loader, Map as MapIcon, Globe,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { createBridgeSingleton } from '../lib/mapBridge.js';
import { MAP_MODES, ANNOTATE_TOOLS, TERRAIN_TOOLS } from '../store/mapSlice.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, PARCH, CARD_HDR, sans, FS, SP, R } from './theme.js';
import { saves as savesService } from '../lib/saves.js';

const MapOverlay     = lazy(() => import('./MapOverlay.jsx'));
const PlacementDetailCard = lazy(() => import('./map/PlacementDetailCard.jsx'));
const AnnotateToolbar = lazy(() => import('./map/AnnotateToolbar.jsx'));
const TerrainToolbar  = lazy(() => import('./map/TerrainToolbar.jsx'));
const LayersPanel     = lazy(() => import('./map/LayersPanel.jsx'));
const SettlementPalette = lazy(() => import('./map/SettlementPalette.jsx'));

// Cachebuster bumped whenever public/map/* changes so browsers don't serve
// a stale iframe bundle (e.g. old drop handler missing the settlementforge
// path). Bump this when you edit anything under /public/map.
const FMG_URL = '/map/index.html?v=sfdrop10';

export default function WorldMap({ onNavigate } = {}) {
  // ── Refs & local state ────────────────────────────────────────────────
  const iframeRef = useRef(null);
  const mapContainerRef = useRef(null);
  const bridgeRef = useRef(null);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [mapTemplates, setMapTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState('');

  // ── Store selectors ───────────────────────────────────────────────────
  const mapMode       = useStore(s => s.mapMode);
  const setMapMode    = useStore(s => s.setMapMode);
  const mapReady      = useStore(s => s.mapReady);
  const mapLoading    = useStore(s => s.mapLoading);
  const mapError      = useStore(s => s.mapError);
  const setMapReady   = useStore(s => s.setMapReady);
  const setMapLoading = useStore(s => s.setMapLoading);
  const setMapError   = useStore(s => s.setMapError);
  const setSelectedBurgId = useStore(s => s.setSelectedBurgId);
  const setDraggingOver   = useStore(s => s.setDraggingOver);
  const isDraggingOver    = useStore(s => s.isDraggingOver);

  const addPlacement    = useStore(s => s.addPlacement);
  const removePlacementLocal = useStore(s => s.removePlacementLocal);
  const clearAllPlacementsLocal = useStore(s => s.clearAllPlacementsLocal);
  const replaceAllPlacements = useStore(s => s.replaceAllPlacements);
  const replaceMapState = useStore(s => s.replaceMapState);
  const resetMapState   = useStore(s => s.resetMapState);
  const setMapSnapshot  = useStore(s => s.setMapSnapshot);
  const placements      = useStore(s => s.mapState.placements);

  const saves          = useStore(s => s.savedSettlements);
  const savesLoaded    = useStore(s => s.savedSettlementsLoaded);
  const setSavedSettlements = useStore(s => s.setSavedSettlements);
  const authTier       = useStore(s => s.auth?.tier);
  const campaigns      = useStore(s => s.campaigns);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const saveCampaignMap   = useStore(s => s.saveCampaignMap);
  const clearCampaignMap  = useStore(s => s.clearCampaignMap);
  const getCampaignMapState = useStore(s => s.getCampaignMapState);

  const activeCampaign = useMemo(
    () => campaigns.find(c => c.id === activeCampaignId) || null,
    [campaigns, activeCampaignId],
  );

  // When a campaign is selected, only its settlements are draggable.
  const activeSaves = useMemo(() => {
    if (!activeCampaign) return saves || [];
    const ids = new Set(activeCampaign.settlementIds || []);
    return (saves || []).filter(s => ids.has(s.id));
  }, [saves, activeCampaign]);

  // ── Hydrate saved settlements into the store (if not already loaded) ──
  useEffect(() => {
    if (savesLoaded) return;
    savesService.list()
      .then(loaded => setSavedSettlements(loaded))
      .catch(e => console.error('[WorldMap] Failed to load saves:', e));
  }, [savesLoaded, setSavedSettlements]);

  // ── Bridge lifecycle ──────────────────────────────────────────────────
  useEffect(() => {
    const bridge = createBridgeSingleton(() => iframeRef.current);
    bridgeRef.current = bridge;

    // Wire bridge events → store
    const offReady = bridge.on('ready', (data) => {
      setMapReady(true);
      setMapLoading(false);
      setMapError(null);
      setBridgeReady(true);
      if (data?.seed != null) setMapSnapshot(null, data.seed);
      // Capture available templates from the bridge
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
      offReady?.();
      offBurgSel?.();
      offPlaced?.();
      offRemoved?.();
      offClearedAll?.();
      bridge.destroy();
      bridgeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial loading hint
  useEffect(() => {
    setMapLoading(true);
  }, [setMapLoading]);

  // ── Native FMG layer toggles ─────────────────────────────────────────
  // Subscribe to the `nativeStateBorders` and `nativeCultureRegions` flags
  // and push them into the iframe so toggling the checkbox actually
  // shows/hides the corresponding FMG layer.
  const nativeStateBorders   = useStore(s => s.mapState.layers.nativeStateBorders);
  const nativeCultureRegions = useStore(s => s.mapState.layers.nativeCultureRegions);
  useEffect(() => {
    if (!bridgeReady) return;
    const bridge = bridgeRef.current;
    if (!bridge) return;
    bridge.call('settlementEngine:setFmgLayer', { layer: 'stateBorders', visible: !!nativeStateBorders })
      .catch(e => console.warn('[WorldMap] setFmgLayer stateBorders failed', e));
  }, [bridgeReady, nativeStateBorders]);
  useEffect(() => {
    if (!bridgeReady) return;
    const bridge = bridgeRef.current;
    if (!bridge) return;
    bridge.call('settlementEngine:setFmgLayer', { layer: 'cultures', visible: !!nativeCultureRegions })
      .catch(e => console.warn('[WorldMap] setFmgLayer cultures failed', e));
  }, [bridgeReady, nativeCultureRegions]);

  // ── Drag-drop (settlement palette → map) ──────────────────────────────
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDraggingOver(true);
  }, [setDraggingOver]);

  const handleDragLeave = useCallback(() => {
    setDraggingOver(false);
  }, [setDraggingOver]);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDraggingOver(false);
    let data;
    try {
      data = JSON.parse(e.dataTransfer.getData('application/settlementforge'));
    } catch { return; }
    if (!data?.id) return;

    const iframe = iframeRef.current;
    if (!iframe) return;
    const ifRect = iframe.getBoundingClientRect();
    const x = e.clientX - ifRect.left;
    const y = e.clientY - ifRect.top;

    const bridge = bridgeRef.current;
    if (!bridge) return;
    try {
      await bridge.placeSettlement({
        settlementId: data.id,
        x, y,
        name: data.name,
        population: data.population,
      });
    } catch (err) {
      console.warn('[WorldMap] place failed', err);
      showToast('error', `Place failed: ${err.message || err}`);
    }
  }, [setDraggingOver]);

  // ── Campaign save/load ────────────────────────────────────────────────
  const handleSelectCampaign = useCallback(async (id) => {
    const bridge = bridgeRef.current;
    if (!id) {
      // Deselect → reset everything
      setActiveCampaign(null);
      resetMapState();
      if (bridge?.isReady) {
        try { await bridge.clearAllPlacements(); } catch (e) {}
      }
      return;
    }

    setActiveCampaign(id);
    const ms = getCampaignMapState(id);
    if (!ms) {
      // Fresh campaign, no map yet — wipe current placements only
      resetMapState();
      if (bridge?.isReady) {
        try { await bridge.clearAllPlacements(); } catch (e) {}
      }
      showToast('info', 'New campaign — drag settlements onto the map');
      return;
    }

    // Replace map slice with the saved state (labels, markers, forests, layers…)
    replaceMapState(ms);

    // Load the FMG snapshot if present; otherwise fall back to restorePlacements.
    if (bridge?.isReady) {
      try {
        if (ms.fmgSnapshot) {
          await bridge.loadSnapshot(ms.fmgSnapshot);
          // Re-apply the v2 placements (settlementId mapping — FMG doesn't
          // know about settlementId, so we need to re-restore)
          const arr = legacyPlacementsArray(ms);
          if (arr.length) await bridge.restorePlacements(arr);
          showToast('success', `Loaded map for ${activeCampaign?.name || 'campaign'}`);
        } else if (Array.isArray(ms._legacyPlacements) && ms._legacyPlacements.length) {
          await bridge.clearAllPlacements();
          await bridge.restorePlacements(ms._legacyPlacements);
          showToast('success', `Restored ${ms._legacyPlacements.length} placements`);
        } else {
          await bridge.clearAllPlacements();
          showToast('info', 'Campaign has no saved map snapshot');
        }
        // Restore viewport
        if (ms.viewport && ms.viewport.scale) {
          try {
            await bridge.setViewport({
              cx: ms.viewport.cx,
              cy: ms.viewport.cy,
              scale: ms.viewport.scale,
              duration: 600,
            });
          } catch (e) {}
        }
      } catch (err) {
        console.warn('[WorldMap] snapshot load failed', err);
        showToast('error', `Load failed: ${err.message || err}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCampaignMapState, replaceMapState, resetMapState, setActiveCampaign, activeCampaign]);

  const handleSaveMapToCampaign = useCallback(async () => {
    if (!activeCampaignId) return;
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) {
      showToast('error', 'Map not ready');
      return;
    }
    try {
      showToast('info', 'Capturing map snapshot…');
      const reply = await bridge.saveSnapshot();
      const snapshot = reply?.snapshot;
      if (!snapshot) throw new Error('empty snapshot');
      // Store the blob on the map slice
      const seed = useStore.getState().mapState.seed;
      setMapSnapshot(snapshot, seed);
      // Persist the whole map state (including placements, labels, etc.) into campaign
      saveCampaignMap(activeCampaignId, useStore.getState().mapState);
      const placementCount = Object.keys(useStore.getState().mapState.placements || {}).length;
      showToast('success', `Saved ${placementCount} placement(s) to ${activeCampaign?.name}`);
    } catch (err) {
      console.warn('[WorldMap] save snapshot failed', err);
      showToast('error', `Save failed: ${err.message || err}`);
    }
  }, [activeCampaignId, activeCampaign, saveCampaignMap, setMapSnapshot]);

  const handleClearMapFromCampaign = useCallback(() => {
    if (!activeCampaignId) return;
    clearCampaignMap(activeCampaignId);
    showToast('info', 'Campaign map cleared');
  }, [activeCampaignId, clearCampaignMap]);

  // ── Template selection ─────────────────────────────────────────────────
  const handleTemplateChange = useCallback(async (templateId) => {
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) return;
    try {
      await bridge.setTemplate(templateId);
      setCurrentTemplate(templateId);
    } catch (err) {
      console.warn('[WorldMap] setTemplate failed', err);
    }
  }, []);

  // ── Regenerate map (new world) ────────────────────────────────────────
  const handleRegenerate = useCallback(async () => {
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) return;
    if (!window.confirm('Regenerate the world? All unsaved placements will be lost.')) return;
    try {
      showToast('info', 'Regenerating…');
      await bridge.resetMap();
      resetMapState();
      showToast('success', 'New world generated');
    } catch (err) {
      showToast('error', `Regenerate failed: ${err.message || err}`);
    }
  }, [resetMapState]);

  // ── Fit map to viewport ───────────────────────────────────────────────
  const handleFit = useCallback(async () => {
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) return;
    try { await bridge.fitMap(); } catch (e) {}
  }, []);

  // ── Toasts ─────────────────────────────────────────────────────────────
  const toastTimerRef = useRef(null);
  function showToast(kind, text) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, text });
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
  }

  // ── Render ─────────────────────────────────────────────────────────────
  // Use viewport height minus header/padding so the map fills the screen.
  // The parent <main> has padding and the header is ~52px on desktop.
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: SP.sm,
      height: 'calc(100vh - 120px)',   // header (~52px) + main padding (~48px) + breathing room
      minHeight: 500,
    }}>
      {/* ── Top toolbar row: mode switcher + campaign + utility ────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
        padding: `${SP.sm}px ${SP.md}px`,
        background: CARD, borderRadius: R.lg, border: `1px solid ${BORDER}`,
      }}>
        {/* Mode switcher */}
        <ModeSwitch mapMode={mapMode} setMapMode={setMapMode} />

        <div style={{ width: 1, height: 24, background: BORDER2 }} />

        {/* Campaign controls */}
        {authTier !== 'anon' && (
          <>
            <FolderOpen size={14} color={activeCampaign ? GOLD : MUTED} />
            <select
              value={activeCampaignId || ''}
              onChange={e => handleSelectCampaign(e.target.value || null)}
              style={{
                padding: '5px 10px',
                border: `1px solid ${BORDER}`, borderRadius: R.sm,
                background: CARD, fontSize: FS.sm, fontFamily: sans, color: INK,
                cursor: 'pointer', minWidth: 180,
              }}
            >
              <option value="">— No campaign —</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.mapState ? ' ●' : ''}
                  {c.settlementIds?.length ? ` (${c.settlementIds.length})` : ''}
                </option>
              ))}
            </select>
            {activeCampaignId && (
              <>
                <IconButton onClick={handleSaveMapToCampaign} title="Save map to campaign" primary>
                  <Save size={13} /> Save
                </IconButton>
                {activeCampaign?.mapState && (
                  <IconButton onClick={handleClearMapFromCampaign} title="Clear campaign map">
                    <Trash2 size={13} />
                  </IconButton>
                )}
              </>
            )}
            <div style={{ width: 1, height: 24, background: BORDER2 }} />
          </>
        )}

        {/* Utility buttons */}
        <IconButton
          onClick={() => setShowLayersPanel(v => !v)}
          title="Toggle layer visibility"
          active={showLayersPanel}
        >
          <Layers size={13} /> Layers
        </IconButton>
        {/* Island shape picker */}
        {mapTemplates.length > 0 && (
          <>
            <Globe size={14} color={MUTED} />
            <select
              value={currentTemplate}
              onChange={e => handleTemplateChange(e.target.value)}
              title="Island shape for next regeneration"
              style={{
                padding: '5px 10px',
                border: `1px solid ${BORDER}`, borderRadius: R.sm,
                background: CARD, fontSize: FS.xs, fontFamily: sans, color: INK,
                cursor: 'pointer',
              }}
            >
              <option value="">Random island</option>
              {mapTemplates.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <div style={{ width: 1, height: 24, background: BORDER2 }} />
          </>
        )}

        <IconButton onClick={handleFit} title="Fit entire map in view">
          <MapIcon size={13} /> Fit
        </IconButton>
        <IconButton onClick={handleRegenerate} title="Regenerate a new world">
          <RefreshCw size={13} /> Regenerate
        </IconButton>

        <div style={{ flex: 1 }} />

        {/* Status line */}
        {mapLoading && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: MUTED, fontSize: FS.xs }}>
            <Loader size={12} className="sf-spin" /> Loading…
          </span>
        )}
        {mapError && (
          <span style={{ color: '#c54a4a', fontSize: FS.xs, fontWeight: 700 }}>
            {String(mapError)}
          </span>
        )}
      </div>

      {/* ── Contextual toolbar for current mode ──────────────────────── */}
      {mapMode === MAP_MODES.ANNOTATE && (
        <Suspense fallback={null}><AnnotateToolbar /></Suspense>
      )}
      {mapMode === MAP_MODES.TERRAIN && (
        <Suspense fallback={null}><TerrainToolbar bridgeRef={bridgeRef} /></Suspense>
      )}

      {/* ── Main body: sidebar + map ─────────────────────────────────── */}
      <div style={{ display: 'flex', gap: SP.sm, flex: 1, minHeight: 0 }}>
        {/* Settlement palette — left sidebar */}
        <div style={{
          width: 240, minHeight: 0, display: 'flex', flexDirection: 'column',
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg,
          overflow: 'hidden',
        }}>
          <Suspense fallback={<div style={{ padding: SP.md, color: MUTED, fontSize: FS.sm }}>Loading…</div>}>
            <SettlementPalette
              saves={activeSaves}
              placements={placements}
              activeCampaign={activeCampaign}
            />
          </Suspense>
        </div>

        {/* Map container */}
        <div
          ref={mapContainerRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            flex: 1,
            position: 'relative',
            background: PARCH,
            border: `2px solid ${isDraggingOver ? GOLD : BORDER}`,
            borderRadius: R.lg,
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <iframe
            ref={iframeRef}
            src={FMG_URL}
            title="Fantasy Map"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              pointerEvents: mapMode === MAP_MODES.ANNOTATE ? 'none' : 'auto',
            }}
          />
          {bridgeReady && (
            <Suspense fallback={null}>
              <MapOverlay bridge={bridgeRef.current} />
            </Suspense>
          )}
          <Suspense fallback={null}>
            <PlacementDetailCard
              onOpenDetail={(settlementId) => {
                // SettlementsPanel reads `selectedSettlementId` from the store
                // on mount and opens the matching save in detail view. So we
                // just need to navigate — the id is already in the store from
                // the map click that opened this card.
                if (typeof onNavigate === 'function') onNavigate('settlements');
              }}
            />
          </Suspense>
          {!mapReady && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(247,240,228,0.7)', backdropFilter: 'blur(2px)',
              flexDirection: 'column', gap: SP.sm, pointerEvents: 'none',
            }}>
              <Loader size={32} color={GOLD} className="sf-spin" />
              <div style={{ fontSize: FS.md, fontWeight: 700, color: SECOND }}>
                Summoning the world…
              </div>
            </div>
          )}
          {isDraggingOver && mapMode !== MAP_MODES.ANNOTATE && (
            <div style={{
              position: 'absolute', inset: 12, border: `3px dashed ${GOLD}`,
              borderRadius: R.lg, background: 'rgba(160,118,42,0.06)',
              pointerEvents: 'none',
            }} />
          )}
        </div>

        {/* Layers panel — right sidebar (toggleable) */}
        {showLayersPanel && (
          <Suspense fallback={null}>
            <LayersPanel onClose={() => setShowLayersPanel(false)} />
          </Suspense>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 18px',
          background: toast.kind === 'error' ? '#8a2a2a' : toast.kind === 'info' ? '#3a4a5a' : '#1a5a28',
          color: '#fff', borderRadius: R.md, fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          zIndex: 100,
        }}>
          {toast.text}
        </div>
      )}

      {/* Spinner animation */}
      <style>{`
        .sf-spin { animation: sf-spin 1.2s linear infinite; }
        @keyframes sf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────

function ModeSwitch({ mapMode, setMapMode }) {
  const modes = [
    { id: MAP_MODES.VIEW,     label: 'View',     Icon: Eye },
    { id: MAP_MODES.TERRAIN,  label: 'Terrain',  Icon: Mountain },
    { id: MAP_MODES.ANNOTATE, label: 'Annotate', Icon: PenTool },
  ];
  return (
    <div style={{
      display: 'flex', gap: 2, padding: 2,
      background: BORDER2, borderRadius: R.md,
    }}>
      {modes.map(m => {
        const active = mapMode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMapMode(m.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px',
              background: active ? CARD : 'transparent',
              border: 'none', borderRadius: R.sm,
              color: active ? INK : SECOND,
              fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
              cursor: 'pointer',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            <m.Icon size={13} /> {m.label}
          </button>
        );
      })}
    </div>
  );
}

function IconButton({ children, onClick, title, primary, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '5px 10px',
        background: primary ? GOLD : active ? GOLD_BG : CARD,
        color: primary ? '#fff' : INK,
        border: `1px solid ${primary ? GOLD : BORDER}`,
        borderRadius: R.sm,
        fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────
/**
 * Convert mapState.placements (burgId → {settlementId, x, y, ...}) into the
 * flat array shape that bridge.restorePlacements expects.
 */
function legacyPlacementsArray(ms) {
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
