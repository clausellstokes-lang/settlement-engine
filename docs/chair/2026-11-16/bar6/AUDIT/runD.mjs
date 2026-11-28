// BAR6-AUDIT-D runner · LAW 8 (one state for a thing on every surface) over ANY PAGE-COPY render.
//   node docs/chair/2026-11-16/bar6/AUDIT/runD.mjs <render-dir> <out.json> [second-check.json ...]
// <render-dir> holds dumps/<seed>.txt and corpus.ndjson.gz (PAGE-COPY's census3.sh --count-only). Writes every instance
// to <out.json>, prints counts by rule (towns, instances, distinct lines, things), the overlap with LAW 2 and LAW 3 (seat
// B's detectors, run here unchanged: an instance on a line one of their rules also finds is the round in flight's), and,
// given the second-check files, the controls table of controlsD.json (written beside <out.json> as .controls.json).
// Exit 1 when no dump is read; exit 3 when a STANDS control is missed or an EXPLAINED control is found.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const { readTown, fold } = await import(path.join(root, 'tests/helpers/pageLaws/pageB.mjs'));
const { law2 } = await import(path.join(root, 'tests/helpers/pageLaws/law2.mjs'));
const { law3 } = await import(path.join(root, 'tests/helpers/pageLaws/law3.mjs'));
const { law8 } = await import(path.join(root, 'tests/helpers/pageLaws/law8.mjs'));

