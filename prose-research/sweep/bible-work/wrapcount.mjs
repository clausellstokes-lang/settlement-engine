import { readFileSync, readdirSync } from 'node:fs'; import path from 'node:path';
const D = process.argv[2]; const CD = path.join(D, 'docs/content');
const rowRe = /^(\d+)\. (.+)$/; let rows = 0, wrapped = 0, tail = 0, wrappedProse = 0; const per = {}; const ex = [];
for (const f of readdirSync(CD).filter((x) => /^RECEIPT_POOLS_.*\.md$/.test(x))) {
  const L = readFileSync(path.join(CD, f), 'utf8').split('\n'); let inF = false;
  L.forEach((line, i) => {
    if (/^```/.test(line)) { inF = !inF; return; } if (inF) return;
    const m = rowRe.exec(line); if (!m) return; if (/^\*\*/.test(m[2])) return;
    rows++;
    const nxt = L[i + 1] || '';
    if (nxt.trim() && !rowRe.test(nxt) && !/^#{1,6}\s/.test(nxt) && !/^[-*|>]/.test(nxt) && !/^```/.test(nxt)) {
      wrapped++; (per[f] = (per[f] || 0) + 1); if (ex.length < 5) ex.push(`${f}:${i + 1}  ROW: ${line.slice(0, 78)}\n        CONT: ${nxt.slice(0, 78)}`);
    }
    if (/`\s*—\s*[a-z]+·[A-Z]`?\s*$|—\s*[a-z]+·[A-Z]\s*$/.test(m[2])) tail++;
  });
}
console.log('annex variant rows (law rows excluded):', rows);
console.log('rows whose text CONTINUES on the next line (truncated by the ^(\\d+)\\. (.+)$ grammar):', wrapped);
console.log('rows carrying an un-stripped `— dir·SLOT` metadata tail:', tail);
console.log('per annex (wrapped):', JSON.stringify(per));
console.log('\nexamples:'); for (const e of ex) console.log('  ', e);
