// one.mjs <tree> <seed>: born as the census births it (CENSUS-3 seedcfg); prints JSON of the record to stdout
const P='/home/user/rm3/inst/docs/chair/2026-11-14/probes/CENSUS-3';
const { makeCfgFor } = await import(P+'/seedcfg.mjs'); const R=process.argv[2]+'/src';
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
await loadGenerationLawPayloads(); const seed=process.argv[3];
const s = generateSettlementPipeline(makeCfgFor(birthConfig, DEFAULT_CONFIG)(seed), null, { seed, customContent: {} });
globalThis.__rec=s; if(process.env.SHOW) console.log(eval(process.env.SHOW));
