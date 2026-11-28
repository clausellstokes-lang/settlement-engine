// readcards.mjs: TREE=<tree> node readcards.mjs <titleRegex> <seed>...: born in the census's shape; print matching cards' secret and presentation.
import path from 'node:path';
const TREE=process.env.TREE; const imp=(p)=>import(path.join(TREE,p));
const C2='/tmp/claude-0/-home-user-settlement-engine/83c1acbe-83e9-5086-a95d-39b63ced4eb0/scratchpad/c2/docs/chair/2026-11-13/probes/CENSUS-2';
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
await loadGenerationLawPayloads(); const { makeCfgFor } = await import(C2+'/seedcfg.mjs'); const cfgFor=makeCfgFor(birthConfig, DEFAULT_CONFIG);
const [re,...seeds]=process.argv.slice(2); const R=new RegExp(re);
for(const seed of seeds){ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  for(const c of s.npcs) if(R.test(c.title||'')) console.log(`${seed} [${s.tier} ${s.population}] ${c.name}, ${c.title}: SECRET ${c.secret?.what} | PRES ${c.presentation?.impression}`); }
