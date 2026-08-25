/**
 * i2-route-trace.mjs — REG-I0 · INSTRUMENT 2 · THE GATE → CENTRE ROUTE TRACE.
 *
 * THE QUESTION (§6's legibility leg): a reader who enters at a gate must be able to FOLLOW a
 * road to the heart of the town without the route pinching shut. This is the legibility test the
 * references pass so easily nobody names it: on a Watabou plan the high street runs from the
 * gate to the market and the eye rides it.
 *
 * ⭐⭐ MEASURED OVER THE FABRIC MODEL, NOT PIXELS — the charter's own instruction, and it is the
 * right one twice over: pixels answer "is this cell pale", which paper, a yard and a field all
 * satisfy, while the MODEL knows which surfaces are CARRIAGEWAY. `fabric.channels` is the
 * published street web (every rank, each with its own derived `width`); `fabric.web.squares`
 * are the market voids, which §576 makes continuous with the street ("a market is one giant
 * street"); `fabric.walls[].gates` are the doors.
 *
 * ═══ THE STREET VOID ═══
 *   VOID = ⋃ channels stamped at their own half-width  ∪  ⋃ square discs at their own radius.
 *   Rasterised at 1 view unit per cell, so a corridor width is read to the unit.
 *
 * ═══ THE CORRIDOR WIDTH FIELD ═══
 *      width(cell) = 2 × (distance from that cell to the nearest NON-void cell)
 *   i.e. the diameter of the largest disc that fits in the void at that point. It is a property
 *   of the VOID, never of the channel that made it, so where two lanes meet the junction is
 *   correctly wide and where a lane is pinched between two blocks it is correctly narrow.
 *
 * ═══ THE MEASURE ═══
 *      bottleneckWidth = max over all gate→centre paths of ( min over path cells of width )
 *   found by BISECTION on the threshold: keep only cells with width ≥ W, ask whether gate and
 *   centre are still connected, and push W as high as connectivity survives. This is the WIDEST
 *   PATH, not the shortest — the question is "how wide a route exists", and a shortest path can
 *   squeeze through a passage while a cart road runs beside it.
 *      pathLengthUnits = the shortest path INSIDE that widest-path void, 8-connected,
 *                        √2 per diagonal step, in view units.
 *      detourRatio     = pathLengthUnits / straight-line gate→centre distance   ← DENOMINATOR
 *                        NAMED: the euclidean distance between the two endpoints. 1.0 is a
 *                        ruler-straight approach; 2.0 means the road doubles the walk.
 *
 * ═══ THE FLOOR — DERIVED, NOT A CONSTANT ═══
 *   The route must never pinch below the settlement's OWN smallest cart lane,
 *   `fabric.web.widths.blockLane` (city 3.87 units, village its own value). A fixed number
 *   would convict a hamlet for not having a city's high street. The floor is reported with
 *   every verdict so a later wave argues with the derivation rather than guessing the constant.
 *
 * CONTROLS (--controls):
 *   POSITIVE   every unbricked gate on a walled leaf must reach the heart
 *   NEGATIVE   --sever=R — the void erased inside a disc of radius R around the heart. The trace
 *              MUST come back DISCONNECTED. A tracer that still finds a route through a hole it
 *              was just shown is following something other than the void.
 *   NEGATIVE   --floor=50 — an absurd floor. Every gate must FAIL while still reporting a real
 *              bottleneck number, proving the verdict and the measurement are separable.
 *   NEGATIVE   a gate moved to an empty corner of the frame must be UNREACHABLE.
 *
 * Usage: node i2-route-trace.mjs --wt=<worktree> [--leaf=city] [--floor=] [--json=]
 *        node i2-route-trace.mjs --wt=<worktree> --controls
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PxMask } from './lib/classify.mjs';
import { distanceTransform } from './lib/morph.mjs';
import { r2, r4, verdict } from './lib/geom.mjs';

export const GRID = 1000;               // 1 view unit per cell
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };

/** the street void, as the model publishes it */
export function streetVoid(fabric, { severRadius = 0, severAt = null } = {}) {
  const M = new PxMask(GRID);
  for (const ch of fabric.channels || []) {
    const hw = Math.max(0.5, (ch.width || 2) / 2);
    const line = ch.line || [];
    for (let k = 0; k + 1 < line.length; k++) M.stampSeg(line[k][0], line[k][1], line[k + 1][0], line[k + 1][1], hw);
  }
  for (const sq of (fabric.web && fabric.web.squares) || []) {
    if (sq.polygon && sq.polygon.length > 2) M.fillPoly(sq.polygon);
    else if (sq.center && sq.radius) {
      const [cx, cy] = sq.center, R = sq.radius;
      for (let y = Math.max(0, Math.floor(cy - R)); y <= Math.min(GRID - 1, Math.ceil(cy + R)); y++) {
        for (let x = Math.max(0, Math.floor(cx - R)); x <= Math.min(GRID - 1, Math.ceil(cx + R)); x++) {
          if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= R * R) M.a[y * GRID + x] = 1;
        }
      }
    }
  }
  // ⚠⚠ THE SEVER CONTROL IS AN ANNULUS, NOT A DISC, AND THE FIRST TRY WAS A DISC.
  // A disc erases the heart itself, so the target no longer snaps to any void cell and the
  // trace reports "the heart is not near a street" — a DIFFERENT failure from the one under
  // test, and one a corner of the square snap window can even survive (measured: a disc of
  // radius 70 still left snappable cells inside a 60-unit Chebyshev window). An ANNULUS leaves
  // the heart's own void intact and cuts every approach to it, which is exactly "the route does
  // not reach", the thing the instrument claims to detect.
  if (severRadius > 0 && severAt) {
    const [cx, cy] = severAt;
    const outer = severRadius + 30;
    for (let y = Math.max(0, Math.floor(cy - outer)); y <= Math.min(GRID - 1, Math.ceil(cy + outer)); y++) {
      for (let x = Math.max(0, Math.floor(cx - outer)); x <= Math.min(GRID - 1, Math.ceil(cx + outer)); x++) {
        const d2 = (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2;
        if (d2 >= severRadius * severRadius && d2 <= outer * outer) M.a[y * GRID + x] = 0;
      }
    }
  }
  return M;
}

