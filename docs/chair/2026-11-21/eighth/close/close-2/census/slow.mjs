// usage: node slow.mjs <tree> <part.json>... : (1) every failure classed TIMEOUT or WRONG RESULT; (2) every test over 8,000 ms
// with whether its own `it(...)` carries a budget (a numeric last argument), read from the test file by title (a heuristic: NEEDS-READ when unsure).
import { readFileSync } from 'node:fs';
const [T, ...files] = process.argv.slice(2);
const src = new Map(); const read = (f) => { if (!src.has(f)) { try { src.set(f, readFileSync(f, 'utf8')); } catch { src.set(f, ''); } } return src.get(f); };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function budgetOf(file, title) {
  const s = read(file); const i = s.indexOf(title.slice(0, 60));
  if (i < 0) return 'NEEDS-READ';
  // find the end of this it(...) call: the next line starting a new it( / test( / describe( or EOF; look for "}, <number>" or "}, { timeout"
  const rest = s.slice(i); const m = rest.slice(1).search(/\n\s*(it|test|describe)(\.\w+)?\(/);
  const body = m < 0 ? rest : rest.slice(0, m + 1);
  if (/\}\s*,\s*[\d_]+\s*\)\s*;?[^\n]*$/m.test(body) || /\btimeout\s*:/.test(body) || /,\s*[\d_]{4,}\s*\)\s*;?\s*(\/\/.*)?$/m.test(body)) return 'own';
  return 'none';
}
const fails = []; const slow = [];
for (const j of files) {
  const r = JSON.parse(readFileSync(j, 'utf8'));
  for (const t of r.testResults) for (const a of t.assertionResults) {
    const rel = t.name.replace(`${T}/`, '');
    const title = a.fullName || a.title;
    if (a.status === 'failed') { const msg = (a.failureMessages || []).join(' '); fails.push([/Test timed out in \d+ ?ms|TIMEOUT · ran/.test(msg) ? 'TIMEOUT' : 'WRONG RESULT', rel, title.slice(0, 140), Math.round(a.duration || 0)].join('\t')); }
    if ((a.duration || 0) > 8000) slow.push([rel, title.slice(0, 140), Math.round(a.duration), budgetOf(t.name, a.title)].join('\t'));
  }
}
console.log('## FAILURES BY KIND\nkind\tfile\ttitle\tms'); console.log(fails.join('\n'));
console.log('\n## OVER 8000 MS\nfile\ttitle\tms\tbudget'); console.log(slow.sort((a, b) => +b.split('\t')[2] - +a.split('\t')[2]).join('\n'));
