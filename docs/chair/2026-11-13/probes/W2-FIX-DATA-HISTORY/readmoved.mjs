// node readmoved.mjs TREE base tip N : for N moved births (stride), the history entries removed and added, with tier/pop/market
import { loadCorpus } from './load.mjs';
const TREE=process.argv[2]; const A=new Map(loadCorpus(process.argv[3]).map(x=>[x.seed,x.s])), B=new Map(loadCorpus(process.argv[4]).map(x=>[x.seed,x.s])); const N=+process.argv[5]||30;
const { factsOf } = await import(TREE + '/src/domain/facts/factsOf.js');
const ent=(s)=>[...(s.history?.historicalEvents||[]).map(e=>'TL '+e.name+' ('+e.yearsAgo+'y): '+e.description+' | eff: '+(e.lastingEffects||[]).join('; ')+' | hooks: '+(e.plotHooks||[]).join('; ')),...(s.history?.currentTensions||[]).map(t=>'TN '+t.type+': '+t.description+' | fac: '+(t.factions||[]).join('; ')+' | hooks: '+(t.plotHooks||[]).join('; '))];
const moved=[...A.keys()].filter(k=>JSON.stringify(ent(A.get(k)))!==JSON.stringify(ent(B.get(k))));
const step=Math.max(1,Math.floor(moved.length/N));
for(let i=0;i<moved.length&&i/step<N;i+=step){ const k=moved[i], a=A.get(k), b=B.get(k); const ea=ent(a), eb=ent(b); let mk; try{mk=factsOf(b).market}catch{}
 console.log(`## ${k} ${b.tier} pop ${b.population} market ${mk} stress ${(Array.isArray(b.stress)?b.stress:[b.stress]).filter(Boolean).map(x=>x.type).join('+')||'-'}`);
 for(const x of ea) if(!eb.includes(x)) console.log('  - '+x.slice(0,330)); for(const x of eb) if(!ea.includes(x)) console.log('  + '+x.slice(0,330)); }
console.log('moved', moved.length);
