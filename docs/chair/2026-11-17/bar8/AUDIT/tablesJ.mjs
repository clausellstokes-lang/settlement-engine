// BAR8-AUDIT-J tables · each distinct line runJ.mjs counted, traced to its writer IN A TREE (the longest fixed runs of the
// line, the town's names folded out as runJ folds them, searched with `git grep -F` in src/; data, then code; a line no run
// finds is "(untraced)", never guessed).
//   node docs/chair/2026-11-17/bar8/AUDIT/tablesJ.mjs <out.json from runJ> <tree-root> <TABLES.md>
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const [outPath, tree, mdPath] = process.argv.slice(2);
if (!outPath || !tree || !mdPath) { console.error('usage: tablesJ.mjs <out.json> <tree-root> <TABLES.md>'); process.exit(2); }
const forms = JSON.parse(fs.readFileSync(outPath.replace(/\.json$/, '.forms.json'), 'utf8'));
const all = JSON.parse(fs.readFileSync(outPath, 'utf8'));
const cache = new Map();
const grep = (t) => {
  if (cache.has(t)) return cache.get(t);
  let r = [];
  try { r = execFileSync('git', ['-C', tree, 'grep', '-n', '-F', t, '--', 'src'], { encoding: 'utf8', maxBuffer: 5e7 }).trim().split('\n').filter(Boolean); } catch { r = []; }
  cache.set(t, r); return r;
};
const LABEL = /^(?:How they deal|Secret:|Wants|Services ·)\s*/;
function runsOf(form) {
  // the mark set in front ("Short of iron. "), a row's label ("Fish & Maritime Produce "), a sentence apart: each piece tried
  const body = form.replace(LABEL, '').replace(/^(?:Short of [a-z ]+|Stopped by the [a-z]+|Curtailed by the [a-z]+)\.\s*/, '');
  const pieces = body.split(/<name>|[·“”"]|\d+%?|(?<=[.;:])\s+/).map((s) => s.trim()).filter(Boolean);
  const out = [];
  for (const p of pieces) { out.push(p); const w = p.split(' '); for (let k = 1; k <= 4 && k < w.length - 2; k++) out.push(w.slice(k).join(' ')); }
  return [...new Set(out)].filter((s) => s.length >= 14).sort((a, b) => b.length - a.length);
}
function writerOf(form) {
  for (const run of runsOf(form).slice(0, 12)) {
    const hits = grep(run);
    if (!hits.length) continue;
    const rank = (h) => (/^src\/data\//.test(h) ? 0 : /^src\/generators\//.test(h) ? 1 : 2);
    const best = hits.slice().sort((a, b) => rank(a) - rank(b))[0];
    const [file, line] = best.split(':');
    return { file, line: Number(line), alsoIn: hits.length - 1 };
  }
  return null;
}
const rows = forms.map((f) => ({ ...f, writer: writerOf(f.form) }));
fs.writeFileSync(outPath.replace(/\.json$/, '.writers.json'), JSON.stringify(rows, null, 1));
const byRule = new Map();
for (const r of rows) { const a = byRule.get(r.rule) || []; a.push(r); byRule.set(r.rule, a); }
const md = [`# TABLES-J · the distinct lines of LAW 11 over \`${outPath}\`, each with its writer at \`${tree}\``, '',
  `${all.length} instances in ${new Set(all.map((x) => x.town)).size} towns; ${rows.length} distinct lines. A writer is the first file \`git grep -F\` finds for the line's longest fixed run (data first); "(untraced)" where none is found.`, ''];
for (const [rule, rs] of [...byRule].sort()) {
  md.push(`## ${rule}`, '', '| towns | instances | tabs | kinds | the line (names folded) | writer |', '|---:|---:|---|---|---|---|');
  for (const r of rs) md.push(`| ${r.towns} | ${r.n} | ${r.tabs} | ${r.kinds} | ${r.form.replace(/\|/g, '/').slice(0, 160)} | ${r.writer ? `\`${r.writer.file}:${r.writer.line}\`${r.writer.alsoIn ? ` (+${r.writer.alsoIn})` : ''}` : '(untraced)'} |`);
  md.push('');
}
fs.writeFileSync(mdPath, `${md.join('\n')}\n`);
console.log(`tables: ${rows.length} lines, ${rows.filter((r) => !r.writer).length} untraced -> ${mdPath}`);
