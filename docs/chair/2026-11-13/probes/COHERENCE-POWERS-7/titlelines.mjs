// node titlelines.mjs <tree> <corpus...>: cards whose title line its declaration refuses in its town
import { recs } from './rd.mjs'; import path from 'node:path';
const T=path.resolve(process.argv[2]);
const D={ secret:{ 'Buys fish from boats that fished where they are forbidden to, and never asks where the catch came from':['navigable'], "Has been buying stolen ship's stores at night and selling them in the shop the next morning":['coast'], "Has been taking timber from the river's driftwood that belongs to the mill upstream":['river'], 'Has been selling some of the foundlings to families who pay, without any record':['topic'] },
 presentation:{ 'Cheerful in the cold and the stink of the market. Knows every regular by name and by order.':['navigable'], 'Smells of wax and soap, friendly and talkative, with a little of everything on the shelves.':['coast'], 'Easy and talkative, proud of every boat on the river that came from the yard.':['river'], 'Watches visitors near the slipway. Keeps the half-built hulls under cover.':['river'] } };
const { waterOf } = await import(T+'/src/domain/facts/water.js');
const { resolveGenerationContentProfile } = await import(T+'/src/domain/generationContentProfile.js');
let towns=new Set(), n=0; const by={}; const dup=[];
for (const f of process.argv.slice(3)) for await (const {seed,s} of recs(f)) { const w=waterOf(s); const b=resolveGenerationContentProfile(s.config).boundaries; const seen=new Map();
  for (const c of s.npcs||[]) { for (const [k,txt] of [['secret',c.secret?.what],['presentation',c.presentation?.impression]]) { const need=D[k][txt]; if(!need) continue; const ok=need[0]==='topic'?b.human_trafficking===true:w[need[0]]; if(!ok){ n++; towns.add(seed); by[txt.slice(0,40)]=(by[txt.slice(0,40)]||0)+1; } }
    const sw=c.secret?.what; if(sw){ if(seen.has(sw)) dup.push(`${seed}: ${sw.slice(0,50)}`); seen.set(sw,1);} } }
console.log('refused lines printed',n,'towns',towns.size, by, 'duplicate secrets', dup.length, dup.slice(0,4));
