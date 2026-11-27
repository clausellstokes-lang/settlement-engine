// PG M1: the interval test's table. node iv-an.mjs <iv-<pool>.json>
import { readFileSync } from 'node:fs';
const M = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const inc = (o, k) => { o[k] = (o[k] || 0) + 1; };
console.log(`POOL ${M.pool} cuts ${M.cuts} stored severities outside their band: ${M.storedOutsideBand}`);
for (const mk of ['default', 'allShown', 'widest']) {
  const lost = {}; const wrong = {}; const wrongEx = {}; const pageWrong = {}; const near = {}; let nonMono = 0; const nmEx = [];
  for (const t of M.towns) {
    const m = t.markers[mk];
    nonMono += m.nonMono.length; if (m.nonMono.length && nmEx.length < 3) nmEx.push(`${t.seed} ${JSON.stringify(m.nonMono[0])}`);
    for (const [l, v] of Object.entries(m.verdict)) {
      if (v.page !== v.oracle) inc(pageWrong, l);
      if (v.interval === null) { if (v.oracle !== null || v.page !== null) { inc(lost, l); inc(near, `${l}: ${v.corners.join('/')}`); } continue; }
      if (v.interval !== v.oracle) { inc(wrong, l); wrongEx[l] ??= `${t.seed}: interval ${v.interval}, oracle ${v.oracle}`; }
    }
  }
  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  console.log(`\n[${mk}] TODAY'S PAGE wrong (re-derived default vs the stored severity): ${sum(pageWrong)} ${JSON.stringify(pageWrong)}`);
  console.log(`  INTERVAL TEST: printed wrong ${sum(wrong)} ${JSON.stringify(wrong)} ${JSON.stringify(wrongEx)}`);
  console.log(`  INTERVAL TEST: rows lost ${sum(lost)} ${JSON.stringify(lost)}`);
  console.log(`  lost, by the bands its corners straddle: ${JSON.stringify(near)}`);
  console.log(`  non-monotone (row, condition) inside a band: ${nonMono} ${nmEx.join(' | ')}`);
}
