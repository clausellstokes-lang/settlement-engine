import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const steps = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
const D = steps.map((f) => [f.replace('.json', ''), JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'))]);
const keys = Object.keys(D[0][1]); const fams = new Set();
for (const [, d] of D) for (const k of keys) for (const f in d[k]) fams.add(f);
const first = D[0][1], last = D[D.length - 1][1];
console.log('rows', keys.length);
for (let i = 1; i < D.length; i++) {
  const [p, d] = D[i]; const [pp, dp] = D[i - 1]; const moved = {}; let full = 0;
  for (const k of keys) { if (d[k].full !== dp[k].full) full++; for (const f of fams) if (f !== 'full' && d[k][f] !== dp[k][f]) moved[f] = (moved[f] || 0) + 1; }
  const mm = keys.filter((k) => d[k].full === first[k].full).length;
  console.log(`${pp}->${p}: rows moved ${full}; still=record ${mm}; ` + Object.entries(moved).sort((a, b) => b[1] - a[1]).map(([f, n]) => `${f} ${n}`).join(', '));
}
