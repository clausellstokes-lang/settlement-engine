/**
 * regI1-ratchetunit.mjs — lane REG-I1 · THE RATCHET-UNIT REVIEW (§628 charter).
 *
 * ⭐⭐ THE QUESTION, AND IT IS NOT "IS THE CEILING HIGH ENOUGH". `OP_CEILING_BY_TIER` rations
 * **OP PRIMITIVES**, and three waves running have now reported that the primitive count moves in a
 * direction the actual cost does not follow: REG-3 measured primitives **+72 %** where DOM nodes
 * moved **+4 … +50 %** and render time was flat; REG-4 measured DOM 64→69 at thorp and 346→423 at
 * metropolis for a primitive spend that priced two tiers into their last two thousand. A ratchet
 * whose unit is not the cost is a ratchet that will refuse a cheap drawing and wave through an
 * expensive one. This instrument measures all three units side by side so the chair can sign a
 * replacement unit against evidence rather than against a proxy's reputation.
 *
 * ═══ THE THREE UNITS ═══
 *   PRIMITIVES  `renderFolio().primitiveCount` — the ration's present unit. Counts MARKS: every
 *               tick, tooth, hachure and stall dash, whether or not it batches.
 *   DOM NODES   `renderFolio().elementCount` — what the browser actually instantiates. A hundred
 *               merlons batched into one `<path>` are ONE node and a hundred primitives.
 *   MILLISECONDS `renderFolio()` wall clock, THREE SAMPLES after one discarded warm-up.
 *   (BYTES is carried beside them because it is the delivery cost and it is free to measure.)
 *
 * ⭐ PRIMITIVES AND NODES ARE DETERMINISTIC AND THE INSTRUMENT ASSERTS IT. If sample 2 or 3 of a
 * leaf returns a different primitive count from sample 1, the renderer is not a function of the
 * fabric and every op figure this programme has ever published is a draw from a distribution.
 * That check is free here and it has never been run, so it is run.
 *
 * ⚠ SAMPLE 1 IS NOT DISCARDED SILENTLY — one warm-up render per (leaf, arm) is taken and thrown
 * away BEFORE the three samples, and this comment is the disclosure. Without it the first leaf of
 * the corpus wears the whole process's JIT warm-up and reads 3–4× the others.
 *
 * ⛔ NOTHING IS RE-PINNED. `OP_CEILING_BY_TIER` is not read, not written and not proposed against;
 * the §628-SIGNED table is carried as a CONSTANT here purely so the primitive column has its
 * published denominator beside it. The output is a PROPOSAL for the chair to sign.
 *
 * Usage: node regI1-ratchetunit.mjs [--wt=<worktree>] [--samples=3] [--json=out/regI1-ratchetunit.json]
 */
import { writeFileSync } from 'node:fs';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const WT = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREG4-tree');
const SAMPLES = Number(arg('samples', 3));

const { CORPUS, buildOne } = await import(`${WT}/harness/exemplars.mjs`);
const { renderFolio } = await import(`${WT}/harness/renderFolio.mjs`);

/** ODQ §628, SIGNED. Carried as a constant, never read from the pin and never written to it. */
const SIGNED = { thorp: 1000, hamlet: 1400, village: 2000, town: 9300, city: 10000, metropolis: 14200 };
const ARMS = [
  ['BASE', {}],
  ['ALL', { frontageFusion: true, rampart: true, shapeCode: true, marketRegister: true, minFootprint: true }],
];

/**
 * ⛔⛔ `renderFolio().elementCount` IS **NOT** THE DOM NODE COUNT, AND A PROPOSAL SET ON IT WOULD
 * BE SET ON THE WRONG NUMBER. Measured on this corpus: base `town` reports elementCount 286 while
 * the finished document holds 353 elements, and armed `town` reports 444 against 514. The
 * renderer counts its own DRAW LIST; the §173 LETTERING SPLICE is *"a SEPARATE STAGE OVER THE
 * FINISHED DRAW LIST"* (renderFolio §19) and its `<text>` never enters that count, plus ~10 more
 * elements on the armed arm. A browser instantiates all of them.
 * So both are reported: `nodes` = the renderer's own figure (comparable with every published
 * REG-2/3/4 table), `dom` = the TRUE element census of the emitted document (what a ceiling on
 * browser cost would have to ration).
 */
const domCensus = (svg) => {
  const c = {};
  let total = 0;
  for (const m of svg.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)\b/g)) {
    const t = m[1];
    c[t] = (c[t] || 0) + 1;
    if (t !== 'svg' && t !== 'title') total++;
  }
  return { total, byTag: c };
};

const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const pct = (a, b) => (b ? Math.round(((a - b) / b) * 1000) / 10 : null);

