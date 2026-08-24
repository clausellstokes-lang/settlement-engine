/**
 * domain/townMap/fabric/frontageFusion.js — ⭐⭐⭐ THE FRONTAGE FUSION (REG-1, L-REG-2/-9).
 *
 * ⛔ THE DEFECT, QUOTED FROM ITS OWN SOURCE. `parcels.PLOT_SHAPE.partyGap` is 0.035 frontages
 * and its comment says why: *"The residual exists only so the ink of one does not merge with
 * the ink of the next into a single mass."* That is §571.4's finding — *"buildings are
 * FREESTANDING rectangles with gaps to every neighbour, so the eye cannot aggregate them into
 * blocks"* — written at the exact line that causes it. The packer had already DECIDED, per
 * boundary, that these two houses share a wall (`decideGap` → `kind:'party'`); it then drew
 * them apart anyway so their outlines would not touch.
 *
 * ⭐ THE CURE IS NOT A STROKE, IT IS A BODY. Where the boundary decision was `party`, the run
 * of holdings is emitted as ONE MASS POLYGON whose street face is a continuous wall, with the
 * shared walls surviving as INTERIOR PARTY SEGMENTS at the §2.3.2 ladder's 0.5× rung. L-REG-9
 * is then satisfied by construction: the 2× blockfront weight lands on the fused mass's OWN
 * street edge, which is real geometry, instead of on a floating bar drawn over unfused plots.
 *
 * ⭐⭐ IT IS A LATE DERIVATION OVER THE **DRAWN** SET, AND THAT IS THE WHOLE OF ITS SAFETY.
 * The parcels are not touched: the census's 1:1 claim, the §17 ground law, the §202 access law
 * and every drawn-body census still see exactly the bodies they saw before. Fusion reads what
 * the finished leaf contains — after the ground law clipped, after the access law freed, after
 * the §181.2a LOD merge took the distant matrix — so it can never fuse a body the leaf does
 * not draw, and it can never re-enter ground a law took away (see `columnise`, which reads the
 * FINAL polygon and refuses anything that is no longer rectilinear in its run's own frame).
 *
 * ⭐ WHAT BREAKS A RUN, AND EVERY ONE OF THEM MEANS SOMETHING (the charter's "gaps remain only
 * where they mean something"):
 *   a non-party boundary   — a passage, a slot, a fire break, a drainage slit, a packing wedge:
 *                            `decideGap` already gave each one its reason, and each is a gap
 *                            the reader is supposed to see.
 *   a cull                 — the seat between two accepted plots was refused (ragged edge,
 *                            right of way, partition owner, terrain). Detected as a break in
 *                            `seq`, so a hole in the rank is never bridged.
 *   a cross-alley          — `afterAlley`; the alley IS the gap.
 *   a new span / rank / block — carried in `runKey` itself, so they cannot be crossed.
 *   a derelict plot        — a roofless shell must keep its own dashed outline (J-REG1-3).
 *   a gable-end plot       — the packer's own words: *"the neighbours' rhythm breaks"*.
 *   a body the law reshaped— anything not rectilinear-with-one-interval in the run's frame.
 * A LANDMARK, A COMPOUND, THE WALL BAND, A WATER CLAIM, A COMMON and a DISTRICT boundary all
 * break a run for free: none of them is a parcel, so no run ever spans one.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no ambient rng. The run frames carry the
 * organism's own `ux/uy` (already table-quantised by `trigTable`), so the projection below is
 * the exact inverse of the cut's own `toWorld` and introduces no new angle.
 */

import { absArea } from './fabricGeometry.js';

/**
 * How close two projected coordinates must be to count as the same line, in view units.
 * The leaf is 1000 units across and the projection is the algebraic inverse of `toWorld`,
 * so the only error here is float rounding at ~1e-12; 1e-6 is six orders above it and four
 * below the thinnest gap the law can emit (a party residual at the metropolis is 0.19 units).
 */
const EPS = 1e-6;

/** Project a world point into a run's own (u along the frontage, v into the block) frame. */
function project(fr, x, y) {
  const dx = x - fr.ax, dy = y - fr.ay;
  return [dx * fr.ux + dy * fr.uy, dx * -fr.uy + dy * fr.ux];
}

