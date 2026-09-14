import { wiringCensus, attachSets, factBudget } from '../laneMEASURE/src/domain/prose/wiringCensus.js';
import { composerSources, composedFillByBlock, composedFillByKeyFunction, fillSites, unrenderedFacts } from '../laneMEASURE/tests/helpers/dossierComposedFill.js';
import { loadStateLeaves } from '../laneMEASURE/tests/helpers/dossierCorpus.js';
import { UNMOUNTED_BLOCKS, DOSSIER_MOUNTS } from '../laneMEASURE/src/domain/display/stateProse/dossierMounts.js';
import { factMounts } from '../laneMEASURE/scripts/wiring-census.mjs';
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
const facts = unrenderedFacts();
const deskFacts = new Map(facts.map((r) => [r.file.replace(/^.*\/(\w+)StateProse\.js$/, '$1'), r.held]));
const shadow = c.rows.map((r) => ({ ...r, reads: r.fieldsRead }));
for (const [name, rows] of [['BRANCH', c.rows], ['FUNCTION', shadow]]) {
  const b = factBudget(rows);
  const a = attachSets(rows);
  const dark = a.filter((x) => x.spinesReachedBp === 0).map((x) => x.block).sort();
  const mounts = factMounts(rows, DOSSIER_MOUNTS, deskFacts);
  console.log(`${name}: k=0 ${b.zeroK} of ${b.executable} · histogram ${b.histogram.map(([k,n])=>`k=${k} ${n}`).join(' · ')}`);
  console.log(`  blocks with a RESOLVED spine ${a.length} · CANNOT-ATTACH ${dark.length} · reads-per-row total ${rows.reduce((t,r)=>t+(r.reads||[]).length,0)}`);
  console.log(`  dark: ${dark.join(' · ')}`);
  console.log(`  modifier-eligible facts per tab: ${mounts.byTab.map(([t,n])=>`${t} ${n}`).join(' · ')}`);
  const d11 = a.find((x) => x.block === 'DS-DEF-11'); const d2 = a.find((x) => x.block === 'DS-DEF-2');
  console.log(`  DS-DEF-11 spines ${d11.spines} facts ${d11.facts} reached ${d11.spinesReachedBp} bp mean ${d11.meanReachBp} bp · DS-DEF-2 spines ${d2.spines} facts ${d2.facts} reached ${d2.spinesReachedBp} bp mean ${d2.meanReachBp} bp`);
}
