import { pathToFileURL } from 'node:url';
const B='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const mod=await import(pathToFileURL(`${B}/src/data/dossierStateProse/general.generated.js`).href);
const T=Object.values(mod)[0]; const b=T['DS-GEN-3'];
for(const [k,vs] of Object.entries(b.pools)) console.log(String(vs.length).padStart(2),JSON.stringify(k));
