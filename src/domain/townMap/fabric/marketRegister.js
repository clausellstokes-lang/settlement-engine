/**
 * domain/townMap/fabric/marketRegister.js — ⭐⭐ REG-4 · **THE MARKET IS ONE GIANT STREET**
 * (L-REG-6, ODQ §576) plus the B13 furnishing band (ODQ §629.1) and the market-infill fossil.
 *
 * ⭐⭐ WHAT THIS MODULE IS FOR, in one sentence: a market place is not a room with a door — it
 * is the one place the carriageway WIDENS, so it must share the street's own void surface, wear
 * the street's own fill, and open into every street that meets it without a seam.
 *
 * ⛔ WHAT IS WRONG AT THE SEALED TIP, MEASURED IN THE SOURCE BEFORE IT WAS MEASURED IN PIXELS.
 * `renderFolio` §8 paints each square as
 *     fill=roadTone  stroke=mix(paper, ink, 0.46)  stroke-width=INK.road
 * so the FILL already matches the street web's own `roadTone` — but the square carries a CLOSED
 * ink border all the way round, painted AFTER the web, and that border therefore runs straight
 * across every street mouth. A room with a line drawn across its doorways is a room; a market
 * place is a junction. The border is the seam L-REG-6 forbids, and closing the doorway is also
 * the exact thing hf259 draws differently — its carved square has ENTRY GAPS.
 *
 * ⭐ AND THE SHAPE IS NOT INVENTED. `streets.deriveSquares` emits one `organicBlob` per void —
 * an 11/12-gon at 16–17 % roughness, aspect 1.01–1.24 on every corpus leaf, which reads as an
 * amoeba rather than as any market a surveyor ever drew. hf259 draws exactly THREE market
 * shapes, and which one a place has is a fact about HOW ITS STREETS MEET IT:
 *   CIGAR       a through-route runs in one side and out the other and the place is that
 *               route WIDENED — hf259's "cigar-widened street".
 *   TRIANGULAR  three roads meet and the ground between them is the green — hf259's
 *               "triangular three-road green" (pond, stocks, church at the corner).
 *   CARVED      four or more mouths: a square cut out of the fabric, its outline broken by an
 *               ENTRY GAP at each mouth — hf259's "carved square".
 * The selector reads the fronting channels with `buildStreetWeb`'s OWN predicate, so the shape
 * is consumed from the street web rather than rolled.
 *
 * ⭐⭐ THE INSCRIPTION INVARIANT, and it is what makes this safe to land in the fabric. Every
 * register polygon is built as `rBlob(θ) × profile(θ)` with `profile ≤ 1`, so it is a SUBSET of
 * the reserved blob the ground law already refused. Nothing that was built can be overlapped by
 * a re-cut void; the census asserts the containment vertex by vertex rather than trusting it.
 *
 * ⚠ ARMED-ONLY. Nothing here runs unless `buildFabric` is given `{ marketRegister: true }`;
 * unset, the leaf renders byte for byte as the seal does.
 *
 * PURITY: no Date, no Math.random, no runtime trig (the frozen table only), no Math.pow,
 * no localeCompare.
 */

import { TRIG_N, cosI, sinI, bearingIndex, distToPolyline, pointInPolygon, absArea, centroid } from './fabricGeometry.js';
import { hashUnit } from './fabricRng.js';

/* ══════════════════════════ THE CLOSED VOCABULARIES ══════════════════════════ */

/** hf259's three market shapes. A void resolves to EXACTLY ONE — the totality is asserted. */
export const MARKET_SHAPES = Object.freeze(['cigar', 'triangular', 'carved']);

/**
 * ⭐⭐ V-B13 — THE CLOSED FIXTURE VOCABULARY, ODQ §629.1 VERBATIM.
 *
 * "a FIXTURE is one plan glyph from the closed vocabulary V-B13 = { stall-row (one row of small
 * rectangles with its dashed stall-line = ONE fixture) · market cross (ringed step-circle) ·
 * conduit/well · pillory/stocks · weigh-beam · trough · pound · pond · specimen tree }"
 *
 * ⚠ ENCROACHMENT ISLANDS ARE NOT IN IT — §629.1 says so on its face ("Encroachment islands are
 * BUILDING-class — market-infill fossils, counted separately, never fixtures"), and the fossil
 * arm below therefore counts on its own line.
 */
