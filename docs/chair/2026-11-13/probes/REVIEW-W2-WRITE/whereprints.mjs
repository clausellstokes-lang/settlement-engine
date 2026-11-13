// whereprints.mjs <corpusdiff.json> <out.json> <dumpsDir>... : for every added (new or reworded) or marks-changed variant,
// the towns and views where it prints at the tip, with the printed sentence. Slots folded to .{1,80}?, tier nouns folded.
import fs from 'node:fs'; import path from 'node:path';
const [D,O,...dirs]=process.argv.slice(2); const cd=JSON.parse(fs.readFileSync(D,'utf8'));
const rx=t=>{const parts=t.split(/\{[a-zA-Z_]+\}/).map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));return new RegExp(parts.join('.{1,80}?').replace(/\btown(?=\b|')/g,'(?:thorp|hamlet|village|town|city|metropolis)'));};
const items=[...cd.added.map(v=>({...v,kind:v.rewordOf?'reworded':'new'})),...cd.marksChanged.map(v=>({...v,kind:'marks'}))];
for(const it of items){it.re=rx(it.text);it.prints=[];}
for(const dir of dirs) for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.txt'))){
  const town=f.replace(/\.txt$/,''); let view='?';
  for(const l of fs.readFileSync(path.join(dir,f),'utf8').split('\n')){ const h=l.match(/^== (.*) ==/); if(h){view=h[1];continue;}
    for(const it of items){ const m=l.match(it.re); if(m && !it.prints.some(p=>p.town===town&&p.view===view)) it.prints.push({dir:path.basename(path.dirname(dir)),town,view,printed:m[0]}); } } }
for(const it of items) delete it.re;
fs.writeFileSync(O,JSON.stringify(items,null,1));
const c=k=>items.filter(i=>i.kind===k); for(const k of ['new','reworded','marks']) console.log(k,c(k).length,'printing',c(k).filter(i=>i.prints.length).length,'prints',c(k).reduce((a,i)=>a+i.prints.length,0));
