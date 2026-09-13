import { pathToFileURL } from 'node:url';
const B='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6';
const mod=await import(pathToFileURL(`${B}/src/data/dossierStateProse/general.generated.js`).href);
const T=Object.values(mod)[0]; const b=T['DS-GEN-3'];
for(const [k,vs] of Object.entries(b.pools)) console.log(String(vs.length).padStart(2),JSON.stringify(k));
