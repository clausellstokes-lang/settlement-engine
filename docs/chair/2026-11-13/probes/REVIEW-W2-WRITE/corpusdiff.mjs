// corpusdiff.mjs <baseTree> <tipTree> <out.json>: every prose-corpus variant, base vs tip, matched by block+pool+text.
import fs from 'node:fs';
const [B,T,O]=process.argv.slice(2);
async function load(tree){ const dir=`${tree}/src/data/dossierStateProse`; const out=[];
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.generated.js'))){ const m=await import(`${dir}/${f}?t=${tree.length}`);
    for(const obj of Object.values(m)) if(obj&&typeof obj==='object') for(const [block,b] of Object.entries(obj)) if(b&&b.pools) for(const [pool,vs] of Object.entries(b.pools)) for(const v of vs) out.push({file:f,block,pool,vid:v.vid,angle:v.angle,marks:v.marks||[],text:v.text,audience:v.audience});}
  return out; }
const base=await load(B), tip=await load(T);
const key=v=>`${v.block}::${v.pool}::${v.text}`;
const bm=new Map(base.map(v=>[key(v),v])), tm=new Map(tip.map(v=>[key(v),v]));
const res={added:[],removed:[],marksChanged:[]};
for(const v of tip){const b=bm.get(key(v)); if(!b) res.added.push(v); else if(JSON.stringify(b.marks)!==JSON.stringify(v.marks)) res.marksChanged.push({...v,baseMarks:b.marks});}
for(const v of base){ if(!tm.has(key(v))) res.removed.push(v); }
// pair a removed variant with an added one in the same pool and vid as a "reworded"
for(const a of res.added){ const r=res.removed.find(x=>x.block===a.block&&x.pool===a.pool&&x.vid===a.vid); if(r){a.rewordOf=r.text; a.baseMarks=r.marks; r.rewordedTo=a.text;} }
fs.writeFileSync(O,JSON.stringify(res,null,1));
console.log('base variants',base.length,'tip',tip.length,'| added',res.added.length,'(rewordings',res.added.filter(a=>a.rewordOf).length,') removed',res.removed.length,'(of which reworded',res.removed.filter(r=>r.rewordedTo).length,') marks changed only',res.marksChanged.length);
