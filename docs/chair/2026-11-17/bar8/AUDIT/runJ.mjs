// BAR8-AUDIT-J runner · LAW 11 · THE SUPPLY STORY ON EVERY LINE (rules 11a to 11e, `tests/helpers/pageLaws/law11Supply.mjs`)
// over ANY PAGE-COPY render:
//   node docs/chair/2026-11-17/bar8/AUDIT/runJ.mjs <render-dir> <out.json> [--controls]
// <render-dir> holds dumps/<seed>.txt and corpus.ndjson.gz (PAGE-COPY's census3.sh --count-only). Writes every instance to
// <out.json>; prints counts by rule (towns, instances, distinct lines: a line's form with the town's name folded out), split by
// STORY (bought in · idle · the failed venture · under a siege) and by MATERIAL, and for 11b by LINE KIND; with --controls,
// the controls table of controlsJ.json (the STANDS rows must be FOUND by their own sub-rule, the EXPLAINED rows clear of
// EVERY rule of the seat), written beside <out.json> as .controls.json; a control whose town is not in the render is n/a.
// Exit 1 when no dump is read; exit 3 when a STANDS control is missed or an EXPLAINED control is found.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const { readTown, fold } = await import(path.join(root, 'tests/helpers/pageLaws/pageB.mjs'));
const { law11, rootsOf } = await import(path.join(root, 'tests/helpers/pageLaws/law11Supply.mjs'));

