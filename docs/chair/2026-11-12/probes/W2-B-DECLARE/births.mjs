// SECOND-WAVE-CENSUS births: REVIEW-AGREE-2's 720-birth corpus, born in TREE (env), written to OUT/corpus.ndjson.gz.
// r2r-<size>-<i>: 6 sizes x 60, every dial random. r2s-<crisis>-<size>-<i>: 15 crises forced x 6 sizes x 4.
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const OUT=process.env.OUT;
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
const { STRESS_TYPE_MAP } = await import(R+'/data/stressTypes.js');
await loadGenerationLawPayloads();
const SIZES=['thorp','hamlet','village','town','city','metropolis'];
const STRESSES=["under_siege", "famine", "occupied", "politically_fractured", "indebted", "recently_betrayed", "infiltrated", "plague_onset", "succession_void", "monster_pressure", "insurgency", "religious_conversion", "slave_revolt", "wartime", "mass_migration"]; void STRESS_TYPE_MAP; // the fixed list of 8866a0ddd, so every tree births the same seeds
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){
  let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
  throw new Error(seed);
}
const seeds=[]; for(const t of SIZES) for(let i=0;i<60;i++) seeds.push(`r2r-${t}-${i}`);
for(const s of STRESSES) for(const t of SIZES) for(let i=0;i<4;i++) seeds.push(`r2s-${s}-${t}-${i}`);
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT+'/corpus.ndjson.gz'));
let n=0,err=0;
for(const seed of seeds){ try{ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); n++; }catch(e){ err++; console.error(seed,e.message);} }
out.end(); console.log('births',n,'errors',err);
