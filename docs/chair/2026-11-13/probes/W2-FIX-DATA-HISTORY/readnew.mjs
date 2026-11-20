// node readnew.mjs TREE corpus field "text1" "text2" ... : per text, a crisis town, the smallest and the largest that print it
import { loadCorpus } from './load.mjs';
const [TREE, CORP, FIELD, ...T] = process.argv.slice(2); const C = loadCorpus(CORP);
const { factsOf } = await import(TREE + '/src/domain/facts/factsOf.js');
const get = (s) => FIELD === 'history' ? JSON.stringify(s.history) : FIELD === 'arrival' ? String(s.arrivalScene || '') : JSON.stringify(s);
const crisis = (s) => (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean).map((x) => x.type).join('+') || 'calm';
for (const t of T) {
  const hits = C.filter(({ s }) => get(s).includes(t));
  const pick = [hits.find(({ s }) => crisis(s) !== 'calm'), [...hits].sort((a, b) => a.s.population - b.s.population)[0], [...hits].sort((a, b) => b.s.population - a.s.population)[0]].filter(Boolean);
  console.log('## ' + t + ' (' + hits.length + ')');
  for (const { seed, s } of pick) { let f = {}; try { f = factsOf(s); } catch {} console.log('   ' + seed + ' ' + s.tier + ' ' + s.population + ' ' + crisis(s) + ' guild=' + f.guild + ' market=' + f.market + ' walls=' + f.defence?.walls + ' mine=' + (s.institutions || []).some((i) => /mine/i.test(i.name)) + ' res=' + JSON.stringify((s.config.nearbyResources || []).slice(0, 4))); }
}
