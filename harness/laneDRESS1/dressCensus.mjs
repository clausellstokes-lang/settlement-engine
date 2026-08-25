#!/usr/bin/env node
/**
 * harness/laneDRESS1/dressCensus.mjs — ⭐⭐⭐ DRESS-1 · **THE EXIT SHEET**, with `--controls`.
 *
 * Five censuses over the corpus, each printing a COUNT (counts are verdicts; exit codes are not):
 *   V   the VALUE HIERARCHY (exit 2) — I3 + I4, per lens
 *   C   the §650.2 CLIP CENSUS (PA.1) — no mark outside the face that owns it
 *   L   L-REG-34 LEGEND AGREEMENT (exit 7) — both directions
 *   R   the ROUTE RESIDUE (PA.1) — crag avoidance · zero-mouth fragments · grade response
 *   W   the WALL PUBLICATION's own totality — every fragment vertex in exactly one run
 *
 * Usage: node harness/laneDRESS1/dressCensus.mjs [--leaves=a,b] [--controls] [--json=<path>]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { publishWallWorks } from '../../src/domain/townMap/fabric/wallPublication.js';
import {
  dressPage, valueCensus, legendCensus, tones, inRing, hatchPolygon, clipSegment,
} from '../../src/domain/townMap/fabric/partitionDress.js';
import { wallForm } from '../../src/domain/townMap/fabric/walls.js';
import { faceRing, liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { LENS_IDS, resolveLens } from '../../src/domain/townMap/fabric/folioLenses.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const has = (n) => process.argv.includes(`--${n}`);
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/**
 * ⭐⭐ **THE CLIP CENSUS (§650.2 / review I7), MEASURED ON THE GEOMETRY THAT WAS DRAWN.** The
 * review's conviction is a REACH claim — *"crosses streets, buildings, the river, and the open
 * sea"* — so the census re-generates each textured family from the same face it was drawn on and
 * asks whether any sample point lies outside that face. Re-generating rather than parsing the SVG
 * is deliberate: a path-string parser measures its own parser, and this measures the producer.
 */
function clipCensus(page, rw) {
  let segs = 0; let outside = 0;
  for (const f of page.fields) {
    if (f.ring.length < 3) continue;
    // the same call the dress makes, with the same arguments
    let bi = 0; let bj = 1; let bd = -1;
    for (let i = 0; i < f.ring.length; i++) {
      for (let j = i + 1; j < f.ring.length; j++) {
        const d = (f.ring[i][0] - f.ring[j][0]) ** 2 + (f.ring[i][1] - f.ring[j][1]) ** 2;
        if (d > bd) { bd = d; bi = i; bj = j; }
      }
    }
    const ang = (Math.atan2(f.ring[bj][1] - f.ring[bi][1], f.ring[bj][0] - f.ring[bi][0]) * 180) / Math.PI + 90;
    for (const [a, b] of hatchPolygon(f.ring, ang, rw * 1.15)) {
      segs++;
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      // ⚠ THE MIDPOINT AND BOTH ENDS, nudged inward off the boundary: an endpoint lies ON the
      //   ring by construction and an even-odd test on a boundary point is a coin flip.
      const inA = inRing(f.ring, a[0] + (m[0] - a[0]) * 1e-6, a[1] + (m[1] - a[1]) * 1e-6);
      const inB = inRing(f.ring, b[0] + (m[0] - b[0]) * 1e-6, b[1] + (m[1] - b[1]) * 1e-6);
      if (!inRing(f.ring, m[0], m[1]) || !inA || !inB) outside++;
    }
  }
  let ridges = 0; let ridgeOut = 0; let ridgeRefused = 0;
  for (const m of page.masses) {
    for (const [ri, rr] of (m.runRings || []).entries()) {
      const ridge = (m.ridgeOfRun || [])[ri];
      if (!ridge || !rr || rr.length < 3) continue;
      ridges++;
      const c = clipSegment(rr, ridge[0], ridge[1]);
      // ⚠ A REFUSED RIDGE IS NOT A CLIP VIOLATION — it is the clip WORKING. The first spelling of
      //   this census counted `clipSegment → null` as an escape and reported `1/617 ridgeOut` on
      //   three leaves for ridges the dress never drew. A violation is ink OUTSIDE its face; a
      //   refusal is ink that was never laid. They are counted apart.
      if (!c) { ridgeRefused++; continue; }
      const mid = [(c[0][0] + c[1][0]) / 2, (c[0][1] + c[1][1]) / 2];
      if (!inRing(rr, mid[0], mid[1])) ridgeOut++;
    }
  }
  return { segs, outside, ridges, ridgeOut, ridgeRefused, ok: outside === 0 && ridgeOut === 0 };
}

