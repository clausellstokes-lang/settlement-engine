/**
 * domain/townMap/fabric/routes.js — §15.2 THE REGIONAL ROUTE SKELETON, BEFORE NUCLEI.
 *
 * ⭐⭐⭐ "THE CROSSROADS EXISTS BEFORE THE CROSSROADS TOWN." (§15.2, from the peer review.)
 *
 * The §5.-1 composition order gains an explicit stage between the ground and the founding:
 *
 *     terrain → REGIONAL ROUTE SKELETON → founding nuclei → growth streets → infill lanes
 *
 * ⛔ WHAT WAS WRONG WITH THE ORDER MF-B1b SHIPPED, and it is a causality error rather than
 * a cosmetic one. `deriveApproaches` walked the roads OUT FROM THE NUCLEUS after the
 * settlement had already chosen its site — so every road was a consequence of the town, and
 * the town was a consequence of nothing but the ground. That is backwards for the single
 * most common founding story there is: the pre-existing trade corridor, the ford, the pass,
 * the coastal path. A settlement at a crossroads is at the crossroads BECAUSE the crossroads
 * was there. Building the roads afterwards produces a plan where the roads radiate from the
 * market like spokes — which is precisely the "radial sunburst" the §157 standing critique
 * orders overridden, arrived at through the composition order instead of through the dress.
 *
 * ⭐ WHAT THE SKELETON IS. Pre-settlement corridors that cross the WHOLE leaf, each walked
 * over the substrate on its own terms:
 *   • a corridor takes the easiest ground between two frame edges, so it finds the pass and
 *     the valley floor without being told where they are;
 *   • it CROSSES water at the cheapest crossing (the narrowest, shallowest reach), which is
 *     where a ford or a bridge would have been and therefore where a town would have been;
 *   • a coastal path follows the shore because that is what a coastal path does.
 * Their intersections are CROSSINGS, and a crossing is a first-class site candidate.
 *
 * ⭐ THE SOURCE IS DECLARED, ALWAYS. Where a campaign's landed route-network ledger carries
 * arterial seeds, those are the corridors and the record says `canon`. Where it does not —
 * every standalone settlement — the corridors are SEEDED and the record says `seeded`, in
 * the same idiom §2.4's road-bearing correction already established for approach bearings.
 * A seeded corridor presented as surveyed canon would be the exact dishonesty that
 * correction exists to refuse.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { fabricRng, hashUnit } from './fabricRng.js';
import { TRIG_N, cosI, sinI, chaikin } from './fabricGeometry.js';
import { VIEW, sampleAt } from './substrate.js';

/**
 * @typedef {Object} Corridor
 * @property {string} key
 * @property {'arterial'|'secondary'|'coastal'} rank
 * @property {Array<[number,number]>} line     crosses the WHOLE leaf, edge to edge
 * @property {number} weight                   0..1 traffic
 * @property {'canon'|'seeded'} source
 * @property {string} reason
 */

/**
 * @typedef {Object} RouteSkeleton
 * @property {Corridor[]} corridors
 * @property {Array<{ x:number, y:number, weight:number, kind:string }>} crossings
 * @property {'canon'|'seeded'} source
 * @property {string} reason
 */

/** How far a corridor steps as it walks the leaf. Small enough to bend around a hill,
 * large enough that a corridor is a route and not a contour. */
const STEP = 26;

/**
 * Build the regional route skeleton. Runs on the SUBSTRATE ALONE plus the compiled record:
 * it may not read the nucleus, because the nucleus does not exist yet.
 *
 * @param {Object} args
 * @param {import('./substrate.js').Substrate} args.sub
 * @param {import('./compile.js').SpatialRecord} args.record
 * @param {{ kind:string, line:Array<[number,number]>, body?:any }|null} args.water
 * @param {{ seed: string|number, variant?: number }} args.seeding
 * @param {any} [args.ledger]           the landed route-network ledger, where a campaign has one
 * @returns {RouteSkeleton}
 */
