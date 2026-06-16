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

import { useEffect, useMemo, useRef, useState, useCallback, Suspense, lazy } from 'react';
import {
  FolderOpen, Save, Trash2, RefreshCw, Eye, Mountain, PenTool, Layers, Loader, Map as MapIcon, Globe, Link as LinkIcon,
  Newspaper, SlidersHorizontal, Zap, HelpCircle, Image as ImageIcon, X as XIcon, Share2, Undo2,
} from 'lucide-react';
import { flag } from '../lib/flags.js';
import { Funnel, EVENTS, track } from '../lib/analytics.js';
import { useStore } from '../store/index.js';
import { createBridgeSingleton } from '../lib/mapBridge.js';
import { MAP_MODES } from '../store/mapSlice.js';
import { computeRoadEdges } from '../lib/roadNetwork.js';
import { isCanonSave } from '../domain/campaign/canon.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, PARCH, sans, FS, SP, R, swatch, PARCH_100 } from './theme.js';
import { saves as savesService } from '../lib/saves.js';
import { isCampaignActive } from '../lib/campaigns.js';
import { ConfirmDialog } from './primitives/Dialog.jsx';

const MapOverlay     = lazy(() => import('./MapOverlay.jsx'));
const PlacementDetailCard = lazy(() => import('./map/PlacementDetailCard.jsx'));
import WorldMapTour from './map/WorldMapTour.jsx';

// §16 — guided-help steps. Each spotlights a control by its data-tour anchor;
// a step whose target isn't on screen (e.g. campaign-only controls) shows a
// centered card instead of being skipped silently.
const WORLD_MAP_TOUR_STEPS = [
  { sel: 'mode',     title: 'Map modes', body: 'Switch between View, Terrain, Annotate, and Routes. Each mode swaps the toolbar below for tools specific to that task.' },
  { sel: 'map',      title: 'Place & select settlements', body: 'Drag a saved canon settlement from the palette onto the map to place it, then click any placed settlement to select and inspect it.' },
  { sel: 'campaign', title: 'Campaign', body: 'Pick the campaign this map belongs to. Settlements, relationships, and the World Pulse are all scoped to the active campaign.' },
  { sel: 'save',     title: 'Save the map', body: 'Save your placements, layers, and viewport to the campaign so the map is exactly as you left it next time.' },
  { sel: 'layers',   title: 'Layers', body: 'Toggle overlays — relationships, supply chains, labels, biomes, borders — to focus on what matters right now.' },
  { sel: 'pulse',    title: 'World Pulse', body: 'Advance the realm simulation. Linked settlements ripple events to their neighbours over time.' },
  { sel: 'news',     title: 'Wizard News', body: 'Read the in-world bulletin of recent realm events — a narrative digest of what the simulation produced.' },
  { sel: 'help',     title: 'Replay this tour', body: 'You can reopen this walkthrough any time from this ? button. That’s the tour — happy worldbuilding!' },
];

const AnnotateToolbar = lazy(() => import('./map/AnnotateToolbar.jsx'));
const TerrainToolbar  = lazy(() => import('./map/TerrainToolbar.jsx'));
// P132 / M-4 promote — Routes mode contextual toolbar. Lazy because
// terrain/annotate users never need it.
const RoutesToolbar   = lazy(() => import('./map/RoutesToolbar.jsx'));
// P136 / M-5 — "Saved 2 min ago" pill. Self-gated by flag +
// activeCampaign; lazy because it touches a date-formatting tick.
const AutoSaveChip    = lazy(() => import('./map/AutoSaveChip.jsx'));
// P136 / M-6 — Hover-peek for placed settlements. Self-gated by flag
// and hoveredSettlementId presence.
const QuickInspector  = lazy(() => import('./map/QuickInspector.jsx'));
const LayersPanel     = lazy(() => import('./map/LayersPanel.jsx'));
const SettlementPalette = lazy(() => import('./map/SettlementPalette.jsx'));
const WizardNewsPanel = lazy(() => import('./map/WizardNewsPanel.jsx'));
const WorldPulsePanel = lazy(() => import('./map/WorldPulsePanel.jsx'));
const SimulationRulesDialog = lazy(() => import('./map/SimulationRulesDialog.jsx'));

// Cachebuster bumped whenever public/map/* changes so browsers don't serve
// a stale iframe bundle (e.g. old drop handler missing the settlementforge
// path). Bump this when you edit anything under /public/map.
const FMG_URL = '/map/index.html?v=sfdrop12';

