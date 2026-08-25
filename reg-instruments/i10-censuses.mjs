/**
 * i10-censuses.mjs — REG-I0 · INSTRUMENT 10 · ⛔ THE TWO ORDERED CENSUSES.
 *
 * §571.2 ordered these VERIFIED, not asserted: *"TE-REG-0's fresh base renders at `ee0db96d3`
 * are the exhibit; the chair will check the straddle census reads ZERO in its output before
 * telling the owner the cure holds."* This instrument measures both, at the sealed model, on
 * the EXEMPLAR CORPUS — which is the new subject: the shipped pins assert these same laws on
 * four synthetic FIXTURES (`townMapWallCircuit.test.js`'s `WALLED` set), never on the corpus
 * leaves the renders are made from.
 *
 * ═════════════ CENSUS A · THE STRADDLE CENSUS ═════════════
 *
 * THE DEFECT (`districtPartition.js` header): **14 straddling districts of 46 on the walled
 * leaves**, worst the riverside town's `district.government_quarter` at **26.8% of its area on
 * the far side of the circuit**.
 *
 * A · PRIMARY — THE LAW'S OWN PREDICATE, `districtStraddlers(partition, node, step)`:
 *     a district straddles when it holds ground STRICTLY INSIDE the band's inner face AND
 *     STRICTLY OUTSIDE its outer face, sampled on a lattice inside the region's bounds.
 *       numerator   regions with inCt > 0 AND outCt > 0
 *       denominator regions in `fabric.umbrella.partition` on a leaf with a working circuit
 *     Band-aware (`probe.side` returns 0 in the reserved band, and band samples join neither
 *     count) and OLD-CORE RINGS ARE EXCLUDED — a superseded circuit is not a wall any more
 *     (§250.5), so holding ground across it is not a straddle.
 *
 *   ⭐ RUNNING THE SHIPPED PREDICATE IS NOT DOC-AGREEMENT VACUITY. The vacuous move would be
 *     reading each region's `wallSide` STAMP — a label the cure itself wrote. `districtStraddlers`
 *     re-derives the answer from the region's polygon and the circuit's band and can return a
 *     positive; the counterfactual pin in the sealed suite proves it does. What this lane adds
 *     is a NEW SUBJECT (the corpus) and an INDEPENDENT SECOND OPINION.
 *
 * B · CROSS-CHECK — an independent re-derivation that shares no code with the cure:
 *       shareOutside = lattice points inside the region AND outside the ring's `closedPolygon`
 *                      ───────────────────────────────────────────────────────────────────────
 *                                    lattice points inside the region      ← DENOMINATOR
 *       straddles ⟺ min(shareOutside, 1 − shareOutside) ≥ 0.01
 *     It has NO band: it splits at the circuit's own line. It is therefore STRICTLY HARSHER,
 *     and the gap between the two counts is exactly "regions with ground in the wall band".
 *     Reported as its own row, never merged into the primary.
 *
 * ═════════════ CENSUS B · THE OUTSIDE-CIRCUIT BODY COUNT ═════════════
 *
 * THE DEFECT (`epochAxis.js` header): **1,331 of 19,563 drawn bodies (6.8%) stood outside the
 * circuit traced from the umbrella they helped form.**
 *
 *   THE PREDICATE IS THE SHIPPED §241.6 ONE, LIFTED VERBATIM:
 *     EPOCH(body) = the index of the innermost WALLED epoch whose `epochs[k].body` polygon
 *                   contains the body's centroid. That is the fabric the ring was traced FROM,
 *                   one derivation step BEFORE the ring — never "is it inside the ring", which
 *                   would define the set by the predicate it is tested by.
 *     HELD(body)  = some ring r with r.epoch ≥ EPOCH(body) and
 *                     pointIn(r.polygon, c)  OR  (r.halfRing AND pointIn(r.closedPolygon, c))
 *                   — "its own circuit OR ANY LATER ONE" is the law, not a slackening; and the
 *                   river is the fourth wall, so a body the CLOSED circuit held and only the
 *                   half-ring filter dropped is DEFENDED.
 *       numerator   members that are NOT held
 *       denominator MEMBERS = bodies with EPOCH ≥ 0. Bodies in no walled epoch's body are the
 *                   SUBURB — lawfully outside every circuit — counted and reported separately,
 *                   never in the denominator.
 *     DRAWN BODIES = `drawnBodySet()`, lifted verbatim from the sealed suite: parcels (minus
 *       those merged into LOD masses) + backHouses + LOD masses + shanty huts + landmark solids
 *       + steading solids + faubourg buildings + lean-tos + state-mark bodies.
 *
 *   THE STRICTER SIBLING (§240.1) IS RUN TOO: every vertex of a ring's own `epochHull` must lie
 *   inside that ring's `polygon`, or — on a half-ring — inside its `closedPolygon`.
 *
 * ═════════════ CONTROLS (--controls) ═════════════
 * A zero is what a DEAD instrument returns, so neither census is believable until shown to COUNT:
 *   A1 ring×0.60           the circuit shrunk about its centroid — districts must start straddling
 *   A2 planted straddler   a square laid deliberately across the circuit — caught, and exactly +1
 *   A3 the PRE-CURE input  `fabric.growthUmbrella.partition` is the partition traced WITHOUT the
 *                          wall as a boundary and is still carried on every leaf. Running the
 *                          census on it is the strongest control available: real geometry, real
 *                          defect, no synthesis. It MUST come back positive.
 *   B1 planted body        one body inside an epoch body and outside every ring — exactly +1
 *   B2 rings withheld      the same census with `r.epoch ≥ idx` narrowed to the OLD CORE only —
 *                          the count must jump, proving the "or any later ring" clause is load-bearing
 *
 * Usage: node i10-censuses.mjs --wt=<worktree> [--leaves=city,village,town|ALL] [--json=<out>]
 *        node i10-censuses.mjs --wt=<worktree> --controls
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inPoly, areaShareOutside, centroid as simpleCentroid, absArea, r2, r4 } from './lib/geom.mjs';

export const STRADDLE_TOL = 0.01;
export const LATTICE_STEP = 1.0;
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };

export async function sealed(wt) {
  const H = (p) => pathToFileURL(join(wt, p)).href;
  const [ex, dp, ea, fg] = await Promise.all([
    import(H('harness/exemplars.mjs')),
    import(H('src/domain/townMap/fabric/districtPartition.js')),
    import(H('src/domain/townMap/fabric/epochAxis.js')),
    import(H('src/domain/townMap/fabric/fabricGeometry.js')),
  ]);
  return { buildOne: ex.buildOne, CORPUS: ex.CORPUS, districtStraddlers: dp.districtStraddlers, pointIn: ea.pointIn, centroid: fg.centroid };
}

/**
 * ⭐ LIFTED VERBATIM from `tests/domain/townMapWallCircuit.test.js`'s `drawnBodySet`. Every
 * FILLED body the leaf draws — the §195.0 drawn set. Copied rather than re-derived so this
 * lane's denominator IS the denominator the sealed pin uses.
 */