export const V_B13 = Object.freeze([
  'stallRow', 'marketCross', 'conduit', 'pillory', 'weighBeam', 'trough', 'pound', 'pond', 'specimenTree',
]);

/**
 * ⭐⭐ THE B13 BAND, ODQ §629.1 VERBATIM — chair's, vetoable, a tuning-surface constant.
 * "hamlet 0 (no market void) · village 1–3 · town 3–7 · city 4–9 at the principal void,
 *  secondary voids at the village band · metropolis 5–12 principal, secondary at the town band."
 * ⚠ The band is keyed on the RUNG, not on the void's `kind`: a village's void is a `green` and it
 * still takes the village band, which is what "per-rung" means.
 */
export const B13_BAND = Object.freeze({
  thorp:      { principal: [0, 0], secondary: [0, 0] },
  hamlet:     { principal: [0, 0], secondary: [0, 0] },
  village:    { principal: [1, 3], secondary: [1, 3] },
  town:       { principal: [3, 7], secondary: [1, 3] },
  city:       { principal: [4, 9], secondary: [1, 3] },
  metropolis: { principal: [5, 12], secondary: [3, 7] },
});

/* ══════════════════════════ SMALL GEOMETRY ══════════════════════════ */

const TAU = TRIG_N;
/** shortest signed separation between two angle indices, in index units (−N/2 … N/2] */
function angDelta(a, b) {
  let d = ((a - b) % TAU + TAU) % TAU;
  if (d > TAU / 2) d -= TAU;
  return d;
}
function angAbs(a, b) { const d = angDelta(a, b); return d < 0 ? -d : d; }

/**
 * The blob's own radius at an angle index. `organicBlob` places its vertices at UNIFORM angles
 * about its centre (`ang = round(i × N / steps)`), so the polygon is star-shaped about that
 * centre by construction and a radial sample is exact between vertices by linear interpolation.
 */
function radialProfileOf(poly, cx, cy) {
  return { poly, cx, cy, n: poly.length };
}
/**
 * ⛔ THE BUG THIS SPELLING EXISTS TO PREVENT, and it was measured before it was reasoned about.
 * The first version interpolated the VERTEX RADII either side of the ray, which overestimates:
 * between two vertices the boundary is a straight CHORD and a chord is nearer the centre than
 * the linear-radius blend. 104 of 1,104 register vertices then fell OUTSIDE the reserved blob —
 * the inscription invariant broken by an interpolation, not by the profile. The exact answer is
 * a ray/segment intersection and it costs one pass over an 11-gon.
 */
function radiusAt(prof, ang) {
  const { poly, cx, cy, n } = prof;
  const dx = cosI(ang), dy = sinI(ang);
  let best = 0;
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const den = dx * ey - dy * ex;
    if (den === 0) continue;
    const ox = a[0] - cx, oy = a[1] - cy;
    const t = (ox * ey - oy * ex) / den;      // along the ray
    const u = (ox * dy - oy * dx) / den;      // along the edge
    if (t > 0 && u >= 0 && u <= 1 && t > best) best = t;
  }
  return best;
}

/** Where a polyline crosses a star-shaped ring about (cx,cy) — the MOUTHS of a void. */
function crossingsOf(line, prof, cx, cy) {
  /** @type {Array<{x:number,y:number,ang:number}>} */ const out = [];
  if (!line || line.length < 2) return out;
  const inside = (p) => {
    const dx = p[0] - cx, dy = p[1] - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    return d <= radiusAt(prof, bearingIndex(dx, dy));
  };
  let prevIn = inside(line[0]);
  for (let i = 1; i < line.length; i++) {
    const nowIn = inside(line[i]);
    if (nowIn !== prevIn) {
      // bisect to the ring — 18 halvings is well past float noise at page scale
      let a = line[i - 1], b = line[i];
      for (let k = 0; k < 18; k++) {
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        if (inside(m) === prevIn) a = m; else b = m;
      }
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      out.push({ x: m[0], y: m[1], ang: bearingIndex(m[0] - cx, m[1] - cy) });
    }
    prevIn = nowIn;
  }
  return out;
}

