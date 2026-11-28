import fs from 'node:fs'; import path from 'node:path';
const [TREE] = process.argv.slice(2); const imp=(p)=>import(path.join(TREE,p));
const C2='/home/user/c2/docs/chair/2026-11-13/probes/CENSUS-2';
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { rulingChainOf } = await imp('src/domain/dossier/powerStrata.js');
const { governingFactionOf } = await imp('src/domain/rulingPower.js');
const W = await imp('src/domain/display/governingModifierWords.js');
await loadGenerationLawPayloads();
const { makeCfgFor } = await import(C2+'/seedcfg.mjs'); const cfgFor=makeCfgFor(birthConfig, DEFAULT_CONFIG);
let key=0, chipBefore=0, chipAfter=0, n=0;
for(const seed of fs.readFileSync(C2+'/seeds.txt','utf8').trim().split('\n')){ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); n++;
  const k=governingFactionOf(s)?.modifier; const p=!!rulingChainOf(s).power; if(k) key++; if(k&&p) chipBefore++; if(p&&W.governingModifierWordsOf(s)) chipAfter++; }
console.log({n,storedKey:key,rawChipBefore:chipBefore,plainChipAfter:chipAfter});
