// BAR7-AUDIT-H runner · LAW 8 WIDENED (rules 8f to 8k, `tests/helpers/pageLaws/law8H.mjs`) over ANY PAGE-COPY render.
//   node docs/chair/2026-11-17/bar7/AUDIT/runH.mjs <render-dir> <out.json> [SECOND-CHECK.final51.json ...]
// <render-dir> holds dumps/<seed>.txt and corpus.ndjson.gz (PAGE-COPY's census3.sh --count-only). Writes every instance to
// <out.json>; prints counts by rule (towns, instances, distinct lines, things) and by cause (short: every mark it reads is
// the short mark, a house born short; crisis: a crisis's mark; mixed); the census of a marked house's person lines by kind
// (the mark set in front, or none; a line of the person's trade or not); and, given the second-check file(s), the controls
// table of controlsH.json (written beside <out.json> as .controls.json).
// Exit 1 when no dump is read; exit 3 when a STANDS control is missed or an EXPLAINED control is found.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const { readTown, fold } = await import(path.join(root, 'tests/helpers/pageLaws/pageB.mjs'));
const { law8H } = await import(path.join(root, 'tests/helpers/pageLaws/law8H.mjs'));

const [dir, outPath, ...checkFiles] = process.argv.slice(2);
if (!dir || !outPath) { console.error('usage: runH.mjs <render-dir> <out.json> [second-check.json ...]'); process.exit(2); }
const records = new Map();
for (const l of zlib.gunzipSync(fs.readFileSync(path.join(dir, 'corpus.ndjson.gz'))).toString().split('\n')) {
  if (!l.trim()) continue; const o = JSON.parse(l); records.set(o.seed, o.s);
}
const dumps = fs.readdirSync(path.join(dir, 'dumps')).filter((f) => f.endsWith('.txt')).sort();
if (!dumps.length) { console.error('no dumps'); process.exit(1); }
const norm = (s) => fold(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
// WHAT THE SEATS IN FLIGHT HOLD (BRIEF-BAR6-SEAM): SEAM-ECON item 8 (a running chain lists no output every maker of which is
// short: `tradeListDisplay.js :: chainOutputsShown`); SEAM-SCENES item 9 (a line that shows cloth MADE), item 2 (the tanners'
// lines), item 3 (the smiths' four dominant lines). Nothing else of these rules is held by a seat in flight.
const SMITHS_FOUR = /^(The hammering of the forges echoes through all of |Forge smoke hangs over everything here|Racks of new ironwork stand outside|The clang of iron from the smithies carries)/;
function heldBy(x) {
  if (x.rule === '8j.outputs') return 'SEAM-ECON 8';
  if (/^8k\.trade/.test(x.rule) && x.thing === 'clothMade') return 'SEAM-SCENES 9';
  if (/^8k\.trade/.test(x.rule) && x.thing === 'hides') return 'SEAM-SCENES 2';
  if (/^8k\.trade/.test(x.rule) && x.thing === 'iron' && SMITHS_FOUR.test(x.line)) return 'SEAM-SCENES 3';
  return null;
}
const all = [];
const census = [];
for (const f of dumps) {
  const seed = f.replace(/\.txt$/, '');
  const rec = records.get(seed);
  if (!rec) { console.error(`no record for ${seed}`); process.exit(1); }
  const T = readTown(fs.readFileSync(path.join(dir, 'dumps', f), 'utf8'), rec);
  const xs = law8H(T, seed);
  for (const c of xs.census || []) census.push({ ...c, town: seed, calm: T.crises.size === 0 });
  for (const x of xs) all.push({ ...x, form: String(x.line).split(rec.name || '\u0000').join('<town>'), crises: [...T.crises], heldBy: heldBy(x) });
}
fs.writeFileSync(outPath, JSON.stringify(all, null, 1));

const tally = (xs) => ({ towns: new Set(xs.map((x) => x.town)).size, n: xs.length, lines: new Set(xs.map((x) => x.form)).size, things: new Set(xs.map((x) => `${x.town}|${x.thing}`)).size });
const fmt = (t) => `towns ${String(t.towns).padStart(4)} · instances ${String(t.n).padStart(5)} · distinct lines ${String(t.lines).padStart(4)} · things ${String(t.things).padStart(4)}`;
console.log(`LAW 8 WIDENED (seat H) over ${dumps.length} towns: ${fmt(tally(all))}`);
for (const r of [...new Set(all.map((x) => x.rule))].sort()) {
  const xs = all.filter((x) => x.rule === r);
  // THE SPLIT BY CAUSE (the brief): BORN short in a calm town (the born-short audit holds the root; a rule by kind of house may
  // dissolve the mark itself) · short in a crisis town (a birth gap all the same) · a CRISIS mark (stopped, curtailed, scarce:
  // the mark stays and every surface must carry it: the next round's number)
  const calmT = (x) => !x.crises.some((c) => ['under_siege', 'famine', 'plague_onset', 'wartime', 'occupied'].includes(c));
  const by = [['born-calm', xs.filter((x) => x.cause === 'short' && calmT(x))], ['short-in-crisis', xs.filter((x) => x.cause === 'short' && !calmT(x))],
    ['crisis', xs.filter((x) => x.cause === 'crisis' || x.cause === 'mixed')], ['calm-other', xs.filter((x) => x.cause === 'calm')]].filter(([, v]) => v.length);
  const held = xs.filter((x) => x.heldBy);
  console.log(`  ${r.padEnd(16)} ${fmt(tally(xs))} · held by the seam ${held.length}${held.length ? ` (${[...new Set(held.map((x) => x.heldBy))].join(', ')})` : ''} · by cause ${by.map(([c, v]) => `${c} ${v.length}/${new Set(v.map((x) => x.town)).size}t`).join(' · ')}`);
}
console.log('PERSON LINES OF A MARKED HOUSE (8h census): kind · cause · mark in front / no mark (of them, a line of the person\'s own trade)');
for (const kind of ['deal', 'wants', 'secret', 'hook']) for (const cause of ['short', 'crisis']) {
  const xs = census.filter((c) => c.kind === kind && c.cause === cause);
  if (!xs.length) continue;
  const fr = xs.filter((c) => c.front), no = xs.filter((c) => !c.front);
  console.log(`  ${kind.padEnd(7)} ${cause.padEnd(7)} lines ${String(xs.length).padStart(5)} · mark in front ${String(fr.length).padStart(4)} (trade ${fr.filter((c) => c.trade).length}) · no mark ${String(no.length).padStart(4)} (trade ${no.filter((c) => c.trade).length}) · towns ${new Set(xs.map((c) => c.town)).size}`);
}
fs.writeFileSync(outPath.replace(/\.json$/, '.census.json'), JSON.stringify(census, null, 1));

if (checkFiles.length) {
  const rows = checkFiles.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
  const want = JSON.parse(fs.readFileSync(path.join(here, 'controlsH.json'), 'utf8'));
  const hitsOf = (r, fam) => {
    const t = norm(r.text);
    return all.filter((x) => x.town === r.town && x.rule.startsWith(fam) && (x.rowLines.some((l) => { const n = norm(l); return n.includes(t) || (t.length > 25 && t.includes(n) && n.length > 12) || (/^\d+$/.test(t) && n === t); })));
  };
  const table = []; let bad = 0;
  for (const [fam, groups] of Object.entries(want)) {
    if (fam === '_') continue;
    for (const [grp, ids] of Object.entries(groups)) for (const id of ids) {
      const r = rows.find((x) => x.id === id);
      if (!r) { table.push({ fam, grp, id, found: null, note: 'not in the files given' }); continue; }
      if (!dumps.includes(`${r.town}.txt`)) { table.push({ fam, grp, id, town: r.town, found: null, note: 'town not in this render' }); continue; }
      // an EXPLAINED control must be clear of EVERY rule of the seat
      const hits = hitsOf(r, grp === 'explained' ? '8' : fam);
      const found = hits.length > 0;
      if (grp === 'stands' && !found) bad++;
      if (grp === 'explained' && found) bad++;
      table.push({ fam, grp, id, town: r.town, found, rules: [...new Set(hits.map((h) => h.rule))].join(' '), cause: [...new Set(hits.map((h) => h.cause))].join(' '), text: String(r.text).slice(0, 90) });
    }
  }
  fs.writeFileSync(outPath.replace(/\.json$/, '.controls.json'), JSON.stringify(table, null, 1));
  console.log('CONTROLS (stands must be FOUND; explained must be clear of every rule of the seat)');
  for (const x of table) console.log(`  ${x.fam} ${x.grp.padEnd(9)} ${x.id.padEnd(7)} ${x.found === null ? 'n/a  ' : x.found ? 'FOUND' : 'clear'} ${(x.rules || '').padEnd(18)} ${(x.cause || '').padEnd(7)} ${x.text || x.note}`);
  console.log(`controls off: ${bad}`);
  if (bad) process.exitCode = 3;
}
