// INCOME-MEASURE-1: render5.mjs's births, the record only (no surfaces).
// REVIEW-UPKEEP-CAPACITY: render4.mjs (REVIEW-UPKEEP-3) with the census's seed shapes added, and the record kept.
// Seeds: r2r-<size>-<i> / r2s-<crisis>-<size>-<i> (SECOND-WAVE-CENSUS births.mjs shape), rv5-<crisis[+crisis]|calm>-<size>-<i>
// (the app's own shape: selectedStresses, selectedStressesRandom:false; magic on; other dials random).
// Usage: TREE=<tree> node render5.mjs <seedfile> <outdir>   -> <outdir>/<seed>.txt and <outdir>/<seed>.json (record)
const T=process.env.TREE; import fs from 'node:fs'; import zlib from 'node:zlib';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const AI = await import(T+'/src/generators/aiLayer.js');
const G = await import(T+'/src/domain/aiGrounding.js');
const WX = await import(T+'/src/lib/worldExport.js');
const HR = await import(T+'/src/components/map/heraldRegister.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
export function cfgFor(seed){
  let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
  m=seed.match(/^rv5-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false});
  throw new Error(seed);
}
fs.mkdirSync(process.argv[3],{recursive:true});
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  let s; try{ s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); }catch(e){ fs.writeFileSync(`${process.argv[3]}/${seed}.err`,`${e.stack}\n`); continue; }
  fs.writeFileSync(`${process.argv[3]}/${seed}.json.gz`, zlib.gzipSync(JSON.stringify(s)));
}
