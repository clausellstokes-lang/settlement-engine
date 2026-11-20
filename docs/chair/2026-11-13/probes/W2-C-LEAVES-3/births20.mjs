// The reader's 20 towns (REVIEW-R2-STAGES seeds20.txt), born in TREE in the app's shape (render.rr2s.jsx's cfgFor, verbatim).
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const OUT=process.env.OUT;
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
function cfgFor(seed){
  const m=seed.match(/^rr2s-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(!m) throw new Error(seed);
  const stresses = m[2]==='calm' ? [] : m[2].split('+');
  const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true});
}
const seeds=fs.readFileSync(process.env.SEEDS,'utf8').split('\n').filter(Boolean);
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT+'/corpus20.ndjson.gz'));
for(const seed of seeds){ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); }
out.end(); console.log('births', seeds.length);
