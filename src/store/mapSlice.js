/**
 * mapSlice — Single source of truth for the World Map.
 *
 * Everything the map needs to render lives here. No local state in
 * WorldMap.jsx, no duplication, no drift. The campaign system persists
 * a snapshot of this slice's `mapState` sub-tree plus the FMG snapshot
 * blob.
 *
 * Derived selectors (burgSettlementMap, linked settlements, etc.) live
 * in store/selectors.js — never stored directly.
 *
 * Schema version 2 (2026-04): snapshot-based campaigns, annotation layer,
 * terrain mode support.
 */

import { track, EVENTS } from '../lib/analytics.js';
import { computeRoadEdges } from '../lib/roadNetwork.js';
import { deepClone } from '../domain/clone.js';

export const MAP_MODES = {
  VIEW: 'view',
  TERRAIN: 'terrain',
  ANNOTATE: 'annotate',
  // Routes mode: relationship-first overlay. Forces
  // RelationshipEdges + RoadsLayer + ChainEdges to full opacity,
  // hides annotate UI, surfaces a network-stress alert when the
  // supply-chain state has cascading impacts.
  ROUTES: 'routes',
};

// Terrain tools that actually open a usable FMG editor when invoked from a
// toolbar button (i.e. without an existing map-feature selection). The Rivers,
// Coastline, and Lakes editors require a clicked feature to operate (they
// reach for d3.event.target internally), so they are NOT exposed here — users
// double-click those features on the map to edit them. Biomes is handled as
// a layer-visibility toggle in mapState.layers.nativeBiomes, not as a tool.
export const TERRAIN_TOOLS = {
  HEIGHTMAP: 'heightmap',
};

export const ANNOTATE_TOOLS = {
  SELECT: 'select',
  LABEL: 'label',
  MARKER: 'marker',
  FOREST: 'forest',
};

export const FOREST_STYLES = ['pine', 'oak', 'palm', 'birch'];

const DEFAULT_LAYERS = {
  placements: true,
  relationships: true,
  relationshipFilter: ['trade_partner', 'allied', 'patron', 'client', 'vassal', 'rival', 'cold_war', 'hostile'],
  chains: true,
  chainFilter: null, // or string[] of good names
  regionalChannels: true,
  regionalChannelFilter: null,
  regionalImpacts: true,
  regionalImpactStatusFilter: ['queued', 'applied', 'resolved'],
  regionalMinSeverity: 0,
  regionalShowGm: true,
  // UX Phase 5 — spatial war/faith glyph overlay (deployment arrows, siege rings +
  // coalition badge, occupation shading, trade-war prize). On by default; honors
  // channel visibility via the same regionalShowGm gate as the other overlays.
  warFaith: true,
  roads: true,
  labels: true,
  markers: true,
  forests: true,
  nativeStateBorders: true,
  nativeCultureRegions: false,
  nativeBiomes: false,
};

const DEFAULT_VIEWPORT = { cx: 0, cy: 0, scale: 1, width: 0, height: 0 };

const DEFAULT_TERRAIN_OPTIONS = {
  brushSize: 20,
  brushStrength: 0.5,
  biome: 'grassland',
  riverWidth: 2,
};

const DEFAULT_ANNOTATE_OPTIONS = {
  labelFont: 'serif',
  labelSize: 16,
  labelColor: '#1c1409',
  markerIcon: 'pin',
  markerColor: '#a0762a',
  forestStyle: 'pine',
  forestRadius: 60,
  forestDensity: 0.4,
};

/** Fresh empty map state — used on reset, on first load, and as a baseline for campaigns. */
function freshMapState() {
  return {
    // FMG geography snapshot (base64 blob, nullable if not yet captured)
    fmgSnapshot: null,
    seed: null,
    // Custom image backdrop (premium). When set, the map renders this image
    // instead of the FMG terrain and suppresses heightmap/biome tools + the
    // geography-derived charted trails. { imageUrl, w, h } | null.
    // Placements in image mode are stored in image-PIXEL space (0..w, 0..h) —
    // the same <g>-space as the backdrop <image> — so every existing overlay
    // layer renders them unchanged (the <g> transform handles display scaling).
    customBackdrop: null,
    // Settlement burgs placed on the map: burgId -> { settlementId, x, y, cellId, placedAt }
    placements: {},
    // User-added text labels
    labels: [],
    // User-added pin markers
    markers: [],
    // Forest / decoration brush strokes
    forests: [],
    // Layer toggle & filter config
    layers: { ...DEFAULT_LAYERS },
    // Camera viewport
    viewport: { ...DEFAULT_VIEWPORT },
  };
}

