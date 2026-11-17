// BAR7-AUDIT-I runner · LAWS 6e, 7, 9 and 10 WIDENED, 5x, and the seat's LOW families, over any PAGE-COPY render.
//   node docs/chair/2026-11-17/bar7/AUDIT/runI.mjs <render-dir> <out.json> [second-check.json ...]
// <render-dir> holds dumps/<seed>.txt and corpus.ndjson.gz (PAGE-COPY's census3.sh --count-only). Writes every instance to
// <out.json>; prints counts by rule (towns, instances, distinct lines) and, for each rule, the split by cause (crisis: the
// town has a crisis; other: it has none). `apart` instances are reported, never counted. Given the second check's file
// (review-bar-6/SECOND-CHECK.final51.json) it prints the controls (controlsI.json): a STANDS control is FOUND when an
// instance of its rule in its town holds its text; an EXPLAINED control is CLEAN when no counted instance holds it.
// Exits 1 on a missing record or no dumps; exits 0 otherwise (a count is a measure, not a gate).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const H = (f) => import(path.join(root, 'tests/helpers/pageLaws', f));
const { readTown, fold } = await H('pageB.mjs');
const { law9w } = await H('law9w.mjs');
const { law7x } = await H('law7x.mjs');
const { law10i } = await H('law10i.mjs');
const { law6eCrown } = await H('law6eCrown.mjs');
const { law5x } = await H('law5x.mjs');
const { lowFamiliesI } = await H('lowFamiliesI.mjs');

const [outDir, resultPath, ...controlFiles] = process.argv.slice(2);
if (!outDir || !resultPath) { console.error('usage: runI.mjs <render-dir> <out.json> [second-check.json ...]'); process.exit(2); }
const records = new Map();
for (const l of zlib.gunzipSync(fs.readFileSync(path.join(outDir, 'corpus.ndjson.gz'))).toString().split('\n')) {
  if (!l.trim()) continue; const o = JSON.parse(l); records.set(o.seed, o.s);
}
const dumps = fs.readdirSync(path.join(outDir, 'dumps')).filter((f) => f.endsWith('.txt')).sort();
if (!dumps.length) { console.error('no dumps'); process.exit(1); }
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const all = [];
for (const f of dumps) {
  const seed = f.replace(/\.txt$/, '');
  const rec = records.get(seed);
  if (!rec) { console.error(`no record for ${seed}`); process.exit(1); }
  const T = readTown(fs.readFileSync(path.join(outDir, 'dumps', f), 'utf8'), rec);
  const xs = [...law9w(T, seed), ...law7x(T, seed), ...law10i(T, seed), ...law6eCrown(T, seed), ...law5x(T, seed), ...lowFamiliesI(T, seed)];
  const nameRe = rec.name ? new RegExp(esc(rec.name), 'g') : null;
  for (const x of xs) {
    x.crises = [...T.crises];
    x.form = (nameRe ? String(x.sentence).replace(nameRe, 'X') : String(x.sentence)).replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/g, '<tier>');
    all.push(x);
  }
}
fs.writeFileSync(resultPath, JSON.stringify(all, null, 1));

const lines = []; const log = (...a) => { const t = a.join(' '); lines.push(t); console.log(t); };
const counted = all.filter((x) => x.status !== 'apart');
log(`BAR7-AUDIT-I over ${dumps.length} towns: ${counted.length} counted instances in ${new Set(counted.map((x) => x.town)).size} towns, ${new Set(counted.map((x) => x.form)).size} distinct lines · apart ${all.length - counted.length}`);
log('rule                 towns  inst  distinct  crisis/other   (apart: towns inst distinct)');
const rules = new Map();
for (const x of all) {
  const v = rules.get(x.rule) || { c: { n: 0, t: new Set(), f: new Set(), crisis: 0, other: 0 }, a: { n: 0, t: new Set(), f: new Set() } };
  const b = x.status === 'apart' ? v.a : v.c; b.n++; b.t.add(x.town); b.f.add(x.form); if (x.status !== 'apart') v.c[x.cause === 'crisis' ? 'crisis' : 'other']++;
  rules.set(x.rule, v);
}
for (const [k, v] of [...rules].sort()) log(`${k.padEnd(20)} ${String(v.c.t.size).padStart(5)} ${String(v.c.n).padStart(5)} ${String(v.c.f.size).padStart(9)}  ${`${v.c.crisis}/${v.c.other}`.padStart(12)}   ${v.a.n ? `(${v.a.t.size} ${v.a.n} ${v.a.f.size})` : ''}`);

if (controlFiles.length) {
  const rows = controlFiles.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
  const want = JSON.parse(fs.readFileSync(path.join(here, 'controlsI.json'), 'utf8'));
  const norm = (s) => fold(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const holds = (x, t) => [x.line, x.sentence, ...(x.texts || [])].some((s) => { const n = norm(s); return n && (n.includes(t) || (t.includes(n) && n.length > 12)); });
  const towns = new Set(dumps.map((f) => f.replace(/\.txt$/, '')));
  const table = [];
  for (const [group, ids] of Object.entries(want)) {
    if (group === '_') continue;
    for (const [id, [rule, verdict]] of Object.entries(ids)) {
      const r = rows.find((x) => x.id === id);
      if (!r) { table.push({ id, rule, verdict, result: 'n/a', text: 'not in the second-check file given' }); continue; }
      if (!towns.has(r.town)) { table.push({ id, rule, verdict, result: 'n/a', text: 'town not in this render' }); continue; }
      const t = norm(r.text).replace(/^(wants|secret|how they deal) /, '');
      const inTown = all.filter((x) => x.town === r.town && holds(x, t));
      let result;
      if (verdict === 'STANDS') { const ok = inTown.filter((x) => x.rule === rule); result = ok.length ? (ok.some((x) => x.status !== 'apart') ? 'found' : 'found (apart)') : 'MISS'; }
      else { const bad = inTown.filter((x) => x.status !== 'apart' && !/^(low|design)\./.test(x.rule)); result = bad.length ? `FOUND (wrongly) ${[...new Set(bad.map((x) => x.rule))].join(' ')}` : 'clean'; if (verdict === 'WEAK' || verdict === 'BOTH') result = bad.length ? `found ${[...new Set(bad.map((x) => x.rule))].join(' ')}` : 'not found'; }
      table.push({ id, rule, verdict, town: r.town, result, text: r.text.slice(0, 90) });
    }
  }
  fs.writeFileSync(resultPath.replace(/\.json$/, '.controls.json'), JSON.stringify(table, null, 1));
  const st = table.filter((x) => x.verdict === 'STANDS' && x.result !== 'n/a'); const ex = table.filter((x) => x.verdict === 'EXPLAINED' && x.result !== 'n/a');
  log(`controls: STANDS found ${st.filter((x) => /^found/.test(x.result)).length}/${st.length} · EXPLAINED clean ${ex.filter((x) => x.result === 'clean').length}/${ex.length} · n/a ${table.filter((x) => x.result === 'n/a').length}`);
  for (const x of table) log(`${x.id.padEnd(8)} ${x.rule.padEnd(17)} ${x.verdict.padEnd(9)} ${x.result.padEnd(14)} ${x.text}`);
}
fs.writeFileSync(resultPath.replace(/\.json$/, '.counts.txt'), lines.join('\n') + '\n');
