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

export const MAP_MODES = {
  VIEW: 'view',
  TERRAIN: 'terrain',
  ANNOTATE: 'annotate',
};

export const TERRAIN_TOOLS = {
  HEIGHTMAP: 'heightmap',
  RIVERS: 'rivers',
  COASTLINE: 'coastline',
  LAKES: 'lakes',
  BIOMES: 'biomes',
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
  relationshipFilter: ['trade_partner', 'allied', 'patron', 'client', 'rival', 'cold_war', 'hostile'],
  chains: true,
  chainFilter: null, // or string[] of good names
  roads: true,
  labels: true,
  markers: true,
  forests: true,
  nativeStateBorders: true,
  nativeCultureRegions: false,
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

export const createMapSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  // Runtime (non-persisted) iframe bridge state
  mapReady: false,
  mapLoading: true,
  mapError: null,

  // UI state
  mapMode: MAP_MODES.VIEW,
  terrainTool: null,          // one of TERRAIN_TOOLS when mapMode === TERRAIN
  annotateTool: ANNOTATE_TOOLS.SELECT,  // current annotate tool
  selectedBurgId: null,        // clicked burg id (opaque placement handle)
  selectedSettlementId: null,  // clicked settlement UUID — primary key for detail panels
  selectedAnnotationId: null,  // clicked label/marker/forest

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

  setSelectedAnnotationId: (id) => set(state => { state.selectedAnnotationId = id; }),

  setDraggingOver: (dragging) => set(state => { state.isDraggingOver = dragging; }),

  setTerrainOption: (key, value) => set(state => {
    state.terrainOptions[key] = value;
  }),

  setAnnotateOption: (key, value) => set(state => {
    state.annotateOptions[key] = value;
  }),

  // ── Viewport ──────────────────────────────────────────────────────────────
  setMapViewport: (vp) => set(state => {
    state.mapState.viewport = { ...state.mapState.viewport, ...vp };
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
  addPlacement: ({ burgId, settlementId, x, y, cellId }) => set(state => {
    state.mapState.placements[burgId] = {
      settlementId,
      x, y,
      cellId: cellId ?? null,
      placedAt: new Date().toISOString(),
    };
  }),

  removePlacementLocal: (burgId) => set(state => {
    delete state.mapState.placements[burgId];
  }),

  // Update x/y (and optionally cellId) for an existing placement. Used by
  // drag-to-move on the selected map icon.
  updatePlacement: (burgId, patch) => set(state => {
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
    state.mapState.placements = {};
  }),

  // ── Labels ────────────────────────────────────────────────────────────────
  addLabel: ({ x, y, text = 'Label', fontSize, color, fontFamily, rotation = 0 }) => set(state => {
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
    state.mapState.labels = state.mapState.labels.filter(l => l.id !== id);
  }),

  // ── Markers ───────────────────────────────────────────────────────────────
  addMarker: ({ x, y, icon, color, title = '', note = '' }) => set(state => {
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
    state.mapState.markers = state.mapState.markers.filter(m => m.id !== id);
  }),

  // ── Forests ───────────────────────────────────────────────────────────────
  addForest: ({ x, y, radius, density, treeStyle }) => set(state => {
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
    state.mapState.forests = state.mapState.forests.filter(f => f.id !== id);
  }),

  // ── Snapshot (FMG geography blob) ─────────────────────────────────────────
  setMapSnapshot: (blob, seed) => set(state => {
    state.mapState.fmgSnapshot = blob || null;
    if (seed != null) state.mapState.seed = seed;
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
    };
  }),

  /** Reset to empty. Used when deselecting a campaign. */
  resetMapState: () => set(state => {
    state.mapState = freshMapState();
    state.selectedBurgId = null;
    state.selectedAnnotationId = null;
  }),

  // ── Undo/redo (coarse — snapshot-per-action) ──────────────────────────────
  pushMapUndo: (action) => set(state => {
    state.mapUndoStack.push({
      action,
      snapshot: JSON.parse(JSON.stringify(state.mapState)),
      timestamp: Date.now(),
    });
    // Cap at 30 entries
    if (state.mapUndoStack.length > 30) state.mapUndoStack.shift();
    // Any new action invalidates redo
    state.mapRedoStack = [];
  }),

  mapUndo: () => set(state => {
    const entry = state.mapUndoStack.pop();
    if (!entry) return;
    state.mapRedoStack.push({
      action: entry.action,
      snapshot: JSON.parse(JSON.stringify(state.mapState)),
      timestamp: Date.now(),
    });
    state.mapState = entry.snapshot;
  }),

  mapRedo: () => set(state => {
    const entry = state.mapRedoStack.pop();
    if (!entry) return;
    state.mapUndoStack.push({
      action: entry.action,
      snapshot: JSON.parse(JSON.stringify(state.mapState)),
      timestamp: Date.now(),
    });
    state.mapState = entry.snapshot;
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
    let settType = 'village';
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
