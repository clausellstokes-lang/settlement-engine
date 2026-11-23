// V43-PAGES, THE CHAIR'S N109: VR31 per birth.   node vr31-an.mjs <extra outdir> [full rows=/var/tmp/v18/out/v43/pages/full/rows]
// (1) the stored roster holds a power the public projection (toPublicSafe, Reveal off) withholds, with its share; (2) P0's
// shares sum short of 100 by that share; (3) P1's sum to 100; (4) each P1 share = P0's by largest remainder (galleryRosterChoices.js
// :: largestRemainder, RESTATED below: floor of each quota, the rest by largest remainder, ties by order). The moved-share
// births are those whose (F) Power tab moved a share tile. EXIT 1: a moved share where the projection withholds no power.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
const [O, FULL = '/var/tmp/v18/out/v43/pages/full/rows'] = process.argv.slice(2);
const J = (v) => JSON.stringify(v);
const load = (d, re) => (existsSync(d) ? readdirSync(d).filter((f) => re.test(f)).map((f) => JSON.parse(readFileSync(`${d}/${f}`, 'utf8'))) : []);
const V = load(`${O}/v/rows`, /^V-/); const D = load(`${O}/d/rows`, /^D-/); const VW = load(`${O}/views/rows`, /^F-/); const F = load(FULL, /^F-/);
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const sum = (r) => Math.round(r.reduce((a, f) => a + (num(f.power) ?? 0), 0) * 1e6) / 1e6;
const LR = (list) => { // the restatement
  let basis = list.map((f) => (num(f.power) !== null && f.power >= 0 ? f.power : 0)); let total = basis.reduce((a, b) => a + b, 0);
  if (!(total > 0)) { basis = basis.map(() => 1); total = basis.length; }
  const q = basis.map((b) => (b / total) * 100); const sh = q.map((v) => Math.floor(v)); let give = 100 - sh.reduce((a, v) => a + v, 0);
  const order = q.map((_v, i) => i).sort((a, b) => ((q[b] - sh[b]) - (q[a] - sh[a])) || (a - b));
  for (const i of order) { if (give <= 0) break; sh[i] += 1; give -= 1; }
  return list.map((f, i) => ({ ...f, power: sh[i] }));
};
const isTile = (l) => /^(.*?)(\d+)([▲▼]?)$/.test(l);
const moved = new Map(); // seed -> Power-tab share lines that moved
for (const r of F.filter((x) => x.diff)) for (const [t, d] of Object.entries(r.diff)) if (/\/Power$/.test(t)) {
  const ls = [...d.lost.filter(isTile).map((l) => `LOST ${l}`), ...d.gained.filter(isTile).map((l) => `GAINED ${l}`), ...d.changed.filter(([a, b]) => isTile(a) && isTile(b)).map(([a, b]) => `CHANGED ${a} => ${b}`)];
  if (ls.length) moved.set(r.seed, ls);
}
const byV = new Map(V.filter((v) => !v.error).map((v) => [v.seed, v]));
const errs = V.filter((v) => v.error).length;
let stop = 0; const classRows = [];
for (const [seed, ls] of moved) {
  const v = byV.get(seed); if (!v) { classRows.push(`  ${seed}: NO V ROW`); stop += 1; continue; }
  const names0 = new Set(v.P0.map((f) => f.name)); const withheld = v.stored.filter((f) => !names0.has(f.name));
  const s0 = sum(v.P0); const s1 = sum(v.P1); const lr = LR(v.P0); const p1 = new Map(v.P1.map((f) => [f.name, f.power]));
  const c1 = withheld.length > 0; const c2 = Math.abs((100 - s0) - sum(withheld)) < 1e-6; const c3 = Math.abs(s1 - 100) < 1e-6; const c4 = lr.every((f) => p1.get(f.name) === f.power) && lr.length === v.P1.length;
  if (!c1) stop += 1;
  classRows.push(`  ${seed}: (1) ${c1 ? 'YES' : 'NO'} withheld ${J(withheld.map((f) => [f.name, f.power, f.hidden ? 'hidden' : '']))} (2) ${c2 ? 'YES' : 'NO'} P0 sum ${s0} (3) ${c3 ? 'YES' : 'NO'} P1 sum ${s1} (4) ${c4 ? 'YES' : 'NO'} | lines ${ls.length}${c1 ? '' : '  <- STOP: a moved share, no power withheld'}`);
}
// on all 720: P1's shares differ from P0's (doc level), by whether a power is withheld
const all = { births: byV.size, sharesMove: 0, sharesMoveNoWithheld: 0, withheld: 0, storedNot100NothingWithheld: 0, storedNot100: 0, lrHolds: 0, dmMove: 0 }; const ex = [];
for (const v of byV.values()) {
  const names0 = new Set(v.P0.map((f) => f.name)); const w = v.stored.filter((f) => !names0.has(f.name)).length; if (w) all.withheld += 1;
  const p0 = new Map(v.P0.map((f) => [f.name, f.power])); const mv = v.P1.some((f) => p0.get(f.name) !== f.power) || v.P1.length !== v.P0.length;
  if (mv) { all.sharesMove += 1; if (!w) { all.sharesMoveNoWithheld += 1; ex.push(v.seed); } const lr = LR(v.P0); const p1 = new Map(v.P1.map((f) => [f.name, f.power])); if (lr.every((f) => p1.get(f.name) === f.power)) all.lrHolds += 1; }
  if (Math.abs(sum(v.stored) - 100) > 1e-6) { all.storedNot100 += 1; if (!w) all.storedNot100NothingWithheld += 1; }
  const pd = new Map(v.P0dm.map((f) => [f.name, f.power])); if (v.P1dm.some((f) => pd.get(f.name) !== f.power)) all.dmMove += 1;
}
console.log(`VR31 (N109): V rows ${V.length} (errors ${errs}); (F) births whose Power tab moved a share tile: ${moved.size}`);
for (const l of classRows) console.log(l);
console.log(`ON ALL ${all.births}: ${J(all)}${ex.length ? ` | shares move with no power withheld: ${ex.slice(0, 10).join(', ')}` : ''}`);
console.log('THE FOUR AT REVEAL DM (P1, readOnly, Reveal DM) against the owner\'s own page (not read-only, premium): the Power tab\'s share tiles');
for (const d of D) {
  if (d.error) { console.log(`  ${d.seed}: ERROR ${d.error.slice(0, 200)}`); continue; }
  const tiles = (v) => Object.values(v).flat().filter(isTile);
  const a = tiles(d.owner); const b = tiles(d.dm); const same = J(a) === J(b);
  console.log(`  ${d.seed}: tiles owner ${a.length} / dm ${b.length} ${same ? 'EQUAL' : 'DIFFER'}${same ? '' : ` | owner ${J(a).slice(0, 200)} | dm ${J(b).slice(0, 200)}`} | doc shares stored ${J(d.stored.map((f) => f.power))} P1dm ${J(d.P1dm.map((f) => f.power))}`);
}
console.log('THE UNPAIRED FIGURES: the Power views (P0 | P1), each bare figure with its line index and the line before it');
for (const r of VW) for (const [t, v] of Object.entries(r.views || {})) if (/\/Power$/.test(t)) {
  for (const side of ['P0', 'P1']) { const ls = v[side] || []; console.log(`  ${r.seed} ${side}: ${ls.map((l, i) => (/^\d+$/.test(l) ? `[${i}] ${J(ls[i - 1]?.slice(0, 40))} -> ${l}` : null)).filter(Boolean).join(' | ')}`); }
}
process.exit(stop || all.sharesMoveNoWithheld ? 1 : 0);
