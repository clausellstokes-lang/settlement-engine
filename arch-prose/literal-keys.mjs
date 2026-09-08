import { readdirSync, readFileSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const sdir=path.join(D,'src/domain/display/stateProse');
const src=readdirSync(sdir).filter(f=>f.endsWith('.js')).map(f=>readFileSync(path.join(sdir,f),'utf8')).join('\n');
const gdir=path.join(D,'src/data/dossierStateProse'); const all={};
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) { const m=await import(pathToFileURL(path.join(gdir,f)).href); Object.assign(all, Object.values(m)[0]); }
let hit=0,miss=0; const missByBlock={};
for(const [bid,b] of Object.entries(all)) for(const k of Object.keys(b.pools)){
  if (src.includes(k)) hit++; else { miss++; (missByBlock[bid]=missByBlock[bid]||[]).push(k); } }
console.log(`pool keys appearing VERBATIM in a desk source file: ${hit} of ${hit+miss} (${(100*hit/(hit+miss)).toFixed(1)}%)`);
const rows=Object.entries(missByBlock).sort((a,b)=>b[1].length-a[1].length);
console.log('blocks with the most non-literal keys (block: n missing / total pools):');
for(const [bid,ks] of rows.slice(0,20)) console.log(`  ${bid}: ${ks.length} / ${Object.keys(all[bid].pools).length}`);
console.log('blocks with ZERO literal key hits:', Object.entries(all).filter(([bid,b])=>Object.keys(b.pools).every(k=>!src.includes(k))).map(([b])=>b).join(' '));
