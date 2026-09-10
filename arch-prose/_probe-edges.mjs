import { CONDITION_ARCHETYPE_TEMPLATES } from '../laneB6/src/domain/activeConditions.js';
import { SYSTEM_VARIABLES } from '../laneB6/src/domain/causalState.js';
import { CAUSE_CLASSES, CAUSE_FAMILIES } from '../laneB6/src/domain/worldPulse/causeVocabulary.js';
const A = Object.entries(CONDITION_ARCHETYPE_TEMPLATES);
let edges = 0; const byVar = {};
for (const [k,v] of A) { for (const s of v.affectedSystems||[]) { edges++; byVar[s]=(byVar[s]||0)+1; } }
console.log('condition archetypes:', A.length);
console.log('archetype -> affectedSystems EDGES:', edges);
console.log('SYSTEM_VARIABLES:', SYSTEM_VARIABLES.length, SYSTEM_VARIABLES.join(', '));
console.log('edges per variable:', JSON.stringify(Object.fromEntries(Object.entries(byVar).sort((a,b)=>b[1]-a[1]))));
const unknown = Object.keys(byVar).filter(v=>!SYSTEM_VARIABLES.includes(v));
console.log('affectedSystems values NOT in SYSTEM_VARIABLES:', JSON.stringify(unknown));
console.log('CAUSE_CLASSES:', CAUSE_CLASSES.length, 'families:', CAUSE_FAMILIES.join(','));