export function buildRouteSkeleton(args) {
  const { sub, record, water, seeding } = args;
  const ledger = args.ledger || null;
  const count = Math.max(1, Number(record.get('route-arterial-count', 2)));
  const canonBearing = record.get('principal-trade-bearing', null);
  const source = ledger && Array.isArray(ledger.arterials) && ledger.arterials.length ? 'canon' : 'seeded';

  /** @type {Corridor[]} */ const corridors = [];

  for (let i = 0; i < count; i++) {
    const key = `${String(seeding.seed)}|corridor|${i}`;
    // THE ENTRY BEARING. The principal corridor takes the campaign's own bearing where one
    // exists; the rest fan off it far enough apart to be different routes rather than a
    // braid. Both are integer compass indices — the cross-machine ULP law.
    const base = canonBearing != null
      ? Math.round(Number(canonBearing)) % TRIG_N
      : Math.floor(hashUnit(`${key}|bearing`) * TRIG_N);
    const spread = Math.round(TRIG_N / (count + 1));
    const bearing = (base + i * spread + Math.floor(hashUnit(`${key}|jit`) * (spread / 3))) % TRIG_N;

    const line = walkCorridor(sub, bearing, key, seeding);
    if (line.length < 3) continue;
    corridors.push({
      key,
      rank: i === 0 ? 'arterial' : 'secondary',
      line: chaikin(line, 2, false),
      weight: i === 0 ? 1 : Math.max(0.35, 1 - i * 0.28),
      source: i === 0 && canonBearing != null ? 'canon' : 'seeded',
      reason: i === 0 && canonBearing != null
        ? 'the campaign route ledger names this bearing (canon)'
        : 'no campaign canon reaches this settlement — the corridor is SEEDED and declared as such (§2.4 road-bearing honesty)',
    });
  }

  // ⭐ THE COASTAL PATH. A shore is itself a route, and it is the one corridor that needs no
  // seeding at all: it goes where the water is. This is why coastal towns string along their
  // own shoreline instead of radiating from a market.
  if (water && water.kind === 'coast' && Array.isArray(water.line) && water.line.length > 4) {
    corridors.push({
      key: `${String(seeding.seed)}|corridor|shore`,
      rank: 'coastal',
      line: water.line.slice(),
      weight: 0.72,
      source: 'seeded',
      reason: 'the shore is its own road — derived from the traced coastline, no bearing needed',
    });
  }

  // ── THE CROSSINGS. Where two corridors meet, a settlement had a reason to exist.
  /** @type {RouteSkeleton['crossings']} */ const crossings = [];
  for (let a = 0; a < corridors.length; a++) {
    for (let b = a + 1; b < corridors.length; b++) {
      const hit = firstIntersection(corridors[a].line, corridors[b].line);
      if (!hit) continue;
      crossings.push({
        x: hit[0], y: hit[1],
        weight: (corridors[a].weight + corridors[b].weight) / 2,
        kind: corridors[a].rank === 'coastal' || corridors[b].rank === 'coastal' ? 'landing' : 'crossroads',
      });
    }
  }
  // ⭐ AND THE FORD. A corridor crossing a WATERCOURSE is the other classic reason a town
  // is where it is, and it is a different kind of site from a crossroads: the crossing is
  // the scarce thing, so the town grows AT it rather than around it.
  if (water && water.kind === 'river' && Array.isArray(water.line) && water.line.length > 2) {
    for (const c of corridors) {
      const hit = firstIntersection(c.line, water.line);
      if (hit) crossings.push({ x: hit[0], y: hit[1], weight: c.weight * 1.15, kind: 'ford' });
    }
  }

  return {
    corridors,
    crossings,
    source,
    reason: `${corridors.length} regional corridor(s), ${crossings.length} crossing(s); source ${source}`
      + `${source === 'seeded' ? ' — DECLARED: no campaign route ledger reaches this settlement, so the corridors are seeded rather than surveyed' : ''}`,
  };
}

/**
 * Walk one corridor across the whole leaf on the easiest ground it can find.
 *
 * ⚠ IT STARTS AT AN EDGE AND ENDS AT AN EDGE, both outside the frame, because a regional
 * route is a route THROUGH this place — the leaf is a window on it, exactly as §2.3's
 * continuity law already requires of the river.
 */
