// LAYER-MAP rosterLoop.mjs — how often the generator's one loop (roster -> economy -> power -> roster) fires.
// Births the census's 720 seeds (births.mjs's configs) with an onStep hook; counts towns whose roster
// (live institution names) differs between generateEconomy and economyReconcilePass, and whose
// government differs between generatePower and the finished record. Run: TREE=<tree> SEEDS=<seeds.txt> node rosterLoop.mjs
import fs from 'node:fs';
const R=(process.env.TREE||process.cwd())+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){ let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]}); }
const seeds=fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n');
const names=(insts)=>JSON.stringify((insts||[]).map(i=>i.name).sort());
const out={towns:0, rosterMovedAfterEconomy:0, flag:0, govMovedAfterPower:0, factionsMovedAfterPower:0, economyMovedByReconcile:0};
for(const seed of seeds){ const snap={};
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{},onStep:(name,ctx)=>{
    if(name==='generateEconomy'){ snap.r=names(ctx.institutions); snap.e=JSON.stringify([ctx.economicState?.prosperity,ctx.economicState?.primaryExports]); }
    if(name==='generatePower'){ snap.g=ctx.powerStructure?.government; snap.f=JSON.stringify((ctx.powerStructure?.factions||[]).map(f=>f.faction).sort()); }
    if(name==='economyReconcilePass'){ snap.r2=names(ctx.institutions); snap.flag=!!ctx._rosterChangedAfterEconomy; snap.e2=JSON.stringify([ctx.economicState?.prosperity,ctx.economicState?.primaryExports]); }
  }});
  out.towns++; if(snap.r!==snap.r2) out.rosterMovedAfterEconomy++; if(snap.flag) out.flag++; if(snap.e!==snap.e2) out.economyMovedByReconcile++;
  if(snap.g!==s.powerStructure?.government) out.govMovedAfterPower++;
  if(snap.f!==JSON.stringify((s.powerStructure?.factions||[]).map(f=>f.faction).sort())) out.factionsMovedAfterPower++;
}
console.log(JSON.stringify(out));