/** width(cell) = 2 × distance to the nearest non-void cell, in view units */
export function widthField(M) {
  const D = distanceTransform(M.a, M.n, false);     // distance to EMPTY
  const W = new Float32Array(M.n * M.n);
  for (let i = 0; i < W.length; i++) W[i] = M.a[i] ? D[i] * 2 * M.s : 0;
  return W;
}

/** nearest void cell to a point, within `reach` units — a gate sits ON the wall, beside the road */
function snap(M, x, y, reach = 26) {
  const n = M.n, s = M.s;
  const cx = Math.floor(x / s), cy = Math.floor(y / s);
  const rc = Math.ceil(reach / s);
  let best = -1, bd = Infinity;
  for (let dy = -rc; dy <= rc; dy++) for (let dx = -rc; dx <= rc; dx++) {
    const X = cx + dx, Y = cy + dy;
    if (X < 0 || Y < 0 || X >= n || Y >= n) continue;
    const i = Y * n + X;
    if (!M.a[i]) continue;
    const d = dx * dx + dy * dy;
    if (d < bd) { bd = d; best = i; }
  }
  return best;
}

/** are `a` and `b` connected through cells with width ≥ W? */
function connected(W, n, a, b, thresh) {
  if (W[a] < thresh || W[b] < thresh) return false;
  const seen = new Uint8Array(n * n);
  const q = new Int32Array(n * n);
  let head = 0, tail = 0;
  q[tail++] = a; seen[a] = 1;
  while (head < tail) {
    const p = q[head++];
    if (p === b) return true;
    const x = p % n, y = (p / n) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const X = x + dx, Y = y + dy;
      if (X < 0 || Y < 0 || X >= n || Y >= n) continue;
      const i = Y * n + X;
      if (seen[i] || W[i] < thresh) continue;
      seen[i] = 1; q[tail++] = i;
    }
  }
  return false;
}

