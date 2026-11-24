// A2: before vs after, per corpus: the births whose food lines changed (by slot), the FOODSEC count after (derived), and
// the fare branch observed in each printed|production cell. node compare.mjs <before.jsonl> <after.jsonl>
import { readFileSync } from 'node:fs';
const T = '/home/user/wt/a2/src/data/dailyLife/';
const { FOOD_CULTURE } = await import(T + 'foodCulture.js');
const { COMMONER_RESENTMENTS } = await import(T + 'commonerResentments.js');
const { OUTSIDER_IMPRESSIONS } = await import(T + 'outsiderImpressions.js');
const { DAWN_WORK } = await import(T + 'dawnWork.js');
const formOf = (t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.+?'));
const SHORT = [...['strained', 'critical', 'collapsed'].flatMap((b) => FOOD_CULTURE[b]), ...COMMONER_RESENTMENTS.food.filter((l) => !['F0', 'F6', 'F8'].includes(l.id)),
  ...OUTSIDER_IMPRESSIONS['services.food_production'].filter((l) => ['F1', 'F2'].includes(l.id)), ...DAWN_WORK.food].map((l) => formOf(l.text));
const branchOf = (t) => Object.entries(FOOD_CULTURE).find(([, ls]) => ls.some((l) => formOf(l.text).test(t)))?.[0] ?? '(none)';
const [bf, af] = process.argv.slice(2);
const rd = (f) => Object.fromEntries(readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const B = rd(bf); const A = rd(af);
const SLOTS = ['food_culture', 'commoner_resentments', 'outsider_impressions', 'dawn_work'];
const bySlot = {}; let changed = 0; const changedSeeds = []; let foodsecAfter = 0; let foodsecBefore = 0; const cells = {};
for (const [seed, b] of Object.entries(B)) {
  const a = A[seed];
  const moved = SLOTS.filter((k) => b[k] !== a[k]);
  if (moved.length) { changed++; changedSeeds.push(seed); for (const k of moved) bySlot[k] = (bySlot[k] || 0) + 1; }
  const fed = (r) => ['secure', 'surplus'].includes(r.printed) && SHORT.some((re) => re.test(SLOTS.map((k) => r[k]).join('\n')));
  if (fed(b)) foodsecBefore++; if (fed(a)) foodsecAfter++;
  const key = `${b.printed}|${b.prod}`; const c = (cells[key] ||= {}); const t = `${branchOf(b.food_culture)}->${branchOf(a.food_culture)}`; c[t] = (c[t] || 0) + 1;
}
console.log(`births ${Object.keys(B).length}; food lines changed in ${changed}; by slot ${JSON.stringify(bySlot)}; FOODSEC (derived) before ${foodsecBefore}, after ${foodsecAfter}`);
for (const [k, v] of Object.entries(cells).sort()) console.log(`${k}\t${JSON.stringify(v)}`);
console.log('#changed ' + changedSeeds.join(' '));
