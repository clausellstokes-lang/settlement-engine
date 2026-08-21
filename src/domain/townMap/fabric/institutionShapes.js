/**
 * domain/townMap/fabric/institutionShapes.js — ⭐⭐⭐ THE DRAWN BODY OF AN INSTITUTION, and
 * the §17.4 FRONTING DERIVATION that orients it (chair directives ODQ §195.0 and §193.3).
 *
 * ⛔⛔⛔ WHY THIS FILE EXISTS — THE LARGEST PIN-VACUITY THIS FAMILY HAS FOUND.
 *
 * MF-B4 landed both ground-law censuses at ZERO on all ten exemplars and the chair's zoom
 * then found institution blocks plainly intersecting one another. Both facts were true:
 *
 *     **THE CENSUS MEASURED THE SET IT WAS HANDED, AND THE SET IT WAS HANDED WAS NOT THE
 *     SET THAT GETS DRAWN.**
 *
 * `enforceGround` swept `parcels`, `masses` and `huts`. An institution's drawn body was not
 * in any of those lists — it did not exist as geometry at all. The LENS built it, at render
 * time, out of the anchor: `archetypeShape` composed two to seven rotated rectangles spread
 * up to 2.3 × size from the anchor point, and nothing in the derivation had ever seen those
 * rectangles. The reservation the fabric DID hold was `COMPOUND_R` — a DISC of 1.35 × size,
 * granted only to institutions above the compound floor, which is neither the shape nor the
 * extent of what the lens draws and was never granted to an ordinary one at all.
 *
 * ⭐⭐⭐ THE CLASS, worth the chair's memory: **A CENSUS OVER A DERIVED SET PROVES NOTHING
 * ABOUT A SURFACE THE SET DOES NOT CONTAIN — and a shape composed downstream of the census
 * is exactly such a surface.** The cure is not a better census. It is to move the geometry
 * UPSTREAM of the census so there is only one shape: the fabric derives the institution's
 * solids, the ground law clips them like every other footprint, the census measures them,
 * and the lens DRAWS THE POLYGONS IT IS GIVEN rather than composing its own.
 *
 * ⛔⛔ AND THE SECOND DEFECT WAS IN THE SAME LINE OF CODE. The rotation was
 * `Math.floor(hashUnit(`${ik}|rot`) * 1024)` — a FREE HASH over the full turn, applied to
 * a hall, a nave, a warehouse range. §2.7 says building quads ROTATE WITH THEIR STREET and
 * §17.4 says facades sit ON the street line; a freely-rotated civic block obeys neither, and
 * the chair's read of the b4 central cluster — "rotated blocks ignoring streets" — is that
 * hash rendered at 1000 units. `frontInstitutions` below derives the rotation from the
 * street the building actually fronts, with a bounded seeded deviation, and RECORDS which
 * street each one answered to. An institution with no street within reach keeps a seeded
 * rotation and says so; that is the outlying mill, and it is not a defect.
 *
 * PURITY: no Date, no Math.random, no runtime trig (the frozen table only), no localeCompare.
 */

import { cosI, sinI, TRIG_N } from './trigTable.js';
import { bearingIndex, distToPolyline, rectAt } from './fabricGeometry.js';
import { hashUnit } from './fabricRng.js';
import { compareKeys } from './lineage.js';

