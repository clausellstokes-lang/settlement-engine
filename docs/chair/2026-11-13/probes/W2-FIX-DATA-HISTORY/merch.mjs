import { loadCorpus } from './load.mjs';
const TREE=process.argv[2]; const c=loadCorpus(process.argv[3]);
const { factsOf } = await import(TREE + '/src/domain/facts/factsOf.js');
const m=new Map();
for (const {seed,s} of c){ let mk; try{mk=!!factsOf(s).market}catch{continue} if(mk) continue;
  const add=(k,x)=>{ if(typeof x!=='string'||!/\bmerchants?\b|merchant class|merchant'/i.test(x)) return; const key=k+' :: '+x.replace(/\s+/g,' ').slice(0,150); (m.get(key)||m.set(key,new Set()).get(key)).add(seed); };
  for(const e of s.history?.historicalEvents||[]){ add('TL '+(e.templateType||e.name)+' desc',e.description); (e.plotHooks||[]).forEach(h=>add('TL '+(e.templateType||e.name)+' hook',h)); (e.lastingEffects||[]).forEach(h=>add('TL '+(e.templateType||e.name)+' eff',h)); }
  for(const t of s.history?.currentTensions||[]){ add('TN '+t.type+' desc',t.description); (t.plotHooks||[]).forEach(h=>add('TN '+t.type+' hook',h)); (t.factions||[]).forEach(h=>add('TN '+t.type+' fac',h)); }
}
for(const [k,v] of [...m].sort((a,b)=>b[1].size-a[1].size)) console.log(v.size+'\t'+k+'\t'+[...v][0]);
