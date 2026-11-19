// BAR6-AUDIT-C runner: LAWS 6 and 7 over any PAGE-COPY render (dumps/ + corpus.ndjson.gz).
//   node docs/chair/2026-11-16/bar6/AUDIT/runC.mjs <render-dir> <out.json> [second-check.json ...]
// Writes every instance to <out.json>; prints counts by rule (towns, instances, distinct lines). Given second-check
// files (SECOND-CHECK.final221.json, SECOND-CHECK.final72.json) it also writes <out>.controls.json and prints the
// controls table of `controlsC.json`: a control is FOUND when an instance of its rule in its town holds the control's
// text in its line or its `against` line. Each instance also says which earlier law finds the same line (L2, L3, L4n:
// the round in flight's detectors), and TRACE=1 adds the writer file of each distinct line (git grep in the tree).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const L = (f) => import(path.join(root, 'tests/helpers/pageLaws', f));
const { readTownC } = await L('pageC.mjs');
const { fold } = await L('pageB.mjs');
const { law6 } = await L('law6.mjs');
const { law7 } = await L('law7.mjs');
const { law2 } = await L('law2.mjs');
const { law3 } = await L('law3.mjs');
const { law4n } = await L('law4.mjs');
const { dossierTabs, parseDump } = await L('page.mjs');
const { cardMark } = await L('law8H.mjs');
/**
 * LEFT-KEYS K6 (b), 2026-11-18: A SCENE OF FORGES IS DENIED ONLY WHERE EVERY FORGE HOUSE ON THE PAGE CARRIES A MARK. `6b-denied`
 * (`law6.mjs`) took the page's first denial of iron (the mine's gap line, a "Short of iron" anywhere) as a denial of the forge
 * scene, where the Blacksmiths and the Smelter are at work on bought-in iron (r2r-metropolis-45, -53, -59, -6: the chair
 * probed all four). The forge houses are the scene's own makers (`law6.mjs :: GOODS.ironwork.maker`), read off the
 * Institutions cards; a mark is the card's own (`law8H.mjs :: cardMark(...).any`). A town with no forge card keeps its row.
 * (`law6.mjs` is not this seat's: a reading here, counted apart.)
 */
const FORGE_SCENE = /\b(new ironwork|ironwork|anvils?|forge fires|forges)\b/i;
const FORGE_HOUSE = /smith|forge|foundry|smelter|armou?rer|metal/i;
const clearedK6b = [];
const forgeAtWork = (T) => { const forges = (T.cards || []).filter((c) => FORGE_HOUSE.test(c.name)); const bare = forges.filter((c) => !cardMark(c).any); return bare.length ? bare.map((c) => c.name) : null; };

const [outDir, resultPath, ...controlFiles] = process.argv.slice(2);
if (!outDir || !resultPath) { console.error('usage: runC.mjs <render-dir> <out.json> [second-check.json ...]'); process.exit(2); }

const records = new Map();
for (const l of zlib.gunzipSync(fs.readFileSync(path.join(outDir, 'corpus.ndjson.gz'))).toString().split('\n')) {
  if (!l.trim()) continue; const o = JSON.parse(l); records.set(o.seed, o.s);
}
const dumps = fs.readdirSync(path.join(outDir, 'dumps')).filter((f) => f.endsWith('.txt')).sort();
if (!dumps.length) { console.error('no dumps'); process.exit(1); }
const norm = (s) => fold(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const all = [];
const earlierByTown = new Map(); // the earlier laws' instances in each town with one of mine (a control held by LAW 2 is read there)
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',')) : null;
for (const f of dumps) {
  const seed = f.replace(/\.txt$/, '');
  if (ONLY && !ONLY.has(seed)) continue;
  const rec = records.get(seed);
  if (!rec) { console.error(`no record for ${seed}`); process.exit(1); }
  const text = fs.readFileSync(path.join(outDir, 'dumps', f), 'utf8');
  const T = readTownC(text, rec);
  // one instance a (rule, tab, line) in a town: an opened part prints a list again, and that is one line read twice
  const seenHere = new Set();
  const atWork = forgeAtWork(T);
  const mine = [...law6(T, seed), ...law7(T, seed)].filter((x) => { const k = `${x.rule}|${x.tab}|${x.line}`; if (seenHere.has(k)) return false; seenHere.add(k); return true; })
    .filter((x) => { if (x.rule === '6b-denied' && FORGE_SCENE.test(x.line) && atWork) { clearedK6b.push({ ...x, atWork }); return false; } return true; });
  if (!mine.length && !controlFiles.length) continue; // with controls, every town's earlier laws are read
  // the earlier laws over the same town: which of my lines they already find
  let earlier = [];
  try { earlier = [...law2(T, seed), ...law3(T, seed)]; } catch { earlier = []; }
  try { earlier.push(...law4n({ record: rec, tabs: dossierTabs(parseDump(text).tabs), town: seed }).map((x) => ({ ...x, rule: x.law }))); } catch { /* law4n reads the dossier only */ }
  earlierByTown.set(seed, earlier);
  for (const x of mine) {
    const n = norm(x.line);
    const by = earlier.filter((e) => { const m = norm(e.line); return m && (m.includes(n) || n.includes(m)); }).map((e) => e.rule);
    all.push({ ...x, crises: [...T.crises], tier: T.tier, pop: T.pop, earlier: [...new Set(by)] });
  }
}

