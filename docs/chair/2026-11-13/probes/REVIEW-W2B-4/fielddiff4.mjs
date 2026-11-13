// REVIEW-W2B-4 item 3: the 720 births and their rendered dossiers, base against tip.
//   node fielddiff4.mjs <base census out> <tip census out>
// Births: each seed's record serialised (JSON.stringify of the census's own line), compared byte for byte; where one
// differs, the leaf paths that differ are listed. Dumps: each dossier text compared byte for byte; where one differs, the
// differing lines are printed (at most ten per town).
import fs from 'node:fs'; import zlib from 'node:zlib';
const [A, B] = process.argv.slice(2);
const load = (o) => new Map(zlib.gunzipSync(fs.readFileSync(`${o}/corpus.ndjson.gz`)).toString().trim().split('\n').map((l) => { const j = JSON.parse(l); return [j.seed, JSON.stringify(j.s)]; }));
const a = load(A), b = load(B);
const leaves = (x, p = '', out = new Map()) => { if (x && typeof x === 'object') { for (const k of Object.keys(x)) leaves(x[k], `${p}.${k}`, out); } else out.set(p, x); return out; };
let differ = 0;
for (const [seed, sa] of a) {
  const sb = b.get(seed);
  if (sa === sb) continue; differ++;
  if (sb === undefined) { console.log('BIRTH MISSING AT TIP', seed); continue; }
  const la = leaves(JSON.parse(sa)), lb = leaves(JSON.parse(sb));
  const ks = new Set([...la.keys(), ...lb.keys()]); const d = [...ks].filter((k) => la.get(k) !== lb.get(k));
  console.log('BIRTH DIFFERS', seed, d.length, 'leaves', d.slice(0, 8).join(' '));
}
console.log('births: base', a.size, 'tip', b.size, 'differ', differ);
const da = fs.readdirSync(`${A}/dumps`).sort(), db = new Set(fs.readdirSync(`${B}/dumps`));
let dd = 0;
for (const f of da) {
  if (!db.has(f)) { console.log('DUMP MISSING AT TIP', f); dd++; continue; }
  const x = fs.readFileSync(`${A}/dumps/${f}`, 'utf8'), y = fs.readFileSync(`${B}/dumps/${f}`, 'utf8');
  if (x === y) continue; dd++;
  const xl = x.split('\n'), yl = y.split('\n'); const xs = new Set(xl), ys = new Set(yl);
  const onlyA = xl.filter((l) => !ys.has(l)), onlyB = yl.filter((l) => !xs.has(l));
  console.log('DUMP DIFFERS', f, 'lines only at base', onlyA.length, 'only at tip', onlyB.length);
  for (const l of onlyA.slice(0, 10)) console.log('   - ', l.slice(0, 200));
  for (const l of onlyB.slice(0, 10)) console.log('   + ', l.slice(0, 200));
}
console.log('dumps: base', da.length, 'tip', db.size, 'differ', dd);