/**
 * How far an institution looks for a street to front, in units of its own drawn size.
 * §42/§43 VALUE, ARGUED: 2.6 × size reaches from a building's own centre past its yard to
 * the far kerb of an ordinary lane. Beyond that the building is not ON a street, and
 * pretending otherwise would rotate a hillside chapel to answer a road it cannot see.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const FRONT_REACH = 2.6;

/**
 * How far an institution's own axis may deviate from its street's, as a share of a quarter
 * turn. §42/§43 VALUE, ARGUED: real frontages are not surveyed square to the road — but a
 * deviation past about a sixth of a right angle stops reading as a building on a street.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const FRONT_WOBBLE = 0.16;

/**
 * ⭐⭐ THE FRONTING DERIVATION (§17.4's positive half, §2.7, §161m).
 *
 * Each landmark takes the bearing of the nearest claim it fronts — a street channel, or the
 * edge of a square, which is the same relation at a larger scale (a guildhall fronts the
 * market place; that IS its street). The building's long axis runs ALONG that bearing, which
 * is how a hall, a nave and a warehouse range all sit on a street: broadside or gable-on by
 * archetype, never at a free angle to it.
 *
 * ⚠ IT MUTATES `rot` IN PLACE and returns the diagnostic, because the landmark records are
 * already threaded through seating and the compounds; copying them here would fork the
 * identity every downstream consumer keys on.
 *
 * @param {Object} args
 * @param {Array<any>} args.landmarks
 * @param {Array<any>} args.channels
 * @param {Array<any>} [args.squares]
 * @param {{seed:string|number}} args.seeding
 * @returns {{ fronted:number, free:number, byRank:Record<string,number>, reason:string }}
 */
export function frontInstitutions(args) {
  const { landmarks, channels, seeding } = args;
  const squares = args.squares || [];
  /** @type {Record<string, number>} */ const byRank = {};
  let fronted = 0, free = 0;

  // A fixed key order, so which street a building answers to cannot depend on array order.
  const ordered = landmarks.slice().sort((a, b) => compareKeys(String(a.instanceKey), String(b.instanceKey)));
  for (const lm of ordered) {
    const reach = Math.max(6, lm.size * FRONT_REACH);
    let best = null, bestD = Infinity;

    for (const ch of channels) {
      // ⭐ THE HIERARCHY IS PART OF THE ANSWER, NOT A TIE-BREAK. A guildhall on the corner of
      // the high street and an alley fronts the HIGH STREET; a rule that took the nearest
      // claim alone would turn its face to the alley whenever the alley ran a foot closer.
      // The bias is a fraction of the reach, so a genuinely distant high street never wins.
      const bias = RANK_BIAS[ch.rank] == null ? 0 : RANK_BIAS[ch.rank];
      const hit = nearestOnPolyline(lm.x, lm.y, ch.line);
      if (!hit) continue;
      const score = hit.d - reach * bias;
      if (hit.d <= reach && score < bestD) {
        bestD = score;
        best = { ax: hit.ax, ay: hit.ay, bx: hit.bx, by: hit.by, rank: ch.rank, key: ch.key || ch.rank };
      }
    }
    // A square is a claim of the same kind at a larger radius: the building fronts the void's
    // own edge, so the bearing is the TANGENT of the circle at the nearest point.
    for (const sq of squares) {
      if (!sq || !sq.center) continue;
      const dx = lm.x - sq.center[0], dy = lm.y - sq.center[1];
      const d = Math.sqrt(dx * dx + dy * dy);
      const gap = Math.abs(d - sq.radius);
      const score = gap - reach * RANK_BIAS.square;
      if (gap <= reach && d > 1e-6 && score < bestD) {
        bestD = score;
        best = { ax: lm.x - (-dy), ay: lm.y - dx, bx: lm.x + (-dy), by: lm.y + dx, rank: 'square', key: 'square' };
      }
    }

    if (!best) {
      // ⭐ THE HONEST CLASS: an institution with no street within reach is OUTLYING by the
      // §161c ring — the mill at its race, the quarry at its stone. It keeps its seeded
      // rotation, which is the correct answer for a building that answers to a hillside.
      lm.fronts = null;
      lm.frontReason = 'no claim within reach — outlying, seeded rotation kept';
      free++;
      continue;
    }
    const along = bearingIndex(best.bx - best.ax, best.by - best.ay);
    const wob = Math.round((hashUnit(`${seeding.seed}|front|${lm.instanceKey}`) - 0.5)
      * 2 * FRONT_WOBBLE * (TRIG_N / 4));
    lm.rot = ((along + wob) % TRIG_N + TRIG_N) % TRIG_N;
    lm.fronts = best.key;
    lm.frontRank = best.rank;
    lm.frontReason = `fronts a ${best.rank}`;
    byRank[best.rank] = (byRank[best.rank] || 0) + 1;
    fronted++;
  }
  return {
    fronted,
    free,
    byRank,
    reason: `§17.4 fronting: ${fronted} institutions took their street's bearing`
      + ` (${Object.keys(byRank).sort().map((r) => `${r} ${byRank[r]}`).join(', ') || 'none'});`
      + ` ${free} are outlying with no claim within ${FRONT_REACH} sizes and keep a seeded rotation`,
  };
}

