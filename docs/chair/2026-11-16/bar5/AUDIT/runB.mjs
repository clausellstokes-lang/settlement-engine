// BAR5-AUDIT-B runner: laws 2 and 3 over a PAGE-COPY render (dumps + corpus.ndjson.gz).
//   node runB.mjs <out-dir-of-census3> <result.json> [controls.json ...]
// Writes every instance to <result.json>, prints counts by law and rule, and (given the second-check files)
// the controls table: a control is FOUND when an instance's line or its `against` line holds the control's text.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const { readTown, fold } = await import(path.join(root, 'tests/helpers/pageLaws/pageB.mjs'));
const { law2 } = await import(path.join(root, 'tests/helpers/pageLaws/law2.mjs'));
const { law3 } = await import(path.join(root, 'tests/helpers/pageLaws/law3.mjs'));

const [outDir, resultPath, ...controlFiles] = process.argv.slice(2);
if (!outDir || !resultPath) { console.error('usage: runB.mjs <census-out> <result.json> [controls.json ...]'); process.exit(2); }

const records = new Map();
for (const l of zlib.gunzipSync(fs.readFileSync(path.join(outDir, 'corpus.ndjson.gz'))).toString().split('\n')) {
  if (!l.trim()) continue; const o = JSON.parse(l); records.set(o.seed, o.s);
}
const dumps = fs.readdirSync(path.join(outDir, 'dumps')).filter((f) => f.endsWith('.txt'));
if (!dumps.length) { console.error('no dumps'); process.exit(1); }
const all = [];
let crisisTowns = 0;
for (const f of dumps.sort()) {
  const seed = f.replace(/\.txt$/, '');
  const rec = records.get(seed);
  if (!rec) { console.error(`no record for ${seed}`); process.exit(1); }
  const T = readTown(fs.readFileSync(path.join(outDir, 'dumps', f), 'utf8'), rec);
  if (T.crises.size) crisisTowns++;
  for (const x of [...law2(T, seed), ...law3(T, seed)]) all.push({ ...x, crises: [...T.crises] });
}
fs.writeFileSync(resultPath, JSON.stringify(all, null, 1));

const by = (k) => { const m = new Map(); for (const x of all) { const key = k(x); const v = m.get(key) || { n: 0, towns: new Set() }; v.n++; v.towns.add(x.town); m.set(key, v); } return m; };
console.log(`towns ${dumps.length} (with a crisis ${crisisTowns}) · instances ${all.length}`);
for (const [k, v] of [...by((x) => x.law)].sort()) console.log(`${k}: towns ${v.towns.size} · instances ${v.n}`);
for (const [k, v] of [...by((x) => x.rule)].sort()) console.log(`  ${k}: towns ${v.towns.size} · instances ${v.n}`);

if (controlFiles.length) {
  const rows = controlFiles.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
  const want = JSON.parse(fs.readFileSync(path.join(here, 'controlsB.json'), 'utf8'));
  const norm = (s) => fold(s).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const table = [];
  for (const [law, groups] of Object.entries(want)) for (const [kind, ids] of Object.entries(groups)) for (const id of ids) {
    const r = rows.find((x) => x.id === id);
    if (!r) { table.push({ law, kind, id, found: null, note: 'not in the files' }); continue; }
    const t = norm(r.text);
    const hits = all.filter((x) => x.town === r.town && x.law === law && (norm(x.line).includes(t) || t.includes(norm(x.line)) || norm(x.against?.line || '').includes(t)));
    table.push({ law, kind, id, town: r.town, section: r.section, found: hits.length > 0, rules: [...new Set(hits.map((h) => h.rule))].join(' '), text: r.text.slice(0, 90) });
  }
  fs.writeFileSync(resultPath.replace(/\.json$/, '.controls.json'), JSON.stringify(table, null, 1));
  for (const x of table) console.log(`${x.law} ${x.kind.padEnd(9)} ${x.id.padEnd(7)} ${x.found === null ? 'n/a ' : x.found ? 'FOUND' : 'miss '} ${x.rules || ''} · ${x.text || x.note}`);
}

// GONE=<second-check file of the read before>: its STANDS rows were cured; say any that an instance still finds
if (process.env.GONE) {
  const rows = JSON.parse(fs.readFileSync(process.env.GONE, 'utf8')).filter((r) => (r.verdict || r.class) === 'STANDS');
  const norm = (s) => fold(s).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const still = rows.filter((r) => all.some((x) => x.town === r.town && (norm(x.line).includes(norm(r.text)) || norm(r.text).includes(norm(x.line)))));
  fs.writeFileSync(resultPath.replace(/\.json$/, '.gone.json'), JSON.stringify({ stands: rows.length, stillFound: still.map((r) => ({ id: r.id, town: r.town, section: r.section, text: r.text })) }, null, 1));
  console.log(`the read before: ${rows.length} STANDS rows; still found by an instance: ${still.length}${still.length ? ' · ' + still.map((r) => r.id).join(' ') : ''}`);
}
