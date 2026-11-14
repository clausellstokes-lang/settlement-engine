// hunt.mjs <tree> <seedsFile> <targets(comma ids)> <out.json>: birth each seed in the app's configuration shape (rv2-
// grammar, as render.rv2.jsx), open the kernel ledger around buildPrintProse, and report which seeds DRAW each target.
import fs from 'node:fs';
const [T,SF,TG,O]=process.argv.slice(2); const R=T+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
const { normalizeSettlement } = await import(R+'/domain/normalizeSettlement.js');
const { buildPrintProse } = await import(R+'/domain/display/stateProse/printProse.js');
const { withPresumptionLedger } = await import(R+'/domain/facts/presumptionLedger.js');
await loadGenerationLawPayloads();
const targets=TG.split(','); const hits=Object.fromEntries(targets.map(t=>[t,[]])); let n=0;
for(const seed of fs.readFileSync(SF,'utf8').trim().split('\n')){
  const m=seed.match(/^rv2-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(!m) continue;
  const cfg=birthConfig({...DEFAULT_CONFIG, ...(process.env.ROUTE?{tradeRouteAccess:process.env.ROUTE}:{}), settType:m[1], selectedStressesRandom:false, selectedStresses:m[2]==='calm'?[]:m[2].split('+'), _randomizePriorities:true});
  const town=generateSettlementPipeline(cfg,null,{seed,customContent:{}}); n++;
  const { ledger } = withPresumptionLedger(()=>buildPrintProse(normalizeSettlement(town),{faithUnlocked:true}));
  const d=new Set(ledger.filter(e=>e.drawKind==='K').map(e=>`${e.pool}::v${e.lineId}`));
  for(const t of targets) if(d.has(t)) hits[t].push(seed);
}
fs.writeFileSync(O,JSON.stringify(hits,null,1)); console.log('births',n); for(const t of targets) console.log(hits[t].length, t, hits[t].slice(0,5).join(' '));
