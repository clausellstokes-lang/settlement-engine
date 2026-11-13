// Net effect of wartime on the defence profile: the same record with and without the war (stress and config both).
const T=process.env.TREE;
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const DG = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
await loadGenerationLawPayloads(); const d=[]; const asp={mil:0,mon:0,int:0,eco:0}; let n=0;
for(const sz of ['thorp','hamlet','village','town','city','metropolis']) for(let i=0;i<40;i++){ const seed=`rv2-wartime-${sz}-${i}`;
  const s=JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:sz,selectedStresses:['wartime'],selectedStressesRandom:false}),null,{seed,customContent:{}})));
  if([].concat(s.stress||[]).length!==1) continue; n++;
  const k=keepOfRecord(s.economicState); const a=DG.generateDefenseProfile(s,k);
  const y=JSON.parse(JSON.stringify(s)); y.stress=null; y.stressors=null; y.config={...y.config,stressTypes:[],stressType:null,intendedStressTypes:[]};
  const b=DG.generateDefenseProfile(y,k); d.push(a.readiness.score-b.readiness.score);
  asp.mil+=a.scores.military-b.scores.military; asp.mon+=a.scores.monster-b.scores.monster; asp.int+=a.scores.internal-b.scores.internal; asp.eco+=a.scores.economic-b.scores.economic; }
d.sort((x,y)=>x-y); console.log('wartime-only births',n,'readiness with war minus without: min',d[0],'median',d[n>>1],'max',d[n-1],'rises',d.filter(x=>x>0).length,'| mean per aspect',JSON.stringify(Object.fromEntries(Object.entries(asp).map(([k,v])=>[k,+(v/n).toFixed(2)]))));
