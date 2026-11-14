// UPKEEP-9: births with one dial at an extreme, to find where each generatePowerDynamics line prints.
// usage: TREE=<tree> node vfind.mjs <out.json>
import fs from 'node:fs';
const T=process.env.TREE;
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads();
const DIALS={military:['priorityMilitary',100],religion:['priorityReligion',100],magic:['priorityMagic',100],criminal:['priorityCriminal',100],bank:['priorityEconomy',0]};
const TIERS=['thorp','hamlet','village','town','city','metropolis']; const CRISES=[[],['under_siege'],['famine']];
const out={};
for(const [dk,[key,val]] of Object.entries(DIALS)) for(const t of TIERS) for(const cr of CRISES) for(let i=0;i<6;i++){
  const seed=`v9-${dk}-${t}-${cr[0]||'calm'}-${i}`;
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:t,[key]:val,selectedStresses:cr,selectedStressesRandom:false}),null,{seed,customContent:{}});
  const v=s.economicViability||{};
  for(const k of ['issues','warnings','dependencies','suggestions']) for(const w of (v[k]||[])) if(/Priorit|Faith|Magic|Crime|Banking|Arms|Isolation/i.test(w.title||'')) (out[w.title]??=[]).push({seed,tier:t,crisis:cr[0]||'calm',viable:v.viable,description:w.description,impact:w.impact,fixes:w.suggestedFixes,note:w.priorityNote});
}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));
for(const [k,v] of Object.entries(out)) console.log(v.length, k);
