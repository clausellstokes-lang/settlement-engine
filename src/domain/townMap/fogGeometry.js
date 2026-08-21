/**
 * domain/townMap/fogGeometry.js — THE TABLE LAYER (DOOR 2) semantic-snap reveal geometry.
 *
 * PURE, deterministic geometry that turns a fog session's REVEAL SET (stable semantic ids,
 * see fogSessions.js) into the render primitives a fog MASK needs, and resolves a brush
 * point back to the nearest semantic element (the semantic-snap differentiator: reveals
 * follow the model's REAL district/street/building edges, not a pixel brush).
 *
 * THE STREET-ID SYNTHESIS (the model gives streets no id — recon-confirmed): a street is
 * identified by the districts it links, recovered GEOMETRICALLY from its endpoints so the
 * id is version-independent (v1/v2) and reroll-stable:
 *   • anchor ↔ district centroid  ⇒  `spoke:<districtId>`
 *   • centroid ↔ centroid         ⇒  `desire:<idA>|<idB>` (ids codepoint-sorted)
 * Endpoints of spokes/desire-paths ARE centroids/the anchor (townLayoutV2), so the nearest-
 * node match is exact; a street whose endpoints resolve to no node is dropped (never a throw).
 *
 * THE MASK (union, not symmetric-difference): fog = an SVG `<mask>` — WHITE (fog) everywhere,
 * BLACK (no-fog) over each revealed shape. Overlapping black shapes UNION correctly (a
 * revealed building inside a revealed district re-reveals nothing), which an even-odd path
 * would double-count. The fragment is a self-contained string used by the export AND the
 * store-free player view; the DM pane renders the SAME `revealShapes` primitives as JSX, so
 * the mask geometry is shared + pure (WYSIWYG law: the handout is what the DM sees, masked).
 *
 * ZERO coupling to townMapDraw.js — fog is a top overlay, never a draw-op, so buildTownMap-
 * DrawList's golden is untouched and the UNFOGGED export stays byte-identical by construction.
 *
 * PURE: no Date / Math.random / localeCompare.
 */

/** View space (the 0..1000 map viewBox, matching townMapDraw VIEW). */
export const FOG_VIEW = 1000;

// Brush snap radii (view units) + reveal-shape sizes — bounded, deterministic.
const SNAP_BUILDING_R = 44;   // a click within this of a building snaps to it
const SNAP_STREET_R = 26;     // …of a street segment snaps to it
const REVEAL_BUILDING_R = 18; // the mask hole around a revealed building (⊋ the 8px glyph)
const REVEAL_STREET_W = 46;   // the corridor width a revealed street punches
const NODE_EPS = 6;           // endpoint→node match tolerance (endpoints ARE nodes)

/** @typedef {import('./townMapModel.js').TownMapModel} TownMapModel */

/** Squared distance (avoids a sqrt for comparisons).
 *  @param {number} ax @param {number} ay @param {number} bx @param {number} by */
function d2(ax, ay, bx, by) { const dx = ax - bx; const dy = ay - by; return dx * dx + dy * dy; }

/** Distance from point (px,py) to segment (a→b), squared. Pure.
 *  @param {number} px @param {number} py @param {number} ax @param {number} ay @param {number} bx @param {number} by */
function segDist2(px, py, ax, ay, bx, by) {
  const vx = bx - ax; const vy = by - ay;
  const wx = px - ax; const wy = py - ay;
  const len2 = vx * vx + vy * vy;
  let t = len2 > 0 ? (wx * vx + wy * vy) / len2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return d2(px, py, ax + t * vx, ay + t * vy);
}

/** Ray-cast point-in-polygon over a closed ring `[[x,y],…]`. Pure.
 *  @param {number} px @param {number} py @param {ReadonlyArray<ReadonlyArray<number>>} ring */
