// INCOME-MEASURE-1: a candidate against the tip, by record. Usage: node compare.mjs <tipDir> <candDir> <fielddiff.json> <read15.json>
// Prints: towns whose income table changes; shares moved (rows kept under the same title); everything else moved, by
// family (from fielddiff.mjs's per-seed families, economicState.incomeSources excluded), for the 972 and the census's 720.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [T, C, FD, PICK] = process.argv.slice(2);
const L = (d, s) => JSON.parse(zlib.gunzipSync(fs.readFileSync(`${d}/${s}.json.gz`)));
const fd = JSON.parse(fs.readFileSync(FD, 'utf8'));
const seeds = Object.keys(fd.perSeed).sort();
const is720 = (s) => /^r2[rs]-/.test(s);
const tab = (s) => (s.economicState.incomeSources || []).map((e) => `${e.source}|${e.percentage}|${e.desc}`).join('\n');
let changed = [0, 0], rowsGone = 0, rowsRetitled = 0, deltas = [], maxD = { d: 0 }, rowsAdded = {};
const moved = {}; const named = {};
const NAMED = ['economicState.prosperity', 'economicState.prosperityStanding', 'economicState.economicComplexity', 'economicState.situationDesc', 'economicState.foodSecurity', 'powerStructure', 'npcs', 'history', 'conflicts', 'relationships', 'defenseProfile', 'arrivalScene', 'economicViability', 'resourceAnalysis', 'stress', 'culturalIdentity', 'spatialLayout', 'institutions', 'coherenceNotes', 'generationCoherenceReceipt', 'simulationTrace'];
for (const s of seeds) {
  const a = L(T, s), b = L(C, s);
  if (tab(a) !== tab(b)) { changed[0]++; if (is720(s)) changed[1]++; }
  const A = new Map(a.economicState.incomeSources.map((e) => [e.source, e])); const B = new Map(b.economicState.incomeSources.map((e) => [e.source, e]));
  for (const [k, e] of A) if (!B.has(k)) { if (b.economicState.incomeSources.length === a.economicState.incomeSources.length) rowsRetitled++; else rowsGone++; }
  for (const [k] of B) if (!A.has(k)) rowsAdded[k] = (rowsAdded[k] || 0) + 1;
  for (const [k, e] of B) if (A.has(k)) { const d = e.percentage - A.get(k).percentage; if (d) { deltas.push(Math.abs(d)); if (Math.abs(d) > maxD.d) maxD = { d: Math.abs(d), s, k, from: A.get(k).percentage, to: e.percentage }; } }
  for (const f of fd.perSeed[s]) {
    if (f.startsWith('economicState.incomeSources')) continue;
    const top = f.split(/[.[]/)[0]; const key = top === 'economicState' ? f.split('.').slice(0, 2).join('.').replace(/\[\]$/, '') : top;
    (moved[key] ||= new Set()).add(s);
    for (const n of NAMED) if (f === n || f.startsWith(n + '.') || f.startsWith(n + '[')) (named[n] ||= new Set()).add(s);
  }
}
const n720 = (set) => [...set].filter(is720).length;
console.log(`towns whose income table changes: ${changed[0]} of ${seeds.length} (720: ${changed[1]})`);
console.log(`rows removed ${rowsGone}; rows retitled ${rowsRetitled}; rows added ${JSON.stringify(rowsAdded)}`);
console.log(`shares moved on kept rows: ${deltas.length} rows; mean ${(deltas.reduce((x, y) => x + y, 0) / (deltas.length || 1)).toFixed(2)} points; largest ${maxD.d} (${maxD.s} ${maxD.k} ${maxD.from}->${maxD.to})`);
const anyElse = new Set(); for (const v of Object.values(moved)) v.forEach((x) => anyElse.add(x));
console.log(`towns where anything beyond the income table moves: ${anyElse.size} (720: ${n720(anyElse)})`);
console.log('by family (972 / 720): ' + Object.entries(moved).sort((x, y) => y[1].size - x[1].size).map(([k, v]) => `${k} ${v.size}/${n720(v)}`).join(' · '));
console.log('named fields (972 / 720): ' + NAMED.filter((n) => named[n]).map((n) => `${n} ${named[n].size}/${n720(named[n])}`).join(' · '));
// prosperity band moves, by direction
const ORDER = ['Destitute', 'Struggling', 'Poor', 'Modest', 'Comfortable', 'Prosperous', 'Wealthy'];
const pm = {}; for (const s of named['economicState.prosperity'] || []) { const k = `${L(T, s).economicState.prosperity} -> ${L(C, s).economicState.prosperity}`; pm[k] = (pm[k] || 0) + 1; }
console.log('prosperity moves: ' + JSON.stringify(pm));
const cm = {}; for (const s of named['economicState.economicComplexity'] || []) { const k = `${L(T, s).economicState.economicComplexity} -> ${L(C, s).economicState.economicComplexity}`.replace(/ —[^>]*->/, ' ->').replace(/ —.*$/, ''); cm[k] = (cm[k] || 0) + 1; }
console.log('complexity moves: ' + JSON.stringify(cm));
if (PICK) for (const r of JSON.parse(fs.readFileSync(PICK, 'utf8'))) {
  const b = L(C, r.seed).economicState.incomeSources; const e = b.find((x) => x.source === r.source);
  const re = b.filter((x) => !L(T, r.seed).economicState.incomeSources.some((y) => y.source === x.source));
  console.log(`  read ${r.seed} ${r.source} ${r.pct}% -> ${e ? `${e.percentage}% "${e.desc}"` : re.length ? `retitled ${re.map((x) => `${x.source} ${x.percentage}%`).join(',')}` : 'row gone'} · rows ${b.length}`);
}
