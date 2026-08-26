#!/usr/bin/env node
/**
 * harness/laneSPINE3/wallWater.mjs — ⭐⭐⭐ SPINE-3 · **THE CENSUS THAT ASKS WHETHER A WALL IS
 * DRAWN ACROSS OPEN WATER** (ODQ §692.9(ii)).
 *
 * ⛔⛔ **WHY IT EXISTS: THE DEFECT SURFACED THROUGH INK, WHICH MEANS NO CENSUS WAS ASKING.** A
 * reader of DRESS-1b's round-2 plates wrote *"the southern run of the circuit goes straight along
 * and partly ACROSS the bay… with no shoreline under it"* on `city` and `migration`. That is the
 * class the partition was built to make unrepresentable. Nothing in `src/`, `tests/` or `harness/`
 * relates a wrap ring or a WALL edge to a WATER face's geometry — the denominator was zero.
 *
 * ⛔⛔ **AND THE OBVIOUS CENSUS WOULD HAVE READ A TRUE ZERO ON THE DEFECT.** Measured: on `city`,
 * **WALL edges whose midpoint lies inside a WATER face: 0 of 176. WALLBAND faces whose centroid
 * lies inside a WATER face: 0.** The arrangement barely carries the outer ring at all
 * (`insertion.outerSegments: 1, outerRefused: 1`), and the INK is drawn from `wrap.outer` and the
 * published fragments — not from the faces. **An edge-or-face census would have reported clean
 * and been believed.** ⭐ THE CLASS, worth banking: *a census must ask at the surface the reader
 * sees, not at the surface the data model prefers.*
 *
 * TWO ARMS, and they are deliberately different questions:
 *   **A · THE PUBLISHED FRAGMENT** — what is actually drawn as wall. This is the arm SPINE-3 cures
 *        and it must read **ZERO on all 18 leaves**.
 *   **B · THE WRAP RING** — what the CONSTRUCTOR produced. `raiseWrap` hulls the built pieces and
 *        never consults the water, so this arm reads honest reds. Curing it moves every affected
 *        wrap's geometry and therefore its band, which is a DECLARED SHIFT the owner signs — so it
 *        is measured and reported here, not repaired.
 *
 * THREE MEASURES PER RING, because a vertex test alone is not enough: a ring whose vertices
 * straddle a narrow reach crosses the water with no vertex in it.
 *   `vertsIn`   ring vertices strictly inside a WATER face (even-odd)
 *   `crossings` proper non-adjacent crossings against a water face's boundary
 *   `wetLen`    arc length over water, sampled along every segment, and its share of the ring
 *
 * Usage: node harness/laneSPINE3/wallWater.mjs [--leaves=a,b] [--controls] [--json=path]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { publishWallWorks } from '../../src/domain/townMap/fabric/wallPublication.js';
import { faceRing, liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { pointInPolygon, ringPairCrossings } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { pubOpts } from './pubOpts.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const has = (n) => process.argv.includes(`--${n}`);
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/** How finely a segment is sampled for the arc-length measure. One sample per SAMPLE_STEP units. */
const SAMPLE_STEP = 1.0;

/**
 * ⭐ ONE RING AGAINST THE WATER. `closed` distinguishes a wrap cycle from a published half-ring
 * fragment: a fragment's ends are the bank and must not be joined by a phantom closing segment.
 */
