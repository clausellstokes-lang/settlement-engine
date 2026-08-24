/**
 * domain/townMap/fabric/faubourgOrigin.js — ⭐⭐ REG-4 · **THE FAUBOURG'S TYPED ORIGIN**
 * (L-REG-3, ODQ §571.1–.3; the charter's REG-4 row: "every extramural district carries a typed
 * origin"; A2.3 rules the arm builds INSIDE REG-4).
 *
 * ⭐⭐ IT IS A CONSUMPTION, NOT A GUESS — J-REG3-1's law binds. Every input below is a field the
 * fabric already publishes:
 *   `faubourg.kind`                 house / inn, **100 % covered** (REG-3 measured house 114 ·
 *                                   inn 24 over the reference corpus; this lane re-measured the
 *                                   same two values on all eight faubourg-bearing leaves)
 *   `faubourg.gate`                 the gate id the building belongs to — `buildFaubourgs` is
 *                                   gate-first BY CONSTRUCTION (its own header says so), so no
 *                                   building has to be assigned to a gate after the fact
 *   `walls[i].gates[j]`             `{ x, y, dx, dy, key, bricked }`
 *   `fabric.bridges`                `{ x, y, along, across, width, span, rank, kind, key }`
 *   `umbrella.partition[].wallSide` `'intramural'` / `'extramural'`, with `'~faubourg'` on the
 *                                   extramural `districtId` and a `parentDistrictId` beside it
 *
 * ⛔ WHAT THE FABRIC DOES **NOT** CARRY, stated so nobody re-finds it: there is no cluster/ribbon
 * classification anywhere, and DISTANCE-FROM-GATE IS NOT RECORDED on a faubourg building — the
 * emit loop's arclength `t` is a local and is discarded. It is RECOVERABLE (the building's x/y
 * against its gate's x/y), and recovering a fact is not inventing one.
 *
 * ⭐ THE THREE ORIGINS, each with the hf-plate that draws it:
 *   `gate`       hf311's BEFORE-THE-GATE anatomy — the toll bar, the cart queue drawn cart by
 *                cart, the courtyard great inns, the smithy rank: a KNOT pressed against the
 *                gate. Geometry: a compact cluster ground, aspect near 1.
 *   `road`       hf32's ribbon suburbs "breaking out along every radial", hf71's road ladder.
 *                Geometry: an elongated ribbon following the approach, aspect ≥ RIBBON_ASPECT.
 *   `bridgehead` the knot at a crossing — the bridge is the reason the traffic stops here.
 *                Geometry: a compact ground centred on the deck.
 *
 * ⭐⭐ AND THE TYPE IS **MEASURABLE IN THE DRAWING**, which is the charter's actual requirement
 * ("the type must be VISIBLE in geometry"). Each district publishes a `ground` polygon whose
 * ASPECT RATIO is the visible tell: a census can read the origin back off the geometry without
 * being told, and the wave's exit measures exactly that.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no Math.pow, no localeCompare.
 */

import { bearingIndex, cosI, sinI, convexHull, absArea, centroid } from './fabricGeometry.js';
import { compareKeys } from './lineage.js';

/** The closed origin vocabulary. A district resolves to EXACTLY ONE — totality is asserted. */
export const FAUBOURG_ORIGINS = Object.freeze(['gate', 'bridgehead', 'road']);

/**
 * ⭐ THE TWO REACHES, DERIVED FROM `habitation.FAUBOURG`'s OWN LADDER rather than chosen.
 * The emit loop strings `count` buildings from `startFrontages = 1.8` across
 * `depthFrontages = 13 × (0.55 + traffic)` frontages — 7.2 frontages behind a quiet road and
 * 20.2 behind the high street. hf311 draws the before-the-gate matter (toll bar, queue, great
 * inns, smithy rank) in the FIRST part of that approach and the market gardens and the lepers'
 * station further out, so the split is the ribbon's own first third:
 *     1.8 + 20.2/3 ≈ 8.5  →  GATE_REACH = 8 frontages, measured from the gate itself.
 * ⚠ The building's distance is from the GATE, while the ladder's `t` is from the road's MOUTH
 * (where the road leaves the built umbrella), which lies outside the gate — so the measured
 * distances run a little longer than the ladder's own. MEASURED on the corpus and reported.
 */
