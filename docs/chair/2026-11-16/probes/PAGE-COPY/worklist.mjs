// CENSUS-3 worklist: ONE TABLE, a row a WRITER (file :: function or pool id, as writers2.mjs names it), sorted by the
// estimate of FALSE TOWNS. Per kind (and law): the towns of the corpus with a hit; the estimate = for each town the
// writer hits, the highest precision among the kinds it hits there (a hit is a fault only when read: the precision is
// the read's); the surfaces; one example town and its sentence; the holder (report2.mjs with HOLDERS=<holders.json>);
// whether the bar's first read (bar-0-rows, its HIGH and MEDIUM rows by lane) or the join's table (JOIN-ROWS.json)
// already names the writer. A kind whose precision is under 0.8 is WEAK: kept out of the ranked table, listed apart.
//   node worklist.mjs <run-dir> <precision.json> <bar0rows.json> <JOIN-ROWS.json> [kinds=all] [top=60]
// precision.json: { kind: { p: 0.93, read: "28 of 30 ..." } }. Writes <run-dir>/worklist.json and prints the top rows.
import fs from 'node:fs';
const [OUT, PF, BF, JF, kindsArg = 'all', topN = '60'] = process.argv.slice(2);
const H = JSON.parse(fs.readFileSync(OUT + '/hits.json', 'utf8'));
const P = JSON.parse(fs.readFileSync(PF, 'utf8')); const BAR = JSON.parse(fs.readFileSync(BF, 'utf8')); const JOIN = JSON.parse(fs.readFileSync(JF, 'utf8'));
const KINDS = kindsArg === 'all' ? null : new Set(kindsArg.split(','));
const words = (t) => new Set(String(t).toLowerCase().match(/[a-z]{4,}/g) || []);
const fold = (t) => String(t).replace(/[‘’]/g, "'").replace(/(?<=\S\s)[A-Z][\p{L}'’-]+/gu, '{N}').replace(/\d[\d,.]*/g, '#').replace(/\s+/g, ' ').trim();
const barF = BAR.map((r) => ({ id: `bar#${r.n}`, file: r.writer_file || '', f: fold(r.sentence), w: words(r.sentence), sev: r.severity }));
const joinW = JOIN.flatMap((r) => (r.writer_on_join || []).map((w) => ({ id: r.id, file: w.file, unit: String(w.unit || '') })));
function knownBy(file, fn, sents) { const out = new Set();
  for (const s of sents) { const f = fold(s); const W = words(s); for (const b of barF) { if (b.f === f) { out.add(b.id); continue; } if (b.file && b.file === file) { let i = 0; for (const x of W) if (b.w.has(x)) i++; if (i / Math.max(1, Math.min(W.size, b.w.size)) >= 0.6) out.add(b.id); } } }
  for (const j of joinW) if (j.file === file && (!fn || j.unit.includes(fn.split(' ')[0]) || j.unit.includes(fn))) out.add(`join:${j.id}`);
  return [...out]; }
const prec = (k) => (P[k]?.p ?? null);
const W = {};
for (const h of H) { if (KINDS && !KINDS.has(h.pattern)) continue; if (h.pattern === 'a' && (h.surface === 'pdf' || h.surface === 'journal') && String(h.line).trim().split(/\s+/).length <= 2) continue;   /* a PDF or journal heading ('Church', 'Mining') is a category title, not a claim (read) */ const p = prec(h.pattern); if (p == null || p < 0.8) continue;
  const file = h.writer?.file || '(untraced)'; const fn = h.writer?.fn || ''; const key = file === '(untraced)' ? `(untraced) :: ${fold(h.sentence || h.line).slice(0, 80)}` : `${file} :: ${fn}`;
  const w = (W[key] ||= { writer: key, file, fn, kinds: {}, towns: new Map(), surfaces: new Set(), example: null, holder: h.holder || [], sents: new Set() });
  (w.kinds[h.pattern] ||= new Set()).add(h.seed); w.towns.set(h.seed, Math.max(w.towns.get(h.seed) || 0, p)); w.surfaces.add(h.surface || 'tab'); if (w.sents.size < 40) w.sents.add(h.sentence || h.line);
  if (!w.example || (h.surface || 'tab') === 'tab' && w.example.surface !== 'tab') w.example = { seed: h.seed, view: h.view, surface: h.surface || 'tab', kind: `${h.pattern}/${h.sub}`, sentence: String(h.sentence || h.line).slice(0, 220) }; }
const rows = Object.values(W).map((w) => ({ writer: w.writer, file: w.file, fn: w.fn, towns: w.towns.size, falseTowns: +[...w.towns.values()].reduce((a, b) => a + b, 0).toFixed(1),
  kinds: Object.fromEntries(Object.entries(w.kinds).map(([k, s]) => [k, s.size])), surfaces: [...w.surfaces].sort(), holder: w.holder, known: w.file === '(untraced)' ? [] : knownBy(w.file, w.fn, w.sents), example: w.example }))
  .sort((a, b) => b.falseTowns - a.falseTowns || b.towns - a.towns);
const weak = Object.entries(P).filter(([, v]) => v.p != null && v.p < 0.8).map(([k, v]) => ({ kind: k, ...v, towns: new Set(H.filter((h) => h.pattern === k).map((h) => h.seed)).size }));
fs.writeFileSync(OUT + '/worklist.json', JSON.stringify({ precision: P, weak, rows }, null, 1));
const md = ['| # | writer (file :: function) | false towns (est.) | towns hit | kinds (towns) | surfaces | holder | named by | example |', '|---|---|---|---|---|---|---|---|---|'];
rows.slice(0, +topN).forEach((r, i) => md.push(`| ${i + 1} | \`${r.writer.replace(/\|/g, '\\|')}\` | ${r.falseTowns} | ${r.towns} | ${Object.entries(r.kinds).map(([k, n]) => `${k} ${n}`).join(', ')} | ${r.surfaces.join(', ')} | ${r.holder.join(', ')} | ${r.known.slice(0, 3).join(', ') || 'NEW'}${r.known.length > 3 ? ` +${r.known.length - 3}` : ''} | ${r.example.seed} (${r.example.view}): "${r.example.sentence.replace(/\|/g, '/').slice(0, 140)}" |`));
fs.writeFileSync(OUT + '/worklist.top.md', md.join('\n') + '\n');
console.log(`worklist: ${rows.length} writers; ${rows.filter((r) => r.file === '(untraced)').length} untraced lines grouped apart; weak kinds kept out: ${weak.map((w) => w.kind).join(', ') || 'none'}`);
for (const r of rows.slice(0, 15)) console.log(`${r.falseTowns}\t${r.towns}\t${r.writer.slice(0, 90)}\t[${r.holder.join(',')}]\t${Object.entries(r.kinds).map(([k, n]) => k + ' ' + n).join(', ')}\t${r.known.slice(0, 2).join(',') || 'NEW'}`);
