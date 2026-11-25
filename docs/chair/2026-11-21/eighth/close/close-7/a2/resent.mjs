// R24h: pages whose resentments slot is empty, before and after, and FOODSEC derived, on one corpus. node resent.mjs <before> <after>
import { readFileSync } from 'node:fs';
const T = '/home/user/wt/a2/src/data/dailyLife/';
const { FOOD_CULTURE } = await import(T + 'foodCulture.js'); const { COMMONER_RESENTMENTS } = await import(T + 'commonerResentments.js');
const { OUTSIDER_IMPRESSIONS } = await import(T + 'outsiderImpressions.js'); const { DAWN_WORK } = await import(T + 'dawnWork.js');
const formOf = (t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.+?'));
const SHORT = [...['strained', 'critical', 'collapsed'].flatMap((b) => FOOD_CULTURE[b]), ...COMMONER_RESENTMENTS.food.filter((l) => !['F0', 'F6', 'F8'].includes(l.id)),
  ...OUTSIDER_IMPRESSIONS['services.food_production'].filter((l) => ['F1', 'F2'].includes(l.id)), ...DAWN_WORK.food].map((l) => formOf(l.text));
const SZ = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const read = (f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
for (const [label, f] of [['before', process.argv[2]], ['after', process.argv[3]]]) {
  const rows = read(f); const empty = Object.fromEntries(SZ.map((z) => [z, 0])); let n = 0; let fs = 0;
  for (const r of rows) { if (!r.commoner_resentments.trim()) { empty[r.size]++; n++; }
    if (['secure', 'surplus'].includes(r.printed) && SHORT.some((re) => re.test([r.food_culture, r.commoner_resentments, r.outsider_impressions, r.dawn_work].join('\n')))) fs++; }
  console.log(`${label}: resentments empty ${n} ${JSON.stringify(empty)}; FOODSEC (derived) ${fs}`);
}
