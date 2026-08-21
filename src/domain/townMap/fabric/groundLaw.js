/**
 * domain/townMap/fabric/groundLaw.js — ⭐⭐⭐ §17 THE NON-OVERLAP LAW and §17.4 THE
 * RIGHT-OF-WAY LAW (chair directives ODQ §190 / §190a, owner-caught on the exemplars).
 *
 * TWO LAWS ARRIVED TOGETHER AND THEY TURN OUT TO BE ONE MECHANISM:
 *   §17    building footprints are MUTUALLY EXCLUSIVE SOLIDS. A shared EDGE is correct —
 *          it is the party wall, the terraced-burgage form, and it is where the density
 *          comes from. An intersected INTERIOR is forbidden.
 *   §17.4  the entire derived street web — square to last alley — is FORBIDDEN GROUND for
 *          footprints; and the positive half, THE FRONTING LAW: facades sit ON the street
 *          line, yards behind. That is what gives a channel its walls.
 *
 * ⭐⭐⭐ ONE PRIMITIVE SERVES BOTH, AND SAYING IT ONCE IS THE WHOLE DESIGN:
 *
 *     **A FOOTPRINT IS CLIPPED BY EVERY CLAIM IT MEETS — THE STREET'S KERB LINE AND THE
 *     NEIGHBOUR'S PARTY LINE. IT IS CLIPPED, NEVER MOVED.**
 *
 * Clipping rather than nudging is not an implementation preference; it is the historical
 * form. A burgage building fills its plot UP TO the line and stops: to the kerb in front, to
 * the party wall at the side. A building that is pushed back from a street it overhung
 * leaves a gap and reads as detached; a building that is CLIPPED at the kerb has its facade
 * ON the street, which is exactly what §17.4's second clause asks for. So the repair and the
 * positive law are the same operation, and the terrace falls out of it.
 *
 * ⭐ AND CLIPPING CANNOT FAIL — IT CAN ONLY EXHAUST. A half-plane clip always returns a legal
 * (possibly empty) polygon, so this pass has no "could not satisfy the constraint" branch:
 * every footprint that survives is disjoint from every claim, provably, and a footprint the
 * clips ate below its floor is DROPPED AND REPORTED (§15.6: silent nonsense is forbidden;
 * every repair and every failure is diagnosed). That is what makes disjointness a HARD
 * constraint in the sense the directive asks for rather than a best effort.
 *
 * ⛔⛔ WHAT WAS ACTUALLY WRONG, MEASURED BEFORE THE CURE — and the root cause is one sentence
 * that explains BOTH laws' violations at once:
 *
 *     **THE RESERVATION WAS A TEST ON THE PLOT'S CENTRE AND THE LAW IS ABOUT THE BUILDING'S
 *     BODY.**
 *
 * `forbiddenGround(x, y)` is asked about a candidate plot's CENTROID. A burgage plot runs
 * 1.3–2.35 frontages deep, so its corners stand up to ~1.3 frontages from that centroid —
 * and a reservation that clears the centre by half a carriageway still lets the building's
 * corner stand a plot-depth into the road. MEASURED across the corpus before this pass:
 * 39–511 footprints per leaf standing INSIDE a drawn carriageway (about half of every urban
 * leaf), penetrating up to 6.5 view units — most of a plot's whole width — and 0–543
 * intersecting footprint PAIRS per leaf. The centre-test also explains why MF-B3's cure of
 * the quarter-lane class did not generalize: it widened one reservation, and the defect was
 * never about which reservations existed.
 *
 * ⚠ THE SECOND CAUSE, SMALLER AND ALSO REAL: `PLOT_SHAPE.frontJitter` was signed both ways,
 * so a plot could sit FORWARD of its own frontage line and stand in the street on purpose.
 * §11.2's encroachment is a DELIBERATE, seeded, event-dated chaos drift (directive clause 3)
 * — it is never packer output. The jitter is now backward-only at its source.
 *
 * ⚠ AND THE FIGURES MOVE, HONESTLY. Overprinted footprints were double-counting coverage:
 * two buildings drawn over one another read as more built ground than there is. Every
 * build-out figure in this lane's receipt is re-measured after this pass.
 *
 * PURITY: pure. No Date, no Math.random, no runtime trig, no ambient rng. Order of operation
 * is a fixed key sort, so the result is byte-stable across processes.
 */

import { absArea, centroid, properCross } from './fabricGeometry.js';
import { bodyRefusal } from './groundRefusal.js';
import { compareKeys } from './lineage.js';
import { TOUCH_EPS, claimIndex, claimSegments, deepestPenetration, kerbHalfPlane, segToPolyDist } from './reservedGround.js';

/**
 * ⭐⭐⭐ MF-B8b · THE RIGHT-OF-WAY QUESTION MOVED TO `reservedGround.js`, AND THE MOVE IS THE
 * CURE (owner catch ODQ §230). This pass asked it of the footprint's VERTICES; the law is
 * about the footprint's AREA, so a claim narrower than the body it crossed fired no clip and
 * passed the verification. MEASURED on the b8 corpus, over the same bodies and the same claim
 * objects: 1,299 bodies in a carriageway, 190 in a wall band, 13 in a water claim — with all
 * three censuses reading 0, because each census had copied this pass's own predicate.
 * ⭐ THE CLASS: **A CENSUS THAT INHERITS THE LAW'S OWN PREDICATE CANNOT REFUTE THE LAW.**
 */
