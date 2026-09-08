import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const m=await import(pathToFileURL(path.join(D,'src/data/dossierCausalProse.generated.js')).href);
const causal=Object.values(m)[0];
let und=new Set(), declaredUnused=0, tot=0;
for(const [bid,b] of Object.entries(causal)){ const used=new Set();
  for(const vs of Object.values(b.pools)) for(const v of vs){tot++; for(const s of v.slots) used.add(s);} 
  for(const s of used) if(!b.slots.includes(s)) und.add(`${bid}::{${s}}`);
  for(const s of b.slots) if(!used.has(s)) declaredUnused++; }
console.log('CAUSAL: variant slots not on block SLOTS line:', und.size, [...und].slice(0,8).join(' '));
console.log('CAUSAL: block-declared slots never used:', declaredUnused);
// arm coverage: marks per variant in causal
const armStats={}; for(const [bid,b] of Object.entries(causal)){ const arms=b.arms; const counts=arms.map(a=>b.pools['*'].filter(v=>(v.marks||[]).includes(a)).length); armStats[arms.join('/')]=(armStats[arms.join('/')]||0)+1; }
console.log('distinct arm pairs:', Object.keys(armStats).length);
const withDm=Object.values(causal).flatMap(b=>b.pools['*']).filter(v=>(v.marks||[]).includes('dm-only')).length;
console.log('causal dm-only variants:', withDm, 'of', tot);
