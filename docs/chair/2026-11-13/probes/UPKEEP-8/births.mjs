// UPKEEP-8: the lane's births in the app's own shape, one ndjson row per birth with the parts the income, safety,
// threat and outlook lines read. Seeds: rv2/rv3/rv4 (the seventh seat's 1,440: REVIEW-UPKEEP-2 seeds.all + fresh,
// REVIEW-UPKEEP-3 own; `birthConfig({...DEFAULT_CONFIG, settType, selectedStresses, selectedStressesRandom:false})`),
// rr2s (the round-three readers' twenty, REVIEW-R2-STAGES seeds20: + `_randomizePriorities:true`, the route select),
// rww (the increment's thirty, ROUND-3-CUT/increment seeds.ww: + `_randomizePriorities:true`).
// usage: TREE=<tree> node births.mjs <seeds> <out.ndjson> [full]   (full: the whole record per row)
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads();
export function cfgFor(seed){
  let m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if(m) return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false});
  m=seed.match(/^rr2s-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  if(m){ const route=m[3]==='rand'?{}:{tradeRouteAccess:m[3]};
    return birthConfig({...DEFAULT_CONFIG,...route,settType:m[1],selectedStressesRandom:false,selectedStresses:m[2]==='calm'?[]:m[2].split('+'),_randomizePriorities:true}); }
  m=seed.match(/^rww-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/);
  if(m) return birthConfig({...DEFAULT_CONFIG,settType:m[1],selectedStressesRandom:false,selectedStresses:m[2]==='calm'?[]:m[2].split('+'),_randomizePriorities:true});
  throw new Error('seed shape '+seed);
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop()) && process.argv[2]) {
  const full=process.argv[4]==='full'; const out=fs.createWriteStream(process.argv[3]);
  for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
    const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
    out.write(JSON.stringify(full?{seed,s}:{seed,tier:s.tier,stresses:s.config?.stressTypes,
      inst:(s.institutions||[]).map(i=>[i.name,i.status||'']),res:s.config?.nearbyResources,dep:s.config?.nearbyResourcesDepleted,
      route:s.config?.tradeRouteAccess,income:s.economicState?.incomeSources?.map(e=>[e.source,e.percentage,e.desc]),
      chains:(s.economicState?.activeChains||[]).map(c=>[c.label||c.id,c.status]),imports:s.economicState?.primaryImports,
      exports:s.economicState?.primaryExports})+'\n');
  }
  out.end();
}
