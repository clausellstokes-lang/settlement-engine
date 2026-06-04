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
  Newspaper, SlidersHorizontal, Zap,
} from 'lucide-react';
import { flag } from '../lib/flags.js';
import { Funnel, EVENTS } from '../lib/analytics.js';
import { useStore } from '../store/index.js';
import { createBridgeSingleton } from '../lib/mapBridge.js';
import { MAP_MODES } from '../store/mapSlice.js';
import { isCanonSave } from '../domain/campaign/canon.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, PARCH, sans, FS, SP, R, swatch, PARCH_100 } from './theme.js';
import { saves as savesService } from '../lib/saves.js';
import { ConfirmDialog } from './primitives/Dialog.jsx';

const MapOverlay     = lazy(() => import('./MapOverlay.jsx'));
const PlacementDetailCard = lazy(() => import('./map/PlacementDetailCard.jsx'));
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
  const bridgeRef = useRef(null);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [mapTemplates, setMapTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState('');
  const [campaignWorkspace, setCampaignWorkspace] = useState('map');
  const [worldPulseInterval, setWorldPulseInterval] = useState('one_month');
  const [worldPulseBusy, setWorldPulseBusy] = useState(false);
  const [showSimulationRules, setShowSimulationRules] = useState(false);
  const [regenerateConfirm, setRegenerateConfirm] = useState(null);

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
  const advanceCampaignWorld = useStore(s => s.advanceCampaignWorld);

  const activeCampaign = useMemo(
    () => campaigns.find(c => c.id === activeCampaignId) || null,
    [campaigns, activeCampaignId],
  );
  const showingWizardNews = Boolean(activeCampaign && campaignWorkspace === 'news');
  const showingWorldPulse = Boolean(activeCampaign && campaignWorkspace === 'pulse');
  const showingCampaignPanel = showingWizardNews || showingWorldPulse;

  // Audit recommendation: when a campaign is active, default to canon-
  // only filtering so the map represents the *deployed* world, not
  // every draft the user is tinkering with. Toggleable via the
  // toolbar so power users can opt out.
  const [canonOnlyFilter, setCanonOnlyFilter] = useState(true);

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
      // handler (not during render). The immutability rule is over-broad
      // here — the function is defined during render but only invoked
      // by user actions.
      // eslint-disable-next-line react-hooks/immutability
      showToast('error', `Place failed: ${err.message || err}`);
    }
  }, [setDraggingOver]);

  // ── Campaign save/load ────────────────────────────────────────────────
  const handleSelectCampaign = useCallback(async (id) => {
    setCampaignWorkspace('map');
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
      const placedCount = (useStore.getState().mapPlacements || []).length;
      const labelCount = (useStore.getState().mapLabels || []).length;
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
          // ⌘S — save map. The actual save handler lives elsewhere in
          // this component (handleSaveMapToCampaign); we look it up
          // from the store as a fallback when the local closure
          // doesn't have it in scope.
          const fn = useStore.getState().saveMapToCampaign;
          if (typeof fn === 'function') fn();
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
   
  }, [setMapMode, handleFit]);

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
          <ModeSwitch mapMode={mapMode} setMapMode={setMapMode} />
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
              </>
            )}
            <div style={{ width: 1, height: 24, background: BORDER2 }} />
          </>
        )}

        {/* Utility buttons */}
        {!showingCampaignPanel && (
          <>
            <IconButton
              onClick={() => setShowLayersPanel(v => !v)}
              title="Toggle layer visibility"
              active={showLayersPanel}
            >
              <Layers size={13} /> Layers
            </IconButton>
            {/* Canon-only toggle — defaults ON when a campaign is active. */}
            <IconButton
              onClick={() => setCanonOnlyFilter(v => !v)}
              title={canonOnlyFilter
                ? 'Showing only canon settlements. Click to also show drafts.'
                : 'Showing all settlements. Click to limit to canon.'}
              active={canonOnlyFilter}
              aria-pressed={canonOnlyFilter}
            >
              {canonOnlyFilter ? 'Canon Only' : 'All Phases'}
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
      {!showingCampaignPanel && mapMode === MAP_MODES.TERRAIN && (
        <Suspense fallback={null}><TerrainToolbar bridgeRef={bridgeRef} /></Suspense>
      )}
      {!showingCampaignPanel && mapMode === MAP_MODES.ROUTES && (
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
              {/* bridgeRef.current is read during render to pass into the overlay.
                  Strictly a react-hooks/refs violation, but the bridge is
                  constructed once during the bridge-init effect and never
                  reassigned for the lifetime of this WorldMap instance.
                  Fix-it-properly path: lift bridge into useState alongside
                  bridgeReady, so the prop is state-driven. Deferred — bridge
                  is non-serializable and state-storing it triggers some Zustand
                  immer warnings we'd need to silence. */}
              {/* eslint-disable-next-line react-hooks/refs */}
              <MapOverlay bridge={bridgeRef.current} />
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

      <Suspense fallback={null}>
        <SimulationRulesDialog
          open={showSimulationRules}
          campaign={activeCampaign}
          onClose={() => setShowSimulationRules(false)}
        />
      </Suspense>

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
  // P110 / M-4 — Routes mode appended to the mode pill group. The
  // existing mode pill is already segmented; this is one more entry.
  // Click promotes relationship/road/supply-chain layers to primary
  // content and fires MAP_ROUTES_MODE_ENTERED analytics.
  const modes = [
    { id: MAP_MODES.VIEW,     label: 'View',     Icon: Eye },
    { id: MAP_MODES.TERRAIN,  label: 'Terrain',  Icon: Mountain },
    { id: MAP_MODES.ANNOTATE, label: 'Annotate', Icon: PenTool },
    { id: MAP_MODES.ROUTES,   label: 'Routes',   Icon: LinkIcon },
  ];
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
