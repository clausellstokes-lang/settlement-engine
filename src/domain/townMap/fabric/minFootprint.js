/**
 * domain/townMap/fabric/minFootprint.js — ⭐⭐ REG-4 · **L-REG-30, THE MINIMUM-FOOTPRINT LAW**
 * (owner directive, ODQ §630; charter Amendment A7).
 *
 * THE DIRECTIVE, verbatim intent (§630.1): *"make it so that a building has a minimum dimension
 * or size otherwise it is not to be built or combined into a bigger structure with an adjacent
 * building. No small one room blocks."*
 *
 * ⭐⭐ THE SPLIT THAT MAKES THIS SAFE, AND IT IS §630.2's OWN WORDS: **the truth is untouched.**
 * The building exists in the fabric (L0); this law binds the INK (L1). Nothing here mutates a
 * parcel, a landmark or a habitation — the pass publishes a keyed VERDICT TABLE the lens reads,
 * exactly the shape REG-1's fusion and REG-3's shape code already use. A census counting drawn
 * bodies still counts the bodies the fabric made; a census counting DRAWN INK reads this table.
 *
 * THE THREE VERDICTS (§630.2 + §630.4):
 *   FUSE     a sub-minimum body with a drawable neighbour is absorbed INTO that neighbour.
 *   CLAMP    a sub-minimum body that is a site's SOLE structure, or a typed landmark, renders
 *            AT the floor — §630.4's refinement: "a hermitage, a bothy, a wayside chapel
 *            standing alone IS its site, and an empty site is a worse lie than a slightly
 *            generous glyph."
 *   DROP     an isolated sub-minimum body is not drawn.
 *
 * ⛔ MONUMENT CLASSES NEVER FUSE **INTO** A NEIGHBOUR (§630.3) — they may only ABSORB. Welding a
 * church to the house beside it would move its silhouette, and REG-3's blind class-from-
 * silhouette read is a landed exit that must not regress.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no Math.pow, no localeCompare.
 */

import { absArea, centroid, bounds } from './fabricGeometry.js';

/* ══════════════════════════ THE FLOORS ══════════════════════════ */

/**
 * ⭐⭐ THE FLOOR CANDIDATES — MEASURED BY THE LANE, SIGNED BY THE CHAIR (§630.2 says so in as
 * many words), carried here as a tuning-surface constant with its derivation attached.
 *
 * Every candidate is expressed against a quantity the leaf already draws, because a floor in
 * absolute view units would mean a different thing at a thorp (frontage 26) and a city
 * (frontage 6.25) — the same class of error `STREET_LADDER`'s own header records.
 *
 *  F-A  THE NARROWEST GAP THE LEAF DRAWS. `STREET_LADDER.crossAlley = 0.30` frontages is the
 *       thinnest channel on the page. A body narrower than the narrowest gap beside it cannot
 *       read as a body — it reads as a gap that failed to close.
 *  F-B  THE REFERENCES' ROW-BLOCK PRACTICE. Watabou and FTG draw urban fabric as ROW BLOCKS,
 *       never as free-standing one-room cells; the shallowest thing either draws is a range
 *       about as deep as the lane it fronts (`STREET_LADDER.blockLane = 0.62` frontages).
 *  F-C  THE LEAF'S OWN LINE WEIGHT. REG-3's J-REG3-6 already ruled the legibility question in
 *       this repo's own words — "can the marks be told apart at the leaf's own line weight" —
 *       and answered it at `6 × INK.detail`. A body under six detail-strokes across is a body
 *       whose own outline is most of it.
 *
 * ⭐ THE AREA FLOOR IS NOT INDEPENDENT: §630.2 asks for BOTH a short-axis and an area floor so
 * that a body which merely clears the short axis but is a stub still fails. `AREA_ASPECT = 1.6`
 * says the smallest drawable building is at least a 1 : 1.6 rectangle at the floor — the
 * shallowest burgage proportion `parcels.js` itself ever packs.
 */
