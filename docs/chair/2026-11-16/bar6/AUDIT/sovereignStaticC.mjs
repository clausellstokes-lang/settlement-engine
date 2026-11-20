// static census of the sovereign words in src/ string literals: lines, files, declared or not
import { execFileSync } from 'node:child_process';
const [root, which] = process.argv.slice(2);
const RE = { lord: /\b(lord|lords|lord's|liege|lieges|overlord|overlords)\b/, crown: /\b(crown|crown's|noble oversight)\b/ }[which];
const out = execFileSync('git', ['-C', root, 'grep', '-n', '-E', '-i', which === 'lord' ? '(lord|liege|overlord)' : '(crown|noble oversight)', '--', 'src', ':!*.test.*'], { encoding: 'utf8', maxBuffer: 1e8 }).split('\n').filter(Boolean);
const rows = [];
for (const l of out) {
  const m = /^([^:]+):(\d+):(.*)$/.exec(l); if (!m) continue;
  const code = m[3];
  if (/^\s*(\/\/|\*|\/\*)/.test(code)) continue; // a comment line
  // the word inside a string literal ('…', "…" or `…`), in lower case (a title "Lord Mayor" is a name)
  const strs = [...code.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)].map((x) => x[1] ?? x[2] ?? x[3]);
  const hit = strs.find((s) => RE.test(s) && !/^[a-z_]+$/.test(s)); if (!hit) continue;
  const declared = /\b(needs|excludes|crisis|twinOf|colour|requires|gate)\s*:/.test(code);
  rows.push({ file: m[1], line: +m[2], declared, text: hit.slice(0, 120) });
}
const files = new Map(); for (const r of rows) { const v = files.get(r.file) || { n: 0, und: 0 }; v.n++; if (!r.declared) v.und++; files.set(r.file, v); }
console.log(`${which}: ${rows.length} lines in ${files.size} files; undeclared ${rows.filter((r) => !r.declared).length} lines in ${[...files.values()].filter((v) => v.und).length} files`);
for (const [f, v] of [...files].sort((a, b) => b[1].und - a[1].und).slice(0, 25)) console.log(`  ${String(v.und).padStart(3)}/${String(v.n).padStart(3)} ${f}`);
if (process.env.ROWS) for (const r of rows) console.log(`${r.file}:${r.line} ${r.declared ? 'D' : '-'} ${r.text}`);
