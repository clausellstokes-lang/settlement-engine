// plant.mjs <tree> <file> <block> <pool> <vid> <mark>: remove one mark from one variant of a generated corpus file (a
// scratch plant; the caller restores the file with git checkout in its own scratch worktree).
import fs from 'node:fs';
const [T,F,B,P,V,M]=process.argv.slice(2); const path=`${T}/src/data/dossierStateProse/${F}`; let s=fs.readFileSync(path,'utf8');
const m=await import(path+'?p='+Date.now()); const leaf=Object.values(m).find(v=>v&&typeof v==='object'); const v=leaf[B].pools[P].find(x=>x.vid===+V);
const blockAt=s.indexOf(`"${B}"`); const poolAt=s.indexOf(JSON.stringify(P),blockAt); const textAt=s.indexOf(JSON.stringify(v.text),poolAt);
const marksAt=s.lastIndexOf('"marks"',textAt); const seg=s.slice(marksAt,textAt); const nseg=seg.replace(new RegExp(',?\\s*'+JSON.stringify(M).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),'').replace('[,','[');
if(seg===nseg) throw new Error('mark not found'); s=s.slice(0,marksAt)+nseg+s.slice(textAt); fs.writeFileSync(path,s); console.log('planted: removed',M,'from',B,P,'v'+V);