function pointInPolygon(px, py, ring) {
  if (!Array.isArray(ring) || ring.length < 3) return false;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i][0]; const yi = ring[i][1];
    const xj = ring[j][0]; const yj = ring[j][1];
    const intersect = ((yi > py) !== (yj > py)) && (px < ((xj - xi) * (py - yi)) / ((yj - yi) || 1e-9) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/** The model's districts array (defensive). @param {TownMapModel | null | undefined} model */
function districtsOf(model) { return model && Array.isArray(model.districts) ? model.districts : []; }
/** The model's buildings array (defensive). @param {TownMapModel | null | undefined} model */
function buildingsOf(model) { return model && Array.isArray(model.buildings) ? model.buildings : []; }
/** The model's street segments (defensive). @param {TownMapModel | null | undefined} model */
function streetSegsOf(model) {
  const sk = model && model.skeleton;
  return sk && Array.isArray(sk.streets) ? sk.streets : [];
}

/** Resolve a point to the nearest semantic NODE (anchor or a district centroid) within eps,
 *  returning a stable node id: 'core' for the anchor, else the district id. Pure.
 *  @param {TownMapModel | null | undefined} model @param {number} x @param {number} y
 *  @returns {string | null} */
function nodeIdAt(model, x, y) {
  const anchor = model && model.skeleton && model.skeleton.anchor;
  let bestId = null;
  let bestD = NODE_EPS * NODE_EPS;
  if (anchor && Number.isFinite(anchor.x)) {
    const dd = d2(x, y, anchor.x, anchor.y);
    if (dd <= bestD) { bestD = dd; bestId = 'core'; }
  }
  for (const d of districtsOf(model)) {
    const c = d && d.centroid;
    if (!c) continue;
    const dd = d2(x, y, c.x, c.y);
    if (dd <= bestD) { bestD = dd; bestId = d.id; }
  }
  return bestId;
}

/**
 * The model's streets with SYNTHESIZED stable ids. `spoke:<districtId>` for a core↔centroid
 * link; `desire:<a>|<b>` (ids codepoint-sorted) for a centroid↔centroid link. A segment whose
 * endpoints resolve to no node, or that would self-link, is dropped. Deterministic order
 * (input order); duplicate ids collapse to the first. Pure.
 * @param {TownMapModel | null | undefined} model
 * @returns {Array<{ id: string, from: {x:number,y:number}, to: {x:number,y:number} }>}
 */
export function fogStreets(model) {
  /** @type {Array<{ id:string, from:{x:number,y:number}, to:{x:number,y:number} }>} */
  const out = [];
  const seen = new Set();
  for (const st of streetSegsOf(model)) {
    if (!st || !st.from || !st.to) continue;
    const a = nodeIdAt(model, st.from.x, st.from.y);
    const b = nodeIdAt(model, st.to.x, st.to.y);
    if (!a || !b || a === b) continue;
    let id;
    if (a === 'core') id = `spoke:${b}`;
    else if (b === 'core') id = `spoke:${a}`;
    else id = `desire:${a < b ? `${a}|${b}` : `${b}|${a}`}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, from: { x: st.from.x, y: st.from.y }, to: { x: st.to.x, y: st.to.y } });
  }
  return out;
}

/** Every revealable id in the model, per kind (drives reveal-all / hide-all). Pure.
 *  @param {TownMapModel | null | undefined} model */
export function allRevealIds(model) {
  return {
    districts: districtsOf(model).map((d) => d.id).filter((v) => typeof v === 'string'),
    buildings: buildingsOf(model).map((b) => b.anchorKey).filter((v) => typeof v === 'string'),
    streets: fogStreets(model).map((s) => s.id),
  };
}

/**
 * SEMANTIC SNAP: resolve a brush point to the nearest semantic element id. `kind`
 * constrains the target ('districts' | 'streets' | 'buildings'); 'auto' (default) prefers a
 * building, then a street, then the containing/nearest district. Returns { kind, id } or null.
 * @param {TownMapModel | null | undefined} model @param {number} x @param {number} y
 * @param {{ kind?: 'districts'|'streets'|'buildings'|'auto' }} [opts]
 * @returns {{ kind: 'districts'|'streets'|'buildings', id: string } | null}
 */
export function snapToSemantic(model, x, y, opts = {}) {
  const want = opts.kind || 'auto';

  const nearestBuilding = () => {
    let best = null; let bestD = SNAP_BUILDING_R * SNAP_BUILDING_R;
    for (const b of buildingsOf(model)) {
      const p = b && b.position;
      if (!p || typeof b.anchorKey !== 'string') continue;
      const dd = d2(x, y, p.x, p.y);
      if (dd <= bestD) { bestD = dd; best = b.anchorKey; }
    }
    return best;
  };
  const nearestStreet = () => {
    let best = null; let bestD = SNAP_STREET_R * SNAP_STREET_R;
    for (const s of fogStreets(model)) {
      const dd = segDist2(x, y, s.from.x, s.from.y, s.to.x, s.to.y);
      if (dd <= bestD) { bestD = dd; best = s.id; }
    }
    return best;
  };
  const districtAt = () => {
    for (const d of districtsOf(model)) {
      if (Array.isArray(d.polygon) && pointInPolygon(x, y, d.polygon)) return d.id;
    }
    // Fallback: nearest centroid (a click in an inter-district gap still snaps to a quarter).
    let best = null; let bestD = Infinity;
    for (const d of districtsOf(model)) {
      const c = d && d.centroid; if (!c) continue;
      const dd = d2(x, y, c.x, c.y);
      if (dd < bestD) { bestD = dd; best = d.id; }
    }
    return best;
  };

  if (want === 'buildings') { const id = nearestBuilding(); return id ? { kind: 'buildings', id } : null; }
  if (want === 'streets') { const id = nearestStreet(); return id ? { kind: 'streets', id } : null; }
  if (want === 'districts') { const id = districtAt(); return id ? { kind: 'districts', id } : null; }
  // auto
  const b = nearestBuilding(); if (b) return { kind: 'buildings', id: b };
  const s = nearestStreet(); if (s) return { kind: 'streets', id: s };
  const dId = districtAt(); return dId ? { kind: 'districts', id: dId } : null;
}

/** @typedef {{ kind:'district', points: Array<[number,number]> }
 *          | { kind:'building', x:number, y:number, r:number }
 *          | { kind:'street', x1:number, y1:number, x2:number, y2:number, w:number }} RevealShape */

/**
 * The render primitives for a session's revealed set — the BLACK (no-fog) shapes punched
 * into the fog mask, re-derived over the CURRENT model geometry (the edits-delta law: a
 * reveal id survives a reroll, the shape follows the moved geometry). A revealed id that no
 * longer resolves is silently dropped. Pure + deterministic (model order).
 * @param {TownMapModel | null | undefined} model
 * @param {{ districts?: string[], streets?: string[], buildings?: string[] } | null | undefined} reveal
 * @returns {RevealShape[]}
 */
export function revealShapes(model, reveal) {
  /** @type {RevealShape[]} */
  const shapes = [];
  if (!model || !reveal) return shapes;
  const wantD = new Set(Array.isArray(reveal.districts) ? reveal.districts : []);
  const wantB = new Set(Array.isArray(reveal.buildings) ? reveal.buildings : []);
  const wantS = new Set(Array.isArray(reveal.streets) ? reveal.streets : []);

  if (wantD.size) {
    for (const d of districtsOf(model)) {
      if (wantD.has(d.id) && Array.isArray(d.polygon) && d.polygon.length >= 3) {
        shapes.push({ kind: 'district', points: d.polygon.map((p) => [p[0], p[1]]) });
      }
    }
  }
  if (wantS.size) {
    for (const s of fogStreets(model)) {
      if (wantS.has(s.id)) shapes.push({ kind: 'street', x1: s.from.x, y1: s.from.y, x2: s.to.x, y2: s.to.y, w: REVEAL_STREET_W });
    }
  }
  if (wantB.size) {
    for (const b of buildingsOf(model)) {
      const p = b && b.position;
      if (p && wantB.has(b.anchorKey)) shapes.push({ kind: 'building', x: p.x, y: p.y, r: REVEAL_BUILDING_R });
    }
  }
  return shapes;
}

/** Whether a session reveals nothing that resolves in this model (⇒ full-cover fog). Pure.
 *  @param {TownMapModel | null | undefined} model
 *  @param {{ districts?: string[], streets?: string[], buildings?: string[] } | null | undefined} reveal
 *  @returns {boolean} */
export function isFullyFogged(model, reveal) {
  return revealShapes(model, reveal).length === 0;
}

/** XML-attribute-safe number (strips -0). @param {number} n */
function num(n) { const v = Number(n); return String(Number.isFinite(v) ? (v === 0 ? 0 : v) : 0); }

/** One reveal shape → the BLACK mask element string (union member). Pure.
 *  @param {RevealShape} shape */
function shapeToMaskSvg(shape) {
  if (shape.kind === 'district') {
    const pts = shape.points.map(([x, y]) => `${num(x)},${num(y)}`).join(' ');
    return `<polygon points="${pts}" fill="#000"/>`;
  }
  if (shape.kind === 'building') {
    return `<circle cx="${num(shape.x)}" cy="${num(shape.y)}" r="${num(shape.r)}" fill="#000"/>`;
  }
  // street corridor: a wide round-capped black stroke
  return `<line x1="${num(shape.x1)}" y1="${num(shape.y1)}" x2="${num(shape.x2)}" y2="${num(shape.y2)}" `
    + `stroke="#000" stroke-width="${num(shape.w)}" stroke-linecap="round"/>`;
}

/**
 * The self-contained fog `<g>` fragment (an inline `<mask>` + the masked fog rect) to inject
 * into a base town-map SVG (before its closing `</svg>`). Deterministic — a FIXED mask id so
 * the fogged export is byte-stable. WHITE fog everywhere, BLACK revealed shapes punch it out;
 * the fog rect carries the lens ink color at `opacity`. `maskId` must be unique per SVG
 * document (default 'sf-fog' — fine for a self-contained export/handout).
 * @param {TownMapModel | null | undefined} model
 * @param {{ districts?: string[], streets?: string[], buildings?: string[] } | null | undefined} reveal
 * @param {{ color?: string, opacity?: number, maskId?: string }} [opts]
 * @returns {string}
 */
export function fogMaskFragment(model, reveal, opts = {}) {
  const color = typeof opts.color === 'string' ? opts.color : '#12100b';
  const opacity = Number.isFinite(opts.opacity) ? Number(opts.opacity) : 0.92;
  const id = typeof opts.maskId === 'string' && opts.maskId ? opts.maskId : 'sf-fog';
  const holes = revealShapes(model, reveal).map(shapeToMaskSvg).join('');
  const V = FOG_VIEW;
  return `<g data-town-fog>`
    + `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${V}" height="${V}">`
    + `<rect x="0" y="0" width="${V}" height="${V}" fill="#fff"/>${holes}</mask>`
    + `<rect x="0" y="0" width="${V}" height="${V}" fill="${color}" fill-opacity="${num(opacity)}" mask="url(#${id})"/>`
    + `</g>`;
}

/** Inject a fog fragment into a base town-map SVG string (before the final `</svg>`). When
 *  `fragment` is empty, returns the base UNCHANGED (byte-identical). Pure.
 *  @param {string} baseSvg @param {string} fragment @returns {string} */
export function injectFog(baseSvg, fragment) {
  if (!fragment || typeof baseSvg !== 'string') return baseSvg;
  const i = baseSvg.lastIndexOf('</svg>');
  if (i < 0) return baseSvg;
  return baseSvg.slice(0, i) + fragment + baseSvg.slice(i);
}