export { TOUCH_EPS };

/**
 * How much of its own area a footprint may lose to clips before it stops being a building.
 * §42/§43 VALUE, ARGUED: a burgage building clipped to a third of itself is a shed, and a
 * shed drawn where the derivation said "house" is a worse lie than a missing house. Below
 * the floor the footprint is dropped and counted — an outbuilding silently, a DWELLING into
 * `dwellingsLost`, which the receipt reports because it moves the census claim.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const AREA_FLOOR = 0.34;

/** Sutherland–Hodgman clip of a simple polygon against the half-plane {p : (p−q)·n ≥ 0}. */
export function clipHalfPlane(poly, qx, qy, nx, ny) {
  const out = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const da = (a[0] - qx) * nx + (a[1] - qy) * ny;
    const db = (b[0] - qx) * nx + (b[1] - qy) * ny;
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

function inPoly(poly, x, y) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > y) !== (yj > y)) {
      const qx = (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (x < qx) inside = !inside;
    }
  }
  return inside;
}

/* ⭐⭐ §287.12 · THE SECOND SPELLING OF `properCross` USED TO LIVE HERE AND IS GONE.
 * It was a character-for-character copy of the ring kernel's arithmetic — the same determinant,
 * the same two parameters, the same 1e-9 bound — and SPEC §278's exit criteria name its removal
 * as a graded criterion (*"`properCross` ONE exported home; the second spelling in groundLaw.js
 * is gone"*). The import above takes it from `fabricGeometry.js`, where the self-crossing
 * predicate and the offset that must not produce one already sit together, so a change to what
 * "proper" means cannot mean two different things in two files again. ⚠ The operation order was
 * preserved exactly when it moved, so every §17 abutment decision this file makes is
 * bit-identical to the sealed W2 base. */

/** Shrink toward the centroid by `eps` — the instrument that tells an ABUTMENT from an
 *  OVERPRINT. Two footprints sharing a party wall come apart; two that overlap do not. */
export function shrinkToward(poly, eps) {
  const c = centroid(poly);
  return poly.map(([x, y]) => {
    const dx = x - c[0], dy = y - c[1];
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const t = Math.max(0, (d - eps) / d);
    return [c[0] + dx * t, c[1] + dy * t];
  });
}

/** Do two footprints share POSITIVE AREA? (Abutment is not overlap — see shrinkToward.) */
export function overlapping(A, B, eps = TOUCH_EPS) {
  const a = shrinkToward(A, eps), b = shrinkToward(B, eps);
  for (const p of a) if (inPoly(b, p[0], p[1])) return true;
  for (const p of b) if (inPoly(a, p[0], p[1])) return true;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (properCross(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])) return true;
    }
  }
  return false;
}

/**
 * ⭐⭐⭐ §17.3's OTHER VERB — THE DEMOTION LADDER. "The repair pass DEMOTES or removes the
 * unplaceable rather than overlapping." It only ever removed.
 *
 * ⛔ WHAT REMOVAL COSTS, MEASURED BEFORE THIS ARM EXISTED: 176 dropped bodies and 86 lost
 * dwellings on the metropolis alone, 252 and 118 at the city — every one of them a plot the
 * packer cut, on ground that is legally empty, drawing nothing. MF-B6 proved the two tuning
 * dials (the LOD radius, the yard share) cannot move the build-out band because the
 * denominator is derived from the numerator; the demotion arm is the one lever that adds
 * built ground without touching a denominator, because it puts a BUILDING on ground that was
 * already inside the umbrella and already empty.
 *
 * ⭐⭐ AND THE LADDER IS NOT A SHRINK, IT IS A RUNG — which is the difference between honest
 * fabric and a fudge. A burgage range clipped to a fifth of itself is not a small burgage
 * range; it is a COTTAGE, and a cottage is a real thing that stood in exactly this position
 * in exactly these towns: on the leftover ground behind a frontage, in the tail of a block,
 * where the depth ran out. The demoted body therefore carries its rung and the lens draws it
 * as what it is. **Nothing is drawn that the ground cannot carry, and nothing is deleted that
 * the ground can.**
 *
 * ⚠ THE THIRD RUNG IS NOT A BUILDING AND THAT IS DELIBERATE. Where even a hovel will not
 * stand, the plot is left as OPEN GROUND — its yard — and NOT as a ruin. A ruin would be an
 * invention: the record says a plot was cut and the ground refused a building, which is a
 * statement about density, not about a fire. §161g's ruin ring is a different member with a
 * different source (a recorded demotion), and it is built separately.
 *
 * §42/§43 VALUES, ARGUED: a cottage is about a fifth of a burgage range's footprint (one bay
 * against a range's four-to-five); a hovel is half a cottage again. ⚠ UNSOAKED.
 */
export const RUNGS = Object.freeze([
  { name: 'cottage', share: 0.20, minFrontages: 0.30 },
  { name: 'hovel', share: 0.085, minFrontages: 0.13 },
]);

/**
 * ⚠ A FIXED LADDER, NOT A SEARCH. Making room by shrinking is legitimate — a building that
 * its neighbours squeezed stands free in its own plot, which is what a cottage in a yard IS —
 * but it must not iterate to a tolerance (the determinism law). Three fixed insets, in
 * frontages, tried in order; the first that clears wins; none clearing is a drop.
 */
