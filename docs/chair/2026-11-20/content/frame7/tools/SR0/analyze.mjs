// SR0 analysis: reads the dump JSONL files of one pool and prints count lines.
// usage: node analyze.mjs <label> <file.jsonl>...
import fs from 'node:fs';
const [label, ...files] = process.argv.slice(2);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const places = files.flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)));
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const out = [];
const P = (...a) => out.push(a.join(' '));
const bySize = Object.fromEntries(SIZES.map((z) => [z, places.filter((p) => p.size === z)]));
P(`# ${label}: places ${places.length}, errors ${places.filter((p) => p.err).length}`);
// rows per place, flattened
const rowsOf = (p) => (p.crises || []).flatMap((c) => c.rows.map((r) => ({ ...r, kind: c.kind, levers: c.levers, rank: c.rank, nature: c.nature })));
// 1. commonest text per size, its place share; top five
for (const z of SIZES) {
  const ps = bySize[z]; const n = ps.length;
  const withCrisis = ps.filter((p) => (p.crises || []).length).length;
  const rows = ps.flatMap(rowsOf);
  const placeHas = {}; const rowN = {};
  for (const p of ps) { const seen = new Set(rowsOf(p).map((r) => r.reason)); for (const t of seen) placeHas[t] = (placeHas[t] || 0) + 1; }
  for (const r of rows) rowN[r.key] = (rowN[r.key] || 0) + 1;
  const top = Object.entries(placeHas).sort((a, b) => b[1] - a[1]).slice(0, 5);
  P(`SIZE ${z}: places ${n}, with crisis ${withCrisis}, crises ${ps.reduce((a, p) => a + (p.crises || []).length, 0)}, stake rows ${rows.length}`);
  top.forEach(([t, c], i) => P(`  TOP${i + 1} ${z} ${c}/${n} = ${pct(c, n)}% places · "${t}"`));
  P(`  ROWS-BY-KEY ${z}: ${Object.entries(rowN).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c} (${pct(c, rows.length)}%)`).join(', ')}`);
}
// totals by key over the pool
const all = places.flatMap(rowsOf);
const tot = {}; for (const r of all) tot[r.key] = (tot[r.key] || 0) + 1;
P(`ROWS-TOTAL ${all.length}: ${Object.entries(tot).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c} (${pct(c, all.length)}%)`).join(', ')}`);
// 2. facts per commonest key
const FACTS = {
  kind: (r) => r.kind,
  matched: (r) => r.matched || 'none',
  arch: (r) => r.arch,
  isGov: (r) => (r.isGov ? 'gov' : 'not'),
  plural: (r) => (r.plural ? 'pl' : 'sg'),
  house1: (r) => (r.houses[0] || '|none|').split('|')[1] || (r.houses[0] || 'none').split('|')[0],
  houseCat: (r) => (r.houses[0] || '||none').split('|')[2] || 'none',
  lever1: (r) => r.levers[0] || 'none',
  'kind+matched': (r) => `${r.kind}/${r.matched || 'none'}`,
  'kind+arch': (r) => `${r.kind}/${r.arch}`,
  'kind+arch+gov': (r) => `${r.kind}/${r.arch}/${r.isGov ? 'gov' : 'not'}`,
  'matched+arch+gov': (r) => `${r.matched || 'none'}/${r.arch}/${r.isGov ? 'gov' : 'not'}`,
  'kind+arch+house1': (r) => `${r.kind}/${r.arch}/${(r.houses[0] || '|none').split('|')[1]}`,
  'kind+matched+arch+gov+plural+house1': (r) => `${r.kind}/${r.matched}/${r.arch}/${r.isGov}/${r.plural}/${(r.houses[0] || '|none').split('|')[1]}`,
};
const KEYS = ['loses', 'split', 'untouched', 'losesSeat', 'gainsChurch', 'gainsCrime', 'gainsRival', 'gainsClaim'];
for (const key of KEYS) {
  const keyRows = all.filter((r) => r.key === key);
  if (!keyRows.length) continue;
  P(`KEY ${key}: rows ${keyRows.length}`);
  for (const [fname, fx] of Object.entries(FACTS)) {
    const cells = [];
    for (const z of SIZES) {
      const ps = bySize[z]; const n = ps.length;
      const vals = {}; const tuples = new Set();
      for (const p of ps) { const seen = new Set(rowsOf(p).filter((r) => r.key === key).map(fx)); for (const v of seen) { vals[v] = (vals[v] || 0) + 1; tuples.add(v); } }
      const best = Object.entries(vals).sort((a, b) => b[1] - a[1])[0];
      cells.push(`${z} ${tuples.size}d max ${best ? pct(best[1], n) : 0}%${best ? ` (${String(best[0]).slice(0, 40)})` : ''}`);
    }
    P(`  FACT ${key} ${fname}: ${cells.join(' | ')}`);
  }
}
// the loses rows' matched system distribution, pool-wide
const lm = {}; for (const r of all.filter((r) => r.key === 'loses')) { const m = r.matched || 'none'; lm[m] = (lm[m] || 0) + 1; }
P(`LOSES-MATCHED: ${Object.entries(lm).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(', ')}`);
// 6a creditorAgent
const ca = all.filter((r) => r.key === 'creditorAgent');
P(`CREDITOR-AGENT rows ${ca.length}, places ${new Set(places.filter((p) => rowsOf(p).some((r) => r.key === 'creditorAgent')).map((p) => p.seed)).size}, by size ${SIZES.map((z) => `${z} ${bySize[z].flatMap(rowsOf).filter((r) => r.key === 'creditorAgent').length}`).join(', ')}`);
// 6c plural + its/it
const pl = all.filter((r) => r.plural && /\bits?\b/i.test(r.reason));
const plShown = pl.filter((r) => r.key !== 'untouched');
const plIts = pl.filter((r) => /\bits\b/i.test(r.reason));
const plItsShown = plIts.filter((r) => r.key !== 'untouched');
const byK = {}; for (const r of plShown) byK[r.key] = (byK[r.key] || 0) + 1;
P(`PLURAL-IT rows (it|its) ${pl.length}, printed (not untouched) ${plShown.length}; "its" only ${plIts.length}, printed ${plItsShown.length}; printed by key: ${Object.entries(byK).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(', ')}`);
P(`UNKNOWN-TEXT rows ${all.filter((r) => r.key === '?').length}`);
console.log(out.join('\n'));