export function measureAgainstWater(ring, waterRings, closed) {
  let vertsIn = 0;
  for (const p of ring) if (waterRings.some((w) => pointInPolygon(p[0], p[1], w))) vertsIn++;
  let crossings = 0;
  if (closed) {
    // ⛔ `ringPairCrossings` RETURNS A COUNT, NOT AN ARRAY. My first spelling read `.length` off it
    //    and every crossing figure came back `NaN` — which the table printed and which `NaN > 0`
    //    reads as FALSE, so the arm was silently dead in the direction of CLEAN. Caught by control
    //    (b), whose whole job is to convict a plant this census must see. ⭐ THE CLASS: **a
    //    numeric arm that goes NaN fails SAFE-LOOKING** — every comparison against it is false,
    //    so a dead arm and a clean arm print the same verdict.
    for (const w of waterRings) crossings += ringPairCrossings(ring, w);
  } else {
    // an open fragment: close it against itself only for the crossing test's sake would be a lie,
    // so the segments are walked directly against each water ring's own edges
    for (const w of waterRings) {
      for (let i = 0; i + 1 < ring.length; i++) {
        const a = ring[i]; const b = ring[i + 1];
        for (let j = 0; j < w.length; j++) {
          const c = w[j]; const d = w[(j + 1) % w.length];
          if (properCross(a, b, c, d)) crossings++;
        }
      }
    }
  }
  let total = 0; let wet = 0;
  const last = closed ? ring.length : ring.length - 1;
  for (let i = 0; i < last; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    total += L;
    const n = Math.max(1, Math.ceil(L / SAMPLE_STEP));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const x = a[0] + (b[0] - a[0]) * t; const y = a[1] + (b[1] - a[1]) * t;
      if (waterRings.some((w) => pointInPolygon(x, y, w))) wet += L / n;
    }
  }
  return {
    verts: ring.length, vertsIn, crossings, wetLen: wet, len: total,
    wetShare: total > 0 ? wet / total : 0,
  };
}

function side(a, b, p) { return Math.sign((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])); }
function properCross(a, b, c, d) {
  const s1 = side(a, b, c); const s2 = side(a, b, d);
  const s3 = side(c, d, a); const s4 = side(c, d, b);
  return s1 !== 0 && s2 !== 0 && s3 !== 0 && s4 !== 0 && s1 !== s2 && s3 !== s4;
}

function waterRingsOf(P) {
  const arr = P.arrangement;
  const out = [];
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'WATER') continue;
    const r = faceRing(arr, f.id);
    if (r.length >= 3) out.push(r);
  }
  return out;
}

export function buildLeaf(key) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const pub = publishWallWorks(P, pubOpts(settlement, fabric, input));
  return { spec, settlement, fabric, input, P, pub, waterRings: waterRingsOf(P) };
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * ⛔ THE CONTROL BENCH — the census refuses to be believed until it has convicted a plant.
 * ════════════════════════════════════════════════════════════════════════════════════════ */

