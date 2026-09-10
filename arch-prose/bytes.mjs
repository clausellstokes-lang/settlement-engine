import { readdirSync, statSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const gdir=path.join(D,'src/data/dossierStateProse'); const all={}; let fileBytes=0;
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) { fileBytes+=statSync(path.join(gdir,f)).size; const m=await import(pathToFileURL(path.join(gdir,f)).href); Object.assign(all, Object.values(m)[0]); }
let variantBytes=0, textBytes=0, n=0, pools=0, scaffold=0;
for (const [bid,b] of Object.entries(all)){ scaffold += JSON.stringify({title:b.title,sectionTarget:b.sectionTarget,arms:b.arms,slots:b.slots},null,2).length + bid.length+6;
  for (const [k,vs] of Object.entries(b.pools)){ pools++; scaffold += k.length+8;
    for (const v of vs){ n++; variantBytes += JSON.stringify(v,null,6).length; textBytes += v.text.length; } } }
console.log(`state leaves on disk: ${fileBytes} B for ${n} variants in ${pools} pools`);
console.log(`variant records as emitted JSON (indent 6): ${variantBytes} B = ${(100*variantBytes/fileBytes).toFixed(1)}% of the leaves`);
console.log(`raw sentence text alone: ${textBytes} B (${(textBytes/n).toFixed(0)} B/sentence); block+pool scaffolding ≈ ${scaffold} B`);
console.log(`x4 wordings, variant records only: ${fileBytes - variantBytes + variantBytes*4} B (${((fileBytes - variantBytes + variantBytes*4)/1048576).toFixed(2)} MiB)`);