/** The rank bias, as a share of the reach. The high street pulls hardest; an alley not at
 *  all. §42/§43 VALUES, ARGUED from the §160.2 hierarchy. ⚠ UNSOAKED. */
const RANK_BIAS = Object.freeze({
  high: 0.42, artery: 0.30, square: 0.34, seam: 0.18, quarter: 0.14,
  blockLane: 0.06, blockCross: 0.04, alley: 0, passage: -0.20,
});

/** Nearest point on a polyline, returning the SEGMENT so the caller gets a bearing. */
function nearestOnPolyline(px, py, line) {
  let best = null, bd = Infinity;
  for (let i = 0; i + 1 < line.length; i++) {
    const ax = line[i][0], ay = line[i][1], bx = line[i + 1][0], by = line[i + 1][1];
    const dx = bx - ax, dy = by - ay;
    const L = dx * dx + dy * dy;
    let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    const qx = ax + dx * t, qy = ay + dy * t;
    const d = Math.sqrt((px - qx) * (px - qx) + (py - qy) * (py - qy));
    if (d < bd) { bd = d; best = { d, ax, ay, bx, by }; }
  }
  return best;
}

/**
 * ⭐⭐ §6 SHAPE ARCHETYPES, expressed as COMPONENT ARRANGEMENTS (§165.1 — the variant selects
 * an arrangement of the SAME parts; it never mints a new glyph kind).
 *
 * ⚠ MOVED HERE FROM THE LENS (MF-B5, chair directive §195.0) AND OTHERWISE UNCHANGED IN ITS
 * COMPOSITIONS. The arrangement vocabulary is the same one MF-B1b drew; what changed is
 * WHERE it lives, so that the polygons the reader sees are the polygons the ground law
 * clipped and the census counted. A lens may choose ink, weight and role; it may not decide
 * what stands on the ground.
 *
 * ⚠ THE RELIGIOUS ARCHETYPE CARRIES THE §194/C2 CURE: the cross-plan is ONE culture profile's
 * expression and is no longer the default arrangement. The cross-cultural constant is the
 * PRECINCT WITH A YARD AND A VERTICAL MASS, so variant 0 is now the tower-and-hall reading
 * and the cruciform is one seeded arrangement among four. §3's no-baked-ornament law governs
 * plan shape exactly as it governs ornament.
 *
 * @param {any} lm  a seated landmark: { archetype, x, y, size, rot, variant, rung }
 * @returns {{ solids: Array<Array<[number,number]>>, voids: Array<Array<[number,number]>>, marks: Array<any> }}
 */
