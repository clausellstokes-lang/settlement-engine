// node birthsome.mjs <tree> <out.ndjson.gz> <seed...|@file> — census (r2r/r2s) or app-shape (rw3) seeds, each in its own shape
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const T=path.resolve(process.argv[2]); const OUT=process.argv[3]; let seeds=process.argv.slice(4); if(seeds[0]?.startsWith('@')) seeds=fs.readFileSync(seeds[0].slice(1),'utf8').trim().split('\n');
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){
  let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
  m=seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(m){ const st=m[2]==='calm'?[]:m[2].split('+'); return birthConfig({...DEFAULT_CONFIG,settType:m[1],selectedStressesRandom:false,selectedStresses:st,_randomizePriorities:true}); }
  throw new Error(seed); }
const gz=zlib.createGzip(); const ws=fs.createWriteStream(OUT); gz.pipe(ws);
for(const seed of seeds){ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); gz.write(JSON.stringify({seed,s})+'\n'); }
gz.end(); await new Promise(r=>ws.on('finish',r)); console.log('births',seeds.length);
