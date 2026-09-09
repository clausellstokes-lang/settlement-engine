import { readdirSync, readFileSync } from 'node:fs';
const P='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/primary/';
const files=readdirSync(P).filter(f=>f.endsWith('.fingerprint.json'));
const get=(o,path)=>path.split('.').reduce((a,k)=>a&&a[k],o);
const keys=['rhythm.runsOfThree','rhythm.neighbourVariation','openers.sameOpenerAsPreviousRate','lexicon.adverbRate','lexicon.doubledAdjectiveRate','closers.abstractNounRate','closers.pronounRate','wordsPerSentence.sd'];
const rows=[];
for (const f of files){ const j=JSON.parse(readFileSync(P+f,'utf8')); const r={name:f.replace('.fingerprint.json','')}; for(const k of keys){ let v=get(j,k); if(v===undefined){ // search any depth for the leaf key
   const leaf=k.split('.').pop(); const stack=[j]; while(stack.length&&v===undefined){const o=stack.pop(); if(o&&typeof o==='object'){ if(leaf in o && typeof o[leaf]==='number'){v=o[leaf];break;} for(const x of Object.values(o)) if(x&&typeof x==='object') stack.push(x);} } } r[k.split('.').pop()]=v; } rows.push(r); }
console.log(['name',...keys.map(k=>k.split('.').pop())].join('\t'));
for(const r of rows) console.log(Object.values(r).map(v=>typeof v==='number'?v.toFixed(4):v).join('\t'));
for(const k of keys.map(k=>k.split('.').pop())){ const vs=rows.map(r=>r[k]).filter(v=>typeof v==='number'); console.log(`BAND ${k}: min ${Math.min(...vs).toFixed(4)} max ${Math.max(...vs).toFixed(4)} (n=${vs.length})`); }
