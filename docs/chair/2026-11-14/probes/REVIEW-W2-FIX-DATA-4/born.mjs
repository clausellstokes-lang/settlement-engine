// REVIEW-W2-FIX-DATA-4: births in the app's own shape, any tree. import born(TREE) -> (seed) => record
export async function boot(TREE){
  const R=TREE+'/src';
  const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
  await loadGenerationLawPayloads();
  const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
  function cfgFor(seed){
    let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
    m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
    // rv4-<culture|any>-<size>-<calm|a+b>-<i>: the app's own shape, Random off, the ticked list
    m=seed.match(/^rv[34]-([a-z_]+)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...(m[1]==='any'?{}:{culture:m[1]}),settType:m[2],selectedStressesRandom:false,selectedStresses:m[3]==='calm'?[]:m[3].split('+'),_randomizePriorities:true});
    throw new Error(seed);
  }
  return (seed)=>generateSettlementPipeline(cfgFor(seed), null, { seed, customContent:{} });
}
