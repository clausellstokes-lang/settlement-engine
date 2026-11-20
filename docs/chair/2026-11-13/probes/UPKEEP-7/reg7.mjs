// COHERENCE-UPKEEP-7, item 2b: the realm register's living line on births of every one of the fifteen crises,
// in a campaign whose map holds no war and in one whose map besieges the town (a deployment against it).
// Usage: TREE=<tree> node reg7.mjs <out.ndjson>   (seeds reg7-<kind>-<size>-<i>, i < 5)
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const HR = await import(T+'/src/components/map/heraldRegister.js');
const { activeCrisisTypes } = await import(T+'/src/domain/facts/crisisKind.js');
const { STRESS_TYPE_MAP } = await import(T+'/src/data/stressTypes.js');
await loadGenerationLawPayloads();
const out=fs.createWriteStream(process.argv[2]);
for(const kind of Object.keys(STRESS_TYPE_MAP)) for(const size of ['village','town','city','metropolis']) for(let i=0;i<5;i++){
  const seed=`reg7-${kind}-${size}-${i}`;
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:size,selectedStresses:[kind],selectedStressesRandom:false}),null,{seed,customContent:{}});
  const save={id:'x1',name:s.name,settlement:s};
  const r={seed,kind,crises:activeCrisisTypes(s)};
  for(const [k,ws] of [['peace',{}],['besieged',{deployments:{enemy1:{targetId:'x1',sinceTick:0}}}]]){
    const campaign={id:'c1',settlementIds:['x1'],worldState:ws};
    const row=HR.gazetteerRows({campaign,saves:[save],seesSecrets:false})[0];
    r[k]={line:row.line,war:row.war};
  }
  out.write(JSON.stringify(r)+'\n');
}
out.end();