export const FLOOR_CANDIDATES = Object.freeze({
  'F-A': { shortFrontages: 0.30, source: 'STREET_LADDER.crossAlley — the narrowest gap the leaf draws' },
  'F-B': { shortFrontages: 0.62, source: 'STREET_LADDER.blockLane — the references\' row-block practice' },
  'F-C': { detailStrokes: 6, source: 'REG-3 J-REG3-6 — six detail strokes, the leaf\'s own line weight' },
});
export const AREA_ASPECT = 1.6;
/** The clamp overshoot — see the note at the CLAMP verdict for the 38-body measurement. */
export const CLAMP_MARGIN = 1.001;
/** The lane BUILDS against this one and reports the other two; the chair signs. */
export const PROVISIONAL_FLOOR = 'F-C';

/**
 * @param {{ frontage:number, inkDetail:number, candidate?:string }} a
 * @returns {{ minShort:number, minArea:number, candidate:string, source:string }}
 */
export function floorsFor(a) {
  const candidate = a.candidate || PROVISIONAL_FLOOR;
  const c = FLOOR_CANDIDATES[candidate] || FLOOR_CANDIDATES[PROVISIONAL_FLOOR];
  const minShort = c.detailStrokes != null ? c.detailStrokes * a.inkDetail : c.shortFrontages * a.frontage;
  return { minShort, minArea: minShort * minShort * AREA_ASPECT, candidate, source: c.source };
}

/* ══════════════════════════ GEOMETRY ══════════════════════════ */

/** Minimum-width rotating caliper over the polygon's own edge normals — the true SHORT AXIS. */
export function shortAxisOf(poly) {
  if (!poly || poly.length < 3) return 0;
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const dx = q[0] - p[0], dy = q[1] - p[1];
    const L = Math.sqrt(dx * dx + dy * dy);
    if (L < 1e-9) continue;
    const nx = -dy / L, ny = dx / L;
    let lo = Infinity, hi = -Infinity;
    for (const r of poly) { const d = r[0] * nx + r[1] * ny; if (d < lo) lo = d; if (d > hi) hi = d; }
    const w = hi - lo;
    if (w < best) best = w;
  }
  return Number.isFinite(best) ? best : 0;
}

/** Scale a polygon about its own centroid. Used only by the CLAMP verdict. */
function scaleAbout(poly, k) {
  const c = centroid(poly);
  return poly.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k]);
}

/**
 * The convex hull of two bodies — the FUSED mass. A party-walled pair IS one mass at plan
 * register, which is REG-1's own finding; the hull is what a surveyor would have inked.
 */
function hull2(a, b) {
  const pts = a.concat(b).slice().sort((p, q) => (p[0] - q[0]) || (p[1] - q[1]));
  const cross = (o, p, q) => (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]);
  const lo = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  const hi = [];
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  lo.pop(); hi.pop();
  return lo.concat(hi);
}

/* ══════════════════════════ THE PASS ══════════════════════════ */

/**
 * ⭐ MONUMENT CLASSES — never a fusion's JUNIOR partner (§630.3). The set is the drawn-body
 * KINDS the silhouette read is about, not a taste list.
 */
export const MONUMENT_KINDS = Object.freeze(new Set(['institution', 'landmark']));

/**
 * ⭐⭐ THE SUBJECT SET, and it is `drawnBodySet()`'s — the §195.0 DRAWN set the sealed wall-circuit
 * pin already uses — MINUS the §10 state bodies, with the reason stated rather than assumed:
 *
 *   ⛔ A SIEGE TENT AND A QUARANTINE BAR ARE NOT BUILDINGS, and §630's directive is about
 *      buildings ("no small one room blocks"). Suppressing a besieger's tent for being small
 *      would delete a state expression the §10 law requires to be visible.
 *   ⛔ THE §18.4 MIDDLE ROWS ARE EXCLUDED TOO, and this one is a judgment rather than a
 *      definition: a hardened market row IS a building by history, but it is drawn by REG-4's
 *      own market-infill FOSSIL arm at the void's register, where a row is one member of a set
 *      and its smallness is the point. Recorded as J-REG4-6 rather than smuggled.
 *
 * `sole` is TRUE for a habitation whose dwelling record carries exactly one solid — §630.4's
 * "a hermitage, a bothy, a wayside chapel standing alone IS its site".
 */
