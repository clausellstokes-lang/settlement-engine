const [, , file, topK = '8', only = ''] = process.argv;
const rows = JSON.parse((await import('node:fs')).readFileSync(file, 'utf8'));
const N = rows.length; const pct = (a, b) => (100 * a / b).toFixed(0) + '%';
const all = new Map(); for (const r of rows) for (const f of r.F) all.set(f, (all.get(f) || 0) + 1);
const kinds = new Map(); for (const r of rows) for (const k of new Set(r.tensions.map((x) => x.type))) kinds.set(k, (kinds.get(k) || 0) + 1);
const order = [...kinds].sort((a, b) => b[1] - a[1]);
console.log('kinds by towns: ' + order.map(([k, c]) => `${k} ${c}`).join(' · '));
for (const [k, n] of order.slice(0, +topK)) { if (only && !only.split(',').includes(k)) continue;
  const g = rows.filter((r) => r.tensions.some((x) => x.type === k)); const c = new Map(); for (const r of g) for (const f of r.F) c.set(f, (c.get(f) || 0) + 1);
  const bySize = {}; for (const r of g) bySize[r.tier] = (bySize[r.tier] || 0) + 1;
  const texts = new Map(); for (const r of g) for (const x of r.tensions) if (x.type === k) texts.set(x.d, (texts.get(x.d) || 0) + 1);
  console.log(`\n== ${k}: ${n} towns (${Object.entries(bySize).map(([a, b]) => a + ' ' + b).join(', ')}); ${texts.size} texts, top ${Math.max(...texts.values())}`);
  const cand = [...c].map(([f, m]) => ({ f, m, rate: m / n, base: (all.get(f)) / N })).filter((x) => x.rate >= 0.08 && x.rate <= 0.75 && x.rate / x.base >= 1.25).sort((a, b) => b.rate / b.base - a.rate / a.base).slice(0, 40);
  console.log(cand.map((x) => `${x.f} ${pct(x.m, n)} (all ${pct(x.base * N, N)})`).join(' | '));
}