const SHRINK_LADDER = Object.freeze([0.10, 0.24, 0.46]);

/** A uniform grid bucket over polygons, for the pair sweep and the claim sweep. */
function bucketIndex(cell) {
  /** @type {Map<string, number[]>} */ const grid = new Map();
  return {
    add(i, box) {
      for (let gx = Math.floor(box.x0 / cell); gx <= Math.floor(box.x1 / cell); gx++) {
        for (let gy = Math.floor(box.y0 / cell); gy <= Math.floor(box.y1 / cell); gy++) {
          const k = `${gx}|${gy}`;
          const b = grid.get(k);
          if (b) b.push(i); else grid.set(k, [i]);
        }
      }
    },
    near(box) {
      /** @type {Set<number>} */ const out = new Set();
      for (let gx = Math.floor(box.x0 / cell); gx <= Math.floor(box.x1 / cell); gx++) {
        for (let gy = Math.floor(box.y0 / cell); gy <= Math.floor(box.y1 / cell); gy++) {
          const b = grid.get(`${gx}|${gy}`);
          if (b) for (const i of b) out.add(i);
        }
      }
      return [...out].sort((p, q) => p - q);
    },
  };
}

function bbox(poly) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  return { x0, y0, x1, y1 };
}

/**
 * ⭐ CLIP A FOOTPRINT OUT OF EVERY CARRIAGEWAY IT STANDS IN (§17.4).
 *
 * For each channel segment the footprint reaches, the KERB is the line parallel to the
 * centreline at the carriageway's own half-width. The footprint is clipped to the far side
 * of it — so a building that overhung the road ends with its facade exactly ON the kerb,
 * which is the fronting law rather than a retreat from it.
 *
 * ⚠ THE CLIP IS PER SEGMENT AND BOUNDED. A channel is a polyline; clipping against a
 * straight kerb is exact for the segment that is actually violated, and a footprint that
 * violates several segments is clipped once per segment in a fixed order. `MAX_CLIPS` bounds
 * the pass so it can never iterate to a tolerance (the determinism law).
 */
// ⚠ 32, NOT 8, AND THE FIRST SPELLING'S 8 WAS A MEASURED DEFECT. A bounded pass needs a
// FIXED bound (that is the determinism law); it does not need a SMALL one. A footprint
// standing in a bent seam meets that seam's polyline over many segments, and eight clips
// left 31 city footprints still in the road. The bound exists so the pass cannot iterate to
// a tolerance, and 32 is as fixed as 8.
const MAX_CLIPS = 32;

/**
 * ⭐⭐⭐ THE DEEPEST CLAIM A POLYGON STANDS IN — the question the pass never re-asked.
 *
 * ⛔⛔ AND NOT RE-ASKING IT WAS A REAL DEFECT THAT §200 EXPOSED. `enforceGround` verifies its
 * PARTY-LINE result (see step 3's own header: "a repair pass that does not re-ask its own
 * question is a best effort wearing a guarantee's name") — and then does not re-ask the
 * RIGHT-OF-WAY question at all. While the only claims were street channels the omission was
 * invisible, because a street half-width is small and `MAX_CLIPS` was never reached. The wall
 * band is 7 view units at the town, so a footprint near the circuit meets many more claims,
 * exhausts its clip budget on them, and SURVIVES IN THE BAND: measured, one town parcel
 * standing 6.85 units into a 7.00-unit band — essentially on the wall — with the pass
 * reporting success. ⭐ THE CLASS: **A VERIFICATION THAT COVERS ONE OF TWO CONSTRAINTS PASSES
 * THE HALF IT CHECKS AND CERTIFIES THE HALF IT DOES NOT.**
 */
function deepestClaim(poly, segs, idx) {
  // ⭐⭐⭐ MF-B8b: the question is asked of the body's AREA now, not of its corners. See
  // reservedGround.js for the 1,502-body measurement that forced the change.
  const worst = deepestPenetration(poly, segs, idx).pen;
  return worst > 0 ? worst : 0;
}

function clipOutOfStreets(poly, segs, idx) {
  let cur = poly;
  let clips = 0;
  // ⚠ THREE FIXED ROUNDS, NOT ONE PASS. Each clip changes the polygon, so a vertex that was
  // the deepest violator of segment A can be replaced by a NEW vertex (the clip's own
  // intersection point) that violates segment B — a single ordered sweep therefore leaves a
  // residue. MEASURED: 1–2 footprints per leaf still standing in a bent channel. Three
  // rounds is a FIXED bound, so the pass still cannot iterate to a tolerance, and the
  // remaining rounds cost nothing on the ~99% of footprints that were clean the first time.
  for (let round = 0; round < 3; round++) {
  const box = bbox(cur);
  let fired = 0;
  for (const si of idx.near(box)) {
    if (clips >= MAX_CLIPS) break;
    const s = segs[si];
    // ⭐⭐⭐ MF-B8b · THE VIOLATION IS AREA-TRUE AND THE CLIP LINE COMES FROM `kerbHalfPlane`.
    // The old loop looked for a violating VERTEX and, finding none, did nothing — which is
    // precisely how a claim that ran THROUGH a building left it standing. The straddle case
    // now clips the body to the side its own centroid lies on: the facade lands on the kerb,
    // and the wall stops the growth it crosses.
    const pen = s.half - segToPolyDist(s, cur);
    if (pen <= TOUCH_EPS) continue;
    const wq = kerbHalfPlane(cur, s);
    if (!wq) continue;
    cur = clipHalfPlane(cur, wq.qx, wq.qy, wq.nx, wq.ny);
    clips++; fired++;
    if (cur.length < 3) return { poly: cur, clips };
  }
  if (!fired) break;
  }
  return { poly: cur, clips };
}

