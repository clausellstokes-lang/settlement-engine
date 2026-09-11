import { statSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const p=path.join(D,'src/data/dossierCausalProse.generated.js'); const size=statSync(p).size;
const causal=Object.values(await import(pathToFileURL(p).href))[0];
let vb=0,n=0,tb=0; for(const b of Object.values(causal)) for(const vs of Object.values(b.pools)) for(const v of vs){n++;vb+=JSON.stringify(v,null,6).length;tb+=v.text.length;}
console.log(`causal leaf ${size} B, ${n} variants, variant records ${vb} B (${(100*vb/size).toFixed(1)}%), text ${tb} B (${(tb/n).toFixed(0)} B/sentence)`);
console.log(`x4 variant records: ${size - vb + vb*4} B`);