/** Map a run-frame point back to the world. */
function unproject(fr, u, v) {
  return [fr.ax + fr.ux * u - fr.uy * v, fr.ay + fr.uy * u + fr.ux * v];
}

/**
 * Decompose one drawn body into the u-strips of its own run frame.
 *
 * ⚠ IT READS THE FINAL POLYGON, NEVER THE CUT'S PARAMETERS, and that is deliberate. §17's
 * ground law clips a footprint to the kerb line and to the party line, and a mass built from
 * the plot's pre-clip rectangle would put drawn ink back into a carriageway the law had
 * already cleared. A clipped body that is still a rectangle in its run's grain columnises and
 * fuses; anything else returns null and BREAKS the run, which is the safe direction.
 *
 * @returns {Array<{uA:number,uB:number,vLo:number,vHi:number}>|null}
 */
export function columnise(fr, poly) {
  if (!Array.isArray(poly) || poly.length < 4) return null;
  const P = poly.map(([x, y]) => project(fr, x, y));
  const n = P.length;
  // Rectilinear in this frame? Every edge must run along u or along v.
  for (let i = 0; i < n; i++) {
    const a = P[i], b = P[(i + 1) % n];
    if (Math.abs(a[0] - b[0]) > EPS && Math.abs(a[1] - b[1]) > EPS) return null;
  }
  // The distinct u ordinates, in order.
  const us = [];
  for (const p of P) us.push(p[0]);
  us.sort((a, b) => a - b);
  /** @type {number[]} */ const cuts = [];
  for (const u of us) if (!cuts.length || u - cuts[cuts.length - 1] > EPS) cuts.push(u);
  if (cuts.length < 2) return null;
  /** @type {Array<{uA:number,uB:number,vLo:number,vHi:number}>} */ const strips = [];
  for (let j = 0; j + 1 < cuts.length; j++) {
    const uMid = (cuts[j] + cuts[j + 1]) / 2;
    /** @type {number[]} */ const hits = [];
    for (let i = 0; i < n; i++) {
      const a = P[i], b = P[(i + 1) % n];
      if (Math.abs(a[1] - b[1]) > EPS) continue;             // a v-edge crosses no u-scanline
      const lo = Math.min(a[0], b[0]), hi = Math.max(a[0], b[0]);
      if (uMid > lo && uMid < hi) hits.push(a[1]);
    }
    if (hits.length !== 2) return null;                       // a hole or a re-entrant: refuse
    const vLo = Math.min(hits[0], hits[1]), vHi = Math.max(hits[0], hits[1]);
    if (vHi - vLo <= EPS) return null;
    const prev = strips[strips.length - 1];
    if (prev && Math.abs(prev.vLo - vLo) <= EPS && Math.abs(prev.vHi - vHi) <= EPS) prev.uB = cuts[j + 1];
    else strips.push({ uA: cuts[j], uB: cuts[j + 1], vLo, vHi });
  }
  return strips.length ? strips : null;
}

/** The modal member of a list, ties broken by sort order so the answer never depends on input order. */
function modal(list) {
  /** @type {Map<string, number>} */ const seen = new Map();
  for (const v of list) seen.set(v, (seen.get(v) || 0) + 1);
  let best = null, bestN = -1;
  for (const k of [...seen.keys()].sort()) {
    const c = seen.get(k);
    if (c > bestN) { best = k; bestN = c; }
  }
  return best;
}

/**
 * Fuse the party-walled runs of one leaf.
 *
 * @param {Object} a
 * @param {Array<any>} a.parcels    THE DRAWN parcels (post ground-law, post access-law)
 * @param {Array<any>} a.frames     the run frames the packer published
 * @param {Set<string>} [a.merged]  §181.2a LOD keys — already drawn as masses, never re-fused
 * @param {number} a.frontage       the calibrated plot module, for the reported reason only
 */
