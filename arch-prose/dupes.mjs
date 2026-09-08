import { SENSORY_NOUNS, SENSE_OF_NOUN } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/src/domain/prose/presenceMeasure.js';
const seen={};
for (const [s,ns] of Object.entries(SENSORY_NOUNS)) for (const n of ns) (seen[n] ||= []).push(s);
const dup = Object.entries(seen).filter(([,v])=>v.length>1);
console.log('nouns in more than one bucket:', dup.map(([n,v])=>`${n} [${v.join('+')}] -> resolves to ${SENSE_OF_NOUN[n]}`).join(' · '));
console.log('total listed', Object.values(SENSORY_NOUNS).reduce((a,b)=>a+b.length,0), 'distinct', Object.keys(seen).length);
