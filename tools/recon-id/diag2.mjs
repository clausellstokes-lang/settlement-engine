import { runHeadless, instrumentedRoot, TREE } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';
const { catalogIdForName } = await import(`${TREE}/src/data/institutionalCatalog.js`);
const rows = sample63();
let shown = 0; const noCat = new Map();
for (const row of rows) {
  const { root } = instrumentedRoot(row._seed ?? keyOf(row));
  const ctx = await runHeadless(row, root);
  const s = ctx.settlement ?? ctx;
  const odd = (s.npcs||[]).map((n,i)=>({i,id:n.id,name:n.name,role:n.role,cat:n.category,rank:n.structuralRank,keys:Object.keys(n).length})).filter(x=>!/^npc_\d+$/.test(String(x.id)));
  if (odd.length && shown < 5) { console.log('--- row', keyOf(row), 'tier', s.tier, 'npcCount', s.npcs.length, 'odd', odd.length); for(const o of odd) console.log('   ', JSON.stringify(o)); shown++; }
  for (const inst of (s.institutions||[])) if (!inst.catalogId) {
    const k = `${inst.name}|${inst.source||''}`;
    if (!noCat.has(k)) noCat.set(k, { name: inst.name, source: inst.source, lookup: catalogIdForName(inst.name), n: 0 });
    noCat.get(k).n += 1;
  }
}
console.log('\n=== distinct NO-catalogId institution names:', noCat.size, '===');
const bySource = new Map();
for (const v of noCat.values()) bySource.set(v.source, (bySource.get(v.source)||0)+1);
console.log('by source:', JSON.stringify(Object.fromEntries(bySource)));
console.log('catalogIdForName re-lookup non-null count:', [...noCat.values()].filter(v=>v.lookup).length);
console.log('samples:', JSON.stringify([...noCat.values()].slice(0,12)));
console.log('\n=== control: catalogIdForName on a known catalog name ===');