/**
 * ⭐⭐ **THE ROUTE RESIDUE (PA.1's restoration).** REG-ROUTE's remaining scope is three rows —
 * *grade response · crag avoidance · zero-mouth fragments* — and this measures what the partition
 * can actually answer.
 *
 * ⛔ **GRADE RESPONSE IS NOT MEASURABLE AT THIS SLOT, AND THE ZERO IS DECLARED RATHER THAN
 * PRINTED.** The heightfield reaches the CONSTRUCTOR (SPINE §2) and is not carried on the
 * published partition, so a grade figure taken here would be measured against nothing. §9 law 8
 * is the reason this sentence exists instead of a `0`.
 */
function routeResidue(P) {
  const arr = P.arrangement;
  const ways = liveFaces(arr).filter((f) => f.cls === 'WAY');
  const wayIds = new Set(ways.map((f) => f.id));
  /**
   * ⚠⚠ **TWO DEFINITIONS OF A MOUTH, AND BOTH ARE REPORTED, BECAUSE THE STRICT ONE OVER-COUNTS.**
   * The first spelling counted only WAY↔WAY edges and frontier edges, and read **38 of 600 ways
   * landlocked at the metropolis**. Reading four of them showed what they actually abut:
   * `{FIELD:4, PLOT:2}`, `{VOID:1, PLOT:5}` — open countryside and a market square. A way opening
   * onto FIELD is reachable from the country and a way opening onto a VOID is reachable across the
   * square, so the strict count convicts ways that are perfectly reachable.
   * ⭐ LANDLOCKED is the honest predicate: bounded ONLY by PLOT and WALLBAND — no traversable
   * ground of any kind. Both figures print so a reader can see the difference the definition makes.
   */
  const TRAVERSABLE = new Set(['WAY', 'VOID', 'FIELD']);
  let strictZero = 0;
  let landlocked = 0;
  const landlockedIds = [];
  for (const f of ways) {
    let strict = 0;
    let open = 0;
    let h = arr.faces[f.id].he;
    const start = h;
    let guard = 0;
    do {
      const he = arr.halfEdges[h];
      const tw = arr.halfEdges[he.twin].face;
      const cls = arr.faces[tw] && arr.faces[tw].alive ? arr.faces[tw].cls : null;
      const frontier = arr.edges[he.edge] && arr.edges[he.edge].frontier;
      if (wayIds.has(tw) || frontier) strict++;
      if ((cls && TRAVERSABLE.has(cls)) || frontier) open++;
      h = he.next;
      if (++guard > 100000) break;
    } while (h !== start);
    if (!strict) strictZero++;
    if (!open) { landlocked++; if (landlockedIds.length < 6) landlockedIds.push(f.id); }
  }
  // CRAG AVOIDANCE: no WAY face may share an edge typed CLIFF
  const cliffEdges = arr.edges.filter((e) => e.type === 'CLIFF').length;
  let onCrag = 0;
  for (const e of arr.edges) {
    if (e.type !== 'CLIFF') continue;
    const he = arr.halfEdges[e.he];
    for (const fid of [he.face, arr.halfEdges[he.twin].face]) {
      if (arr.faces[fid] && arr.faces[fid].alive && arr.faces[fid].cls === 'WAY') onCrag++;
    }
  }
  return {
    ways: ways.length,
    strictZero,
    landlocked,
    landlockedIds,
    cliffEdges,
    onCrag,
    /**
     * ⛔ **THE CRAG ZERO IS VACUOUS AND SAYS SO.** `cliffEdges` is the denominator, and it is 0
     * across this corpus: A1.7-M1 put CLIFF in the edge taxonomy but the constructor mints none,
     * so "no way sits on a crag" is true of a world with no crags. §9 law 4 — a zero without a
     * live control is UNVERIFIED — and this is the control reporting itself dead.
     */
    cragVacuous: cliffEdges === 0,
    /**
     * ⛔ GRADE RESPONSE IS NOT MEASURABLE AT THIS SLOT. The heightfield reaches the CONSTRUCTOR
     * (SPINE §2) and is not carried on the published partition, so a grade figure taken here would
     * be measured against nothing. Declared rather than printed as a 0.
     */
    gradeResponse: null,
    ok: landlocked === 0,
  };
}

