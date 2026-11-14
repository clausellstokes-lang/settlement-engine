import { load } from './load.mjs';
const R=process.env.TREE+'/src';
const sc = await import(R+'/data/supplyChainData.js');
const all=[]; const walk=(v)=>{ if(Array.isArray(v)) v.forEach(walk); else if(v&&typeof v==='object'){ if(typeof v.id==='string'&&Array.isArray(v.processingInstitutions)) all.push(v); else Object.values(v).forEach(walk);} };
walk(Object.values(sc)); const byId=new Map(all.map(c=>[c.id,c]));
const STOP=new Set(['and','of','the','goods','service','services','trade','fine','basic','high','level','commission','supplies','a','for','to','in']);
const W=(xs)=>new Set(xs.join(' ').toLowerCase().replace(/\([^)]*\)/g,' ').split(/[^a-z]+/).filter(w=>w&&!STOP.has(w)).map(w=>w.length>3&&/[^su]s$/.test(w)?w.slice(0,-1):w));
const T=load(process.argv[2]); const seen=new Map();
for(const {s} of T) for(const c of s.economicState?.activeChains||[]){ if(!c.dependency) continue; const d=byId.get(c.chainId)||{};
 const cw=W([c.label||'',...(c.outputs||[]),...(d.services||[]),...(d.intermediateGoods||[]),...(d.rawInputs||[]),d.resource||'']);
 const sw=W(c.dependency.affectedServices||[]); const nw=W([c.dependency.resource||'']);
 const ov=[...sw].filter(w=>cw.has(w)), ovn=[...nw].filter(w=>cw.has(w));
 const k=`${c.chainId} <= ${c.dependency.institution} :: svc∩=${ov.join(',')} need∩=${ovn.join(',')} || chain=${[...cw].join(',')} || svcs=${[...sw].join(',')}`; seen.set(k,(seen.get(k)||0)+1); }
console.log(all.length, [...seen].map(([k,n])=>n+' '+k).sort().join('\n'));