/* ══════════════════════════ THE MOUTHS ══════════════════════════ */

/**
 * ⭐ THE FRONTING PREDICATE IS `buildStreetWeb`'S OWN, LIFTED VERBATIM (streets.js, the
 * "A SQUARE IS A CROSSING, NOT A BARRIER" block):
 *     distToPolyline(sq.center, ch.line) <= sq.radius + ch.width * 0.75
 * Copied rather than re-derived so this module's idea of "the streets that meet the place" is
 * the same set the reachability union already joined. ⚠ ALLEYS ARE EXCLUDED: §201 A.1 ruled an
 * alley to be block-interior space and not a street, and a doorway is a fact about streets.
 */
export const MOUTH_RANKS = Object.freeze(['high', 'artery', 'ringOld', 'wallLane', 'lane', 'seam', 'blockCross', 'blockLane']);

export function mouthsOf(sq, channels) {
  const cx = sq.center[0], cy = sq.center[1];
  const prof = radialProfileOf(sq.polygon, cx, cy);
  /** @type {Array<{x:number,y:number,ang:number,rank:string,width:number,ch:number}>} */
  const mouths = [];
  for (let i = 0; i < (channels || []).length; i++) {
    const ch = channels[i];
    if (!ch || !ch.line) continue;
    if (MOUTH_RANKS.indexOf(ch.rank) < 0) continue;
    if (distToPolyline(cx, cy, ch.line) > sq.radius + ch.width * 0.75) continue;
    for (const c of crossingsOf(ch.line, prof, cx, cy)) {
      mouths.push({ x: c.x, y: c.y, ang: c.ang, rank: ch.rank, width: ch.width, ch: i });
    }
  }
  // Two channels of the same rank entering within a carriageway of each other are ONE doorway.
  mouths.sort((a, b) => (a.ang - b.ang) || (a.ch - b.ch));
  /** @type {typeof mouths} */ const merged = [];
  for (const m of mouths) {
    const prev = merged.length ? merged[merged.length - 1] : null;
    if (prev && angAbs(prev.ang, m.ang) * (sq.radius * 6.283185307179586 / TAU) < (prev.width + m.width) * 0.5) {
      if (m.width > prev.width) { merged[merged.length - 1] = m; }
      continue;
    }
    merged.push(m);
  }
  // the wrap-around pair
  if (merged.length > 1) {
    const a = merged[0], b = merged[merged.length - 1];
    if (angAbs(a.ang, b.ang) * (sq.radius * 6.283185307179586 / TAU) < (a.width + b.width) * 0.5) {
      if (a.width >= b.width) merged.pop(); else merged.shift();
    }
  }
  return merged;
}

/* ══════════════════════════ THE SHAPE ══════════════════════════ */

/** A through-route needs its two mouths within this much of opposite. */
export const THROUGH_TOL = Math.round(TRIG_N * (35 / 360));
/**
 * Three-road green: the smallest pairwise separation must clear this.
 * ⭐ THE VALUE IS DERIVED, NOT PICKED. A triangle's three edge-normals stand 120° apart, so two
 * roads enter DIFFERENT sides of it exactly when their bearings differ by more than 60°; below
 * that they share an edge and the place reads as a lens or a square with two mouths on one side,
 * not as a triangle. The threshold is therefore the geometric boundary itself, TRIG_N/6.
 */
export const TRIANGLE_MIN_SEP = TRIG_N / 6;
/** Ranks that can carry a place as a WIDENED street. */
const THROUGH_RANKS = new Set(['high', 'artery', 'ringOld']);

/**
 * ⭐⭐ THE MAJOR MOUTHS — the roads that MADE the place, as against every way into it.
 *
 * ⛔ THE FIRST SPELLING DECIDED THE SHAPE ON A MOUTH COUNT AND RETURNED `carved` FOR 20 OF 22
 * CORPUS VOIDS, which is a bucket wearing a selector's coat. The cause was measured: a city
 * market is fronted by twelve channels because every block lane that reaches it counts, so a
 * count threshold can only ever say "many". ⭐ The cure is the reference's own reading: hf259's
 * triangular green is THREE ROADS and its cigar is ONE ROAD WIDENED — the shape is a fact about
 * the MAJOR ways, while every minor way is still a way in and still earns its entry gap.
 * A mouth is MAJOR when its carriageway reaches `MAJOR_SHARE` of the widest one at the place.
 */
