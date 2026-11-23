// VEIL-18's builder: two runs of v8245-born.probe.jsx (a base chain and twin, a tree chain and twin), row for row.
//   node v8245-born-cmp.mjs <base.json> <tree.json>
// Prints, per veil (default, every eye shut): the rows whose fingerprint differs, of them those that differ OUTSIDE
// relationships[], prominentRelationship and pressureSentence (0 wanted: V8-5 moves only those), the ties the tree
// withholds that the base sent (rows, towns, ties), prominentRelationship and pressureSentence withheld, anything the
// tree sends that the base withheld (0 wanted), reads that raise, and the server-twin paths (gallery and import).
import { readFileSync } from 'node:fs';
const [fa, fb] = process.argv.slice(2);
const a = JSON.parse(readFileSync(fa, 'utf8')); const b = JSON.parse(readFileSync(fb, 'utf8'));
const key = (r) => `${r.town} ${r.shape} ${r.kind} ${r.dm ? 'dm' : 'off'} ${r.read}`;
const mb = new Map(b.rows.map((r) => [key(r), r]));
console.log(`towns ${a.towns} | ${b.towns}; rows ${a.rows.length} | ${b.rows.length}`);
for (const kind of ['default', 'all']) {
  const t = { rows: 0, differ: 0, outside: 0, tieRows: 0, ties: 0, towns: new Set(), pr: 0, ps: 0, sends: 0, missing: 0, errA: 0, errB: 0, twinA: 0, twinB: 0 };
  const ex = [];
  for (const r of a.rows.filter((x) => x.kind === kind)) {
    t.rows += 1;
    const s = mb.get(key(r)); if (!s) { t.missing += 1; continue; }
    if (r.error) t.errA += 1; if (s.error) t.errB += 1;
    if (r.twin) t.twinA += 1; if (s.twin) t.twinB += 1;
    if (r.h === s.h) continue;
    t.differ += 1;
    if (r.hRest !== s.hRest) { t.outside += 1; if (ex.length < 6) ex.push(`OUTSIDE ${key(r)}`); }
    const lost = r.ties.filter((k) => !s.ties.includes(k)); const added = s.ties.filter((k) => !r.ties.includes(k));
    if (lost.length) { t.tieRows += 1; t.ties += lost.length; t.towns.add(`${r.town} ${r.shape}`); if (ex.length < 12) ex.push(`${key(r)}: ${lost.length} ties withheld, e.g. ${lost[0]}`); }
    if (r.pr && !s.pr) t.pr += 1; if (r.ps && !s.ps) t.ps += 1;
    if (added.length || (!r.pr && s.pr) || (!r.ps && s.ps)) { t.sends += 1; if (ex.length < 12) ex.push(`SENDS ${key(r)}`); }
  }
  console.log(`${kind === 'all' ? 'EVERY EYE SHUT' : 'THE DEFAULT VEIL'}: rows ${t.rows}; differ ${t.differ}; differ outside the ties and their two copies ${t.outside}; `
    + `rows that withhold ties ${t.tieRows} (${t.ties} ties, ${t.towns.size} town-shapes); prominentRelationship withheld ${t.pr}; pressureSentence withheld ${t.ps}; `
    + `rows that send what the base withheld ${t.sends}; missing ${t.missing}; reads that raise ${t.errA} | ${t.errB}; server-twin rows ${t.twinA} | ${t.twinB}`);
  for (const e of ex) console.log(`  ${e}`);
}
