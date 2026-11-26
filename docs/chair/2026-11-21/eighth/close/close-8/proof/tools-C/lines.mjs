// lines: every moved printed line (multiset diff per view) of BEFORE vs AFTER rows, as TSV seed size rec view +/- line
import { readdirSync, readFileSync } from 'node:fs';
const [B, A] = process.argv.slice(2);
const ms = (xs) => { const m = new Map(); for (const x of xs) m.set(x, (m.get(x) || 0) + 1); return m; };
for (const f of readdirSync(B).sort()) {
  const a = JSON.parse(readFileSync(`${B}/${f}`)); const b = JSON.parse(readFileSync(`${A}/${f}`));
  if (a.pageHash === b.pageHash) continue;
  const rec = a.recordHash !== b.recordHash ? 'R' : '-';
  for (const v of new Set([...Object.keys(a.printed), ...Object.keys(b.printed)])) {
    const X = ms(a.printed[v] || []), Y = ms(b.printed[v] || []);
    for (const [l, n] of X) for (let i = (Y.get(l) || 0); i < n; i++) console.log([a.seed, a.size, rec, v, '-', l.replace(/\t|\n/g, ' ')].join('\t'));
    for (const [l, n] of Y) for (let i = (X.get(l) || 0); i < n; i++) console.log([a.seed, a.size, rec, v, '+', l.replace(/\t|\n/g, ' ')].join('\t'));
  }
}
