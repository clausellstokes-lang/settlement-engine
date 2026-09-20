import { runHeadless, instrumentedRoot, TREE } from './instrument.mjs';
import { goldenCorpus, keyOf, sample63 } from './lib.mjs';
const { anchorForInstitution } = await import(`${TREE}/src/domain/townMap/anchors.js`);
const { factionRefOf, resolveFactionRef, factionMatchesRef } = await import(`${TREE}/src/domain/factionRefs.js`);
const { toPublicSafe } = await import(`${TREE}/src/domain/display/publicSafe.js`);
const RT = (o) => JSON.parse(JSON.stringify(o));
const gen = async (row) => (await runHeadless(row, instrumentedRoot(row._seed ?? keyOf(row)).root)).settlement;
const ALL = goldenCorpus();
const row = ALL.find(r => r.settType === 'city');

// ---------- 1. SAME-SEED REGENERATION ----------
const a = await gen(row); const b = await gen(row);
const ids = s => ({
  npc: s.npcs.map(n=>n.id),
  anch: s.institutions.map(anchorForInstitution),
  fac: s.powerStructure.factions.map(f=>f.faction||f.name),
});
const A = ids(a), B = ids(b);
console.log('=== 1. SAME-SEED REGENERATION (a vs b, identical config+seed) ===');
for (const k of ['npc','anch','fac']) console.log(`    ${k}: identical=${JSON.stringify(A[k])===JSON.stringify(B[k])}  n=${A[k].length}`);

// ---------- 2. SAME-SEED, ONE CONFIG KNOB MOVED (roster drift) ----------
const row2 = { ...row, monsterThreat: 'dangerous' };
const c = await gen(row2); const C = ids(c);
const setEq = (x,y)=>{const sx=new Set(x),sy=new Set(y);return [...sx].filter(v=>sy.has(v)).length;};
console.log('\n=== 2. ROSTER DRIFT (same seed, threat civilized->dangerous) ===');
console.log(`    npc ids:      ${A.npc.length} -> ${C.npc.length}; positional ids reused: ${setEq(A.npc,C.npc)}`);
console.log(`    inst anchors: ${A.anch.length} -> ${C.anch.length}; SAME anchors surviving: ${setEq(A.anch,C.anch)}`);
console.log(`    faction names:${A.fac.length} -> ${C.fac.length}; surviving: ${setEq(A.fac,C.fac)}`);
// what a positional npc id means under drift: same id, DIFFERENT person?
let repointed = 0;
for (let i=0;i<Math.min(a.npcs.length,c.npcs.length);i++) if (a.npcs[i].id===c.npcs[i].id && a.npcs[i].name!==c.npcs[i].name) repointed++;
console.log(`    ⛔ npc ids that name a DIFFERENT person after drift: ${repointed}`);

// ---------- 3. ROSTER REORDER (the editor / a DM move) ----------
const d = RT(a);
d.npcs.reverse(); d.institutions.reverse(); d.powerStructure.factions.reverse();
const D = ids(d);
console.log('\n=== 3. ROSTER REORDER (array reversed in place) ===');
console.log(`    npc ids follow the RECORD (stored on it): ${JSON.stringify(D.npc)===JSON.stringify([...A.npc].reverse())}`);
console.log(`    inst anchors follow the RECORD: ${JSON.stringify(D.anch)===JSON.stringify([...A.anch].reverse())}`);
console.log('    ⚠ but a MIGRATION that mints on stored array order would mint:', JSON.stringify(d.npcs.slice(0,3).map((n,i)=>`npc_${i+1}`)), 'for', JSON.stringify(d.npcs.slice(0,3).map(n=>n.name)));
console.log('      i.e. the same person would be re-keyed', JSON.stringify(d.npcs[0].id), '->', '"npc_1"');