export function drawnBodySet(f) {
  const out = [];
  const merged = (f.lod && f.lod.mergedKeys) || new Set();
  const has = (m, k) => (m instanceof Set ? m.has(k) : !!(m && m[k]));
  for (const p of f.parcels) {
    if (has(merged, p.key)) continue;
    if (p.polygon && p.polygon.length >= 3) out.push({ key: p.key, kind: 'parcel', poly: p.polygon });
    if (p.backHouse && p.backHouse.length >= 3) out.push({ key: `${p.key}#back`, kind: 'backHouse', poly: p.backHouse });
  }
  for (const m of (f.lod ? f.lod.masses : [])) if (m.polygon && m.polygon.length >= 3) out.push({ key: m.key, kind: 'mass', poly: m.polygon });
  for (const h of (f.shanty ? f.shanty.huts : [])) if (h.polygon && h.polygon.length >= 3) out.push({ key: h.key, kind: 'hut', poly: h.polygon });
  for (const lm of f.landmarks) for (let i = 0; i < (lm.solids || []).length; i++) {
    if (lm.solids[i] && lm.solids[i].length >= 3) out.push({ key: `${lm.instanceKey}#${i}`, kind: 'institution', poly: lm.solids[i] });
  }
  for (const h of (f.habitation || [])) for (let i = 0; i < (h.solids || []).length; i++) {
    if (h.solids[i] && h.solids[i].length >= 3) out.push({ key: `${h.key}#${i}`, kind: 'steading', poly: h.solids[i] });
  }
  for (const b of ((f.faubourgs && f.faubourgs.buildings) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'faubourg', poly: b.polygon });
  for (const b of ((f.faubourgs && f.faubourgs.leanTos) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'leanTo', poly: b.polygon });
  for (const b of ((f.stateMarks && f.stateMarks.bodies) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: b.kind || 'state', poly: b.polygon });
  return out;
}

