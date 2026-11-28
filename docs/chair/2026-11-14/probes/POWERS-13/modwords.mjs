// modcount.mjs <tree> [seedsfile]: the 720 (or a seeds file): governing modifier by key; borne out or not; plain words
import fs from 'node:fs'; import path from 'node:path';
const [TREE, SEEDF] = process.argv.slice(2); const imp=(p)=>import(path.join(TREE,p));
const C2='/home/user/c2/docs/chair/2026-11-13/probes/CENSUS-2';
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const W = await imp('src/domain/display/governingModifierWords.js');
const { governingFactionOf } = await imp('src/domain/rulingPower.js');
await loadGenerationLawPayloads();
const { makeCfgFor } = await import(C2+'/seedcfg.mjs'); const cfgFor=makeCfgFor(birthConfig, DEFAULT_CONFIG);
const seeds=fs.readFileSync(SEEDF||C2+'/seeds.txt','utf8').trim().split('\n').filter(Boolean);
const by={}; const ex={};
for(const seed of seeds){ const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const g=governingFactionOf(s); const k=g?.modifier; if(!k) continue;
  const fam=W.modifierFamilyOf(k); const w=W.governingModifierWordsOf(s);
  const t=(by[k]??={stored:0,borne:0,unborne:0}); t.stored++; w?t.borne++:t.unborne++;
  (ex[(w||k+':unborne')]??=[]).push(seed);
}
console.log(JSON.stringify(by,null,0)); for(const [k,v] of Object.entries(ex)) console.log(k, v.length, v.join(' '));
