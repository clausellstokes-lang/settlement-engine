import { readFileSync } from 'node:fs';
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
const before = JSON.parse(readFileSync('../laneMEASURE/docs/content/wiring-census.json', 'utf8'));
const was = new Map(before.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));
const flips = [];
for (const r of c.rows) {
  const b = was.get(`${r.block} :: ${r.pool}`);
  if (!b) { flips.push(['NEW ROW', r.block, r.pool]); continue; }
  if (b.status !== r.status) flips.push([`${b.status} -> ${r.status}`, r.block, r.pool, r.rung, r.keyFunction, JSON.stringify(r.predicate)]);
}
console.log('status flips:', flips.length);
const byFn = new Map();
for (const f of flips) byFn.set(f[4], (byFn.get(f[4]) || 0) + 1);
console.log([...byFn].sort((a,b)=>b[1]-a[1]).map(([k,n])=>`${k} ${n}`).join(' · '));
for (const f of flips.slice(0, 14)) console.log(' ', f.join(' | '));
