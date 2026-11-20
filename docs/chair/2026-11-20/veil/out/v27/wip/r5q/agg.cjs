const fs=require('fs');
const L=fs.readFileSync('/var/tmp/v18/m27/r5q/twin.jsonl','utf8').trim().split('\n').map(JSON.parse);
const T=JSON.parse(fs.readFileSync('/var/tmp/v18/m27/r5q/targets.json','utf8')).map(t=>t.key);
const agg={};
for(const k of T) agg[k]={townsAny:0,paths:{},fates:{}};
for(const t of L){ const seen=new Set();
  for(const h of t.hits){ const a=agg[h.key]; a.paths[h.path]=(a.paths[h.path]||0)+1; if(!seen.has(h.key)){a.townsAny++;seen.add(h.key);} }
  for(const r of t.reads){ for(const f of r.fates){ const a=agg[f.key]; const tag=`${r.kind}/dm=${r.dm}/${r.crimHidden.length?'crimHidden':'noCrimHidden'}`; a.fates[tag]=a.fates[tag]||{}; a.fates[tag][f.fate]=(a.fates[tag][f.fate]||0)+1; } } }
for(const k of T){console.log('##',k,'towns',agg[k].townsAny, JSON.stringify(agg[k].paths)); for(const [tag,v] of Object.entries(agg[k].fates)) console.log('   ',tag,JSON.stringify(v));}
// differs samples
for(const t of L) for(const r of t.reads) for(const f of r.fates) if(f.fate==='differs') console.log('DIFF',t.seed,r.kind,r.dm,f.key,'|',f.served,'|',t.hits.find(h=>h.path===f.path).text);
