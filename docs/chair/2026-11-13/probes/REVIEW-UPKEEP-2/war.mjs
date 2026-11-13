const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads(); const g={}; let n=0, took=[];
for(const sz of ['thorp','hamlet','village','town','city','metropolis']) for(let i=0;i<40;i++){ const seed=`rv2-wartime-${sz}-${i}`;
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:sz,selectedStresses:['wartime'],selectedStressesRandom:false}),null,{seed,customContent:{}}); n++;
  let t=0; for(const p of s.defenseProfile.parts) if(p.crisis?.wartime!=null){ g[p.group+':'+p.id]=(g[p.group+':'+p.id]||0)+1; t+=p.crisis.wartime; }
  took.push(t); }
console.log('wartime births',n,'parts carrying a wartime take',JSON.stringify(g)); took.sort((a,b)=>a-b); console.log('readiness taken by the wartime row: min',took[0],'median',took[n>>1],'max',took[n-1]);