function controls() {
  console.log('── ⛔ CONTROL BENCH ────────────────────────────────────────────────────────');
  let pass = 0; let n = 0;
  const check = (name, got, want, why) => {
    n++;
    const ok = got === want;
    if (ok) pass++;
    console.log(`  ${ok ? 'PASS' : '⛔ FAIL'}  ${name.padEnd(46)} got ${String(got).padEnd(7)} want ${String(want).padEnd(7)} — ${why}`);
  };

  // (a) NEGATIVE — a DRY leaf reads zero on both arms.
  const dry = buildLeaf('metropolis');
  check('(a) NEG dry leaf: water faces', dry.waterRings.length, 0,
    'metropolis carries no water at all, so any non-zero here is the instrument inventing one');
  const dryRing = dry.P.wraps[0].outer;
  check('(a) NEG dry leaf: wrap vertsIn', measureAgainstWater(dryRing, dry.waterRings, true).vertsIn, 0,
    'no water ⇒ no vertex can be in it');

  // (b) POSITIVE — splice a synthetic WATER ring straight across that same dry wrap. It MUST
  //     convict, or the census cannot see a wall over water at all.
  const bb = bbox(dryRing);
  const midY = (bb.y0 + bb.y1) / 2;
  const plant = [
    [bb.x0 - 50, midY - 30], [bb.x1 + 50, midY - 30], [bb.x1 + 50, midY + 30], [bb.x0 - 50, midY + 30],
  ];
  const planted = measureAgainstWater(dryRing, [plant], true);
  check('(b) POS synthetic bay across the wrap: vertsIn', planted.vertsIn > 0, true,
    'a band 60 units wide laid across the ring must swallow vertices');
  check('(b) POS synthetic bay across the wrap: crossings', planted.crossings > 0, true,
    'the ring must properly cross the plant\'s own boundary');
  check('(b) POS synthetic bay across the wrap: wetShare', planted.wetShare > 0.05, true,
    `arc-length over water must be material — measured ${(planted.wetShare * 100).toFixed(1)} %`);

  // (c) NEGATIVE — the SAME plant translated clear must return the census to zero, so the
  //     conviction in (b) is about the OVERLAP and not about the plant existing.
  const clear = plant.map(([x, y]) => [x, y + (bb.y1 - bb.y0) * 3 + 500]);
  const cleared = measureAgainstWater(dryRing, [clear], true);
  check('(c) NEG the same plant moved clear: vertsIn', cleared.vertsIn, 0,
    'a water body away from the ring must read zero — otherwise (b) convicted the plant, not the overlap');
  check('(c) NEG the same plant moved clear: wetShare', cleared.wetShare, 0, 'same, by arc length');

  // (d) POSITIVE — a plant that touches NO vertex but crosses the ring. This is the arm a
  //     vertex-only census would miss entirely, and it is why `wetLen` exists.
  const thin = thinBandBetweenVertices(dryRing);
  const thinM = thin ? measureAgainstWater(dryRing, [thin], true) : null;
  check('(d) POS narrow reach between two vertices: vertsIn', thinM ? thinM.vertsIn : -1, 0,
    'by construction the plant sits BETWEEN vertices — a vertex census reads clean here');
  check('(d) POS narrow reach between two vertices: crossings', thinM ? thinM.crossings > 0 : false, true,
    '⭐ and the crossing arm still convicts it — this is the arm a vertex-only test would miss');

  // (e) NEGATIVE — the known defect on the LIVE corpus. `city`'s wrap must convict on arm B.
  const city = buildLeaf('city');
  const e1 = city.P.wraps.find((w) => w.index === 1) || city.P.wraps[city.P.wraps.length - 1];
  const cm = measureAgainstWater(e1.outer, city.waterRings, true);
  check('(e) LIVE city wrap: vertsIn', cm.vertsIn > 0, true,
    `the reader's own leaf — measured ${cm.vertsIn} vertices in the sea, ${(cm.wetShare * 100).toFixed(1)} % of the ring`);

  // (f) POSITIVE — a PUBLISHED fragment with one vertex dragged into the water must convict the
  //     arm A predicate, or arm A's zero is vacuous.
  const frag = city.pub.circuits.flatMap((c) => c.fragments)[0];
  const dragged = frag.ring.map((p) => p.slice());
  const inside = firstPointInside(city.waterRings);
  if (inside) dragged[Math.floor(dragged.length / 2)] = inside;
  const dm = measureAgainstWater(dragged, city.waterRings, false);
  check('(f) POS published fragment, one vertex dragged wet', dm.vertsIn > 0, true,
    'arm A must be able to convict a published fragment, or its zero proves nothing');

  console.log(`CONTROL_BENCH ${pass}/${n} plants returned their declared reading —`
    + ` ${pass === n ? 'the census is LIVE' : '⛔ THE CENSUS IS NOT LIVE'}`);
  return pass === n;
}

function bbox(ring) {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (const p of ring) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
  return { x0, y0, x1, y1 };
}

/** A thin quad laid across the ring's longest edge's MIDPOINT, touching no vertex. */
function thinBandBetweenVertices(ring) {
  let bi = 0; let bl = -1;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L > bl) { bl = L; bi = i; }
  }
  if (bl < 8) return null;
  const a = ring[bi]; const b = ring[(bi + 1) % ring.length];
  const mx = (a[0] + b[0]) / 2; const my = (a[1] + b[1]) / 2;
  const ux = (b[0] - a[0]) / bl; const uy = (b[1] - a[1]) / bl;
  const nx = -uy; const ny = ux;
  const halfAlong = Math.min(bl * 0.2, 3);          // narrow enough to miss both vertices
  const out = 40;                                    // and long enough to cross the ring
  return [
    [mx + ux * halfAlong + nx * out, my + uy * halfAlong + ny * out],
    [mx - ux * halfAlong + nx * out, my - uy * halfAlong + ny * out],
    [mx - ux * halfAlong - nx * out, my - uy * halfAlong - ny * out],
    [mx + ux * halfAlong - nx * out, my + uy * halfAlong - ny * out],
  ];
}

