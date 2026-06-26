// ── public/map/sf-bridge.js ───────────────────────────────────────────────
// SettlementForge postMessage bridge — EXTRACTED from main.js so a vanilla
// FMG upgrade can drop in a fresh main.js without losing the integration.
// Loaded as a separate <script defer> AFTER main.js — by then FMG globals
// (svg, pack, d3, cells, regenerateMap, graphWidth, graphHeight, seed)
// are bound on window. See docs/fmg-fork.md for the upgrade procedure.
//
// Original location in main.js: lines 1379-2505.

// ── SettlementForge postMessage Bridge (v2) ────────────────────────────────
// Typed RPC with request-id correlation between the embedded FMG iframe and
// the parent SettlementForge app.
//
// Every command FROM the parent carries an opaque `_rid`. Replies echo the
// `_rid` with either the reply payload or `{ _error: "..." }`. Push events
// have no `_rid`.
//
// Commands (parent → FMG):
//   settlementEngine:requestBurgList
//   settlementEngine:placeSettlement     { settlementId, x, y, name, population }
//   settlementEngine:removePlacement     { burgId }
//   settlementEngine:restorePlacements   { placements }
//   settlementEngine:clearAllPlacements
//   settlementEngine:getViewport
//   settlementEngine:setViewport         { cx, cy, scale, duration }
//   settlementEngine:fitMap
//   settlementEngine:saveSnapshot
//   settlementEngine:exportThumb         { maxW }  → small JPEG data URL of the
//                                          rendered terrain (gallery thumbnail)
//   settlementEngine:loadSnapshot        { snapshot }
//   settlementEngine:resetMap            { seed }
//   settlementEngine:activateTool        { tool, options }
//   settlementEngine:deactivateTool
//   settlementEngine:terrainUndo
//   settlementEngine:terrainRedo
//   settlementEngine:setEmbeddedMode     { enabled }
//
// Push events (FMG → parent):
//   fmg:ready          { seed, width, height }
//   fmg:burgSelected   { burg }
//   fmg:burgList       { burgs }
//   fmg:viewport       { cx, cy, scale, width, height }   [throttled ~60fps]
//   fmg:mapReset       { seed }
//   fmg:snapshotLoaded
//   fmg:terrainChanged { tool }
//
// The React overlay layer (src/components/MapOverlay.jsx) sits on top of the
// iframe and owns all relationship/chain/label/marker/forest rendering. The
// FMG bridge no longer draws overlays itself.