// The annotate/placement undo stack only needs the MUTABLE sub-slices — NOT the
// heavy fmgSnapshot geography blob (often ~1MB+), the custom backdrop, layer
// toggles, or the camera viewport. Snapshotting the whole mapState cloned that
// blob on every label/marker/forest op, and restoring it wrongly reverted
// geography + camera on undo. We snapshot + restore only these keys.
const MAP_UNDO_KEYS = ['placements', 'labels', 'markers', 'forests'];

function snapshotAnnotations(mapState) {
  const snap = {};
  for (const k of MAP_UNDO_KEYS) {
    snap[k] = deepClone(mapState[k] ?? (k === 'placements' ? {} : []));
  }
  return snap;
}

function restoreAnnotations(mapState, snap) {
  for (const k of MAP_UNDO_KEYS) {
    if (snap[k] !== undefined) mapState[k] = deepClone(snap[k]);
  }
  // Backdrop is only present in snapshots taken by the undoable image-import
  // path (setMapBackdrop). Normal annotation snapshots omit it, so this branch
  // never fires for label/marker/forest/placement undos — the backdrop is left
  // exactly as it was. `null` is a real value (no backdrop), so guard on the
  // key's presence, not truthiness.
  if ('customBackdrop' in snap) {
    mapState.customBackdrop = snap.customBackdrop ? deepClone(snap.customBackdrop) : null;
  }
}

// Snapshot the current annotation/placement sub-slices onto the undo stack
// before a mutating annotate/placement action, so the AnnotateToolbar Undo/Redo
// buttons work. Operates on the immer draft.
function snapshotForUndo(state, action) {
  state.mapUndoStack.push({
    action,
    snapshot: snapshotAnnotations(state.mapState),
    timestamp: Date.now(),
  });
  if (state.mapUndoStack.length > 30) state.mapUndoStack.shift();
  state.mapRedoStack = [];
}

