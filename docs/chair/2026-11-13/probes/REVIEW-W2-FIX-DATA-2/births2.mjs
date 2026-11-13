// REVIEW-W2-FIX-DATA-2: fresh births (rf2x-*) in the app's shape, towns/cities/metropolises (the granary and the
// charnel house stand there), six panel states in turn: Random on (twice), famine, under_siege, under_siege+famine,
// None (Random off, nothing ticked).   TREE=<tree> OUT=<dir> N=<n> node births2.mjs
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const OUT=process.env.OUT; fs.mkdirSync(OUT,{recursive:true});
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const SZ=['town','city','metropolis']; const MODES=['random','random','famine','under_siege','under_siege+famine','none'];
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT+'/corpus.ndjson.gz')); let n=0; const N=+process.env.N||1200;
for(let i=0;i<N;i++){ const z=SZ[i%3], m=MODES[Math.floor(i/3)%6]; const seed=`rf2x-${z}-${m}-${i}`;
  const panel = m==='random' ? {selectedStressesRandom:true} : {selectedStressesRandom:false, selectedStresses: m==='none'?[]:m.split('+')};
  const cfg=birthConfig({...DEFAULT_CONFIG, settType:z, _randomizePriorities:true, ...panel});
  try{ const s=generateSettlementPipeline(cfg,null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); n++; }catch(e){ console.error(seed,e.message); } }
out.end(); console.log('births',n);