export default function WorldMap({ onNavigate } = {}) {
  // ── Refs & local state ────────────────────────────────────────────────
  const iframeRef = useRef(null);
  const mapContainerRef = useRef(null);
  // Live overlay transform {tx,ty,scale,width,height} — written by MapOverlay in
  // image mode so the drop handler can inverse-project screen→image coords
  // without waiting on the debounced viewport persist.
  const overlayTransformRef = useRef(null);
  const bridgeRef = useRef(null);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);   // §16 — guided help walkthrough
  const [mapTemplates, setMapTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState('');
  const [campaignWorkspace, setCampaignWorkspace] = useState('map');
  const [worldPulseInterval, setWorldPulseInterval] = useState('one_month');
  const [worldPulseBusy, setWorldPulseBusy] = useState(false);
  const [showSimulationRules, setShowSimulationRules] = useState(false);
  const [regenerateConfirm, setRegenerateConfirm] = useState(null);
  // Confirm shown when saving a canonized map — placed settlements can't move.
  const [mapSaveConfirm, setMapSaveConfirm] = useState(false);

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
  const _replaceAllPlacements = useStore(s => s.replaceAllPlacements);
  const replaceMapState = useStore(s => s.replaceMapState);
  const resetMapState   = useStore(s => s.resetMapState);
  const setMapSnapshot  = useStore(s => s.setMapSnapshot);
  const bumpGeometryVersion = useStore(s => s.bumpGeometryVersion);
  const placements      = useStore(s => s.mapState.placements);
  // Custom image backdrop (Project 1, premium). When set, the FMG iframe is not
  // mounted — MapOverlay renders the image + owns pan/zoom — and terrain tools +
  // geography-charted trails are suppressed.
  const customBackdrop  = useStore(s => s.mapState.customBackdrop);
  const setMapBackdrop  = useStore(s => s.setMapBackdrop);
  const clearMapBackdrop = useStore(s => s.clearMapBackdrop);
  const imageMode       = !!customBackdrop?.imageUrl;

  const saves          = useStore(s => s.savedSettlements);
  const savesLoaded    = useStore(s => s.savedSettlementsLoaded);
  const setSavedSettlements = useStore(s => s.setSavedSettlements);
  const authTier       = useStore(s => s.auth?.tier);
  const isElevated     = useStore(s => s.isElevated());
  const campaigns      = useStore(s => s.campaigns);
  const canManageCampaigns = authTier === 'premium' || isElevated;
  const activeCampaigns = useMemo(
    () => canManageCampaigns ? campaigns.filter(isCampaignActive) : [],
    [campaigns, canManageCampaigns],
  );
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const saveCampaignMap   = useStore(s => s.saveCampaignMap);
  const clearCampaignMap  = useStore(s => s.clearCampaignMap);
  const getCampaignMapState = useStore(s => s.getCampaignMapState);
  const advanceCampaignWorld = useStore(s => s.advanceCampaignWorld);
  // Campaign-clock (Phase C2/C3): multi-step undo of the last World Pulse.
  const undoLastPulse = useStore(s => s.undoLastPulse);
  const canUndoPulse = useStore(s =>
    !!activeCampaignId && (s.pulseUndoStack || []).some(e => e.campaignId === activeCampaignId));

  const activeCampaign = useMemo(
    () => activeCampaigns.find(c => c.id === activeCampaignId) || null,
    [activeCampaigns, activeCampaignId],
  );
  const showingWizardNews = Boolean(activeCampaign && campaignWorkspace === 'news');
  const showingWorldPulse = Boolean(activeCampaign && campaignWorkspace === 'pulse');
  const showingCampaignPanel = showingWizardNews || showingWorldPulse;

  // Audit recommendation: when a campaign is active, default to canon-
  // only filtering so the map represents the *deployed* world, not
  // every draft the user is tinkering with. Canon-only is enforced now
  // (the old toolbar toggle was removed): only canon settlements may be
  // placed on a campaign map.
  const canonOnlyFilter = true;

  useEffect(() => {
    if (activeCampaignId && !activeCampaign) setActiveCampaign(null);
  }, [activeCampaignId, activeCampaign, setActiveCampaign]);

  // P112 / M-5 — Auto-save the working map into the active campaign so it
  // persists per account and across devices without a manual click. The key
  // mirrors AutoSaveChip's "dirty" fingerprint (placement ids + layer counts);
  // the save is debounced and only fires when the live map differs from the
  // campaign's persisted map (so no save loop, no redundant writes).
  // saveCampaignMap bumps the campaign's updatedAt, which rides the existing
  // campaign cloud sync. Gated on the mapAutosave flag + an active campaign.
  const mapDirtyKey = useStore(s => {
    const m = s.mapState || {};
    return `${Object.keys(m.placements || {}).sort().join(',')}|${(m.labels || []).length}|${(m.markers || []).length}|${(m.forests || []).length}|${m.customBackdrop?.imageUrl || ''}`;
  });
  useEffect(() => {
    if (!flag('mapAutosave') || !activeCampaignId) return undefined;
    const p = activeCampaign?.mapState || {};
    const persistedKey = `${Object.keys(p.placements || {}).sort().join(',')}|${(p.labels || []).length}|${(p.markers || []).length}|${(p.forests || []).length}|${p.customBackdrop?.imageUrl || ''}`;
    if (mapDirtyKey === persistedKey) return undefined;
    const t = setTimeout(() => {
      try { saveCampaignMap(activeCampaignId, useStore.getState().mapState); }
      catch { /* autosave is best-effort; the manual Save action remains */ }
    }, 3500);
    return () => clearTimeout(t);
  }, [mapDirtyKey, activeCampaignId, activeCampaign, saveCampaignMap]);

  // When a campaign is selected, only its settlements are draggable.
  // Layered: campaign membership first, then canon filter on top.
  const activeSaves = useMemo(() => {
    let pool = saves || [];
    if (activeCampaign) {
      const ids = new Set(activeCampaign.settlementIds || []);
      pool = pool.filter(s => ids.has(s.id));
    }
    if (canonOnlyFilter) {
      pool = pool.filter(isCanonSave);
    }
    return pool;
  }, [saves, activeCampaign, canonOnlyFilter]);

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

  // ── Analytics: MAP_OPENED on mount (fire-and-forget, once) ─────────────
  // Coarse counts only — no coordinates, no names. Read from the live store
  // so the effect can run exactly once without depending on slice churn.
  useEffect(() => {
    try {
      const s = useStore.getState();
      const placementCount = Object.keys(s.mapState?.placements || {}).length;
      const routeCount = computeRoadEdges(s.savedSettlements, s.mapState?.placements).length;
      track(EVENTS.MAP_OPENED, {
        placement_count: placementCount,
        route_count: routeCount,
        has_campaign: !!s.activeCampaignId,
      });
    } catch { /* analytics is best-effort; never block mount */ }
  }, []);

  // ── Native FMG layer toggles ─────────────────────────────────────────
  // Subscribe to the native-layer flags and push each into the iframe so
  // toggling the checkbox (or the Biomes button in the terrain toolbar)
  // actually shows/hides the corresponding FMG SVG group.
  const nativeStateBorders   = useStore(s => s.mapState.layers.nativeStateBorders);
  const nativeCultureRegions = useStore(s => s.mapState.layers.nativeCultureRegions);
  const nativeBiomes         = useStore(s => s.mapState.layers.nativeBiomes);
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
  useEffect(() => {
    if (!bridgeReady) return;
    const bridge = bridgeRef.current;
    if (!bridge) return;
    bridge.call('settlementEngine:setFmgLayer', { layer: 'biomes', visible: !!nativeBiomes })
      .catch(e => console.warn('[WorldMap] setFmgLayer biomes failed', e));
  }, [bridgeReady, nativeBiomes]);

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

    // Placement gates: a settlement only lands on a campaign map, only if it
    // is canon, and at most once per map. (Canon used to be a soft toolbar
    // hint; it is enforced here now.)
    const live = useStore.getState();
    let placementReject = null;
    if (!live.activeCampaignId) {
      placementReject = 'Select a campaign before placing settlements on the map.';
    } else {
      const saveRec = (live.savedSettlements || []).find(s => s.id === data.id);
      if (saveRec && !isCanonSave(saveRec)) {
        placementReject = 'Only canon settlements can be placed. Canonize it first.';
      } else if (Object.values(live.mapState?.placements || {}).some(p => p.settlementId === data.id)) {
        placementReject = `${data.name || 'That settlement'} is already on this map.`;
      }
    }
    if (placementReject) {
      // eslint-disable-next-line react-hooks/immutability
      showToast('info', placementReject);
      return;
    }

    // Image-mode drop: no iframe/bridge — inverse-project the screen point
    // through the live overlay transform into image-pixel coords, then place
    // directly. Placements live in the same <g>-space as the backdrop image.
    if (live.mapState?.customBackdrop?.imageUrl) {
      const container = mapContainerRef.current;
      const t = overlayTransformRef.current;
      if (!container || !t || !t.scale) return;
      const rect = container.getBoundingClientRect();
      const imgX = (e.clientX - rect.left - t.tx) / t.scale;
      const imgY = (e.clientY - rect.top - t.ty) / t.scale;
      const burgId = `sf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      addPlacement({ burgId, settlementId: data.id, x: imgX, y: imgY, via: 'drop' });
      return;
    }

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
      // showToast is a store-action setter; called from an async drop
      // handler (not during render), so the immutability rule doesn't apply.
      showToast('error', `Place failed: ${err.message || err}`);
    }
  }, [setDraggingOver]);

  // ── Campaign save/load ────────────────────────────────────────────────
  // Tracks which campaign (or 'none') the map has been synced to, so the
  // entry effect below auto-loads a campaign's saved map exactly once per
  // selection — fixing "reselect doesn't reload" — while an explicit click
  // (which sets the ref first) doesn't double-load.
  const autoSyncedRef = useRef(null);
  const handleSelectCampaign = useCallback(async (id) => {
    setCampaignWorkspace('map');
    autoSyncedRef.current = id || 'none';
    const bridge = bridgeRef.current;
    if (!id) {
      // Deselect → reset everything
      setActiveCampaign(null);
      resetMapState();
      if (bridge?.isReady) {
        try { await bridge.clearAllPlacements(); } catch (e) {}
      }
      bumpGeometryVersion();
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
      bumpGeometryVersion();
      showToast('info', 'New campaign. Drag settlements onto the map');
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
        // Restore viewport — but never feed an IMAGE-space camera into FMG's
        // d3.zoom (the two modes share one viewport field; the mode tag guards it).
        if (ms.viewport && ms.viewport.scale && ms.viewport.mode !== 'image') {
          try {
            await bridge.setViewport({
              cx: ms.viewport.cx,
              cy: ms.viewport.cy,
              scale: ms.viewport.scale,
              duration: 600,
            });
          } catch (e) {}
        }
        // Geography just changed under React's feet. Roads/relationship/chain
        // layers cache A*-routed polylines and burg-coordinate lookups; their
        // useMemo/useEffect deps watch `placements`, but placements may be
        // identical to before the load — only the underlying world differs.
        // Bumping the version forces a fresh route compute against the new
        // geometry without making the user nudge a settlement to do it.
        bumpGeometryVersion();
      } catch (err) {
        console.warn('[WorldMap] snapshot load failed', err);
        showToast('error', `Load failed: ${err.message || err}`);
      }
    }
     
  }, [getCampaignMapState, replaceMapState, resetMapState, setActiveCampaign, activeCampaign, bumpGeometryVersion]);

  // On entry to the map (bridge ready) — and whenever the active campaign
  // resolves — re-sync the map. With a campaign active, its saved snapshot is
  // loaded into the fresh FMG bridge, so returning to the map no longer needs
  // a reselect to repaint. With no campaign, the map is blanked so stray
  // placements don't linger on a non-campaign world. The autoSyncedRef guard
  // keeps this to one load per selection; explicit clicks set the ref first.
  useEffect(() => {
    if (!bridgeReady) return;
    // A campaign id with no resolved record yet → wait; don't blank/deselect.
    if (activeCampaignId && !activeCampaign) return;
    const id = (activeCampaignId && activeCampaign) ? activeCampaignId : null;
    const key = id || 'none';
    if (autoSyncedRef.current === key) return;
    handleSelectCampaign(id);
  }, [bridgeReady, activeCampaignId, activeCampaign, handleSelectCampaign]);

  const performSaveMap = useCallback(async () => {
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
      // Whether the campaign already had a persisted map (this save updates it
      // vs. creates it). Read before the write so it reflects prior state.
      const isUpdate = !!activeCampaign?.mapState;
      // Persist the whole map state (including placements, labels, etc.) into campaign
      saveCampaignMap(activeCampaignId, useStore.getState().mapState);
      const placementCount = Object.keys(useStore.getState().mapState.placements || {}).length;
      // Fire-and-forget analytics — coarse counts only, no coordinates/names.
      try {
        const live = useStore.getState();
        track(EVENTS.MAP_SAVED, {
          placement_count: placementCount,
          route_count: computeRoadEdges(live.savedSettlements, live.mapState.placements).length,
          is_update: isUpdate,
        });
      } catch { /* analytics is best-effort */ }
      showToast('success', `Saved ${placementCount} placement(s) to ${activeCampaign?.name}`);
    } catch (err) {
      console.warn('[WorldMap] save snapshot failed', err);
      showToast('error', `Save failed: ${err.message || err}`);
    }
  }, [activeCampaignId, activeCampaign, saveCampaignMap, setMapSnapshot]);

  // Save entry point. On a canonized map, first confirm that placed settlements
  // can't be moved (newly added ones still save in place); otherwise save directly.
  const handleSaveMapToCampaign = useCallback(async () => {
    if (!activeCampaignId) return;
    if (activeCampaign?.worldState?.canonizedAt) {
      setMapSaveConfirm(true);
      return;
    }
    await performSaveMap();
  }, [activeCampaignId, activeCampaign, performSaveMap]);

  const handleClearMapFromCampaign = useCallback(() => {
    if (!activeCampaignId) return;
    clearCampaignMap(activeCampaignId);
    showToast('info', 'Campaign map cleared');
  }, [activeCampaignId, clearCampaignMap]);

  const handleAdvanceRealm = useCallback(async () => {
    if (!activeCampaignId || worldPulseBusy) return;
    setWorldPulseBusy(true);
    try {
      const result = await advanceCampaignWorld(activeCampaignId, worldPulseInterval);
      setCampaignWorkspace('pulse');
      if (result?.reason === 'world_not_canonized') {
        showToast('error', 'Canonize the campaign world before advancing the realm');
      } else if (result?.ok === false) {
        showToast('error', result.reason || 'Realm advancement failed');
      } else if (result) {
        showToast('success', `Realm advanced: ${result.autoApplied.length} drift, ${result.proposals.length} proposal(s)`);
      } else {
        showToast('error', 'Realm advancement failed');
      }
    } catch (err) {
      console.warn('[WorldMap] advance realm failed', err);
      showToast('error', `Advance failed: ${err.message || err}`);
    } finally {
      setWorldPulseBusy(false);
    }
  }, [activeCampaignId, advanceCampaignWorld, worldPulseBusy, worldPulseInterval]);

  // Campaign-clock: reverse the most recent World Pulse for this campaign,
  // restoring the pre-pulse world + every member settlement. Multi-step — the
  // button stays available while snapshots remain (capped, session-scoped).
  const handleUndoRealm = useCallback(async () => {
    if (!activeCampaignId || worldPulseBusy) return;
    setWorldPulseBusy(true);
    try {
      const ok = await undoLastPulse(activeCampaignId);
      showToast(ok ? 'success' : 'info', ok ? 'Reverted the last realm advance' : 'Nothing to undo');
    } catch (err) {
      console.warn('[WorldMap] undo advance failed', err);
      showToast('error', `Undo failed: ${err.message || err}`);
    } finally {
      setWorldPulseBusy(false);
    }
  }, [activeCampaignId, undoLastPulse, worldPulseBusy]);

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
  // P112 / M-7 — When `mapAutosave` flag is on (a stand-in for the
  // safer-regenerate behavior since both ride the same campaign-active
  // signal), the regenerate confirm shows the explicit count of items
  // that will be lost. Falls back to the legacy single-line confirm
  // under the flag-off path.
  const handleRegenerate = useCallback(async () => {
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) return;
    let msg = 'Regenerate the world? All unsaved placements will be lost.';
    if (flag('mapAutosave')) {
      // Placements/labels live under mapState; the old top-level mapPlacements/
      // mapLabels keys don't exist, so the loss-count warning never fired.
      const placedCount = Object.keys(useStore.getState().mapState.placements || {}).length;
      const labelCount = (useStore.getState().mapState.labels || []).length;
      if (placedCount || labelCount) {
        msg = `Regenerate the world? You'll lose ${placedCount} placement${placedCount === 1 ? '' : 's'}` +
              (labelCount ? ` and ${labelCount} label${labelCount === 1 ? '' : 's'}` : '') +
              '. This cannot be undone.';
      }
    }
    setRegenerateConfirm(msg);
  }, []);

  const performRegenerate = useCallback(async () => {
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) return;
    setRegenerateConfirm(null);
    try {
      showToast('info', 'Regenerating…');
      await bridge.resetMap();
      resetMapState();
      bumpGeometryVersion();
      showToast('success', 'New world generated');
    } catch (err) {
      showToast('error', `Regenerate failed: ${err.message || err}`);
    }
  }, [resetMapState, bumpGeometryVersion]);

  // ── Fit map to viewport ───────────────────────────────────────────────
  const handleFit = useCallback(async () => {
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) return;
    try { await bridge.fitMap(); } catch (e) {}
  }, []);

  // ── Custom map image (Project 1, premium) ─────────────────────────────
  // Pick → validate → downscale (≤4096px) → upload to Supabase Storage → set
  // the campaign's customBackdrop. Premium + active-campaign gated at the call
  // site (the control only renders for canManageCampaigns + activeCampaignId).
  const handleImportImage = useCallback(() => {
    if (!activeCampaignId) { showToast('info', 'Select a campaign before importing a map image.'); return; }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const { validateImageFile, downscaleImageFile, uploadMapBackdrop } = await import('../lib/imageUpload.js');
        const v = validateImageFile(file);
        if (!v.ok) { showToast('error', v.error); return; }
        const ownerId = useStore.getState().auth?.user?.id;
        if (!ownerId) { showToast('error', 'Sign in to import a map image.'); return; }
        showToast('info', 'Processing image…');
        const prevUrl = useStore.getState().mapState.customBackdrop?.imageUrl || null;
        const { blob, w, h, type } = await downscaleImageFile(file, 4096);
        const { url } = await uploadMapBackdrop(blob, { ownerId, campaignId: activeCampaignId, contentType: type });
        setMapBackdrop({ imageUrl: url, w, h });
        // Best-effort: delete the replaced object so re-imports don't orphan storage.
        if (prevUrl && prevUrl !== url) {
          import('../lib/imageUpload.js').then(({ removeMapBackdrop }) => removeMapBackdrop(prevUrl)).catch(() => {});
        }
        showToast('success', 'Custom map imported.');
      } catch (err) {
        showToast('error', err?.message || 'Map import failed.');
      }
    };
    input.click();
  }, [activeCampaignId, setMapBackdrop]);

  const handleClearImage = useCallback(() => {
    const url = useStore.getState().mapState.customBackdrop?.imageUrl;
    clearMapBackdrop();
    if (url) import('../lib/imageUpload.js').then(({ removeMapBackdrop }) => removeMapBackdrop(url)).catch(() => {});
    showToast('info', 'Reverted to generated terrain.');
  }, [clearMapBackdrop]);

  // ── Share map to the gallery (Project 2, blank canvas) ────────────────
  const [sharingMap, setSharingMap] = useState(false);
  const handleShareMap = useCallback(async (kind = 'map') => {
    if (!activeCampaignId) { showToast('info', 'Select a campaign to share its map.'); return; }
    setSharingMap(true);
    try {
      // Persist the latest map AND await its cloud upsert before publishing —
      // publish_map only flips gallery flags and reads whatever map_data is
      // already in the saved_maps row, so the row must exist + carry the current
      // mapState first (a fresh campaign hasn't synced yet → otherwise the RPC
      // 404s, and an edited one would publish a stale backdrop).
      saveCampaignMap(activeCampaignId, useStore.getState().mapState);
      const camp = useStore.getState().campaigns.find(c => c.id === activeCampaignId);
      if (camp) {
        const { campaigns: campaignService } = await import('../lib/campaigns.js');
        await campaignService.upsert(camp);
      }
      const { shareMap } = await import('../lib/gallery.js');
      await shareMap(activeCampaignId, { kind });
      showToast('success', kind === 'map_with_campaign'
        ? 'Map + settlements shared to the gallery.'
        : 'Map shared to the gallery as a reusable blank canvas.');
    } catch (err) {
      showToast('error', err?.message || 'Map share failed.');
    } finally {
      setSharingMap(false);
    }
  }, [activeCampaignId, saveCampaignMap]);

  // ── P112 / M-8 — Worldbuilder keymap ──────────────────────────────────
  // P (place) / T (terrain) / A (annotate) / R (routes) switch modes;
  // L toggles the layers panel; F fits the map; ⌘S saves; ⌘Z opens
  // the (future) undo stack.
  // Ignores events when typing in inputs/textareas.
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) {
        // ⌘S = save, ⌘Z handled by store actions (if registered)
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          // ⌘S — save map. Call the component's own handler; the previously
          // referenced store action `saveMapToCampaign` does not exist, so this
          // silently no-op'd while suppressing the browser's Save dialog.
          handleSaveMapToCampaign();
        }
        return;
      }
      switch (e.key.toLowerCase()) {
        case 'p': setMapMode(MAP_MODES.VIEW); break;
        case 't': setMapMode(MAP_MODES.TERRAIN); break;
        case 'a': setMapMode(MAP_MODES.ANNOTATE); break;
        case 'r': setMapMode(MAP_MODES.ROUTES); break;
        case 'f': handleFit(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);

  }, [setMapMode, handleFit, handleSaveMapToCampaign]);

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
        {!showingCampaignPanel ? (
          <span data-tour="mode" style={{ display: 'inline-flex' }}>
            <ModeSwitch mapMode={mapMode} setMapMode={setMapMode} imageMode={imageMode} />
          </span>
        ) : showingWizardNews ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            border: `1px solid ${BORDER}`,
            borderRadius: R.sm,
            background: GOLD_BG,
            color: GOLD,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 800,
          }}>
            <Newspaper size={13} />
            Wizard News
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            border: `1px solid ${BORDER}`,
            borderRadius: R.sm,
            background: GOLD_BG,
            color: GOLD,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 800,
          }}>
            <Zap size={13} />
            World Pulse
          </div>
        )}

        <div style={{ width: 1, height: 24, background: BORDER2 }} />

        {/* Campaign controls */}
        {canManageCampaigns && (
          <>
            <FolderOpen size={14} color={activeCampaign ? GOLD : MUTED} />
            <select
              data-tour="campaign"
              value={activeCampaignId || ''}
              onChange={e => handleSelectCampaign(e.target.value || null)}
              style={{
                padding: '5px 10px',
                border: `1px solid ${BORDER}`, borderRadius: R.sm,
                background: CARD, fontSize: FS.sm, fontFamily: sans, color: INK,
                cursor: 'pointer', minWidth: 180,
              }}
            >
              <option value="">— No campaign</option>
              {activeCampaigns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.mapState ? ' ●' : ''}
                  {c.settlementIds?.length ? ` (${c.settlementIds.length})` : ''}
                </option>
              ))}
            </select>
            {activeCampaignId && (
              <>
                <IconButton data-tour="save" onClick={handleSaveMapToCampaign} title="Save map to campaign" primary>
                  <Save size={13} /> Save
                </IconButton>
                <Suspense fallback={null}>
                  <AutoSaveChip />
                </Suspense>
                {activeCampaign?.mapState && (
                  <IconButton onClick={handleClearMapFromCampaign} title="Clear campaign map">
                    <Trash2 size={13} />
                  </IconButton>
                )}
                <div style={{ width: 1, height: 24, background: BORDER2 }} />
                <IconButton
                  onClick={() => setCampaignWorkspace('map')}
                  title="Show campaign map"
                  active={campaignWorkspace === 'map'}
                  aria-pressed={campaignWorkspace === 'map'}
                >
                  <MapIcon size={13} /> Map
                </IconButton>
                <IconButton
                  data-tour="pulse"
                  onClick={() => setCampaignWorkspace('pulse')}
                  title="Show World Pulse"
                  active={campaignWorkspace === 'pulse'}
                  aria-pressed={campaignWorkspace === 'pulse'}
                >
                  <Zap size={13} /> Pulse
                </IconButton>
                <IconButton
                  onClick={() => setShowSimulationRules(true)}
                  title="Simulation rules"
                  active={showSimulationRules}
                  aria-pressed={showSimulationRules}
                >
                  <SlidersHorizontal size={13} /> Rules
                </IconButton>
                <IconButton
                  data-tour="news"
                  onClick={() => setCampaignWorkspace('news')}
                  title="Show Wizard News"
                  active={campaignWorkspace === 'news'}
                  aria-pressed={campaignWorkspace === 'news'}
                >
                  <Newspaper size={13} /> News
                </IconButton>
                <select
                  value={worldPulseInterval}
                  onChange={e => setWorldPulseInterval(e.target.value)}
                  title="Realm advancement interval"
                  style={{
                    padding: '5px 9px',
                    border: `1px solid ${BORDER}`, borderRadius: R.sm,
                    background: CARD, fontSize: FS.xs, fontFamily: sans, color: INK,
                    cursor: 'pointer',
                  }}
                >
                  <option value="one_week">Week</option>
                  <option value="one_month">Month</option>
                  <option value="one_season">Season</option>
                  <option value="one_year">Year</option>
                </select>
                <IconButton
                  onClick={handleAdvanceRealm}
                  title="Advance realm simulation"
                  primary
                  disabled={worldPulseBusy}
                >
                  <Zap size={13} /> {worldPulseBusy ? 'Advancing' : 'Advance Realm'}
                </IconButton>
                {canUndoPulse && (
                  <IconButton
                    onClick={handleUndoRealm}
                    title="Undo the last realm advance — restores the pre-pulse world and every settlement"
                    disabled={worldPulseBusy}
                  >
                    <Undo2 size={13} /> Undo Advance
                  </IconButton>
                )}
              </>
            )}
            <div style={{ width: 1, height: 24, background: BORDER2 }} />
          </>
        )}

        {/* Utility buttons */}
        {!showingCampaignPanel && (
          <>
            <IconButton
              data-tour="layers"
              onClick={() => setShowLayersPanel(v => !v)}
              title="Toggle layer visibility"
              active={showLayersPanel}
            >
              <Layers size={13} /> Layers
            </IconButton>
            <IconButton
              data-tour="help"
              onClick={() => setTourOpen(true)}
              title="Guided tour of the world map"
            >
              <HelpCircle size={13} /> Help
            </IconButton>
            {/* Canon-only is enforced (only canon settlements can be placed),
                so the former Canon / All Phases toggle was removed. */}
            {/* Custom map image (premium + active campaign). Import enters image
                mode; Clear reverts to generated terrain. */}
            {canManageCampaigns && activeCampaignId && (
              imageMode ? (
                <IconButton onClick={handleClearImage} title="Revert to generated terrain">
                  <XIcon size={13} /> Clear Image
                </IconButton>
              ) : (
                <IconButton onClick={handleImportImage} title="Import a custom image to use as the map">
                  <ImageIcon size={13} /> Import Image
                </IconButton>
              )
            )}
            {canManageCampaigns && activeCampaignId && (
              <IconButton onClick={() => handleShareMap('map')} disabled={sharingMap} title="Share this map to the gallery as a reusable blank canvas">
                <Share2 size={13} /> {sharingMap ? 'Sharing…' : 'Share Map'}
              </IconButton>
            )}
            {canManageCampaigns && activeCampaignId && (activeCampaign?.settlementIds?.length > 0) && (
              <IconButton onClick={() => handleShareMap('map_with_campaign')} disabled={sharingMap} title="Share this map WITH its settlements (public-safe dossiers)">
                <Share2 size={13} /> Share + Settlements
              </IconButton>
            )}
            {/* Island shape picker — terrain generation, hidden in image mode */}
            {!imageMode && mapTemplates.length > 0 && (
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
            {!imageMode && (
              <IconButton onClick={handleRegenerate} title="Regenerate a new world">
                <RefreshCw size={13} /> Regenerate
              </IconButton>
            )}
          </>
        )}

        <div style={{ flex: 1 }} />

        {/* Status line */}
        {!showingCampaignPanel && mapLoading && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: MUTED, fontSize: FS.xs }}>
            <Loader size={12} className="sf-spin" /> Loading…
          </span>
        )}
        {!showingCampaignPanel && mapError && (
          <span style={{ color: swatch['#C54A4A'], fontSize: FS.xs, fontWeight: 700 }}>
            {String(mapError)}
          </span>
        )}
      </div>

      {/* ── Contextual toolbar for current mode ──────────────────────── */}
      {!showingCampaignPanel && mapMode === MAP_MODES.ANNOTATE && (
        <Suspense fallback={null}><AnnotateToolbar /></Suspense>
      )}
      {/* Terrain + Routes toolbars are FMG-only (need pack.cells); suppressed in image mode. */}
      {!showingCampaignPanel && !imageMode && mapMode === MAP_MODES.TERRAIN && (
        <Suspense fallback={null}><TerrainToolbar bridgeRef={bridgeRef} /></Suspense>
      )}
      {!showingCampaignPanel && !imageMode && mapMode === MAP_MODES.ROUTES && (
        <Suspense fallback={null}><RoutesToolbar /></Suspense>
      )}

      {/* ── Main body: sidebar + map ─────────────────────────────────── */}
      {showingWizardNews ? (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Suspense fallback={<div style={{ padding: SP.md, color: MUTED, fontSize: FS.sm }}>Loading…</div>}>
            <WizardNewsPanel campaign={activeCampaign} />
          </Suspense>
        </div>
      ) : showingWorldPulse ? (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Suspense fallback={<div style={{ padding: SP.md, color: MUTED, fontSize: FS.sm }}>Loading…</div>}>
            <WorldPulsePanel campaign={activeCampaign} />
          </Suspense>
        </div>
      ) : (
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
        {/* a11y: passive drag-and-drop target (settlements are dragged from the
            palette); no keyboard-clickable widget semantics apply to the map shell. */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
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
          {/* Custom image backdrop mode skips FMG entirely — MapOverlay renders
              the image + owns pan/zoom. Otherwise the FMG iframe is the bottom plane. */}
          {!imageMode && (
            <iframe
              ref={iframeRef}
              data-tour="map"
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
          )}
          {(bridgeReady || imageMode) && (
            <Suspense fallback={null}>
              {/* bridgeRef.current is read during render to pass into the overlay.
                  Strictly a react-hooks/refs violation, but the bridge is
                  constructed once during the bridge-init effect and never
                  reassigned for the lifetime of this WorldMap instance. In image
                  mode there is no bridge (the overlay self-drives). */}
              {/* eslint-disable-next-line react-hooks/refs */}
              <MapOverlay bridge={imageMode ? null : bridgeRef.current} transformOut={overlayTransformRef} />
            </Suspense>
          )}
          <Suspense fallback={null}>
            <PlacementDetailCard
              onOpenDetail={(_settlementId) => {
                // SettlementsPanel reads `selectedSettlementId` from the store
                // on mount and opens the matching save in detail view. So we
                // just need to navigate — the id is already in the store from
                // the map click that opened this card.
                if (typeof onNavigate === 'function') onNavigate('settlements');
              }}
            />
          </Suspense>
          {/* P136 / M-6 — Hover peek. Self-gated; renders nothing
              when no hover-id is set or when click-selection wins. */}
          <Suspense fallback={null}>
            <QuickInspector />
          </Suspense>
          {!mapReady && !imageMode && (
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
            <>
              <div style={{
                position: 'absolute', inset: 12, border: `3px dashed ${GOLD}`,
                borderRadius: R.lg, background: 'rgba(160,118,42,0.06)',
                pointerEvents: 'none',
              }} />
              {/* P111 / M-3 — Drop preview tooltip. Shows during drag with
                  the data the user needs to decide if this is a sensible
                  placement: terrain hint + trade-route candidacy +
                  proximity to existing placements. We render a static
                  hint card (top-right) under the flag — a future
                  iteration can hover-follow the cursor with live FMG
                  cell data. */}
              {flag('mapDropPreview') && (
                // a11y: presentational hint card (pointerEvents:'none'); the
                // onMouseEnter is fire-and-forget analytics, not a user control.
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  onMouseEnter={() => {
                    Funnel.track(EVENTS.MAP_DROP_PREVIEW_SHOWN);
                  }}
                  style={{
                    position: 'absolute', top: 24, right: 24,
                    padding: '8px 12px', background: INK,
                    color: PARCH_100,
                    border: `1px solid ${GOLD}`, borderRadius: R.sm,
                    fontSize: FS.xs, lineHeight: 1.45,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.40)',
                    pointerEvents: 'none', maxWidth: 220,
                  }}
                >
                  <div style={{
                    fontWeight: 700, color: GOLD, fontSize: FS.sm,
                    marginBottom: 4,
                  }}>
                    Drop to place
                  </div>
                  <div style={{ color: swatch['#C8B098'] }}>
                    Settlements land at the nearest valid cell. Trade-route
                    candidates auto-link to neighbours within 2 days.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Layers panel — right sidebar (toggleable) */}
        {showLayersPanel && (
          <Suspense fallback={null}>
            <LayersPanel onClose={() => setShowLayersPanel(false)} />
          </Suspense>
        )}
      </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 18px',
          background: toast.kind === 'error' ? '#8a2a2a' : toast.kind === 'info' ? '#3a4a5a' : '#1a5a28',
          color: swatch.white, borderRadius: R.md, fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          zIndex: 100,
        }}>
          {toast.text}
        </div>
      )}

      <ConfirmDialog
        open={!!regenerateConfirm}
        tone="warning"
        title="Regenerate world?"
        body={regenerateConfirm || ''}
        confirmLabel="Regenerate"
        onConfirm={performRegenerate}
        onCancel={() => setRegenerateConfirm(null)}
      />

      <ConfirmDialog
        open={mapSaveConfirm}
        title="Save canonized map?"
        body="This campaign's world is canonized, so placed settlements can no longer be moved. Any settlements you've newly added will be saved where they sit. Continue?"
        confirmLabel="Save map"
        onConfirm={() => { setMapSaveConfirm(false); performSaveMap(); }}
        onCancel={() => setMapSaveConfirm(false)}
      />

      <Suspense fallback={null}>
        <SimulationRulesDialog
          open={showSimulationRules}
          campaign={activeCampaign}
          onClose={() => setShowSimulationRules(false)}
        />
      </Suspense>

      {/* §16 — guided help walkthrough */}
      <WorldMapTour open={tourOpen} steps={WORLD_MAP_TOUR_STEPS} onClose={() => setTourOpen(false)} />

      {/* Spinner animation */}
      <style>{`
        .sf-spin { animation: sf-spin 1.2s linear infinite; }
        @keyframes sf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────

function ModeSwitch({ mapMode, setMapMode, imageMode }) {
  // P110 / M-4 — Routes mode appended to the mode pill group. The
  // existing mode pill is already segmented; this is one more entry.
  // Click promotes relationship/road/supply-chain layers to primary
  // content and fires MAP_ROUTES_MODE_ENTERED analytics.
  // Image-mode maps have no FMG geometry, so Terrain (heightmap/biome editor)
  // and Routes (geography-charted trails) are omitted.
  const modes = [
    { id: MAP_MODES.VIEW,     label: 'View',     Icon: Eye },
    { id: MAP_MODES.TERRAIN,  label: 'Terrain',  Icon: Mountain },
    { id: MAP_MODES.ANNOTATE, label: 'Annotate', Icon: PenTool },
    { id: MAP_MODES.ROUTES,   label: 'Routes',   Icon: LinkIcon },
  ].filter(m => !imageMode || (m.id !== MAP_MODES.TERRAIN && m.id !== MAP_MODES.ROUTES));
  const handleClick = (id) => {
    setMapMode(id);
    if (id === MAP_MODES.ROUTES) {
      Funnel.track(EVENTS.MAP_ROUTES_MODE_ENTERED);
    }
  };
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
            onClick={() => handleClick(m.id)}
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

function IconButton({ children, onClick, title, primary, active, ...rest }) {
  return (
    <button
      onClick={onClick}
      title={title}
      {...rest}
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