export const createMapSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  // Runtime (non-persisted) iframe bridge state
  mapReady: false,
  mapLoading: true,
  mapError: null,

  // Monotonic counter bumped whenever the underlying FMG geography changes
  // (snapshot loaded, world regenerated). Derived layers — RoadsLayer,
  // RelationshipEdges, ChainEdges — include this in their effect deps so
  // their A* / coordinate caches recompute against the new world even when
  // placements themselves are unchanged. Without this, loading a saved map
  // shows stale routes from the previously-rendered world until the user
  // perturbs a placement.
  geometryVersion: 0,

  // UI state
  mapMode: MAP_MODES.VIEW,
  terrainTool: null,          // one of TERRAIN_TOOLS when mapMode === TERRAIN
  annotateTool: ANNOTATE_TOOLS.SELECT,  // current annotate tool
  selectedBurgId: null,        // clicked burg id (opaque placement handle)
  selectedSettlementId: null,  // clicked settlement UUID — primary key for detail panels
  selectedAnnotationId: null,  // clicked label/marker/forest
  selectedAnnotationKind: null,  // 'label' | 'marker' | 'forest' — which layer the id lives in
  // Quick-inspector hover state. Distinct from
  // `selectedSettlementId` because selection is a deliberate click;
  // hover is a "peek" that doesn't commit. The QuickInspector
  // component subscribes to this and renders a 3-line card.
  hoveredSettlementId: null,

  // Transient drag state
  isDraggingOver: false,

  // Terrain / annotate tool options
  terrainOptions: { ...DEFAULT_TERRAIN_OPTIONS },
  annotateOptions: { ...DEFAULT_ANNOTATE_OPTIONS },

  // Undo/redo stacks (in-memory, not persisted)
  mapUndoStack: [],
  mapRedoStack: [],

  // The map state proper — the thing that gets persisted per campaign
  mapState: freshMapState(),

  // ── Runtime setters ───────────────────────────────────────────────────────
  setMapReady: (ready) => set(state => {
    state.mapReady = ready;
    state.mapLoading = !ready;
  }),

  setMapLoading: (loading) => set(state => { state.mapLoading = loading; }),

  setMapError: (err) => set(state => { state.mapError = err; }),

  setMapMode: (mode) => set(state => {
    if (!Object.values(MAP_MODES).includes(mode)) return;
    state.mapMode = mode;
    // Reset tool state when switching modes
    if (mode !== MAP_MODES.TERRAIN) state.terrainTool = null;
    if (mode === MAP_MODES.ANNOTATE && !state.annotateTool) state.annotateTool = ANNOTATE_TOOLS.SELECT;
  }),

  setTerrainTool: (tool) => set(state => {
    state.terrainTool = tool;
  }),

  setAnnotateTool: (tool) => set(state => {
    state.annotateTool = tool;
  }),

  setSelectedBurgId: (id) => set(state => { state.selectedBurgId = id; }),

  clearSelectedBurgId: () => set(state => { state.selectedBurgId = null; }),

  setSelectedSettlementId: (id) => set(state => { state.selectedSettlementId = id; }),

  clearSelectedSettlementId: () => set(state => { state.selectedSettlementId = null; }),

  // Hover-peek mutations. Setting hoveredSettlementId
  // does not affect selection; the QuickInspector renders a tiny
  // floating card with name + pressure + top hook so the user can
  // peek a placement without committing to opening the full detail.
  setHoveredSettlementId: (id) => set(state => { state.hoveredSettlementId = id; }),

  clearHoveredSettlementId: () => set(state => { state.hoveredSettlementId = null; }),

  // The calling layer (LabelsLayer / MarkersLayer / ForestsLayer) knows which
  // kind it owns, so it passes `kind` alongside the id. That lets the Annotate
  // toolbar's Delete fire the SINGLE correct deletion instead of firing both
  // deleteLabel + deleteMarker blindly. HitLayer clears with no kind on a
  // background click, nulling both.
  setSelectedAnnotationId: (id, kind = null) => set(state => {
    state.selectedAnnotationId = id;
    state.selectedAnnotationKind = id ? kind : null;
  }),

  setDraggingOver: (dragging) => set(state => { state.isDraggingOver = dragging; }),

  setTerrainOption: (key, value) => set(state => {
    state.terrainOptions[key] = value;
  }),

  setAnnotateOption: (key, value) => set(state => {
    state.annotateOptions[key] = value;
  }),

  // ── Viewport ──────────────────────────────────────────────────────────────
  setMapViewport: (vp) => set(state => {
    // Tag the camera with its coordinate space so restore paths (image-mode
    // initial-fit, FMG reload) never reuse a viewport from the other mode.
    const mode = state.mapState.customBackdrop?.imageUrl ? 'image' : 'fmg';
    state.mapState.viewport = { ...state.mapState.viewport, ...vp, mode };
  }),

  // ── Layer toggles ─────────────────────────────────────────────────────────
  toggleLayer: (key) => set(state => {
    if (!(key in state.mapState.layers)) return;
    state.mapState.layers[key] = !state.mapState.layers[key];
  }),

  setLayerFilter: (key, value) => set(state => {
    state.mapState.layers[key] = value;
  }),

  // ── Placements (settlement drops) ─────────────────────────────────────────
  addPlacement: ({ burgId, settlementId, x, y, cellId, via }) => {
    // Route count BEFORE the add — used only to detect whether this placement
    // brought a new derived road edge into being (the MAP_ROUTE_DRAWN proxy).
    let routeCountBefore = 0;
    try {
      const prev = get();
      routeCountBefore = computeRoadEdges(prev.savedSettlements, prev.mapState.placements).length;
    } catch { /* analytics-only; never block the placement */ }

    set(state => {
      snapshotForUndo(state, 'place settlement');
      state.mapState.placements[burgId] = {
        settlementId,
        x, y,
        cellId: cellId ?? null,
        placedAt: new Date().toISOString(),
      };
    });

    // Fire-and-forget analytics — coarse counts only, NEVER coordinates.
    try {
      const next = get();
      const placementCountAfter = Object.keys(next.mapState.placements || {}).length;
      // Tier of the just-placed settlement, derived inline as a coarse enum.
      const save = settlementId
        ? (next.savedSettlements || []).find(s => String(s?.id) === String(settlementId))
        : null;
      const tier = save?.settlement?.tier || save?.tier || 'unknown';
      track(EVENTS.MAP_PLACEMENT_ADDED, {
        placement_count_after: placementCountAfter,
        tier,
        via: via === 'picker' ? 'picker' : 'drop',
      });

      // MAP_ROUTE_DRAWN — routes are derived (computeRoadEdges), not hand-drawn;
      // a placement that grows the road graph is the natural "a route appeared"
      // moment. Only fire when the edge count strictly increases.
      const edges = computeRoadEdges(next.savedSettlements, next.mapState.placements);
      if (edges.length > routeCountBefore) {
        // Did this add link two settlement-backed placements (vs an empty burg)?
        const linksTwoPlaced = edges.some(e => {
          const a = next.mapState.placements[e.fromBurgId];
          const b = next.mapState.placements[e.toBurgId];
          return !!(a?.settlementId && b?.settlementId);
        });
        track(EVENTS.MAP_ROUTE_DRAWN, {
          route_count_after: edges.length,
          links_two_placed_settlements: linksTwoPlaced,
        });
      }
    } catch { /* analytics is best-effort; never affect placement behavior */ }
  },

  removePlacementLocal: (burgId) => {
    set(state => {
      snapshotForUndo(state, 'remove placement');
      delete state.mapState.placements[burgId];
    });
    try {
      const placementCountAfter = Object.keys(get().mapState.placements || {}).length;
      track(EVENTS.MAP_PLACEMENT_REMOVED, { placement_count_after: placementCountAfter });
    } catch { /* analytics is best-effort */ }
  },

  // Update x/y (and optionally cellId) for an existing placement. Used by
  // drag-to-move on the selected map icon.
  updatePlacement: (burgId, patch) => set(state => {
    // Placement move-lock (campaign-clock): once the active campaign's world is
    // canonized, placed settlements can no longer be moved. Adding new ones is
    // still allowed (addPlacement is ungated). The UI also disables the drag
    // affordance; this is the authoritative backstop (incl. autosave paths).
    const camp = state.campaigns?.find(c => c.id === state.activeCampaignId);
    if (camp?.worldState?.canonizedAt) return;
    const p = state.mapState.placements[burgId];
    if (!p) return;
    if (typeof patch?.x === 'number') p.x = patch.x;
    if (typeof patch?.y === 'number') p.y = patch.y;
    if (patch?.cellId !== undefined) p.cellId = patch.cellId;
  }),

  replaceAllPlacements: (placements) => set(state => {
    state.mapState.placements = { ...(placements || {}) };
  }),

  clearAllPlacementsLocal: () => set(state => {
    snapshotForUndo(state, 'clear placements');
    state.mapState.placements = {};
  }),

  // ── Labels ────────────────────────────────────────────────────────────────
  addLabel: ({ x, y, text = 'Label', fontSize, color, fontFamily, rotation = 0 }) => set(state => {
    snapshotForUndo(state, 'add label');
    const opts = state.annotateOptions;
    state.mapState.labels.push({
      id: `lbl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      x, y, text,
      fontSize: fontSize ?? opts.labelSize,
      color:    color    ?? opts.labelColor,
      fontFamily: fontFamily ?? opts.labelFont,
      rotation,
    });
  }),

  updateLabel: (id, patch) => set(state => {
    const lbl = state.mapState.labels.find(l => l.id === id);
    if (lbl) Object.assign(lbl, patch);
  }),

  deleteLabel: (id) => set(state => {
    snapshotForUndo(state, 'delete label');
    state.mapState.labels = state.mapState.labels.filter(l => l.id !== id);
  }),

  // ── Markers ───────────────────────────────────────────────────────────────
  addMarker: ({ x, y, icon, color, title = '', note = '' }) => set(state => {
    snapshotForUndo(state, 'add marker');
    const opts = state.annotateOptions;
    state.mapState.markers.push({
      id: `mrk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      x, y,
      icon:  icon  ?? opts.markerIcon,
      color: color ?? opts.markerColor,
      title, note,
    });
  }),

  updateMarker: (id, patch) => set(state => {
    const mrk = state.mapState.markers.find(m => m.id === id);
    if (mrk) Object.assign(mrk, patch);
  }),

  deleteMarker: (id) => set(state => {
    snapshotForUndo(state, 'delete marker');
    state.mapState.markers = state.mapState.markers.filter(m => m.id !== id);
  }),

  // ── Forests ───────────────────────────────────────────────────────────────
  addForest: ({ x, y, radius, density, treeStyle }) => set(state => {
    snapshotForUndo(state, 'add forest');
    const opts = state.annotateOptions;
    state.mapState.forests.push({
      id: `fst_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      x, y,
      radius:    radius    ?? opts.forestRadius,
      density:   density   ?? opts.forestDensity,
      treeStyle: treeStyle ?? opts.forestStyle,
    });
  }),

  updateForest: (id, patch) => set(state => {
    const f = state.mapState.forests.find(x => x.id === id);
    if (f) Object.assign(f, patch);
  }),

  deleteForest: (id) => set(state => {
    snapshotForUndo(state, 'delete forest');
    state.mapState.forests = state.mapState.forests.filter(f => f.id !== id);
  }),

  // ── Snapshot (FMG geography blob) ─────────────────────────────────────────
  setMapSnapshot: (blob, seed) => set(state => {
    state.mapState.fmgSnapshot = blob || null;
    if (seed != null) state.mapState.seed = seed;
  }),

  // ── Custom image backdrop (premium) ───────────────────────────────────────
  /**
   * Switch the map to a custom image backdrop. Non-destructive: the FMG
   * snapshot is left intact so clearMapBackdrop restores terrain mode. Bumps
   * geometryVersion so derived layers (roads) recompute and skip A*.
   *
   * Undoable as a SINGLE step: before applying, this captures the pre-import
   * annotation sub-slices AND the prior customBackdrop onto the undo stack, so
   * the map's Undo button reverts the whole import (backdrop + any placements it
   * overwrote) in one click. The snapshot carries the `customBackdrop` key,
   * which restoreAnnotations only honors when present — annotation undos are
   * untouched.
   * @param {{imageUrl:string,w:number,h:number}} backdrop
   */
  setMapBackdrop: (backdrop) => set(state => {
    if (!backdrop || !backdrop.imageUrl) return;
    const snapshot = snapshotAnnotations(state.mapState);
    snapshot.customBackdrop = state.mapState.customBackdrop
      ? deepClone(state.mapState.customBackdrop) : null;
    state.mapUndoStack.push({ action: 'import map image', snapshot, timestamp: Date.now() });
    if (state.mapUndoStack.length > 30) state.mapUndoStack.shift();
    state.mapRedoStack = [];
    state.mapState.customBackdrop = {
      imageUrl: backdrop.imageUrl,
      w: Number(backdrop.w) || 0,
      h: Number(backdrop.h) || 0,
    };
    // CRITICAL: the camera viewport is mode-specific (FMG map-pixels vs image
    // pixels). Reset on the FMG→image switch so a stale FMG-space camera can't
    // place the backdrop off-screen; the overlay then contain-fits the image.
    state.mapState.viewport = { ...DEFAULT_VIEWPORT };
    state.geometryVersion = (state.geometryVersion || 0) + 1;
  }),

  /** Drop back to FMG terrain mode (keeps any existing fmgSnapshot). */
  clearMapBackdrop: () => set(state => {
    state.mapState.customBackdrop = null;
    // Drop the image-space camera so it can't be pushed into FMG d3.zoom on reload.
    state.mapState.viewport = { ...DEFAULT_VIEWPORT };
    state.geometryVersion = (state.geometryVersion || 0) + 1;
  }),

  /**
   * Bump the geometry-version counter. Called by WorldMap.jsx after a fresh
   * FMG snapshot has been loaded, the world has been regenerated, or the
   * map has been deselected — anything that invalidates A*-routed road
   * polylines whose coordinates were computed against the previous geometry.
   */
  bumpGeometryVersion: () => set(state => {
    state.geometryVersion = (state.geometryVersion || 0) + 1;
  }),

  // ── Wholesale state swap (campaign load) ──────────────────────────────────
  /**
   * Replace the full mapState with a new one (typically from a loaded campaign).
   * Does NOT touch the FMG snapshot — that needs to be loaded via the bridge.
   */
  replaceMapState: (next) => set(state => {
    if (!next) { state.mapState = freshMapState(); return; }
    // Merge with defaults to handle older snapshots missing new fields
    const fresh = freshMapState();
    state.mapState = {
      ...fresh,
      ...next,
      layers:   { ...fresh.layers,   ...(next.layers   || {}) },
      viewport: { ...fresh.viewport, ...(next.viewport || {}) },
      placements: next.placements || {},
      labels:   next.labels   || [],
      markers:  next.markers  || [],
      forests:  next.forests  || [],
      customBackdrop: next.customBackdrop || null, // older campaigns → null (FMG mode)
    };
  }),

  /** Reset to empty. Used when deselecting a campaign. */
  resetMapState: () => set(state => {
    state.mapState = freshMapState();
    state.selectedBurgId = null;
    state.selectedAnnotationId = null;
    state.selectedAnnotationKind = null;
    // Also clear settlement selection/hover — a campaign deselect left these
    // pointing at the now-gone settlement.
    state.selectedSettlementId = null;
    state.hoveredSettlementId = null;
  }),

  // ── Undo/redo (per-action snapshot of annotation/placement sub-slices) ─────
  // Public action: components call this ONCE at drag-start (move/edit, which
  // otherwise mutate per-pointermove and would flood the stack) so the whole
  // drag collapses to a single undo entry.
  pushMapUndo: (action) => set(state => {
    snapshotForUndo(state, action);
  }),

  mapUndo: () => set(state => {
    const entry = state.mapUndoStack.pop();
    if (!entry) return;
    // Mirror the entry's shape onto the redo snapshot: an import entry carries
    // the backdrop, so the redo snapshot must capture the CURRENT backdrop too
    // (re-applying it as one step). Annotation entries omit the key, so the
    // backdrop is never touched on a label/marker/forest/placement undo.
    const redoSnap = snapshotAnnotations(state.mapState);
    if ('customBackdrop' in entry.snapshot) {
      redoSnap.customBackdrop = state.mapState.customBackdrop
        ? deepClone(state.mapState.customBackdrop) : null;
    }
    state.mapRedoStack.push({ action: entry.action, snapshot: redoSnap, timestamp: Date.now() });
    // Restore the annotation/placement sub-slices — and the backdrop only when
    // the entry carried it. Geography (fmgSnapshot), layers, and camera are
    // always left as they are.
    restoreAnnotations(state.mapState, entry.snapshot);
  }),

  mapRedo: () => set(state => {
    const entry = state.mapRedoStack.pop();
    if (!entry) return;
    const undoSnap = snapshotAnnotations(state.mapState);
    if ('customBackdrop' in entry.snapshot) {
      undoSnap.customBackdrop = state.mapState.customBackdrop
        ? deepClone(state.mapState.customBackdrop) : null;
    }
    state.mapUndoStack.push({ action: entry.action, snapshot: undoSnap, timestamp: Date.now() });
    restoreAnnotations(state.mapState, entry.snapshot);
  }),

  // ── Derived selectors (also exposed on store/selectors.js) ────────────────
  /** burgId -> settlementId derived from placements */
  getBurgSettlementMap: () => {
    const out = {};
    const placements = get().mapState.placements;
    for (const [burgId, p] of Object.entries(placements)) {
      out[burgId] = p.settlementId;
    }
    return out;
  },

  /** Settlement by burg id, or null */
  getSettlementForBurg: (burgId) => {
    const p = get().mapState.placements[burgId];
    if (!p) return null;
    return (get().savedSettlements || []).find(s => s.id === p.settlementId) || null;
  },

  // ── Burg→config conversion (used to derive settlement from a clicked burg) ──
  burgToConfig: (burg) => {
    if (!burg) return null;
    const pop = burg.population || 500;
    let settType;
    if (pop <= 60)        settType = 'thorp';
    else if (pop <= 240)  settType = 'hamlet';
    else if (pop <= 900)  settType = 'village';
    else if (pop <= 5000) settType = 'town';
    else if (pop <= 25000) settType = 'city';
    else                  settType = 'metropolis';
    return {
      settType,
      population: pop,
      tradeRouteAccess: burg.port ? 'port' : 'road',
      customName: burg.name || '',
    };
  },
});
