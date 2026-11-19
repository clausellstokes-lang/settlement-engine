import { loadCorpus } from './load.mjs';
const TREE=process.argv[2]; const c=loadCorpus(process.argv[3]);
const { factsOf } = await import(TREE + '/src/domain/facts/factsOf.js');
const n={}; for(const {s} of c){ let mk; try{mk=!!factsOf(s).market}catch{continue} if(mk) continue;
 for(const e of s.history?.historicalEvents||[]) n['TL '+e.templateType]=(n['TL '+e.templateType]||0)+1;
 for(const t of s.history?.currentTensions||[]) n['TN '+t.type]=(n['TN '+t.type]||0)+1; }
console.log(Object.entries(n).sort((a,b)=>b[1]-a[1]).map(x=>x.join(' ')).join('\n'));