/* ─────────────────────── CENSUS A ─────────────────────── */
export function straddleCross(fabric, { ringPoly = null, extraRegions = [], partition = null } = {}) {
  const walls = fabric.walls || [];
  const working = walls.filter((w) => w.kind !== 'old-core');
  if (!working.length && !ringPoly) return { applicable: false, districts: 0, straddling: 0, rows: [] };
  const w = working[0] || walls[0];
  const ring = ringPoly || (w.closedPolygon && w.closedPolygon.length > 2 ? w.closedPolygon : w.polygon);
  const src = ringPoly ? 'CONTROL ring' : (w.closedPolygon && w.closedPolygon.length > 2 ? 'closedPolygon' : 'polygon');
  const regions = [...(partition || (fabric.umbrella && fabric.umbrella.partition) || []), ...extraRegions];
  const rows = [];
  for (const reg of regions) {
    if (!reg.polygon || reg.polygon.length < 3) continue;
    const { samples, outside, share } = areaShareOutside(reg.polygon, ring, LATTICE_STEP);
    if (samples < 12) continue;
    const both = share == null ? 0 : Math.min(share, 1 - share);
    rows.push({
      districtId: reg.districtId, wallSideLabel: reg.wallSide || null,
      samples, outside, shareOutside: r4(share), minSide: r4(both),
      straddles: both >= STRADDLE_TOL, areaUnits: r2(absArea(reg.polygon)),
    });
  }
  return {
    applicable: true, ringSource: src, ringVertices: ring.length,
    districts: rows.length, straddling: rows.filter((r) => r.straddles).length,
    worstMinSide: rows.length ? r4(Math.max(...rows.map((r) => r.minSide))) : null, rows,
  };
}