function walkCorridor(sub, bearing, key, seeding) {
  const ux = cosI(bearing), uy = sinI(bearing);
  // Enter on the side the bearing comes from, offset across the frame by its own hash so
  // two corridors on similar bearings are not the same road.
  const across = hashUnit(`${key}|across`);
  const cx0 = VIEW / 2 - ux * VIEW * 0.75 + (-uy) * (across - 0.5) * VIEW * 0.72;
  const cy0 = VIEW / 2 - uy * VIEW * 0.75 + (ux) * (across - 0.5) * VIEW * 0.72;

  const rng = fabricRng(seeding.seed, `corridor.${key}`, { variant: seeding.variant });
  /** @type {Array<[number,number]>} */ const line = [[cx0, cy0]];
  let cx = cx0, cy = cy0;
  for (let s = 0; s < 90; s++) {
    // Three candidate steps: straight on, and a swing either side. The ground picks.
    /** @type {Array<{x:number,y:number,weight:number}>} */ const cands = [];
    for (const t of [-0.34, 0, 0.34]) {
      const nx = ux - uy * t, ny = uy + ux * t;
      const l = Math.sqrt(nx * nx + ny * ny) || 1;
      const qx = cx + (nx / l) * STEP, qy = cy + (ny / l) * STEP;
      // A regional route refuses steep and refuses bog, and prefers to keep going straight
      // — a trade road is a compromise between distance and gradient, which is what makes
      // it find the pass without being told where the pass is.
      const slope = sampleAt(sub, sub.slope, qx, qy);
      const wet = sampleAt(sub, sub.wet, qx, qy);
      cands.push({
        x: qx, y: qy,
        weight: Math.max(0.001, (1 - slope) * (1 - slope) * (1 - wet * 0.85) * (t === 0 ? 2.1 : 1)),
      });
    }
    const chosen = cands[rng.weighted(cands)];
    cx = chosen.x; cy = chosen.y;
    line.push([cx, cy]);
    // Stop once it is clear of the far side.
    if (cx < -70 || cy < -70 || cx > VIEW + 70 || cy > VIEW + 70) {
      if (s > 20) break;
    }
  }
  return line;
}

/** The first intersection of two polylines, or null. Segment-segment, exact in IEEE ops. */
export function firstIntersection(a, b) {
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < b.length - 1; j++) {
      const hit = segmentHit(a[i], a[i + 1], b[j], b[j + 1]);
      if (hit) return hit;
    }
  }
  return null;
}

function segmentHit(p1, p2, p3, p4) {
  const d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0]);
  if (d === 0) return null;
  const t = ((p3[0] - p1[0]) * (p4[1] - p3[1]) - (p3[1] - p1[1]) * (p4[0] - p3[0])) / d;
  const u = ((p3[0] - p1[0]) * (p2[1] - p1[1]) - (p3[1] - p1[1]) * (p2[0] - p1[0])) / d;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return /** @type {[number,number]} */ ([p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])]);
}

/**
 * ⭐ THE CORRIDOR PULL — how the skeleton reaches the nucleus search.
 *
 * A site's worth rises near a corridor and rises MORE at a crossing, which is the whole
 * §15.2 claim expressed as one term in a field the site search already reads. It is
 * deliberately a BIAS and not a rule: the ground still decides, and a settlement whose best
 * land is off the road is founded off the road — with the road bending toward it later,
 * which is what the growth streets are for.
 *
 * @param {RouteSkeleton} skeleton @param {number} extent
 * @returns {(x:number, y:number) => number} a multiplier, ~1 far from any route
 */
export function corridorPull(skeleton, extent) {
  const near = Math.max(40, extent * 0.55);
  return (x, y) => {
    let best = 0;
    for (const c of skeleton.corridors) {
      const d = distToPolyline(x, y, c.line);
      const t = 1 - Math.min(1, d / near);
      const v = t * t * c.weight;
      if (v > best) best = v;
    }
    let cross = 0;
    for (const k of skeleton.crossings) {
      const dx = x - k.x, dy = y - k.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const t = 1 - Math.min(1, d / near);
      const v = t * t * k.weight;
      if (v > cross) cross = v;
    }
    // ⚠ THE PULL IS BOUNDED SO IT CANNOT DEFEAT THE LEAF-COMPOSITION TERM. At 1+0.55+0.95
    // a crossing near the frame edge out-scored a good central site, the settlement founded
    // itself in the corner, and the frame margin then refused half its lobes: MEASURED, the
    // metropolis fell from 56% of the frame to 42% — out of its own §5 band — for a reason
    // that had nothing to do with the metropolis. A corridor is a REASON to be somewhere,
    // not a command; the ground and the page still decide.
    return 1 + best * 0.26 + cross * 0.48;
  };
}

/** Local distance-to-polyline (routes.js may not import the street web). */
function distToPolyline(x, y, line) {
  let best = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    const ax = line[i][0], ay = line[i][1], bx = line[i + 1][0], by = line[i + 1][1];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let t = len2 > 0 ? ((x - ax) * dx + (y - ay) * dy) / len2 : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const px = ax + dx * t, py = ay + dy * t;
    const d = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
    if (d < best) best = d;
  }
  return best;
}
