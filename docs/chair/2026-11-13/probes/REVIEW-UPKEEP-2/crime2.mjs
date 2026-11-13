const T=process.env.TREE;
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
await loadGenerationLawPayloads();
const clone=o=>JSON.parse(JSON.stringify(o));
for(const seed of process.argv.slice(2)){
  const m=seed.split('-'); const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:[m[1]],selectedStressesRandom:false}),null,{seed,customContent:{}});
  const k=keepOfRecord(s.economicState);
  const v=(x)=>{const d=generateDefenseProfile(x,k); const p=Object.fromEntries(d.parts.map(q=>[q.id,q.points])); return [d.readiness.score,p.crime,d.scores.internal];};
  const a=clone(s); const b=clone(s); b.stress=null; b.stressors=null;       // crisis loop off, flags on
  const c=clone(s); c.config={...c.config,stressTypes:[]};                    // flags off, crisis loop on
  const d=clone(s); d.stress=null; d.stressors=null; d.config={...d.config,stressTypes:[]};
  console.log(seed,'stress',JSON.stringify([].concat(s.stress||[]).map(x=>x.type)),'| full',v(a),'| no crisis loop',v(b),'| no flag stress',v(c),'| neither',v(d));
}
