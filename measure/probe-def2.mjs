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
const c = wiringCensus({ sources: composerSources(), pools,
  fill: new Map([...composedFillByBlock(sites)].map(([b, r]) => [b, r.slots])),
  fillByKeyFunction: composedFillByKeyFunction(sites), unmounted: UNMOUNTED_BLOCKS });
for (const r of c.rows.filter((r) => r.block === 'DS-DEF-2')) {
  console.log(`${r.status === 'RESOLVED' ? 'R' : '.'} ${r.rung.padEnd(8)} ${r.keyFunction.padEnd(22)} ${r.pool}`);
  if (r.status === 'RESOLVED') console.log('     reads', JSON.stringify(r.reads), 'grain', r.readsGrain);
}