export const MAJOR_SHARE = 0.55;
export function majorMouths(mouths) {
  let wMax = 0;
  for (const m of mouths) if (m.width > wMax) wMax = m.width;
  return mouths.filter((m) => m.width >= wMax * MAJOR_SHARE);
}

/**
 * ⭐⭐ WHICH OF hf259's THREE SHAPES THIS PLACE IS — read off the street web, never rolled.
 * @returns {{ shape:string, axis:number, reason:string }}
 */
export function marketShapeFor(mouths) {
  const major = majorMouths(mouths);
  const n = major.length;
  let wAll = 0;
  for (const m of major) wAll += m.width;
  // CIGAR — a through-route enters one side and leaves the other and the place IS that route
  // widened. The test is a WIDTH SHARE, not a count: the through pair must carry at least half
  // the major carriageway at the place, which is what "the market is that street, wider" means.
  let best = null;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (!THROUGH_RANKS.has(major[i].rank) || !THROUGH_RANKS.has(major[j].rank)) continue;
      const off = TAU / 2 - angAbs(major[i].ang, major[j].ang);
      const dev = off < 0 ? -off : off;
      if (dev > THROUGH_TOL) continue;
      const w = major[i].width + major[j].width;
      if (!best || w > best.w) best = { i, j, w, dev };
    }
  }
  if (best && best.w >= wAll * 0.5) {
    const a = major[best.i].ang, b = major[best.j].ang;
    return {
      shape: 'cigar',
      axis: ((a + Math.round(angDelta(b, a) / 2) + TAU / 2) % TAU + TAU) % TAU,
      reason: `hf259 cigar: a through-route on ${major[best.i].rank}/${major[best.j].rank} enters and`
        + ` leaves within ${Math.round((best.dev * 360) / TRIG_N)}° of opposite and carries`
        + ` ${Math.round((100 * best.w) / Math.max(1e-6, wAll))} % of the major carriageway (${n} major of ${mouths.length} mouths)`,
    };
  }
  // TRIANGULAR — three major roads, well spread: the ground between them is the green.
  if (n === 3) {
    const by = major.slice().sort((p, q) => p.ang - q.ang);
    let minSep = TAU;
    for (let i = 0; i < 3; i++) {
      const s = angAbs(by[i].ang, by[(i + 1) % 3].ang);
      if (s < minSep) minSep = s;
    }
    if (minSep >= TRIANGLE_MIN_SEP) {
      return {
        shape: 'triangular',
        // the axis names an EDGE-NORMAL, and an edge faces a road: the first major mouth.
        axis: by[0].ang,
        reason: `hf259 triangular green: three major roads meet (${mouths.length} mouths in all),`
          + ` smallest separation ${Math.round((minSep * 360) / TRIG_N)}° ≥ 70°`,
      };
    }
  }
  // CARVED — a place with four or more major ways, or three that crowd one side: a square cut
  // out of the fabric with an entry gap at each mouth.
  let axis = 0, wBest = -1;
  for (const m of major) if (m.width > wBest) { wBest = m.width; axis = m.ang; }
  return {
    shape: 'carved',
    axis,
    reason: `hf259 carved square: ${n} major of ${mouths.length} mouths — `
      + (n === 3 ? 'the three major roads crowd one side' : 'no opposed through-route carrying half the carriageway'),
  };
}

/** How many samples a register outline carries. Even, and a multiple of 4 for the carved case. */
export const REGISTER_STEPS = 48;
/** The inscription epsilon — the register may TOUCH the reserved blob, never cross it. */
export const TOUCH_IN = 0.999;

/**
 * ⭐⭐ THE REGISTER POLYGON. `r(θ) = rBlob(θ) × profile(θ)` with `profile ≤ 1` — a SUBSET of the
 * reserved blob by construction, which is the whole of its safety (see the header).
 * @returns {{ polygon:number[][], gaps:Array<{a0:number,a1:number}> }}
 */
