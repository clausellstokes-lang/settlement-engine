// node birth20.mjs <tree> <out.ndjson.gz> [seedsfile] — the reviewer's seeds, the APP's shape (render.rw3.jsx's cfgFor)
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const T=path.resolve(process.argv[2]); const OUT=process.argv[3]; const SF=process.argv[4]||path.join(path.dirname(new URL(import.meta.url).pathname),'../list/seeds20.txt');
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads();
function cfgFor(seed){ const m=seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(!m) throw new Error(seed);
  const stresses=m[2]==='calm'?[]:m[2].split('+'); return birthConfig({...DEFAULT_CONFIG,settType:m[1],selectedStressesRandom:false,selectedStresses:stresses,_randomizePriorities:true}); }
const gz=zlib.createGzip(); const ws=fs.createWriteStream(OUT); gz.pipe(ws);
for(const seed of fs.readFileSync(SF,'utf8').trim().split('\n')){ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); gz.write(JSON.stringify({seed,s})+'\n'); }
gz.end(); await new Promise(r=>ws.on('finish',r)); console.log('done');