/** 8-connected shortest path length in view units through cells with width ≥ thresh */
function pathLength(W, n, s, a, b, thresh) {
  const dist = new Float32Array(n * n).fill(Infinity);
  const heap = [[0, a]];
  dist[a] = 0;
  const pop = () => {
    let bi = 0;
    for (let i = 1; i < heap.length; i++) if (heap[i][0] < heap[bi][0]) bi = i;
    const v = heap[bi]; heap[bi] = heap[heap.length - 1]; heap.pop(); return v;
  };
  // a simple Dijkstra with a linear-scan heap is fine at this scale and is deterministic
  const seen = new Uint8Array(n * n);
  while (heap.length) {
    const [d, p] = pop();
    if (seen[p]) continue;
    seen[p] = 1;
    if (p === b) return d;
    const x = p % n, y = (p / n) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const X = x + dx, Y = y + dy;
      if (X < 0 || Y < 0 || X >= n || Y >= n) continue;
      const i = Y * n + X;
      if (seen[i] || W[i] < thresh) continue;
      const nd = d + (dx && dy ? Math.SQRT2 : 1) * s;
      if (nd < dist[i]) { dist[i] = nd; heap.push([nd, i]); }
    }
  }
  return null;
}

export function trace(fabric, { floorUnits = null, severRadius = 0 } = {}) {
  const heart = ((fabric.web && fabric.web.squares) || []).find((s) => s.key === 'square.heart')
    || ((fabric.web && fabric.web.squares) || [])[0]
    || (fabric.nuclei && fabric.nuclei[0] ? { key: 'nucleus.0', center: [fabric.nuclei[0].x, fabric.nuclei[0].y] } : null);
  if (!heart) return { applicable: false, status: 'NOT APPLICABLE — this leaf publishes no market square and no nucleus to aim at' };
  const FLOOR = floorUnits != null ? floorUnits
    : r2((fabric.web && fabric.web.widths && fabric.web.widths.blockLane) || 3.5);
  const M = streetVoid(fabric, { severRadius, severAt: heart.center });
  const W = widthField(M);
  const n = M.n, s = M.s;
  const target = snap(M, heart.center[0], heart.center[1], 60);
  const gates = [];
  for (const w of fabric.walls || []) for (const g of w.gates || []) gates.push({ ...g, ringEpoch: w.epoch, ringKind: w.kind });
  // ⚠⚠ AN UNWALLED LEAF HAS NO GATES, AND ITS ROAD DOES NOT BEGIN WHERE THE VOID DOES.
  // MEASURED on the village: both road entries reported "not within 40 units of any street void"
  // and the leaf scored 0/2 — not because the village is unroutable but because `web.roads[].line`
  // begins out at the frame edge while `channels` only carries the drawn carriageway. Taking the
  // road's FIRST VERTEX as the entry measures where the road is DECLARED, not where the reader
  // meets it. The entry is therefore the first point ALONG the road that lands in the drawn void
  // — walking inward from the edge, which is what a reader does.
  const enterAlong = (line) => {
    for (const p of line) if (snap(M, p[0], p[1], 8) >= 0) return p;
    return line[0];
  };
  const subjects = gates.length ? gates
    : ((fabric.web && fabric.web.roads) || []).map((r) => {
      const p = enterAlong(r.line);
      return { key: `approach:${r.key}`, x: p[0], y: p[1], bricked: false, ringKind: 'no circuit — road entry, snapped to the first drawn point along the road' };
    });

  const rows = [];
  for (const g of subjects) {
    const from = snap(M, g.x, g.y, 40);
    if (from < 0 || target < 0) {
      rows.push({ gate: g.key, bricked: !!g.bricked, reachable: false, reason: from < 0 ? 'gate is not within 40 units of any street void' : 'the heart is not within 60 units of any street void' });
      continue;
    }
    // bisection on the width threshold over the field's own distinct values
    let lo = 0, hi = Math.max(W[from], W[target]);
    if (!connected(W, n, from, target, 0.0001)) {
      rows.push({ gate: g.key, bricked: !!g.bricked, reachable: false, reason: 'DISCONNECTED — no path through the street void at any width' });
      continue;
    }
    for (let it = 0; it < 18; it++) {
      const mid = (lo + hi) / 2;
      if (connected(W, n, from, target, mid)) lo = mid; else hi = mid;
    }
    const bottleneck = lo;
    const len = pathLength(W, n, s, from, target, bottleneck * 0.999);
    const straight = Math.hypot(g.x - heart.center[0], g.y - heart.center[1]);
    rows.push({
      gate: g.key, bricked: !!g.bricked, ringKind: g.ringKind, reachable: true,
      bottleneckWidthUnits: r2(bottleneck), pathLengthUnits: r2(len),
      straightLineUnits: r2(straight), detourRatio: straight > 0 ? r4(len / straight) : null,
      pass: bottleneck >= FLOOR,
    });
  }
  const live = rows.filter((r) => !r.bricked);
  return {
    applicable: true, heart: heart.key, heartAt: heart.center.map(r2),
    floorUnits: FLOOR, floorSource: floorUnits != null ? 'CLI --floor' : "the leaf's own web.widths.blockLane",
    voidCells: M.count(), gatesTotal: rows.length, gatesBricked: rows.filter((r) => r.bricked).length,
    reachable: live.filter((r) => r.reachable).length, passing: live.filter((r) => r.pass).length,
    subjectsWere: gates.length ? 'circuit gates' : 'road entries (unwalled leaf)',
    rows,
    pass: live.length > 0 && live.every((r) => r.reachable && r.pass),
  };
}

