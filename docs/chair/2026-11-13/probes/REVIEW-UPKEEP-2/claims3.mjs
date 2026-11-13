// C1, C2 in the new shape: the parts (defencePartsOf) sum to the stored score; the stored profile carries no parts;
// a record stripped of its profile recomputes equal; and the stored record carries no part word anywhere.
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const DG = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
await loadGenerationLawPayloads(); const c={n:0,sum:0,strip:0,noParts:0,noWords:0};
const WORDS=/Martial will|held in reserve|more than enough|Walls with no one to man them|Stores and supply can carry|rule \(limit|"points":/;
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){ const m=seed.match(/^rv[23]-([a-z_+]+)-(\w+)-(\d+)$/);
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}),null,{seed,customContent:{}}); c.n++;
  const stored=JSON.parse(JSON.stringify(s)); const dp=stored.defenseProfile;
  const parts=DG.defencePartsOf(stored); if(Math.round(parts.reduce((a,p)=>a+p.points,0)*10)===Math.round(dp.readiness.score*10)) c.sum++;
  if(!('parts' in dp)) c.noParts++;
  const x=JSON.parse(JSON.stringify(stored)); delete x.defenseProfile; if(JSON.stringify(DG.generateDefenseProfile(x,keepOfRecord(x.economicState)))===JSON.stringify(dp)) c.strip++;
  if(!WORDS.test(JSON.stringify(stored))) c.noWords++;
}
console.log(JSON.stringify(c));
