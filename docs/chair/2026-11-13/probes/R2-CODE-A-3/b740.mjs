// The lane's births: the census's 720 (its own dials) + the reader's 20 (app shape). TREE, OUT env. Writes OUT/corpus.ndjson.gz
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const OUT=process.env.OUT; fs.mkdirSync(OUT,{recursive:true});
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const SIZES=['thorp','hamlet','village','town','city','metropolis'];
const STRESSES=["under_siege","famine","occupied","politically_fractured","indebted","recently_betrayed","infiltrated","plague_onset","succession_void","monster_pressure","insurgency","religious_conversion","slave_revolt","wartime","mass_migration"];
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){
  let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
  m=seed.match(/^rr2s-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  if(m){ const stresses=m[2]==='calm'?[]:m[2].split('+'); const route=m[3]==='rand'?{}:{tradeRouteAccess:m[3]};
    return birthConfig({...DEFAULT_CONFIG,...route,settType:m[1],selectedStressesRandom:false,selectedStresses:stresses,_randomizePriorities:true}); }
  m=seed.match(/^(?:rww|rpf|rw3)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/);
  if(m){ const stresses=m[2]==='calm'?[]:m[2].split('+'); return birthConfig({...DEFAULT_CONFIG,settType:m[1],selectedStressesRandom:false,selectedStresses:stresses,_randomizePriorities:true}); }
  throw new Error(seed);
}
let seeds=[]; for(const t of SIZES) for(let i=0;i<60;i++) seeds.push(`r2r-${t}-${i}`);
for(const s of STRESSES) for(const t of SIZES) for(let i=0;i<4;i++) seeds.push(`r2s-${s}-${t}-${i}`);
seeds.push(...fs.readFileSync(new URL('./seeds20.txt',import.meta.url),'utf8').trim().split('\n'));
if(process.env.EXTRA) seeds=fs.readFileSync(process.env.EXTRA,'utf8').trim().split('\n');
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT+'/corpus.ndjson.gz'));
let n=0,err=0;
for(const seed of seeds){ try{ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); n++; }catch(e){ err++; console.error(seed,e.message);} }
out.end(); await new Promise(r=>out.on('end',r)); console.log('births',n,'errors',err);
