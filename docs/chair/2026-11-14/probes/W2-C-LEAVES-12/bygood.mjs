import fs from 'node:fs';
const rd = (f) => Object.fromEntries(fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const [a, b] = [rd(process.argv[2]), rd(process.argv[3])];
const g = {}; // good -> {n, chains:Set, houses: {house: n}}
for (const s of Object.keys(a)) { const A = a[s], B = b[s];
  const roster = A.roster.map((x) => x.toLowerCase());
  A.cards.forEach((c, i) => { const bo = new Set(B.cards[i]?.outs || []);
    for (const o of c.outs) if (!bo.has(o)) { const e = (g[o] ||= { n: 0, chains: {}, houses: {} }); e.n++; e.chains[c.label] = (e.chains[c.label] || 0) + 1;
      const heads = (c.houses || []).map((h) => String(h).toLowerCase().split(/[\s(]/)[0]);
      for (const r of roster) if (!r.startsWith('access to') && heads.some((h) => r.includes(h))) e.houses[r.replace(/\s*\(.*$/, '')] = (e.houses[r.replace(/\s*\(.*$/, '')] || 0) + 1; } });
  for (const side of ['exports', 'local']) { const bs = new Set(B[side]); for (const x of A[side]) if (!bs.has(x)) { const e = (g[x] ||= { n: 0, chains: {}, houses: {} }); e[side] = (e[side] || 0) + 1; } }
}
for (const [k, e] of Object.entries(g).sort((x, y) => (y[1].n + (y[1].exports||0)) - (x[1].n + (x[1].exports||0))))
  console.log(`${k} | card ${e.n} ex ${e.exports || 0} loc ${e.local || 0} | ${Object.keys(e.chains).join('/')} | ${Object.entries(e.houses).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([h, n]) => h + ':' + n).join(', ')}`);
