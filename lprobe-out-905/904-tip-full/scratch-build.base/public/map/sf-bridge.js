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
//   settlementEngine:exportThumb         { size }
//   settlementEngine:getViewport
//   settlementEngine:setViewport         { cx, cy, scale, duration }
//   settlementEngine:fitMap
//   settlementEngine:saveSnapshot
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

  // sf-origin.js loads immediately before this bridge and owns the one allowed
  // parent origin. Deployed hosts have no same-origin fallback: if the explicit
  // parentOrigin handshake is absent or malformed, install no command surface
  // and emit no map/campaign data.
  const originContract = window.__sfBridgeOrigin;
  const parentOrigin = originContract?.parentOrigin || null;
  const postToParent = originContract?.postToParent;
  if (!parentOrigin || typeof postToParent !== 'function') return;

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
  // postToParent closes over the exact origin resolved by sf-origin.js. It
  // never recomputes from this child window and never falls back to '*'.

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

  // ── Map seed accessor (H10) ─────────────────────────────────────────────
  // FMG's real map seed is the top-level global `seed` (main.js: `var seed`, set
  // from the URL seed / generateSeed() / a precreated seed, and serialized by
  // save.js). The bridge previously reported `pack.seed`, which FMG NEVER assigns
  // — so every fmg:ready / fmg:mapReset carried seed:null. Read the real global.
  // It's a `var` (a genuine window property), but we reach it as a GUARDED BARE
  // IDENTIFIER — the one convention this file uses for FMG's script-scoped globals
  // (svg/zoom) — so an upstream rename degrades to null, not a ReferenceError.
  function currentSeed() {
    try {
      if (typeof seed !== 'undefined' && seed != null && seed !== '') return String(seed);
    } catch (_) { /* global not bound yet */ }
    return null;
  }

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
        // PHANTOM-GLOBAL FIX: `svg` is a top-level `let` in main.js (main.js:23),
        // a script-scoped lexical global — NEVER window.svg. window.svg was always
        // undefined, so this d3.zoomTransform fallback never ran. Reach it as a
        // guarded bare identifier. (d3 is a real UMD window global — left as-is.)
        const svgSel = (typeof svg !== 'undefined') ? svg : null;
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
      // PHANTOM-GLOBAL FIX (behavior activation): `zoom` (const, main.js:225) and
      // `svg` (let, main.js:23) are script-scoped lexical globals, NEVER window
      // properties. The old `window.zoom && window.svg` guard was `undefined &&
      // undefined` — always false — so this d3 zoom hook NEVER attached and the
      // React overlay's pan/zoom mirroring rode on the RAF poll alone. Reaching
      // the bindings as guarded bare identifiers LIGHTS the zoom-driven broadcast:
      // fmg:viewport now fires synchronously on the d3 zoom event, not only on the
      // next animation frame.
      if (typeof zoom !== 'undefined' && zoom && typeof svg !== 'undefined' && svg) {
        zoom.on('zoom.sfBridge', scheduleViewportBroadcast);
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
    window.__sfPlacedBurgIds.clear();
    // FMG's generate(options) destructures `options.seed` (a STRING) and routes
    // it through setSeed → aleaPRNG (public/map/main.js). The old call passed a
    // bare STRING ('SettlementForge resetMap'), which destructured to
    // seed:undefined — so the documented {seed} was silently ignored and every
    // reset produced a fresh random map. Pass a real options object with the
    // seed so it actually applies; omit it (undefined) to keep randomizing.
    const options = seed != null ? { seed: String(seed) } : undefined;
    await Promise.resolve(regenerateMap(options));
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
    //
    // ── WEAVE NET-1 · what the roads learned ───────────────────────────────
    // Four changes, all inside the cost function and the sea exit. None of them
    // touches which PAIRS get a road (that is `computeRoadEdges`, parent-side);
    // they change the LINE each road takes.
    //
    //   1. CORRIDOR RE-USE (×0.5). Every hop a previously routed road already
    //      took is half price for the roads that follow, so traffic bundles into
    //      trunk corridors instead of every pair carving its own private track
    //      across the same hills. This is the one piece of state that spans edges
    //      in a request: `usedCellPairs`, threaded through the edge order the
    //      parent sends (which is itself deterministic — see roadNetwork.js), so
    //      the whole batch is a pure function of (pack, edge list, order).
    //      ⚠ It is a BATCH property: routing the same edge alone and routing it
    //      after its neighbours can legitimately differ. RoadsLayer always sends
    //      the whole set in one call, which is what makes this well-defined.
    //   2. OFF-BURG MULTIPLIER (×3). A cell with no burg on it costs three times
    //      a cell that has one, so a road between two distant towns strings
    //      through the small places on the way rather than ignoring them. This
    //      raises the land cost SCALE threefold, which is why the heuristic gains
    //      a scale of its own below — an unscaled straight-line heuristic against
    //      tripled edge costs degenerates A* toward Dijkstra and starts hitting
    //      MAX_ITER on long routes.
    //   3. HAVEN EXIT. FMG already stores, for every coastal land cell, the water
    //      cell it fronts (`cells.haven`, minted in markupPack). Sea routes now
    //      leave through it instead of breadth-first searching for "some ocean
    //      cell near here", which is both exact and O(1). The BFS remains as the
    //      fallback for a pack with no haven array.
    //   4. COAST-GRADED SEA COST. `cells.t` is FMG's distance field: LAND_COAST 1,
    //      WATER_COAST -1, and progressively more negative out to its -10 markup
    //      limit. Sea cost now grades on that depth, so lanes hug the coast the
    //      way real shipping does, instead of the old rule which made SHALLOW
    //      water dearer than deep and pushed lanes out to sea.
    //
    // ── E-NET-1..3 · what NET-1 deferred, collected ────────────────────────
    // Three more, and only the last of them touches which pairs get a road (it
    // does not — it changes which of them can be a SEA road):
    //
    //   5. TRUE-COST MODE SELECTION (E-NET-1). The land-vs-sea verdict compared
    //      polyline LENGTHS and threw away every terrain term the cost function
    //      had just computed. It now re-scores both candidates in one declared
    //      difficulty unit, and the bare `1.15` land preference is the named
    //      constant SEA_ROUTE_BIAS. DECLARED SHIFT: a pair whose land route is
    //      short but hard, or long but easy, can change mode across this date.
    //   6. LAKES ARE NOT THE SEA (E-NET-2). "Water" was `h < 20`, which is every
    //      lake as well as the ocean, so a lakeside pair could be given a sea
    //      lane and a boat could put out from a village on a pond. `cells.f` +
    //      `pack.features` name each water body; only an `ocean` feature is the
    //      sea now. DECLARED SHIFT on any pack that has lakes.
    //   7. THE ITERATION GUARD REPORTS (E-NET-3). MAX_ITER exhaustion returned
    //      null and the road silently vanished off the map with nothing said.
    //      Exhaustions are now counted, named, and carried back in the reply.
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
        // NET-1 reads. Each is optional: a pack without it degrades to the
        // pre-NET-1 rule for that one feature rather than failing the request.
        const T     = cells.t || [];       // distance field (see 4 above)
        const HAVEN = cells.haven || [];   // coastal land cell -> the water it fronts
        const BURG  = cells.burg || [];    // burg id at the cell, 0 = none
        // E-NET-2 read: `cells.f` is the FEATURE (connected body) each cell belongs
        // to, and `pack.features[f].type` names it — 'ocean', 'lake' or 'island'.
        const F        = cells.f || [];
        const FEATURES = Array.isArray(pack.features) ? pack.features : [];

        // ── E-NET-2 · A LAKE IS NOT THE SEA ────────────────────────────────
        // "Water" here was `h < 20`, and h < 20 is EVERY body of water FMG holds:
        // the ocean, an inland sea, and the pond behind the mill. So a pair of
        // settlements on opposite shores of a lake could be handed a sea lane, a
        // village on a tarn counted as coastal and got a harbour, and the haven
        // exit put a boat out onto standing water it could never leave. Nothing
        // reddened, because every one of those answers is internally consistent.
        //
        // FMG already knows the difference and has since reGraph: every cell
        // carries `f`, the id of the connected body it belongs to, and
        // `pack.features[f].type` is 'ocean' for water that reaches the map frame
        // and 'lake' for water that does not. The router reads it and the sea
        // becomes the sea.
        //
        // ⚠ THE CHARTER SAID THIS FIELD WAS "ALREADY CAPTURED". IT IS NOT — and
        // the distinction matters to the next reader. `getSpatialPack` below copies
        // {h, biome, r, p, c, fl, g} and a grid climate pair, and no more; `f` has
        // never crossed the bridge, so the FROZEN CANON still cannot tell a lake
        // from the ocean and `seaLanes.js` still runs on the height rule. This car
        // cures the RENDER tier, which reads the live pack and needs no capture.
        // Curing the canon means widening the capture and bumping SEA_LANE_VERSION
        // — a discrete re-canonize event, not a router change.
        //
        // DEGRADATION, on the NET-1 rule: a pack with no `f` or no `features` (a
        // synthetic fixture, a hand-edited or pre-markup pack) keeps the height
        // rule exactly, so nothing that cannot answer the question is made to.
        // Inside the feature branch the read FAILS CLOSED — a water cell whose
        // body is unnamed is not the sea, because an unnamed body is not evidence
        // of an ocean.
        const waterBodiesKnown = F.length > 0 && FEATURES.length > 1;
        const seaBodies = new Set();
        if (waterBodiesKnown) {
          for (let k = 0; k < FEATURES.length; k++) {
            const feat = FEATURES[k];
            if (feat && feat.type === 'ocean') seaBodies.add(k);
          }
        }

        const isLand   = (i) => (H[i] || 0) >= 20;
        const isOcean  = (i) => (H[i] || 0) < 20
          && (!waterBodiesKnown || seaBodies.has(F[i]));

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

        // ── NET-1 tuning constants, named so the coupling below is legible ──
        const OFF_BURG_MULT   = 3;     // a cell with no burg costs three times one that has
        const CORRIDOR_REUSE  = 0.5;   // a hop an earlier road already took is half price
        const SEA_BASE        = 0.9;   // cost of hugging the coastline (|t| === 1)
        const SEA_DEPTH_STEP  = 0.12;  // added per band away from the shore
        const SEA_DEPTH_CAP   = 10;    // FMG's own water markup limit
        // ⚠ THE HEURISTIC SCALE IS LOAD-BEARING, AND GETTING IT WRONG SILENTLY
        // DELETES THE TWO FEATURES ABOVE. A* only considers a route the heuristic
        // does not already price out of reach, so an h that over-estimates the
        // CHEAPEST possible step never explores the cheap steps: a first build of
        // this handler scaled h by 0.9 × OFF_BURG_MULT and MEASURED corridor
        // re-use and the burg discount as having ZERO effect on every fixture —
        // both features present in the cost function, neither ever reached.
        // So both scales are the true cost FLOOR of their mode, which makes the
        // heuristic admissible and the returned road a genuine minimum-cost route.
        // Measured cost of admissibility on a 15,000-cell pack with 20 long
        // crossings: none — the search demand is the same at every scale from
        // 0.45 to 2.7 (it is bounded by the graph, not by h, on uniform terrain).
        // Derived from the constants rather than written out, so a later tuning
        // edit cannot silently make h inadmissible again. OFF_BURG_MULT is absent
        // from both products on purpose: it only ever RAISES a cost (a burg cell
        // pays ×1), so the cheapest land step is the cheapest biome on a burg cell
        // over a re-used hop, and the cheapest sea step is the shoreline over one.
        const MIN_BIOME_COST = Math.min(...BIOME_COST);   // grassland, 0.9
        const LAND_H_SCALE = MIN_BIOME_COST * CORRIDOR_REUSE;
        const SEA_H_SCALE  = SEA_BASE * CORRIDOR_REUSE;

        // ── E-NET-1 · THE LAND PREFERENCE, NAMED ───────────────────────────
        // How much cheaper a sea crossing must be before a road becomes a lane.
        // It was a bare `1.15` sitting in the mode comparison at the bottom of
        // this handler with no name and no stated meaning. It is a real modelling
        // claim and it now says so: the water route is charged a 15 % surcharge
        // because the cost model prices the CROSSING and not the voyage — no
        // harbour dues, no hull, no crew, no waiting on a wind — so a sea route
        // that merely ties on terrain is not actually the cheaper way to travel.
        // Land is the default; the sea has to win by a margin.
        const SEA_ROUTE_BIAS = 1.15;

        // Every (cell, cell) hop a road has already taken this request. Written
        // only from the path actually CHOSEN for an edge, never from a candidate
        // that lost the land-vs-sea comparison.
        const usedCellPairs = new Set();
        const hopKey = (a, b) => (a < b ? a + ':' + b : b + ':' + a);
        const reuse = (from, cell) =>
          (from != null && usedCellPairs.has(hopKey(from, cell)) ? CORRIDOR_REUSE : 1);

        // ── E-NET-1 · TRAVEL DIFFICULTY, IN ONE DECLARED UNIT ──────────────
        // ⛔ THE UNIT IS THE WHOLE POINT. `landDifficulty` and `seaDifficulty`
        // below both answer THE SAME QUESTION IN THE SAME UNIT: **what one map
        // unit of travel through this cell costs, where the easiest going in
        // either medium is 0.9** — grassland ashore, the shoreline band afloat.
        // The two floors coincide at 0.9 by construction (MIN_BIOME_COST is
        // grassland's 0.9 and SEA_BASE is 0.9), and that coincidence is the ONLY
        // reason a land number and a sea number may be compared at all. A future
        // edit that moves one floor without the other silently re-scales the
        // land-vs-sea choice, so a pin brackets the ratio at which the verdict
        // turns and would red if either floor moved alone.
        //
        // ONE TERM IS DELIBERATELY ABSENT, AND ONE DELIBERATELY PRESENT:
        //   • OFF_BURG_MULT is OUT. It is a preference ("roads go where people
        //     are"), not a difficulty — a mule does not walk three times as hard
        //     through empty country. Left in, it would charge every land route
        //     ~3× against an unmultiplied sea route and hand almost every coastal
        //     pair to the sea. (The pin for this is the no-wall control below:
        //     its land route is off-burg end to end and must still beat the sea.)
        //   • CORRIDOR_REUSE is IN, and this was MEASURED, not assumed. Scoring
        //     the two candidates WITHOUT it looked tidier — a verdict about pure
        //     terrain — but it judges each route under an objective the search did
        //     not use: a land route that had just detoured onto an existing trunk
        //     road, and was therefore CHEAPER to travel, scored as the longer line
        //     it now is and lost the edge to the sea. Observed on a 13×9 fixture:
        //     the road routed alone stayed ashore and the same road routed after
        //     two neighbours stole its corridor put out to sea. Scoring with the
        //     discount keeps the verdict consistent with the path it is judging.
        //   ⚠ SO THE VERDICT IS A BATCH PROPERTY, exactly as the LINE already is
        //     (see `usedCellPairs` above): a road's mode may legitimately differ
        //     between routing it alone and routing it with its neighbours, and
        //     RoadsLayer always sends the whole set in one call, which is what
        //     makes it well-defined. It is NOT order-free and nothing here claims
        //     it is.
        const landDifficulty = (cell) => {
          const h = H[cell] || 0;
          const b = B[cell] ?? 4;
          const base = BIOME_COST[b] ?? 2.0;
          // Mountain penalty kicks in steeply above h=60 (FMG uses 0..100).
          const elevMult = h > 60 ? 1 + (h - 60) / 15 : 1;
          const riverBias = R[cell] ? 0.3 : 0;
          return base * elevMult + riverBias;
        };

        const seaDifficulty = (cell) => {
          const t = T[cell];
          if (typeof t === 'number' && t < 0) {
            // -1 is the shoreline; each band out costs a little more, so a lane
            // between two harbours follows the coast rather than the open sea.
            return SEA_BASE + SEA_DEPTH_STEP * (Math.min(-t, SEA_DEPTH_CAP) - 1);
          }
          if (T.length) {
            // Water FMG's markup never reached — beyond its -10 limit. Open ocean.
            return SEA_BASE + SEA_DEPTH_STEP * (SEA_DEPTH_CAP - 1);
          }
          // No distance field at all (a synthetic or pre-markup pack): the
          // pre-NET-1 elevation rule, unchanged, so such packs do not move.
          const h = H[cell] || 0;
          return h >= 15 ? 1.2 : 0.9;
        };

        const landCost = (cell, from) => {
          if (!isLand(cell)) return Infinity;
          // A burg on the cell is the discount; everywhere else pays the multiplier.
          const settled = BURG[cell] ? 1 : OFF_BURG_MULT;
          return landDifficulty(cell) * settled * reuse(from, cell);
        };

        const seaCost = (cell, from) => {
          if (!isOcean(cell)) return Infinity;
          return seaDifficulty(cell) * reuse(from, cell);
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

        // A binary min-heap over open-list entries, ordered by (f, cell id).
        // ⚠ THE COMPARATOR IS A STRICT TOTAL ORDER ON PURPOSE. The old open list
        // was a linear scan that popped the FIRST lowest-f entry, so equal-f ties
        // resolved by INSERTION ORDER — an accident of how the neighbour arrays
        // happened to be walked. Breaking ties on the cell id instead makes the
        // popped sequence, and therefore the path, a pure function of the graph.
        // (Equal-f ties are common here: a uniform-cost grid produces them at
        // every step.) This also replaces an O(open) pop with O(log open), which
        // matters now that NET-1 routes roughly twice as many edges per request.
        class CellHeap {
          constructor() { this.a = []; }
          get size() { return this.a.length; }
          less(x, y) { return x.f !== y.f ? x.f < y.f : x.c < y.c; }
          push(item) {
            const a = this.a;
            a.push(item);
            let i = a.length - 1;
            while (i > 0) {
              const parent = (i - 1) >> 1;
              if (!this.less(a[i], a[parent])) break;
              const t = a[i]; a[i] = a[parent]; a[parent] = t;
              i = parent;
            }
          }
          pop() {
            const a = this.a;
            const n = a.length;
            if (n === 0) return undefined;
            const top = a[0];
            const last = a.pop();
            if (n > 1) {
              a[0] = last;
              let i = 0;
              for (;;) {
                const l = 2 * i + 1, r = 2 * i + 2;
                let best = i;
                if (l < a.length && this.less(a[l], a[best])) best = l;
                if (r < a.length && this.less(a[r], a[best])) best = r;
                if (best === i) break;
                const t = a[i]; a[i] = a[best]; a[best] = t;
                i = best;
              }
            }
            return top;
          }
        }

        // A* over the pack-cell adjacency graph.
        // cells.c[i] is the neighbour index list for cell i.
        //
        // Returns an array of CELL IDS (the caller maps them to points), because
        // NET-1's corridor re-use has to record which HOPS a road took and a list
        // of coordinates cannot say that.
        //
        // `costFn(next, current)` — the current cell is the second parameter, so
        // a cost can depend on the hop rather than only on the destination. That
        // is what corridor re-use needs; every other term ignores it.
        //
        // `hScale` scales the straight-line heuristic to the cost scale in play;
        // see LAND_H_SCALE / SEA_H_SCALE above for why it is not simply 1.
        //
        // ── E-NET-3 · THE ITERATION GUARD REPORTS ──────────────────────────
        // `MAX_ITER` is a real ceiling and hitting it is a real event: the search
        // gives up, returns null, and the road it was drawing SILENTLY VANISHES
        // from the map. Nothing said so — not a warning, not a count, not a
        // difference in the reply — so a realm whose roads were quietly thinning
        // out looked exactly like a realm with fewer roads. The guard now keeps
        // books: how many searches ran, how deep the deepest one went, how many
        // gave up, and which roads they were drawing. The reply carries it back
        // and the layer says so in the parent's console.
        //
        // THE HEADROOM, MEASURED: on a 15,000-cell realm pack with 42 edges the
        // deepest single search is well inside this ceiling, so the counters are
        // expected to read zero. That is the point of reporting them — a zero you
        // can see is worth more than a silence you cannot.
        const MAX_ITER = 25000;
        const searchLedger = { searches: 0, exhausted: 0, peakIterations: 0 };
        const aStar = (startCell, goalCell, costFn, hScale) => {
          if (startCell == null || goalCell == null) return null;
          if (startCell < 0 || goalCell < 0) return null;
          if (startCell === goalCell) return [startCell];

          const goalP = P[goalCell];
          const heuristic = (c) => {
            const p = P[c];
            if (!p) return Infinity;
            return Math.hypot(p[0] - goalP[0], p[1] - goalP[1]) * hScale;
          };

          const gScore = new Map();
          const came   = new Map();
          gScore.set(startCell, 0);

          const open = new CellHeap();
          open.push({ c: startCell, f: heuristic(startCell), g: 0 });

          searchLedger.searches++;
          let iter = 0;
          /** Book the search and hand back its answer, whatever it is. */
          const done = (path) => {
            // `iter` is post-incremented by the loop test, so it reads one past the
            // budget on the run that trips the guard. Report what was SPENT.
            const used = iter > MAX_ITER ? MAX_ITER : iter;
            if (used > searchLedger.peakIterations) searchLedger.peakIterations = used;
            // EXHAUSTED means the budget ran out with work still queued — not the
            // same thing as an honestly unreachable goal, which drains the open set
            // and leaves `open.size` at zero. Both return null; only one is a bug
            // in the making, and conflating them is what made this silent.
            if (path === null && iter >= MAX_ITER && open.size > 0) searchLedger.exhausted++;
            return path;
          };
          while (open.size && iter++ < MAX_ITER) {
            const entry = open.pop();
            const current = entry.c;
            // Stale entry: a cheaper route to this cell was found after it was
            // pushed. (No decrease-key; the cheaper copy pops first.)
            if (entry.g > (gScore.get(current) ?? Infinity)) continue;

            if (current === goalCell) {
              const path = [current];
              let cur = current;
              while (came.has(cur)) {
                cur = came.get(cur);
                path.unshift(cur);
              }
              return done(path);
            }

            const neighbours = C[current] || [];
            const curP = P[current];
            const gCur = gScore.get(current) ?? Infinity;

            for (let k = 0; k < neighbours.length; k++) {
              const n = neighbours[k];
              const nc = costFn(n, current);
              if (!isFinite(nc)) continue;
              const nP = P[n];
              if (!nP) continue;
              const edgeDist = Math.hypot(nP[0] - curP[0], nP[1] - curP[1]);
              const tentativeG = gCur + nc * edgeDist;
              if (tentativeG < (gScore.get(n) ?? Infinity)) {
                came.set(n, current);
                gScore.set(n, tentativeG);
                open.push({ c: n, f: tentativeG + heuristic(n), g: tentativeG });
              }
            }
          }
          return done(null);
        };

        /** Cell-id path -> the polyline the parent renders. */
        const toPoints = (cellPath) =>
          (cellPath || []).map((c) => ({ x: P[c][0], y: P[c][1] }));

        /** Straight-line map distance between two cell centroids. */
        const cellSpan = (a, b) => {
          const pa = P[a], pb = P[b];
          if (!pa || !pb) return 0;
          return Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
        };

        /**
         * E-NET-1 · THE TRUE COST OF A ROUTE, in the declared unit above: the sum
         * over every hop of (the difficulty of the cell entered) × (the distance
         * of that hop). This is the SAME accumulation A* itself performs, which is
         * exactly why it is comparable — it re-scores the CHOSEN path with the one
         * shaping term taken out, rather than inventing a second cost model.
         * A path of one cell (start === goal) has travelled nothing and costs 0.
         */
        const routeDifficulty = (cellPath, difficultyOf) => {
          if (!Array.isArray(cellPath) || cellPath.length < 2) return 0;
          let total = 0;
          for (let i = 1; i < cellPath.length; i++) {
            const from = cellPath[i - 1], to = cellPath[i];
            total += difficultyOf(to) * reuse(from, to) * cellSpan(from, to);
          }
          return total;
        };

        /**
         * A sea route is the water leg PLUS the two quay hops, and the quays are
         * charged too: the boat's run out of the harbour and into the far one is
         * sailing, and leaving it unpriced would make every sea route look two
         * free hops cheaper than it is. Each quay hop is charged at the difficulty
         * of the WATER cell it touches, which is what a harbour approach costs.
         */
        const seaRouteDifficulty = (startCell, midCells, goalCell) => {
          if (!Array.isArray(midCells) || midCells.length < 1) return Infinity;
          const first = midCells[0], last = midCells[midCells.length - 1];
          return routeDifficulty(midCells, seaDifficulty)
            + seaDifficulty(first) * cellSpan(startCell, first)
            + seaDifficulty(last) * cellSpan(last, goalCell);
        };

        /** Bank every hop of a chosen path so the roads that follow ride it cheap. */
        const recordCorridor = (cellPath) => {
          if (!Array.isArray(cellPath)) return;
          for (let i = 1; i < cellPath.length; i++) {
            usedCellPairs.add(hopKey(cellPath[i - 1], cellPath[i]));
          }
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

        // ── NET-1 #9 · THE HAVEN EXIT ──────────────────────────────────────
        // FMG's markupPack already recorded, for every LAND_COAST cell, the water
        // neighbour nearest its centroid (`cells.haven`) — the cell a boat would
        // actually put out from. Reading it beats breadth-first searching for
        // "some ocean around here": it is exact, it is O(1), and it is the same
        // answer the rest of FMG uses when it asks where a burg's harbour is.
        // The BFS stays as the fallback for a pack with no haven array (a
        // synthetic fixture, or a pre-markup pack), so nothing regresses.
        const havenExit = (cell) => {
          if (isOcean(cell)) return cell;
          const h = HAVEN[cell];
          if (typeof h === 'number' && h >= 0 && h < P.length && P[h] && isOcean(h)) return h;
          return findNearestOcean(cell);
        };

        const paths = {};
        // E-NET-3: the roads whose search gave up at the guard, named. Capped so a
        // pathological map cannot turn the reply into a megabyte of ids; the COUNT
        // beside it is never capped, so the cap can never hide the scale.
        const EXHAUSTED_ID_CAP = 20;
        const exhaustedEdgeIds = [];
        for (const e of edges) {
          const startC = findCellAt(e.fromX, e.fromY);
          const goalC  = findCellAt(e.toX,   e.toY);
          if (startC < 0 || goalC < 0) continue;
          const exhaustedBefore = searchLedger.exhausted;

          let landPath = null;
          if (isLand(startC) && isLand(goalC)) {
            landPath = aStar(startC, goalC, landCost, LAND_H_SCALE);
          }

          let seaMid = null;
          const canSea = (e.preferSea || !landPath) && isCoastal(startC) && isCoastal(goalC);
          if (canSea) {
            const seaStart = havenExit(startC);
            const seaGoal  = havenExit(goalC);
            if (seaStart != null && seaGoal != null) {
              const mid = aStar(seaStart, seaGoal, seaCost, SEA_H_SCALE);
              if (mid && mid.length >= 2) seaMid = mid;
            }
          }

          const landPts = landPath ? toPoints(landPath) : null;
          // A sea route is the two quays plus the water leg between them.
          const seaPts = seaMid
            ? [{ x: P[startC][0], y: P[startC][1] },
               ...toPoints(seaMid),
               { x: P[goalC][0], y: P[goalC][1] }]
            : null;

          // ── E-NET-1 · THE MODE IS CHOSEN ON COST, NOT ON LENGTH ───────────
          // What stood here compared the two POLYLINE LENGTHS and said so in its
          // own comment ("We don't have true costs here, so use polyline length
          // as a proxy"). Length is not cost: it cannot tell a road over a glacier
          // ridge from the same road across grassland, so a land route through
          // terrain the cost function had just priced at four times grassland won
          // the comparison outright as long as it was geometrically shorter — and
          // every one of NET-1's terrain terms was thrown away at the last step.
          //
          // Now both candidates are re-scored in the ONE declared difficulty unit
          // (see landDifficulty / seaDifficulty above) and the bias is a named
          // constant.
          const landScore = landPath ? routeDifficulty(landPath, landDifficulty) : Infinity;
          const seaScore = seaMid ? seaRouteDifficulty(startC, seaMid, goalC) : Infinity;

          let chosen = null, chosenCells = null, mode = 'land';
          if (landPts && seaPts) {
            const seaWins = seaScore * SEA_ROUTE_BIAS < landScore;
            chosen      = seaWins ? seaPts  : landPts;
            chosenCells = seaWins ? seaMid  : landPath;
            mode        = seaWins ? 'sea'   : 'land';
          } else if (landPts) {
            chosen = landPts; chosenCells = landPath; mode = 'land';
          } else if (seaPts) {
            chosen = seaPts;  chosenCells = seaMid;   mode = 'sea';
          }

          if (chosen && chosen.length >= 2) {
            paths[e.id] = { points: chosen, mode };
            // Only the route we actually drew becomes a corridor — a candidate
            // that lost the comparison above must not make the next road cheap
            // along a line nobody travels.
            recordCorridor(chosenCells);
          }
          // E-NET-3: attribute the give-up to the road it was drawing. A LAND
          // candidate can exhaust and the edge still be drawn by sea, and that is
          // worth saying too: the road on the map is not the road the model wanted.
          if (searchLedger.exhausted > exhaustedBefore && exhaustedEdgeIds.length < EXHAUSTED_ID_CAP) {
            exhaustedEdgeIds.push(e.id);
          }
        }

        // ── E-NET-3 · THE REPORT ───────────────────────────────────────────
        // Additive: `paths` is untouched and every existing consumer reads only
        // that. `diagnostics` is a fixed-shape summary — six integers, an id list
        // capped at twenty, and the guard's own value so a reader never has to go
        // looking for the constant to know what the peak is a fraction OF.
        const diagnostics = {
          edges: edges.length,
          routed: Object.keys(paths).length,
          searches: searchLedger.searches,
          maxIterations: MAX_ITER,
          peakIterations: searchLedger.peakIterations,
          exhaustedSearches: searchLedger.exhausted,
          exhaustedEdgeIds,
        };
        if (searchLedger.exhausted > 0) {
          console.warn(
            `[sfBridge] computeRoadNetwork: ${searchLedger.exhausted} of `
            + `${searchLedger.searches} route searches hit the ${MAX_ITER}-iteration guard`
            + ` and were abandoned — those roads are missing from the map.`,
            exhaustedEdgeIds,
          );
        }

        reply(rid, { type: 'fmg:roadNetworkReply', paths, diagnostics });
      } catch (err) {
        console.warn('[sfBridge] computeRoadNetwork failed', err);
        replyError(rid, 'fmg:roadNetworkReply', err);
      }
    },

    // ── Spatial pack capture (Phase 5.5 MODULATION — the keystone's live seam) ──
    // READ-ONLY snapshot of the terrain cell arrays the parent needs to freeze a
    // spatial digest at an entitled canonize: h (height), biome, r (river flag), p
    // (cell centroid [x,y]), c (neighbour adjacency). It MUTATES NOTHING — it only
    // copies the already-generated pack arrays out (the pure digest builder runs
    // parent-side over this capture, never over the iframe). TypedArrays are
    // converted to plain arrays so the parent's normalizeSpatialPack (which uses
    // Array.isArray) reads them; p/c are already plain arrays. Because the pack is
    // static in memory once generated, two captures of the same map are identical
    // (the parent asserts this and freezes the first regardless — freeze-first).
    //
    // ── W-CAP CAP-1 (design §2 D1: THE ONE CAPTURE-EXTENSION ACT) ───────────────
    // Four fields join the copy, in ONE act, so the capture surface is widened once
    // rather than a field per consuming wave:
    //   • cells.fl — Uint16 FLUX, PACK-indexed (main.js's river model; the volume's
    //     river-navigability banding reads it).
    //   • cells.g  — the pack cell's GRID cell index, PACK-indexed. main.js:1245
    //     mints it as `createTypedArray({maxValue: grid.points.length, …})`.
    //   • grid.temp — Int8 temperature in DEGREES CELSIUS, GRID-indexed
    //     (main.js:991 `const cells = grid.cells;` … `minmax(tempSeaLevel - drop, -128, 127)`).
    //   • grid.prec — Uint8 precipitation in FMG's own 0..255 units, GRID-indexed
    //     (main.js:1042 `const {cells, cellsX, cellsY} = grid;`).
    //
    // ⛔ THE DENOMINATOR IS THE WHOLE POINT. temp/prec are indexed by GRID cell and
    // h/biome/r/fl by PACK cell — DIFFERENT LENGTHS, different meaning per index. They
    // are therefore carried under a SEPARATE `grid` key, never mixed into `cells`,
    // and `cells.g` is the ONLY declared bridge between the two spaces. A reader that
    // indexes `grid.temp` with a pack cell id is reading a different cell and nothing
    // will ever red — so the shape refuses to make that mistake spellable.
    //
    // The pack may legitimately carry NO flux/g (a hand-edited heightmap before the
    // river pass) and there may be no `grid` at all; every new field degrades to an
    // EMPTY array, exactly as `biome`/`r` already do, and the parent's normalize
    // treats absent as empty. No new failure mode, no throw.
    'settlementEngine:getSpatialPack'(data, rid) {
      try {
        const cells = pack?.cells;
        if (!cells || !cells.h || !cells.c) {
          return reply(rid, { type: 'fmg:spatialPackReply', pack: null });
        }
        const plain = (arr) => (Array.isArray(arr) ? arr : (arr ? Array.from(arr) : []));
        // `grid` is a top-level `var` global (main.js:125) exactly as `pack` is, but a
        // capture can be requested before the grid exists — read it defensively so a
        // missing global degrades to empty arrays instead of a caught ReferenceError
        // that would take the WHOLE capture down with it.
        const gridCells = (typeof grid !== 'undefined' && grid) ? grid.cells : null;
        reply(rid, {
          type: 'fmg:spatialPackReply',
          pack: {
            cells: {
              h: plain(cells.h),
              biome: plain(cells.biome),
              r: plain(cells.r),
              // p is an array of [x,y] pairs, c an array of neighbour-index arrays;
              // both are already plain arrays in the pack — copy the outer array so
              // the reply can't alias live pack state.
              p: Array.isArray(cells.p) ? cells.p.map((pt) => (Array.isArray(pt) ? [pt[0], pt[1]] : pt)) : [],
              c: Array.isArray(cells.c) ? cells.c.map((nb) => (Array.isArray(nb) ? nb.slice() : plain(nb))) : [],
              // CAP-1, PACK-indexed (same denominator as h/biome/r above).
              fl: plain(cells.fl),
              g: plain(cells.g),
            },
            // CAP-1, GRID-indexed — a DIFFERENT denominator, hence its own key.
            grid: {
              temp: plain(gridCells && gridCells.temp),
              prec: plain(gridCells && gridCells.prec),
            },
          },
        });
      } catch (err) {
        console.warn('[sfBridge] getSpatialPack failed', err);
        replyError(rid, 'fmg:spatialPackReply', err);
      }
    },

    // Rasterize the rendered terrain to a small JPEG data URL for a maps-gallery
    // cover (parent: src/lib/mapThumb.js). Best-effort by contract: any failure
    // (no SVG, tainted canvas from an external <image>, unsupported toDataURL)
    // replies { dataUrl: null } and the caller falls back to the terrain
    // placeholder. This must NEVER throw across the bridge or block a share.
    async 'settlementEngine:exportThumb'(data, rid) {
      try {
        const svgEl = document.getElementById('map');
        const srcW = window.graphWidth || (svgEl ? svgEl.clientWidth : 0) || 0;
        const srcH = window.graphHeight || (svgEl ? svgEl.clientHeight : 0) || 0;
        if (!svgEl || srcW < 1 || srcH < 1) {
          return reply(rid, { type: 'fmg:exportThumbReply', dataUrl: null });
        }
        const size = Math.max(64, Math.min(1024, Number(data && data.size) || 480));
        const fit = Math.min(size / srcW, size / srcH, 1);
        const outW = Math.max(1, Math.round(srcW * fit));
        const outH = Math.max(1, Math.round(srcH * fit));

        // Clone the live SVG, pin explicit dimensions + a full-map viewBox so the
        // export captures the WHOLE map (not the current pan/zoom crop), and
        // neutralize the camera transform FMG applies to the #viewbox group.
        const clone = svgEl.cloneNode(true);
        clone.setAttribute('width', String(srcW));
        clone.setAttribute('height', String(srcH));
        clone.setAttribute('viewBox', '0 0 ' + srcW + ' ' + srcH);
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const vb = clone.querySelector('#viewbox');
        if (vb) vb.removeAttribute('transform');
        const xml = new XMLSerializer().serializeToString(clone);
        const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);

        const dataUrl = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = outW;
              canvas.height = outH;
              const ctx = canvas.getContext('2d');
              if (!ctx) return resolve(null);
              // White matte: JPEG has no alpha, so transparency would render black.
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, outW, outH);
              ctx.drawImage(img, 0, 0, outW, outH);
              resolve(canvas.toDataURL('image/jpeg', 0.82));
            } catch (_) {
              resolve(null); // tainted canvas / unsupported — placeholder fallback
            }
          };
          img.onerror = () => resolve(null);
          img.src = svgUrl;
        });

        reply(rid, { type: 'fmg:exportThumbReply', dataUrl: dataUrl, w: outW, h: outH });
      } catch (err) {
        console.warn('[sfBridge] exportThumb failed', err);
        reply(rid, { type: 'fmg:exportThumbReply', dataUrl: null });
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
        } else if (typeof zoom !== 'undefined' && zoom && typeof svg !== 'undefined' && svg && window.d3) {
          // PHANTOM-GLOBAL FIX: zoom/svg are lexical globals, not window props —
          // this d3 fallback was dead. Guarded bare access makes it live.
          const w = window.graphWidth || 0;
          const h = window.graphHeight || 0;
          const s = scale || 1;
          const tx = w / 2 - cx * s;
          const ty = h / 2 - cy * s;
          svg.transition().duration(duration)
            .call(zoom.transform, window.d3.zoomIdentity.translate(tx, ty).scale(s));
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
        // The embedded build's svg/zoom are top-level let bindings in main.js
        // (script-scoped, NOT window properties), so the old window.* guard
        // silently no-oped while replying success. resetZoom() is a top-level
        // function DECLARATION (thus a real global) that closes over the
        // scoped svg/zoom and applies the identity transform -- which IS the
        // fitted full-realm view in embedded mode. Use it; fall back to
        // fitMapToScreen (canvas re-size only) and the guarded bare-global path
        // (the phantom-global sweep converted this last resort from the dead
        // window.* form so it too is live if ever reached).
        if (typeof resetZoom === 'function') {
          resetZoom(600);
        } else if (typeof fitMapToScreen === 'function') {
          fitMapToScreen();
        } else if (typeof zoom !== 'undefined' && zoom && typeof svg !== 'undefined' && svg && window.d3) {
          svg.transition().duration(600)
            .call(zoom.transform, window.d3.zoomIdentity);
        } else {
          throw new Error('fitMap: no fit mechanism available in this build');
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
          reply(rid, { type: 'fmg:mapResetReply', seed: currentSeed() });
          postToParent({ type: 'fmg:mapReset', seed: currentSeed() });
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
    const data = event?.data;
    if (!data || typeof data !== 'object') return;
    const { type, _rid } = data;
    if (typeof type !== 'string' || !type.startsWith('settlementEngine:')) return;

    // Trust boundary: only the configured parent origin AND the WindowProxy
    // that embedded us may drive destructive map commands. The map's own origin
    // is intentionally different in production.
    if (event.origin !== parentOrigin) return;
    if (event.source !== window.parent) return;

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
    const seed = currentSeed();
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
  // SettlementForge fork patch: bound the poll. Without a timeout, an upstream `pack` rename would leave the
  // optional chain undefined forever — the interval never clears, fmg:ready never fires, and the blank iframe
  // gives zero diagnostic. After ~60s (120 × 500ms) stop and surface a console warning instead of spinning.
  let readyPollAttempts = 0;
  const readyPoll = setInterval(() => {
    const hasCells = pack?.cells?.i?.length > 0;
    const hasBurgs = pack?.burgs?.length > 0;
    if (hasCells || hasBurgs) {
      clearInterval(readyPoll);
      notifyReady();
    } else if (++readyPollAttempts >= 120) {
      clearInterval(readyPoll);
      try {
        console.warn('[sf-bridge] fmg:ready timed out — pack.cells never populated (upstream global rename?)');
      } catch (e) { /* best-effort */ }
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