/**
 * ⭐⭐ THE PARTY LINE (§17). Where two footprints overlap, the later one is clipped against
 * the PERPENDICULAR BISECTOR of the two centroids — so each building keeps its own side and
 * the two end up sharing a straight wall. **The repair for an overprint is a party wall,
 * which is the very form the law says the density is supposed to come from.**
 */
function clipAgainstNeighbour(poly, other) {
  // ⛔ THE FIRST SPELLING USED THE PERPENDICULAR BISECTOR AND IT DOES NOT SEPARATE. A
  // bisector splits the two CENTROIDS, which guarantees nothing about the two BODIES: where
  // the earlier footprint is much larger (an LOD mass against a single plot) the bisector
  // falls INSIDE the mass, so the clipped parcel keeps its own side and stays inside its
  // neighbour. MEASURED: 161 mass×parcel overprints survived at metropolis with the pass
  // firing 364 clips. ⭐ THE CLASS: a separating construction between two POINTS is not a
  // separating construction between two REGIONS.
  //
  // ⭐⭐ AND THE CORRECT LINE IS THE NEIGHBOUR'S OWN WALL, WHICH IS ALSO THE TRUER FORM.
  // Clipping against the supporting line of one of the OTHER polygon's edges puts the later
  // building's wall exactly on the earlier building's wall — a real party wall, not a
  // negotiated midpoint. The edge chosen is the one that separates while costing the least
  // area, so the terrace keeps as much of itself as the neighbour allows.
  const oc = centroid(other);
  let best = null, bestArea = -1;
  for (let i = 0; i < other.length; i++) {
    const a = other[i], b = other[(i + 1) % other.length];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const l = Math.sqrt(nx * nx + ny * ny);
    if (l < 1e-9) continue;
    nx /= l; ny /= l;
    // Outward = away from the other polygon's own centroid.
    if ((a[0] - oc[0]) * nx + (a[1] - oc[1]) * ny < 0) { nx = -nx; ny = -ny; }
    const cand = clipHalfPlane(poly, a[0] + nx * (TOUCH_EPS / 2), a[1] + ny * (TOUCH_EPS / 2), nx, ny);
    if (cand.length < 3) continue;
    if (overlapping(cand, other)) continue;
    const ar = absArea(cand);
    if (ar > bestArea) { bestArea = ar; best = cand; }
  }
  // No single wall separates them (a genuinely re-entrant neighbour). The bisector is then
  // the honest fallback, and the caller's re-test + drop closes the case.
  if (best) return best;
  const a = centroid(poly);
  let nx = a[0] - oc[0], ny = a[1] - oc[1];
  const l = Math.sqrt(nx * nx + ny * ny);
  if (l < 1e-9) return [];
  nx /= l; ny /= l;
  const mx = (a[0] + oc[0]) / 2, my = (a[1] + oc[1]) / 2;
  return clipHalfPlane(poly, mx + nx * (TOUCH_EPS / 2), my + ny * (TOUCH_EPS / 2), nx, ny);
}

/**
 * ⭐⭐⭐ DEMOTE A BODY THE GROUND REFUSED AT ITS OWN RUNG.
 *
 * Two entry states, and they need different work:
 *
 *  A · CLEAN BUT TOO SMALL. The clips left legal ground; it is simply not a burgage range any
 *      more. No geometry is needed — only the honest question "what rung IS this?".
 *
 *  B · UNRESOLVED. The clips could not separate it (a re-entrant neighbour, an exhausted clip
 *      budget, a wall band it stands across). The ground under it is NOT legal, so a rung
 *      alone would be a lie. It is pulled in from its own edges by a FIXED ladder of insets
 *      until it clears — a building standing free inside its plot instead of on the line —
 *      and only then asked what rung it is. A body that clears at no inset is dropped, which
 *      is §17.3's "or removes" doing the work it was always supposed to be the SECOND choice
 *      of. ⭐ Containment is the one shape no inset escapes, and it stays a drop.
 *
 * @returns {{poly:number[][], rung:string}|null}
 */