// the writer of each distinct line (TRACE=1): the longest fixed run of the line, names folded, found in src/
if (process.env.TRACE) {
  const cache = new Map();
  const grep = (t) => { try { return execFileSync('git', ['-C', root, 'grep', '-n', '-F', '-i', t, '--', 'src'], { encoding: 'utf8', maxBuffer: 5e7 }).trim().split('\n').filter(Boolean); } catch { return []; } };
  for (const x of all) {
    if (x.tab === 'record') { x.writer = 'record'; continue; }
    const key = x.line; if (cache.has(key)) { x.writer = cache.get(key); continue; }
    const rec = records.get(x.town) || {};
    const names = [rec.name, ...(rec.npcs || []).map((n) => n.name), ...(rec.institutions || []).map((i) => i.name)].filter((s) => s && String(s).length > 2).map(String).sort((a, b) => b.length - a.length);
    let s = x.line; for (const n of names) s = s.split(n).join('\u0001');
    s = s.replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/gi, '\u0001').replace(/[\d,.]+%?/g, '\u0001').replace(/[“”"→·▲▸:;]/g, '\u0001');
    const runs = s.split('\u0001').map((t) => t.trim()).filter((t) => t.length >= 14).sort((a, b) => b.length - a.length).slice(0, 3);
    let w = '(untraced)';
    for (const r of runs) { const h = grep(r).filter((l) => !/\.test\./.test(l)); if (h.length) { w = [...new Set(h.map((l) => l.split(':')[0]))].slice(0, 2).join(' + '); break; } }
    cache.set(key, w); x.writer = w;
  }
}
fs.writeFileSync(resultPath, JSON.stringify(all, null, 1));
fs.writeFileSync(resultPath.replace(/\.json$/, '.k6b-cleared.json'), JSON.stringify(clearedK6b, null, 1));

const PRINTED = []; const say = (t) => { PRINTED.push(t); console.log(t); };
process.on('exit', () => fs.writeFileSync(resultPath.replace(/\.json$/, '.txt'), PRINTED.join('\n') + '\n'));
const by = (k, xs = all) => { const m = new Map(); for (const x of xs) { const key = k(x); const v = m.get(key) || { n: 0, towns: new Set(), lines: new Set() }; v.n++; v.towns.add(x.town); v.lines.add(norm(x.line)); m.set(key, v); } return m; };
say(`towns ${dumps.length} · instances ${all.length} · towns with one ${new Set(all.map((x) => x.town)).size}`);
say(`  (K6 (b): ${clearedK6b.length} 6b-denied forge scenes cleared in ${new Set(clearedK6b.map((x) => x.town)).size} towns: a forge house on the page at work, unmarked)`);
for (const [k, v] of [...by((x) => x.law)].sort()) say(`${k}: towns ${v.towns.size} · instances ${v.n} · distinct lines ${v.lines.size}`);
for (const [k, v] of [...by((x) => x.rule)].sort()) say(`  ${k.padEnd(13)} towns ${String(v.towns.size).padStart(4)} · instances ${String(v.n).padStart(4)} · distinct lines ${String(v.lines.size).padStart(4)} · found by an earlier law ${all.filter((x) => x.rule === k && x.earlier.length).length}`);

if (controlFiles.length) {
  const rows = controlFiles.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
  const want = JSON.parse(fs.readFileSync(path.join(here, 'controlsC.json'), 'utf8'));
  const table = [];
  for (const [rule, groups] of Object.entries(want)) for (const [kind, ids] of Object.entries(groups)) for (const id of ids) {
    const r = rows.find((x) => x.id === id && (!ONLY || ONLY.has(x.town)));
    if (!r) { table.push({ rule, kind, id, found: null, note: 'not in the files' }); continue; }
    if (!records.has(r.town)) { table.push({ rule, kind, id, town: r.town, found: null, note: 'town not in this render' }); continue; }
    const t = norm(r.text);
    const hits = all.filter((x) => x.town === r.town && (norm(x.line).includes(t) || (t.includes(norm(x.line)) && norm(x.line).length > 20) || norm(x.against?.line).includes(t)));
    // a control of kind "stands_by_L2" is held by LAW 2's own rule: found when LAW 2 finds it in its town
    const l2 = kind === 'stands_by_L2' ? (earlierByTown.get(r.town) || []).filter((x) => /^L2/.test(x.rule) && (norm(x.line).includes(t) || t.includes(norm(x.line)))) : [];
    if (l2.length) hits.push(...l2);
    const own = hits.filter((h) => h.rule.startsWith(rule) || (kind === 'stands_by_L2' && /^L2/.test(h.rule)));
    table.push({ rule, kind, id, town: r.town, section: r.section, found: own.length > 0, rules: [...new Set(hits.map((h) => h.rule))].join(' '), text: r.text.slice(0, 90) });
  }
  fs.writeFileSync(resultPath.replace(/\.json$/, '.controls.json'), JSON.stringify(table, null, 1));
  for (const x of table) {
    const ok = x.found === null ? 'n/a  ' : (/^stands/.test(x.kind) ? (x.found ? 'FOUND' : 'MISS ') : x.kind === 'explained' ? (x.found ? 'FALSE' : 'clear') : (x.found ? 'found' : 'unfnd'));
    say(`${x.rule.padEnd(4)} ${x.kind.padEnd(9)} ${x.id.padEnd(7)} ${ok} ${(x.rules || '').padEnd(14)} · ${x.text || x.note}`);
  }
}
