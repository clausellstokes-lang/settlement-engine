// BIRTH-AUDIT: two corpora of the same seeds, compared record by record and FIELD FAMILY by field family (a top-level key
// of the stored record; economicState.*, resourceAnalysis.*, config.* one level down), and the spread of a re-draw:
// towns whose people (npcs), ties (relationships), name, roster (institutions) moved.
//   node docs/chair/2026-11-17/birth/probes/fieldDiff.mjs <base.ndjson.gz> <tip.ndjson.gz> [<out.json>]
import fs from 'node:fs'; import zlib from 'node:zlib';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const [a, b, outFile] = process.argv.slice(2);
const A = load(a), B = load(b);
const DEEP = new Set(['economicState', 'resourceAnalysis', 'config', 'economicViability']);
const VOLATILE = /^(generatedAt|createdAt|updatedAt|_ts|timestamp)$/;
const j = (x) => JSON.stringify(x, (k, v) => (VOLATILE.test(k) ? undefined : v));
const fam = {}; const towns = new Set(); const spread = { npcs: 0, relationships: 0, name: 0, institutions: 0 };
const perTown = {};
for (const [seed, s] of A) {
  const t = B.get(seed); if (!t) { (fam['(missing in tip)'] ||= []).push(seed); continue; }
  if (j(s) === j(t)) continue;
  towns.add(seed); const moved = [];
  for (const k of new Set([...Object.keys(s), ...Object.keys(t)])) {
    if (VOLATILE.test(k)) continue;
    if (j(s[k]) === j(t[k])) continue;
    if (DEEP.has(k) && s[k] && t[k] && typeof s[k] === 'object') {
      for (const k2 of new Set([...Object.keys(s[k]), ...Object.keys(t[k])])) if (j(s[k][k2]) !== j(t[k][k2])) moved.push(`${k}.${k2}`);
    } else moved.push(k);
  }
  for (const m of moved) (fam[m] ||= []).push(seed);
  for (const k of Object.keys(spread)) if (j(s[k]) !== j(t[k])) spread[k]++;
  perTown[seed] = moved;
}
const res = { base: a, tip: b, towns: A.size, changed: towns.size, spread, families: Object.fromEntries(Object.entries(fam).sort((x, y) => y[1].length - x[1].length).map(([k, v]) => [k, v.length])), perTown };
if (outFile) fs.writeFileSync(outFile, JSON.stringify(res, null, 1));
console.log(`towns ${A.size} · changed ${towns.size} · people ${spread.npcs} · ties ${spread.relationships} · name ${spread.name} · roster ${spread.institutions}`);
for (const [k, v] of Object.entries(res.families).slice(0, 25)) console.log(`  ${k.padEnd(48)} ${v}`);
