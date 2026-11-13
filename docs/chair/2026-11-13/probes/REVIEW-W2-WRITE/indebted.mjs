// births of indebted towns in TREE; prints the economic score, its band and the stress
const R=process.env.TREE+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
const { economicRowPoolKey } = await import(R+'/domain/display/stateProse/defenseStateProse.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
const SIZES=['thorp','hamlet','village','town','city','metropolis']; const N=+process.env.N||20; const out=[];
for(const t of SIZES) for(let i=0;i<N;i++){ const seed=`r2s-indebted-${t}-${i}`; const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:['indebted'],selectedStressesRandom:false,settType:t}),null,{seed,customContent:{}});
 out.push({seed,prosperity:s.economicState?.prosperity,econ:s.defenseProfile?.scores?.economic,band:economicRowPoolKey(s.defenseProfile?.scores?.economic),stress:(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type).join('+')}); }
const by={}; for(const x of out){ by[x.band]=(by[x.band]||0)+1; } console.log(JSON.stringify(by)); console.log(JSON.stringify(out.filter(x=>/STRONG/.test(x.band)).map(x=>[x.seed,x.prosperity,x.econ,x.stress])));
