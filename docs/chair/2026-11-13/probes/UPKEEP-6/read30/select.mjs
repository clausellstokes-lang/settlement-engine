// read30 selection: rule = for each (crisis,size-group), iterate i=0,1,2..., sizes in listed order within each i,
// take the first N births whose economicState.prosperity ranks strictly LOWER than prosperityStanding.
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { PROSPERITY_LABELS:L } = await import(T+'/src/domain/prosperityRank.js');
await loadGenerationLawPayloads();
const groups=JSON.parse(process.argv[2]); const picked=[]; const log=[];
for(const [crisis,sizes,N] of groups){ let got=0;
  for(let i=0;i<200&&got<N;i++) for(const size of sizes){ if(got>=N) break;
    const seed=`rv2-${crisis}-${size}-${i}`;
    const cfg=birthConfig({...DEFAULT_CONFIG,settType:size,selectedStresses:[crisis],selectedStressesRandom:false});
    const s=generateSettlementPipeline(cfg,null,{seed,customContent:{}});
    const p=s.economicState?.prosperity, st=s.economicState?.prosperityStanding;
    const q=L.indexOf(p)>=0&&L.indexOf(st)>=0&&L.indexOf(p)<L.indexOf(st);
    log.push(`${seed}\t${s.name}\t${p}\t${st}\t${q?'TAKE':'skip'}`);
    if(q){picked.push(seed);got++;}
  }}
fs.writeFileSync('picked.txt',picked.join('\n')+'\n'); fs.writeFileSync('select.log',log.join('\n')+'\n');