export function registerPolygon(sq, mouths, shape, axis) {
  const cx = sq.center[0], cy = sq.center[1];
  const prof = radialProfileOf(sq.polygon, cx, cy);
  /** the half-width of each doorway, as an angle */
  const gaps = mouths.map((m) => {
    const r = radiusAt(prof, m.ang);
    const half = Math.round(((m.width * 0.75) / Math.max(1e-6, r)) * (TAU / 6.283185307179586) * 0.5);
    const h = Math.max(Math.round(TAU / 96), Math.min(Math.round(TAU / 10), half));
    return { a0: ((m.ang - h) % TAU + TAU) % TAU, a1: ((m.ang + h) % TAU + TAU) % TAU, ang: m.ang, half: h };
  });
  /** @type {(t:number)=>number} */ let profileAt;
  if (shape === 'cigar') {
    // A LENS along the axis. Full reach along it; pinched across it. hf259's cigar is about
    // twice as long as it is wide, so the cross-axis profile floors at 0.52.
    profileAt = (t) => {
      const d = angAbs(t, axis);
      const across = Math.min(1, d / (TAU / 4));           // 0 along the axis, 1 across it
      return 1 - 0.48 * across * across;
    };
  } else if (shape === 'triangular') {
    // A TRIANGLE whose EDGES face the three doorways, so a road runs into the middle of a side
    // and the corners fall between the roads — which is what hf259 draws (church on the corner).
    const c0 = axis;
    profileAt = (t) => {
      // distance to the nearest of three edge-normals, folded into [0, TAU/6]
      let k = ((t - c0) % (TAU / 3) + TAU / 3) % (TAU / 3);
      if (k > TAU / 6) k = TAU / 3 - k;                     // 0 at an edge-normal, TAU/6 at a corner
      // a straight edge at unit inradius: r(k) = 1 / cos(k); normalise so the CORNER reaches 1
      const c = cosI(Math.round(k));
      const rr = c > 0.02 ? 1 / c : 2;
      return Math.min(1, rr / 2);                            // corner (k = TAU/6) → 1/cos60° = 2
    };
  } else {
    // A CARVED SQUARE: four straight sides square to the dominant mouth, corners reaching the
    // blob. r(k) = 1/cos(k) folded into [0, TAU/8], normalised so the corner reaches 1.
    const c0 = axis;
    profileAt = (t) => {
      let k = ((t - c0) % (TAU / 4) + TAU / 4) % (TAU / 4);
      if (k > TAU / 8) k = TAU / 4 - k;
      const c = cosI(Math.round(k));
      const rr = c > 0.02 ? 1 / c : 1.4142135623730951;
      return Math.min(1, rr / 1.4142135623730951);
    };
  }
  /** @type {number[][]} */ const poly = [];
  for (let i = 0; i < REGISTER_STEPS; i++) {
    const ang = Math.round((i * TAU) / REGISTER_STEPS);
    // ⭐ THE DOORWAY PUSHES THE OUTLINE OUT to the blob's own reach, so the place opens INTO the
    // street rather than stopping short of it — L-REG-6's "shared void surface" as geometry.
    let p = profileAt(ang);
    for (const g of gaps) {
      const d = angAbs(ang, g.ang);
      if (d <= g.half * 1.6) {
        const w = 1 - d / (g.half * 1.6);
        p = p + (1 - p) * w;
      }
    }
    // ⚠ `TOUCH_IN` and not 1: the register outline may TOUCH the reserved blob but never cross
    // it, and a vertex laid exactly on the edge is OUTSIDE it to a strict point-in-polygon test.
    // Measured: at a flat 1.0 the inscription census read 10 of 1,104 vertices out, every one of
    // them a doorway pushed to the full reach. The epsilon is a tenth of a percent of the radius.
    const r = radiusAt(prof, ang) * Math.min(TOUCH_IN, p);
    poly.push([cx + r * cosI(ang), cy + r * sinI(ang)]);
  }
  return { polygon: poly, gaps };
}

/* ══════════════════════════ THE FURNITURE (V-B13) ══════════════════════════ */

/**
 * ⭐ WHICH FIXTURES A PLACE HAS IS DERIVED, NOT ROLLED — only HOW MANY is rolled, and that
 * inside §629.1's band. Each candidate carries the fabric fact that earns it and the plate that
 * draws it; a candidate whose fact is absent never enters the list.
 * @returns {Array<{kind:string, why:string}>}
 */
