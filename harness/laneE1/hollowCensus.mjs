#!/usr/bin/env node
/**
 * harness/laneE1/hollowCensus.mjs — ⭐⭐⭐ REG-E1 · **WHAT THE CIRCUIT ENCLOSES, DECOMPOSED.**
 *
 * ⛔ **A SINGLE BUILT-TO-ENCLOSED RATIO CANNOT TELL A DRAWING BUG FROM A TRUE HISTORY**, which is
 * the whole value of the measurement. The chair's taxonomy, and the column that separates each:
 *
 *   (a) UNDER-SUBDIVISION   ground the drawing failed to cut. Column: `bare%` — the share of the
 *                           enclosure carrying NO drawn face at all, plus the SIZE of the ground
 *                           that is drawn as open (a FIELD face 65× a plot is not a garden).
 *   (b) HONEST OPTIMISM     ground the settlement never had souls for. Column: `sat` — the LEDGER'S
 *                           OWN `saturation` at the present epoch, i.e. population over the ring's
 *                           own capacity. This is the record's own statement of how full the ring
 *                           is, so it is not a number this census invents.
 *   (c) THE POMERIUM        open ground in a band immediately INSIDE the wall. Column: `pom%` — the
 *                           open share of the annulus one road-width deep inside the ring, against
 *                           the open share of the rest. > 1 means a pomerium exists; ≈ 1 means the
 *                           emptiness is uniform and there is no band; < 1 means the fabric is
 *                           pressed AGAINST the stones, which is the reference's own opposite.
 *
 * ⚠ **INTRAMURAL OPEN GROUND HERE IS NOT BARE PARCHMENT.** `partitionView.projectPage` pushes every
 * live `FIELD` face into `page.fields` and `partitionDress` draws each one with the field tone AND
 * the furlong grain, so this ground renders as PLOUGHED STRIPS, not as blank paper. That is a
 * different defect from the one the reference cannot have, and the census says which we have.
 *
 * Usage: node harness/laneE1/hollowCensus.mjs [--leaves=a,b] [--json=<path>]
 * ⚠ ARM IT in the SHELL: `REG_FABRIC_OPTS` is read at module load (REG-F0 J-F0-3).
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { pointInPolygon } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { liveFaces, faceArea, faceCentroid, faceRing } from '../../src/domain/townMap/fabric/partitionArrangement.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

const PIECE = new Set(['WARD', 'BLOCK', 'PLOT']);
/** Ground a reader reads as OPEN: unbuilt countryside inside the stones, plus the ruined quarter. */
const OPEN = new Set(['FIELD', 'LOSSREGION']);

function ringArea(r) {
  let s = 0;
  for (let i = 0; i < r.length; i++) { const a = r[i]; const b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1]; }
  return Math.abs(s / 2);
}
function distToRing(ring, p) {
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const vx = b[0] - a[0]; const vy = b[1] - a[1];
    const wx = p[0] - a[0]; const wy = p[1] - a[1];
    const L2 = vx * vx + vy * vy;
    const t = L2 > 0 ? Math.max(0, Math.min(1, (wx * vx + wy * vy) / L2)) : 0;
    best = Math.min(best, Math.hypot(wx - vx * t, wy - vy * t));
  }
  return best;
}

const f1 = (v) => (Number.isFinite(v) ? v.toFixed(1) : '—');
const num = (v) => Math.round(v).toLocaleString('en-US');

const rows = [];
console.log('══ WHAT THE OUTERMOST CIRCUIT ENCLOSES — DECOMPOSED ══');
console.log('cover% = share of the enclosure covered by SOME live face (100 − cover% is ground no face holds)');
console.log('built% = WARD+BLOCK+PLOT · open% = FIELD+LOSSREGION · way% = WAY · sat = the LEDGER\'s own'
  + ' present-epoch saturation (population / ring capacity)\n');
console.log(`${'leaf'.padEnd(12)}${'enclosed'.padStart(10)}${'cover%'.padStart(8)}${'built%'.padStart(8)}`
  + `${'open%'.padStart(7)}${'way%'.padStart(7)}${'band%'.padStart(7)}${'void%'.padStart(7)}`
  + `${'sat'.padStart(7)}${'b/sat'.padStart(7)}${'openN'.padStart(6)}${'openMean'.padStart(9)}`
  + `${'plotMean'.padStart(9)}${'x'.padStart(6)}${'pomRatio'.padStart(9)}`);