function demoteBody(a) {
  const { original, area0, frontage, segs, segIdx, accepted, accIdx, sub } = a;
  const legal = (p) => {
    if (!p || p.length < 3) return false;
    if (deepestClaim(p, segs, segIdx) > TOUCH_EPS) return false;
    // ⭐⭐ §5 W1 EXIT 2 · THE GROUND ITSELF IS A CLAIM. The shrink ladder is exactly the right
    // machinery for a body that OVERHANGS a crag: it pulls in from its own edges until it
    // stands on ground that carries it, which is what a builder does. A body that clears at
    // no inset is dropped — §17.3's second verb, on a refusal the clip cannot cut away.
    if (sub && bodyRefusal(sub, p)) return false;
    for (const ai of accIdx.near(bbox(p))) {
      const other = accepted[ai];
      if (other && overlapping(p, other.poly)) return false;
    }
    return true;
  };
  /** @type {number[][]|null} */ let cand = null;
  if (a.clean && a.poly && a.poly.length >= 3) cand = a.poly;
  else {
    for (const inset of SHRINK_LADDER) {
      const s = shrinkToward(original, frontage * inset);
      if (legal(s)) { cand = s; break; }
    }
  }
  if (!cand || !legal(cand)) return null;
  const area = absArea(cand);
  for (const r of RUNGS) {
    if (area >= area0 * r.share && area >= frontage * frontage * r.minFrontages) return { poly: cand, rung: r.name };
  }
  return null;
}

/**
 * Enforce both ground laws over the drawn footprints.
 *
 * @param {Object} args
 * @param {Array<any>} args.parcels
 * @param {Array<any>} [args.masses]     the LOD masses (§181.2a) — buildings on the page
 * @param {Array<any>} [args.huts]       the §10.A3 shanty
 * @param {Array<any>} args.channels     the FINAL, contained street web
 * @param {Array<any>} [args.compounds]  reserved institution ground (seating excludes it)
 * @param {Set<string>} [args.merged]
 * @param {number} args.frontage
 * @returns {{ parcels:Array<any>, masses:Array<any>, huts:Array<any>, streetClips:number,
 *             partyClips:number, dropped:number, dwellingsLost:number, backHousesLost:number,
 *             reason:string }}
 */
