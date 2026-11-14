import fs from 'node:fs';
const T=process.env.TREE;
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads();
const j=JSON.parse(fs.readFileSync(process.argv[2]));
for(const x of j[process.argv[3]]){ const [, dk, t, cr]=x.seed.match(/^v9-(\w+)-(\w+)-(\w+)-\d+$/);
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:t,priorityMagic:100,selectedStresses:cr==='calm'?[]:[cr],selectedStressesRandom:false}),null,{seed:x.seed,customContent:{}});
  console.log(x.seed, JSON.stringify((s.institutions||[]).map(i=>i.name).filter(n=>/magic|arcan|scribe|wizard|mage|alchem|enchant|teleport|druid|apothec|herb|healer|witch|library/i.test(n)))); }