for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  if (!P.wraps.length) { console.log(`${key.padEnd(12)}${'—'.padStart(10)}  NO WRAPS`); rows.push({ leaf: key, wraps: 0 }); continue; }
  const arr = P.arrangement;
  const w = P.wraps[P.wraps.length - 1];
  const ring = w.outer.map((p) => [p[0], p[1]]);
  const enclosed = ringArea(ring);
  const rw = input.roadWidth || 5;

  const acc = {}; const cnt = {}; const sizes = { open: [], piece: [] };
  // the pomerium annulus: everything whose centroid is within ONE ROAD WIDTH of the ring, inside it
  let pomTotal = 0; let pomOpen = 0; let coreTotal = 0; let coreOpen = 0;
  let covered = 0;
  for (const f of liveFaces(arr)) {
    const c = faceCentroid(arr, f.id);
    if (!pointInPolygon(c[0], c[1], ring)) continue;
    const a = Math.abs(faceArea(arr, f.id));
    acc[f.cls] = (acc[f.cls] || 0) + a; cnt[f.cls] = (cnt[f.cls] || 0) + 1;
    covered += a;
    if (OPEN.has(f.cls)) sizes.open.push(a);
    if (PIECE.has(f.cls)) sizes.piece.push(a);
    const d = distToRing(ring, c);
    if (d <= rw) { pomTotal += a; if (OPEN.has(f.cls)) pomOpen += a; }
    else { coreTotal += a; if (OPEN.has(f.cls)) coreOpen += a; }
  }
  const built = ['WARD', 'BLOCK', 'PLOT'].reduce((s, k) => s + (acc[k] || 0), 0);
  const open = [...OPEN].reduce((s, k) => s + (acc[k] || 0), 0);
  const openN = [...OPEN].reduce((s, k) => s + (cnt[k] || 0), 0);
  const pieceN = ['WARD', 'BLOCK', 'PLOT'].reduce((s, k) => s + (cnt[k] || 0), 0);
  const openMean = openN ? open / openN : 0;
  const plotMean = pieceN ? built / pieceN : 0;

  // ── THE RECORD'S OWN STATEMENT OF FULLNESS. The final epoch is the present, exactly.
  // ⭐ `input.ledger` is the ledger THIS partition folded (`partitionInputs` builds it and hands
  //   it to `buildSettledPartition`), so the saturation read here is the one the drawing came from.
  const L = input.ledger || null;
  const eps = L && Array.isArray(L.epochs) ? L.epochs : [];
  const last = eps.length ? eps[eps.length - 1] : null;
  const sat = last && Number.isFinite(last.saturation) ? last.saturation : null;

  const pomOpenShare = pomTotal > 0 ? pomOpen / pomTotal : null;
  const coreOpenShare = coreTotal > 0 ? coreOpen / coreTotal : null;
  const pomRatio = (pomOpenShare != null && coreOpenShare > 0) ? pomOpenShare / coreOpenShare : null;

  const pc = (v) => (100 * v / enclosed);
  rows.push({
    leaf: key, wrap: w.index, enclosed, covered, built, open, openN, pieceN, openMean, plotMean,
    acc, cnt, saturation: sat, capacity: last ? last.capacity : null,
    population: last ? last.population : null, presentYear: L ? L.presentYear : null,
    pomOpenShare, coreOpenShare, pomRatio, roadWidth: rw,
    openSizesSorted: sizes.open.slice().sort((a, b) => b - a).slice(0, 8),
  });
  console.log(`${key.padEnd(12)}${num(enclosed).padStart(10)}${pc(covered).toFixed(1).padStart(8)}`
    + `${pc(built).toFixed(1).padStart(8)}${pc(open).toFixed(1).padStart(7)}`
    + `${pc(acc.WAY || 0).toFixed(1).padStart(7)}${pc(acc.WALLBAND || 0).toFixed(1).padStart(7)}`
    + `${pc(acc.VOID || 0).toFixed(1).padStart(7)}`
    + `${(sat == null ? '—' : sat.toFixed(2)).padStart(7)}`
    + `${(sat ? (pc(built) / 100 / sat).toFixed(2) : '—').padStart(7)}`
    + `${String(openN).padStart(6)}${f1(openMean).padStart(9)}${f1(plotMean).padStart(9)}`
    + `${(plotMean ? (openMean / plotMean).toFixed(0) : '—').padStart(6)}`
    + `${(pomRatio == null ? '—' : pomRatio.toFixed(2)).padStart(9)}`);
}

const out = arg('json', '');
if (out) { writeFileSync(out, JSON.stringify(rows, null, 1)); console.log(`\nwrote ${out}`); }