function firstPointInside(waterRings) {
  for (const w of waterRings) {
    const b = bbox(w);
    for (let k = 0; k < 400; k++) {
      const x = b.x0 + ((b.x1 - b.x0) * ((k * 37) % 100)) / 100;
      const y = b.y0 + ((b.y1 - b.y0) * ((k * 53) % 100)) / 100;
      if (pointInPolygon(x, y, w)) return [x, y];
    }
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * THE CENSUS
 * ════════════════════════════════════════════════════════════════════════════════════════ */

if (!process.argv[1] || process.argv[1].endsWith('wallWater.mjs')) {
  let live = true;
  if (has('controls')) live = controls();

  const rows = [];
  let fragFail = 0; let wrapFail = 0; let ringsWalked = 0; let fragsWalked = 0; let wateredLeaves = 0;
  console.log('\n── THE CENSUS ─────────────────────────────────────────────────────────────');
  console.log(`${'leaf'.padEnd(12)} ${'wrap'.padEnd(5)} ${'B: WRAP RING'.padEnd(34)} ${'A: PUBLISHED FRAGMENTS'}`);
  for (const key of leaves) {
    const L = buildLeaf(key);
    if (L.waterRings.length) wateredLeaves++;
    for (const w of L.P.wraps) {
      ringsWalked++;
      const B = measureAgainstWater(w.outer, L.waterRings, true);
      const c = L.pub.circuits.find((x) => x.index === w.index);
      let A = { vertsIn: 0, crossings: 0, wetLen: 0, len: 0, wetShare: 0 };
      for (const f of (c ? c.fragments : [])) {
        fragsWalked++;
        const m = measureAgainstWater(f.ring, L.waterRings, f.closed);
        A.vertsIn += m.vertsIn; A.crossings += m.crossings; A.wetLen += m.wetLen; A.len += m.len;
      }
      A.wetShare = A.len > 0 ? A.wetLen / A.len : 0;
      const bBad = B.vertsIn > 0 || B.crossings > 0 || B.wetLen > 0.5;
      const aBad = A.vertsIn > 0 || A.crossings > 0 || A.wetLen > 0.5;
      if (bBad) wrapFail++;
      if (aBad) fragFail++;
      rows.push({ leaf: key, wrap: w.index, waterFaces: L.waterRings.length, wrapRing: B, published: A });
      console.log(`${key.padEnd(12)} E${String(w.index).padEnd(4)}`
        + ` ${`in ${B.vertsIn} cross ${B.crossings} wet ${B.wetLen.toFixed(1)}u (${(B.wetShare * 100).toFixed(1)}%)`.padEnd(34)}`
        + ` ${`in ${A.vertsIn} cross ${A.crossings} wet ${A.wetLen.toFixed(1)}u (${(A.wetShare * 100).toFixed(1)}%)`.padEnd(34)}`
        + ` ${aBad ? '⛔ DRAWN OVER WATER' : (bBad ? '⚠ wrap crosses water; the DRAWN wall does not' : 'clean')}`);
    }
  }
  console.log(`\nCENSUS leaves=${leaves.length} watered=${wateredLeaves} wraps=${ringsWalked}`
    + ` fragments=${fragsWalked}`);
  console.log(`ARM_A published-fragment failures = ${fragFail}`
    + ` — ${fragFail ? '⛔ A WALL IS DRAWN ACROSS OPEN WATER' : 'ZERO: no published wall stands in water on any leaf'}`);
  console.log(`ARM_B wrap-ring failures = ${wrapFail}`
    + ` — ${wrapFail ? '⚠ the CONSTRUCTOR ran its enclosure over water on ' + wrapFail + ' wrap(s); reported, not cured (see the receipt)' : 'zero'}`);
  if (has('controls')) console.log(`CONTROL ${live ? 'LIVE' : '⛔ DEAD — every zero above is UNVERIFIED'}`);

  const out = arg('json', '');
  if (out) writeFileSync(out, JSON.stringify({ rows, fragFail, wrapFail, ringsWalked, fragsWalked }, null, 1));
  process.exitCode = (fragFail || !live) ? 1 : 0;
}
