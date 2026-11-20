// BAR6-AUDIT-E runner · LAW 9 (a state word has one reading) over any PAGE-COPY render (dumps/ + corpus.ndjson.gz).
//   node docs/chair/2026-11-16/bar6/AUDIT/runE.mjs <render-dir> <out.json> [second-check.json ...]
// Writes every instance to <out.json>; prints counts by rule (towns, instances, distinct lines) with the BAR5 seat that
// holds the rule (if any) and whether the rule is COUNTED or reported APART (WEAK or ruled both ways). Given the
// second-check files (review-wide-6/SECOND-CHECK.final221.json, review-bar-5/SECOND-CHECK.final72.json) it prints the
// controls table (controlsE.json): a STANDS control is FOUND when an instance of its rule in its town holds its text;
// an EXPLAINED control is CLEAN when no counted LAW 9 instance in its town holds its text.
// Two rules are the earlier auditors' own detectors, run here unchanged and relabelled (no file of theirs is edited):
//   9e.none = LAW 1's rule 1a (tests/helpers/pageLaws/law1.mjs; held by BAR5-MAGIC)
//   9c.game = LAW 3's L3.foodModel (tests/helpers/pageLaws/law3.mjs; held by BAR5-FOOD (d))
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const H = (f) => import(path.join(root, 'tests/helpers/pageLaws', f));
const { readTown, fold } = await H('pageB.mjs');
const { parseDump, dossierTabs } = await H('page.mjs');
const { law9 } = await H('law9.mjs');
const { law1a } = await H('law1.mjs');
const { law3 } = await H('law3.mjs');

const [outDir, resultPath, ...controlFiles] = process.argv.slice(2);
if (!outDir || !resultPath) { console.error('usage: runE.mjs <render-dir> <out.json> [second-check.json ...]'); process.exit(2); }

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
  const text = fs.readFileSync(path.join(outDir, 'dumps', f), 'utf8');
  const T = readTown(text, rec);
  const xs = [...law9(T, seed)];
  for (const x of law1a({ record: rec, tabs: dossierTabs(parseDump(text).tabs), town: seed })) {
    xs.push({ law: 'L9', rule: '9e.none', town: seed, tab: x.tab, line: x.line, sentence: x.line, against: x.against, why: `(LAW 1 · 1a) ${x.why}`, held: 'BAR5-MAGIC', status: 'count' });
  }
  for (const x of law3(T, seed).filter((y) => y.rule === 'L3.foodModel')) {
    xs.push({ law: 'L9', rule: '9c.game', town: seed, tab: x.tab, line: x.line, sentence: x.line, against: x.against, why: `(LAW 3 · L3.foodModel) ${x.why}`, held: 'BAR5-FOOD', status: 'count' });
  }
  // the distinct form of a sentence: the town's own name (and its tier word) folded out
  const nameRe = rec.name ? new RegExp(esc(rec.name), 'g') : null;
  for (const x of xs) {
    x.tier = rec.tier || rec.config?.settType || null;
    x.crises = [...T.crises];
    x.form = (nameRe ? x.sentence.replace(nameRe, 'X') : x.sentence).replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/g, '<tier>');
    all.push(x);
  }
}
fs.writeFileSync(resultPath, JSON.stringify(all, null, 1));

// ---- counts by rule
const rules = new Map();
for (const x of all) {
  const v = rules.get(x.rule) || { n: 0, towns: new Set(), forms: new Set(), held: x.held, apart: 0 };
  v.n++; v.towns.add(x.town); v.forms.add(x.form); if (x.status === 'apart') v.apart++; rules.set(x.rule, v);
}
const counted = all.filter((x) => x.status !== 'apart');
console.log(`LAW 9 over ${dumps.length} towns: ${counted.length} counted instances in ${new Set(counted.map((x) => x.town)).size} towns, ${new Set(counted.map((x) => x.form)).size} distinct lines · apart (WEAK / ruled both ways) ${all.length - counted.length}`);
console.log(`  of the counted, held by a BAR5 seat ${counted.filter((x) => x.held).length} · beyond the round in flight ${counted.filter((x) => !x.held).length} in ${new Set(counted.filter((x) => !x.held).map((x) => x.town)).size} towns`);
console.log('rule                 towns  inst  distinct  held-by       (apart)');
for (const [k, v] of [...rules].sort()) console.log(`${k.padEnd(20)} ${String(v.towns.size).padStart(5)} ${String(v.n).padStart(5)} ${String(v.forms.size).padStart(9)}  ${(v.held || '-').padEnd(12)} ${v.apart ? `(${v.apart} apart)` : ''}`);

// ---- controls
if (controlFiles.length) {
  const rows = controlFiles.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
  const want = JSON.parse(fs.readFileSync(path.join(here, 'controlsE.json'), 'utf8'));
  const norm = (s) => fold(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const holds = (x, t) => [x.line, x.sentence, x.against?.line].some((s) => { const n = norm(s); return n && (n.includes(t) || (t.includes(n) && n.length > 12)); });
  const towns = new Set(dumps.map((f) => f.replace(/\.txt$/, '')));
  const table = [];
  for (const [group, ids] of Object.entries(want)) {
    if (group === '_') continue;
    for (const [id, [rule, verdict]] of Object.entries(ids)) {
      const r = rows.find((x) => x.id === id);
      if (!r) { table.push({ group, rule, id, verdict, result: 'n/a', note: 'not in the second-check files given' }); continue; }
      if (!towns.has(r.town)) { table.push({ group, rule, id, verdict, town: r.town, result: 'n/a', note: 'town not in this render' }); continue; }
      const t = norm(r.text);
      const inTown = all.filter((x) => x.town === r.town && holds(x, t));
      let result;
      if (verdict === 'EXPLAINED') { const bad = inTown.filter((x) => x.status !== 'apart'); result = bad.length ? `FOUND (wrongly) ${[...new Set(bad.map((x) => x.rule))].join(' ')}` : 'clean'; }
      else { const ok = inTown.filter((x) => x.rule === rule); result = ok.length ? `found${ok.some((x) => x.status === 'apart') ? ' (apart)' : ''}` : 'MISS'; }
      table.push({ group, rule, id, verdict, town: r.town, section: r.section, result, text: r.text.slice(0, 100) });
    }
  }
  fs.writeFileSync(resultPath.replace(/\.json$/, '.controls.json'), JSON.stringify(table, null, 1));
  const bad = table.filter((x) => (x.verdict === 'STANDS' && x.result === 'MISS') || /wrongly/.test(x.result));
  console.log(`controls: ${table.length} · STANDS found ${table.filter((x) => x.verdict === 'STANDS' && /^found/.test(x.result)).length}/${table.filter((x) => x.verdict === 'STANDS' && x.result !== 'n/a').length} · EXPLAINED clean ${table.filter((x) => x.verdict === 'EXPLAINED' && x.result === 'clean').length}/${table.filter((x) => x.verdict === 'EXPLAINED' && x.result !== 'n/a').length} · n/a ${table.filter((x) => x.result === 'n/a').length}`);
  for (const x of table) console.log(`${x.rule.padEnd(15)} ${x.id.padEnd(8)} ${x.verdict.padEnd(9)} ${x.result.padEnd(12)} ${x.text || x.note}`);
  if (bad.length) console.log(`CONTROLS NOT MET: ${bad.map((x) => x.id).join(' ')}`);
}
