/** Pre-existing dangling name-joins, and what a REMOVAL breaks. */
import { runHeadless, instrumentedRoot } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';
const RT=(o)=>JSON.parse(JSON.stringify(o));
const gen = async (row) => (await runHeadless(row, instrumentedRoot(row._seed ?? keyOf(row)).root)).settlement;

// the handle paths measured by the census, per kind
const INST_PATHS = new Set(['economicState.activeChains[].processingInstitutions[]','availableServices.equipment[].institution','availableServices.legal[].institution','availableServices.healing[].institution','economicState.tradeDependencies[].institution','availableServices.employment[].institution','resourceAnalysis.gaps[].institution','availableServices.entertainment[].institution','spatialLayout.quarters[].landmarks[]','availableServices.food[].institution','availableServices.lodging[].institution','economicState.activeChains[].dependency.institution','availableServices.magic[].institution','availableServices.information[].institution','availableServices.transport[].institution','availableServices.criminal[].institution','defenseProfile.institutions.garrison[].name','defenseProfile.institutions.magicDef[].name','defenseProfile.institutions.walls[].name','factions[].members[].corruptTies.thievesGuild','factions[].members[].corruptTies.criminalInstitution','factions[].members[].secondaryAffiliation','npcs[].corruptTies.thievesGuild','npcs[].corruptTies.criminalInstitution','npcs[].secondaryAffiliation','resourceAnalysis.resourceChains[].processingInstitutions[]','factions[].members[].institution','npcs[].institution','defenseProfile.institutions.watch[].name','resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]','defenseProfile.institutions.charter[].name','resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]','availableServices.legal[].name','defenseProfile.institutions.mercenary[].name','npcs[].linkedInstitutionIds[]','defenseProfile.institutions.militia[].name']);
const FAC_PATHS = new Set(['npcs[].factionAffiliation','powerStructure.factionRelationships[].pair[]','factions[].members[].factionAffiliation','factions[].powerFactionName','powerStructure.government','powerStructure.governingName','factions[].members[].secondaryAffiliation','npcs[].secondaryAffiliation','history.currentTensions[].factions[]','npcs[].linkedFactionIds[]']);
const NPC_PATHS = new Set(['relationships[].npc2Name','relationships[].npc1Name','factions[].members[].name','prominentRelationship.npc2','prominentRelationship.npc1']);

function walk(root, cb, maxDepth=25){const st=[[root,'',0]];while(st.length){const[v,p,d]=st.pop();
  if(d>maxDepth||v==null)continue; if(typeof v==='string'){cb(p,v);continue;} if(typeof v!=='object')continue;
  if(Array.isArray(v)){for(const x of v)st.push([x,`${p}[]`,d+1]);continue;} for(const k of Object.keys(v))st.push([v[k],p?`${p}.${k}`:k,d+1]);}}

function dangles(s){
  const inst=new Set(s.institutions.map(i=>i.name)); const fac=new Set(s.powerStructure.factions.map(f=>f.faction||f.name));
  const npc=new Set(s.npcs.map(n=>n.name));
  const out={inst:0,fac:0,npc:0,instPaths:new Map()};
  walk(s,(p,v)=>{const t=v.trim(); if(!t)return;
    if(INST_PATHS.has(p)&&!inst.has(t)){out.inst++; out.instPaths.set(p,(out.instPaths.get(p)||0)+1);}
    if(FAC_PATHS.has(p)&&!fac.has(t))out.fac++;
    if(NPC_PATHS.has(p)&&!npc.has(t))out.npc++;});
  return out;
}

console.log('=== PRE-EXISTING DANGLING NAME-JOINS, per settlement, by tier (63-row sample) ===');
const byTier=new Map(); const allInstPaths=new Map();
for(const r of sample63()){
  const s=await gen(r); const d=dangles(s);
  const t=s.tier; const rec=byTier.get(t)||{rows:0,inst:[],fac:[],npc:[]}; rec.rows++;
  rec.inst.push(d.inst); rec.fac.push(d.fac); rec.npc.push(d.npc); byTier.set(t,rec);
  for(const[p,n] of d.instPaths) allInstPaths.set(p,(allInstPaths.get(p)||0)+n);
}
const stat=(a)=>a.length?`min ${Math.min(...a)} med ${a.slice().sort((x,y)=>x-y)[a.length>>1]} max ${Math.max(...a)}`:'-';
for(const[t,r] of byTier) console.log(`   ${t.padEnd(11)} rows ${String(r.rows).padStart(2)}  inst-dangles ${stat(r.inst).padEnd(24)} fac ${stat(r.fac).padEnd(20)} npc ${stat(r.npc)}`);
console.log('\n   institution dangles by path:');
for(const[p,n] of [...allInstPaths].sort((a,b)=>b[1]-a[1])) console.log(`      ${String(n).padStart(5)}  ${p}`);

// ===== REMOVAL =====
console.log('\n=== REMOVAL of one institution (what the sweep owes) ===');
{
  const row = sample63().find(r=>r.settType==='city') || sample63()[0];
  const s = RT(await gen(row));
  const before = dangles(s);
  let best=null;
  for(const i of s.institutions){let n=0;walk(s,(p,v)=>{if(INST_PATHS.has(p)&&v.trim()===i.name)n++;});if(!best||n>best.n)best={i,n};}
  const idx=s.institutions.findIndex(x=>x.name===best.i.name);
  s.institutions.splice(idx,1);
  const after=dangles(s);
  console.log(`   removed "${best.i.name}" (${best.n} stored handles elsewhere)`);
  console.log(`   dangling institution joins: ${before.inst} -> ${after.inst}  (NEW: ${after.inst-before.inst})`);
  console.log('   nothing in src sweeps them: no institution rename/removal cascade exists.');
}