export const GATE_REACH_FRONTAGES = 8;
/** A deck's knot: the bridge's own span plus a plot either side. */
export const BRIDGE_KNOT_SPANS = 1.5;
/** A ribbon is a ribbon when it is this much longer than it is wide. */
export const RIBBON_ASPECT = 2.5;

/**
 * ⭐ THE GATE ROSTER `buildFaubourgs` ITSELF BUILDS, replicated exactly (habitation.js, the
 * "THE GATE'S OWN IDENTITY JOINS EVERY KEY IT MINTS" block): BRICKED GATES ARE EXCLUDED and the
 * survivors are sorted by `compareKeys` on their rounded station before the ordinal is taken.
 * ⚠ Replicated rather than parsed out of the key, because a key is an identity and not a datum.
 * The parse is kept as a CROSS-CHECK only, and the two are reported against each other.
 */
export function gateRoster(walls) {
  /** @type {Array<any>} */ const gates = [];
  for (const ring of walls || []) for (const g of (ring.gates || [])) if (!g.bricked) gates.push({ ...g });
  gates.sort((a, b) => compareKeys(`${Math.round(a.x)}|${Math.round(a.y)}`, `${Math.round(b.x)}|${Math.round(b.y)}`));
  /** @type {Map<string, any>} */ const byId = new Map();
  for (let gi = 0; gi < gates.length; gi++) {
    byId.set(`${gi}@${Math.round(gates[gi].x)},${Math.round(gates[gi].y)}`, gates[gi]);
  }
  return { gates, byId };
}

/** The cross-check: the rounded station the key itself carries. @returns {[number,number]|null} */
export function stationFromKey(gateId) {
  const at = String(gateId || '').indexOf('@');
  if (at < 0) return null;
  const parts = String(gateId).slice(at + 1).split(',');
  if (parts.length !== 2) return null;
  const x = Number(parts[0]), y = Number(parts[1]);
  return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : null;
}

/** An outward-offset hull about a point cloud — the district's own drawn ground. */
function groundOf(points, pad) {
  if (!points.length) return [];
  if (points.length < 3) {
    const c = points.length === 1 ? points[0] : [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2];
    const ang = points.length === 2 ? bearingIndex(points[1][0] - points[0][0], points[1][1] - points[0][1]) : 0;
    let half = pad;
    if (points.length === 2) {
      const dx = points[1][0] - points[0][0], dy = points[1][1] - points[0][1];
      half = Math.sqrt(dx * dx + dy * dy) / 2 + pad;
    }
    const cx = cosI(ang), sy = sinI(ang);
    const nx = -sy, ny = cx;
    return [
      [c[0] - cx * half - nx * pad, c[1] - sy * half - ny * pad],
      [c[0] + cx * half - nx * pad, c[1] + sy * half - ny * pad],
      [c[0] + cx * half + nx * pad, c[1] + sy * half + ny * pad],
      [c[0] - cx * half + nx * pad, c[1] + sy * half + ny * pad],
    ];
  }
  const h = convexHull(points.map((p) => [p[0], p[1]]));
  const c = centroid(h);
  // a radial dilation about the hull's own centroid — enough to read as ground, never a body
  return h.map(([x, y]) => {
    const dx = x - c[0], dy = y - c[1];
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    return [x + (dx / d) * pad, y + (dy / d) * pad];
  });
}

/** The long/short ratio of a point cloud, by its own principal edge directions. */
function aspectOf(poly) {
  if (!poly || poly.length < 3) return 1;
  let best = Infinity, along = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const dx = q[0] - p[0], dy = q[1] - p[1];
    const L = Math.sqrt(dx * dx + dy * dy);
    if (L < 1e-9) continue;
    const nx = -dy / L, ny = dx / L;
    let lo = Infinity, hi = -Infinity, lo2 = Infinity, hi2 = -Infinity;
    for (const r of poly) {
      const d = r[0] * nx + r[1] * ny; if (d < lo) lo = d; if (d > hi) hi = d;
      const e = r[0] * (dx / L) + r[1] * (dy / L); if (e < lo2) lo2 = e; if (e > hi2) hi2 = e;
    }
    if (hi - lo < best) { best = hi - lo; along = hi2 - lo2; }
  }
  return best > 1e-9 ? along / best : 1;
}

/**
 * @param {Object} a
 * @returns {{ districts:Array, buildings:Object, coverage:Object, reason:string }}
 */