/* ─────────────────────── CENSUS B ─────────────────────── */
export function bodyCensus(fabric, S, { extraBodies = [], ringFilter = null, ringScale = 1 } = {}) {
  const node = fabric.wallCircuit;
  const walled = (node.epochs || []).filter((e) => e.walled && e.body);
  const bodies = [...drawnBodySet(fabric), ...extraBodies];
  if (!walled.length) {
    return { applicable: false, bodies: bodies.length, members: 0, suburb: bodies.length, outside: 0, offenders: [],
      status: 'NOT APPLICABLE — no walled epoch carries a body on this leaf, so no body can stand outside its own circuit' };
  }
  let rings = ringFilter ? node.rings.filter(ringFilter) : node.rings;
  if (ringScale !== 1) {
    const sc = (poly) => {
      if (!poly) return poly;
      const cc = simpleCentroid(poly);
      return poly.map(([x, y]) => [cc[0] + (x - cc[0]) * ringScale, cc[1] + (y - cc[1]) * ringScale]);
    };
    rings = rings.map((r) => ({ ...r, polygon: sc(r.polygon), closedPolygon: sc(r.closedPolygon) }));
  }
  let members = 0, suburb = 0;
  const offenders = [];
  const byEpoch = new Map();
  for (const b of bodies) {
    const c = b.c || S.centroid(b.poly);
    let idx = -1;
    for (const e of walled) if (S.pointIn(e.body, c[0], c[1])) { idx = e.index; break; }
    if (idx < 0) { suburb++; continue; }
    members++;
    if (!byEpoch.has(idx)) byEpoch.set(idx, { members: 0, outside: 0 });
    byEpoch.get(idx).members++;
    const held = rings.some((r) => r.epoch >= idx
      && (S.pointIn(r.polygon, c[0], c[1]) || (r.halfRing && r.closedPolygon && S.pointIn(r.closedPolygon, c[0], c[1]))));
    if (!held) {
      byEpoch.get(idx).outside++;
      if (offenders.length < 30) offenders.push({ key: b.key, kind: b.kind, epoch: idx, c: [r2(c[0]), r2(c[1])] });
    }
  }
  const outside = [...byEpoch.values()].reduce((a, v) => a + v.outside, 0);
  return {
    applicable: true, bodies: bodies.length, members, suburb, outside,
    shareOutside: members ? r4(outside / members) : null,
    perEpoch: [...byEpoch.entries()].map(([e, v]) => ({ epoch: e, members: v.members, outside: v.outside })).sort((a, b) => a.epoch - b.epoch),
    ringsConsidered: rings.map((r) => ({ epoch: r.epoch, kind: r.kind, halfRing: !!r.halfRing })),
    offenders,
    status: `COMPLETE — ${bodies.length} drawn bodies, ${members} members of a walled epoch, ${suburb} in the suburb beyond every circuit`,
  };
}

/** §240.1 · every vertex of a ring's own epochHull inside that ring (closed ring rescues half-rings) */
export function hullContainment(fabric, S) {
  const rows = [];
  for (const r of (fabric.wallCircuit.rings || [])) {
    if (!r.epochHull) { rows.push({ epoch: r.epoch, kind: r.kind, skipped: 'no epochHull' }); continue; }
    let examined = 0, out = 0, rescued = 0;
    for (const p of r.epochHull) {
      examined++;
      if (S.pointIn(r.polygon, p[0], p[1])) continue;
      if (r.halfRing && r.closedPolygon && S.pointIn(r.closedPolygon, p[0], p[1])) { rescued++; continue; }
      out++;
    }
    rows.push({ epoch: r.epoch, kind: r.kind, halfRing: !!r.halfRing, examined, rescuedByClosedRing: rescued, outside: out,
      selfReportedResidual: r.containmentResidual == null ? null : r4(r.containmentResidual) });
  }
  return rows;
}