const [dir, outPath, ...checkFiles] = process.argv.slice(2);
if (!dir || !outPath) { console.error('usage: runD.mjs <render-dir> <out.json> [second-check.json ...]'); process.exit(2); }
const records = new Map();
for (const l of zlib.gunzipSync(fs.readFileSync(path.join(dir, 'corpus.ndjson.gz'))).toString().split('\n')) {
  if (!l.trim()) continue; const o = JSON.parse(l); records.set(o.seed, o.s);
}
const dumps = fs.readdirSync(path.join(dir, 'dumps')).filter((f) => f.endsWith('.txt')).sort();
if (!dumps.length) { console.error('no dumps'); process.exit(1); }
const norm = (s) => fold(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const all = [];
// LAW 2's and LAW 3's rules of LAW 8's shape (a thing marked on one surface, bare on another): the round in flight's
const K1_PRIOR = /^(L2\.siege\.(abroad|cutgood)|L2\.war\.(iron|animals)|L2\.famine\.(meat|grain|work)|L3\.(needed|outputs|chainOverStopped|failedFood|foodLineStopped))$/;
const priorAll = [];
for (const f of dumps) {
  const seed = f.replace(/\.txt$/, '');
  const rec = records.get(seed);
  if (!rec) { console.error(`no record for ${seed}`); process.exit(1); }
  const T = readTown(fs.readFileSync(path.join(dir, 'dumps', f), 'utf8'), rec);
  const prior = [...law2(T, seed), ...law3(T, seed)];
  for (const x of prior) if (K1_PRIOR.test(x.rule)) priorAll.push(x);
  const priorAt = new Map(prior.map((x) => [`${x.tab}|${x.i}`, x.rule]));
  const priorText = new Map(prior.map((x) => [norm(x.line), x.rule]));
  for (const x of law8(T, seed)) {
    const held = priorAt.get(`${x.tab}|${x.i}`) || x.rowLines.map((l) => priorText.get(norm(l))).find(Boolean) || null;
    // the town's name folded out, so one template counts once across towns
    const form = String(x.line).split(rec.name || '\u0000').join('<town>');
    all.push({ ...x, form, crises: [...T.crises], heldBy: held });
  }
}
fs.writeFileSync(outPath, JSON.stringify(all, null, 1));

const tally = (xs) => ({ towns: new Set(xs.map((x) => x.town)).size, n: xs.length, lines: new Set(xs.map((x) => x.form)).size, things: new Set(xs.map((x) => `${x.town}|${x.thing}`)).size, held: xs.filter((x) => x.heldBy).length });
const t0 = tally(all);
console.log(`LAW 8 over ${dumps.length} towns: towns ${t0.towns} · instances ${t0.n} · distinct lines ${t0.lines} · things ${t0.things} · on a LAW 2/3 line ${t0.held}`);
const rules = [...new Set(all.map((x) => x.rule))].sort();
{ const pr = priorAll; const pl = new Set(pr.map((x) => `${x.town}|${x.tab}|${x.i}`)); const mine = new Set(all.map((x) => `${x.town}|${x.tab}|${x.i}`));
  console.log(`LAW 2/3 rules of this shape (held by the round in flight), for the union: towns ${new Set(pr.map((x) => x.town)).size} · instances ${pr.length} · of them on a LAW 8 line ${[...pl].filter((k) => mine.has(k)).length}`);
  for (const r of [...new Set(pr.map((x) => x.rule))].sort()) { const xs = pr.filter((x) => x.rule === r); console.log(`    ${r.padEnd(22)} towns ${String(new Set(xs.map((x) => x.town)).size).padStart(4)} · instances ${String(xs.length).padStart(5)}`); }
  fs.writeFileSync(outPath.replace(/\.json$/, '.prior.json'), JSON.stringify(pr, null, 1)); }
for (const r of rules) { const t = tally(all.filter((x) => x.rule === r)); console.log(`  ${r.padEnd(12)} towns ${String(t.towns).padStart(4)} · instances ${String(t.n).padStart(5)} · distinct lines ${String(t.lines).padStart(4)} · things ${String(t.things).padStart(4)} · on a LAW 2/3 line ${t.held}`); }

if (checkFiles.length) {
  const rows = checkFiles.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
  const want = JSON.parse(fs.readFileSync(path.join(here, 'controlsD.json'), 'utf8'));
  const EXPECT = { C191251: /Glassblower/ }; // the brief: no reader flagged it, the detector should find the bare glassblower
  const hitsOf = (r, withAgainst) => { const t = norm(r.text); return all.filter((x) => x.town === r.town && (x.rowLines.some((l) => norm(l).includes(t) || (t.length > 25 && t.includes(norm(l)) && norm(l).length > 12)) || (withAgainst && norm(x.against?.line).includes(t)))); };
  const table = [];
  let bad = 0;
  for (const [rule, groups] of Object.entries(want)) {
    if (rule === '_') continue;
    for (const [grp, ids] of Object.entries(groups)) for (const id of ids) {
      const r = rows.find((x) => x.id === id);
      if (!r) { table.push({ rule, grp, id, found: null, note: 'not in the files given' }); continue; }
      if (!dumps.includes(`${r.town}.txt`)) { table.push({ rule, grp, id, town: r.town, found: null, note: 'town not in this render' }); continue; }
      let hits;
      if (EXPECT[id]) hits = all.filter((x) => x.town === r.town && EXPECT[id].test(x.thing || ''));
      else hits = hitsOf(r, grp !== 'explained');
      // not found by LAW 8: is it found by a LAW 2/3 rule of this shape (the round in flight holds it)?
      if (!hits.length && grp !== 'explained') { const t = norm(r.text); hits = priorAll.filter((x) => x.town === r.town && (norm(x.line).includes(t) || norm(x.against?.line).includes(t) || (t.length > 25 && t.includes(norm(x.line)) && norm(x.line).length > 12))).map((x) => ({ ...x, rule: `HELD:${x.rule}` })); }
      const found = hits.length > 0;
      if ((grp === 'stands' || grp === 'bar' || grp === 'expect') && !found) bad++;
      if (grp === 'explained' && found) bad++;
      table.push({ rule, grp, id, town: r.town, found, rules: [...new Set(hits.map((h) => h.rule))].join(' '), text: String(r.text).slice(0, 100) });
    }
  }
  fs.writeFileSync(outPath.replace(/\.json$/, '.controls.json'), JSON.stringify(table, null, 1));
  console.log('CONTROLS (stands/bar/expect must be FOUND; explained must be clear; weak reported apart)');
  for (const x of table) console.log(`  ${x.rule} ${x.grp.padEnd(9)} ${x.id.padEnd(8)} ${x.found === null ? 'n/a  ' : x.found ? 'FOUND' : 'clear'} ${(x.rules || '').padEnd(22)} ${x.text || x.note}`);
  console.log(`controls off: ${bad}`);
  if (bad) process.exitCode = 3;
}
