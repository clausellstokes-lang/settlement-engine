// REVIEW-W2-FIX-DATA: N fresh births of the reviewer's own seeds (rvx-*), every size, calm and each crisis, to OUT/corpus.ndjson.gz.
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const OUT=process.env.OUT; fs.mkdirSync(OUT,{recursive:true});
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const SIZES=['thorp','hamlet','village','town','city','metropolis'];
const ST=['under_siege','famine','occupied','plague_onset','wartime','mass_migration','insurgency','indebted'];
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT+'/corpus.ndjson.gz')); let n=0;
const N=+process.env.N||1200;
for(let i=0;i<N;i++){ const z=SIZES[i%6]; const crisis = i%3===2 ? ST[Math.floor(i/3)%ST.length] : null; const seed=`rvx-${z}-${crisis||'calm'}-${i}`;
  const cfg=birthConfig({...DEFAULT_CONFIG,...dials,settType:z,...(crisis?{selectedStresses:[crisis],selectedStressesRandom:false}:{})});
  try{ const s=generateSettlementPipeline(cfg,null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); n++; }catch(e){ console.error(seed,e.message); } }
out.end(); console.log('births',n);