// ---------- 4. THE PUBLIC VEIL ----------
const pub = toPublicSafe(RT(a));
console.log('\n=== 4. PUBLIC VEIL (toPublicSafe) ===');
console.log(`    npc.id survives: ${pub?.npcs?.[0]?.id !== undefined} (${JSON.stringify(pub?.npcs?.[0]?.id)})`);
console.log(`    institutions present: ${Array.isArray(pub?.institutions)} ; inst keys: ${JSON.stringify(Object.keys(pub?.institutions?.[0]||{}))}`);
console.log(`    powerStructure present: ${pub?.powerStructure !== undefined}; faction keys: ${JSON.stringify(Object.keys(pub?.powerStructure?.factions?.[0]||{}))}`);
console.log(`    settlement.id: ${JSON.stringify(pub?.id)}`);

// ---------- 5. FACTION-ID PROTOTYPE: what flips when factions gain an id ----------
console.log('\n=== 5. FACTION-ID PROTOTYPE (in memory; nothing written) ===');
const slug = (s)=>String(s).toLowerCase().replace(/\s+/g,'_');
for (const [label, mint] of [['(a) faction.<slug>', (f,i)=>`faction.${slug(f.faction||f.name)}`], ['(b) fac_<n>', (f,i)=>`fac_${i+1}`]]) {
  const e = RT(a);
  e.powerStructure.factions.forEach((f,i)=>{ f.id = mint(f,i); });
  const before = a.powerStructure.factions.map(factionRefOf);
  const after  = e.powerStructure.factions.map(factionRefOf);
  console.log(`  ${label}: factionRefOf flips ${before.filter((v,i)=>v!==after[i]).length}/${before.length} handle VALUES`);
  // do OLD name handles still resolve once ids exist?  (mixed-handle save)
  const oldOk = before.every(nm => resolveFactionRef(e.powerStructure.factions, nm) !== null);
  const newOk = after.every(id => resolveFactionRef(e.powerStructure.factions, id) !== null);
  console.log(`     old NAME handles still resolve: ${oldOk} ; new ID handles resolve: ${newOk}`);
  // and after a RENAME with ids present?
  const f0 = e.powerStructure.factions[0]; const oldName = f0.faction||f0.name;
  f0.faction = 'ZZQQ'; if ('name' in f0) f0.name='ZZQQ';
  console.log(`     after a rename, the OLD name handle "${oldName}" resolves: ${resolveFactionRef(e.powerStructure.factions, oldName)!==null} ; the ID handle resolves: ${resolveFactionRef(e.powerStructure.factions, f0.id)!==null}`);
}

// ---------- 6. CORPUS: stored institution handles per institution ----------
console.log('\n=== 6. CORPUS (63-row sample): stored handles per INSTITUTION ===');
function countRefs(s, name) { let n=0; const st=[[s,0]];
  while(st.length){const [v,d]=st.pop(); if(d>25||v==null)continue;
    if(typeof v==='string'){ if(v.trim()===name) n++; continue;} if(typeof v!=='object')continue;
    if(Array.isArray(v)){for(const x of v)st.push([x,d+1]);continue;} for(const k of Object.keys(v))st.push([v[k],d+1]);} return n; }
let tot=0,cnt=0,max=0,maxName='',withRefs=0,nameAnchorWithRefs=0,nameAnchorTot=0;
for (const r of sample63()) {
  const s = await gen(r);
  for (const inst of s.institutions) {
    const n = countRefs(s, inst.name) - 1;   // minus its own institutions[].name
    tot+=n; cnt++; if(n>max){max=n;maxName=inst.name;} if(n>0) withRefs++;
    if(!inst.catalogId){ nameAnchorTot++; if(n>0) nameAnchorWithRefs++; }
  }
}
console.log(`    institutions: ${cnt}; mean OTHER stored handles each: ${(tot/cnt).toFixed(2)}; max ${max} ("${maxName}")`);
console.log(`    institutions referenced at least once elsewhere: ${withRefs} (${(100*withRefs/cnt).toFixed(1)}%)`);
console.log(`    name:-anchored (no catalogId): ${nameAnchorTot}; of those referenced elsewhere: ${nameAnchorWithRefs}`);
