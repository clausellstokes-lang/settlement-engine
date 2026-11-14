import * as L from './lib.mjs'; import {CHECKS} from './checks.mjs';
const only=process.argv[2]!==undefined?+process.argv[2]:null; const out={};
L.LINES.forEach((l,i)=>{ if(only!==null&&i!==only) return; const c=CHECKS[i]; let t=0,fl=[];
 for(const p of l.prints){ const f=L.facts(p.town); const ok=c.fn(f,L.page(p.town)); if(ok) t++; else fl.push(p.town);} out[i]={tests:c.tests,true:t,false:fl.length,falseTowns:fl};
 console.log(i,l.id.replace('DS-DEF-2::',''),'true',t,'false',fl.length,fl.join(','));});
import fs from 'fs'; if(only===null) fs.writeFileSync('script-results.json',JSON.stringify(out,null,1));
