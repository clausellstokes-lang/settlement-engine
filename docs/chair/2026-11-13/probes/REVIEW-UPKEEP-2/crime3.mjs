const T=process.env.TREE;
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const H = await import(T+'/src/generators/helpers.js');
await loadGenerationLawPayloads();
let n=0,moved=0; const ex=[];
for(const c of ['famine','under_siege','wartime','succession_void']) for(const t of ['village','town','city']) for(let i=0;i<10;i++){
  const seed=`rv2-${c}-${t}-${i}`; const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:t,selectedStresses:[c],selectedStressesRandom:false}),null,{seed,customContent:{}});
  const a=H.getInstFlags(s.config,s.institutions).criminalEffective; const b=H.getInstFlags({...s.config,stressTypes:[],stressType:null},s.institutions).criminalEffective;
  n++; if(Math.round(a*0.4)!==Math.round(b*0.4)){moved++; if(ex.length<6) ex.push([seed,a.toFixed(1),b.toFixed(1)]);}
}
console.log('births',n,'crime part moved by the crisis inside the criminal reading',moved,JSON.stringify(ex));
