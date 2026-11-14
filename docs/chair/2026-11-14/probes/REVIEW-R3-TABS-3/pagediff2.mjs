// pagediff2.mjs <baseDumps> <tipDumps> <seeds>: per town, lines (with their tab) gone from base and new at tip, whole page
import fs from 'node:fs';
const [A,B,SF]=process.argv.slice(2); const seeds=fs.readFileSync(SF,'utf8').trim().split('\n');
const tabbed=(f)=>{ const m=new Map(); let tab=''; for(const l of fs.readFileSync(f,'utf8').split('\n')){ if(l.startsWith('== ')){tab=l;continue;} const k=tab+' :: '+l; m.set(k,(m.get(k)||0)+1);} return m; };
const c={}; const out=[];
for(const s of seeds){ const a=tabbed(`${A}/${s}.txt`), b=tabbed(`${B}/${s}.txt`);
  for(const [k,n] of a) if((b.get(k)||0)<n){ out.push(['GONE',s,k].join('\t')); const t=k.split(' :: ')[0]; c['GONE '+t]=(c['GONE '+t]||0)+1; }
  for(const [k,n] of b) if((a.get(k)||0)<n){ out.push(['NEW',s,k].join('\t')); const t=k.split(' :: ')[0]; c['NEW '+t]=(c['NEW '+t]||0)+1; } }
console.log(c); fs.writeFileSync('pagediff.tsv',out.join('\n')+'\n');
