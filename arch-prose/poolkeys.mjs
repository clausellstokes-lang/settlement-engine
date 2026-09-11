import { readdirSync } from 'node:fs'; import { join } from 'node:path';
const DIR='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/data/dossierStateProse';
const want = process.argv.slice(2);
const hist={};
for (const f of readdirSync(DIR).filter(x=>x.endsWith('.generated.js')).sort()) {
  const mod = await import(`file://${join(DIR,f)}`);
  for (const [block,b] of Object.entries(Object.values(mod)[0])) {
    for (const [pk,list] of Object.entries(b.pools||{})) hist[list.length]=(hist[list.length]||0)+1;
    if (want.length && want.includes(block)) {
      console.log(`\n### ${block} — ${Object.keys(b.pools).length} pools`);
      for (const [pk,list] of Object.entries(b.pools)) console.log(`  [${list.length}] ${pk}`);
    }
  }
}
if(!want.length){console.log('variants-per-pool histogram:'); for(const [k,v] of Object.entries(hist).sort((a,b)=>a[0]-b[0])) console.log(`  ${k} -> ${v} pools`);}
