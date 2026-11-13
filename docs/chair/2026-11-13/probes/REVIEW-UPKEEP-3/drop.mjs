const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js'); const DG = await import(T+'/src/generators/defenseGenerator.js');
const B = await import(T+'/src/domain/institutions/defenseInstitutionBuckets.js');
await loadGenerationLawPayloads();
for (const [seed,house] of JSON.parse(process.argv[2])){ const m=seed.match(/^rv[234]-([a-z_+]+)-(\w+)-(\d+)$/);
 const s=JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}),null,{seed,customContent:{}})));
 const i=s.institutions.findIndex(x=>x.name===house); const inst=s.institutions[i];
 const inRoster=B.magicPresenceRosterOf([inst]).length===1;
 const x=JSON.parse(JSON.stringify(s)); x.institutions.splice(i,1);
 const mag=p=>(p.find(q=>q.id==='magic')||{}).full;
 console.log(seed,house,'| stays in the presence roster:',inRoster,'| magic part full with/without:',mag(DG.defencePartsOf(s)),mag(DG.defencePartsOf(x)), '| tier',s.tier);
}
