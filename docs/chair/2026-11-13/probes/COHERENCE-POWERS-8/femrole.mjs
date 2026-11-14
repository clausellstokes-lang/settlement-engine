// femrole.mjs <corpus> <dumpsDir>: every rendered line (any view) that names a woman whose role is "the lord", "the abbot" or
// "the senior abbot" and carries that masculine role word on the same line, counted by view.
import fs from 'node:fs'; import { recs } from './rd.mjs';
const [C,D]=process.argv.slice(2); const byView={}; const ex=[]; let towns=0;
for await (const {seed,s} of recs(C)) { const f=`${D}/${seed}.txt`; if(!fs.existsSync(f)) continue; towns++;
  const women=(s.npcs||[]).filter(c=>c.gender==='female'&&/^the (lord|abbot|senior abbot)$/.test(c.role)); if(!women.length) continue;
  let view=''; for (const line of fs.readFileSync(f,'utf8').split('\n')) { const m=line.match(/^== (.+?) ==/); if(m){view=m[1];continue;}
    for (const w of women) if (line.includes(w.name) && new RegExp(`\\b${w.role}\\b(?!ess)`).test(line)) { byView[view]=(byView[view]||0)+1; if(ex.length<8) ex.push(`${seed} [${view}] ${line.slice(0,160)}`); } } }
console.log(JSON.stringify({towns,byView,ex},null,1));