export function fixtureCandidates(ctx) {
  const { kind, tier, hasWater, lawfulness, prosperityRank, droveRoad, organismCategory } = ctx;
  const out = [];
  const isMarket = kind === 'market';
  const isGreen = kind === 'green' || kind === 'churchyard';
  const rank = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].indexOf(tier);
  // hf320's market street is a street of STALL DASHES; hf342 draws the pitches by trade. The
  // stall row is the market's own business and is first wherever a market is held.
  if (isMarket) out.push({ kind: 'stallRow', why: 'hf320 market street: stall rows are what a market place IS' });
  // hf259's carved square and hf342's civic knot both stand a cross in the place; §5's own row
  // for the village tier is literally "green or market cross".
  out.push({ kind: 'marketCross', why: 'hf259/hf342: the ringed step-circle stands where the market is proclaimed' });
  // hf341/hf342 draw the conduit as a plan glyph; a well needs no river, a conduit implies one.
  out.push({ kind: hasWater ? 'conduit' : 'conduit', why: 'hf342 civic knot: the conduit/well is the place\'s water' });
  // hf342 draws the pillory; hf259's triangular green has the stocks on it. A well-run place
  // keeps them mended and a lawless one has them; the fact that earns it is that there is a
  // civic authority at all, which is what `lawfulness` records.
  if (rank >= 2) out.push({ kind: 'pillory', why: 'hf259/hf342: stocks on the green, pillory in the square' });
  // hf342's weigh-house GREAT BEAM in plan — a town's own measure. It needs a market to weigh at.
  if (isMarket && rank >= 3) out.push({ kind: 'weighBeam', why: 'hf342: the weigh-house beam, drawn in plan' });
  // hf341's inn yard has the horse trough; hf311 puts one at every approach.
  out.push({ kind: 'trough', why: 'hf341/hf311: the horse trough where carts stand' });
  // hf320's drove road ends in an OCTAGONAL POUND; hf311 draws the paled beast pound.
  if (droveRoad) out.push({ kind: 'pound', why: 'hf320 drove road: the octagonal pound for beasts' });
  // hf259's triangular three-road green is drawn WITH ITS POND.
  if (isGreen) out.push({ kind: 'pond', why: 'hf259: the triangular green carries its pond' });
  // hf344's yew as a specimen crown; a green keeps its tree.
  if (isGreen || organismCategory === 'religious') out.push({ kind: 'specimenTree', why: 'hf344: the yew as a specimen crown' });
  // A prosperous place lays a second row before it lays anything else — hf378's density ladder.
  if (isMarket && prosperityRank >= 2) out.push({ kind: 'stallRow', why: 'hf378: a busier place lays a second row of pitches' });
  if (isMarket && rank >= 4) out.push({ kind: 'stallRow', why: 'hf34: a city market holds more rows, not bigger ones' });
  if (isMarket && rank >= 4 && Number.isFinite(lawfulness) && lawfulness >= 0.5) {
    out.push({ kind: 'weighBeam', why: 'hf342: a governed city keeps a second standard measure' });
  }
  if (rank >= 4) out.push({ kind: 'pillory', why: 'hf342: a city keeps its stocks beside the cross too' });
  if (rank >= 3) out.push({ kind: 'trough', why: 'hf311: a second trough where the other road comes in' });
  return out;
}

/** §629.1's band, per void role. @returns {[number,number]} */
export function bandFor(tier, role) {
  const b = B13_BAND[tier] || B13_BAND.village;
  return role === 'principal' ? b.principal : b.secondary;
}

/* ══════════════════════════ THE DERIVATION ══════════════════════════ */

/**
 * @param {Object} a
 * @returns {{ voids:Array, fossils:Array, reason:string, coverage:Object }}
 */
