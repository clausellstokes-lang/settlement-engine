import { readdirSync } from 'node:fs'; import { join } from 'node:path';
const DIR='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/data/dossierStateProse';
let none=0,tot=0; const a={};
for (const f of readdirSync(DIR).filter(x=>x.endsWith('.generated.js')).sort()){const m=await import(`file://${join(DIR,f)}`);
for (const b of Object.values(Object.values(m)[0])) for (const list of Object.values(b.pools||{})) for (const v of list){tot++; if(!v.angle) none++; else a[v.angle]=(a[v.angle]||0)+1;}}
console.log('total',tot,'no angle',none,'sum of angles',Object.values(a).reduce((x,y)=>x+y,0));
console.log(a);
