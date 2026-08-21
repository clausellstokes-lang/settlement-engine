/**
 * domain/townMap/fabric/districtPartition.js — ⭐⭐⭐ §232 THE WALL IS A DISTRICT PARTITION
 * (owner law, ODQ §232, relayed into MF-B8b).
 *
 * ⭐⭐⭐ THE OWNER'S LAW, VERBATIM IN SUBSTANCE: *inside and outside the walls are COMPLETELY
 * DIFFERENT DISTRICTS. The wall is an incidental district boundary that CONTAINS AND LIMITS
 * growth — a district touching it CLIPS at it, a hard growth edge like water. Extramural
 * faubourgs form their OWN districts, never an intramural district's extension, even at the
 * same gate.*
 *
 * ⛔ MEASURED BEFORE THE CURE, on the b8 corpus with the circuit object the lens draws:
 * **14 straddling districts of 46 on the walled leaves** — a district holding ground on both
 * sides of its own wall. Worst: the riverside town's `district.government_quarter`, with
 * **26.8% of its area on the far side of the circuit**, which is the quarter the owner's own
 * zoom is labelled with. The city's religious quarter straddles at 4.7%, the polycentric
 * town's market quarter at 12.0%.
 *
 * ⭐⭐ THE CURE IS A DERIVATION, NOT A CLIP. §232 says in terms "growth derived WITH the wall
 * as a stopping boundary — never render-clipped after the fact", so the band is removed from
 * DISTRICT SPACE before any region is traced: the circuit's own ground belongs to no quarter,
 * and each side is traced as its own mask. A district cannot straddle because there is no
 * lattice on which a straddling region could be traced — the census below is a theorem about
 * the construction rather than a hope about the output.
 *
 * ⭐⭐ AND THE CYCLE IS BOUNDED (§234.2's SCC rule). wall ↔ fabric is a real cycle: the circuit
 * is traced from the built fabric, and the districts are then partitioned WITH the circuit as
 * a boundary. It is solved in TWO FIXED PASSES — trace, then partition — and the wall is never
 * re-traced against the partition it produced. No iteration, no fixed-point engine, no
 * tolerance to converge to; the determinism law is untouched.
 *
 * PURITY: pure. No Date, no Math.random, no runtime trig, no localeCompare.
 */

import { buildUmbrella } from './umbrella.js';
import { circuitProbe, circuitRings } from './wallCircuit.js';
import { pointInPoly } from './reservedGround.js';

/** The suffix an extramural region takes. ⚠ IT IS A NEW DISTRICT IDENTITY, not a decoration:
 *  §232 says a faubourg is its OWN district, so it must be able to carry its own name, wealth
 *  and click region. The landing executor owes the landed one-element-per-district-id contract
 *  a row for it — see the receipt's hazards. */
export const FAUBOURG_SUFFIX = '~faubourg';

/**
 * ⭐⭐⭐ RE-DERIVE THE DISTRICT PARTITION WITH THE CIRCUIT AS A STOPPING BOUNDARY.
 *
 * @param {Object} a
 * @param {any} a.part      the BUILT partition grid (n, cell, inside, owner, contested)
 * @param {any[]} a.orgs    the organisms, in their canonical order
 * @param {any} a.node      the wall-circuit node — pulled through its accessors, never read raw
 * @param {string} a.key
 * @param {any} a.base      the built umbrella, whose components/greens/seams are UNTOUCHED
 * @returns {{ partition:any[], bandCells:number, intramural:number, extramural:number,
 *             split:number, reason:string }}
 */
