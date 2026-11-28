// PG step 1's proof on the built code: per marker, rows the page prints against the oracle (the stored severity swapped in), and rows not printed that the oracle prints
import { readFileSync } from 'node:fs';
const M = JSON.parse(readFileSync(process.argv[2], 'utf8'));
for (const mk of ['default', 'allShown', 'widest']) {
  const wrong = {}; const lost = {}; let ex = null;
  for (const t of M.towns) { const m = t.markers[mk]; for (const [l, b] of Object.entries(m.rowsOwnerSev)) { if (!(l in m.rows)) lost[l] = (lost[l] || 0) + 1; else if (m.rows[l] !== b) { wrong[l] = (wrong[l] || 0) + 1; ex ??= `${t.seed} ${l}: ${m.rows[l]} vs ${b}`; } } for (const l of Object.keys(m.rows)) if (!(l in m.rowsOwnerSev)) { wrong[`GAINED ${l}`] = (wrong[`GAINED ${l}`] || 0) + 1; } }
  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  console.log(`${M.pool} [${mk}] printed against the oracle, wrong: ${sum(wrong)} ${JSON.stringify(wrong)} ${ex ?? ''} | not printed where the oracle prints: ${sum(lost)} ${JSON.stringify(lost)}`);
}
