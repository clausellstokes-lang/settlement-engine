import { runHeadless, instrumentedRoot, TREE } from './instrument.mjs';
import { goldenCorpus, keyOf } from './lib.mjs';
const { anchorForInstitution } = await import(`${TREE}/src/domain/townMap/anchors.js`);
const { applyNpcRenameToSettlement } = await import(`${TREE}/src/domain/factionRename.js`);
const RT=(o)=>JSON.parse(JSON.stringify(o));
const gen = async (row) => (await runHeadless(row, instrumentedRoot(row._seed ?? keyOf(row)).root)).settlement;
const ALL = goldenCorpus(); const row = ALL.find(r=>r.settType==='city');

// A. POSITIONAL NPC ID UNDER A REAL ROSTER CHANGE
console.log('=== A. positional npc_<n> across a roster change (same seed) ===');
const base = await gen(row);
for (const knob of [{settType:'town'},{culture:'nordic'},{tradeRouteAccess:'port'}]) {
  const v = await gen({...row, ...knob});
  let re=0, same=0;
  const byId = new Map(base.npcs.map(n=>[n.id,n.name]));
  for (const n of v.npcs) { if(!byId.has(n.id)) continue; if (byId.get(n.id)===n.name) same++; else re++; }
  console.log(`   ${JSON.stringify(knob)}: npcs ${base.npcs.length}->${v.npcs.length}; ids shared ${same+re}; ⛔ id names a DIFFERENT person: ${re}`);
}

// B. ANCHOR UNDER A RENAME: cat: vs name:
console.log('\n=== B. anchorForInstitution under a RENAME ===');
const s = RT(base);
const withCat = s.institutions.find(i=>i.catalogId);
const noCat   = s.institutions.find(i=>!i.catalogId);
for (const [lbl,inst] of [['catalogId-bearing',withCat],['name:-anchored (cascade/repair)',noCat]]) {
  if(!inst){console.log(`   ${lbl}: none in this row`);continue;}
  const before = anchorForInstitution(inst);
  const after  = anchorForInstitution({...inst, name:'ZZQQ Renamed Hall'});
  console.log(`   ${lbl}: "${inst.name}" (source ${inst.source})  ${before} -> ${after}   MOVED=${before!==after}`);
}
console.log('   ⇒ a mapEdits pin / interiorEdits delta / fog session keyed on the old anchor is ORPHANED when it moves.');

// C. THE DOCUMENTED NPC-RENAME EXCEPTION (prominentRelationship)
console.log('\n=== C. npc rename: the declared non-cascaded surface ===');
{
  const t = RT(base);
  const pr = t.prominentRelationship;
  if (pr?.npc1) {
    const oldName = pr.npc1;
    applyNpcRenameToSettlement(t, oldName, 'ZZQQ Renamed Person');
    console.log(`   renamed "${oldName}"; prominentRelationship.npc1 is now ${JSON.stringify(t.prominentRelationship.npc1)}  (stale=${t.prominentRelationship.npc1===oldName})`);
    console.log(`   prominentRelationship.full still contains the old name: ${String(t.prominentRelationship.full||'').includes(oldName)}`);
    console.log('   [declared in NPC_NON_CASCADED_SURFACES — owner-gated prose policy, not an oversight]');
  } else console.log('   no prominentRelationship on this row');
}

// D. WHICH PIPELINE STEPS ADD FACTIONS / INSTITUTIONS AFTER THEIR MINT POINT
console.log('\n=== D. roster growth after the producing step (why a mint point is not the last word) ===');
{
  const { runPipeline, getStepOrder } = await import('./instrument.mjs');
  const { initialContextFor } = await import('./instrument.mjs');
  const order = getStepOrder();
  const marks = [];
  const ctx0 = initialContextFor(row);
  const { withCustomContent } = await import('./instrument.mjs');
  await withCustomContent({}, () => runPipeline(ctx0, instrumentedRoot(row._seed??keyOf(row)).root, {
    onStep: (name, ctx) => { marks.push([name,
      Array.isArray(ctx?.institutions)?ctx.institutions.length:(ctx?.settlement?.institutions?.length??null),
      Array.isArray(ctx?.powerStructure?.factions)?ctx.powerStructure.factions.length:(ctx?.settlement?.powerStructure?.factions?.length??null)]); },
  }));
  let pi=null,pf=null;
  for (const [n,i,f] of marks) { const di=(i!=null&&pi!=null&&i!==pi)?` inst ${pi}->${i}`:''; const df=(f!=null&&pf!=null&&f!==pf)?` fac ${pf}->${f}`:'';
    if(di||df||(pi===null&&i!=null)||(pf===null&&f!=null)) console.log(`   ${n}: inst=${i} fac=${f}${di}${df}`); if(i!=null)pi=i; if(f!=null)pf=f; }
}
