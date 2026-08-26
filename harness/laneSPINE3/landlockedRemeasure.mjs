#!/usr/bin/env node
/**
 * harness/laneSPINE3/landlockedRemeasure.mjs — SPINE-3 · re-measurement of the LANDLOCKED figure.
 *
 * Replicates `routeResidue`'s landlocked predicate from harness/laneDRESS1/dressCensus.mjs:90-159
 * VERBATIM (the shipped instrument caps `landlockedIds` at 6, so it cannot supply the id SET a
 * distinctness key needs). Adds, per leaf:
 *   - the FULL landlocked way-id set
 *   - the partition fingerprint (edge count, way count, edge histogram, face/half-edge counts)
 *   - NEGATIVE CONTROLS: predicate variants that MUST give a different number
 *   - PLANTED CONTROLS: two mutations of the built arrangement that MUST move the figure
 *
 * Usage: node harness/laneSPINE3/landlockedRemeasure.mjs [--leaves=a,b] [--json=<path>]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/** The SHIPPED traversable set — dressCensus.mjs:104. */
const TRAVERSABLE = new Set(['WAY', 'VOID', 'FIELD']);

/**
 * The shipped predicate, generalised over the traversable set and over whether a FRONTIER edge
 * counts as an opening. `traversable=TRAVERSABLE, frontierOpens=true` IS the shipped predicate.
 * Returns full per-way detail (no 6-id cap).
 */
function landlockedScan(arr, { traversable = TRAVERSABLE, frontierOpens = true, strict = false } = {}) {
  const ways = liveFaces(arr).filter((f) => f.cls === 'WAY');
  const wayIds = new Set(ways.map((f) => f.id));
  const ids = [];
  let count = 0;
  const abut = new Map(); // faceId -> class histogram of what the landlocked way touches
  for (const f of ways) {
    let open = 0;
    const hist = {};
    let h = arr.faces[f.id].he;
    const start = h;
    let guard = 0;
    do {
      const he = arr.halfEdges[h];
      const tw = arr.halfEdges[he.twin].face;
      const cls = arr.faces[tw] && arr.faces[tw].alive ? arr.faces[tw].cls : null;
      const frontier = arr.edges[he.edge] && arr.edges[he.edge].frontier;
      hist[cls || 'DEAD'] = (hist[cls || 'DEAD'] || 0) + 1;
      if (strict) {
        if (wayIds.has(tw) || (frontierOpens && frontier)) open++;
      } else if ((cls && traversable.has(cls)) || (frontierOpens && frontier)) open++;
      h = he.next;
      if (++guard > 100000) break;
    } while (h !== start);
    if (!open) { count++; ids.push(f.id); abut.set(f.id, hist); }
  }
  return { ways: ways.length, count, ids, abut };
}

function edgeHistogram(arr) {
  const h = {};
  for (const e of arr.edges) h[e.type] = (h[e.type] || 0) + 1;
  return h;
}

