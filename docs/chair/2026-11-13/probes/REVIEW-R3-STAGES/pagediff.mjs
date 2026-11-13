// pagediff.mjs <base dump> <tip dump>: page lines the tip prints that the base does not (with tab), and the reverse
import fs from 'node:fs';
const rd=(f)=>{ const out=[]; let tab=''; for(const l of fs.readFileSync(f,'utf8').split('\n')){ if(l.startsWith('== ')){tab=l.replace(/==/g,'').trim(); continue;} if(l&&!l.startsWith('[STYLE]')) out.push([tab,l]); } return out; };
const A=rd(process.argv[2]), B=rd(process.argv[3]); const ka=new Set(A.map(x=>x.join('|'))), kb=new Set(B.map(x=>x.join('|')));
for(const [t,l] of A) if(!kb.has(t+'|'+l)) console.log(`  - [${t}] ${l.slice(0,260)}`);
for(const [t,l] of B) if(!ka.has(t+'|'+l)) console.log(`  + [${t}] ${l.slice(0,260)}`);