export function enforceGround(args) {
  const { parcels, channels, frontage } = args;
  // ⚠ OPTIONAL AND NAMED, NOT DEFAULTED. A caller with no substrate gets the pre-W1 behaviour
  // and the census will SAY the ground was never asked — never a silent pass (PERF1 §8).
  const refusedGround = args.sub || null;
  const masses = args.masses || [];
  const huts = args.huts || [];
  const institutions = args.institutions || [];
  const merged = args.merged || new Set();

  // ── THE CLAIMS: every reserved segment with its own half-width, flattened and indexed by
  //    the ONE module that owns the question (§230's shared construction). The index's result
  //    order is canonical, so which of several claims clips a body first is stable.
  const segs = claimSegments(channels);
  const segIdx = claimIndex(segs);

  // ── PRE-PASS · ⭐⭐ THE LOD GIVES WAY (§17 + §181.2a reconciled).
  //
  // ⛔ A BLOCK MASS IS THE CONVEX HULL OF ITS CHUNK'S VERTICES, and a convex hull over a run
  // of plots SWALLOWS WHATEVER SITS IN ITS CONCAVITIES — including a standing neighbour the
  // merge skipped. MEASURED after the party-wall clip cured everything else: 4–13
  // `mass × parcel` overprints per urban leaf, every one of them a mass CONTAINING a
  // building. ⭐ AND A CONTAINMENT CANNOT BE CLIPPED APART: no half-plane separates a
  // polygon from one that wholly contains it, so the party-line repair has nothing to work
  // with. The class is worth the sentence: **a repair that separates by cutting cannot
  // resolve containment; containment is a decision about which claim survives.**
  //
  // ⭐ AND THE DECISION IS NOT CLOSE. The LOD merge is an OPTIMIZATION — the reference's own
  // overview convention, bought to pay the op budget. The building it swallowed is the
  // specific truth. So the mass is dropped, its members go back to drawing themselves, and
  // the op cost is reported. The printed representativeness ratio follows automatically,
  // because §181.2a already recomputes it on the shapes actually drawn.
  let lodGaveWay = 0, lodRestored = 0;
  {
    // ⚠ THE STANDING SET INCLUDES BACK-HOUSES. The first spelling listed only the plot
    // polygons, and a hull that cleared every standing plot could still swallow the
    // workshop behind one — measured, one `backHouse × mass` pair survived on three leaves.
    /** @type {Array<Array<[number,number]>>} */ const standing = [];
    for (const p of parcels) {
      if (merged.has(p.key)) continue;
      standing.push(p.polygon);
      if (p.backHouse) standing.push(p.backHouse);
    }
    const sIdx = bucketIndex(Math.max(8, frontage * 2));
    const sBoxes = standing.map((poly) => bbox(poly));
    sBoxes.forEach((b, i) => sIdx.add(i, b));
    for (const m of masses.slice()) {
      const mb = bbox(m.polygon);
      let clash = false;
      for (const i of sIdx.near(mb)) {
        if (overlapping(m.polygon, standing[i])) { clash = true; break; }
      }
      if (!clash) continue;
      lodGaveWay++;
      for (const k of (m.memberKeys || [])) { if (merged.delete(k)) lodRestored++; }
      masses.splice(masses.indexOf(m), 1);
    }
  }

  // ── THE ORDER IS A FIXED KEY SORT. Which of two overlapping footprints is clipped is a
  //    decision, so it must be a STABLE one: the same pair resolves the same way in every
  //    process and in every year (the §11.0 inertia law).
  /** @type {Array<{ key:string, kind:string, ref:any, field:string }>} */ const items = [];
  for (const p of parcels) {
    if (merged.has(p.key)) continue;
    items.push({ key: p.key, kind: 'parcel', ref: p, field: 'polygon' });
  }
  for (const p of parcels) {
    if (merged.has(p.key) || !p.backHouse) continue;
    items.push({ key: `${p.key}#back`, kind: 'backHouse', ref: p, field: 'backHouse' });
  }
  for (let i = 0; i < masses.length; i++) items.push({ key: masses[i].key || `mass.${i}`, kind: 'mass', ref: masses[i], field: 'polygon' });
  for (let i = 0; i < huts.length; i++) items.push({ key: huts[i].key || `hut.${i}`, kind: 'hut', ref: huts[i], field: 'polygon' });
  // ⭐⭐⭐ THE INSTITUTION'S OWN BODY JOINS THE SWEEP (chair directive §195.0). Until MF-B5
  // the drawn institution existed only inside the lens, so both censuses ran to zero over a
  // set that did not contain the shapes the reader was looking at. Each SOLID of an
  // arrangement is a footprint in its own right — a nave, its tower and its transept abut
  // one another exactly as a terrace does, and the shrink-toward instrument already tells an
  // abutment from an overprint.
  // ⚠ AND THE INSTITUTION IS SWEPT FIRST, BY KEY PREFIX. Order decides which of two
  // overlapping footprints is clipped, and a cathedral must not be trimmed to fit a cottage:
  // the ordinary fabric gives way to the monumental, which is the historical direction of
  // the transaction and also §8.1's precedence (truth over cosmetic jitter).
  for (const lm of institutions) {
    const sol = lm.solids || [];
    for (let i = 0; i < sol.length; i++) {
      items.push({ key: `!inst|${lm.instanceKey}|${i}`, kind: 'institution', ref: sol, field: i, owner: lm });
    }
  }
  items.sort((a, b) => compareKeys(a.key, b.key));

  // ── THE SWEEP.
  const accepted = [];
  const accIdx = bucketIndex(Math.max(8, frontage * 2));
  // ⭐⭐ PRE-ACCEPTED CLAIMS — the bodies an EARLIER pass already made legal (MF-B5). A
  // second pass over the late members (the faubourg, the lean-tos, the countryside
  // steadings) must clip them against the standing town without re-sweeping the standing
  // town: re-sweeping 800 already-disjoint parcels to place 40 new bodies is pure cost, and
  // MEASURED it pushed six pins past the 5-second default and timed them out.
  // ⚠ THEY ARE CLAIMS, NOT CANDIDATES: they enter the index and are never clipped, which is
  // also the correct precedence — the town that is already there does not give way to a shed
  // built against its wall.
  for (const claim of (args.preAccepted || [])) {
    if (!claim || claim.length < 3) continue;
    const i = accepted.length;
    accepted.push({ key: `!pre.${i}`, poly: claim });
    accIdx.add(i, bbox(claim));
  }
  let streetClips = 0, partyClips = 0, dropped = 0, dwellingsLost = 0, backHousesLost = 0, instPartsLost = 0;
  let demoted = 0;
  /** @type {Record<string, number>} */ const demotedBy = {};
  /** @type {Set<string>} */ const dead = new Set();

  for (const it of items) {
    const original = it.ref[it.field];
    if (!original || original.length < 3) continue;
    const area0 = absArea(original);
    let poly = original;

    // 1 · THE RIGHT OF WAY. A footprint may not stand in a carriageway.
    const rw = clipOutOfStreets(poly, segs, segIdx);
    if (rw.clips) { poly = rw.poly; streetClips += rw.clips; }

    // 2 · THE PARTY LINE. A footprint may not stand in another footprint.
    if (poly.length >= 3) {
      const box = bbox(poly);
      // ⛔ THE GUARD COUNTS CLIPS, NOT CANDIDATES — and counting candidates was a real
      // defect with a measured cost. A LOD mass covers a whole rank run, so its bbox pulls
      // dozens of neighbours out of the index; a guard that ticked on every CANDIDATE
      // exhausted itself on non-overlapping ones and returned with the actual overprints
      // untouched. MEASURED: 161 mass×parcel overprints survived at metropolis.
      // ⭐ THE CLASS: a bound on WORK and a bound on REPAIRS are different bounds, and
      // spending the repair budget on inspection leaves the defect in place.
      let fired = 0;
      for (const ai of accIdx.near(box)) {
        if (fired >= MAX_CLIPS) break;
        const other = accepted[ai];
        if (!other) continue;
        if (!overlapping(poly, other.poly)) continue;
        poly = clipAgainstNeighbour(poly, other.poly);
        partyClips++; fired++;
        if (poly.length < 3) break;
      }
    }

    // 3 · ⭐⭐ THE VERIFICATION, AND WITHOUT IT THE GUARANTEE WAS A HOPE. The clip loop tries
    //     a bounded number of separating walls; where a neighbour is genuinely re-entrant,
    //     or where a footprint sits WHOLLY INSIDE another, no half-plane separates them and
    //     the loop returns something that still overlaps. The first spelling then checked
    //     only the AREA FLOOR and kept it — so a pass whose whole purpose is a hard
    //     constraint had no step that asked whether the constraint held.
    //     ⭐ THE CLASS: A REPAIR PASS THAT DOES NOT RE-ASK ITS OWN QUESTION IS A BEST EFFORT
    //     WEARING A GUARANTEE'S NAME. MEASURED: two survivors across the six pin fixtures —
    //     one back-house still inside a neighbouring quarter's plot, one dwelling still
    //     standing in a §17.6 passage.
    let clean = poly.length >= 3;
    if (clean) {
      const vb = bbox(poly);
      for (const ai of accIdx.near(vb)) {
        const other = accepted[ai];
        if (other && overlapping(poly, other.poly)) { clean = false; break; }
      }
    }
    if (clean && poly.length >= 3) {
      const rv = clipOutOfStreets(poly, segs, segIdx);
      if (rv.clips) { poly = rv.poly; streetClips += rv.clips; }
      // One more look: if the street re-clip re-introduced an overlap, the footprint goes.
      if (poly.length >= 3) {
        const vb2 = bbox(poly);
        for (const ai of accIdx.near(vb2)) {
          const other = accepted[ai];
          if (other && overlapping(poly, other.poly)) { clean = false; break; }
        }
      } else clean = false;
    }
    // 3c · ⭐⭐⭐ AND THE RIGHT OF WAY IS RE-ASKED (§200). See deepestClaim's header for the
    //      measured survivor this catches and for the class it belongs to.
    if (clean && poly.length >= 3 && deepestClaim(poly, segs, segIdx) > TOUCH_EPS) clean = false;
    // 3d · ⭐⭐⭐ §5 W1 EXIT 2 · AND THE GROUND IS ASKED, **OF THE BODY'S AREA**.
    //      ⛔ THE PROPOSAL-TIME REFUSAL IS A POINT TEST AND THIS LAW IS ABOUT A BODY — which
    //      is §17.4's own root cause arriving one layer down. MEASURED before this line:
    //      the packer refused every plot CENTRE on refused ground and the corpus still drew
    //      2 thorp parcels and 2 village parcels standing in a marsh, because a burgage runs
    //      1.3–2.35 frontages deep and its corners reach a cell the centre never touched.
    //      ⭐ THE CLASS, for the third time in this file: **A POINT TEST CANNOT ENFORCE AN
    //      AREA LAW**, and the cure is always to ask the question of the body.
    if (clean && poly.length >= 3 && refusedGround && bodyRefusal(refusedGround, poly)) clean = false;

    // 4 · ⭐⭐⭐ EXHAUSTED OR UNRESOLVED? **DEMOTED FIRST, DROPPED ONLY IF THE GROUND CARRIES
    //     NOTHING** — §17.3's own verb, unbuilt until now. See RUNGS's header.
    let rung = null;
    let ok = clean && poly.length >= 3 && absArea(poly) >= area0 * AREA_FLOOR;
    if (!ok && it.kind !== 'mass') {
      const dem = demoteBody({
        poly: clean ? poly : original, original, area0, clean, frontage,
        segs, segIdx, accepted, accIdx, sub: refusedGround,
      });
      if (dem) { poly = dem.poly; rung = dem.rung; ok = true; demoted++; demotedBy[dem.rung] = (demotedBy[dem.rung] || 0) + 1; }
    }
    if (!ok) {
      dropped++;
      if (it.kind === 'backHouse') { it.ref.backHouse = null; backHousesLost++; }
      else if (it.kind === 'parcel') { dead.add(it.key); dwellingsLost++; }
      else if (it.kind === 'hut') { dead.add(it.key); }
      else if (it.kind === 'institution') {
        // ⭐ A COMPONENT OF AN ARRANGEMENT CAN GO; THE INSTITUTION CANNOT. Dropping the
        // whole body would delete a TRUTH anchor (§8.1: a state expression never deletes a
        // truth anchor), so the part is emptied, the arrangement renders with one fewer
        // wing, and the count is reported. A body reduced to NOTHING is the one case the
        // caller must see, so it is counted separately.
        it.ref[it.field] = [];
        instPartsLost++;
      } else { dead.add(it.key); }
      continue;
    }
    it.ref[it.field] = poly;
    if (it.field === 'polygon' && it.kind === 'parcel') {
      it.ref.center = centroid(poly);
      it.ref.area = absArea(poly);
      // ⭐ THE RUNG IS RECORDED ON THE BODY, because a demotion the reader cannot see is a
      // shrink and §161g's whole grammar is that a demotion is VISIBLE WORK. The lens draws a
      // demoted plot without its roof-ridge tick and without its back-house: a cottage has
      // one range and no workshop behind it, which is what makes it read as a cottage beside
      // its neighbours rather than as a small burgage.
      if (rung) {
        it.ref.rung = rung;
        if (it.ref.backHouse) { it.ref.backHouse = null; backHousesLost++; }
      }
    }
    if (rung && it.kind === 'backHouse') it.ref.backRung = rung;
    const i = accepted.length;
    accepted.push({ key: it.key, poly });
    accIdx.add(i, bbox(poly));
  }

  const keptParcels = parcels.filter((p) => !dead.has(p.key));
  const keptMasses = masses.filter((m, i) => !dead.has(m.key || `mass.${i}`));
  const keptHuts = huts.filter((h, i) => !dead.has(h.key || `hut.${i}`));
  // Emptied components are removed from their arrangements; a body left with nothing at all
  // is reported, because that is a landmark the reader will not see.
  let instBodiesEmptied = 0;
  for (const lm of institutions) {
    if (!lm.solids) continue;
    lm.solids = lm.solids.filter((poly) => poly && poly.length >= 3);
    if (!lm.solids.length) instBodiesEmptied++;
  }

  return {
    parcels: keptParcels,
    masses: keptMasses,
    huts: keptHuts,
    lodGaveWay,
    lodRestored,
    streetClips,
    partyClips,
    dropped,
    demoted,
    demotedBy,
    dwellingsLost,
    backHousesLost,
    instPartsLost,
    instBodiesEmptied,
    reason: `§17 + §17.4 enforced on ${items.length} footprints (${instPartsLost} institution`
      + ` components clipped away, ${instBodiesEmptied} bodies left empty): ${streetClips} clipped to a kerb line`
      + ` (facades land ON the street), ${partyClips} clipped to a party line (the overprint becomes`
      + ` a shared wall), ${demoted} DEMOTED to a rung the ground carries`
      + ` (${Object.keys(demotedBy).sort().map((k) => `${demotedBy[k]} ${k}`).join(', ') || 'none'})`
      + ` — §17.3's own verb, so ground the packer cut is BUILT rather than blank;`
      + ` ${dropped} exhausted below the ${Math.round(AREA_FLOOR * 100)}% floor and dropped`
      + ` (${dwellingsLost} dwellings, ${backHousesLost} outbuildings);`
      + ` ${lodGaveWay} LOD masses gave way to ${lodRestored} standing buildings they would have covered`,
  };
}

