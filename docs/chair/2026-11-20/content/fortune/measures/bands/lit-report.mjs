// usage: node lit-report.mjs A.jsonl B.jsonl C.jsonl  -> markdown tables on stdout
import { readFileSync } from 'node:fs';
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const BANDS = ['Endorsed', 'Approved', 'Tolerated', 'Contested', 'Legitimacy Crisis'];
const load = (p) => readFileSync(p, 'utf8').trim().split('\n').slice(1).map((l) => JSON.parse(l));
const pct = (n, d) => (d ? `${Math.round((1000 * n) / d) / 10}%` : '-');
const table = (rows, title) => {
  const o = [`**${title}**`, '', `| size | n | ${BANDS.join(' | ')} |`, `|---|---|${BANDS.map(() => '---').join('|')}|`];
  for (const s of SIZES) {
    const r = rows.filter((x) => x.size === s);
    o.push(`| ${s} | ${r.length} | ${BANDS.map((b) => { const n = r.filter((x) => x.label === b).length; return `${n} (${pct(n, r.length)})`; }).join(' | ')} |`);
  }
  return o.join('\n');
};
const states = process.argv.slice(2).map((p) => ({ p, meta: JSON.parse(readFileSync(p, 'utf8').split('\n')[0]).meta, rows: load(p) }));
for (const st of states) {
  const errs = st.rows.filter((r) => r.error).length;
  console.log(`## State ${st.meta.state} (force ${JSON.stringify(st.meta.force)}; ${st.rows.length} births, ${errs} errors)\n`);
  console.log(table(st.rows, 'All places (of 150)') + '\n');
  console.log(table(st.rows.filter((r) => r.calm), 'Calm places only (`!t.stress`)') + '\n');
}
if (states.length >= 2) {
  const by = (st) => new Map(st.rows.map((r) => [r.seed, r]));
  const [a, b, c] = states.map(by);
  const diff = (x, y, f) => [...x.keys()].filter((k) => f(x.get(k), y.get(k))).length;
  console.log('## Differences by place\n');
  for (const [n1, m1, n2, m2] of [['A', a, 'B', b], ['B', b, 'C', c], ['A', a, 'C', c]].filter((q) => q[1] && q[3])) {
    console.log(`- ${n1} vs ${n2}: label ${diff(m1, m2, (x, y) => x.label !== y.label)}, score ${diff(m1, m2, (x, y) => x.score !== y.score)}, calm ${diff(m1, m2, (x, y) => x.calm !== y.calm)}`);
  }
  if (b && c) {
    const merited = [...c.values()].filter((r) => (r.merits ?? 0) > 0);
    const base = diff(b, c, (x, y) => x.score !== (y.score - (y.merits ?? 0)));
    console.log(`- C places with merits > 0: ${merited.length}; base score (C score − merits) differs from B on ${base}`);
    const up = (to) => [...c.keys()].filter((k) => c.get(k).label === to && b.get(k).label !== to).length;
    console.log(`- newly Endorsed C vs B: ${up('Endorsed')}; newly Approved: ${up('Approved')}`);
  }
}
