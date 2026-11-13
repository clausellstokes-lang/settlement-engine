// REVIEW-R3-STAGES births: TREE=<worktree> OUT=<file.ndjson.gz> SEEDS=<seeds file> node births.mjs
// Seeds: the census's 720 (r2r-<size>-<i>, r2s-<crisis>-<size>-<i>: the census's own cfgFor, verbatim) and the app's own
// shape (rr3-<size>-<calm|s1+s2>-<rand|route>-<i>: DEFAULT_CONFIG as shipped, selectedStressesRandom:false and the
// ticked list, _randomizePriorities on: the configuration panel's shape, as REVIEW-R2-STAGES render.rr2s.jsx).
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const OUT=process.env.OUT;
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
export function cfgFor(seed){
  let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
  // rw3-<size>-<calm|s1+s2>-<i>: REVIEW-W2A-3's own cfgFor (the round-two list's towns), verbatim.
  m=seed.match(/^rw3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(m){ const stresses = m[2]==='calm' ? [] : m[2].split('+');
    return birthConfig({...DEFAULT_CONFIG, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true}); }
  // rr3p-<size>-<calm|s1+s2>-<route>-<i>: the app's shape with the Regional Threat select on 'plagued' and the sliders set by hand
  // (_randomizePriorities off), Military at 10, 20 or 30 by i: the user's route to the embattled-region rows.
  m=seed.match(/^rr3p-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(m){
    const stresses = m[2]==='calm' ? [] : m[2].split('+'); const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, monsterThreat:'plagued', priorityMilitary:10+(+m[4]%3)*10}); }
  m=seed.match(/^rr[23][a-z]?-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(m){
    const stresses = m[2]==='calm' ? [] : m[2].split('+'); const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true}); }
  throw new Error(seed);
}
const seeds=fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n');
const out=zlib.createGzip(); const done=new Promise(r=>out.pipe(fs.createWriteStream(OUT)).on('finish',r));
let n=0,err=0;
for(const seed of seeds){ try{ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); n++; }catch(e){ err++; console.error(seed,e.message);} }
out.end(); await done; console.log('births',n,'errors',err);
if(err) process.exitCode=1;
