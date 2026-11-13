// topshare.mjs <tipTree> <corpusdiff.json> <dumpsDir> : for every pool the lane touched, prints per variant over the dumps (a town counts
// once per variant), and the top variant's share of the pool's prints. Pools with fewer than 30 prints are listed apart.
import fs from 'node:fs'; import path from 'node:path';
const [T,D,DIR]=process.argv.slice(2); const cd=JSON.parse(fs.readFileSync(D,'utf8'));
const touched=new Set([...cd.added,...cd.marksChanged].map(v=>`${v.block}::${v.pool}`));
const dir=`${T}/src/data/dossierStateProse`; const V=[];
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.generated.js'))){const m=await import(`${dir}/${f}`);for(const o of Object.values(m)) if(o&&typeof o==='object') for(const [b,bl] of Object.entries(o)) if(bl&&bl.pools) for(const [p,vs] of Object.entries(bl.pools)) if(touched.has(`${b}::${p}`)) for(const v of vs){const parts=v.text.split(/\{[a-zA-Z_]+\}/).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));V.push({pool:`${b}::${p}`,vid:v.vid,re:new RegExp(parts.join('.{1,80}?').replace(/\btown(?=\b|')/g,'(?:thorp|hamlet|village|town|city|metropolis)')),n:0});}}
for(const f of fs.readdirSync(DIR).filter(f=>f.endsWith('.txt'))){const t=fs.readFileSync(path.join(DIR,f),'utf8');for(const v of V) if(v.re.test(t)) v.n++;}
const pools={}; for(const v of V){(pools[v.pool]??=[]).push(v);}
const rows=Object.entries(pools).map(([p,vs])=>{const tot=vs.reduce((a,v)=>a+v.n,0);const top=vs.reduce((a,v)=>v.n>a.n?v:a,vs[0]);return {pool:p,lines:vs.length,prints:tot,top:top.n,topVid:top.vid,share:tot?top.n/tot:0};}).sort((a,b)=>b.share-a.share);
console.log('pools touched',rows.length,'| with >=30 prints',rows.filter(r=>r.prints>=30).length);
for(const r of rows.filter(r=>r.prints>=30).slice(0,15)) console.log(r.share.toFixed(3),r.pool,'lines',r.lines,'prints',r.prints,'top v'+r.topVid);
console.log('max share (>=30 prints):',Math.max(...rows.filter(r=>r.prints>=30).map(r=>r.share)).toFixed(3),'| above 0.75:',rows.filter(r=>r.prints>=30&&r.share>0.75).length);
fs.writeFileSync(process.argv[5]||'/dev/null',JSON.stringify(rows,null,1));