const rows = [];
let red = 0;
for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const page = projectPage(P, { roadWidth: input.roadWidth });
  const walls = publishWallWorks(P, {
    form: wallForm(settlement, fabric.meta.tier).form,
    frontage: input.roadWidth, seed: input.seed,
    year: fabric.meta.presentYear != null ? fabric.meta.presentYear : null,
  });
  const dress = dressPage(page, {
    lens: 'parchment', roadWidth: input.roadWidth, walls,
    ringOfFace: (fid) => (P.arrangement.faces[fid] && P.arrangement.faces[fid].alive
      ? faceRing(P.arrangement, fid) : null),
  });
  const V = valueCensus(dress.tones);
  const C = clipCensus(page, input.roadWidth);
  const L = legendCensus(dress);
  const R = routeResidue(P);
  // W · the publication's own totality on this leaf
  let wVerts = 0; let wCovered = 0; let wDouble = 0;
  for (const c of walls.circuits) for (const f of c.fragments) {
    wVerts += f.ring.length;
    const seen = new Set();
    for (const r of f.runs) for (const i of r.idx) { if (seen.has(i)) wDouble++; seen.add(i); }
    wCovered += seen.size;
  }
  const ok = V.ok && C.ok && L.ok && R.ok && wCovered === wVerts && wDouble === 0;
  if (!ok) red++;
  rows.push({ key, tier: fabric.meta.tier, ok, V, C, L, R, W: { wVerts, wCovered, wDouble } });
  console.log(`${key.padEnd(12)} ${ok ? 'GREEN' : 'RED  '}`
    + ` V ${V.ok ? 'ok' : 'RED'} C ${C.outside}/${C.segs}out ${C.ridgeOut}/${C.ridges}ridgeOut`
    + `(${C.ridgeRefused}refused) L ${L.untaught.length}untaught/${L.unlocatable.length}undrawable`
    + ` R ${R.landlocked}landlocked (${R.strictZero} strict) /${R.onCrag}onCrag of ${R.ways} ways`
    + `${R.cragVacuous ? ' [CRAG VACUOUS: 0 cliff edges]' : ''}`
    + ` W ${wCovered}/${wVerts}`);
  if (!ok) console.log(`             ${V.reason} | clip ${C.ok} | ${L.reason} | route ${R.ok}`);
}

if (has('controls')) {
  console.log('\n⛔ PLANTED CONTROLS — each must CONVICT, or the census above proves nothing');
  const T = tones(resolveLens('parchment'));
  const vc = (o) => (valueCensus({ ...T, ...o }).ok ? '⛔ GREEN (dead)' : 'RED (convicts)');
  console.log(`  V · plot ground = street ground   → ${vc({ plotGround: T.street })}`);
  console.log(`  V · built = plot ground           → ${vc({ built: T.plotGround })}`);
  console.log(`  V · field = paper                 → ${vc({ field: T.paper })}`);
  console.log(`  V · SE plane = NW plane           → ${vc({ roofSE: T.roofNW })}`);
  console.log(`  V · restored                      → ${valueCensus(T).ok ? 'GREEN (want GREEN)' : '⛔ RED'}`);

  // C · a square hatched against a ring it does not own must land outside
  const own = [[0, 0], [40, 0], [40, 40], [0, 40]];
  const alien = [[100, 100], [140, 100], [140, 140], [100, 140]];
  const segs = hatchPolygon(own, 0, 6);
  const strayOutside = segs.filter(([a]) => !inRing(alien, a[0], a[1])).length;
  console.log(`  C · hatch of face A tested against face B → ${strayOutside === segs.length
    ? `RED (convicts: ${strayOutside}/${segs.length} outside)` : '⛔ GREEN (dead)'}`);
  const selfOutside = segs.filter(([a, b]) => !inRing(own, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2)).length;
  console.log(`  C · the same hatch against its OWN face   → ${selfOutside === 0
    ? 'CLEAN (want 0)' : `⛔ ${selfOutside} outside its own face`}`);
  // C · a ridge deliberately outside its footprint must be refused
  console.log(`  C · a ridge laid outside its footprint    → ${clipSegment(own, [200, 200], [260, 260]) === null
    ? 'REFUSED (convicts)' : '⛔ DRAWN (dead)'}`);

  // L · a legend missing a row for a drawn group must convict
  const fake = { groups: ['dress-masses', 'dress-not-taught-anywhere'] };
  console.log(`  L · a drawn group with no legend row      → ${legendCensus(fake).ok
    ? '⛔ GREEN (dead)' : 'RED (convicts)'}`);
}

console.log(`\nRED leaves: ${red} of ${leaves.length}`);
const out = arg('json', '');
if (out) writeFileSync(out, JSON.stringify(rows, null, 1));

// the value ladder across all six lenses, printed once — a lens is not a leaf
console.log('\nVALUE LADDER, ALL SIX LENSES:');
for (const id of LENS_IDS) {
  const v = valueCensus(tones(resolveLens(id)));
  console.log(`  ${id.padEnd(13)} ${v.ok ? 'GREEN' : 'RED  '} ${v.reason}`);
  if (!v.ok) red++;
}
process.exitCode = red ? 1 : 0;
