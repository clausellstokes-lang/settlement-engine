import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const mod = await import(pathToFileURL(D+'/src/domain/worldPulse/warReceiptPools.js').href);
const FP=/\b(I|we|my|our|us|me|mine|ours)\b/;
let pools=0, fpPools=0, mixed=0, fpLines=0, lines=0; const mixedNames=[]; const fpNames=[];
const walk=(o,path)=>{ if(Array.isArray(o)){ if(o.length && o.every(x=>typeof x==='string')){ pools++; lines+=o.length; const f=o.filter(s=>FP.test(s)).length; fpLines+=f; if(f>0){fpPools++; fpNames.push(path);} if(f>0&&f<o.length){mixed++; mixedNames.push(`${path} ${f}/${o.length}`);} } else o.forEach((x,i)=>walk(x,path+'['+i+']')); } else if(o&&typeof o==='object'){ for(const [k,v] of Object.entries(o)) walk(v,path+'.'+k);} else if(typeof o==='function'){ /* lambda pool */ } };
for(const [k,v] of Object.entries(mod)) walk(v,k);
console.log(`exports: ${Object.keys(mod).join(', ')}`); console.log(`string-array pools ${pools} · lines ${lines} · first-person pools ${fpPools} · mixed ${mixed} · first-person lines ${fpLines}`); console.log('mixed:', mixedNames.join(' | ')); console.log('fp pools:', fpNames.join(' | '));
