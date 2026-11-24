// A2: printed band × production band, the branch each cell takes after the cure, counts; and the shortage-beside-Secure count.
import { readFileSync } from 'node:fs';
const T = '/home/user/wt/a2/src/data/dailyLife/';
const { FOOD_CULTURE } = await import(T + 'foodCulture.js');
const { COMMONER_RESENTMENTS } = await import(T + 'commonerResentments.js');
const { OUTSIDER_IMPRESSIONS } = await import(T + 'outsiderImpressions.js');
const SHORT = [...['strained', 'critical', 'collapsed'].flatMap((b) => FOOD_CULTURE[b].map((l) => l.text)),
  ...COMMONER_RESENTMENTS.food.filter((l) => !['F0', 'F6', 'F8'].includes(l.id)).map((l) => l.text),
  ...OUTSIDER_IMPRESSIONS['services.food_production'].filter((l) => ['F1', 'F2'].includes(l.id)).map((l) => l.text)];
const NOT_SHORT = new Set(['secure', 'surplus']);
const WANT = new Set(['strained', 'critical', 'collapsed']);
const out = {}; let fault = 0; const faultBy = {};
for (const f of process.argv.slice(2)) {
  const rows = readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const cells = {};
  let n = 0;
  for (const r of rows) {
    const k = `${r.printed}|${r.prod}`; cells[k] = (cells[k] || 0) + 1;
    const text = [r.food_culture, r.commoner_resentments, r.outsider_impressions].join('\n');
    if (NOT_SHORT.has(r.printed) && SHORT.some((t) => text.includes(t))) { n++; faultBy[r.size] = (faultBy[r.size] || 0) + 1; }
  }
  out[f] = { cells, n, faultBy: { ...faultBy } }; for (const k of Object.keys(faultBy)) delete faultBy[k];
}
const branch = (printed, prod) => (NOT_SHORT.has(printed) && WANT.has(prod) ? 'adequate (was ' + prod + ')' : prod + ' (unchanged)');
const keys = [...new Set(Object.values(out).flatMap((o) => Object.keys(o.cells)))].sort();
console.log(['printed band', 'production band', 'fare branch after', 'grievance (food family) after', 'visitor food lens after', ...Object.keys(out).map((f) => f.replace(/.*food-before-/, '').replace('.jsonl', ''))].join('\t'));
for (const k of keys) {
  const [p, b] = k.split('|');
  const fix = NOT_SHORT.has(p) && WANT.has(b);
  console.log([p, b, branch(p, b), WANT.has(b) ? (fix ? 'price only (F0, F6, F8 where a market stands)' : 'fires, whole family (unchanged)') : 'does not fire (unchanged)', WANT.has(b) ? (fix ? 'not strained (no food visitor line)' : 'strained (unchanged)') : 'not strained (unchanged)', ...Object.values(out).map((o) => o.cells[k] || 0)].join('\t'));
}
for (const [f, o] of Object.entries(out)) console.log(`# ${f.replace(/.*food-before-/, '')}: a shortage line beside a printed Secure/Surplus: ${o.n} ${JSON.stringify(o.faultBy)}`);