const args = process.argv.slice(2);
const withControls = args.includes('--controls');
const [dir, outPath] = args.filter((a) => !a.startsWith('--'));
if (!dir || !outPath) { console.error('usage: runJ.mjs <render-dir> <out.json> [--controls]'); process.exit(2); }
const records = new Map();
for (const l of zlib.gunzipSync(fs.readFileSync(path.join(dir, 'corpus.ndjson.gz'))).toString().split('\n')) {
  if (!l.trim()) continue; const o = JSON.parse(l); records.set(o.seed, o.s);
}
const dumps = fs.readdirSync(path.join(dir, 'dumps')).filter((f) => f.endsWith('.txt')).sort();
if (!dumps.length) { console.error('no dumps'); process.exit(1); }
const norm = (s) => fold(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const all = [];
const roots = [];
for (const f of dumps) {
  const seed = f.replace(/\.txt$/, '');
  const rec = records.get(seed);
  if (!rec) { console.error(`no record for ${seed}`); process.exit(1); }
  const T = readTown(fs.readFileSync(path.join(dir, 'dumps', f), 'utf8'), rec);
  const names = [rec.name, ...(rec.npcs || []).map((n) => n.name)].filter((n) => n && String(n).length > 2).map(String).sort((a, b) => b.length - a.length);
  const formOf = (s) => names.reduce((t, n) => t.split(n).join('<name>'), String(s || ''));
  for (const r of rootsOf(rec)) roots.push({ ...r, town: seed });
  for (const x of law11(T, seed)) all.push({ ...x, form: formOf(x.sentence || x.line), crises: [...T.crises] });
}
fs.writeFileSync(outPath, JSON.stringify(all, null, 1));

const tally = (xs) => ({ towns: new Set(xs.map((x) => x.town)).size, n: xs.length, lines: new Set(xs.map((x) => x.form)).size });
const fmt = (t) => `towns ${String(t.towns).padStart(4)} · instances ${String(t.n).padStart(5)} · distinct lines ${String(t.lines).padStart(4)}`;
const split = (xs, key) => { const m = new Map(); for (const x of xs) { const k = x[key] ?? '-'; m.set(k, (m.get(k) || 0) + 1); } return [...m].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '); };
console.log(`LAW 11 (seat J) over ${dumps.length} towns: ${fmt(tally(all))}`);
const fams = (r) => r.replace(/^(11b)\..*$/, '$1');
for (const r of [...new Set(all.map((x) => fams(x.rule)))].sort()) {
  const xs = all.filter((x) => fams(x.rule) === r);
  console.log(`  ${r.padEnd(16)} ${fmt(tally(xs))}`);
  console.log(`    by story ${split(xs, 'cause')}`);
  console.log(`    by material ${split(xs, 'fam')}`);
  if (r === '11b') console.log(`    by line kind ${split(xs, 'kind')}`);
  if (r === '11b') for (const f of [...new Set(xs.map((x) => x.rule))].sort()) console.log(`      ${f.padEnd(16)} ${fmt(tally(xs.filter((x) => x.rule === f)))}`);
}
// THE ROOTS: the record's own disagreements under the lines (rootsOf), by kind
fs.writeFileSync(outPath.replace(/\.json$/, '.roots.json'), JSON.stringify(roots, null, 1));
console.log('THE ROOTS (the record alone)');
for (const k of [...new Set(roots.map((r) => r.root))].sort()) {
  const rs = roots.filter((r) => r.root === k);
  console.log(`  ${k.padEnd(22)} towns ${String(new Set(rs.map((r) => r.town)).size).padStart(4)} · rows ${String(rs.length).padStart(4)} · ${k === 'warIronOutsideWar' ? `under a siege ${rs.filter((r) => r.siege).length} · by crises ${split(rs, 'crises')} · with an iron import ${rs.filter((r) => r.ironImports).length}` : `by material ${split(rs, 'fam')}`}`);
}
// the distinct lines, most towns first (the worklist's raw table)
const forms = new Map();
for (const x of all) { const k = `${fams(x.rule)}\u0000${x.form}`; const e = forms.get(k) || { rule: fams(x.rule), form: x.form, towns: new Set(), n: 0, kinds: new Set(), tabs: new Set() }; e.towns.add(x.town); e.n++; e.kinds.add(x.kind || '-'); e.tabs.add(x.tab); forms.set(k, e); }
const formRows = [...forms.values()].map((e) => ({ rule: e.rule, towns: e.towns.size, n: e.n, tabs: [...e.tabs].join(' '), kinds: [...e.kinds].join(' '), form: e.form })).sort((a, b) => b.towns - a.towns || a.rule.localeCompare(b.rule));
fs.writeFileSync(outPath.replace(/\.json$/, '.forms.json'), JSON.stringify(formRows, null, 1));
console.log(`DISTINCT LINES (top 25 by towns; all in ${path.basename(outPath).replace(/\.json$/, '.forms.json')})`);
for (const f of formRows.slice(0, 25)) console.log(`  ${f.rule.padEnd(6)} ${String(f.towns).padStart(4)}t ${String(f.n).padStart(5)} ${f.tabs.padEnd(20)} ${f.form.slice(0, 120)}`);

if (withControls) {
  const want = JSON.parse(fs.readFileSync(path.join(here, 'controlsJ.json'), 'utf8')).rows;
  const table = []; let bad = 0;
  for (const [id, r] of Object.entries(want)) {
    if (!dumps.includes(`${r.town}.txt`)) { table.push({ id, ...r, found: null, note: 'town not in this render' }); continue; }
    const t = norm(r.text);
    const hits = all.filter((x) => x.town === r.town && (r.group === 'explained' || x.rule.split('.')[0] === r.rule)
      && x.rowLines.concat(x.sentence ? [x.sentence] : []).some((l) => { const n = norm(l); return n.includes(t) || (t.length > 25 && t.includes(n) && n.length > 12); }));
    const found = hits.length > 0;
    if (r.group === 'stands' && !found) bad++;
    if (r.group === 'explained' && found) bad++;
    table.push({ id, rule: r.rule, group: r.group, town: r.town, found, rules: [...new Set(hits.map((h) => h.rule))].join(' '), text: r.text.slice(0, 90) });
  }
  fs.writeFileSync(outPath.replace(/\.json$/, '.controls.json'), JSON.stringify(table, null, 1));
  console.log('CONTROLS (stands must be FOUND by their sub-rule; explained must be clear of every rule of the seat)');
  for (const x of table) console.log(`  ${x.rule} ${x.group.padEnd(9)} ${x.id.padEnd(7)} ${x.found === null ? 'n/a  ' : x.found ? 'FOUND' : 'clear'} ${(x.rules || '').padEnd(22)} ${x.text || x.note}`);
  console.log(`controls off: ${bad}`);
  if (bad) process.exitCode = 3;
}
