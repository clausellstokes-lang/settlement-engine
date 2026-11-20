import path from 'node:path';
const TREE=process.env.TREE; const imp=(p)=>import(path.join(TREE,p));
const C2='/tmp/claude-0/-home-user-settlement-engine/83c1acbe-83e9-5086-a95d-39b63ced4eb0/scratchpad/c2/docs/chair/2026-11-13/probes/CENSUS-2';
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
await loadGenerationLawPayloads(); const { makeCfgFor } = await import(C2+'/seedcfg.mjs'); const cfgFor=makeCfgFor(birthConfig, DEFAULT_CONFIG);
const [seed, expr] = process.argv.slice(2); const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
console.log(JSON.stringify(eval(expr), null, 0));