export function fuseFrontages(a) {
  const parcels = Array.isArray(a.parcels) ? a.parcels : [];
  const merged = a.merged instanceof Set ? a.merged : new Set();
  /** @type {Map<string, any>} */ const frames = new Map();
  for (const fr of (a.frames || [])) frames.set(fr.runKey, fr);

  // ── group the drawn parcels by their run, in first-appearance order (deterministic).
  /** @type {Map<string, any[]>} */ const runs = new Map();
  let eligible = 0;
  for (const p of parcels) {
    if (!p || !p.fuse || merged.has(p.key)) continue;
    if (!frames.has(p.fuse.runKey)) continue;
    eligible++;
    if (!runs.has(p.fuse.runKey)) runs.set(p.fuse.runKey, []);
    runs.get(p.fuse.runKey).push(p);
  }

  /** @type {any[]} */ const masses = [];
  /** @type {Set<string>} */ const memberKeys = new Set();
  /** @type {Set<string>} */ const suppressPlotKeys = new Set();
  const counts = {
    runs: runs.size, eligibleParcels: eligible, groups: 0, fusedParcels: 0,
    brokeNonParty: 0, brokeSeq: 0, brokeAlley: 0, brokeDerelict: 0, brokeGable: 0, brokeShape: 0,
    largestGroup: 0, partyLines: 0, frontEdges: 0,
  };

  for (const [runKey, listRaw] of runs) {
    const fr = frames.get(runKey);
    const list = listRaw.slice().sort((x, y) => x.fuse.seq - y.fuse.seq);
    /** @type {Array<{p:any, strips:any[]}>} */ let group = [];
    const flush = () => {
      if (group.length >= 2) emit(fr, runKey, group, masses, memberKeys, suppressPlotKeys, counts);
      group = [];
    };
    for (const p of list) {
      const strips = columnise(fr, p.polygon);
      const joins = group.length > 0
        && p.fuse.party === true
        && p.fuse.afterAlley !== true
        && p.fuse.seq === group[group.length - 1].p.fuse.seq + 1
        && p.derelict !== true && group[group.length - 1].p.derelict !== true
        && p.gable !== true && group[group.length - 1].p.gable !== true
        && strips != null;
      if (group.length > 0 && !joins) {
        // Name the reason the run broke — a break with no reason is the thing this module exists
        // to refuse, and the counts are what a later wave argues with.
        if (strips == null) counts.brokeShape++;
        else if (p.fuse.afterAlley === true) counts.brokeAlley++;
        else if (p.fuse.seq !== group[group.length - 1].p.fuse.seq + 1) counts.brokeSeq++;
        else if (p.derelict === true || group[group.length - 1].p.derelict === true) counts.brokeDerelict++;
        else if (p.gable === true || group[group.length - 1].p.gable === true) counts.brokeGable++;
        else counts.brokeNonParty++;
        flush();
      }
      if (strips) group.push({ p, strips });
      else group = [];
    }
    flush();
  }

  const reason = masses.length
    ? `${counts.groups} party-walled masses over ${counts.fusedParcels} of ${eligible} drawn plots `
      + `in ${runs.size} rank runs (module ${Math.round(a.frontage * 100) / 100}u); largest ${counts.largestGroup}`
    : `no run reached two party-walled plots (${eligible} drawn plots in ${runs.size} rank runs)`;
  return { masses, memberKeys, suppressPlotKeys, counts, reason };
}