export function archetypeSolids(lm) {
  const s = lm.size, x = lm.x, y = lm.y, a = lm.rot, v = lm.variant || 0;
  const rect = (cx, cy, w, h, ang) => rectAt(cx, cy, w, h, ang);
  // A part offset along the building's OWN axes, so an arrangement rotates as one body.
  const off = (dx, dy) => [x + dx * cosI(a) - dy * sinI(a), y + dx * sinI(a) + dy * cosI(a)];
  switch (lm.archetype) {
    case 'worship': {
      const nave = rect(x, y, s * 0.72, s * 2.05, a);
      const parts = [nave];
      if (v === 0) { const [tx, ty] = off(0, -s * 0.95); parts.push(rect(tx, ty, s * 0.62, s * 0.62, a)); }
      else if (v === 1) { const [tx, ty] = off(0, -s * 0.30); parts.push(rect(tx, ty, s * 1.75, s * 0.66, a)); }
      else if (v === 2) { const [px, py] = off(s * 0.66, 0); parts.push(rect(px, py, s * 0.52, s * 1.4, a)); }
      else { const [ax2, ay2] = off(0, s * 0.92); parts.push(rect(ax2, ay2, s * 0.5, s * 0.36, a)); const [bx2, by2] = off(s * 0.6, 0); parts.push(rect(bx2, by2, s * 0.5, s * 0.8, a)); }
      return { solids: parts, voids: [], marks: [{ kind: 'ridge', poly: nave }, { kind: 'bays', poly: nave, n: 5 }] };
    }
    case 'cloister': case 'cloisterQuad': {
      const outer = rect(x, y, s * 1.9, s * 1.7, a);
      return { solids: [outer], voids: [rect(x, y, s * 1.0, s * 0.85, a)], marks: [{ kind: 'bays', poly: outer, n: 6 }] };
    }
    case 'hall': {
      const hall = rect(x, y, s * 2.1, s * 1.15, a);
      const parts = [hall];
      if (v % 2 === 0) { const [px, py] = off(0, s * 0.72); parts.push(rect(px, py, s * 0.85, s * 0.35, a)); }
      else { const [px, py] = off(-s * 0.9, 0); parts.push(rect(px, py, s * 0.5, s * 1.5, a)); }
      return { solids: parts, voids: [], marks: [{ kind: 'ridge', poly: hall }, { kind: 'bays', poly: hall, n: 4 }] };
    }
    case 'garrison': {
      const [bx, by] = off(-s * 0.5, 0);
      const block = rect(bx, by, s * 1.15, s * 1.6, a);
      const [yx, yy] = off(s * 0.75, 0);
      return { solids: [block], voids: [], marks: [{ kind: 'yard', poly: rect(yx, yy, s * 1.25, s * 1.6, a) }, { kind: 'ridge', poly: block }] };
    }
    case 'market': {
      const solids = [];
      const n = 4 + (v % 3);
      for (let i = 0; i < n; i++) {
        const [px, py] = off((i - (n - 1) / 2) * s * 0.46, (i % 2 ? s * 0.22 : -s * 0.22));
        solids.push(rect(px, py, s * 0.32, s * 0.72, a));
      }
      return { solids, voids: [], marks: [] };
    }
    case 'warehouse': case 'granary': {
      const b = rect(x, y, s * (lm.archetype === 'granary' ? 1.3 : 0.9), s * (lm.archetype === 'granary' ? 1.5 : 2.3), a);
      return { solids: [b], voids: [], marks: [{ kind: 'ridge', poly: b }, { kind: 'bays', poly: b, n: 4 }] };
    }
    case 'port': {
      const solids = [];
      const piers = 2 + lm.rung;                                     // §161n: MORE piers, not bigger ones
      for (let i = 0; i < piers; i++) {
        const [px, py] = off((i - (piers - 1) / 2) * s * 0.62, 0);
        solids.push(rect(px, py, s * 0.24, s * 2.2, a));
      }
      return { solids, voids: [], marks: [] };
    }
    case 'mill': {
      const b = rect(x, y, s * 1.15, s * 1.15, a);
      const [wx, wy] = off(s * 0.78, 0);
      return { solids: [b], voids: [], marks: [{ kind: 'wheel', x: wx, y: wy, r: s * 0.42 }, { kind: 'ridge', poly: b }] };
    }
    case 'hospitality': {
      const inn = rect(x, y, s * 1.5, s * 0.95, a);
      const [yx, yy] = off(0, s * 0.85);
      return { solids: [inn], voids: [], marks: [{ kind: 'ridge', poly: inn }, { kind: 'yard', poly: rect(yx, yy, s * 1.1, s * 0.55, a) }] };
    }
    case 'noxious': {
      const b = rect(x, y, s * 0.95, s * 0.9, a);
      const marks = [];
      for (let i = 0; i < 4; i++) {
        const [px, py] = off(i % 2 ? s * 0.62 : -s * 0.62, i < 2 ? -s * 0.5 : s * 0.62);
        marks.push({ kind: 'pit', x: px, y: py, r: s * 0.20 });
      }
      return { solids: [b], voids: [], marks };
    }
    case 'extraction': case 'kiln': {
      const b = rect(x, y, s * 1.0, s * 0.9, a);
      const [px, py] = off(s * 0.9, 0);
      return { solids: [b], voids: [], marks: [{ kind: 'pit', x: px, y: py, r: s * 0.4 }] };
    }
    case 'arcane': {
      return { solids: [rect(x, y, s * 0.8, s * 0.8, a)], voids: [], marks: [{ kind: 'wheel', x, y, r: s * 0.5 }] };
    }
    case 'water': return { solids: [], voids: [], marks: [{ kind: 'well', x, y, r: s * 0.42 }] };
    case 'wallwork': return { solids: [rect(x, y, s * 0.8, s * 0.8, a)], voids: [], marks: [] };
    case 'playhouse': case 'caravan': case 'waystation': case 'fairground': {
      const b = rect(x, y, s * 1.25, s * 1.0, a);
      const [yx, yy] = off(0, s * 0.9);
      return { solids: [b], voids: [], marks: [{ kind: 'yard', poly: rect(yx, yy, s * 1.4, s * 0.7, a) }] };
    }
    default: {
      const b = rect(x, y, s * 1.15, s * 0.95, a);
      return { solids: [b], voids: [], marks: [] };
    }
  }
}

