import { load } from './load.mjs';
const T=load(process.argv[2]); const pairs=new Map();
for(const {seed,s} of T){ for(const c of s.economicState?.activeChains||[]){ if(!c.dependency) continue;
 const p=c.chainId+' | need='+c.dependency.resource+' | house='+c.dependency.institution+' | chainres='+c.resource+' | in='+(c.rawInputs||[]).join('/')+' | out='+(c.outputs||[]).slice(0,4).join('/');
 pairs.set(p,(pairs.get(p)||0)+1);} }
console.log([...pairs].sort((a,b)=>a[0]<b[0]?-1:1).map(([p,n])=>n+' '+p).join('\n'));