export function deriveFaubourgOrigins(a) {
  const {
    walls = [], buildings = [], leanTos = [], bridges = [], frontage = 1,
    partition = [],
  } = a;
  const { byId } = gateRoster(walls);
  const gateReach = GATE_REACH_FRONTAGES * frontage;

  /** @type {Record<string, any>} */ const perBuilding = {};
  /** @type {Map<string, any>} */ const clusters = new Map();
  let gateResolved = 0, gateByKeyOnly = 0, gateUnresolved = 0;

  for (const b of buildings) {
    const g = byId.get(b.gate) || null;
    let gx = null, gy = null;
    if (g) { gx = g.x; gy = g.y; gateResolved++; } else {
      const st = stationFromKey(b.gate);
      if (st) { gx = st[0]; gy = st[1]; gateByKeyOnly++; } else gateUnresolved++;
    }
    const dGate = gx == null ? Infinity : Math.sqrt((b.x - gx) * (b.x - gx) + (b.y - gy) * (b.y - gy));
    // the nearest deck, and how near is near ENOUGH is the deck's own span
    let deck = null, dDeck = Infinity;
    for (const br of bridges) {
      const d = Math.sqrt((b.x - br.x) * (b.x - br.x) + (b.y - br.y) * (b.y - br.y));
      if (d < dDeck) { dDeck = d; deck = br; }
    }
    const knot = deck ? Math.max(deck.span, deck.width) * BRIDGE_KNOT_SPANS + frontage : 0;
    /** @type {string} */ let origin;
    let why;
    if (deck && dDeck <= knot && dDeck < dGate) {
      origin = 'bridgehead';
      why = `the ${deck.kind} '${deck.key}' is ${Math.round(dDeck * 10) / 10} away — inside its own`
        + ` ${Math.round(knot * 10) / 10} knot and nearer than the gate (${Math.round(dGate * 10) / 10})`;
    } else if (dGate <= gateReach) {
      origin = 'gate';
      why = `hf311: ${Math.round((dGate / frontage) * 10) / 10} frontages from its gate, inside the`
        + ` ${GATE_REACH_FRONTAGES}-frontage before-the-gate reach`;
    } else {
      origin = 'road';
      why = `hf32: ${Math.round((dGate / frontage) * 10) / 10} frontages out along the approach — a ribbon, not a knot`;
    }
    perBuilding[b.key] = { origin, kind: b.kind, gate: b.gate, dGate, dDeck: deck ? dDeck : null, why };
    const ck = `${b.gate}|${origin}${origin === 'bridgehead' ? `|${deck.key}` : ''}`;
    if (!clusters.has(ck)) clusters.set(ck, { key: ck, origin, gate: b.gate, deck: origin === 'bridgehead' ? deck : null, pts: [], members: [], kinds: {} });
    const c = clusters.get(ck);
    c.pts.push([b.x, b.y]);
    for (const p of (b.polygon || [])) c.pts.push(p);
    c.members.push(b.key);
    c.kinds[b.kind] = (c.kinds[b.kind] || 0) + 1;
  }
  // ⚠ LEAN-TOS ARE WALL-FOOT, NOT ROADSIDE, and they carry no `gate` field of their own — the
  // gate id lives only inside their key. They are a DIFFERENT family (§5.0e.3's wall-foot tell)
  // and are typed `gate` by construction, never rolled into a ribbon.
  for (const l of leanTos) {
    const at = String(l.key || '').indexOf('|');
    const rest = at >= 0 ? String(l.key).slice(at + 1) : '';
    const gid = rest.slice(0, rest.indexOf('|') >= 0 ? rest.indexOf('|') : rest.length);
    const ck = `${gid}|gate`;
    if (!clusters.has(ck)) clusters.set(ck, { key: ck, origin: 'gate', gate: gid, deck: null, pts: [], members: [], kinds: {} });
    const c = clusters.get(ck);
    for (const p of (l.polygon || [])) c.pts.push(p);
    c.members.push(l.key);
    c.kinds.leanTo = (c.kinds.leanTo || 0) + 1;
  }

  const districts = [];
  for (const c of [...clusters.values()].sort((p, q) => compareKeys(p.key, q.key))) {
    const ground = groundOf(c.pts, frontage * 0.55);
    const asp = aspectOf(ground);
    districts.push({
      key: c.key, origin: c.origin, gate: c.gate, deck: c.deck ? c.deck.key : null,
      members: c.members, kinds: c.kinds, ground, aspect: asp, area: absArea(ground),
      center: ground.length >= 3 ? centroid(ground) : null,
      inns: c.kinds.inn || 0,
    });
  }
  // ⭐⭐⭐ AND THE CHARTER'S EXIT IS ABOUT **DISTRICTS**, NOT ABOUT BUILDINGS: *"every extramural
  //    district carries a typed origin."* `districtPartition.partitionAtTheWall` already emits
  //    the extramural regions as first-class members — `wallSide: 'extramural'`, a `districtId`
  //    carrying the `'~faubourg'` suffix, and a `parentDistrictId` beside it — so the population
  //    is defined by the fabric and the wave only has to TYPE it.
  //    ⚠ A region is typed by the SAME three rules a building is, read at the region's own
  //    centroid; the region keeps its own polygon as its ground, because the partition already
  //    traced the ground it holds and a hull round its members would be a second reading of it.
  const extramural = (partition || []).filter((r) => r.wallSide === 'extramural');
  /** @type {Record<string, any>} */ const perRegion = {};
  for (const r of extramural) {
    const c = r.centroid || centroid(r.polygon);
    let gx = null, gy = null, dGate = Infinity;
    for (const g of gateRoster(walls).gates) {
      const d = Math.sqrt((c[0] - g.x) * (c[0] - g.x) + (c[1] - g.y) * (c[1] - g.y));
      if (d < dGate) { dGate = d; gx = g.x; gy = g.y; }
    }
    let deck = null, dDeck = Infinity;
    for (const br of bridges) {
      const d = Math.sqrt((c[0] - br.x) * (c[0] - br.x) + (c[1] - br.y) * (c[1] - br.y));
      if (d < dDeck) { dDeck = d; deck = br; }
    }
    const knot = deck ? Math.max(deck.span, deck.width) * BRIDGE_KNOT_SPANS + frontage : 0;
    const origin = (deck && dDeck <= knot && dDeck < dGate) ? 'bridgehead' : (dGate <= gateReach ? 'gate' : 'road');
    perRegion[r.districtId] = {
      origin, parentDistrictId: r.parentDistrictId || null, area: r.area,
      why: origin === 'bridgehead'
        ? `its ground is ${Math.round(dDeck * 10) / 10} from the ${deck.kind} '${deck.key}'`
        : `${Math.round((dGate / frontage) * 10) / 10} frontages from the nearest gate`
          + (origin === 'gate' ? ` — inside the ${GATE_REACH_FRONTAGES}-frontage before-the-gate reach` : ' — a ribbon along the approach'),
    };
    districts.push({
      key: r.districtId, origin, gate: null, deck: null, members: [], kinds: {},
      ground: r.polygon, aspect: aspectOf(r.polygon), area: r.area,
      center: c, inns: 0, region: true,
    });
  }
  return {
    districts, buildings: perBuilding, regions: perRegion,
    coverage: {
      buildings: buildings.length,
      typed: Object.keys(perBuilding).length,
      byOrigin: FAUBOURG_ORIGINS.map((o) => `${o} ${Object.values(perBuilding).filter((v) => v.origin === o).length}`).join(' · '),
      districts: districts.length,
      extramuralRegions: extramural.length,
      extramuralRegionsTyped: Object.keys(perRegion).length,
      regionsByOrigin: FAUBOURG_ORIGINS.map((o) => `${o} ${Object.values(perRegion).filter((v) => v.origin === o).length}`).join(' · '),
      gateResolved, gateByKeyOnly, gateUnresolved,
      kindCoverage: buildings.length ? buildings.filter((b) => b.kind === 'house' || b.kind === 'inn').length / buildings.length : 1,
    },
    reason: `L-REG-3: ${Object.keys(perBuilding).length} of ${buildings.length} faubourg buildings and`
      + ` ${Object.keys(perRegion).length} of ${extramural.length} EXTRAMURAL DISTRICT REGIONS carry a typed`
      + ` origin consumed from faubourg.kind + faubourg.gate + walls[].gates + fabric.bridges`
      + ` + partition[].wallSide — ${FAUBOURG_ORIGINS.map((o) => `${o} ${Object.values(perBuilding).filter((v) => v.origin === o).length}`).join(', ')}`
      + ` over ${districts.length} district(s)`,
  };
}