/* ─────────────────────── driver ─────────────────────── */
async function run(wt, leafKeys, S) {
  const byKey = new Map(S.CORPUS.map((s) => [s.key, s]));
  const keys = leafKeys === 'ALL' ? S.CORPUS.map((s) => s.key) : leafKeys.split(',').map((s) => s.trim()).filter(Boolean);
  const leaves = [];
  process.stdout.write(`  ${'leaf'.padEnd(12)} ${'tier'.padEnd(11)} rings  straddleA  straddleX  bodiesOutside/members  suburb\n`);
  for (const k of keys) {
    const spec = byKey.get(k);
    if (!spec) { process.stderr.write(`SKIP unknown leaf '${k}'\n`); continue; }
    const t0 = Date.now();
    const { fabric } = S.buildOne(spec);
    const A = S.districtStraddlers(fabric.umbrella.partition, fabric.wallCircuit, 2.0);
    const Afine = S.districtStraddlers(fabric.umbrella.partition, fabric.wallCircuit, 1.0);
    const X = straddleCross(fabric);
    const B = bodyCensus(fabric, S);
    const H = hullContainment(fabric, S);
    leaves.push({
      key: k, name: fabric.meta.name, tier: fabric.meta.tier, extentTier: fabric.meta.extentTier,
      population: fabric.meta.population, rings: (fabric.wallCircuit.rings || []).length,
      districts: fabric.umbrella.partition.length,
      straddlePrimary: { straddlers: A.straddlers, keys: A.keys, worstMinorityShare: A.worstMinorityShare, sampled: A.sampled, complete: A.complete, status: A.status, sampling: A.sampling },
      straddlePrimaryFine: { step: 1.0, straddlers: Afine.straddlers, keys: Afine.keys, worstMinorityShare: Afine.worstMinorityShare, sampled: Afine.sampled },
      straddleCrossCheck: X, bodyCensus: B, hullContainment: H, ms: Date.now() - t0,
    });
    process.stdout.write(`  ${k.padEnd(12)} ${String(fabric.meta.tier).padEnd(11)} ${String(fabric.wallCircuit.rings.length).padEnd(6)}`
      + ` ${A.complete ? `${A.straddlers}/${fabric.umbrella.partition.length}`.padEnd(10) : 'n/a'.padEnd(10)}`
      + ` ${X.applicable ? `${X.straddling}/${X.districts}`.padEnd(10) : 'n/a'.padEnd(10)}`
      + ` ${B.applicable ? `${B.outside}/${B.members}`.padEnd(22) : 'n/a'.padEnd(22)}`
      + ` ${B.suburb}   ${Date.now() - t0}ms\n`);
  }
  const walled = leaves.filter((l) => l.straddlePrimary.complete);
  const bodied = leaves.filter((l) => l.bodyCensus.applicable);
  return {
    leaves,
    totals: {
      leavesMeasured: leaves.length,
      walledLeaves: walled.length,
      straddlePrimary: { numerator: walled.reduce((a, l) => a + l.straddlePrimary.straddlers, 0), denominator: walled.reduce((a, l) => a + l.districts, 0) },
      straddleCrossCheck: { numerator: leaves.reduce((a, l) => a + (l.straddleCrossCheck.applicable ? l.straddleCrossCheck.straddling : 0), 0), denominator: leaves.reduce((a, l) => a + (l.straddleCrossCheck.applicable ? l.straddleCrossCheck.districts : 0), 0) },
      bodyCensus: {
        numerator: bodied.reduce((a, l) => a + l.bodyCensus.outside, 0),
        denominator: bodied.reduce((a, l) => a + l.bodyCensus.members, 0),
        suburb: bodied.reduce((a, l) => a + l.bodyCensus.suburb, 0),
        drawnBodiesAllLeaves: leaves.reduce((a, l) => a + l.bodyCensus.bodies, 0),
      },
      hullVerticesOutside: leaves.reduce((a, l) => a + l.hullContainment.reduce((b, r) => b + (r.outside || 0), 0), 0),
    },
  };
}

