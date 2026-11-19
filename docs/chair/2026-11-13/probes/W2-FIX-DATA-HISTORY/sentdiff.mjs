// node sentdiff.mjs base.gz tip.gz [field=history|arrival|culture|food|all] : what left / what came, by sentence (towns)
import { loadCorpus } from './load.mjs';
const A=new Map(loadCorpus(process.argv[2]).map(x=>[x.seed,x.s])), B=new Map(loadCorpus(process.argv[3]).map(x=>[x.seed,x.s]));
const F=process.argv[4]||'history';
const strs=(o,acc=[])=>{ if(typeof o==='string') acc.push(o); else if(Array.isArray(o)) o.forEach(x=>strs(x,acc)); else if(o&&typeof o==='object') Object.values(o).forEach(x=>strs(x,acc)); return acc; };
const pick=(s)=>F==='history'?s.history:F==='arrival'?s.arrivalScene:F==='culture'?s.culturalIdentity:F==='food'?s.economicState?.foodSecurity?.foodRecord?.foodwaysLine:s;
const left=new Map(), came=new Map(); let moved=0;
for(const [seed,a] of A){ const b=B.get(seed); if(!b) continue; const sa=new Set(strs(pick(a))), sb=new Set(strs(pick(b))); let m=false;
  for(const x of sa) if(!sb.has(x)){ m=true; (left.get(x)||left.set(x,new Set()).get(x)).add(seed); }
  for(const x of sb) if(!sa.has(x)){ m=true; (came.get(x)||came.set(x,new Set()).get(x)).add(seed); }
  if(m) moved++; }
console.log('births moved (strings in '+F+')', moved);
const show=(lab,m)=>{ console.log('== '+lab+' (distinct '+m.size+')'); for(const [k,v] of [...m].sort((a,b)=>b[1].size-a[1].size).slice(0,+(process.argv[5]||25))) console.log(v.size+'\t'+k.slice(0,160)+'\t'+[...v][0]); };
show('LEFT',left); show('CAME',came);