(function initSettlementForgeBridge() {
  const isEmbedded = window.parent !== window;
  if (!isEmbedded) return;

  // Apply SettlementForge chrome palette class
  document.body.classList.add('sf-embedded');

  // Track user-placed burgs (ids only) — only these are visible in embedded
  // mode and only these are reported back to the parent in the burg list.
  window.__sfPlacedBurgIds = window.__sfPlacedBurgIds || new Set();

  let readyNotified = false;
  let viewportRafPending = false;
  let lastViewportTx = null;

  // ══════════════════════════════════════════════════════════════════════════
  // SettlementForge Embedded-Mode Overrides
  //
  // Goal: FMG generates GEOGRAPHY ONLY — terrain, rivers, coastlines, biomes.
  // No pre-populated settlements, states, routes, religions, military, etc.
  // Template is locked to single-landmass / island-cluster shapes.
  // ══════════════════════════════════════════════════════════════════════════

  // Curated single-landmass templates (no Strait operations that split continents)
  const SF_TEMPLATES = {
    highIsland:  { label: 'Mountainous Island' },
    lowIsland:   { label: 'Low Island' },
    volcano:     { label: 'Volcanic Island' },
    peninsula:   { label: 'Peninsula' },
    pangea:      { label: 'Supercontinent' },
    atoll:       { label: 'Atoll' },
  };

  // Custom template: clustered island chain (Philippines / Indonesia style).
  // Builds central landmass, adds surrounding hills, troughs carve channels
  // between islands, mask removes low-elevation land to create gaps.
  // No Strait operations — islands stay close together.
  const SF_ARCHIPELAGO_TEMPLATE = `Hill 1 85-95 45-55 35-65
    Hill 5-7 25-40 15-85 15-85
    Range 1-2 35-55 25-75 25-75
    Smooth 2 0 0 0
    Trough 10-14 20-35 10-90 10-90
    Multiply 0.5 20-100 0 0
    Mask 4 0 0 0`;

  // Register our custom template into FMG's heightmapTemplates object
  if (typeof heightmapTemplates !== 'undefined') {
    heightmapTemplates.sfArchipelago = {
      id: 99,
      name: 'Island Chain',
      template: SF_ARCHIPELAGO_TEMPLATE,
      probability: 0,  // never picked randomly — only via explicit selection
    };
    SF_TEMPLATES.sfArchipelago = { label: 'Island Chain' };
  }

  // Which template the user has requested (null = pick randomly from curated list)
  window.__sfRequestedTemplate = null;

  function sfPickTemplate() {
    const keys = Object.keys(SF_TEMPLATES);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  // ── Override FMG's randomizeOptions to force empty-world generation ──────
  // This runs synchronously BEFORE DOMContentLoaded (before generate() fires).
  const _origRandomize = window.randomizeOptions;
  window.randomizeOptions = function () {
    // Let FMG set its defaults first
    if (typeof _origRandomize === 'function') _origRandomize.apply(this, arguments);

    // Force single-landmass template
    const tmpl = window.__sfRequestedTemplate || sfPickTemplate();
    if (typeof heightmapTemplates !== 'undefined' && heightmapTemplates[tmpl]) {
      const el = document.getElementById('templateInput');
      if (el && typeof applyOption === 'function') {
        applyOption(el, tmpl, heightmapTemplates[tmpl].name);
      }
    }

    // Zero out civilization — FMG generates geography only
    const sn = document.getElementById('statesNumber');
    if (sn) sn.value = 0;
    const mi = document.getElementById('manorsInput');
    const mo = document.getElementById('manorsOutput');
    if (mi) mi.value = 0;
    if (mo) mo.value = '0';
    const rn_ = document.getElementById('religionsNumber');
    if (rn_) rn_.value = 0;
    const pr = document.getElementById('provincesRatio');
    if (pr) pr.value = 0;
  };

  // ── Scale map canvas to fill the iframe viewport ────────────────────────
  // FMG defaults to 960×540. We resize to fill the iframe so the map
  // renders at the correct aspect ratio without empty margins.
  function scaleCanvasToViewport() {
    const w = window.innerWidth || 960;
    const h = window.innerHeight || 540;
    const mw = document.getElementById('mapWidthInput');
    const mh = document.getElementById('mapHeightInput');
    if (mw) mw.value = w;
    if (mh) mh.value = h;
  }
  // Apply before generation runs
  scaleCanvasToViewport();

  // ── Styles: hide ALL political/civilization layers ──────────────────────
  function injectEmbeddedStyles() {
    if (document.getElementById('sf-embedded-styles')) return;
    const style = document.createElement('style');
    style.id = 'sf-embedded-styles';
    style.textContent = `
      /* Hide ALL native FMG burgs — settlement icons are drawn by the
         React overlay (PlacementsLayer) using app-tier styling. */
      body.sf-embedded #burgIcons,
      body.sf-embedded #burgLabels,
      body.sf-embedded #anchors,
      body.sf-embedded #icons #burgIcons {
        display: none !important;
      }
      /* Hide all civilization layers — we only want geography */
      body.sf-embedded #routes { display: none !important; }
      body.sf-embedded #burgEmblems { display: none !important; }
      body.sf-embedded #fogging-cont { display: none !important; }
      body.sf-embedded #borders { display: none !important; }
      body.sf-embedded #statesHalo { display: none !important; }
      body.sf-embedded #labels { display: none !important; }
      body.sf-embedded #markers { display: none !important; }
      body.sf-embedded #zones { display: none !important; }
      body.sf-embedded #armies { display: none !important; }
      body.sf-embedded #emblems { display: none !important; }
      body.sf-embedded #rulers { display: none !important; }
      /* FMG UI chrome — hide everything except the SVG map */
      body.sf-embedded #optionsContainer { display: none !important; }
      body.sf-embedded #tooltip { display: none !important; }
      body.sf-embedded #loading { display: none !important; }
      /* Map cursor */
      body.sf-embedded #map { cursor: default; }
      /* Ensure the SVG fills the viewport */
      body.sf-embedded #map {
        position: absolute !important;
        top: 0; left: 0;
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }
  injectEmbeddedStyles();

  // ── DOM tagging for user-placed burgs ───────────────────────────────────
  function tagPlacedBurg(burgId) {
    if (burgId == null) return;
    window.__sfPlacedBurgIds.add(burgId);
    const circle = document.querySelector(`#burgIcons circle[data-id="${burgId}"]`);
    if (circle) circle.setAttribute('data-sf-placed', 'true');
    const label = document.querySelector(`#burgLabels text[data-id="${burgId}"]`);
    if (label) label.setAttribute('data-sf-placed', 'true');
    const anchor = document.querySelector(`#anchors use[data-id="${burgId}"]`);
    if (anchor) anchor.setAttribute('data-sf-placed', 'true');
  }

  function retagAllPlaced() {
    if (!window.__sfPlacedBurgIds?.size) return;
    for (const id of window.__sfPlacedBurgIds) tagPlacedBurg(id);
  }

  // Expose for other FMG code that runs synchronously during redraws.
  window.__sfRetagPlaced = retagAllPlaced;

  // Auto-retag on DOM mutation so we don't have to remember retagAllPlaced()
  // after every FMG operation that rebuilds burg nodes.
  let mutationObserver = null;
  let retagScheduled = false;
  function scheduleRetag() {
    if (retagScheduled) return;
    retagScheduled = true;
    queueMicrotask(() => {
      retagScheduled = false;
      retagAllPlaced();
    });
  }
  function installMutationObservers() {
    if (mutationObserver) return;
    const targets = ['burgIcons', 'burgLabels', 'anchors']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;
    mutationObserver = new MutationObserver(scheduleRetag);
    for (const t of targets) {
      mutationObserver.observe(t, { childList: true, subtree: true });
    }
  }

  // ── postMessage plumbing ────────────────────────────────────────────────
  // Target our own origin (the parent serves /map/ from the same host).
  // Falls back to '*' only when origin is unavailable (sandboxed iframes,
  // file:// schemes); never uses '*' as the default.
  function postToParent(msg) {
    try {
      window.parent.postMessage(msg, window.location.origin);
    } catch (e) {
      try { window.parent.postMessage(msg, '*'); } catch (_) { /* cross-origin */ }
    }
  }

  function reply(rid, payload) {
    if (!rid) return;
    postToParent({ ...payload, _rid: rid });
  }

  function replyError(rid, type, error) {
    if (!rid) return;
    postToParent({ type, _rid: rid, _error: String(error?.message || error || 'unknown error') });
  }

  // ── Burg helpers ────────────────────────────────────────────────────────
  function burgToMsg(b) {
    return {
      id: b.i,
      name: b.name,
      cell: b.cell,
      x: b.x,
      y: b.y,
      population: (b.population || 0) * 1000,
      state: b.state,
      culture: b.culture,
      type: b.type,
      capital: b.capital,
      port: b.port,
      citadel: b.citadel,
      plaza: b.plaza,
      walls: b.walls,
      shanty: b.shanty,
      temple: b.temple,
      group: b.group,
      placed: true,
    };
  }

  function buildBurgList() {
    if (!pack?.burgs) return [];
    const placedSet = window.__sfPlacedBurgIds;
    return pack.burgs
      .filter((b, i) => i > 0 && !b.removed)
      .filter((b) => placedSet && placedSet.has(b.i))
      .map(burgToMsg);
  }

  function notifyBurgList() {
    postToParent({ type: 'fmg:burgList', burgs: buildBurgList() });
  }

  // ── Coordinate transform ────────────────────────────────────────────────
  // Convert a point from iframe screen-space into FMG map coordinates.
  // Returns null if the CTM isn't available yet (SVG not laid out).
  function screenToMap(x, y) {
    const svgEl = document.getElementById('map');
    if (!svgEl) return null;
    const vb = document.getElementById('viewbox');
    if (!vb) return null;
    const ctm = vb.getCTM();
    if (!ctm) return null;
    const inverse = ctm.inverse?.();
    if (!inverse) return null;
    const pt = svgEl.createSVGPoint();
    pt.x = x; pt.y = y;
    const out = pt.matrixTransform(inverse);
    return { x: out.x, y: out.y };
  }
  // Expose for the top-level drop handler (addDragToUpload IIFE) which is
  // outside this bridge closure and otherwise can't see local helpers.
  window.__sfScreenToMap = screenToMap;

  // ── Viewport broadcasting ───────────────────────────────────────────────
  // Parse a transform attribute of the form "translate(tx, ty) scale(k)" or
  // "matrix(a b c d e f)". Returns { tx, ty, scale } or null.
  function parseTransformAttr(attr) {
    if (!attr || typeof attr !== 'string') return null;
    const mMatrix = /matrix\(([^)]+)\)/.exec(attr);
    if (mMatrix) {
      const parts = mMatrix[1].split(/[\s,]+/).map(Number);
      if (parts.length >= 6 && parts.every(n => Number.isFinite(n))) {
        // matrix(a b c d e f) — a/d are scale, e/f are translate (no skew in d3 zoom)
        return { tx: parts[4], ty: parts[5], scale: parts[0] };
      }
    }
    const mTrans = /translate\(\s*([-0-9.eE]+)[\s,]+([-0-9.eE]+)\s*\)/.exec(attr);
    const mScale = /scale\(\s*([-0-9.eE]+)/.exec(attr);
    const tx = mTrans ? parseFloat(mTrans[1]) : 0;
    const ty = mTrans ? parseFloat(mTrans[2]) : 0;
    const scale = mScale ? parseFloat(mScale[1]) : 1;
    if (!Number.isFinite(tx) || !Number.isFinite(ty) || !Number.isFinite(scale)) return null;
    return { tx, ty, scale };
  }

  function getCurrentViewport() {
    try {
      // Prefer the actual DOM transform on #viewbox — that's what FMG renders
      // with, and it's always in sync with what the user sees. d3.zoomTransform
      // is a fallback for early-load before the attribute is written.
      let tx = 0, ty = 0, scale = 1;
      const vbEl = document.getElementById('viewbox');
      const parsed = vbEl ? parseTransformAttr(vbEl.getAttribute('transform')) : null;
      if (parsed) {
        tx = parsed.tx; ty = parsed.ty; scale = parsed.scale || 1;
      } else {
        const svgSel = window.svg;
        const tf = (svgSel && window.d3?.zoomTransform) ? window.d3.zoomTransform(svgSel.node()) : null;
        scale = tf?.k || 1;
        tx = tf?.x || 0;
        ty = tf?.y || 0;
      }
      const w = window.graphWidth || 0;
      const h = window.graphHeight || 0;
      const cx = (w / 2 - tx) / (scale || 1);
      const cy = (h / 2 - ty) / (scale || 1);
      return { cx, cy, scale, width: w, height: h, tx, ty };
    } catch (e) {
      return { cx: 0, cy: 0, scale: 1, width: 0, height: 0, tx: 0, ty: 0 };
    }
  }

  function scheduleViewportBroadcast() {
    if (viewportRafPending) return;
    viewportRafPending = true;
    requestAnimationFrame(() => {
      viewportRafPending = false;
      const vp = getCurrentViewport();
      if (lastViewportTx
          && lastViewportTx.cx === vp.cx
          && lastViewportTx.cy === vp.cy
          && lastViewportTx.scale === vp.scale) return;
      lastViewportTx = vp;
      postToParent({ type: 'fmg:viewport', ...vp });
    });
  }

  // The React overlay mirrors FMG's pan/zoom by applying the same d3 zoom
  // transform to its <g>. If the d3 `.on('zoom.sfBridge')` handler ever
  // misses a tick (e.g. zoom behavior reinstalled after a regenerate, or
  // transform mutated directly via `zoomTransform(...)`), icons and chain
  // lines drift relative to the geography. A RAF poll is a cheap safety
  // net — it reads the current CTM on every frame and only broadcasts
  // when something actually changed, so it's free during idle.
  let viewportRafHandle = 0;
  function viewportRafTick() {
    viewportRafHandle = 0;
    const vp = getCurrentViewport();
    if (!lastViewportTx
        || lastViewportTx.cx !== vp.cx
        || lastViewportTx.cy !== vp.cy
        || lastViewportTx.scale !== vp.scale
        || lastViewportTx.width !== vp.width
        || lastViewportTx.height !== vp.height) {
      lastViewportTx = vp;
      postToParent({ type: 'fmg:viewport', ...vp });
    }
    viewportRafHandle = requestAnimationFrame(viewportRafTick);
  }
  function installViewportBroadcaster() {
    try {
      if (window.zoom && window.svg) {
        window.zoom.on('zoom.sfBridge', scheduleViewportBroadcast);
      }
    } catch (e) { /* best-effort */ }
    // Start the RAF poll once (idempotent).
    if (!viewportRafHandle) {
      viewportRafHandle = requestAnimationFrame(viewportRafTick);
    }
  }

  // ── Burg editor hook (burgSelected push event) ──────────────────────────
  const origBurgEditorOpen = window.editBurg;
  if (typeof origBurgEditorOpen === 'function') {
    window.editBurg = function(id) {
      const b = pack?.burgs?.[id];
      if (b) postToParent({ type: 'fmg:burgSelected', burg: burgToMsg(b) });
      return origBurgEditorOpen.apply(this, arguments);
    };
  }

  // ── Snapshot save/load ──────────────────────────────────────────────────
  function saveSnapshotText() {
    if (typeof prepareMapData !== 'function') throw new Error('prepareMapData unavailable');
    return prepareMapData();
  }

  async function loadSnapshotText(snapshotText) {
    if (typeof uploadMap !== 'function') throw new Error('uploadMap unavailable');
    if (!snapshotText) throw new Error('empty snapshot');
    const blob = new Blob([snapshotText], { type: 'text/plain' });
    // uploadMap is the raw loader; skips the confirmation prompt that
    // loadMapPrompt shows.
    await uploadMap(blob);
    // Rebuild placement set from any data-sf-placed tags the snapshot
    // serialized. Callers can follow up with restorePlacements if needed.
    window.__sfPlacedBurgIds.clear();
    retagFromDOM();
  }

  function retagFromDOM() {
    document.querySelectorAll('#burgIcons circle[data-sf-placed]')
      .forEach(el => {
        const id = Number(el.getAttribute('data-id'));
        if (!Number.isNaN(id)) window.__sfPlacedBurgIds.add(id);
      });
  }

  async function resetMapCmd(seed) {
    if (typeof regenerateMap !== 'function') throw new Error('regenerateMap unavailable');
    if (seed != null) {
      try { window.seed = String(seed); } catch (e) {}
    }
    window.__sfPlacedBurgIds.clear();
    await Promise.resolve(regenerateMap('SettlementForge resetMap'));
  }

  // ── Command handlers ────────────────────────────────────────────────────
  const handlers = {
    'settlementEngine:requestBurgList'(data, rid) {
      const burgs = buildBurgList();
      reply(rid, { type: 'fmg:burgListReply', burgs });
      notifyBurgList();
    },

    'settlementEngine:placeSettlement'(data, rid) {
      // The placement icon is rendered by the React overlay (PlacementsLayer);
      // FMG's job here is just to convert screen→map coordinates and (best-effort)
      // resolve the underlying cellId for downstream geography lookups. We do
      // NOT call addBurg/drawBurgIcons/drawBurgLabels — those produced tiny
      // native burg circles that conflicted with our React-side icons.
      const { x, y, settlementId, name, population } = data;
      if (typeof x !== 'number' || typeof y !== 'number') {
        return replyError(rid, 'fmg:settlementPlacedReply', 'invalid coordinates');
      }
      const mapPt = screenToMap(x, y);
      if (!mapPt) {
        return replyError(rid, 'fmg:settlementPlacedReply', 'coordTransformFailed');
      }
      try {
        // Synthetic burg id — opaque key for placements map. Decoupled from
        // FMG's pack.burgs (which we no longer touch for placements).
        const burgId = `sf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

        // Best-effort cell lookup for geography (terrain, biome, etc.).
        let cellId = null;
        try {
          if (typeof findCell === 'function') {
            cellId = findCell(mapPt.x, mapPt.y);
          } else if (pack?.cells?.q?.find) {
            cellId = pack.cells.q.find(mapPt.x, mapPt.y, Infinity);
          }
        } catch (_) { /* non-fatal */ }

        const result = {
          burgId,
          settlementId: settlementId || null,
          name: name || '',
          population: population || 0,
          x: mapPt.x,
          y: mapPt.y,
          cellId,
        };
        reply(rid, { type: 'fmg:settlementPlacedReply', ...result });
        postToParent({ type: 'fmg:settlementPlaced', ...result });
      } catch (err) {
        console.warn('[sfBridge] placeSettlement failed', err);
        replyError(rid, 'fmg:settlementPlacedReply', err);
      }
    },

    'settlementEngine:removePlacement'(data, rid) {
      // Placements are React-state-owned. FMG no longer needs to do anything.
      // The store's removePlacementLocal action handles the actual removal;
      // this handler exists for protocol symmetry and to clean up any legacy
      // numeric-id burg that may still exist from older snapshots.
      const { burgId } = data;
      try {
        if (typeof burgId === 'number' && pack?.burgs?.[burgId]) {
          pack.burgs[burgId].removed = true;
          if (typeof drawBurgIcons === 'function') drawBurgIcons();
          if (typeof drawBurgLabels === 'function') drawBurgLabels();
        }
        if (window.__sfPlacedBurgIds) window.__sfPlacedBurgIds.delete(burgId);
        reply(rid, { type: 'fmg:placementRemovedReply', burgId });
        postToParent({ type: 'fmg:placementRemoved', burgId });
      } catch (err) {
        replyError(rid, 'fmg:placementRemovedReply', err);
      }
    },

    'settlementEngine:clearAllPlacements'(data, rid) {
      // Same story: state cleared on the React side. Best-effort cleanup of
      // any legacy native burgs from older snapshots.
      try {
        if (pack?.burgs && window.__sfPlacedBurgIds) {
          for (const id of window.__sfPlacedBurgIds) {
            if (typeof id === 'number' && pack.burgs[id]) pack.burgs[id].removed = true;
          }
          if (typeof drawBurgIcons === 'function') drawBurgIcons();
          if (typeof drawBurgLabels === 'function') drawBurgLabels();
        }
        if (window.__sfPlacedBurgIds) window.__sfPlacedBurgIds.clear();
        reply(rid, { type: 'fmg:allPlacementsClearedReply' });
        postToParent({ type: 'fmg:allPlacementsCleared' });
      } catch (err) {
        replyError(rid, 'fmg:allPlacementsClearedReply', err);
      }
    },

    'settlementEngine:restorePlacements'(data, rid) {
      // No-op on the FMG side now that placements are React-rendered. The
      // store hydrates `mapState.placements` from the campaign snapshot
      // independently; this handler stays for protocol compatibility.
      const { placements } = data;
      if (!Array.isArray(placements)) {
        return replyError(rid, 'fmg:placementsRestoredReply', 'placements array required');
      }
      const restored = placements
        .filter(p => typeof p.x === 'number' && typeof p.y === 'number')
        .map(p => ({
          burgId: p.burgId || `sf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
          settlementId: p.settlementId || null,
          name: p.name || '',
          x: p.x,
          y: p.y,
          cellId: p.cellId ?? null,
        }));
      reply(rid, { type: 'fmg:placementsRestoredReply', restored });
      postToParent({ type: 'fmg:placementsRestored', restored });
    },

    // ── Road network (A* over pack.cells, land + sea) ─────────────────────
    // Input:  { edges: [{id, fromX, fromY, toX, toY, preferSea}] }
    // Output: { paths: { [id]: { points: [{x,y},...], mode: 'land'|'sea' } } }
    //
    // Cost function is biome- and elevation-aware:
    //   - ocean cells (h < 20): impassable in land mode, cheap in sea mode
    //   - mountains (h > 60): expensive
    //   - forests/taiga/rainforest: moderately expensive
    //   - plains/grassland/savanna: cheap
    //   - rivers add a small crossing penalty
    // Edges are routed independently; each path is a polyline of cell centers
    // in FMG map coordinates. Overlay <g> applies the same transform FMG uses,
    // so these render aligned with the geography.
    'settlementEngine:computeRoadNetwork'(data, rid) {
      try {
        const { edges } = data || {};
        if (!Array.isArray(edges) || !edges.length || !pack?.cells?.c) {
          return reply(rid, { type: 'fmg:roadNetworkReply', paths: {} });
        }

        const cells = pack.cells;
        const H = cells.h || [];
        const B = cells.biome || [];
        const R = cells.r || [];
        const P = cells.p || [];
        const C = cells.c || [];

        const isLand   = (i) => (H[i] || 0) >= 20;
        const isOcean  = (i) => (H[i] || 0) <  20;

        // Biome costs keyed by FMG biome id. Missing biomes fall back to 2.
        // (FMG biome ids: 0 marine, 1 hot desert, 2 cold desert, 3 savanna,
        //  4 grassland, 5 tropical seasonal, 6 temperate deciduous,
        //  7 tropical rainforest, 8 temperate rainforest, 9 taiga,
        //  10 tundra, 11 glacier, 12 wetland)
        const BIOME_COST = [
          99,    // marine (won't be hit in land mode; guarded by isLand)
          1.8,   // hot desert
          1.6,   // cold desert
          1.0,   // savanna
          0.9,   // grassland
          1.6,   // tropical seasonal forest
          1.9,   // temperate deciduous forest
          2.6,   // tropical rainforest
          2.2,   // temperate rainforest
          2.2,   // taiga
          1.5,   // tundra
          4.0,   // glacier
          1.9,   // wetland
        ];

        const landCost = (cell) => {
          if (!isLand(cell)) return Infinity;
          const h = H[cell] || 0;
          const b = B[cell] ?? 4;
          const base = BIOME_COST[b] ?? 2.0;
          // Mountain penalty kicks in steeply above h=60 (FMG uses 0..100).
          const elevMult = h > 60 ? 1 + (h - 60) / 15 : 1;
          const riverBias = R[cell] ? 0.3 : 0;
          return base * elevMult + riverBias;
        };

        const seaCost = (cell) => {
          if (!isOcean(cell)) return Infinity;
          // Shallow/coastal ocean (h 10–20) is slightly more expensive than
          // deep water — hugs the coast for short hops, opens up for long ones.
          const h = H[cell] || 0;
          return h >= 15 ? 1.2 : 0.9;
        };

        // Pack has `findCell(x, y)` as a global. Fall back to a linear scan
        // only if it's not available — linear scan is O(n) which is fine for
        // the handful of endpoints we need per request.
        const findCellAt = (x, y) => {
          try {
            if (typeof findCell === 'function') {
              const c = findCell(x, y);
              if (c != null && c >= 0) return c;
            }
          } catch (_) {}
          let best = -1, bd = Infinity;
          const n = cells.i?.length || P.length;
          for (let i = 0; i < n; i++) {
            const p = P[i];
            if (!p) continue;
            const d = (p[0] - x) ** 2 + (p[1] - y) ** 2;
            if (d < bd) { bd = d; best = i; }
          }
          return best;
        };

        // A* over the pack-cell adjacency graph.
        // cells.c[i] is the neighbour index list for cell i.
        const MAX_ITER = 25000;
        const aStar = (startCell, goalCell, costFn) => {
          if (startCell == null || goalCell == null) return null;
          if (startCell < 0 || goalCell < 0) return null;
          if (startCell === goalCell) return [{ x: P[startCell][0], y: P[startCell][1] }];

          const goalP = P[goalCell];
          const heuristic = (c) => {
            const p = P[c];
            if (!p) return Infinity;
            return Math.hypot(p[0] - goalP[0], p[1] - goalP[1]);
          };

          const gScore = new Map();
          const came   = new Map();
          gScore.set(startCell, 0);

          // Simple open list as sorted array — fine for paths up to a few
          // thousand cells. Replace with a binary heap if this becomes hot.
          const open = [{ c: startCell, f: heuristic(startCell) }];
          const inOpen = new Set([startCell]);

          let iter = 0;
          while (open.length && iter++ < MAX_ITER) {
            // Pop lowest-f (linear scan is faster than re-sorting on push)
            let bestIdx = 0;
            for (let i = 1; i < open.length; i++) {
              if (open[i].f < open[bestIdx].f) bestIdx = i;
            }
            const { c: current } = open.splice(bestIdx, 1)[0];
            inOpen.delete(current);

            if (current === goalCell) {
              const path = [];
              let cur = current;
              path.push({ x: P[cur][0], y: P[cur][1] });
              while (came.has(cur)) {
                cur = came.get(cur);
                path.unshift({ x: P[cur][0], y: P[cur][1] });
              }
              return path;
            }

            const neighbours = C[current] || [];
            const curP = P[current];
            const gCur = gScore.get(current) ?? Infinity;

            for (let k = 0; k < neighbours.length; k++) {
              const n = neighbours[k];
              const nc = costFn(n);
              if (!isFinite(nc)) continue;
              const nP = P[n];
              if (!nP) continue;
              const edgeDist = Math.hypot(nP[0] - curP[0], nP[1] - curP[1]);
              const tentativeG = gCur + nc * edgeDist;
              if (tentativeG < (gScore.get(n) ?? Infinity)) {
                came.set(n, current);
                gScore.set(n, tentativeG);
                const f = tentativeG + heuristic(n);
                if (!inOpen.has(n)) {
                  open.push({ c: n, f });
                  inOpen.add(n);
                }
              }
            }
          }
          return null;
        };

        // Find the nearest ocean cell to a coastal land cell (BFS outward).
        const findNearestOcean = (cell) => {
          if (isOcean(cell)) return cell;
          const q = [cell];
          const seen = new Set([cell]);
          let guard = 0;
          while (q.length && guard++ < 400) {
            const cur = q.shift();
            for (const n of (C[cur] || [])) {
              if (seen.has(n)) continue;
              seen.add(n);
              if (isOcean(n)) return n;
              q.push(n);
            }
          }
          return null;
        };

        const isCoastal = (cell) => {
          if (!isLand(cell)) return false;
          const nb = C[cell] || [];
          for (const n of nb) { if (isOcean(n)) return true; }
          return false;
        };

        const paths = {};
        for (const e of edges) {
          const startC = findCellAt(e.fromX, e.fromY);
          const goalC  = findCellAt(e.toX,   e.toY);
          if (startC < 0 || goalC < 0) continue;

          let landPath = null;
          if (isLand(startC) && isLand(goalC)) {
            landPath = aStar(startC, goalC, landCost);
          }

          let seaPath = null;
          const canSea = (e.preferSea || !landPath) && isCoastal(startC) && isCoastal(goalC);
          if (canSea) {
            const seaStart = findNearestOcean(startC);
            const seaGoal  = findNearestOcean(goalC);
            if (seaStart != null && seaGoal != null) {
              const mid = aStar(seaStart, seaGoal, seaCost);
              if (mid && mid.length >= 2) {
                seaPath = [
                  { x: P[startC][0], y: P[startC][1] },
                  ...mid,
                  { x: P[goalC][0], y: P[goalC][1] },
                ];
              }
            }
          }

          // Pick the cheaper-ish option. We don't have true costs here, so use
          // polyline length as a proxy. Sea only wins if clearly shorter, since
          // land paths are usually preferred for adjacent settlements.
          const plen = (pts) => {
            if (!pts) return Infinity;
            let t = 0;
            for (let i = 1; i < pts.length; i++) {
              t += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
            }
            return t;
          };

          let chosen = null, mode = 'land';
          if (landPath && seaPath) {
            chosen = plen(seaPath) * 1.15 < plen(landPath) ? seaPath : landPath;
            mode = chosen === seaPath ? 'sea' : 'land';
          } else if (landPath) {
            chosen = landPath; mode = 'land';
          } else if (seaPath) {
            chosen = seaPath; mode = 'sea';
          }

          if (chosen && chosen.length >= 2) {
            paths[e.id] = { points: chosen, mode };
          }
        }

        reply(rid, { type: 'fmg:roadNetworkReply', paths });
      } catch (err) {
        console.warn('[sfBridge] computeRoadNetwork failed', err);
        replyError(rid, 'fmg:roadNetworkReply', err);
      }
    },

    'settlementEngine:getViewport'(data, rid) {
      reply(rid, { type: 'fmg:viewportReply', ...getCurrentViewport() });
    },

    'settlementEngine:setViewport'(data, rid) {
      const { cx, cy, scale, duration = 600 } = data;
      try {
        if (typeof window.zoomTo === 'function' && cx != null && cy != null) {
          window.zoomTo(cx, cy, scale || 3, duration);
        } else if (window.zoom && window.svg && window.d3) {
          const w = window.graphWidth || 0;
          const h = window.graphHeight || 0;
          const s = scale || 1;
          const tx = w / 2 - cx * s;
          const ty = h / 2 - cy * s;
          window.svg.transition().duration(duration)
            .call(window.zoom.transform, window.d3.zoomIdentity.translate(tx, ty).scale(s));
        }
        // The zoom event will fire and broadcast a new viewport; also reply
        // synchronously with the pre-transition state for the caller.
        reply(rid, { type: 'fmg:viewportReply', ...getCurrentViewport() });
      } catch (err) {
        replyError(rid, 'fmg:viewportReply', err);
      }
    },

    'settlementEngine:fitMap'(data, rid) {
      try {
        if (window.zoom && window.svg && window.d3) {
          window.svg.transition().duration(600)
            .call(window.zoom.transform, window.d3.zoomIdentity);
        }
        reply(rid, { type: 'fmg:viewportReply', ...getCurrentViewport() });
      } catch (err) {
        replyError(rid, 'fmg:viewportReply', err);
      }
    },

    'settlementEngine:saveSnapshot'(data, rid) {
      try {
        const snapshot = saveSnapshotText();
        reply(rid, { type: 'fmg:snapshotReply', snapshot });
      } catch (err) {
        replyError(rid, 'fmg:snapshotReply', err);
      }
    },

    // Rasterize the rendered FMG terrain to a small JPEG data URL so the maps
    // gallery tile can show the map image (generated-terrain shares have no
    // customBackdrop, so no thumb otherwise). Reuses FMG's own getMapURL export
    // (self-contained SVG blob: inlined fonts/styles, same-origin → no canvas
    // taint), then downscales via canvas like FMG's PNG path. Best-effort: any
    // failure replies with an error and the share falls back to the placeholder.
    async 'settlementEngine:exportThumb'(data, rid) {
      try {
        const maxW = Number(data?.maxW) || 480;
        const url = await getMapURL('png', { fullMap: true, noScaleBar: true });
        const img = new Image();
        img.onload = () => {
          try {
            const ratio = img.height / img.width;
            const w = Math.min(maxW, img.width);
            const h = Math.round(w * ratio);
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            const dataUrl = c.toDataURL('image/jpeg', 0.82);
            reply(rid, { type: 'fmg:exportThumbReply', dataUrl, w, h });
          } catch (err) {
            replyError(rid, 'fmg:exportThumbReply', err);
          }
        };
        img.onerror = () => replyError(rid, 'fmg:exportThumbReply', 'rasterize failed');
        img.src = url;
      } catch (err) {
        replyError(rid, 'fmg:exportThumbReply', err);
      }
    },

    async 'settlementEngine:loadSnapshot'(data, rid) {
      try {
        await loadSnapshotText(data.snapshot);
        // Let FMG settle, then reinstall observers (SVG nodes got replaced)
        setTimeout(() => {
          installMutationObservers();
          installViewportBroadcaster();
          scheduleViewportBroadcast();
          reply(rid, { type: 'fmg:snapshotLoadedReply' });
          postToParent({ type: 'fmg:snapshotLoaded' });
          notifyBurgList();
        }, 300);
      } catch (err) {
        replyError(rid, 'fmg:snapshotLoadedReply', err);
      }
    },

    async 'settlementEngine:resetMap'(data, rid) {
      try {
        await resetMapCmd(data.seed);
        setTimeout(() => {
          installMutationObservers();
          installViewportBroadcaster();
          scheduleViewportBroadcast();
          reply(rid, { type: 'fmg:mapResetReply', seed: pack?.seed || null });
          postToParent({ type: 'fmg:mapReset', seed: pack?.seed || null });
          notifyBurgList();
        }, 500);
      } catch (err) {
        replyError(rid, 'fmg:mapResetReply', err);
      }
    },

    'settlementEngine:activateTool'(data, rid) {
      const { tool } = data;
      // FMG's internal editor functions assume the user clicked a DOM button and
      // often call `event.target.getAttribute(...)` or reach into state that
      // may not be initialized. Wrap each attempt individually so one tool's
      // internal null-ref doesn't look like a bridge failure.
      const tryCall = (fn, label) => {
        if (typeof fn !== 'function') return false;
        try { fn(); return true; }
        catch (err) {
          console.warn(`[sfBridge] activateTool(${label}) threw:`, err && err.message || err);
          return false;
        }
      };
      try {
        let activated = false;
        switch (tool) {
          case 'heightmap':
            activated = tryCall(window.editHeightmap, 'editHeightmap')
                     || tryCall(() => window.openEditor && window.openEditor('heightmap'), 'openEditor(heightmap)');
            break;
          case 'rivers':
            activated = tryCall(window.editRiver, 'editRiver')
                     || tryCall(window.toggleRivers, 'toggleRivers');
            break;
          case 'coastline':
            activated = tryCall(window.editCoastline, 'editCoastline');
            break;
          case 'lakes':
            activated = tryCall(window.editLake, 'editLake');
            break;
          case 'biomes':
            activated = tryCall(window.editBiomes, 'editBiomes')
                     || tryCall(() => window.openEditor && window.openEditor('biomes'), 'openEditor(biomes)');
            break;
          default:
            return replyError(rid, 'fmg:toolActivatedReply', `unknown tool: ${tool}`);
        }
        reply(rid, { type: 'fmg:toolActivatedReply', tool, activated });
        if (activated) postToParent({ type: 'fmg:terrainChanged', tool });
      } catch (err) {
        replyError(rid, 'fmg:toolActivatedReply', err);
      }
    },

    'settlementEngine:deactivateTool'(data, rid) {
      try {
        // Best-effort: close any open jQuery UI dialog (FMG editors use these).
        try {
          const dialogs = document.querySelectorAll('.ui-dialog-content');
          dialogs.forEach(d => {
            try { if (window.$ && window.$(d).dialog) window.$(d).dialog('close'); } catch (e) {}
          });
        } catch (e) {}
        reply(rid, { type: 'fmg:toolDeactivatedReply' });
      } catch (err) {
        replyError(rid, 'fmg:toolDeactivatedReply', err);
      }
    },

    'settlementEngine:terrainUndo'(data, rid) {
      try {
        if (window.HeightmapEditor?.undo) window.HeightmapEditor.undo();
        reply(rid, { type: 'fmg:terrainUndoReply' });
      } catch (err) {
        replyError(rid, 'fmg:terrainUndoReply', err);
      }
    },

    'settlementEngine:terrainRedo'(data, rid) {
      try {
        if (window.HeightmapEditor?.redo) window.HeightmapEditor.redo();
        reply(rid, { type: 'fmg:terrainRedoReply' });
      } catch (err) {
        replyError(rid, 'fmg:terrainRedoReply', err);
      }
    },

    'settlementEngine:setEmbeddedMode'(data, rid) {
      try {
        if (data.enabled) document.body.classList.add('sf-embedded');
        else document.body.classList.remove('sf-embedded');
        reply(rid, { type: 'fmg:embeddedModeReply', enabled: !!data.enabled });
      } catch (err) {
        replyError(rid, 'fmg:embeddedModeReply', err);
      }
    },

    // Show/hide a native FMG layer (states, cultures, biomes, etc.) by
    // toggling the corresponding SVG <g> element's display. We avoid calling
    // FMG's toggle* helpers in general because many run drawing side effects
    // we don't want — but biomes is a special case: its <g> is *empty* until
    // drawBiomes() populates it, so the first show-request needs to invoke
    // the draw call once. After that, plain display flipping is enough.
    'settlementEngine:setFmgLayer'(data, rid) {
      try {
        const { layer, visible } = data || {};
        // Map our layer keys to the actual FMG DOM layer ids.
        const LAYER_MAP = {
          stateBorders:   ['stateBorders', 'regions'],
          cultures:       ['cults', 'cultures'],
          biomes:         ['biomes'],
          routes:         ['routes'],
          rivers:         ['rivers'],
        };
        const ids = LAYER_MAP[layer];
        if (!ids) {
          return replyError(rid, 'fmg:setFmgLayerReply',
            `unknown layer: ${layer}. Valid: ${Object.keys(LAYER_MAP).join(', ')}`);
        }

        // Lazy-populate biomes on first show so the layer actually has
        // something to display when we flip the style.
        if (layer === 'biomes' && visible) {
          const g = document.getElementById('biomes');
          const empty = !g || g.querySelector('path') == null;
          if (empty && typeof window.drawBiomes === 'function') {
            try { window.drawBiomes(); } catch (e) { console.warn('[bridge] drawBiomes failed', e); }
          }
        }

        const applied = [];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          el.style.display = visible ? 'inline' : 'none';
          applied.push(id);
        }
        reply(rid, { type: 'fmg:setFmgLayerReply', layer, visible: !!visible, applied });
      } catch (err) {
        replyError(rid, 'fmg:setFmgLayerReply', err);
      }
    },

    // Set the heightmap template for the NEXT regeneration.
    // templateId must be a key from SF_TEMPLATES (e.g. 'highIsland', 'sfArchipelago').
    'settlementEngine:setTemplate'(data, rid) {
      const { templateId } = data;
      if (!SF_TEMPLATES[templateId]) {
        return replyError(rid, 'fmg:setTemplateReply',
          `unknown template: ${templateId}. Valid: ${Object.keys(SF_TEMPLATES).join(', ')}`);
      }
      window.__sfRequestedTemplate = templateId;
      reply(rid, { type: 'fmg:setTemplateReply', templateId });
    },

    // Get available templates
    'settlementEngine:getTemplates'(data, rid) {
      reply(rid, {
        type: 'fmg:getTemplatesReply',
        templates: Object.entries(SF_TEMPLATES).map(([id, t]) => ({ id, label: t.label })),
        current: window.__sfRequestedTemplate || null,
      });
    },
  };

  // ── Message listener ────────────────────────────────────────────────────
  window.addEventListener('message', async (event) => {
    // Origin check: this bridge is served from our own origin (/map/index.html)
    // and embedded by the parent app. Any command claiming another origin is a
    // third-party trying to drive the bridge. Drop it.
    if (event.origin !== window.location.origin) return;

    // Source check: the bridge only ever takes commands from its embedder.
    // Reject anything not posted by window.parent (sibling iframes, popups,
    // a stray window holding a ref). Mirrors the parent-side check in
    // src/lib/mapBridge.js.
    if (event.source !== window.parent) return;

    const data = event?.data;
    if (!data || typeof data !== 'object') return;
    const { type, _rid } = data;
    if (typeof type !== 'string' || !type.startsWith('settlementEngine:')) return;

    const handler = handlers[type];
    if (!handler) return;  // unknown command — silent

    try {
      await handler(data, _rid);
    } catch (err) {
      console.warn('[sfBridge] handler threw', type, err);
      const replyType = type.replace(/^settlementEngine:/, 'fmg:') + 'Reply';
      replyError(_rid, replyType, err);
    }
  });

  // ── Ready sequence ──────────────────────────────────────────────────────
  function notifyReady() {
    if (readyNotified) return;
    readyNotified = true;
    const seed = pack?.seed || null;
    postToParent({
      type: 'fmg:ready',
      seed,
      width: window.graphWidth || 0,
      height: window.graphHeight || 0,
      templates: Object.entries(SF_TEMPLATES).map(([id, t]) => ({ id, label: t.label })),
    });
    notifyBurgList();

    // Install post-ready hooks
    installMutationObservers();
    installViewportBroadcaster();
    scheduleViewportBroadcast();

    // Fit the map to show the full landmass (no state-based zoom — we have
    // no states in embedded mode). Uses FMG's built-in fitMapToScreen.
    try {
      if (typeof fitMapToScreen === 'function') fitMapToScreen();
    } catch (e) { /* best-effort */ }
  }

  // Ready poll: check for pack.cells (geography is done) instead of
  // pack.burgs (which may be empty when manors=0).
  const readyPoll = setInterval(() => {
    const hasCells = pack?.cells?.i?.length > 0;
    const hasBurgs = pack?.burgs?.length > 0;
    if (hasCells || hasBurgs) {
      clearInterval(readyPoll);
      notifyReady();
    }
  }, 500);

  // Re-notify on map regeneration
  const origGenerate = window.regenerateMap;
  if (typeof origGenerate === 'function') {
    window.regenerateMap = function() {
      readyNotified = false;
      // Re-scale canvas to current viewport before regenerating
      scaleCanvasToViewport();
      const result = origGenerate.apply(this, arguments);
      setTimeout(() => notifyReady(), 2000);
      return result;
    };
  }
})();