const rows = [];
const determinismBreaks = [];
for (const spec of CORPUS) {
  const row = { leaf: spec.key };
  for (const [name, opts] of ARMS) {
    const { fabric } = buildOne(spec, opts);
    row.tier = fabric.meta.tier;
    renderFolio(fabric, { lens: 'parchment' });                     // discarded warm-up (disclosed)
    const ms = [];
    let prim = null, nodes = null, bytes = null, dom = null, byTag = null;
    for (let s = 0; s < SAMPLES; s++) {
      const t0 = process.hrtime.bigint();
      const out = renderFolio(fabric, { lens: 'parchment' });
      const t1 = process.hrtime.bigint();
      ms.push(Number(t1 - t0) / 1e6);
      if (s === 0) { prim = out.primitiveCount; nodes = out.elementCount; bytes = out.svg.length; const d = domCensus(out.svg); dom = d.total; byTag = d.byTag; }
      else if (out.primitiveCount !== prim || out.elementCount !== nodes || out.svg.length !== bytes) {
        determinismBreaks.push({ leaf: spec.key, arm: name, sample: s + 1, prim: out.primitiveCount, nodes: out.elementCount, bytes: out.svg.length, expected: { prim, nodes, bytes } });
      }
    }
    const lo = Math.min(...ms), hi = Math.max(...ms);
    const med = ms.slice().sort((a, b) => a - b)[Math.floor(ms.length / 2)];
    row[name] = { prim, nodes, dom, byTag, bytes, ms: ms.map(r2), msMin: r2(lo), msMed: r2(med), msMax: r2(hi), msSpreadPct: r1(((hi - lo) / med) * 100) };
  }
  row.ceiling = SIGNED[row.tier];
  row.delta = {
    primPct: pct(row.ALL.prim, row.BASE.prim),
    nodesPct: pct(row.ALL.nodes, row.BASE.nodes),
    domPct: pct(row.ALL.dom, row.BASE.dom),
    bytesPct: pct(row.ALL.bytes, row.BASE.bytes),
    msPct: pct(row.ALL.msMed, row.BASE.msMed),
  };
  row.ratios = {
    primPerNodeBase: r2(row.BASE.prim / row.BASE.nodes),
    primPerNodeAll: r2(row.ALL.prim / row.ALL.nodes),
    msPer1kPrimAll: r2((row.ALL.msMed / row.ALL.prim) * 1000),
    msPer100NodesAll: r2((row.ALL.msMed / row.ALL.nodes) * 100),
    domMinusNodesAll: row.ALL.dom - row.ALL.nodes,
    domMinusNodesBase: row.BASE.dom - row.BASE.nodes,
    ceilingHeadroomPrim: row.ceiling - row.ALL.prim,
  };
  rows.push(row);
}

/* ─────────────────────────── the table ─────────────────────────── */
process.stdout.write(`── THE RATCHET-UNIT REVIEW · ${rows.length} leaves × 2 arms × ${SAMPLES} samples (+1 discarded warm-up each)\n`);
process.stdout.write(`   worktree ${WT}\n\n`);
const cols = ['leaf', 'tier', 'ceil', 'primB', 'primA', 'prim%', 'nodeB', 'nodeA', 'node%', 'domB', 'domA', 'dom%', 'kBB', 'kBA', 'kB%', 'msB', 'msA', 'ms%', 'msSpr%', 'headroom'];
const vals = rows.map((r) => [
  r.leaf, r.tier, r.ceiling, r.BASE.prim, r.ALL.prim, r.delta.primPct,
  r.BASE.nodes, r.ALL.nodes, r.delta.nodesPct,
  r.BASE.dom, r.ALL.dom, r.delta.domPct,
  Math.round(r.BASE.bytes / 1024), Math.round(r.ALL.bytes / 1024), r.delta.bytesPct,
  r.BASE.msMed, r.ALL.msMed, r.delta.msPct, r.ALL.msSpreadPct,
  r.ratios.ceilingHeadroomPrim,
]);
const w = cols.map((c, i) => Math.max(String(c).length, ...vals.map((v) => String(v[i]).length)));
const line = (v) => v.map((x, i) => String(x).padStart(w[i])).join(' | ');
process.stdout.write(`${line(cols)}\n${w.map((n) => '-'.repeat(n)).join('-+-')}\n`);
for (const v of vals) process.stdout.write(`${line(v)}\n`);

