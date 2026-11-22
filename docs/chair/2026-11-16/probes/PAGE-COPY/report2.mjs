// CENSUS-2 report: hits (with writers, from writers2.mjs) -> holders, known-or-NEW, hits.by-file.json, counts.txt.
//   env OUT (the run dir), FILES (comma list: print only hits whose writer file is one of these),
//   HOLDERS (default: holders.at-count.json beside this file, from holders.mjs), COLD_CUT / COLD_INC (the cold lists:
//   ROUND-3-CUT.json, ROUND-3-CUT-INCREMENT.json; when absent every line is "unjoined", never NEW).
// KNOWN: the hit's sentence, names and figures folded, equals a cold line's (folded the same way), or the cold line has
// the same writer (file and function) and shares at least 60% of its words. A writer is NEW when no cold line of either
// list names that file and function as its writer. Holder: the lanes that change the writer's file against their own
// merge base with the line, narrowed (as ROUND-3-CUT's own-holders.mjs) to lanes with commits of their own on it.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const OUT = process.env.OUT;
const H = JSON.parse(fs.readFileSync(OUT + '/hits.json', 'utf8'));
const HOLD = (() => { try { return JSON.parse(fs.readFileSync(process.env.HOLDERS || HERE + '/holders.at-count.json', 'utf8')); } catch { return null; } })();
function holdersOf(file) { if (!HOLD) return ['(no holders file)']; const hs = Object.entries(HOLD).filter(([k, v]) => k !== '_line' && v.files?.includes(file)).map(([k]) => k);
  if (hs.length < 2) return hs.length ? hs : ['none'];
  const own = hs.filter((k) => { const mine = new Set(HOLD[k].commits?.[file] || []); const others = new Set(hs.filter((j) => j !== k).flatMap((j) => HOLD[j].commits?.[file] || [])); return [...mine].some((c) => !others.has(c)); });
  return own.length ? own : hs.map((k) => k + '(shared commits only)'); }
