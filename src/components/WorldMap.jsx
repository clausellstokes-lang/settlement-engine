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
import { flag } from '../lib/flags.js';
import { EVENTS, track } from '../lib/analytics.js';
import { useStore } from '../store/index.js';
import { useMapBridge } from '../hooks/useMapBridge.js';
import { MAP_MODES } from '../store/mapSlice.js';
import { computeRoadEdges } from '../lib/roadNetwork.js';
import { isCanonSave } from '../domain/campaign/canon.js';
import { SP, CARD, BORDER, R, CHROME } from './theme.js';
import { saves as savesService } from '../lib/saves.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { nameMapFromSaves } from './map/WorldPulseData.js';
import { isCampaignActive } from '../lib/campaigns.js';
import { useCampaignAutoResume } from '../hooks/useCampaignAutoResume.js';
import { legacyPlacementsArray } from './map/legacyPlacements.js';
import { useMapAutosave } from '../hooks/useMapAutosave.js';
import { useRealmInspector, ADVANCE_ERROR_TEXT } from '../hooks/useRealmInspector.js';
import { useCampaignActivation } from '../hooks/useCampaignActivation.js';
import { useMapImageImport } from '../hooks/useMapImageImport.js';

import FeatureErrorBoundary from './FeatureErrorBoundary.jsx';
import { WorldMapToolbar } from './map/WorldMapToolbar.jsx';
import { WorldMapContextToolbars } from './map/WorldMapContextToolbars.jsx';
import { WorldMapStage } from './map/WorldMapStage.jsx';
import { WorldMapOverlays } from './map/WorldMapOverlays.jsx';

const RealmInspector = lazy(() => import('./map/RealmInspector.jsx'));
// Mobile-only: the defer-to-desktop wall + read-only dashboard. Lazy so the
// desktop build never pulls it, and the mobile build only loads it when the
// gate actually renders.
const RealmMobileGate = lazy(() => import('./map/RealmMobileGate.jsx'));