export function partitionAtTheWall(a) {
  const { part, orgs, node, key, base } = a;
  const working = circuitRings(node).filter((r) => r.kind !== 'old-core');
  if (!working.length) {
    return {
      partition: base.partition,
      bandCells: 0,
      intramural: base.partition.length,
      extramural: 0,
      split: 0,
      reason: 'unwalled leaf — the district partition has no circuit to stop at, so it stands as traced',
    };
  }
  const n = part.n, cell = part.cell;
  const intra = new Uint8Array(n * n);
  const extra = new Uint8Array(n * n);
  let bandCells = 0;
  // ⭐⭐ MF-PERF1 · THE INSTRUMENT IS ACQUIRED ONCE FOR THE WHOLE PASS. `circuitBandSide` runs
  // the freshness gate per call — correct, and it re-serializes and re-hashes every ring, which
  // this loop then pays 128² times. `circuitProbe` verifies at acquisition and indexes the rings
  // once; the answers are identical (see wallCircuit's bandRigs and the equivalence pin).
  const probe = circuitProbe(node);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = j * n + i;
      if (part.inside[k] !== 1) continue;
      const side = probe.side((i + 0.5) * cell, (j + 0.5) * cell);
      // ⭐ THE BAND IS NOBODY'S QUARTER. It is the circuit's own reserved ground — the stones,
      // the intervallum the garrison ran in and the glacis the town kept clear — and giving it
      // to whichever district happens to abut it is exactly the straddle this law forbids.
      if (side === 0) { bandCells++; continue; }
      if (side < 0) intra[k] = 1; else extra[k] = 1;
    }
  }
  const trace = (mask, tag) => buildUmbrella(
    { n, cell, inside: mask, owner: part.owner, contested: part.contested },
    orgs,
    { key: `${key}|${tag}`, minGreenArea: 1e9, minComponentArea: 1 },
  ).partition;
  const inCells = trace(intra, 'intramural').map((c) => holdToTheWall(c, probe, -1));
  const outCells = trace(extra, 'extramural').map((c) => holdToTheWall(c, probe, 1));
  const seenIn = new Set(inCells.map((c) => c.districtId));
  /** @type {any[]} */ const partition = inCells.map((c) => ({ ...c, wallSide: 'intramural' }));
  let split = 0;
  for (const c of outCells) {
    // ⭐⭐ A FAUBOURG IS ITS OWN DISTRICT EVEN AT THE SAME GATE. Where the same organism also
    // holds intramural ground, the extramural region is NOT that quarter continued — it is the
    // suburb that grew outside the gate, and it takes its own identity.
    const straddled = seenIn.has(c.districtId);
    if (straddled) split++;
    partition.push({
      ...c,
      districtId: `${c.districtId}${FAUBOURG_SUFFIX}`,
      parentDistrictId: c.districtId,
      wallSide: 'extramural',
    });
  }
  partition.sort((p, q) => (p.districtId < q.districtId ? -1 : p.districtId > q.districtId ? 1 : 0));
  return {
    partition,
    bandCells,
    intramural: inCells.length,
    extramural: outCells.length,
    split,
    reason: `§232: the circuit partitions district space — ${bandCells} grid cells belong to the band itself`
      + ` (no quarter's ground), ${inCells.length} intramural region(s) and ${outCells.length} extramural`
      + ` faubourg district(s), of which ${split} were the extramural half of a quarter that previously`
      + ` straddled its own wall and is now its own district`,
  };
}

/**
 * ⭐⭐ HOLD THE DRAWN BOUNDARY TO THE BOUNDARY IT WAS DERIVED AGAINST.
 *
 * ⛔ A REAL RESIDUE, CAUGHT BY THIS MODULE'S OWN CENSUS ON ITS FIRST RUN, AND WORTH THE NOTE.
 * The regions are traced on a lattice that already respects the band — so no region's CELLS
 * straddle — and then `organicRing` displaces every vertex along its own normal by up to half
 * a grid cell to kill the pixel staircase. On the polycentric town that pushed **one vertex of
 * 25,049 samples** back across the band. ⭐ THE CLASS, and it is the §195.0 family again one
 * more surface out: **A BOUNDARY THAT IS CORRECT ON THE LATTICE CAN BE SMOOTHED BACK ACROSS
 * IT — a derivation is only as exact as the last pass that touches its output.**
 *
 * The cure is not a render clip: the GROWTH was derived with the wall as its stopping boundary
 * and is not being altered. It is the drawn outline of that growth being held to the boundary
 * it was derived against — §232's own verb, "a district touching it CLIPS at it". The
 * correction is a single exact PROJECTION onto the band's own face, taken from the circuit
 * (`wallCircuit.circuitHold`); see that accessor's header for why an earlier stepped march
 * toward the region's centroid cured one side and broke the other.
 */
