import { createRequire } from 'node:module'; const require=createRequire(import.meta.url);
const L=require('./load.cjs')(process.argv[2]); const T=process.env.TREE;
const D=await import(T+'/src/generators/defenseGenerator.js'); const K=await import(T+'/src/domain/facts/keep.js');
for(const {seed,s} of L){const sc=s.defenseProfile.scores; if(sc.military<65||!['Vulnerable','Undefended'].includes(s.defenseProfile.readiness.label))continue;
 const parts=D.defencePartsOf(s,K.keepOfRecord(s.economicState));
 const mil=(Array.isArray(parts)?parts:parts.parts||[]).filter(p=>/military/.test(p.id||p.label||'')).map(p=>`${p.id}:${p.points??p.tenths}`).join(' ');
 console.log(seed,s.population,s.defenseProfile.readiness.score,Object.entries(s.defenseProfile.institutions||{}).filter(([k,v])=>v.length).map(([k,v])=>k+":"+v.length).join(",").slice(0,90),'::',mil.slice(0,200));}