/** Emit one fused mass from a group of ≥2 party-walled members. */
function emit(fr, runKey, group, masses, memberKeys, suppressPlotKeys, counts) {
  // ── THE SNAP IS THE FUSION. Each member's first strip starts where the previous member's
  //    last strip ended, which closes the 0.035-frontage party residual EXACTLY — no dilation,
  //    no tolerance, and never one unit of ground beyond the two plots' own boundary.
  /** @type {Array<{uA:number,uB:number,vLo:number,vHi:number}>} */ const strips = [];
  /** @type {number[]} */ const partyAt = [];
  for (let m = 0; m < group.length; m++) {
    const own = group[m].strips.map((s) => ({ ...s }));
    if (m > 0) {
      const boundary = strips[strips.length - 1].uB;
      own[0].uA = boundary;
      partyAt.push(boundary);
    }
    for (const s of own) strips.push(s);
  }
  // Collapse strips that carry the same v-extent, so a run of identical plots is one rectangle.
  /** @type {Array<{uA:number,uB:number,vLo:number,vHi:number}>} */ const S = [];
  for (const s of strips) {
    const prev = S[S.length - 1];
    if (prev && Math.abs(prev.vLo - s.vLo) <= EPS && Math.abs(prev.vHi - s.vHi) <= EPS) prev.uB = s.uB;
    else S.push(s);
  }
  const dir = fr.dir >= 0 ? 1 : -1;
  const frontOf = (s) => (dir > 0 ? s.vLo : s.vHi);
  const backOf = (s) => (dir > 0 ? s.vHi : s.vLo);

  // ── the ring: the front skyline left→right, then the back skyline right→left.
  /** @type {Array<[number,number]>} */ const ring = [];
  const put = (u, v) => {
    const w = unproject(fr, u, v);
    const last = ring[ring.length - 1];
    if (last && Math.abs(last[0] - w[0]) <= EPS && Math.abs(last[1] - w[1]) <= EPS) return;
    ring.push(w);
  };
  for (const s of S) { put(s.uA, frontOf(s)); put(s.uB, frontOf(s)); }
  for (let i = S.length - 1; i >= 0; i--) { put(S[i].uB, backOf(S[i])); put(S[i].uA, backOf(S[i])); }
  if (ring.length > 2) {
    const f = ring[0], l = ring[ring.length - 1];
    if (Math.abs(f[0] - l[0]) <= EPS && Math.abs(f[1] - l[1]) <= EPS) ring.pop();
  }
  if (ring.length < 4) return;

  // ── THE STREET-FACING EDGE, marked. Only the runs ALONG the frontage are street face; the
  //    vertical steps between two setbacks are side walls and must not carry the 2× weight.
  /** @type {Array<Array<[number,number]>>} */ const frontEdge = [];
  for (const s of S) frontEdge.push([unproject(fr, s.uA, frontOf(s)), unproject(fr, s.uB, frontOf(s))]);

  // ── THE INTERIOR PARTY WALLS, over the depth the two neighbours actually share.
  /** @type {Array<Array<[number,number]>>} */ const partyLines = [];
  for (const u of partyAt) {
    let L = null, R = null;
    for (const s of S) {
      if (Math.abs(s.uB - u) <= EPS) L = s;
      if (Math.abs(s.uA - u) <= EPS) R = s;
    }
    if (!L || !R) continue;                       // the collapse merged them: one wall, no seam
    const depth = (v) => (v - fr.frontV) * dir;   // 0 at the street line, positive into the block
    const from = Math.max(depth(frontOf(L)), depth(frontOf(R)));
    const to = Math.min(depth(backOf(L)), depth(backOf(R)));
    if (to - from <= EPS) continue;               // no shared wall — the ring's own step says so
    partyLines.push([
      unproject(fr, u, fr.frontV + dir * from),
      unproject(fr, u, fr.frontV + dir * to),
    ]);
  }

  const members = group.map((g) => g.p);
  const tones = members.map((p) => (Number.isFinite(p.tone) ? p.tone : 0.5));
  masses.push({
    key: `fuse.${runKey}#${members[0].fuse.seq}`,
    polygon: ring,
    frontEdge,
    partyLines,
    memberKeys: members.map((p) => p.key),
    members: members.length,
    organismKey: members[0].organismKey,
    // ⭐ ONE FILL PER MASS (J-REG1-2). hf320's blocks carry ONE tone subdivided by LINE, not by
    //   tint; §10.A3's ward patchiness survives BETWEEN masses and on every unfused plot.
    material: modal(members.map((p) => String(p.material || 'thatch'))),
    character: modal(members.map((p) => String(p.character || ''))),
    wealth: modal(members.map((p) => String(p.wealth || 'modest'))),
    tone: Math.round((tones.reduce((x, t) => x + t, 0) / tones.length) * 1000) / 1000,
    area: absArea(ring),
  });
  for (const p of members) memberKeys.add(p.key);
  // The FIRST member's plot line is the group's own outer boundary — a real gap boundary, and
  // it stays a plot tick. Every later member's is a party wall and is drawn as one instead.
  for (let m = 1; m < members.length; m++) suppressPlotKeys.add(members[m].key);
  counts.groups++;
  counts.fusedParcels += members.length;
  counts.partyLines += partyLines.length;
  counts.frontEdges += frontEdge.length;
  if (members.length > counts.largestGroup) counts.largestGroup = members.length;
}