/* ─────────────────────── controls ─────────────────────── */
async function controls(wt, S) {
  const { fabric } = S.buildOne(S.CORPUS.find((s) => s.key === 'city'));
  const node = fabric.wallCircuit;
  const w = fabric.walls.find((x) => x.kind !== 'old-core') || fabric.walls[0];
  const ring = w.closedPolygon || w.polygon;
  const c = simpleCentroid(ring);
  const live = [];

  const A0 = S.districtStraddlers(fabric.umbrella.partition, node, 1.0);
  const X0 = straddleCross(fabric);
  process.stdout.write(`A0 baseline (law)        straddlers=${A0.straddlers}/${fabric.umbrella.partition.length}  worstMinorityShare=${A0.worstMinorityShare}  sampled=${A0.sampled}  ${A0.status}\n`);
  process.stdout.write(`X0 baseline (crosscheck) straddlers=${X0.straddling}/${X0.districts}  worstMinSide=${X0.worstMinSide}  ring=${X0.ringSource}\n`);

  // A1 · shrink the circuit
  const shrunk = ring.map(([x, y]) => [c[0] + (x - c[0]) * 0.60, c[1] + (y - c[1]) * 0.60]);
  const X1 = straddleCross(fabric, { ringPoly: shrunk });
  process.stdout.write(`A1 ring×0.60             crosscheck straddlers=${X1.straddling}/${X1.districts}\n`);
  live.push(['A1 a shrunk circuit makes districts straddle', X1.straddling > X0.straddling]);

  // A2 · a planted straddler, on the LAW's own instrument.
  // ⚠⚠ BITTEN: the first plant used the ring's BOUNDING-BOX east edge, which on an irregular
  // half-ring is not on the circuit at all — the square landed wholly outside and neither census
  // counted it, which read as two broken instruments and was one broken control. Plant on the
  // circuit's OWN CLAIM LINE, the way the sealed suite's counterfactual does.
  const line = (w.claimLine && w.claimLine.length ? w.claimLine : ring);
  const mid = line[Math.floor(line.length / 2)];
  const R = Math.max(12, (w.band || 3) * 4);
  const planted = { districtId: 'CONTROL.planted_straddler', polygon: [[mid[0] - R, mid[1] - R], [mid[0] + R, mid[1] - R], [mid[0] + R, mid[1] + R], [mid[0] - R, mid[1] + R]] };
  const A2 = S.districtStraddlers([...fabric.umbrella.partition, planted], node, 1.0);
  const X2 = straddleCross(fabric, { extraRegions: [{ ...planted, wallSide: 'CONTROL' }] });
  process.stdout.write(`A2 planted straddler     law straddlers=${A2.straddlers} keys=${JSON.stringify(A2.keys)}  |  crosscheck=${X2.straddling}\n`);
  live.push(['A2 the law catches a planted straddler, exactly one more', A2.straddlers === A0.straddlers + 1 && A2.keys.includes('CONTROL.planted_straddler')]);
  live.push(['A2 the crosscheck catches it too', X2.straddling === X0.straddling + 1]);

  // A3 · the PRE-CURE partition, still carried on every leaf
  const pre = fabric.growthUmbrella && fabric.growthUmbrella.partition;
  if (pre && pre.length) {
    const A3 = S.districtStraddlers(pre, node, 1.0);
    const X3 = straddleCross(fabric, { partition: pre });
    process.stdout.write(`A3 PRE-CURE partition    law straddlers=${A3.straddlers}/${pre.length} worst=${A3.worstMinorityShare}  |  crosscheck=${X3.straddling}/${X3.districts} worst=${X3.worstMinSide}\n`);
    live.push(['A3 the census is POSITIVE on the pre-cure partition (real geometry, real defect)', A3.straddlers > 0]);
  } else {
    process.stdout.write('A3 PRE-CURE partition    ABSENT on this leaf\n');
    live.push(['A3 the census is POSITIVE on the pre-cure partition', false]);
  }

  // B0 baseline
  const B0 = bodyCensus(fabric, S);
  process.stdout.write(`B0 baseline              outside=${B0.outside}/${B0.members} members, suburb=${B0.suburb}, drawn=${B0.bodies}\n`);

  // B1 · A PLANTED BODY CANNOT BE THE CONTROL HERE, AND THE REASON IS THE RESULT.
  // A body is a MEMBER only if some walled epoch's `body` polygon contains it, and it is OUTSIDE
  // only if no ring at or after that epoch holds it. A lattice sweep of every walled epoch body
  // finds NO point that is inside the body and outside every ring — the epoch bodies are
  // contained by their own circuits, which is precisely §240.1 holding. So there is nowhere to
  // plant, and "nowhere to plant" is a measurement, not a missing control. The liveness proof
  // therefore perturbs the RING, which is the other operand of the same predicate.
  const sweep = (() => {
    for (const e of node.epochs.filter((x) => x.walled && x.body)) {
      const b = e.body.reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [1e9, 1e9, -1e9, -1e9]);
      for (let y = b[1]; y <= b[3]; y += 2) for (let x = b[0]; x <= b[2]; x += 2) {
        if (!S.pointIn(e.body, x, y)) continue;
        const held = node.rings.some((r) => r.epoch >= e.index
          && (S.pointIn(r.polygon, x, y) || (r.halfRing && r.closedPolygon && S.pointIn(r.closedPolygon, x, y))));
        if (!held) return { p: [x, y], epoch: e.index };
      }
    }
    return null;
  })();
  process.stdout.write(`B1 plant-site sweep      ${sweep ? `FOUND at ${sweep.p.map((v) => Math.round(v)).join(',')} (epoch ${sweep.epoch}) — a real gap` : 'NONE — every point of every walled epoch body is held by a ring at or after its own epoch'}\n`);
  const B1 = bodyCensus(fabric, S, { ringScale: 0.95 });
  process.stdout.write(`B1 rings×0.95            outside=${B1.outside}/${B1.members}  (baseline ${B0.outside}/${B0.members})\n`);
  live.push(['B1 shrinking the rings 5% strands bodies (the ring operand is live)', B1.outside > B0.outside]);

  // B2 · withhold the later rings — the "or any later ring" clause must be load-bearing
  const oldest = Math.min(...node.rings.map((r) => r.epoch));
  const B2 = bodyCensus(fabric, S, { ringFilter: (r) => r.epoch === oldest });
  process.stdout.write(`B2 only the epoch-${oldest} ring   outside=${B2.outside}/${B2.members}  (baseline ${B0.outside}/${B0.members})\n`);
  live.push(['B2 withholding the later rings strands bodies (the clause is load-bearing)', B2.outside > B0.outside]);

  // the label cross-check
  const dis = X0.rows.filter((r) => (r.wallSideLabel === 'intramural' && r.shareOutside > STRADDLE_TOL)
    || (r.wallSideLabel === 'extramural' && r.shareOutside < 1 - STRADDLE_TOL));
  process.stdout.write(`XC geometry vs the cure's own wallSide stamp: ${dis.length} disagreement(s)\n`);
  for (const d of dis.slice(0, 8)) process.stdout.write(`   ${d.districtId}  label=${d.wallSideLabel}  shareOutside=${d.shareOutside}  minSide=${d.minSide}\n`);

  process.stdout.write('\n── LIVENESS · a zero is what a DEAD instrument returns\n');
  for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
  const ok = live.every((l) => l[1]);
  process.stdout.write(`\nI10_CONTROLS ${ok ? 'LIVE' : 'BROKEN'}\n`);
  return { A0, X0, X1, A2, B0, B2, liveness: live, labelDisagreements: dis };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const wt = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0/w3f-tree');
  const json = arg('json', null);
  const S = await sealed(wt);
  if (process.argv.includes('--controls')) {
    const res = await controls(wt, S);
    if (json) writeFileSync(json, JSON.stringify(res, null, 2));
  } else {
    process.stdout.write(`── THE TWO ORDERED CENSUSES · sealed model at ${wt}\n`);
    const res = await run(wt, arg('leaves', 'city,village,town'), S);
    const t = res.totals;
    process.stdout.write(`\nCENSUS A · STRADDLE (law's predicate)  = ${t.straddlePrimary.numerator} of ${t.straddlePrimary.denominator} district regions,`
      + ` on ${t.walledLeaves} walled leaf/leaves of ${t.leavesMeasured} measured\n`);
    process.stdout.write(`CENSUS A · cross-check (no band)      = ${t.straddleCrossCheck.numerator} of ${t.straddleCrossCheck.denominator}\n`);
    process.stdout.write(`CENSUS B · OUTSIDE-CIRCUIT BODIES     = ${t.bodyCensus.numerator} of ${t.bodyCensus.denominator} members`
      + ` (${t.bodyCensus.suburb} suburb, ${t.bodyCensus.drawnBodiesAllLeaves} drawn bodies across all leaves)\n`);
    process.stdout.write(`§240.1 hull vertices outside own ring  = ${t.hullVerticesOutside}\n`);
    if (json) writeFileSync(json, JSON.stringify(res, null, 2));
    process.stdout.write('I10_DONE\n');
  }
}
