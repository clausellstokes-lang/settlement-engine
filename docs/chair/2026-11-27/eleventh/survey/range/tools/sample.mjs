// RANGE-MEASURE (A): a seeded shuffle of keys weighted by how often they print (Efraimidis-Spirakis: key u^(1/w)).
// node sample.mjs <classified.json> <n> <seed> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
const [IN, N, SEED, OUT] = process.argv.slice(2);
const rows = JSON.parse(readFileSync(IN, 'utf8')).filter((r) => !r.chrome && !r.listLike && !r.noChoice);
let s = 0; for (const c of SEED) s = (s * 31 + c.charCodeAt(0)) >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const keyed = rows.map((r) => ({ r, k: rnd() ** (1 / Math.max(1, r.printsC + r.printsV)) })).sort((a, b) => b.k - a.k).slice(0, Number(N)).map((x) => x.r);
writeFileSync(OUT, JSON.stringify(keyed.map((r) => ({ ki: r.ki, key: r.key }))));
keyed.forEach((r, i) => {
  console.log(`#${i + 1} [${r.ki}] ${r.key.replace(/^src\//, '').slice(0, 150)}  n=${r.n} prints=${r.printsC + r.printsV} seen=${r.distinctSeen} J=${r.meanJ.toFixed(2)} O=${r.meanO.toFixed(2)} script=${r.cls}`);
  r.lines.slice(0, 6).forEach((l, j) => console.log(`   ${j}${l.p ? '*' : ' '} ${l.t.replace(/\s+/g, ' ').slice(0, 150)}${Object.keys(l.dv || {}).length ? `  {${Object.entries(l.dv).map(([k, v]) => `${k}:${v.join(',')}`).join('; ').slice(0, 60)}}` : ''}`));
  if (r.lines.length > 6) console.log(`   … ${r.lines.length - 6} more`);
});
