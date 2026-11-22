// V33-JOINPROBE PASS 2: the pools' SIGNATURES per seed, dark pool against lit pool (each birth's served criminal surface, every setting).
//   node pool-sigs.mjs <dark pooldir> <lit pooldir>
import { readFileSync, readdirSync } from 'node:fs';
const [A, B] = process.argv.slice(2);
const load = (dir, re) => readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
for (const [part, re] of [['A', /^pool-shard\d+\.json$/], ['B', /^poolb-shard\d+\.json$/]]) {
  const per = (dir) => { const m = new Map(); for (const s of load(dir, re)) for (const b of s.births) m.set(b.seed, { size: b.size, sig: Object.fromEntries(Object.entries(b.sigs).map(([k, i]) => [k, s.sigs[i]])), pc: b.pc, inc: b.incSum }); return m; };
  const a = per(A); const b = per(B);
  const distinct = (dir) => load(dir, re).map((s) => s.sigs.length).join('/');
  const by = {};
  for (const [seed, x] of a) { const y = b.get(seed); if (!y) continue; const k = x.size; by[k] = by[k] || { n: 0, moved: 0, settings: {} };
    by[k].n += 1; const mv = Object.keys(x.sig).filter((s) => x.sig[s] !== y.sig[s]); if (mv.length || JSON.stringify(x.pc) !== JSON.stringify(y.pc)) by[k].moved += 1; for (const s of mv) by[k].settings[s] = (by[k].settings[s] || 0) + 1; }
  console.log(`PART ${part}: distinct signatures per shard dark ${distinct(A)} lit ${distinct(B)}`);
  for (const [k, v] of Object.entries(by)) console.log(`  ${k.padEnd(10)} seeds ${v.n}: signature (or criminal-power count) moved on ${v.moved}${v.moved ? ` (by setting: ${JSON.stringify(v.settings)})` : ''}`);
}
