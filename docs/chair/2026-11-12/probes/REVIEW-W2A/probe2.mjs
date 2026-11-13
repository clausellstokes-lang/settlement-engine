const R=process.env.TREE+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
export function town(seed){ const m=seed.match(/^rvw-(thorp|hamlet|village|town|city|metropolis)-(?:(\w+)-)?(\d+)$/);
 const c=birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1],...(m[2]?{selectedStresses:[m[2]],selectedStressesRandom:false}:{})});
 return generateSettlementPipeline(c,null,{seed,customContent:{}}); }
function find(o,re,p='',out=[]){ if(o&&typeof o==='object'){ for(const k of Object.keys(o)){ const q=p+'.'+k; if(re.test(k)) out.push([q, typeof o[k]==='object'?JSON.stringify(o[k]).slice(0,200):o[k]]); find(o[k],re,q,out);} } return out; }
if(process.argv[2]){ const re=new RegExp(process.argv[2],'i'); for(const s of process.argv.slice(3)){ const t=town(s); console.log('##',s); for(const r of find(t,re).slice(0,25)) console.log(' ',r[0],'=',r[1]); } }
