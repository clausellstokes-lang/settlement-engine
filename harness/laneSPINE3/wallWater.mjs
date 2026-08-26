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
 * ⛔⛔⛔ **AND A FOURTH MEASURE, ADDED BY WALL-CURTAIN (ODQ §699.3) — PUBLISHED LENGTH, AND THE
 * DROP RATIO AGAINST IT. THE CENSUS ABOVE READ GREEN ON AN ERASURE.**
 *
 * The two arms as first written asked only *"is any published wall wet"*, and SPINE-3's cure
 * answered it by **not publishing the whole fragment that contained the wet span**. Arm A's zero
 * was real — an adversarial verifier proved it by an identity — but on `town` it bought 32.5 units
 * of wet wall removed with **281.2 units of ring left undrawn**, and on `highwater` 41.6 with
 * **401.3**. **A cure and an erasure rendered as the same row, because no column printed how much
 * wall was actually DRAWN.** That is the ninth sighting in this programme of a census whose
 * predicate is weaker than its name, and the column below is its answer.
 *
 * THE COLUMN, per wrap:
 *   `len`        (arm A) the arc length actually PUBLISHED as wall — the sum over fragments
 *   `dropped`    `B.len − A.len`: ring the constructor drew that the publication does not
 *   `wet`        `B.wetLen`: the only length whose drop is LAWFUL — the wall may not stand there
 *   `ratio`      `dropped / wet` — **1.0 is a clip at the bank; 7.6 is an erasure**
 *   `excess`     `dropped − wet`: DRY wall not drawn, stated in units and in FACETS
 *   `gap`        every BANK TERMINUS's distance to the nearest water boundary — measured, so
 *                *"the curtain runs to the bank and stops"* is a reading and not a sentence
 *
 * ⭐ **WHY THE RED IS ONE FACET AND NOT A PERCENTAGE** (J-CURTAIN-2). A lawful clip loses only
 * what the sampling cannot resolve — the wet test steps at ONE WORLD UNIT — so the honest excess
 * is a couple of units per reach, whatever the ring's size. The unit that means something to a
 * reader is the facet: the ring is a facet economy, and **an excess above one facet mean is a
 * whole side of the settlement's wall that the settlement has and the plate does not.** A ratio
 * bar alone would let a leaf with a huge wet span hide a facet of erasure inside a ratio of 1.1.
 * Both are printed; the RED is the facet.
 *
 * ⭐ THE COLUMN CARRIES ITS OWN NEGATIVE CONTROL, ON EVERY RUN: a wrap with no water must publish
 * **exactly** what the constructor drew (`dropped ≈ 0`). A dry wrap reading a non-zero drop means
 * the column is measuring the fragment slicing rather than the water, and the census says so.
 *
 * Usage: node harness/laneSPINE3/wallWater.mjs [--leaves=a,b] [--controls] [--json=path]
 */
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { publishWallWorks } from '../../src/domain/townMap/fabric/wallPublication.js';
import { faceRing, liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { distToPolyline, pointInPolygon, ringPairCrossings } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { pubOpts } from './pubOpts.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const has = (n) => process.argv.includes(`--${n}`);
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/** How finely a segment is sampled for the arc-length measure. One sample per SAMPLE_STEP units. */
const SAMPLE_STEP = 1.0;

/**
 * ⛔ **HOW MUCH WALL-OVER-WATER ONE FRAGMENT MAY CARRY — half of ONE sampling step.** ODQ §699.6's
 * third hole: this used to be judged against the SUM over a circuit's fragments, which is
 * per-circuit headroom for a per-fragment fact. See the census loop for the full note.
 */
export const WET_TOL_PER_FRAGMENT = 0.5;

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
  /**
   * ⭐ THE §648 CHANNEL LINE, CARRIED BESIDE THE FACES. The water FACE is clipped to the extent
   * and the channel is not (`wallPublication.waterDistance`'s own recorded correction), so a
   * terminus gap measured against faces alone would read a `mode:'near'` river as absent water and
   * print a confident distance to nothing. Both are asked; the nearer wins.
   */
  const channel = input.water && Array.isArray(input.water.line) && input.water.line.length > 1
    ? input.water.line : null;
  return { spec, settlement, fabric, input, P, pub, channel, waterRings: waterRingsOf(P) };
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * ⛔⛔ THE PUBLISHED-LENGTH COLUMN (WALL-CURTAIN, ODQ §699.3) — see the header.
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/** How much dry ring may go unpublished before the census calls it an erasure, in FACET MEANS. */
export const EXCESS_FACET_RED = 1.0;

/** Distance from a point to the nearest water BOUNDARY — the face rings and the channel line. */
export function distToBank(p, waterRings, channel) {
  let best = Infinity;
  for (const w of waterRings) {
    if (!w || w.length < 3) continue;
    const d = distToPolyline(p[0], p[1], w.concat([w[0]]));
    if (d < best) best = d;
  }
  if (channel && channel.length > 1) {
    const d = distToPolyline(p[0], p[1], channel);
    if (d < best) best = d;
  }
  return best;
}

/**
 * ⭐⭐ **WHICH PUBLISHED ENDPOINTS ARE BANK TERMINI — DECIDED FROM THE PUBLICATION ALONE.**
 *
 * An open fragment's ends are of two kinds and they must not be averaged together: a GATE CUT,
 * where the next ring vertex is published by the neighbouring fragment, and a BANK TERMINUS, where
 * the ring continues and the publication does not follow it. The test is therefore about COVERAGE
 * of the wrap's own cycle, not about proximity to water — asking "is this end near the water" to
 * decide whether it is a water terminus would assume the answer.
 *
 * ⭐ Two spellings, because a cure may change the representation: an endpoint whose `vertexOfRing`
 * is **−1** is an INTERPOLATED BANK POINT (a clip, which has no ring vertex); otherwise the
 * endpoint is a terminus when its outward ring neighbour is absent from the published set.
 */
export function bankTermini(circuit, ringLen) {
  const covered = new Set();
  for (const f of circuit.fragments) for (const v of f.vertexOfRing) if (v >= 0) covered.add(v);
  const out = [];
  for (const f of circuit.fragments) {
    if (f.closed) continue;
    const n = f.ring.length;
    if (n < 2) continue;
    const v0 = f.vertexOfRing[0]; const vL = f.vertexOfRing[n - 1];
    if (v0 === -1 || !covered.has((v0 - 1 + ringLen) % ringLen)) out.push({ p: f.ring[0], at: v0, end: 'head' });
    if (vL === -1 || !covered.has((vL + 1) % ringLen)) out.push({ p: f.ring[n - 1], at: vL, end: 'tail' });
  }
  return out;
}

/** The whole column for one wrap, from its ring reading `B` and its published reading `A`. */
export function overDropOf(B, A, termini, waterRings, channel) {
  const facet = B.verts > 0 ? B.len / B.verts : 0;
  const dropped = B.len - A.len;
  const wet = B.wetLen;
  const excess = dropped - wet;
  const gaps = termini.map((t) => distToBank(t.p, waterRings, channel)).filter((d) => Number.isFinite(d));
  return {
    facet,
    dropped,
    wet,
    /** `Infinity` when dry ring was dropped with NO water to justify it — the sharpest reading. */
    ratio: wet > 1e-9 ? dropped / wet : (dropped > 0.5 ? Infinity : 1),
    excess,
    excessFacets: facet > 0 ? excess / facet : 0,
    termini: termini.length,
    gapMin: gaps.length ? Math.min(...gaps) : null,
    gapMax: gaps.length ? Math.max(...gaps) : null,
    gapMean: gaps.length ? gaps.reduce((s, d) => s + d, 0) / gaps.length : null,
    /** ⛔ THE RED. One facet mean of DRY ring left undrawn is a whole side of the wall missing. */
    over: facet > 0 && excess > EXCESS_FACET_RED * facet,
  };
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

  /**
   * ⛔⛔ **(g) — THE HOLE ODQ §699.6 FOUND IN THIS VERY BENCH, AND IT IS THE BRANCH ARM A RUNS ON.**
   *
   * Plants (a)–(e) all pass `closed: true`, so they exercise `ringPairCrossings`. Plant (f) is the
   * only `closed: false` plant and it asserts `vertsIn` alone. **The OPEN-fragment crossing branch
   * — the hand-rolled segment-against-segment loop — therefore had NO positive control at all,
   * and every published half-ring is measured by exactly that branch.** A bench that convicts the
   * closed arm and not the open one certifies the arm that is not being asked.
   *
   * The plant is the open twin of (d): a two-point polyline whose ENDS are clear of the water and
   * whose middle is not — no vertex in the water, so `vertsIn` reads a truthful zero, and the
   * crossing arm must still convict. If the open branch were dead, this reads clean.
   */
  const wr = city.waterRings[0];
  const wb = bbox(wr);
  const spanY = (wb.y0 + wb.y1) / 2;
  const openPlant = [[wb.x0 - 60, spanY], [wb.x1 + 60, spanY]];
  const om = measureAgainstWater(openPlant, [wr], false);
  check('(g) POS OPEN fragment straddling the water: vertsIn', om.vertsIn, 0,
    'both ends sit clear of the body by construction — a vertex census reads clean, as it should');
  check('(g) POS OPEN fragment straddling the water: crossings', om.crossings > 0, true,
    '⭐ the OPEN branch\'s own crossing loop must convict — this is the branch every published'
    + ' half-ring is measured by, and it had no positive plant before WALL-CURTAIN');
  check('(g) POS OPEN fragment straddling the water: wetLen', om.wetLen > 1, true,
    `and its arc length over water must be material — measured ${om.wetLen.toFixed(1)} u`);

  /**
   * (h) NEGATIVE twin of (g): the SAME open polyline translated clear must return the open branch
   * to zero, so (g) convicted the OVERLAP and not the existence of an open fragment.
   */
  const openClear = openPlant.map(([x, y]) => [x, y + (wb.y1 - wb.y0) * 3 + 800]);
  const ocm = measureAgainstWater(openClear, [wr], false);
  check('(h) NEG the same OPEN plant moved clear: crossings', ocm.crossings, 0,
    'an open fragment away from the water must read zero crossings — otherwise (g) convicted the plant');
  check('(h) NEG the same OPEN plant moved clear: wetLen', ocm.wetLen, 0, 'same, by arc length');

  /**
   * ⛔⛔ **(i) — THE COLUMN ITSELF MUST BE ABLE TO CONVICT AN ERASURE.** ODQ §699.3: the census
   * read green on a cure that dropped 281 units to remove 32. `overDropOf` is the answer, so it
   * gets a plant of the exact shape it exists to catch: a ring measured whole against a
   * publication that simply left a stretch out. A column that cannot convict a synthetic erasure
   * cannot certify a real cure.
   */
  const fakeB = { verts: 20, len: 1000, wetLen: 30, vertsIn: 1, crossings: 2, wetShare: 0.03 };
  const erased = overDropOf(fakeB, { len: 720 }, [], [], null);   // 280 dropped to remove 30
  check('(i) POS the column convicts a synthetic erasure', erased.over, true,
    `280 u dropped for 30 u of water ⇒ ratio ${erased.ratio.toFixed(2)}×,`
    + ` excess ${erased.excess.toFixed(0)} u = ${erased.excessFacets.toFixed(1)} facets`);
  const clipped = overDropOf(fakeB, { len: 968.5 }, [], [], null); // 31.5 dropped to remove 30
  check('(i) NEG and passes a true clip at the bank', clipped.over, false,
    `31.5 u dropped for 30 u of water ⇒ ratio ${clipped.ratio.toFixed(2)}×,`
    + ` excess ${clipped.excess.toFixed(1)} u — under one facet (${clipped.facet.toFixed(0)} u)`);
  const dryErase = overDropOf({ verts: 20, len: 1000, wetLen: 0 }, { len: 900 }, [], [], null);
  check('(i) POS and convicts a DRY drop with no water at all', dryErase.ratio, Infinity,
    'ring dropped with nothing wet to justify it — the sharpest reading the column can print');

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

/**
 * ⛔ **THE MAIN-MODULE TEST IS `import.meta.url`, NOT `process.argv[1]` — AND THE OLD SPELLING BIT
 * ME.** It read `!process.argv[1] || …endsWith('wallWater.mjs')`, and `process.argv[1]` is
 * **undefined** under `node --input-type=module -e`, so the first clause fired: importing
 * `buildLeaf` from an inline script ran the ENTIRE 18-leaf census as a side effect, interleaving
 * its table with the caller's output. Harmless here, and exactly the shape that makes a probe's
 * numbers unreadable at the moment they matter.
 */
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  let live = true;
  if (has('controls')) live = controls();

  const rows = [];
  let fragFail = 0; let wrapFail = 0; let ringsWalked = 0; let fragsWalked = 0; let wateredLeaves = 0;
  let overFail = 0; let dryDropFail = 0;
  console.log('\n── THE CENSUS ─────────────────────────────────────────────────────────────');
  console.log(`${'leaf'.padEnd(12)} ${'wrap'.padEnd(5)} ${'B: WRAP RING'.padEnd(34)} ${'A: PUBLISHED FRAGMENTS'.padEnd(34)}`
    + ` ${'C: THE COLUMN — drawn vs dropped'}`);
  for (const key of leaves) {
    const L = buildLeaf(key);
    if (L.waterRings.length) wateredLeaves++;
    for (const w of L.P.wraps) {
      ringsWalked++;
      const B = measureAgainstWater(w.outer, L.waterRings, true);
      const c = L.pub.circuits.find((x) => x.index === w.index);
      let A = { vertsIn: 0, crossings: 0, wetLen: 0, len: 0, wetShare: 0 };
      /**
       * ⛔ **THE SLACK IS PER FRAGMENT, NOT PER CIRCUIT — ODQ §699.6's third hole.** As first
       * written, arm A summed `wetLen` over every fragment and then compared the TOTAL to 0.5 u.
       * That is half a sample step of headroom for the whole circuit shared out among however many
       * fragments it has — so eight fragments could each carry 0.06 u of wall over water and the
       * row would print clean. Moot at the SPINE-3 seal (every arm-A `wetLen` is an exact 0), and
       * that is precisely when a tolerance is cheap to tighten. It is now the WORST fragment that
       * is judged, and the tolerance is stated as what it is: half of ONE sampling step.
       */
      let aWorstWet = 0;
      for (const f of (c ? c.fragments : [])) {
        fragsWalked++;
        const m = measureAgainstWater(f.ring, L.waterRings, f.closed);
        A.vertsIn += m.vertsIn; A.crossings += m.crossings; A.wetLen += m.wetLen; A.len += m.len;
        if (m.wetLen > aWorstWet) aWorstWet = m.wetLen;
      }
      A.wetShare = A.len > 0 ? A.wetLen / A.len : 0;
      A.worstFragmentWet = aWorstWet;
      const termini = c ? bankTermini(c, w.outer.length) : [];
      const C = overDropOf(B, A, termini, L.waterRings, L.channel);
      const bBad = B.vertsIn > 0 || B.crossings > 0 || B.wetLen > 0.5;
      const aBad = A.vertsIn > 0 || A.crossings > 0 || aWorstWet > WET_TOL_PER_FRAGMENT;
      /** ⭐ THE COLUMN'S OWN NEGATIVE CONTROL: a DRY wrap must publish every unit the ring has. */
      const dryDrop = B.wetLen <= 1e-9 && C.dropped > 0.5;
      if (bBad) wrapFail++;
      if (aBad) fragFail++;
      if (C.over) overFail++;
      if (dryDrop) dryDropFail++;
      rows.push({
        leaf: key, wrap: w.index, waterFaces: L.waterRings.length, wrapRing: B, published: A, column: C,
      });
      console.log(`${key.padEnd(12)} E${String(w.index).padEnd(4)}`
        + ` ${`in ${B.vertsIn} cross ${B.crossings} wet ${B.wetLen.toFixed(1)}u len ${B.len.toFixed(0)}`.padEnd(34)}`
        + ` ${`in ${A.vertsIn} cross ${A.crossings} wet ${A.wetLen.toFixed(1)}u len ${A.len.toFixed(0)}`.padEnd(34)}`
        + ` ${`drop ${C.dropped.toFixed(1)}u = ${C.ratio === Infinity ? '∞' : C.ratio.toFixed(2)}× wet`.padEnd(26)}`
        + ` ${`excess ${C.excess.toFixed(1)}u (${C.excessFacets.toFixed(2)} facet)`.padEnd(30)}`
        + ` ${C.termini ? `gap ${C.gapMin.toFixed(0)}–${C.gapMax.toFixed(0)}u vs facet ${C.facet.toFixed(0)}u` : 'no bank terminus'}`
        + ` ${aBad ? '⛔ DRAWN OVER WATER' : (C.over ? '⛔ OVER-DROP' : (dryDrop ? '⛔ DRY RING DROPPED' : (bBad ? '⚠ wrap wet; the DRAWN wall is not, and is not over-dropped' : 'clean')))}`);
    }
  }
  console.log(`\nCENSUS leaves=${leaves.length} watered=${wateredLeaves} wraps=${ringsWalked}`
    + ` fragments=${fragsWalked}`);
  console.log(`ARM_A published-fragment failures = ${fragFail}`
    + ` — ${fragFail ? '⛔ A WALL IS DRAWN ACROSS OPEN WATER' : 'ZERO: no published wall stands in water on any leaf'}`);
  console.log(`ARM_B wrap-ring failures = ${wrapFail}`
    + ` — ${wrapFail ? '⚠ the CONSTRUCTOR ran its enclosure over water on ' + wrapFail + ' wrap(s); reported, not cured (see the receipt)' : 'zero'}`);
  console.log(`ARM_C over-drop failures = ${overFail}`
    + ` — ${overFail ? `⛔ ${overFail} wrap(s) leave MORE THAN ONE FACET of DRY ring unpublished: the wall is`
      + ' being ERASED where it should be CLIPPED' : 'ZERO: every wrap publishes every dry unit its ring has'}`);
  console.log(`ARM_C dry-wrap control  = ${dryDropFail}`
    + ` — ${dryDropFail ? '⛔ a wrap with NO WATER dropped ring length: the column is measuring the slicing, not the water'
      : 'zero: every waterless wrap publishes its ring entire — the column reads what it says it reads'}`);
  if (has('controls')) console.log(`CONTROL ${live ? 'LIVE' : '⛔ DEAD — every zero above is UNVERIFIED'}`);

  const out = arg('json', '');
  if (out) {
    writeFileSync(out, JSON.stringify({
      rows, fragFail, wrapFail, overFail, dryDropFail, ringsWalked, fragsWalked,
    }, null, 1));
  }
  process.exitCode = (fragFail || overFail || dryDropFail || !live) ? 1 : 0;
}
