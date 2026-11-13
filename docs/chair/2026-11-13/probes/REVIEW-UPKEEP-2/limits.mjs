// Limit 2 planted: a walled town's record with every armed house removed; limit 1's condition where it bites.
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { partitionDefenseInstitutions } = await import(T+'/src/domain/institutions/defenseInstitutionBuckets.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
await loadGenerationLawPayloads(); const clone=o=>JSON.parse(JSON.stringify(o));
let l2=0,l2n=0,l1bad=0,l1=0;
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){ const m=seed.split('-');
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:[m[1]],selectedStressesRandom:false}),null,{seed,customContent:{}});
  const k=keepOfRecord(s.economicState); const dp=s.defenseProfile;
  if(dp.parts.some(p=>p.id==='sustainsHeld')){ l1++; const listed=g=>dp.parts.filter(p=>p.group===g).reduce((a,p)=>a+p.points,0)+(g==='SUSTAINS'?-dp.parts.find(p=>p.id==='sustainsHeld').points:0);
    if(!(listed('SUSTAINS')>listed('STANDS')-1e-6)) l1bad++; }
  const P=partitionDefenseInstitutions(s.institutions); if(!P.walls.length) continue;
  const armed=new Set([...P.garrison,...P.militia,...P.watch,...P.mercenary,...P.charter].map(i=>i.name));
  const x=clone(s); x.institutions=x.institutions.filter(i=>!armed.has(i.name)); delete x.defenseProfile;
  const q=generateDefenseProfile(x,k); l2n++; const w=q.parts.find(p=>p.id==='wallsUnmanned'); const ww=q.parts.find(p=>p.id==='walls');
  if(w) l2++; if(l2n<=3) console.log(seed,m[2],'armed removed',[...armed].join('|'),'walls',ww?.points,'wallsUnmanned',w?.points,'parts',q.parts.filter(p=>['households','wardens','will'].includes(p.id)).map(p=>p.id+':'+p.points).join(' '));
}
console.log('limit 2 plant: walled records with every armed house removed',l2n,'limit 2 bites',l2); console.log('limit 1 bites',l1,'of which SUSTAINS listed not above STANDS',l1bad);