/**
 * Attach the drawn body to every seated landmark, and report the extent the lens will
 * actually cover — which is the number the compound reservation should have been sized on.
 *
 * @param {Array<any>} landmarks
 * @returns {{ bodies:number, solids:number, maxReachOfSize:number, reason:string }}
 */
export function attachSolids(landmarks) {
  let solids = 0, maxReach = 0;
  for (const lm of landmarks) {
    const sh = archetypeSolids(lm.monumental ? lm : { ...lm, archetype: ordinaryArchetype(lm) });
    lm.solids = sh.solids;
    lm.voids = sh.voids;
    lm.marks = sh.marks;
    solids += sh.solids.length;
    for (const poly of sh.solids) {
      for (const p of poly) {
        const d = Math.sqrt((p[0] - lm.x) * (p[0] - lm.x) + (p[1] - lm.y) * (p[1] - lm.y));
        const rel = lm.size > 0 ? d / lm.size : 0;
        if (rel > maxReach) maxReach = rel;
      }
    }
  }
  return {
    bodies: landmarks.length,
    solids,
    maxReachOfSize: Math.round(maxReach * 100) / 100,
    reason: `${landmarks.length} institutions carry ${solids} derived solids; the furthest drawn`
      + ` corner stands ${Math.round(maxReach * 100) / 100} × its own size from its anchor`,
  };
}

/**
 * ⚠ THE ORDINARY READING. Below the monumental budget an institution draws as ordinary
 * fabric — a house-sized block — which is the §5 silhouette budget doing its job. The lens
 * used to make this substitution at draw time; it belongs here with the rest of the shape
 * decision, and it is the same substitution.
 */
function ordinaryArchetype(lm) {
  // The physical absolutes keep their form at any rank: a pier is a pier and a well is a
  // well, however small the town. Only the CIVIC silhouettes fall back to a block.
  const KEEP = new Set(['port', 'mill', 'water', 'noxious', 'extraction', 'kiln', 'market']);
  return KEEP.has(lm.archetype) ? lm.archetype : 'ordinary';
}