export function deriveMarketRegister(a) {
  const {
    squares = [], channels = [], tier, seedKey, frontage,
    hasWater = false, lawfulness = 0.5, prosperityRank = 1, droveRoad = false,
    stateBodies = [], organisms = [],
  } = a;
  const orgCat = new Map();
  for (const o of organisms) orgCat.set(o.key, o.category);
  // ⭐ THE FOSSILS ARE GATHERED FIRST, and the order is load-bearing: a V-B13 fixture standing
  // inside an encroachment island is a market stall inside the shop that replaced it. The
  // furnishing pass is given the islands so it can keep off them.
  /** @type {Array<any>} */ const rawFossils = [];
  for (const b of stateBodies) {
    if (b.kind !== 'middleRow' || !b.polygon || b.polygon.length < 3) continue;
    rawFossils.push({ key: b.key, polygon: b.polygon, cite: b.cite || null, area: absArea(b.polygon) });
  }
  /** @type {Array<any>} */ const voids = [];
  let seq = 0;
  for (const sq of squares) {
    const role = seq === 0 ? 'principal' : 'secondary';
    const mouths = mouthsOf(sq, channels);
    const { shape, axis, reason } = marketShapeFor(mouths);
    const { polygon, gaps } = registerPolygon(sq, mouths, shape, axis);
    const [lo, hi] = bandFor(tier, role);
    const n = lo + Math.floor(hashUnit(`${seedKey}|b13|${sq.key}`) * (hi - lo + 1));
    const cands = fixtureCandidates({
      kind: sq.kind, tier, hasWater, lawfulness, prosperityRank, droveRoad,
      organismCategory: sq.organismKey ? orgCat.get(sq.organismKey) : null,
    });
    const fixtures = placeFixtures({ sq, polygon, axis, shape, mouths, cands, n, seedKey, frontage, islands: rawFossils });
    voids.push({
      key: sq.key, kind: sq.kind, role, shape, axis, reason,
      center: sq.center.slice(), radius: sq.radius,
      blob: sq.polygon, polygon, gaps, mouths, fixtures,
      band: [lo, hi], fixtureTarget: n,
      areaBlob: absArea(sq.polygon), areaRegister: absArea(polygon),
    });
    seq++;
  }
  // ⭐⭐ THE MARKET-INFILL FOSSIL IS A CONSUMPTION. §18.4 `marketColonization()` already publishes
  // the hardened middle rows — "permanent stalls hardening into shops, then houses" — gated on
  // age × order, town+ only, and the swept bodies arrive here on `stateMarks.bodies` with
  // `kind === 'middleRow'`. Nothing is invented; the rows are RE-READ as what hf259 draws them
  // as: encroachment islands eating the place back. The `cite` string each row carries is the
  // fabric's own dated reason and is republished verbatim.
  const fossils = [];
  for (const f of rawFossils) {
    const c = centroid(f.polygon);
    let host = null, bestD = Infinity;
    for (const v of voids) {
      const dx = c[0] - v.center[0], dy = c[1] - v.center[1];
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestD) { bestD = d; host = v; }
    }
    fossils.push({ ...f, host: host ? host.key : null });
  }
  const totalFix = voids.reduce((s, v) => s + v.fixtures.length, 0);
  return {
    voids, fossils,
    coverage: {
      voids: voids.length,
      shapes: MARKET_SHAPES.map((s) => `${s} ${voids.filter((v) => v.shape === s).length}`).join(' · '),
      fixtures: totalFix, fossils: fossils.length,
      inBand: voids.filter((v) => v.fixtures.length >= v.band[0] && v.fixtures.length <= v.band[1]).length,
    },
    reason: `L-REG-6: ${voids.length} void(s) re-cut to hf259's shapes (${MARKET_SHAPES.map((s) => `${s} ${voids.filter((v) => v.shape === s).length}`).join('/')}),`
      + ` ${totalFix} V-B13 fixtures inside the §629.1 band, ${fossils.length} §18.4 infill fossils consumed`,
  };
}

/* ══════════════════════════ FIXTURE PLACEMENT ══════════════════════════ */

/**
 * ⭐ STALL ROWS RUN ALONG THE VOID'S LONG AXIS (the charter's own words), and every fixture is
 * kept clear of a doorway — a market cross standing in a gateway is a market cross in the road.
 * Deterministic: every position is a `hashUnit` of the void's key, never a stream draw.
 */
