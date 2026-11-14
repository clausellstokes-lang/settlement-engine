// REVIEW-UPKEEP-CAPACITY: field diff of the stored record, base -> tip, per birth; leaf paths masked ([] for indexes).
// usage: node fielddiff.mjs <base_dir> <tip_dir> <out.json> [seedlist]
import fs from 'node:fs'; import zlib from 'node:zlib';
const [B,T,OUT,LIST]=process.argv.slice(2);
const only=LIST?new Set(fs.readFileSync(LIST,'utf8').trim().split('\n')):null;
const leaves=(o,p,acc)=>{ if(o===null||typeof o!=='object'){acc.set(p,JSON.stringify(o));return acc;}
  if(Array.isArray(o)){ if(!o.length) acc.set(p+'[]','<empty>'); o.forEach((v,i)=>leaves(v,`${p}[${i}]`,acc)); return acc;}
  const ks=Object.keys(o); if(!ks.length) acc.set(p+'{}','<empty>'); for(const k of ks) leaves(o[k],p?`${p}.${k}`:k,acc); return acc; };
const fam=(p)=>p.replace(/\[\d+\]/g,'[]');
const agg={}; const keysB=new Set(), keysT=new Set(); let n=0; const per={};
for(const f of fs.readdirSync(T).filter(f=>f.endsWith('.json.gz'))){
  const seed=f.slice(0,-8); if(only&&!only.has(seed)) continue; if(!fs.existsSync(`${B}/${f}`)) continue; n++;
  const b=leaves(JSON.parse(zlib.gunzipSync(fs.readFileSync(`${B}/${f}`))),'',new Map());
  const t=leaves(JSON.parse(zlib.gunzipSync(fs.readFileSync(`${T}/${f}`))),'',new Map());
  for(const k of b.keys()) keysB.add(fam(k)); for(const k of t.keys()) keysT.add(fam(k));
  const fams=new Set();
  for(const k of new Set([...b.keys(),...t.keys()])) if(b.get(k)!==t.get(k)) fams.add(fam(k));
  per[seed]=[...fams];
  for(const fm of fams) (agg[fm] ||= []).push(seed);
}
const top=(p)=>p.split(/[.[]/)[0];
const byTop={}; for(const [fm,ss] of Object.entries(agg)){ const t=top(fm); byTop[t] ||= new Set(); ss.forEach(s=>byTop[t].add(s)); }
const out={ births:n, familiesMoved:Object.fromEntries(Object.entries(agg).map(([k,v])=>[k,v.length]).sort((a,b)=>b[1]-a[1])),
  topMoved:Object.fromEntries(Object.entries(byTop).map(([k,v])=>[k,v.size]).sort((a,b)=>b[1]-a[1])),
  keysOnlyTip:[...keysT].filter(k=>!keysB.has(k)), keysOnlyBase:[...keysB].filter(k=>!keysT.has(k)), perSeed:per };
fs.writeFileSync(OUT, JSON.stringify(out,null,1));
console.log('births',n,'families moved',Object.keys(agg).length,'tops',JSON.stringify(out.topMoved).slice(0,1500));
console.log('keysOnlyTip',out.keysOnlyTip.length,out.keysOnlyTip.slice(0,20)); console.log('keysOnlyBase',out.keysOnlyBase.length,out.keysOnlyBase.slice(0,20));
