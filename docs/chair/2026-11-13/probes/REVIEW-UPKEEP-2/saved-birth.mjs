// Born on MASTER (the deployed client's code), stored as JSON, one file per seed.
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads(); fs.mkdirSync(process.argv[3],{recursive:true});
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){ const m=seed.split('-');
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:[m[1]],selectedStressesRandom:false}),null,{seed,customContent:{}});
  fs.writeFileSync(`${process.argv[3]}/${seed}.json`, JSON.stringify(s)); }
