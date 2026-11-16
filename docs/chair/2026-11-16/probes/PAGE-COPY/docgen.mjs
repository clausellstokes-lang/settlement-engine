// CENSUS-2 docgen: the counted run's hits (after report2.mjs) -> the document's tables and CENSUS-2.json.
//   node docgen.mjs <run-dir> <out.md> <CENSUS-2.json> [patterns=a,b,c]
// Tables: per pattern, every writer (file :: function) ONCE, with towns, distinct lines, holder, known-or-NEW, and one
// example (town, view, the sentence, and the fact against it). Then the NEW writers grouped by holder.
import fs from 'node:fs'; import { loadCorpus } from './load.mjs'; import { crisisOf } from './patterns.mjs';
const [RUN, MD, JS, pats = 'a,b,c,d,e,f,g,h'] = process.argv.slice(2); const P = pats.split(',');
const H = JSON.parse(fs.readFileSync(RUN + '/hits.json', 'utf8')).filter((h) => P.includes(h.pattern));
const C = Object.fromEntries(loadCorpus(RUN + '/corpus.ndjson.gz').map((x) => [x.seed, x.s]));
const KIND = { a: 'names what the town lacks', b: 'normal times under a crisis', c: 'a size word in a small place', d: 'broken text', e: 'denies what the town has', f: "the house's label", g: 'machinery on the page', h: "an empty seat's keeper by the bare title" };
function fact(h) { const s = C[h.seed]; if (!s) return '';
  if (h.pattern === 'a') return `${h.why}; roster: ${(s.institutions || []).map((i) => i.name).join(', ').slice(0, 160)}`;
  if (h.pattern === 'b') { const c = crisisOf(s); return `${h.why}; stress ${[...c.types].join('+')}: "${c.text.slice(0, 110)}"`; }
  if (h.pattern === 'c') return `${s.tier} of ${s.population}`;
  return h.fact || h.why; }
const esc = (t) => String(t).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const W = {}; for (const h of H) { const fn = h.writer?.fn || ''; const k = `${h.pattern}|${h.writer?.file}|${fn}`;
  const w = (W[k] ||= { p: h.pattern, file: h.writer?.file, fn, towns: new Set(), lines: new Set(), known: new Set(), newLines: new Set(), holder: h.holder, writerNew: h.writerNew, ex: null, subs: new Set(), evidence: h.writer?.evidence || '' });
  w.towns.add(h.seed); w.lines.add(h.norm); w.subs.add(h.sub); if (h.known === 'NEW') w.newLines.add(h.norm); else if (h.known && h.known !== 'unjoined') w.known.add(h.known.replace(/~$/, ''));
  if (!w.ex || (w.ex.known !== 'NEW' && h.known === 'NEW')) w.ex = { seed: h.seed, view: h.view, s: (h.sentence || h.line).slice(0, 220), f: fact(h), known: h.known }; }
const rows = Object.values(W).sort((a, b) => a.p.localeCompare(b.p) || b.towns.size - a.towns.size);
let md = '';
for (const p of P) { const R = rows.filter((r) => r.p === p); if (!R.length) continue;
  md += `\n#### Kind ${p} (${KIND[p]}): ${R.length} writers\n\n| # | writer (file :: function or pool) | holder | towns | lines | cold list | example (town · view): the line — the fact |\n|---|---|---|---|---|---|---|\n`;
  R.forEach((r, i) => { const kn = r.writerNew === null ? '?' : r.writerNew ? `NEW writer${r.known.size ? ` (lines known: ${[...r.known].slice(0, 3).join(', ')})` : ''}` : `known writer; ${r.known.size ? [...r.known].slice(0, 3).join(', ') : 'these lines NEW'}`;
    md += `| ${p}${i + 1} | \`${esc(r.file)}\` :: ${esc(r.fn || '—')} | ${esc(r.holder.join(', '))} | ${r.towns.size} | ${r.lines.size} (${r.newLines.size} NEW) | ${esc(kn)} | ${esc(r.ex.seed)} · ${esc(r.ex.view)}: "${esc(r.ex.s)}" — ${esc(r.ex.f.slice(0, 200))} |\n`; }); }
// NEW writers by holder
const byHolder = {}; for (const r of rows.filter((r) => r.writerNew)) { const h = r.holder.join(', '); (byHolder[h] ||= []).push(r); }
md += `\n### NEW writers by holder (writers no cold line names; one package a lane)\n\n`;
const order = Object.entries(byHolder).sort((a, b) => b[1].reduce((s, r) => s + r.towns.size, 0) - a[1].reduce((s, r) => s + r.towns.size, 0));
for (const [h, rs] of order) { const rank = (p) => ({ b: 0, c: 1, a: 2, e: 3, d: 4, f: 5, g: 6, h: 7 }[p]);
  rs.sort((x, y) => rank(x.p) - rank(y.p) || y.towns.size - x.towns.size);
  md += `- **${h === 'none' ? 'no lane holds the file' : 'lane ' + h}** — ${rs.length} NEW writers: ` + rs.map((r) => `${r.p} \`${r.file}\` :: ${r.fn || '—'} (${r.towns.size} towns)`).join('; ') + '\n'; }
fs.writeFileSync(MD, md);
const J = { about: 'CENSUS-2 hits at the counted tree: each a CANDIDATE found by a pattern, not a fault until read. known = a cold-list id (cut#n, ww#i, pf#i; "~" = same writer, 60% shared words) or NEW.', hits: H.map((h) => ({ pattern: h.pattern, sub: h.sub, town: h.seed, view: h.view, line: (h.sentence || h.line).slice(0, 240), writer: h.writer ? `${h.writer.file} :: ${h.writer.fn || ''}` : null, holder: (h.holder || []).join(','), known: h.known })) };
fs.writeFileSync(JS, JSON.stringify(J));
console.log('writers', rows.length, Object.fromEntries(P.map((p) => [p, rows.filter((r) => r.p === p).length])), 'NEW writers', rows.filter((r) => r.writerNew).length, Object.fromEntries(P.map((p) => [p, rows.filter((r) => r.p === p && r.writerNew).length])));