/* ────────────────────────────── CLI ────────────────────────────── */
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
async function corpus(wt) { return import(pathToFileURL(join(wt, 'harness/exemplars.mjs')).href); }

if (import.meta.url === `file://${process.argv[1]}`) {
  const wt = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0/w3f-tree');
  const { buildOne, CORPUS } = await corpus(wt);
  const json = arg('json', null);
  if (process.argv.includes('--controls')) {
    const { fabric } = buildOne(CORPUS.find((s) => s.key === 'city'));
    const P = trace(fabric);
    process.stdout.write(`P  real city        floor=${P.floorUnits} (${P.floorSource})  reachable=${P.reachable}/${P.gatesTotal - P.gatesBricked}  passing=${P.passing}  verdict=${P.pass ? 'PASS' : 'FAIL'}\n`);
    for (const r of P.rows) process.stdout.write(`     ${r.gate.slice(0, 46).padEnd(48)} width=${r.bottleneckWidthUnits} len=${r.pathLengthUnits} straight=${r.straightLineUnits} detour=${r.detourRatio} ${r.pass ? 'PASS' : 'FAIL'}\n`);

    const S = trace(fabric, { severRadius: 90 });
    process.stdout.write(`N1 heart ring-severed  reachable=${S.reachable}/${S.gatesTotal - S.gatesBricked}  verdict=${S.pass ? 'PASS' : 'FAIL'}`
      + `  reason="${(S.rows.find((r) => !r.reachable) || {}).reason || '—'}"\n`);

    const F = trace(fabric, { floorUnits: 50 });
    process.stdout.write(`N2 absurd floor=50     passing=${F.passing}/${F.gatesTotal - F.gatesBricked}  widths still reported: ${F.rows.filter((r) => r.reachable).map((r) => r.bottleneckWidthUnits).join(', ')}\n`);

    // ⚠⚠ THE WILDERNESS GATE MUST BE SITED BY MEASUREMENT, NOT BY EYE. The first try put it at
    // (8,8) and it was REACHABLE: the corpus's roads run out to the frame edge, so a map corner
    // is within 40 units of a carriageway. The site is therefore the cell FARTHEST from any
    // void, found by a distance transform — and every ring's gates are replaced, not just the
    // first, because `gates` is collected across ALL rings and the old core kept supplying its own.
    const V = streetVoid(fabric);
    const DV = distanceTransform(V.a, V.n, true);
    let far = 0;
    for (let i = 1; i < DV.length; i++) if (DV[i] > DV[far]) far = i;
    const fx = (far % V.n + 0.5) * V.s, fy = (Math.floor(far / V.n) + 0.5) * V.s;
    const moved = { ...fabric, walls: fabric.walls.map((w) => ({ ...w, gates: [{ key: `CONTROL.gate_in_the_wilderness@${Math.round(fx)},${Math.round(fy)}`, x: fx, y: fy, bricked: false }] })) };
    const Wd = trace(moved);
    process.stdout.write(`N3 gate in the wilderness @${Math.round(fx)},${Math.round(fy)} (${r2(DV[far] * V.s)} units from any void)`
      + `  reachable=${Wd.reachable}/${Wd.gatesTotal - Wd.gatesBricked}  reason="${(Wd.rows.find((r) => !r.reachable) || {}).reason || '—'}"\n`);

    const live = [
      ['the real city routes every live gate to its heart', P.pass === true && P.reachable > 0],
      // ⚠ THE ASSERTION, NOT THE INSTRUMENT, WAS WRONG THE FIRST TIME. A ring cut at radius
      // 90–120 cannot isolate a gate that stands 53 units from the heart — that gate is INSIDE
      // the cut and still has its road. The claim is therefore about the gates the cut can
      // reach: every gate OUTSIDE the annulus must lose its route, and the one inside must keep
      // it. Asserting both halves is what makes this a control rather than a coincidence.
      ['ring-severing disconnects every gate OUTSIDE the cut', S.rows.filter((r) => !r.bricked && r.straightLineUnits == null ? true : false).length >= 0
        && P.rows.filter((r) => !r.bricked && r.straightLineUnits > 120).every((p) => {
          const s = S.rows.find((q) => q.gate === p.gate);
          return s && s.reachable === false;
        })],
      ['…and leaves the gate INSIDE the cut still routed', (() => {
        const inner = P.rows.filter((r) => !r.bricked && r.straightLineUnits <= 120);
        return inner.length > 0 && inner.every((p) => { const s = S.rows.find((q) => q.gate === p.gate); return s && s.reachable === true; });
      })()],
      ['an absurd floor fails every gate WITHOUT losing the measurement', F.passing === 0 && F.rows.some((r) => r.bottleneckWidthUnits > 0)],
      ['a gate in an empty corner is unreachable', Wd.reachable === 0],
    ];
    process.stdout.write('\n── LIVENESS\n');
    for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    writeFileSync(`${HERE}/out/i2-controls.json`, JSON.stringify({ P, S, F, Wd, liveness: live }, null, 2));
    process.stdout.write(`\nI2_CONTROLS ${live.every((l) => l[1]) ? 'LIVE' : 'BROKEN'}\n`);
  } else {
    const leaf = arg('leaf', 'city');
    const { fabric } = buildOne(CORPUS.find((s) => s.key === leaf));
    const res = trace(fabric, { floorUnits: arg('floor', null) == null ? null : Number(arg('floor')) });
    if (json) writeFileSync(json, JSON.stringify({ leaf, ...res }, null, 2));
    process.stdout.write(JSON.stringify({ leaf, ...res }, null, 2) + `\nI2_${res.pass ? 'PASS' : 'FAIL'}\n`);
  }
}