const rows = [];
for (const key of leaves) {
  const t0 = Date.now();
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const arr = P.arrangement;

  const base = landlockedScan(arr);
  const hist = edgeHistogram(arr);

  // ── NEGATIVE CONTROLS (predicate variants that must give a DIFFERENT number) ──────────────
  const ncStrict = landlockedScan(arr, { strict: true }).count;                       // the shipped `strictZero`
  const ncPlot = landlockedScan(arr, { traversable: new Set(['WAY', 'VOID', 'FIELD', 'PLOT']) }).count;
  const ncNoFrontier = landlockedScan(arr, { frontierOpens: false }).count;
  const ncWayOnly = landlockedScan(arr, { traversable: new Set(['WAY']), frontierOpens: false }).count;
  const ncAll = landlockedScan(arr, {
    traversable: new Set(['WARD', 'BLOCK', 'PLOT', 'VOID', 'FIELD', 'WATER', 'LOSSREGION', 'WALLBAND', 'WAY', 'OUTER']),
  }).count;

  // ── PLANTED CONTROLS (mutate the ARRANGEMENT; the figure must move) ───────────────────────
  // Plant A · BLIND A WAY: take a way that is currently OPEN, and turn every traversable
  // neighbour it has into PLOT while clearing the frontier flag on its own boundary edges.
  // The count must RISE.
  const wayFaces = liveFaces(arr).filter((f) => f.cls === 'WAY');
  const lockedSet = new Set(base.ids);
  const victim = wayFaces.find((f) => !lockedSet.has(f.id));
  let plantA = null;
  if (victim) {
    const savedCls = [];
    const savedFrontier = [];
    let h = arr.faces[victim.id].he;
    const start = h; let guard = 0;
    do {
      const he = arr.halfEdges[h];
      const tw = arr.halfEdges[he.twin].face;
      if (arr.faces[tw] && arr.faces[tw].alive && TRAVERSABLE.has(arr.faces[tw].cls)) {
        savedCls.push([tw, arr.faces[tw].cls]);
        arr.faces[tw].cls = 'PLOT';
      }
      const e = arr.edges[he.edge];
      if (e && e.frontier) { savedFrontier.push(he.edge); e.frontier = false; }
      h = he.next;
      if (++guard > 100000) break;
    } while (h !== start);
    const after = landlockedScan(arr);
    plantA = {
      victimFace: victim.id,
      neighboursRetyped: savedCls.length,
      frontierEdgesCleared: savedFrontier.length,
      before: base.count, after: after.count, delta: after.count - base.count,
      victimNowLandlocked: after.ids.includes(victim.id),
      newIds: after.ids.filter((i) => !lockedSet.has(i)),
    };
    for (const [fid, cls] of savedCls) arr.faces[fid].cls = cls;
    for (const eid of savedFrontier) arr.edges[eid].frontier = true;
    const restored = landlockedScan(arr);
    plantA.restored = restored.count;
    plantA.restoredExact = restored.count === base.count
      && restored.ids.join(',') === base.ids.join(',');
  }

  // Plant B · OPEN A LANDLOCKED WAY: flag ONE boundary edge of a landlocked way as frontier.
  // The count must FALL.
  let plantB = null;
  if (base.ids.length) {
    const fid = base.ids[0];
    const he = arr.halfEdges[arr.faces[fid].he];
    const eid = he.edge;
    const was = arr.edges[eid].frontier;
    arr.edges[eid].frontier = true;
    const after = landlockedScan(arr);
    plantB = {
      openedFace: fid, edge: eid, edgeWasFrontier: was,
      before: base.count, after: after.count, delta: after.count - base.count,
      stillLandlocked: after.ids.includes(fid),
      goneIds: base.ids.filter((i) => !after.ids.includes(i)),
    };
    arr.edges[eid].frontier = was;
    const restored = landlockedScan(arr);
    plantB.restored = restored.count;
    plantB.restoredExact = restored.count === base.count
      && restored.ids.join(',') === base.ids.join(',');
  }

  const row = {
    key,
    tier: fabric.meta.tier,
    seed: spec.seed,
    terrain: spec.terrain || null,
    ways: base.ways,
    landlocked: base.count,
    landlockedIds: base.ids,
    abut: Object.fromEntries([...base.abut].map(([k, v]) => [k, v])),
    edges: arr.edges.length,
    halfEdges: arr.halfEdges.length,
    faces: arr.faces.length,
    liveFaces: liveFaces(arr).length,
    edgeHistogram: hist,
    nc: { strict: ncStrict, plusPLOT: ncPlot, noFrontier: ncNoFrontier, wayOnly: ncWayOnly, allClasses: ncAll },
    plantA, plantB,
    ms: Date.now() - t0,
  };
  rows.push(row);
  console.log(`${key.padEnd(12)} ways=${String(base.ways).padStart(4)} landlocked=${String(base.count).padStart(3)}`
    + ` edges=${String(arr.edges.length).padStart(6)} ids=[${base.ids.join(',')}]`
    + ` | NC strict=${ncStrict} +PLOT=${ncPlot} noFront=${ncNoFrontier} wayOnly=${ncWayOnly} all=${ncAll}`
    + ` | A ${plantA ? `${plantA.before}->${plantA.after}(${plantA.delta >= 0 ? '+' : ''}${plantA.delta}) restored=${plantA.restoredExact}` : 'n/a'}`
    + ` | B ${plantB ? `${plantB.before}->${plantB.after}(${plantB.delta}) restored=${plantB.restoredExact}` : 'n/a (no landlocked way)'}`
    + ` ${row.ms}ms`);
}

// ── THE RAW FIGURE ────────────────────────────────────────────────────────────────────────────
const rawLandlocked = rows.reduce((n, r) => n + r.landlocked, 0);
const rawWays = rows.reduce((n, r) => n + r.ways, 0);
console.log(`\nRAW (all leaves): ${rawLandlocked} landlocked / ${rawWays} ways over ${rows.length} leaves`);

// ── DISTINCTNESS, DERIVED HERE ────────────────────────────────────────────────────────────────
// Two leaves are the SAME PARTITION iff edge count, way count and landlocked way-id set match.
const classes = new Map();
for (const r of rows) {
  const k = `E${r.edges}|W${r.ways}|L[${r.landlockedIds.join(',')}]`;
  if (!classes.has(k)) classes.set(k, []);
  classes.get(k).push(r);
}
console.log(`\nEQUIVALENCE CLASSES (key = edgeCount | wayCount | landlocked id set): ${classes.size}`);
let distinctLandlocked = 0; let distinctWays = 0;
let idx = 0;
for (const [k, members] of classes) {
  idx++;
  const rep = members[0];
  distinctLandlocked += rep.landlocked;
  distinctWays += rep.ways;
  // does the EDGE HISTOGRAM also agree inside the class? (the receipt claimed it did)
  const histKeys = new Set(members.map((m) => JSON.stringify(m.edgeHistogram)));
  const heKeys = new Set(members.map((m) => `${m.halfEdges}/${m.faces}/${m.liveFaces}`));
  console.log(`  C${idx} [${members.length}] ${members.map((m) => m.key).join(', ')}`);
  console.log(`      ${k}  histAgrees=${histKeys.size === 1} faceCountsAgree=${heKeys.size === 1}`);
  console.log(`      rep=${rep.key} landlocked=${rep.landlocked} ways=${rep.ways} hist=${JSON.stringify(rep.edgeHistogram)}`);
}
console.log(`\nDISTINCT-PARTITION: ${distinctLandlocked} landlocked / ${distinctWays} ways over ${classes.size} distinct partitions`);

// ── A COARSER KEY, as a cross-check: edges + ways ONLY (no landlocked ids) ────────────────────
const coarse = new Set(rows.map((r) => `E${r.edges}|W${r.ways}`));
console.log(`Coarse key (edges|ways only) classes: ${coarse.size}`);
// ── AND the corpus's own siteKey, for comparison ─────────────────────────────────────────────
const sites = new Set(rows.map((r) => {
  const s = CORPUS.find((c) => c.key === r.key);
  return `${s.seed}|${s.terrain || '-'}${s.demote ? '|demoted' : ''}${s.forceCrossing ? '|crossing' : ''}`;
}));
console.log(`Corpus siteKey classes over these leaves: ${sites.size}`);

const out = arg('json', '');
if (out) writeFileSync(out, JSON.stringify(rows, null, 1));