const fold = (t) => String(t).replace(/[‘’]/g, "'").replace(/(?<=\S\s)[A-Z][\p{L}'’-]+/gu, '{N}').replace(/\d[\d,.]*/g, '#').replace(/\b(?:thorp|hamlet|village|town|city|metropolis)\b/g, '{T}').replace(/\s+/g, ' ').trim();
const words = (t) => new Set(String(t).toLowerCase().match(/[a-z]{4,}/g) || []);
const cold = []; for (const [f, tag] of [[process.env.COLD_CUT, 'cut'], [process.env.COLD_INC, 'inc']]) { if (!f || !fs.existsSync(f)) continue;
  for (const x of JSON.parse(fs.readFileSync(f, 'utf8')).lines) cold.push({ id: tag === 'cut' ? `cut#${x.n}` : `${x.list}#${x.i}`, f: fold(x.sentence), w: words(x.sentence), file: x.writer?.file || '', fn: x.writer?.fn || '' }); }
const byFold = new Map(); for (const c of cold) if (!byFold.has(c.f)) byFold.set(c.f, c.id);
const coldWriters = new Set(cold.map((c) => `${c.file}::${c.fn}`)); const coldFiles = new Set(cold.map((c) => c.file));
const memo = {};
function known(h) { const s = h.sentence || h.line; const k = fold(s); if (memo[k] !== undefined) return memo[k]; if (!cold.length) return (memo[k] = 'unjoined');
  if (byFold.has(k)) return (memo[k] = byFold.get(k)); const W = words(s);
  for (const c of cold) { if (c.file !== h.writer?.file || c.fn !== h.writer?.fn || !c.file) continue; let inter = 0; for (const w of W) if (c.w.has(w)) inter++; if (inter / Math.max(1, Math.min(W.size, c.w.size)) >= 0.6) return (memo[k] = c.id + '~'); }
  for (const c of cold) { if (c.f.length > 40 && (k.includes(c.f) || c.f.includes(k))) return (memo[k] = c.id); }
  return (memo[k] = 'NEW'); }
for (const h of H) { const f = h.writer?.file || '(untraced)'; h.holder = f === '(untraced)' ? ['?'] : holdersOf(f); h.known = known(h);
  h.writerNew = !cold.length ? null : f === '(untraced)' ? null : !coldWriters.has(`${f}::${h.writer.fn}`); }
fs.writeFileSync(OUT + '/hits.json', JSON.stringify(H));
// hits.by-file.json: writer file -> { holders, patterns: { p: { towns, lines, writers: { fn: { towns, lines, known, new, example } } } } }
const BF = {};
for (const h of H) { const f = h.writer?.file || '(untraced)'; const b = (BF[f] ||= { holders: h.holder, newFile: cold.length ? !coldFiles.has(f) : null, patterns: {} });
  const p = (b.patterns[h.pattern] ||= { towns: new Set(), lines: new Set(), writers: {} }); p.towns.add(h.seed); p.lines.add(h.norm);
  const fn = h.writer?.fn || ''; const w = (p.writers[fn] ||= { towns: new Set(), lines: new Set(), known: new Set(), newLines: new Set(), writerNew: h.writerNew, subs: new Set(), example: null });
  w.towns.add(h.seed); w.lines.add(h.norm); w.subs.add(h.sub); if (h.known === 'NEW') w.newLines.add(h.norm); else if (h.known !== 'unjoined') w.known.add(h.known.replace(/~$/, ''));
  w.example ??= { seed: h.seed, view: h.view, sentence: (h.sentence || h.line).slice(0, 300), why: h.why, known: h.known }; }
const ser = (o) => JSON.parse(JSON.stringify(o, (k, v) => (v instanceof Set ? [...v] : v)));
const out = ser(BF); for (const b of Object.values(out)) for (const p of Object.values(b.patterns)) { p.towns = p.towns.length; p.lines = p.lines.length; for (const w of Object.values(p.writers)) { w.towns = w.towns.length; w.lines = w.lines.length; w.newLines = w.newLines.length; } }
fs.writeFileSync(OUT + '/hits.by-file.json', JSON.stringify(out, null, 1));
// counts.txt: one row a pattern, one row a writer file
const pats = {}; for (const h of H) { const p = (pats[h.pattern] ||= { towns: new Set(), lines: new Set(), writers: new Set(), newWriters: new Set(), newLines: new Set(), untraced: new Set() });
  p.towns.add(h.seed); p.lines.add(h.norm); const wk = `${h.writer?.file}::${h.writer?.fn}`; if (h.writer?.file === '(untraced)') p.untraced.add(h.norm); else { p.writers.add(wk); if (h.writerNew) p.newWriters.add(wk); } if (h.known === 'NEW') p.newLines.add(h.norm); }
const N = new Set(H.map((h) => h.seed)).size; const rows = [];
for (const [k, p] of Object.entries(pats).sort()) rows.push(`PATTERN ${k}: towns ${p.towns.size} · distinct lines ${p.lines.size} (NEW ${p.newLines.size}) · writers ${p.writers.size} (NEW ${p.newWriters.size}) · untraced lines ${p.untraced.size}`);
const FILES = process.env.FILES ? process.env.FILES.split(',').map((s) => s.trim()).filter(Boolean) : null;
for (const [f, b] of Object.entries(out).sort((x, y) => Object.values(y[1].patterns).reduce((a, p) => a + p.towns, 0) - Object.values(x[1].patterns).reduce((a, p) => a + p.towns, 0))) {
  if (FILES && !FILES.includes(f)) continue;
  rows.push(`FILE ${f} [${b.holders.join(',')}]${b.newFile ? ' NEW-FILE' : ''}: ` + Object.entries(b.patterns).map(([k, p]) => `${k} ${p.towns} towns/${p.lines} lines/${Object.keys(p.writers).length} fns`).join(' · ')); }
if (FILES) for (const h of H.filter((h) => FILES.includes(h.writer?.file))) rows.push(`  HIT ${h.pattern}/${h.sub} ${h.seed} ${h.view} [${h.writer.fn}] ${h.known}: ${(h.sentence || h.line).slice(0, 200)}`);
fs.writeFileSync(OUT + '/counts.txt', rows.join('\n') + '\n'); console.log(rows.filter((r) => !r.startsWith('  HIT')).slice(0, 60).join('\n'));
if (FILES) console.log(rows.filter((r) => r.startsWith('  HIT')).join('\n'));
if (!H.length) process.exit(1);
