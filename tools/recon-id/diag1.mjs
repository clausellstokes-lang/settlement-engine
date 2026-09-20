import { runHeadless, instrumentedRoot } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';
const rows = sample63();
let shown = 0;
const nameAnchorSamples = [];
for (const row of rows) {
  const { root } = instrumentedRoot(row._seed ?? keyOf(row));
  const s = await runHeadless(row, root);
  const odd = (s.npcs||[]).map((n,i)=>({i,id:n.id,name:n.name,role:n.role,cat:n.category,struct:n.structuralPosition,rank:n.structuralRank})).filter(x=>!/^npc_\d+$/.test(String(x.id)));
  if (odd.length && shown < 4) { console.log('--- row', keyOf(row), 'tier', s.tier, 'npcCount', s.npcs.length); for(const o of odd) console.log('   ', JSON.stringify(o)); shown++; }
  for (const inst of (s.institutions||[])) if (!inst.catalogId && nameAnchorSamples.length < 25) nameAnchorSamples.push({tier:s.tier,name:inst.name,cat:inst.category,source:inst.source,keys:Object.keys(inst).join(',')});
}
console.log('\n=== institutions with NO catalogId (name: anchor) — 25 samples ===');
for (const x of nameAnchorSamples) console.log(JSON.stringify(x));
