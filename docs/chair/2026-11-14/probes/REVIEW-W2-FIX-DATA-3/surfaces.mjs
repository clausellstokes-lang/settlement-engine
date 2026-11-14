// Every surface (tabs, Tonight, PDF text, Foundry journal) for census seeds, through the tree's soak harness; each
// catalogue line looked for on each surface.   TREE=<tree> SEEDS=<file> OUT=<dir> node surfaces.mjs
import fs from 'node:fs';
import L from './lines.mjs';
const TREE=process.env.TREE, OUT=process.env.OUT; fs.mkdirSync(OUT,{recursive:true});
process.chdir(TREE); const R=TREE+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const H = await import(TREE+'/scripts/audit/soak-review/renderHarness.mjs'); const h = await H.bootHarness();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){ let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]}); m=seed.match(/^rv3-([a-z_]+)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...(m[1]==='any'?{}:{culture:m[1]}),settType:m[2],selectedStressesRandom:false,selectedStresses:m[3]==='calm'?[]:m[3].split('+'),_randomizePriorities:true}); throw new Error(seed); }
const res={};
for (const seed of fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n')) {
  const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent:{} });
  const r = H.renderSurfaces(h, s);
  const surf = { tabs: Object.values(r.tabs).join('\n'), tonight: r.tonight||'', pdf: r.pdf||'', foundry: r.foundry||'' };
  fs.writeFileSync(`${OUT}/${seed}.txt`, Object.entries(surf).map(([k,v])=>`== ${k} ==\n${v}`).join('\n')+'\n');
  for (const l of L) { const on=Object.entries(surf).filter(([,v])=>l.re.test(v)).map(([k])=>k); if(on.length){ (res[l.id]??=[]).push({seed,on}); } }
}
await h.server.close();
fs.writeFileSync(`${OUT}/surfaces.json`, JSON.stringify(res,null,1));
for (const [id,v] of Object.entries(res)) { const c={}; for(const x of v) for(const k of x.on) c[k]=(c[k]||0)+1; console.log(id.padEnd(5), v.length, JSON.stringify(c)); }
