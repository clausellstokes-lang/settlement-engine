// A2: the RENDERED count over a sameness-door --text run: a shortage line on the owner's web page whose first screen prints
// "Food Security" Secure or Surplus. node rendered.mjs <textDir> <plan.json>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const T = '/home/user/wt/a2/src/data/dailyLife/';
const { FOOD_CULTURE } = await import(T + 'foodCulture.js');
const { COMMONER_RESENTMENTS } = await import(T + 'commonerResentments.js');
const { OUTSIDER_IMPRESSIONS } = await import(T + 'outsiderImpressions.js');
const SHORT = [...['strained', 'critical', 'collapsed'].flatMap((b) => FOOD_CULTURE[b].map((l) => l.text)),
  ...COMMONER_RESENTMENTS.food.filter((l) => !['F0', 'F6', 'F8'].includes(l.id)).map((l) => l.text),
  ...OUTSIDER_IMPRESSIONS['services.food_production'].filter((l) => ['F1', 'F2'].includes(l.id)).map((l) => l.text)];
const [dir, planFile] = process.argv.slice(2);
const by = {}; const seeds = [];
for (const { seed, size } of JSON.parse(readFileSync(planFile, 'utf8'))) {
  const t = readFileSync(join(dir, `${seed}.txt`), 'utf8');
  const secs = t.split(/^== /m);
  const web = secs.filter((x) => x.startsWith('web:')).join('\n');
  const ov = secs.find((x) => x.startsWith('web:Summary/Overview')) || '';
  const word = /^Food Security(Secure|Surplus|Pressured|Import-Dependent|Deficit[^\n]*)$/m.exec(ov)?.[1] || '?';
  if ((word === 'Secure' || word === 'Surplus') && SHORT.some((x) => web.includes(x))) { by[size] = (by[size] || 0) + 1; seeds.push(seed); }
}
console.log(Object.values(by).reduce((a, b) => a + b, 0), JSON.stringify(by));
console.log(seeds.join(' '));
