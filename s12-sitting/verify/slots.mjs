import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const gdir=path.join(D,'src/data/dossierStateProse'); const slotBlocks={}; const blockSlots={}; let blocks=0,pools=0,variants=0;
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) { const mod=await import(pathToFileURL(path.join(gdir,f)).href); const table=Object.values(mod)[0];
  for (const [block,b] of Object.entries(table)) { blocks++; const set=new Set(); for (const [pool,vs] of Object.entries(b.pools||{})) { pools++; for (const v of vs) { variants++; for (const m of v.text.matchAll(/\{([a-z_0-9]+)\}/g)) set.add(m[1]); } }
    blockSlots[block]=[...set]; for (const s of set) slotBlocks[s]=(slotBlocks[s]||0)+1; } }
console.log(`blocks ${blocks} pools ${pools} variants ${variants}`);
console.log('slot -> #blocks using it:'); for (const [s,n] of Object.entries(slotBlocks).sort((a,b)=>b[1]-a[1])) console.log(`  {${s}} ${n}`);
const nonSet=Object.entries(blockSlots).filter(([b,s])=>s.filter(x=>x!=='settlement').length>0); console.log(`blocks with any slot beyond {settlement}: ${nonSet.length} of ${blocks}`);
for (const [b,s] of nonSet) console.log(`  ${b}: ${s.join(', ')}`);
