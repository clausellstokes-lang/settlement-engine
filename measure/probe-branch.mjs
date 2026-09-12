import { wiringCensus } from '../laneMEASURE/src/domain/prose/wiringCensus.js';
import { composerSources, composedFillByBlock, composedFillByKeyFunction, fillSites } from '../laneMEASURE/tests/helpers/dossierComposedFill.js';
import { loadStateLeaves } from '../laneMEASURE/tests/helpers/dossierCorpus.js';
import { UNMOUNTED_BLOCKS } from '../laneMEASURE/src/domain/display/stateProse/dossierMounts.js';

const leaves = await loadStateLeaves();
const pools = new Map();
for (const e of leaves) {
  if (!pools.has(e.block)) pools.set(e.block, new Map());
  const b = pools.get(e.block);
  if (!b.has(e.pool)) b.set(e.pool, []);
  b.get(e.pool).push({ text: e.text, slots: e.slots });
}
const sites = fillSites();
const c = wiringCensus({
  sources: composerSources(), pools,
  fill: new Map([...composedFillByBlock(sites)].map(([b, r]) => [b, r.slots])),
  fillByKeyFunction: composedFillByKeyFunction(sites),
  unmounted: UNMOUNTED_BLOCKS,
});
for (const r of c.rows.filter((r) => r.block === 'DS-DEF-11')) {
  console.log(r.pool, '| grain', r.readsGrain, '| reads', JSON.stringify(r.reads), '| k', r.k);
}
const branchGrain = c.rows.filter((r) => r.readsGrain === 'branch').length;
const withPred = c.rows.filter((r) => r.status === 'RESOLVED' && r.predicate.length > 0).length;
console.log('rows on the BRANCH grain', branchGrain, 'of', c.rows.length, '· rows carrying a predicate', withPred);

import { censusSummary, tierRows, TIERS } from '../laneMEASURE/src/domain/prose/wiringCensus.js';
import { unrenderedFacts } from '../laneMEASURE/tests/helpers/dossierComposedFill.js';
const held = [...new Set(unrenderedFacts().flatMap((r) => r.held))];
const sm = censusSummary(c.rows, held);
console.log('SUMMARY NOW: total', sm.total, 'resolved', sm.resolved, 'unresolved', sm.unresolved,
  'withPredicate', sm.resolvedWithPredicate, 'clean', sm.resolvedWithCleanPredicate,
  'overUnread', sm.predicatesOverUnreadFields.length, 'synthetic', sm.syntheticTableFields,
  'functions', c.functions, 'consulted', c.consulted, 'tables', c.tables);
const t = tierRows({ rows: c.rows, held });
const counts = {};
for (const r of t) counts[r.tier] = (counts[r.tier] || 0) + 1;
console.log('TIERS NOW', JSON.stringify(counts));
const byRung = {};
for (const r of c.rows) byRung[r.rung] = (byRung[r.rung] || 0) + 1;
console.log('RUNGS NOW', JSON.stringify(byRung));
