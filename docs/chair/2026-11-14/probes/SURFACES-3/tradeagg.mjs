// node tradeagg.mjs <out>: towns where a PDF or journal pill is spelled otherwise than the tab's (exact, then case-folded)
import fs from 'node:fs';
const rows = fs.readdirSync(process.argv[2]).filter((f) => /^trade\.\d+\.jsonl$/.test(f)).flatMap((f) => fs.readFileSync(`${process.argv[2]}/${f}`, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)));
const c = {}; const add = (k, r, d) => (c[k] ||= []).push(`${r.seed}[${r.crisis}] ${d}`);
const off = (xs, want) => (xs || []).filter((x) => !want.includes(x));
for (const r of rows) for (const side of ['exports', 'imports']) {
  const want = r.tab[side];
  // the PDF's pill may carry a custom marker (" *", " (incl. …)"): the word before it is compared
  const p = off((r.pdf?.[side] || []).map((x) => x.replace(/ \(incl\..*$| {2}\*$/, '')), want); if (p.length) add(`PDF ${side} exact`, r, p.join(', '));
  const jr = (r.jr[side] || []).join(', ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"'), jw = want.join(', '); if (jr !== jw) add(`journal ${side} exact`, r, `jr[${jr}] tab[${jw}]`);
  const lw = want.map((x) => x.toLowerCase());
  const pf = (r.pdf?.[side] || []).map((x) => x.replace(/ \(incl\..*$| {2}\*$/, '')).filter((x) => !lw.includes(x.toLowerCase())); if (pf.length) add(`PDF ${side} folded`, r, pf.join(', '));
  if (jr.toLowerCase() !== jw.toLowerCase()) add(`journal ${side} folded`, r, '');
}
console.log(`towns ${rows.length}`); for (const [k, v] of Object.entries(c)) console.log(`${k}: ${v.length}  e.g. ${v.slice(0, 3).join(' ; ')}`);