/**
 * ⭐⭐⭐ THE RIGHT-OF-WAY CLIP, HANDED OUT AS A FUNCTION — ⟦§274.5a⟧ so a caller outside this
 * module can obey §17.4 without owning a second spelling of it.
 *
 * ⛔⛔ WHY IT IS INJECTED AND NOT IMPORTED, and it is a manifest fact rather than a preference:
 * the fossil reservation lives in `circuitDemotion.js` (stage **S14**) and this law lives in
 * `groundLaw.js` (stage **S20**). An `S14 → S20` import is a THIRD public-order inversion, and
 * `stageManifest`'s arm 6 refuses one. The composition root already imports both, so it builds
 * the clipper and hands it over: the law keeps its one home, the manifest keeps two inversions,
 * and no module edge is created at all.
 *
 * ⚠⚠ AND THE ALTERNATIVE WAS WORSE THAN IT LOOKS. Re-spelling the clip against
 * `fabricGeometry.clipHalfPlane` would have used the **opposite** half-plane convention — this
 * file's copy keeps `(p−q)·n ≥ 0` and the geometry module's keeps `(p−o)·n ≤ 0` — so the
 * "obvious" reuse silently keeps the complement of the ground it was asked for.
 *
 * @param {Array<any>} claims
 * @returns {(poly:any)=>{poly:any, clips:number}}
 */
