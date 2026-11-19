// Readers' towns in the app's shape: rr2s-<size>-<stress>-<route>-<i>, rww-<size>-<stress>-<i>, fr4-<size>-<stress>-<i> (fresh, untuned).
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const OUT=process.env.OUT;
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
function cfgFor(seed){
  let m=seed.match(/^rr2s-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  if(m){ const st=m[2]==='calm'?[]:m[2].split('+'); const route=m[3]==='rand'?{}:{tradeRouteAccess:m[3]};
    return birthConfig({...DEFAULT_CONFIG,...route,settType:m[1],selectedStressesRandom:false,selectedStresses:st,_randomizePriorities:true}); }
  m=seed.match(/^(?:rww|fr4|rw3)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(!m) throw new Error(seed);
  const st=m[2]==='calm'?[]:m[2].split('+');
  return birthConfig({...DEFAULT_CONFIG,settType:m[1],selectedStressesRandom:false,selectedStresses:st,_randomizePriorities:true});
}
const seeds=fs.readFileSync(process.env.SEEDS,'utf8').split('\n').filter(Boolean);
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT));
let n=0; for(const seed of seeds){ try{ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); n++;}catch(e){console.error(seed,e.message);} }
out.end(); console.log('births', n);
