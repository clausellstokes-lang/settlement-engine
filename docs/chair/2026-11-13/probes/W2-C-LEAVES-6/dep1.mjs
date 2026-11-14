import { load } from './load.mjs';
const T=load(process.argv[2]); const res=new Map(), pairs=new Map(); let cards=0, withDep=0;
for(const {seed,s} of T){ for(const c of s.economicState?.activeChains||[]){ cards++; if(!c.dependency) continue; withDep++;
 const k=c.dependency.resource; res.set(k,(res.get(k)||0)+1);
 const p=c.chainId+' <= '+c.dependency.institution+' ['+c.processingInstitutions.join('|')+'] svcs='+c.dependency.affectedServices.join(', ');
 pairs.set(p,(pairs.get(p)||0)+1);} }
console.log({cards,withDep}); console.log([...res].sort((a,b)=>b[1]-a[1]));
console.log([...pairs].sort((a,b)=>b[1]-a[1]).map(([p,n])=>n+' '+p).join('\n'));