export function minFootprintBodies({ drawn, lod, seatedAll, habitation, keepers }) {
  /** @type {Array<any>} */ const out = [];
  const merged = (lod && lod.mergedKeys) || new Set();
  const has = (m, k) => (m instanceof Set ? m.has(k) : !!(m && m[k]));
  for (const p of drawn.parcels) {
    if (has(merged, p.key)) continue;
    if (p.polygon && p.polygon.length >= 3) out.push({ key: p.key, kind: 'parcel', poly: p.polygon, sole: false });
    if (p.backHouse && p.backHouse.length >= 3) out.push({ key: `${p.key}#back`, kind: 'backHouse', poly: p.backHouse, sole: false });
  }
  for (const m of ((lod && lod.masses) || [])) if (m.polygon && m.polygon.length >= 3) out.push({ key: m.key, kind: 'mass', poly: m.polygon, sole: false });
  for (const h of (drawn.huts || [])) if (h.polygon && h.polygon.length >= 3) out.push({ key: h.key, kind: 'hut', poly: h.polygon, sole: false });
  for (const lm of (seatedAll || [])) {
    for (let i = 0; i < (lm.solids || []).length; i++) {
      if (lm.solids[i] && lm.solids[i].length >= 3) out.push({ key: `${lm.instanceKey}#${i}`, kind: 'institution', poly: lm.solids[i], sole: false });
    }
  }
  const dwellings = (habitation ? habitation.dwellings : []).concat(keepers ? keepers.dwellings : []);
  for (const h of dwellings) {
    const n = (h.solids || []).length;
    for (let i = 0; i < n; i++) {
      if (h.solids[i] && h.solids[i].length >= 3) out.push({ key: `${h.key}#${i}`, kind: 'steading', poly: h.solids[i], sole: n === 1 });
    }
  }
  for (const b of (drawn.faubourgBuildings || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'faubourg', poly: b.polygon, sole: false });
  for (const b of (drawn.faubourgLeanTos || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'leanTo', poly: b.polygon, sole: false });
  return out;
}

/**
 * @param {Object} a
 * @param {Array<{key:string, kind:string, poly:number[][], site?:string|null, sole?:boolean}>} a.bodies
 *   the DRAWN set, in the leaf's own draw order.
 * @returns {{ verdicts:Object, replace:Object, absorbed:Object, counts:Object, floors:Object, reason:string }}
 */