/* ─────────────────────────── the per-tier maxima ─────────────────────────── */
const byTier = {};
for (const r of rows) {
  const t = (byTier[r.tier] = byTier[r.tier] || { ceiling: r.ceiling, prim: 0, nodes: 0, dom: 0, ms: 0, bytes: 0, primLeaf: '', nodeLeaf: '', domLeaf: '', msLeaf: '' });
  if (r.ALL.prim > t.prim) { t.prim = r.ALL.prim; t.primLeaf = r.leaf; }
  if (r.ALL.nodes > t.nodes) { t.nodes = r.ALL.nodes; t.nodeLeaf = r.leaf; }
  if (r.ALL.dom > t.dom) { t.dom = r.ALL.dom; t.domLeaf = r.leaf; }
  if (r.ALL.msMed > t.ms) { t.ms = r.ALL.msMed; t.msLeaf = r.leaf; }
  if (r.ALL.bytes > t.bytes) t.bytes = r.ALL.bytes;
}
process.stdout.write('\n── PER TIER, ALL WAVES ARMED — the worst leaf in each unit\n');
process.stdout.write(`   ${'tier'.padEnd(12)} ${'primCeil'.padStart(9)} ${'primMax'.padStart(8)} ${'nodeMax'.padStart(8)} ${'domMax'.padStart(7)} ${'msMax'.padStart(7)} ${'kBMax'.padStart(7)}   worst leaf (prim / dom / ms)\n`);
for (const t of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const v = byTier[t]; if (!v) continue;
  process.stdout.write(`   ${t.padEnd(12)} ${String(v.ceiling).padStart(9)} ${String(v.prim).padStart(8)} ${String(v.nodes).padStart(8)} ${String(v.dom).padStart(7)} ${String(v.ms).padStart(7)} ${String(Math.round(v.bytes / 1024)).padStart(7)}   ${v.primLeaf} / ${v.domLeaf} / ${v.msLeaf}\n`);
}

/* ─────────────────────────── the correlation the review turns on ─────────────────────────── */
const corr = (xs, ys) => {
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { const a = xs[i] - mx, b = ys[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
  return sxx && syy ? r2(sxy / Math.sqrt(sxx * syy)) : null;
};
const P = rows.map((r) => r.ALL.prim), N = rows.map((r) => r.ALL.dom), M = rows.map((r) => r.ALL.msMed), B = rows.map((r) => r.ALL.bytes);
const dP = rows.map((r) => r.delta.primPct), dN = rows.map((r) => r.delta.domPct), dM = rows.map((r) => r.delta.msPct);
process.stdout.write('\n── HOW WELL EACH UNIT PREDICTS THE OTHERS (Pearson r over the 18 leaves, ALL-WAVES arm)\n');
process.stdout.write(`   (nodes here = the TRUE dom census, not the renderer's elementCount)
   LEVELS   prim↔nodes ${corr(P, N)}   prim↔ms ${corr(P, M)}   nodes↔ms ${corr(N, M)}   nodes↔bytes ${corr(N, B)}   prim↔bytes ${corr(P, B)}\n`);
process.stdout.write(`   DELTAS   Δprim%↔Δnodes% ${corr(dP, dN)}   Δprim%↔Δms% ${corr(dP, dM)}   Δnodes%↔Δms% ${corr(dN, dM)}\n`);
process.stdout.write('   ⭐ THE LEVELS ALWAYS CORRELATE — a metropolis is bigger than a thorp in every unit. The\n');
process.stdout.write('     DELTA row is the one that decides the question: it asks whether a WAVE that spends\n');
process.stdout.write('     primitives spends the same share of the real cost, and that is what a ratchet rations.\n');

process.stdout.write(`\n── DETERMINISM OF THE COUNTED UNITS: ${determinismBreaks.length === 0 ? `ok     ${rows.length * ARMS.length * (SAMPLES - 1)} re-renders, every primitive/node/byte count identical to sample 1` : `⛔ ${determinismBreaks.length} BREAKS ${JSON.stringify(determinismBreaks)}`}\n`);

const json = arg('json', `${HERE}/out/regI1-ratchetunit.json`);
writeFileSync(json, JSON.stringify({
  lane: 'TE-REG-I1', worktree: WT, samples: SAMPLES,
  note: 'ONE warm-up render per (leaf, arm) is taken and DISCARDED before the samples; ms is the MEDIAN of the samples',
  signedCeilings: SIGNED, rows, perTier: byTier,
  correlations: { levels: { primNodes: corr(P, N), primMs: corr(P, M), nodesMs: corr(N, M), nodesBytes: corr(N, B), primBytes: corr(P, B) }, deltas: { primNodes: corr(dP, dN), primMs: corr(dP, dM), nodesMs: corr(dN, dM) } },
  determinismBreaks,
}, null, 2));
process.stdout.write(`\nREGI1_RATCHETUNIT rows=${rows.length} json=${json}\n`);