function holdToTheWall(cellRegion, probe, wantSide) {
  const poly = cellRegion.polygon;
  let moved = 0;
  const out = poly.map(([x, y]) => {
    const [px, py] = probe.hold(x, y, wantSide);
    if (px !== x || py !== y) moved++;
    return [px, py];
  });
  return moved ? { ...cellRegion, polygon: out, heldToTheWall: moved } : cellRegion;
}

/**
 * ⭐⭐⭐ THE §232 CENSUS. A district STRADDLES when it holds ground strictly inside the band's
 * inner face AND strictly outside its outer face.
 *
 * ⚠ IT IS SAMPLED ON A LATTICE, NOT AT THE VERTICES, and that is the §230 lesson applied to
 * this census on the day it is written: a region's corners can both sit on one side of a band
 * the region crosses. The lattice step is bounded by the narrowest band on the corpus, so a
 * crossing narrower than the step cannot hide.
 *
 * @returns {{ straddlers:number, keys:string[], worstMinorityShare:number, sampled:number }}
 */
export function districtStraddlers(partition, node, step = 2.0) {
  const rings = circuitRings(node).filter((r) => r.kind !== 'old-core');
  // ⭐⭐ MF-ARCH's ITEM 5 · A CENSUS THAT DID NOT RUN MAY NEVER READ AS A CLEAN ONE. An unwalled
  // leaf has no circuit to straddle, so `straddlers: 0` is the right ANSWER — but "0 because
  // there is nothing to measure" and "0 because nothing straddles" are different facts and a
  // reader cannot tell them apart from the number. Every return below carries `complete` and,
  // where the subject was sampled rather than enumerated, the lattice it was sampled on.
  if (!rings.length) {
    return {
      straddlers: 0, keys: [], worstMinorityShare: 0, sampled: 0,
      complete: false, sampling: null,
      status: 'NOT APPLICABLE — this leaf carries no working circuit, so no district can straddle one',
    };
  }
  /** @type {string[]} */ const keys = [];
  let worst = 0, sampled = 0;
  const probe = circuitProbe(node);
  for (const cellRegion of partition) {
    const poly = cellRegion.polygon;
    if (!poly || poly.length < 3) continue;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of poly) {
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    }
    let inCt = 0, outCt = 0;
    for (let x = x0; x <= x1; x += step) {
      for (let y = y0; y <= y1; y += step) {
        if (!pointInPoly(poly, x, y)) continue;
        sampled++;
        const side = probe.side(x, y);
        if (side < 0) inCt++; else if (side > 0) outCt++;
      }
    }
    const tot = inCt + outCt;
    if (!tot || inCt === 0 || outCt === 0) continue;
    keys.push(cellRegion.districtId);
    const minority = Math.min(inCt, outCt) / tot;
    if (minority > worst) worst = minority;
  }
  return {
    straddlers: keys.length, keys: keys.sort(),
    worstMinorityShare: Math.round(worst * 1000) / 1000, sampled,
    // ⚠ `complete` IS TRUE AND `sampling` IS STILL NAMED. Every region in the partition was
    // examined — nothing was skipped for scale — but the examination was on a lattice, and the
    // header above argues why that is sound (the step is bounded by the narrowest band on the
    // corpus). Publishing the step is what lets a later wave check that argument against a
    // band this corpus does not yet contain, instead of re-deriving the reasoning.
    complete: true,
    sampling: { kind: 'lattice', step, regions: partition.length },
    status: `COMPLETE — every region examined, on a ${step}-unit lattice inside each region's bounds`,
  };
}
