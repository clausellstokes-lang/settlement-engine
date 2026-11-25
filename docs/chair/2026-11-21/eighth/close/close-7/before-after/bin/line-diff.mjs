// node line-diff.mjs <dirA> <dirB> <view> [n] : for moved pages, lines only in A / only in B of that view; tally of B-only and A-only lines (masked digits)
import { readFileSync, readdirSync } from 'node:fs';
const [A, Bd, view, n = 12] = process.argv.slice(2);
const ta = {}, tb = {};
for (const f of readdirSync(A + '/rows')) {
  const a = JSON.parse(readFileSync(`${A}/rows/${f}`, 'utf8')); const b = JSON.parse(readFileSync(`${Bd}/rows/${f}`, 'utf8'));
  const la = (a.printed[view] || []).map(String), lb = (b.printed[view] || []).map(String);
  if (JSON.stringify(la) === JSON.stringify(lb)) continue;
  const sa = new Set(la), sb = new Set(lb);
  for (const l of new Set(la.filter((x) => !sb.has(x)).map((x) => x.replace(/\d+/g, '0').slice(0, 140)))) ta[l] = (ta[l] || 0) + 1;
  for (const l of new Set(lb.filter((x) => !sa.has(x)).map((x) => x.replace(/\d+/g, '0').slice(0, 140)))) tb[l] = (tb[l] || 0) + 1;
}
const top = (t) => Object.entries(t).sort((x, y) => y[1] - x[1]).slice(0, +n).map(([l, c]) => `  ${c}\t${l}`).join('\n');
console.log(`ONLY BEFORE (${Object.keys(ta).length} distinct):\n${top(ta)}\nONLY AFTER (${Object.keys(tb).length} distinct):\n${top(tb)}`);
