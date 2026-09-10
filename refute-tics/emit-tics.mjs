import { readFileSync, writeFileSync } from 'node:fs';
const R = JSON.parse(readFileSync('report.json', 'utf8'));
const ORDER = ['R1','R2','R3','R4','R4b','R5','R6','R7','R8','R9','R10','R11','R12','R14','R15','R16','R17','R18','A-U','A-W'];
const out = [];
out.push('');
out.push('---');
out.push('');
out.push('## 4. (b) THE TOP TEN HOUSE TICS PER REGISTER');
out.push('');
out.push('Mined, not assumed: every 2-to-4-gram in a register is scored by **lift** against its rate in');
out.push('the rest of the src-side corpus, and a gram qualifies only if it recurs in **three or more');
out.push('distinct pools** — a phrase living in one pool is that pool\'s subject, not the register\'s habit.');
out.push('Overlapping grams are collapsed to one row per phrase family. Read the lift as "this register');
out.push('says it N times more often than the rest of the estate does"; a high lift on a setting noun');
out.push('("market roads") is vocabulary, on a frame ("it is public that") it is a tic.');
for (const id of ORDER) {
  const t = R.tics[id]; if (!t || !t.length) continue;
  const m = R.metrics[id];
  out.push('');
  out.push(`### ${id} — ${R.names[id]} (n=${m.variants})`);
  out.push('');
  out.push('| n | % of variants | lift | tic | one real example |');
  out.push('|---:|---:|---:|---|---|');
  for (const x of t) {
    const ex = x.example.replace(/\|/g, '\\|').slice(0, 118);
    out.push(`| ${x.count} | ${(100 * x.rate).toFixed(1)}% | ${x.lift} | \`${x.gram}\` | ${ex}${x.example.length > 118 ? '…' : ''} |`);
  }
}
writeFileSync('/tmp/s4.md', out.join('\n') + '\n');
console.log('wrote', out.length, 'lines');
