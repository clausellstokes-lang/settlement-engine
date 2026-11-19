// rr20.mjs <tree> <out.ndjson.gz> [seedsfile]: the round-three reader's twenty (REVIEW-R2-STAGES seeds20.txt) born in the
// app's own shape (render.rr2s.jsx :: cfgFor: DEFAULT_CONFIG, selectedStressesRandom:false, _randomizePriorities:true).
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [TREE,OUT,SF]=process.argv.slice(2); const R=path.join(TREE,'src');
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
export function cfgFor(seed){ const m=seed.match(/^rr2s-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(!m) throw new Error(seed);
  const stresses=m[2]==='calm'?[]:m[2].split('+'); const route=m[3]==='rand'?{}:{tradeRouteAccess:m[3]};
  return birthConfig({...DEFAULT_CONFIG,...route,settType:m[1],selectedStressesRandom:false,selectedStresses:stresses,_randomizePriorities:true}); }
const seeds=fs.readFileSync(SF||'/tmp/claude-0/-home-user-settlement-engine/f8640aee-408c-5603-8c67-c24e0d36607b/scratchpad/rr2/seeds20.txt','utf8').trim().split('\n');
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT)); let n=0;
for(const seed of seeds){ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); n++; }
out.end(); await new Promise(r=>out.on('finish',r)); console.log('births',n);
