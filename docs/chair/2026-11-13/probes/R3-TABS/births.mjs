// births.mjs: TREE=<tree> OUT=<file.ndjson.gz> SET=census|reader|fresh node births.mjs
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const OUT=process.env.OUT; const SET=process.env.SET;
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
  m=seed.match(/^(?:rr2s|r3t)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(m){
    const stresses = m[2]==='calm' ? [] : m[2].split('+'); const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true}); }
  throw new Error(seed);
}
let seeds=[];
if(SET==='census'){ for(const t of SIZES) for(let i=0;i<60;i++) seeds.push(`r2r-${t}-${i}`); for(const s of STRESSES) for(const t of SIZES) for(let i=0;i<4;i++) seeds.push(`r2s-${s}-${t}-${i}`); }
else if(SET==='reader'){ seeds=fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n'); }
else if(SET==='fresh'){ for(const t of SIZES) for(const c of ['calm','under_siege','famine','plague_onset','occupied','under_siege+famine']) for(let i=1;i<=4;i++) seeds.push(`r3t-${t}-${c}-${i%2?'rand':'port'}-${i}`); }
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT));
let n=0,err=0;
for(const seed of seeds){ try{ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); out.write(JSON.stringify({seed,s})+'\n'); n++; }catch(e){ err++; console.error(seed,e.message);} }
out.end(); await new Promise(r=>out.on('end',r)); console.log(SET,'births',n,'errors',err);
