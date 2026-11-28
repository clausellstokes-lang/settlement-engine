const fs=require('fs');const S=process.argv[2];
const base=new Map(fs.readFileSync('/home/user/settlement-engine/docs/chair/2026-11-27/eleventh/survey/final/record-hashes-777733a2a.tsv','utf8').trim().split('\n').slice(1).map(l=>l.split('\t')).map(([p,s,h])=>[p+':'+s,h]));
let n=0,moved=0,err=0;const dT={},dS={},hk={};const dTowns=new Set(),sTowns=new Set(),hTowns=new Set();const byCV={C:new Set(),V:new Set()};
for(const P of ['C','V'])for(const l of fs.readFileSync(S+'/out/moves-'+P+'.jsonl','utf8').trim().split('\n').map(JSON.parse)){n++;const id=P+':'+l.seed;if(l.error){err++;continue}
 if(base.get(id)!==l.recordHash)moved++;
 for(const d of l.desc){dTowns.add(id);byCV[P].add(id);const k=d.name+' | '+d.stored.slice(0,40)+' -> '+d.shown.slice(0,40);dT[k]=(dT[k]||0)+1}
 for(const d of l.descShare){sTowns.add(id);dS[d.name]=(dS[d.name]||0)+1}
 if(l.hooks.gone.length||l.hooks.came.length){hTowns.add(id);byCV[P].add(id);for(const g of l.hooks.gone)hk['gone: '+g.slice(0,60)]=(hk['gone: '+g.slice(0,60)]||0)+1;for(const g of l.hooks.came)hk['came: '+g.slice(0,60)]=(hk['came: '+g.slice(0,60)]||0)+1}}
console.log('births',n,'errors',err,'records moved',moved);
console.log('desc owner towns',dTowns.size,'share towns',sTowns.size,'hook towns',hTowns.size,'union owner',new Set([...dTowns,...hTowns]).size,'C',byCV.C.size,'V',byCV.V.size);
for(const [k,v] of Object.entries(dT).sort((a,b)=>b[1]-a[1]))console.log(' D',v,k);
for(const [k,v] of Object.entries(dS))console.log(' S',v,k);
for(const [k,v] of Object.entries(hk))console.log(' H',v,k);
fs.writeFileSync(S+'/out/moved-towns.json',JSON.stringify([...new Set([...dTowns,...hTowns])]));
