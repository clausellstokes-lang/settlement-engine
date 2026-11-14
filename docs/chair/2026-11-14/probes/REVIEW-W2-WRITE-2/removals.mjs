// removals.mjs <removals.json> <undoPdfDir> <tipPdfDir> <drawn-tip.json> <mounts.txt> <outDir>: for every removal (a line
// the base corpus draws in a tip town and the stage's corpus does not), up to 30 of its towns spread by size and crisis:
// the removed sentence as the base corpus prints it there (the PDF text of the tip tree with the base's corpus), and the
// paragraph the same mount prints at the tip in its place. Writes removals-<k>.json in 3 files by block family.
import fs from 'node:fs'; import path from 'node:path';
const [RM,U,T,DT,MT,O]=process.argv.slice(2); const rm=JSON.parse(fs.readFileSync(RM)); const dt=JSON.parse(fs.readFileSync(DT));
const mounts=fs.readFileSync(MT,'utf8').trim().split('\n').map(l=>l.split(' '));
const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function head(t){ const re=/[,;:—]/g; let m; while((m=re.exec(t))){ if(t.slice(0,m.index).replace(/\{[a-zA-Z_]+\}/g,'').length>=12) return t.slice(0,m.index); } return t.replace(/[.]$/,''); }
function rx(body){ let src=''; const re=/\{([a-zA-Z_]+)\}('s)?/g; let last=0,m; while((m=re.exec(body))){ src+=esc(body.slice(last,m.index)); src+= m[2]?"(?:[^.]{1,80}?'s|[Ii]ts)":'[^.]{1,80}?'; last=re.lastIndex; } src+=esc(body.slice(last));
  return new RegExp('[^.]*'+src.replace(/\b(?:thorp|hamlet|village|town|city|metropolis)(?=\b|')/g,'(?:thorp|hamlet|village|town|city|metropolis)')+'[^.]*\\.?'); }
const para=(dir,town,mount)=>{ const L=fs.readFileSync(path.join(dir,town+'.txt'),'utf8').split('\n'); const tab=mount.split('.')[0]; const i=L.indexOf(`== pdf/${tab}/${mount} ==`); return i>=0?L[i+1]:null; };
const files={1:[],2:[],3:[]};
for(const r of rm){ const block=r.id.split('::')[0]; const ms=mounts.filter(m=>m[0]===block).map(m=>m[1]); const re=rx(head(r.text));
  const order=[...r.removed].sort((a,b)=>(dt[a].tier+dt[a].stress.join()).localeCompare(dt[b].tier+dt[b].stress.join()));
  const step=Math.max(1,order.length/30); const pick=[]; for(let k=0;k<order.length&&pick.length<30;k+=step) pick.push(order[Math.floor(k)]);
  const towns=pick.map(t=>{ let removed=null, mount=null; for(const m of ms){ const p=para(U,t,m); const mm=p&&p.match(re); if(mm){ removed=mm[0].trim(); mount=m; break; } }
    return {town:t,tier:dt[t].tier,stress:dt[t].stress,mount,removedSentence:removed,baseParagraph:mount?para(U,t,mount):null,tipParagraph:mount?para(T,t,mount):null}; });
  const k=block.startsWith('DS-DEF')?1:block.startsWith('DS-ECO')||block.startsWith('DS-SUP')?2:3;
  files[k].push({id:r.id,kind:r.kind,text:r.text,removedFrom:r.removed.length,read:towns}); }
for(const k of [1,2,3]) fs.writeFileSync(path.join(O,`removals-${k}.json`),JSON.stringify(files[k],null,1));
console.log(Object.entries(files).map(([k,v])=>`file ${k}: ${v.length} removals, ${v.reduce((a,x)=>a+x.read.length,0)} reads, unfound ${v.reduce((a,x)=>a+x.read.filter(r=>!r.removedSentence).length,0)}`).join(' | '));
