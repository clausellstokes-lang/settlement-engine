/**
 * M2 — which steps draw, over the golden corpus.
 *
 * Per step: in how many rows it draws, and the min/median/max draw count.
 * BOTH instruments run on every row — the fork-proxy (§21's specified instrument) and the
 * mint census (which also sees a stream minted from a COPIED seed) — and every row where
 * they disagree is reported by name.
 *
 * usage: node --import ./hook.mjs m2-which-steps-draw.mjs [stride]
 */
import { writeFileSync } from 'node:fs';

import { instrumentedRoot, runHeadless, getStepOrder, TREE } from './instrument.mjs';

const { goldenCorpus, keyOf } = await import(`${TREE}/tests/helpers/goldenMasterCorpus.js`);
const census = globalThis.__PRNG_CENSUS__;
const order = getStepOrder();
const stride = Number(process.argv[2] || 1);
const rows = goldenCorpus().filter((_, i) => i % stride === 0);

function attribute(rootSeed, mints) {
  const byStep = new Map(order.map(n => [n, { calls: 0, mints: 0, seeds: new Set() }]));
  const foreign = [];
  for (const m of mints) {
    if (m.seed === rootSeed) continue;
    if (!m.seed.startsWith(`${rootSeed}::`)) { foreign.push(m); continue; }
    const step = m.seed.slice(rootSeed.length + 2).split('::')[0];
    const b = byStep.get(step);
    if (!b) { foreign.push(m); continue; }
    b.calls += m.calls; b.mints += 1; b.seeds.add(m.seed);
  }
  return { byStep, foreign };
}

const stats = new Map(order.map(n => [n, {
  rowsDrawn: 0, counts: [], subforkLabels: new Set(), maxDepth: 0, disagreeRows: [],
}]));
const foreignSeeds = new Map();
const t0 = Date.now();
for (const row of rows) {
  census.reset();
  const inst = instrumentedRoot(row._seed);
  runHeadless(row, inst.root);
  const attr = attribute(row._seed, census.all());
  for (const name of order) {
    const s = stats.get(name);
    const proxy = inst.perStep.get(name);
    const cen = attr.byStep.get(name).calls;
    if (proxy.draws !== cen) s.disagreeRows.push(`${keyOf(row)} proxy=${proxy.draws} census=${cen}`);
    s.counts.push(cen);
    if (cen > 0) s.rowsDrawn += 1;
    for (const l of proxy.forkLabels) s.subforkLabels.add(l);
    if (proxy.maxDepth > s.maxDepth) s.maxDepth = proxy.maxDepth;
  }
  for (const f of attr.foreign) {
    foreignSeeds.set(f.seed, (foreignSeeds.get(f.seed) || 0) + f.calls);
  }
}
const elapsed = Date.now() - t0;

const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
console.log(`ROWS=${rows.length} (stride=${stride}) wall=${elapsed} ms  per-row=${(elapsed / rows.length).toFixed(1)} ms`);
console.log('\nstep\trowsDrawn/rows\tmin\tmedian\tmax\tsubforkLabels\tmaxDepth');
const out = [];
for (const name of order) {
  const s = stats.get(name);
  const line = `${name}\t${s.rowsDrawn}/${rows.length}\t${Math.min(...s.counts)}\t${med(s.counts)}\t${Math.max(...s.counts)}\t${[...s.subforkLabels].join('|') || '-'}\t${s.maxDepth}`;
  console.log(line);
  out.push({ step: name, rowsDrawn: s.rowsDrawn, rows: rows.length, min: Math.min(...s.counts), median: med(s.counts), max: Math.max(...s.counts), labels: [...s.subforkLabels] });
}
console.log('\n=== instrument disagreements (proxy vs census) ===');
let dis = 0;
for (const name of order) { const s = stats.get(name); if (s.disagreeRows.length) { dis += s.disagreeRows.length; console.log(`${name}: ${s.disagreeRows.length} rows; first=${s.disagreeRows[0]}`); } }
if (!dis) console.log('NONE — the two instruments agree on every step of every row.');
console.log('\n=== foreign-prefix mints during generation ===');
if (!foreignSeeds.size) console.log('NONE');
for (const [seed, calls] of foreignSeeds) console.log(`  "${seed}" calls=${calls}`);

writeFileSync(new URL('./m2-result.json', import.meta.url), JSON.stringify({ stride, rows: rows.length, elapsed, out }, null, 2));