export function applyMinFootprint(a) {
  const { bodies, frontage, inkDetail, candidate } = a;
  const floors = floorsFor({ frontage, inkDetail, candidate });
  const { minShort, minArea } = floors;
  /** the fusion reach: a neighbour is "adjacent" when it comes within one floor of the sliver. */
  const reach = minShort;

  /** @type {Record<string,string>} */ const verdicts = {};
  /** @type {Record<string,number[][]>} */ const replace = {};
  /** @type {Record<string,string[]>} */ const absorbed = {};
  const counts = { tested: 0, sub: 0, fused: 0, clamped: 0, dropped: 0, kept: 0 };

  // Index the drawable bodies by a coarse grid so the neighbour search is not quadratic over a
  // metropolis's 2,290 parcels.
  const CELL = Math.max(1e-6, reach * 4);
  /** @type {Map<string, number[]>} */ const grid = new Map();
  const metrics = new Array(bodies.length);
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    const s = shortAxisOf(b.poly), ar = absArea(b.poly);
    metrics[i] = { s, ar, sub: s < minShort || ar < minArea, c: centroid(b.poly), bb: bounds(b.poly) };
    counts.tested++;
    if (metrics[i].sub) counts.sub++;
  }
  for (let i = 0; i < bodies.length; i++) {
    if (metrics[i].sub) continue;                    // only DRAWABLE bodies can host a fusion
    const c = metrics[i].c;
    const gx = Math.floor(c[0] / CELL), gy = Math.floor(c[1] / CELL);
    const k = `${gx}|${gy}`;
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(i);
  }
  /** squared gap between two bounding boxes — a cheap, exact-enough adjacency for plan bodies */
  const gap2 = (A, B) => {
    const dx = Math.max(0, Math.max(A.x0 - B.x1, B.x0 - A.x1));
    const dy = Math.max(0, Math.max(A.y0 - B.y1, B.y0 - A.y1));
    return dx * dx + dy * dy;
  };

  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i], m = metrics[i];
    if (!m.sub) { verdicts[b.key] = 'keep'; counts.kept++; continue; }
    // ⭐ §630.4 — the SOLE-STRUCTURE and TYPED-LANDMARK exemption comes FIRST, because a
    // hermitage that fuses into the barn beside it is not a hermitage.
    if (b.sole === true || MONUMENT_KINDS.has(b.kind)) {
      const kS = m.s > 0 ? minShort / m.s : 1;
      const kA = m.ar > 0 ? Math.sqrt(minArea / m.ar) : 1;
      // ⚠ `CLAMP_MARGIN` AND NOT A BARE `max`, and the reason is a measurement rather than a
      // superstition. Scaling by exactly `minShort / s` lands the short axis on `minShort` to
      // within float error, and the census tests `s < minShort` — so 38 of 23,436 clamped bodies
      // came back sub-minimum at values like `s = 1.8` against `minShort = 1.8` and
      // `a = 32.940` against `minArea = 32.941`. "Clamped UP TO the floor" means AT LEAST the
      // floor; a tenth of a percent is invisible on the page and exact in the census.
      const k = Math.max(1, kS, kA) * CLAMP_MARGIN;
      verdicts[b.key] = 'clamp';
      replace[b.key] = scaleAbout(b.poly, k);
      counts.clamped++;
      continue;
    }
    // FUSE into the nearest drawable neighbour within reach.
    const c = m.c;
    const gx = Math.floor(c[0] / CELL), gy = Math.floor(c[1] / CELL);
    let host = -1, bestD = Infinity;
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const cell = grid.get(`${gx + ox}|${gy + oy}`);
        if (!cell) continue;
        for (const j of cell) {
          if (j === i) continue;
          const g = gap2(m.bb, metrics[j].bb);
          if (g > reach * reach) continue;
          const dx = c[0] - metrics[j].c[0], dy = c[1] - metrics[j].c[1];
          const d = dx * dx + dy * dy;
          if (d < bestD) { bestD = d; host = j; }
        }
      }
    }
    if (host >= 0) {
      const hk = bodies[host].key;
      const base = replace[hk] || bodies[host].poly;
      replace[hk] = hull2(base, b.poly);
      if (!absorbed[hk]) absorbed[hk] = [];
      absorbed[hk].push(b.key);
      verdicts[b.key] = 'fuse';
      counts.fused++;
    } else {
      verdicts[b.key] = 'drop';
      counts.dropped++;
    }
  }
  return {
    verdicts, replace, absorbed, counts, floors,
    reason: `L-REG-30 (${floors.candidate}: short ≥ ${Math.round(minShort * 1000) / 1000},`
      + ` area ≥ ${Math.round(minArea * 1000) / 1000} — ${floors.source}):`
      + ` ${counts.sub} of ${counts.tested} drawn bodies are sub-minimum —`
      + ` ${counts.fused} fused into a neighbour, ${counts.clamped} clamped up to the floor`
      + ` (sole structure or typed landmark), ${counts.dropped} not drawn`,
  };
}
