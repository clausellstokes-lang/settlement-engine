/**
 * BAR6-AUDIT seat F runner: LAW 10 (story lines drawn together) over a PAGE-COPY render (`dumps/<seed>.txt` +
 * `corpus.ndjson.gz`).
 *   node docs/chair/2026-11-16/bar6/AUDIT/runF.mjs <render-dir> <out.json> [<final221.json> [<final72.json>]]
 * Prints counts by rule (towns, instances, distinct lines; printed on a dossier tab vs on the record only) and, given
 * the evidence files, the controls table (controlsF.json beside this file: found or not). Writes every instance, the
 * thirty commonest distinct lines of each rule with their towns, and the controls to <out.json>.
 * Reads the DOSSIER tabs only (tests/helpers/pageLaws/page.mjs). Pure reading; changes nothing.
 */
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const { parseDump, dossierTabs, fold } = await import(path.join(ROOT, 'tests/helpers/pageLaws/page.mjs'));
const { LAW10 } = await import(path.join(ROOT, 'tests/helpers/pageLaws/law10.mjs'));
const [, , dir, outFile, f221, f72] = process.argv;
if (!dir || !outFile) { console.error('usage: node runF.mjs <render-dir> <out.json> [<final221.json> [<final72.json>]]'); process.exit(2); }
const corpus = new Map(zlib.gunzipSync(fs.readFileSync(path.join(dir, 'corpus.ndjson.gz'))).toString().split('\n').filter(Boolean).map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const instances = []; const pages = new Map();
const files = fs.readdirSync(path.join(dir, 'dumps')).filter((f) => f.endsWith('.txt')).sort();
for (const f of files) {
  const town = f.replace(/\.txt$/, '');
  const { tabs } = parseDump(fs.readFileSync(path.join(dir, 'dumps', f), 'utf8'));
  const t = { record: corpus.get(town), tabs: dossierTabs(tabs), town };
  pages.set(town, Object.values(t.tabs).flat().map(fold));
  const seen = new Set(); // one instance a rule, a town and a printed line: a line printed twice on a tab is one line
  for (const [name, d] of Object.entries(LAW10)) { try { for (const x of d(t)) { const k = `${x.rule}|${x.tab}|${x.line}`; if (seen.has(k)) continue; seen.add(k); instances.push({ detector: name, ...x }); } } catch (e) { instances.push({ detector: name, law: 'L10', rule: 'ERROR', town, tab: null, line: String(e?.stack || e).slice(0, 300) }); } }
}
const towns = files.length;
const group = (xs, key) => { const m = {}; for (const x of xs) (m[key(x)] ||= []).push(x); return m; };
const norm = (line) => fold(line);
const summary = (xs) => {
  const m = {}; for (const x of xs) (m[norm(x.line)] ||= { line: x.line.trim(), towns: new Set() }).towns.add(x.town);
  const printed = xs.filter((x) => x.tab);
  return { towns: new Set(xs.map((x) => x.town)).size, instances: xs.length, distinct: Object.keys(m).length,
    printedTowns: new Set(printed.map((x) => x.town)).size, printedInstances: printed.length, recordOnly: xs.length - printed.length,
    top: Object.values(m).sort((a, b) => b.towns.size - a.towns.size || a.line.localeCompare(b.line)).slice(0, 30).map((e) => ({ towns: e.towns.size, line: e.line.slice(0, 300), seeds: [...e.towns].slice(0, 6) })) };
};
const byRule = Object.fromEntries(Object.entries(group(instances, (x) => x.rule)).sort().map(([k, xs]) => [k, summary(xs)]));
const byFamily = Object.fromEntries(Object.entries(group(instances, (x) => x.rule.slice(0, 3))).sort().map(([k, xs]) => [k, summary(xs)]));
let controls = null;
if (f221) {
  const rowsOf = (f) => { const j = JSON.parse(fs.readFileSync(f, 'utf8')); return Array.isArray(j) ? j : Object.values(j).find(Array.isArray); };
  const rows = [...rowsOf(f221), ...(f72 ? rowsOf(f72) : [])];
  const CONTROLS = JSON.parse(fs.readFileSync(path.join(HERE, 'controlsF.json'), 'utf8'));
  controls = CONTROLS.map((c) => {
    const r = rows.find((x) => x.id === c.id);
    if (!r) return { ...c, missing: true };
    const want = fold(String(r.text).replace(/^"/, '')).replace(/[."]+$/, '').slice(0, 60);
    const inTowns = corpus.has(r.town);
    const found = instances.filter((x) => x.town === r.town && x.tab && fold(x.line).includes(want));
    const foundRule = found.filter((x) => c.rule === '-' || x.rule.startsWith(c.rule));
    const printed = inTowns && pages.get(r.town).some((l) => l.includes(want));
    return { ...c, town: r.town, verdict: r.verdict, text: String(r.text).slice(0, 140), rendered: inTowns, printed, found: foundRule.length > 0, foundAny: found.length > 0, as: [...new Set(found.map((x) => x.rule))],
      pass: !inTowns ? null : c.expect === 'find' ? foundRule.length > 0 : found.length === 0 };
  });
}
fs.writeFileSync(outFile, JSON.stringify({ towns, byFamily, byRule, controls, instances }, null, 1));
console.log(`LAW 10 · towns ${towns} · instances ${instances.length}`);
for (const [k, v] of Object.entries(byRule)) console.log(`  ${k.padEnd(18)} towns ${String(v.towns).padStart(4)} · instances ${String(v.instances).padStart(5)} · distinct ${String(v.distinct).padStart(4)} · printed in ${v.printedTowns} towns (${v.printedInstances}) · record only ${v.recordOnly}`);
if (controls) {
  for (const c of controls) console.log(`  ${c.missing ? 'MISSING ' : c.pass == null ? 'not-here' : c.pass ? 'PASS    ' : 'FAIL    '} ${c.id} ${c.verdict || ''} want:${c.expect} rule:${c.rule} as:${(c.as || []).join(',')} ${c.printed === false ? 'NOT-PRINTED ' : ''}:: ${(c.text || '').slice(0, 70)}`);
  const here = controls.filter((c) => c.pass != null);
  console.log(`  controls here ${here.length} · pass ${here.filter((c) => c.pass).length} · fail ${here.filter((c) => !c.pass).length}`);
}
if (instances.some((x) => x.rule === 'ERROR')) { console.error('detector ERROR rows present'); process.exit(1); }
