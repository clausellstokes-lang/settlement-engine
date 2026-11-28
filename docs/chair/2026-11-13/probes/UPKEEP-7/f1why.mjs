const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { standingDefenseForces } = await import(T+'/src/domain/institutions/defenseInstitutionBuckets.js');
await loadGenerationLawPayloads();
const C=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const out={};
for (const cls of ['A nobody-on-walls with a force present','B no-line-no-force with a force present']) {
  const rows=(C[cls]||[]); const tally={};
  for (const [seed] of rows) {
    const m=seed.match(/^rv2-([a-z_]+)-(\w+)-(\d+)$/);
    const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:[m[1]],selectedStressesRandom:false}),null,{seed,customContent:{}});
    const f=standingDefenseForces(s);
    const k=['walls','garrison','militia','watch','mercenary','charter'].filter(b=>f[b].present).join('+');
    tally[k]=(tally[k]||0)+1;
  }
  out[cls]=tally;
}
console.log(JSON.stringify(out,null,1));
