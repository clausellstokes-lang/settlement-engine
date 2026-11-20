// GOALS-3 builder 9 (scratch measure, docs only): A BILL VERIFIED BY BIRTH. Compares a baseline birth file of wants-born.mjs
// with one born with placeholder lines appended (its `append`), on the same towns:
//   - the chair's cross-town share (all 2,450 ordered pairs a size, masked text, as wants-by-pool.mjs (A)) per vantage, city
//     and metropolis (and town), before and after;
//   - THE MOVES: every holding (card, vantage) whose text differs, over all the towns of the file (the 300 measure towns),
//     split into holdings now on a placeholder (a new line drawn), holdings of an appended cell moved to another of its lines,
//     and holdings of other cells moved (the cascade: held texts and pass two's rotation), per appended cell where the
//     holding's cell (before) is one;
//   - the in-town gate on the after file: identical goal sentences inside one town (k-1 per sentence held k times), short and
//     long pooled, as goals-final.mjs counts `identical`.
// Usage: node wants-verify.mjs <base.json> <after.json>
import fs from 'node:fs';
const [, , A0, A1] = process.argv;
const B = JSON.parse(fs.readFileSync(A0, 'utf8')), X = JSON.parse(fs.readFileSync(A1, 'utf8'));
const pct = (x) => (100 * x).toFixed(1) + '%';
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const app = X.append || {};
console.log(`base ${A0} · after ${A1} · append ${Object.values(app).reduce((a, b) => a + b, 0)} lines in ${Object.keys(app).length} cells: ${JSON.stringify(app)}`);
const share = (towns, v) => { const sets = towns.map((t) => new Set(t.npcs.map((n) => n[v]?.masked).filter(Boolean))); const sh = [];
  for (let a = 0; a < towns.length; a++) for (let b = 0; b < towns.length; b++) if (a !== b) { const L = towns[b].npcs.map((n) => n[v]?.masked).filter(Boolean); if (L.length) sh.push(L.filter((x) => sets[a].has(x)).length / L.length); }
  return mean(sh); };
console.log('\nsize        vantage  before   after   (placeholders held a town, after)');
for (const s of ['town', 'city', 'metropolis']) for (const v of ['short', 'long']) {
  const tb = B.towns.filter((t) => t.tier === s), tx = X.towns.filter((t) => t.tier === s);
  const ph = mean(tx.map((t) => t.npcs.filter((n) => /^Placeholder want/.test(n[v]?.text || '')).length));
  console.log(`${s.padEnd(11)} ${v.padEnd(7)}  ${pct(share(tb, v)).padStart(6)}  ${pct(share(tx, v)).padStart(6)}   ${ph.toFixed(2)}`); }
// moves
const cellKey = (h, v) => `${h.f}/${h.k}/${v}`;
const per = new Map(); let tot = 0, toPh = 0, inCell = 0, cascade = 0, towns = 0, townsMoved = 0;
for (let i = 0; i < B.towns.length; i++) { const tb = B.towns[i], tx = X.towns[i]; if (tb.seed !== tx.seed) throw new Error('town order differs'); towns++; let moved = 0;
  const xi = new Map(tx.npcs.map((n) => [String(n.id), n]));
  for (const n of tb.npcs) for (const v of ['short', 'long']) { const h = n[v]; const y = xi.get(String(n.id))?.[v]; if (!h || !y || h.text === y.text) continue;
    tot++; moved++; const c = cellKey(h, v); const r = per.get(c) || { ph: 0, cell: 0, other: 0 }; per.set(c, r);
    if (/^Placeholder want/.test(y.text)) { toPh++; r.ph++; } else if (app[c]) { inCell++; r.cell++; } else { cascade++; r.other++; } }
  if (moved) townsMoved++; }
console.log(`\nTHE MOVES over ${towns} towns: ${tot} holdings changed text (${townsMoved} towns touched): onto a placeholder ${toPh} · within an appended cell, to another of its lines ${inCell} · holdings of cells not appended (the cascade) ${cascade}`);
console.log('by the holding\'s cell before (appended cells marked *): onto placeholder · within cell · cascade');
for (const [c, r] of [...per].sort((a, b) => (b[1].ph + b[1].cell + b[1].other) - (a[1].ph + a[1].cell + a[1].other)).slice(0, 25)) console.log(`  ${(app[c] ? '*' : ' ') + c}`.padEnd(46) + `${r.ph} · ${r.cell} · ${r.other}`);
// the in-town gate
let ident = 0; for (const t of X.towns) { const m = new Map(); for (const n of t.npcs) for (const v of ['short', 'long']) { const x = n[v]?.text; if (x) m.set(x, (m.get(x) || 0) + 1); } for (const k of m.values()) ident += k - 1; }
console.log(`\nidentical goal sentences inside one town, after: ${ident} (over ${X.towns.length} towns)`);