export function claimClipper(claims) {
  const segs = claimSegments(claims);
  const idx = claimIndex(segs);
  return (poly) => clipOutOfStreets(poly, segs, idx);
}

/**
 * ⭐⭐ THE STANDING TOWN, AS ONE READING — the pre-accepted claim set the late ground-law
 * passes hand back to `enforceGround`.
 *
 * ⛔ IT WAS WRITTEN TWICE, NEARLY IDENTICALLY, AND THAT IS ITS OWN HAZARD. `buildFabric`
 * built the list once for the faubourg/steading pass and again for the §10 state-body pass,
 * the second copy carrying three extra sources the first did not. Two constructions of the
 * same set WILL disagree — MF-B7 recorded the class for `wallClaims` in as many words — and
 * the disagreement here would be invisible: the pass simply clips a body against a town that
 * is missing a few of its own buildings.
 * ⚠ THE `include` FLAGS ARE THE ONLY DIFFERENCE BETWEEN THE TWO CALLS, and they are named
 * rather than implied, so a reader can see WHICH town each pass is standing against.
 *
 * @param {Object} a
 * @returns {Array<Array<[number,number]>>}
 */
export function standingBodies(a) {
  /** @type {Array<Array<[number,number]>>} */ const out = [];
  const add = (poly) => { if (poly && poly.length >= 3) out.push(poly); };
  for (const p of (a.parcels || [])) {
    if (a.merged && a.merged.has(p.key)) continue;
    add(p.polygon); add(p.backHouse);
  }
  for (const mm of (a.masses || [])) add(mm.polygon);
  for (const lm of (a.institutions || [])) for (const sol of (lm.solids || [])) add(sol);
  if (a.late) {
    for (const h of (a.huts || [])) add(h.polygon);
    for (const b of (a.faubourgs || [])) add(b.polygon);
    for (const b of (a.leanTos || [])) add(b.polygon);
    for (const h of (a.dwellings || [])) for (const sol of (h.solids || [])) add(sol);
  }
  // ⭐⭐ ⟦§274.5a⟧ THE RESERVED FOSSIL GROUND STANDS IN **EVERY** PASS, NOT ONLY THE FIRST. The
  // ring the demotion kept is part of the standing town from the moment the ground law honours
  // it; a later pass that did not know about it would place a steading or a siege camp on
  // exactly the ground the round and the garden had just been given, and the reservation would
  // read as a first-pass privilege rather than as a law. ⚠ It is a plain polygon list, already
  // filtered by the senior claims — `reserveFossils` decides membership, this only carries it.
  for (const poly of (a.fossils || [])) add(poly);
  return out;
}
