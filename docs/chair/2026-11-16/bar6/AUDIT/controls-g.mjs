// BAR6-AUDIT-G · THE LEXICON'S REACH (BRIEF-BAR6-AUDIT seat G, point 3).
//   node controls-g.mjs <tree> <inventory.json> <SECOND-CHECK.final221.json> <SECOND-CHECK.final72.json> <out.json>
// Every STANDS row of kinds K2 and K4 in the wide read (final221), and the bar read's STANDS rows of those families
// (final72: `BAR72` below, classed by this seat from each row's note), looked up in the inventory: the source line
// (its longest fixed fragment found in the printed text), the classes its words fall in, and its status a class.
// A row whose printed text holds a class word but whose source line is not in the inventory (a list item of three
// words or fewer, a record value) is said so, with the tree's file that holds its text where a plain search finds one.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const [treeArg, invPath, p221, p72, outPath] = process.argv.slice(2);
if (!outPath) { console.error('usage: controls-g.mjs <tree> <inventory.json> <final221.json> <final72.json> <out.json>'); process.exit(2); }
const TREE = path.resolve(treeArg);
const voc = await import(pathToFileURL(path.join(TREE, 'src/domain/facts/factVocabulary.js')).href);
const { makeLaw5w } = await import(pathToFileURL(path.join(path.dirname(new URL(import.meta.url).pathname), '../../../../../tests/helpers/pageLaws/law5w.mjs')).href);
const LEX = makeLaw5w(voc);
const inv = JSON.parse(fs.readFileSync(invPath, 'utf8'));
const r221 = JSON.parse(fs.readFileSync(p221, 'utf8'));
const r72 = JSON.parse(fs.readFileSync(p72, 'utf8'));
// the bar read's rows of the two families (this seat's classing, from each row's note): K2 a calm or ordinary line
// under a crisis; K4 a thing, a size, an office or a sovereign the town lacks
export const BAR72 = { K2: ['C40276', 'C43575', 'C17290', 'C0333', 'C5441', 'C0350', 'C3223', 'C5452', 'C42116'], K4: ['C43925', 'C44306', 'C15951', 'C39608', 'C39734', 'C42840', 'C37887'] };
const rows = [
  ...r221.filter((r) => r.verdict === 'STANDS' && /^K[24]\b/.test(r.kind || '')).map((r) => ({ ...r, read: 'wide', fam: r.kind.slice(0, 2) })),
  ...Object.entries(BAR72).flatMap(([fam, ids]) => ids.map((id) => ({ ...r72.find((r) => r.id === id), read: 'bar', fam }))),
];
const frags = (t) => t.split(/…|\{[^}]*\}|\$\{[^}]*\}/).map((s) => s.trim()).filter((s) => s.length >= 15).sort((a, b) => b.length - a.length);
const out = [];
for (const r of rows) {
  const text = String(r.text).replace(/^Services · /, '');
  // both ways: the source's longest fixed fragment in the printed text, or the printed text's longest run (names,
  // tier nouns and figures folded out, as PAGE-COPY's writers2.mjs folds them) in the source line
  const runs = text.replace(/\b(thorp|hamlet|village|town|city|metropolis|settlement)\b/gi, '\u0001').replace(/(?<=[a-z,;:] )[A-Z][\w'’-]+/g, '\u0001').replace(/^[A-Z][\w'’-]+(?='s|\b has| is| at)/, '\u0001').replace(/[\d,.]+%?|[“”"→·▲▸]/g, '\u0001')
    .split('\u0001').map((t) => t.trim()).filter((t) => t.length >= 16).sort((a, b) => b.length - a.length);
  let src = inv.filter((h) => { const f = frags(h.text)[0]; return f && text.includes(f); });
  if (!src.length && runs.length) src = inv.filter((h) => h.text.toLowerCase().includes(runs[0].toLowerCase()));
  const printedClasses = LEX.classesOf(text);
  let grepFile = null;
  if (!src.length) { const key = text.replace(/^(Wants|Secret:) /, '').split(/ · |[.;:]/).map((s) => s.trim()).sort((a, b) => b.length - a.length)[0];
    if (key && key.length >= 12) { try { grepFile = execFileSync('grep', ['-rlF', '--include=*.js', key.slice(0, 60), 'src'], { cwd: TREE, encoding: 'utf8' }).trim().split('\n').slice(0, 3).join(', '); } catch { grepFile = '(not in src as written)'; } } }
  out.push({ id: r.id, read: r.read, fam: r.fam, town: r.town, text: text.slice(0, 160), printedClasses,
    source: src.map((h) => ({ file: h.file, pool: h.pool, line: h.line, classes: h.classes, status: h.status, via: String(h.via).slice(0, 160) })), grepFile });
}
fs.writeFileSync(outPath, JSON.stringify(out, null, 1));
for (const o of out) {
  const s = o.source[0];
  const st = s ? Object.entries(s.status).map(([c, v]) => `${c}:${v}`).join(' ') : '-';
  console.log(`${o.id} ${o.read} ${o.fam} · printed classes [${o.printedClasses.join(',') || 'MISS'}] · ${s ? `${s.file}:${s.line ?? s.pool} {${st}}` : `NOT IN THE INVENTORY · ${o.grepFile || '-'}`} · ${o.text.slice(0, 70)}`);
}