export default function WorldMap({ onNavigate } = {}) {
  // Reactive mobile flag (width < 640). On phones the Realm defers to desktop:
  // the desktop map-editing workspace below is replaced by an honest gate plus a
  // read-only dashboard (see the mobile branch in the render). Read here so it is
  // available to the render; every hook still runs unconditionally above the
  // branch, so desktop rendering is byte-identical.
  const isMobile = useIsMobile();

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
  const [worldPulseInterval, setWorldPulseInterval] = useState('one_month');
  const [worldPulseBusy, setWorldPulseBusy] = useState(false);
  const [regenerateConfirm, setRegenerateConfirm] = useState(null);
  // Confirm shown when saving a canonized map — placed settlements can't move.
  const [mapSaveConfirm, setMapSaveConfirm] = useState(false);
  // Confirm shown before Advance Realm — the loudest, most consequential action
  // on the surface, and only session-undoable (the undo evaporates on reload),
  // so it is gated by a scope-summary preview (P10/P9).
  const [advanceConfirm, setAdvanceConfirm] = useState(false);
  // In-flight map save — drives the AutoSaveChip "Saving…" state.
  const [savingMap, setSavingMap] = useState(false);
  // Bumped to force a fresh iframe mount when the GM hits "Reload map" after a
  // load failure (the watchdog below). Keying the iframe on this re-runs the
  // whole bridge handshake from scratch.
  const [mapReloadKey, setMapReloadKey] = useState(0);

  // ── Store selectors ───────────────────────────────────────────────────
  // mapMode/imageMode remain here because WorldMapContextToolbars still receives
  // them as props; setMapMode drives the keymap. The read-only mapReady/
  // mapLoading/mapError/isDraggingOver/placements selectors moved into the
  // memoized child shells that consume them, so they're no longer read here.
  const mapMode       = useStore(s => s.mapMode);
  const setMapMode    = useStore(s => s.setMapMode);
  const setMapReady   = useStore(s => s.setMapReady);
  const setMapLoading = useStore(s => s.setMapLoading);
  const setMapError   = useStore(s => s.setMapError);
  const setSelectedBurgId = useStore(s => s.setSelectedBurgId);
  const setDraggingOver   = useStore(s => s.setDraggingOver);

  const addPlacement    = useStore(s => s.addPlacement);
  const removePlacementLocal = useStore(s => s.removePlacementLocal);
  const clearAllPlacementsLocal = useStore(s => s.clearAllPlacementsLocal);
  const _replaceAllPlacements = useStore(s => s.replaceAllPlacements);
  const replaceMapState = useStore(s => s.replaceMapState);
  const resetMapState   = useStore(s => s.resetMapState);
  const setMapSnapshot  = useStore(s => s.setMapSnapshot);
  const bumpGeometryVersion = useStore(s => s.bumpGeometryVersion);
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
  const activeCampaigns = useMemo(() => canManageCampaigns ? campaigns.filter(isCampaignActive) : [], [campaigns, canManageCampaigns]);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const saveCampaignMap   = useStore(s => s.saveCampaignMap);
  const clearCampaignMap  = useStore(s => s.clearCampaignMap);
  const getCampaignMapState = useStore(s => s.getCampaignMapState);
  const advanceCampaignWorld = useStore(s => s.advanceCampaignWorld);
  const updateCampaignSimulationRules = useStore(s => s.updateCampaignSimulationRules);
  const pendingMapWorkspace = useStore(s => s.pendingMapWorkspace);
  const consumeMapWorkspace = useStore(s => s.consumeMapWorkspace);
  const pendingSimulationRules = useStore(s => s.pendingSimulationRules);
  const consumeSimulationRules = useStore(s => s.consumeSimulationRules);
  // Campaign-clock (Phase C2/C3): multi-step undo of the last World Pulse.
  const undoLastPulse = useStore(s => s.undoLastPulse);
  const canUndoPulse = useStore(s =>
    !!activeCampaignId && (s.pulseUndoStack || []).some(e => e.campaignId === activeCampaignId));

  const activeCampaign = useMemo(
    () => activeCampaigns.find(c => c.id === activeCampaignId) || null,
    [activeCampaigns, activeCampaignId],
  );
  // Persistent unreviewed-pulse count for the Inspector badge (P3). The latest
  // World Pulse's proposals queue on worldState.proposals with status 'pending'
  // and clear as the GM resolves them in the Inspector — a durable signal that
  // outlives the 2.6s success toast, unlike re-deriving from a transient flag.
  const unreviewedPulseCount = useMemo(
    () => (activeCampaign?.worldState?.proposals || [])
      .filter(p => p?.status === 'pending').length,
    [activeCampaign],
  );
  // Scope summary for the Advance Realm confirm (P9 — the GM sees exactly what
  // they're committing before the multi-settlement mutation).
  const advanceScopeBody = useMemo(() => {
    const n = activeCampaign?.settlementIds?.length || 0;
    const interval = { one_week: 'one week', one_month: 'one month', one_season: 'one season', one_year: 'one year' }[worldPulseInterval] || 'one step';
    return `Advance ${n === 1 ? '1 settlement' : `${n} settlements`} by ${interval}? The realm will drift and may surface proposals to review. This undo is available only for the current session.`;
  }, [activeCampaign, worldPulseInterval]);
  // UX Phase 4 — the old campaign-workspace body-swap is RETIRED. Pulse / News /
  // Pantheon now render in the Realm Inspector OVERLAY, so the map stays mounted at
  // all times (the WorldMapStage never swaps the map away; its `showing*` props are
  // pinned false). The single Inspector toggle is the gateway; the Inspector owns
  // Pantheon's self-hide when religion is dormant.
  // Audit recommendation: when a campaign is active, default to canon-only filtering
  // so the map represents the *deployed* world, not every draft the user is tinkering
  // with. Canon-only is enforced now (the old toolbar toggle was removed): only canon
  // settlements may be placed on a campaign map.
  const canonOnlyFilter = true;

  useEffect(() => {
    if (activeCampaignId && !activeCampaign) setActiveCampaign(null);
  }, [activeCampaignId, activeCampaign, setActiveCampaign]);

  // ── Toasts ─── (declared early so the Realm-inspector hook below can use it)
  // Stabilized with useCallback (empty deps — it only touches the stable
  // setToast setter and a ref). This is load-bearing for perf, not cosmetic:
  // useRealmInspector derives handleApplyPreset via useCallback([…, showToast]),
  // and that handler is a prop on the React.memo'd WorldMapToolbar. An unstable
  // showToast would mint a new handleApplyPreset every parent render, defeating
  // the toolbar memo on every keystroke/tick. Keeping showToast stable lets the
  // memo actually hold.
  const toastTimerRef = useRef(null);
  // `action` (label + onClick) turns an error toast into a recoverable next step
  // (P10): e.g. "Canonize the world" routes to the canonize surface instead of
  // dead-ending. A toast with an action lingers longer so the GM can reach it.
  const showToast = useCallback((kind, text, action = null) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, text, action });
    toastTimerRef.current = setTimeout(() => setToast(null), action ? 6000 : 2600);
  }, []);

  // UX Phase 4 — the Realm Inspector state + handlers live in a dedicated hook so
  // this component stays under the size ratchet. The Inspector OVERLAYS the map.
  const {
    inspectorOpen, setInspectorOpen, inspectorSection, setInspectorSection,
    inspectorSize, setInspectorSize,
    openInspectorAt, handleApplyPreset, handleUpgrade, showSimulationRules, setShowSimulationRules,
  } = useRealmInspector({
    canManageCampaigns, pendingMapWorkspace, activeCampaign, activeCampaignId, consumeMapWorkspace,
    updateCampaignSimulationRules, onNavigate, showToast, pendingSimulationRules, consumeSimulationRules,
  });

  // Auto-save the working map into the active campaign so it
  // persists per account and across devices without a manual click. Extracted
  // to a side-effect hook; behaviour (debounce, dirty-key gate, flag gate) is
  // unchanged.
  useMapAutosave(activeCampaignId, activeCampaign, saveCampaignMap);

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

  // Settlement-id → name map for the mobile read-only Realm Dashboard (the desktop
  // RealmInspector derives the same map internally; the mobile dashboard renders
  // standalone, so it needs the map passed in). Memoized on saves so it is stable
  // across unrelated re-renders.
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);

  // ── Hydrate saved settlements into the store (if not already loaded) ──
  useEffect(() => {
    if (savesLoaded) return;
    savesService.list()
      .then(loaded => setSavedSettlements(loaded))
      .catch(e => console.error('[WorldMap] Failed to load saves:', e));
  }, [savesLoaded, setSavedSettlements]);

  // ── Bridge lifecycle + load watchdog ──────────────────────────────────
  // Extracted to a side-effect hook (construct bridge, wire push events, and the
  // P10 load-failure watchdog). Re-runs on mapReloadKey so "Reload map" re-inits.
  useMapBridge({
    iframeRef, bridgeRef, reloadKey: mapReloadKey,
    setMapReady, setMapLoading, setMapError, setBridgeReady,
    setMapSnapshot, setMapTemplates, setSelectedBurgId,
    addPlacement, removePlacementLocal, clearAllPlacementsLocal,
  });

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
      // showToast is the component's own stable (useCallback) toast helper;
      // called from an async drop handler (not during render), so the
      // set-state-in-render immutability rule doesn't apply.
      showToast('error', `Place failed: ${err.message || err}`);
    }
  }, [setDraggingOver, addPlacement, showToast]);

  // ── Campaign save/load ────────────────────────────────────────────────
  // Tracks which campaign (or 'none') the map has been synced to, so the
  // entry effect below auto-loads a campaign's saved map exactly once per
  // selection — fixing "reselect doesn't reload" — while an explicit click
  // (which sets the ref first) doesn't double-load.
  const autoSyncedRef = useRef(null);
  const handleSelectCampaign = useCallback(async (id) => {
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
          // Resolve the campaign by id at call time — the closed-over
          // `activeCampaign` is the PREVIOUS selection when this fires from a
          // fresh select, so the toast would name the wrong (or no) campaign.
          const camp = useStore.getState().campaigns?.find(c => c.id === id);
          showToast('success', `Loaded map for ${camp?.name || 'campaign'}`);
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
     
    // `activeCampaign` is no longer a dependency: the success toast now resolves
    // the campaign by `id` from the live store (above) instead of the closed-over
    // value, so this callback no longer reads it.
  }, [getCampaignMapState, replaceMapState, resetMapState, setActiveCampaign, bumpGeometryVersion, showToast]);

  // Empty-state activation (P1/P8): the no-campaign states get a real first click
  // (create-and-select / select-first). Hooked out to hold the size ratchet.
  const campaignActivation = useCampaignActivation({ activeCampaigns, handleSelectCampaign, showToast });

  // Premium / elevated auto-resume: on a cold Realm entry, reopen the campaign
  // the user last used so its map loads first (sets the active id; the mount-sync
  // effect below paints the saved map). No-ops when a campaign is already active.
  useCampaignAutoResume({ canManageCampaigns, activeCampaigns, activeCampaignId });

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
    setSavingMap(true);
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
    } finally {
      setSavingMap(false);
    }
  }, [activeCampaignId, activeCampaign, saveCampaignMap, setMapSnapshot, showToast]);

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
  }, [activeCampaignId, clearCampaignMap, showToast]);

  // Toolbar entry point: gate the mutation behind a scope-summary confirm
  // rather than firing immediately (P10 — consequential, only session-undoable).
  const handleAdvanceRealm = useCallback(() => {
    if (!activeCampaignId || worldPulseBusy) return;
    setAdvanceConfirm(true);
  }, [activeCampaignId, worldPulseBusy]);

  const performAdvanceRealm = useCallback(async () => {
    if (!activeCampaignId || worldPulseBusy) return;
    setAdvanceConfirm(false);
    // Open Pulse BEFORE the await so it shows the "Advancing…" skeleton (driven by
    // worldPulseBusy) for the whole run, not the prior tick's numbers (P10).
    setWorldPulseBusy(true); openInspectorAt('pulse');
    try {
      const result = await advanceCampaignWorld(activeCampaignId, worldPulseInterval);
      if (result && result.ok !== false) {
        // result.cloudPending means the advance is real locally but did not finish
        // reaching the cloud. The store already raised the retryable campaignSyncError
        // banner, so show an honest cloud-pending notice rather than a 'Realm
        // advanced' success (which would contradict the banner) or a bare 'could not
        // advance' (which invites a re-advance and double-ticks the world). A reload
        // or the same retried sync reconciles the cloud to the local advance.
        showToast(result.cloudPending ? 'error' : 'success', result.cloudPending ? 'The realm advanced here, but the change has not finished saving to the cloud. Reload to confirm once your connection recovers.' : `Realm advanced: ${result.autoApplied.length} drift, ${result.proposals.length} proposal(s)`);
      } else {
        // Plain-language error (raw reason → console only, P10/P11); the
        // not-canon case adds a CTA re-focusing the Pulse canonize control.
        if (result?.reason) console.warn('[WorldMap] advance realm reason:', result.reason);
        showToast('error', ADVANCE_ERROR_TEXT[result?.reason] || 'The realm could not advance. Try again in a moment.',
          result?.reason === 'world_not_canonized' ? { label: 'Canonize the world', onClick: () => openInspectorAt('pulse') } : null);
      }
    } catch (err) {
      console.warn('[WorldMap] advance realm failed', err);
      showToast('error', 'The realm could not advance. Try again in a moment.');
    } finally {
      setWorldPulseBusy(false);
    }
  }, [activeCampaignId, advanceCampaignWorld, worldPulseBusy, worldPulseInterval, openInspectorAt, showToast]);

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
  }, [activeCampaignId, undoLastPulse, worldPulseBusy, showToast]);

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
  // When `mapAutosave` flag is on (a stand-in for the
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
  }, [resetMapState, bumpGeometryVersion, showToast]);

  // ── Fit map to viewport ───────────────────────────────────────────────
  const handleFit = useCallback(async () => {
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) return;
    try { await bridge.fitMap(); } catch (e) {}
  }, []);

  // Recovery action for a failed map load (P10). Clear the error, show the
  // loader again, drop bridgeReady, and bump the reload key so the bridge effect
  // re-mounts a fresh iframe + re-arms the watchdog.
  const handleReloadMap = useCallback(() => {
    setMapError(null);
    setMapLoading(true);
    setMapReady(false);
    setBridgeReady(false);
    setMapReloadKey(k => k + 1);
  }, [setMapError, setMapLoading, setMapReady]);

  // Stable toggle for the Realm Inspector. Memoized so the memoized
  // WorldMapToolbar isn't re-rendered by an inline arrow on every parent render.
  const handleToggleInspector = useCallback(() => {
    setInspectorOpen(v => {
      // Opening from the toolbar always lands at the 'default' size so a prior
      // 'min'/'expanded' choice never surprises the GM on reopen (plan §2).
      if (!v) setInspectorSize('default');
      return !v;
    });
  }, [setInspectorOpen, setInspectorSize]);

  // ── Custom map image (Project 1, premium) ─────────────────────────────
  // Pick device file → ConfirmDialog (it disables terrain + overwrites the map)
  // → upload → setMapBackdrop (one undo step). Extracted to a hook to hold the
  // size ratchet; the controls render premium/active-campaign gated in the toolbar.
  const {
    pendingImportFile, cancelImportImage, handleImportImage, performImportImage, handleClearImage,
  } = useMapImageImport({ activeCampaignId, setMapBackdrop, clearMapBackdrop, showToast });

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
  }, [activeCampaignId, saveCampaignMap, showToast]);

  // ── Worldbuilder keymap ───────────────────────────────────────────────
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

  // ── Mobile render (defer-to-desktop) ───────────────────────────────────
  // On phones the whole map-editing workspace is replaced by the gate + read-only
  // dashboard (see RealmMobileGate). The branch sits AFTER every hook above, so it
  // does not change hook order and the desktop tree below stays byte-identical.
  if (isMobile) {
    return (
      <Suspense fallback={null}>
        <RealmMobileGate
          campaign={activeCampaign}
          canManageCampaigns={canManageCampaigns}
          tier={authTier}
          onUpgrade={handleUpgrade}
          nameById={nameById}
          {...campaignActivation}
        />
      </Suspense>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────
  // Use viewport height minus header/padding so the map fills the screen.
  // The parent <main> has padding and the header is ~52px on desktop.
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: SP.sm,
      height: `calc(100vh - ${CHROME.mapShellOffset}px)`,   // header (~52px) + main padding (~48px) + breathing room
      minHeight: CHROME.mapShellMin,
      // P12 EXCEPTION: the realm is a full-screen MAP tool, not a framed reading
      // document — the geographic canvas is the hero (P1) and must fill its width.
      // Capping the shell to layout.page letterboxed the map (the FMG canvas fits
      // to width at ~3:1, so a narrower column left a black band below it). So the
      // shell stays full-bleed; the toolbar card below right-anchors its Advance /
      // Inspector cluster, which keeps the chrome coherent without a width cap.
      width: '100%',
    }}>
      {/* ── Toolbar surface: top row + active contextual row share ONE bordered
            card (a single elevation) so the chrome reads as one toolbar surface,
            not stacked boxes. Each row strips its own border/fill; the SP.sm gap
            between them carries the grouping (P5 — flatten nested cards). */}
      <div style={{
        background: CARD, borderRadius: R.lg, border: `1px solid ${BORDER}`,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* mapMode/setMapMode, mapLoading, mapError, and imageMode are no longer
            passed down — the memoized toolbar reads them directly from the store. */}
        <WorldMapToolbar
        showingCampaignPanel={false}
        canManageCampaigns={canManageCampaigns} activeCampaign={activeCampaign} activeCampaignId={activeCampaignId}
        handleSelectCampaign={handleSelectCampaign} activeCampaigns={activeCampaigns}
        handleSaveMapToCampaign={handleSaveMapToCampaign} handleClearMapFromCampaign={handleClearMapFromCampaign} savingMap={savingMap}
        setShowSimulationRules={setShowSimulationRules} showSimulationRules={showSimulationRules}
        worldPulseInterval={worldPulseInterval} setWorldPulseInterval={setWorldPulseInterval} handleAdvanceRealm={handleAdvanceRealm} worldPulseBusy={worldPulseBusy}
        canUndoPulse={canUndoPulse} handleUndoRealm={handleUndoRealm} setShowLayersPanel={setShowLayersPanel} showLayersPanel={showLayersPanel} setTourOpen={setTourOpen}
        handleClearImage={handleClearImage} handleImportImage={handleImportImage} handleShareMap={handleShareMap} sharingMap={sharingMap}
        mapTemplates={mapTemplates} currentTemplate={currentTemplate} handleTemplateChange={handleTemplateChange} handleFit={handleFit} handleRegenerate={handleRegenerate}
        inspectorOpen={inspectorOpen} onToggleInspector={handleToggleInspector} unreviewedCount={unreviewedPulseCount}
        activePresetId={activeCampaign?.worldState?.simulationRules?.presetId} handleApplyPreset={handleApplyPreset}
      />

        {/* ── Contextual toolbar for current mode (second row of the shared
              card; renders nothing in View mode) ──────────────────────── */}
        <WorldMapContextToolbars
          showingCampaignPanel={false} mapMode={mapMode} imageMode={imageMode}
          bridgeRef={bridgeRef} bridgeReady={bridgeReady}
        />
      </div>

      {/* ── Main body: sidebar + map ─────────────────────────────────── */}
      {/* UX Phase 4 — relative container so the Realm Inspector can OVERLAY the
          stage (the map stays mounted underneath; no body-swap). */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* placements, isDraggingOver, mapMode, mapReady, and imageMode are no
            longer passed down — the memoized stage reads them from the store. */}
        {/* Resilience: the stage renders the SVG annotation overlay over live
            placement/relationship data (a corrupt save, a stale road-edge set,
            a bad backdrop import can all throw). Wrapped so a stage throw shows
            a recoverable fallback in place of the map rather than blanking the
            whole app via the root boundary. resetKey is the active campaign so
            switching campaigns clears a stale error. */}
        <FeatureErrorBoundary label="WorldMap.stage" kind="react.render.map" fallbackTitle="The map couldn't be displayed." resetKeys={[activeCampaignId]}>
          <WorldMapStage
            showingWizardNews={false} showingWorldPulse={false} showingPantheon={false}
            activeCampaign={activeCampaign} activeSaves={activeSaves}
            mapContainerRef={mapContainerRef} handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave} handleDrop={handleDrop} iframeRef={iframeRef}
            bridgeReady={bridgeReady} bridgeRef={bridgeRef} overlayTransformRef={overlayTransformRef}
            onNavigate={onNavigate} showLayersPanel={showLayersPanel} setShowLayersPanel={setShowLayersPanel}
            mapReloadKey={mapReloadKey} onReloadMap={handleReloadMap}
            {...campaignActivation}
          />
        </FeatureErrorBoundary>

        {inspectorOpen && (
          <Suspense fallback={null}>
            <RealmInspector
              open={inspectorOpen} section={inspectorSection}
              onSection={setInspectorSection} onClose={() => setInspectorOpen(false)}
              campaign={activeCampaign} canManageCampaigns={canManageCampaigns}
              tier={authTier} onUpgrade={handleUpgrade}
              inspectorSize={inspectorSize} onSetSize={setInspectorSize}
              {...campaignActivation} advancing={worldPulseBusy} />
          </Suspense>
        )}
      </div>

      <WorldMapOverlays
        toast={toast} regenerateConfirm={regenerateConfirm} performRegenerate={performRegenerate}
        setRegenerateConfirm={setRegenerateConfirm} mapSaveConfirm={mapSaveConfirm}
        setMapSaveConfirm={setMapSaveConfirm} performSaveMap={performSaveMap}
        advanceConfirm={advanceConfirm} advanceBody={advanceScopeBody}
        performAdvanceRealm={performAdvanceRealm} setAdvanceConfirm={setAdvanceConfirm}
        importConfirm={!!pendingImportFile} performImportImage={performImportImage} cancelImportImage={cancelImportImage}
        showSimulationRules={showSimulationRules} activeCampaign={activeCampaign}
        setShowSimulationRules={setShowSimulationRules} tourOpen={tourOpen} setTourOpen={setTourOpen} />
    </div>
  );
}
