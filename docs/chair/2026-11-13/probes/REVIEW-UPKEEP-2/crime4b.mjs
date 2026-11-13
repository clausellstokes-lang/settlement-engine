const T=process.env.TREE;
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
await loadGenerationLawPayloads();
const clone=o=>JSON.parse(JSON.stringify(o)); const agg={};
for(const c of ['famine','under_siege','wartime','succession_void']) for(const t of ['village','town','city','metropolis']) for(let i=0;i<10;i++){
  const seed=`rv2-${c}-${t}-${i}`; const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:t,selectedStresses:[c],selectedStressesRandom:false}),null,{seed,customContent:{}});
  const k=keepOfRecord(s.economicState);
  const a=generateDefenseProfile(clone(s),k);
  const y=clone(s); y.config={...y.config,stressTypes:[],stressType:null}; // the crisis loop still runs off settlement.stress
  const b=generateDefenseProfile(y,k);
  const pa={}, pb={};
  agg[c]=agg[c]||{n:0,moved:0,sum:0,parts:{}}; const g=agg[c]; g.n++;
  const d=a.readiness.score-b.readiness.score; if(Math.abs(d)>0.05){g.moved++; g.sum+=d;}
  for(const id of new Set([...Object.keys(pa),...Object.keys(pb)])) if(Math.abs((pa[id]??0)-(pb[id]??0))>0.05) g.parts[id]=(g.parts[id]||0)+1;
}
for(const [c,g] of Object.entries(agg)) console.log(c,'births',g.n,'score moved by the stress read outside the crisis table',g.moved,'mean',(g.sum/Math.max(1,g.moved)).toFixed(2),'parts',JSON.stringify(g.parts));
