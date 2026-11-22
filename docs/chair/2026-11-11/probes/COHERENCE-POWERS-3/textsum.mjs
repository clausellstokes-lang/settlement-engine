import fs from 'node:fs';
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const byPath = {}; const towns = {}; let rankBad = 0; const rankEx = [];
for (const r of rows) {
  for (const [p] of r.hits) { byPath[p] = (byPath[p] || 0) + 1; (towns[p] ||= new Set()).add(r.key); }
  for (const [p, m, size] of r.ranks) { const want = { Two: 2, Three: 3, Four: 4, Five: 5, Six: 6 }[m.split(' ')[0]]; const above = { two: 2, three: 3, four: 4 }[(m.match(/the (\w+) above/) || [])[1]];
    if ((want && want > size) || (above && above + 1 > size) || ((/no one leads|Close enough/.test(m)) && size < 2)) { rankBad++; if (rankEx.length < 6) rankEx.push(`${r.key}: "${m}" with ${size} powers`); } }
}
console.log('births', rows.length, 'with a gone power', rows.filter((r) => r.gone.length).length);
for (const [p, c] of Object.entries(byPath).sort((a, b) => b[1] - a[1])) console.log(String(c).padStart(5), String(towns[p].size).padStart(5), p);
console.log('rank lines counting powers the page does not show', rankBad, rankEx.join(' | '));
if (process.argv[3]) for (const r of rows) for (const h of r.hits) if (h[0].includes(process.argv[3])) console.log(r.key, '|', h[1], '|', h[2]);
