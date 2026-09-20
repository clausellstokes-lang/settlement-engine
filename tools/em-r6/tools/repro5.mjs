/** STRICT institution-reference paths only: dangles + the rename delta over the sample. */
import { runHeadless, instrumentedRoot } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';
const RT=(o)=>JSON.parse(JSON.stringify(o));
const gen = async (row) => (await runHeadless(row, instrumentedRoot(row._seed ?? keyOf(row)).root)).settlement;

// paths whose value is BY CONTRACT an institution reference (key name says so)
const STRICT = [
  'availableServices.equipment[].institution','availableServices.legal[].institution','availableServices.healing[].institution',
  'availableServices.employment[].institution','availableServices.entertainment[].institution','availableServices.food[].institution',
  'availableServices.lodging[].institution','availableServices.magic[].institution','availableServices.information[].institution',
  'availableServices.transport[].institution','availableServices.criminal[].institution',
  'economicState.activeChains[].processingInstitutions[]','economicState.activeChains[].dependency.institution',
  'economicState.tradeDependencies[].institution','resourceAnalysis.gaps[].institution',
  'resourceAnalysis.resourceChains[].processingInstitutions[]',
  'resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]',
  'resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]',
  'defenseProfile.institutions.garrison[].name','defenseProfile.institutions.magicDef[].name','defenseProfile.institutions.walls[].name',
  'defenseProfile.institutions.watch[].name','defenseProfile.institutions.charter[].name','defenseProfile.institutions.mercenary[].name',
  'defenseProfile.institutions.militia[].name',
  'npcs[].institution','factions[].members[].institution','npcs[].linkedInstitutionIds[]',
  'npcs[].corruptTies.criminalInstitution','factions[].members[].corruptTies.criminalInstitution',
  'npcs[].corruptTies.thievesGuild','factions[].members[].corruptTies.thievesGuild',
];
const SS = new Set(STRICT);
const POLY = ['availableServices.legal[].name','spatialLayout.quarters[].landmarks[]','npcs[].secondaryAffiliation','factions[].members[].secondaryAffiliation','economicState.activeChains[].label','economicState.activeChains[].resource','resourceAnalysis.resourceConditions[].label','simulationTrace[].downstreamEffects[].target','generationCoherenceReceipt.repairs[].subject'];

function walk(root,cb,maxDepth=25){const st=[[root,'',0]];while(st.length){const[v,p,d]=st.pop();
  if(d>maxDepth||v==null)continue; if(typeof v==='string'){cb(p,v);continue;} if(typeof v!=='object')continue;
  if(Array.isArray(v)){for(const x of v)st.push([x,`${p}[]`,d+1]);continue;} for(const k of Object.keys(v))st.push([v[k],p?`${p}.${k}`:k,d+1]);}}
const strictDangle=(s)=>{const roster=new Set(s.institutions.map(i=>i.name));let n=0;const byP=new Map();
  walk(s,(p,v)=>{if(SS.has(p)&&v.trim()&&!roster.has(v.trim())){n++;byP.set(p,(byP.get(p)||0)+1);}});return{n,byP};};

const byTier=new Map(); const dangleP=new Map();
let renTot=0,renN=0,renMax=0,renMaxName='';
let polyRoster=0, polyOff=0;
for(const r of sample63()){
  const s=await gen(r); const t=s.tier;
  const d=strictDangle(s);
  const rec=byTier.get(t)||{rows:0,v:[]}; rec.rows++; rec.v.push(d.n); byTier.set(t,rec);
  for(const[p,n] of d.byP) dangleP.set(p,(dangleP.get(p)||0)+n);
  // rename delta: for EVERY institution, how many STRICT handles would go stale
  const roster=new Set(s.institutions.map(i=>i.name));
  const cnt=new Map(); walk(s,(p,v)=>{ if(SS.has(p)&&roster.has(v.trim())) cnt.set(v.trim(),(cnt.get(v.trim())||0)+1); });
  for(const i of s.institutions){const n=cnt.get(i.name)||0; renTot+=n; renN++; if(n>renMax){renMax=n;renMaxName=`${i.name} (${t})`;}}
  // polysemy check
  walk(s,(p,v)=>{ if(POLY.includes(p)){ if(roster.has(v.trim())) polyRoster++; else polyOff++; } });
}
const stat=(a)=>{const b=a.slice().sort((x,y)=>x-y);return `min ${b[0]} med ${b[b.length>>1]} max ${b[b.length-1]}`;};
console.log('=== STRICT institution-reference dangles ALREADY PRESENT, per settlement ===');
for(const[t,r] of byTier) console.log(`   ${t.padEnd(11)} rows ${String(r.rows).padStart(2)}  ${stat(r.v)}`);
console.log('\n   by path:');
for(const[p,n] of [...dangleP].sort((a,b)=>b[1]-a[1])) console.log(`      ${String(n).padStart(5)}  ${p}`);
console.log(`\n=== RENAME DELTA: strict handles that go stale per institution renamed ===`);
console.log(`   institutions ${renN}; total strict handles ${renTot}; mean ${(renTot/renN).toFixed(2)}; max ${renMax} ("${renMaxName}")`);
console.log(`\n=== POLYSEMY of the 9 excluded paths: values matching the roster ${polyRoster}, not matching ${polyOff}`);
