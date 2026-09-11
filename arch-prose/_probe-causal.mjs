import { DOSSIER_CAUSAL_PROSE } from '../laneB6/src/data/dossierCausalProse.generated.js';
import * as G from '../laneB6/src/data/dossierStateProse/general.generated.js';
import * as S from '../laneB6/src/data/dossierStateProse/stressors.generated.js';
const secs={}, armCount={}, famPrefix={};
for (const [id,f] of Object.entries(DOSSIER_CAUSAL_PROSE)) {
  for (const s of (f.sectionTarget||[])) secs[s]=(secs[s]||0)+1;
  armCount[(f.arms||[]).length]=(armCount[(f.arms||[]).length]||0)+1;
  famPrefix[id.split('-').slice(0,2).join('-')]=(famPrefix[id.split('-').slice(0,2).join('-')]||0)+1;
}
console.log('causal families by id prefix:', JSON.stringify(famPrefix));
console.log('sectionTarget histogram:', JSON.stringify(secs));
console.log('arms-per-family histogram:', JSON.stringify(armCount));
console.log('sample family ids:', Object.keys(DOSSIER_CAUSAL_PROSE).slice(0,12).join(', '));
const f0 = DOSSIER_CAUSAL_PROSE[Object.keys(DOSSIER_CAUSAL_PROSE)[0]];
console.log('sample family shape keys:', Object.keys(f0), 'arms=', f0.arms, 'slots=', f0.slots, 'sectionTarget=', f0.sectionTarget);
// {event} slot owner
for (const m of [G,S]) { const leaf=Object.values(m)[0];
  for (const [bid,b] of Object.entries(leaf)) for (const [pk,pool] of Object.entries(b.pools))
    for (const v of pool) if ((v.slots||[]).includes('event')) { console.log('{event} in', bid, '::', pk); break; }
}