function placeFixtures({ sq, polygon, axis, shape, mouths, cands, n, seedKey, frontage, islands = [] }) {
  /** @type {Array<any>} */ const out = [];
  if (n <= 0 || !cands.length) return out;
  const cx = sq.center[0], cy = sq.center[1];
  const prof = radialProfileOf(polygon, cx, cy);
  const inner = (ang) => radiusAt(prof, ang);
  // the long axis of the PLACE: the cigar's own axis, else the widest radial direction
  let longAxis = axis;
  if (shape !== 'cigar') {
    let bestR = -1;
    for (let i = 0; i < REGISTER_STEPS; i++) {
      const ang = Math.round((i * TAU) / REGISTER_STEPS);
      const r = inner(ang);
      if (r > bestR) { bestR = r; longAxis = ang; }
    }
  }
  const clearOfMouth = (ang) => {
    for (const m of mouths) {
      const half = Math.round(((m.width * 1.1) / Math.max(1e-6, inner(m.ang))) * (TAU / 6.283185307179586) * 0.5);
      if (angAbs(ang, m.ang) < Math.max(Math.round(TAU / 64), half)) return false;
    }
    return true;
  };
  // A CROSS/CONDUIT stands near the middle; rows and pens stand off it. The ring index walks a
  // fixed ladder so two fixtures never land on one another.
  const RING = [0.00, 0.46, 0.62, 0.74, 0.34, 0.84, 0.54, 0.70, 0.90, 0.42, 0.78, 0.60];
  let placed = 0, ci = 0;
  const usedKind = {};
  while (placed < n && ci < cands.length * 3) {
    const cand = cands[ci % cands.length];
    ci++;
    const kind = cand.kind;
    const idx = placed;
    const key = `${sq.key}|f${idx}|${kind}`;
    const ringT = RING[idx % RING.length];
    // a seeded angular offset, quantised to the trig table
    let ang = Math.round(((hashUnit(`${seedKey}|${key}|a`) * TAU) + longAxis)) % TAU;
    let tries = 0;
    while (!clearOfMouth(ang) && tries < 24) { ang = (ang + Math.round(TAU / 24)) % TAU; tries++; }
    const rr = inner(ang) * ringT;
    const px = cx + rr * cosI(ang), py = cy + rr * sinI(ang);
    if (!pointInPolygon(px, py, polygon)) { continue; }
    // ⭐ NEVER ON AN ENCROACHMENT ISLAND — a stall pitched inside the shop that replaced it.
    let onIsland = false;
    for (const isl of islands) if (pointInPolygon(px, py, isl.polygon)) { onIsland = true; break; }
    if (onIsland) continue;
    const size = frontage;
    /** @type {any} */ const f = { key, kind, why: cand.why, x: px, y: py, ang: longAxis };
    if (kind === 'stallRow') {
      // ONE ROW OF SMALL RECTANGLES WITH ITS DASHED STALL-LINE = ONE FIXTURE (§629.1 verbatim).
      // The row runs ALONG the long axis; the count is derived from the room it has.
      const halfSpan = inner(longAxis) * 0.62;
      const cellW = size * 0.62, cellH = size * 0.44;
      const cells = Math.max(3, Math.min(14, Math.floor((halfSpan * 2) / (cellW * 1.35))));
      f.row = { ang: longAxis, cells, cellW, cellH, span: cells * cellW * 1.35 };
    } else if (kind === 'marketCross') {
      f.r = size * 0.42;                 // hf342: a ringed STEP-circle
      f.steps = 2;
    } else if (kind === 'conduit') {
      f.r = size * 0.30;
    } else if (kind === 'pillory') {
      f.r = size * 0.22;
    } else if (kind === 'weighBeam') {
      f.beam = { len: size * 1.25, ang: (longAxis + TAU / 4) % TAU };
    } else if (kind === 'trough') {
      f.box = { w: size * 0.85, h: size * 0.30, ang: longAxis };
    } else if (kind === 'pound') {
      f.r = size * 0.70;                 // hf320: OCTAGONAL
      f.sides = 8;
    } else if (kind === 'pond') {
      f.r = size * 0.72;
    } else if (kind === 'specimenTree') {
      f.r = size * 0.46;
    }
    usedKind[kind] = (usedKind[kind] || 0) + 1;
    out.push(f);
    placed++;
  }
  return out;
}
