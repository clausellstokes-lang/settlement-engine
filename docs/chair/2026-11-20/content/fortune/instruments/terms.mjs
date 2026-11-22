// FORTUNE-1 instrument: the fortune sum's terms by size, from a trace run of measure.mjs.
//   node terms.mjs <trace.jsonl>
import { readFileSync } from 'node:fs';
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
const T = ['routeBase', 'tierBonus', 'eco', 'magic', 'threat', 'mil', 'defPrem', 'depth', 'diversity'];
console.log('THE FORTUNE SUM BY SIZE (the printed call; mean of each term; raw = the sum before rounding, the cap, food and the floor)');
console.log(['size'.padEnd(10), ...T.map((t) => t.padStart(9)), 'raw'.padStart(6), 'baseIdx'.padStart(8)].join(''));
for (const s of SIZES) {
  const g = rows.filter((r) => r.size === s && r.printed).map((r) => r.printed);
  console.log([s.padEnd(10), ...T.map((t) => mean(g.map((x) => x[t])).toFixed(2).padStart(9)), mean(g.map((x) => x.raw)).toFixed(2).padStart(6), mean(g.map((x) => x.baseIdx)).toFixed(2).padStart(8)].join(''));
}
const v = (s, t) => mean(rows.filter((r) => r.size === s && r.printed).map((r) => r.printed[t]));
for (const [a, b] of [['village', 'city'], ['village', 'metropolis'], ['hamlet', 'town']]) {
  const gap = mean(rows.filter((r) => r.size === b).map((r) => r.printed.raw)) - mean(rows.filter((r) => r.size === a).map((r) => r.printed.raw));
  console.log(`\nTHE GAP ${a} -> ${b} in the raw sum: ${gap.toFixed(2)}; each term's share of it: ` + T.map((t) => `${t} ${(100 * (v(b, t) - v(a, t)) / gap).toFixed(0)}%`).join(' · '));
}
console.log('\nTHE COUNTS THE SIZE-RELATIVE TERMS READ (printed call): economy+crafts institutions; income sources');
for (const s of SIZES) {
  const g = rows.filter((r) => r.size === s && r.printed).map((r) => r.printed);
  const e = g.map((x) => x.econInst), n = g.map((x) => x.incomeCount);
  console.log(`${s.padEnd(10)} econInst p10 ${q(e, 0.1)} p25 ${q(e, 0.25)} median ${q(e, 0.5)} p75 ${q(e, 0.75)} p90 ${q(e, 0.9)} (mean ${mean(e).toFixed(1)}) | income p25 ${q(n, 0.25)} median ${q(n, 0.5)} p75 ${q(n, 0.75)} | depth +1 ${g.filter((x) => x.depth === 1).length} 0 ${g.filter((x) => x.depth === 0).length} -1 ${g.filter((x) => x.depth === -1).length} | diversity>0 ${g.filter((x) => x.diversity > 0).length}`);
}
console.log('\nROUTES, THREAT AND FOOD MODIFIERS BY SIZE (counts)');
const tal = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]).map(([k, c]) => `${k} ${c}`).join(' · '); };
for (const s of SIZES) {
  const g = rows.filter((r) => r.size === s);
  console.log(`${s.padEnd(10)} route: ${tal(g.map((r) => r.route))} | threat: ${tal(g.map((r) => r.printed.threat))} | food mod: ${tal(g.map((r) => r.printed.food ?? 'none'))}`);
}
